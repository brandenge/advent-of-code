const fs = require('fs');

let data;
try {
  data = fs.readFileSync('./13-input.txt', 'utf8').trimEnd();
} catch (err) {
  console.error(err);
}

const patterns = data.split('\n\n').map(lines => lines.split('\n'));

// Part One

function colMatches(pattern, col1, col2) {
  const col1Chars = [];
  const col2Chars = [];

  for (row of pattern) {
    col1Chars.push(row[col1]);
    col2Chars.push(row[col2]);
  }

  return col1Chars.join('') === col2Chars.join('');
}

function rowMatches(pattern, row1, row2) {
  return pattern[row1] === pattern[row2];
}

function verticalMirrorIdx(pattern) {
  for (let col = 0; col < pattern[0].length - 1; col++) {
    let colIsMirror = true;
    for (let offset = 0; offset <= Math.min(col, pattern[0].length - col - 2); offset++) {
      if (!colMatches(pattern, col - offset, col + offset + 1)) {
        colIsMirror = false;
        break;
      }
    }
    if (colIsMirror) return col + 1;
  }
  return -1;
}

function horizontalMirrorIdx(pattern) {
  for (let row = 0; row < pattern.length - 1; row++) {
    let rowIsMirror = true;
    for (let offset = 0; offset <= Math.min(row, pattern.length - row - 2); offset++) {
      if (!rowMatches(pattern, row - offset, row + offset + 1)) {
        rowIsMirror = false;
        break;
      }
    }
    if (rowIsMirror) return row + 1;
  }
  return -1;
}

let result1 = 0;

for (pattern of patterns) {
  const colMatchIdx = verticalMirrorIdx(pattern);
  console.log({colMatchIdx});
  if (colMatchIdx !== -1) result1 += colMatchIdx;
}

for (pattern of patterns) {
  const rowMatchIdx = horizontalMirrorIdx(pattern);
  console.log({rowMatchIdx});
  if (rowMatchIdx !== -1) result1 += 100 * rowMatchIdx;
}

console.log({result1});

// Part Two

function colMatches2(pattern, col1, col2) {
  const col1Chars = [];
  const col2Chars = [];

  for (row of pattern) {
    col1Chars.push(row[col1]);
    col2Chars.push(row[col2]);
  }

  let wrongMatches = 0;
  for (let i = 0; i < col1Chars.length; i++) {
    if (col1Chars[i] !== col2Chars[i]) wrongMatches += 1;
  }

  return wrongMatches;
}

function rowMatches2(pattern, row1, row2) {
  const row1Chars = pattern[row1].split('');
  const row2Chars = pattern[row2].split('');

  let wrongMatches = 0;
  for (let i = 0; i < row1Chars.length; i++) {
    if (row1Chars[i] !== row2Chars[i]) wrongMatches += 1;
  }

  return wrongMatches;
}

function verticalMirrorIdx2(pattern) {
  for (let col = 0; col < pattern[0].length - 1; col++) {
    let colIsSmudgedMirror = true;
    let smudgeMatches = 0;
    for (let offset = 0; offset <= Math.min(col, pattern[0].length - col - 2); offset++) {
      let colMatchResult = colMatches2(pattern, col - offset, col + offset + 1);
      if (colMatchResult === 1) smudgeMatches += 1;
      else if (colMatchResult > 1) colIsSmudgedMirror = false;
    }
    if (smudgeMatches !== 1) colIsSmudgedMirror = false;
    if (colIsSmudgedMirror) return col + 1;
  }
  return -1;
}

function horizontalMirrorIdx2(pattern) {
  for (let row = 0; row < pattern.length - 1; row++) {
    let rowIsSmudgedMirror = true;
    let smudgeMatches = 0;
    for (let offset = 0; offset <= Math.min(row, pattern.length - row - 2); offset++) {
      let rowMatchResult = rowMatches2(pattern, row - offset, row + offset + 1);
      if (rowMatchResult === 1) smudgeMatches += 1;
      else if (rowMatchResult > 1) rowIsSmudgedMirror = false;
    }
    if (smudgeMatches !== 1) rowIsSmudgedMirror = false;
    if (rowIsSmudgedMirror) return row + 1;
  }
  return -1;
}

let result2 = 0;

for (pattern of patterns) {
  const colMatchIdx = verticalMirrorIdx2(pattern);
  if (colMatchIdx !== -1) result2 += colMatchIdx;
}

for (pattern of patterns) {
  const rowMatchIdx = horizontalMirrorIdx2(pattern);
  if (rowMatchIdx !== -1) result2 += 100 * rowMatchIdx;
}

console.log({result2});
