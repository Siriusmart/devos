async function start() {
    let definition = document
        .getElementById("definition")
        .value.split("\n")
        .map((line) =>
            line
                .split(" ")
                .filter((s) => s.length != 0)
                .map((s) => parseInt(s)),
        );

    window.stepDelay = document.getElementById("delay").value;

    document.getElementById("setup").setAttribute("hidden", true);
    document.getElementById("board").removeAttribute("hidden");

    try {
        let board = new Board(
            definition[0][0],
            definition[0][1],
            definition.slice(1),
        );
        board = await solve(board);

        if (board == null) alert("Failed to solved the board.");
        else board.display();
    } catch (e) {
        alert(e);
    }
}

document.getElementById("definition").value = `20 20
8
3 2
5 8
2 4 3
2 4 2
2 3 8
1 2 3
2 2 3
2 2 3
6 3
4 2
4 3 2
4 2 1
5 1 2 1
5 1 2 1
5 1 1 1
5 1 1 1
4 2 2 2
3 1 4 3
20
3 10
2 2 10
2 12
2 9 1
1 1 4 1
1 2 1 3
1 2 1 5 1
2 1 1 1
1 1 1 2
2 1 1 6
1 1 1 1 2 3
1 2 3 2 2
1 1 2 2 1
1 1 4 1 1
1 1 2 1 1 1
1 1 2 2 1
3 2 1 1
3 1 2 2
3 3 3
2 11`;
