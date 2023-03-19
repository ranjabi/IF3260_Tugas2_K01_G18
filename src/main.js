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

    let state = {
        rotation: [degreeToRadian(30), degreeToRadian(30), degreeToRadian(0)],
        translation: {
            xOffset: 0,
            yOffset: 0,
            zOffset: 0,
        },
        scale: 1,
        perspectiveProjection: {
            fov: 150,
            aspect: gl.canvas.clientWidth / gl.canvas.clientHeight,
            zNear: 0.2,
            zFar: 2000,
        },
        projectionType: "perspective"
    }

    function computeModelMatrix() {
        var matrix;
        if (state.projectionType == "orthographic") {
            matrix = mat4.orthographic();
        } else if (state.projectionType == "perspective") {
            matrix = mat4.perspective(state.perspectiveProjection.fov, state.perspectiveProjection.aspect, state.perspectiveProjection.zNear, state.perspectiveProjection.zFar);
        } else if (state.projectionType == "oblique") {
            matrix = mat4.identity();
        }
        matrix = mat4.translate(matrix, state.translation.xOffset, state.translation.yOffset, state.translation.zOffset);
        matrix = mat4.xRotate(matrix, state.rotation[0]);
        matrix = mat4.yRotate(matrix, state.rotation[1]);
        matrix = mat4.zRotate(matrix, state.rotation[2]);
        matrix = mat4.scale(matrix, state.scale);
        return matrix;
    }

    var projectionType = document.getElementById("projection-type");
    projectionType.addEventListener("change", function (event) {
        state.projectionType = event.target.value;
    })

    function updateRotation(angle) {
        return function (event, newState) {
            let degree = newState.value
            var angleRadian = (degree * Math.PI) / 180;
            state.rotation[angle] = angleRadian;
        };
    }

    function updateTranslation(axis) {
        return function (event, newState) {
            state.translation[axis]= newState.value;
        };
    }

    function updateScaling() {
        return function (event, newState) {
            state.scale = newState.value;
        };
    }

    function updatePerspectiveProjection(axis) {
        return function (event, newState) {
            state.perspectiveProjection[axis] = newState.value;  
        };
    }


    setupSlider("#angleX", {
        name: "angle x",
        value: radianToDegree(state.rotation[0]),
        slideFunction: updateRotation(0),
        max: 360,
        min: 0,
    });

    setupSlider("#angleY", {
        name: "angle y",
        value: radianToDegree(state.rotation[1]),
        slideFunction: updateRotation(1),
        max: 360,
        min: 0,
    });

    setupSlider("#angleZ", {
        name: "angle z",
        value: radianToDegree(state.rotation[2]),
        slideFunction: updateRotation(2),
        max: 360,
        min: 0,
    });

    setupSlider("#translationX", {
        name: "translation X",
        value: state.translation.xOffset,
        slideFunction: updateTranslation("xOffset"),
        max: 1,
        min: -1
    });

    setupSlider("#translationY", {
        name: "translation Y",
        value: state.translation.yOffset,
        slideFunction: updateTranslation("yOffset"),
        max: 1,
        min: -1
    });

    setupSlider("#translationZ", {
        name: "translation Z",
        value: state.translation.zOffset,
        slideFunction: updateTranslation("zOffset"),
        max: 1,
        min: -1
    });

    setupSlider("#scaling", {
        name: "scaling",
        value: state.scale,
        slideFunction: updateScaling(),
        max: 1.5,
        min: 0.5
    });

    setupSlider("#fov", {
        name: "fov",
        value: state.perspectiveProjection.fov,
        max: 359,
        min: 1,
        slideFunction: updatePerspectiveProjection("fov")
    });

    setupSlider("#zNear", {
        name: "zNear",
        value: state.perspectiveProjection.zNear,
        max: 1,
        min: 0,
        slideFunction: updatePerspectiveProjection("zNear")
    });

    setupSlider("#zFar", {
        name: "zFar",
        value: state.perspectiveProjection.zFar,
        max: 2000,
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

        let matrix = computeModelMatrix()

        gl.uniformMatrix4fv(matrixLocation, false, matrix);

        gl.drawArrays(gl.TRIANGLES, 0, vertices.length);
        requestAnimationFrame(render);
    }
}

window.onload = main();
