import React from "react";

/* ------------------------------------------------------------
   Chat 图标集 —— 全部 SVG，无 emoji
   风格：线稿、穆夏式优雅曲线、与温暖花园配色一致
   ------------------------------------------------------------ */

export function IconLeaf({ size = 20, color = "var(--sage)", opacity = 0.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" style={{ opacity }}>
      <path d="M4 19 C3 14 5 9 9 6 C13 3 17 3 20 4 C20 8 18 13 14 16 C11 18 7 19.5 4 19 Z" />
      <path d="M4 19 C7 16 10 13 14 10" opacity="0.5" />
    </svg>
  );
}

export function IconSun({ size = 20, color = "var(--ink-soft)", opacity = 0.7 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" style={{ opacity }}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1" />
    </svg>
  );
}

export function IconChevronRight({ size = 16, color = "var(--ink-soft)" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function IconModel({ size = 18, color = "var(--ink-soft)" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="12" cy="12" r="3" />
      <path d="M7 17l1.5-1.5M15.5 8.5L17 7" />
    </svg>
  );
}

export function IconThinking({ size = 18, color = "var(--ink-soft)" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0-6 6c0 2.5 1.5 4 3 5.5V20a2 2 0 0 0 4 0v-1" />
      <circle cx="12" cy="9" r="1.5" fill={color} stroke="none" />
    </svg>
  );
}

export function IconMemory({ size = 18, color = "var(--ink-soft)" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v13.5" />
      <path d="M8 7h8M8 11h8M8 15h5" />
      <rect x="3" y="19" width="18" height="2" rx="1" />
    </svg>
  );
}

export function IconTools({ size = 18, color = "var(--ink-soft)" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a2.5 2.5 0 0 1 3.5 3.5L10 18H6v-4L14.7 5.7z" />
      <path d="M4 21l4-4" />
    </svg>
  );
}

export function IconBookmark({ size = 16, color = "var(--ink-soft)" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12v17l-6-3.5L6 20V3z" />
    </svg>
  );
}

export function IconCheck({ size = 14, color = "var(--accent-deep)" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}

export function IconDots({ size = 14, color = "var(--ink-soft)" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}

/* ---------- 羽毛笔：Thinking / 书写状态 ---------- */
export function IconQuill({ size = 16, color = "var(--gold)" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 4C10 4 5 9 5 17l-1 3 3-1c8 0 13-5 13-15Z" />
      <path d="M9 16c4-3 7-7 9-10" />
      <path d="M5 17c1 1 2 2 3 3" opacity="0.4" />
    </svg>
  );
}

/* ---------- 墨点：Thinking 装饰 ---------- */
export function IconInkDrop({ size = 10, color = "var(--rose)" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none" opacity="0.5">
      <path d="M12 4C8 8 6 11 6 14a6 6 0 0 0 12 0c0-3-2-6-6-10z" />
    </svg>
  );
}

/* ---------- 小叶子：Tool / Memory 标记 ---------- */
export function IconSprig({ size = 14, color = "var(--sage)" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.7">
      <path d="M12 22V12" />
      <path d="M12 12C12 8 10 6 7 5c-1 3 0 6 5 7z" />
      <path d="M12 12c0-4 2-6 5-7 1 3 0 6-5 7z" />
      <path d="M12 12c-2-1-4 0-5 2 2 1 4 0 5-2z" opacity="0.5" />
    </svg>
  );
}

/* ---------- 小花：压花装饰 / 彩蛋 ---------- */
export function IconBloom({ size = 12, color = "var(--rose)" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.4">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 5v-2M12 21v-2M5 12H3M21 12h-2M6.3 6.3L4.9 4.9M19.1 19.1l-1.4-1.4M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4" />
    </svg>
  );
}

/* ---------- 藤蔓分隔线：穆夏式 ---------- */
export function IconVine({ size = 24, color = "var(--gold)" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 12" fill="none" stroke={color} strokeWidth="0.8" strokeLinecap="round" opacity="0.4">
      <path d="M2 6 C8 2 12 10 20 6 C28 2 32 10 38 6" />
      <path d="M8 4 C9 2 11 2 12 4" opacity="0.6" />
      <path d="M28 8 C29 10 31 10 32 8" opacity="0.6" />
    </svg>
  );
}

/* ---------- 信封：发送 / 信件 ---------- */
export function IconEnvelope({ size = 18, color = "var(--ink-soft)" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

/* ---------- 心形：彩蛋 ---------- */
export function IconHeart({ size = 14, color = "var(--rose)" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none" opacity="0.6">
      <path d="M12 21C7 16.5 3 13 3 8.5 3 5.5 5.5 3 8.5 3c1.5 0 3 .8 3.5 2 .5-1.2 2-2 3.5-2C18.5 3 21 5.5 21 8.5c0 4.5-4 8-9 12.5z" />
    </svg>
  );
}

/* ---------- 星星：彩蛋 ---------- */
export function IconStar({ size = 12, color = "var(--gold)" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none" opacity="0.5">
      <path d="M12 2l3 7h7l-5.5 5 2 8-6.5-4-6.5 4 2-8L2 9h7l3-7z" />
    </svg>
  );
}

/* ---------- 四叶草：幸运彩蛋 ---------- */
export function IconClover({ size = 14, color = "var(--sage)" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.5">
      <circle cx="8" cy="8" r="3" />
      <circle cx="16" cy="8" r="3" />
      <circle cx="8" cy="16" r="3" />
      <circle cx="16" cy="16" r="3" />
      <path d="M12 8v8M8 12h8" opacity="0.4" />
    </svg>
  );
}
