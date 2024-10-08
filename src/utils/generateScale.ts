import { Mode } from '../contexts/themeContext'
import { getColorWithContrast, hslToHex, getContrast } from './colorFunctionsHSL'

export type ScaleConfig = {
  hueChange: number
  hueFromStep: number
  saturationChange: number
  saturationFromStep: number;
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


const calcHue = (startHue: number, index: number, hueChange: number, hueFromStep: number) => {
  // only change hue if we are at the hueFromChange step
  if (index + 1 < hueFromStep) {
    return startHue
  }
  console.log("hueFromStep", Number(hueFromStep))
  const changeMultiplier = index - (hueFromStep - 1)

  const newHue = Number(startHue) + Number(changeMultiplier) * Number(hueChange)
  if (newHue > 360) {
    return newHue - 360
  }
  if (newHue < 0) {
    return 360 + newHue
  }
  return newHue
}

const calcSaturation = (startSaturation: number, index: number, saturationChange: number, saturationFromStep: number) => {
  // only change saturation if we are at the hueFromChange step
  if (index+1 < saturationFromStep) {
    return startSaturation
  }
  console.log("saturationFromStep", Number(saturationFromStep))
  const changeMultiplier = index - (saturationFromStep - 1)

  const newSaturation = Number(startSaturation) + Number(changeMultiplier) * Number(saturationChange)
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
  let {hueFromStep, saturationFromStep} = scaleConfig;

  if(!hueFromStep || hueFromStep === 0) hueFromStep = 1;
  if(!saturationFromStep || saturationFromStep === 0) saturationFromStep = 1;

  let lastLightness = theme === "dark" ? 0 : 100;
  // build scale
  let scale = steps.map((contrastRatio, index) => {
    const hue = calcHue(Number(startHue), Number(index), Number(hueChange), Number(hueFromStep));
    const saturation = calcSaturation(Number(startSaturation), Number(index), Number(saturationChange), Number(saturationFromStep));
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