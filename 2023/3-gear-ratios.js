const fs = require('fs');

let data;
try {
  data = fs.readFileSync('./3-input.txt', 'utf8');
} catch (err) {
  console.error(err);
}

const lines = data.split('\n');
// console.log(lines);

// Part One - Part Numbers

let partNumberSum = 0

for (const [i, line] of lines.entries()) {
  const matches = [...line.matchAll(/\d+/g)];
  // console.log('matches:', matches);
  for (const match of matches) {
    const num = match[0];
    const { index } = match;
    const j = index;
    let searchBorder = '';
    if (j !== 0) {
      searchBorder += line[j - 1];
      if (i !== 0) searchBorder += (lines[i - 1].slice(j - 1, j + num.length + 1));
      if (i !== lines.length) searchBorder += (lines[i + 1].slice(j - 1, j + num.length + 1));
    } else {
      if (i !== 0) searchBorder += (lines[i - 1].slice(j, j + num.length + 1));
      if (i !== lines.length) searchBorder += (lines[i + 1].slice(j, j + num.length + 1));
    }
    if (j + num.length != line.length) {
      searchBorder += line[j + num.length];
      if (i !== 0) searchBorder += (lines[i - 1].slice(j - 1, j + num.length + 1));
      if (i !== lines.length) searchBorder += (lines[i + 1].slice(j - 1, j + num.length + 1));
    } else {
      if (i !== 0) searchBorder += (lines[i - 1].slice(j - 1, j + num.length));
      if (i !== lines.length) searchBorder += (lines[i + 1].slice(j - 1, j + num.length));
    }
    // console.log('searchBorder:', searchBorder);
    if (/[^\d\.]/.test(searchBorder)) {
      // console.log('num', num);
      partNumberSum += +num
    };
  }
}

console.log('part number total sum', partNumberSum);

// Part Two - Gear Ratios

let gearRatioSum = 0;

for (const [i, line] of lines.entries()) {
  const gears = [...line.matchAll(/\*/g)];
  if (gears.length === 0) continue;
  const partNums = []
  // console.log('gear matches:', gears);
  partNums.push(...line.matchAll(/\d+/g));
  if (i !== 0) partNums.push(...lines[i - 1].matchAll(/\d+/g));
  if (i !== lines.length - 1) partNums.push(...lines[i + 1].matchAll(/\d+/g));
  // console.log('partNums', partNums);
  for (const gear of gears) {
    const gearParts = []
    const gearIndex = gear.index;
    for (const partNumMatch of partNums) {
      const partNum = partNumMatch[0];
      const partIndex = partNumMatch.index;
      if (partIndex <= gearIndex + 1 &&
          partIndex + partNum.length >= gearIndex) {
        gearParts.push(+partNum);
      }
    }
    console.log('gear at row, col:', i, gearIndex);
    console.log('gearParts:', gearParts);
    if (gearParts.length == 2) {
      const gearRatio = gearParts[0] * gearParts[1];
      gearRatioSum += gearRatio;
      console.log('gearRatio', gearRatio);
      console.log('new gear ratio sum:', gearRatioSum);
    }
  }
}

console.log('final gear ratio sum:', gearRatioSum);
