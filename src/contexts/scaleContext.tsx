import React, { createContext, useContext, useEffect, useState } from "react";
import { Mode } from "./themeContext";
import { getLocalStorage, setLocalStorage } from "../utils/localStorage";

type ScaleContextProviderProps = {
  children: React.ReactNode;
};
export type Scale = {
  id: string;
  name: string;
  theme: Mode;
  hue: number;
  hueChange: number;
  saturation: number;
  saturationChange: number;
};

export type Scales = {
  [key in Mode]: Scale[];
};

type ScaleContextType = {
  scales: Scales;
  setScale: (theme: Mode, value: Scale) => void;
  setScales: (theme: Mode, value: Scale[]) => void;
  removeScale: (theme: Mode, id: string) => void;
  resetScales: (theme: Mode) => void;
};

const defaultScales = (): ScaleContextType["scales"] => ({
  light: [
    {
      id: Math.random().toString(36).substring(2, 15),
      name: "red",
      theme: "light",
      hue: 332,
      hueChange: -1,
      saturation: 100,
      saturationChange: -4,
    },
  ],
  dark: [
    {
      id: Math.random().toString(36).substring(2, 15),
      name: "red",
      theme: "dark",
      hue: 332,
      hueChange: -1,
      saturation: 100,
      saturationChange: -4,
    },
  ],
});

export const ScaleContext = createContext<ScaleContextType | null>(null);

export default function ScaleContextProvider({
  children,
}: ScaleContextProviderProps) {
  const [scales, setScalesObject] = useState<ScaleContextType["scales"]>(
    () =>
      getLocalStorage(
        "OLD_SCALES",
        defaultScales()
      ) as ScaleContextType["scales"]
  );

  useEffect(() => {
    setLocalStorage("OLD_SCALES", scales);
  }, [scales]);

  const setScales = (theme: Mode, scale: Scale[]) => {
    const newScales = { ...scales, [theme]: scale };
    setScalesObject(newScales);
  };

  const setScale = (theme: Mode, scale: Scale) => {
    // mode item
    const newScales = { ...scales };
    const index = newScales[theme].findIndex((s) => s.id === scale.id);
    if (index > -1) {
      newScales[theme][index] = scale;
    } else {
      newScales[theme].push(scale);
    }
    setScalesObject(newScales);
  };

  const removeScale = (theme: Mode, id: string) => {
    const newScales = { ...scales };
    newScales[theme] = newScales[theme].filter((scale) => scale.id !== id);
    if (newScales[theme].length === 0) {
      newScales[theme] = defaultScales()[theme];
    }
    setScalesObject(newScales);
  };

  const resetScales: ScaleContextType["resetScales"] = (theme: Mode) => {
    const newScales = { ...scales, [theme]: defaultScales()[theme] };
    setScalesObject(newScales);
  };

  return (
    <ScaleContext.Provider
      value={{
        scales,
        setScale,
        setScales,
        removeScale,
        resetScales,
      }}
    >
      {children}
    </ScaleContext.Provider>
  );
}

export function useScaleContext() {
  const context = useContext(ScaleContext);
  if (!context) {
    throw new Error(
      "useScaleContext must be used within a ScaleContextProvider"
    );
  }
  return context;
}
