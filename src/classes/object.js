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

    initHollowPrism() {
        // Define the vertices of the triangles for the outer prism
        let outerVertices = [       
            [-0.5, -0.5, -0.5], // bottom left back
            [0.5, -0.5, -0.5], // bottom right back
            [0, 0.5, -0.5], // top back
            [-0.5, -0.5, 0.5], // bottom left front
            [0.5, -0.5, 0.5], // bottom right front
            [0, 0.5, 0.5], // top front
        ];
    
        // Define the vertices of the triangles for the inner prism
        let innerVertices = [        
            [-0.3, -0.3, -0.3], // inner bottom left back
            [0.3, -0.3, -0.3], // inner bottom right back
            [0, 0.3, -0.3], // inner top back
            [-0.3, -0.3, 0.3], // inner bottom left front
            [0.3, -0.3, 0.3], // inner bottom right front
            [0, 0.3, 0.3], // inner top front
        ];
    
        // Define the colors of each vertex
        let vertexColors = [        
            [1.0, 0.0, 0.0, 1.0], // red
            [1.0, 1.0, 0.0, 1.0], // yellow
            [0.0, 1.0, 0.0, 1.0], // green
            [0.0, 0.0, 1.0, 1.0], // blue
            [1.0, 0.0, 1.0, 1.0], // magenta
            [0.0, 1.0, 1.0, 1.0], // cyan
        ];
    
        // Define the indices of each triangle for the outer prism
        let indices = [
            -0.3, -0.3, -0.3, // inner bottom left back
            0.3, -0.3, -0.3, // inner bottom right back
            0, 0.3, -0.3, // inner top back
            -0.3, -0.3, 0.3, // inner bottom left front
            0.3, -0.3, 0.3, // inner bottom right front
            0, 0.3, 0.3, // inner top front
        ]
    

        
        for (let i = 0; i < indices.length; i += 3) {
            for (let j = 0; j < 3; j++) {
                let [x1, y1, z1] = outerVertices[indices[i]];
                let [x2, y2, z2] = outerVertices[indices[i + 1]];
                let [x3, y3, z3] = outerVertices[indices[i + 2]];
    
                let point1 = new Point(x1, y1, z1);
                let point2 = new Point(x2, y2, z2);
                let point3 = new Point(x3, y3, z3);
    
                let color1 = new Color(...vertexColors[indices[i]]);
                let color2 = new Color(...vertexColors[indices[i + 1]]);
                let color3 = new Color(...vertexColors[indices[i + 2]]);
    
                this.vertices.push(point1, point2, point3);
                this.colors.push(color1, color2, color3);
            }
        }


    }

    initRandomHollow() {
        let vertices = [
            // outer horizontal left back
            [-0.5, 0, -0.5],
            // outer horizontal right back
            [0.5, 0, -0.5],
            // outer horizontal right front
            [0.5, 0, 0.5],
            // outer horizontal left front
            [-0.5, 0, 0.5],

            // inner horizontal left back
            [-0.4, 0, -0.4],
            // inner horizontal right back
            [0.4, 0, -0.4],
            // inner horizontal right front
            [0.4, 0, 0.4],
            // inner horizontal left front
            [-0.4, 0, 0.4],

            // outer vertical top
            [0, 0.5, 0],
            // outer vertical right
            [0.5, 0, 0],
            // outer vertical bottom
            [0, -0.5, 0],
            // outer vertical left
            [-0.5, 0, 0],


            // inner vertical top
            [0, 0.4, 0],
            // inner vertical right
            [0.4, 0, 0],
            // inner vertical bottom
            [0, -0.4, 0],
            // inner vertical left
            [-0.4, 0, 0],

            // outer diagonal top left
            // [-0.5, 0, -0.5],


        ]

        let colors = [
            [0.0, 0.0, 0.0, 1.0], // black
            [1.0, 0.0, 0.0, 1.0], // red
            [1.0, 1.0, 0.0, 1.0], // yellow
            [0.0, 1.0, 0.0, 1.0], // green
            [0.0, 0.0, 1.0, 1.0], // blue
            [1.0, 0.0, 1.0, 1.0], // magenta
            [0.0, 1.0, 1.0, 1.0], // cyan
            [1.0, 1.0, 1.0, 1.0], // white
            [0.0, 0.0, 0.0, 1.0], // black
            [1.0, 0.0, 0.0, 1.0], // red
            [1.0, 1.0, 0.0, 1.0], // yellow
            [0.0, 1.0, 0.0, 1.0], // green
            [0.0, 0.0, 1.0, 1.0], // blue
            [1.0, 0.0, 1.0, 1.0], // magenta
            [0.0, 1.0, 1.0, 1.0], // cyan
            [1.0, 1.0, 1.0, 1.0], // white

        ]

        let indices = [
            0, 1, 5, 0, 5, 4,
            1, 2, 6, 1, 6, 5,
            2, 3, 7, 2, 7, 6,
            3, 0, 4, 3, 4, 7,

            8, 9, 13, 8, 13, 12,
            9, 10, 14, 9, 14, 13,
            10, 11, 15, 10, 15, 14,
            11, 8, 12, 11, 12, 15,


        ]

        for (let i = 0; i < indices.length; i += 3) {
            for (let j = 0; j < 3; j++) {
                let [x1, y1, z1] = vertices[indices[i]];
                let [x2, y2, z2] = vertices[indices[i + 1]];
                let [x3, y3, z3] = vertices[indices[i + 2]];
    
                let point1 = new Point(x1, y1, z1);
                let point2 = new Point(x2, y2, z2);
                let point3 = new Point(x3, y3, z3);
    
                let color1 = new Color(...colors[indices[i]]);
                let color2 = new Color(...colors[indices[i + 1]]);
                let color3 = new Color(...colors[indices[i + 2]]);
    
                this.vertices.push(point1, point2, point3);
                this.colors.push(color1, color2, color3);
            }
        }

    }
}
