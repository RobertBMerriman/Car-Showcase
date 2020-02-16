import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Object3D, WebGLRenderer } from "three";
import { setupGui } from "./gui/guiManager";
import { setupScene, setupCamera, setupControls, setupLighting } from "./setup";
import { resizeRendererToDisplaySize } from "./render";

export const DEBUG = false;

export interface CarParts {
  body?: Object3D;
  wheels: {
    front?: (Object3D | undefined)[];
    back?: (Object3D | undefined)[];
  };
}

const carParts: CarParts = {
  body: undefined,
  wheels: {
    front: undefined,
    back: undefined
  }
};

export const main = () => {
  const canvas: HTMLCanvasElement | null = document.querySelector("#c");
  if (!canvas) {
    console.error("NO AVAILABLE CANVAS AAHAARRRGHHGHGHGH >>:((((((");
    return;
  }

  const scene = setupScene(canvas);
  const renderer = new WebGLRenderer({ canvas, antialias: true });
  const camera = setupCamera();
  const controls = setupControls(canvas, camera);

  setupLighting(scene);

  const loader = new GLTFLoader();
  let car: Object3D;
  loader.load("car-model/scene.gltf", gltf => {
    car = gltf.scene.children[0];
    car.scale.set(0.01, 0.01, 0.01);

    const floor = car.getObjectByName("Plane035");
    if (floor) {
      floor.visible = false;
    }

    carParts.body = car.getObjectByName("Plane045");
    carParts.wheels = {
      front: [car.getObjectByName("Cylinder012"), car.getObjectByName("Cylinder013")],
      back: [car.getObjectByName("Cylinder011"), car.getObjectByName("Cylinder007")]
    };
    setupGui(carParts);

    controls.target = car.position;

    scene.add(gltf.scene);
    requestAnimationFrame(render);
  });

  const render = (time: number) => {
    // const seconds = time * 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    controls.update();

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
};
