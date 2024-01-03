const fs = require('fs');

let data;
try {
  data = fs.readFileSync('./14-input.txt', 'utf8').trimEnd();
} catch (err) {
  console.error(err);
}

const lines = data.split('\n');
const chars = lines.map(line => line.split(''));

// Part One

function colCharsArr(chars, col) {
  const charsArr = [];

  for (let row = 0; row < chars.length; row++) {
    charsArr.push(chars[row][col]);
  }

  return charsArr;
}

function shiftRoundRocks(charsArr) {
  const chars = charsArr.join('');
  const splits = chars.split('#')

  for (let i = 0; i < splits.length; i++) {
    const count = splits[i].split('O').length - 1;
    splits[i] = 'O'.repeat(count) + '.'.repeat(splits[i].length - count)
  }

  return splits.join('#');
}

function shiftPlatform(chars) {
  for (let col = 0; col < chars[0].length; col++) {
    const colChars = colCharsArr(chars, col);
    const shiftedCol = shiftRoundRocks(colChars);
    for (let row = 0; row < chars.length; row ++) {
      chars[row][col] = shiftedCol[row];
    }
  }
  return chars;
}

function calcWeight(shiftedLines) {
  let weight = 0;

  for (let i = 0; i < shiftedLines.length; i++) {
    const count = shiftedLines[i].split('O').length - 1;
    weight += count * (shiftedLines.length - i);
  }
  return weight;
}

const deepCopyChars = chars.map(row => row.slice());
const shiftedLines = shiftPlatform(deepCopyChars).map(row => row.join(''));
const answer1 = calcWeight(shiftedLines);

console.log({answer1});

// Part Two

function shiftPlatformNorth(chars) {
  for (let col = 0; col < chars[0].length; col++) {
    const colChars = colCharsArr(chars, col);
    const shiftedCol = shiftRoundRocks(colChars).split('');
    for (let row = 0; row < chars.length; row ++) {
      chars[row][col] = shiftedCol[row];
    }
  }
  return chars;
}

function shiftPlatformWest(chars) {
  for (let row = 0; row < chars.length; row++) {
    const rowChars = chars[row];
    const shiftedRow = shiftRoundRocks(rowChars).split('');
    chars[row] = shiftedRow;
  }
  return chars;
}

function shiftPlatformSouth(chars) {
  for (let col = 0; col < chars[0].length; col++) {
    const colChars = colCharsArr(chars, col).reverse();
    const shiftedCol = shiftRoundRocks(colChars).split('').reverse();
    for (let row = 0; row < chars.length; row ++) {
      chars[row][col] = shiftedCol[row];
    }
  }
  return chars;
}

function shiftPlatformEast(chars) {
  for (let row = 0; row < chars.length; row++) {
    const rowChars = chars[row].reverse();
    const shiftedRow = shiftRoundRocks(rowChars).split('').reverse();
    chars[row] = shiftedRow;
  }
  return chars;
}

function cyclePlatform(chars, cycles) {
  for (let i = 0; i < cycles; i++) {
    shiftPlatformNorth(chars);
    shiftPlatformWest(chars);
    shiftPlatformSouth(chars);
    shiftPlatformEast(chars);
  }

  return chars;
}

function calcWeight(shiftedLines) {
  let weight = 0;

  for (let i = 0; i < shiftedLines.length; i++) {
    const count = shiftedLines[i].split('O').length - 1;
    weight += count * (shiftedLines.length - i);
  }
  return weight;
}

const deepCopyChars2 = chars.map(row => row.slice());
// The weight number repeats in a cycle starting after the first 92 cycles
// The repetition is 18 cycles long.
const numOfCycles = 92 + ((1000000000 - 92) % 18)
const shiftedLines2 = cyclePlatform(deepCopyChars2, numOfCycles).map(row => row.join(''));

const answer2 = calcWeight(shiftedLines2);

console.log({answer2});
