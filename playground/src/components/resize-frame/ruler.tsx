import React from "react";
import { HTMLAttributes } from "react";

interface RulerProps extends HTMLAttributes<HTMLDivElement> {
  width: number;
  maxWidth: number;
}

export const Ruler = ({ width, maxWidth, className }: RulerProps) => {
  const h = 30;
  const safeArea = 40;

  const tickRender = ({
    value,
    height,
    width,
    text,
  }: {
    value: number;
    height: number;
    width: number;
    text?: string;
  }) => {
    const x = value + safeArea;
    return (
      <g key={value} fill="currentColor">
        <rect x={x - width / 2} y={h - height} width={width} height={height} />
        {text ? (
          <text
            x={x - width / 2}
            y={h - height - 8}
            fontSize="8"
            textAnchor="middle"
          >
            {text}
          </text>
        ) : null}
      </g>
    );
  };

  const groups = Array.from({ length: Math.ceil(maxWidth / 10) }, (_, i) => {
    const value = i * 10;
    const isHundred = value % 100 === 0;
    const isFifty = !isHundred && value % 50 === 0;
    const isTen = !isHundred && !isFifty;
    return { value, isHundred, isFifty, isTen };
  });

  return (
    <div
      style={{ width: width + safeArea * 2 }}
      className={`ruler h10 ${className ?? ""}`}
    >
      <svg
        width={width + safeArea * 2}
        height={h}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${width + safeArea * 2} ${h}`}
      >
        <g>
          {groups.map(({ value, isHundred, isFifty }) => {
            if (isHundred) {
              return tickRender({
                value,
                height: 8,
                width: 1.4,
                text: `${value}px`,
              });
            }
            if (isFifty) {
              return tickRender({
                value,
                height: 5,
                width: 1,
              });
            }
            return tickRender({
              value,
              height: 3,
              width: 0.5,
            });
          })}
        </g>
      </svg>
    </div>
  );
};
