import React from "react";

type Props = {
  title?: string;
  children?: React.ReactNode;
};

export default function CustomBox({ title, children }: Props) {
  return (
    <div
      style={{
        border: "2px solid #0070f3",
        borderRadius: 8,
        padding: "1rem",
        background: "#f5faff",
      }}
    >
      {title && <h3 style={{ marginTop: 0 }}>{title}</h3>}
      <div>{children}</div>
    </div>
  );
}
