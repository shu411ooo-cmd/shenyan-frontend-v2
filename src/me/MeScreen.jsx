import React, { useState, useRef, useEffect } from "react";
import { OliveVine, RoseVine, LavenderVine } from "../memory/VineDividers.jsx";
import Sheet, { SheetButton, SheetInput, SheetOption } from "../components/Sheet.jsx";
import PageShell from "../components/PageShell.jsx";
import { useGarden } from "../state/GardenSettings.jsx";
import { border } from "../styles/garden.js";
import { API_BASE } from "../config.js";

/* ------------------------------------------------------------
   Me —— 花园主人的房间
   现在这里的主人可以真正修改自己的房间了。
   ------------------------------------------------------------ */

const DEFAULT_PROFILE = {
  name: "小树",
  tagline: "the gardener of this little garden",
  bio: "在这里种一些安静的东西。",
  since: "day 37 · since early summer",
  avatar: null, // URL string
};

const THEMES = [
  { id: "warm", label: "Warm ivory", colors: ["#F5EFE2", "#FAF4E8", "#E4E9E0"] },
  { id: "mist", label: "Mist green", colors: ["#EDF0E9", "#F6F7F1", "#E0E6DB"] },
  { id: "frost", label: "Frost", colors: ["#EBEEF2", "#F5F6F8", "#E2E8EF"] },
];

const TYPES = [
  { id: "serif", label: "Serif garden" },
  { id: "manrope", label: "Manrope" },
  { id: "fraunces", label: "Fraunces" },
];

const SEASONS = [
  { id: "spring", label: "Spring", color: "#9AA88C" },
  { id: "summer", label: "Summer", color: "#C48A82" },
  { id: "autumn", label: "Autumn", color: "#B8956A" },
  { id: "winter", label: "Winter", color: "#A3B1B8" },
];

const MODELS = [
  { id: "claude-sonnet", label: "Claude Sonnet" },
  { id: "claude-opus", label: "Claude Opus" },
  { id: "claude-haiku", label: "Claude Haiku" },
];

const VOICES = [
  { id: "warm", label: "Warm / Quiet" },
  { id: "gentle", label: "Gentle / Slow" },
  { id: "bright", label: "Bright / Light" },
];

const CONNECTIONS = [
  { id: "garden", label: "Garden route" },
  { id: "direct", label: "Direct API" },
  { id: "local", label: "Local bridge" },
];

/* 细线图标 */
const ICONS = {
  profile: <circle cx="12" cy="8" r="3.4" />,
  nickname: <path d="M5 19c1-4 3.5-6 7-6s6 2 7 6M9 5h6" />,
  little: <path d="M12 3v18M5 12h14M7 7l10 10M17 7L7 17" />,
  theme: <path d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z M12 4v16 M4 12h16" />,
  type: <path d="M6 18 12 5l6 13M8.5 13h7" />,
  season: <path d="M12 2 C7 6 5 10 5 14a7 7 0 0 0 14 0C19 10 17 6 12 2Z M12 8v8" />,
  decor: <path d="M4 14 C4 8 8 4 14 4 C18 4 22 8 22 12 C22 18 18 22 12 22" />,
  conversation: <path d="M4 18c-.6-4 1.3-8 4.5-10.2C12 5.4 16.5 5 20 6c0 4-1.7 7.5-4.7 9.8C12 18 8 18.7 4 18Z" />,
  model: <><rect x="7" y="7" width="10" height="10" rx="2" /><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21" /></>,
  voice: <path d="M5 10v4M9 7v10M13 4v16M17 8v8M21 11v2" />,
  connection: <path d="M8 8V6a4 4 0 0 1 8 0v2M6 8h12v4a6 6 0 0 1-12 0V8ZM12 14v6" />,
  memory: <path d="M4 19.5V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v13.5" />,
  privacy: <path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3Z" />,
  data: <><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5M12 7.8v.2" /></>,
};

function RowIcon({ name }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-soft)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.75 }}>
      {ICONS[name]}
    </svg>
  );
}

/* 花苞开关 */
function BudSwitch({ on, onChange }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onChange(!on); }}
      aria-pressed={on}
      className="pressable"
      style={{
        width: 38, height: 22, borderRadius: 999, border: "none", cursor: "pointer",
        background: on ? "var(--accent)" : "var(--paper-edge)",
        opacity: on ? 1 : 0.55,
        position: "relative", transition: "background 250ms var(--ease-out), opacity 250ms",
        flexShrink: 0,
      }}
    >
      <i style={{
        position: "absolute", top: 3, left: on ? 19 : 3,
        width: 16, height: 16, borderRadius: "50% 50% 50% 4px",
        background: "var(--warm-white)",
        boxShadow: "0 1px 3px rgba(90,78,60,0.25)",
        transition: "left 250ms var(--ease-out)",
      }} />
    </button>
  );
}

/* 房间分区标题 */
function ZoneTitle({ children, deco, decor = true }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "32px 0 10px" }}>
      {decor && deco}
      <span className="f-display" style={{
        fontSize: 9.5, letterSpacing: "0.24em", color: "var(--accent-deep)", textTransform: "uppercase",
      }}>
        {children}
      </span>
      <span style={{ flex: 1, height: 1, background: "linear-gradient(90deg, var(--paper-edge), transparent)", opacity: 0.7 }} />
    </div>
  );
}

/* 房间里的行 */
function Row({ icon, label, value, toggle, on, onToggle, dim, preview, onClick }) {
  return (
    <button
      className="pressable"
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 13, width: "100%",
        background: "none", border: "none", cursor: toggle ? "default" : "pointer",
        padding: "13px 2px", textAlign: "left",
        opacity: dim ? 0.55 : 1,
      }}
    >
      <RowIcon name={icon} />
      <span style={{ fontSize: 14, color: "var(--ink)", fontFamily: "var(--serif-body)" }}>
        {label}
      </span>
      <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
        {preview}
        {toggle ? (
          <BudSwitch on={on} onChange={onToggle} />
        ) : (
          <>
            {value && (
              <span className="f-italic-en" style={{ fontSize: 12.5, color: "var(--ink-soft)", opacity: 0.85 }}>
                {value}
              </span>
            )}
            {!toggle && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--ink-soft)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
              <path d="M9 5l7 7-7 7" />
            </svg>}
          </>
        )}
      </span>
    </button>
  );
}

/* 季节徽章：支持 Auto（显示当前实际季节） */
function SeasonBadge({ season, effectiveSeason }) {
  const shown = season === "auto" ? effectiveSeason : season;
  const color = SEASONS.find((s) => s.id === shown)?.color || "var(--sage)";
  const label = season === "auto"
    ? `Auto · ${SEASONS.find((s) => s.id === shown)?.label}`
    : SEASONS.find((s) => s.id === shown)?.label;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 12, color: "var(--ink-soft)",
    }}>
      <svg width="10" height="10" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="7" fill={color} opacity="0.35" />
        <path d="M12 6v12M6 12h12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {label}
    </span>
  );
}

/* 主题色板 */
function ThemePreview({ themeId }) {
  const theme = THEMES.find((t) => t.id === themeId);
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
      {theme?.colors.map((c, i) => (
        <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, ...border.hairline }} />
      ))}
      <span className="f-italic-en" style={{ fontSize: 12.5, color: "var(--ink-soft)", marginLeft: 3 }}>{theme?.label}</span>
    </span>
  );
}

function UserAvatar({ url }) {
  return (
    <div className="relief-disc" style={{
      width: 78, height: 78, borderRadius: "50%", overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--warm-white)",
    }}
    >
      {url ? (
        <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <svg width="44" height="58" viewBox="0 0 44 58" fill="none" stroke="#C9BCA2" strokeWidth="1.3" strokeLinecap="round"
        >
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

export default function MeScreen({ onNavigate }) {
  const {
    theme, type, season, decor, effectiveSeason,
    setTheme, setType, setSeason, setDecor,
    keepsakes, addKeepsake, removeKeepsake,
  } = useGarden();

  const [profile, setProfile] = useState(() => {
    try {
      const raw = localStorage.getItem("garden-profile");
      if (raw) return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
    } catch (e) { /* ignore */ }
    return DEFAULT_PROFILE;
  });
  const [companion, setCompanion] = useState({ conversation: "gentle", model: "claude-sonnet", voice: "warm", connection: "garden" });
  const [sheet, setSheet] = useState(null);
  const [draft, setDraft] = useState("");
  const fileInput = useRef(null);

  // Soul —— 系统提示词（他的灵魂）
  const [promptText, setPromptText] = useState("");
  const [promptSaving, setPromptSaving] = useState(false);
  const [promptSaved, setPromptSaved] = useState(false);

  useEffect(() => {
    try { localStorage.setItem("garden-profile", JSON.stringify(profile)); } catch (e) { /* ignore */ }
  }, [profile]);

  // 进入房间时读当前 system_prompt（数据库 → env → 默认）
  useEffect(() => {
    fetch(`${API_BASE}/api/system-prompt`)
      .then((r) => r.json())
      .then((d) => {
        if (d && typeof d.system_prompt === "string") setPromptText(d.system_prompt);
      })
      .catch(() => { /* 后端不可达时留空 */ });
  }, []);

  async function savePrompt() {
    setPromptSaving(true);
    try {
      await fetch(`${API_BASE}/api/system-prompt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system_prompt: promptText.trim() })
      });
      setPromptSaved(true);
      setTimeout(() => setPromptSaved(false), 2000);
    } catch (e) {
      console.error("保存 system_prompt 失败:", e);
    } finally {
      setPromptSaving(false);
    }
  }

  const open = (name) => setSheet(name);
  const close = () => { setSheet(null); setDraft(""); };

  function handleAvatarFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setProfile((p) => ({ ...p, avatar: url }));
    close();
  }

  function addLittleThing() {
    const text = draft.trim();
    if (!text) return;
    addKeepsake(text);
    setDraft("");
  }

  return (
    <>
      <PageShell vignette decor={false} padding="30px 22px 96px" zIndex={8}>
        <header style={{ position: "relative", marginBottom: 6 }}>
          <div style={{
            position: "absolute", top: -30, left: -22, right: -22, height: 160,
            background: "linear-gradient(170deg, var(--warm-white) 0%, var(--ivory) 72%)",
            ...border.bottom,
            opacity: 0.55, pointerEvents: "none",
          }} />

          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 18 }}>
            <button
              onClick={() => open("avatar")}
              className="pressable"
              style={{
                border: "none", background: "transparent", padding: 0, cursor: "pointer", borderRadius: "50%",
              }}
            >
              <UserAvatar url={profile.avatar} />
            </button>
            <div style={{ flex: 1 }}>
              <div className="f-display" style={{ fontSize: 22, fontWeight: 500, letterSpacing: "0.02em", color: "var(--ink)" }}>
                {profile.name}
              </div>
              <div className="f-hand-en" style={{ fontSize: 17, color: "var(--ink-soft)", marginTop: 4, lineHeight: 1.4 }}>
                {profile.tagline}
              </div>
              <div className="f-italic-en" style={{ fontSize: 11.5, color: "var(--ink-soft)", opacity: 0.7, marginTop: 5 }}>
                {profile.since}
              </div>
            </div>
          </div>

          {decor && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -6 }}>
              <RoseVine width={100} opacity={0.5} />
            </div>
          )}
        </header>

        {/* Personal */}
        <ZoneTitle decor={decor} deco={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.4" strokeLinecap="round"
        >
          <circle cx="12" cy="8" r="3.4" /><path d="M5 19c1-4 3.5-6 7-6s6 2 7 6" />
        </svg>}
        >
          Personal
        </ZoneTitle>
        <div style={{ paddingLeft: 4 }}>
          <Row icon="profile" label="My Profile" value="edit" onClick={() => open("profile")} />
          <div style={{ height: 1, background: "var(--paper-edge)", opacity: 0.35, marginLeft: 30 }} />
          <Row icon="nickname" label="Nickname" value={profile.name} onClick={() => { setDraft(profile.name); open("nickname"); }} />
          <div style={{ height: 1, background: "var(--paper-edge)", opacity: 0.35, marginLeft: 30 }} />
          <Row icon="little" label="Little Things" value={`${keepsakes.length} kept`} onClick={() => open("little-things")} />
        </div>

        {/* Garden */}
        <ZoneTitle decor={decor} deco={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.4" strokeLinecap="round"
        >
          <path d="M12 22V12M12 12C12 8 10 6 7 5c-1 3 0 6 5 7zM12 12c0-4 2-6 5-7 1 3 0 6-5 7z" />
        </svg>}
        >
          Garden
        </ZoneTitle>
        <div style={{
          background: "linear-gradient(160deg, var(--warm-white), var(--ivory))",
          ...border.hairline, borderRadius: 14,
          padding: "6px 14px", boxShadow: "0 4px 14px rgba(90,78,60,0.06)",
        }}
        >
          <Row icon="theme" label="Theme" preview={<ThemePreview themeId={theme} />} onClick={() => open("theme")} />
          <div style={{ height: 1, background: "var(--paper-edge)", opacity: 0.4, marginLeft: 30 }} />
          <Row icon="type" label="Typography" value={TYPES.find((t) => t.id === type)?.label} onClick={() => open("typography")} />
          <div style={{ height: 1, background: "var(--paper-edge)", opacity: 0.4, marginLeft: 30 }} />
          <Row icon="season" label="Season" preview={<SeasonBadge season={season} effectiveSeason={effectiveSeason} />} onClick={() => open("season")} />
          <div style={{ height: 1, background: "var(--paper-edge)", opacity: 0.4, marginLeft: 30 }} />
          <Row icon="decor" label="Decorations" toggle on={decor} onToggle={setDecor} />
        </div>

        {/* Companion */}
        <ZoneTitle decor={decor} deco={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.4" strokeLinecap="round"
        >
          <path d="M4 19.5V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v13.5" /><path d="M8 7h8M8 11h5" />
        </svg>}
        >
          Companion
        </ZoneTitle>
        <div style={{ paddingLeft: 4 }}>
          <Row icon="conversation" label="Conversation" value={companion.conversation} onClick={() => open("conversation")} />
          <div style={{ height: 1, background: "var(--paper-edge)", opacity: 0.35, marginLeft: 30 }} />
          <Row icon="model" label="Model" value={MODELS.find((m) => m.id === companion.model)?.label} onClick={() => open("model")} />
          <div style={{ height: 1, background: "var(--paper-edge)", opacity: 0.35, marginLeft: 30 }} />
          <Row icon="voice" label="Voice" value={VOICES.find((v) => v.id === companion.voice)?.label} onClick={() => open("voice")} />
          <div style={{ height: 1, background: "var(--paper-edge)", opacity: 0.35, marginLeft: 30 }} />
          <Row icon="connection" label="Connections" value={CONNECTIONS.find((c) => c.id === companion.connection)?.label} onClick={() => open("connection")} />
        </div>

        {/* Soul —— 他的灵魂：系统提示词 */}
        <ZoneTitle decor={decor} deco={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.4" strokeLinecap="round"
        >
          <path d="M12 3c-3.5 2.5-5.5 5-5.5 8a5.5 5.5 0 0 0 11 0c0-3-2-5.5-5.5-8Z" /><path d="M12 9.5v4M12 16.5v.5" />
        </svg>}
        >
          Soul
        </ZoneTitle>
        <div className="f-hand-cn" style={{ fontSize: 13, color: "var(--ink-soft)", margin: "-2px 0 10px", lineHeight: 1.7 }}>
          写下他是谁、他怎么说话。这里是他的灵魂，决定每一次对话的语气。
        </div>
        <div style={{
          background: "linear-gradient(160deg, var(--warm-white), var(--ivory))",
          ...border.hairline, borderRadius: 14,
          padding: "4px 14px 14px", boxShadow: "0 4px 14px rgba(90,78,60,0.06)",
        }}
        >
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="留空 = 保持默认。写下一段话，他就会成为那样的人……"
            rows={7}
            style={{
              width: "100%", border: "none", background: "transparent", resize: "vertical",
              fontFamily: "var(--serif-body)", fontSize: 13.5, lineHeight: 1.7,
              color: "var(--ink)", padding: "10px 2px 6px", outline: "none",
            }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10, marginTop: 4 }}>
            <span className="f-italic-en" style={{
              fontSize: 11, color: "var(--sage-deep)", opacity: promptSaved ? 1 : 0,
              transition: "opacity 300ms", fontStyle: "italic",
            }}
            >
              saved
            </span>
            <button
              onClick={savePrompt}
              disabled={promptSaving}
              className="pressable"
              style={{
                border: "none", background: "var(--accent)", color: "var(--warm-white)",
                padding: "8px 20px", borderRadius: 999, fontSize: 12.5, cursor: "pointer",
                fontFamily: "var(--serif-body)", opacity: promptSaving ? 0.6 : 1,
              }}
            >
              {promptSaving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>

        {/* Advanced */}
        <ZoneTitle decor={decor} deco={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-soft)" strokeWidth="1.4" strokeLinecap="round"
        >
          <path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3Z" />
        </svg>}
        >
          Advanced
        </ZoneTitle>
        <div style={{ paddingLeft: 4, opacity: 0.9 }}>
          <Row icon="memory" label="Memory" value="active" onClick={() => open("memory")} />
          <div style={{ height: 1, background: "var(--paper-edge)", opacity: 0.35, marginLeft: 30 }} />
          <Row icon="privacy" label="Privacy" onClick={() => open("privacy")} />
          <div style={{ height: 1, background: "var(--paper-edge)", opacity: 0.35, marginLeft: 30 }} />
          <Row icon="data" label="Data" value="v0.1" onClick={() => open("data")} />
          <div style={{ height: 1, background: "var(--paper-edge)", opacity: 0.35, marginLeft: 30 }} />
          <Row icon="privacy" label="Request Stats" value="usage" onClick={() => onNavigate("stats")} />
        </div>

        {decor && (
          <div style={{ display: "flex", justifyContent: "center", margin: "34px 0 10px" }}>
            <LavenderVine width={130} opacity={0.5} />
          </div>
        )}

        <p className="f-italic-en" style={{
          textAlign: "center", fontSize: 12, color: "var(--ink-soft)", opacity: 0.5,
        }}
        >
          kept softly, since spring
        </p>
    </PageShell>

      {/* Sheets */}
      <Sheet open={sheet === "profile"} onClose={close} title="My Profile">
        <div style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 10 }}>
          一句关于你自己的话，会出现在花园里。
        </div>
        <SheetInput
          multiline
          value={profile.bio}
          onChange={(v) => setProfile((p) => ({ ...p, bio: v }))}
          placeholder="写点什么…"
        />
        <SheetButton primary onClick={close}>Save</SheetButton>
      </Sheet>

      <Sheet open={sheet === "nickname"} onClose={close} title="Nickname">
        <SheetInput
          value={draft}
          onChange={setDraft}
          placeholder="你的名字"
        />
        <SheetButton primary onClick={() => { setProfile((p) => ({ ...p, name: draft || p.name })); close(); }}>
          Save
        </SheetButton>
      </Sheet>

      <Sheet open={sheet === "avatar"} onClose={close} title="Portrait">
        <div style={{ display: "flex", justifyContent: "center", margin: "10px 0 20px" }}>
          <UserAvatar url={profile.avatar} />
        </div>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          onChange={handleAvatarFile}
          style={{ display: "none" }}
        />
        <SheetButton primary onClick={() => fileInput.current?.click()}>Choose from library</SheetButton>
        {profile.avatar && (
          <SheetButton onClick={() => setProfile((p) => ({ ...p, avatar: null }))}>Remove portrait</SheetButton>
        )}
      </Sheet>

      <Sheet open={sheet === "little-things"} onClose={close} title="Little Things">
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <SheetInput
              value={draft}
              onChange={setDraft}
              placeholder="一件值得留下的小事…"
            />
          </div>
          <button
            onClick={addLittleThing}
            className="pressable"
            style={{
              width: 42, height: 42, borderRadius: 12,
              ...border.hairline, background: "var(--accent)",
              color: "var(--warm-white)", display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {keepsakes.map((l) => (
            <div key={l.id} style={{
              background: "var(--ivory)", ...border.hairline, borderRadius: 10,
              padding: "10px 12px", display: "flex", alignItems: "center", gap: 10,
            }}
            >
              <span style={{ flex: 1, fontSize: 13.5, color: "var(--ink)" }}>{l.text}</span>
              <span className="f-italic-en" style={{ fontSize: 10.5, color: "var(--ink-soft)", opacity: 0.75 }}>{l.date}</span>
              <button
                onClick={() => removeKeepsake(l.id)}
                style={{
                  width: 22, height: 22, borderRadius: "50%", border: "none", background: "transparent",
                  color: "var(--ink-soft)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          {keepsakes.length === 0 && (
            <div className="f-hand-cn" style={{ textAlign: "center", fontSize: 13, color: "var(--ink-soft)", opacity: 0.7, padding: "14px 0" }}>
              还没有留下什么。
            </div>
          )}
        </div>
      </Sheet>

      <Sheet open={sheet === "theme"} onClose={close} title="Theme">
        {THEMES.map((t) => (
          <SheetOption
            key={t.id}
            label={t.label}
            value={t.id}
            current={theme}
            onClick={setTheme}
            preview={
              <span style={{ display: "flex", gap: 3 }}>
                {t.colors.map((c, i) => (
                  <span key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c, ...border.hairline }} />
                ))}
              </span>
            }
          />
        ))}
        <SheetButton primary onClick={close}>Done</SheetButton>
      </Sheet>

      <Sheet open={sheet === "typography"} onClose={close} title="Typography">
        {TYPES.map((t) => (
          <SheetOption
            key={t.id}
            label={t.label}
            value={t.id}
            current={type}
            onClick={setType}
          />
        ))}
        <SheetButton primary onClick={close}>Done</SheetButton>
      </Sheet>

      <Sheet open={sheet === "season"} onClose={close} title="Season">
        <SheetOption
          label="Auto — 跟随真实月份"
          value="auto"
          current={season}
          onClick={setSeason}
          preview={<svg width="14" height="14" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8" fill="var(--sage)" opacity="0.4" />
          </svg>}
        />
        {SEASONS.map((s) => (
          <SheetOption
            key={s.id}
            label={s.label}
            value={s.id}
            current={season}
            onClick={setSeason}
            preview={<svg width="14" height="14" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="8" fill={s.color} opacity="0.4" />
            </svg>}
          />
        ))}
        <SheetButton primary onClick={close}>Done</SheetButton>
      </Sheet>

      <Sheet open={sheet === "conversation"} onClose={close} title="Conversation">
        {[
          { id: "gentle", label: "Gentle — 说得慢，留空白" },
          { id: "warm", label: "Warm — 像午后回信" },
          { id: "quiet", label: "Quiet — 只在必要时开口" },
        ].map((opt) => (
          <SheetOption
            key={opt.id}
            label={opt.label}
            value={opt.id}
            current={companion.conversation}
            onClick={(v) => setCompanion((c) => ({ ...c, conversation: v }))}
          />
        ))}
        <SheetButton primary onClick={close}>Done</SheetButton>
      </Sheet>

      <Sheet open={sheet === "model"} onClose={close} title="Model">
        {MODELS.map((m) => (
          <SheetOption
            key={m.id}
            label={m.label}
            value={m.id}
            current={companion.model}
            onClick={(v) => setCompanion((c) => ({ ...c, model: v }))}
          />
        ))}
        <SheetButton primary onClick={close}>Done</SheetButton>
      </Sheet>

      <Sheet open={sheet === "voice"} onClose={close} title="Voice">
        {VOICES.map((v) => (
          <SheetOption
            key={v.id}
            label={v.label}
            value={v.id}
            current={companion.voice}
            onClick={(val) => setCompanion((c) => ({ ...c, voice: val }))}
          />
        ))}
        <SheetButton primary onClick={close}>Done</SheetButton>
      </Sheet>

      <Sheet open={sheet === "connection"} onClose={close} title="Connection">
        {CONNECTIONS.map((c) => (
          <SheetOption
            key={c.id}
            label={c.label}
            value={c.id}
            current={companion.connection}
            onClick={(v) => setCompanion((c) => ({ ...c, connection: v }))}
          />
        ))}
        <SheetButton primary onClick={close}>Done</SheetButton>
      </Sheet>

      <Sheet open={sheet === "memory"} onClose={close} title="Memory">
        <div className="f-hand-cn" style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.8, marginBottom: 12 }}>
          记忆现在处于活跃状态。他会记住你们对话中值得保留的部分。
        </div>
        <Row icon="memory" label="Long-term memory" toggle on={true} onToggle={() => {}} />
        <SheetButton onClick={close}>Close</SheetButton>
      </Sheet>

      <Sheet open={sheet === "privacy"} onClose={close} title="Privacy">
        <div className="f-hand-cn" style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.8, marginBottom: 16 }}>
          花园里的对话只停留在这座花园里。目前没有数据会离开本地设备。
        </div>
        <SheetButton onClick={close}>Close</SheetButton>
      </Sheet>

      <Sheet open={sheet === "data"} onClose={close} title="Data">
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: "var(--ink)" }}>Version <span className="f-italic-en" style={{ color: "var(--ink-soft)" }}>v0.1</span></div>
          <div style={{ fontSize: 13, color: "var(--ink)" }}>Local memories <span className="f-italic-en" style={{ color: "var(--ink-soft)" }}>{keepsakes.length} items</span></div>
        </div>
        <SheetButton onClick={close}>Close</SheetButton>
      </Sheet>
    </>
  );
}
