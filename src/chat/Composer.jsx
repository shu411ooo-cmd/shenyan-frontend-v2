
import { border } from "../styles/garden.js";
import React from "react";

/* ------------------------------------------------------------
   Composer —— 正在写的一张信纸
   暖白纸面、多行输入、柔和边缘、羽毛笔发送。
   与 AI 信纸使用同一套 paper 语言：写完的信 ↓ 正在写的信
   ------------------------------------------------------------ */

/* 羽毛笔发送图标 */
function QuillIcon({ color = "var(--ink)", opacity = 1 }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity }}>
      <path d="M20 4C10 4 5 9 5 17l-1 3 3-1c8 0 13-5 13-15Z" />
      <path d="M9 16c4-3 7-7 9-10" />
    </svg>
  );
}

export default function Composer({ draft, setDraft, onSend, inputRef }) {
  return (
    <div style={{
      position: "relative", zIndex: 6, flexShrink: 0,
      padding: "8px 10px 16px",
      background: "linear-gradient(to top, var(--ivory) 78%, rgba(247,242,233,0))",
      display: "flex", alignItems: "flex-end", gap: 8,
    }}>
      {/* 附件 */}
      <button aria-label="附件" className="pressable" style={{
        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
        ...border.hairline, background: "var(--warm-white)",
        display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-soft)" strokeWidth="1.5" strokeLinecap="round">
          <path d="M18 11 L9.5 19.5 a4 4 0 0 1 -5.6 -5.6 L13 4.5 a2.8 2.8 0 0 1 4 4 L8 18" />
        </svg>
      </button>

      {/* 信纸 */}
      <textarea
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); } }}
        placeholder="写下此刻的话……"
        rows={1}
        style={{
          flex: 1, resize: "none",
          ...border.hairline,
          borderRadius: 10,
          background: "var(--warm-white)",
          boxShadow: "inset 0 1px 4px rgba(90,78,60,0.04)",
          padding: "8px 11px", fontSize: 13.5, lineHeight: 1.6,
          fontFamily: "var(--serif-body)", color: "var(--ink)",
          outline: "none", maxHeight: 88, overflowY: "auto",
        }}
        onInput={(e) => {
          e.target.style.height = "auto";
          e.target.style.height = Math.min(e.target.scrollHeight, 88) + "px";
        }}
      />

      {/* 发送：羽毛笔 */}
      <button onClick={onSend} aria-label="发送" className="pressable" style={{
        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
        ...border.hairline, background: "var(--warm-white)",
        display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
        boxShadow: "0 2px 8px rgba(90,78,60,0.06)",
      }}>
        <QuillIcon opacity={draft.trim() ? 0.85 : 0.3} />
      </button>
    </div>
  );
}
