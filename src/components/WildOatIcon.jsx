import React from "react";

/* 小燕麦图标（空状态用） */
export default function WildOatIcon({ height = 56, tone = "#B9A98A" }) {
  return (
    <svg viewBox="0 0 60 130" style={{ height, width: (height * 60) / 130, overflow: "visible" }}>
      <path d="M28 128 C 30 96 32 60 30 22" fill="none" stroke="#A5977C" strokeWidth="0.9" strokeLinecap="round" />
      {[
        [30, 30, -14], [34, 44, 10], [28, 58, -12], [33, 72, 12], [27, 86, -10],
      ].map(([x, y, r], i) => (
        <g key={i}>
          <path d={`M 30 ${y - 8} Q ${x} ${y - 4} ${x} ${y}`} fill="none" stroke="#A5977C" strokeWidth="0.6" />
          <ellipse cx={x} cy={y + 4} rx="2.2" ry="4.6" fill={tone} opacity="0.85" transform={`rotate(${r} ${x} ${y + 4})`} />
        </g>
      ))}
    </svg>
  );
}
