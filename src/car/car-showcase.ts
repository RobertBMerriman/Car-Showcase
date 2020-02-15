import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  Object3D,
  Scene,
  Camera,
  PerspectiveCamera,
  Color,
  WebGLRenderer,
  AmbientLight,
  DirectionalLight,
  DirectionalLightHelper
} from "three";
import { setupGui } from "./gui/guiManager";

const DEBUG = true;

export interface CarParts {
  body?: Object3D;
}

const carParts: CarParts = { body: undefined };

const setupScene = (canvas: HTMLCanvasElement): Scene => {
  const scene = new Scene();
  scene.background = new Color(0xaaaaaa);
  return scene;
};

const setupCamera = (): PerspectiveCamera => {
  const fov = 40;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 1000;
  const camera = new PerspectiveCamera(fov, aspect, near, far);
  // camera.rotation.y = (45 / 180) * Math.PI;
  camera.position.set(37.5, 12.5, 25);
  return camera;
};

const setupControls = (canvas: HTMLCanvasElement, camera: Camera): OrbitControls => {
  const controls = new OrbitControls(camera, canvas);
  // controls.addEventListener("change", e => {
  //   // requestAnimationFrame(render);
  // });
  controls.maxPolarAngle = Math.PI / (180 / 95);
  controls.minPolarAngle = Math.PI / (180 / 35);
  // controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5; // 2 default
  controls.enableDamping = true;
  controls.dampingFactor = 0.1; // 0.05 default
  controls.enablePan = false;
  controls.minDistance = 20;
  controls.maxDistance = 100;
  controls.zoomSpeed = 0.8; // 1 default
  controls.rotateSpeed = 0.8; // 1 default
  return controls;
};

const setupLighting = (scene: Scene) => {
  const intensity = 50;
  const ambientLight = new AmbientLight(0xcccccc, intensity * 2);
  scene.add(ambientLight);

  const color = 0xfcfcfc;
  const keyLight = new DirectionalLight(color, intensity);
  keyLight.position.set(10, 3, 0);
  keyLight.castShadow = true;
  scene.add(keyLight);

  const fillLight = new DirectionalLight(color, intensity / 2);
  fillLight.position.set(-10, 5, 10);
  scene.add(fillLight);

  const backLight = new DirectionalLight(color, intensity / 3);
  backLight.position.set(-5, 10, -10);
  scene.add(backLight);

  if (DEBUG) {
    scene.add(new DirectionalLightHelper(keyLight));
    scene.add(new DirectionalLightHelper(fillLight));
    scene.add(new DirectionalLightHelper(backLight));
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

  setupGui(carParts);

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

const resizeRendererToDisplaySize = (renderer: WebGLRenderer) => {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio;
  const width = (canvas.clientWidth * pixelRatio) | 0;
  const height = (canvas.clientHeight * pixelRatio) | 0;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
};
