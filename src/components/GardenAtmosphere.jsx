import React from "react";

/* ------------------------------------------------------------
   GardenAtmosphere —— 环境层：午后光 + 树叶投影 + 探入枝叶
   植物的绿全部用 var(--leaf / --leaf-deep / --sage)，随季节换色。
   ------------------------------------------------------------ */
export default function GardenAtmosphere() {
  return (
    <>
      <div className="sun-beam" />
      {/* 树叶投影 */}
      <svg className="dapple" style={{ top: -30, left: -40, width: 220, height: 180 }} viewBox="0 0 220 180">
        <g fill="var(--leaf-deep)" opacity="0.12">
          <ellipse cx="50" cy="40" rx="34" ry="18" transform="rotate(-18 50 40)" />
          <ellipse cx="110" cy="24" rx="26" ry="14" transform="rotate(8 110 24)" />
          <ellipse cx="150" cy="70" rx="30" ry="16" transform="rotate(-28 150 70)" />
          <ellipse cx="80" cy="100" rx="22" ry="12" transform="rotate(14 80 100)" />
          <ellipse cx="30" cy="130" rx="26" ry="14" transform="rotate(-8 30 130)" />
        </g>
      </svg>
      <svg className="dapple slow" style={{ top: -20, right: -50, width: 200, height: 160 }} viewBox="0 0 200 160">
        <g fill="var(--leaf-deep)" opacity="0.10">
          <ellipse cx="150" cy="36" rx="32" ry="16" transform="rotate(16 150 36)" />
          <ellipse cx="100" cy="70" rx="24" ry="13" transform="rotate(-12 100 70)" />
          <ellipse cx="160" cy="110" rx="28" ry="14" transform="rotate(24 160 110)" />
        </g>
      </svg>
      {/* 探入的枝叶 */}
      <svg className="foliage" style={{ top: -6, left: -10, width: 110, height: 150 }} viewBox="0 0 110 150">
        <path d="M 6 -4 C 20 30 32 66 38 110" fill="none" stroke="var(--leaf-deep)" strokeWidth="2.4" strokeLinecap="round" />
        <ellipse cx="18" cy="26" rx="14" ry="6" fill="var(--leaf)" transform="rotate(-28 18 26)" />
        <ellipse cx="30" cy="52" rx="15" ry="6.4" fill="var(--sage)" transform="rotate(-20 30 52)" />
        <ellipse cx="38" cy="82" rx="13" ry="5.6" fill="var(--leaf)" transform="rotate(-26 38 82)" />
        <ellipse cx="26" cy="40" rx="12" ry="5" fill="var(--leaf)" transform="rotate(26 26 40)" />
        <ellipse cx="36" cy="68" rx="11" ry="4.8" fill="var(--leaf)" transform="rotate(30 36 68)" />
      </svg>
      <svg className="foliage late" style={{ top: -4, right: -8, width: 96, height: 130 }} viewBox="0 0 96 130">
        <path d="M 90 -4 C 78 28 68 60 62 100" fill="none" stroke="var(--leaf-deep)" strokeWidth="2.2" strokeLinecap="round" />
        <ellipse cx="78" cy="24" rx="13" ry="5.6" fill="var(--leaf)" transform="rotate(26 78 24)" />
        <ellipse cx="68" cy="50" rx="14" ry="6" fill="var(--leaf)" transform="rotate(20 68 50)" />
        <ellipse cx="62" cy="78" rx="12" ry="5.2" fill="var(--sage)" transform="rotate(28 62 78)" />
      </svg>
    </>
  );
}
