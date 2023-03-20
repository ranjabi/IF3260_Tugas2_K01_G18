/**
 * @param {WebGLRenderingContext} gl
 * @param {number} type
 * @param {string} source
 * @return {WebGLShader}
 * create a shader, upload the glsl source, compile the shader
 */
function createShader(gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        console.log("shader success\n");
        return shader;
    }

    console.log("shader creation failed\n", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {WebGLShader} vertexShader
 * @param {WebGLShader} fragmentShader
 * @return {WebGLProgram}
 * create a program, attach the shaders, link the program
 */
function createProgram(gl, vertexShader, fragmentShader) {
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        console.log("program success\n");
        return program;
    }

    console.log(
        "program shader creation fail\n",
        gl.getProgramInfoLog(program)
    );
    gl.deleteProgram(program);
}

function setupSlider(selector, options) {
    let parent = document.getElementById(selector);

    if (!parent) {
        let attr = document.createElement("div");
        attr.setAttribute("id", selector);
        document.querySelector("#properties").appendChild(attr);

        parent = document.getElementById(selector);
    }

    let name = options.name;
    let min = options.min || 0;
    let max = options.max || 100;
    let value = options.value || 0;
    let step = options.step || 0.1;
    let selectorInput = selector + "input";
    let selectorValue = selector + "value";
    let slideFunction = options.slideFunction;

    parent.innerHTML = `
    <p>${name}</p>
    <input type="range" min="${min}" max="${max}" value="${value}" id="${selectorInput}" step="${step}">
    <p id="${selectorValue}">${value.toFixed(2)}</p>
    `;

    let slider = document.getElementById(selectorInput);
    let sliderValue = document.getElementById(selectorValue);

    function updateValue(newValue) {
        sliderValue.textContent = newValue.toFixed(2);
        slider.value = newValue;
    }

    function handleChange(event) {
        let value = parseFloat(event.target.value);
        updateValue(value);
        slideFunction(event, { value: value });
    }

    slider.addEventListener("input", handleChange);

    return {slider, updateValue}
}

export { setupSlider, createShader, createProgram };