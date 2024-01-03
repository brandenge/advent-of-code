// module
//   destination modules

// flipflop module
//   prefix %
//   starts off, toggles between on and off from low pulses
//   ignores high pulses
//   if flipping from off to on, it sends a high pulse
//   if flipping from on to off, it sends a low pulse

// conjunction module
//   prefix &
//   remembers the most recent pulse
//   starts initially by remembering a low pulse for each input
//   after updating any received pulse, it sends a low pulse if all of its inputs' memory are high pulses. Otherwise, it sends a high pulse

// broadcast module (broadcaster)
//   broadcasts any received pulse to all of its destination modules (the same pulse)
//   only one of these

// button module
//   when you push the button, sends a low pulse to the single broadcast module
//   cannot push the button again until all pulses have fully propagated through all modules

// pulses are handled in a breadth-first manner. Need a queue to handle pulses.

const fs = require('fs');

let data;
try {
  data = fs.readFileSync('./20-input.txt', 'utf8').trimEnd();
} catch (err) {
  console.error(err);
}

const inputLines = data.split('\n');

class Module {
  constructor(name, type, destinations) {
    this.name = name;
    this.type = type;
    this.destinations = destinations;
  }

  handlePulse(pulse) {
    pulseQueue.push(pulse);
    if (pulse.type === 'low') lowPulseCount += 1;
    else if (pulse.type === 'high') highPulseCount += 1;

    if (!modules[pulse.destination]) return;
    if (modules[pulse.destination].type === 'conjunction') {
      modules[pulse.destination].lastPulses[pulse.origin] = pulse.type;
    }
  }
}

class ButtonModule extends Module {
  constructor() {
    super('button', 'button', ['broadcaster']);
  }

  pulse() {
    const newPulse = new Pulse('low', 'button', 'broadcaster');
    this.handlePulse(newPulse);
  }
}

class BroadcastModule extends Module {
  constructor(destinations) {
    super('broadcaster', 'broadcaster', destinations);
  }

  pulse(pulse) {
    for (const destination of this.destinations) {
      const newPulse = new Pulse(pulse.type, 'broadcaster', destination);
      this.handlePulse(newPulse);
    }
  }
}

class FlipFlopModule extends Module {
  constructor(name, destinations) {
    super(name, 'flip-flop', destinations);
    this.isOn = false;
  }

  pulse(pulse) {
    if (pulse.type === 'low') {
      this.isOn = !this.isOn;
      let newPulse;
      for (const destination of this.destinations) {
        if (this.isOn) {
          newPulse = new Pulse('high', this.name, destination);
        } else {
          newPulse = new Pulse('low', this.name, destination);
        }
        this.handlePulse(newPulse);
      }
    }
  }
}

class ConjunctionModule extends Module {
  constructor(name, destinations) {
    super(name, 'conjunction', destinations);
    this.lastPulses = {};
  }

  pulse(pulse) {
    this.lastPulses[pulse.origin] = pulse.type;
    const allHighPulses = Object.values(this.lastPulses).every(pulseType => pulseType === 'high');

    for (const destination of this.destinations) {
      let newPulse;
      if (allHighPulses) newPulse = new Pulse('low', this.name, destination);
      else newPulse = new Pulse('high', this.name, destination);
      this.handlePulse(newPulse);
    }
  }

  allLow() {
    return Object.values(this.lastPulses).every(lastPulse => lastPulse === 'low');
  }
}

class Pulse {
  constructor(type, origin, destination) {
    this.type = type;
    this.origin = origin;
    this.destination = destination;
  }
}

function loadModules(inputLines) {
  const modules = { button: new ButtonModule() };

  for (const line of inputLines) {
    let [moduleName, destinations] = line.split(' -> ');
    destinations = destinations.split(', ');
    if (moduleName !== 'broadcaster') {
      let moduleType = moduleName[0];
      moduleName = moduleName.slice(1);
      switch (moduleType) {
        case '%':
          modules[moduleName] = new FlipFlopModule(moduleName, destinations);
          break;
        case '&':
          modules[moduleName] = new ConjunctionModule(moduleName, destinations);
          break;
      }
    } else {
      modules.broadcaster = new BroadcastModule(destinations);
    }
  }

  // Load inputs for conjunction modules
  for (const module of Object.values(modules)) {
    for (const destination of module.destinations) {
      if (!modules[destination]) continue;
      const destinationModule = modules[destination];
      if (destinationModule.type === 'conjunction') {
        destinationModule.lastPulses[module.name] = 'low';
      }
    }
  }

  return modules;
}

// Part One

function countLowAndHighPulses() {
  for (let i = 0; i < 1000; i++) {
    modules.button.pulse();
    while (pulseQueue.length > 0) {
      const currentPulse = pulseQueue.shift();
      if (!modules[currentPulse.destination]) continue;
      modules[currentPulse.destination].pulse(currentPulse);
    }
  }
}

let modules = loadModules(inputLines);
let pulseQueue = [];
let lowPulseCount = 0;
let highPulseCount = 0;

countLowAndHighPulses();

const answer1 = lowPulseCount * highPulseCount;
console.log({answer1});

// Part Two

modules = loadModules(inputLines);
pulseQueue = [];

let buttonPressCount = 0;

const cycles = [];

function powerRXModule() {
  const js = modules.js;
  const zb = modules.zb;
  const bs = modules.bs;
  const rr = modules.rr;

  while(cycles.length < 4) {
    buttonPressCount += 1;
    modules.button.pulse();
    while (pulseQueue.length > 0) {
      const currentPulse = pulseQueue.shift();

      if (currentPulse.destination === 'js') {
        if (js.allLow() && buttonPressCount > 1) cycles.push(buttonPressCount);
      } else if (currentPulse.destination === 'zb') {
        if (zb.allLow() && buttonPressCount > 1) cycles.push(buttonPressCount);
      } else if (currentPulse.destination === 'bs') {
        if (bs.allLow() && buttonPressCount > 1) cycles.push(buttonPressCount);
      } else if (currentPulse.destination === 'rr') {
        if (rr.allLow() && buttonPressCount > 1) cycles.push(buttonPressCount);
      }

      if (!modules[currentPulse.destination]) continue;
      modules[currentPulse.destination].pulse(currentPulse);
    }
  }
}

powerRXModule();

function gcd(a, b) {
  if (!b) return a;
  return gcd(b, a % b);
}

function lcm(a, b) {
  return a * b / gcd(a, b);
}

const answer2 = cycles.reduce((acc, n) => lcm(acc, n));

console.log({cycles});
console.log({answer2});
