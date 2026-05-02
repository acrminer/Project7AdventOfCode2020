// Advent of Code 2020 - Day 1: Report Repair
// https://adventofcode.com/2020/day/1
//
// Puzzle:
//   Part 1: find the two entries in the expense report that sum to 2020,
//           then return their product.
//   Part 2: same idea but with three entries that sum to 2020.

// Node 'fs' module - synchronous file reading.
// Docs: https://nodejs.org/api/fs.html#fsreadfilesyncpath-options
const fs = require('fs');

// Read the input file and turn each line into a number.
// String.prototype.split: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split
// Array.prototype.map:    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
// Array.prototype.filter: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
const numbers = fs
  .readFileSync(__dirname + '/day1input.txt', 'utf8')
  .split(/\r?\n/)            // handle both Unix and Windows line endings
  .map(line => line.trim())
  .filter(line => line.length > 0)
  .map(Number);

// --- Part 1 ---
// Use a Set so each "have I already seen 2020 - n?" lookup is O(1) average,
// turning the algorithm from O(n^2) (nested loop) into O(n).
// Set: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
function part1(nums) {
  const seen = new Set();
  for (const n of nums) {
    const complement = 2020 - n;
    if (seen.has(complement)) {
      return n * complement;
    }
    seen.add(n);
  }
}

// --- Part 2 ---
// Sort the numbers and use a "fix one + two-pointer scan" approach.
// For each fixed value `nums[i]`, look for two other values that sum to 2020 - nums[i].
// Sorting makes the two-pointer scan O(n), giving overall O(n^2) - much better than the
// naive O(n^3) triple loop.
// Array.prototype.sort: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
function part2(nums) {
  // Slice + sort to avoid mutating the original array.
  const sorted = nums.slice().sort((a, b) => a - b);
  for (let i = 0; i < sorted.length - 2; i++) {
    let left = i + 1;
    let right = sorted.length - 1;
    const target = 2020 - sorted[i];
    while (left < right) {
      const sum = sorted[left] + sorted[right];
      if (sum === target) {
        return sorted[i] * sorted[left] * sorted[right];
      } else if (sum < target) {
        left++;     // need a bigger sum -> move left pointer up
      } else {
        right--;    // need a smaller sum -> move right pointer down
      }
    }
  }
}

console.log('Day 1 Part 1:', part1(numbers));
console.log('Day 1 Part 2:', part2(numbers));
