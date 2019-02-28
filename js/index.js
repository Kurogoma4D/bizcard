var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});
var clock = new THREE.Clock(true);
var particle = new EnvironmentParticle();

// settings on renderer
renderer.gammaOutput = true;
renderer.setClearColor(new THREE.Color("black"), 0);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.position = "absolute";
renderer.domElement.style.top = "0px";
renderer.domElement.style.left = "0px";
document.body.appendChild(renderer.domElement);

// settings on camera
// fov, aspect, near clipping, far clipping
var camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1000, 10000);
scene.add(camera);

// settings on light
var light = new THREE.DirectionalLight(0xffffff);
light.position.set(0, 0, 2);
scene.add(light);

// settings on AR
// media source
var source = new THREEx.ArToolkitSource({
    sourceType: "webcam"
});

// resize
source.init(function onReady(){
    onResize();
});

// also resize when window size has changed
window.addEventListener("resize", function(){
    onResize();
})

function onResize(){
    source.onResizeElement();
    source.copyElementSizeTo(renderer.domElement);
    if(context.arController != null){
        source.copyElementSizeTo(context.arController.canvas);
    }
}

// settings on camera param, marker
var context = new THREEx.ArToolkitContext({
    debug: false,
    cameraParametersUrl: "assets/camera_para.dat",
    detectionMode: "mono",
    imageSmoothingEnabled: true,
    maxDetectionRate: 60,
    canvasWidth: source.parameters.sourceWidth,
    canvasHeight: source.parameters.sourceHeight,
});

context.init(function onCompleted(){
    camera.projectionMatrix.copy(context.getProjectionMatrix());
});

// GPU particle initialize
//var particleSystem = new PTsystem();

//  -----
//  settings on scene
//  -----
initScene();
function initScene(){
    // adding marker
    var hiroMarker = new THREE.Group();
    var controls = new THREEx.ArMarkerControls(context, hiroMarker, {
        type: "pattern",
        patternUrl: "assets/marker/pattern-hiro.patt"
    });
    scene.add(hiroMarker);

    // test model: plane
    var plane = new TestPlane("plane", 0, 0.5, 0);
    hiroMarker.add(plane);

    // environmental particle
    hiroMarker.add(particle);

    var vloader = new THREE.VRMLoader();
    vloader.load('assets/models/avater013.vrm', function (vrm) {
        vrm.scene.name = "avater";
        vrm.scene.traverse(function (object) {
            if (object.material) {
                if (Array.isArray(object.material)) {
                    for (var i = 0, il = object.material.length; i < il; i++) {
                        let material = new THREE.MeshBasicMaterial();
                        THREE.Material.prototype.copy.call(material, object.material[i]);
                        material.color.copy(object.material[i].color);
                        material.map = object.material[i].map;
                        material.lights = false;
                        material.skinning = object.material[i].skinning;
                        material.morphTargets = object.material[i].morphTargets;
                        material.morphNormals = object.material[i].morphNormals;
                        object.material[i] = material;
                    }
                } else {
                    let material = new THREE.MeshBasicMaterial();
                    THREE.Material.prototype.copy.call(material, object.material);
                    material.color.copy(object.material.color);
                    material.map = object.material.map;
                    material.lights = false;
                    material.skinning = object.material.skinning;
                    material.morphTargets = object.material.morphTargets;
                    material.morphNormals = object.material.morphNormals;
                    object.material = material;
                }
            }
        });

        vrm.scene.rotation.set(0,Math.PI,0);
        hiroMarker.add(vrm.scene);
    });

    // add GPU particle
    //hiroMarker.add(particleSystem);
    scene.fog = new THREE.FogExp2(0x000000, 0.0035);
}

// click event
window.addEventListener("mousedown", function(e){
    var curX = e.clientX;
    var curY = e.clientY;
    // normalize position for -1 ~ +1
    curX = (curX/window.innerWidth)*2-1;
    curY = -(curY/window.innerHeight)*2+1;

    var pos = new THREE.Vector3(curX, curY, 1);
    pos.unproject(camera);

    // raycasting
    var ray = new THREE.Raycaster(camera.position, pos.sub(camera.position).normalize());
    var obj = ray.intersectObjects(scene.children, true);
    if(obj.length > 0){
        picked(obj[0].object.name);
    }
});

function picked(objName){
    switch(objName){
        case "plane":
            console.log("plane clicked");
            break;
        default:
            break;
    }
}

// -----
// rendering
// -----

function renderScene(){
    requestAnimationFrame(renderScene);

    if(source.ready === false){
        return;
    }
    //particleSystem.animate(clock);
    //particleSystem.update();
    var c = {};

    c = particle.material.color.getHSL({ target: c });
    var nextHue = (c.h + clock.getDelta() * 0.05) % 1.0;
    particle.material.color.setHSL(nextHue, c.s, c.l);
    
    for (let i=particle.geometry.vertices.length-1; i>=0; i--){
        var dy = particle.speeds[i];
        
        particle.geometry.vertices[i].add(new THREE.Vector3(0, dy, 0));
        if (particle.geometry.vertices[i].y < 0.5) {
            particle.geometry.vertices.splice(i, 1);
            particle.geometry.vertices.push(randomPointInSphere(4));
        }
    };
    particle.geometry.colorsNeedUpdate = true;
    particle.geometry.verticesNeedUpdate = true;

    context.update(source.domElement);
    renderer.render(scene, camera);
}

renderScene();