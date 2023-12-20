const exp = require('constants');
const fs = require('fs');

let data;
try {
  data = fs.readFileSync('./12-input.txt', 'utf8');
} catch (err) {
  console.error(err);
}

const lines = data.split('\n').slice(0, -1);
const chars = lines.map(line => line.split(' '));

const springLines = chars.map(line => line[0]);
const numLines = chars.map(line => line[1].split(',').map(n => +n));

// Part One

function brokenSpringSplits(springs) {
  return springs.split(/\.+/).filter(springs => springs.length > 0);
}

function filterSmallerSplits(splits, nums) {
  if (splits.length === 0) return;

  if (splits[0].length < nums[0]) {
    splits.shift()
    filterSmallerSplits(splits, nums)
  }

  if (splits.at(-1).length < nums.at(-1)) {
    splits.pop();
    filterSmallerSplits(splits, nums);
  }
}

function filterBrokenSprings(splits, nums) {
  if (splits.length === 0 || nums.length === 0) return;

  const leftMatches = [...splits[0].substring(0, nums[0] * 2).matchAll(/(\#+)/g)];
  let leftMatch;
  let leftMatchIdx;

  if (leftMatches.length > 0) {
    leftMatch = leftMatches[0][0];
    leftMatchIdx = leftMatches[0].index;
  }

  const rightMatches = [...splits[splits.length - 1].substring(splits[splits.length - 1].length - (nums[nums.length - 1] * 2)).matchAll(/(\#+)/g)];

  let rightMatch;
  let rightMatchIdx;

  if (rightMatches.length > 0) {
    rightMatch = rightMatches[rightMatches.length - 1][0];
    rightMatchIdx = rightMatches[rightMatches.length - 1].index;
    rightMatchInput = rightMatches[rightMatches.length - 1].input;
  }

  if (leftMatch && leftMatch.length === nums[0]) {
    nums.shift();
    const leftString = splits[0];

    const newString = leftString.substring(leftMatchIdx + leftMatch.length + 1);

    splits[0] = newString;
    if (splits[0].length === 0) splits.shift();
    return filterBrokenSprings(splits, nums);
  }
  if (rightMatch && rightMatch.length === nums[nums.length - 1]) {
    nums.pop();
    const rightString = splits[splits.length - 1];

    const newString = rightString.substring(0, rightString.length - rightMatchInput.length + rightMatchIdx - 1);

    splits[splits.length - 1] = newString;
    if (splits[splits.length - 1].length === 0) splits.pop();
    return filterBrokenSprings(splits, nums);
  }

  const startMatch = splits[0].match(/^\#+/);
  if (startMatch) {
    const startString = splits[0];

    const newString = startString.substring(nums[0] + 1);
    splits[0] = newString;

    nums.shift();
    if (splits[0].length === 0) splits.shift();
    return filterBrokenSprings(splits, nums);
  }

  const endMatch = splits[splits.length - 1].match(/\#+$/);
  if (endMatch) {
    const endString = splits[splits.length - 1];
    const newString = endString.substring(0, endString.length - nums[nums.length - 1] - 1);
    splits[splits.length - 1] = newString;

    nums.pop();
    if (splits[splits.length - 1].length === 0) splits.pop();
    return filterBrokenSprings(splits, nums);
  }
}

function parseSprings(row, part2 = false) {
  let springString;
  let nums;
  if (part2) {
    springString = unfoldedSpringLines[row];
    nums = unfoldedNumLines[row].slice();
  } else {
    springString = springLines[row];
    nums = numLines[row].slice();
  }

  const springs = brokenSpringSplits(springString);4
  filterSmallerSplits(springs, nums);
  filterBrokenSprings(springs, nums);

  return [springs, nums];
}

function calculateCombos(row, part2 = false) {
  const [springs, nums] = parseSprings(row, part2);
  const springString = springs.join('.');

  let total = 0;
  const regex = RegExp(constructRegex(nums));

  function countCombinations(length, combo = '') {
    if (length === 0) {
      if (regex.test(combo)) {
        total += 1;
      }
      return;
    }

    if (springString[springString.length - length] !== '#') {
      countCombinations(length - 1, combo + '.');
    }
    if (springString[springString.length - length] !== '.') {
      countCombinations(length - 1, combo + '#');
    }
  }

  countCombinations(springString.length)

  return total;
}

function allSpringCombinations(length) {
  const combos = [];

  function createSpringCombo(length, combo = '') {
    if (length === 0) return combos.push(combo);
    createSpringCombo(length - 1, combo + '.');
    createSpringCombo(length - 1, combo + '#');
  }

  createSpringCombo(length);
  return combos;
}

function validCombinations(combos, string) {
  const validCombos = [];

  for (combo of combos) {
    let isValid = true;
    for (let i = 0; i < string.length; i++) {
      if ('.#'.includes(string[i])) {
        if (string[i] !== combo[i]) isValid = false;
      }
    }
    if (isValid) validCombos.push(combo);
  }

  return validCombos;
}

function bruteForce(row) {
  const springString = springLines[row];
  const nums = numLines[row].slice();

  const allCombos = allSpringCombinations(springString.length);
  const validCombos = validCombinations(allCombos, springString);

  const regex = RegExp(constructRegex(nums));
  let total = 0;
  const matches = [];

  for (spring of validCombos) {
    if (regex.test(spring)) {
      total += 1;
      matches.push(spring);
    }
  }

  return total;
}

function constructRegex(nums) {
  regex = '^\\.*'

  for (let i = 0; i < nums.length; i++) {
    regex += `\\#{${nums[i]}}`;
    if (i === nums.length - 1) regex += '\\.*';
    else regex += '\\.+';
  }
  return regex + '$';
}

function count(springs, nums, cache) {
  if (springs.length === 0) return nums.length === 0 ? 1 : 0;
  if (nums.length === 0) return springs.includes('#') ? 0 : 1;

  const key = [springs, nums];

  if (cache[key]) return cache[key];

  let result = 0;

  if (springs[0] !== '#') {
    const subSprings = springs.slice(1);
    // console.log({result});
    result += count(subSprings, nums, cache);
  }

  if (springs[0] !== '.') {
    if (isValidGroup(springs, nums)) {
      springs = springs.substring(nums[0] + 1);
      const subNums = nums.slice(1);
      nums = (subNums.length === 0 ? [] : subNums);
      // console.log({result});
      result += count(springs, nums, cache);
    }
  }
  cache[key] = result;
  return result;
}

function isValidGroup(springs, nums) {
  if (springs.length < nums.reduce((sum, n) => sum + n)) return false;
  if (springs.slice(0, nums[0]).includes('.')) return false;
  return nums[0] == springs.length || springs[nums[0]] !== '#';
}

let answer1 = 0;

for (let i = 0; i < springLines.length; i++) {
  answer1 += calculateCombos(i);
}

console.log({answer1});

// Part Two

const unfoldedSpringLines = springLines.map(line => Array(5).fill(line).join('?'));
const unfoldedNumLines = numLines.map(line => Array(5).fill(line).join(',').split(',').map(n => +n));

let answer2 = 0;
const cache = {};

for (let i = 0; i < springLines.length; i++) {
  const [springs, nums] = parseSprings(i, part2 = true);
  const springString = springs.join('.');
  const subCount = count(springString, nums, cache);
  answer2 += subCount;
  console.log('line:', i + 1, 'count:', {subCount});
}

console.log({answer2});

// Debugging

// const [springs, nums] = parseSprings(0, part2 = true);
// const springString = springs.join('.');
// console.log({springs});
// console.log({springString});
// console.log({nums});
// const subCount = count(springString, nums);
// console.log({subCount});
