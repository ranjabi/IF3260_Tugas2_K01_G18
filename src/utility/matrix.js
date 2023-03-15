let mat4 = {
    identity: function() {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ]
    },

    translation: function(xOffset, yOffset, zOffset) {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            xOffset, yOffset, zOffset, 1,
        ];
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

    multiply: function(matrix1, matrix2) {
        let result = [];
        
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
            let sum = 0;
            for (let k = 0; k < 4; k++) {
                sum += matrix1[i*4+k] * matrix2[k*4+j];
            }
            result[i*4+j] = sum;
            }
        }
        
        return result;
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
    }

};

export {mat4};