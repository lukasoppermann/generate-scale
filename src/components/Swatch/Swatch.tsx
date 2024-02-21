import Color from "colorjs.io";
import { ScaleStep } from "../../utils/generateScale";
import "./Swatch.css";
import React, { FC } from "react";
import { useConfigContext } from "../../contexts/configContext";
import Token from "../Token/Token";

interface Props {
  color: ScaleStep;
  onSelectStep: (step?: number) => void;
  selectedStep: number | undefined;
}

const textColor = (hex: string): string => {
  const color = new Color(hex);
  return color.contrast("black", "WCAG21") > color.contrast("white", "WCAG21")
    ? `#000`
    : `#fff`;
};

const Swatch: FC<Props> = ({ color, onSelectStep, selectedStep }) => {
  const { config } = useConfigContext();
  console.log(color);

  return (
    <div
      onClick={() => {
        if (selectedStep === undefined || selectedStep !== color.index) {
          onSelectStep(color.index);
        } else {
          onSelectStep(undefined);
        }
      }}
      className={`Swatch ${selectedStep === color.index ? "isSelected" : ""}`}
      style={
        {
          "--swatch-color": color.hex,
          "--text-color": textColor(color.hex),
        } as React.CSSProperties
      }
    >
      <span className="hex">{color.hex}</span>
      {config.showHSL && (
        <>
          <Token label="H">{color.h}</Token>
          <Token label="S">{`${color.s}%`}</Token>
          <Token label="L">{`${color.l}%`}</Token>
        </>
      )}
      <div className="contrasts">
        {selectedStep !== undefined && (
          <span
            className="stepContrastRatio"
            title={`Contrast against step ${selectedStep} of this scale.`}
          >
            {Math.floor(color.stepContrasts[selectedStep].contrastRatio * 10) /
              10}
          </span>
        )}
        <span className="contrastRatio">
          {Math.floor(color.actualContrastRatio * 10) / 10}
        </span>
      </div>
    </div>
  );
};

export default Swatch;
