import Color from "colorjs.io";
import { ScaleStep } from "../../utils/generateScale";
import "./Swatch.css";
import React, { FC } from "react";
import { useConfigContext } from "../../contexts/configContext";
import Token from "../Token/Token";

interface Props {
  color: ScaleStep;
}

const textColor = (hex: string): string => {
  const color = new Color(hex);
  return color.contrast("black", "WCAG21") > color.contrast("white", "WCAG21")
    ? `#000`
    : `#fff`;
};

const Swatch: FC<Props> = ({ color }) => {
  const { config } = useConfigContext();
  return (
    <div
      className="Swatch"
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
      <span className="contrastRatio">
        {Math.floor(color.actualContrastRatio * 10) / 10}
      </span>
    </div>
  );
};

export default Swatch;
