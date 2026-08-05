import React from "react";
import GardenAtmosphere from "./GardenAtmosphere.jsx";

/* ============================================================
   PageShell —— 页面公共容器
   header / footer 渲染在滚动区外，固定不滚
   children 在滚动区内
   ============================================================ */

export default function PageShell({
  children,
  header = null,
  footer = null,
  decor = true,
  vignette = true,
  padding = "24px 20px 96px",
  zIndex = 8,
}) {
  return (
    <div className="page-in" style={{
      position: "absolute", inset: 0, zIndex,
      background: "var(--ivory)", display: "flex", flexDirection: "column",
    }}>
      {vignette && <div className="vignette" />}
      {vignette && <div className="halftone" />}
      {decor && <GardenAtmosphere />}
      {header}
      <div style={{
        flex: 1, overflowY: "auto", scrollbarWidth: "none",
        padding, position: "relative", zIndex: 4,
      }}>
        {children}
      </div>
      {footer}
    </div>
  );
}
