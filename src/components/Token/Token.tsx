import React, { FC } from "react";
import "./Token.css";

type Props = {
  label?: string;
  children: string | number;
  color?: string;
  selectable?: boolean;
};

const Token: FC<Props> = ({
  label,
  children: value,
  selectable = false,
  color,
}) => {
  return (
    <div className="Token">
      {label && <span className="label">{label}</span>}
      <span className={`value ${selectable ? "selectable" : ""}`}>{value}</span>
    </div>
  );
};

export default Token;
