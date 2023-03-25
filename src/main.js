import { createShader, createProgram, setupSlider } from "./utility/webgl.js";
import { mat4 } from "./utility/matrix.js";
import BaseObject from "./classes/object.js";
import { radianToDegree, degreeToRadian } from "./utility/math.js";

const saveButton = document.getElementById("save");
saveButton.addEventListener("click", function () {

});

const loadButton = document.getElementById("load");
loadButton.addEventListener("click", function() {

});

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

    var hollow_object = new BaseObject();
    hollow_object.initCube();
    var vertices = hollow_object.getFlattenVertices();
    var colors = hollow_object.getFlattenColor();
    var normals = hollow_object.getFlattenNormals();
    



    const initialState = {
        animation: {
            xAngle: null, 
            yAngle: null, 
            zAngle: null
        },
        rotation: {
            xAngle: degreeToRadian(0), 
            yAngle: degreeToRadian(300), 
            zAngle: degreeToRadian(30)
        },
        translation: {
            xOffset: 0,
            yOffset: 0,
            zOffset: 0,
        },
        scaling: {
            overall: 1,
            xScale: 1,
            yScale: 1,
            zScale: 1,
        },
        perspectiveProjection: {
            fov: 150,
            aspect: gl.canvas.clientWidth / gl.canvas.clientHeight,
            zNear: 0.1,
            zFar: 2000,
        },
        runAnimation: false,
        cameraAngle: 0,
        cameraRadius: 0.8,
        projectionType: "perspective",
        shapeType: "cube"

    };

    let state = JSON.parse(JSON.stringify(initialState));

    function resetSliderUIValue() {
        translationX.updateValue(state.translation.xOffset)
        translationY.updateValue(state.translation.yOffset)
        translationZ.updateValue(state.translation.zOffset)
        overallScale.updateValue(state.scaling.overall)
        xScale.updateValue(state.scaling.xScale)
        yScale.updateValue(state.scaling.yScale)
        zScale.updateValue(state.scaling.zScale)
        fov.updateValue(state.perspectiveProjection.fov)
        zNear.updateValue(state.perspectiveProjection.zNear)
        zFar.updateValue(state.perspectiveProjection.zFar)
        cameraAngle.updateValue(state.cameraAngle)
    }

    function setupInitialObjectTransformation() {
        if (state.projectionType == "oblique") {
            state.rotation.xAngle = degreeToRadian(180);
            state.rotation.yAngle = degreeToRadian(0);
            state.rotation.zAngle = degreeToRadian(0);

            state.cameraRadius = 0;
        } else if (state.projectionType == "orthographic") {
            state.rotation.xAngle = degreeToRadian(30);
            state.rotation.yAngle = degreeToRadian(30);
            state.rotation.zAngle = degreeToRadian(0);

            state.cameraRadius = 0.5;
        } else if (state.projectionType == "perspective") {
            state.rotation.xAngle = degreeToRadian(30);
            state.rotation.yAngle = degreeToRadian(30);
            state.rotation.zAngle = degreeToRadian(0);
            
            state.cameraRadius = 0.8;
        }

        if (state.projectionType == "perspective") {
            fovSlider.style.display = "block";
            zNearSlider.style.display = "block";
            zFarSlider.style.display = "block";
        }
        else {
            fovSlider.style.display = "none";
            zNearSlider.style.display = "none";
            zFarSlider.style.display = "none";
        }
        
        state.animation.xAngle = null
        state.animation.yAngle = null
        state.animation.zAngle = null

        angleXSlider.updateValue(radianToDegree(state.rotation.xAngle));
        angleYSlider.updateValue(radianToDegree(state.rotation.yAngle));
        angleZSlider.updateValue(radianToDegree(state.rotation.zAngle));

        cameraRadius.updateValue(state.cameraRadius);
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

    var angleRadian
    function updateRotation(angle) {
        return function (event, newState) {
            let degree = newState.value
            angleRadian = (degree * Math.PI) / 180;
            state.rotation[angle] = angleRadian;
        };
    }

    function updateTranslation(axis) {
        return function (event, newState) {
            state.translation[axis]= newState.value;
        };
    }

    function updateScaling(axis) {
        return function (event, newState) {
            state.scaling[axis] = newState.value;
        };
    }

    function updatePerspectiveProjection(axis) {
        return function (event, newState) {
            state.perspectiveProjection[axis] = newState.value;  
        };
    }

    /* SETUP ALL SLIDER */
    let angleXSlider = setupSlider("angleX", {
        name: "angle x",
        value: radianToDegree(state.rotation.xAngle),
        slideFunction: updateRotation("xAngle"),
        max: 360,
        min: 0,
    });

    let angleYSlider = setupSlider("angleY", {
        name: "angle y",
        value: radianToDegree(state.rotation.yAngle),
        slideFunction: updateRotation("yAngle"),
        max: 360,
        min: 0,
    });

    let angleZSlider = setupSlider("angleZ", {
        name: "angle z",
        value: radianToDegree(state.rotation.zAngle),
        slideFunction: updateRotation("zAngle"),
        max: 360,
        min: 0,
    });

    let translationX = setupSlider("translationX", {
        name: "translation X",
        value: state.translation.xOffset,
        slideFunction: updateTranslation("xOffset"),
        max: 1,
        min: -1
    });

    let translationY = setupSlider("translationY", {
        name: "translation Y",
        value: state.translation.yOffset,
        slideFunction: updateTranslation("yOffset"),
        max: 1,
        min: -1
    });

    let translationZ = setupSlider("translationZ", {
        name: "translation Z",
        value: state.translation.zOffset,
        slideFunction: updateTranslation("zOffset"),
        max: 1,
        min: -1
    });

    let overallScale = setupSlider("overallScale", {
        name: "scaling overall",
        value: state.scaling.overall,
        slideFunction: updateScaling("overall"),
        max: 1.5,
        min: 0.5
    });

    let xScale = setupSlider("xScale", {
        name: "scaling X",
        value: state.scaling.xScale,
        slideFunction: updateScaling("xScale"),
        max: 1.5,
        min: 0.5
    });

    let yScale = setupSlider("yScale", {
        name: "scaling Y",
        value: state.scaling.yScale,
        slideFunction: updateScaling("yScale"),
        max: 1.5,
        min: 0.5
    });

    let zScale = setupSlider("zScale", {
        name: "scaling Z",
        value: state.scaling.zScale,
        slideFunction: updateScaling("zScale"),
        max: 1.5,
        min: 0.5
    });


    let fov = setupSlider("fov", {
        name: "fov",
        value: state.perspectiveProjection.fov,
        max: 359,
        min: 1,
        slideFunction: updatePerspectiveProjection("fov")
    });

    let zNear = setupSlider("zNear", {
        name: "zNear",
        value: state.perspectiveProjection.zNear,
        max: 1,
        min: 0,
        slideFunction: updatePerspectiveProjection("zNear")
    });

    let zFar = setupSlider("zFar", {
        name: "zFar",
        value: state.perspectiveProjection.zFar,
        max: 2000,
        min: 1,
        slideFunction: updatePerspectiveProjection("zFar")
    });

    let cameraAngle = setupSlider("cameraAngle", {
        name: "cameraAngle",
        value: state.cameraAngle,
        max: 360,
        min: 0,
        slideFunction: function (event, newState) {
            state.cameraAngle = newState.value;
        }
    });

    let cameraRadius = setupSlider("cameraRadius", {
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
    var fovSlider = document.getElementById("fov");
    var zNearSlider = document.getElementById("zNear");
    var zFarSlider = document.getElementById("zFar");

    projectionType.addEventListener("change", function (event) {
        state.projectionType = event.target.value;
        setupInitialObjectTransformation()
    })

    let animationCheckbox = document.getElementById("animation");
    animationCheckbox.addEventListener("change", function (event) {
        if (animationCheckbox.checked) {
            state.runAnimation = true;
        } else {
            state.runAnimation = false;
        }
    });

    let resetView = document.getElementById("reset-view");
    resetView.addEventListener("click", function (event) {
        projectionType = JSON.parse(JSON.stringify(state.projectionType))
        state = JSON.parse(JSON.stringify(initialState))
        state.projectionType = projectionType
        setupInitialObjectTransformation()
        resetSliderUIValue()
        animationCheckbox.checked = false;
    })

    let size = 4; // 4 components per iteration
    let type = gl.FLOAT; // the data is 32bit floats
    let normalize = false; // don't normalize the data
    let stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    let offset = 0; // start at the beginning of the buffer

    initBuffers();

    let worldViewProjectionLocation = gl.getUniformLocation(program, "uWorldViewProjection");
    let worldLocation = gl.getUniformLocation(program, "uWorld");
    var reverseLightDirectionLocation = gl.getUniformLocation(program, "uReverseLightDirection");
    
    var shapeType = document.getElementById("shape-type");
    shapeType.addEventListener("change", function (event) {
        state.shapeType = event.target.value;
        hollow_object = new BaseObject();
        if (state.shapeType == "cube") {
            hollow_object.initCube();
        } else if (state.shapeType == "random") {
            hollow_object.initRandomHollow();
        }

        vertices = hollow_object.getFlattenVertices();
        colors = hollow_object.getFlattenColor();
        normals = hollow_object.getFlattenNormals();

        initBuffers();
    })

    
    render();

    function initBuffers() {
        var vertexBuffer = gl.createBuffer();
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
    
        var normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    
        let vertexNormal = gl.getAttribLocation(program, "vNormal");
        gl.vertexAttribPointer(vertexNormal, 3, type, normalize, stride, offset)
        gl.enableVertexAttribArray(vertexNormal);
    }

    function render() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        let matrix = computeModelMatrix()

        let cameraAngleInRadians = degreeToRadian(state.cameraAngle);
        let cameraMatrix = mat4.yRotation(cameraAngleInRadians)
        cameraMatrix = mat4.translate(cameraMatrix, 0, 0, state.cameraRadius);
        let viewMatrix = mat4.inverse(cameraMatrix);
        let viewProjectionMatrix = mat4.multiply(matrix, viewMatrix);

        matrix = viewProjectionMatrix

        matrix = mat4.translate(matrix, state.translation.xOffset, state.translation.yOffset, state.translation.zOffset);

        let xAngle = state.rotation.xAngle
        let yAngle = state.rotation.yAngle
        let zAngle = state.rotation.zAngle

        if (state.animation.xAngle === null) {
            state.animation.xAngle = JSON.parse(JSON.stringify(state.rotation.xAngle))
        }
        if (state.animation.yAngle === null) {
            state.animation.yAngle = JSON.parse(JSON.stringify(state.rotation.yAngle))
        }
        if (state.animation.zAngle === null) {
            state.animation.zAngle = JSON.parse(JSON.stringify(state.rotation.zAngle))
        }

        if (state.runAnimation) {
            xAngle = degreeToRadian(radianToDegree(state.rotation.xAngle += 0.01))
            yAngle = degreeToRadian(radianToDegree(state.rotation.yAngle += 0.01))
            zAngle = degreeToRadian(radianToDegree(state.rotation.zAngle += 0.01))
        } else {
            state.rotation.xAngle = state.animation.xAngle
            xAngle = state.rotation.xAngle
            state.animation.xAngle = null

            state.rotation.yAngle = state.animation.yAngle
            yAngle = state.rotation.yAngle
            state.animation.yAngle = null

            state.rotation.zAngle = state.animation.zAngle
            zAngle = state.rotation.zAngle
            state.animation.zAngle = null
        }

        matrix = mat4.xRotate(matrix, xAngle);
        matrix = mat4.yRotate(matrix, yAngle);
        matrix = mat4.zRotate(matrix, zAngle);
        matrix = mat4.scale(matrix, state.scaling.overall, state.scaling.overall, state.scaling.overall);
        matrix = mat4.scale(matrix, state.scaling.xScale, state.scaling.yScale, state.scaling.zScale);


        // let worldMatrix = mat4.xRotate(matrix, state.rotation.xAngle);
        // worldMatrix = mat4.yRotate(matrix, state.rotation.yAngle);
        // worldMatrix = mat4.zRotate(matrix, state.rotation.zAngle);

        // let worldInverseMatrix = mat4.inverse(worldMatrix);
        // let worldInverseTransposeMatrix = mat4.transpose(worldInverseMatrix);
        // let worldViewProjectionMatrix = mat4.multiply(viewProjectionMatrix, worldMatrix);

        gl.uniformMatrix4fv(worldViewProjectionLocation, false, matrix);
        gl.uniformMatrix4fv(worldLocation, false, matrix);
        gl.uniform3fv(reverseLightDirectionLocation, mat4.normalize([0.5, 0.7, 1]));

        gl.drawArrays(gl.TRIANGLES, 0, vertices.length);
        requestAnimationFrame(render);
    }

    var modal = document.getElementById("manual-modal");
    var manualButton = document.getElementById("manual");

    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on the button, open the modal
    manualButton.addEventListener("click", function() {
        modal.style.display = "block";
        console.log(modal)
    })

    // When the user clicks on <span> (x), close the modal
    span.addEventListener("click", function() {
        modal.style.display = "none";
    })

    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener("click", function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    })

}

window.onload = main();
