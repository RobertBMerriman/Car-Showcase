import { Scene, Color, PerspectiveCamera, Camera, AmbientLight, DirectionalLight, DirectionalLightHelper } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DEBUG } from "./car-showcase";

export const setupScene = (canvas: HTMLCanvasElement): Scene => {
  const scene = new Scene();
  scene.background = new Color(0xaaaaaa);
  return scene;
};

export const setupCamera = (): PerspectiveCamera => {
  const fov = 40;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 1000;
  const camera = new PerspectiveCamera(fov, aspect, near, far);
  // camera.rotation.y = (45 / 180) * Math.PI;
  camera.position.set(37.5, 12.5, 25);
  return camera;
};

export const setupControls = (canvas: HTMLCanvasElement, camera: Camera): OrbitControls => {
  const controls = new OrbitControls(camera, canvas);
  // controls.addEventListener("change", e => {
  //   // requestAnimationFrame(render);
  // });
  // controls.maxPolarAngle = Math.PI / (180 / 95);
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

export const setupLighting = (scene: Scene) => {
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
