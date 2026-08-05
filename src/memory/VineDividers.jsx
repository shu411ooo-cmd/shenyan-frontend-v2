import React from "react";

/* ------------------------------------------------------------
   植物藤蔓分隔线
   不是装饰边框，是章节之间自然生长出来的一条细枝：
   不规则曲线、少量叶片、偶尔一朵花、左右不对称。
   OliveVine    —— You：橄榄细枝（sage）
   RoseVine     —— Us：玫瑰藤（dusty rose）
   LavenderVine —— Keepsakes：薰衣草（muted lavender）
   ------------------------------------------------------------ */

export function OliveVine({ width = 180, opacity = 0.5 }) {
  return (
    <svg
      viewBox="0 0 200 30"
      style={{ width, height: (width * 30) / 200, opacity, overflow: "visible", display: "block" }}
      aria-hidden="true"
    >
      <path
        d="M6 20 C 40 12, 70 24, 105 16 C 140 8, 170 18, 194 12"
        fill="none" stroke="var(--sage)" strokeWidth="1.1" strokeLinecap="round"
      />
      {/* 橄榄小叶：成对、细长、交替朝向 */}
      <g fill="var(--sage)" opacity="0.55">
        <ellipse cx="30" cy="15" rx="7" ry="2.4" transform="rotate(-38 30 15)" />
        <ellipse cx="34" cy="21" rx="6.4" ry="2.2" transform="rotate(24 34 21)" />
        <ellipse cx="66" cy="19" rx="6.8" ry="2.3" transform="rotate(-30 66 19)" />
        <ellipse cx="92" cy="19" rx="6.2" ry="2.1" transform="rotate(28 92 19)" />
        <ellipse cx="120" cy="13" rx="7" ry="2.4" transform="rotate(-34 120 13)" />
        <ellipse cx="152" cy="13" rx="6.4" ry="2.2" transform="rotate(26 152 13)" />
        <ellipse cx="178" cy="14" rx="6" ry="2.1" transform="rotate(-28 178 14)" />
      </g>
      {/* 两颗小橄榄 */}
      <circle cx="50" cy="23" r="1.8" fill="var(--sage-deep)" opacity="0.5" />
      <circle cx="137" cy="17" r="1.6" fill="var(--sage-deep)" opacity="0.45" />
    </svg>
  );
}

export function RoseVine({ width = 180, opacity = 0.5 }) {
  return (
    <svg
      viewBox="0 0 200 30"
      style={{ width, height: (width * 30) / 200, opacity, overflow: "visible", display: "block" }}
      aria-hidden="true"
    >
      <path
        d="M6 16 C 36 23, 66 8, 100 16 C 134 24, 166 9, 194 15"
        fill="none" stroke="var(--rose-deep)" strokeWidth="1.1" strokeLinecap="round"
      />
      {/* 藤叶（暗绿，少） */}
      <g fill="var(--leaf)" opacity="0.55">
        <ellipse cx="40" cy="18" rx="5.6" ry="2.2" transform="rotate(-30 40 18)" />
        <ellipse cx="118" cy="19" rx="5.2" ry="2" transform="rotate(26 118 19)" />
        <ellipse cx="170" cy="12" rx="5" ry="2" transform="rotate(-24 170 12)" />
      </g>
      {/* 玫瑰苞：小小的螺旋 */}
      <g stroke="var(--rose)" strokeWidth="1" fill="none" opacity="0.8" strokeLinecap="round">
        <circle cx="72" cy="11" r="2.6" fill="var(--rose)" fillOpacity="0.35" />
        <path d="M70.6 11 a1.4 1.4 0 1 1 2.8 0.2" />
        <circle cx="146" cy="16" r="2.2" fill="var(--rose)" fillOpacity="0.3" />
        <path d="M144.9 16 a1.1 1.1 0 1 1 2.2 0.2" />
      </g>
      {/* 一根卷须 */}
      <path d="M96 15 q 6 -7 11 -3 q 3 3 -1 4" fill="none" stroke="var(--rose-deep)" strokeWidth="0.8" opacity="0.6" strokeLinecap="round" />
    </svg>
  );
}

export function LavenderVine({ width = 180, opacity = 0.5 }) {
  return (
    <svg
      viewBox="0 0 200 30"
      style={{ width, height: (width * 30) / 200, opacity, overflow: "visible", display: "block" }}
      aria-hidden="true"
    >
      <path
        d="M14 23 C 60 15, 120 25, 186 14"
        fill="none" stroke="#9A94AC" strokeWidth="1" strokeLinecap="round"
      />
      {/* 薰衣草小穗：短侧枝 + 顶端几点 */}
      {[
        [52, 18, -6],
        [104, 21, 4],
        [152, 16, -3],
      ].map(([x, y, lean], i) => (
        <g key={i}>
          <path d={`M${x} ${y} q ${lean} -4 ${lean - 1} -8`} fill="none" stroke="#9A94AC" strokeWidth="0.8" strokeLinecap="round" />
          <g fill="#A9A3B8" opacity="0.75">
            <circle cx={x + lean - 1} cy={y - 9} r="1.3" />
            <circle cx={x + lean - 3} cy={y - 7} r="1.1" />
            <circle cx={x + lean + 1} cy={y - 6.6} r="1.1" />
            <circle cx={x + lean - 1.6} cy={y - 4.8} r="0.9" />
          </g>
        </g>
      ))}
      {/* 一片细叶 */}
      <ellipse cx="80" cy="22" rx="5.4" ry="1.8" fill="#9A94AC" opacity="0.4" transform="rotate(-20 80 22)" />
    </svg>
  );
}
