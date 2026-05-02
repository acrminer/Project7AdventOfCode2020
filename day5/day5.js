// Advent of Code 2020 - Day 5: Binary Boarding
// https://adventofcode.com/2020/day/5
//
// Each boarding pass is a 10-character string:
//   - First 7 chars are 'F' (front, lower half) or 'B' (back, upper half).
//     They identify the row (0-127) via binary partitioning.
//   - Last 3 chars are 'L' (left, lower half) or 'R' (right, upper half).
//     They identify the column (0-7) the same way.
// Seat ID = row * 8 + column.
//
// Part 1: highest seat ID on any boarding pass.
// Part 2: the missing seat ID in an otherwise contiguous range
//         (your seat - the only gap in the list, ignoring gaps at the very
//          start/end of the plane).

// fs: https://nodejs.org/api/fs.html
const fs = require('fs');

const passes = fs
  .readFileSync(__dirname + '/day5input.txt', 'utf8')
  .split(/\r?\n/)
  .map(s => s.trim())
  .filter(Boolean);

// F/L = 0 and B/R = 1.
// The whole 10-char string is just a 10-bit binary number, and that number is
// the seat ID directly (because shifting the row left by 3 and adding the column
// is the same as concatenating the row's 7 bits and the column's 3 bits).
// String.prototype.replace: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
// parseInt:                 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
function seatId(pass) {
  // Replace F/L with 0 and B/R with 1. A character class lets each replace
  // call handle both letters at once.
  const binary = pass.replace(/[FL]/g, '0').replace(/[BR]/g, '1');
  return parseInt(binary, 2);
}

const ids = passes.map(seatId);

// --- Part 1 ---
// Math.max + spread to find the largest ID.
// Math.max: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max
const part1 = Math.max(...ids);

// --- Part 2 ---
// Sort, then walk the list looking for a gap of 2 (a missing ID between
// two present ones).
// Array.prototype.sort: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
const sorted = ids.slice().sort((a, b) => a - b);
let part2;
for (let i = 1; i < sorted.length; i++) {
  if (sorted[i] - sorted[i - 1] === 2) {
    part2 = sorted[i] - 1;
    break;
  }
}

console.log('Day 5 Part 1:', part1);
console.log('Day 5 Part 2:', part2);
