import "./NamedColorSwatch.css";
import React, { FC, useEffect } from "react";

interface Props {
  name: string;
  color: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const NamedColorSwatch: FC<Props> = ({
  name,
  color: currentColor,
  onChange,
}) => {
  const [color, setColor] = React.useState(currentColor);

  useEffect(() => {
    setColor(currentColor);
  }, [currentColor]);

  const changeColor = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event);
    setColor(event.target.value);
  };

  return (
    <div className={`NamedColorSwatch`}>
      <input type="color" name="color" value={color} onChange={changeColor} />
      <div className="info">
        <h5>{name}</h5>
        <h6>{color}</h6>
      </div>
    </div>
  );
};

export default NamedColorSwatch;
