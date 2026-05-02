// Advent of Code 2020 - Day 2: Password Philosophy
// https://adventofcode.com/2020/day/2
//
// Each input line looks like:   "1-3 a: abcde"
//   "1-3 a"     => policy: the letter 'a' must appear between 1 and 3 times.
//   "abcde"     => the password to check.
//
// Part 1: how many passwords contain the policy letter
//         the required number of times (inclusive range)?
// Part 2: re-interpret the two numbers as 1-indexed positions in the password.
//         Exactly one of those positions must contain the policy letter (XOR).

// fs: https://nodejs.org/api/fs.html
const fs = require('fs');

// Read all non-empty lines.
const lines = fs
  .readFileSync(__dirname + '/day2input.txt', 'utf8')
  .split(/\r?\n/)
  .map(l => l.trim())
  .filter(l => l.length > 0);

// Parse one line into a structured object.
// Regex: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
// String.prototype.match: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
function parse(line) {
  // Capture groups: (low)-(high) (letter): (password)
  const m = line.match(/^(\d+)-(\d+) (\w): (\w+)$/);
  return {
    low: Number(m[1]),
    high: Number(m[2]),
    letter: m[3],
    password: m[4],
  };
}

// --- Part 1 ---
// Count occurrences of the policy letter and check the inclusive range.
// Array.prototype.filter: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
function isValidPart1({ low, high, letter, password }) {
  // Spread the string into characters so we can filter/count.
  // Spread syntax: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
  const count = [...password].filter(ch => ch === letter).length;
  return count >= low && count <= high;
}

// --- Part 2 ---
// The two numbers are 1-indexed positions. Exactly one must equal the letter.
// Use the bitwise XOR `^` after coercing booleans to numbers via `+`.
// XOR: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_XOR
function isValidPart2({ low, high, letter, password }) {
  const a = password[low - 1] === letter;
  const b = password[high - 1] === letter;
  return (+a) ^ (+b) ? true : false;
}

const parsed = lines.map(parse);
const part1 = parsed.filter(isValidPart1).length;
const part2 = parsed.filter(isValidPart2).length;

console.log('Day 2 Part 1:', part1);
console.log('Day 2 Part 2:', part2);
