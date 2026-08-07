import React, { useEffect, useRef, useState } from "react";
import GardenAtmosphere from "../components/GardenAtmosphere.jsx";
import BackButton from "../components/BackButton.jsx";
import MessageItem from "./MessageItem.jsx";
import Composer from "./Composer.jsx";
import SessionGarden from "./SessionGarden.jsx";
import ThinkingNote from "./ThinkingNote.jsx";
import ToolCallNote from "./ToolCallNote.jsx";
import { IconLeaf } from "./ChatIcons.jsx";
import { useGarden } from "../state/GardenSettings.jsx";
import { border } from "../styles/garden.js";
import {
  COMPANION,
} from "./chat-config.js";
import { API_BASE } from "../config.js";
import {
  nowTimeLabel,
  todayChapterLabel,
  marginNoteOfToday,
  companionSeasonStatus,
  extractNextSentence,
} from "./chat-utils.js";

import CompanionDrawer from "./CompanionDrawer.jsx";

/* ------------------------------------------------------------
   SunDial —— 右上角的小太阳
   不是装饰：它反映此刻真实的时间光线。
   清晨 / 午后 / 傍晚 / 夜晚 各有样子，点击告诉你花园现在的光。
   ------------------------------------------------------------ */
function useDaylight() {
  const h = new Date().getHours();
  if (h < 6) return { key: "night", label: "夜深了", note: "the garden sleeps", Icon: MoonIcon };
  if (h < 9) return { key: "morning", label: "清晨", note: "morning dew on the leaves", Icon: MorningIcon };
  if (h < 14) return { key: "midday", label: "午后", note: "light falls on the paper", Icon: NoonIcon };
  if (h < 18) return { key: "evening", label: "傍晚", note: "the golden hour", Icon: EveningIcon };
  return { key: "night", label: "夜晚", note: "a lamp is lit inside", Icon: MoonIcon };
}

function NoonIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.4" strokeLinecap="round">
      <circle cx="12" cy="12" r="3.4" fill="var(--gold)" fillOpacity="0.15" />
      <path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.2 5.2l1.5 1.5M17.3 17.3l1.5 1.5M18.8 5.2l-1.5 1.5M6.7 17.3l-1.5 1.5" />
    </svg>
  );
}
function MorningIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.4" strokeLinecap="round">
      <path d="M7 16a5 5 0 0 1 10 0" fill="var(--gold)" fillOpacity="0.12" />
      <path d="M12 6v2M5.6 8.6l1.4 1.4M18.4 8.6 17 10M4 16h16M8 20h8" opacity="0.9" />
    </svg>
  );
}
function EveningIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--rose-deep)" strokeWidth="1.4" strokeLinecap="round">
      <path d="M7 15a5 5 0 0 1 10 0" fill="var(--rose)" fillOpacity="0.15" />
      <path d="M12 6v2M5.6 8.6l1.4 1.4M18.4 8.6 17 10M4 15h16M6 19h12" opacity="0.9" />
    </svg>
  );
}
function MoonIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--ink-soft)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13.5A8 8 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5Z" fill="var(--ink-soft)" fillOpacity="0.08" />
      <path d="M17 4l.5 1.5L19 6l-1.5.5L17 8l-.5-1.5L15 6l1.5-.5L17 4Z" fill="var(--gold)" stroke="none" opacity="0.8" />
    </svg>
  );
}

function SunDial() {
  const [open, setOpen] = useState(false);
  const daylight = useDaylight();
  const { Icon } = daylight;

  return (
    <span style={{ position: "relative", display: "flex" }}>
      <button
        aria-label="此刻的光"
        className="pressable"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: 28, height: 28, border: "none", background: "transparent",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
        }}
      >
        <Icon size={17} />
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 19 }} />
          <div className="msg-in" style={{
            position: "absolute", top: 38, right: 0, zIndex: 20,
            background: "var(--warm-white)",
            borderRadius: 10,
            boxShadow: "0 6px 20px rgba(90,78,60,0.12)",
            padding: "10px 14px",
            whiteSpace: "nowrap",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 12, color: "var(--ink)", letterSpacing: "0.06em" }}>{daylight.label}</div>
            <div className="f-hand-en" style={{ fontSize: 15, color: "var(--ink-soft)", marginTop: 2 }}>{daylight.note}</div>
          </div>
        </>
      )}
    </span>
  );
}
/* ------------------------------------------------------------
   ChapterDivider —— 章节式日期分隔 + 页角批注
   ------------------------------------------------------------ */
function ChapterDivider({ season = "summer" }) {
  return (
    <div style={{ textAlign: "center", margin: "6px 0 22px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
        <span style={{ width: 52, height: 1, background: "var(--paper-edge)" }} />
        <svg width="18" height="22" viewBox="0 0 40 52" style={{ opacity: 0.7 }}>
          <path d="M20 50 C19 38 19 26 21 12" stroke="var(--sage)" strokeWidth="1.1" fill="none" strokeLinecap="round" />
          <path d="M20 40 C15 38 12 34 12 29 C16 30 19 34 20 40 Z" fill="var(--sage)" opacity="0.55" />
          <g fill="var(--rose)" opacity="0.7">
            <ellipse cx="21" cy="9" rx="2.4" ry="4" transform="rotate(-12 21 9)" />
            <ellipse cx="16" cy="12" rx="2.2" ry="3.6" transform="rotate(-38 16 12)" />
            <ellipse cx="26" cy="12" rx="2.2" ry="3.6" transform="rotate(22 26 12)" />
          </g>
        </svg>
        <span className="f-display" style={{ fontSize: 10.5, letterSpacing: "0.22em", color: "var(--ink-soft)" }}>
          {todayChapterLabel()} · {season.toUpperCase()}
        </span>
        <span style={{ width: 52, height: 1, background: "var(--paper-edge)" }} />
      </div>
      {/* 页角批注：花体英文，随季节换话 */}
      <p className="f-hand-en" style={{ fontSize: 20, color: "var(--ink-soft)", opacity: 0.8, marginTop: 10 }}>
        {marginNoteOfToday(season)}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------
   DateDivider —— 跨天时的日期分隔
   细线 + 「8 月 6 日 · 星期四」，标出这段对话是哪一天
   ------------------------------------------------------------ */
function DateDivider({ ts }) {
  const d = new Date(ts);
  const weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"][d.getDay()];
  const label = `${d.getMonth() + 1} 月 ${d.getDate()} 日`;
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: 12, margin: "6px 0 18px",
    }}>
      <span style={{ flex: 1, height: 1, background: "var(--paper-edge)", opacity: 0.7 }} />
      <span className="f-display" style={{
        fontSize: 11.5, letterSpacing: "0.18em", color: "var(--ink-soft)",
      }}>
        {label}
      </span>
      <span className="f-hand-en" style={{
        fontSize: 16, color: "var(--gold)", opacity: 0.7,
      }}>
        {weekday}
      </span>
      <span style={{ flex: 1, height: 1, background: "var(--paper-edge)", opacity: 0.7 }} />
    </div>
  );
}

/* ------------------------------------------------------------
   TimeGapDivider —— 隔了一段时间再说话时的时间分隔
   细线 + 小圆点 + 花体时间，像书页间的时间戳
   ------------------------------------------------------------ */
function TimeGapDivider({ label }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: 10, margin: "14px 0 14px",
    }}>
      <span style={{ width: 34, height: 1, background: "var(--paper-edge)", opacity: 0.7 }} />
      <span style={{
        width: 3.5, height: 3.5, borderRadius: "50%",
        background: "var(--gold)", opacity: 0.55,
      }} />
      <span style={{
        fontSize: 12, color: "var(--ink-soft)", opacity: 0.85,
        fontFamily: "var(--serif-en)", letterSpacing: "0.04em",
      }}>
        {label}
      </span>
      <span style={{
        width: 3.5, height: 3.5, borderRadius: "50%",
        background: "var(--gold)", opacity: 0.55,
      }} />
      <span style={{ width: 34, height: 1, background: "var(--paper-edge)", opacity: 0.7 }} />
    </div>
  );
}

/* ------------------------------------------------------------
   ChatScreen —— 书桌上的信
   ------------------------------------------------------------ */
export default function ChatScreen({ onBack }) {
  const { decor, effectiveSeason, keepsakes, addCollection, pruneCollections } = useGarden();
  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem("garden-chat-messages");
      const parsed = raw ? JSON.parse(raw) : null;
      // 只清掉纯种子数据（恰好 3 条且全是 m1/m2/m3），有真实消息就保留
      if (Array.isArray(parsed) && parsed.length) {
        const ids = parsed.map(m => m.id);
        const isOnlySeeds = ids.length === 3 && ids[0] === "m1" && ids[1] === "m2" && ids[2] === "m3";
        if (!isOnlySeeds) return parsed;
      }
    } catch (e) { /* ignore */ }
    return [];
  });
  const [typing, setTyping] = useState(false);
  const [kept, setKept] = useState(() => {
    try {
      const raw = localStorage.getItem("garden-chat-kept");
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return {};
  });
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [draft, setDraft] = useState("");
  const [pendingImage, setPendingImage] = useState(null);
  const fileRef = useRef(null);
  const [gardenOpen, setGardenOpen] = useState(false);
  const [companionOpen, setCompanionOpen] = useState(false);
  const [sessionSettings, setSessionSettings] = useState({
    model: "claude-sonnet-4-6",
    thinking: "standard",
    memory: true,
    tools: "auto",
  });
  const [companion, setCompanion] = useState(() => {
    try {
      const saved = localStorage.getItem("garden-companion");
      if (saved) return JSON.parse(saved);
    } catch (e) { /* ignore */ }
    return {
      name: COMPANION.name,
      avatar: COMPANION.avatar,
      alt: COMPANION.alt,
      tagline: COMPANION.tagline || "the one who stays\nin this garden",
      statusText: COMPANION.defaultStatus,
      statusEdited: false,
      writingStatus: COMPANION.writingStatus,
      voice: "Warm / Quiet",
      model: "Claude Sonnet 4.6",
      connection: "Default garden route",
    };
  });

  useEffect(() => {
    try { localStorage.setItem("garden-companion", JSON.stringify(companion)); } catch (e) { /* ignore */ }
  }, [companion]);

  const listRef = useRef(null);
  const inputRef = useRef(null);
  const timers = useRef([]);
  const aiSeq = useRef(0);      // AI 消息 id 递增器
  const pendingSents = useRef(0); // 已调度还没出现的句子数

  /* 把完整句子逐条延迟追加（每条间隔 ~300ms），并始终插到残句前面 */
  function scheduleSents(seed, complete) {
    for (const sent of complete) {
      const order = pendingSents.current++;
      timers.current.push(setTimeout(() => {
        setMessages((ms) => {
          const aiMsg = {
            id: "a" + seed + "-" + (aiSeq.current++),
            from: "ai",
            text: sent,
            time: nowTimeLabel(),
            ts: Date.now(),
            appear: true,
          };
          const streamId = "a" + seed + "-stream";
          const streamIdx = ms.findIndex((m) => m.id === streamId);
          if (streamIdx === -1) return [...ms, aiMsg];
          const next = [...ms];
          next.splice(streamIdx, 0, aiMsg);
          return next;
        });
        pendingSents.current = Math.max(0, pendingSents.current - 1);
      }, order * 300));
    }
  }
  const [sessionId, setSessionId] = useState(() => {
    try { return localStorage.getItem("garden-chat-sid"); } catch (e) { return null; }
  });

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // 如果本地消息被清空但有 session，从后端恢复
  useEffect(() => {
    const sid = sessionId;
    if (!sid || messages.length > 0) return;
    let cancelled = false;
    fetch(`${API_BASE}/sessions/${sid}/messages`)
      .then(r => r.json())
      .then(data => {
        if (cancelled || !Array.isArray(data) || !data.length) return;
        const restored = data.map(m => ({
          id: "b" + m.id,
          from: m.role === "user" ? "user" : "ai",
          text: m.content || "",
          time: m.created_at ? new Date(m.created_at).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }) : "",
          ts: new Date(m.created_at).getTime(),
          appear: true,
        }));
        setMessages(restored);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [sessionId]);

  /* 聊天记录 + 收藏印记持久化：退出再进来，红印不消失 */
  useEffect(() => {
    try { localStorage.setItem("garden-chat-messages", JSON.stringify(messages)); } catch (e) { /* ignore */ }
  }, [messages]);
  useEffect(() => {
    try { localStorage.setItem("garden-chat-kept", JSON.stringify(kept)); } catch (e) { /* ignore */ }
  }, [kept]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPendingImage(reader.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  async function send() {
    const text = draft.trim();
    if ((!text && !pendingImage) || typing) return;
    cancelSelect();
    const seed = Date.now();
    const userMsg = { id: "u" + seed, from: "user", text: text || "", time: nowTimeLabel(), ts: seed, appear: true };
    if (pendingImage) userMsg.image = pendingImage;
    setMessages((ms) => [...ms, userMsg]);
    setDraft("");
    setPendingImage(null);
    if (inputRef.current) inputRef.current.style.height = "auto";
    setGardenOpen(false);
    setTyping(true);

    try {
      // 确保有会话 ID（没有则先创建）
      let sid = sessionId;
      if (!sid) {
        const sRes = await fetch(API_BASE + "/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: text.slice(0, 30) || "新对话" }),
        });
        if (!sRes.ok) throw new Error(`Create session HTTP ${sRes.status}`);
        const sData = await sRes.json();
        sid = sData.id;
        setSessionId(sid);
        try { localStorage.setItem("garden-chat-sid", sid); } catch (e) { /* ignore */ }
      }

      const res = await fetch(`${API_BASE}/sessions/${sid}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text || "",
          stream: true,
          image: pendingImage || undefined,
          model: sessionSettings.model,
          thinking: sessionSettings.thinking,
          memory: sessionSettings.memory,
          tools: sessionSettings.tools,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let sentenceBuf = "";
      let toolCallSeen = false;
      let thinkingBuf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });

        const lines = buf.split("\n");
        buf = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;

          let parsed;
          try { parsed = JSON.parse(trimmed.slice(6)); } catch (e) { continue; }
          if (!parsed) continue;

          // thinking —— 模型思考链，可展开查看
          if (parsed.thought) {
            thinkingBuf += parsed.thought;
            setTyping(true);
            setMessages((ms) => {
              const last = ms[ms.length - 1];
              if (last && last.type === "thinking" && last.id === ("th" + seed)) {
                return ms.map((m, i) =>
                  i === ms.length - 1 ? { ...m, text: thinkingBuf } : m
                );
              }
              return [...ms, {
                id: "th" + seed,
                type: "thinking",
                seed,
                text: thinkingBuf,
                duration: 0,
              }];
            });
          }

          // tool_call: { id, name, arguments }
          if (parsed.name && parsed.arguments && parsed.success === undefined) {
            toolCallSeen = true;
            setMessages((ms) => [...ms, {
              id: "t" + seed,
              type: "tool",
              seed,
              tools: [{ name: parsed.name, args: parsed.arguments }],
              duration: 1,
              status: "running",
            }]);
          }

          // tool_result: { id, name, success, result }
          if (parsed.success !== undefined) {
            setMessages((ms) => ms.map((m) =>
              m.id === ("t" + seed) ? { ...m, status: "completed" } : m
            ));
          }

          // text chunk —— 完整句子逐条出现，残句流式增长
          if (parsed.text) {
            setTyping(false);
            sentenceBuf += parsed.text;

            const complete = [];
            let rem = sentenceBuf;
            let ext;
            while ((ext = extractNextSentence(rem)) !== null) {
              complete.push(ext.trim());
              rem = rem.slice(ext.length);
            }
            sentenceBuf = rem;

            // 完整句子 → 逐句延迟追加（一条一条蹦出来）
            if (complete.length) scheduleSents(seed, complete);

            // 残句 → 即时更新，保留 id 让后续句子能插到它前面
            setMessages((ms) => {
              let next = ms.filter((m) =>
                !(m.from === "ai" && m.id === ("a" + seed + "-stream"))
              );
              if (sentenceBuf.trim()) {
                next = [...next, {
                  id: "a" + seed + "-stream",
                  from: "ai",
                  text: sentenceBuf.trim(),
                  time: nowTimeLabel(),
                  ts: Date.now(),
                  appear: true,
                  _stream: true,
                }];
              }
              return next;
            });
          }

          // done: { reply, sessionId }
          if (parsed.reply) {
            if (parsed.sessionId && !sessionId) setSessionId(parsed.sessionId);
          }
        }
      }

      // 流结束 —— 残句转正（保留 id，让后面待出的句子仍能插到它前面）
      setMessages((ms) =>
        ms.map((m) =>
          m.id === ("a" + seed + "-stream")
            ? { ...m, _stream: undefined }
            : m
        )
      );

      setTyping(false);

    } catch (err) {
      console.error("Chat API error:", err);
      setTyping(false);
      setMessages((ms) => [...ms, {
        id: "err" + seed,
        from: "ai",
        text: "网络不好，话落在风里了。再试一次？",
        time: nowTimeLabel(),
        ts: Date.now(),
        appear: true,
      }]);
    }
  }

  function saveCollection(lines) {
    if (!lines.length) return;
    const now = new Date();
    const date = now.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    addCollection({ id: Date.now(), kind: "chat", lines, date });
  }

  function keep(id) {
    const m = messages.find((x) => x.id === id);
    if (!m || m.type) return;
    const who = m.from === "ai" ? "angel" : "user";
    if (kept[id]) {
      // 已收藏 → 取消：移除印记 + 从收藏集剔除该行
      setKept((k) => {
        const next = { ...k };
        delete next[id];
        return next;
      });
      pruneCollections((line) => !(line.msgId === id));
    } else {
      setKept((k) => ({ ...k, [id]: true }));
      saveCollection([{ who, text: m.text, msgId: id }]);
    }
  }

  /* 多选收藏 */
  function enterSelect(id) {
    setSelectMode(true);
    setSelectedIds(new Set([id]));
  }

  function toggleSelect(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function cancelSelect() {
    setSelectMode(false);
    setSelectedIds(new Set());
  }

  function saveSelected() {
    const lines = messages
      .filter((m) => !m.type && selectedIds.has(m.id))
      .map((m) => ({ who: m.from === "ai" ? "angel" : "user", text: m.text, msgId: m.id }));
    if (!lines.length) return;
    saveCollection(lines);
    setKept((k) => {
      const next = { ...k };
      messages.forEach((m) => {
        if (!m.type && selectedIds.has(m.id)) next[m.id] = true;
      });
      return next;
    });
    cancelSelect();
  }

  /* 渲染消息列表：
     - 跨天 → 日期分隔（8 月 6 日 · 星期四）
     - 相邻消息间隔超过 20 分钟 → 时间分隔
     - 同向连续消息 → 紧凑排列，时间戳只在最后一条显示 */
  const renderedMessages = [];
  messages.forEach((m, i) => {
    const prev = messages[i - 1];
    const next = messages[i + 1];

    const curDay = m.ts ? new Date(m.ts).toDateString() : null;
    const prevDay = prev?.ts ? new Date(prev.ts).toDateString() : null;
    const isFirst = i === 0 && curDay;
    const isNewDay = curDay && prevDay && curDay !== prevDay;

    // 跨天（或第一条消息）→ 日期分隔
    if (isFirst || isNewDay) {
      renderedMessages.push(<DateDivider key={"date" + m.id} ts={m.ts} />);
    } else if (m.ts && prev?.ts && m.ts - prev.ts > 20 * 60 * 1000) {
      renderedMessages.push(<TimeGapDivider key={"gap" + m.id} label={m.time} />);
    }

    if (m.type === "thinking") {
      renderedMessages.push(<ThinkingNote key={m.id} seed={m.seed} duration={m.duration} text={m.text} />);
    } else if (m.type === "tool") {
      renderedMessages.push(
        <ToolCallNote key={m.id} seed={m.seed} tools={m.tools} duration={m.duration} status={m.status} />
      );
    } else {
      const sameAsNext = next && !next.type && next.from === m.from;
      renderedMessages.push(
        <MessageItem
          key={m.id}
          msg={m}
          kept={!!kept[m.id]}
          onKeep={keep}
          showTime={!sameAsNext}
          selectMode={selectMode}
          selected={selectMode && selectedIds.has(m.id)}
          onLongPress={enterSelect}
          onToggleSelect={toggleSelect}
        />
      );
    }
  });

  return (
    <div className="page-in" style={{
      position: "absolute", inset: 0, zIndex: 8,
      background: "var(--ivory)",
      display: "flex", flexDirection: "column",
    }}>
      {decor && <GardenAtmosphere />}

      {/* Header */}
      <header style={{
        position: "relative", zIndex: 6, height: 54, flexShrink: 0,
        background: "var(--warm-white)",
        ...border.bottom,
        display: "flex", alignItems: "center", padding: "0 8px 0 4px", gap: 8,
      }}>
        <BackButton onClick={onBack} />

        <button
          onClick={() => setCompanionOpen(true)}
          style={{
            display: "flex", alignItems: "center", gap: 8, flex: 1,
            border: "none", background: "transparent", cursor: "pointer", textAlign: "left",
            padding: 0,
          }}
        >
          <div className="relief-disc" style={{
            width: 28, height: 28, borderRadius: "50%", overflow: "hidden", flexShrink: 0,
          }}>
            <img src={companion.avatar} alt={companion.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} draggable="false" />
          </div>
          <div>
            <div className="f-display" style={{ fontSize: 14, fontWeight: 500, letterSpacing: "0.03em" }}>{companion.name}</div>
            <div style={{ fontSize: 9.5, color: "var(--accent-deep)", letterSpacing: "0.06em", marginTop: 1 }}>
              {typing ? companion.writingStatus : (companion.statusEdited ? companion.statusText : companionSeasonStatus(effectiveSeason))}
            </div>
          </div>
        </button>

        <button
          aria-label="Session Garden"
          className="pressable"
          onClick={() => setGardenOpen((v) => !v)}
          style={{
            width: 28, height: 28, border: "none", background: "transparent",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}
        >
          <IconLeaf size={17} />
        </button>
        <SunDial />
      </header>

      {/* Session Garden 抽屉 */}
      <SessionGarden
        open={gardenOpen}
        onClose={() => setGardenOpen(false)}
        settings={sessionSettings}
        onChange={setSessionSettings}
      />
      <CompanionDrawer
        open={companionOpen}
        onClose={() => setCompanionOpen(false)}
        companion={companion}
        setCompanion={setCompanion}
      />

      {/* 消息列表 */}
      <div ref={listRef} style={{
        flex: 1, overflowY: "auto", position: "relative", zIndex: 5,
        padding: "20px 16px 8px", scrollbarWidth: "none",
        display: "flex", flexDirection: "column",
      }}>
        <ChapterDivider season={effectiveSeason} />
        {renderedMessages}
        {typing && (
          <div style={{ alignSelf: "flex-start", margin: "0 0 16px 6px", display: "flex", alignItems: "center", gap: 7 }}>
            {[0, 1, 2].map((i) => (
              <i key={i} className="typing-dot" style={{
                width: 4.5, height: 4.5, borderRadius: "50%",
                background: "var(--ink-soft)", animationDelay: `${i * 0.24}s`,
              }} />
            ))}
            <span className="f-hand-en" style={{ fontSize: 17, color: "var(--ink-soft)", opacity: 0.65, marginLeft: 5 }}>
              writing…
            </span>
          </div>
        )}
        <div style={{ height: 8 }} />
      </div>

      {/* 多选收藏操作栏 */}
      {selectMode && (
        <div style={{
          position: "relative", zIndex: 6, flexShrink: 0,
          background: "var(--warm-white)", borderTop: "1px solid var(--paper-edge)",
          display: "flex", alignItems: "center", gap: 10, padding: "10px 16px",
          boxShadow: "0 -4px 14px rgba(90,78,60,0.08)",
        }}
        >
          <span className="f-hand-cn" style={{ fontSize: 13, color: "var(--ink-soft)", flex: 1 }}>
            已选 <span className="f-display" style={{ color: "var(--accent-deep)" }}>{selectedIds.size}</span> 条
          </span>
          <button
            onClick={cancelSelect}
            className="pressable"
            style={{
              ...border.hairline, background: "transparent", borderRadius: 999,
              padding: "7px 14px", cursor: "pointer", fontSize: 12.5, color: "var(--ink-soft)",
              fontFamily: "var(--serif-body)",
            }}
          >
            取消
          </button>
          <button
            onClick={saveSelected}
            disabled={selectedIds.size === 0}
            className="pressable"
            style={{
              border: "none", background: "var(--accent)", color: "var(--warm-white)",
              borderRadius: 999, padding: "8px 16px", cursor: "pointer", fontSize: 12.5,
              fontFamily: "var(--serif-body)", opacity: selectedIds.size === 0 ? 0.5 : 1,
            }}
          >
            收藏为一段回忆
          </button>
        </div>
      )}

      {/* 输入区 */}
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
      <Composer
        draft={draft} setDraft={setDraft} onSend={send} inputRef={inputRef}
        pendingImage={pendingImage} setPendingImage={setPendingImage}
        onAttach={() => fileRef.current?.click()}
      />
    </div>
  );
}
