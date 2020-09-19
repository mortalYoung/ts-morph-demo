import React from "react";

interface TestProps {
  className: string;
  style: React.CSSProperties;
  title: string;
  children: React.ReactNode;
}

export default ({ className, style, title, children }: TestProps) => {
  return (
    <div className={className} style={style}>
      <header>{title}</header>
      {children}
    </div>
  );
};