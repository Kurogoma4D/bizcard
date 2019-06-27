export default class BasePlane extends THREE.Mesh {
    constructor(name, x, y, z, vs, fs) {
        //TODO: use shader http://glslsandbox.com/e#55623.2
        const material = new THREE.MeshBasicMaterial({
            color: 0x000000
        });
        var rate = 0.026;
        const geometry = new THREE.PlaneGeometry(91 * rate, 55 * rate);
        super(geometry, material);
        this.overdraw = true;
        this.name = name;
        this.position.set(x, y, z);
        this.rotation.set(-Math.PI / 2.0, 0, 0);
    }
}