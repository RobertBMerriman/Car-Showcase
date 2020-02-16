import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Object3D, WebGLRenderer, Vector3, AxesHelper, Math as Math3 } from "three";
import { setupGui } from "./gui/guiManager";
import { setupScene, setupCamera, setupControls, setupLighting } from "./setup";
import { resizeRendererToDisplaySize } from "./render";

export const DEBUG = false;

export interface CarParts {
  body: Object3D;
  wheels: {
    front: {
      left: Object3D;
      right: Object3D;
    };
    back: {
      left: Object3D;
      right: Object3D;
    };
  };
}

let carParts: CarParts;

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

  if (DEBUG) {
    const axesHelper = new AxesHelper(15);
    scene.add(axesHelper);
  }

  const loader = new GLTFLoader();
  let car: Object3D;
  loader.load("car-model/scene.gltf", gltf => {
    car = gltf.scene.children[0];
    car.scale.set(0.01, 0.01, 0.01);

    const floor = car.getObjectByName("Plane035");
    if (floor) {
      floor.visible = false;
    }

    carParts = {
      body: car.getObjectByName("Plane045")!,
      wheels: {
        front: {
          left: car.getObjectByName("Cylinder011")!,
          right: car.getObjectByName("Cylinder007")!
        },
        back: {
          left: car.getObjectByName("Cylinder012")!,
          right: car.getObjectByName("Cylinder013")!
        }
      }
    };

    carParts.wheels.front.left.rotateZ((Math.PI / 180) * 15);
    carParts.wheels.front.right.rotateZ((Math.PI / 180) * 15);
    const wonkyWheel = carParts.wheels.front.left;
    wonkyWheel.rotateZ((Math.PI / 180) * -3);
    wonkyWheel.rotateZ(Math.PI);
    wonkyWheel.translateY(-0.3);
    wonkyWheel.translateX(0.05);
    carParts.wheels.back.left.rotateZ(Math.PI);

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

    if (carParts) {
      const left = carParts.wheels.front.left;

      const turnSpeed = Math3.degToRad(0.1);
      left.rotateOnWorldAxis(new Vector3(0, 0, -1).normalize(), turnSpeed);
      carParts.wheels.front.right.rotateOnWorldAxis(new Vector3(0, -1, 0).normalize(), turnSpeed);

      const driveSpeed = Math3.degToRad(-2);
      left.rotateX(driveSpeed);
      carParts.wheels.front.right.rotateX(driveSpeed);
      carParts.wheels.back.left.rotateX(driveSpeed);
      carParts.wheels.back.right.rotateX(driveSpeed);
    }

    controls.update();

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
};
