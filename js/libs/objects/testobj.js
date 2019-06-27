export default class TestPlane extends THREE.Mesh {
    constructor(name, x, y, z){
        const material = new THREE.MeshBasicMaterial({
            color: 0x000000
        });
        const geometry = new THREE.PlaneGeometry(1, 1);
        super(geometry, material);
        this.overdraw = true;
        this.name = name;
        this.position.set(x, y, z);
        this.rotation.set(-Math.PI / 2.0, 0, 0);
    }
}