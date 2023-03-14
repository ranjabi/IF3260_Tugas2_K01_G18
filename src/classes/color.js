/**
 * @class Color
 * @property {number} r
 * @property {number} g
 * @property {number} b
 * @property {number} a
 */
export default class Color {
    /**
     * 
     * @param {number} r 
     * @param {number} g 
     * @param {number} b 
     * @param {number} a
     */
    constructor(r, g, b, a=1.0) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
}