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
        rotation: {
            xAngle: degreeToRadian(30), 
            yAngle: degreeToRadian(30), 
            zAngle: degreeToRadian(0)
        },
        translation: {
            xOffset: 0,
            yOffset: 0,
            zOffset: 0,
        },
        scale: 1,
        perspectiveProjection: {
            fov: 150,
            aspect: gl.canvas.clientWidth / gl.canvas.clientHeight,
            zNear: 0.1,
            zFar: 2000,
        },
        cameraAngle: 0,
        cameraRadius: 0.8,
        projectionType: "perspective"
    }

    function computeModelMatrix() {
        var matrix;
        if (state.projectionType == "orthographic") {
            matrix = mat4.orthographic();
        } else if (state.projectionType == "perspective") {
            matrix = mat4.perspective(state.perspectiveProjection.fov, state.perspectiveProjection.aspect, state.perspectiveProjection.zNear, state.perspectiveProjection.zFar);
        } else if (state.projectionType == "oblique") {
            matrix = mat4.oblique();
        }
        return matrix;
    }

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

    /* SETUP ALL SLIDER */
    let angleXSlider = setupSlider("#angleX", {
        name: "angle x",
        value: radianToDegree(state.rotation.xAngle),
        slideFunction: updateRotation("xAngle"),
        max: 360,
        min: 0,
    });

    let angleYSlider = setupSlider("#angleY", {
        name: "angle y",
        value: radianToDegree(state.rotation.yAngle),
        slideFunction: updateRotation("yAngle"),
        max: 360,
        min: 0,
    });

    let angleZSlider = setupSlider("#angleZ", {
        name: "angle z",
        value: radianToDegree(state.rotation.zAngle),
        slideFunction: updateRotation("zAngle"),
        max: 360,
        min: 0,
    });

    let translationX = setupSlider("#translationX", {
        name: "translation X",
        value: state.translation.xOffset,
        slideFunction: updateTranslation("xOffset"),
        max: 1,
        min: -1
    });

    let translationY = setupSlider("#translationY", {
        name: "translation Y",
        value: state.translation.yOffset,
        slideFunction: updateTranslation("yOffset"),
        max: 1,
        min: -1
    });

    let translationZ = setupSlider("#translationZ", {
        name: "translation Z",
        value: state.translation.zOffset,
        slideFunction: updateTranslation("zOffset"),
        max: 1,
        min: -1
    });

    let scaling = setupSlider("#scaling", {
        name: "scaling",
        value: state.scale,
        slideFunction: updateScaling(),
        max: 1.5,
        min: 0.5
    });

    let fov = setupSlider("#fov", {
        name: "fov",
        value: state.perspectiveProjection.fov,
        max: 359,
        min: 1,
        slideFunction: updatePerspectiveProjection("fov")
    });

    let zNear = setupSlider("#zNear", {
        name: "zNear",
        value: state.perspectiveProjection.zNear,
        max: 1,
        min: 0,
        slideFunction: updatePerspectiveProjection("zNear")
    });

    let zFar = setupSlider("#zFar", {
        name: "zFar",
        value: state.perspectiveProjection.zFar,
        max: 2000,
        min: 1,
        slideFunction: updatePerspectiveProjection("zFar")
    });

    let cameraAngle = setupSlider("#cameraAngle", {
        name: "cameraAngle",
        value: state.cameraAngle,
        max: 360,
        min: 0,
        slideFunction: function (event, newState) {
            state.cameraAngle = newState.value;
        }
    });

    let cameraRadius = setupSlider("#cameraRadius", {
        name: "cameraRadius",
        value: state.cameraRadius,
        max: 2,
        min: -2,
        slideFunction: function (event, newState) {
            state.cameraRadius = newState.value;
        },
        step: 0.1
    });
    /* END OF SETUP ALL SLIDER */

    var projectionType = document.getElementById("projection-type");
    projectionType.addEventListener("change", function (event) {
        state.projectionType = event.target.value;
        if (state.projectionType == "oblique") {
            state.rotation.xAngle = degreeToRadian(0);
            state.rotation.yAngle = degreeToRadian(0);
            angleXSlider.updateValue(radianToDegree(state.rotation.xAngle));
            angleYSlider.updateValue(radianToDegree(state.rotation.yAngle));

            state.cameraRadius = 0;
            cameraRadius.updateValue(state.cameraRadius);
        } else if (state.projectionType == "orthographic") {
            state.rotation.xAngle = degreeToRadian(30);
            state.rotation.yAngle = degreeToRadian(30);
            angleXSlider.updateValue(radianToDegree(state.rotation.xAngle));
            angleYSlider.updateValue(radianToDegree(state.rotation.yAngle));

            state.cameraRadius = 0.5;
            cameraRadius.updateValue(state.cameraRadius);
        } else if (state.projectionType == "perspective") {
            state.rotation.xAngle = degreeToRadian(30);
            state.rotation.yAngle = degreeToRadian(30);
            angleXSlider.updateValue(radianToDegree(state.rotation.xAngle));
            angleYSlider.updateValue(radianToDegree(state.rotation.yAngle));

            state.cameraRadius = 0.8;
            cameraRadius.updateValue(state.cameraRadius);
        }
    })

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

        let cameraAngleInRadians = degreeToRadian(state.cameraAngle);
        let cameraMatrix = mat4.yRotation(cameraAngleInRadians)
        cameraMatrix = mat4.translate(cameraMatrix, 0, 0, state.cameraRadius);
        let viewMatrix = mat4.inverse(cameraMatrix);
        let viewProjectionMatrix = mat4.multiply(matrix, viewMatrix)

        matrix = viewProjectionMatrix

        matrix = mat4.translate(matrix, state.translation.xOffset, state.translation.yOffset, state.translation.zOffset);
        matrix = mat4.xRotate(matrix, state.rotation.xAngle);
        matrix = mat4.yRotate(matrix, state.rotation.yAngle);
        matrix = mat4.zRotate(matrix, state.rotation.zAngle);
        matrix = mat4.scale(matrix, state.scale);

        gl.uniformMatrix4fv(matrixLocation, false, matrix);

        gl.drawArrays(gl.TRIANGLES, 0, vertices.length);
        requestAnimationFrame(render);
    }
}

window.onload = main();
