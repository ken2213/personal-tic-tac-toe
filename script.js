"use strict"

const Player = (sign) => {
  this.sign = sign;

  const getSign = () => {
    return sign;
  };

  return { getSign };
};



const gameBoard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];

  const setField = (index, sign) => {
    if (index > board.length) return;
    board[index] = sign;
  };

  const getField = (index) => {
    if (index > board.length) return;
    return board[index];
  };

  const reset = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  };

  return { setField, getField, reset };
})();



const displayController = (() => {
  const fieldElements = document.querySelectorAll(".field");
  const messageElement = document.getElementById("messageElement");
  const restartButton = document.getElementById("restart-button");

  fieldElements.forEach((field) =>
    // A field with Event Handler and within it, is another
    // event handler that handles the restart button...

    // I used this technique so that I can call the "field" parameter
    // to help me remove the class when restart button is clicked...
    field.addEventListener("click", (e) => 
      {
        if (gameController.getIsOver() || e.target.textContent !== "") return;
        gameController.playRound(parseInt(e.target.dataset.index));
        updateGameBoard();      
        colorizeField(field);
      },

      restartButton.addEventListener("click", () => {
          // Removes the class styling when restart button is clicked
          field.classList.remove('player-x');
          field.classList.remove('player-o');
          // Resets the Game Board
          gameBoard.reset();
          gameController.reset();
          updateGameBoard();
          setMessageElement("Player X's turn");
        }
      )
    )
  );

  // Adds a styled "class" on selected field
  const colorizeField = (field) => {
    if (field.textContent == 'X') {
      field.classList.toggle('player-x');
    } else if (field.textContent == 'O') {
      field.classList.toggle('player-o');
    }
    else {
      return;
    }
  }

  const updateGameBoard = () => {
    for (let i = 0; i < fieldElements.length; i++) {
      fieldElements[i].textContent = gameBoard.getField(i);
    }
  };

  const setResultMessage = (winner) => {
    if (winner === "Draw") {
      setMessageElement("It's a draw!");
    } else {
      setMessageElement(`Player ${winner} has won!`);
      start();
      stop();
    }
  };

  // start confetti celebration
  const start = () => {
    setTimeout(function() {
      confetti.start()
    }, 500); // 1000 is time that after 1 second start the confetti ( 1000 = 1 sec)
  };

  //  Stop confetti celebration
  const stop = () => {
    setTimeout(function() {
      confetti.stop()
    }, 5000); // 5000 is time that after 5 second stop the confetti ( 5000 = 5 sec)
  };

  // Creates a message whether it's Player X or O turn
  const setMessageElement = (message) => {
    messageElement.textContent = message;
  };

  return { setResultMessage, setMessageElement };
})();



const gameController = (() => {
  const playerX = Player("X");
  const playerO = Player("O");
  let round = 1;
  let isOver = false;

  const playRound = (fieldIndex) => {
    gameBoard.setField(fieldIndex, getCurrentPlayerSign());

    if (checkWinner(fieldIndex)) {
      displayController.setResultMessage(getCurrentPlayerSign());
      isOver = true;

      return;
    }
    if (round === 9) {
      displayController.setResultMessage("Draw");
      isOver = true;
      return;
    }

    round++;
    displayController.setMessageElement(
      `Player ${getCurrentPlayerSign()}'s turn`
    );
  };

  const getCurrentPlayerSign = () => {
    return round % 2 === 1 ? playerX.getSign() : playerO.getSign();
  };

  const checkWinner = (fieldIndex) => {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winConditions
      .filter((combination) => combination.includes(fieldIndex))
      .some((possibleCombination) => 
        possibleCombination.every(
          (index) => gameBoard.getField(index) === getCurrentPlayerSign()
        )
      );
  };

  const getIsOver = () => {
    return isOver;
  }

  const reset = () => {
    round = 1;
    isOver = false;

  };

  return { playRound, getIsOver, reset, getCurrentPlayerSign };
})();

