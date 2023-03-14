export default class Point {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    setPoint(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}