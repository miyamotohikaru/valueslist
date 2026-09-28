/**
 * 図版の版下（つづき）｡
 *
 * ここでは網のことは考えず､灰色の絵として描く｡
 * 立体感は濃淡で出しておくと､網にかけたときに刷り物の肌になる｡
 * 座標は 300 四方で書いて､s で伸ばす｡枠いっぱいに大きく取る｡
 */

import type { Draw } from "./draw";

/** 生まれで決まる｡家紋の入った箱提灯 */
const chochin: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 胴｡樽形の大きな黒｡縁まで濃く落として紙から切り離す
  const shell = new Path2D();
  shell.moveTo(110, 52);
  shell.bezierCurveTo(54, 100, 54, 208, 110, 254);
  shell.lineTo(190, 254);
  shell.bezierCurveTo(246, 208, 246, 100, 190, 52);
  shell.closePath();
  const paper = g.createLinearGradient(54, 0, 246, 0);
  paper.addColorStop(0, "#090909");
  paper.addColorStop(0.24, "#3e3e3e");
  paper.addColorStop(0.44, "#767676");
  paper.addColorStop(0.62, "#3a3a3a");
  paper.addColorStop(0.85, "#141414");
  paper.addColorStop(1, "#080808");
  g.fillStyle = paper;
  g.fill(shell);

  // 骨の段｡白く太く抜いて､黒の塊に輪をきざむ
  g.save();
  g.clip(shell);
  g.strokeStyle = "#fcfcfc";
  g.lineWidth = 10;
  for (let i = 0; i < 7; i++) {
    const y = 68 + i * 30;
    g.beginPath();
    g.moveTo(44, y);
    g.quadraticCurveTo(150, y + 11, 256, y);
    g.stroke();
  }
  g.restore();

  // 紋｡白く抜いた丸に一つ引き｡ここが的になる
  g.fillStyle = "#fcfcfc";
  g.beginPath();
  g.arc(150, 152, 48, 0, Math.PI * 2);
  g.fill();
  const mark = g.createLinearGradient(0, 138, 0, 168);
  mark.addColorStop(0, "#4a4a4a");
  mark.addColorStop(0.5, "#0b0b0b");
  mark.addColorStop(1, "#2e2e2e");
  g.fillStyle = mark;
  g.fillRect(108, 139, 84, 26);

  // 上下の輪｡提灯を締める黒い帯
  for (const [y, h, half] of [
    [28, 26, 46],
    [252, 28, 52],
  ] as const) {
    const hoop = g.createLinearGradient(150 - half, 0, 150 + half, 0);
    hoop.addColorStop(0, "#080808");
    hoop.addColorStop(0.4, "#5a5a5a");
    hoop.addColorStop(0.7, "#1e1e1e");
    hoop.addColorStop(1, "#070707");
    g.fillStyle = hoop;
    g.fillRect(150 - half, y, half * 2, h);
  }

  // 吊り手
  g.strokeStyle = "#101010";
  g.lineWidth = 11;
  g.beginPath();
  g.arc(150, 28, 22, Math.PI, Math.PI * 2);
  g.stroke();
  g.restore();
};

/** 無常観｡蝋燭の炎 */
const candle: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 炎｡外を黒く包んで芯を白く抜く
  const fire = new Path2D();
  fire.moveTo(150, 12);
  fire.bezierCurveTo(192, 58, 204, 96, 194, 122);
  fire.bezierCurveTo(184, 146, 168, 156, 150, 156);
  fire.bezierCurveTo(132, 156, 116, 146, 106, 122);
  fire.bezierCurveTo(96, 96, 108, 58, 150, 12);
  fire.closePath();
  const glow = g.createRadialGradient(150, 130, 5, 150, 106, 110);
  glow.addColorStop(0, "#ffffff");
  glow.addColorStop(0.2, "#f2f2f2");
  glow.addColorStop(0.42, "#8e8e8e");
  glow.addColorStop(0.66, "#242424");
  glow.addColorStop(1, "#070707");
  g.fillStyle = glow;
  g.fill(fire);

  // 芯
  g.fillStyle = "#0a0a0a";
  g.fillRect(144, 146, 12, 28);

  // 蝋｡細長い一本｡両の縁を濃く落として中を明るく残す
  const wax = new Path2D();
  wax.moveTo(104, 294);
  wax.lineTo(110, 180);
  wax.quadraticCurveTo(150, 168, 190, 180);
  wax.lineTo(196, 294);
  wax.closePath();
  const body = g.createLinearGradient(104, 0, 196, 0);
  body.addColorStop(0, "#0b0b0b");
  body.addColorStop(0.24, "#4e4e4e");
  body.addColorStop(0.44, "#8a8a8a");
  body.addColorStop(0.66, "#333333");
  body.addColorStop(1, "#090909");
  g.fillStyle = body;
  g.fill(wax);

  // 溶けた口｡白く抜いて炎と胴を切る
  g.fillStyle = "#f8f8f8";
  g.beginPath();
  g.ellipse(150, 178, 41, 11, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#1f1f1f";
  g.beginPath();
  g.ellipse(150, 180, 24, 6, 0, 0, Math.PI * 2);
  g.fill();

  // 垂れた蝋｡左右にひとつずつ
  g.fillStyle = "#0e0e0e";
  g.beginPath();
  g.moveTo(110, 190);
  g.quadraticCurveTo(92, 226, 102, 250);
  g.quadraticCurveTo(116, 230, 112, 190);
  g.closePath();
  g.fill();
  g.beginPath();
  g.moveTo(190, 200);
  g.quadraticCurveTo(210, 232, 200, 258);
  g.quadraticCurveTo(188, 236, 188, 200);
  g.closePath();
  g.fill();
  g.restore();
};

/** 結・講｡結んだ縄の輪 */
const rope: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  const cx = 150;
  const cy = 134;
  const R = 104;
  const w = 36;

  // 輪｡太い縄を一周させる
  const cord = g.createRadialGradient(cx - 44, cy - 46, 12, cx, cy, R + w);
  cord.addColorStop(0, "#f0f0f0");
  cord.addColorStop(0.35, "#a6a6a6");
  cord.addColorStop(0.72, "#383838");
  cord.addColorStop(1, "#0d0d0d");
  g.strokeStyle = cord;
  g.lineWidth = w;
  g.beginPath();
  g.arc(cx, cy, R, 0, Math.PI * 2);
  g.stroke();

  // 撚り｡斜めの筋を縄の幅いっぱいに渡す
  const band = new Path2D();
  band.arc(cx, cy, R + w / 2, 0, Math.PI * 2);
  band.arc(cx, cy, R - w / 2, Math.PI * 2, 0, true);
  g.save();
  g.clip(band);
  g.lineCap = "butt";
  for (let i = 0; i < 34; i++) {
    const a = (Math.PI * 2 * i) / 34;
    const b = a + 0.22;
    g.strokeStyle = "rgba(255,255,255,0.4)";
    g.lineWidth = 5;
    g.beginPath();
    g.moveTo(cx + Math.cos(a) * (R - w / 2 - 2), cy + Math.sin(a) * (R - w / 2 - 2));
    g.lineTo(cx + Math.cos(b) * (R + w / 2 + 2), cy + Math.sin(b) * (R + w / 2 + 2));
    g.stroke();
    g.strokeStyle = "rgba(10,10,10,0.42)";
    g.lineWidth = 4;
    g.beginPath();
    g.moveTo(cx + Math.cos(a + 0.06) * (R - w / 2 - 2), cy + Math.sin(a + 0.06) * (R - w / 2 - 2));
    g.lineTo(cx + Math.cos(b + 0.06) * (R + w / 2 + 2), cy + Math.sin(b + 0.06) * (R + w / 2 + 2));
    g.stroke();
  }
  g.restore();

  // 端｡結び目の下から二本が垂れて細る
  const knot = g.createRadialGradient(134, 238, 10, 150, 262, 92);
  knot.addColorStop(0, "#ededed");
  knot.addColorStop(0.35, "#a0a0a0");
  knot.addColorStop(0.75, "#2a2a2a");
  knot.addColorStop(1, "#0b0b0b");
  g.strokeStyle = knot;
  g.lineCap = "round";
  for (const [x0, x1, x2] of [
    [138, 122, 112],
    [162, 180, 192],
  ] as const) {
    g.lineWidth = w - 10;
    g.beginPath();
    g.moveTo(x0, 236);
    g.quadraticCurveTo(x1, 268, x2, 290);
    g.stroke();
  }

  // 結び目｡輪の下端を綛が二重に締める
  for (const [bx, bw] of [
    [132, 22],
    [166, 22],
  ] as const) {
    const lash = g.createLinearGradient(bx - bw, 0, bx + bw, 0);
    lash.addColorStop(0, "#0c0c0c");
    lash.addColorStop(0.35, "#c6c6c6");
    lash.addColorStop(0.7, "#4e4e4e");
    lash.addColorStop(1, "#0f0f0f");
    g.fillStyle = lash;
    g.beginPath();
    g.moveTo(bx - bw / 2, 206);
    g.quadraticCurveTo(bx, 202, bx + bw / 2, 206);
    g.lineTo(bx + bw / 2, 268);
    g.quadraticCurveTo(bx, 274, bx - bw / 2, 268);
    g.closePath();
    g.fill();
  }
  g.restore();
};

/** 兼業が当たり前｡鍬 */
const hoe: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 柄｡右上から左下へ長く
  const wood = g.createLinearGradient(250, 30, 266, 43);
  wood.addColorStop(0, "#efefef");
  wood.addColorStop(0.3, "#9b9b9b");
  wood.addColorStop(0.72, "#2b2b2b");
  wood.addColorStop(1, "#111111");
  const shaft = new Path2D();
  shaft.moveTo(250, 30);
  shaft.lineTo(266, 43);
  shaft.lineTo(136, 205);
  shaft.lineTo(116, 188);
  shaft.closePath();
  g.fillStyle = wood;
  g.fill(shaft);

  // 木肌｡柄に沿って走る筋
  g.save();
  g.clip(shaft);
  g.strokeStyle = "rgba(255,255,255,0.3)";
  g.lineWidth = 2.4;
  for (let i = 0; i < 4; i++) {
    const o = -5 + i * 4;
    g.beginPath();
    g.moveTo(254 + o, 32 + o);
    g.lineTo(124 + o, 194 + o);
    g.stroke();
  }
  g.restore();

  // 刃｡幅の広い板が下へ開く
  g.save();
  g.translate(122, 196);
  g.rotate(0.3);
  const iron = g.createLinearGradient(0, -12, 0, 90);
  iron.addColorStop(0, "#1c1c1c");
  iron.addColorStop(0.22, "#8f8f8f");
  iron.addColorStop(0.6, "#2e2e2e");
  iron.addColorStop(0.9, "#101010");
  iron.addColorStop(1, "#f2f2f2");
  g.fillStyle = iron;
  g.beginPath();
  g.moveTo(-30, -6);
  g.lineTo(30, -6);
  g.lineTo(52, 62);
  g.quadraticCurveTo(0, 88, -52, 62);
  g.closePath();
  g.fill();

  // 刃先を白く残す
  g.strokeStyle = "rgba(255,255,255,0.85)";
  g.lineWidth = 6;
  g.beginPath();
  g.moveTo(-50, 58);
  g.quadraticCurveTo(0, 84, 50, 58);
  g.stroke();
  g.restore();

  // 口金｡柄と刃を締める
  const ring = g.createLinearGradient(104, 224, 144, 176);
  ring.addColorStop(0, "#6a6a6a");
  ring.addColorStop(0.5, "#0e0e0e");
  ring.addColorStop(1, "#4c4c4c");
  g.strokeStyle = ring;
  g.lineCap = "butt";
  g.lineWidth = 26;
  g.beginPath();
  g.moveTo(106, 218);
  g.lineTo(142, 174);
  g.stroke();
  g.restore();
};

/** もったいない｡金継ぎの茶碗 */
const kintsugi: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 胴｡外は左上から光が当たって右下へ沈む
  const clay = g.createRadialGradient(92, 108, 14, 152, 190, 200);
  clay.addColorStop(0, "#f4f4f4");
  clay.addColorStop(0.32, "#b0b0b0");
  clay.addColorStop(0.7, "#3a3a3a");
  clay.addColorStop(1, "#0e0e0e");
  const bowl = new Path2D();
  bowl.moveTo(30, 108);
  bowl.bezierCurveTo(36, 202, 86, 252, 150, 252);
  bowl.bezierCurveTo(214, 252, 264, 202, 270, 108);
  bowl.ellipse(150, 108, 120, 32, 0, 0, Math.PI, true);
  bowl.closePath();
  g.fillStyle = clay;
  g.fill(bowl);

  // 高台
  const foot = g.createLinearGradient(0, 240, 0, 268);
  foot.addColorStop(0, "#5e5e5e");
  foot.addColorStop(0.6, "#121212");
  foot.addColorStop(1, "#3c3c3c");
  g.fillStyle = foot;
  g.beginPath();
  g.moveTo(110, 240);
  g.lineTo(190, 240);
  g.lineTo(178, 266);
  g.lineTo(122, 266);
  g.closePath();
  g.fill();

  // 内側｡向こうの壁が明るく､手前が陰になる
  const inside = g.createLinearGradient(0, 82, 0, 142);
  inside.addColorStop(0, "#fbfbfb");
  inside.addColorStop(0.5, "#d2d2d2");
  inside.addColorStop(1, "#5c5c5c");
  g.fillStyle = inside;
  g.beginPath();
  g.ellipse(150, 110, 106, 27, 0, 0, Math.PI * 2);
  g.fill();

  // 口縁
  g.strokeStyle = "rgba(18,18,18,0.7)";
  g.lineWidth = 5;
  g.beginPath();
  g.ellipse(150, 110, 106, 27, 0, 0, Math.PI * 2);
  g.stroke();

  /** 継いだ線｡影を敷いてから明るい筋を通す */
  const seam = (path: Path2D) => {
    g.strokeStyle = "rgba(10,10,10,0.6)";
    g.lineWidth = 11;
    g.lineCap = "round";
    g.stroke(path);
    g.strokeStyle = "#f6f6f6";
    g.lineWidth = 5.5;
    g.stroke(path);
  };

  g.save();
  g.clip(bowl);

  // 欠けを埋めた片｡口の右が一度落ちている
  const patch = g.createLinearGradient(186, 80, 250, 170);
  patch.addColorStop(0, "#e8e8e8");
  patch.addColorStop(0.5, "#9a9a9a");
  patch.addColorStop(1, "#2a2a2a");
  const chip = new Path2D();
  chip.moveTo(188, 88);
  chip.quadraticCurveTo(222, 74, 252, 100);
  chip.quadraticCurveTo(240, 146, 214, 176);
  chip.quadraticCurveTo(196, 132, 188, 88);
  chip.closePath();
  g.fillStyle = patch;
  g.fill(chip);
  seam(chip);

  // 胴を縦に走る継ぎ｡下で二つに割れる
  const crack = new Path2D();
  crack.moveTo(118, 96);
  crack.bezierCurveTo(108, 148, 122, 190, 138, 248);
  const branch = new Path2D();
  branch.moveTo(114, 148);
  branch.quadraticCurveTo(84, 182, 74, 214);
  const short = new Path2D();
  short.moveTo(206, 190);
  short.quadraticCurveTo(212, 218, 204, 244);
  seam(crack);
  seam(branch);
  seam(short);
  g.restore();
  g.restore();
};

/** 恋愛｡結び文｡細く折った紙を中ほどで固く結ぶ */
const letter: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 身｡結び目に向かって細り､上下で開く
  const strip = new Path2D();
  strip.moveTo(116, 12);
  strip.bezierCurveTo(116, 62, 124, 96, 128, 120);
  strip.lineTo(128, 180);
  strip.bezierCurveTo(124, 216, 112, 250, 108, 290);
  strip.lineTo(192, 290);
  strip.bezierCurveTo(188, 250, 176, 216, 172, 180);
  strip.lineTo(172, 120);
  strip.bezierCurveTo(176, 96, 184, 62, 184, 12);
  strip.closePath();
  const paper = g.createLinearGradient(108, 0, 192, 0);
  paper.addColorStop(0, "#0b0b0b");
  paper.addColorStop(0.26, "#4c4c4c");
  paper.addColorStop(0.46, "#8c8c8c");
  paper.addColorStop(0.68, "#333333");
  paper.addColorStop(1, "#090909");
  g.fillStyle = paper;
  g.fill(strip);

  // 結び目｡左右に耳を張った大きな塊｡まわりを白く空けて切り離す
  const knot = new Path2D();
  knot.moveTo(118, 104);
  knot.quadraticCurveTo(150, 94, 182, 104);
  knot.quadraticCurveTo(214, 88, 244, 116);
  knot.quadraticCurveTo(254, 150, 236, 178);
  knot.quadraticCurveTo(208, 198, 182, 188);
  knot.quadraticCurveTo(150, 204, 118, 188);
  knot.quadraticCurveTo(92, 200, 64, 180);
  knot.quadraticCurveTo(46, 150, 56, 118);
  knot.quadraticCurveTo(86, 90, 118, 104);
  knot.closePath();
  g.strokeStyle = "#fcfcfc";
  g.lineWidth = 12;
  g.stroke(knot);
  const tie = g.createRadialGradient(124, 128, 8, 150, 150, 122);
  tie.addColorStop(0, "#9a9a9a");
  tie.addColorStop(0.3, "#4a4a4a");
  tie.addColorStop(0.68, "#1a1a1a");
  tie.addColorStop(1, "#070707");
  g.fillStyle = tie;
  g.fill(knot);

  // 締めの割れ目｡白く抜いて二つの耳に分ける
  g.save();
  g.clip(knot);
  g.strokeStyle = "#fbfbfb";
  g.lineWidth = 11;
  g.beginPath();
  g.moveTo(112, 96);
  g.quadraticCurveTo(150, 146, 190, 196);
  g.stroke();
  g.restore();
  g.restore();
};

/** 時間厳守｡鎖つきの懐中時計 */
const watch: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  const cx = 146;
  const cy = 186;
  const R = 100;

  // 鎖｡右上へ振り上げる
  const link = g.createRadialGradient(0, 0, 1, 0, 0, 12);
  link.addColorStop(0, "#e2e2e2");
  link.addColorStop(0.6, "#6a6a6a");
  link.addColorStop(1, "#0f0f0f");
  for (let i = 0; i <= 11; i++) {
    const t = i / 11;
    const x = (1 - t) * (1 - t) * 146 + 2 * (1 - t) * t * 214 + t * t * 286;
    const y = (1 - t) * (1 - t) * 62 + 2 * (1 - t) * t * 14 + t * t * 34;
    g.save();
    g.translate(x, y);
    g.rotate(i % 2 === 0 ? 0.5 : -0.9);
    g.fillStyle = link;
    g.beginPath();
    g.ellipse(0, 0, 11, 6.5, 0, 0, Math.PI * 2);
    g.fill();
    g.restore();
  }

  // 竜頭
  const crown = g.createLinearGradient(126, 0, 166, 0);
  crown.addColorStop(0, "#d4d4d4");
  crown.addColorStop(0.5, "#4a4a4a");
  crown.addColorStop(1, "#0f0f0f");
  g.fillStyle = crown;
  g.beginPath();
  g.moveTo(130, 92);
  g.lineTo(162, 92);
  g.lineTo(158, 66);
  g.lineTo(134, 66);
  g.closePath();
  g.fill();
  g.strokeStyle = crown;
  g.lineWidth = 9;
  g.beginPath();
  g.arc(146, 62, 13, 0, Math.PI * 2);
  g.stroke();

  // 胴｡外周を太い環にする
  const caseG = g.createRadialGradient(cx - 44, cy - 48, 10, cx, cy, R + 24);
  caseG.addColorStop(0, "#f2f2f2");
  caseG.addColorStop(0.36, "#9c9c9c");
  caseG.addColorStop(0.74, "#303030");
  caseG.addColorStop(1, "#0b0b0b");
  g.strokeStyle = caseG;
  g.lineWidth = 24;
  g.beginPath();
  g.arc(cx, cy, R, 0, Math.PI * 2);
  g.stroke();

  // 文字盤
  const dial = g.createRadialGradient(cx - 34, cy - 36, 8, cx, cy, R);
  dial.addColorStop(0, "#fdfdfd");
  dial.addColorStop(0.5, "#ededed");
  dial.addColorStop(0.85, "#c2c2c2");
  dial.addColorStop(1, "#8a8a8a");
  g.fillStyle = dial;
  g.beginPath();
  g.arc(cx, cy, R - 12, 0, Math.PI * 2);
  g.fill();

  // 時の印｡十二に割る
  g.strokeStyle = "rgba(12,12,12,0.9)";
  g.lineCap = "butt";
  for (let i = 0; i < 12; i++) {
    const a = (Math.PI * 2 * i) / 12;
    const long = i % 3 === 0;
    g.lineWidth = long ? 9 : 4.5;
    const r0 = long ? R - 40 : R - 30;
    g.beginPath();
    g.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
    g.lineTo(cx + Math.cos(a) * (R - 19), cy + Math.sin(a) * (R - 19));
    g.stroke();
  }

  // 秒の小窓
  const sub = g.createRadialGradient(cx - 6, cy + 42, 3, cx, cy + 50, 26);
  sub.addColorStop(0, "#fafafa");
  sub.addColorStop(0.7, "#b8b8b8");
  sub.addColorStop(1, "#4e4e4e");
  g.fillStyle = sub;
  g.beginPath();
  g.arc(cx, cy + 50, 23, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "rgba(16,16,16,0.8)";
  g.lineWidth = 3.5;
  g.beginPath();
  g.arc(cx, cy + 50, 23, 0, Math.PI * 2);
  g.stroke();

  // 針｡短針と長針
  g.fillStyle = "#0d0d0d";
  g.beginPath();
  g.moveTo(cx - 8, cy);
  g.lineTo(cx + 8, cy);
  g.lineTo(cx + 3, cy - 56);
  g.lineTo(cx - 3, cy - 56);
  g.closePath();
  g.fill();
  g.beginPath();
  g.moveTo(cx, cy - 7);
  g.lineTo(cx, cy + 7);
  g.lineTo(cx + 72, cy + 3);
  g.lineTo(cx + 72, cy - 3);
  g.closePath();
  g.fill();

  // 軸
  const pin = g.createRadialGradient(cx - 2, cy - 2, 1, cx, cy, 11);
  pin.addColorStop(0, "#cfcfcf");
  pin.addColorStop(1, "#080808");
  g.fillStyle = pin;
  g.beginPath();
  g.arc(cx, cy, 10, 0, Math.PI * 2);
  g.fill();
  g.restore();
};

/** 母性愛｡翼で雛を覆う親鳥 */
const nest: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 親鳥｡頭と胴と尾をひと続きの黒い塊にする
  const hen = new Path2D();
  hen.ellipse(174, 168, 112, 100, -0.08, 0, Math.PI * 2);
  hen.moveTo(150, 92);
  hen.arc(104, 84, 52, 0, Math.PI * 2);
  hen.moveTo(56, 70);
  hen.lineTo(10, 96);
  hen.lineTo(58, 116);
  hen.closePath();
  hen.moveTo(244, 118);
  hen.lineTo(296, 44);
  hen.lineTo(282, 186);
  hen.closePath();
  const down = g.createRadialGradient(126, 104, 12, 168, 176, 178);
  down.addColorStop(0, "#9e9e9e");
  down.addColorStop(0.3, "#4e4e4e");
  down.addColorStop(0.66, "#1c1c1c");
  down.addColorStop(1, "#070707");
  g.fillStyle = down;
  g.fill(hen);

  // 目｡白く抜いた丸に瞳
  g.fillStyle = "#fbfbfb";
  g.beginPath();
  g.arc(92, 72, 15, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#0a0a0a";
  g.beginPath();
  g.arc(90, 73, 7.5, 0, Math.PI * 2);
  g.fill();

  // 翼｡胴の上に大きく一枚｡白く縁を空けて塊を分ける
  const wing = new Path2D();
  wing.moveTo(112, 118);
  wing.quadraticCurveTo(236, 114, 268, 196);
  wing.quadraticCurveTo(196, 268, 116, 240);
  wing.quadraticCurveTo(84, 180, 112, 118);
  wing.closePath();
  g.strokeStyle = "#fbfbfb";
  g.lineWidth = 12;
  g.stroke(wing);
  const feather = g.createLinearGradient(120, 120, 240, 250);
  feather.addColorStop(0, "#8a8a8a");
  feather.addColorStop(0.35, "#3c3c3c");
  feather.addColorStop(0.75, "#141414");
  feather.addColorStop(1, "#060606");
  g.fillStyle = feather;
  g.fill(wing);

  // 雛｡翼の下から一羽だけ顔を出す｡まわりを白く空ける
  const chick = new Path2D();
  chick.arc(96, 236, 42, 0, Math.PI * 2);
  chick.moveTo(62, 224);
  chick.lineTo(16, 244);
  chick.lineTo(62, 258);
  chick.closePath();
  g.strokeStyle = "#fcfcfc";
  g.lineWidth = 13;
  g.stroke(chick);
  const fluff = g.createRadialGradient(84, 222, 5, 96, 240, 62);
  fluff.addColorStop(0, "#a6a6a6");
  fluff.addColorStop(0.4, "#4a4a4a");
  fluff.addColorStop(1, "#0a0a0a");
  g.fillStyle = fluff;
  g.fill(chick);
  g.fillStyle = "#fbfbfb";
  g.beginPath();
  g.arc(88, 224, 9, 0, Math.PI * 2);
  g.fill();
  g.restore();
};

/** 裸体は恥｡湯屋の暖簾 */
const noren: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  /** 布｡折りの山と谷を濃淡で並べる */
  const cloth = (x0: number, x1: number, path: Path2D) => {
    const fold = g.createLinearGradient(x0, 0, x1, 0);
    fold.addColorStop(0, "#2e2e2e");
    fold.addColorStop(0.12, "#9c9c9c");
    fold.addColorStop(0.26, "#3a3a3a");
    fold.addColorStop(0.42, "#a8a8a8");
    fold.addColorStop(0.58, "#282828");
    fold.addColorStop(0.74, "#8e8e8e");
    fold.addColorStop(0.88, "#1e1e1e");
    fold.addColorStop(1, "#5a5a5a");
    g.fillStyle = fold;
    g.fill(path);
    g.save();
    g.clip(path);
    g.strokeStyle = "rgba(6,6,6,0.5)";
    g.lineWidth = 3;
    for (let i = 1; i < 5; i++) {
      const x = x0 + ((x1 - x0) * i) / 5;
      g.beginPath();
      g.moveTo(x, 54);
      g.quadraticCurveTo(x + 5, 160, x + 2, 286);
      g.stroke();
    }
    g.restore();
  };

  // 左の一枚｡裾が風でわずかに持ち上がる
  const left = new Path2D();
  left.moveTo(28, 56);
  left.lineTo(142, 56);
  left.lineTo(148, 244);
  left.quadraticCurveTo(120, 266, 92, 246);
  left.quadraticCurveTo(62, 226, 34, 250);
  left.closePath();
  cloth(28, 148, left);

  // 右の一枚｡内へ振れて中が見える
  const right = new Path2D();
  right.moveTo(158, 56);
  right.lineTo(272, 56);
  right.lineTo(276, 236);
  right.quadraticCurveTo(248, 214, 216, 234);
  right.quadraticCurveTo(186, 254, 166, 228);
  right.closePath();
  cloth(158, 276, right);

  // 割れ目の奥｡布の間から暗がりが覗く
  const gap = g.createLinearGradient(0, 56, 0, 250);
  gap.addColorStop(0, "#2a2a2a");
  gap.addColorStop(0.6, "#5e5e5e");
  gap.addColorStop(1, "#d2d2d2");
  g.fillStyle = gap;
  g.beginPath();
  g.moveTo(144, 58);
  g.lineTo(158, 58);
  g.lineTo(164, 228);
  g.lineTo(150, 244);
  g.closePath();
  g.fill();

  // 乳｡竿に通す輪
  g.strokeStyle = "#141414";
  g.lineWidth = 9;
  for (const x of [52, 112, 182, 246]) {
    g.beginPath();
    g.moveTo(x, 60);
    g.quadraticCurveTo(x - 4, 36, x + 10, 34);
    g.stroke();
  }

  // 竿
  const pole = g.createLinearGradient(0, 24, 0, 50);
  pole.addColorStop(0, "#8e8e8e");
  pole.addColorStop(0.42, "#0f0f0f");
  pole.addColorStop(1, "#4c4c4c");
  g.fillStyle = pole;
  g.fillRect(12, 26, 276, 20);
  g.fillStyle = "#0b0b0b";
  for (const x of [12, 288]) {
    g.beginPath();
    g.ellipse(x, 36, 8, 13, 0, 0, Math.PI * 2);
    g.fill();
  }
  g.restore();
};

/** 純潔・処女性｡真上から見た椿一輪 */
const camellia: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  const cx = 150;
  const cy = 150;

  // 葉｡花の後ろから二枚だけ大きく出す
  const leaf = (x: number, y: number, len: number, rot: number) => {
    g.save();
    g.translate(x, y);
    g.rotate(rot);
    const blade = new Path2D();
    blade.moveTo(0, 0);
    blade.quadraticCurveTo(len * 0.5, -len * 0.36, len, 0);
    blade.quadraticCurveTo(len * 0.5, len * 0.36, 0, 0);
    blade.closePath();
    g.strokeStyle = "#fcfcfc";
    g.lineWidth = 12;
    g.stroke(blade);
    const lv = g.createLinearGradient(0, -len * 0.3, len, len * 0.3);
    lv.addColorStop(0, "#787878");
    lv.addColorStop(0.45, "#2a2a2a");
    lv.addColorStop(1, "#080808");
    g.fillStyle = lv;
    g.fill(blade);
    g.restore();
  };

  leaf(150, 168, 156, 2.6);
  leaf(150, 132, 156, -0.62);

  // 弁｡五枚を大きく開いて､あいだを白く空ける
  const petals: Path2D[] = [];
  for (let i = 0; i < 5; i++) {
    const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    const p = new Path2D();
    const R = 120;
    const m = new DOMMatrix().translateSelf(cx, cy).rotateSelf((a * 180) / Math.PI + 90);
    const local = new Path2D();
    local.moveTo(0, 0);
    local.bezierCurveTo(-R * 0.96, -R * 0.24, -R * 0.82, -R * 1.02, 0, -R);
    local.bezierCurveTo(R * 0.82, -R * 1.02, R * 0.96, -R * 0.24, 0, 0);
    local.closePath();
    p.addPath(local, m);
    petals.push(p);
  }
  for (const p of petals) {
    g.strokeStyle = "#fcfcfc";
    g.lineWidth = 11;
    g.stroke(p);
    const pt = g.createRadialGradient(cx, cy, 18, cx, cy, 142);
    pt.addColorStop(0, "#8e8e8e");
    pt.addColorStop(0.42, "#454545");
    pt.addColorStop(0.78, "#181818");
    pt.addColorStop(1, "#070707");
    g.fillStyle = pt;
    g.fill(p);
  }

  // 花芯｡白く空けたうえに濃い丸と太い蕊
  g.fillStyle = "#fcfcfc";
  g.beginPath();
  g.arc(cx, cy, 56, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "#0d0d0d";
  g.lineWidth = 7;
  g.lineCap = "round";
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI * 2 * i) / 10 + 0.15;
    g.beginPath();
    g.moveTo(cx + Math.cos(a) * 18, cy + Math.sin(a) * 18);
    g.lineTo(cx + Math.cos(a) * 50, cy + Math.sin(a) * 50);
    g.stroke();
  }
  const core = g.createRadialGradient(cx - 8, cy - 10, 4, cx, cy, 34);
  core.addColorStop(0, "#9c9c9c");
  core.addColorStop(0.45, "#3a3a3a");
  core.addColorStop(1, "#070707");
  g.fillStyle = core;
  g.beginPath();
  g.arc(cx, cy, 30, 0, Math.PI * 2);
  g.fill();
  g.restore();
};

/** 立身出世｡風をはらんだ鯉のぼり */
const koinobori: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 胴と尾｡口から入った風が尾へ抜ける
  const scale = g.createRadialGradient(96, 104, 16, 176, 168, 214);
  scale.addColorStop(0, "#fafafa");
  scale.addColorStop(0.26, "#bcbcbc");
  scale.addColorStop(0.62, "#4a4a4a");
  scale.addColorStop(1, "#0c0c0c");
  const fish = new Path2D();
  fish.moveTo(34, 82);
  fish.bezierCurveTo(112, 52, 190, 62, 240, 96);
  fish.lineTo(288, 40);
  fish.quadraticCurveTo(266, 150, 288, 262);
  fish.lineTo(240, 204);
  fish.bezierCurveTo(190, 236, 112, 244, 34, 216);
  fish.closePath();
  g.fillStyle = scale;
  g.fill(fish);

  g.save();
  g.clip(fish);

  // 鱗｡弧を列にして並べる
  g.strokeStyle = "rgba(10,10,10,0.5)";
  g.lineWidth = 4;
  for (let c = 0; c < 7; c++) {
    const x = 92 + c * 26;
    for (let r = 0; r < 6; r++) {
      const y = 78 + r * 28 + (c % 2) * 14;
      g.beginPath();
      g.arc(x, y, 17, -Math.PI * 0.5, Math.PI * 0.5);
      g.stroke();
    }
  }
  // 背を沈めて腹を白く残す
  const belly = g.createLinearGradient(0, 96, 0, 226);
  belly.addColorStop(0, "rgba(6,6,6,0.42)");
  belly.addColorStop(0.5, "rgba(255,255,255,0)");
  belly.addColorStop(1, "rgba(255,255,255,0.5)");
  g.fillStyle = belly;
  g.fill(fish);

  // 尾の骨｡吹き流しの筋
  g.strokeStyle = "rgba(8,8,8,0.55)";
  g.lineWidth = 5;
  for (let i = 0; i < 5; i++) {
    g.beginPath();
    g.moveTo(244, 108 + i * 22);
    g.quadraticCurveTo(268, 110 + i * 24, 292, 62 + i * 46);
    g.stroke();
  }
  g.restore();

  // 口｡輪を通して大きく開く
  const mouth = g.createRadialGradient(40, 150, 6, 36, 150, 74);
  mouth.addColorStop(0, "#0a0a0a");
  mouth.addColorStop(0.6, "#3c3c3c");
  mouth.addColorStop(1, "#8e8e8e");
  g.fillStyle = mouth;
  g.beginPath();
  g.ellipse(36, 149, 15, 67, 0, 0, Math.PI * 2);
  g.fill();
  const hoop = g.createLinearGradient(20, 0, 52, 0);
  hoop.addColorStop(0, "#efefef");
  hoop.addColorStop(0.5, "#5e5e5e");
  hoop.addColorStop(1, "#0f0f0f");
  g.strokeStyle = hoop;
  g.lineWidth = 11;
  g.beginPath();
  g.ellipse(36, 149, 15, 67, 0, 0, Math.PI * 2);
  g.stroke();

  // 目
  const eye = g.createRadialGradient(78, 96, 3, 84, 104, 34);
  eye.addColorStop(0, "#fdfdfd");
  eye.addColorStop(0.55, "#c4c4c4");
  eye.addColorStop(1, "#4a4a4a");
  g.fillStyle = eye;
  g.beginPath();
  g.arc(84, 104, 27, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#0a0a0a";
  g.beginPath();
  g.arc(78, 102, 13, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "rgba(12,12,12,0.85)";
  g.lineWidth = 4;
  g.beginPath();
  g.arc(84, 104, 27, 0, Math.PI * 2);
  g.stroke();

  // 胸の鰭
  const fin = g.createLinearGradient(120, 190, 150, 252);
  fin.addColorStop(0, "#8e8e8e");
  fin.addColorStop(0.6, "#2a2a2a");
  fin.addColorStop(1, "#0d0d0d");
  g.fillStyle = fin;
  g.beginPath();
  g.moveTo(112, 216);
  g.quadraticCurveTo(150, 274, 196, 262);
  g.quadraticCurveTo(164, 238, 150, 222);
  g.closePath();
  g.fill();
  g.restore();
};

export const PLATES_A: Record<string, Draw> = {
  "006": chochin,
  "007": candle,
  "008": rope,
  "009": hoe,
  "010": kintsugi,
  "011": letter,
  "012": watch,
  "013": nest,
  "014": noren,
  "015": camellia,
  "016": koinobori,
};
