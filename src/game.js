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

  function findBonusRow(board, bonusColumns = defaultBonusColumns) {
    const middleColumns = bonusColumns.middle;

    for (let i = 0; i < board.length; i++) {
      const row = board[i];
      let copInMiddle = false;

      if (
        row[bonusColumns.left] !== "PRISONER" ||
        row[bonusColumns.right] !== "ROBBER"
      ) {
        continue;
      }

      for (let j = 0; j < middleColumns.length; j++) {
        if (row[middleColumns[j]] === "COP") {
          copInMiddle = true;
          break;
        }
      }

      if (copInMiddle) {
        return i;
      }
    }

    return -1;
  }

  function checkBonusTrigger(board, bonusColumns = defaultBonusColumns) {
    return findBonusRow(board, bonusColumns) !== -1;
  }

  function createGame() {
    if (!root || !root.document) {
      return null;
    }

    const doc = root.document;
    const symbolsModule = root.Fleeing59Symbols;
    const paylinesModule = root.Fleeing59Paylines;
    const reelsModule = root.Fleeing59Reels;

    if (!symbolsModule || !paylinesModule || !reelsModule) {
      const statusElement = doc.getElementById("status");

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

    const grid = doc.getElementById("slot-grid");
    const statusElement = doc.getElementById("status");
    const spinButton = doc.getElementById("spin-btn");
    const siren = typeof root.Audio === "function" ? new root.Audio("siren.mp3") : null;
    const middleColumnLookup = Object.create(null);

    if (!grid || !statusElement || !spinButton) {
      if (statusElement) {
        statusElement.textContent = "Game failed to load required DOM elements.";
      }

      return null;
    }

    for (let i = 0; i < BONUS_COLUMNS.middle.length; i++) {
      middleColumnLookup[BONUS_COLUMNS.middle[i]] = true;
    }

    function highlightBonusSymbols(winningRow) {
      for (let index = 0; index < cellElements.length; index++) {
        const cell = cellElements[index];
        const row = Math.floor(index / cols);
        const col = index % cols;
        const text = cell.dataset.symbol;
        const isBonusColumn = middleColumnLookup[col] === true;

        if (row !== winningRow) {
          continue;
        }

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
      const winningRow = findBonusRow(board, BONUS_COLUMNS);

      if (winningRow !== -1) {
        statusElement.textContent = "🚨 BONUS TRIGGERED!";
        highlightBonusSymbols(winningRow);
        if (siren) {
          siren.currentTime = 0;
          siren.play();
        }
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
    const doc = root.document;
    const init = () => {
      gameInstance = createGame();
    };

    if (doc.readyState === "loading") {
      doc.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
      init();
    }
  }

  return {
    findBonusRow,
    checkBonusTrigger,
    createGame,
    get game() {
      return gameInstance;
    }
  };
});
