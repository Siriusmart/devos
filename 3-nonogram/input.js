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
