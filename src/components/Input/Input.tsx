import "./Input.css";
import React, { FC, useId, useState } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  value?: number | string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: FC<Props> = ({
  label,
  value: defaultValue = 0,
  onChange,
  ...params
}) => {
  const [value, setValue] = useState<string | number>(defaultValue);
  const id = useId();

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    onChange(event);
  };

  return (
    <div className="Input">
      {label && <label htmlFor={id}>{label}</label>}
      <input {...params} value={value} id={id} onChange={changeHandler} />
    </div>
  );
};

export default Input;
