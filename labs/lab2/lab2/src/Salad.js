import { v4 as uuidv4 } from 'uuid';

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

Salad.prototype.getPrice = function () {
    return Object.values(this.ingredients).reduce((ack, { price }) => ack + price, 0)
}

Salad.prototype.count = function (property) {
    return Object.values(this.ingredients).filter(ingredient => ingredient[property]).length
}

export default Salad;