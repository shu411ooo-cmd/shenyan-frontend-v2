import React from "react";

/* ============================================================
   Moments 装饰组件
   旧插画花园风格：线稿植物、洛可可曲线、Mucha 构图、蝴蝶
   全部 SVG，无 emoji
   ============================================================ */

/* 左上角藤蔓花束：不对称，从角上长进来 */
export function CornerSprayTL({ opacity = 0.6 }) {
  return (
    <svg
      viewBox="0 0 200 220"
      style={{
        position: "absolute", top: -18, left: -22, width: 200, height: 220,
        opacity, pointerEvents: "none", zIndex: 2, overflow: "visible",
      }}
      aria-hidden="true"
    >
      {/* 主枝 */}
      <path d="M-10 120 C 30 110, 70 130, 100 90 C 130 50, 120 10, 160 -10"
        fill="none" stroke="var(--sage)" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M40 100 C 60 80, 80 70, 90 40"
        fill="none" stroke="#A3B1B8" strokeWidth="0.9" strokeLinecap="round" opacity="0.85" />
      <path d="M70 120 C 100 115, 130 100, 150 70"
        fill="none" stroke="#B5A7B8" strokeWidth="0.9" strokeLinecap="round" opacity="0.8" />
      {/* 叶片 */}
      <g fill="none" stroke="var(--sage)" strokeWidth="1" strokeLinecap="round">
        <path d="M25 108 Q 35 98 45 108 Q 35 118 25 108" />
        <path d="M60 82 Q 72 72 82 82 Q 72 92 60 82" />
        <path d="M105 60 Q 118 50 128 60 Q 118 72 105 60" />
        <path d="M125 92 Q 138 84 148 94 Q 138 104 125 92" />
      </g>
      {/* 玫瑰苞 */}
      <g fill="var(--rose)" opacity="0.75">
        <circle cx="95" cy="42" r="4.2" />
        <circle cx="99" cy="46" r="3.2" />
        <circle cx="91" cy="47" r="2.8" />
      </g>
      {/* 薰衣草小簇 */}
      <g fill="var(--dusty-lavender)" opacity="0.8">
        <circle cx="145" cy="72" r="1.6" />
        <circle cx="148" cy="69" r="1.4" />
        <circle cx="142" cy="68" r="1.3" />
        <circle cx="146" cy="76" r="1.2" />
      </g>
      {/* 蓝色小花 */}
      <g fill="var(--faded-blue)" opacity="0.75">
        <ellipse cx="50" cy="103" rx="3.4" ry="2" transform="rotate(-20 50 103)" />
        <ellipse cx="54" cy="101" rx="3.4" ry="2" transform="rotate(40 54 101)" />
        <ellipse cx="52" cy="107" rx="3" ry="1.8" transform="rotate(90 52 107)" />
      </g>
    </svg>
  );
}

/* 右下角藤蔓花束 */
export function CornerSprayBR({ opacity = 0.55 }) {
  return (
    <svg
      viewBox="0 0 200 220"
      style={{
        position: "absolute", bottom: -24, right: -20, width: 200, height: 220,
        opacity, pointerEvents: "none", zIndex: 2, overflow: "visible",
      }}
      aria-hidden="true"
    >
      <path d="M210 100 C 170 110, 130 90, 100 130 C 70 170, 80 210, 40 230"
        fill="none" stroke="var(--sage)" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M160 120 C 140 140, 120 150, 110 180"
        fill="none" stroke="#B5A7B8" strokeWidth="0.9" strokeLinecap="round" opacity="0.85" />
      <path d="M130 100 C 100 105, 70 120, 50 150"
        fill="none" stroke="#C48A82" strokeWidth="0.9" strokeLinecap="round" opacity="0.75" />
      <g fill="none" stroke="var(--sage)" strokeWidth="1" strokeLinecap="round">
        <path d="M175 108 Q 165 118 175 128 Q 185 118 175 108" />
        <path d="M140 138 Q 128 148 140 158 Q 152 148 140 138" />
        <path d="M95 118 Q 82 128 95 138 Q 108 128 95 118" />
      </g>
      <g fill="var(--apricot)" opacity="0.8">
        <ellipse cx="108" cy="178" rx="4" ry="2.4" transform="rotate(30 108 178)" />
        <ellipse cx="104" cy="174" rx="4" ry="2.4" transform="rotate(-30 104 174)" />
        <ellipse cx="108" cy="171" rx="3.6" ry="2.2" transform="rotate(90 108 171)" />
      </g>
      <g fill="var(--dusty-lavender)" opacity="0.8">
        <circle cx="55" cy="145" r="1.6" />
        <circle cx="52" cy="148" r="1.4" />
        <circle cx="58" cy="149" r="1.3" />
      </g>
    </svg>
  );
}

/* 标题花框：穆夏式 cartouche，左右藤蔓托住标题 */
export function CartoucheTitle({ title, subtitle }) {
  return (
    <div style={{ position: "relative", textAlign: "center", margin: "6px 0 14px" }}>
      <svg
        viewBox="0 0 320 80"
        style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", width: 320, height: 80, opacity: 0.75, pointerEvents: "none" }}
        aria-hidden="true"
      >
        <path d="M60 40 C 60 18, 100 10, 160 10 C 220 10, 260 18, 260 40 C 260 62, 220 70, 160 70 C 100 70, 60 62, 60 40 Z"
          fill="none" stroke="var(--gold-light)" strokeWidth="1" />
        <path d="M68 40 C 68 24, 105 17, 160 17 C 215 17, 252 24, 252 40 C 252 56, 215 63, 160 63 C 105 63, 68 56, 68 40 Z"
          fill="none" stroke="var(--paper-edge)" strokeWidth="0.8" />
        {/* 左侧装饰枝 */}
        <path d="M66 40 C 40 38, 25 25, 10 30 M25 28 C 20 22, 12 24, 8 20"
          fill="none" stroke="var(--sage)" strokeWidth="1" strokeLinecap="round" />
        <ellipse cx="14" cy="28" rx="5" ry="2" fill="var(--sage)" opacity="0.55" transform="rotate(-25 14 28)" />
        <g fill="var(--rose)" opacity="0.7">
          <circle cx="22" cy="36" r="2.2" />
          <circle cx="25" cy="33" r="1.6" />
        </g>
        {/* 右侧装饰枝 */}
        <path d="M254 40 C 280 42, 295 55, 310 50 M295 52 C 300 58, 308 56, 312 60"
          fill="none" stroke="#B5A7B8" strokeWidth="1" strokeLinecap="round" />
        <g fill="var(--dusty-lavender)" opacity="0.75">
          <circle cx="304" cy="48" r="1.6" />
          <circle cx="307" cy="52" r="1.4" />
          <circle cx="300" cy="53" r="1.2" />
        </g>
      </svg>
      <h2 className="f-display" style={{
        position: "relative", zIndex: 1,
        fontSize: 26, fontWeight: 500, letterSpacing: "0.04em", color: "var(--ink)",
      }}>
        {title}
      </h2>
      <p className="f-hand-en" style={{
        position: "relative", zIndex: 1,
        fontSize: 17, color: "var(--ink-soft)", marginTop: 2,
      }}>
        {subtitle}
      </p>
    </div>
  );
}

/* 蝴蝶：小线稿，偶尔停在标题旁 */
export function Butterfly({ style }) {
  return (
    <svg
      viewBox="0 0 28 22"
      style={{ width: 28, height: 22, opacity: 0.7, pointerEvents: "none", ...style }}
      aria-hidden="true"
    >
      <path d="M14 6 C 9 0, 1 2, 2 10 C 3 16, 10 17, 14 12 C 18 17, 25 16, 26 10 C 27 2, 19 0, 14 6 Z"
        fill="var(--faded-blue)" opacity="0.35" stroke="#7A8A92" strokeWidth="1" />
      <path d="M14 6 C 11 3, 6 4, 7 9 C 8 13, 12 13, 14 10 C 16 13, 20 13, 21 9 C 22 4, 17 3, 14 6 Z"
        fill="var(--dusty-lavender)" opacity="0.45" stroke="#7A8A92" strokeWidth="0.8" />
      <path d="M14 6 V 18" stroke="#7A8A92" strokeWidth="1" strokeLinecap="round" />
      <path d="M14 14 C 12 16, 11 19, 12 21 M14 14 C 16 16, 17 19, 16 21"
        fill="none" stroke="#7A8A92" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}

/* 日历日期的小花/小叶标记 */
export function FloralDayMarker({ kind }) {
  if (kind === "flower") {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24">
        <g fill="var(--rose)" opacity="0.8">
          {[0, 72, 144, 216, 288].map((deg) => (
            <ellipse key={deg} cx="12" cy="7.8" rx="2.6" ry="4.2" transform={`rotate(${deg} 12 12)`} />
          ))}
        </g>
        <circle cx="12" cy="12" r="1.6" fill="var(--gold)" />
      </svg>
    );
  }
  return (
    <svg width="12" height="9" viewBox="0 0 20 12">
      <path d="M2 10 C6 2, 14 0, 18 2 C16 8, 8 12, 2 10 Z" fill="var(--sage)" opacity="0.75" />
    </svg>
  );
}

/* 今日花环 */
export function TodayWreath() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" style={{ position: "absolute", top: -1, left: -1 }}>
      <circle cx="17" cy="17" r="14.5" fill="none" stroke="var(--sage)" strokeWidth="1.1" opacity="0.75" />
    </svg>
  );
}

/* 明信片边角装饰：贴在卡片四个角的小花 */
export function PostcardCorner({ corner = "tl", color = "var(--sage)" }) {
  const rotate = { tl: 0, tr: 90, br: 180, bl: 270 }[corner];
  return (
    <svg
      width="22" height="22" viewBox="0 0 22 22"
      style={{
        position: "absolute",
        [corner.includes("t") ? "top" : "bottom"]: -4,
        [corner.includes("l") ? "left" : "right"]: -4,
        transform: `rotate(${rotate}deg)`, pointerEvents: "none", opacity: 0.75,
      }}
      aria-hidden="true"
    >
      <path d="M2 20 C 2 8, 8 2, 20 2" fill="none" stroke={color} strokeWidth="1" strokeLinecap="round" />
      <ellipse cx="8" cy="8" rx="4" ry="2" fill={color} opacity="0.45" transform="rotate(-35 8 8)" />
      <circle cx="17" cy="5" r="1.8" fill="var(--rose)" opacity="0.6" />
    </svg>
  );
}

/* 月历/月末展示用的小花束 */
export function SmallBouquet({ color = "var(--dusty-lavender)", size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M12 21 V 10" stroke={color} strokeWidth="1" strokeLinecap="round" />
      <g fill={color} opacity="0.75">
        <ellipse cx="12" cy="6" rx="2.4" ry="4" transform="rotate(0 12 6)" />
        <ellipse cx="12" cy="6" rx="2.4" ry="4" transform="rotate(72 12 6)" />
        <ellipse cx="12" cy="6" rx="2.4" ry="4" transform="rotate(144 12 6)" />
        <ellipse cx="12" cy="6" rx="2.4" ry="4" transform="rotate(216 12 6)" />
        <ellipse cx="12" cy="6" rx="2.4" ry="4" transform="rotate(288 12 6)" />
      </g>
      <circle cx="12" cy="6" r="1.4" fill="var(--gold)" />
      <ellipse cx="9" cy="13" rx="3" ry="1.4" fill={color} opacity="0.5" transform="rotate(-25 9 13)" />
    </svg>
  );
}
