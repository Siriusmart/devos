class Board {
    // rows, columns: number
    // rules: number[]
    constructor(rows, columns, rules) {
        if (rows == undefined) return;

        if (rules.length != rows + columns)
            throw new Error(
                `Assert rules.length (${rules.length}) == rows + columns (${rows + columns}) failed.`,
            );

        this.rows = rules.slice(0, rows);
        this.columns = rules.slice(rows, rows + columns);

        this.state = [];
        for (let y = 0; y < this.rows.length; y++) {
            let row = [];
            for (let x = 0; x < this.columns.length; x++) {
                row.push(null);
            }
            this.state.push(row);
        }
    }

    display() {
        const padding = 10;
        const cellSize = 30;

        let rowsMaxChunks = Math.max(
            1,
            ...this.rows.map((rules) => rules.length),
        );
        let columnsMaxChunks = Math.max(
            1,
            ...this.columns.map((rules) => rules.length),
        );

        let requiredHeight = columnsMaxChunks + this.rows.length;
        let requiredWidth = rowsMaxChunks + this.columns.length;

        let canvas = document.getElementById("board");
        let ctx = canvas.getContext("2d");
        ctx.canvas.width = requiredWidth * cellSize + 2 * padding;
        ctx.canvas.height = requiredHeight * cellSize + 2 * padding;

        // draw grid
        for (let y = 0; y <= requiredHeight; y++) {
            if (y < columnsMaxChunks && y != 0) continue;
            ctx.beginPath();
            ctx.moveTo(
                (y == 0 ? rowsMaxChunks * cellSize : 0) + padding,
                y * cellSize + padding,
            );
            ctx.lineTo(
                requiredWidth * cellSize + padding,
                y * cellSize + padding,
            );
            ctx.stroke();
        }

        for (let x = 0; x <= requiredWidth; x++) {
            if (x < rowsMaxChunks && x != 0) continue;
            ctx.beginPath();
            ctx.moveTo(
                x * cellSize + padding,
                (x == 0 ? columnsMaxChunks * cellSize : 0) + padding,
            );
            ctx.lineTo(
                x * cellSize + padding,
                requiredHeight * cellSize + padding,
            );
            ctx.stroke();
        }

        ctx.font = `${cellSize / 2}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // draw rules
        for (let y = 0; y < this.rows.length; y++) {
            let rule = this.rows[y];
            if (rule.length == 0) rule = [0];
            for (let mx = 0; mx < rule.length; mx++) {
                ctx.fillText(
                    rule[rule.length - mx - 1],
                    (rowsMaxChunks - 0.5 - mx) * cellSize + padding,
                    (y + columnsMaxChunks + 0.5) * cellSize + padding,
                );
            }
        }

        for (let x = 0; x < this.columns.length; x++) {
            let rule = this.columns[x];
            if (rule.length == 0) rule = [0];
            for (let my = 0; my < rule.length; my++) {
                ctx.fillText(
                    rule[rule.length - my - 1],
                    (x + rowsMaxChunks + 0.5) * cellSize + padding,
                    (columnsMaxChunks - 0.5 - my) * cellSize + padding,
                );
            }
        }

        // draw cells
        for (let y = 0; y < this.state.length; y++) {
            for (let x = 0; x < this.state[y].length; x++) {
                switch (this.state[y][x]) {
                    case true:
                        ctx.fillRect(
                            padding + (rowsMaxChunks + 0.1 + x) * cellSize,
                            padding + (columnsMaxChunks + 0.1 + y) * cellSize,
                            cellSize * 0.8,
                            cellSize * 0.8,
                        );
                        break;
                    case false:
                        ctx.font = `${cellSize / 4}px sans-serif`;
                        ctx.fillText(
                            "❌",
                            padding + (rowsMaxChunks + 0.5 + x) * cellSize,
                            padding + (columnsMaxChunks + 0.5 + y) * cellSize,
                        );
                        break;
                    case null:
                    default: {
                    }
                }
            }
        }
    }

    blacken(x, y) {
        if (y >= this.state.length && x >= this.state[y].length)
            throw new Error(
                `Out of bounds: trying to access (${x},${y}) in a ${this.columns.length}x${this.rows.length} board.`,
            );

        let newBoard = this.clone();
        newBoard.state[y][x] = true;
        return newBoard;
    }

    mark(x, y) {
        if (y >= this.state.length && x >= this.state[y].length)
            throw new Error(
                `Out of bounds: trying to access (${x},${y}) in a ${this.columns.length}x${this.rows.length} board.`,
            );

        let newBoard = this.clone();
        newBoard.state[y][x] = false;
        return newBoard;
    }

    setRowConflict(y, row) {
        let boardRow = this.row(y);
        return row.some(
            (val, x) =>
                boardRow[x] != null && row[x] != null && boardRow[x] != val,
        );
    }

    setColumnConflict(x, column) {
        let boardColumn = this.column(x);
        return column.some(
            (val, y) =>
                boardColumn[y] != null &&
                column[y] != null &&
                boardColumn[y] != val,
        );
    }

    rowRule(y) {
        return this.rows[y];
    }

    columnRule(x) {
        return this.columns[x];
    }

    row(y) {
        return this.state[y];
    }

    column(x) {
        return this.state.map((row) => row[x]);
    }

    width() {
        return this.state[0].length;
    }

    height() {
        return this.state.length;
    }

    setRow(y, row) {
        let board = this;
        row.forEach((val, x) => {
            switch (val) {
                case true:
                    board = board.blacken(x, y);
                    break;
                case false:
                    board = board.mark(x, y);
                case null:
                default: {
                }
            }
        });
        return board;
    }

    setColumn(x, column) {
        let board = this;
        column.forEach((val, y) => {
            switch (val) {
                case true:
                    board = board.blacken(x, y);
                    break;
                case false:
                    board = board.mark(x, y);
                case null:
                default: {
                }
            }
        });
        return board;
    }

    clone() {
        let newBoard = new Board();
        newBoard.state = structuredClone(this.state);
        newBoard.rows = this.rows;
        newBoard.columns = this.columns;

        return newBoard;
    }
}
