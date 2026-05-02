// Advent of Code 2020 - Day 3: Toboggan Trajectory
// https://adventofcode.com/2020/day/3
//
// Input is a map of open squares ('.') and trees ('#'). The map repeats
// infinitely to the right. Starting from the top-left, you move with a
// fixed slope (right, down) and count how many trees you hit.
//
// Part 1: count trees encountered with slope (right 3, down 1).
// Part 2: multiply tree-counts together for several different slopes.

// fs: https://nodejs.org/api/fs.html
const fs = require('fs');

const grid = fs
  .readFileSync(__dirname + '/day3input.txt', 'utf8')
  .split(/\r?\n/)
  .map(row => row.trim())
  .filter(row => row.length > 0);

// Count trees encountered for a given slope (right, down).
// Because the pattern repeats horizontally, use the modulo operator
// to wrap the x coordinate around the row's width.
// Remainder operator (%): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder
function countTrees(right, down) {
  const width = grid[0].length;
  const height = grid.length;
  let x = 0;
  let trees = 0;
  for (let y = 0; y < height; y += down) {
    if (grid[y][x % width] === '#') {
      trees++;
    }
    x += right;
  }
  return trees;
}

// --- Part 1 ---
const part1 = countTrees(3, 1);

// --- Part 2 ---
// Multiply together the counts for the listed slopes.
// Array.prototype.reduce: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
const slopes = [
  [1, 1],
  [3, 1],
  [5, 1],
  [7, 1],
  [1, 2],
];
const part2 = slopes.reduce((product, [r, d]) => product * countTrees(r, d), 1);

console.log('Day 3 Part 1:', part1);
console.log('Day 3 Part 2:', part2);
