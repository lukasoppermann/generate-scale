import React, { createContext, useContext, useEffect, useState } from "react";
import { getLocalStorage, setLocalStorage } from "../utils/localStorage";

type ConfigContextProviderProps = {
  children: React.ReactNode;
};
type ModeConfig = {
  bg: string;
  steps: number[];
};

type itemPath =
  | "showHSL"
  | "light.bg"
  | "dark.bg"
  | "light.steps"
  | "dark.steps";

export type Config = {
  showHSL: boolean;
  dark: ModeConfig;
  light: ModeConfig;
  [key: string]: unknown;
};

type ConfigContextType = {
  config: Config;
  setConfig: (itemPath: itemPath, value: unknown) => void;
  resetConfig: () => void;
};

const defaultConfig: Config = {
  showHSL: false,
  light: {
    bg: "#ffffff",
    steps: [1.1, 1.3, 1.7, 2.2, 3, 4.5, 7, 9, 12, 15],
  },
  dark: {
    bg: "#000000",
    steps: [1.2, 1.3, 1.7, 2.2, 3, 4.5, 7, 8, 10, 12],
  },
};

export const ConfigContext = createContext<ConfigContextType | null>(null);

export default function ConfigContextProvider({
  children,
}: ConfigContextProviderProps) {
  const [config, setConfigObject] = useState<Config>(
    () => getLocalStorage<Config>("CONFIG") as Config
  );

  const setConfig = (itemString: itemPath, value: unknown): void => {
    const [item, mode] = itemString.split(".").reverse();
    // mode item
    if (
      mode &&
      config[mode] &&
      (config[mode] as ModeConfig)[item as keyof ModeConfig] !== undefined
    ) {
      setConfigObject({
        ...config,
        [mode]: { ...(config[mode] as ModeConfig), [item]: value },
      });
      setLocalStorage("CONFIG", {
        ...config,
        [mode]: { ...(config[mode] as ModeConfig), [item]: value },
      });
      return;
    } else if (!mode && config[item] !== undefined) {
      setConfigObject({
        ...config,
        [item]: value,
      });
      setLocalStorage("CONFIG", {
        ...config,
        [item]: value,
      });
      return;
    }
    // invalid config item
    console.error(
      `Trying to set invalid config it ${item}${
        mode ? ` with ${mode}` : ""
      } in setConfig.`
    );
    return;
  };

  const resetConfig = () => {
    localStorage.removeItem("config");
    setConfigObject(defaultConfig);
  };

  return (
    <ConfigContext.Provider
      value={{
        config,
        setConfig,
        resetConfig,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfigContext() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error(
      "useConfigContext must be used within a ConfigContextProvider"
    );
  }
  return context;
}
