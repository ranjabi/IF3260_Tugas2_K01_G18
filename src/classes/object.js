/**
 * @class ObjectModel
 */
export default class BaseObject {
    constructor(vertices = [], colors = []) {
        this.vertices = vertices;
        this.colors = colors;
    }

    getVertices() {
        return this.vertices;
    }

    getColors() {
        return this.colors;
    }

    getFlattenVertices() {
        let flattenVertices = [];
        for (let i = 0; i < this.vertices.length; i++) {
            flattenVertices.push(this.vertices[i].x);
            flattenVertices.push(this.vertices[i].y);
            flattenVertices.push(this.vertices[i].z);
            flattenVertices.push(1.0);
        }
        return flattenVertices;
    }

    getFlattenColor() {
        let flattenColors = [];
        for (let i = 0; i < this.colors.length; i++) {
            flattenColors.push(this.colors[i].r);
            flattenColors.push(this.colors[i].g);
            flattenColors.push(this.colors[i].b);
            flattenColors.push(this.colors[i].a);
        }
        return flattenColors;
    }
}
