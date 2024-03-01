import { Mode } from '../contexts/themeContext'
import { getLocalStorage, setLocalStorage } from './localStorage';

export type Scale = {
  id: string;
  theme: Mode,
  name: string;
  hue: number;
  hueChange: number;
  saturation: number;
  saturationChange: number;
};

const defaultScales: Scale[] =
  [
    {
      id: "default-light",
      name: "red",
      theme: "light",
      hue: 332,
      hueChange: -1,
      saturation: 100,
      saturationChange: -4,
    },
    {
      id: "default-dark",
      name: "red",
      theme: "dark",
      hue: 332,
      hueChange: -1,
      saturation: 100,
      saturationChange: -4,
    }
  ]

export const getScales = (theme?: Mode): Scale[] => {
  const storedScales = getLocalStorage<Scale[]>(
    "SCALES",
    defaultScales
  ) as Scale[];
  // return stored scales if they exist, otherwise return default scales
  return storedScales.filter((scale: Scale) => theme ? scale.theme === theme : true);
}

export const storeScale = (newScale: Scale): void => {
  const scales = getScales();
  const thisIndex = scales.findIndex((scale) => scale.id === newScale.id);
  // update scales if exists, otherwise add newScale
  if (thisIndex > -1) {
    scales[thisIndex] = {
      ...scales[thisIndex],
      ...newScale
    }
  } else {
    // add new scale to array
    scales.push(newScale);
  }
  // if exists, remove, otherwise ignore ALWAYS add newScle
  setLocalStorage("SCALES", scales);
}

export const deleteScale = (scaleId: string): void => {
  const storedScales = getLocalStorage<Scale[]>(
    "SCALES",
    defaultScales
  ) as Scale[];
  const newScales = storedScales.filter((scale) => scale.id !== scaleId);
  setLocalStorage("SCALES", newScales);
}

export const resetScales = (): Scale[] => {
  setLocalStorage("SCALES", defaultScales);
  return defaultScales;
}