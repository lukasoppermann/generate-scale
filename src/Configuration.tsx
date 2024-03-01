import "./Configuration.css";
import React, { FC } from "react";
import {
  Button,
  ContrastRatios,
  Disclosure,
  NamedColorSwatch,
  Toggle,
} from "./components";
import { useConfigContext } from "./contexts";


interface Props {
  resetScales: () => void;
}

const Configuration: FC<Props> = ({ resetScales }) => {
  const { config, setConfig, resetConfig } = useConfigContext();
  // const { resetScales } = useScaleContext();
  // const { theme } = useThemeContext();

  // const addStep = (mode: "light" | "dark") => {
  //   return (event: React.MouseEvent<HTMLButtonElement>) => {
  //     event.preventDefault();
  //     const newSteps = [
  //       ...config[mode].steps,
  //       config[mode].steps[config[mode].steps.length - 1] + 1,
  //     ];
  //     setConfig(`${mode}.steps`, newSteps);
  //   };
  // };

  // const removeStep = (mode: "light" | "dark", index: number) => {
  //   const newSteps = [...config[mode].steps];
  //   newSteps.splice(index, 1);
  //   setConfig(`${mode}.steps`, newSteps);
  // };

  return (
    <form className="Configuration">
      <h4>Background Colors</h4>
      <div className="bg-colors">
        <NamedColorSwatch
          name="Light Mode"
          color={config.light.bg}
          onChange={(event) => setConfig("light.bg", event.target.value)}
        />
        <NamedColorSwatch
          name="Dark Mode"
          color={config.dark.bg}
          onChange={(event) => setConfig("dark.bg", event.target.value)}
        />
      </div>
      <Disclosure title="Light Mode Settings">
        <h4>Contrast ratios</h4>
        <ContrastRatios theme="light" />
      </Disclosure>
      <Disclosure title="Dark Mode Settings">
        <h4>Contrast ratios</h4>
        <ContrastRatios theme="dark" />
      </Disclosure>
      <Disclosure title="Settings">
        <Toggle
          label="Show HSL"
          checked={config.showHSL}
          onChange={(event) => setConfig("showHSL", event.target.checked)}
        />
      </Disclosure>
      <div className="footer">
        <Button variant="danger" className="resetScales" onClick={resetScales}>
          Reset scales
        </Button>
        <Button
          variant="danger"
          className="resetConfig"
          onClick={() => resetConfig()}
        >
          Reset Config
        </Button>
      </div>
    </form>
  );
};

export default Configuration;
