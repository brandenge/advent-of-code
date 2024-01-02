const fs = require('fs');

let data;
try {
  data = fs.readFileSync('./19-input.txt', 'utf8').trimEnd();
} catch (err) {
  console.error(err);
}

// Part One

class Part {
  constructor(x, m, a, s) {
    this.x = x;
    this.m = m;
    this.a = a;
    this.s = s;
  }
}

class Condition {
  constructor(condition, workflow) {
    this.attribute;
    this.operator;
    this.limit;
    this.workflow = workflow;
    this.nextWorkflow;
    this.parseCondition(condition);
  }

  parseCondition(condition) {
    this.attribute = condition[0];
    this.operator = condition[1];
    condition = condition.slice(2);
    const [limit, nextWorkflow] = condition.split(':')
    this.limit = +limit;
    this.nextWorkflow = nextWorkflow;
  }
}

class Workflow {
  constructor(workflow) {
    this.name;
    this.conditions;
    this.nextWorkflow;
    this.parseWorkflow(workflow);
  }

  parseWorkflow(workflow) {
    let [name, conditions] = workflow.split('{');
    conditions = conditions.slice(0, -1).split(',');
    this.nextWorkflow = conditions.at(-1);
    conditions = conditions.slice(0, -1);
    conditions = conditions.map(condition => new Condition(condition, workflow));
    this.name = name;
    this.conditions = conditions;
  }
}

let [workflows, parts] = data.split('\n\n');
workflowsArr = workflows.split('\n');
parts = parts.split('\n');

parts = parts.map(part => {
  const matches = [...part.matchAll(/\d+/g)];
  return new Part(...matches.map(match => +match[0]));
});

workflows = {};

workflowsArr = workflowsArr.map(workflow => { return new Workflow(workflow) });
for (const workflow of workflowsArr) {
  workflows[workflow.name] = workflow;
}

const accepted = [];
const rejected = [];

for (const part of parts) {
  let currentWorkflow = 'in';
  let nextWorkflow = currentWorkflow;

  while (currentWorkflow !== 'R' && currentWorkflow !== 'A') {
    let workflow = workflows[currentWorkflow];

    for (const condition of workflow.conditions) {

      switch (condition.operator) {
        case '<':
          if (part[condition.attribute] < condition.limit) {
            nextWorkflow = condition.nextWorkflow;
          }
          break;
        case '>':
          if (part[condition.attribute] > condition.limit) {
            nextWorkflow = condition.nextWorkflow;
          }
          break;
      }
      if (nextWorkflow !== currentWorkflow) break;
    }

    if (nextWorkflow === currentWorkflow) {
      nextWorkflow = workflow.nextWorkflow;
    }

    currentWorkflow = nextWorkflow;
  }

  switch (currentWorkflow) {
    case 'A': accepted.push(part); break;
    case 'R': rejected.push(part); break;
  }
}

let sum = 0;

for (const part of accepted) {
  sum += part.x;
  sum += part.m;
  sum += part.a;
  sum += part.s;
}

const answer1 = sum;
console.log({answer1});

// Part Two

class Range {
  constructor(attribute, start, end, workflow) {
    this.attribute = attribute;
    this.start = start;
    this.end = end;
    this.workflow = workflow;
  }
}

class AttributeRanges {
  constructor() {
    this.unsorted = [
      new Range('m', 1, 4000, 'in'),
      new Range('x', 1, 4000, 'in'),
      new Range('a', 1, 4000, 'in'),
      new Range('s', 1, 4000, 'in'),
    ];
    this.sorted = [];
  }

  splitRange(range, limit, operator, nextWorkflow) {
    if (operator === '<') {
      if (limit <= range.start) return [new Range(range.attribute, range.start, range.end, range.workflow)];
      const newRange = new Range(range.attribute, limit, range.end, range.workflow);
      range.end = Math.min(range.end, limit - 1);
      range.workflow = nextWorkflow;
      return [range, newRange];
    } else if (operator === '>') {
      if (limit >= range.end) return [new Range(range.attribute, range.start, range.end, range.workflow)];
      const newRange = new Range(range.attribute, range.start, limit, range.workflow);
      range.start = Math.max(range.start, limit + 1);
      range.workflow = nextWorkflow;
      return [range, newRange];
    }
  }

  acceptedRanges() {
    while (this.unsorted.length > 0) {
      const currentRange = this.unsorted.pop();
      const prevWorkflow = currentRange.workflow;
      const workflow = workflows[prevWorkflow];
      let isSorted = false;

      for (const condition of workflow.conditions) {
        if (condition.attribute !== currentRange.attribute) continue;

        const splitRanges = this.splitRange(currentRange, condition.limit, condition.operator, condition.nextWorkflow);

        if (splitRanges.length > 1) {
          if (splitRanges[1].workflow === 'A' || splitRanges[1].workflow === 'R') {
            this.sorted.push(splitRanges[1]);
          } else {
            this.unsorted.push(splitRanges[1]);
          }
        }

        if (splitRanges[0].workflow === 'A' || splitRanges[0].workflow === 'R') {
          this.sorted.push(splitRanges[0]);
          isSorted = true;
          break;
        } else if (currentRange.workflow !== prevWorkflow) {
          this.unsorted.push(splitRanges[0]);
          isSorted = true;
          break;
        }
      }

      if (isSorted) continue;
      currentRange.workflow = workflow.nextWorkflow;

      if (currentRange.workflow === 'A' || currentRange.workflow === 'R') {
        this.sorted.push(currentRange);
      } else {
        this.unsorted.push(currentRange);
      }
    }
    console.log(this);
  }

  calculateCombinations() {
    let result = 0n;
    let x = 4000n;
    let m = 4000n;
    let a = 4000n;
    let s = 4000n;

    for (const range of this.sorted) {
      const currentRange = BigInt(range.end) - BigInt(range.start) + 1n;

      switch (range.attribute) {
        case 'x':
          if (range.workflow === 'A') result += (currentRange * m * a * s);
          x -= currentRange;
          break;
        case 'm':
          if (range.workflow === 'A') result += (currentRange * x * a * s);
          m -= currentRange;
          break;
        case 'a':
          if (range.workflow === 'A') result += (currentRange * x * m * s);
          a -= currentRange;
          break;
        case 's':
          if (range.workflow === 'A') result += (currentRange * x * m * a);
          s -= currentRange;
          break;
      }
    }
    return result;
  }
}

class PartRange {
  constructor(xStart, xEnd, mStart, mEnd, aStart, aEnd, sStart, sEnd) {
    this.x = [xStart, xEnd];
    this.m = [mStart, mEnd];
    this.a = [aStart, aEnd];
    this.s = [sStart, sEnd];
  }

  copy() {
    return new PartRange(this.x[0], this.x[1], this.m[0], this.m[1], this.a[0], this.a[1], this.s[0], this.s[1]);
  }

  get [Symbol.toStringTag]() {
    return `PartRange { x: ${this.x}, m: ${this.m}, a: ${this.a}, s: ${this.s} }`;
  }
}

function splitPartRange(partRange, condition) {
  const start = partRange[condition.attribute][0];
  const end = partRange[condition.attribute][1];

  const leftoverPartRange = partRange.copy()
  if (condition.operator === '<') {
    if (end < condition.limit) return [partRange, undefined];
    if (condition.limit < start) return [undefined, leftoverPartRange];
    partRange[condition.attribute][1] = condition.limit - 1;
    leftoverPartRange[condition.attribute][0] = condition.limit;
    return [partRange, leftoverPartRange];
  } else if (condition.operator === '>') {
    if (condition.limit < start) return [partRange, undefined];
    if (end < condition.limit) return [undefined, leftoverPartRange];
    partRange[condition.attribute][0] = condition.limit + 1;
    leftoverPartRange[condition.attribute][1] = condition.limit;
    return [partRange, leftoverPartRange];
  }
}

const acceptedRanges = [];
const rejectedRanges = [];

function workflowRanges() {
  let partRangeSum = 0;

  function recursiveHelper(partRange, currWorkflowName) {
    const {x, m, a, s} = {...partRange};
    if (currWorkflowName === 'A') {
      acceptedRanges.push(partRange);
      partRangeSum += (
        (x[1] - x[0] + 1) *
        (m[1] - m[0] + 1) *
        (a[1] - a[0] + 1) *
        (s[1] - s[0] + 1)
      );
      return;
    } else if (currWorkflowName === 'R') {
      rejectedRanges.push(partRange);
      return;
    }

    const currWorkflow = workflows[currWorkflowName];

    for (const condition of currWorkflow.conditions) {
      if (condition.limit <= partRange[condition.attribute][1] &&
          condition.limit >= partRange[condition.attribute][0]) {

        const newPartRanges = splitPartRange(partRange, condition);
        const [newPartRange, leftoverPartRange] = newPartRanges;

        if (newPartRange) recursiveHelper(newPartRange, condition.nextWorkflow);

        if (leftoverPartRange) {
          partRange = leftoverPartRange;
        } else {
          partRange = undefined;
          break;
        }
      }
    }
    if (partRange) recursiveHelper(partRange, currWorkflow.nextWorkflow)
  }

  recursiveHelper(new PartRange(1, 4000, 1, 4000, 1, 4000, 1, 4000), 'in');

  return partRangeSum;
}

// Old approach, didn't work
// const attributeRanges = new AttributeRanges();
// attributeRanges.acceptedRanges();
// const answer2 = attributeRanges.calculateCombinations();

const answer2 = workflowRanges();
console.log({answer2});
