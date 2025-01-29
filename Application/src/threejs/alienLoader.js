import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { myScene } from "./scene";

let mixer; 
let animations = []; 

function addAlienToScene() {
  return new Promise((resolve, reject) => {
    const gltfLoader = new GLTFLoader();

    gltfLoader.load(
      "../../assets/Alien_Avatar.glb",
      (gltf) => {
        const object = gltf.scene;
        animations = gltf.animations; 

        // Add the model to the scene
        object.position.set(0, 0, 0);
        myScene.add(object);

        if (animations && animations.length > 0) {
          // Set up the AnimationMixer
          mixer = new THREE.AnimationMixer(object);

          // Add the mixer to the render loop
          const clock = new THREE.Clock();
          function animate() {
            requestAnimationFrame(animate);

            // Update the mixer based on the elapsed time
            const delta = clock.getDelta();
            mixer.update(delta);
          }
          animate();
        } else {
          console.warn("No animations found in the GLB file.");
        }

        resolve(object);
      },
      undefined,
      (error) => {
        console.error("Failed to load GLB:", error.message);
        reject(error);
      }
    );
  });
}

function playAnimationByName(animationName) {
  let name = animationName.charAt(0).toUpperCase() + animationName.slice(1);
  if (!mixer) {
    console.warn("AnimationMixer is not initialized.");
    return Promise.resolve();
  }

  const clip = animations.find((anim) => anim.name === name);
  if (clip) {
    return new Promise((resolve) => {
      const action = mixer.clipAction(clip);
      action.reset(); // Ensure the animation starts from the beginning
      action.setLoop(THREE.LoopOnce); // Play only once
      action.clampWhenFinished = true; // Stop at the last frame

      const onFinished = (event) => {
        if (event.action === action) {
          mixer.removeEventListener("finished", onFinished); // Properly remove listener
          resolve();
        }
      };

      mixer.addEventListener("finished", onFinished);
      action.play();
    });
  } else {
    console.warn(`Animation "${name}" not found.`);
    return Promise.resolve();
  }
}

export { addAlienToScene, playAnimationByName };
