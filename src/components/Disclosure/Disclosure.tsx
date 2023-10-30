import "./Disclosure.css";
import React, { FC } from "react";

interface Props {
  children: React.ReactNode;
  title: string;
  className?: string;
}

const Disclosure: FC<Props> = ({ children, title, className }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div
      className={`Disclosure ${open && "is-open"} ${
        className ? className : ""
      }`}
    >
      <h4 className="header" onClick={() => setOpen(!open)}>
        {title}
      </h4>
      <div className="content">{children}</div>
    </div>
  );
};

export default Disclosure;
