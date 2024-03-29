import { degreeToRadian } from "./math.js";

let mat4 = {
    identity: function() {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ]
    },

    inverse: function(m) {
    // source: webglfundamentals.org
        var m00 = m[0 * 4 + 0];
        var m01 = m[0 * 4 + 1];
        var m02 = m[0 * 4 + 2];
        var m03 = m[0 * 4 + 3];
        var m10 = m[1 * 4 + 0];
        var m11 = m[1 * 4 + 1];
        var m12 = m[1 * 4 + 2];
        var m13 = m[1 * 4 + 3];
        var m20 = m[2 * 4 + 0];
        var m21 = m[2 * 4 + 1];
        var m22 = m[2 * 4 + 2];
        var m23 = m[2 * 4 + 3];
        var m30 = m[3 * 4 + 0];
        var m31 = m[3 * 4 + 1];
        var m32 = m[3 * 4 + 2];
        var m33 = m[3 * 4 + 3];
        var tmp_0  = m22 * m33;
        var tmp_1  = m32 * m23;
        var tmp_2  = m12 * m33;
        var tmp_3  = m32 * m13;
        var tmp_4  = m12 * m23;
        var tmp_5  = m22 * m13;
        var tmp_6  = m02 * m33;
        var tmp_7  = m32 * m03;
        var tmp_8  = m02 * m23;
        var tmp_9  = m22 * m03;
        var tmp_10 = m02 * m13;
        var tmp_11 = m12 * m03;
        var tmp_12 = m20 * m31;
        var tmp_13 = m30 * m21;
        var tmp_14 = m10 * m31;
        var tmp_15 = m30 * m11;
        var tmp_16 = m10 * m21;
        var tmp_17 = m20 * m11;
        var tmp_18 = m00 * m31;
        var tmp_19 = m30 * m01;
        var tmp_20 = m00 * m21;
        var tmp_21 = m20 * m01;
        var tmp_22 = m00 * m11;
        var tmp_23 = m10 * m01;
    
        var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
            (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
        var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
            (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
        var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
            (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
        var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
            (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);
    
        var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
    
    return [
        d * t0,
        d * t1,
        d * t2,
        d * t3,
        d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
                (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
        d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
                (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
        d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
                (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
        d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
                (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
        d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
                (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
        d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
                (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
        d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
                (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
        d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
                (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
        d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
                (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
        d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
                (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
        d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
                (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
        d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
                (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
        ];
    },
   
    multiply: function(matrix1, matrix2) {
        let result = [];
        
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
            let sum = 0;
            for (let k = 0; k < 4; k++) {
                sum += matrix2[i*4+k] * matrix1[k*4+j];
            }
            result[i*4+j] = sum;
            }
        }
        
        return result;
    },

    // convert a given vector into a unit vector
    normalize: function(vector) {
        let magnitude = Math.sqrt(vector[0]*vector[0] + vector[1]*vector[1] + vector[2]*vector[2]);
        vector[0] = vector[0] / magnitude;
        vector[1] = vector[1] / magnitude;
        vector[2] = vector[2] / magnitude;
        return vector;
    },

    xRotation: function(angleInRadian) {
        let cos = Math.cos(angleInRadian);
        let sin = Math.sin(angleInRadian);

        return [
            1, 0, 0, 0,
            0, cos, sin, 0,
            0, -sin, cos, 0,
            0, 0, 0, 1,
        ];
    },
   
    yRotation: function(angleInRadian) {
        let cos = Math.cos(angleInRadian);
        let sin = Math.sin(angleInRadian);

        return [
            cos, 0, -sin, 0,
            0, 1, 0, 0,
            sin, 0, cos, 0,
            0, 0, 0, 1,
        ];
    },
   
    zRotation: function(angleInRadian) {
        let cos = Math.cos(angleInRadian);
        let sin = Math.sin(angleInRadian);

        return [
            cos, sin, 0, 0,
            -sin, cos, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];
    },

     
    translation: function(xOffset, yOffset, zOffset) {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            xOffset, yOffset, zOffset, 1,
        ];
    },

    scaling: function(xScale, yScale, zScale) {
        return [
            xScale, 0, 0, 0,
            0, yScale, 0, 0,
            0, 0, zScale, 0,
            0, 0, 0, 1,
        ];
    },

    perspective: function(fov, aspect, zNear, zFar) {
        var fovInRadian = degreeToRadian(fov);
        var f = Math.tan(Math.PI * 0.5 - 0.5 * fovInRadian);
        var rangeInv = 1.0 / (zNear - zFar);

        return [
            f/aspect, 0, 0, 0,
            0, f, 0, 0,
            0,0, (zNear + zFar) * rangeInv, -1,
            0,0, zNear * zFar * rangeInv * 2, 0
        ];
    },

    orthographic: function() {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, -1, 0,
            0, 0, 0, 1
        ]
    },

    oblique: function() {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            -0.5, -0.5, -1, 0,
            0, 0, 0, 1
        ]
    },

    xRotate: function(m, angleInRadian) {
        return mat4.multiply(m, mat4.xRotation(angleInRadian));
    },
    
    yRotate: function(m, angleInRadian) {
        return mat4.multiply(m, mat4.yRotation(angleInRadian));
    },
    
    zRotate: function(m, angleInRadian) {
        return mat4.multiply(m, mat4.zRotation(angleInRadian));
    },

    translate: function(m, xOffset, yOffset, zOffset) {
        return mat4.multiply(m, mat4.translation(xOffset, yOffset, zOffset));
    },

    scale: function(m, xScale, yScale, zScale) {
        return mat4.multiply(m, mat4.scaling(xScale, yScale, zScale));
    },

    cross(a, b) {
        return [Number(a[1]) * Number(b[2]) - Number(a[2]) * Number(b[1]),
                Number(a[2]) * Number(b[0]) - Number(a[0]) * Number(b[2]),
                Number(a[0]) * Number(b[1]) - Number(a[1]) * Number(b[0])];
    },
    
    substraction(a, b) {
        return [Number(a[0]) - Number(b[0]), Number(a[1]) - Number(b[1]), Number(a[2]) - Number(b[2])];
    },

    normalize(v) {
        var length = Math.sqrt(Number(v[0]) * Number(v[0]) + Number(v[1]) * Number(v[1]) + Number(v[2]) * Number(v[2]));
        
        if (length > 0.00001) {
          return [Number(v[0]) / length, Number(v[1]) / length, Number(v[2]) / length];
        } else {
          return [0, 0, 0];
        }
    }
};

export {mat4};