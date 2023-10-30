import {
  getColorWithContrast,
  hslToHex as toHex
} from "./utils/colorFunctionsHSL";

// setup
const startHue = 360;
const startSaturation = 100;
const steps = [1.1, 1.3, 1.7, 2.2, 3, 4.5, 7, 9, 12, 15];
const hueChange = 1;
const SaturationChange = 2;
const bgHex = "#ffffff";

// ---------------------
// BUILD
let lastLightness = 100;
// build scale
const values = steps.map((contrastRatio, index) => {
  const hue = startHue - index * hueChange;
  const saturation = startSaturation - index * SaturationChange;
  const { l: lightness, actualContrastRatio } = getColorWithContrast(
    { h: hue, s: saturation, l: lastLightness },
    bgHex,
    contrastRatio,
    "light"
  );
  lastLightness = lightness;
  return {
    contrastRatio,
    actualContrastRatio,
    index,
    h: hue,
    s: saturation,
    l: lightness,
    hex: toHex({ h: hue, s: saturation, l: lightness })
  };
});


// paintScale(values);
// show scale
// const output = document.getElementById("output");
// output.innerText = values.map((color) => color.hex).join("\n");
