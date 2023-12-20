const fs = require('fs');

let data;
try {
  data = fs.readFileSync('./5-input.txt', 'utf8');
} catch (err) {
  console.error(err);
}

const lines = data.split('\n').slice(0, -1);

// Part One - Find Minimum Location
const seeds = lines[1].split(' ').map(n => +n);

const seedToSoil = lines.slice(4, 36).map(line => line.split(' ').map(n => +n));
const soilToFertilizer = lines.slice(38, 73).map(line => line.split(' ').map(n => +n));
const fertilizerToWater = lines.slice(75, 102).map(line => line.split(' ').map(n => +n));
const waterToLight = lines.slice(104, 121).map(line => line.split(' ').map(n => +n));
const lightToTemperature = lines.slice(123, 165).map(line => line.split(' ').map(n => +n));
const temperatureToHumidity = lines.slice(167, 204).map(line => line.split(' ').map(n => +n));
const humidityToLocation = lines.slice(206, 245).map(line => line.split(' ').map(n => +n));

const almanacMaps = [seedToSoil, soilToFertilizer, fertilizerToWater, waterToLight, lightToTemperature, temperatureToHumidity, humidityToLocation];

const locations1 = []

function almanacConverter(map, source) {
  for (const line of map) {
    const [dest, src, range] = line;
    const diff = dest - src;
    if (source >= src && source <= src + range - 1) {
      source += diff;
      break;
    }
  }
  return source
}

for (const seed of seeds) {
  let source = seed;
  for (const map of almanacMaps) {
    source = almanacConverter(map, source);
  }
  locations1.push(source);
}

console.log(Math.min(...locations1));

// Part Two -

// Sample Test Data

const seedSample = [
  [79, 14],
  [55, 13],
];
const soilSample = [
  [50, 98, 2],
  [52, 50, 48],
];
const fertilizerSample = [
  [0, 15, 37],
  [37, 52, 2],
  [39, 0, 15],
];
const waterSample = [
  [49, 53, 8],
  [0, 11, 42],
  [42, 0, 7],
  [57, 7, 4],
];
const lightSample = [
  [88, 18, 7],
  [18, 25, 70],
];
const temperatureSample = [
  [45, 77, 23],
  [81, 45, 19],
  [68, 64, 13],
];
const humiditySample = [
  [0, 69, 1],
  [1, 0, 69],
];
const locationSample = [
  [60, 56, 37],
  [56, 93, 4],
];

const almanacSample = [soilSample, fertilizerSample, waterSample, lightSample, temperatureSample, humiditySample, locationSample];

const sampleResults = [];

let nextSampleRanges = seedSample;

for (const map of almanacSample) {
  nextSampleRanges = almanacRangeConverter(map, nextSampleRanges);
}
sampleResults.push(...nextSampleRanges);

const finalSample = sampleResults.map(loc => loc[0])

console.log('sample result', Math.min(...finalSample));

const seedRanges = [
  [1482445116, 339187393],
  [3210489476, 511905836],
  [42566461, 51849137],
  [256584102, 379575844],
  [3040181568, 139966026],
  [4018529087, 116808249],
  [2887351536, 89515778],
  [669731009, 806888490],
  [2369242654, 489923931],
  [2086168596, 82891253]
];


function almanacRangeConverter(map, sourceRanges) {
  const destRanges = []

  for (const sourceRange of sourceRanges) {
    let [start, range] = sourceRange;
    let end = start + range - 1;

    function recursiveHelper(start, subRange) {
      for (const [i, line] of map.entries()) {
        const [dest, mapStart, mapRange] = line;
        const diff = dest - mapStart;
        const mapEnd = mapStart + mapRange - 1;
        // if (start === 0) {
        //   console.log('i', i);
        //   console.log('line', line);
        // }

        if (start >= mapStart && end <= mapEnd) {
          destRanges.push([start + diff, subRange]);
          return;
        } else if (start >= mapStart && start <= mapEnd) {
          destRanges.push([start + diff, mapEnd - start + 1]);
          start = mapEnd + 1;
          subRange = end - start + 1;
          recursiveHelper(start, subRange);
        } else if (end >= mapStart && end <= mapEnd) {
          destRanges.push([mapStart + diff, end - mapStart + 1]);
          end = mapStart - 1;
          subRange = end - start + 1;
          recursiveHelper(start, subRange);
        }
        if (i === map.length - 1) destRanges.push([start, subRange]);
      }
    }
    recursiveHelper(start, range)
  }
  return destRanges;
}

let nextSourceRanges = seedRanges;

for (const map of almanacMaps) {
  nextSourceRanges = almanacRangeConverter(map, nextSourceRanges);
  // console.log('nextSourceRanges', nextSourceRanges);
  const sortedResult = nextSourceRanges.map(res => res[0]);
  sortedResult.sort((a, b) => a - b);
  // console.log('sorted result', sortedResult);
  // console.log('nextSourceRanges length', nextSourceRanges.length);
}

const result = nextSourceRanges.map(loc => loc[0])
result.sort((a, b) => a - b);

// Discard the zeroes and take the lowest
// I am not sure what I did wrong to get the zeroes that need to be discarded
console.log('result', result);
console.log('length', result.length);

console.log('part 2 answer:', Math.min(...result.filter(n => n)));
