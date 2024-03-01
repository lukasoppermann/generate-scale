import React, { createContext, useContext, useState } from "react";
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
  setConfigObject: (config: unknown) => void;
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
  const [config, _setConfigObject] = useState<Config>(
    () => getLocalStorage<Config>("CONFIG", defaultConfig) as Config
  );
  // validate config before setting
  const setConfigObject = (config: unknown): void => {
    // is it an object?
    if (!config || typeof config !== "object") {
      throw new Error(
        "Invalid config parameter, setConfigObject expects an object"
      );
    }
    // TODO: replace with zod
    // does it have the right keys?
    if (
      !("showHSL" in config) ||
      !("light" in config) ||
      !("dark" in config) ||
      !config.light ||
      !config.dark ||
      typeof config.light !== "object" ||
      typeof config.dark !== "object" ||
      !("bg" in config.light) ||
      !("steps" in config.light) ||
      !("bg" in config.dark) ||
      !("steps" in config.dark)
    ) {
      throw new Error(
        "Invalid config parameter, setConfigObject expects an object with the keys showHSL, light.bg, light.steps, dark.bg, dark.steps"
      );
    }
    // are the values the right type?
    if (
      typeof config.showHSL !== "boolean" ||
      typeof config.light.bg !== "string" ||
      !Array.isArray(config.light.steps) ||
      typeof config.dark.bg !== "string" ||
      !Array.isArray(config.dark.steps)
    ) {
      throw new Error(
        "Invalid config parameter, setConfigObject expects an object with the keys showHSL as boolean, light.bg as string, light.steps as array, dark.bg as string, dark.steps as array"
      );
    }

    _setConfigObject(config as Config);
  };

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
    setLocalStorage("CONFIG", defaultConfig);
    setConfigObject(defaultConfig);
  };

  return (
    <ConfigContext.Provider
      value={{
        config,
        setConfig,
        setConfigObject,
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
