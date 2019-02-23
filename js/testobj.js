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
        obj = new THREE.Mesh(geometry, material);
        obj.overdraw = true;
        obj.name = name;
        obj.position.set(x, y, z);
        obj.rotation.set(-Math.PI / 2.0, 0, 0);
    }

    getObj(){
        return obj;
    }
}