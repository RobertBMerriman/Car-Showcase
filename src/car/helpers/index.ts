import { Color } from "three";

export class ColorGUIHelper {
  object: Array<Color>;
  prop: number;

  constructor(object: Array<Color>, prop: number) {
    this.object = object;
    this.prop = prop;
  }
  get value() {
    return `#${this.object[this.prop].getHexString()}`;
  }
  set value(hexString) {
    this.object[this.prop].set(hexString);
  }
}
