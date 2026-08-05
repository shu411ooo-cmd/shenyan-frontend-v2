/* ============================================================
   Chat 配置 —— 陪伴者身份 / 示例数据
   后续改名字、头像、状态，只改这一处。
   ============================================================ */

export const COMPANION = {
  name: "沈晏",
  avatar: "assets/angel-bust.png",
  alt: "沈晏",
  defaultStatus: "在花园里",
  writingStatus: "正在回信…",
  tagline: "the one who stays\nin this garden",
  nickname: "沈晏",
  statusText: "在花园里，等一封信",
  voice: "Warm / Quiet",
  personality: "gentle, observant, patient",
  model: "Claude Sonnet 4.6",
  connection: "Default garden route",
};

import { API_BASE } from "../config.js";

export const COMPANION_ADVANCED = [
  { key: "mcp", label: "MCP / Connections", value: "Garden tools" },
  { key: "api", label: "API endpoint", value: API_BASE },
];

export const MARGIN_NOTES = [
  "The garden is quiet today.",
  "A warm afternoon.",
  "Bees in the lavender.",
  "Rain on the stone path.",
  "The roses opened early.",
  "Soft wind from the hills.",
  "Dust motes in the light.",
  "Someone watered the ivy.",
  "A bird stayed for lunch.",
  "The fountain is whispering.",
  "Clouds moving slowly.",
  "Sunlight on the plaster.",
];

export const SEED_MESSAGES = [];
