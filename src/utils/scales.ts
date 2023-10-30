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
  // return sctore scales if they exist, otherwise return default scales
  return storedScales.filter((scale: Scale) => theme ? scale.theme === theme : true);
}

export const storeScale = (newScale: Scale): void => {
  const scales = getScales();
  const thisScale = scales.filter((scale) => scale.id === newScale.id);
  // if exists, remove, otherwise ignore ALWAYS add newScle
  const newScales = [
    ...scales.filter((scale) => scale.id !== newScale.id), {
      ...thisScale,
      ...newScale
    }];
  setLocalStorage("SCALES", newScales);
}

export const deleteScale = (scaleId: string): void => {
  const storedScales = getLocalStorage<Scale[]>(
    "SCALES",
    defaultScales
  ) as Scale[];
  const newScales = storedScales.filter((scale) => scale.id !== scaleId);
  setLocalStorage("SCALES", newScales);
}