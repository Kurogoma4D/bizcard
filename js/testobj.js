class TestPlane {
    constructor(name){
        this.name = name;
        this.obj = null;
    }

    make(x, y, z){
        var material = new THREE.MeshBasicMaterial({
            color: 0xffffff
        });
        var geometry = new THREE.PlaneGeometry(1, 1);
        this.obj = new THREE.Mesh(geometry, material);
        this.obj.overdraw = true;
        this.obj.name = name;
        this.obj.position.set(x, y, z);
        this.obj.rotation.set(-Math.PI / 2.0, 0, 0);
    }

    getObj(){
        return this.obj;
    }
}