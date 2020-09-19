import React from "react";

interface TestProps {
  className: string;
  style: React.CSSProperties;
  title: string;
  children: React.ReactNode;
}

export default class Test extends React.Component<TestProps, any> {
  constructor(props: TestProps) {
    super(props);
  }
  render() {
    const { className, style, title, children } = this.props;
    return (
      <div className={className} style={style}>
        <header>{title}</header>
        {children}
      </div>
    );
  }
}
