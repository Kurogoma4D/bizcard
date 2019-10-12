// import EnvironmentParticle from './libs/objects/particles.js';
import BasePlane from "./libs/objects/basePlane.js";
import BannerPlane from "./libs/objects/bannerPlane.js";

var scene = new THREE.Scene();

var renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  logarithmicDepthBuffer: true,
});

var plane;

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
var camera = new THREE.PerspectiveCamera(
  90,
  window.innerWidth / window.innerHeight,
  1000,
  10000,
);
scene.add(camera);

// settings on light
var amb = new THREE.AmbientLight(0xffddcc);
scene.add(amb);

// settings on AR
// media source
var source = new THREEx.ArToolkitSource({
  sourceType: "webcam",
});

// resize
source.init(function onReady() {
  onResize();
});

// also resize when window size has changed
window.addEventListener("resize", function() {
  onResize();
});

function onResize() {
  source.onResizeElement();
  source.copyElementSizeTo(renderer.domElement);
  if (context.arController != null) {
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
  patternRatio: 0.80,
});

context.init(function onCompleted() {
  camera.projectionMatrix.copy(context.getProjectionMatrix());
});

//  -----
//  settings on scene
//  -----

// Shader loading
// 参考: https://qiita.com/mczkzk/items/079c36b6ee3f0a802572
SHADER_LOADER.load(data => {
  // data.`data-name`.[vertex | fragment]
  const vs = data.planeShader.vertex;
  const fs = {
    basefs: data.planeShader.fragment,
  };

  // init with shader
  initScene(vs, fs);
});

function initScene(vs, fs) {
  // adding marker
  var qrMarker = new THREE.Group();
  var controls = new THREEx.ArMarkerControls(context, qrMarker, {
    type: "pattern",
    patternUrl: "assets/marker/pattern-qrLogo.patt",
  });
  scene.add(qrMarker);

  // model: plane
  plane = new BasePlane("basePlane", -0.39, 0.01, 0, vs, fs["basefs"]);
  qrMarker.add(plane);

  // model: plane
  //banner = new BannerPlane("bannerPlane", -0.39, 1.5, 1, vs, fs['basefs']);
  // qrMarker.add(plane);
}

// click event
window.addEventListener("mousedown", function(e) {
  var curX = e.clientX;
  var curY = e.clientY;
  // normalize position for -1 ~ +1
  curX = (curX / window.innerWidth) * 2 - 1;
  curY = -(curY / window.innerHeight) * 2 + 1;

  var pos = new THREE.Vector3(curX, curY, 1);
  pos.unproject(camera);

  // raycasting
  var ray = new THREE.Raycaster(
    camera.position,
    pos.sub(camera.position).normalize(),
  );
  var obj = ray.intersectObjects(scene.children, true);
  if (obj.length > 0) {
    picked(obj[0].object.name);
  }
});

function picked(objName) {
  switch (objName) {
    case "basePlane":
      console.log("welcome");
      break;
    default:
      break;
  }
}

// -----
// rendering
// -----

function renderScene() {
  requestAnimationFrame(renderScene);

  if (source.ready === false) {
    return;
  }

  // plane update
  plane.material.uniforms.time.value += 0.005;

  context.update(source.domElement);
  renderer.render(scene, camera);
}

renderScene();
