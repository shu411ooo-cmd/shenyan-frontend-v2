import React, { createContext, useContext, useEffect, useState } from "react";

/* ------------------------------------------------------------
   GardenSettings —— 整座花园共享的设置
   主题 / 字体 / 季节（可钉住）/ 装饰开关
   localStorage 持久化，刷新后还在。
   ------------------------------------------------------------ */

const STORAGE_KEY = "garden-settings";

export const SEASONS = ["spring", "summer", "autumn", "winter"];
export const SEASON_LABEL = {
  spring: "Spring",
  summer: "Summer",
  autumn: "Autumn",
  winter: "Winter",
};

const DEFAULT = {
  theme: "warm",
  type: "serif",
  decor: true,
  season: "auto", // "auto" | one of SEASONS
  keepsakes: [
    { id: 1, text: "一支晒干的薰衣草", date: "Jul 26" },
    { id: 2, text: "他写的第一句话", date: "Jul 28" },
  ],
  collections: [], // 从对话里收藏的回忆：{ id, lines: [], date }
  mood: "",         // 当前心情（Moments 写，Home 读）
  dayEntries: {},   // 每天写的纸条/照片：{ "YYYY-MM-DD": { notes: [], photos: [] } }
  notes: [],        // 共同空间的小纸条：{ who, text, date }
  memoryComments: {}, // 记忆上的评论：memoryId → [{ who, text, date }]
};

const THEME_IDS = ["warm", "mist", "frost"];
const TYPE_IDS = ["serif", "manrope", "fraunces"];

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const s = { ...DEFAULT, ...JSON.parse(raw) };
      if (!THEME_IDS.includes(s.theme)) s.theme = DEFAULT.theme;
      if (!TYPE_IDS.includes(s.type)) s.type = DEFAULT.type;
      if (!SEASONS.includes(s.season) && s.season !== "auto") s.season = "auto";
      return s;
    }
  } catch (e) { /* ignore */ }
  return { ...DEFAULT };
}

function seasonOfNow() {
  const m = new Date().getMonth();
  if (m >= 2 && m <= 4) return "spring";
  if (m >= 5 && m <= 7) return "summer";
  if (m >= 8 && m <= 10) return "autumn";
  return "winter";
}

const GardenContext = createContext(null);

export function GardenProvider({ children }) {
  const [settings, setSettings] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) { /* ignore */ }
  }, [settings]);

  const set = (patch) => setSettings((s) => ({ ...s, ...patch }));

  const effectiveSeason = settings.season === "auto" ? seasonOfNow() : settings.season;

  const addKeepsake = (text) => {
    const t = String(text).trim();
    if (!t) return;
    const k = {
      id: Date.now(),
      text: t,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };
    setSettings((s) => ({ ...s, keepsakes: [...s.keepsakes, k] }));
  };

  const removeKeepsake = (id) =>
    setSettings((s) => ({ ...s, keepsakes: s.keepsakes.filter((k) => k.id !== id) }));

  const addCollection = (entry) =>
    setSettings((s) => ({ ...s, collections: [entry, ...s.collections] }));

  const removeCollection = (id) =>
    setSettings((s) => ({ ...s, collections: s.collections.filter((c) => c.id !== id) }));

  /* 每天写的东西：纸条 / 照片 */
  const addDayNote = (dateKey, text, who = "user") => {
    const t = String(text).trim();
    if (!t) return;
    setSettings((s) => ({
      ...s,
      dayEntries: {
        ...s.dayEntries,
        [dateKey]: { notes: [...(s.dayEntries[dateKey]?.notes || []), { who, text: t, ts: Date.now() }], photos: s.dayEntries[dateKey]?.photos || [], mood: s.dayEntries[dateKey]?.mood || "" },
      },
    }));
  };

  /* 每天的心情：按天存，Home 读今天的 */
  const setDayMood = (dateKey, mood) =>
    setSettings((s) => ({
      ...s,
      dayEntries: {
        ...s.dayEntries,
        [dateKey]: { notes: s.dayEntries[dateKey]?.notes || [], photos: s.dayEntries[dateKey]?.photos || [], mood },
      },
    }));

  const addDayPhoto = (dateKey, url) =>
    setSettings((s) => ({
      ...s,
      dayEntries: {
        ...s.dayEntries,
        [dateKey]: { photos: [...(s.dayEntries[dateKey]?.photos || []), url], notes: s.dayEntries[dateKey]?.notes || [] },
      },
    }));

  const addSharedNote = (text, who = "user") => {
    const t = String(text).trim();
    if (!t) return;
    const d = new Date();
    const note = {
      id: Date.now(),
      who,
      text: t,
      ts: d.getTime(),
      dayKey: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };
    setSettings((s) => ({ ...s, notes: [note, ...s.notes] }));
  };

  const addMemoryComment = (memoryId, text, who = "user") => {
    const t = String(text).trim();
    if (!t) return;
    const c = {
      id: Date.now(),
      who,
      text: t,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };
    setSettings((s) => ({
      ...s,
      memoryComments: { ...s.memoryComments, [memoryId]: [...(s.memoryComments[memoryId] || []), c] },
    }));
  };

  const value = {
    ...settings,
    effectiveSeason,
    setTheme: (theme) => set({ theme }),
    setType: (type) => set({ type }),
    setDecor: (decor) => set({ decor }),
    setSeason: (season) => set({ season }), // "auto" or pinned id
    setMood: (mood) => set({ mood }),
    addKeepsake,
    removeKeepsake,
    addCollection,
    removeCollection,
    addDayNote,
    addDayPhoto,
    setDayMood,
    addSharedNote,
    addMemoryComment,
  };

  return <GardenContext.Provider value={value}>{children}</GardenContext.Provider>;
}

export function useGarden() {
  return useContext(GardenContext);
}
