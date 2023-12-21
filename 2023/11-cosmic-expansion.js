const fs = require('fs');

let data;
try {
  data = fs.readFileSync('./11-input.txt', 'utf8');
} catch (err) {
  console.error(err);
}

const lines = data.split('\n').slice(0, -1);
const chars = lines.map(line => line.split(''));

// Part One

class Space {
  constructor(row, col, chars) {
    this.row = row;
    this.col = col;
    this.char = chars[row][col];
  }
}

class Universe {
  constructor(chars, expansion) {
    this.chars = chars;
    this.spaces = [];
    this.galaxies = [];
    this.galaxyPaths = [];
    this.galaxyPathSum = 0;
    this.expansion = expansion;
    this.createSpaces();
    this.expand();
    this.createGalaxies();
    this.createGalaxyPaths();
    this.sumGalaxyPaths();
  }

  createSpaces() {
    for (let row = 0; row < this.chars.length; row++) {
      this.spaces.push([])
      for (let col = 0; col < this.chars[row].length; col++) {
        this.spaces[row].push(new Space(row, col, this.chars));
      }
    }
  }

  createGalaxies() {
    for (const row of this.spaces) {
      for (const space of row) {
        if (space.char === '#') this.galaxies.push(space);
      }
    }
  }

  createGalaxyPaths() {
    for (let i = 0; i < this.galaxies.length; i++) {
      for (let j = 0; j < this.galaxies.length; j++) {
        if (this.galaxies[i] !== this.galaxies[j]) {
          this.galaxyPaths.push([this.galaxies[i], this.galaxies[j]])
        }
      }
    }
  }

  rowIsEmpty(row) {
    return !this.chars[row].includes('#');
  }

  colIsEmpty(col) {
    let isEmpty = true;
    for (const row of this.chars) {
      if (row[col] === '#') isEmpty = false;
    }
    return isEmpty;
  }

  expandRow(row, rowExpansion) {
    for (const space of this.spaces[row]) {
      space.row += rowExpansion;
    }
  }

  expandCol(col, colExpansion) {
    for (const row of this.spaces) {
      row[col].col += colExpansion;
    }
  }

  expand() {
    let rowExpansion = 0;

    for (let row = 0; row < this.spaces.length; row++) {
      for (let col = 0; col < this.spaces[0].length; col++) {
        this.spaces[row][col].row += rowExpansion;
      }
      if (this.rowIsEmpty(row)) rowExpansion += this.expansion;
    }

    let colExpansion = 0;

    for (let col = 0; col < this.spaces[0].length; col++) {
      for (let row = 0; row < this.spaces.length; row++) {
        this.spaces[row][col].col += colExpansion;
      }
      if (this.colIsEmpty(col)) colExpansion += this.expansion;
    }
  }

  expandRowChars(row, chars) {
    chars.splice(row, 0, '.'.repeat(chars[row].length).split(''));
  }

  expandColChars(col, chars) {
    for (const row of chars) {
      row.splice(col, 0, '.');
    }
  }

  expandChars() {
    const expandedChars = this.chars.map(row => row.slice());

    let row = 0;
    let expandedRow = 0;

    while (row < this.chars.length) {
      if (this.rowIsEmpty(row)) {
        this.expandRowChars(expandedRow, expandedChars);
        expandedRow += 1;
      }
      row += 1;
      expandedRow += 1;
    }
    for (let row = 0; row < this.chars.length; row++) {
    }

    let col = 0;
    let expandedCol = 0;
    while (col < this.chars[0].length) {
      if (this.colIsEmpty(col)) {
        this.expandColChars(expandedCol, expandedChars);
        expandedCol += 1;
      }
      col += 1;
      expandedCol += 1;
    }

    this.chars = expandedChars;
  }

  sumGalaxyPaths() {
    let sum = 0;
    for (const galaxyPath of this.galaxyPaths) {
      const [a, b] = galaxyPath;
      const distance = Math.abs(a.row - b.row) + Math.abs(a.col - b.col)
      sum += distance;
    }
    this.galaxyPathSum = sum / 2;
  }

  print() {
    for (const row of this.chars) {
      console.log(row.join(''));
    }
  }
}

const universe = new Universe(chars, 1)
const answer = universe.galaxyPathSum;
console.log({answer});

// Part Two

const universe2 = new Universe(chars, 999999)
const answer2 = universe2.galaxyPathSum;
console.log({answer2});
