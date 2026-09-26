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
  console.log('✓ Test 2: Bonus trigger detection (positive case)');
  passed++;
} else {
  console.log('✗ Test 2: FAILED - Should trigger bonus');
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
  console.log('✓ Test 3: No trigger without PRISONER');
  passed++;
} else {
  console.log('✗ Test 3: FAILED - Should not trigger without PRISONER');
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
  console.log('✓ Test 4: No trigger without ROBBER');
  passed++;
} else {
  console.log('✗ Test 4: FAILED - Should not trigger without ROBBER');
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
  console.log('✓ Test 5: No trigger without COP in middle');
  passed++;
} else {
  console.log('✗ Test 5: FAILED - Should not trigger without COP');
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
  console.log('✓ Test 6: Bonus trigger with all conditions in last row');
  passed++;
} else {
  console.log('✗ Test 6: FAILED - Should trigger with all conditions');
  failed++;
}

console.log(`\n${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  process.exit(1);
}

console.log('All tests passed!');
