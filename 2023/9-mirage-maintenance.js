const fs = require('fs');

let data;
try {
  data = fs.readFileSync('./9-input.txt', 'utf8');
} catch (err) {
  console.error(err);
}

const lines = data.split('\n').slice(0, -1);

// Part One

function ints(nums) {
  return nums.split(' ').map(n => +n);
}

function diffs(nums) {
  const result = [];
  for (let i = 0; i < nums.length - 1; i++) {
    result.push(nums[i + 1] - nums[i]);
  }
  return result;
}

function nextNum(nums) {
  const sequences = [nums];

  while (nums.some(n => n !== 0)) {
    nums = diffs(nums);
    sequences.push(nums);
  }

  sequences[sequences.length - 1].push(0);

  for (let i = sequences.length - 2; i >= 0; i--) {
    sequences[i].push(sequences[i + 1].at(-1) + sequences[i].at(-1));
  }

  return sequences[0].at(-1);
}

const answer = lines.map(line => nextNum(ints(line))).reduce((sum, n) => sum + n);

console.log({answer});

// Part Two

function prevNum(nums) {
  const sequences = [nums];

  while (nums.some(n => n !== 0)) {
    nums = diffs(nums);
    sequences.push(nums);
  }

  sequences[sequences.length - 1].unshift(0);

  for (let i = sequences.length - 2; i >= 0; i--) {
    sequences[i].unshift(sequences[i][0] - sequences[i + 1][0]);
  }

  return sequences[0][0];
}

const answer2 = lines.map(line => prevNum(ints(line))).reduce((sum, n) => sum + n);

console.log({answer2});
