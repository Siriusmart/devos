function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
