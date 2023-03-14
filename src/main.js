import { createShader, createProgram } from "./utility.js";
import HollowCube from "./classes/hollow_cube.js";

// global variables
let gl;
let vertices;
let colors;

function main () {
    let canvas = document.getElementById("canvas");
    gl = canvas.getContext("webgl");
    if (!gl) {
        alert("webgl not supported");
        return;
    }
    let vertexShaderSource = document.getElementById("vertex-shader").text;
    let fragmentShaderSource = document.getElementById("fragment-shader").text;

    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader = createShader(
        gl,
        gl.FRAGMENT_SHADER,
        fragmentShaderSource
    );

    let program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    // dummy object
    let hollow_cube = new HollowCube();
    hollow_cube.initCube();
    vertices = hollow_cube.getFlattenVertices();
    colors = hollow_cube.getFlattenColor();
    console.log('vertices', vertices, colors, JSON.stringify(hollow_cube));
    
    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    let vertexPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vertexPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosition);

    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    let vertexColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vertexColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexColor);

    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    //
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length);
    requestAnimationFrame(render);
}

window.onload = main();