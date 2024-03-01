import "./Button.css";
import React, { FC } from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "danger" | "primary";
}

const Button: FC<Props> = ({
  children,
  variant = "default",
  className,
  type = "button",
  ...props
}) => {
  return (
    <button
      className={`Button ${variant !== "default" ? `Button--${variant}` : ""} ${
        className ? className : ""
      }`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
