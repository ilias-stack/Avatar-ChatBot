import * as THREE from "three";
import { myScene } from "./scene.js";
import { myCamera } from "./camera.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { addAlienToScene } from "./alienLoader.js"; 


// Setup Three.js renderer
const myRenderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
  antialias:true
});
myRenderer.setSize(window.innerWidth, window.innerHeight);
myRenderer.setPixelRatio(window.devicePixelRatio);

// Create effect composer and passes
const composer = new EffectComposer(myRenderer);
const renderPass = new RenderPass(myScene, myCamera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.5,
  0.85
);

composer.addPass(renderPass);
composer.addPass(bloomPass);

// Adding the orbit control
const controls = new OrbitControls(myCamera, myRenderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;
controls.screenSpacePanning = false;
controls.maxDistance = 50; // Maximum distance the camera can zoom out
controls.minDistance = 2; // Maximum distance the camera can zoom in

// Loading the alien mesh
let alienMesh;

addAlienToScene()
  .then((alien) => {
    alienMesh = alien; // Assign the loaded mesh to alienMesh
  })
  .catch((error) => {
    console.error("Error loading alien:", error);
  });


controls.update();
// Animation loop
function animate(t = 1) {
  requestAnimationFrame(animate);

  controls.update();
  if(alienMesh) alienMesh.position.y =( Math.cos(t * 0.001) / 5) -2;

  bloomPass.clear = true;
  composer.render();
}

// Handle resizing
window.addEventListener("resize", () => {
  myRenderer.setSize(window.innerWidth, window.innerHeight);
  myCamera.aspect = window.innerWidth / window.innerHeight;
  controls.update();
});

export { myRenderer, animate };
