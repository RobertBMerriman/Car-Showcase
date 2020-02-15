import { Object3D, Mesh } from "three";

export const objIsMesh = (x: Object3D): x is Mesh => x.type === "Mesh";
