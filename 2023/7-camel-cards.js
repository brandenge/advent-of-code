const fs = require('fs');

let data;
try {
  data = fs.readFileSync('./7-input.txt', 'utf8');
} catch (err) {
  console.error(err);
}

const lines = data.split('\n').slice(0, -1);

// Part One

function charCounts(string) {
  const counts = {};
  for (let i = 0; i < string.length; i++) {
    counts[string[i]] = counts[string[i]] + 1 || 1;
  }
  return counts;
}

function getHighCardRank(cards) {
  const cardTypes = '23456789TJQKA';
  const cardRanks = cards.split('').map(card => cardTypes.indexOf(card));
  return Math.max(...cardRanks);
}

function getHandRank(cards) {
  const charCount = charCounts(cards);
  const counts = Object.values(charCount).toSorted((a, b) => a - b).join(' ');

  switch(counts) {
    case '1 1 1 1 1': return 0; // High card only
    case '1 1 1 2': return 2; // One pair
    case '1 2 2': return 3; // Two pair
    case '1 1 3': return 4; // Three of a kind
    case '2 3': return 5; // Full house
    case '1 4': return 6; // Four of a kind
    case '5': return 7; // Five of a kind
  }
}

function cardHandsComparator(a, b) {
  const handA = a.slice(0, 5);
  const handB = b.slice(0, 5)

  const rankA = getHandRank(handA);
  const rankB = getHandRank(handB);

  if (rankA < rankB) return -1;
  else if (rankA > rankB) return 1;

  // Note that the high card for the whole hand does not count for anything

  for (let i = 0; i < handA.length; i++) {
    const cardA = handA[i];
    const cardB = handB[i];
    const cardRankA = getHighCardRank(cardA);
    const cardRankB = getHighCardRank(cardB);
    if (cardRankA < cardRankB) return -1
    else if (cardRankA > cardRankB) return 1;
  }
  return 0;
}

lines.sort(cardHandsComparator);

let total = 0;
for (const [i, line] of lines.entries()) {
  const [hand, bid] = line.split(' ');
  total = total + ((i + 1) * +bid);
}

console.log('total', total);

// Part Two

function getHighCardRank2(cards) {
  const cardTypes = 'J23456789TQKA';
  const cardRanks = cards.split('').map(card => cardTypes.indexOf(card));
  return Math.max(...cardRanks);
}

function getHandRank2(cards) {
  const cardCounts = charCounts(cards);
  let rank = 0;
  const jokerCount = (cardCounts.J || 0);
  let sortedEntries = Object.entries(cardCounts).toSorted((a, b) => a[1] - b[1]);

  if (sortedEntries[sortedEntries.length - 1][0] !== 'J') {
    sortedEntries[sortedEntries.length - 1][1] += jokerCount;
  } else if (sortedEntries[sortedEntries.length - 1][0] === 'J' && sortedEntries.length > 1) {
    sortedEntries[sortedEntries.length - 2][1] += jokerCount;
  }

  sortedEntries = sortedEntries.filter(card => card[0] !== 'J' || card[1] === 5);


  for (let [card, count] of sortedEntries) {
    if (count === 2) {
      if (rank === 0) rank = 2; // One pair
      else if (rank === 2) rank = 3; // Two pair
      else if (rank === 4) rank = 5; // Full house
    } else if (count === 3) {
      if (rank === 0) rank = 4; // Three of a kind
      else if (rank === 2) rank = 5; // Full house
    } else if (count === 4) {
      rank = 6; // Four of a kind
    } else if (count === 5) {
      rank = 7; // Five of a kind
    }
  }
  return rank;
}

function cardHandsComparator2(a, b) {
  const handA = a.slice(0, 5);
  const handB = b.slice(0, 5)

  const rankA = getHandRank2(handA);
  const rankB = getHandRank2(handB);

  if (rankA < rankB) return -1;
  else if (rankA > rankB) return 1;

  // Note that the high card for the whole hand does not count for anything

  for (let i = 0; i < handA.length; i++) {
    const cardA = handA[i];
    const cardB = handB[i];
    const cardRankA = getHighCardRank2(cardA);
    const cardRankB = getHighCardRank2(cardB);
    if (cardRankA < cardRankB) return -1
    else if (cardRankA > cardRankB) return 1;
  }
  return 0;
}

lines.sort(cardHandsComparator2);

let total2 = 0;
for (const [i, line] of lines.entries()) {
  const [hand, bid] = line.split(' ');
  total2 = total2 + ((i + 1) * +bid);
}

console.log('total2', total2);
