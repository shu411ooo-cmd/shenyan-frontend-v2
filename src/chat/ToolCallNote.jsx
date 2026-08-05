import React, { useMemo, useState } from "react";
import { IconSprig, IconCheck, IconChevronRight } from "./ChatIcons.jsx";

/* ------------------------------------------------------------
   ToolCallNote —— 行动记录
   英文短句 + 斜体，像书页边缘的一行小注
   左侧鼠尾草绿细线，默认收起
   ------------------------------------------------------------ */

const TOOL_TITLES = [
  "reaching into memory",
  "opening the drawer",
  "leafing through old letters",
  "a walk through the garden",
];

const TOOL_DETAILS = {
  "memory.read": "memories found",
  "memory.write": "kept for later",
  "mcp.music": "a melody",
  "mcp.weather": "the sky outside",
};

export default function ToolCallNote({ seed, tools = [], duration = 2, status = "completed" }) {
  const [expanded, setExpanded] = useState(false);
  const done = status === "completed";

  const title = useMemo(() => {
    let h = 0;
    const s = String(seed);
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return TOOL_TITLES[h % TOOL_TITLES.length];
  }, [seed]);

  return (
    <div style={{
      alignSelf: "flex-start",
      width: "100%",
      maxWidth: "86%",
      margin: "0 0 18px 2px",
      paddingLeft: 14,
      borderLeft: "1px solid var(--sage)",
      opacity: done ? 0.8 : 1,
    }}>
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
        <IconSprig size={13} color={done ? "var(--sage-deep)" : "var(--sage)"} />
        <span style={{
          fontFamily: "var(--font-italic-en)",
          fontStyle: "italic",
          fontSize: 15,
          color: "var(--sage-deep)",
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
        {done && <IconCheck size={11} />}
        <IconChevronRight size={11} style={{
          transform: expanded ? "rotate(90deg)" : "none",
          transition: "transform 200ms var(--ease-out)",
          alignSelf: "center",
        }} />
      </button>

      {expanded && (
        <div style={{
          marginTop: 6,
          marginLeft: 20,
          animation: "pageIn 200ms var(--ease-out) both",
        }}>
          {tools.map((tool, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 5,
              fontSize: 11.5,
              color: "var(--ink-soft)",
            }}>
              <span style={{
                width: 3,
                height: 3,
                borderRadius: "50%",
                background: "var(--sage)",
                opacity: 0.5,
              }} />
              <span style={{ fontFamily: "var(--font-display-en)", letterSpacing: "0.03em" }}>
                {tool.name}
              </span>
              <span style={{
                fontFamily: "var(--font-italic-en)",
                fontStyle: "italic",
                opacity: 0.75,
              }}>
                {TOOL_DETAILS[tool.name] || "done"}
              </span>
              {done && <IconCheck size={10} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
