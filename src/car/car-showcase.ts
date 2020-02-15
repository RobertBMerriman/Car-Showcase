import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Object3D, Mesh } from "three";
import dat from "dat.gui";

const objIsMesh = (x: Object3D): x is Mesh => x.type === "Mesh";

const changeMaterial = (part: Object3D | undefined, materialParams: THREE.MeshStandardMaterialParameters) => {
  if (part) {
    part.children.forEach(mesh => {
      if (objIsMesh(mesh)) {
        mesh.material = new THREE.MeshStandardMaterial(materialParams); // change so it doesn't create new material
      }
    });
  }
};

interface CarParts {
  body?: Object3D;
}

const carParts: CarParts = { body: undefined };

export const main = () => {
  const canvas: HTMLCanvasElement | null = document.querySelector("#c");
  if (!canvas) return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xaaaaaa);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

  const fov = 40;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  // camera.rotation.y = (45 / 180) * Math.PI;
  camera.position.set(37.5, 12.5, 25);

  const controls = new OrbitControls(camera, canvas);
  controls.addEventListener("change", e => {
    // requestAnimationFrame(render);
  });

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

    scene.add(gltf.scene);
    requestAnimationFrame(render);
  });

  const intensity = 50;
  const ambientLight = new THREE.AmbientLight(0xcccccc, intensity * 2);
  scene.add(ambientLight);

  const color = 0xfcfcfc;
  const keyLight = new THREE.DirectionalLight(color, intensity);
  keyLight.position.set(10, 3, 0);
  keyLight.castShadow = true;
  scene.add(keyLight);
  // scene.add(new THREE.DirectionalLightHelper(keyLight));

  const fillLight = new THREE.DirectionalLight(color, intensity / 2);
  fillLight.position.set(-10, 5, 10);
  scene.add(fillLight);
  // scene.add(new THREE.DirectionalLightHelper(fillLight));

  const backLight = new THREE.DirectionalLight(color, intensity / 4);
  backLight.position.set(-5, 10, -10);
  scene.add(backLight);
  // scene.add(new THREE.DirectionalLightHelper(backLight));

  const bodyColours = {
    custom: {
      color: 0x000000,
      metalness: 1.0,
      roughness: 0.2,
      name: "custom"
    },
    black: {
      color: 0x000000,
      metalness: 0.2,
      roughness: 0.2,
      name: "black"
    },
    white: {
      color: 0xffffff,
      metalness: 0.2,
      roughness: 0.2,
      name: "white"
    },
    orange: {
      color: 0xff4400,
      metalness: 1.0,
      roughness: 0.2,
      name: "orange"
    },
    blue: {
      color: 0x08557f,
      metalness: 1.0,
      roughness: 0.2,
      name: "blue"
    },
    lime: {
      color: 0x4bff00,
      metalness: 1.0,
      roughness: 0.2,
      name: "lime"
    },
    silver: {
      color: 0xb3c7d2,
      metalness: 1.0,
      roughness: 0.2,
      name: "silver"
    },
    gunmetal: {
      color: 0x232b2f,
      metalness: 1.0,
      roughness: 0.2,
      name: "gunmetal"
    },
    deepcherry: {
      color: 0xac0000,
      metalness: 1.0,
      roughness: 0.2,
      name: "deepcherry"
    },
    magenta: {
      color: 0x4a00ff,
      metalness: 1.0,
      roughness: 0.2,
      name: "magenta"
    }
  };
  const gui = new dat.GUI();
  let colours = {
    body: "orange"
  };
  const bodyColourUi = gui.add(colours, "body", {
    Black: "black",
    White: "white",
    Blue: "blue",
    Orange: "orange",
    Lime: "lime",
    Silver: "silver",
    Gunmetal: "gunmetal",
    "Deep cherry": "deepcherry",
    Magenta: "magenta",
    Custom: "custom"
  });
  bodyColourUi.onChange((value: keyof typeof bodyColours) => {
    changeMaterial(carParts.body, bodyColours[value]);
    changeableColor["Change body color"] = bodyColours[value].color;
    pickerGui.updateDisplay();
  });

  const changeCustom = () => {
    changeMaterial(carParts.body, bodyColours.custom);
    bodyColourUi.setValue("custom");
    bodyColourUi.updateDisplay();
  };

  const changeColor = (color: number) => {
    bodyColours.custom.color = color;
    changeCustom();
  };

  const changeMetalness = (metalness: number) => {
    bodyColours.custom.metalness = metalness;
    changeCustom();
  };

  const changeRoughness = (roughness: number) => {
    bodyColours.custom.roughness = roughness;
    changeCustom();
  };

  const changeableColor = {
    "Change body color": 0x000000,
    Metalness: 1.0,
    Roughness: 0.2
  };

  const pickerGui = gui.addColor(changeableColor, "Change body color");
  pickerGui.onChange(changeColor);

  // gui.add(changeableColor, "Metalness", 0, 1, 0.05).onChange(changeMetalness);
  // gui.add(changeableColor, "Roughness", 0, 1, 0.05).onChange(changeRoughness);

  function render(time: number) {
    // const seconds = time * 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    controls.update();

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
};

function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio;
  const width = (canvas.clientWidth * pixelRatio) | 0;
  const height = (canvas.clientHeight * pixelRatio) | 0;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}
