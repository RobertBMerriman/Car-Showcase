import { changeMaterial } from "../materialManager";
import { bodyColours } from "./colours";
import dat from "dat.gui";
import { CarParts } from "../car-showcase";

export const setupGui = (carParts: CarParts) => {
  const gui = new dat.GUI();
  const bodyColourUi = gui.add({ body: "blue" }, "body", {
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
  const setBodyColour = (value: keyof typeof bodyColours) => {
    changeMaterial(carParts.body, bodyColours[value]);
    changeableColor["Change body color"] = bodyColours[value].color;
    pickerGui.updateDisplay();
  };
  bodyColourUi.onChange(setBodyColour);

  const changeCustom = () => {
    changeMaterial(carParts.body, bodyColours.custom);
    bodyColourUi.setValue("custom");
    bodyColourUi.updateDisplay();
  };

  const changeColor = (color: number) => {
    bodyColours.custom.color = color;
    changeCustom();
  };

  // const changeMetalness = (metalness: number) => {
  //   bodyColours.custom.metalness = metalness;
  //   changeCustom();
  // };

  // const changeRoughness = (roughness: number) => {
  //   bodyColours.custom.roughness = roughness;
  //   changeCustom();
  // };

  const changeableColor = {
    "Change body color": bodyColours.blue.color,
    Metalness: 1.0,
    Roughness: 0.2
  };

  const pickerGui = gui.addColor(changeableColor, "Change body color");
  pickerGui.onChange(changeColor);

  // gui.add(changeableColor, "Metalness", 0, 1, 0.05).onChange(changeMetalness);
  // gui.add(changeableColor, "Roughness", 0, 1, 0.05).onChange(changeRoughness);
  setBodyColour("blue");
};
