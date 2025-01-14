import * as THREE from "three";
import { myScene } from "./scene.js";


function addStars(numberStars = 500) {
  const starMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xff0000,
  });

  for (let i = 0; i < numberStars; i++) {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const star = new THREE.Mesh(geometry, starMaterial);

    // Random position for the stars
    const [x, y, z] = Array(3)
      .fill()
      .map(() => THREE.MathUtils.randFloatSpread(200));
    star.position.set(x, y, z);
    myScene.add(star);
  }
}



export { addStars };
