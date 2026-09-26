(function (root, factory) {
  const exports = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = exports;
  }

  if (root) {
    root.Fleeing59Reels = exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function generateBoard(rows, cols, symbolKeys) {
    const board = [];

    for (let r = 0; r < rows; r++) {
      const row = [];

      for (let c = 0; c < cols; c++) {
        row.push(symbolKeys[Math.floor(Math.random() * symbolKeys.length)]);
      }

      board.push(row);
    }

    return board;
  }

  function renderBoard(board, grid, cellElements) {
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }

    cellElements.length = 0;

    const fragment = document.createDocumentFragment();

    for (let r = 0; r < board.length; r++) {
      const row = board[r];

      for (let c = 0; c < row.length; c++) {
        const symbol = row[c];
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.textContent = symbol;
        cell.dataset.symbol = symbol;
        cellElements.push(cell);
        fragment.appendChild(cell);
      }
    }

    grid.appendChild(fragment);
  }

  return {
    generateBoard,
    renderBoard
  };
});
