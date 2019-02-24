class PTsystem extends THREE.GPUParticleSystem {
    constructor(){
        super({maxParticles: 1000000});
        this.tick = 0;
        this.radius = 2.0;

        this.options = {
            position: new THREE.Vector3(),
            positionRandomness: 0.3,
            velocity: new THREE.Vector3(),
            velocityRandomness: 0.5,
            color: 0xaa88ff,
            colorRandomness: 0.2,
            turbulence: 1,
            lifetime: 12,
            size: 5,
            sizeRandomness: 12
        };

        this.spawnerOptions = {
            spawnRate: 35000,
            horizontalSpeed: 2.5,
            verticalSpeed: 2.5,
            timeScale: 0.5
        };
    }

    animate(clk){
        var delta = clk.getDelta() * this.spawnerOptions.timeScale;
        this.tick += delta;
        if(this.tick < 0) this.tick = 0;
        if(delta > 0){
            this.options.position.x = Math.sin(this.tick + Math.PI * 0.5 * this.spawnerOptions.horizontalSpeed) * 40;
            this.options.position.y = Math.cos(this.tick + Math.PI * 0.5 * this.spawnerOptions.verticalSpeed) * 20;
            this.options.position.z = Math.sin(this.tick + Math.PI * 0.5 * this.spawnerOptions.horizontalSpeed + this.spawnerOptions.verticalSpeed) * 5;

            console.log(super.name);
            for(var x=0; x<this.spawnerOptions.spawnRate*delta; x++){
                super.spawnParticle(this.options);
            }
        }
    }

    update(){
        super.update(this.tick);
    }
}