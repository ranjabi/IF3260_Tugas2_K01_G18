function radianToDegree(radian) {
    return (radian * 180) / Math.PI;
}

function degreeToRadian(degree) {
    return (degree * Math.PI) / 180;
}

export { radianToDegree, degreeToRadian };