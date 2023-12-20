const fs = require('fs');

let data;
try {
  data = fs.readFileSync('./8-input.txt', 'utf8');
} catch (err) {
  console.error(err);
}

const lines = data.split('\n').slice(0, -1);

// Part One

const instructions = lines[0];
const nodesArray = lines.slice(2);

const nodesMap = {}

for (const node of nodesArray) {
  nodesMap[node.slice(0, 3)] = [node.slice(7, 10), node.slice(12, 15)];
}

let currentNode = 'AAA';
let stepCount = 0;

while (currentNode !== 'ZZZ') {
  for (const instruction of instructions) {
    if (instruction === 'L') currentNode = nodesMap[currentNode][0];
    else if (instruction === 'R') currentNode = nodesMap[currentNode][1];
    stepCount += 1;
    if (currentNode === 'ZZZ') break;
  }
}

console.log({stepCount});

// Part Two

const currentNodes = Object.keys(nodesMap).filter(node => node.at(-1) === 'A');
console.log({currentNodes});

for (let i = 0; i < currentNodes.length; i++) {
  let stepCount = 0;
  while (currentNodes[i].at(-1) !== 'Z') {
    for (const instruction of instructions) {
      if (instruction === 'L') currentNodes[i] = nodesMap[currentNodes[i]][0];
      else if (instruction === 'R') currentNodes[i] = nodesMap[currentNodes[i]][1];
      stepCount += 1;
      if (currentNodes[i].at(-1) === 'Z') break;
    }
  }
  currentNodes[i] = stepCount;
}

function gcd(a, b) {
  if (!b) return a;
  return gcd(b, a % b);
}

function lcm(a, b) {
  return a * b / gcd(a, b);
}

const stepCounts = currentNodes;
const answer = stepCounts.reduce((acc, n) => lcm(acc, n));
console.log({answer});
