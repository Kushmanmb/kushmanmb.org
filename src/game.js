(function (root, factory) {
  const exports = factory(root);

  if (typeof module === "object" && module.exports) {
    module.exports = exports;
  }

  if (root) {
    root.Fleeing59Game = exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  const defaultBonusColumns = {
    left: 0,
    middle: [1, 2, 3],
    right: 4
  };

  function checkBonusTrigger(board, bonusColumns = defaultBonusColumns) {
    let prisonerOnLeft = false;
    let robberOnRight = false;
    let copInMiddle = false;

    for (let i = 0; i < board.length; i++) {
      const row = board[i];

      if (row[bonusColumns.left] === "PRISONER") prisonerOnLeft = true;
      if (row[bonusColumns.right] === "ROBBER") robberOnRight = true;

      for (let j = 0; j < bonusColumns.middle.length; j++) {
        if (row[bonusColumns.middle[j]] === "COP") {
          copInMiddle = true;
          break;
        }
      }

      if (prisonerOnLeft && robberOnRight && copInMiddle) {
        return true;
      }
    }

    return prisonerOnLeft && robberOnRight && copInMiddle;
  }

  function createGame() {
    if (!root || !root.document) {
      return null;
    }

    const symbolsModule = root.Fleeing59Symbols;
    const paylinesModule = root.Fleeing59Paylines;
    const reelsModule = root.Fleeing59Reels;

    if (!symbolsModule || !paylinesModule || !reelsModule) {
      const statusElement = document.getElementById("status");

      if (statusElement) {
        statusElement.textContent = "Game failed to load required modules.";
      }

      return null;
    }

    const { SYMBOL_KEYS } = symbolsModule;
    const { BONUS_COLUMNS } = paylinesModule;
    const { generateBoard, renderBoard } = reelsModule;

    const rows = 6;
    const cols = 5;
    let board = [];
    const cellElements = [];
    let isSpinning = false;

    const grid = document.getElementById("slot-grid");
    const statusElement = document.getElementById("status");
    const spinButton = document.getElementById("spin-btn");
    const siren = new Audio("siren.mp3");
    const [middleColumnA, middleColumnB, middleColumnC] = BONUS_COLUMNS.middle;

    function highlightBonusSymbols() {
      for (let index = 0; index < cellElements.length; index++) {
        const cell = cellElements[index];
        const col = index % cols;
        const text = cell.dataset.symbol;
        const isBonusColumn =
          col === middleColumnA ||
          col === middleColumnB ||
          col === middleColumnC;

        if (
          (col === BONUS_COLUMNS.left && text === "PRISONER") ||
          (col === BONUS_COLUMNS.right && text === "ROBBER") ||
          (isBonusColumn && text === "COP")
        ) {
          cell.classList.add("highlight");
        }
      }
    }

    function spin() {
      if (isSpinning) return;
      isSpinning = true;

      board = generateBoard(rows, cols, SYMBOL_KEYS);
      renderBoard(board, grid, cellElements);

      if (checkBonusTrigger(board, BONUS_COLUMNS)) {
        statusElement.textContent = "🚨 BONUS TRIGGERED!";
        highlightBonusSymbols();
        siren.currentTime = 0;
        siren.play();
      } else {
        statusElement.textContent = "No bonus this spin.";
      }

      isSpinning = false;
    }

    spinButton.addEventListener("click", spin);

    return {
      spin,
      checkBonusTrigger: (nextBoard) => checkBonusTrigger(nextBoard, BONUS_COLUMNS)
    };
  }

  let gameInstance = null;

  if (root && root.document) {
    const init = () => {
      gameInstance = createGame();
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
      init();
    }
  }

  return {
    checkBonusTrigger,
    createGame,
    get game() {
      return gameInstance;
    }
  };
});
