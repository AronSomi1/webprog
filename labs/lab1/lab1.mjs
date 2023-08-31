'use strict';
/**
 * Reflection question 1
 * your answer goes here
 */

import inventory from './inventory.mjs';
import { v4 as uuidv4 } from 'uuid';
console.log('\n=== beginning of printout ================================')
console.log('inventory:', inventory);

console.log('\n--- Object.keys() ---------------------------------------')
const names = Object.keys(inventory);
Object.entries(inventory).filter
names
  .sort((a, b) => a.localeCompare(b, "sv", { sensitivity: 'case' }))
  .forEach(name => console.log(name));

console.log('\n--- for ... in ---------------------------------------')
for (const name in inventory) {
  console.log(name);
}
/**
 * Reflection question 2
 */

console.log('\n--- Assignment 1 ---------------------------------------')

function makeOptions(inv, prop) {
  return Object.entries(inv)
    .filter(e => e[1][prop])
    .map(e => `<option value="${e[0]}" key="${e[0]}"> ${e[0]}, ${e[1].price} kr</option>`)
    .reduce((prev, current) => prev + '\n' + current);
}

console.log(makeOptions(inventory, 'foundation'));

console.log('\n--- Assignment 2 ---------------------------------------')

class Salad {
  static #instanceCounter = 0

  constructor(other) {
    if (other instanceof Salad) {
      this.ingredients = { ...other.ingredients }
    } else {
      this.ingredients = {}
    }
    this.id = 'salad_' + Salad.#instanceCounter++
    this.uuid = uuidv4();
  }
  add(name, properties) { this.ingredients[name] = properties; return this }
  remove(name) { delete this.ingredients[name]; return this }
  static parse(json) {
    if (typeof json == 'string') {
      let other = JSON.parse(json)
      if (Array.isArray(other)) {
        return other.map(obj => Object.assign(new Salad(), obj))
      } else {
        return Object.assign(new Salad(), other)
      }
    }
  }
}

let myCaesarSalad = new Salad()
  .add('Sallad', inventory['Sallad'])
  .add('Kycklingfilé', inventory['Kycklingfilé'])
  .add('Bacon', inventory['Bacon'])
  .add('Krutonger', inventory['Krutonger'])
  .add('Parmesan', inventory['Parmesan'])
  .add('Ceasardressing', inventory['Ceasardressing'])
  .add('Gurka', inventory['Gurka']);
console.log(JSON.stringify(myCaesarSalad) + '\n');
myCaesarSalad.remove('Gurka');
console.log(JSON.stringify(myCaesarSalad) + '\n');

console.log('\n--- Assignment 3 ---------------------------------------')

Salad.prototype.getPrice = function () {
  return Object.values(this.ingredients).reduce((prev, { price }) => prev + price, 0)
}

Salad.prototype.count = function (property) {
  return Object.values(this.ingredients).filter(ingredient => ingredient[property]).length
}

console.log('En ceasarsallad kostar ' + myCaesarSalad.getPrice() + 'kr');
// En ceasarsallad kostar 45kr
console.log('En ceasarsallad har ' + myCaesarSalad.count('lactose') + ' ingredienser med laktos');
// En ceasarsallad har 2 ingredienser med laktos
console.log('En ceasarsallad har ' + myCaesarSalad.count('extra') + ' tillbehör');
// En ceasarsallad har 3 tillbehör


console.log('\n--- reflection question 3 ---------------------------------------')
console.log('typeof Salad: ' + typeof Salad);
console.log('typeof Salad.prototype: ' + typeof Salad.prototype);
console.log('typeof Salad.prototype.prototype: ' + typeof Salad.prototype.prototype);
console.log('typeof myCaesarSalad: ' + typeof myCaesarSalad);
console.log('typeof myCaesarSalad.prototype: ' + typeof myCaesarSalad.prototype);
console.log('check 1: ' + (Salad.prototype === Object.getPrototypeOf(Salad)));
console.log('check 2: ' + (Salad.prototype === Object.getPrototypeOf(myCaesarSalad)));
console.log('check 3: ' + (Object.prototype === Object.getPrototypeOf(Salad.prototype)));

console.log('\n--- Assignment 4 ---------------------------------------')

const singleText = JSON.stringify(myCaesarSalad);
const arrayText = JSON.stringify([myCaesarSalad, myCaesarSalad]);

const objectCopy = new Salad(myCaesarSalad);
const singleCopy = Salad.parse(singleText);
const arrayCopy = Salad.parse(arrayText);

console.log('original myCaesarSalad\n' + JSON.stringify(myCaesarSalad));
console.log('new(myCaesarSalad)\n' + JSON.stringify(objectCopy));
console.log('Salad.parse(singleText)\n' + JSON.stringify(singleCopy));
console.log('Salad.parse(arrayText)\n' + JSON.stringify(arrayCopy));

singleCopy.add('Gurka', inventory['Gurka']);
console.log('originalet kostar ' + myCaesarSalad.getPrice() + ' kr');
console.log('kopian med gurka kostar ' + singleCopy.getPrice() + ' kr');

console.log('\n--- Assignment 5 ---------------------------------------')

class GourmetSalad extends Salad {
  constructor(other) {
    super(other)
  }
  add(name, properties, size = 1) {
    if (this.ingredients[name]) {
      this.ingredients[name].size += size
    } else {
      let propertiesWithSize = { ...properties, size: size }
      super.add(name, propertiesWithSize)
    }
    return this
  }
}

GourmetSalad.prototype.getPrice = function () {
  return Object.values(this.ingredients).reduce((prev, { price, size }) => prev + price * size, 0)
}


let myGourmetSalad = new GourmetSalad()

myGourmetSalad
  .add('Sallad', inventory['Sallad'], 0.5)
  .add('Kycklingfilé', inventory['Kycklingfilé'], 2)
  .add('Bacon', inventory['Bacon'], 0.5)
  .add('Krutonger', inventory['Krutonger'])
  .add('Parmesan', inventory['Parmesan'], 2)
  .add('Ceasardressing', inventory['Ceasardressing']);

console.log('Min gourmetsallad med lite bacon kostar ' + myGourmetSalad.getPrice() + ' kr');
myGourmetSalad.add('Bacon', inventory['Bacon'], 1)
console.log('Med extra bacon kostar den ' + myGourmetSalad.getPrice() + ' kr');

console.log('\n--- Assignment 6 ---------------------------------------')

console.log('Min gourmetsallad har id: ' + myGourmetSalad.id);
console.log('Min gourmetsallad har uuid: ' + myGourmetSalad.uuid);


/**
 * Reflection question 4
 */
/**
 * Reflection question 5
 */
/**
 * Reflection question 6
 */
