import Point from "./vertex.js";
import Color from "./color.js";

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

    initCube() {
        let self = this
        
        // create a cube using 6 rectangles following right hand rule
        quad(1, 0, 3, 2, self);
        quad(2, 3, 7, 6, self);
        quad(3, 0, 4, 7, self);
        quad(6, 5, 1, 2, self);
        quad(4, 5, 6, 7, self);
        quad(5, 4, 0, 1, self);


        function quad(a, b, c, d, self) {
            // create a rectangle using indices of the vertices
            // follows right hand rule
            let indices = [a, b, c, a, c, d];
            let vertices = cubeBaseVertices();
    
            let vertexColors = [
                [0.0, 0.0, 0.0, 1.0], // black
                [1.0, 0.0, 0.0, 1.0], // red
                [1.0, 1.0, 0.0, 1.0], // yellow
                [0.0, 1.0, 0.0, 1.0], // green
                [0.0, 0.0, 1.0, 1.0], // blue
                [1.0, 0.0, 1.0, 1.0], // magenta
                [0.0, 1.0, 1.0, 1.0], // cyan
                [1.0, 1.0, 1.0, 1.0], // white
            ];
    
            for (let j = 0; j < vertices.length / 8; j++) {
                for (let i = 0; i < indices.length; ++i) {
                    let [x, y, z] = vertices[indices[i] + 8 * j];
                    let point = new Point(x, y, z);
                    let color = new Color(...vertexColors[a])
                    self.vertices.push(point);
                    self.colors.push(color);
                }
            }
        }
    
        function cubeBaseVertices() {
            // xdelta, ydelta, zdelta is the length of x, y, z axis of the cube
            function generate_cube_points(
                bottom_left_front,
                outputPoints,
                { xdelta = 0.1, ydelta = 0.1, zdelta = 0.1 }
            ) {
                // bottom_left_front is an array of the x, y, and z coordinates of the bottom left front corner of the cube
                let [x, y, z] = bottom_left_front;
            
                // generate the coordinates for the 8 points of the cube
                let points = [
                    [x, y, z],
                    [x + xdelta, y, z],
                    [x + xdelta, y, z + zdelta],
                    [x, y, z + zdelta],
                    [x, y + ydelta, z],
                    [x + xdelta, y + ydelta, z],
                    [x + xdelta, y + ydelta, z + zdelta],
                    [x, y + ydelta, z + zdelta],
                ];
            
                for (let point of points) {
                    let _x = point[0].toFixed(2);
                    let _y = point[1].toFixed(2);
                    let _z = point[2].toFixed(2);
                    outputPoints.push([_x, _y, _z]);
                }
                return points;
            }
            
            let delta = 0.4; // cube size
            let point = 0.3; // x y z point reference,
            let outputPoints = [];
            
            // top left front
            generate_cube_points([-point, point, -point], outputPoints, {xdelta: delta});
            generate_cube_points([-point, point, -point], outputPoints, {ydelta: -delta});
            generate_cube_points([-point, point, -point], outputPoints, {zdelta: delta});
            
            //top right front
            generate_cube_points([point, point, -point], outputPoints, {xdelta: -delta});
            generate_cube_points([point, point, -point], outputPoints, {ydelta: -delta});
            generate_cube_points([point, point, -point], outputPoints, {zdelta: delta});
            
            // bottom right front
            generate_cube_points([point, -point, -point], outputPoints, {xdelta: -delta});
            generate_cube_points([point, -point, -point], outputPoints, {ydelta: delta});
            generate_cube_points([point, -point, -point], outputPoints, {zdelta: delta});
            
            // bottom left front
            generate_cube_points([-point, -point, -point], outputPoints, {xdelta: delta});
            generate_cube_points([-point, -point, -point], outputPoints, {ydelta: delta});
            generate_cube_points([-point, -point, -point], outputPoints, {zdelta: delta});
            
            // top right back
            generate_cube_points([point+0.1, point, point], outputPoints, {xdelta: -delta});
            generate_cube_points([point, point, point], outputPoints, {ydelta: -delta});
            generate_cube_points([point, point, point], outputPoints, {zdelta: -delta});
            
            // top left back
            generate_cube_points([-point, point, point], outputPoints, {xdelta: delta});
            generate_cube_points([-point, point, point], outputPoints, {ydelta: -delta});
            generate_cube_points([-point, point, point], outputPoints, {zdelta: -delta});
            
            // bottom left back
            generate_cube_points([-point, -point, point], outputPoints, {xdelta: delta});
            generate_cube_points([-point, -point, point], outputPoints, {ydelta: delta});
            generate_cube_points([-point, -point, point], outputPoints, {zdelta: -delta});
            
            // bottom right back
            generate_cube_points([point, -point, point], outputPoints, {xdelta: -delta});
            generate_cube_points([point, -point, point], outputPoints, {ydelta: delta});
            generate_cube_points([point, -point, point], outputPoints, {zdelta: -delta});
    
            return outputPoints
        }
    }
}
