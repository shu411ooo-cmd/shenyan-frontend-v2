import React, { useMemo, useState } from "react";
import { IconQuill, IconChevronRight } from "./ChatIcons.jsx";

/* ------------------------------------------------------------
   ThinkingNote —— 页边思考痕迹
   英文短句 + Cormorant 斜体，像信纸上的铅笔小字
   左侧金色细线，可展开
   ------------------------------------------------------------ */

const THINKING_TITLES = [
  "a quiet pause",
  "thinking of you",
  "pen hovering",
  "a soft thought",
  "gathering words",
];

const THINKING_DETAILS = [
  "finding the right words for you…",
  "recalling what you said earlier…",
  "letting the thought settle…",
  "listening to the garden for a moment…",
  "turning the memory over gently…",
];

export default function ThinkingNote({ seed, duration = 3 }) {
  const [expanded, setExpanded] = useState(false);

  const { title, detail } = useMemo(() => {
    let h = 0;
    const s = String(seed);
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return {
      title: THINKING_TITLES[h % THINKING_TITLES.length],
      detail: THINKING_DETAILS[(h >> 8) % THINKING_DETAILS.length],
    };
  }, [seed]);

  return (
    <div style={{
      alignSelf: "flex-start",
      width: "100%",
      maxWidth: "86%",
      margin: "0 0 18px 2px",
      paddingLeft: 14,
      borderLeft: "1px solid var(--gold-light)",
      position: "relative",
    }}>
      {/* 淡玫瑰墨点 */}
      <span className="ink-blot" style={{
        position: "absolute",
        left: -3,
        top: 4,
        width: 5,
        height: 5,
        borderRadius: "50%",
        background: "var(--rose)",
        opacity: 0.3,
      }} />

      <button
        onClick={() => setExpanded(!expanded)}
        className="pressable"
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 7,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          padding: 0,
        }}
      >
        <IconQuill size={13} />
        <span style={{
          fontFamily: "var(--font-italic-en)",
          fontStyle: "italic",
          fontSize: 15,
          color: "var(--ink-soft)",
          letterSpacing: "0.03em",
        }}>
          {title}
        </span>
        <span style={{
          fontFamily: "var(--font-display-en)",
          fontSize: 11,
          color: "var(--ink-soft)",
          opacity: 0.55,
          letterSpacing: "0.06em",
        }}>
          · {duration}s
        </span>
        <IconChevronRight size={11} style={{
          transform: expanded ? "rotate(90deg)" : "none",
          transition: "transform 200ms var(--ease-out)",
          alignSelf: "center",
        }} />
      </button>

      {expanded && (
        <div style={{
          marginTop: 5,
          marginLeft: 20,
          fontFamily: "var(--font-italic-en)",
          fontStyle: "italic",
          fontSize: 13.5,
          color: "var(--ink-soft)",
          opacity: 0.75,
          animation: "pageIn 200ms var(--ease-out) both",
        }}>
          {detail}
        </div>
      )}
    </div>
  );
}
