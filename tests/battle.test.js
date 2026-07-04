const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*)<\/script>/);
if (!scriptMatch) throw new Error('Could not find game script in index.html');

const elements = {};
const documentStub = {
  addEventListener() {},
  createElement() {
    return {
      style: {},
      className: '',
      classList: { add() {}, remove() {} },
      appendChild() {},
      addEventListener() {},
      blur() {},
      focus() {},
      setAttribute() {},
      innerText: '',
      innerHTML: '',
      scrollTop: 0,
      scrollHeight: 0,
    };
  },
  getElementById(id) {
    if (!elements[id]) {
      elements[id] = {
        style: {},
        className: '',
        classList: { add() {}, remove() {} },
        appendChild() {},
        addEventListener() {},
        blur() {},
        focus() {},
        setAttribute() {},
        innerText: '',
        innerHTML: '',
        scrollTop: 0,
        scrollHeight: 0,
      };
    }
    return elements[id];
  },
};

const context = vm.createContext({
  console,
  document: documentStub,
  window: { addEventListener() {}, focus() {} },
  setTimeout: () => {},
  clearTimeout: () => {},
  Math,
  Date,
  Array,
  Object,
  Number,
  String,
  Boolean,
});

vm.runInContext(scriptMatch[1], context, { filename: 'index.html' });
const damage = vm.runInContext(
  "GameEngine.calculateDamage({ level: 5, atk: 60 }, { def: 40, types: ['Bio'] }, { type: 'Plasma', power: 70 })",
  context
);

if (!Number.isFinite(damage) || damage <= 0) {
  throw new Error(`Expected a positive damage value, got ${damage}`);
}

console.log(`Combat damage resolved successfully: ${damage}`);
