import { useId } from "react";
import React, { FC, useState } from "react";
import "./Toggle.css";

type Props = {
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  icons?: {
    checked: React.ReactNode;
    unchecked: React.ReactNode;
  };
  label?: string;
  className?: string;
};

const Toggle: FC<Props> = ({
  checked = false,
  onChange,
  className,
  icons,
  label,
}) => {
  const [isChecked, setChecked] = useState<boolean>(checked);
  const id = useId();

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(!isChecked);
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <label className={`Toggle-Container ${className}`} htmlFor={id}>
      <div className={`Toggle`}>
        <span className="switch__icon unchecked">{icons?.unchecked}</span>
        <span className="switch__icon checked">{icons?.checked}</span>
        <input
          id={id}
          type="checkbox"
          name="switch"
          checked={isChecked}
          onChange={changeHandler}
        />
        <div className="toggle__fill"></div>
      </div>
      {label && <span className="label">{label}</span>}
    </label>
  );
};

export default Toggle;
