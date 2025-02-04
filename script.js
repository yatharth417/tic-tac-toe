const Gameboard = (function () {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    const placeMarker = (index, marker) => {
        if (board[index] === "") {
            board[index] = marker;
            return true;
        }
        return false;
    };

    const checkWinner = () => {
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (const combo of winningCombos) {
            const [a, b, c] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }

        if (!board.includes("")) {
            return "Tie";
        }

        return null;
    };

    return { getBoard, placeMarker, checkWinner, resetBoard };
})();

const Player = (name, marker) => {
    return { name, marker };
};

const GameController = (function () {
    let player1, player2, currentPlayer;

    const startGame = (name1, name2) => {
        player1 = Player(name1, "X");
        player2 = Player(name2, "O");
        currentPlayer = player1;
        Gameboard.resetBoard();
        DisplayController.updateBoard();
        DisplayController.setMessage(`${currentPlayer.name}'s turn`);
    };

    const switchTurn = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        DisplayController.setMessage(`${currentPlayer.name}'s turn`);
    };

    const playRound = (index) => {
        if (Gameboard.placeMarker(index, currentPlayer.marker)) {
            DisplayController.updateBoard();
            let winner = Gameboard.checkWinner();
            if (winner) {
                if (winner === "Tie") {
                    DisplayController.setMessage("It's a tie!");
                } else {
                    DisplayController.setMessage(`${currentPlayer.name} wins!`);
                }
                return;
            }
            switchTurn();
        }
    };

    return { startGame, playRound };
})();

const DisplayController = (function () {
    const boardElement = document.getElementById("gameboard");
    const messageElement = document.getElementById("message");
    const restartButton = document.getElementById("restart");

    const updateBoard = () => {
        boardElement.innerHTML = "";
        Gameboard.getBoard().forEach((cell, index) => {
            const cellElement = document.createElement("div");
            cellElement.classList.add("cell");
            cellElement.textContent = cell;
            cellElement.addEventListener("click", () => GameController.playRound(index));
            boardElement.appendChild(cellElement);
        });
    };

    const setMessage = (message) => {
        messageElement.textContent = message;
    };

    restartButton.addEventListener("click", () => {
        GameController.startGame("Player 1", "Player 2");
    });

    return { updateBoard, setMessage };
})();

document.addEventListener("DOMContentLoaded", () => {
    GameController.startGame("Player 1", "Player 2");
});
