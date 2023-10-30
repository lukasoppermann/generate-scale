import "./Button.css";
import React, { FC } from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "danger";
}

const Button: FC<Props> = ({
  children,
  variant = "default",
  className,
  ...props
}) => {
  return (
    <button
      className={`Button ${variant !== "default" ? `Button--${variant}` : ""} ${
        className ? className : ""
      }`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
