// Advent of Code 2020 - Day 6: Custom Customs
// https://adventofcode.com/2020/day/6
//
// Input is a series of "groups" separated by blank lines. Each line within a
// group is one person's answers (each character a..z represents a "yes" to
// some question).
//
// Part 1: for each group, count the number of questions to which ANYONE
//         answered yes (i.e. union of letters). Sum over all groups.
// Part 2: for each group, count the questions to which EVERYONE answered yes
//         (i.e. intersection of letters). Sum over all groups.

// fs: https://nodejs.org/api/fs.html
const fs = require('fs');

const raw = fs.readFileSync(__dirname + '/day6input.txt', 'utf8');

// Split on blank lines to get groups, then split each group into people.
const groups = raw
  .split(/\r?\n\r?\n/)
  .map(block => block.split(/\r?\n/).map(s => s.trim()).filter(Boolean));

// --- Part 1 ---
// Union of letters across all people in the group.
// Set: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
// Array.prototype.flatMap: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap
function anyoneYes(group) {
  // Spread each person's string into characters, flatten, dedupe via Set.
  const all = group.flatMap(person => [...person]);
  return new Set(all).size;
}

// --- Part 2 ---
// Intersection of letters across all people in the group.
// We start with the first person's letters and keep only the ones that also
// appear in every subsequent person.
// Array.prototype.reduce: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
function everyoneYes(group) {
  return group
    .map(person => new Set(person))
    .reduce((acc, set) => new Set([...acc].filter(ch => set.has(ch))))
    .size;
}

// Array.prototype.reduce on the groups themselves to sum the counts.
const part1 = groups.reduce((sum, g) => sum + anyoneYes(g), 0);
const part2 = groups.reduce((sum, g) => sum + everyoneYes(g), 0);

console.log('Day 6 Part 1:', part1);
console.log('Day 6 Part 2:', part2);
