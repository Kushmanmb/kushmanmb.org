(function (root, factory) {
  const exports = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = exports;
  }

  if (root) {
    root.Fleeing59Paylines = exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const PAYLINES = [
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2],
    [3, 3, 3, 3, 3],
    [4, 4, 4, 4, 4],
    [5, 5, 5, 5, 5]
  ];

  const BONUS_COLUMNS = {
    left: 0,
    middle: [1, 2, 3],
    right: 4
  };

  return {
    PAYLINES,
    BONUS_COLUMNS
  };
});
