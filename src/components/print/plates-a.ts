/**
 * 図版の版下（つづき）｡
 *
 * ここでは網のことは考えず､灰色の絵として描く｡
 * 立体感は濃淡で出しておくと､網にかけたときに刷り物の肌になる｡
 * 座標は 300 四方で書いて､s で伸ばす｡枠いっぱいに大きく取る｡
 */

import type { Draw } from "./draw";

/** 生まれで決まる｡立烏帽子 */
const eboshi: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 本体｡前は低く､背は高く立つ
  const felt = g.createLinearGradient(84, 48, 230, 252);
  felt.addColorStop(0, "#f1f1f1");
  felt.addColorStop(0.2, "#a2a2a2");
  felt.addColorStop(0.5, "#333333");
  felt.addColorStop(1, "#0d0d0d");
  const cap = new Path2D();
  cap.moveTo(84, 244);
  cap.bezierCurveTo(80, 170, 90, 108, 114, 74);
  cap.quadraticCurveTo(142, 38, 186, 28);
  cap.quadraticCurveTo(222, 20, 228, 52);
  cap.bezierCurveTo(236, 104, 228, 172, 226, 242);
  cap.quadraticCurveTo(154, 266, 84, 244);
  cap.closePath();
  g.fillStyle = felt;
  g.fill(cap);

  g.save();
  g.clip(cap);

  // 峰の折り目｡烏帽子の背を縦に割る一本
  g.strokeStyle = "rgba(255,255,255,0.52)";
  g.lineWidth = 7;
  g.beginPath();
  g.moveTo(196, 38);
  g.bezierCurveTo(158, 106, 152, 180, 158, 252);
  g.stroke();

  // 皺｡紗を張った面が横に寄る
  g.strokeStyle = "rgba(255,255,255,0.2)";
  g.lineWidth = 3.6;
  for (let i = 0; i < 5; i++) {
    const y = 86 + i * 34;
    g.beginPath();
    g.moveTo(80, y + 8);
    g.quadraticCurveTo(152, y - 12, 228, y + 4);
    g.stroke();
  }

  // 前の稜を白く残す
  g.strokeStyle = "rgba(255,255,255,0.4)";
  g.lineWidth = 9;
  g.beginPath();
  g.moveTo(102, 240);
  g.bezierCurveTo(94, 166, 104, 108, 128, 76);
  g.stroke();
  g.restore();

  // 裾の縁｡ここで頭に載る
  const brim = g.createLinearGradient(0, 232, 0, 268);
  brim.addColorStop(0, "#5c5c5c");
  brim.addColorStop(0.5, "#111111");
  brim.addColorStop(1, "#3a3a3a");
  g.fillStyle = brim;
  g.beginPath();
  g.ellipse(153, 248, 72, 19, 0.02, 0, Math.PI * 2);
  g.fill();

  // 掛け緒｡両の端から垂れる
  g.strokeStyle = "rgba(20,20,20,0.75)";
  g.lineWidth = 4;
  g.lineCap = "round";
  for (const [x, d] of [
    [88, -14],
    [220, 14],
  ] as const) {
    g.beginPath();
    g.moveTo(x, 252);
    g.quadraticCurveTo(x + d, 272, x + d * 0.4, 290);
    g.stroke();
  }
  g.restore();
};

/** 無常観｡散る桜の枝 */
const sakura: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 枝｡左下から右上へ太く走らせる
  const bark = g.createLinearGradient(0, 300, 300, 40);
  bark.addColorStop(0, "#101010");
  bark.addColorStop(0.4, "#616161");
  bark.addColorStop(0.7, "#232323");
  bark.addColorStop(1, "#0f0f0f");
  g.fillStyle = bark;
  g.beginPath();
  g.moveTo(10, 258);
  g.bezierCurveTo(92, 234, 168, 186, 286, 66);
  g.lineTo(294, 86);
  g.bezierCurveTo(176, 208, 100, 256, 20, 282);
  g.closePath();
  g.fill();

  // 小枝｡二本だけ跳ねさせる
  g.strokeStyle = bark;
  g.lineCap = "round";
  g.lineWidth = 11;
  g.beginPath();
  g.moveTo(96, 242);
  g.quadraticCurveTo(102, 196, 66, 168);
  g.stroke();
  g.lineWidth = 8;
  g.beginPath();
  g.moveTo(206, 128);
  g.quadraticCurveTo(216, 88, 194, 58);
  g.stroke();

  /** 花｡五弁｡中を白く残して縁を沈める */
  const bloom = (cx: number, cy: number, r: number, rot: number) => {
    g.save();
    g.translate(cx, cy);
    g.rotate(rot);
    for (let i = 0; i < 5; i++) {
      const a = (Math.PI * 2 * i) / 5;
      const px = Math.cos(a) * r * 0.62;
      const py = Math.sin(a) * r * 0.62;
      const pet = g.createRadialGradient(px * 0.5, py * 0.5, r * 0.1, px, py, r * 0.72);
      pet.addColorStop(0, "#fcfcfc");
      pet.addColorStop(0.55, "#e2e2e2");
      pet.addColorStop(1, "#6e6e6e");
      g.fillStyle = pet;
      g.beginPath();
      g.ellipse(px, py, r * 0.56, r * 0.44, a, 0, Math.PI * 2);
      g.fill();
    }
    // 花芯
    const eye = g.createRadialGradient(0, 0, 1, 0, 0, r * 0.3);
    eye.addColorStop(0, "#5a5a5a");
    eye.addColorStop(1, "#111111");
    g.fillStyle = eye;
    g.beginPath();
    g.arc(0, 0, r * 0.19, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = "rgba(14,14,14,0.8)";
    g.lineWidth = r * 0.06;
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * 2 * i) / 6 + 0.3;
      g.beginPath();
      g.moveTo(0, 0);
      g.lineTo(Math.cos(a) * r * 0.42, Math.sin(a) * r * 0.42);
      g.stroke();
    }
    g.restore();
  };

  bloom(70, 158, 46, 0.3);
  bloom(148, 176, 52, -0.5);
  bloom(226, 104, 44, 0.8);
  bloom(192, 50, 36, 0.1);
  bloom(36, 226, 30, -0.9);

  /** 落ちる弁｡ひとひらずつ */
  const petal = (cx: number, cy: number, r: number, rot: number) => {
    const pt = g.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    pt.addColorStop(0, "#fbfbfb");
    pt.addColorStop(0.6, "#cfcfcf");
    pt.addColorStop(1, "#4e4e4e");
    g.fillStyle = pt;
    g.beginPath();
    g.ellipse(cx, cy, r, r * 0.66, rot, 0, Math.PI * 2);
    g.fill();
  };

  petal(252, 196, 19, 0.7);
  petal(206, 250, 16, -0.4);
  petal(124, 276, 14, 1.1);
  petal(278, 258, 12, 0.2);
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

/** 恋愛｡結び文 */
const letter: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 身｡縦に細く折った紙
  const paper = g.createLinearGradient(108, 0, 194, 0);
  paper.addColorStop(0, "#5c5c5c");
  paper.addColorStop(0.14, "#fbfbfb");
  paper.addColorStop(0.44, "#e4e4e4");
  paper.addColorStop(0.72, "#9a9a9a");
  paper.addColorStop(0.88, "#4a4a4a");
  paper.addColorStop(1, "#171717");
  g.fillStyle = paper;
  g.beginPath();
  g.moveTo(116, 22);
  g.bezierCurveTo(108, 100, 114, 200, 122, 276);
  g.lineTo(182, 272);
  g.bezierCurveTo(188, 198, 184, 98, 178, 26);
  g.closePath();
  g.fill();

  // 折り目｡明るい稜と沈んだ谷
  g.strokeStyle = "rgba(255,255,255,0.7)";
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(134, 26);
  g.bezierCurveTo(128, 100, 132, 198, 138, 274);
  g.stroke();
  g.strokeStyle = "rgba(16,16,16,0.32)";
  g.lineWidth = 5;
  g.beginPath();
  g.moveTo(166, 24);
  g.bezierCurveTo(170, 100, 170, 198, 168, 274);
  g.stroke();

  // 端｡上と下で少し開く
  g.fillStyle = paper;
  g.beginPath();
  g.moveTo(178, 26);
  g.quadraticCurveTo(206, 34, 214, 52);
  g.quadraticCurveTo(190, 54, 180, 46);
  g.closePath();
  g.fill();
  g.beginPath();
  g.moveTo(122, 268);
  g.quadraticCurveTo(96, 276, 88, 292);
  g.quadraticCurveTo(114, 292, 126, 284);
  g.closePath();
  g.fill();

  // 結び目の陰｡締まって紙が寄る
  g.fillStyle = "rgba(14,14,14,0.3)";
  g.beginPath();
  g.moveTo(112, 112);
  g.lineTo(186, 110);
  g.lineTo(174, 148);
  g.lineTo(124, 148);
  g.closePath();
  g.fill();
  g.beginPath();
  g.moveTo(124, 152);
  g.lineTo(176, 152);
  g.lineTo(188, 192);
  g.lineTo(112, 190);
  g.closePath();
  g.fill();

  // 結び目から出た端｡左右へ跳ねて先が細る
  const tail = g.createLinearGradient(0, 124, 0, 186);
  tail.addColorStop(0, "#e8e8e8");
  tail.addColorStop(0.45, "#8a8a8a");
  tail.addColorStop(1, "#101010");
  g.fillStyle = tail;
  g.beginPath();
  g.moveTo(118, 134);
  g.quadraticCurveTo(76, 118, 48, 132);
  g.quadraticCurveTo(80, 148, 120, 166);
  g.closePath();
  g.fill();
  g.beginPath();
  g.moveTo(182, 132);
  g.quadraticCurveTo(226, 116, 254, 134);
  g.quadraticCurveTo(220, 150, 180, 166);
  g.closePath();
  g.fill();

  // 結び目｡帯が胴を一周し､上に結び目の山が乗る
  const band = g.createLinearGradient(0, 120, 0, 186);
  band.addColorStop(0, "#0d0d0d");
  band.addColorStop(0.24, "#8e8e8e");
  band.addColorStop(0.46, "#fafafa");
  band.addColorStop(0.74, "#5e5e5e");
  band.addColorStop(1, "#0f0f0f");
  g.fillStyle = band;
  g.beginPath();
  g.moveTo(102, 128);
  g.quadraticCurveTo(150, 112, 198, 126);
  g.quadraticCurveTo(202, 158, 196, 178);
  g.quadraticCurveTo(150, 194, 104, 178);
  g.closePath();
  g.fill();

  const bump = g.createRadialGradient(140, 128, 4, 150, 146, 52);
  bump.addColorStop(0, "#fdfdfd");
  bump.addColorStop(0.45, "#b6b6b6");
  bump.addColorStop(0.8, "#3a3a3a");
  bump.addColorStop(1, "#0c0c0c");
  g.fillStyle = bump;
  g.beginPath();
  g.moveTo(122, 172);
  g.quadraticCurveTo(112, 128, 150, 118);
  g.quadraticCurveTo(190, 128, 180, 172);
  g.quadraticCurveTo(150, 184, 122, 172);
  g.closePath();
  g.fill();

  // 締めの筋｡結び目を斜めに横切る
  g.strokeStyle = "rgba(10,10,10,0.6)";
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(124, 126);
  g.quadraticCurveTo(150, 152, 178, 176);
  g.stroke();
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

/** 母性愛｡巣の中の親鳥と雛 */
const nest: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 親鳥の尾｡右上へ払う
  const tail = g.createLinearGradient(210, 150, 292, 66);
  tail.addColorStop(0, "#3a3a3a");
  tail.addColorStop(0.55, "#8c8c8c");
  tail.addColorStop(1, "#111111");
  g.fillStyle = tail;
  g.beginPath();
  g.moveTo(206, 172);
  g.quadraticCurveTo(262, 130, 292, 62);
  g.quadraticCurveTo(280, 116, 240, 190);
  g.closePath();
  g.fill();

  // 胴｡左上から光が当たる
  const body = g.createRadialGradient(132, 116, 12, 172, 172, 122);
  body.addColorStop(0, "#f6f6f6");
  body.addColorStop(0.3, "#b4b4b4");
  body.addColorStop(0.68, "#3c3c3c");
  body.addColorStop(1, "#0d0d0d");
  g.fillStyle = body;
  g.beginPath();
  g.ellipse(170, 156, 70, 52, -0.22, 0, Math.PI * 2);
  g.fill();

  // 翼｡胴の上に一枚重ねて沈める
  const wing = g.createLinearGradient(140, 120, 208, 194);
  wing.addColorStop(0, "#9a9a9a");
  wing.addColorStop(0.5, "#2c2c2c");
  wing.addColorStop(1, "#0b0b0b");
  g.fillStyle = wing;
  g.beginPath();
  g.moveTo(140, 128);
  g.quadraticCurveTo(216, 118, 232, 178);
  g.quadraticCurveTo(178, 196, 144, 160);
  g.closePath();
  g.fill();
  g.strokeStyle = "rgba(255,255,255,0.3)";
  g.lineWidth = 3;
  for (let i = 0; i < 3; i++) {
    g.beginPath();
    g.moveTo(148 + i * 6, 146 + i * 10);
    g.quadraticCurveTo(190, 140 + i * 12, 224, 168 + i * 4);
    g.stroke();
  }

  // 頭
  const head = g.createRadialGradient(96, 88, 6, 110, 106, 44);
  head.addColorStop(0, "#fafafa");
  head.addColorStop(0.4, "#b8b8b8");
  head.addColorStop(1, "#151515");
  g.fillStyle = head;
  g.beginPath();
  g.arc(110, 104, 31, 0, Math.PI * 2);
  g.fill();

  // 嘴
  g.fillStyle = "#101010";
  g.beginPath();
  g.moveTo(84, 96);
  g.lineTo(44, 110);
  g.lineTo(84, 120);
  g.closePath();
  g.fill();

  // 目
  g.fillStyle = "#fbfbfb";
  g.beginPath();
  g.arc(102, 96, 8, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#0b0b0b";
  g.beginPath();
  g.arc(102, 96, 4.4, 0, Math.PI * 2);
  g.fill();

  /** 雛｡口を開けて上を向く */
  const chick = (cx: number, cy: number, r: number, dir: number) => {
    const sk = g.createRadialGradient(cx - r * 0.4, cy - r * 0.5, 2, cx, cy, r * 1.5);
    sk.addColorStop(0, "#f2f2f2");
    sk.addColorStop(0.45, "#9e9e9e");
    sk.addColorStop(1, "#131313");
    g.fillStyle = sk;
    g.beginPath();
    g.arc(cx, cy, r, 0, Math.PI * 2);
    g.fill();
    g.beginPath();
    g.ellipse(cx, cy + r * 1.4, r * 0.7, r * 0.9, 0, 0, Math.PI * 2);
    g.fill();
    // 開いた嘴
    g.fillStyle = "#0e0e0e";
    g.beginPath();
    g.moveTo(cx + dir * r * 0.5, cy - r * 0.3);
    g.lineTo(cx + dir * r * 2.1, cy - r * 1.1);
    g.lineTo(cx + dir * r * 0.8, cy + r * 0.2);
    g.closePath();
    g.fill();
    g.beginPath();
    g.arc(cx - dir * r * 0.2, cy - r * 0.3, r * 0.2, 0, Math.PI * 2);
    g.fill();
  };

  chick(74, 196, 17, -1);
  chick(230, 190, 15, 1);

  // 巣｡枝を編んだ器｡手前の縁が皆を抱える
  const straw = g.createRadialGradient(112, 222, 16, 150, 256, 176);
  straw.addColorStop(0, "#d2d2d2");
  straw.addColorStop(0.26, "#6e6e6e");
  straw.addColorStop(0.64, "#1e1e1e");
  straw.addColorStop(1, "#070707");
  const cup = new Path2D();
  cup.moveTo(14, 202);
  cup.quadraticCurveTo(150, 246, 286, 202);
  cup.bezierCurveTo(280, 262, 220, 292, 150, 292);
  cup.bezierCurveTo(80, 292, 20, 262, 14, 202);
  cup.closePath();
  g.fillStyle = straw;
  g.fill(cup);

  // 枝｡編み目を斜めに掛け合わせる
  g.save();
  g.clip(cup);
  g.lineCap = "round";
  let seed = 17;
  const next = () => ((seed = (seed * 1103515245 + 12345) >>> 0) % 1000) / 1000;
  for (let i = 0; i < 44; i++) {
    const x = 6 + next() * 290;
    const y = 198 + next() * 94;
    const len = 34 + next() * 56;
    const a = -0.5 + next() * 1.0;
    g.strokeStyle = next() > 0.4 ? "rgba(255,255,255,0.34)" : "rgba(4,4,4,0.5)";
    g.lineWidth = 4 + next() * 4;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
    g.stroke();
  }
  g.restore();
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

/** 純潔・処女性｡椿の花 */
const camellia: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  const cx = 150;
  const cy = 142;

  /** 葉｡厚く沈めて後ろに置く */
  const leaf = (x: number, y: number, len: number, rot: number) => {
    g.save();
    g.translate(x, y);
    g.rotate(rot);
    const lv = g.createLinearGradient(0, -len * 0.25, len, len * 0.25);
    lv.addColorStop(0, "#8a8a8a");
    lv.addColorStop(0.45, "#2e2e2e");
    lv.addColorStop(1, "#0c0c0c");
    g.fillStyle = lv;
    g.beginPath();
    g.moveTo(0, 0);
    g.quadraticCurveTo(len * 0.45, -len * 0.34, len, -len * 0.04);
    g.quadraticCurveTo(len * 0.45, len * 0.3, 0, 0);
    g.closePath();
    g.fill();
    // 主脈
    g.strokeStyle = "rgba(255,255,255,0.5)";
    g.lineWidth = len * 0.035;
    g.beginPath();
    g.moveTo(len * 0.04, 0);
    g.quadraticCurveTo(len * 0.5, -len * 0.06, len * 0.96, -len * 0.04);
    g.stroke();
    g.restore();
  };

  leaf(138, 210, 136, 0.62);
  leaf(160, 206, 128, -3.7);
  leaf(176, 96, 120, -0.9);

  /** 弁｡もとを白く残して縁を沈める */
  const petal = (a: number, rad: number) => {
    g.save();
    g.translate(cx, cy);
    g.rotate(a);
    const pt = g.createRadialGradient(0, -rad * 0.2, rad * 0.12, 0, -rad * 0.7, rad * 1.05);
    pt.addColorStop(0, "#fdfdfd");
    pt.addColorStop(0.42, "#e8e8e8");
    pt.addColorStop(0.78, "#a2a2a2");
    pt.addColorStop(1, "#3c3c3c");
    g.fillStyle = pt;
    g.beginPath();
    g.moveTo(0, 0);
    g.bezierCurveTo(-rad * 0.92, -rad * 0.2, -rad * 0.78, -rad * 1.06, 0, -rad * 0.98);
    g.bezierCurveTo(rad * 0.78, -rad * 1.06, rad * 0.92, -rad * 0.2, 0, 0);
    g.closePath();
    g.fill();
    g.strokeStyle = "rgba(18,18,18,0.45)";
    g.lineWidth = rad * 0.035;
    g.stroke();
    g.restore();
  };

  // 外の五弁
  for (let i = 0; i < 5; i++) petal((Math.PI * 2 * i) / 5, 98);
  // 内の五弁｡半分ずらして重ねる
  for (let i = 0; i < 5; i++) petal((Math.PI * 2 * i) / 5 + Math.PI / 5, 62);

  // 花芯｡蕊が束になって立つ
  g.strokeStyle = "rgba(14,14,14,0.85)";
  g.lineCap = "round";
  for (let i = 0; i < 18; i++) {
    const a = (Math.PI * 2 * i) / 18 + 0.12;
    const len = 20 + (i % 3) * 8;
    g.lineWidth = 3.6;
    g.beginPath();
    g.moveTo(cx, cy);
    g.lineTo(cx + Math.cos(a) * len, cy + Math.sin(a) * len);
    g.stroke();
    const dot = g.createRadialGradient(
      cx + Math.cos(a) * len - 2,
      cy + Math.sin(a) * len - 2,
      1,
      cx + Math.cos(a) * len,
      cy + Math.sin(a) * len,
      7,
    );
    dot.addColorStop(0, "#f4f4f4");
    dot.addColorStop(1, "#111111");
    g.fillStyle = dot;
    g.beginPath();
    g.arc(cx + Math.cos(a) * len, cy + Math.sin(a) * len, 5.2, 0, Math.PI * 2);
    g.fill();
  }
  const core = g.createRadialGradient(cx - 4, cy - 5, 2, cx, cy, 18);
  core.addColorStop(0, "#fafafa");
  core.addColorStop(0.5, "#8e8e8e");
  core.addColorStop(1, "#0d0d0d");
  g.fillStyle = core;
  g.beginPath();
  g.arc(cx, cy, 15, 0, Math.PI * 2);
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
  "006": eboshi,
  "007": sakura,
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
