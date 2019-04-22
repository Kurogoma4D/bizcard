class EnvironmentParticle extends THREE.Points {
    constructor(){
        const geometry = new THREE.Geometry();
        // range of particles scattering
        const SIZE = 1;
        // number of particles
        const NUM = 250;
        var colors = [];
        const sp = [];

        for(let i=0; i<NUM; i++){
            geometry.vertices.push(randomPointInSquare(SIZE));
            /*
            geometry.colors.push(
                new THREE.Color((Math.random() * 0.05 + 0.95) * 0xFFFFFF)
            );
            */
            // speed : (minus random 0.01~0.1) * magnificant
            sp.push((-Math.random() * 0.09 + 0.01) * 0.25);
        }

        const material = new THREE.PointsMaterial({
            size: 0.2,
            //vertexColors: THREE.VertexColors,
            color: new THREE.Color("hsl("+Math.random()+", 80%, 80%)"),
            map: new THREE.TextureLoader().load("assets/textures/particleTex.png"),
            transparent: true,
            blending: THREE.AdditiveBlending,
        });
       // material.alphaTest = 0;

       super(geometry, material);
       this.speeds = sp;
    }

}