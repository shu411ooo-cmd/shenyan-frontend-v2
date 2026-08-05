import React, { useState } from "react";
import BackButton from "../components/BackButton.jsx";
import { OliveVine, RoseVine, LavenderVine } from "./VineDividers.jsx";
import Sheet, { SheetButton } from "../components/Sheet.jsx";
import { useGarden } from "../state/GardenSettings.jsx";
import { border } from "../styles/garden.js";
import {
  hisDailyTraces,
  hisMarginNote,
  partOfDay,
  dayKeyOf,
  TIME_ORDER,
} from "../chat/chat-utils.js";
import {
  YOU_MEMORIES,
  US_MEMORIES,
  RECENT_MEMORIES,
  KEEPSAKES,
} from "./memory-config.js";

/* ------------------------------------------------------------
   Memory —— What we choose to keep.
   一整张安静的页面：排版、留白、极细分隔线、植物藤蔓。
   没有卡片墙，没有统计数字。
   ------------------------------------------------------------ */

const SCOPE = {
  you: { color: "var(--accent-deep)", en: "REMEMBERED ABOUT YOU", Vine: OliveVine },
  us: { color: "var(--rose-deep)", en: "KEPT BETWEEN US", Vine: RoseVine },
};

/* 细返回箭头 */
function BackArrow({ onBack }) {
  return <BackButton onClick={onBack} />;
}

/* ------------------------------------------------------------
   MemoryReading —— 阅读一条记忆
   不是数据库详情页：没有字段、标签、编辑。
   像翻开一页，安静地读完，然后回去。
   ------------------------------------------------------------ */
function MemoryReading({ memory, onBack }) {
  const meta = SCOPE[memory.scope];
  const { memoryComments, addMemoryComment } = useGarden();
  const [commentDraft, setCommentDraft] = useState("");

  const comments = memoryComments[memory.id] || [];
  const margin = hisMarginNote(memory.id);

  function leaveComment() {
    const text = commentDraft.trim();
    if (!text) return;
    addMemoryComment(memory.id, text, "user");
    setCommentDraft("");
  }

  return (
    <div className="page-in" style={{
      position: "absolute", inset: 0, zIndex: 12,
      background: "var(--ivory)", display: "flex", flexDirection: "column",
    }}>
      <header style={{ height: 56, flexShrink: 0, display: "flex", alignItems: "center", padding: "0 10px" }}>
        <BackArrow onBack={onBack} />
      </header>

      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: "8px 30px 60px" }}>
        <span className="f-display" style={{
          fontSize: 10, letterSpacing: "0.26em", color: meta.color,
        }}>
          {meta.en}
        </span>

        <div style={{ marginTop: 16 }}>
          <meta.Vine width={150} opacity={0.45} />
        </div>

        <h2 className="f-display" style={{
          fontSize: 25, fontWeight: 500, lineHeight: 1.45,
          letterSpacing: "0.01em", color: "var(--ink)", marginTop: 22,
        }}>
          {memory.title}
        </h2>

        <p style={{
          fontSize: 16, lineHeight: 2.1, color: "var(--ink)",
          fontFamily: "var(--serif-body)", marginTop: 22,
        }}>
          {memory.text}
        </p>

        <div style={{ marginTop: 48 }}>
          <p className="f-hand-en" style={{ fontSize: 20, color: "var(--ink-soft)" }}>
            remembered on {memory.date}
          </p>
          <p className="f-italic-en" style={{ fontSize: 13.5, color: "var(--ink-soft)", opacity: 0.75, marginTop: 6 }}>
            {memory.source}
          </p>
        </div>

        {/* 这一页的页边：他的边注 + 你的手迹 */}
        <div style={{ marginTop: 46, borderTop: "1px solid var(--paper-edge)", paddingTop: 22 }}>
          <div className="f-display" style={{
            fontSize: 9.5, letterSpacing: "0.24em", color: meta.color, textTransform: "uppercase",
          }}>
            Margins of this page
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>
            {margin && (
              <div>
                <span className="f-display" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--rose-deep)" }}>
                  他
                </span>
                <p className="f-hand-cn" style={{ fontSize: 14.5, color: "var(--ink)", lineHeight: 1.7, marginTop: 4 }}>
                  {margin}
                </p>
                <span className="f-italic-en" style={{ display: "block", fontSize: 11, color: "var(--ink-soft)", opacity: 0.6, marginTop: 3 }}>
                  留在这一页的边注
                </span>
              </div>
            )}
            {!margin && comments.length === 0 && (
              <p className="f-hand-cn" style={{ fontSize: 13, color: "var(--ink-soft)", opacity: 0.7 }}>
                这一页的页边还空着。你可以写第一句。
              </p>
            )}
            {comments.map((c) => (
              <div key={c.id}>
                <span className="f-display" style={{ fontSize: 10, letterSpacing: "0.14em", color: c.who === "angel" ? "var(--rose-deep)" : "var(--sage-deep)" }}>
                  {c.who === "angel" ? "他" : "你"}
                </span>
                <p className="f-hand-cn" style={{ fontSize: 14.5, color: "var(--ink)", lineHeight: 1.7, marginTop: 4 }}>
                  {c.text}
                </p>
                <span className="f-italic-en" style={{ display: "block", fontSize: 11, color: "var(--ink-soft)", opacity: 0.6, marginTop: 3 }}>
                  {c.date}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "flex-end", marginTop: 18, ...border.bottom, paddingBottom: 6 }}>
            <input
              value={commentDraft}
              onChange={(e) => setCommentDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); leaveComment(); } }}
              placeholder="在页边写一句…"
              style={{
                flex: 1, border: "none", background: "transparent",
                padding: "4px 2px", fontSize: 13.5,
                fontFamily: "var(--serif-body)", color: "var(--ink)", outline: "none",
              }}
            />
            <button onClick={leaveComment} className="pressable" style={{
              border: "none", background: "none", cursor: "pointer",
              color: "var(--accent-deep)", fontSize: 12.5, fontFamily: "var(--serif-body)",
              letterSpacing: "0.06em", padding: "4px 2px",
            }}>
              留下
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   MemoryList —— You / Us 的长期记忆
   标题 + 短段落 + 极细分隔线，没有卡片
   ------------------------------------------------------------ */
function MemoryList({ items, color, onRead }) {
  return (
    <div>
      {items.map((m, i) => (
        <div key={m.id}>
          <button onClick={() => onRead(m)} className="pressable" style={{
            display: "block", width: "100%", textAlign: "left",
            background: "none", border: "none", cursor: "pointer",
            padding: "16px 2px",
          }}>
            <span className="f-italic-en" style={{ fontSize: 14.5, color }}>
              {m.title}
            </span>
            <p style={{
              fontSize: 14, lineHeight: 1.8, color: "var(--ink)",
              fontFamily: "var(--serif-body)", marginTop: 6,
            }}>
              {m.text}
            </p>
          </button>
          {i < items.length - 1 && (
            <div style={{ height: 1, background: "var(--paper-edge)", opacity: 0.5, margin: "0 2px" }} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------
   SharedSpace —— 共同空间：痕迹，不是对话
   他在过他的日子，你在过你的，痕迹落在同一页上。
   他的痕迹按日期+季节生成，打开时已经在那里；
   你的纸条混排其中，不触发任何回复。
   ------------------------------------------------------------ */
function SharedSpace() {
  const { notes, addSharedNote, effectiveSeason } = useGarden();
  const [draft, setDraft] = useState("");

  function leaveNote() {
    const text = draft.trim();
    if (!text) return;
    addSharedNote(text, "user");
    setDraft("");
  }

  /* 合并时间流：最近 7 天，他的痕迹 + 你的纸条 */
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = dayKeyOf(d);
    const his = hisDailyTraces(effectiveSeason, d).map((t) => ({
      ...t, who: "angel", order: TIME_ORDER[t.time], ts: 0,
    }));
    const mine = notes
      .filter((n) => (n.dayKey || dayKeyOf(n.ts || Date.now())) === key)
      .map((n) => {
        const part = partOfDay(n.ts || Date.now());
        return { time: part, text: n.text, who: "user", order: TIME_ORDER[part], ts: n.ts || 0 };
      });
    const items = [...his, ...mine].sort((a, b) => a.order - b.order || a.ts - b.ts);
    if (items.length) {
      days.push({
        key,
        label: i === 0 ? "今天" : i === 1 ? "昨天" : `${d.getMonth() + 1} 月 ${d.getDate()} 日`,
        items,
      });
    }
  }

  return (
    <div style={{ marginTop: 20 }}>
      <div className="f-hand-cn" style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.8, marginBottom: 18 }}>
        这里不是聊天。他在过他的日子，你在过你的，痕迹落在同一页上。
      </div>

      {/* 写一句：安静的底线输入，不像聊天框 */}
      <div style={{
        display: "flex", gap: 10, alignItems: "flex-end",
        ...border.bottom, paddingBottom: 7, marginBottom: 26,
      }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); leaveNote(); } }}
          placeholder="也写一句，放进日子里…"
          style={{
            flex: 1, border: "none", background: "transparent", outline: "none",
            padding: "4px 2px", fontSize: 14,
            fontFamily: "var(--serif-body)", color: "var(--ink)",
          }}
        />
        <button onClick={leaveNote} className="pressable" style={{
          border: "none", background: "none", cursor: "pointer",
          color: "var(--accent-deep)", fontSize: 13, fontFamily: "var(--serif-body)",
          letterSpacing: "0.06em", padding: "4px 2px",
        }}>
          留下
        </button>
      </div>

      {/* 时间流 */}
      {days.map((day) => (
        <div key={day.key} style={{ marginBottom: 26 }}>
          <div className="f-display" style={{
            fontSize: 9.5, letterSpacing: "0.22em", color: "var(--ink-soft)",
            display: "flex", alignItems: "center", gap: 10, marginBottom: 4,
          }}>
            {day.label}
            <span style={{ flex: 1, height: 1, background: "var(--paper-edge)", opacity: 0.6 }} />
          </div>
          <div style={{ position: "relative", paddingLeft: 18 }}>
            <i style={{
              position: "absolute", left: 3, top: 12, bottom: 12, width: 1,
              background: "var(--paper-edge)",
            }} />
            {day.items.map((it, idx) => {
              const isAngel = it.who === "angel";
              return (
                <div key={idx} style={{ position: "relative", padding: "8px 0" }}>
                  <i style={{
                    position: "absolute", left: -18, top: 14, width: 7, height: 7,
                    borderRadius: "50%",
                    background: isAngel ? "var(--rose-deep)" : "var(--sage-deep)",
                    opacity: 0.85,
                  }} />
                  <span className="f-display" style={{
                    fontSize: 10, letterSpacing: "0.14em",
                    color: isAngel ? "var(--rose-deep)" : "var(--sage-deep)",
                  }}>
                    {isAngel ? "他" : "你"} · {it.time}
                  </span>
                  <p className="f-hand-cn" style={{
                    fontSize: 14.5, color: "var(--ink)", lineHeight: 1.7, marginTop: 3,
                  }}>
                    {it.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------
   MemoryScreen
   ------------------------------------------------------------ */
export default function MemoryScreen({ onNavigate }) {
  const { keepsakes, collections, removeKeepsake, removeCollection } = useGarden();
  const [tab, setTab] = useState("you");
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [reading, setReading] = useState(null);
  const [keepsakesOpen, setKeepsakesOpen] = useState(false);
  const [expandedColl, setExpandedColl] = useState(null);

  const meta = SCOPE[tab];
  const q = query.trim().toLowerCase();
  const match = (m) =>
    !q || m.text.includes(query.trim()) || m.title.toLowerCase().includes(q);

  const list = (tab === "you" ? YOU_MEMORIES : US_MEMORIES).filter(match);
  const recent = RECENT_MEMORIES.filter(match).slice(0, 3);

  return (
    <div className="page-in" style={{
      position: "absolute", inset: 0, zIndex: 8,
      background: "var(--ivory)", display: "flex", flexDirection: "column",
    }}>
      <div style={{
        flex: 1, overflowY: "auto", scrollbarWidth: "none",
        padding: "30px 26px 120px", position: "relative", zIndex: 4,
      }}>
        {/* Header */}
        <header>
          <h2 className="f-display" style={{
            fontSize: 27, fontWeight: 500, letterSpacing: "0.02em", color: "var(--ink)",
          }}>
            Memory
          </h2>
          <p className="f-hand-en" style={{
            fontSize: 19, color: "var(--ink-soft)", marginTop: 4,
          }}>
            what we choose to keep
          </p>
        </header>

        {/* 轻量搜索：收起时是一行细线 + 花体占位 */}
        <div style={{ marginTop: 22 }}>
          {searchOpen ? (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              ...border.bottom, padding: "6px 2px",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-soft)" strokeWidth="1.5" strokeLinecap="round" style={{ flexShrink: 0, opacity: 0.7 }}>
                <circle cx="11" cy="11" r="6.5" /><path d="M20 20 l-4 -4" />
              </svg>
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="search the garden…"
                className="mem-search"
                style={{
                  flex: 1, border: "none", outline: "none", background: "transparent",
                  fontSize: 14, color: "var(--ink)", fontFamily: "var(--serif-body)",
                }}
              />
              <button
                onClick={() => { setSearchOpen(false); setQuery(""); }}
                aria-label="关闭搜索"
                className="pressable"
                style={{ border: "none", background: "none", cursor: "pointer", color: "var(--ink-soft)", padding: 2 }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M6 6 L18 18 M18 6 L6 18" />
                </svg>
              </button>
            </div>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="pressable" style={{
              display: "flex", alignItems: "center", gap: 8, width: "100%",
              background: "none", border: "none", cursor: "pointer",
              ...border.bottom, padding: "6px 2px 8px",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-soft)" strokeWidth="1.5" strokeLinecap="round" style={{ opacity: 0.7 }}>
                <circle cx="11" cy="11" r="6.5" /><path d="M20 20 l-4 -4" />
              </svg>
              <span className="f-hand-en" style={{ fontSize: 17, color: "var(--ink-soft)", opacity: 0.75 }}>
                search the garden…
              </span>
            </button>
          )}
        </div>

        {/* You / Us 文字 Tab */}
        <nav style={{
          display: "flex", gap: 34, marginTop: 24,
        }}>
          {["you", "us", "space"].map((k) => {
            const active = tab === k;
            const tabColor = k === "space" ? "var(--accent-deep)" : SCOPE[k].color;
            return (
              <button key={k} onClick={() => setTab(k)} className="pressable" style={{
                background: "none", border: "none", cursor: "pointer", padding: "0 0 6px",
                position: "relative",
              }}>
                <span className="f-display" style={{
                  fontSize: 15, letterSpacing: "0.06em",
                  color: active ? "var(--ink)" : "var(--ink-soft)",
                  fontWeight: active ? 500 : 400,
                  opacity: active ? 1 : 0.65,
                  transition: "opacity 200ms var(--ease-out)",
                }}>
                  {k === "you" ? "You" : k === "us" ? "Us" : "Space"}
                </span>
                <i style={{
                  position: "absolute", left: 0, right: 0, bottom: 0, height: 1.5,
                  background: tabColor,
                  opacity: active ? 0.9 : 0,
                  transition: "opacity 250ms var(--ease-out)",
                }} />
              </button>
            );
          })}
        </nav>

        {tab === "space" ? (
          <SharedSpace />
        ) : (
        <>
        {/* 当前章节小标 + 记忆列表 */}
        <div style={{ marginTop: 20 }}>
          <span className="f-display" style={{
            fontSize: 9.5, letterSpacing: "0.26em", color: meta.color, opacity: 0.9,
          }}>
            {meta.en}
          </span>
          {list.length > 0 ? (
            <MemoryList items={list} color={meta.color} onRead={setReading} />
          ) : (
            <p className="f-italic-en" style={{ fontSize: 14, color: "var(--ink-soft)", padding: "20px 2px", opacity: 0.7 }}>
              nothing here yet — the garden is still listening
            </p>
          )}
        </div>

        {/* 章节藤蔓：随 Tab 换植物 */}
        <div style={{ display: "flex", justifyContent: "center", margin: "26px 0 22px" }}>
          <span className="vine-sway">
            <meta.Vine width={190} opacity={0.5} />
          </span>
        </div>

        {/* Recently remembered：严格最多 3 条 */}
        {recent.length > 0 && (
          <section>
            <span className="f-display" style={{
              fontSize: 9.5, letterSpacing: "0.26em", color: "var(--ink-soft)",
            }}>
              RECENTLY REMEMBERED
            </span>
            <div style={{ marginTop: 6 }}>
              {recent.map((m) => (
                <button key={m.id} onClick={() => setReading(m)} className="pressable" style={{
                  display: "flex", gap: 12, width: "100%", textAlign: "left",
                  background: "none", border: "none", cursor: "pointer",
                  padding: "13px 2px", alignItems: "flex-start",
                }}>
                  <i style={{
                    width: 4, height: 4, borderRadius: "50%", flexShrink: 0,
                    background: SCOPE[m.scope].color, marginTop: 9,
                  }} />
                  <span style={{ flex: 1 }}>
                    <span style={{
                      display: "block", fontSize: 14, lineHeight: 1.7,
                      color: "var(--ink)", fontFamily: "var(--serif-body)",
                    }}>
                      {m.text}
                    </span>
                    <span className="f-italic-en" style={{
                      display: "block", fontSize: 12, color: "var(--ink-soft)",
                      opacity: 0.7, marginTop: 3,
                    }}>
                      {m.date} · {m.scope === "you" ? "You" : "Us"}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 薰衣草藤蔓 */}
        <div style={{ display: "flex", justifyContent: "center", margin: "26px 0 20px" }}>
          <span className="vine-sway">
            <LavenderVine width={170} opacity={0.45} />
          </span>
        </div>

        {/* Keepsakes：安静的入口，不是卡片 */}
        <button
          onClick={() => setKeepsakesOpen(true)}
          className="pressable"
          style={{
            display: "flex", alignItems: "center", gap: 12, width: "100%",
            background: "none", border: "none", cursor: "pointer",
            borderTop: "1px solid var(--paper-edge)", padding: "18px 2px 4px",
          }}
        >
          <svg width="16" height="20" viewBox="0 0 24 30" style={{ opacity: 0.7, flexShrink: 0 }}>
            <path d="M12 28 C11 20 11 12 13 4" stroke="#9A94AC" strokeWidth="1" fill="none" strokeLinecap="round" />
            <g fill="#A9A3B8">
              <circle cx="13" cy="3.4" r="1.4" />
              <circle cx="11.4" cy="5.4" r="1.2" />
              <circle cx="14.4" cy="5.8" r="1.2" />
            </g>
            <ellipse cx="10" cy="16" rx="4.4" ry="1.6" fill="#9A94AC" opacity="0.5" transform="rotate(-24 10 16)" />
          </svg>
          <span style={{ textAlign: "left" }}>
            <span className="f-display" style={{
              display: "block", fontSize: 12, letterSpacing: "0.2em", color: "var(--ink)",
            }}>
              KEEPSAKES
            </span>
            <span className="f-hand-en" style={{
              display: "block", fontSize: 15, color: "var(--ink-soft)", opacity: 0.8, marginTop: 3,
            }}>
              {KEEPSAKES.hint}
            </span>
          </span>
          <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <span className="f-italic-en" style={{ fontSize: 13, color: "var(--ink-soft)" }}>
              {keepsakes.length + collections.length}
            </span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--ink-soft)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
              <path d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </button>
        </>
        )}
      </div>

      {/* Keepsakes 弹窗：固定在屏幕底部 */}
      <Sheet open={keepsakesOpen} onClose={() => setKeepsakesOpen(false)} title="Keepsakes">
        <div className="f-hand-cn" style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.8, marginBottom: 16 }}>
          这些是你们亲手放进木盒里的东西。现在还不多，但每一个都很重。
        </div>

        {collections.length === 0 && keepsakes.length === 0 && (
          <div className="f-hand-cn" style={{
            textAlign: "center", fontSize: 13, color: "var(--ink-soft)", opacity: 0.7, padding: "16px 0",
          }}>
            盒子还空着。去 Me 收一件小事，或在 Chat 里收藏一段话。
          </div>
        )}

        {collections.length > 0 && (
          <>
            <div className="f-display" style={{
              fontSize: 9.5, letterSpacing: "0.22em", color: "var(--accent-deep)", marginBottom: 8,
            }}>
              FROM THE LETTERS
            </div>
            {collections.map((c) => {
              const open = expandedColl === c.id;
              const shown = open ? c.lines : c.lines.slice(0, 3);
              return (
                <div
                  key={c.id}
                  onClick={() => setExpandedColl(open ? null : c.id)}
                  className="pressable"
                  style={{
                    background: "var(--ivory)", ...border.hairline, borderRadius: 10,
                    padding: "12px 14px", marginBottom: 10, position: "relative", cursor: "pointer",
                  }}
                >
                  {shown.map((line, i) => {
                    const who = typeof line === "object" ? line.who : null;
                    const text = typeof line === "object" ? line.text : line;
                    const whoColor = who === "angel" ? "var(--rose-deep)" : who === "user" ? "var(--sage-deep)" : "var(--ink-soft)";
                    const whoLabel = who === "angel" ? "他" : who === "user" ? "你" : null;
                    return (
                      <div key={i} style={{
                        fontSize: 13, color: "var(--ink)", lineHeight: 1.7,
                        fontFamily: "var(--serif-body)",
                        marginBottom: i === shown.length - 1 ? 0 : 3,
                        opacity: open && i >= 3 ? 0.9 : 1,
                      }}
                      >
                        {whoLabel && (
                          <span className="f-display" style={{
                            fontSize: 11, color: whoColor, letterSpacing: "0.04em", marginRight: 6, opacity: 0.9,
                          }}
                          >
                            {whoLabel}
                          </span>
                        )}
                        {text}
                      </div>
                    );
                  })}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className="f-italic-en" style={{ fontSize: 11, color: "var(--ink-soft)", opacity: 0.7 }}>
                        {c.date}
                      </span>
                      {!open && c.lines.length > 3 && (
                        <span className="f-italic-en" style={{ fontSize: 11, color: "var(--accent-deep)", opacity: 0.85 }}>
                          · 展开 {c.lines.length} 行
                        </span>
                      )}
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--ink-soft)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                        style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 200ms var(--ease-out)", opacity: 0.6 }}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeCollection(c.id); }}
                      style={{
                        border: "none", background: "transparent", cursor: "pointer",
                        color: "var(--ink-soft)", opacity: 0.6, display: "flex", alignItems: "center",
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {keepsakes.length > 0 && (
          <>
            <div className="f-display" style={{
              fontSize: 9.5, letterSpacing: "0.22em", color: "var(--accent-deep)", margin: "14px 0 8px",
            }}>
              LITTLE THINGS
            </div>
            {keepsakes.map((k) => (
              <div key={k.id} style={{
                background: "var(--ivory)", ...border.hairline, borderRadius: 10,
                padding: "12px 14px", marginBottom: 10, display: "flex", alignItems: "center", gap: 10,
              }}
              >
                <span style={{ flex: 1, fontSize: 13, color: "var(--ink)", fontFamily: "var(--serif-body)" }}>{k.text}</span>
                <span className="f-italic-en" style={{ fontSize: 11, color: "var(--ink-soft)", opacity: 0.7 }}>{k.date}</span>
                <button
                  onClick={() => removeKeepsake(k.id)}
                  style={{
                    border: "none", background: "transparent", cursor: "pointer",
                    color: "var(--ink-soft)", opacity: 0.6, display: "flex", alignItems: "center",
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </>
        )}

        <SheetButton onClick={() => setKeepsakesOpen(false)}>Close</SheetButton>
      </Sheet>

      {/* 阅读一条记忆（覆盖层） */}
      {reading && <MemoryReading memory={reading} onBack={() => setReading(null)} />}
    </div>
  );
}
