export default class BasePlane extends THREE.Mesh {
    constructor(name, x, y, z, vs, fs) {
        const tloader = new THREE.TextureLoader();
        var rate = 0.026;
        var width = 91 * rate;
        var height = 55 * rate
        const geometry = new THREE.PlaneGeometry(width, height);

        //TODO: use shader http://glslsandbox.com/e#55623.2
        const material = new THREE.ShaderMaterial({
            vertexShader: vs,
            fragmentShader: fs,
            uniforms: {
                time:{
                    type: "float",
                    value: 1.0
                },
                resolution: {
                    type: "v2",
                    value: new THREE.Vector2(width*660, height*660)
                },
                mouse: {
                    type: "v2",
                    value: new THREE.Vector2(0.3, 0.3)
                },
                texture: {
                    type: 't',
                    value: tloader.load("/assets/textures/nameTexture.png")
                },
            }
        });
        /* 
        const material = new THREE.MeshBasicMaterial({
            color: 0x000000
        });
        */
        super(geometry, material);
        this.overdraw = true;
        this.name = name;
        this.position.set(x, y, z);
        this.rotation.set(-Math.PI / 2.0, 0, 0);
    }
}