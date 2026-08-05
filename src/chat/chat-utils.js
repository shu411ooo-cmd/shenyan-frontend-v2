/* ============================================================
   Chat 工具 —— 纯工具函数
   所有文案/数据已迁移至 src/data/mockSharedData.js
   ============================================================ */

/* ---- 重导出：来自 mockSharedData 的数据，保持旧 import 路径不报错 ---- */
export {
  hisDailyTraces,
  hisMarginNote,
  marginNoteOfToday,
  companionSeasonStatus,
  companionSideNote,
  rememberKeepsakeLine,
  TIME_ORDER,
} from "../data/mockSharedData.js";

/* ============================================================
   纯工具函数
   ============================================================ */

/* 时刻标签：清晨/午后/傍晚/夜晚 */
export function partOfDay(ts) {
  const h = new Date(ts).getHours();
  if (h < 12) return "清晨";
  if (h < 14) return "午后";
  if (h < 18) return "傍晚";
  return "夜晚";
}

/* YYYY-MM-DD */
export function dayKeyOf(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/* 章节日期标签：JULY 26 · SUNDAY */
export function todayChapterLabel() {
  const months = ["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];
  const days = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
  const d = new Date();
  return `${months[d.getMonth()]} ${d.getDate()} · ${days[d.getDay()]}`;
}

export function seasonOfNow() {
  const m = new Date().getMonth();
  if (m >= 2 && m <= 4) return "spring";
  if (m >= 5 && m <= 7) return "summer";
  if (m >= 8 && m <= 10) return "autumn";
  return "winter";
}

/* 当前时刻标签：午后 3:12 */
export function nowTimeLabel() {
  const d = new Date();
  const h = d.getHours();
  const mm = String(d.getMinutes()).padStart(2, "0");
  const part = h < 12 ? "清晨" : h < 14 ? "午后" : h < 18 ? "傍晚" : "夜晚";
  return `${part} ${h % 12 || 12}:${mm}`;
}

/* 流式单元：≤3 段 → 逐句；>3 段 → 逐段
   每单元 { text, br }，br=true 时换段落 */
export function buildUnits(text) {
  const paras = text.split("\n\n");
  const units = [];
  if (paras.length <= 3) {
    paras.forEach((p, pi) => {
      const sents = p.match(/[^。！？!?.]+[。！？!?.]?/g) || [p];
      sents.forEach((s, si) => units.push({ text: s, br: si === 0 && pi > 0 }));
    });
  } else {
    paras.forEach((p, pi) => units.push({ text: p, br: pi > 0 }));
  }
  return units;
}

/* ---- 接入真实 API 的句子缓冲器 ----
   接收 token 流，每次抽出一个完整句子。
   剩余的残缺片段留在 buffer 里继续累积。 */
export function extractNextSentence(buf) {
  const m = buf.match(/^[^。！？!?.…~\n]+(?:[。！？!?.…~]|\n\n)+/);
  return m ? m[0] : null;
}
