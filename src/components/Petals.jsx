import React from "react";

/* ------------------------------------------------------------
   Petals —— 风痕：偶尔飘过的花瓣
   ------------------------------------------------------------ */
export default function Petals({ count = 4 }) {
  const petals = [
    { left: "12%", dur: "14s", delay: "2s", sway: "34px", po: 0.75, c: "#E8C7CA", r: 7 },
    { left: "64%", dur: "17s", delay: "7s", sway: "-28px", po: 0.6, c: "#FDFBF4", r: 6 },
    { left: "38%", dur: "19s", delay: "11s", sway: "24px", po: 0.55, c: "#D3AEB2", r: 6 },
    { left: "84%", dur: "15s", delay: "4.5s", sway: "-32px", po: 0.7, c: "#FDFBF4", r: 7 },
  ].slice(0, count);
  return (
    <>
      {petals.map((p, i) => (
        <svg
          key={i}
          className="petal"
          style={{
            left: p.left,
            "--dur": p.dur,
            "--delay": p.delay,
            "--sway": p.sway,
            "--po": p.po,
            width: p.r * 2,
            height: p.r * 2,
          }}
          viewBox="0 0 14 14"
        >
          <ellipse cx="7" cy="7" rx="5" ry="3.4" fill={p.c} transform="rotate(28 7 7)" />
        </svg>
      ))}
    </>
  );
}
