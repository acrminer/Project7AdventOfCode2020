// Advent of Code 2020 - Day 7: Handy Haversacks
// https://adventofcode.com/2020/day/7
//
// Each rule looks like:
//   "light red bags contain 1 bright white bag, 2 muted yellow bags."
//   "faded blue bags contain no other bags."
//
// We model the rules as a directed graph where an edge "A -> B (n)" means
// "bag A directly contains n bags of color B".
//
// Part 1: how many distinct bag colors can eventually contain (directly or
//         indirectly) at least one "shiny gold" bag?
// Part 2: how many individual bags are required inside a single "shiny gold"
//         bag (counting recursively)?

// fs: https://nodejs.org/api/fs.html
const fs = require('fs');

const lines = fs
  .readFileSync(__dirname + '/day7input.txt', 'utf8')
  .split(/\r?\n/)
  .map(l => l.trim())
  .filter(Boolean);

// Build the graph as a Map<string, Array<{ count, color }>>.
// Map: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
const contains = new Map();

for (const line of lines) {
  // Strip the trailing period and split on " bags contain " to separate the
  // outer color from its contents.
  const [outer, rest] = line.replace(/\.$/, '').split(' bags contain ');
  if (rest === 'no other bags') {
    contains.set(outer, []);
    continue;
  }
  // Each contained item looks like "2 muted yellow bag(s)".
  // Use a regex with a global flag and matchAll to pull every (count, color).
  // String.prototype.matchAll: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll
  const items = [...rest.matchAll(/(\d+) ([a-z]+ [a-z]+) bags?/g)].map(m => ({
    count: Number(m[1]),
    color: m[2],
  }));
  contains.set(outer, items);
}

// --- Part 1 ---
// We want the number of distinct colors that can hold a "shiny gold" bag.
// Memoized DFS: for each color, can it reach "shiny gold" by following any
// of its containment edges?
// Set: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
function canReachShinyGold(color, memo = new Map()) {
  if (memo.has(color)) return memo.get(color);
  // Default to false in the memo first, in case the input ever has cycles
  // (it shouldn't, but this prevents infinite recursion if it did).
  memo.set(color, false);
  const inner = contains.get(color) || [];
  const result = inner.some(({ color: c }) =>
    c === 'shiny gold' || canReachShinyGold(c, memo)
  );
  memo.set(color, result);
  return result;
}

let part1 = 0;
for (const color of contains.keys()) {
  if (canReachShinyGold(color)) part1++;
}

// --- Part 2 ---
// Count the total bags required inside a single bag of `color`, recursively
// summing count + count * countInside(child) for each child rule.
function countInside(color) {
  const inner = contains.get(color) || [];
  // Array.prototype.reduce: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
  return inner.reduce(
    (total, { count, color: c }) => total + count + count * countInside(c),
    0
  );
}

const part2 = countInside('shiny gold');

console.log('Day 7 Part 1:', part1);
console.log('Day 7 Part 2:', part2);
