import { createShader, createProgram, setupSlider } from "./utility/webgl.js";
import { mat4 } from "./utility/matrix.js";
import BaseObject from "./classes/object.js";
import { radianToDegree, degreeToRadian } from "./utility/math.js";

function main() {
    let canvas = document.getElementById("canvas");
    let gl = canvas.getContext("webgl");
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
    gl.enable(gl.DEPTH_TEST);

    // dummy object
    let hollow_cube = new BaseObject();
    hollow_cube.initCube();
    let vertices = hollow_cube.getFlattenVertices();
    let colors = hollow_cube.getFlattenColor();

    let rotation = [degreeToRadian(30), degreeToRadian(30), degreeToRadian(0)];

    function updateRotation(angle) {
        return function (event, newState) {
            let degree = newState.value
            var angleRadian = (degree * Math.PI) / 180;
            rotation[angle] = angleRadian;
        };
    }

    setupSlider("#angleX", {
        name: "angle x",
        value: radianToDegree(rotation[0]),
        slideFunction: updateRotation(0),
        max: 360,
        min: 0,
    });
    setupSlider("#angleY", {
        name: "angle y",
        value: radianToDegree(rotation[1]),
        slideFunction: updateRotation(1),
        max: 360,
        min: 0,
    });
    setupSlider("#angleZ", {
        name: "angle z",
        value: radianToDegree(rotation[2]),
        slideFunction: updateRotation(2),
        max: 360,
        min: 0,
    });

    let size = 4; // 4 components per iteration
    let type = gl.FLOAT; // the data is 32bit floats
    let normalize = false; // don't normalize the data
    let stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    let offset = 0; // start at the beginning of the buffer

    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    let vertexPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(
        vertexPosition,
        size,
        type,
        normalize,
        stride,
        offset
    );
    gl.enableVertexAttribArray(vertexPosition);

    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    let vertexColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vertexColor, size, type, normalize, stride, offset);
    gl.enableVertexAttribArray(vertexColor);

    let matrixLocation = gl.getUniformLocation(program, "uMatrix");

    render();

    function render() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        let matrix = mat4.identity();
        matrix = mat4.xRotate(matrix, rotation[0]);
        matrix = mat4.yRotate(matrix, rotation[1]);
        matrix = mat4.zRotate(matrix, rotation[2]);

        gl.uniformMatrix4fv(matrixLocation, false, matrix);

        gl.drawArrays(gl.TRIANGLES, 0, vertices.length);
        requestAnimationFrame(render);
    }
}

window.onload = main();
