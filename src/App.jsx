/* ============================================================
   Angel's Diary — Garden Edition
   「欧洲花园里的日记」
   ============================================================ */

import React, { useEffect, useState } from "react";
import ChatScreen from "./chat/ChatScreen.jsx";
import MemoryScreen from "./memory/MemoryScreen.jsx";
import MeScreen from "./me/MeScreen.jsx";
import MomentsScreen from "./moments/MomentsScreen.jsx";
import MusicRoomScreen from "./music/MusicRoomScreen.jsx";
import GardenAtmosphere from "./components/GardenAtmosphere.jsx";
import WaxSeal from "./components/WaxSeal.jsx";
import Petals from "./components/Petals.jsx";
import { GardenProvider, useGarden } from "./state/GardenSettings.jsx";
import {
  getGreeting, getDateLine, getWeather, getTimeGreeting,
  getDailyLetter, getSeasonalMood, getMusicRoomInfo, getKeepsakeLabel,
  hisDailyTraces, HOME_TEXT,
} from "./data/mockHomeData.js";
import { dayKeyOf } from "./chat/chat-utils.js";


/* ------------------------------------------------------------
   Home 子组件
   所有文案/数据来自 mockHomeData，组件只负责展示
   ------------------------------------------------------------ */

function TodayNote() {
  /* 一张轻轻放在 Home 上的纸笺——不是卡片。
     边界由留白、签名角度和火漆位置定义，不用圆角矩形框。 */
  const { effectiveSeason: season } = useGarden();
  const { en: enLine, cn: cnLine } = getDailyLetter(season);

  return (
    <section className="reveal" style={{
      position: "relative", padding: "16px 8px 26px", marginTop: 8,
    }}>
      {/* 纸笺上缘：极淡的毛边暗示，不构成封闭边框 */}
      <div style={{ width: "100%", height: 1, background: "var(--paper-edge)", marginBottom: 22, opacity: 0.45 }} />
      <p className="f-display" style={{ fontSize: 16.5, lineHeight: 1.7, color: "var(--ink)", maxWidth: "80%" }}>
        {enLine}
      </p>
      <p className="f-hand-cn" style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 14, lineHeight: 1.7 }}>
        {cnLine}
      </p>
      <p className="f-hand-en" style={{
        fontSize: 22, color: "var(--ink-soft)", marginTop: 18,
        textAlign: "right", paddingRight: 6,
      }}>
        Angel
      </p>
      <WaxSeal size={36} style={{
        position: "absolute", left: 0, bottom: 20,
        transform: "rotate(-8deg)",
        filter: "drop-shadow(0 3px 6px rgba(142,68,64,0.28))",
      }} />
    </section>
  );
}

/* 院子里的今天：他的痕迹 + 你写下的东西，不是卡片 */
function GardenTraceMark() {
  /* 花园痕迹：一片小叶。
     以后根据当天是否有新的痕迹决定是否出现——没有就不渲染。
     目前用极简 SVG 占位，后续换成 PNG 植物素材。 */
  return (
    <svg width="15" height="20" viewBox="0 0 15 20" fill="none" style={{ display: "block", marginBottom: 8 }}>
      <path d="M7.5 19 C7.5 13 7.5 8 7.5 2.5" stroke="var(--sage)" strokeWidth="1" strokeLinecap="round" opacity="0.65" />
      <path d="M7.5 5.5 C4.5 4.5 1.8 2.8 1.2 5 C1.8 7.2 4.5 8.2 7.5 5.5 Z" fill="var(--sage)" opacity="0.5" />
      <path d="M7.5 7 C10.5 6 13.2 4.3 13.8 6.5 C13.2 8.7 10.5 9.7 7.5 7 Z" fill="var(--sage)" opacity="0.4" />
    </svg>
  );
}

function GardenTraces() {
  const { effectiveSeason, dayEntries } = useGarden();
  const now = new Date();
  const traces = hisDailyTraces(effectiveSeason, now);
  const entry = dayEntries[dayKeyOf(now)];
  const yourCount = (entry?.notes?.length || 0) + (entry?.photos?.length || 0);

  return (
    <section className="reveal" style={{ marginTop: 24, padding: "0 6px" }}>
      <GardenTraceMark />
      <div className="f-display" style={{
        fontSize: 10, letterSpacing: "0.2em", color: "var(--sage-deep)",
        marginBottom: 10,
      }}>
        {HOME_TEXT.gardenTodayLabel}
      </div>
      <div>
        {traces.map((t, i) => (
          <div key={i} style={{
            display: "flex", gap: 14, alignItems: "baseline",
            padding: "6px 0",
            borderBottom: i < traces.length - 1 || yourCount > 0 ? "1px solid var(--paper-edge)" : "none",
          }}>
            <span className="f-hand-cn" style={{
              fontSize: 12.5, color: "var(--ink-soft)", opacity: 0.6,
              flexShrink: 0, minWidth: 36,
            }}>
              {t.time}
            </span>
            <span className="f-hand-cn" style={{ fontSize: 14.5, color: "var(--ink)", lineHeight: 1.65 }}>
              {t.text}
            </span>
          </div>
        ))}
        {yourCount > 0 && (
          <div style={{
            display: "flex", gap: 14, alignItems: "baseline",
            padding: "6px 0",
          }}>
            <span className="f-hand-cn" style={{
              fontSize: 12.5, color: "var(--ink-soft)", opacity: 0.6,
              flexShrink: 0, minWidth: 36,
            }}>
              今天
            </span>
            <span className="f-hand-cn" style={{ fontSize: 14.5, color: "var(--ink)", lineHeight: 1.65 }}>
              在回忆夹页放了 {yourCount} 件东西。
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

function WeatherMoodRow() {
  /* 环境状态：不是卡片，两列轻文本并排。天气和心情数据来自 mockHomeData。 */
  const w = getWeather();
  const { effectiveSeason: season, dayEntries } = useGarden();
  const todayMood = dayEntries[dayKeyOf(new Date())]?.mood;
  const seasonal = getSeasonalMood(season);
  const mood = todayMood || seasonal.word;
  const moodLine = seasonal.line;

  return (
    <section className="reveal" style={{
      display: "flex", gap: 24, padding: "10px 6px 6px",
      marginTop: 2,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span className="f-display" style={{ fontSize: 9.5, letterSpacing: "0.16em", color: "var(--ink-soft)", opacity: 0.75 }}>weather</span>
          <span className="f-display" style={{ fontSize: 14, color: "var(--ink)" }}>{w.temp}</span>
        </div>
        <div className="f-hand-cn" style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 4, lineHeight: 1.6 }}>
          {w.line} · {getTimeGreeting()}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span className="f-display" style={{ fontSize: 9.5, letterSpacing: "0.16em", color: "var(--ink-soft)", opacity: 0.75 }}>mood</span>
          <span className="f-display" style={{ fontSize: 14, color: "var(--sage-deep)" }}>{mood}</span>
        </div>
        <div className="f-hand-cn" style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 4, lineHeight: 1.6 }}>
          {moodLine}
        </div>
      </div>
    </section>
  );
}

function MusicRoomEntry({ onNavigate }) {
  /* 降级为轻入口：一行文字，不抢 Today 和 Traces 的视觉权重 */
  const { title, subtitle } = getMusicRoomInfo();
  return (
    <section
      className="pressable reveal"
      role="button"
      tabIndex={0}
      onClick={() => onNavigate && onNavigate("musicroom")}
      style={{
        marginTop: 22, padding: "10px 6px",
        display: "flex", alignItems: "center", gap: 10,
      }}
    >
      <span style={{ fontSize: 14, opacity: 0.55, lineHeight: 1 }}>♫</span>
      <span className="f-display" style={{ fontSize: 13, letterSpacing: "0.04em", color: "var(--ink)" }}>
        {title}
      </span>
      <span className="f-hand-cn" style={{ fontSize: 12, color: "var(--ink-soft)", flex: 1 }}>
        {subtitle}
      </span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-soft)" strokeWidth="1.5" strokeLinecap="round" style={{ opacity: 0.35 }}>
        <path d="M9 5l7 7-7 7" />
      </svg>
    </section>
  );
}

function KeepsakeTail() {
  /* 底部偶然露出的一张纸——不是卡片，是一句被收好的话。
     什么都没有就不出现。 */
  const { keepsakes, collections } = useGarden();
  const latestColl = collections[0];
  const latestKep = keepsakes[keepsakes.length - 1];
  if (!latestColl && !latestKep) return null;

  const text = latestColl
    ? (() => {
        const first = latestColl.lines[0];
        return (typeof first === "object" ? first.text : first) || "";
      })()
    : latestKep.text;
  const count = keepsakes.length + collections.length;

  return (
    <section className="reveal" style={{
      marginTop: 24, padding: "0 6px",
      textAlign: "center",
    }}>
      <div style={{ width: 36, height: 1, background: "var(--paper-edge)", margin: "0 auto 12px", opacity: 0.6 }} />
      <p className="f-hand-cn" style={{ fontSize: 14.5, lineHeight: 1.8, color: "var(--ink-soft)" }}>
        「{text}」
      </p>
      <p className="f-display" style={{ fontSize: 9, letterSpacing: "0.16em", color: "var(--ink-soft)", marginTop: 8, opacity: 0.65 }}>
        {getKeepsakeLabel(count)}
      </p>
    </section>
  );
}

function TabBar({ current = "home", onNavigate }) {
  const tabs = [
    {
      name: "Home", active: true,
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 11 L12 4 L20 11 M6 10 V20 h12 V10" /></svg>,
    },
    {
      name: "Chat",
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 19 C3 14 5 9 9 6 C13 3 17 3 20 4 C20 8 18 13 14 16 C11 18 7 19.5 4 19 Z" /><path d="M4 19 C8 15 11 12 16 8" /></svg>,
    },
    {
      name: "Moments",
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 21 C12 15 12 10 12 5" /><path d="M12 9 C9 8 7 6 7 3 C10 3 12 5 12 9 Z" /><path d="M12 12 C15 11 17 9 17 6 C14 6 12 8 12 12 Z" /><circle cx="12" cy="3.6" r="1.3" /></svg>,
    },
    {
      name: "Memory",
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M5 4 h11 a3 3 0 0 1 3 3 v13 h-11 a3 3 0 0 1 -3 -3 Z" /><path d="M5 4 v13 M9 9 h6 M9 13 h4" /></svg>,
    },
    {
      name: "Me",
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="8" r="3.6" /><path d="M5 20 C6 15.5 8.7 13.5 12 13.5 C15.3 13.5 18 15.5 19 20" /></svg>,
    },
  ];
  return (
    <nav style={{
      position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 10,
      height: 72, padding: "8px 14px 14px",
      display: "grid", gridTemplateColumns: "repeat(5, 1fr)",
      background: "linear-gradient(to top, var(--ivory) 72%, rgba(247,242,233,0))",
    }}>
      {tabs.map((t) => (
        <div key={t.name} className="pressable" role="button" tabIndex={0} onClick={() => onNavigate && onNavigate(t.name.toLowerCase())}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 4, minHeight: 44, color: t.name.toLowerCase() === current ? "var(--accent-deep)" : "var(--ink-soft)",
          }}>
          {t.icon}
          <span className="f-display" style={{ fontSize: 9.5, letterSpacing: "0.08em" }}>{t.name}</span>
          <i style={{ width: 3.5, height: 3.5, borderRadius: "50%", background: t.name.toLowerCase() === current ? "var(--accent-deep)" : "transparent" }} />
        </div>
      ))}
    </nav>
  );
}

/* ------------------------------------------------------------
   Home —— 日记主页
   ------------------------------------------------------------ */
function Home({ visible, onNavigate }) {
  const { decor } = useGarden();
  useEffect(() => {
    if (!visible) return;
    const els = Array.from(document.querySelectorAll("#home .reveal"));
    els.forEach((el) => el.classList.remove("in"));
    const timers = els.map((el, i) =>
      setTimeout(() => el.classList.add("in"), 120 + i * 50)
    );
    return () => timers.forEach(clearTimeout);
  }, [visible]);

  return (
    <main id="home" style={{
      position: "absolute", inset: 0, zIndex: 5,
      display: "flex", flexDirection: "column",
    }}>
      {decor && <GardenAtmosphere />}

      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: "26px 20px 108px", position: "relative", zIndex: 4 }}>
      <header className="reveal" style={{ textAlign: "center", marginBottom: 16, position: "relative", zIndex: 4 }}>
        <div className="f-display" style={{
          fontSize: 9, letterSpacing: "0.2em", color: "var(--ink-soft)", opacity: 0.7,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        }}>
          <span style={{ width: 28, height: 1, background: "var(--paper-edge)" }} />
          {getDateLine()}
          <span style={{ width: 28, height: 1, background: "var(--paper-edge)" }} />
        </div>
        <h2 className="f-display" style={{ fontSize: 28, fontWeight: 500, letterSpacing: "0.02em", marginTop: 14, color: "var(--ink)" }}>
          {getGreeting().en}
          <span className="f-hand-cn" style={{ display: "block", fontSize: 16, fontWeight: 400, color: "var(--ink-soft)", marginTop: 6, letterSpacing: "0.04em" }}>
            {getGreeting().cn}
          </span>
        </h2>
      </header>

      <div style={{ position: "relative", zIndex: 4 }}>
        <TodayNote />
        <WeatherMoodRow />
        <GardenTraces />
        <MusicRoomEntry onNavigate={onNavigate} />
        <KeepsakeTail />
      </div>

      <footer className="reveal" style={{
        marginTop: 30, textAlign: "center", position: "relative", zIndex: 4,
        fontFamily: "var(--serif-en)", fontSize: 10, letterSpacing: "0.2em",
        color: "var(--ink-soft)", opacity: 0.85,
      }}>
        {HOME_TEXT.keptSoftly}
        <svg width="26" height="14" viewBox="0 0 26 14" fill="none" stroke="#8A7E6E" strokeWidth="1.1" strokeLinecap="round" style={{ display: "block", margin: "10px auto 0", opacity: 0.6 }}>
          <path d="M2 8 C6 3 10 2 13 6 C16 2 20 3 24 8" />
        </svg>
      </footer>

      </div>
    </main>
  );
}

/* ------------------------------------------------------------
   AppShell —— 在 GardenProvider 内，负责整座花园的壳
   ------------------------------------------------------------ */
function AppShell() {
  const { theme, type, effectiveSeason, decor } = useGarden();
  const [page, setPage] = useState("home");

  useEffect(() => {
    const fb = document.getElementById("boot-fallback");
    if (fb) fb.remove();
  }, []);

  const showTab = page !== "chat" && page !== "musicroom";

  return (
    <div className={`phone theme-${theme} type-${type} season-${effectiveSeason}`}>
      {page === "home" && (
        <Home visible onNavigate={setPage} />
      )}
      {page === "chat" && (
        <ChatScreen onBack={() => setPage("home")} />
      )}
      {page === "moments" && (
        <MomentsScreen onNavigate={setPage} />
      )}
      {page === "memory" && (
        <MemoryScreen onNavigate={setPage} />
      )}
      {page === "me" && (
        <MeScreen onNavigate={setPage} />
      )}
      {page === "musicroom" && (
        <MusicRoomScreen onBack={() => setPage("home")} />
      )}
      {showTab && <TabBar current={page} onNavigate={setPage} />}
      {decor && <Petals count={4} />}
      <div className="paper-grain" />
    </div>
  );
}

/* ------------------------------------------------------------
   App
   ------------------------------------------------------------ */
export default function App() {
  return (
    <GardenProvider>
      <AppShell />
    </GardenProvider>
  );
}
