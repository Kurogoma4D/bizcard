class TestPlane extends THREE.Mesh {
    constructor(name, x, y, z){
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff
        });
        const geometry = new THREE.PlaneGeometry(1, 1);
        super(geometry, material);
        this.overdraw = true;
        this.name = name;
        this.position.set(x, y-0.5, z);
        this.rotation.set(-Math.PI / 2.0, 0, 0);
    }
}