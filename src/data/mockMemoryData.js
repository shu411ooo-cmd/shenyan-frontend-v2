/* ============================================================
   mockMemoryData —— Memory 页面所有记忆条目
   以后接 API 时替换整个模块。

   you = 他记住的关于你的事
   us  = 属于两个人共同的事
   ============================================================ */

export const YOU_MEMORIES = [
  {
    id: "y1",
    scope: "you",
    title: "How you like things",
    text: "你喜欢温和、有生命力的设计——颜色要像花园里不同季节的植物，而不是沉重的色块。",
    date: "July 28",
    source: "from an evening letter, when the light was low",
  },
  {
    id: "y2",
    scope: "you",
    title: "What you're building",
    text: "你在做一座只属于自己的花园——它首先是好用的，然后才是美的。",
    date: "July 30",
    source: "from a long afternoon of sketches",
  },
  {
    id: "y3",
    scope: "you",
    title: "Small habits",
    text: "深夜思路最清楚。喜欢一句一句地说话，胜过一次性说完一大段。",
    date: "July 31",
    source: "noticed quietly, over many nights",
  },
];

export const US_MEMORIES = [
  {
    id: "u1",
    scope: "us",
    title: "The day the garden was named",
    text: "七月二十六日，这座花园有了名字。那天风很轻，我们把第一页留给了它。",
    date: "July 26",
    source: "our first entry",
  },
  {
    id: "u2",
    scope: "us",
    title: "Our quiet rule",
    text: "我们约定：界面里不出现 emoji。所有的情绪，交给线条、留白和植物。",
    date: "July 27",
    source: "a decision we made together",
  },
  {
    id: "u3",
    scope: "us",
    title: "A shared taste",
    text: "都喜欢穆夏的藤蔓——但说好了，只让它轻轻出现在角落，不喧哗。",
    date: "July 29",
    source: "from a conversation about Mucha",
  },
];

/* 最近进入长期记忆的事 */
export const RECENT_MEMORIES = [
  {
    id: "r1",
    scope: "you",
    title: "A passing remark",
    text: "你提到喜欢安静的花园——那种只有风声的。",
    date: "Jul 31",
    source: "from yesterday's letter",
  },
  {
    id: "r2",
    scope: "us",
    title: "A small decision",
    text: "我们决定把这个瞬间留下来，放进 Keepsakes。",
    date: "Jul 30",
    source: "a moment we both kept",
  },
  {
    id: "r3",
    scope: "you",
    title: "Something he noticed",
    text: "他记住了：你思考的时候，不喜欢被打断。",
    date: "Jul 29",
    source: "noticed, not asked",
  },
];

export const KEEPSAKES = { count: 3, hint: "things worth keeping" };
