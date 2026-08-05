/* ============================================================
   mockMomentsData —— Moments 页面所有文案与标签
   以后接 API 时替换整个模块，UI 组件不动。

   涵盖：
     moodTags     心情选项
     daySummary   当日摘要文案
     monthSummary 月度统计文案
     labels       静态标签
   ============================================================ */

/* ---- 心情选项 ---- */
export const MOOD_TAGS = [
  { word: "Quiet", leaf: "var(--leaf)" },
  { word: "Warm", leaf: "#C9A0A4" },
  { word: "Hopeful", leaf: "var(--leaf)" },
  { word: "Missing You", leaf: "#C9A0A4" },
  { word: "Peaceful", leaf: "var(--leaf)" },
  { word: "Growing", leaf: "var(--leaf)" },
];

/* ---- 当日摘要：由 notes / photos 数量生成 ---- */
export function getDaySummary(noteCount, photoCount) {
  const parts = [];
  if (noteCount) parts.push(`${noteCount} 张纸条`);
  if (photoCount) parts.push(`${photoCount} 张照片`);
  return parts.length
    ? `这一天收好了 ${parts.join("、")}。`
    : "这一天还很安静，等你写下第一句。";
}

/* ---- 月度统计 ---- */
export function getMonthSummary(noteCount, photoCount) {
  if (noteCount + photoCount === 0) return "这个月还没有留下什么。";
  const parts = [];
  if (noteCount) parts.push(`${noteCount} 张纸条`);
  if (photoCount) parts.push(`${photoCount} 张照片`);
  return `这个月留下了 ${parts.join("、")}。`;
}

/* ---- 静态标签 ---- */
export const MOMENTS_LABELS = {
  paperNotes: "PAPER NOTES",
  photos: "PHOTOS",
  monthKept: (month) => `${month.toUpperCase()}, KEPT.`,
  mood: "mood",
  addNote: "Add a note",
  addPhoto: "Add a photo",
  setMood: "Set mood",
  voiceMemo: "Voice memo",
  linkMemory: "Link a memory",
};
