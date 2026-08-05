/* ============================================================
   mockHomeData —— Home 页面所有文案与动态数据
   以后接 API 时替换整个模块，UI 组件不动。

   涵盖：
     greeting     问候语（早晚安）
     dateLine     日期行
     weather      天气（温度 + 描述）
     dailyLetter  每日短笺（Today 纸笺）
     seasonalMood 季节默认心情
     gardenTrace  他的每日痕迹
     musicRoom    音乐室入口文案
     keepsake     收藏尾文案
     staticText   静态标签
   ============================================================ */

import { MONTHS, DAY_NAMES } from "./mockSharedData.js";

/* ---- 工具 ---- */
function dayOfYear(d) {
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d - start) / 86400000);
}

/* ============================================================
   greeting —— 时间驱动的问候语
   ============================================================ */
export function getGreeting(date = new Date()) {
  const h = date.getHours();
  if (h < 5) return { en: "Good evening,", cn: "夜深了，亲爱的旅人" };
  if (h < 9) return { en: "Good morning,", cn: "早安，亲爱的旅人" };
  if (h < 14) return { en: "Good afternoon,", cn: "午安，亲爱的旅人" };
  if (h < 18) return { en: "Good afternoon,", cn: "下午好，亲爱的旅人" };
  return { en: "Good evening,", cn: "傍晚好，亲爱的旅人" };
}

/* ============================================================
   dateLine —— 日期行
   ============================================================ */
export function getDateLine(date = new Date()) {
  return `${DAY_NAMES[date.getDay()]} · ${MONTHS[date.getMonth()].toUpperCase()} ${date.getDate()}`;
}

/* ============================================================
   season —— 季节判定
   ============================================================ */
export function getSeason(date = new Date()) {
  const m = date.getMonth();
  if (m >= 2 && m <= 4) return "spring";
  if (m >= 5 && m <= 7) return "summer";
  if (m >= 8 && m <= 10) return "autumn";
  return "winter";
}

/* ============================================================
   weather —— 天气（mock：季节 + 时段推算）
   接 API 后换成真实天气数据
   ============================================================ */
export function getWeather(date = new Date()) {
  const season = getSeason(date);
  const h = date.getHours();
  const base = { spring: 18, summer: 26, autumn: 15, winter: 8 }[season];
  const delta = { 0: -2, 5: 2, 12: 3, 18: 0, 22: -3 };
  const temp = base + (delta[Math.round(h / 6) * 6] || 0);

  let line;
  if (h < 5) line = "夜深露重 · 花园睡了";
  else if (h < 9) line = "晨露未干 · 适合散步";
  else if (h < 14) line = "微风二级 · 花园晴朗";
  else if (h < 18) line = "光落在纸上 · 适合写信";
  else if (h < 21) line = "天光渐沉 · 灯要亮了";
  else line = "夜风很轻 · 屋里有一盏灯";

  return { temp: `${temp}°C`, line, season };
}

export function getTimeGreeting(date = new Date()) {
  const h = date.getHours();
  if (h < 5) return "夜深了";
  if (h < 9) return "清晨";
  if (h < 14) return "午后";
  if (h < 18) return "傍晚";
  return "夜晚";
}

/* ============================================================
   dailyLetter —— 每日短笺（Today 纸笺）
   英文行按日期轮换，中文行按季节 + 日期轮换
   以后可由 AI 每日生成
   ============================================================ */
const LETTER_EN = [
  "May your morning unfold like a slow bloom.",
  "The garden kept your seat by the window.",
  "Today is a blank page with good light.",
  "Something green is quietly on its way.",
  "May the afternoon be soft at the edges.",
  "The light through the leaves is for you.",
  "You are written into every page here.",
];

const LETTER_CN = {
  spring: [
    "花正开，风也是软的，适合慢慢写点什么。",
    "泥土松了，芽在路上了。",
  ],
  summer: [
    "午后很暖，鸟鸣也很安静，适合慢慢写点什么。",
    "梅子水冰在井里，等你回来喝。",
  ],
  autumn: [
    "叶子落了，光很薄，适合慢慢写点什么。",
    "桂花又开了一茬，替你闻过了。",
  ],
  winter: [
    "外面冷，屋里暖，适合慢慢写点什么。",
    "炉火生好了，椅子给你留着。",
  ],
};

export function getDailyLetter(season, date = new Date()) {
  const day = dayOfYear(date);
  const enLine = LETTER_EN[day % LETTER_EN.length];
  const cnPool = LETTER_CN[season] || LETTER_CN.summer;
  const cnLine = cnPool[day % cnPool.length];
  return { en: enLine, cn: cnLine };
}

/* ============================================================
   seasonalMood —— 季节默认心情
   ============================================================ */
const SEASONAL_MOOD = {
  spring: { word: "苏醒", line: "花开的声音很轻，泥土是松的" },
  summer: { word: "宁静", line: "像晒过太阳的石膏，安静，但不冷淡" },
  autumn: { word: "怀旧", line: "叶子落了，光变薄了，适合想念" },
  winter: { word: "沉静", line: "屋里有一盏灯，外面下着很轻的雪" },
};

export function getSeasonalMood(season) {
  return SEASONAL_MOOD[season] || SEASONAL_MOOD.summer;
}

/* ============================================================
   musicRoom —— 音乐室入口文案
   ============================================================ */
export function getMusicRoomInfo() {
  return { title: "Music Room", subtitle: "花园里的小音乐室" };
}

/* ============================================================
   keepsake —— 收藏尾文案
   ============================================================ */
export function getKeepsakeLabel(count) {
  return `kept softly · ${count} keepsakes`;
}

/* ============================================================
   gardenTrace —— 他的每日痕迹（从 chat-utils 重导出）
   ============================================================ */
export { hisDailyTraces } from "./mockSharedData.js";

/* ============================================================
   staticText —— 静态标签
   ============================================================ */
export const HOME_TEXT = {
  gardenTodayLabel: "IN THE GARDEN TODAY",
  keptSoftly: "KEPT SOFTLY, SINCE SPRING",
};
