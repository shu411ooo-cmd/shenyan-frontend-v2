import React, { useRef } from "react";

/* ------------------------------------------------------------
   MessageItem —— 统一标准的聊天气泡
   AI: 暖白纸 + 左上角小圆角
   User: 淡青瓷 + 右上角小圆角
   支持：单条收藏（AI 消息右下角）、长按多选收藏。
   ------------------------------------------------------------ */

/* 收藏小圆点 / 已收藏勾 */
function KeepDot({ kept, onKeep, selectMode }) {
  if (selectMode) return null;
  if (kept) {
    return (
      <span className="keep-pop" style={{
        position: "absolute",
        bottom: -5,
        right: -5,
        width: 14,
        height: 14,
        borderRadius: "50%",
        background: "var(--wax)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 1px 4px rgba(168,87,81,0.3)",
        zIndex: 2,
      }}>
        <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
          <path d="M5 12l5 5L20 7" />
        </svg>
      </span>
    );
  }

  return (
    <button
      onClick={onKeep}
      className="pressable keep-btn"
      aria-label="收藏"
      style={{
        position: "absolute",
        bottom: -5,
        right: -5,
        width: 14,
        height: 14,
        borderRadius: "50%",
        border: "none",
        background: "var(--warm-white)",
        boxShadow: "0 1px 4px rgba(90,78,60,0.15)",
        cursor: "pointer",
        opacity: 0,
        transition: "opacity 200ms",
        zIndex: 2,
      }}
    />
  );
}

/* 多选复选框 */
function SelectCheck({ selected }) {
  return (
    <span style={{
      position: "absolute",
      top: -6,
      right: -6,
      width: 20,
      height: 20,
      borderRadius: "50%",
      background: selected ? "var(--accent)" : "var(--warm-white)",
      border: selected ? "1px solid var(--accent-deep)" : "1px solid var(--paper-edge)",
      boxShadow: "0 1px 4px rgba(90,78,60,0.12)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 3,
    }}>
      {selected && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
          <path d="M5 12l5 5L20 7" />
        </svg>
      )}
    </span>
  );
}

export default function MessageItem({
  msg, kept, onKeep, showTime = true,
  selectMode = false, selected = false, onLongPress, onToggleSelect,
}) {
  const isAI = msg.from === "ai";
  const pressTimer = useRef(null);

  const startPress = () => {
    if (selectMode) return;
    pressTimer.current = setTimeout(() => onLongPress && onLongPress(msg.id), 550);
  };
  const cancelPress = () => {
    if (pressTimer.current) { clearTimeout(pressTimer.current); pressTimer.current = null; }
  };

  return (
    <div
      className="msg-wrap"
      onPointerDown={startPress}
      onPointerUp={cancelPress}
      onPointerLeave={cancelPress}
      onPointerCancel={cancelPress}
      onClick={() => selectMode && onToggleSelect && onToggleSelect(msg.id)}
      onContextMenu={(e) => { e.preventDefault(); if (!selectMode) onKeep && onKeep(msg.id); }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isAI ? "flex-start" : "flex-end",
        marginBottom: 8,
      }}
    >
      <div
        className={msg.appear ? "msg-in" : undefined}
        style={{
          position: "relative",
          display: "inline-block",
          maxWidth: "75%",
          background: isAI ? "#FCF9F1" : "var(--oatmeal)",
          borderRadius: isAI ? "4px 14px 14px 14px" : "14px 4px 14px 14px",
          padding: "7px 11px",
          boxShadow: "0 1px 4px rgba(90,78,60,0.05)",
          fontSize: 13,
          lineHeight: 1.6,
          color: "var(--ink)",
          fontFamily: "var(--serif-body)",
          whiteSpace: "pre-line",
          userSelect: "none",
          opacity: selectMode && !selected ? 0.45 : 1,
          transition: "opacity 200ms",
        }}
      >
        {msg.text}
        {selectMode ? (
          <SelectCheck selected={selected} />
        ) : (
          isAI && <KeepDot kept={kept} onKeep={() => onKeep && onKeep(msg.id)} />
        )}
      </div>
      {showTime && (
        <span style={{
          fontSize: 9.5,
          color: "var(--ink-soft)",
          opacity: 0.45,
          marginTop: 3,
          paddingLeft: isAI ? 4 : 0,
          paddingRight: isAI ? 0 : 4,
          letterSpacing: "0.02em",
        }}>
          {msg.time}
        </span>
      )}
    </div>
  );
}
