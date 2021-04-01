import React from "react";

import { DEFAULT_TIMER_SIZE } from "../core/constants";
import { range } from "../core/utils";

function renderArc(radius, radians, x, y) {
  return `m${radius} ${radius} v${-radius} A${radius} ${radius} 0 ${
    radians > Math.PI / 2 && radians < (3 * Math.PI) / 2 ? 1 : 0
  } 1 ${x} ${y}`;
}

function calculateRadians(x, y) {
  return x !== null && y !== null
    ? Math.atan2(y, x) + (x < 0 && y < 0 ? 2 * Math.PI : 0)
    : -Math.PI / 2;
}

function snapValue(value, resolution) {
  return Math.round(value / resolution) * resolution;
}

const Mark = ({ size, angle, big = false }) => {
  const center = size / 2;
  const width = big ? size / 128 : size / 256;
  const height = big ? size / 16 : size / 32;
  return (
    <rect
      x={center - width / 2}
      y="0"
      width={width}
      height={height}
      transform={`rotate(${angle} ${center} ${center})`}
      opacity="0.5"
    />
  );
};

const NUM_MARKS = 60;

const Marks = ({ size }) => {
  return (
    <g>
      {range(NUM_MARKS).map((i) => (
        <Mark size={size} angle={i * (360 / 60)} big={i % 5 === 0} />
      ))}
    </g>
  );
};

export default function Timer({
  size = DEFAULT_TIMER_SIZE,
  x,
  y,
  snap = true,
}) {
  const radius = size / 2;
  const cursorX = x ? -radius + x : null;
  const cursorY = y ? -radius + y : null;

  let radians = calculateRadians(cursorX, cursorY);
  radians = snap ? snapValue(radians, (2 * Math.PI) / 120) : radians;

  const handX = radius + radius * Math.cos(radians);
  const handY = radius + radius * Math.sin(radians);

  return (
    <svg width={size} height={size}>
      <circle cx={radius} cy={radius} r={size / 2} opacity="0.05" />
      <Marks size={size} />
      <path
        d={renderArc(radius, radians, handX, handY)}
        fill="red"
        opacity="0.5"
      />
      <circle cx={radius} cy={radius} r={size / 128} opacity="0.5" />
    </svg>
  );
}
