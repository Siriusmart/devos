function ruleFromCells(cells) {
    let previous = false;
    let ruleFromCells = [];
    cells.forEach((val) => {
        if (val) {
            if (previous == false) ruleFromCells.push(0);
            ruleFromCells[ruleFromCells.length - 1] += 1;
        }
        previous = val;
    });

    return ruleFromCells;
}

function isValid(board) {
    for (let y = 0; y < board.height(); y++) {
        let row = board.row(y);
        if (row.some((val) => val == null)) continue;

        let rule = board.rowRule(y);
        let ruleFromRow = ruleFromCells(row);

        // if mismatch, impossible arrangment
        if (ruleFromRow > rule || ruleFromRow < rule) return false;
    }

    for (let x = 0; x < board.height(); x++) {
        let column = board.column(x);
        if (column.some((val) => val == null)) continue;

        let rule = board.columnRule(x);
        let ruleFromColumn = ruleFromCells(column);

        if (ruleFromColumn > rule || ruleFromColumn < rule) return false;
    }

    return true;
}

function searchPossibilities(rule, row) {
    // special case: length == 0 if row empty
    if (rule.length == 0) {
        if (row.some((cell) => cell == true)) {
            // impossible
            return [];
        } else {
            return [row.map((_) => false)];
        }
    }

    let arrangements = [];

    // search for where to place the chunk of rule[0]
    for (let i = 0; i <= row.length - rule[0]; i++) {
        let currentArrange = Array(i)
            .fill(false)
            .concat(Array(rule[0]).fill(true));
        let hasConflict = currentArrange.some(
            (cell, i) => row[i] != null && cell != row[i],
        );

        // impossible here
        if (hasConflict) continue;

        let subrow = row.slice(i + rule[0]);
        if (subrow.length != 0) {
            if (subrow[0] == true) continue;
            if (rule.length > 1) subrow[0] = false;
        }

        let fullRowArranges = searchPossibilities(rule.slice(1), subrow).map(
            (subArrange) => currentArrange.concat(subArrange),
        );
        arrangements = arrangements.concat(fullRowArranges);
    }

    return arrangements;
}

async function solve(board) {
    board.display();
    if (window.stepDelay != 0) await sleep(window.stepDelay);

    // check if board is completed
    if (board.state.every((row) => row.every((val) => val != null)))
        return board;

    let arrangements = [];

    // create a list of all possible placements for each row/column
    for (let y = 0; y < board.height(); y++) {
        arrangements.push(searchPossibilities(board.rowRule(y), board.row(y)));
    }

    for (let x = 0; x < board.width(); x++) {
        arrangements.push(
            searchPossibilities(board.columnRule(x), board.column(x)),
        );
    }

    // impossible
    if (arrangements.some((arrangment) => arrangment.length == 0)) return null;

    // find common values in arrangements
    let commons = arrangements.map((rows) => {
        return rows[0].map((val, i) =>
            rows.slice(1).every((row) => row[i] == val) ? val : null,
        );
    });

    // write the common values to the board
    let squaresPainted = 0;

    for (let y = 0; y < board.height(); y++) {
        if (board.setRowConflict(y, commons[y])) return null;
        commons[y].forEach((val, x) => {
            if (board.row(y)[x] == null && val != null) squaresPainted++;
        });
        board = board.setRow(y, commons[y]);
    }

    for (let x = 0; x < board.width(); x++) {
        if (board.setColumnConflict(x, commons[x + board.height()]))
            return null;
        commons[x + board.height()].forEach((val, y) => {
            if (board.column(x)[y] == null && val != null) squaresPainted++;
        });
        board = board.setColumn(x, commons[x + board.height()]);
    }

    if (squaresPainted != 0) {
        if (!isValid(board)) return null;
        return solve(board);
    }

    // if this iteration did not progress the board at all
    // start the guessing
    // find one cell that splits the space of all possibilities into roughly 2
    // equal parts
    let minDeviation = null; // [x, y, deviation]

    board.state.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell != null) return;
            let yay = 0; // arrangments where the cell is true
            let nay = 0; // arrangments where the cell is false

            arrangements[y].forEach((row) => {
                if (row[x]) yay++;
                else nay++;
            });

            let deviation = Math.abs(0.5 - yay / (yay + nay));
            if (minDeviation == null || deviation < minDeviation[2])
                minDeviation = [x, y, deviation];
        });
    });

    // either it is true or false, so colour the cell and try it out
    let possibility1 = board.blacken(minDeviation[0], minDeviation[1]);
    if (isValid(possibility1)) {
        let solved1 = solve(possibility1);
        if (solved1 != null) return solved1;
    }

    let possibility2 = board.mark(minDeviation[0], minDeviation[1]);
    return solve(possibility2);
}
