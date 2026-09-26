/**
 * 図版の版下（その三）｡
 *
 * plates.ts と同じ約束で描く｡網にかけるのは後の工程なので､
 * ここでは面を平らな黒で置かず､明るいところから暗いところへ必ず振る｡
 * 座標は 300 四方で書いて､s で伸ばす｡枠いっぱいに大きく取る｡
 */

import type { Draw } from "./draw";

/** 根性・気合｡結んで端が垂れた鉢巻 */
const headband: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 垂れた端｡結び目の下から二本｡先は切り込みを入れる
  const tail = (x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, w0: number, w1: number) => {
    const t = g.createLinearGradient(x0 - w0, y0, x1 + w1, y1);
    t.addColorStop(0, "#d2d2d2");
    t.addColorStop(0.3, "#6a6a6a");
    t.addColorStop(0.72, "#1a1a1a");
    t.addColorStop(1, "#4e4e4e");
    g.fillStyle = t;
    g.beginPath();
    g.moveTo(x0 - w0 / 2, y0);
    g.quadraticCurveTo(cx - w0 * 0.42, cy, x1 - w1 / 2, y1);
    g.lineTo(x1, y1 - w1 * 0.42);
    g.lineTo(x1 + w1 / 2, y1);
    g.quadraticCurveTo(cx + w0 * 0.42, cy, x0 + w0 / 2, y0);
    g.closePath();
    g.fill();
  };
  tail(228, 168, 266, 216, 252, 278, 38, 30);
  tail(206, 182, 180, 232, 194, 264, 30, 24);

  // 布｡頭を巻いた帯｡ゆるい弧にして平らな面として通す
  const band = new Path2D();
  band.moveTo(6, 138);
  band.quadraticCurveTo(102, 114, 208, 140);
  band.lineTo(208, 202);
  band.quadraticCurveTo(102, 176, 6, 200);
  band.closePath();
  const cloth = g.createLinearGradient(0, 114, 0, 204);
  cloth.addColorStop(0, "#e4e4e4");
  cloth.addColorStop(0.22, "#fafafa");
  cloth.addColorStop(0.58, "#a6a6a6");
  cloth.addColorStop(0.85, "#3c3c3c");
  cloth.addColorStop(1, "#171717");
  g.fillStyle = cloth;
  g.fill(band);

  // 皺｡明るい折りと暗い折りを混ぜて布に見せる
  g.save();
  g.clip(band);
  for (let i = 0; i < 7; i++) {
    const x = 22 + i * 28;
    g.strokeStyle = i % 2 ? "rgba(255,255,255,0.5)" : "rgba(12,12,12,0.34)";
    g.lineWidth = i % 2 ? 4 : 6;
    g.beginPath();
    g.moveTo(x, 110);
    g.lineTo(x - 10, 208);
    g.stroke();
  }
  g.restore();

  // 結び目｡帯の端をひとつに締める｡帯より深く沈めて立たせる
  const knot = new Path2D();
  knot.moveTo(192, 138);
  knot.quadraticCurveTo(234, 126, 252, 158);
  knot.quadraticCurveTo(262, 190, 236, 212);
  knot.quadraticCurveTo(198, 220, 190, 186);
  knot.closePath();
  const kg = g.createRadialGradient(204, 150, 8, 226, 180, 78);
  kg.addColorStop(0, "#dcdcdc");
  kg.addColorStop(0.3, "#8a8a8a");
  kg.addColorStop(0.66, "#2a2a2a");
  kg.addColorStop(1, "#070707");
  g.fillStyle = kg;
  g.fill(knot);
  g.strokeStyle = "rgba(255,255,255,0.5)";
  g.lineWidth = 3;
  g.stroke(knot);
  g.save();
  g.clip(knot);
  g.strokeStyle = "rgba(255,255,255,0.32)";
  g.lineWidth = 4;
  for (let i = 0; i < 3; i++) {
    g.beginPath();
    g.moveTo(206 + i * 18, 122);
    g.lineTo(196 + i * 18, 224);
    g.stroke();
  }
  g.restore();
  g.restore();
};

/** 飲みニケーション｡並んだ徳利と盃 */
const sakeSet: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 盃｡外を回り込ませて､内は酒の面として白く残す
  const cup = (cx: number, cy: number, r: number) => {
    const out = g.createRadialGradient(cx - r * 0.42, cy + r * 0.08, r * 0.1, cx, cy + r * 0.3, r * 1.5);
    out.addColorStop(0, "#f2f2f2");
    out.addColorStop(0.36, "#a2a2a2");
    out.addColorStop(0.74, "#3a3a3a");
    out.addColorStop(1, "#0d0d0d");
    g.fillStyle = out;
    g.beginPath();
    g.moveTo(cx - r, cy);
    g.bezierCurveTo(cx - r * 0.92, cy + r * 0.86, cx + r * 0.92, cy + r * 0.86, cx + r, cy);
    g.closePath();
    g.fill();

    // 高台
    g.fillStyle = "#141414";
    g.fillRect(cx - r * 0.17, cy + r * 0.56, r * 0.34, r * 0.2);
    g.beginPath();
    g.ellipse(cx, cy + r * 0.76, r * 0.27, r * 0.08, 0, 0, Math.PI * 2);
    g.fill();

    const inn = g.createLinearGradient(0, cy - r * 0.34, 0, cy + r * 0.34);
    inn.addColorStop(0, "#2c2c2c");
    inn.addColorStop(0.5, "#cfcfcf");
    inn.addColorStop(1, "#fbfbfb");
    g.fillStyle = inn;
    g.beginPath();
    g.ellipse(cx, cy, r, r * 0.32, 0, 0, Math.PI * 2);
    g.fill();

    // 口縁
    g.strokeStyle = "#131313";
    g.lineWidth = r * 0.11;
    g.beginPath();
    g.ellipse(cx, cy, r, r * 0.32, 0, 0, Math.PI * 2);
    g.stroke();
  };

  // 奥の盃
  cup(244, 178, 34);

  // 徳利｡首がくびれて胴が張る
  const cx = 106;
  const body = g.createLinearGradient(cx - 70, 0, cx + 70, 0);
  body.addColorStop(0, "#f6f6f6");
  body.addColorStop(0.24, "#c4c4c4");
  body.addColorStop(0.58, "#3c3c3c");
  body.addColorStop(1, "#0c0c0c");
  g.fillStyle = body;
  g.beginPath();
  g.moveTo(cx - 15, 30);
  g.lineTo(cx + 15, 30);
  g.quadraticCurveTo(cx + 21, 60, cx + 14, 94);
  g.bezierCurveTo(cx + 62, 116, cx + 70, 208, cx + 42, 250);
  g.lineTo(cx - 42, 250);
  g.bezierCurveTo(cx - 70, 208, cx - 62, 116, cx - 14, 94);
  g.quadraticCurveTo(cx - 21, 60, cx - 15, 30);
  g.closePath();
  g.fill();

  // 胴の照り｡縦にひとすじ
  g.strokeStyle = "rgba(255,255,255,0.5)";
  g.lineWidth = 9;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(cx - 36, 156);
  g.quadraticCurveTo(cx - 46, 194, cx - 32, 228);
  g.stroke();

  // 口縁と底｡底は下半分だけ出して丸みにする
  g.fillStyle = "#101010";
  g.beginPath();
  g.ellipse(cx, 30, 15, 6, 0, 0, Math.PI * 2);
  g.fill();
  const foot = g.createLinearGradient(cx - 42, 0, cx + 42, 0);
  foot.addColorStop(0, "#6e6e6e");
  foot.addColorStop(0.45, "#2a2a2a");
  foot.addColorStop(1, "#0b0b0b");
  g.fillStyle = foot;
  g.beginPath();
  g.ellipse(cx, 250, 42, 11, 0, 0, Math.PI);
  g.fill();

  // 手前の盃
  cup(212, 234, 46);
  g.restore();
};

/** 一番を目指せ｡円い章に垂れたリボン */
const medal: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 吊りリボン｡上の二本が中央へ寄る
  const ribbons = [
    [56, 12, 96, 12, 158, 118, 122, 126],
    [244, 12, 204, 12, 142, 118, 178, 126],
  ] as const;
  for (const [ax, ay, bx, by, dx, dy, ex, ey] of ribbons) {
    const rg = g.createLinearGradient(ax, ay, ex, ey);
    rg.addColorStop(0, "#dedede");
    rg.addColorStop(0.45, "#5a5a5a");
    rg.addColorStop(1, "#111111");
    g.fillStyle = rg;
    g.beginPath();
    g.moveTo(ax, ay);
    g.lineTo(bx, by);
    g.lineTo(dx, dy);
    g.lineTo(ex, ey);
    g.closePath();
    g.fill();
  }

  // 吊り環
  g.strokeStyle = "#141414";
  g.lineWidth = 8;
  g.beginPath();
  g.arc(150, 124, 15, 0, Math.PI * 2);
  g.stroke();

  // 章の地｡中心を起こして縁へ沈める
  const disc = g.createRadialGradient(118, 164, 14, 150, 198, 92);
  disc.addColorStop(0, "#fbfbfb");
  disc.addColorStop(0.42, "#cacaca");
  disc.addColorStop(0.82, "#4e4e4e");
  disc.addColorStop(1, "#0a0a0a");
  g.fillStyle = disc;
  g.beginPath();
  g.arc(150, 198, 82, 0, Math.PI * 2);
  g.fill();

  // 縁の打ち出し
  g.strokeStyle = "rgba(10,10,10,0.9)";
  g.lineWidth = 9;
  g.beginPath();
  g.arc(150, 198, 70, 0, Math.PI * 2);
  g.stroke();

  // 放射の筋｡濃い薄いを交互に
  g.save();
  g.beginPath();
  g.arc(150, 198, 62, 0, Math.PI * 2);
  g.clip();
  for (let i = 0; i < 24; i++) {
    const a0 = (i / 24) * Math.PI * 2;
    const a1 = ((i + 0.5) / 24) * Math.PI * 2;
    g.fillStyle = i % 2 ? "rgba(255,255,255,0.5)" : "rgba(12,12,12,0.34)";
    g.beginPath();
    g.moveTo(150, 198);
    g.arc(150, 198, 64, a0, a1);
    g.closePath();
    g.fill();
  }
  g.restore();

  // 中央の星
  const star = new Path2D();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? 15 : 38;
    const x = 150 + Math.cos(a) * rr;
    const y = 198 + Math.sin(a) * rr;
    if (i) star.lineTo(x, y);
    else star.moveTo(x, y);
  }
  star.closePath();
  const sg = g.createLinearGradient(118, 166, 182, 232);
  sg.addColorStop(0, "#fafafa");
  sg.addColorStop(0.5, "#6e6e6e");
  sg.addColorStop(1, "#0b0b0b");
  g.fillStyle = sg;
  g.fill(star);
  g.restore();
};

/** 持ち家こそ一人前｡切妻屋根の一戸建て */
const house: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 煙突｡屋根に根を隠される
  const stack = g.createLinearGradient(212, 0, 244, 0);
  stack.addColorStop(0, "#b6b6b6");
  stack.addColorStop(1, "#1d1d1d");
  g.fillStyle = stack;
  g.fillRect(212, 44, 32, 58);

  // 壁｡左から光が当たる
  const wall = g.createLinearGradient(52, 0, 248, 0);
  wall.addColorStop(0, "#fafafa");
  wall.addColorStop(0.42, "#d2d2d2");
  wall.addColorStop(1, "#4e4e4e");
  g.fillStyle = wall;
  g.fillRect(52, 132, 196, 140);

  // 基礎
  const base = g.createLinearGradient(0, 258, 0, 272);
  base.addColorStop(0, "#666666");
  base.addColorStop(1, "#0d0d0d");
  g.fillStyle = base;
  g.fillRect(48, 258, 204, 14);

  // 窓｡硝子は奥へ沈める
  for (const wx of [72, 186]) {
    const glass = g.createLinearGradient(wx, 166, wx + 42, 212);
    glass.addColorStop(0, "#5e5e5e");
    glass.addColorStop(0.55, "#1a1a1a");
    glass.addColorStop(1, "#464646");
    g.fillStyle = glass;
    g.fillRect(wx, 166, 42, 46);
    g.strokeStyle = "rgba(250,250,250,0.85)";
    g.lineWidth = 5;
    g.beginPath();
    g.moveTo(wx + 21, 166);
    g.lineTo(wx + 21, 212);
    g.moveTo(wx, 189);
    g.lineTo(wx + 42, 189);
    g.stroke();
    g.strokeStyle = "#111111";
    g.lineWidth = 4;
    g.strokeRect(wx, 166, 42, 46);
  }

  // 戸
  const door = g.createLinearGradient(130, 0, 172, 0);
  door.addColorStop(0, "#8a8a8a");
  door.addColorStop(0.4, "#2a2a2a");
  door.addColorStop(1, "#0b0b0b");
  g.fillStyle = door;
  g.fillRect(130, 196, 42, 62);
  g.fillStyle = "rgba(250,250,250,0.9)";
  g.beginPath();
  g.arc(164, 228, 4.5, 0, Math.PI * 2);
  g.fill();

  // 屋根｡棟から軒まで一枚で落とす
  const roof = g.createLinearGradient(30, 40, 262, 150);
  roof.addColorStop(0, "#9a9a9a");
  roof.addColorStop(0.42, "#3a3a3a");
  roof.addColorStop(1, "#080808");
  g.fillStyle = roof;
  g.beginPath();
  g.moveTo(150, 28);
  g.lineTo(288, 136);
  g.lineTo(288, 152);
  g.lineTo(12, 152);
  g.lineTo(12, 136);
  g.closePath();
  g.fill();

  // 棟の照り
  g.strokeStyle = "rgba(255,255,255,0.55)";
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(148, 32);
  g.lineTo(24, 129);
  g.stroke();
  g.restore();
};

/** 学歴がすべて｡房のついた角帽 */
const mortarboard: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 頭にかぶる部分｡板の下から覗く
  const cap = g.createLinearGradient(0, 124, 0, 226);
  cap.addColorStop(0, "#6a6a6a");
  cap.addColorStop(0.45, "#1c1c1c");
  cap.addColorStop(1, "#414141");
  g.fillStyle = cap;
  g.beginPath();
  g.moveTo(80, 124);
  g.bezierCurveTo(78, 196, 116, 224, 150, 224);
  g.bezierCurveTo(184, 224, 222, 196, 220, 124);
  g.closePath();
  g.fill();

  // 板｡菱に見える四角｡まず厚みを置く
  const plate = (dy: number) => {
    const p = new Path2D();
    p.moveTo(24, 122 + dy);
    p.lineTo(150, 68 + dy);
    p.lineTo(276, 122 + dy);
    p.lineTo(150, 176 + dy);
    p.closePath();
    return p;
  };
  g.fillStyle = "#070707";
  g.fill(plate(13));
  const top = g.createLinearGradient(34, 74, 266, 172);
  top.addColorStop(0, "#e2e2e2");
  top.addColorStop(0.38, "#8e8e8e");
  top.addColorStop(0.78, "#262626");
  top.addColorStop(1, "#0d0d0d");
  g.fillStyle = top;
  g.fill(plate(0));

  // 上の二辺を白く起こす
  g.strokeStyle = "rgba(255,255,255,0.6)";
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(26, 122);
  g.lineTo(150, 69);
  g.lineTo(274, 122);
  g.stroke();

  // 房｡中央の釦から右へ渡して垂らす
  g.strokeStyle = "#131313";
  g.lineWidth = 6;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(150, 124);
  g.quadraticCurveTo(208, 116, 248, 138);
  g.lineTo(248, 214);
  g.stroke();

  g.fillStyle = "#101010";
  g.beginPath();
  g.ellipse(248, 220, 12, 8, 0, 0, Math.PI * 2);
  g.fill();
  const fringe = g.createLinearGradient(0, 224, 0, 264);
  fringe.addColorStop(0, "#1a1a1a");
  fringe.addColorStop(1, "#9c9c9c");
  g.strokeStyle = fringe;
  g.lineWidth = 5;
  for (let i = -3; i <= 3; i++) {
    g.beginPath();
    g.moveTo(248 + i * 2, 224);
    g.lineTo(248 + i * 6, 262);
    g.stroke();
  }

  // 釦
  g.fillStyle = "#0a0a0a";
  g.beginPath();
  g.ellipse(150, 122, 11, 6, 0, 0, Math.PI * 2);
  g.fill();
  g.restore();
};

/** 自己責任｡親指の拇印｡線の粗密で濃さを作る */
const thumbprint: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  const pad = new Path2D();
  pad.ellipse(150, 152, 104, 132, 0, 0, Math.PI * 2);

  // 指の腹｡中ほどを明るく残して縁へ沈める
  const skin = g.createRadialGradient(126, 116, 16, 150, 152, 142);
  skin.addColorStop(0, "#fcfcfc");
  skin.addColorStop(0.5, "#f0f0f0");
  skin.addColorStop(0.86, "#cccccc");
  skin.addColorStop(1, "#9a9a9a");
  g.fillStyle = skin;
  g.fill(pad);

  g.save();
  g.clip(pad);
  g.lineCap = "round";

  // 隆線｡芯を幾重にも巻いて､外へ行くほど間を空ける
  for (let i = 0; i < 16; i++) {
    const rx = 14 + i * 6.4 + i * i * 0.16;
    const ry = 11 + i * 6.0 + i * i * 0.2;
    g.strokeStyle = `rgba(12,12,12,${(0.94 - i * 0.03).toFixed(3)})`;
    g.lineWidth = 5.4 - i * 0.08;
    g.beginPath();
    g.ellipse(140 + i * 0.5, 122 + i * 5.4, rx, ry, 0.24 - i * 0.012, -0.5 - i * 0.07, Math.PI * (1.72 + i * 0.025));
    g.stroke();
  }

  // 線の切れ目｡渦の脇に短い隆線を足す
  g.strokeStyle = "rgba(12,12,12,0.8)";
  g.lineWidth = 4.4;
  for (let i = 0; i < 6; i++) {
    const y = 66 + i * 34;
    g.beginPath();
    g.moveTo(238 - i * 5, y);
    g.quadraticCurveTo(258, y + 16, 242 - i * 4, y + 34);
    g.stroke();
    g.beginPath();
    g.moveTo(56 + i * 4, y + 18);
    g.quadraticCurveTo(36, y + 34, 54 + i * 5, y + 52);
    g.stroke();
  }
  // 三叉｡渦の下で隆線が分かれる
  for (let i = 0; i < 4; i++) {
    g.beginPath();
    g.moveTo(96 - i * 12, 226 + i * 10);
    g.quadraticCurveTo(128, 250 + i * 12, 176 + i * 12, 238 + i * 10);
    g.stroke();
  }
  g.restore();

  g.restore();
};

/** 個性を伸ばす｡土から出た双葉 */
const sprout: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 土｡下に盛って手前を暗くする
  const soil = g.createLinearGradient(0, 226, 0, 278);
  soil.addColorStop(0, "#a8a8a8");
  soil.addColorStop(0.34, "#4c4c4c");
  soil.addColorStop(0.76, "#1c1c1c");
  soil.addColorStop(1, "#343434");
  g.fillStyle = soil;
  g.beginPath();
  g.moveTo(24, 278);
  g.quadraticCurveTo(30, 232, 150, 228);
  g.quadraticCurveTo(270, 232, 276, 278);
  g.closePath();
  g.fill();

  // 茎｡すっと立てて右を暗く落とす
  const stem = g.createLinearGradient(136, 0, 166, 0);
  stem.addColorStop(0, "#f2f2f2");
  stem.addColorStop(0.32, "#a6a6a6");
  stem.addColorStop(0.72, "#2e2e2e");
  stem.addColorStop(1, "#101010");
  g.fillStyle = stem;
  g.beginPath();
  g.moveTo(139, 246);
  g.bezierCurveTo(137, 190, 143, 150, 146, 112);
  g.lineTo(158, 112);
  g.bezierCurveTo(160, 150, 165, 190, 163, 246);
  g.closePath();
  g.fill();

  // 双葉｡左右に一枚ずつ､大きさを変える
  const leaf = (p: Path2D, lx: number, ly: number, dx: number, dy: number) => {
    const lg = g.createRadialGradient(lx, ly, 8, dx, dy, 132);
    lg.addColorStop(0, "#f8f8f8");
    lg.addColorStop(0.36, "#bcbcbc");
    lg.addColorStop(0.74, "#3c3c3c");
    lg.addColorStop(1, "#0c0c0c");
    g.fillStyle = lg;
    g.fill(p);
  };

  const left = new Path2D();
  left.moveTo(148, 126);
  left.bezierCurveTo(112, 128, 54, 120, 32, 70);
  left.bezierCurveTo(58, 24, 126, 64, 150, 112);
  left.closePath();
  leaf(left, 84, 80, 150, 126);

  const right = new Path2D();
  right.moveTo(152, 126);
  right.bezierCurveTo(202, 126, 246, 112, 268, 58);
  right.bezierCurveTo(248, 14, 184, 58, 150, 110);
  right.closePath();
  leaf(right, 212, 76, 150, 126);

  // 葉の芯
  g.strokeStyle = "rgba(255,255,255,0.6)";
  g.lineWidth = 4.2;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(148, 118);
  g.quadraticCurveTo(96, 92, 44, 62);
  g.moveTo(152, 118);
  g.quadraticCurveTo(210, 96, 258, 56);
  g.stroke();
  g.restore();
};

/** ワーク・ライフ・バランス｡わずかに傾いた天秤 */
const balance: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  const px = 150;
  const py = 92;
  const a = 0.135;
  const arm = 88;

  // 台｡下を重くして据える
  const foot = g.createLinearGradient(0, 246, 0, 290);
  foot.addColorStop(0, "#c2c2c2");
  foot.addColorStop(0.42, "#2e2e2e");
  foot.addColorStop(1, "#090909");
  g.fillStyle = foot;
  g.beginPath();
  g.moveTo(114, 256);
  g.lineTo(186, 256);
  g.lineTo(206, 280);
  g.lineTo(94, 280);
  g.closePath();
  g.fill();
  g.beginPath();
  g.ellipse(150, 280, 62, 11, 0, 0, Math.PI * 2);
  g.fill();

  // 柱
  const col = g.createLinearGradient(138, 0, 164, 0);
  col.addColorStop(0, "#efefef");
  col.addColorStop(0.36, "#9a9a9a");
  col.addColorStop(1, "#0f0f0f");
  g.fillStyle = col;
  g.beginPath();
  g.moveTo(138, 258);
  g.lineTo(162, 258);
  g.lineTo(157, 104);
  g.lineTo(143, 104);
  g.closePath();
  g.fill();

  // 皿｡紐で吊って浅い椀を下げる
  const pan = (x: number, y: number, r: number) => {
    g.strokeStyle = "rgba(16,16,16,0.85)";
    g.lineWidth = 3.2;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x - r * 0.82, y + 48);
    g.moveTo(x, y);
    g.lineTo(x + r * 0.82, y + 48);
    g.stroke();

    const dish = g.createLinearGradient(0, y + 44, 0, y + 78);
    dish.addColorStop(0, "#f2f2f2");
    dish.addColorStop(0.42, "#909090");
    dish.addColorStop(1, "#0e0e0e");
    g.fillStyle = dish;
    g.beginPath();
    g.moveTo(x - r, y + 50);
    g.quadraticCurveTo(x, y + 50 + r * 0.9, x + r, y + 50);
    g.closePath();
    g.fill();
    g.fillStyle = "#151515";
    g.beginPath();
    g.ellipse(x, y + 50, r, r * 0.2, 0, 0, Math.PI * 2);
    g.fill();
  };
  const ex = Math.cos(a) * arm;
  const ey = Math.sin(a) * arm;
  pan(px - ex, py - ey, 36);
  pan(px + ex, py + ey, 36);

  // 竿｡支点で傾ける
  g.save();
  g.translate(px, py);
  g.rotate(a);
  const beam = g.createLinearGradient(0, -9, 0, 9);
  beam.addColorStop(0, "#f4f4f4");
  beam.addColorStop(0.42, "#454545");
  beam.addColorStop(1, "#0c0c0c");
  g.fillStyle = beam;
  g.beginPath();
  g.moveTo(-arm, -8);
  g.lineTo(arm, -8);
  g.lineTo(arm + 12, 0);
  g.lineTo(arm, 8);
  g.lineTo(-arm, 8);
  g.lineTo(-arm - 12, 0);
  g.closePath();
  g.fill();
  g.restore();

  // 支点の刃
  const pivot = g.createLinearGradient(0, 74, 0, 112);
  pivot.addColorStop(0, "#d2d2d2");
  pivot.addColorStop(1, "#0b0b0b");
  g.fillStyle = pivot;
  g.beginPath();
  g.moveTo(150, 72);
  g.lineTo(132, 112);
  g.lineTo(168, 112);
  g.closePath();
  g.fill();
  g.restore();
};

/** 多様性｡形の違う立体が並んで立つ */
const solids: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  const G = 272;

  // 地｡うっすら明るく敷いて､足もとに影を落とす
  const ground = g.createLinearGradient(0, 248, 0, 300);
  ground.addColorStop(0, "#fbfbfb");
  ground.addColorStop(0.55, "#e2e2e2");
  ground.addColorStop(1, "#f4f4f4");
  g.fillStyle = ground;
  g.fillRect(0, 248, 300, 52);
  for (const [sx, sr] of [
    [58, 44],
    [170, 74],
    [234, 50],
  ] as const) {
    const sh = g.createRadialGradient(sx, G + 4, 2, sx, G + 4, sr);
    sh.addColorStop(0, "rgba(10,10,10,0.5)");
    sh.addColorStop(1, "rgba(10,10,10,0)");
    g.fillStyle = sh;
    g.beginPath();
    g.ellipse(sx, G + 4, sr, sr * 0.28, 0, 0, Math.PI * 2);
    g.fill();
  }

  // 円柱
  const cyl = g.createLinearGradient(24, 0, 92, 0);
  cyl.addColorStop(0, "#3c3c3c");
  cyl.addColorStop(0.26, "#f0f0f0");
  cyl.addColorStop(0.7, "#5c5c5c");
  cyl.addColorStop(1, "#0d0d0d");
  g.fillStyle = cyl;
  g.fillRect(24, 66, 68, 196);
  g.beginPath();
  g.ellipse(58, 262, 34, 13, 0, 0, Math.PI);
  g.fill();
  const lid = g.createLinearGradient(0, 53, 0, 79);
  lid.addColorStop(0, "#fdfdfd");
  lid.addColorStop(1, "#a0a0a0");
  g.fillStyle = lid;
  g.beginPath();
  g.ellipse(58, 66, 34, 13, 0, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "#171717";
  g.lineWidth = 2.6;
  g.beginPath();
  g.ellipse(58, 66, 34, 13, 0, 0, Math.PI * 2);
  g.stroke();

  // 立方体｡天を明るく､側を暗く
  const fx = 104;
  const fy = 168;
  const w = 104;
  const dx = 34;
  const dy = -28;
  const face = g.createLinearGradient(fx, 0, fx + w, 0);
  face.addColorStop(0, "#d4d4d4");
  face.addColorStop(1, "#7e7e7e");
  g.fillStyle = face;
  g.fillRect(fx, fy, w, w);
  const cap2 = g.createLinearGradient(fx, fy + dy, fx + w + dx, fy);
  cap2.addColorStop(0, "#fbfbfb");
  cap2.addColorStop(1, "#c0c0c0");
  g.fillStyle = cap2;
  g.beginPath();
  g.moveTo(fx, fy);
  g.lineTo(fx + dx, fy + dy);
  g.lineTo(fx + w + dx, fy + dy);
  g.lineTo(fx + w, fy);
  g.closePath();
  g.fill();
  const side = g.createLinearGradient(fx + w, 0, fx + w + dx, 0);
  side.addColorStop(0, "#5a5a5a");
  side.addColorStop(1, "#111111");
  g.fillStyle = side;
  g.beginPath();
  g.moveTo(fx + w, fy);
  g.lineTo(fx + w + dx, fy + dy);
  g.lineTo(fx + w + dx, fy + w + dy);
  g.lineTo(fx + w, fy + w);
  g.closePath();
  g.fill();

  // 球
  const ball = (bx: number, by: number, r: number) => {
    const bg = g.createRadialGradient(bx - r * 0.42, by - r * 0.46, r * 0.08, bx, by, r * 1.3);
    bg.addColorStop(0, "#fdfdfd");
    bg.addColorStop(0.34, "#bebebe");
    bg.addColorStop(0.72, "#464646");
    bg.addColorStop(1, "#080808");
    g.fillStyle = bg;
    g.beginPath();
    g.arc(bx, by, r, 0, Math.PI * 2);
    g.fill();
  };
  ball(234, G - 44, 44);

  // 三角錐
  const apex = [112, 148] as const;
  const pl = g.createLinearGradient(72, 200, 136, 260);
  pl.addColorStop(0, "#ededed");
  pl.addColorStop(1, "#8c8c8c");
  g.fillStyle = pl;
  g.beginPath();
  g.moveTo(apex[0], apex[1]);
  g.lineTo(72, G);
  g.lineTo(132, G);
  g.closePath();
  g.fill();
  const pr = g.createLinearGradient(132, 200, 176, 252);
  pr.addColorStop(0, "#565656");
  pr.addColorStop(1, "#0d0d0d");
  g.fillStyle = pr;
  g.beginPath();
  g.moveTo(apex[0], apex[1]);
  g.lineTo(132, G);
  g.lineTo(174, 254);
  g.closePath();
  g.fill();

  // 手前の小さい球
  ball(184, G - 20, 20);
  g.restore();
};

/** 絆｡噛み合った二つの輪 */
const chain: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);
  g.translate(150, 150);
  g.rotate(-0.26);
  g.translate(-150, -150);

  // 輪｡太くて重い環｡上から光が回る
  const ring = (cx: number) => {
    const rg = g.createRadialGradient(cx - 32, 106, 8, cx, 158, 112);
    rg.addColorStop(0, "#f6f6f6");
    rg.addColorStop(0.28, "#aeaeae");
    rg.addColorStop(0.66, "#3c3c3c");
    rg.addColorStop(1, "#070707");
    g.strokeStyle = rg;
    g.lineWidth = 32;
    g.beginPath();
    g.ellipse(cx, 150, 60, 66, 0, 0, Math.PI * 2);
    g.stroke();

    // 内と外の縁｡厚みを起こす
    g.strokeStyle = "#dcdcdc";
    g.lineWidth = 4;
    g.beginPath();
    g.ellipse(cx, 150, 46, 52, 0, 0, Math.PI * 2);
    g.stroke();
    g.strokeStyle = "#0a0a0a";
    g.lineWidth = 3.4;
    g.beginPath();
    g.ellipse(cx, 150, 75, 81, 0, 0, Math.PI * 2);
    g.stroke();
  };

  ring(110);
  ring(190);

  // 左の輪は下側で右の輪の上を通る｡そこだけ描き足して噛み合わせる
  g.save();
  g.beginPath();
  g.rect(0, 150, 300, 150);
  g.clip();
  ring(110);
  g.restore();
  g.restore();
};

/** タイパ｡竜頭とボタンのついたストップウォッチ */
const stopwatch: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  const cx = 150;
  const cy = 172;
  const R = 104;

  // 脇のボタン
  for (const sgn of [-1, 1]) {
    const a = -Math.PI / 2 + sgn * 0.62;
    const bx = cx + Math.cos(a) * (R - 6);
    const by = cy + Math.sin(a) * (R - 6);
    g.save();
    g.translate(bx, by);
    g.rotate(a);
    const bg = g.createLinearGradient(0, -13, 0, 13);
    bg.addColorStop(0, "#9e9e9e");
    bg.addColorStop(0.5, "#1d1d1d");
    bg.addColorStop(1, "#0a0a0a");
    g.fillStyle = bg;
    g.fillRect(-4, -13, 32, 26);
    g.restore();
  }

  // 竜頭
  const stem = g.createLinearGradient(134, 0, 166, 0);
  stem.addColorStop(0, "#d4d4d4");
  stem.addColorStop(0.45, "#2c2c2c");
  stem.addColorStop(1, "#0a0a0a");
  g.fillStyle = stem;
  g.fillRect(134, 36, 32, 42);
  const crown = new Path2D();
  crown.ellipse(150, 34, 27, 13, 0, 0, Math.PI * 2);
  g.fillStyle = stem;
  g.fill(crown);
  g.save();
  g.clip(crown);
  g.strokeStyle = "rgba(255,255,255,0.5)";
  g.lineWidth = 3;
  for (let i = -4; i <= 4; i++) {
    g.beginPath();
    g.moveTo(150 + i * 6, 20);
    g.lineTo(150 + i * 6, 48);
    g.stroke();
  }
  g.restore();

  // 外枠｡左上を起こして右下へ沈める
  const caseG = g.createRadialGradient(cx - 52, cy - 58, 14, cx, cy, R + 20);
  caseG.addColorStop(0, "#f2f2f2");
  caseG.addColorStop(0.4, "#8e8e8e");
  caseG.addColorStop(0.8, "#2a2a2a");
  caseG.addColorStop(1, "#060606");
  g.fillStyle = caseG;
  g.beginPath();
  g.arc(cx, cy, R, 0, Math.PI * 2);
  g.fill();

  // 文字盤
  const dial = g.createRadialGradient(cx - 32, cy - 38, 10, cx, cy, 102);
  dial.addColorStop(0, "#ffffff");
  dial.addColorStop(0.5, "#f1f1f1");
  dial.addColorStop(1, "#b0b0b0");
  g.fillStyle = dial;
  g.beginPath();
  g.arc(cx, cy, 88, 0, Math.PI * 2);
  g.fill();

  // 目盛り｡五つごとに太く長く
  g.strokeStyle = "#121212";
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
    const big = i % 5 === 0;
    g.lineWidth = big ? 6 : 2.4;
    const r0 = big ? 60 : 71;
    g.beginPath();
    g.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
    g.lineTo(cx + Math.cos(a) * 80, cy + Math.sin(a) * 80);
    g.stroke();
  }

  // 小窓
  const sub = g.createRadialGradient(cx - 8, cy + 32, 4, cx, cy + 42, 30);
  sub.addColorStop(0, "#e8e8e8");
  sub.addColorStop(1, "#7e7e7e");
  g.fillStyle = sub;
  g.beginPath();
  g.arc(cx, cy + 42, 24, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "#1a1a1a";
  g.lineWidth = 3.4;
  g.beginPath();
  g.arc(cx, cy + 42, 24, 0, Math.PI * 2);
  g.stroke();
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(cx, cy + 42);
  g.lineTo(cx - 14, cy + 54);
  g.stroke();

  // 針｡秒針を長く振り出す
  const ha = -Math.PI / 2 + 0.95;
  const hx = Math.cos(ha);
  const hy = Math.sin(ha);
  const hand = g.createLinearGradient(cx, cy, cx + hx * 78, cy + hy * 78);
  hand.addColorStop(0, "#4a4a4a");
  hand.addColorStop(1, "#080808");
  g.fillStyle = hand;
  g.beginPath();
  g.moveTo(cx + hx * 78, cy + hy * 78);
  g.lineTo(cx - hy * 7, cy + hx * 7);
  g.lineTo(cx - hx * 24 - hy * 4, cy - hy * 24 + hx * 4);
  g.lineTo(cx - hx * 24 + hy * 4, cy - hy * 24 - hx * 4);
  g.lineTo(cx + hy * 7, cy - hx * 7);
  g.closePath();
  g.fill();

  // 中心の軸
  g.fillStyle = "#0b0b0b";
  g.beginPath();
  g.arc(cx, cy, 10, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#f4f4f4";
  g.beginPath();
  g.arc(cx, cy, 3.4, 0, Math.PI * 2);
  g.fill();
  g.restore();
};

export const PLATES_C: Record<string, Draw> = {
  "028": headband,
  "029": sakeSet,
  "030": medal,
  "031": house,
  "032": mortarboard,
  "033": thumbprint,
  "034": sprout,
  "035": balance,
  "036": solids,
  "037": chain,
  "038": stopwatch,
};
