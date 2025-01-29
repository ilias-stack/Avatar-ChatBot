import * as THREE from "three";
import { myScene } from "./scene";

const textureLoader = new THREE.TextureLoader();

function loadTexture(path) {
  return new Promise((resolve, reject) => {
    textureLoader.load(
      path,
      texture => resolve(texture),
      undefined,
      error => reject(error)
    );
  });
}

function addSunToEnvironment() {
  return new Promise(async (resolve, reject) => {
    try {
      const sunTexture = await loadTexture('../../assets/textures/sun.jpg');
      
      const sunMesh = new THREE.Mesh(
        new THREE.SphereGeometry(10, 32, 32),
        new THREE.MeshBasicMaterial({ map: sunTexture })
      );

      sunMesh.position.set(0,-20,0)

      myScene.add(sunMesh);

      function animateSun() {
        requestAnimationFrame(animateSun);
        sunMesh.rotation.y += 0.004;
      }
      animateSun();

      resolve(sunMesh);
    } catch (error) {
      reject(new Error(`Failed to load sun: ${error.message}`));
    }
  });
}

function addEarthToEnvironment(sunPosition = new THREE.Vector3(0, 0, 0)) {
    return new Promise(async (resolve, reject) => {
      try {
        const [earthMap] = await Promise.all([
          loadTexture('../../assets/textures/earth.png'),
        ]);
  
        const earthMesh = new THREE.Mesh(
          new THREE.SphereGeometry(.5, 32, 32),
          new THREE.MeshPhongMaterial({
            map: earthMap,
          })
        );
  
        const earthOrbit = new THREE.Object3D();
        earthOrbit.position.copy(sunPosition);
        earthMesh.position.set(30, 0, 0);
        earthOrbit.add(earthMesh);
        myScene.add(earthOrbit);
  
        function animateEarth() {
          requestAnimationFrame(animateEarth);
          earthMesh.rotation.y += 0.02;
          earthOrbit.rotation.y += 0.004;
        }
        animateEarth();
  
        resolve({ earthMesh, earthOrbit });
      } catch (error) {
        reject(new Error(`Failed to load earth: ${error.message}`));
      }
    });
  }

export { addEarthToEnvironment, addSunToEnvironment };
