const board = (function () {
    let gameBoard = [];
    const rows = 3;
    const columns = 3;

    for (let i = 0; i < rows; i++) {
        gameBoard[i] = [];
        for (let j = 0; j < columns; j++) {
            gameBoard[i].push(cell());
        }
    }
    const addMark = (row, column, player) => {
        if ((row >= rows || column >= columns) || gameBoard[row][column].getValue() != 0) {
            return -1;
        } else {
            gameBoard[row][column].addMarkValue(player);
            return player;
        }
    }

    const getSpacesLeft = () => {
        let numLeft = rows * columns;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (gameBoard[i][j].getValue() != 0) {
                    numLeft--;
                }
            }
        }
        return numLeft;
    }

    const printBoard = () => {
        const boardWithValues = gameBoard.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithValues);
    }

    return { gameBoard, addMark, getSpacesLeft, printBoard };
})();

function createPlayer(name) {
    return { name };
}

function cell() {
    let value = 0;

    const addMarkValue = (player) => {
        value = player;
    };

    const getValue = () => value;

    return { addMarkValue, getValue };
}

function gameController(playerOne = "Player One", playerTwo = "Player Two") {

    const players = [
        {
            name: playerOne,
            token: 1,
            moves: []
        },
        {
            name: playerTwo,
            token: 2,
            moves: []
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
    }

    const checkWinner = (moves) => {
        const winningCombinations = [
            [[0, 0], [0, 1], [0, 2]],
            [[1, 0], [1, 1], [1, 2]],
            [[2, 0], [2, 1], [2, 2]],
            [[0, 0], [1, 0], [2, 0]],
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],
            [[0, 0], [1, 1], [2, 2]],
            [[0, 2], [1, 1], [2, 0]]
        ];

        const movesSet = new Set(moves.map(move => move.toString()));

        return winningCombinations.some(combination => combination.every(([row, column]) => movesSet.has([row, column].toString())));
    }

    const playRound = (row, column) => {
        let validMove = board.addMark(row, column, getActivePlayer().token);
        const currentPlayerToken = getActivePlayer().token;

        if (validMove != -1) {
            getActivePlayer().moves.push([row, column]);

            if (checkWinner(getActivePlayer().moves)) {
                winner = getActivePlayer().name;
            } else if (board.getSpacesLeft() <= 0) {
                draw = !draw;
            }

            switchPlayerTurn();
        } else {
            console.log("Can't play there");
        }

        printNewRound();
    };

    printNewRound();

    let winner;
    let draw = false;

    while (!winner && !draw) {
        let playerRow = prompt("Choose a row");
        let playerColumn = prompt("Choose a column");

        playRound(playerRow, playerColumn);
    }

    if (draw) {
        console.log("Look's like a draw");
    } else {
        console.log(winner + " won the game!");
    }

    return { playRound, getActivePlayer, checkWinner };
}

const game = gameController();