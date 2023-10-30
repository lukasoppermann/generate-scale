import "./Fieldset.css";
import React, { FC, HtmlHTMLAttributes } from "react";

interface Props extends HtmlHTMLAttributes<HTMLInputElement> {
  label?: string;
  children: React.ReactNode;
}

const Fieldset: FC<Props> = ({ label, children }) => {
  return (
    <fieldset className="Fieldset">
      {label && <legend>{label}</legend>}
      {children}
    </fieldset>
  );
};

export default Fieldset;
