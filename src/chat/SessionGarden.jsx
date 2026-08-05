
import { border } from "../styles/garden.js";
import React, { useState } from "react";
import {
  IconLeaf, IconModel, IconThinking, IconMemory, IconTools, IconChevronRight, IconCheck,
} from "./ChatIcons.jsx";

/* ------------------------------------------------------------
   SessionGarden —— 这次谈话的小花园
   不是全局设置，而是当前聊天的轻量控制抽屉。
   ------------------------------------------------------------ */

const MODELS = [
  { id: "claude-sonnet-4-6", label: "Claude Sonnet 4.6" },
  { id: "claude-opus-4-6", label: "Claude Opus 4.6" },
];

const THINKING_MODES = [
  { id: "standard", label: "Standard" },
  { id: "deep", label: "Deep" },
];

function MenuRow({ icon, label, value, onClick }) {
  return (
    <button
      onClick={onClick}
      className="pressable"
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 12,
        padding: "10px 4px", border: "none", background: "transparent",
        borderBottom: "1px solid rgba(224,213,191,0.6)",
        fontFamily: "var(--serif-body)", color: "var(--ink)", cursor: "pointer",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 22 }}>{icon}</span>
      <span style={{ fontSize: 14 }}>{label}</span>
      <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, fontSize: 12.5, color: "var(--ink-soft)" }}>
        {value} <IconChevronRight size={14} />
      </span>
    </button>
  );
}

function ModelPicker({ current, onSelect, onBack }) {
  return (
    <div style={{ animation: "pageIn 180ms var(--ease-out) both" }}>
      <button onClick={onBack} className="pressable" style={{
        display: "flex", alignItems: "center", gap: 6, marginBottom: 10,
        border: "none", background: "transparent", color: "var(--ink-soft)", cursor: "pointer",
        fontSize: 12, letterSpacing: "0.08em", fontFamily: "var(--serif-en)",
      }}>
        ← Choose Model
      </button>
      {MODELS.map((m) => (
        <button
          key={m.id}
          onClick={() => onSelect(m.id)}
          className="pressable"
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "11px 8px", marginBottom: 6,
            ...border.hairline, borderRadius: 10,
            background: current === m.id ? "var(--warm-white)" : "transparent",
            boxShadow: current === m.id ? "0 2px 8px rgba(90,78,60,0.06)" : "none",
            fontFamily: "var(--serif-body)", color: "var(--ink)", cursor: "pointer",
          }}
        >
          <IconModel size={16} color="var(--ink-soft)" />
          <span style={{ fontSize: 13.5 }}>{m.label}</span>
          {current === m.id && <span style={{ marginLeft: "auto" }}><IconCheck size={14} /></span>}
        </button>
      ))}
    </div>
  );
}

export default function SessionGarden({ open, onClose, settings, onChange }) {
  const [page, setPage] = useState(null); // null | "model" | "thinking"

  if (!open) return null;

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 15,
      background: "rgba(247,242,233,0.25)",
    }}
    >
      <div
        onClick={onClose}
        style={{ position: "absolute", inset: 0 }}
        aria-hidden="true"
      />
      <div style={{
        position: "absolute", top: 58, right: 10, width: 260,
        background: "var(--warm-white)",
        ...border.hairline,
        borderRadius: 14,
        boxShadow: "0 12px 36px rgba(90,78,60,0.14)",
        padding: "16px 16px 12px",
        animation: "pageIn 220ms var(--ease-out) both",
      }}
    >
        {page === "model" && (
          <ModelPicker
            current={settings.model}
            onSelect={(id) => { onChange({ ...settings, model: id }); setPage(null); }}
            onBack={() => setPage(null)}
          />
        )}

        {page !== "model" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <IconLeaf size={18} opacity={0.85} />
              <span className="f-display" style={{ fontSize: 13, letterSpacing: "0.08em", color: "var(--ink)" }}>
                Session Garden
              </span>
            </div>
            <div style={{
              fontSize: 11, color: "var(--ink-soft)", opacity: 0.75,
              marginBottom: 10, letterSpacing: "0.04em",
            }}>
              Current Chat
            </div>

            <MenuRow
              icon={<IconModel size={18} />}
              label="Model"
              value={MODELS.find((m) => m.id === settings.model)?.label}
              onClick={() => setPage("model")}
            />
            <MenuRow
              icon={<IconThinking size={18} />}
              label="Thinking"
              value={THINKING_MODES.find((t) => t.id === settings.thinking)?.label}
              onClick={() => onChange({ ...settings, thinking: settings.thinking === "deep" ? "standard" : "deep" })}
            />
            <MenuRow
              icon={<IconMemory size={18} />}
              label="Memory"
              value={settings.memory ? "Active" : "Off"}
              onClick={() => onChange({ ...settings, memory: !settings.memory })}
            />
            <MenuRow
              icon={<IconTools size={18} />}
              label="Tools"
              value={settings.tools === "auto" ? "Auto" : "Off"}
              onClick={() => onChange({ ...settings, tools: settings.tools === "auto" ? "off" : "auto" })}
            />

            <div style={{
              marginTop: 10, paddingTop: 8,
              borderTop: "1px solid rgba(224,213,191,0.6)",
              fontSize: 10.5, color: "var(--ink-soft)", opacity: 0.65,
              textAlign: "center", letterSpacing: "0.04em",
            }}>
              Only for this conversation
            </div>
          </>
        )}
      </div>
    </div>
  );
}
