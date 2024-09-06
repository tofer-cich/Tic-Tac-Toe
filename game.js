const board = (function () {
    let gameBoard = [];
    const rows = 3;
    const columns = 3;

    

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

    const resetBoard = () => {
        for (let i = 0; i < rows; i++) {
            gameBoard[i] = [];
            for (let j = 0; j < columns; j++) {
                gameBoard[i].push(cell());
            }
        }
    }

    resetBoard();

    return { gameBoard, addMark, getSpacesLeft, printBoard, resetBoard };
})();

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
            name: prompt("Your name: "),
            token: 1,
            moves: []
        },
        {
            name: prompt("Your name: "),
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
        const currentPlayerToken = getActivePlayer().token;
        let validMove = board.addMark(row, column, currentPlayerToken);

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

    const getWinner = () => winner;
    const isDraw = () => draw;

    printNewRound();

    let winner;
    let draw = false;

    const resetGame = () => {
        players[0].moves = [];
        players[1].moves = [];
        winner = undefined;
        draw = false;
    }

    return { playRound, getActivePlayer, checkWinner, board, getWinner, resetGame, isDraw };
}

function screenController() {
    const game = gameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const restartButton = document.querySelector('#restart');

    restartButton.addEventListener("click", () => {
        game.resetGame();
        board.resetBoard();
        updateScreen();
    });

    const updateScreen = () => {
        boardDiv.textContent = "";

        const gameBoard = board.gameBoard;
        const activePlayer = game.getActivePlayer();

        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

        let winner = game.getWinner();
        let draw = game.isDraw();

        console.log(winner);

        if (winner) {
            playerTurnDiv.textContent = `${winner} has won the game!`;
        } else if (game.isDraw()) {
            playerTurnDiv.textContent = "Looks like it's a draw.."
        }


        gameBoard.forEach((row, indexR) => {
            row.forEach((cell, indexC) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");

                cellButton.dataset.row = indexR;
                cellButton.dataset.column = indexC;
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        })
    }

    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        if (!selectedRow || !selectedColumn) return;

        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    }
    boardDiv.addEventListener("click", clickHandlerBoard);

    updateScreen();
}

screenController();
