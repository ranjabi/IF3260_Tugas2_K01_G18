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

export { createShader, createProgram };
