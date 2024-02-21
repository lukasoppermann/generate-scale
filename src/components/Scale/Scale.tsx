import { Button, Fieldset, Input, Swatch } from "..";
import "./Scale.css";
import React, { FC, useEffect, useReducer } from "react";
import { ScaleStep, generateScale } from "../../utils/generateScale";
import { useThemeContext } from "../../contexts";
import { useConfigContext } from "../../contexts";
const huename = require("hue-name");

type ScaleProps = {
  name: string;
  hue: number;
  hueChange: number;
  saturation: number;
  saturationChange: number;
};

interface Props extends ScaleProps {
  id: string;
  onChange: (id: string, key: keyof ScaleProps, value: string | number) => void;
  onRemove: (id: string) => void;
  onSelectStep: (step?: number) => void;
  selectedStep: number | undefined;
}

const scaleBgMuted = (theme: "light" | "dark") => {
  return theme === "dark" ? "rgba(250,252,255,0.1)" : "rgba(0,5,10,0.02)";
};

const trashSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    width="16"
    height="16"
  >
    <path d="M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675l.66 6.6a.25.25 0 0 0 .249.225h5.19a.25.25 0 0 0 .249-.225l.66-6.6a.75.75 0 0 1 1.492.149l-.66 6.6A1.748 1.748 0 0 1 10.595 15h-5.19a1.75 1.75 0 0 1-1.741-1.575l-.66-6.6a.75.75 0 1 1 1.492-.15ZM6.5 1.75V3h3V1.75a.25.25 0 0 0-.25-.25h-2.5a.25.25 0 0 0-.25.25Z"></path>
  </svg>
);

const Scale: FC<Props> = ({
  id,
  name: initialName,
  hue: initialHue,
  hueChange: initialHueChange,
  saturation: initialSaturation,
  saturationChange: initialsaturationChange,
  onChange,
  onRemove,
  onSelectStep,
  selectedStep,
}) => {
  const [scale, updateScale] = useReducer(
    (prev: ScaleProps, next: Partial<ScaleProps>) => {
      const newScale = { ...prev, ...next };
      // Ensure that the start date is never after the end date
      if (newScale.name === "") {
        newScale.name = huename(newScale.hue);
      }
      console.log(newScale);

      return newScale;
    },
    {
      name: initialName,
      hue: initialHue,
      hueChange: initialHueChange,
      saturation: initialSaturation,
      saturationChange: initialsaturationChange,
    }
  );
  const [hue, setHue] = React.useState(initialHue);
  const [hueChange, setHueChange] = React.useState(initialHueChange);
  const [saturation, setSaturation] = React.useState(initialSaturation);
  const [saturationChange, setSaturationChange] = React.useState(
    initialsaturationChange
  );
  const [colors, setColors] = React.useState<ScaleStep[]>([]);
  const { theme } = useThemeContext();
  const { config } = useConfigContext();

  useEffect(() => {
    setColors(
      generateScale(hue, saturation, {
        hueChange,
        saturationChange,
        theme,
        bg: config[theme].bg,
        steps: config[theme].steps,
      })
    );
  }, [config, hue, hueChange, saturation, saturationChange, theme]);

  return (
    <div
      className="scale"
      style={
        {
          "--scale-bg": config[theme].bg,
          "--scale-bg-muted": scaleBgMuted(theme),
        } as React.CSSProperties
      }
    >
      <div className="title">
        <h3>Scale #{id}</h3>
        <Input
          className="scale-name"
          value={scale.name}
          onChange={(event) => {
            updateScale({ name: event.target.value });
            onChange(id, "name", event.target.value);
          }}
        />
        <Button
          variant="danger"
          className="button-remove-scale"
          onClick={() => onRemove(id)}
        >
          {trashSvg}
        </Button>
      </div>
      <div className="controls">
        <Fieldset label="Hue">
          <Input
            label="Start"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              onChange(id, "hue", Number(event.target.value));
              setHue(Number(event.target.value));
            }}
            type="number"
            value={hue}
            min="0"
            max="360"
          />
          <Input
            label="Increase"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              onChange(id, "hueChange", Number(event.target.value));
              setHueChange(Number(event.target.value));
            }}
            type="number"
            value={hueChange}
            min="-20"
            max="20"
          />
        </Fieldset>
        <Fieldset label="Saturation">
          <Input
            label="Start"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              onChange(id, "saturation", Number(event.target.value));
              setSaturation(Number(event.target.value));
            }}
            type="number"
            value={saturation}
            min="0"
            max="100"
          />
          <Input
            label="Increase"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              onChange(id, "saturationChange", Number(event.target.value));
              setSaturationChange(Number(event.target.value));
            }}
            type="number"
            value={saturationChange}
            min="-20"
            max="20"
          />
        </Fieldset>
      </div>
      <div className="colors">
        {colors.map((color: any) => (
          <Swatch
            color={color}
            key={color.contrastRatio}
            onSelectStep={onSelectStep}
            selectedStep={selectedStep}
          />
        ))}
      </div>
    </div>
  );
};

export default Scale;
