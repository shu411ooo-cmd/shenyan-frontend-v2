/* Angel's Diary — 开场序列 + 主页进入动效
   原则：动效要轻，像纸页翻动；只动 transform / opacity */

(function () {
  var opening = document.getElementById("opening");
  var haloSvg = document.getElementById("haloSvg");
  var replayBtn = document.getElementById("replayBtn");
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var SVG_NS = "http://www.w3.org/2000/svg";
  var timers = [];
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  /* ---------- 粉穗子 halo：绕 medallion 一圈的干花穗 ---------- */
  var ROSE_TONES = ["#C9A0A4", "#D3AFB2", "#B98A8E", "#CDB6A8"];
  function buildHalo() {
    haloSvg.innerHTML = "";
    var cx = 160, cy = 185, a = 138, b = 172; // 环绕椭圆半径（略大于 medallion）
    var COUNT = 30;
    var GAP_START = 68, GAP_END = 112; // 底部留给火漆印的角度缺口（度）

    for (var i = 0; i < COUNT; i++) {
      var deg = (360 / COUNT) * i - 90; // 从顶部开始
      var norm = ((deg % 360) + 360) % 360;
      if (norm > GAP_START && norm < GAP_END) continue;

      var rad = (deg * Math.PI) / 180;
      var bx = cx + a * Math.cos(rad);
      var by = cy + b * Math.sin(rad);
      var tx = cx + (a + 24) * Math.cos(rad);
      var ty = cy + (b + 24) * Math.sin(rad);

      var g = document.createElementNS(SVG_NS, "g");
      g.setAttribute("class", "stem");
      var tone = ROSE_TONES[i % ROSE_TONES.length];
      var opacity = 0.45 + ((i * 37) % 30) / 100; // 0.45–0.74 之间自然抖动
      g.style.setProperty("--o", opacity.toFixed(2));
      g.style.transitionDelay = (i * 40) + "ms"; // stagger 40ms

      // 主茎：轻微弯曲
      var mx = (bx + tx) / 2 + Math.sin(rad) * 4;
      var my = (by + ty) / 2 - Math.cos(rad) * 4;
      var stem = document.createElementNS(SVG_NS, "path");
      stem.setAttribute("d", "M " + bx.toFixed(1) + " " + by.toFixed(1) +
        " Q " + mx.toFixed(1) + " " + my.toFixed(1) + " " + tx.toFixed(1) + " " + ty.toFixed(1));
      stem.setAttribute("fill", "none");
      stem.setAttribute("stroke", tone);
      stem.setAttribute("stroke-width", "1");
      stem.setAttribute("stroke-linecap", "round");
      g.appendChild(stem);

      // 穗尖绒毛：向外散开的小短线
      var outward = Math.atan2(ty - cy, tx - cx);
      for (var f = -2; f <= 2; f++) {
        var ang = outward + f * 0.34;
        var len = 7 + ((i + f + 10) % 3) * 3;
        var ex = tx + Math.cos(ang) * len;
        var ey = ty + Math.sin(ang) * len;
        var fluff = document.createElementNS(SVG_NS, "path");
        fluff.setAttribute("d", "M " + tx.toFixed(1) + " " + ty.toFixed(1) +
          " L " + ex.toFixed(1) + " " + ey.toFixed(1));
        fluff.setAttribute("fill", "none");
        fluff.setAttribute("stroke", tone);
        fluff.setAttribute("stroke-width", "1.1");
        fluff.setAttribute("stroke-linecap", "round");
        fluff.setAttribute("opacity", "0.75");
        g.appendChild(fluff);
      }

      // 小绒球
      if (i % 3 === 0) {
        var dot = document.createElementNS(SVG_NS, "circle");
        dot.setAttribute("cx", tx.toFixed(1));
        dot.setAttribute("cy", ty.toFixed(1));
        dot.setAttribute("r", "1.6");
        dot.setAttribute("fill", tone);
        g.appendChild(dot);
      }
      haloSvg.appendChild(g);
    }
  }

  /* ---------- 开场序列 ---------- */
  var PHASES = ["phase-angel", "phase-halo", "phase-seal", "phase-title"];
  var finished = false;

  function resetOpening() {
    finished = false;
    clearTimers();
    PHASES.forEach(function (p) { opening.classList.remove(p); });
    opening.classList.remove("gone");
    opening.style.display = "flex";
  }

  function finishOpening() {
    if (finished) return;
    finished = true;
    clearTimers();
    PHASES.forEach(function (p) { opening.classList.add(p); }); // 立即补全状态
    opening.classList.add("gone"); // 整体溶解淡出 600ms
    later(function () { opening.style.display = "none"; }, 620);
    enterHome();
  }

  function playOpening() {
    resetOpening();
    if (reduced) { finishOpening(); return; }
    later(function () { opening.classList.add("phase-angel"); }, 450);   // 天使缓现
    later(function () { opening.classList.add("phase-halo"); }, 1500);   // 穗子 halo 展开
    later(function () { opening.classList.add("phase-seal"); }, 2750);   // 火漆印落下
    later(function () { opening.classList.add("phase-title"); }, 3200);  // 标题浮现
    later(finishOpening, 4600);                                          // 溶解进入主页
  }

  /* ---------- 主页元素 stagger 进入 ---------- */
  function enterHome() {
    reveals.forEach(function (el) { el.classList.remove("in"); });
    reveals.forEach(function (el, i) {
      later(function () { el.classList.add("in"); }, 120 + i * 50); // stagger 50ms
    });
  }

  /* ---------- 交互 ---------- */
  opening.addEventListener("click", finishOpening); // 轻触跳过
  replayBtn.addEventListener("click", playOpening); // 重播

  /* 启动 */
  buildHalo();
  playOpening();
})();
