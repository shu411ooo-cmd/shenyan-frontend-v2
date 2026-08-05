import React, { useState, useEffect, useRef } from "react";
import PageShell from "../components/PageShell.jsx";
import BackButton from "../components/BackButton.jsx";
import { useGarden } from "../state/GardenSettings.jsx";
import { border } from "../styles/garden.js";

/* ------------------------------------------------------------
   Music Room —— 花园里的小音乐室
   不是播放器 UI，而是一个可以一起听的小房间。
   ------------------------------------------------------------ */

const PLAYLIST = [
  { id: "p1", title: "Garden Afternoon", artist: "ambient", len: "4:12" },
  { id: "p2", title: "Dust Motes in the Light", artist: "piano", len: "3:48" },
  { id: "p3", title: "Wind Through the Ivy", artist: "field", len: "5:06" },
  { id: "p4", title: "Letter Before Sleep", artist: "soft", len: "3:22" },
];

const SHARED = [
  { id: "s1", title: "The Linden Tree", note: "他放给你听的，说这首歌像午后的花园。", who: "Angel" },
  { id: "s2", title: "Green Wheat", note: "你收藏的第一首共享歌。", who: "You" },
];

const VOICES = [
  { id: "v1", name: "Low voice + rain", desc: "雨声里有一句轻声的晚安" },
  { id: "v2", name: "Fireplace pages", desc: "翻动书页和壁炉的噼啪" },
  { id: "v3", name: "Wind in leaves", desc: "叶子之间，他的呼吸很远" },
  { id: "v4", name: "Silence", desc: "只是两个人都在" },
];

/* 留声机 SVG */
function Phonograph({ playing }) {
  const rotate = useRef(0);
  const [, tick] = useState(0);

  useEffect(() => {
    if (!playing) return;
    let raf;
    const loop = () => {
      rotate.current += 0.4;
      tick((n) => n + 1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  return (
    <svg viewBox="0 0 240 180" style={{ width: "100%", height: "auto", display: "block" }}>
      {/* 窗户光 */}
      <rect x="0" y="0" width="240" height="180" fill="url(#windowLight)" opacity="0.35" />
      <defs>
        <linearGradient id="windowLight" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFDF2" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#FFFDF2" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#FFFDF2" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="horn" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E9DFC9" />
          <stop offset="100%" stopColor="#CFC3A6" />
        </linearGradient>
      </defs>

      {/* 窗台 */}
      <rect x="10" y="148" width="220" height="10" rx="2" fill="#E2D8C0" stroke="#D5C9AE" strokeWidth="1" />
      <rect x="12" y="150" width="216" height="6" rx="1" fill="#EDE3CE" />

      {/* 唱机箱体 */}
      <rect x="58" y="116" width="90" height="34" rx="5" fill="#F3ECDC" stroke="#D5C9AE" strokeWidth="1" />

      {/* 唱盘 */}
      <g transform={`translate(103, 133)`}>
        <circle cx="0" cy="0" r="26" fill="#2C2621" />
        <circle cx="0" cy="0" r="22" fill="#3D332A" />
        <g transform={`rotate(${rotate.current})`}>
          <circle cx="0" cy="0" r="7" fill="#A85751" opacity="0.8" />
          <circle cx="0" cy="0" r="2.5" fill="#F5EFE2" />
          {[0, 72, 144, 216, 288].map((deg) => (
            <line key={deg} x1="0" y1="-20" x2="0" y2="-14" stroke="#5A5348" strokeWidth="0.8" transform={`rotate(${deg})`} />
          ))}
        </g>
      </g>

      {/* 唱臂 */}
      <g transform="translate(160, 118) rotate(18)">
        <rect x="-3" y="0" width="6" height="34" rx="3" fill="#CFC3A6" />
        <circle cx="0" cy="2" r="3" fill="#B8A98A" />
        <rect x="-2" y="30" width="4" height="8" rx="1" fill="#8A7E6E" />
      </g>

      {/* 喇叭花号角 */}
      <path d="M148 122 C 180 118, 210 100, 222 74 C 228 86, 226 108, 210 126 C 196 140, 172 144, 148 138 Z"
        fill="url(#horn)" stroke="#B8A98A" strokeWidth="0.8" opacity="0.9" />
      <ellipse cx="222" cy="74" rx="10" ry="22" transform="rotate(-20 222 74)" fill="#F3ECDC" stroke="#B8A98A" strokeWidth="0.8" />

      {/* 几本书 */}
      <rect x="24" y="128" width="8" height="22" rx="1" fill="#A3B1B8" opacity="0.7" />
      <rect x="33" y="124" width="10" height="26" rx="1" fill="#B5A7B8" opacity="0.7" />
      <rect x="44" y="130" width="7" height="20" rx="1" fill="#9AA88C" opacity="0.7" />

      {/* 小花 */}
      <g transform="translate(196, 140)" opacity="0.8">
        <path d="M0 0 V 12" stroke="#8E9C7A" strokeWidth="0.8" />
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse key={deg} cx="0" cy="-4" rx="2" ry="3.5" fill="#C48A82" transform={`rotate(${deg})`} />
        ))}
        <circle cx="0" cy="-4" r="1.2" fill="#D9C48F" />
      </g>
    </svg>
  );
}

function SectionTitle({ children }) {
  return (
    <div className="f-display" style={{
      fontSize: 9.5, letterSpacing: "0.22em", color: "var(--sage-deep)", textTransform: "uppercase",
      margin: "26px 0 12px", display: "flex", alignItems: "center", gap: 10,
    }}>
      {children}
      <span style={{ flex: 1, height: 1, background: "var(--paper-edge)", opacity: 0.6 }} />
    </div>
  );
}

const SEASON_CAPTION = {
  spring: "Spring · the air smells of rain and grass",
  summer: "Summer · a long warm afternoon",
  autumn: "Autumn · the light is thinner now",
  winter: "Winter · warmth waits inside",
};

export default function MusicRoomScreen({ onBack }) {
  const { decor, effectiveSeason } = useGarden();
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(PLAYLIST[0]);
  const [voice, setVoice] = useState(() => ({ spring: "v3", summer: "v1", autumn: "v4", winter: "v2" }[effectiveSeason] || "v1"));

  return (
    <PageShell
      decor={decor}
      padding="22px 20px 26px"
      header={
        <header style={{
          position: "relative", zIndex: 6, height: 66, flexShrink: 0,
          background: "var(--warm-white)", ...border.bottom,
          boxShadow: "0 2px 10px rgba(90,78,60,0.06)",
          display: "flex", alignItems: "center", padding: "0 14px", gap: 12,
        }}>
        <BackButton onClick={onBack} />

        <div>
          <div className="f-display" style={{ fontSize: 16, fontWeight: 500, letterSpacing: "0.03em", color: "var(--ink)" }}>
            Music Room
          </div>
          <div className="f-hand-en" style={{ fontSize: 15, color: "var(--ink-soft)", marginTop: 1 }}>
            a little room in the garden
          </div>
        </div>
      </header>
      }
    >
      {/* 留声机 */}
        <section style={{
          position: "relative",
          background: "linear-gradient(160deg, var(--warm-white), #F3ECDC)",
          ...border.hairline, borderRadius: 18,
          padding: "16px 16px 18px", boxShadow: "0 6px 20px rgba(90,78,60,0.10)",
        }}>
          <Phonograph playing={playing} />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
            <div>
              <div className="f-display" style={{ fontSize: 15, color: "var(--ink)" }}>{current.title}</div>
              <div className="f-italic-en" style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 3 }}>{current.artist} · {current.len}</div>
            </div>
            <button
              onClick={() => setPlaying((p) => !p)}
              className="pressable"
              style={{
                width: 44, height: 44, borderRadius: "50%",
                ...border.hairline, background: "var(--ivory)",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                boxShadow: "0 3px 10px rgba(90,78,60,0.10)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
              >
                {playing ? (
                  <><rect x="6" y="5" width="5" height="14" rx="1" /><rect x="13" y="5" width="5" height="14" rx="1" /></>
                ) : (
                  <path d="M5 4l16 8-16 8Z" />
                )}
              </svg>
            </button>
          </div>

          <div className="f-hand-en" style={{
            textAlign: "center", fontSize: 16, color: "var(--ink-soft)", opacity: 0.75, marginTop: 10,
          }}>
            {SEASON_CAPTION[effectiveSeason] || SEASON_CAPTION.summer}
          </div>
        </section>

        {/* Playlist */}
        <SectionTitle>Playlist</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {PLAYLIST.map((t) => (
            <button
              key={t.id}
              onClick={() => { setCurrent(t); setPlaying(true); }}
              className="pressable"
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "11px 14px", borderRadius: 12,
                ...border.hairline, background: current.id === t.id ? "var(--warm-white)" : "rgba(250,244,232,0.5)",
                textAlign: "left", cursor: "pointer",
              }}
            >
              <span style={{
                width: 24, height: 24, borderRadius: "50%",
                ...border.hairline,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {current.id === t.id && playing ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--accent-deep)">
                    <rect x="5" y="5" width="5" height="14" rx="1" /><rect x="14" y="5" width="5" height="14" rx="1" />
                  </svg>
                ) : (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--ink-soft)">
                    <path d="M6 4l14 8-14 8Z" />
                  </svg>
                )}
              </span>
              <span style={{ flex: 1 }}>
                <div className="f-display" style={{ fontSize: 13.5, color: "var(--ink)" }}>{t.title}</div>
                <div style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 2 }}>{t.artist} · {t.len}</div>
              </span>
            </button>
          ))}
        </div>

        {/* Shared songs */}
        <SectionTitle>Shared songs</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {SHARED.map((s) => (
            <div key={s.id} style={{
              background: "linear-gradient(160deg, var(--warm-white), #F3ECDC)",
              ...border.hairline, borderRadius: 12,
              padding: "14px 16px", position: "relative",
            }}>
              <div className="f-display" style={{ fontSize: 13, color: "var(--ink)" }}>{s.title}</div>
              <div className="f-hand-cn" style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 6, lineHeight: 1.6 }}>{s.note}</div>
              <div style={{
                position: "absolute", top: 12, right: 14,
                fontSize: 9.5, letterSpacing: "0.12em", color: "var(--sage-deep)",
              }}>
                {s.who.toUpperCase()}
              </div>
            </div>
          ))}
        </div>

        {/* Voice atmosphere */}
        <SectionTitle>Voice atmosphere</SectionTitle>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
          {VOICES.map((v) => (
            <button
              key={v.id}
              onClick={() => setVoice(v.id)}
              className="pressable"
              style={{
                flex: "1 1 calc(50% - 9px)", minWidth: 130,
                padding: "12px 14px", borderRadius: 12,
                ...border.hairline,
                background: voice === v.id ? "var(--warm-white)" : "transparent",
                textAlign: "left", cursor: "pointer",
              }}
            >
              <div className="f-display" style={{ fontSize: 12.5, color: "var(--ink)" }}>{v.name}</div>
              <div className="f-hand-cn" style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 4 }}>{v.desc}</div>
            </button>
          ))}
        </div>

        <p className="f-italic-en" style={{
          textAlign: "center", fontSize: 12, color: "var(--ink-soft)",
          opacity: 0.5, marginTop: 34,
        }}>
          some songs are best heard together
        </p>
    </PageShell>
  );
}
