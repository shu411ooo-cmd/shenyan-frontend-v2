import React, { useEffect, useState } from "react";
import PageShell from "../components/PageShell.jsx";
import { API_BASE } from "../config.js";

/* ============================================================
   Stats —— 请求用量（Phase 1：真实 usage 明细表格）
   request_stats：每次 chat 的真实 prompt/completion/cached tokens
   + Context Assembly 诊断（est/trimmed/哈希等）。
   只展示原始值，命中率等派生指标等语义确认后再算。
   ============================================================ */

const DAY_OPTIONS = [1, 7, 30];

function fmtTime(iso) {
  try {
    return new Date(iso).toLocaleString("zh-CN", {
      month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
      hour12: false, timeZone: "Asia/Shanghai",
    });
  } catch {
    return iso;
  }
}

function shortHash(h) {
  if (!h) return null;
  return typeof h === "string" ? `${h.slice(0, 8)}…` : JSON.stringify(h).slice(0, 20);
}

function ClientBadge({ client }) {
  const angel = client === "angel";
  return (
    <span style={{
      fontSize: 10.5, padding: "1px 7px", borderRadius: 999,
      fontFamily: "var(--serif-body)", letterSpacing: "0.03em",
      color: angel ? "#5B7A62" : "#8A7E6E",
      background: angel ? "rgba(122,157,120,0.14)" : "rgba(138,126,110,0.12)",
    }}>
      {client || "legacy"}
    </span>
  );
}

function Num({ v, strong }) {
  if (v == null) return <span style={{ color: "var(--ink-soft)", opacity: 0.5 }}>—</span>;
  return <span style={strong ? { fontWeight: 600, color: "var(--ink)" } : undefined}>{v.toLocaleString()}</span>;
}

export default function StatsScreen({ onBack }) {
  const [days, setDays] = useState(7);
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setRows(null);
    setError("");
    fetch(`${API_BASE}/api/stats?days=${days}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (Array.isArray(d)) setRows(d);
        else setError(d?.error || "加载失败");
      })
      .catch(() => !cancelled && setError("后端不可达"));
    return () => { cancelled = true; };
  }, [days]);

  const sum = (f) => (rows || []).reduce((s, r) => s + (f(r) || 0), 0);
  const totals = rows ? {
    count: rows.length,
    prompt: sum((r) => r.prompt_tokens),
    completion: sum((r) => r.completion_tokens),
    cached: sum((r) => r.cached_tokens),
    cacheWrite: sum((r) => r.cache_write_tokens),
    cacheRead: sum((r) => r.cache_read_input_tokens),
    cacheCreate: sum((r) => r.cache_creation_input_tokens),
    est: sum((r) => r.estimated_tokens),
    trimmed: sum((r) => r.trimmed_turns),
  } : null;

  return (
    <PageShell
      vignette={false}
      decor={false}
      padding="18px 16px 60px"
      zIndex={8}
      header={
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "14px 16px 10px",
          borderBottom: "1px solid var(--paper-edge)",
          background: "var(--ivory)",
        }}>
          <button
            onClick={onBack}
            className="pressable"
            style={{
              border: "none", background: "none", cursor: "pointer", padding: "4px",
              color: "var(--ink-soft)", display: "flex", alignItems: "center",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <span className="f-display" style={{ fontSize: 13, letterSpacing: "0.06em", color: "var(--ink)", flex: 1 }}>
            Request Stats
          </span>
          <div style={{ display: "flex", gap: 4 }}>
            {DAY_OPTIONS.map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className="pressable"
                style={{
                  border: "none", background: d === days ? "var(--accent)" : "transparent",
                  color: d === days ? "var(--warm-white)" : "var(--ink-soft)",
                  padding: "4px 10px", borderRadius: 999, fontSize: 11.5, cursor: "pointer",
                  fontFamily: "var(--serif-body)",
                }}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>
      }
    >
      {error && (
        <div className="f-hand-cn" style={{ fontSize: 13, color: "#A06050", padding: "10px 4px" }}>
          {error}
        </div>
      )}

      {!error && !rows && (
        <div className="f-hand-cn" style={{ textAlign: "center", fontSize: 13, color: "var(--ink-soft)", padding: "40px 0" }}>
          加载中…
        </div>
      )}

      {!error && rows && rows.length === 0 && (
        <div className="f-hand-cn" style={{ textAlign: "center", fontSize: 13, color: "var(--ink-soft)", padding: "40px 0", lineHeight: 1.8 }}>
          近 {days} 天还没有请求记录。
          <br />
          发一条消息后回到这里刷新。
        </div>
      )}

      {totals && rows.length > 0 && (
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6,
          padding: "10px 2px 4px",
        }}>
          {[
            { label: "请求", value: totals.count },
            { label: "prompt", value: totals.prompt },
            { label: "completion", value: totals.completion },
            { label: "cached·read", value: totals.cached },
            { label: "cache·write", value: totals.cacheWrite },
            { label: "cache·create", value: totals.cacheCreate },
          ].map((t) => (
            <div key={t.label} style={{
              background: "var(--warm-white)", ...{ border: "1px solid var(--paper-edge)" },
              borderRadius: 10, padding: "7px 10px",
            }}>
              <div className="f-display" style={{ fontSize: 8.5, letterSpacing: "0.12em", color: "var(--ink-soft)", textTransform: "uppercase" }}>
                {t.label}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginTop: 3 }}>
                {t.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {rows && rows.map((r) => (
        <div key={r.id} style={{
          marginTop: 8, padding: "11px 12px",
          background: "var(--warm-white)", borderRadius: 12,
          border: "1px solid var(--paper-edge)",
        }}>
          {/* 行 1：时间 / session / client / model */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span className="f-italic-en" style={{ fontSize: 11, color: "var(--ink-soft)", opacity: 0.8 }}>
              {fmtTime(r.created_at)}
            </span>
            <span style={{ fontSize: 11, color: "var(--ink-soft)" }}>#{r.session_id}</span>
            <ClientBadge client={r.client} />
            <span style={{ marginLeft: "auto", fontSize: 10.5, color: "var(--ink-soft)", opacity: 0.75, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {r.model}
            </span>
          </div>

          {/* 行 2：真实 usage */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4, marginBottom: 6 }}>
            {[
              ["prompt", r.prompt_tokens],
              ["completion", r.completion_tokens],
              ["cached", r.cached_tokens],
              ["total", r.total_tokens],
            ].map(([label, v]) => (
              <div key={label}>
                <div className="f-display" style={{ fontSize: 8, letterSpacing: "0.1em", color: "var(--ink-soft)", textTransform: "uppercase" }}>
                  {label}
                </div>
                <div style={{ fontSize: 13, color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>
                  <Num v={v} />
                </div>
              </div>
            ))}
          </div>

          {/* 行 3：三段视图 hit/write/uncached + 估算差异 */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
            {r.prompt_tokens != null && (() => {
              const read = r.cached_tokens || 0;
              const write = r.cache_write_tokens || 0;
              const uncached = (r.prompt_tokens || 0) - read - write;
              return (
                <span className="f-italic-en" style={{ fontSize: 10.5, color: "var(--ink-soft)" }}>
                  <span style={{ color: "#5B7A62" }}>hit {read.toLocaleString()}</span>
                  {" · "}
                  <span style={{ color: "#A0704A" }}>write {write.toLocaleString()}</span>
                  {" · "}
                  <span style={{ opacity: 0.7 }}>uncached {uncached.toLocaleString()}</span>
                </span>
              );
            })()}
            {r.cache_read_input_tokens != null && (
              <span className="f-italic-en" style={{ fontSize: 10.5, color: "#5B7A62" }}>
                read {r.cache_read_input_tokens.toLocaleString()}
              </span>
            )}
            {r.cache_creation_input_tokens != null && (
              <span className="f-italic-en" style={{ fontSize: 10.5, color: "var(--ink-soft)", opacity: 0.7 }}>
                create {r.cache_creation_input_tokens.toLocaleString()}
              </span>
            )}
            {r.estimated_tokens != null && (
              <span className="f-italic-en" style={{ fontSize: 10.5, color: "var(--ink-soft)", opacity: 0.7 }}>
                est {r.estimated_tokens.toLocaleString()} · trimmed {r.trimmed_turns || 0}
              </span>
            )}
            {r.tool_rounds > 1 && (
              <span className="f-italic-en" style={{ fontSize: 10.5, color: "var(--ink-soft)", opacity: 0.7 }}>
                {r.tool_rounds} rounds
              </span>
            )}
          </div>

          {/* 行 4：Context Assembly 诊断（仅 angel） */}
          {r.history_turns != null && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              borderTop: "1px solid var(--paper-edge)", paddingTop: 7,
            }}>
              <span style={{ fontSize: 10.5, color: "var(--ink-soft)" }}>
                H{r.history_turns} F{r.frozen_turns} L{r.live_turns}
                {r.middle_raw_turns != null && r.middle_raw_turns > 0 ? ` M${r.middle_raw_turns}` : ""}
              </span>
              <span style={{
                fontSize: 10, padding: "1px 6px", borderRadius: 999,
                color: r.summary_present ? "#5B7A62" : "#8A7E6E",
                background: r.summary_present ? "rgba(122,157,120,0.14)" : "rgba(138,126,110,0.1)",
                fontFamily: "var(--serif-body)",
              }}>
                {r.summary_present
                  ? `summary ${r.summary_from}~${r.summary_to}`
                  : "no summary"}
              </span>
              <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--ink-soft)", opacity: 0.7, fontFamily: "monospace" }}>
                {shortHash(r.frozen_prefix_hash)}
              </span>
            </div>
          )}
        </div>
      ))}
    </PageShell>
  );
}
