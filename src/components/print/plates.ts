/**
 * 図版の版下｡
 *
 * ここでは網のことは考えず､灰色の絵として描く｡
 * 立体感は濃淡で出しておくと､網にかけたときに刷り物の肌になる｡
 * 座標は 300 四方で書いて､s で伸ばす｡枠いっぱいに大きく取る｡
 */

type Draw = (g: CanvasRenderingContext2D, s: number) => void;

/** 仇討ち｡鞘を払った打刀 */
const katana: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.translate(s / 2, s / 2);
  g.rotate(-0.62);
  g.translate(-s / 2, -s / 2);
  g.scale(u, u);

  // 身｡刃を白く残し､鎬から棟へ落とす
  const blade = g.createLinearGradient(144, 0, 186, 0);
  blade.addColorStop(0, "#f6f6f6");
  blade.addColorStop(0.3, "#9c9c9c");
  blade.addColorStop(0.48, "#232323");
  blade.addColorStop(0.78, "#6f6f6f");
  blade.addColorStop(1, "#141414");
  g.fillStyle = blade;
  g.beginPath();
  g.moveTo(150, 16);
  g.quadraticCurveTo(178, 76, 184, 194);
  g.lineTo(147, 198);
  g.quadraticCurveTo(145, 76, 150, 16);
  g.closePath();
  g.fill();

  // 刃文
  g.strokeStyle = "rgba(255,255,255,0.9)";
  g.lineWidth = 7;
  g.beginPath();
  g.moveTo(151, 34);
  g.quadraticCurveTo(152, 110, 153, 192);
  g.stroke();

  // 鍔
  const tsuba = g.createRadialGradient(148, 196, 3, 166, 204, 48);
  tsuba.addColorStop(0, "#9a9a9a");
  tsuba.addColorStop(1, "#0f0f0f");
  g.fillStyle = tsuba;
  g.beginPath();
  g.ellipse(166, 203, 46, 14, 0.06, 0, Math.PI * 2);
  g.fill();

  // 柄
  const tsuka = g.createLinearGradient(150, 0, 184, 0);
  tsuka.addColorStop(0, "#6a6a6a");
  tsuka.addColorStop(0.5, "#131313");
  tsuka.addColorStop(1, "#525252");
  g.fillStyle = tsuka;
  g.beginPath();
  g.moveTo(152, 212);
  g.lineTo(182, 212);
  g.quadraticCurveTo(186, 256, 180, 292);
  g.lineTo(156, 292);
  g.quadraticCurveTo(150, 256, 152, 212);
  g.closePath();
  g.fill();

  // 柄巻き｡菱に交わる糸
  g.save();
  g.beginPath();
  g.moveTo(152, 212);
  g.lineTo(182, 212);
  g.quadraticCurveTo(186, 256, 180, 292);
  g.lineTo(156, 292);
  g.quadraticCurveTo(150, 256, 152, 212);
  g.closePath();
  g.clip();
  g.strokeStyle = "rgba(255,255,255,0.62)";
  g.lineWidth = 3.4;
  for (let i = -2; i < 8; i++) {
    const y = 210 + i * 13;
    g.beginPath();
    g.moveTo(144, y);
    g.lineTo(192, y + 19);
    g.stroke();
    g.beginPath();
    g.moveTo(144, y + 19);
    g.lineTo(192, y);
    g.stroke();
  }
  g.restore();

  // 柄頭
  g.fillStyle = "#0c0c0c";
  g.beginPath();
  g.ellipse(168, 292, 14, 6.5, 0, 0, Math.PI * 2);
  g.fill();
  g.restore();
};

/** 忠孝｡掛けた軸｡学校に配られて掲げられたもの */
const scroll: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 枠の地｡ごく薄く沈めて､線網が画面いっぱいに走るようにする
  const air = g.createLinearGradient(0, 0, 0, 300);
  air.addColorStop(0, "#f2f2f2");
  air.addColorStop(0.5, "#fbfbfb");
  air.addColorStop(1, "#eeeeee");
  g.fillStyle = air;
  g.fillRect(0, 0, 300, 300);

  const L = 92;
  const R = 208;

  // 表装｡まわりの裂
  const cloth = g.createLinearGradient(L, 0, R, 0);
  cloth.addColorStop(0, "#3c3c3c");
  cloth.addColorStop(0.35, "#8e8e8e");
  cloth.addColorStop(0.75, "#5a5a5a");
  cloth.addColorStop(1, "#2a2a2a");
  g.fillStyle = cloth;
  g.fillRect(L, 36, R - L, 232);

  // 本紙
  const sheet = g.createLinearGradient(0, 74, 0, 232);
  sheet.addColorStop(0, "#fdfdfd");
  sheet.addColorStop(0.55, "#f4f4f4");
  sheet.addColorStop(1, "#dcdcdc");
  g.fillStyle = sheet;
  g.fillRect(L + 13, 74, R - L - 26, 158);

  // 字並び｡細い縦の連なりにして､窓の列に見えないようにする
  g.fillStyle = "rgba(16,16,16,0.82)";
  let seed = 9;
  const next = () => ((seed = (seed * 1103515245 + 12345) >>> 0) % 1000) / 1000;
  for (let c = 0; c < 7; c++) {
    const x = R - 26 - c * 12.6;
    let y = 86 + next() * 6;
    const bottom = 86 + 132 - next() * 26;
    while (y < bottom) {
      const h = 4 + next() * 9;
      g.fillRect(x, y, 3.4, h);
      y += h + 2.6 + next() * 2.4;
    }
  }

  // 軸木（上）と軸（下）｡端に軸首を出す
  for (const [y, h, kr] of [
    [28, 12, 7],
    [262, 14, 9],
  ] as const) {
    const bar = g.createLinearGradient(0, y, 0, y + h);
    bar.addColorStop(0, "#6e6e6e");
    bar.addColorStop(0.45, "#101010");
    bar.addColorStop(1, "#4a4a4a");
    g.fillStyle = bar;
    g.fillRect(L - 14, y, R - L + 28, h);
    g.fillStyle = "#0d0d0d";
    for (const cx of [L - 14, R + 14]) {
      g.beginPath();
      g.ellipse(cx, y + h / 2, kr, h / 2 + 2, 0, 0, Math.PI * 2);
      g.fill();
    }
  }

  // 掛け緒
  g.strokeStyle = "rgba(18,18,18,0.8)";
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(L + 6, 30);
  g.quadraticCurveTo(150, 8, R - 6, 30);
  g.stroke();
  g.restore();
};

/** 衆道｡開いた扇 */
const fan: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);
  const cx = 150;
  const cy = 272;
  const a0 = Math.PI * 1.16;
  const a1 = Math.PI * 1.84;
  const R = 178;
  const r = 38;

  // 地紙｡白く残して､外へ行くほど沈める
  const face = g.createRadialGradient(cx, cy, r, cx, cy, R);
  face.addColorStop(0, "#efefef");
  face.addColorStop(0.55, "#fafafa");
  face.addColorStop(0.9, "#dcdcdc");
  face.addColorStop(1, "#9a9a9a");
  const body = new Path2D();
  body.arc(cx, cy, R, a0, a1);
  body.arc(cx, cy, r, a1, a0, true);
  body.closePath();
  g.fillStyle = face;
  g.fill(body);

  // 骨
  g.save();
  g.clip(body);
  g.strokeStyle = "rgba(14,14,14,0.92)";
  g.lineWidth = 5;
  for (let i = 0; i <= 9; i++) {
    const a = a0 + ((a1 - a0) * i) / 9;
    g.beginPath();
    g.moveTo(cx + Math.cos(a) * (r - 6), cy + Math.sin(a) * (r - 6));
    g.lineTo(cx + Math.cos(a) * (R + 6), cy + Math.sin(a) * (R + 6));
    g.stroke();
  }
  // 月｡地紙にひとつだけ図を置く
  g.fillStyle = "#121212";
  g.beginPath();
  g.arc(106, 156, 33, 0, Math.PI * 2);
  g.fill();
  g.restore();

  // 縁
  g.strokeStyle = "#101010";
  g.lineWidth = 13;
  g.beginPath();
  g.arc(cx, cy, R - 6, a0, a1);
  g.stroke();
  g.lineWidth = 7;
  g.beginPath();
  g.arc(cx, cy, r + 3, a0, a1);
  g.stroke();

  // 要
  g.fillStyle = "#0d0d0d";
  g.beginPath();
  g.arc(cx, cy, 16, 0, Math.PI * 2);
  g.fill();
  g.restore();
};

/** 隠居｡横手の急須 */
const teapot: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 注ぎ口
  g.fillStyle = "#242424";
  g.beginPath();
  g.moveTo(74, 176);
  g.quadraticCurveTo(30, 162, 14, 106);
  g.lineTo(40, 98);
  g.quadraticCurveTo(54, 148, 88, 154);
  g.closePath();
  g.fill();

  // 横手
  g.strokeStyle = "#1a1a1a";
  g.lineWidth = 19;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(230, 162);
  g.lineTo(292, 148);
  g.stroke();

  // 胴
  const body = g.createRadialGradient(112, 148, 10, 150, 190, 116);
  body.addColorStop(0, "#f2f2f2");
  body.addColorStop(0.3, "#a8a8a8");
  body.addColorStop(0.7, "#343434");
  body.addColorStop(1, "#0e0e0e");
  g.fillStyle = body;
  g.beginPath();
  g.ellipse(150, 188, 92, 74, 0, 0, Math.PI * 2);
  g.fill();

  // 蓋と摘み
  const lid = g.createLinearGradient(0, 96, 0, 128);
  lid.addColorStop(0, "#d6d6d6");
  lid.addColorStop(1, "#1a1a1a");
  g.fillStyle = lid;
  g.beginPath();
  g.ellipse(150, 116, 56, 18, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#111111";
  g.beginPath();
  g.ellipse(150, 96, 14, 10, 0, 0, Math.PI * 2);
  g.fill();

  // 湯気
  g.strokeStyle = "rgba(26,26,26,0.55)";
  g.lineWidth = 5;
  g.lineCap = "round";
  for (let i = 0; i < 2; i++) {
    const x = 34 + i * 22;
    g.beginPath();
    g.moveTo(x, 84);
    g.quadraticCurveTo(x + 16, 62, x, 42);
    g.quadraticCurveTo(x - 16, 26, x + 6, 10);
    g.stroke();
  }
  g.restore();
};

/** 家名の存続がすべて｡丸に井筒 */
const crest: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  const shade = g.createRadialGradient(112, 108, 24, 150, 150, 156);
  shade.addColorStop(0, "#6a6a6a");
  shade.addColorStop(0.55, "#1b1b1b");
  shade.addColorStop(1, "#000000");

  g.strokeStyle = shade;
  g.lineWidth = 19;
  g.beginPath();
  g.arc(150, 150, 122, 0, Math.PI * 2);
  g.stroke();

  // 井
  g.fillStyle = shade;
  const L = 88;
  const w = 18;
  for (const o of [-34, 34]) {
    g.fillRect(150 + o - w / 2, 150 - L, w, L * 2);
    g.fillRect(150 - L, 150 + o - w / 2, L * 2, w);
  }
  g.restore();
};

export const PLATES: Record<string, Draw> = {
  "001": katana,
  "002": scroll,
  "003": fan,
  "004": teapot,
  "005": crest,
};
