'use strict';
/**
 * Reflection question 1
 * your answer goes here
 * Trying to get the value of a property that is not present in an Object literal
 * will return undefined, which evalueates to false, so it is not necessary to 
 * assign a value
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
 * The different loops will give different outputs if the values in inventory are 
 * not Enumerable. If there is a property that has a false Enumerable value it will be
 * skipped by the for in statement, but printed by the other. 
 */

console.log('\n--- Assignment 1 ---------------------------------------')

function makeOptions(inv, prop) {
  return Object.entries(inv)
    .filter(([k, v]) => v[prop])
    .map(([k, v]) => `<option value="${k}" key="${k}"> ${k}, ${v.price} kr</option>`)
    .reduce((ack, val) => ack + '\n' + val);
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
  return Object.values(this.ingredients).reduce((ack, { price }) => ack + price, 0)
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

/** How are classes and inherited properties represented in JavaScript?
 *
 * What is the type and value of: 
 * Salad : function
 * Salad.prototype : Object 
 * Salad.prototype.prototype : undefined 
 * myCaesarSalad : object 
 * myCaesarSalad.prototype : undefined
 * 
 * What is the difference between an object’s prototype chain and having a prototype
 * property? 
 * An objects prototype chain is a chain of objects that are linked to the object
 * where functions it can call (functions it inherits) are found. 
 * Object literals and instance objects do not have a prototype property
 * Constructor Function objects do have a prototype property 
 * 
 * Which objects have a prototype property? 
 * Functions objects except methods, arrow functions or async functions 
 * How do you get the next object in the prototype chain?
 * Object.prototype or perhaps Object.getPrototypeOf(object)
 */

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
  return Object.values(this.ingredients).reduce((ack, { price, size }) => ack + price * size, 0)
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
 * In which object are static properties stored?
 * Static properties are stored on the class function itself, and not on the 
 * prototype property. 
 */
/**
 * Reflection question 5
 * Can you make the id property read only?
 * No
 */
/**
 * Reflection question 6
 * Can properties be private?
 * No, there are ways (using the # prefix) to make private class members, 
 * but this is just syntaxical sugar
 * 
 * This is the same as using closures to hide attributes
 */

