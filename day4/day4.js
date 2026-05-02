// Advent of Code 2020 - Day 4: Passport Processing
// https://adventofcode.com/2020/day/4
//
// Input is a series of "passports" separated by blank lines. Each passport is a
// space- or newline-separated list of "key:value" entries.
//
// Part 1: a passport is valid if it contains all required fields. The "cid"
//         field is optional.
// Part 2: same as part 1, but each field's value must also pass a specific
//         validation rule (year ranges, height units, regex patterns, etc.).

// fs: https://nodejs.org/api/fs.html
const fs = require('fs');

const raw = fs.readFileSync(__dirname + '/day4input.txt', 'utf8');

// Passports are separated by blank lines. Splitting on /\r?\n\r?\n/ handles
// both LF and CRLF line endings.
// String.prototype.split: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split
const passports = raw.split(/\r?\n\r?\n/).map(block => {
  // Inside a block, each "key:value" pair may be separated by any whitespace.
  const obj = {};
  block.split(/\s+/).filter(Boolean).forEach(pair => {
    const [key, value] = pair.split(':');
    obj[key] = value;
  });
  return obj;
});

const REQUIRED = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];

// --- Part 1 ---
// A passport is valid if every required field is present.
// Array.prototype.every: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every
function hasAllFields(p) {
  return REQUIRED.every(key => key in p);
}

// --- Part 2 ---
// Validators per field. Each is a small function that returns true/false.
// Number: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
const validators = {
  // Birth year: four digits, 1920-2002
  byr: v => /^\d{4}$/.test(v) && +v >= 1920 && +v <= 2002,
  // Issue year: four digits, 2010-2020
  iyr: v => /^\d{4}$/.test(v) && +v >= 2010 && +v <= 2020,
  // Expiration year: four digits, 2020-2030
  eyr: v => /^\d{4}$/.test(v) && +v >= 2020 && +v <= 2030,
  // Height: 150-193 cm, or 59-76 in
  hgt: v => {
    const m = v.match(/^(\d+)(cm|in)$/);
    if (!m) return false;
    const n = +m[1];
    return m[2] === 'cm' ? n >= 150 && n <= 193 : n >= 59 && n <= 76;
  },
  // Hair color: '#' followed by exactly six hex digits
  hcl: v => /^#[0-9a-f]{6}$/.test(v),
  // Eye color: one of a fixed set of strings
  ecl: v => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(v),
  // Passport ID: exactly nine digits (leading zeros allowed)
  pid: v => /^\d{9}$/.test(v),
  // Country ID: ignored
};

function isStrictlyValid(p) {
  return REQUIRED.every(key => key in p && validators[key](p[key]));
}

const part1 = passports.filter(hasAllFields).length;
const part2 = passports.filter(isStrictlyValid).length;

console.log('Day 4 Part 1:', part1);
console.log('Day 4 Part 2:', part2);
