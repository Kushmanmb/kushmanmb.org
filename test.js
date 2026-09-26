#!/usr/bin/env node
// Simple test script to verify the JavaScript logic

const { SYMBOLS, SYMBOL_KEYS } = require('./src/symbols.js');
const { checkBonusTrigger } = require('./src/game.js');

const symbols = SYMBOL_KEYS;
const rows = 6;
const cols = 5;

// Mock function to generate board
function generateBoard() {
  const board = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      row.push(symbol);
    }
    board.push(row);
  }
  return board;
}

// Test cases
console.log('Running tests...\n');

let passed = 0;
let failed = 0;

if (
  SYMBOLS.K.paytable[5] === 10 &&
  SYMBOLS.K.paytable[6] === 20 &&
  SYMBOLS.K.paytable[7] === 50 &&
  SYMBOLS.Q.paytable[5] === 8 &&
  SYMBOLS.Q.paytable[6] === 16 &&
  SYMBOLS.Q.paytable[7] === 40 &&
  SYMBOLS.J.paytable[5] === 6 &&
  SYMBOLS.J.paytable[6] === 12 &&
  SYMBOLS.J.paytable[7] === 30
) {
  console.log('✓ Test 1: Symbol paytable replacement for K/Q/J');
  passed++;
} else {
  console.log('✗ Test 1: FAILED - Incorrect K/Q/J paytable values');
  failed++;
}

if (
  SYMBOLS.GOLD_BADGE.id === 'gold_badge' &&
  SYMBOLS.GOLD_BADGE.name === 'Gold Badge' &&
  SYMBOLS.GOLD_BADGE.value === 8 &&
  SYMBOLS.GOLD_BADGE.type === 'premium' &&
  SYMBOLS.GOLD_BADGE.image === '/assets/symbols/gold_badge.png' &&
  SYMBOL_KEYS.includes('GOLD_BADGE')
) {
  console.log('✓ Test 2: Gold badge symbol metadata');
  passed++;
} else {
  console.log('✗ Test 2: FAILED - Incorrect gold badge metadata');
  failed++;
}

// Test case 1: Should trigger bonus
const testBoard1 = [
  ["PRISONER", "K", "COP", "Q", "ROBBER"],
  ["Q", "J", "MASK", "BADGE", "Q"],
  ["J", "K", "Q", "J", "MASK"],
  ["MASK", "Q", "J", "K", "BADGE"],
  ["BADGE", "MASK", "K", "Q", "J"],
  ["Q", "J", "MASK", "K", "BADGE"]
];
if (checkBonusTrigger(testBoard1)) {
  console.log('✓ Test 3: Bonus trigger detection (positive case)');
  passed++;
} else {
  console.log('✗ Test 3: FAILED - Should trigger bonus');
  failed++;
}

// Test case 2: Should not trigger (no PRISONER)
const testBoard2 = [
  ["K", "Q", "COP", "J", "ROBBER"],
  ["Q", "J", "MASK", "BADGE", "Q"],
  ["J", "K", "Q", "J", "MASK"],
  ["MASK", "Q", "J", "K", "BADGE"],
  ["BADGE", "MASK", "K", "Q", "J"],
  ["Q", "J", "MASK", "K", "BADGE"]
];
if (!checkBonusTrigger(testBoard2)) {
  console.log('✓ Test 4: No trigger without PRISONER');
  passed++;
} else {
  console.log('✗ Test 4: FAILED - Should not trigger without PRISONER');
  failed++;
}

// Test case 3: Should not trigger (no ROBBER)
const testBoard3 = [
  ["PRISONER", "K", "COP", "Q", "J"],
  ["Q", "J", "MASK", "BADGE", "Q"],
  ["J", "K", "Q", "J", "MASK"],
  ["MASK", "Q", "J", "K", "BADGE"],
  ["BADGE", "MASK", "K", "Q", "J"],
  ["Q", "J", "MASK", "K", "BADGE"]
];
if (!checkBonusTrigger(testBoard3)) {
  console.log('✓ Test 5: No trigger without ROBBER');
  passed++;
} else {
  console.log('✗ Test 5: FAILED - Should not trigger without ROBBER');
  failed++;
}

// Test case 4: Should not trigger (no COP in middle)
const testBoard4 = [
  ["PRISONER", "K", "Q", "J", "ROBBER"],
  ["Q", "J", "MASK", "BADGE", "Q"],
  ["J", "K", "Q", "J", "MASK"],
  ["MASK", "Q", "J", "K", "BADGE"],
  ["BADGE", "MASK", "K", "Q", "J"],
  ["Q", "J", "MASK", "K", "BADGE"]
];
if (!checkBonusTrigger(testBoard4)) {
  console.log('✓ Test 6: No trigger without COP in middle');
  passed++;
} else {
  console.log('✗ Test 6: FAILED - Should not trigger without COP');
  failed++;
}

// Test case 5: Should trigger with all conditions in last row
const testBoard5 = [
  ["K", "Q", "J", "MASK", "BADGE"],
  ["Q", "J", "MASK", "BADGE", "Q"],
  ["J", "K", "Q", "J", "MASK"],
  ["MASK", "Q", "J", "K", "BADGE"],
  ["BADGE", "MASK", "K", "Q", "J"],
  ["PRISONER", "J", "COP", "K", "ROBBER"]
];
if (checkBonusTrigger(testBoard5)) {
  console.log('✓ Test 7: Bonus trigger with all conditions in last row');
  passed++;
} else {
  console.log('✗ Test 7: FAILED - Should trigger with all conditions');
  failed++;
}

const testBoardSplitRows = [
  ["PRISONER", "K", "Q", "J", "MASK"],
  ["Q", "J", "COP", "BADGE", "Q"],
  ["J", "K", "Q", "J", "ROBBER"],
  ["MASK", "Q", "J", "K", "BADGE"],
  ["BADGE", "MASK", "K", "Q", "J"],
  ["Q", "J", "MASK", "K", "BADGE"]
];

if (!checkBonusTrigger(testBoardSplitRows)) {
  console.log('✓ Test 8: No trigger when bonus symbols are split across rows');
  passed++;
} else {
  console.log('✗ Test 8: FAILED - Should not trigger across different rows');
  failed++;
}

const customBonusColumns = {
  left: 1,
  middle: [2],
  right: 3
};

const testBoard6 = [
  ["K", "PRISONER", "COP", "ROBBER", "J"],
  ["Q", "J", "MASK", "BADGE", "Q"],
  ["J", "K", "Q", "J", "MASK"],
  ["MASK", "Q", "J", "K", "BADGE"],
  ["BADGE", "MASK", "K", "Q", "J"],
  ["Q", "J", "MASK", "K", "BADGE"]
];

if (checkBonusTrigger(testBoard6, customBonusColumns)) {
  console.log('✓ Test 9: Bonus trigger with custom bonus columns');
  passed++;
} else {
  console.log('✗ Test 9: FAILED - Should trigger with custom bonus columns');
  failed++;
}

const testBoard7 = [
  ["K", "PRISONER", "Q", "ROBBER", "J"],
  ["Q", "J", "MASK", "BADGE", "Q"],
  ["J", "K", "Q", "J", "MASK"],
  ["MASK", "Q", "J", "K", "BADGE"],
  ["BADGE", "MASK", "K", "Q", "J"],
  ["Q", "J", "MASK", "K", "BADGE"]
];

if (!checkBonusTrigger(testBoard7, customBonusColumns)) {
  console.log('✓ Test 10: No trigger with custom bonus columns when COP is missing');
  passed++;
} else {
  console.log('✗ Test 10: FAILED - Should not trigger custom columns without COP');
  failed++;
}

const testBoard8 = [
  ["K", "PRISONER", "Q", "J", "MASK"],
  ["Q", "J", "COP", "BADGE", "Q"],
  ["J", "K", "Q", "ROBBER", "MASK"],
  ["MASK", "Q", "J", "K", "BADGE"],
  ["BADGE", "MASK", "K", "Q", "J"],
  ["Q", "J", "MASK", "K", "BADGE"]
];

if (!checkBonusTrigger(testBoard8, customBonusColumns)) {
  console.log('✓ Test 11: No trigger with custom bonus columns across different rows');
  passed++;
} else {
  console.log('✗ Test 11: FAILED - Should not trigger custom columns across rows');
  failed++;
}

console.log(`\n${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  process.exit(1);
}

console.log('All tests passed!');
