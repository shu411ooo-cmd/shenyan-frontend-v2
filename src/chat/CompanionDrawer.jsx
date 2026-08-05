
import { border } from "../styles/garden.js";
import React, { useState, useRef } from "react";
import { COMPANION_ADVANCED } from "./chat-config.js";
import { US_MEMORIES } from "../memory/memory-config.js";
import { IconChevronRight } from "./ChatIcons.jsx";
import Sheet, { SheetInput, SheetButton, SheetOption } from "../components/Sheet.jsx";

/* ------------------------------------------------------------
   CompanionDrawer —— His little room / Companion space
   现在可以真正编辑他的身份、声音和连接方式。
   ------------------------------------------------------------ */

function DrawerRow({ label, value, preview, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="pressable"
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 12,
        padding: "11px 2px", border: "none", background: "transparent",
        borderBottom: "1px solid rgba(224,213,191,0.55)",
        fontFamily: "var(--serif-body)", color: "var(--ink)", cursor: onClick ? "pointer" : "default",
        textAlign: "left",
      }}
    >
      <span style={{ flex: 1, fontSize: 14 }}>{label}</span>
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {preview && (
          <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{preview}</span>
        )}
        {value && (
          <span style={{
            fontSize: 12, color: "var(--ink-soft)", maxWidth: 120,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{value}</span>
        )}
        {onClick && <IconChevronRight size={14} color="var(--ink-soft)" />}
      </span>
      {children}
    </button>
  );
}

function SectionTitle({ children }) {
  return (
    <div className="f-display" style={{
      fontSize: 9.5, letterSpacing: "0.22em", color: "var(--ink-soft)", opacity: 0.85,
      margin: "22px 0 8px", textTransform: "uppercase",
    }}>
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div style={{
      height: 1, background: "var(--paper-edge)", opacity: 0.7, margin: "18px 0",
    }} />
  );
}

const VOICES = [
  { id: "warm", label: "Warm / Quiet" },
  { id: "gentle", label: "Gentle / Slow" },
  { id: "bright", label: "Bright / Light" },
];

const MODELS = [
  { id: "Claude Sonnet 4.6", label: "Claude Sonnet 4.6" },
  { id: "Claude Opus 4.6", label: "Claude Opus 4.6" },
  { id: "Claude Haiku 4.5", label: "Claude Haiku 4.5" },
];

const CONNECTIONS = [
  { id: "Default garden route", label: "Default garden route" },
  { id: "Direct API", label: "Direct API" },
  { id: "Local bridge", label: "Local bridge" },
];

function CompanionAvatar({ url, name }) {
  return (
    <div className="relief-disc" style={{
      width: 76, height: 76, borderRadius: "50%", overflow: "hidden", margin: "0 auto",
      background: "var(--warm-white)", display: "flex", alignItems: "center", justifyContent: "center",
    }}
    >
      {url ? (
        <img src={url} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} draggable="false" />
      ) : (
        <svg width="42" height="56" viewBox="0 0 44 58" fill="none" stroke="#C9BCA2" strokeWidth="1.3" strokeLinecap="round">
          <ellipse cx="22" cy="14" rx="7" ry="8.5" />
          <path d="M15 12C14 6 18 3 22 3s8 3 7 9" />
          <path d="M17 24c-5 2-8 8-9 16M27 24c5 2 8 8 9 16" />
          <path d="M10 30C6 24 5 16 8 10M34 30c4-6 5-14 2-20" opacity="0.7" />
          <path d="M14 34c4 3 12 3 16-1" />
        </svg>
      )}
    </div>
  );
}

export default function CompanionDrawer({ open, onClose, companion, setCompanion }) {
  const [sheet, setSheet] = useState(null);
  const [draft, setDraft] = useState("");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const fileInput = useRef(null);

  const closeSheet = () => { setSheet(null); setDraft(""); };

  function openSheet(name, initialDraft = "") {
    setDraft(initialDraft);
    setSheet(name);
  }

  function handleAvatarFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCompanion((c) => ({ ...c, avatar: url }));
    closeSheet();
  }

  if (!open) return null;

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 30,
      background: "rgba(61,51,42,0.18)",
    }}
    >
      <div onClick={onClose} style={{ position: "absolute", inset: 0 }} aria-hidden="true" />

      <div style={{
        position: "absolute", top: 0, right: 0, bottom: 0, width: 300, zIndex: 31,
        background: "var(--warm-white)",
        borderLeft: "1px solid var(--paper-edge)",
        boxShadow: "-12px 0 36px rgba(90,78,60,0.16)",
        padding: "28px 18px 32px",
        overflowY: "auto", scrollbarWidth: "none",
        animation: "drawerSlide 260ms var(--ease-out) both",
      }}
      >
        <style>{`
          @keyframes drawerSlide {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>

        <button
          onClick={onClose}
          className="pressable"
          aria-label="关闭"
          style={{
            position: "absolute", top: 14, right: 14,
            width: 32, height: 32, borderRadius: "50%", border: "none", background: "transparent",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            color: "var(--ink-soft)",
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div style={{ textAlign: "center", paddingTop: 8 }}>
          <button
            onClick={() => openSheet("avatar")}
            className="pressable"
            style={{ border: "none", background: "transparent", padding: 0, borderRadius: "50%", cursor: "pointer" }}
          >
            <CompanionAvatar url={companion.avatar} name={companion.alt} />
          </button>

          <button
            onClick={() => openSheet("name", companion.name)}
            className="pressable"
            style={{ border: "none", background: "transparent", padding: 0, cursor: "pointer", width: "100%" }}
          >
            <div className="f-display" style={{
              fontSize: 22, fontWeight: 500, letterSpacing: "0.04em", color: "var(--ink)", marginTop: 14,
            }}
            >
              {companion.name}
            </div>
          </button>

          <button
            onClick={() => openSheet("tagline", companion.tagline)}
            className="pressable"
            style={{ border: "none", background: "transparent", padding: 0, cursor: "pointer", width: "100%" }}
          >
            <div className="f-hand-en" style={{
              fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.45, marginTop: 4, whiteSpace: "pre-line",
            }}
            >
              {companion.tagline}
            </div>
          </button>
        </div>

        <Divider />

        {/* Appearance */}
        <SectionTitle>Appearance</SectionTitle>
        <DrawerRow
          label="头像"
          preview={
            <img src={companion.avatar} alt="" style={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover" }} />
          }
          onClick={() => openSheet("avatar")}
        />
        <DrawerRow label="昵称" value={companion.name} onClick={() => openSheet("name", companion.name)} />

        {/* Presence */}
        <SectionTitle>Presence</SectionTitle>
        <DrawerRow label="状态文字" value={companion.statusText} onClick={() => openSheet("status", companion.statusText)} />
        <DrawerRow label="声音" value={companion.voice} onClick={() => openSheet("voice")} />

        {/* Connection */}
        <SectionTitle>Connection</SectionTitle>
        <DrawerRow label="Model" value={companion.model} onClick={() => openSheet("model")} />
        <DrawerRow label="Connection" value={companion.connection} onClick={() => openSheet("connection")} />
        <DrawerRow
          label="Advanced"
          onClick={() => setAdvancedOpen((v) => !v)}
          preview={
            <svg
              width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ink-soft)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: advancedOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 200ms var(--ease-out)" }}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          }
        />
        {advancedOpen && (
          <div style={{ paddingLeft: 8, animation: "pageIn 180ms var(--ease-out) both" }}>
            {COMPANION_ADVANCED.map((item) => (
              <DrawerRow key={item.key} label={item.label} value={item.value} />
            ))}
          </div>
        )}

        <Divider />

        {/* Memory with you */}
        <SectionTitle>Memory with you</SectionTitle>
        <div className="f-hand-cn" style={{
          fontSize: 13, color: "var(--ink-soft)", margin: "-4px 0 12px",
        }}
        >
          与你共享的记忆
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {US_MEMORIES.slice(0, 3).map((m) => (
            <div key={m.id} style={{
              background: "linear-gradient(160deg, var(--ivory), #F3ECDC)",
              ...border.hairline, borderRadius: 10,
              padding: "12px 14px",
            }}
            >
              <div className="f-display" style={{
                fontSize: 9.5, letterSpacing: "0.14em", color: "var(--sage-deep)", marginBottom: 5,
              }}
              >
                {m.date.toUpperCase()}
              </div>
              <div style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.6 }}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 26, textAlign: "center",
          fontSize: 10, color: "var(--ink-soft)", opacity: 0.6, letterSpacing: "0.04em",
        }}
        >
          voice: {companion.voice.toLowerCase()} · model: {companion.model.toLowerCase()}
        </div>
      </div>

      {/* Sheets */}
      <Sheet open={sheet === "avatar"} onClose={closeSheet} title="Portrait">
        <div style={{ display: "flex", justifyContent: "center", margin: "10px 0 20px" }}>
          <CompanionAvatar url={companion.avatar} name={companion.alt} />
        </div>
        <input ref={fileInput} type="file" accept="image/*" onChange={handleAvatarFile} style={{ display: "none" }} />
        <SheetButton primary onClick={() => fileInput.current?.click()}>Choose from library</SheetButton>
        {companion.avatar && companion.avatar !== "assets/angel-bust.png" && (
          <SheetButton onClick={() => setCompanion((c) => ({ ...c, avatar: "assets/angel-bust.png" }))}>Reset portrait</SheetButton>
        )}
      </Sheet>

      <Sheet open={sheet === "name"} onClose={closeSheet} title="Name">
        <SheetInput value={draft} onChange={setDraft} placeholder="他的名字" />
        <SheetButton primary onClick={() => { setCompanion((c) => ({ ...c, name: draft || c.name })); closeSheet(); }}>Save</SheetButton>
      </Sheet>

      <Sheet open={sheet === "tagline"} onClose={closeSheet} title="Tagline">
        <SheetInput multiline value={draft} onChange={setDraft} placeholder="一句关于他的话" />
        <SheetButton primary onClick={() => { setCompanion((c) => ({ ...c, tagline: draft || c.tagline })); closeSheet(); }}>Save</SheetButton>
      </Sheet>

      <Sheet open={sheet === "status"} onClose={closeSheet} title="Status">
        <SheetInput value={draft} onChange={setDraft} placeholder="他现在的状态" />
        <SheetButton primary onClick={() => { setCompanion((c) => ({ ...c, statusText: draft || c.statusText, statusEdited: true })); closeSheet(); }}>Save</SheetButton>
      </Sheet>

      <Sheet open={sheet === "voice"} onClose={closeSheet} title="Voice">
        {VOICES.map((v) => (
          <SheetOption
            key={v.id}
            label={v.label}
            value={v.id}
            current={companion.voice}
            onClick={(val) => setCompanion((c) => ({ ...c, voice: val }))}
          />
        ))}
        <SheetButton primary onClick={closeSheet}>Done</SheetButton>
      </Sheet>

      <Sheet open={sheet === "model"} onClose={closeSheet} title="Model">
        {MODELS.map((m) => (
          <SheetOption
            key={m.id}
            label={m.label}
            value={m.id}
            current={companion.model}
            onClick={(val) => setCompanion((c) => ({ ...c, model: val }))}
          />
        ))}
        <SheetButton primary onClick={closeSheet}>Done</SheetButton>
      </Sheet>

      <Sheet open={sheet === "connection"} onClose={closeSheet} title="Connection">
        {CONNECTIONS.map((c) => (
          <SheetOption
            key={c.id}
            label={c.label}
            value={c.id}
            current={companion.connection}
            onClick={(val) => setCompanion((c) => ({ ...c, connection: val }))}
          />
        ))}
        <SheetButton primary onClick={closeSheet}>Done</SheetButton>
      </Sheet>
    </div>
  );
}
