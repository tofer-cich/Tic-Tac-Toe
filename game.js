//Objects: Gameboard, players, gameFlow.

//Use IIFE's for gameboard and other elements that only need a single instance

//Factory functions for players
// Player gets a turn function where they decide where to put their mark

//store the gameboard as an array inside gameboard IIFE

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
        if (gameBoard[row][column] != 0) return;
        gameBoard[row][column] = player;
    }

    const printBoard = () => {
        const boardWithValues = gameBoard.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithValues);
    }

    return {gameBoard, addMark, printBoard};
})();

function createPlayer(name) {
    return {name};
}

function cell() {
    let value = 0;

    const addMark = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {addMark, getValue};
}

function gameController(playerOne = "Player One", playerTwo = "Player Two") {

    const players = [
        {
            name: playerOne,
            token: 1
        },
        {
            name:playerTwo,
            token:2
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

    const playRound = (row, column) => {
        board.addMark(row, column, getActivePlayer().token);

        //Check winning conditions

        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();

    return {playRound, getActivePlayer};
}

const game = gameController();