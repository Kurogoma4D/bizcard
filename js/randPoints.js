function randomPointInSphere(radius) {

    const x = Math.random() * 2.0 - 1.0;
    const y = Math.random();
    const z = Math.random() * 2.0 - 1.0;
    const normalizationFactor = 1 / Math.sqrt(x * x + y * y + z * z);

    const v = new THREE.Vector3(
        x * normalizationFactor * radius,
        y * normalizationFactor * radius,
        z * normalizationFactor * radius
    );

    return v;
}

function randomPointInSquare(length) {

    const x = Math.random() * length - 0.5;
    const y = Math.random();
    const z = Math.random() * length - 0.5;

    return new THREE.Vector3(x, y, z);
}