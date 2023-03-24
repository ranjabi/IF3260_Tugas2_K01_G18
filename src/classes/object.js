import Point from "./vertex.js";
import Color from "./color.js";
import { mat4 } from "../utility/matrix.js";

/**
 * @class ObjectModel
 */
export default class BaseObject {
    constructor(vertices = [], colors = [], normals = []) {
        this.vertices = vertices;
        this.normals = normals;
        this.colors = colors;
    }

    getVertices() {
        return this.vertices;
    }

    getNormals() {
        return this.normals;
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

    getFlattenNormals() {
        let flattenNormals = [];
        for (let i = 0; i < this.normals.length; i++) {
            flattenNormals.push(this.normals[i].x);
            flattenNormals.push(this.normals[i].y);
            flattenNormals.push(this.normals[i].z);
        }
        return flattenNormals;
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

            // for each plane in rectangle (6 plane)
            for (let j = 0; j < vertices.length / 8; j++) {
                // for each point in rectangle
                for (let i = 0; i < indices.length; i=i+3) {

                    let vector1 = mat4.substraction(
                        vertices[indices[i+2] + 8 * j],
                        vertices[indices[i+1] + 8 * j]
                    )

                    let vector2 = mat4.substraction(
                        vertices[indices[i] + 8 * j], 
                        vertices[indices[i+1] + 8 * j]
                    )

                    let cross = mat4.cross(vector1, vector2)
                    let normalize = mat4.normalize(cross)
                    let [nX, nY, nZ] = normalize
                    let normals = new Point(nX, nY, nZ)

                    self.normals.push(normals)
                    self.normals.push(normals)
                    self.normals.push(normals)

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
            
            let delta = 0.6; // cube size
            let point = 0.3; // x y z point reference,
            let outputPoints = [];
            
            // top right front
            generate_cube_points([-point, point, -point], outputPoints, {xdelta: delta});
            generate_cube_points([-point, point, -point], outputPoints, {ydelta: 0});
            generate_cube_points([-point, point, -point], outputPoints, {zdelta: delta});
            
            // top left front
            generate_cube_points([point, point, -point], outputPoints, {xdelta: 0});
            generate_cube_points([point, point, -point], outputPoints, {ydelta: 0});
            generate_cube_points([point, point, -point], outputPoints, {zdelta: delta});
            
            // bottom left front
            generate_cube_points([point, -point, -point], outputPoints, {xdelta: 0});
            generate_cube_points([point, -point, -point], outputPoints, {ydelta: delta});
            generate_cube_points([point, -point, -point], outputPoints, {zdelta: delta});
            
            // bottom right front
            generate_cube_points([-point, -point, -point], outputPoints, {xdelta: delta});
            generate_cube_points([-point, -point, -point], outputPoints, {ydelta: delta});
            generate_cube_points([-point, -point, -point], outputPoints, {zdelta: delta});
            
            // top right back
            generate_cube_points([-point, point, point], outputPoints, {xdelta: delta});
            
            // bottom right back
            generate_cube_points([-point, -point, point], outputPoints, {xdelta: delta});
            generate_cube_points([-point, -point, point], outputPoints, {ydelta: delta});
            
            // bottom left back
            generate_cube_points([point, -point, point], outputPoints, {ydelta: delta+0.1});
    
            return outputPoints
        }   
    }


    initRandomHollow() {
        let vertices = [
            // outer horizontal left back top 0
            [-0.5, 0, -0.5],
            // outer horizontal right back top 1
            [0.5, 0, -0.5],
            // outer horizontal right front top
            [0.5, 0, 0.5],
            // outer horizontal left front
            [-0.5, 0, 0.5],

            // inner horizontal left back top 4
            [-0.4, 0, -0.4],
            // inner horizontal right back top
            [0.4, 0, -0.4],
            // inner horizontal right front top
            [0.4, 0, 0.4],
            // inner horizontal left front top
            [-0.4, 0, 0.4],

            // outer horizontal left back bottom 8
            [-0.5, -0.1, -0.5],
            // outer horizontal right back bottom
            [0.5, -0.1, -0.5],
            // outer horizontal right front bottom
            [0.5, -0.1, 0.5],
            // outer horizontal left front bottom
            [-0.5, -0.1, 0.5],

            // inner horizontal left back bottom 12
            [-0.4, -0.1, -0.4],
            // inner horizontal right back bottom
            [0.4, -0.1, -0.4],
            // inner horizontal right front bottom
            [0.4, -0.1, 0.4],
            // inner horizontal left front bottom
            [-0.4, -0.1, 0.4],


            // outer vertical top front 16
            [0, 0.5, 0],
            // outer vertical right front
            [0.5, 0, 0],
            // outer vertical bottom front
            [0, -0.5, 0],
            // outer vertical left front
            [-0.5, 0, 0],


            // inner vertical top front 20
            [0, 0.4, 0],
            // inner vertical right top front
            [0.4, 0, 0],
            // inner vertical bottom bottom front
            [0, -0.4, 0],
            // inner vertical left bottom front
            [-0.4, 0, 0],

            // outer vertical top back 24
            [0, 0.5, -0.1],
            // outer vertical right back
            [0.5, 0, -0.1],
            // outer vertical bottom back
            [0, -0.5, -0.1],
            // outer vertical left back
            [-0.5, 0, -0.1],

            // inner vertical top back 28
            [0, 0.4, -0.1],
            // inner vertical right back
            [0.4, 0, -0.1],
            // inner vertical bottom back
            [0, -0.4, -0.1],
            // inner vertical left back
            [-0.4, 0, -0.1],
            

            // outer diagonal top left front 32
            [-0.5, 0.5, -0.5],
            // outer diagonal top right front
            [0.5, 0.5, 0.5],
            // outer diagonal bottom right front
            [0.5, -0.5, 0.5],
            // outer diagonal bottom left front
            [-0.5, -0.5, -0.5],

            // outer diagonal top left back 36
            [-0.5, 0.5, -0.6],
            // outer diagonal top right back
            [0.5, 0.5, 0.4],
            // outer diagonal bottom right back
            [0.5, -0.5, 0.4],
            // outer diagonal bottom left back
            [-0.5, -0.5, -0.6],

            // inner diagonal top left front 40
            [-0.4, 0.4, -0.4],
            // inner diagonal top right front
            [0.4, 0.4, 0.4],
            // inner diagonal bottom right front
            [0.4, -0.4, 0.4],
            // inner diagonal bottom left front
            [-0.4, -0.4, -0.4],

            // inner diagonal top left back 44
            [-0.4, 0.4, -0.5],
            // inner diagonal top right back
            [0.4, 0.4, 0.3],
            // inner diagonal bottom right back
            [0.4, -0.4, 0.3],
            // inner diagonal bottom left back
            [-0.4, -0.4, -0.5],




        ]

        let colors = [
            [0.0, 0.0, 0.0, 1.0], // black
            [1.0, 0.0, 0.0, 1.0], // red
            [1.0, 1.0, 0.0, 1.0], // yellow
            [0.0, 1.0, 0.0, 1.0], // green
            [0.0, 0.0, 1.0, 1.0], // blue
            [1.0, 0.0, 1.0, 1.0], // magenta
        ]

        let indices = [
            0, 1, 5, 0, 5, 4,
            1, 2, 6, 1, 6, 5,
            2, 3, 7, 2, 7, 6,
            3, 0, 4, 3, 4, 7,
            0, 8, 9, 0, 9, 1,
            1, 9, 10, 1, 10, 2,
            2, 10, 11, 2, 11, 3,
            3, 11, 8, 3, 8, 0,
            8, 9, 13, 8, 13, 12,
            9, 10, 14, 9, 14, 13,
            10, 11, 15, 10, 15, 14,
            11, 8, 12, 11, 12, 15,

            16, 17, 21, 16, 21, 20,
            17, 18, 22, 17, 22, 21,
            18, 19, 23, 18, 23, 22,
            19, 16, 20, 19, 20, 23,
            16, 24, 25, 16, 25, 17,
            17, 25, 26, 17, 26, 18,
            18, 26, 27, 18, 27, 19,
            19, 27, 24, 19, 24, 16,
            24, 25, 29, 24, 29, 28,
            25, 26, 30, 25, 30, 29,
            26, 27, 31, 26, 31, 30,
            27, 24, 28, 27, 28, 31,

            32, 33, 37, 32, 37, 36,
            33, 34, 38, 33, 38, 37,
            34, 35, 39, 34, 39, 38,
            35, 32, 36, 35, 36, 39,
            32, 40, 41, 32, 41, 33,
            33, 41, 42, 33, 42, 34,
            34, 42, 43, 34, 43, 35,
            35, 43, 40, 35, 40, 32,
            40, 41, 45, 40, 45, 44,
            41, 42, 46, 41, 46, 45,
            42, 43, 47, 42, 47, 46,
            43, 40, 44, 43, 44, 47,
        ]

        for (let i = 0; i < indices.length; i += 3) {
            for (let j = 0; j < 3; j++) {
                let [x1, y1, z1] = vertices[indices[i]];
                let [x2, y2, z2] = vertices[indices[i + 1]];
                let [x3, y3, z3] = vertices[indices[i + 2]];
    
                let point1 = new Point(x1, y1, z1);
                let point2 = new Point(x2, y2, z2);
                let point3 = new Point(x3, y3, z3);
    
                let color1 = new Color(...colors[indices[j]]);
                let color2 = new Color(...colors[indices[j + 1]]);
                let color3 = new Color(...colors[indices[j + 2]]);
    
                this.vertices.push(point1, point2, point3);
                this.colors.push(color1, color2, color3);
            }
        }

    }
}
