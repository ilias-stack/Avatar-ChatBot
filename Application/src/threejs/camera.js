import * as THREE from "three";

const myCamera = new THREE.PerspectiveCamera(
  90,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
myCamera.position.z = 3.5;
myCamera.position.y=1

export { myCamera };
