class EnvironmentParticle extends THREE.Points {
    constructor(){
        const geometry = new THREE.Geometry();
        // range of particles scattering
        const SIZE = 4;
        // number of particles
        const NUM = 500;
        var colors = [];
        const sp = [];

        for(let i=0; i<NUM; i++){
            geometry.vertices.push(randomPointInSphere(SIZE));
            /*
            geometry.colors.push(
                new THREE.Color((Math.random() * 0.05 + 0.95) * 0xFFFFFF)
            );
            */
            sp.push((-Math.random() * 0.09 + 0.01) * 0.3);
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