class EnvironmentParticle extends THREE.Mesh {
    constructor(){
        const geometry = new THREE.Geometry();
        // range of particles scattering
        const SIZE = 3000;
        // number of particles
        const NUM = 5000;
        var colors = [];

        for(let i=0; i<NUM; i++){
            geometry.vertices.push(new THREE.Vector3(
                SIZE * (Math.random() - 0.5),
                SIZE * (Math.random() - 0.5),
                SIZE * (Math.random() - 0.5),
            ));
            geometry.colors.push(
                new THREE.Color(Math.random() * 0xFFFFFF)
            );
        }

        const material = new THREE.PointsMaterial({
            size: 25,
            vertexColors: THREE.VertexColors,
            map: new THREE.TextureLoader().load("assets/textures/particleTex.png"),
            transparent: true,
        });
        material.alphaTest = 0.1;

        return new THREE.Points(geometry, material);
    }
}