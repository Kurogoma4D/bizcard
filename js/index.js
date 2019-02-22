var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

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
var camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1000, 10000);
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

//TODO: scene