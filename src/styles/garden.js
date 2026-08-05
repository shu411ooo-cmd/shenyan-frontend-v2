/* ============================================================
   Garden shared styles —— 消除 inline style 重复
   用法：<div style={{ ...border.hairline, ...flex.center }}>

   渐进替换，无工具链改动。一处改全局生效。
   ============================================================ */

/* ---- border ---- */
export const border = {
  hairline: { border: "1px solid var(--paper-edge)" },
  bottom:   { borderBottom: "1px solid var(--paper-edge)" },
  none:     { border: "none" },
  circle:   { borderRadius: "50%" },
  pill:     { borderRadius: 999 },
};

/* ---- layout ---- */
export const pos = {
  absolute: { position: "absolute", inset: 0 },
};

export const scroll = {
  body: { flex: 1, overflowY: "auto", scrollbarWidth: "none" },
};

/* ---- flex ---- */
export const flex = {
  center:  { display: "flex", alignItems: "center", justifyContent: "center" },
  row:     { display: "flex", alignItems: "center" },
  col:     { display: "flex", flexDirection: "column" },
  between: { display: "flex", alignItems: "center", justifyContent: "space-between" },
};

/* ---- text ---- */
export const text = {
  label:   { fontSize: 10, letterSpacing: "0.2em", color: "var(--ink-soft)" },
  caption: { fontSize: 9.5, letterSpacing: "0.16em", color: "var(--ink-soft)", opacity: 0.75 },
  soft:    { color: "var(--ink-soft)" },
  handCN:  { fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.7 },
};

/* ---- button ---- */
export const btn = {
  ghost: {
    background: "none", border: "none", cursor: "pointer",
    fontFamily: "var(--serif-en)",
  },
  icon: {
    width: 34, height: 34, borderRadius: "50%",
    border: "none", background: "transparent",
    cursor: "pointer", color: "var(--ink-soft)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
};

/* ---- paper ---- */
export const paper = {
  edge:     { border: "1px solid var(--paper-edge)", borderRadius: 16 },
  card:     { background: "var(--warm-white)", border: "1px solid var(--paper-edge)", borderRadius: 14 },
  subtle:   { background: "linear-gradient(170deg, var(--warm-white), #F6F0E3)", border: "1px solid var(--paper-edge)", borderRadius: 16 },
};
