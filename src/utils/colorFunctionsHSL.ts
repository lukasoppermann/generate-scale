import Color from "colorjs.io";
import { Mode } from '../contexts/themeContext';

export const hslToHex = ({ h, s, l }: { h: number, s: number, l: number }) => {
  const colorHSL = new Color("hsl", [h, s, l]);
  return colorHSL.to("srgb").toString({ format: "hex" });
};

export const hexToHsl = (hex: string) => {
  const colorHSL = new Color(hex).hsl;
  return {
    h: colorHSL[0],
    s: colorHSL[1],
    l: colorHSL[2],
  };
};

export const getContrast = (colorFgHex: string, colorBgHex: string) => {
  const colorFg = new Color(colorFgHex);
  const colorBg = new Color(colorBgHex);
  return colorFg.contrast(colorBg, "WCAG21");
};


export const getColorWithContrast = (hslColor: { h: number, s: number, l: number }, bgHex: string, contrastRatio: number, theme: Mode) => {
  // deconstruct color
  let { l: lightness } = hslColor;
  const { h, s } = hslColor;
  const { l: bgLightness } = hexToHsl(bgHex);
  //
  let colorHex = hslToHex({ h, s, l: lightness });
  // get color
  if (theme === "light") {
    while ((getContrast(colorHex, bgHex) < contrastRatio && lightness > 0) || lightness > bgLightness) {
      lightness -= 1;
      colorHex = hslToHex({ h, s, l: lightness });
    }
  } else {
    while ((getContrast(colorHex, bgHex) < contrastRatio && lightness < 100) || lightness < bgLightness) {
      lightness += 1;
      colorHex = hslToHex({ h, s, l: lightness });
    }
  }
  // return
  return {
    h,
    s,
    l: lightness,
    actualContrastRatio: getContrast(colorHex, bgHex)
  };
};
