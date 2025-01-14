import * as THREE from "three";
import { addStars } from "./starsEffect";



// Create a new scene
const myScene = new THREE.Scene();

// Create a point light with a white color and a higher intensity
const pointLight = new THREE.PointLight(0xffffff, 20, 100); // intensity, distance
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xfafafa, 5);

myScene.add(pointLight);
myScene.add(ambientLight);

// myScene.add(new THREE.PointLightHelper(pointLight));
// myScene.add(new THREE.GridHelper(200, 50));
addStars()
export { myScene };
