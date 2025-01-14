import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { TextureLoader } from "three";
import { myScene } from "./scene";

function addAlienToScene() {
  return new Promise((resolve, reject) => {
    // Load the texture
    const textureLoader = new TextureLoader();
    const texture = textureLoader.load(
      "../../assets/Alien.png",
      () => {
        console.log("Texture loaded successfully");
      },
      undefined,
      (error) => {
        console.error("Failed to load texture:", error);
        reject(error);
      }
    );

    // Load the FBX model
    const fbxLoader = new FBXLoader();
    fbxLoader.load(
      "../../assets/Alien.fbx",
      (object) => {
        object.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
              map: texture,
            });
          }
        });
        object.position.set(0, 0, 0);
        object.layers.set(1);
        object.scale.set(0.01, 0.01, 0.01);
        myScene.add(object);
        resolve(object); 
      },
      undefined,
      (error) => {
        console.error("Failed to load FBX:", error);
        reject(error);
      }
    );
  });
}

export { addAlienToScene };
