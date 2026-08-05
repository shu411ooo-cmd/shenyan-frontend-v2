
import { border } from "../styles/garden.js";
import React from "react";

/* ------------------------------------------------------------
   Sheet —— 从底部滑上来的轻量抽屉
   用于 Me 里的设置项，避免页面跳转。
   ------------------------------------------------------------ */

export default function Sheet({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 40,
      background: "rgba(61,51,42,0.18)",
    }}
    >
      <div onClick={onClose} style={{ position: "absolute", inset: 0 }} aria-hidden="true" />

      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 41,
        maxHeight: "78%",
        background: "var(--warm-white)",
        borderTop: "1px solid var(--paper-edge)",
        borderRadius: "22px 22px 0 0",
        boxShadow: "0 -8px 36px rgba(90,78,60,0.14)",
        padding: "22px 20px 28px",
        display: "flex", flexDirection: "column",
        animation: "sheetUp 280ms var(--ease-out) both",
      }}
      >
        <style>{`
          @keyframes sheetUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        `}</style>

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 18,
        }}>
          <div className="f-display" style={{
            fontSize: 15, fontWeight: 500, letterSpacing: "0.03em", color: "var(--ink)",
          }}>
            {title}
          </div>
          <button
            onClick={onClose}
            className="pressable"
            style={{
              width: 30, height: 30, borderRadius: "50%", border: "none", background: "transparent",
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              color: "var(--ink-soft)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function SheetButton({ children, onClick, primary, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="pressable"
      style={{
        width: "100%", padding: "12px", borderRadius: 12,
        border: primary ? "none" : "1px solid var(--paper-edge)",
        background: primary ? "var(--accent)" : "transparent",
        color: primary ? "var(--warm-white)" : "var(--ink)",
        fontFamily: "var(--serif-body)", fontSize: 14,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        marginTop: 14,
      }}
    >
      {children}
    </button>
  );
}

export function SheetInput({ value, onChange, placeholder, multiline, rows = 4 }) {
  const base = {
    width: "100%", padding: "12px 14px", borderRadius: 10,
    ...border.hairline, background: "var(--ivory)",
    fontFamily: "var(--serif-body)", fontSize: 14, color: "var(--ink)",
    outline: "none",
  };
  return multiline ? (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{ ...base, resize: "none", lineHeight: 1.7 }}
    />
  ) : (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={base}
    />
  );
}

export function SheetOption({ label, value, current, onClick, preview }) {
  return (
    <button
      onClick={() => onClick(value)}
      className="pressable"
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 12,
        padding: "12px 10px", marginBottom: 8,
        ...border.hairline, borderRadius: 12,
        background: current === value ? "var(--warm-white)" : "transparent",
        boxShadow: current === value ? "0 2px 8px rgba(90,78,60,0.06)" : "none",
        cursor: "pointer", textAlign: "left",
      }}
    >
      {preview && <span style={{ flexShrink: 0 }}>{preview}</span>}
      <span style={{ flex: 1, fontSize: 14, color: "var(--ink)" }}>{label}</span>
      <span style={{
        width: 16, height: 16, borderRadius: "50%",
        border: current === value ? "5px solid var(--accent)" : "1px solid var(--paper-edge)",
        background: "var(--warm-white)",
      }} />
    </button>
  );
}
