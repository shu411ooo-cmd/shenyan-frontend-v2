import React from "react";

/* ------------------------------------------------------------
   WaxSeal —— 火漆印
   ------------------------------------------------------------ */
export default function WaxSeal({ size = 96, className = "", style }) {
  return (
    <svg viewBox="0 0 96 96" className={className} style={{ width: size, height: size, ...style }} role="img" aria-label="火漆印">
      <defs>
        <path id="sealArc" d="M 48 48 m -25 0 a 25 25 0 1 1 50 0 a 25 25 0 1 1 -50 0" />
      </defs>
      <path
        d="M 48 5 C 60 3 72 9 79 19 C 88 28 91 40 87 51 C 85 63 77 73 66 79
           C 55 87 41 87 29 81 C 17 75 9 63 9 49 C 7 37 13 25 23 17 C 31 9 38 7 48 5 Z"
        fill="#A85751" stroke="#8E4440" strokeWidth="1.2"
      />
      <circle cx="48" cy="47" r="31" fill="#9E4F4B" stroke="#B96E66" strokeWidth="1" />
      <text fontFamily="Playfair Display, serif" fontSize="6.6" letterSpacing="1.4" fill="#E7C3BC">
        <textPath href="#sealArc" startOffset="2%">SOME MOMENTS ARE KEPT SOFTLY ·</textPath>
      </text>
      <g stroke="#E7C3BC" strokeWidth="1.3" fill="none" strokeLinecap="round">
        <path d="M 48 60 C 47 52 47 44 49 36" />
        <path d="M 48 54 C 44 52 41 49 40 45" />
        <path d="M 48 49 C 52 47 55 44 56 40" />
        <path d="M 49 42 C 46 40 44 38 44 35" />
        <path d="M 49 39 C 52 37 53 35 53 32" />
      </g>
      <circle cx="49" cy="32" r="1.6" fill="#E7C3BC" />
      <path d="M 22 24 C 30 14 42 10 54 11" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}
