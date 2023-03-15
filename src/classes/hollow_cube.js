import BaseObject from "./object.js";
import Point from "./vertex.js";
import Color from "./color.js";

export default class HollowCube extends BaseObject {
    constructor(vertices = [], colors = []) {
        super(vertices, colors);
        this.initCube();
    }

    initCube() {
        this.quad(1, 0, 3, 2);
        this.quad(2, 3, 7, 6);
        this.quad(3, 0, 4, 7);
        this.quad(6, 5, 1, 2);
        this.quad(4, 5, 6, 7);
        this.quad(5, 4, 0, 1);
    }

    quad(a, b, c, d) {
        // create a rectangle using indices of the vertices
        // follows right hand rule
        let indices = [a, b, c, a, c, d];
        let vertices = this.baseVertices();

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
                this.vertices.push(point);
                this.colors.push(color);
            }
        }
    }

    baseVertices() {
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
        
        let delta = 0.5; // cube size
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
        generate_cube_points([point, point, point], outputPoints, {xdelta: -delta});
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