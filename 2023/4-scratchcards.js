const fs = require('fs');

let data;
try {
  data = fs.readFileSync('./4-input.txt', 'utf8');
} catch (err) {
  console.error(err);
}

const lines = data.split('\n').slice(0, -1);

// Part One - Total Card Points
let totalPts = 0;

for (const line of lines) {
  let cardPts = 0;
  const winNums = line.slice(10, 39).split(/\s+/g).filter(n => n).map(n => +n);
  const myNums = line.slice(42).split(/\s+/g).filter(n => n).map(n => +n);
  for (const myNum of myNums) {
    if (winNums.includes(myNum)) {
      if (cardPts === 0) cardPts = 1;
      else cardPts *= 2;
    }
  }
  totalPts += cardPts;
}

console.log('totalPts', totalPts);

// Part Two -
const cardCounts = Array.from('1'.repeat(lines.length)).map(n => +n);

for (const [i, line] of lines.entries()) {
  let matchCount = 0;
  const winNums = line.slice(10, 39).split(/\s+/g).filter(n => n).map(n => +n);
  const myNums = line.slice(42).split(/\s+/g).filter(n => n).map(n => +n);
  for (const myNum of myNums) {
    if (winNums.includes(myNum)) matchCount += 1;
  }
  for (let j = 1; j <= matchCount; j++) {
    cardCounts[i + j] += cardCounts[i]
  }
}

console.log('totalCards', cardCounts.reduce((sum, n) => sum += n));
