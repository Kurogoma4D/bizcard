var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    logarithmicDepthBuffer: true
});
var clock = new THREE.Clock(true);
var particle = new EnvironmentParticle();
var mixers = new Array();

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
var amb = new THREE.AmbientLight(0xFFDDCC);
scene.add(amb);

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
   
    // animated model load
    var vloader = new THREE.GLTFLoader();
    vloader.load('assets/models/greeting-skin-v3.glb', function(model){
        const gltf = model;
        gltf.scene.name = "avater";

        hiroMarker.add(gltf.scene);
        const animations = gltf.animations;

        if(animations){
            let mixer = new THREE.AnimationMixer(gltf.scene);
            mixers.push(mixer);
            const action = mixer.clipAction(animations[0]);
            action.play();
        }
    });
    
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
        case "avater":
            console.log("character tapped");
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
    var dt = clock.getDelta();

    // particle update
    // color, position
    c = particle.material.color.getHSL({ target: c });
    var nextHue = (c.h + dt * 0.05) % 1.0;
    particle.material.color.setHSL(nextHue, c.s, c.l);
    
    for(let i=particle.geometry.vertices.length-1; i>=0; i--){
        var dy = particle.speeds[i];
        
        particle.geometry.vertices[i].add(new THREE.Vector3(0, dy, 0));
        if (particle.geometry.vertices[i].y < 0.5) {
            particle.geometry.vertices.splice(i, 1);
            particle.geometry.vertices.push(randomPointInSphere(4));
        }
    }
    particle.geometry.colorsNeedUpdate = true;
    particle.geometry.verticesNeedUpdate = true;

    // animation update
    for(let i=0, len=mixers.length; i<len; i++){
        mixers[i].update(dt);
    }

    context.update(source.domElement);
    renderer.render(scene, camera);
}

renderScene();