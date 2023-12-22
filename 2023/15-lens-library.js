const fs = require('fs');

let data;
try {
  data = fs.readFileSync('./15-input.txt', 'utf8').trimEnd();
} catch (err) {
  console.error(err);
}

let sequences = data.split(',');

// Part One

function hash(string) {
  let result = 0;
  for (let i = 0; i < string.length; i++) {
    result += string.charCodeAt(i);
    result *= 17;
    result %= 256;
  }
  return result;
}

const answer1 = sequences.reduce((sum, sequence) => sum + hash(sequence), 0);
console.log({answer1});

// Part Two

sequences = sequences.map(instruction => {
  let [label, operation, lens] = instruction.split(/(?=(-|=))/);
  lens = +lens.slice(1);
  return [label, operation, lens];
});

function focusingPower(boxes) {
  let focusPower = 0;
  for (let i = 0; i < boxes.length; i++) {
    for (let j = 0; j < boxes[i].length; j++) {
      focusPower += (i + 1) * (j + 1) * boxes[i][j][1];
    }
  }
  return focusPower;
}

const boxes = Array(256);
for (let i = 0; i < boxes.length; i++) {
  boxes[i] = [];
}

for (sequence of sequences) {
  const [seqLabel, operation, seqLens] = sequence;
  const boxIdx = hash(seqLabel);
  const box = boxes[boxIdx];
  const boxLabels = box.map(lens => lens[0]);
  const lensIdx = boxLabels.indexOf(seqLabel);
  if (operation === '=') {
    const newLens = [seqLabel, seqLens];
    if (lensIdx === -1) box.push(newLens);
    else box[lensIdx] = newLens;
  } else if (operation === '-') {
    if (lensIdx === -1) continue;
    box.splice(lensIdx, 1);
  }
}

const answer2 = focusingPower(boxes);
console.log({answer2});
