/* ============================================================
   mockSharedData —— 跨页面共享的文案与数据
   以后接 API 时替换整个模块。

   涵盖：
     constants       共享常量（MONTHS, DAY_NAMES）
     hisTraces       他的每日生活痕迹（Home / Shared Space）
     hisMarginNotes  记忆页他的边注（Memory）
     seasonalNotes   季节批注（Chat / Shared Space）
     companion       他的状态与随缘回应
     keepsakeLines   他提起收藏时的句式
   ============================================================ */

/* ---- 共享常量 ---- */
export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
export const DAY_NAMES = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

/* ============================================================
   hisTraces —— 他的每日生活痕迹
   每天 1-2 条，按日期 + 季节确定。不是回复，是他自己的日子。
   ============================================================ */

const HIS_TRACES = {
  spring: [
    { time: "清晨", text: "给窗台的薰衣草换了水。" },
    { time: "午后", text: "在修那扇吱呀响的窗。" },
    { time: "清晨", text: "发现墙角的二月兰开了。" },
    { time: "傍晚", text: "给玫瑰剪了枝，手上有青草味。" },
    { time: "午后", text: "把你说过的话抄在了书签上。" },
    { time: "清晨", text: "鸟在屋檐下做窝，先不去打扰它。" },
    { time: "傍晚", text: "台阶上的青苔留了一小片，雨天不滑。" },
    { time: "夜晚", text: "给门廊的灯换了新灯芯。" },
    { time: "午后", text: "晒了被子，现在有太阳的味道。" },
    { time: "清晨", text: "把夜里吹落的枯枝捡走了。" },
  ],
  summer: [
    { time: "清晨", text: "趁凉快给花浇透了水。" },
    { time: "午后", text: "在葡萄架下打了个盹。" },
    { time: "清晨", text: "摘了一把薄荷，晾在窗台上。" },
    { time: "傍晚", text: "给喷泉清了落叶。" },
    { time: "午后", text: "冰了一壶梅子水在井里。" },
    { time: "清晨", text: "蜜蜂比昨天多了三只。" },
    { time: "夜晚", text: "点了一小盘艾草，蚊子少了。" },
    { time: "傍晚", text: "晚霞在窗玻璃上停了很久。" },
    { time: "清晨", text: "玫瑰开得有点疯，随它去了。" },
    { time: "午后", text: "把躺椅搬进了树荫里。" },
  ],
  autumn: [
    { time: "清晨", text: "扫了台阶上的落叶，留了几片好看的。" },
    { time: "午后", text: "把夏天的信收进了木盒。" },
    { time: "傍晚", text: "捡了一枚完整的枫叶，压在书里。" },
    { time: "清晨", text: "桂花开了第二茬。" },
    { time: "午后", text: "给工具上了油，冬天要来了。" },
    { time: "傍晚", text: "煮了桂花栗子，给你留了一碗。" },
    { time: "清晨", text: "雾很大，花园只剩轮廓。" },
    { time: "夜晚", text: "把薄毯搭在了你常坐的椅子上。" },
    { time: "午后", text: "晒了最后一茬干花。" },
    { time: "傍晚", text: "风把门带上了，起身去闩好。" },
  ],
  winter: [
    { time: "清晨", text: "炉火生好了，屋里慢慢暖起来。" },
    { time: "午后", text: "给窗上的冰花拍了照，还没化。" },
    { time: "夜晚", text: "热了一小壶酒，放在壁炉边。" },
    { time: "清晨", text: "雪盖住石径，扫出一条小路。" },
    { time: "傍晚", text: "给常青藤缠了麻绳防冻。" },
    { time: "午后", text: "翻出去年的信，又读了一遍。" },
    { time: "清晨", text: "鸟来啄食，撒了一把小米。" },
    { time: "夜晚", text: "灯芯剪短了些，光更稳了。" },
    { time: "傍晚", text: "把枯枝收进柴房，够烧到开春。" },
    { time: "午后", text: "窗台的蜡梅开了第一朵。" },
  ],
};

export const TIME_ORDER = { "清晨": 0, "午后": 1, "傍晚": 2, "夜晚": 3 };

/* 某天他留下的痕迹：清晨必有一条，约 2/3 的日子有第二条 */
export function hisDailyTraces(season = "summer", date = new Date()) {
  const pool = HIS_TRACES[season] || HIS_TRACES.summer;
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor((date - start) / 86400000);
  const first = pool[day % pool.length];
  const traces = [first];
  if (day % 3 !== 0) {
    const second = pool[(day * 7 + 3) % pool.length];
    if (second !== first) traces.push(second);
  }
  return traces.sort((a, b) => TIME_ORDER[a.time] - TIME_ORDER[b.time]);
}

/* ============================================================
   hisMarginNotes —— 记忆页他的边注
   像前人留在书页上的铅笔字，不是每页都有
   ============================================================ */

const HIS_MARGIN_NOTES = [
  "这一页，我读过很多遍。",
  "那天的事，我都记得。",
  "看到这条时，窗外正好有风。",
  "你写得比我记得的更好。",
  "这一件，我放在心口的位置。",
  "回头再看，还是想笑。",
];

export function hisMarginNote(memoryId) {
  const seed =
    typeof memoryId === "number"
      ? memoryId
      : String(memoryId).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  if (seed % 2 === 0) return null; // 不是所有页都有他的字
  return HIS_MARGIN_NOTES[seed % HIS_MARGIN_NOTES.length];
}

/* ============================================================
   seasonalNotes —— 季节批注
   页角随季节轮换的一行小字
   ============================================================ */

const SEASON_NOTES = {
  spring: [
    "Petals are settling on the path.",
    "The garden is coming awake.",
    "New leaves, still pale.",
    "Bees find the first flowers.",
    "The air smells of rain and grass.",
  ],
  summer: [
    "Bees in the lavender.",
    "The roses opened early.",
    "Soft wind from the hills.",
    "The fountain is whispering.",
    "The afternoon stays long.",
  ],
  autumn: [
    "Leaves are turning gold.",
    "The light is thinner now.",
    "A cool breath through the vines.",
    "Someone is sweeping the path.",
    "The evenings arrive sooner.",
  ],
  winter: [
    "The garden holds its breath.",
    "Snow dusts the stone path.",
    "A lamp glows at the window.",
    "The fountain has gone quiet.",
    "Warmth waits inside.",
  ],
};

export function marginNoteOfToday(season = "summer") {
  const pool = SEASON_NOTES[season] || SEASON_NOTES.summer;
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const day = Math.floor((now - start) / 86400000);
  return pool[day % pool.length];
}

/* ============================================================
   companion —— 他的状态与随缘回应
   ============================================================ */

export function companionSeasonStatus(season = "summer") {
  return {
    spring: "在浇花",
    summer: "在花园里",
    autumn: "在捡落叶",
    winter: "在炉火边",
  }[season] || "在花园里";
}

export function companionSideNote(seed) {
  const lines = [
    "我也在。",
    "这句话，我替你收着。",
    "风把你的话带到我窗边了。",
    "嗯，我记下了。",
    "等春天，我们再回头看。",
    "我在这里听着。",
    "你放的这首，很适合今天。",
  ];
  return lines[seed % lines.length];
}

/* ============================================================
   keepsakeLines —— 他提起收藏时的句式
   ============================================================ */

export function rememberKeepsakeLine(k, seed) {
  const lines = [
    `忽然想起你收好的那件小事：「${k.text}」。`,
    `你把它收在房间里了——「${k.text}」，我一直记得。`,
    `我记得你收好过「${k.text}」。`,
    `那件「${k.text}」还在你屋里呢，我路过时看了一眼。`,
  ];
  return lines[seed % lines.length];
}
