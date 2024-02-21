import { Mode } from '../contexts/themeContext'
import { getColorWithContrast, hslToHex, getContrast } from './colorFunctionsHSL'

export type ScaleConfig = {
  hueChange: number
  saturationChange: number
  theme: Mode
  bg: string,
  steps: number[]
}

export type ScaleStep = {
  contrastRatio: number,
  actualContrastRatio: number,
  index: number,
  h: number,
  s: number,
  l: number,
  hex: string
  stepContrasts: [
    {
      step: number,
      hex: string
      contrastRatio: number,
    }
  ]
}


const calcHue = (startHue: number, index: number, hueChange: number) => {
  const newHue = Number(startHue) + Number(index) * Number(hueChange)
  if (newHue > 360) {
    return newHue - 360
  }
  if (newHue < 0) {
    return 360 + newHue
  }
  return newHue
}

const calcSaturation = (startSaturation: number, index: number, saturationChange: number) => {
  const newSaturation = Number(startSaturation) + Number(index) * Number(saturationChange)
  if (newSaturation > 100) {
    return 100
  }
  if (newSaturation < 0) {
    return 0
  }
  return newSaturation
}

export const generateScale = (startHue: number, startSaturation: number, scaleConfig: ScaleConfig): ScaleStep[] => {
  const { hueChange, saturationChange, theme, bg, steps } = scaleConfig

  let lastLightness = theme === "dark" ? 0 : 100;
  // build scale
  let scale = steps.map((contrastRatio, index) => {
    const hue = calcHue(Number(startHue), Number(index), Number(hueChange));
    const saturation = calcSaturation(Number(startSaturation), Number(index), Number(saturationChange));
    const { l: lightness, actualContrastRatio } = getColorWithContrast(
      { h: hue, s: saturation, l: lastLightness },
      bg,
      contrastRatio,
      theme
    );
    lastLightness = lightness;

    return {
      contrastRatio,
      actualContrastRatio,
      index,
      h: hue,
      s: saturation,
      l: lightness,
      hex: hslToHex({ h: hue, s: saturation, l: lightness })
    };
  });

  // add additional contrast checks
  scale = scale.map((step) => {
    const stepContrasts = [...Array(scale.length)].map((_, i) => ({
      step: i,
      hex: scale[i].hex,
      contrastRatio: getContrast(step.hex, scale[i].hex),
    }));
    return {
      ...step,
      stepContrasts,
    } as ScaleStep;
  });

  return scale as ScaleStep[];
}