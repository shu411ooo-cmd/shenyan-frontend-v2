import React from "react";

export default function BackButton({ onClick }) {
  return (
    <button onClick={onClick} aria-label="返回" className="pressable" style={{
      width: 34, height: 34, borderRadius: "50%", border: "none", background: "transparent",
      color: "var(--ink-soft)", cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5" />
        <path d="M11 18l-6-6 6-6" />
      </svg>
    </button>
  );
}
