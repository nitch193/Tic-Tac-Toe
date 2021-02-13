const gameBoard = document.querySelector("#game-board");
const message = document.querySelector(".message");
const restartButton = document.getElementById("restartButton");
const combinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const Player = (name, played, marked) => {
  played = true;
  marked = [];
  return { name, played, marked };
};
const player1 = Player("Player - X", true, []);
const player2 = Player("Player - O", true, []);
function game() {
  GameBoard.removeBoard();
  GameBoard.drawBoard();
}

const GameBoard = (() => {
  const drawBoard = () => {
    for (let i = 0; i < 9; i++) {
      let cell = document.createElement("div");
      cell.classList.add("cell");
      gameBoard.appendChild(cell);
      cell.addEventListener("click", clickhandler, { once: true });
    }
  };
  const removeBoard = () => {
    while (gameBoard.firstChild) {
      gameBoard.firstChild.remove();
    }
  };
  return { drawBoard, removeBoard };
})();

function clickhandler(e) {
  let total = 0;
  let i = Array.from(e.target.parentNode.children).indexOf(e.target);
  if (player1.played) {
    e.target.classList.add("clicked");
    e.target.textContent = "X";
    player1.marked.push(i);
    player1.played = false;
    player2.played = true;
  } else if (player2.played) {
    player2.marked.push(i);
    e.target.classList.add("clicked");
    e.target.textContent = "O";
    player2.played = false;
    player1.played = true;
  }
  e.target.parentNode.childNodes.forEach((child) => {
    if (child.classList.length >= 2) {
      total++;
    }
  });
  let result = gameResult(player1.marked, player2.marked, combinations);
  whowins(result, total);
}

function gameResult(marked1, marked2, combinations) {
  let result = 0;
  let combination1 = generateCombinations(marked1, 3);
  let combination2 = generateCombinations(marked2, 3);
  if (combination1.length || combination2.length) {
    for (let i = 0; i < combination1.length; i++) {
      combinations.forEach((arr) => {
        if (combination1[i].every((val) => arr.includes(val))) {
          result = 1;
        }
      });
    }
    for (let i = 0; i < combination2.length; i++) {
      combinations.forEach((arr) => {
        if (combination2[i].every((val) => arr.includes(val))) {
          result = 2;
        }
      });
    }
  }
  return result;
}

function generateCombinations(sourceArray, comboLength) {
  const sourceLength = sourceArray.length;
  if (comboLength > sourceLength) return [];
  const combos = [];
  const makeNextCombos = (workingCombo, currentIndex, remainingCount) => {
    const oneAwayFromComboLength = remainingCount == 1;
    for (
      let sourceIndex = currentIndex;
      sourceIndex < sourceLength;
      sourceIndex++
    ) {
      const next = [...workingCombo, sourceArray[sourceIndex]];

      if (oneAwayFromComboLength) {
        combos.push(next);
      } else {
        makeNextCombos(next, sourceIndex + 1, remainingCount - 1);
      }
    }
  };
  makeNextCombos([], 0, comboLength);
  return combos;
}

function resetGame() {
  message.classList.add("result-meessage");
  restartButton.addEventListener("click", () => {
    message.classList.remove("result-meessage");
    game();
    player1.played = true;
    player2.played = true;
    player2.marked = [];
    player1.marked = [];
  });
  message.firstElementChild.textContent = "";
}

function whowins(result, total) {
  if (result == 1) {
    resetGame();
    message.firstElementChild.textContent = "Player X Wins";
  } else if (result == 2) {
    resetGame();
    message.firstElementChild.textContent = "Player O Wins";
  } else if (total === 9 && result === 0) {
    resetGame();
    message.firstElementChild.textContent = "Game Tied";
  }
}
game();
