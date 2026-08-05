import React, { useState, useRef } from "react";
import PageShell from "../components/PageShell.jsx";
import { useGarden } from "../state/GardenSettings.jsx";
import { border } from "../styles/garden.js";
import { dayKeyOf, partOfDay } from "../chat/chat-utils.js";
import { US_MEMORIES } from "../memory/memory-config.js";
import { MOOD_TAGS, getDaySummary, getMonthSummary, MOMENTS_LABELS } from "../data/mockMomentsData.js";
import { MONTHS } from "../data/mockSharedData.js";
import {
  CornerSprayTL,
  CornerSprayBR,
  CartoucheTitle,
  Butterfly,
  TodayWreath,
} from "./MomentsDecor.jsx";

import Sheet, { SheetInput, SheetButton } from "../components/Sheet.jsx";

/* ============================================================
   Moments —— 花园日记的日历页
   整页只显示真实数据：dayEntries（纸条 / 照片 / 心情）。
   没有演示内容；空的日子就是空的。
   ============================================================ */

/* ============================================================
   痕迹系统 —— 日历格子里的"生活留下的痕迹"
   getDayTrace: 按 mood / 纸条 / 照片 / 他的痕迹 → { primary, secondary }
   CalendarTrace: 极简 SVG 占位，等 PNG 素材到位后替换 src
   ============================================================ */

function getDayTrace(entry) {
  /* 规则：
     - 有 mood → mood 是 primary，life event 降为 secondary
     - 无 mood 但有内容 → life trace 升为 primary
     - 他的痕迹（angel / shared note）→ 附在 secondary 里
     - 什么都没 → { primary: null, secondary: null }
     - 一天最多 1 primary + 1 secondary */
  if (!entry) return { primary: null, secondary: null };

  const hasMood = !!entry.mood;
  const hasPhoto = entry.photos?.length > 0;
  const hasNote = entry.notes?.length > 0;
  const hasLife = hasPhoto || hasNote;
  const hasHis = entry.notes?.some((n) => n.who === "angel" || n.who === "shared");

  if (!hasMood && !hasLife) return { primary: null, secondary: null };

  if (hasMood) {
    return {
      primary: { type: "mood", mood: entry.mood },
      secondary: hasLife ? { type: "life", hasPhoto, hasNote, hasHis } : null,
    };
  }

  return {
    primary: { type: "life", hasPhoto, hasNote, hasHis },
    secondary: null,
  };
}

function CalendarTrace({ type, mood, hasPhoto, hasNote, hasHis, size = 13, opacity = 0.65 }) {
  /* 极简 SVG 占位——仅区分类型，不追求最终视觉。
     PNG 素材到位后换成 <img> 即可，不改信息架构。 */

  /* ---- mood traces：植物 / 花 / 蝴蝶 ---- */
  if (type === "mood") {
    const shape = {
      Quiet: "leaf", Peaceful: "leaf",
      Warm: "petal",
      Hopeful: "sprout", Growing: "sprout",
      "Missing You": "butterfly",
    }[mood] || "leaf";

    if (shape === "leaf") {
      return (
        <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
          <path d="M7 13 C7 9 7 6 7 2" stroke="var(--sage)" strokeWidth="0.9" strokeLinecap="round" opacity={opacity} />
          <path d="M7 4 C5 3 3.5 2 3 3.5 C3.5 5 5 5.5 7 4 Z" fill="var(--sage)" opacity={opacity * 0.65} />
          <path d="M7 5 C9 4 10.5 3 11 4.5 C10.5 6 9 6.5 7 5 Z" fill="var(--sage)" opacity={opacity * 0.5} />
        </svg>
      );
    }
    if (shape === "petal") {
      return (
        <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
          <ellipse cx="7" cy="5.5" rx="3.2" ry="5" fill="var(--rose)" opacity={opacity * 0.55} transform="rotate(-10 7 5.5)" />
          <ellipse cx="6.5" cy="6.5" rx="2.6" ry="4.2" fill="#C9A0A4" opacity={opacity * 0.4} transform="rotate(18 6.5 6.5)" />
          <circle cx="7" cy="5.5" r="1.2" fill="var(--gold)" opacity={opacity * 0.45} />
        </svg>
      );
    }
    if (shape === "sprout") {
      return (
        <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
          <path d="M7 12 C7 9 7 7 7 3" stroke="var(--leaf)" strokeWidth="0.9" strokeLinecap="round" opacity={opacity} />
          <ellipse cx="5" cy="5.5" rx="2.2" ry="3.2" fill="var(--leaf)" opacity={opacity * 0.5} transform="rotate(-25 5 5.5)" />
          <ellipse cx="9" cy="6.5" rx="1.8" ry="2.6" fill="var(--leaf)" opacity={opacity * 0.4} transform="rotate(20 9 6.5)" />
        </svg>
      );
    }
    if (shape === "butterfly") {
      return (
        <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
          <path d="M7 4 C5 1.5 2 2 2.5 5.5 C3 7.5 6 8 7 6 C8 8 11 7.5 11.5 5.5 C12 2 9 1.5 7 4 Z"
            fill="var(--faded-blue)" opacity={opacity * 0.4} stroke="var(--faded-blue)" strokeWidth="0.7" />
          <path d="M7 4 L7 11" stroke="var(--faded-blue)" strokeWidth="0.6" strokeLinecap="round" opacity={opacity * 0.5} />
        </svg>
      );
    }
    return null;
  }

  /* ---- life traces：纸角 / 胶片 / 铅笔 ---- */
  if (type === "life") {
    if (hasHis) {
      /* 他的痕迹：极小的点，和 GardenTraceMark 呼应 */
      return (
        <svg width={size} height={size} viewBox="0 0 10 10" fill="none">
          <circle cx="5" cy="5" r="1.8" fill="var(--sage)" opacity={opacity * 0.55} />
        </svg>
      );
    }
    if (hasPhoto) {
      /* 胶片角 */
      return (
        <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
          <rect x="2" y="2" width="8" height="8" rx="0.5" stroke="var(--ink-soft)" strokeWidth="0.8" opacity={opacity * 0.5} />
          <path d="M2 5 L5 5 L5 2" fill="var(--ink-soft)" opacity={opacity * 0.3} />
        </svg>
      );
    }
    if (hasNote) {
      /* 纸角折痕 */
      return (
        <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
          <path d="M2 7 L2 10 L5 10" fill="none" stroke="var(--ink-soft)" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" opacity={opacity * 0.5} />
          <path d="M5 7 L5 10 L2 10" fill="var(--ink-soft)" opacity={opacity * 0.18} />
        </svg>
      );
    }
    return null;
  }

  return null;
}

/* 顶部小标题组件 */
function SectionLabel({ children, color = "var(--ink-soft)" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <span className="f-display" style={{
        fontSize: 10, letterSpacing: "0.26em", color,
      }}>
        {children}
      </span>
      <span style={{ flex: 1, height: 1, background: "var(--paper-edge)", opacity: 0.55 }} />
    </div>
  );
}

/* 紧凑日历：可翻月、网格对齐；标记来自 dayEntries */
function CompactCalendar({ selected, onSelect, viewDate, onViewChange }) {
  const { dayEntries } = useGarden();
  const [expanded, setExpanded] = useState(false);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const monthCells = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function isSameDay(a, b) {
    return (
      a && b &&
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  function goMonth(delta) {
    onViewChange(new Date(year, month + delta, 1));
  }

  function selectDay(dayNum) {
    if (!dayNum) return;
    onSelect(new Date(year, month, dayNum));
  }

  /* 某天的痕迹：调用 getDayTrace，返回 { primary, secondary } 或 null */
  function traceOf(date) {
    if (!date) return null;
    return getDayTrace(dayEntries[dayKeyOf(date)]);
  }

  /* 周视图：显示包含 selectedDay 的那一周（若 selectedDay 不在 viewMonth，fallback 到今天） */
  const activeDate = selected && selected.getMonth() === month && selected.getFullYear() === year
    ? selected
    : today;
  const weekStart = new Date(activeDate);
  weekStart.setDate(activeDate.getDate() - ((activeDate.getDay() + 6) % 7));
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const ArrowBtn = ({ dir, onClick }) => (
    <button
      onClick={onClick}
      className="pressable"
      aria-label={dir === "left" ? "上月" : "下月"}
      style={{
        width: 28, height: 28, borderRadius: "50%", border: "none", background: "transparent",
        display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
        color: "var(--ink-soft)",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d={dir === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
      </svg>
    </button>
  );

  const DayCell = (date, key) => {
    const d = date ? date.getDate() : null;
    const isToday = date && isSameDay(date, today);
    const isSel = date && isSameDay(date, selected);
    const trace = date ? traceOf(date) : null;
    const primary = trace?.primary || null;
    const secondary = trace?.secondary || null;

    return (
      <div
        key={key}
        onClick={() => selectDay(d)}
        className="pressable"
        style={{
          position: "relative", height: 54, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "flex-start", cursor: d ? "pointer" : "default",
        }}
      >
        {/* 日期数字区：统一 32×32 容器，所有数字居中方式一致 */}
        <div style={{
          height: 34, width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ position: "relative", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {isToday && <TodayWreath />}
            {isSel && !isToday && (
              <div style={{
                position: "absolute", width: 28, height: 28, borderRadius: "50%",
                border: "1px solid var(--rose)",
                background: "rgba(196,138,130,0.08)",
              }} />
            )}
            <span className="f-display" style={{
              position: "relative", zIndex: 1,
              fontSize: 13, lineHeight: 1,
              color: d ? "var(--ink)" : "transparent",
              opacity: date && date.getMonth() !== month ? 0.35 : 1,
            }}>
              {d || ""}
            </span>
          </div>
        </div>
        {/* 痕迹区：高度固定，flex 居中，无痕迹时自然留空 */}
        <div style={{ height: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
          {primary && (
            <CalendarTrace
              type={primary.type}
              mood={primary.mood}
              hasPhoto={primary.hasPhoto}
              hasNote={primary.hasNote}
              hasHis={primary.hasHis}
              size={14}
              opacity={0.62}
            />
          )}
          {secondary && (
            <CalendarTrace
              type={secondary.type}
              hasPhoto={secondary.hasPhoto}
              hasNote={secondary.hasNote}
              hasHis={secondary.hasHis}
              size={10}
              opacity={0.38}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <section style={{ marginBottom: 22 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <ArrowBtn dir="left" onClick={() => goMonth(-1)} />
          <span className="f-display" style={{ fontSize: 15, fontWeight: 500, letterSpacing: "0.04em" }}>
            {MONTHS[month]} {year}
          </span>
          <ArrowBtn dir="right" onClick={() => goMonth(1)} />
        </div>
        <button onClick={() => setExpanded(!expanded)} className="pressable" style={{
          ...border.hairline, background: "var(--warm-white)",
          borderRadius: 999, padding: "5px 12px", cursor: "pointer",
          fontFamily: "var(--serif-en)", fontSize: 9.5, letterSpacing: "0.14em", color: "var(--ink-soft)",
        }}>
          {expanded ? "WEEK" : "MONTH"}
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
        {["M", "T", "W", "T", "F", "S", "S"].map((w, i) => (
          <div key={i} className="f-display" style={{ textAlign: "center", fontSize: 9, letterSpacing: "0.12em", color: "var(--ink-soft)", opacity: 0.7 }}>{w}</div>
        ))}
      </div>
      {!expanded ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
          {weekDays.map((d, i) => DayCell(d, i))}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
          {monthCells.map((d, i) => DayCell(d ? new Date(year, month, d) : null, i))}
        </div>
      )}
    </section>
  );
}

/* 日期 + 心情行：日历正下方。mood 选择和日期信息在同一层，不沉到底部 */
function DateMoodLine({ day, entry, onMoodChange }) {
  const noteCount = entry.notes?.length || 0;
  const photoCount = entry.photos?.length || 0;
  const summary = getDaySummary(noteCount, photoCount);

  return (
    <div style={{
      padding: "6px 2px 16px",
      marginBottom: 6,
      ...border.bottom,
    }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <span className="f-display" style={{ fontSize: 16, fontWeight: 500, color: "var(--ink)" }}>
          {MONTHS[day.getMonth()]} {day.getDate()}
        </span>
        {entry.mood && (
          <span className="f-italic-en" style={{ fontSize: 14, color: "var(--sage-deep)" }}>
            · {entry.mood}
          </span>
        )}
      </div>

      {/* mood 选择：和日期行一体，轻文字按钮 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, alignItems: "center", marginTop: 7 }}>
        <span className="f-display" style={{ fontSize: 9.5, letterSpacing: "0.12em", color: "var(--ink-soft)", opacity: 0.5, marginRight: 2 }}>
          {MOMENTS_LABELS.mood}
        </span>
        {MOOD_TAGS.map((m) => (
          <button key={m.word} onClick={() => onMoodChange(m.word)} className="pressable" style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "1px 4px",
            fontFamily: "var(--serif-en)", fontSize: 11.5,
            color: entry.mood === m.word ? "var(--sage-deep)" : "var(--ink-soft)",
            opacity: entry.mood === m.word ? 1 : 0.5,
          }}>
            {m.word}
          </button>
        ))}
      </div>

      <p className="f-hand-cn" style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 8, lineHeight: 1.7 }}>
        {summary}
      </p>
    </div>
  );
}

import WildOatIcon from "../components/WildOatIcon.jsx";

/* 纸条：与共同空间同一语言——谁 · 时刻 + 一行手写字，细线分隔 */
function PaperNotes({ notes = [] }) {
  if (notes.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "6px 0 26px", color: "var(--ink-soft)" }}>
        <WildOatIcon height={56} />
        <p className="f-hand-cn" style={{ fontSize: 14, marginTop: 8 }}>这一页还很安静。</p>
      </div>
    );
  }

  const whoMeta = {
    user: { label: "你", color: "var(--sage-deep)" },
    angel: { label: "他", color: "var(--rose-deep)" },
    shared: { label: "我们", color: "var(--accent-deep)" },
  };

  return (
    <section style={{ marginBottom: 26 }}>
      <SectionLabel color="var(--ink-soft)">{MOMENTS_LABELS.paperNotes}</SectionLabel>
      <div>
        {notes.map((n, i) => {
          const meta = whoMeta[n.who] || whoMeta.user;
          const time = n.ts ? partOfDay(n.ts) : null;
          return (
            <div key={i} style={{
              padding: "10px 2px",
              borderBottom: i < notes.length - 1 ? "1px solid var(--paper-edge)" : "none",
            }}>
              <span className="f-display" style={{
                fontSize: 10, letterSpacing: "0.14em", color: meta.color,
              }}>
                {meta.label}{time ? ` · ${time}` : ""}
              </span>
              <p className="f-hand-cn" style={{
                fontSize: 15, color: "var(--ink)", lineHeight: 1.8,
                marginTop: 4, whiteSpace: "pre-line",
              }}>
                {n.text}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* 月尾：合并了 EarlierPages + MonthKept，去卡片，轻量展示 */
function MonthTail({ year, month, dayEntries, onOpenDay }) {
  const prefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  let noteCount = 0;
  let photoCount = 0;
  const photoUrls = [];
  const activeDays = [];

  Object.keys(dayEntries).forEach((k) => {
    if (!k.startsWith(prefix)) return;
    const e = dayEntries[k];
    const n = e.notes?.length || 0;
    const p = e.photos?.length || 0;
    noteCount += n;
    photoCount += p;
    (e.photos || []).forEach((u) => photoUrls.push(u));
    if (n + p > 0) activeDays.push({ key: k, entry: e });
  });

  activeDays.sort((a, b) => a.key.localeCompare(b.key)).reverse();
  const empty = noteCount + photoCount === 0;
  const monthSummary = getMonthSummary(noteCount, photoCount);

  return (
    <section style={{ marginTop: 28, padding: "0 2px" }}>
      {/* 标题 */}
      <div className="f-display" style={{
        fontSize: 10, letterSpacing: "0.2em", color: "var(--ink-soft)",
        marginBottom: 10,
      }}>
        {MOMENTS_LABELS.monthKept(MONTHS[month])}
      </div>

      {/* 照片缩略图：小、微斜、无卡片框 */}
      {!empty && photoUrls.length > 0 && (
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {photoUrls.slice(0, 3).map((u, i) => (
            <div key={i} style={{
              width: 52, height: 36, overflow: "hidden",
              ...border.hairline,
              borderRadius: 3,
              transform: `rotate(${(i - 1) * 1.5}deg)`,
            }}>
              <img src={u} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}
        </div>
      )}

      {/* 统计行 */}
      <p className="f-hand-cn" style={{
        fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.7,
        marginBottom: activeDays.length > 0 ? 14 : 0,
      }}>
        {monthSummary}
      </p>

      {/* 有内容的日子列表：可点击跳转 */}
      {activeDays.map(({ key: k, entry: e }) => {
        const d = new Date(`${k}T00:00:00`);
        const first = e.notes && e.notes[0];
        const extra = (e.notes?.length || 0) + (e.photos?.length || 0) - 1;
        return (
          <button
            key={k}
            onClick={() => onOpenDay(d)}
            className="pressable"
            style={{
              display: "block", width: "100%", textAlign: "left",
              background: "none", border: "none", cursor: "pointer",
              padding: "8px 0", ...border.bottom,
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span className="f-display" style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>
                {MONTHS[d.getMonth()]} {d.getDate()}
              </span>
              {e.mood && (
                <span className="f-italic-en" style={{ fontSize: 11.5, color: "var(--sage-deep)" }}>· {e.mood}</span>
              )}
              <span className="f-display" style={{ marginLeft: "auto", fontSize: 9.5, color: "var(--ink-soft)", opacity: 0.6, letterSpacing: "0.06em" }}>
                {e.notes?.length || 0}n{e.photos?.length ? ` · ${e.photos.length}p` : ""}
              </span>
            </div>
            {first && (
              <p className="f-hand-cn" style={{
                fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.6, marginTop: 3,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {first.text}{extra > 0 ? ` …还有 ${extra} 件` : ""}
              </p>
            )}
          </button>
        );
      })}
    </section>
  );
}

/* 悬浮新增按钮 */
function FloatingAdd({ onSelect }) {
  const [open, setOpen] = useState(false);
  const items = ["Photo", "Note", "Mood", "Voice", "Memory"];
  return (
    <div style={{ position: "absolute", right: 18, bottom: 100, zIndex: 9, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
      {open && items.map((it, i) => (
        <div
          key={it}
          onClick={() => { onSelect(it.toLowerCase()); setOpen(false); }}
          className="stream-in pressable"
          style={{
            animationDelay: `${i * 40}ms`,
            background: "var(--warm-white)", ...border.hairline,
            borderRadius: 10, padding: "8px 16px", cursor: "pointer",
            boxShadow: "0 4px 12px rgba(90,78,60,0.10)",
            fontFamily: "var(--serif-en)", fontSize: 11.5, letterSpacing: "0.04em", color: "var(--ink)",
            transform: `rotate(${i % 2 ? 1 : -1}deg)`,
          }}
        >{it}</div>
      ))}
      <button onClick={() => setOpen(!open)} aria-label="新增" className="pressable" style={{
        width: 46, height: 46, borderRadius: "50%", cursor: "pointer",
        background: "linear-gradient(160deg, var(--oatmeal), #DDE3D8)",
        ...border.hairline,
        boxShadow: "0 6px 16px rgba(90,78,60,0.16)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round">
          <path d={open ? "M6 6 L18 18 M18 6 L6 18" : "M12 5 v14 M5 12 h14"} />
        </svg>
      </button>
    </div>
  );
}

/* ------------------------------------------------------------
   Moments 页面
   ------------------------------------------------------------ */
export default function MomentsScreen({ onNavigate }) {
  const { decor, dayEntries, addDayNote, addDayPhoto, setDayMood } = useGarden();
  const [selectedDay, setSelectedDay] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  });
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [addSheet, setAddSheet] = useState(null);
  const [draft, setDraft] = useState("");
  const [recording, setRecording] = useState(false);
  const fileInput = useRef(null);

  const dateKey = dayKeyOf(selectedDay);
  const entry = dayEntries[dateKey] || {};
  const dayNotes = (entry.notes || []).map((n) => ({ who: n.who, text: n.text, ts: n.ts }));
  const dayPhotos = entry.photos || [];

  function selectDay(d) {
    setSelectedDay(d);
    /* 选中其它月份的日时，视图跟过去 */
    if (d.getMonth() !== viewDate.getMonth() || d.getFullYear() !== viewDate.getFullYear()) {
      setViewDate(new Date(d.getFullYear(), d.getMonth(), 1));
    }
  }

  function addNote() {
    const text = draft.trim();
    if (!text) return;
    addDayNote(dateKey, text, "user");
    setDraft("");
    setAddSheet(null);
  }

  function addPhoto(url) {
    addDayPhoto(dateKey, url);
    setAddSheet(null);
  }

  /* 读成 dataURL，刷新后照片还在（blob: URL 刷新即失效） */
  function handlePhotoFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => addPhoto(reader.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <>
      <PageShell padding="24px 20px 96px">
      {decor && <CornerSprayTL />}
      {decor && <CornerSprayBR />}

      <header style={{ position: "relative", marginBottom: 20 }}>
        <CartoucheTitle title="Moments" subtitle="a garden of days" />
        <Butterfly style={{ position: "absolute", right: 26, top: 6 }} />
      </header>

      <CompactCalendar
        selected={selectedDay}
        onSelect={selectDay}
        viewDate={viewDate}
        onViewChange={setViewDate}
      />
      <DateMoodLine day={selectedDay} entry={entry} onMoodChange={(w) => setDayMood(dateKey, w)} />
      <PaperNotes notes={dayNotes} />

      {dayPhotos.length > 0 && (
        <section style={{ marginBottom: 24 }}>
          <SectionLabel color="var(--ink-soft)">{MOMENTS_LABELS.photos}</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
            {dayPhotos.map((url, i) => (
              <div key={i} style={{
                width: "100%", aspectRatio: "4 / 3", borderRadius: 10,
                ...border.hairline, overflow: "hidden",
                background: "var(--warm-white)",
              }}>
                <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </section>
      )}

      <MonthTail
        year={viewDate.getFullYear()}
        month={viewDate.getMonth()}
        dayEntries={dayEntries}
        onOpenDay={selectDay}
      />

    </PageShell>

      <FloatingAdd onSelect={setAddSheet} />

      {/* Add sheets */}
      <Sheet open={addSheet === "note"} onClose={() => { setAddSheet(null); setDraft(""); }} title="Add a note">
        <SheetInput multiline value={draft} onChange={setDraft} placeholder="今天发生了什么？" />
        <SheetButton primary onClick={addNote} disabled={!draft.trim()}>Save to this day</SheetButton>
      </Sheet>

      <Sheet open={addSheet === "photo"} onClose={() => setAddSheet(null)} title="Add a photo">
        <input ref={fileInput} type="file" accept="image/*" onChange={handlePhotoFile} style={{ display: "none" }} />
        <SheetButton primary onClick={() => fileInput.current?.click()}>Choose photo</SheetButton>
      </Sheet>

      <Sheet open={addSheet === "mood"} onClose={() => setAddSheet(null)} title="Set mood">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
          {MOOD_TAGS.map((m) => (
            <button
              key={m.word}
              onClick={() => { setDayMood(dateKey, m.word); setAddSheet(null); }}
              className="pressable"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                ...border.hairline, borderRadius: 999,
                background: (entry.mood || "") === m.word ? "var(--warm-white)" : "transparent",
                boxShadow: (entry.mood || "") === m.word ? "0 3px 8px rgba(90,78,60,0.08)" : "none",
                padding: "7px 13px", cursor: "pointer",
                fontFamily: "var(--serif-en)", fontSize: 11.5, color: "var(--ink)",
              }}
            >
              <svg width="9" height="6" viewBox="0 0 20 12"><path d="M2 10 C6 2 14 0 18 2 C16 8 8 12 2 10 Z" fill={m.leaf} /></svg>
              {m.word}
            </button>
          ))}
        </div>
      </Sheet>

      <Sheet open={addSheet === "voice"} onClose={() => setAddSheet(null)} title="Voice memo">
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <button
            onPointerDown={() => setRecording(true)}
            onPointerUp={() => setRecording(false)}
            onPointerLeave={() => setRecording(false)}
            className="pressable"
            style={{
              width: 80, height: 80, borderRadius: "50%",
              ...border.hairline,
              background: recording ? "var(--rose)" : "var(--accent)",
              color: "var(--warm-white)",
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              transition: "background 200ms",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
            >
              <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
          </button>
          <div className="f-hand-cn" style={{ marginTop: 16, fontSize: 14, color: "var(--ink-soft)" }}>
            {recording ? "正在记录花园里的声音…" : "按住录制一段声音"}
          </div>
        </div>
      </Sheet>

      <Sheet open={addSheet === "memory"} onClose={() => setAddSheet(null)} title="Link a memory">
        <div className="f-hand-cn" style={{ fontSize: 14, color: "var(--ink-soft)", marginBottom: 12, lineHeight: 1.7 }}>
          把今天和一段共享记忆连在一起。
        </div>
        {US_MEMORIES.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              addDayNote(dateKey, `「${m.title}」`, "shared");
              setAddSheet(null);
            }}
            className="pressable"
            style={{
              width: "100%", textAlign: "left", padding: "12px 14px", marginBottom: 8,
              ...border.hairline, borderRadius: 10,
              background: "var(--ivory)", cursor: "pointer",
              fontSize: 13, color: "var(--ink)", fontFamily: "var(--serif-body)",
            }}
          >
            {m.title}
          </button>
        ))}
      </Sheet>
    </>
  );
}
