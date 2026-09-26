(function (root, factory) {
  const exports = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = exports;
  }

  if (root) {
    root.Fleeing59Symbols = exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const SYMBOLS = {
    K: {
      id: "K",
      image: "assets/symbols/symbol_k.png",
      paytable: {
        5: 10,
        6: 20,
        7: 50
      }
    },

    Q: {
      id: "Q",
      image: "assets/symbols/symbol_q.png",
      paytable: {
        5: 8,
        6: 16,
        7: 40
      }
    },

    J: {
      id: "J",
      image: "assets/symbols/symbol_j.png",
      paytable: {
        5: 6,
        6: 12,
        7: 30
      }
    },

    BADGE: {
      id: "BADGE",
      image: "assets/symbols/symbol_badge.png",
      paytable: {},
      scatter: true
    },

    GOLD_BADGE: {
      id: "gold_badge",
      name: "Gold Badge",
      value: 8,
      type: "premium",
      image: "assets/symbols/gold_badge.png",
      paytable: {}
    },

    PRISONER: {
      id: "PRISONER",
      image: "assets/symbols/symbol_prisoner.png",
      paytable: {}
    },

    COP: {
      id: "COP",
      image: "assets/symbols/symbol_cop.png",
      paytable: {}
    },

    ROBBER: {
      id: "ROBBER",
      image: "assets/symbols/symbol_robber.png",
      paytable: {}
    },

    MASK: {
      id: "MASK",
      image: "assets/symbols/symbol_mask.png",
      paytable: {}
    }
  };

  const SYMBOL_KEYS = Object.keys(SYMBOLS);

  return {
    SYMBOLS,
    SYMBOL_KEYS
  };
});
