import { objIsMesh } from "./types/checkers";
import { Object3D, MeshStandardMaterialParameters, MeshStandardMaterial } from "three";

export const changeMaterial = (part: Object3D | undefined, materialParams: MeshStandardMaterialParameters) => {
  if (part) {
    part.children.forEach(mesh => {
      if (objIsMesh(mesh)) {
        mesh.material = new MeshStandardMaterial(materialParams); // change so it doesn't create new material
      }
    });
  }
};
