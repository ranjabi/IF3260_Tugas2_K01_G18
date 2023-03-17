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

    let translation = {
        xOffset: 0,
        yOffset: 0,
        zOffset: 0
    };

    let scale = 1;

    let perspectiveProjection = {
        fov: 10,
        aspect: gl.canvas.clientWidth / gl.canvas.clientHeight,
        zNear: 1,
        zFar: 10
      }

    function updateRotation(angle) {
        return function (event, newState) {
            let degree = newState.value
            var angleRadian = (degree * Math.PI) / 180;
            rotation[angle] = angleRadian;
        };
    }

    function updateTranslation(axis) {
        return function (event, newState) {
            translation[axis]= newState.value;
        };
    }

    function updateScaling() {
        return function (event, newState) {
            scale = newState.value;
        };
    }

    function updatePerspectiveProjection(axis) {
        return function (event, newState) {
            perspectiveProjection[axis] = newState.value;  
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

    setupSlider("#translationX", {
        name: "translation X",
        value: translation.xOffset,
        slideFunction: updateTranslation("xOffset"),
        max: 1,
        min: -1
    });

    setupSlider("#translationY", {
        name: "translation Y",
        value: translation.yOffset,
        slideFunction: updateTranslation("yOffset"),
        max: 1,
        min: -1
    });

    setupSlider("#translationZ", {
        name: "translation Z",
        value: translation.zOffset,
        slideFunction: updateTranslation("zOffset"),
        max: 1,
        min: -1
    });

    setupSlider("#scaling", {
        name: "scaling",
        value: scale,
        slideFunction: updateScaling(),
        max: 1.5,
        min: 0.5
    });

    setupSlider("#fov", {
        name: "fov",
        value: perspectiveProjection.fov,
        max: 359,
        min: 1,
        slideFunction: updatePerspectiveProjection("fov")
    });

    setupSlider("#zNear", {
        name: "zNear",
        value: perspectiveProjection.zNear,
        max: 50,
        min: 1,
        slideFunction: updatePerspectiveProjection("zNear")
    });

    setupSlider("#zFar", {
        name: "zFar",
        value: perspectiveProjection.zFar,
        max: 50,
        min: 1,
        slideFunction: updatePerspectiveProjection("zFar")
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

        let matrix = mat4.perspective(perspectiveProjection.fov, perspectiveProjection.aspect, perspectiveProjection.zNear, perspectiveProjection.zFar);
        // let matrix = mat4.identity();
        matrix = mat4.xRotate(matrix, rotation[0]);
        matrix = mat4.yRotate(matrix, rotation[1]);
        matrix = mat4.zRotate(matrix, rotation[2]);
        matrix = mat4.translate(matrix, translation.xOffset, translation.yOffset, translation.zOffset);
        matrix = mat4.scale(matrix, scale);

        gl.uniformMatrix4fv(matrixLocation, false, matrix);

        gl.drawArrays(gl.TRIANGLES, 0, vertices.length);
        requestAnimationFrame(render);
    }
}

window.onload = main();
