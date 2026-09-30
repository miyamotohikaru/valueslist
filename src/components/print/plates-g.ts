/**
 * 図版の版下（その七）｡
 *
 * plates.ts と同じ約束で描く｡網にかけるのは後の工程なので､
 * ここでは面を平らな黒で置かず､明るいところから暗いところへ必ず振る｡
 * 座標は 300 四方で書いて､s で伸ばす｡枠いっぱいに大きく取る｡
 *
 * 人は描かない｡被害そのものも描かない｡道具・器物・しるし・建物の一部で指す｡
 */

import type { Draw } from "./draw";

/** 子どもは叩いて育てる｡白樺の笞｡白い樹皮を大きな塊にして､黒い皮目で切る */
const birchRod: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 樹皮の地｡笞も脇枝も同じ肌で通す
  const bark = () => {
    const f = g.createLinearGradient(24, 24, 252, 292);
    f.addColorStop(0, "#fdfdfd");
    f.addColorStop(0.44, "#efefef");
    f.addColorStop(0.8, "#bebebe");
    f.addColorStop(1, "#8c8c8c");
    return f;
  };

  // 脇枝は二本だけ｡根もとは本体に隠れる｡輪郭を黒く締めて白い枝を切り出す
  const twigA = new Path2D();
  twigA.moveTo(88, 230);
  twigA.quadraticCurveTo(48, 194, 18, 114);
  twigA.lineTo(29, 108);
  twigA.quadraticCurveTo(66, 184, 104, 216);
  twigA.closePath();
  const twigB = new Path2D();
  twigB.moveTo(158, 122);
  twigB.quadraticCurveTo(212, 106, 270, 52);
  twigB.lineTo(278, 62);
  twigB.quadraticCurveTo(220, 124, 168, 140);
  twigB.closePath();
  for (const t of [twigA, twigB]) {
    g.fillStyle = bark();
    g.fill(t);
    g.strokeStyle = "rgba(14,14,14,0.8)";
    g.lineWidth = 4.2;
    g.stroke(t);
  }

  // 笞の本体｡下は太く先は細い｡一本の大きな塊として通す
  const stem = new Path2D();
  stem.moveTo(38, 300);
  stem.quadraticCurveTo(80, 150, 236, 30);
  stem.lineTo(252, 42);
  stem.quadraticCurveTo(114, 178, 88, 300);
  stem.closePath();
  g.fillStyle = bark();
  g.fill(stem);

  g.save();
  g.clip(stem);

  // 丸みは右の縁を落として出す｡左の縁は白く起こす
  g.lineCap = "round";
  g.strokeStyle = "rgba(14,14,14,0.86)";
  g.lineWidth = 26;
  g.beginPath();
  g.moveTo(252, 42);
  g.quadraticCurveTo(114, 178, 88, 300);
  g.stroke();
  g.strokeStyle = "rgba(255,255,255,0.86)";
  g.lineWidth = 14;
  g.beginPath();
  g.moveTo(44, 300);
  g.quadraticCurveTo(84, 152, 234, 34);
  g.stroke();

  // 皮目｡幹を横に切る黒い短い筋｡九本だけ､左右にずらして置く
  const P0 = [63, 300];
  const C = [97, 164];
  const P1 = [244, 36];
  g.strokeStyle = "rgba(10,10,10,0.92)";
  g.lineWidth = 9;
  for (let i = 0; i < 9; i++) {
    const t = 0.05 + (i / 8) * 0.9;
    const m = 1 - t;
    const bx = m * m * P0[0] + 2 * m * t * C[0] + t * t * P1[0];
    const by = m * m * P0[1] + 2 * m * t * C[1] + t * t * P1[1];
    const tx = 2 * m * (C[0] - P0[0]) + 2 * t * (P1[0] - C[0]);
    const ty = 2 * m * (C[1] - P0[1]) + 2 * t * (P1[1] - C[1]);
    const len = Math.hypot(tx, ty) || 1;
    const nx = -ty / len;
    const ny = tx / len;
    const w = (26 - i * 1.8) * (i % 2 ? 0.52 : 0.86);
    const off = (i % 2 ? 9 : -7) * (1 - i * 0.06);
    g.beginPath();
    g.moveTo(bx + nx * (off - w), by + ny * (off - w));
    g.lineTo(bx + nx * (off + w), by + ny * (off + w));
    g.stroke();
  }

  // 根もとの荒れた皮｡黒い塊をふたつだけ置く
  g.fillStyle = "rgba(10,10,10,0.82)";
  g.beginPath();
  g.ellipse(66, 268, 30, 16, -1.25, 0, Math.PI * 2);
  g.fill();
  g.beginPath();
  g.ellipse(76, 224, 24, 12, -1.1, 0, Math.PI * 2);
  g.fill();
  g.restore();

  g.restore();
};

/** 人を年季で買う｡穴あき銭一枚｡白い穴で真ん中を切り､縄が一本通る */
const holedCoin: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);
  g.translate(150, 144);
  g.rotate(-0.08);
  g.translate(-150, -144);

  const cx = 150;
  const cy = 144;
  const R = 118;

  // 地｡平たい一枚として､左上から右下へまっすぐ振る
  const face = g.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
  face.addColorStop(0, "#fdfdfd");
  face.addColorStop(0.42, "#e6e6e6");
  face.addColorStop(0.76, "#b2b2b2");
  face.addColorStop(1, "#767676");
  g.fillStyle = face;
  g.beginPath();
  g.arc(cx, cy, R, 0, Math.PI * 2);
  g.fill();

  // 輪（外の隆起）｡太い環をひとつ｡下右をいちばん黒くする
  const rim = g.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
  rim.addColorStop(0, "#9e9e9e");
  rim.addColorStop(0.3, "#3a3a3a");
  rim.addColorStop(0.75, "#111111");
  rim.addColorStop(1, "#040404");
  g.strokeStyle = rim;
  g.lineWidth = 20;
  g.beginPath();
  g.arc(cx, cy, R - 10, 0, Math.PI * 2);
  g.stroke();
  // 輪の内側を白く起こして地と切る
  g.strokeStyle = "rgba(255,255,255,0.95)";
  g.lineWidth = 5;
  g.beginPath();
  g.arc(cx, cy, R - 22, 0, Math.PI * 2);
  g.stroke();

  // 郭（穴のまわりの隆起）｡一様に黒く置いて白い穴を立てる
  g.strokeStyle = "#141414";
  g.lineWidth = 20;
  g.strokeRect(cx - 36, cy - 36, 72, 72);
  g.strokeStyle = "rgba(255,255,255,0.85)";
  g.lineWidth = 5;
  g.strokeRect(cx - 49, cy - 49, 98, 98);

  // 穴｡紙を残して真ん中を白く抜く
  g.fillStyle = "#ffffff";
  g.fillRect(cx - 26, cy - 26, 52, 52);

  // 縄｡左から来て穴に入る｡穴の白は右側に残す
  const rope = new Path2D();
  rope.moveTo(-8, 48);
  rope.quadraticCurveTo(58, 74, 126, 112);
  rope.lineTo(112, 148);
  rope.quadraticCurveTo(52, 112, -10, 92);
  rope.closePath();
  const cord = g.createLinearGradient(0, 40, 90, 140);
  cord.addColorStop(0, "#f2f2f2");
  cord.addColorStop(0.36, "#a6a6a6");
  cord.addColorStop(0.78, "#2e2e2e");
  cord.addColorStop(1, "#121212");
  g.fillStyle = cord;
  g.fill(rope);
  g.save();
  g.clip(rope);
  g.strokeStyle = "rgba(255,255,255,0.7)";
  g.lineWidth = 7;
  for (let i = 0; i < 6; i++) {
    const x = -4 + i * 26;
    g.beginPath();
    g.moveTo(x, 46);
    g.lineTo(x + 26, 104);
    g.stroke();
  }
  g.restore();
  g.strokeStyle = "rgba(12,12,12,0.78)";
  g.lineWidth = 4;
  g.stroke(rope);

  g.restore();
};

/** 切腹｡白木の三方に折った奉書紙｡刃物は載せない｡宝珠形のくり抜きで指す */
const sanbo: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 天板の上面｡斜め上から見た台形｡紙を白く立てるため中ほどの灰にする
  const top = g.createLinearGradient(0, 70, 0, 128);
  top.addColorStop(0, "#d8d8d8");
  top.addColorStop(0.55, "#bababa");
  top.addColorStop(1, "#8e8e8e");
  g.fillStyle = top;
  g.beginPath();
  g.moveTo(72, 70);
  g.lineTo(228, 70);
  g.lineTo(272, 126);
  g.lineTo(28, 126);
  g.closePath();
  g.fill();

  // 天板の木口｡ここを暗く締めて上面と胴を切る
  const edge = g.createLinearGradient(0, 126, 0, 150);
  edge.addColorStop(0, "#6e6e6e");
  edge.addColorStop(0.5, "#1c1c1c");
  edge.addColorStop(1, "#3e3e3e");
  g.fillStyle = edge;
  g.beginPath();
  g.moveTo(28, 126);
  g.lineTo(272, 126);
  g.lineTo(270, 150);
  g.lineTo(30, 150);
  g.closePath();
  g.fill();

  // 胴｡下へすこし広がる白木の面｡左から光が当たる
  const body = g.createLinearGradient(40, 0, 266, 0);
  body.addColorStop(0, "#fafafa");
  body.addColorStop(0.32, "#ececec");
  body.addColorStop(0.74, "#a6a6a6");
  body.addColorStop(1, "#4a4a4a");
  g.fillStyle = body;
  g.beginPath();
  g.moveTo(46, 150);
  g.lineTo(254, 150);
  g.lineTo(268, 252);
  g.lineTo(32, 252);
  g.closePath();
  g.fill();

  // 宝珠形のくり抜き｡円に三角をかぶせるだけで作る
  g.fillStyle = "#0b0b0b";
  g.beginPath();
  g.arc(150, 206, 33, 0, Math.PI * 2);
  g.fill();
  g.beginPath();
  g.moveTo(150, 150);
  g.lineTo(123, 206);
  g.lineTo(177, 206);
  g.closePath();
  g.fill();
  // くり抜きの右下に白い縁を残して板の厚みを出す
  g.strokeStyle = "rgba(255,255,255,0.6)";
  g.lineWidth = 4;
  g.beginPath();
  g.arc(150, 206, 35, -0.3, 1.95);
  g.stroke();

  // 足の縁｡下をいちばん暗くして据わらせる
  const foot = g.createLinearGradient(0, 252, 0, 276);
  foot.addColorStop(0, "#606060");
  foot.addColorStop(0.5, "#151515");
  foot.addColorStop(1, "#090909");
  g.fillStyle = foot;
  g.beginPath();
  g.moveTo(28, 252);
  g.lineTo(272, 252);
  g.lineTo(276, 276);
  g.lineTo(24, 276);
  g.closePath();
  g.fill();

  // 奉書紙｡天板の灰の上に真っ白で置いて､白ではっきり切る
  g.fillStyle = "#ffffff";
  g.beginPath();
  g.moveTo(94, 82);
  g.lineTo(206, 82);
  g.lineTo(226, 120);
  g.lineTo(74, 120);
  g.closePath();
  g.fill();
  // 紙の厚みと影
  g.strokeStyle = "rgba(16,16,16,0.72)";
  g.lineWidth = 4.4;
  g.beginPath();
  g.moveTo(74, 121);
  g.lineTo(226, 121);
  g.stroke();
  // 折り目｡左半分を一段沈める
  g.fillStyle = "rgba(20,20,20,0.17)";
  g.beginPath();
  g.moveTo(94, 82);
  g.lineTo(140, 82);
  g.lineTo(128, 120);
  g.lineTo(74, 120);
  g.closePath();
  g.fill();
  g.strokeStyle = "rgba(20,20,20,0.6)";
  g.lineWidth = 3.2;
  g.beginPath();
  g.moveTo(140, 82);
  g.lineTo(128, 120);
  g.stroke();

  g.restore();
};

/** お歯黒と引眉｡引眉の毛抜き｡口を大きく開いて､あいだを白い楔で切る */
const tweezers: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);
  g.translate(150, 150);
  g.rotate(-0.14);
  g.translate(-150, -150);

  // 左の足｡曲げから下へ大きく開き､先は幅の広い刃になる
  const left = new Path2D();
  left.moveTo(124, 34);
  left.quadraticCurveTo(84, 150, 40, 256);
  left.lineTo(96, 242);
  left.quadraticCurveTo(128, 150, 134, 52);
  left.closePath();
  const lg = g.createLinearGradient(36, 0, 140, 0);
  lg.addColorStop(0, "#d2d2d2");
  lg.addColorStop(0.3, "#fbfbfb");
  lg.addColorStop(0.66, "#8e8e8e");
  lg.addColorStop(0.88, "#2e2e2e");
  lg.addColorStop(1, "#101010");
  g.fillStyle = lg;
  g.fill(left);

  // 右の足｡左より暗く落として前後を分ける
  const right = new Path2D();
  right.moveTo(176, 34);
  right.quadraticCurveTo(216, 150, 260, 256);
  right.lineTo(204, 242);
  right.quadraticCurveTo(172, 150, 166, 52);
  right.closePath();
  const rg = g.createLinearGradient(160, 0, 264, 0);
  rg.addColorStop(0, "#1c1c1c");
  rg.addColorStop(0.26, "#767676");
  rg.addColorStop(0.6, "#d8d8d8");
  rg.addColorStop(0.86, "#3c3c3c");
  rg.addColorStop(1, "#0c0c0c");
  g.fillStyle = rg;
  g.fill(right);

  // 曲げ｡一枚の鉄を折り返したところ｡上を白く起こす
  const bend = new Path2D();
  bend.moveTo(124, 34);
  bend.quadraticCurveTo(150, 4, 176, 34);
  bend.lineTo(166, 52);
  bend.quadraticCurveTo(150, 30, 134, 52);
  bend.closePath();
  const bg = g.createLinearGradient(0, 4, 0, 56);
  bg.addColorStop(0, "#fcfcfc");
  bg.addColorStop(0.5, "#9e9e9e");
  bg.addColorStop(1, "#1e1e1e");
  g.fillStyle = bg;
  g.fill(bend);

  // 刃先｡平らに切った幅広の先端｡厚みを黒く､面を白く
  const tip = (ax: number, ay: number, bx: number, by: number) => {
    g.fillStyle = "#f8f8f8";
    g.beginPath();
    g.moveTo(ax, ay);
    g.lineTo(bx, by);
    g.lineTo(bx + (ax > bx ? 3 : -3), by + 15);
    g.lineTo(ax + (ax > bx ? 3 : -3), ay + 15);
    g.closePath();
    g.fill();
    g.strokeStyle = "rgba(12,12,12,0.85)";
    g.lineWidth = 3.6;
    g.stroke();
  };
  tip(40, 256, 96, 242);
  tip(260, 256, 204, 242);

  // 輪郭を黒く締める｡白い紙の股と足の境をはっきりさせる
  g.strokeStyle = "rgba(12,12,12,0.82)";
  g.lineWidth = 3.6;
  g.stroke(left);
  g.stroke(right);
  g.stroke(bend);

  // 鉄の照り｡足ごとに一本だけ長く通す
  g.save();
  g.clip(left);
  g.strokeStyle = "rgba(255,255,255,0.72)";
  g.lineWidth = 9;
  g.beginPath();
  g.moveTo(130, 52);
  g.quadraticCurveTo(94, 150, 54, 250);
  g.stroke();
  g.restore();
  g.save();
  g.clip(right);
  g.strokeStyle = "rgba(255,255,255,0.5)";
  g.lineWidth = 8;
  g.beginPath();
  g.moveTo(170, 54);
  g.quadraticCurveTo(206, 150, 246, 250);
  g.stroke();
  g.restore();

  g.restore();
};

/**
 * サティー｡口の狭い大きな油壺ひとつ｡
 * 被害は描かず､注がれなかった油の器のほうを置く｡
 * 突起はいっさい付けない｡胴ひとつの塊で､口と肩の段だけを白で切る｡
 */
const oilJar: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 胴｡首から肩へ張り出し､底へすぼまる｡左右対称の一枚の塊
  const body = new Path2D();
  body.moveTo(110, 52);
  body.bezierCurveTo(104, 82, 56, 102, 36, 156);
  body.bezierCurveTo(20, 202, 48, 266, 94, 288);
  body.quadraticCurveTo(150, 298, 206, 288);
  body.bezierCurveTo(252, 266, 280, 202, 264, 156);
  body.bezierCurveTo(244, 102, 196, 82, 190, 52);
  body.closePath();

  const clay = g.createLinearGradient(36, 0, 264, 0);
  clay.addColorStop(0, "#8c8c8c");
  clay.addColorStop(0.17, "#e8e8e8");
  clay.addColorStop(0.44, "#a2a2a2");
  clay.addColorStop(0.76, "#383838");
  clay.addColorStop(1, "#070707");
  g.fillStyle = clay;
  g.fill(body);

  // 胴の面の中だけで濃淡をつける｡広い帯を三本､明暗を交互に
  g.save();
  g.clip(body);
  g.lineCap = "round";
  g.strokeStyle = "rgba(255,255,255,0.8)";
  g.lineWidth = 15;
  g.beginPath();
  g.moveTo(24, 168);
  g.quadraticCurveTo(150, 212, 276, 168);
  g.stroke();
  g.strokeStyle = "rgba(8,8,8,0.36)";
  g.lineWidth = 20;
  g.beginPath();
  g.moveTo(24, 206);
  g.quadraticCurveTo(150, 250, 276, 206);
  g.stroke();
  g.strokeStyle = "rgba(8,8,8,0.5)";
  g.lineWidth = 26;
  g.beginPath();
  g.moveTo(80, 292);
  g.quadraticCurveTo(150, 306, 220, 292);
  g.stroke();
  g.restore();

  // 肩の段｡白く一本切って､首と胴を分ける
  g.strokeStyle = "rgba(255,255,255,0.95)";
  g.lineWidth = 8;
  g.beginPath();
  g.moveTo(52, 118);
  g.quadraticCurveTo(150, 162, 248, 118);
  g.stroke();
  g.strokeStyle = "rgba(8,8,8,0.55)";
  g.lineWidth = 7;
  g.beginPath();
  g.moveTo(54, 106);
  g.quadraticCurveTo(150, 150, 246, 106);
  g.stroke();

  // 輪郭｡黒く締めて､どの網でも形が残るようにする
  g.strokeStyle = "rgba(10,10,10,0.88)";
  g.lineWidth = 8;
  g.stroke(body);

  // 口縁｡首よりわずかに張った唇｡胴との境を白で切る
  const lip = g.createLinearGradient(100, 0, 200, 0);
  lip.addColorStop(0, "#9e9e9e");
  lip.addColorStop(0.2, "#f2f2f2");
  lip.addColorStop(0.6, "#8a8a8a");
  lip.addColorStop(1, "#141414");
  g.fillStyle = lip;
  g.beginPath();
  g.moveTo(102, 28);
  g.lineTo(198, 28);
  g.lineTo(192, 56);
  g.lineTo(108, 56);
  g.closePath();
  g.fill();
  g.strokeStyle = "rgba(10,10,10,0.85)";
  g.lineWidth = 6;
  g.stroke();
  g.strokeStyle = "rgba(255,255,255,0.95)";
  g.lineWidth = 6;
  g.beginPath();
  g.moveTo(108, 58);
  g.lineTo(192, 58);
  g.stroke();

  // 口の天｡細い環として明るく置き､中の穴だけを黒く落とす
  const top = g.createLinearGradient(102, 0, 198, 0);
  top.addColorStop(0, "#fafafa");
  top.addColorStop(0.45, "#c6c6c6");
  top.addColorStop(1, "#4e4e4e");
  g.fillStyle = top;
  g.beginPath();
  g.ellipse(150, 28, 48, 16, 0, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "rgba(10,10,10,0.85)";
  g.lineWidth = 5;
  g.beginPath();
  g.ellipse(150, 28, 48, 16, 0, 0, Math.PI * 2);
  g.stroke();
  const hole = g.createLinearGradient(0, 18, 0, 38);
  hole.addColorStop(0, "#000000");
  hole.addColorStop(1, "#3a3a3a");
  g.fillStyle = hole;
  g.beginPath();
  g.ellipse(150, 29, 30, 9, 0, 0, Math.PI * 2);
  g.fill();

  g.restore();
};

/** 寡婦は再婚しない｡割れた腕輪ひとつ｡欠けた口を白い楔で切る */
const brokenBangle: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  const cx = 150;
  const cy = 154;
  const oR = 116;
  const oY = 108;
  const iR = 74;
  const iY = 66;
  const a0 = -1.06; // 割れ目のはじまり
  const a1 = -0.6; // 割れ目のおわり

  const ring = new Path2D();
  ring.ellipse(cx, cy, oR, oY, 0, a1, a0 + Math.PI * 2, false);
  ring.lineTo(cx + Math.cos(a0) * iR, cy + Math.sin(a0) * iY);
  ring.ellipse(cx, cy, iR, iY, 0, a0 + Math.PI * 2, a1, true);
  ring.closePath();

  // 硝子の身｡左上から光を入れて右下へ沈める｡中は紙のまま白く抜く
  const glass = g.createRadialGradient(cx - 62, cy - 68, 10, cx, cy, 168);
  glass.addColorStop(0, "#ffffff");
  glass.addColorStop(0.3, "#e6e6e6");
  glass.addColorStop(0.62, "#9a9a9a");
  glass.addColorStop(0.86, "#3a3a3a");
  glass.addColorStop(1, "#0b0b0b");
  g.fillStyle = glass;
  g.fill(ring);

  g.save();
  g.clip(ring);
  // 内の縁を白く起こす｡硝子の厚みになる
  g.strokeStyle = "rgba(255,255,255,0.88)";
  g.lineWidth = 9;
  g.beginPath();
  g.ellipse(cx, cy, iR + 6, iY + 6, 0, 0, Math.PI * 2);
  g.stroke();
  // 外の縁を黒く締める
  g.strokeStyle = "rgba(10,10,10,0.9)";
  g.lineWidth = 9;
  g.beginPath();
  g.ellipse(cx, cy, oR - 4, oY - 4, 0, 0, Math.PI * 2);
  g.stroke();
  // 長い照り｡左上に一本だけ
  g.strokeStyle = "rgba(255,255,255,0.95)";
  g.lineWidth = 13;
  g.lineCap = "round";
  g.beginPath();
  g.ellipse(cx, cy, (oR + iR) / 2, (oY + iY) / 2, 0, Math.PI * 1.06, Math.PI * 1.54);
  g.stroke();
  g.restore();

  // 割れ口｡二つの断面を白く光らせ､欠けを楔で抜く
  const cut = (a: number, sgn: number) => {
    const ox = cx + Math.cos(a) * oR;
    const oy = cy + Math.sin(a) * oY;
    const ix = cx + Math.cos(a) * iR;
    const iy = cy + Math.sin(a) * iY;
    g.strokeStyle = "#fafafa";
    g.lineWidth = 6;
    g.beginPath();
    g.moveTo(ox, oy);
    g.lineTo(ix, iy);
    g.stroke();
    // 欠け｡紙の色で三角に抜く
    g.fillStyle = "#ffffff";
    g.beginPath();
    g.moveTo(ox, oy);
    g.lineTo(ix, iy);
    g.lineTo(ix + sgn * 20, iy + sgn * 16);
    g.closePath();
    g.fill();
  };
  cut(a0, 1);
  cut(a1, -1);

  // 飛んだ破片｡大きなものを二つだけ
  const shard = (p: [number, number][]) => {
    const f = g.createLinearGradient(p[0][0] - 20, p[0][1] - 20, p[0][0] + 26, p[0][1] + 26);
    f.addColorStop(0, "#fdfdfd");
    f.addColorStop(0.45, "#b6b6b6");
    f.addColorStop(1, "#1c1c1c");
    g.fillStyle = f;
    g.beginPath();
    g.moveTo(p[0][0], p[0][1]);
    for (let i = 1; i < p.length; i++) g.lineTo(p[i][0], p[i][1]);
    g.closePath();
    g.fill();
    g.strokeStyle = "rgba(12,12,12,0.75)";
    g.lineWidth = 3;
    g.stroke();
  };
  shard([
    [236, 24],
    [278, 40],
    [258, 70],
    [230, 52],
  ]);
  shard([
    [268, 96],
    [296, 118],
    [266, 134],
  ]);

  g.restore();
};

/** 不可触制｡禁止の目録に並ぶ共同の井戸｡石の塊を白い目地で切る */
const well: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  const cx = 150;
  const ry = 128;
  const oRx = 120;
  const oRy = 42;
  const iRx = 92;
  const iRy = 33;

  // 胴｡円筒の手前側｡上の境は縁の下半分に沿って中ほどが下がる
  const wall = new Path2D();
  wall.ellipse(cx, ry, oRx, oRy, 0, Math.PI, 0, true);
  wall.lineTo(258, 258);
  wall.quadraticCurveTo(cx, 290, 42, 258);
  wall.lineTo(30, ry);
  wall.closePath();
  const stone = g.createLinearGradient(24, 0, 276, 0);
  stone.addColorStop(0, "#8a8a8a");
  stone.addColorStop(0.14, "#fafafa");
  stone.addColorStop(0.48, "#cacaca");
  stone.addColorStop(0.82, "#3e3e3e");
  stone.addColorStop(1, "#0e0e0e");
  g.fillStyle = stone;
  g.fill(wall);

  // 石の目地｡白で切る｡横三段､縦は段ごとにずらす
  g.save();
  g.clip(wall);
  g.strokeStyle = "rgba(255,255,255,0.95)";
  g.lineWidth = 7;
  for (const dy of [0, 40, 80]) {
    g.beginPath();
    g.moveTo(26, 178 + dy * 0.82);
    g.quadraticCurveTo(cx, 210 + dy * 0.86, 274, 178 + dy * 0.82);
    g.stroke();
  }
  const joints: [number, number, number][] = [
    [86, 150, 186],
    [214, 152, 188],
    [150, 190, 226],
    [46, 188, 220],
    [254, 188, 220],
    [90, 228, 262],
    [212, 230, 264],
  ];
  for (const [x, y0, y1] of joints) {
    g.beginPath();
    g.moveTo(x, y0);
    g.lineTo(x + 3, y1);
    g.stroke();
  }
  g.restore();

  // 縁の上面｡ぐるりと一枚の環として明るく置く
  const top = g.createLinearGradient(30, 0, 270, 0);
  top.addColorStop(0, "#c8c8c8");
  top.addColorStop(0.2, "#fefefe");
  top.addColorStop(0.62, "#d2d2d2");
  top.addColorStop(1, "#6e6e6e");
  g.fillStyle = top;
  g.beginPath();
  g.ellipse(cx, ry, oRx, oRy, 0, 0, Math.PI * 2);
  g.fill();

  // 口｡暗い穴｡奥をいちばん黒くして手前の内壁を起こす
  const mouth = g.createLinearGradient(0, ry - iRy, 0, ry + iRy);
  mouth.addColorStop(0, "#060606");
  mouth.addColorStop(0.55, "#1c1c1c");
  mouth.addColorStop(1, "#4e4e4e");
  g.fillStyle = mouth;
  g.beginPath();
  g.ellipse(cx, ry, iRx, iRy, 0, 0, Math.PI * 2);
  g.fill();

  // 水｡穴の底に白い面をひとつ
  const water = g.createLinearGradient(0, ry + 2, 0, ry + 30);
  water.addColorStop(0, "#9c9c9c");
  water.addColorStop(0.5, "#f0f0f0");
  water.addColorStop(1, "#c6c6c6");
  g.fillStyle = water;
  g.beginPath();
  g.ellipse(cx, ry + 12, 58, 16, 0, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "rgba(255,255,255,0.95)";
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(cx - 34, ry + 8);
  g.lineTo(cx + 12, ry + 6);
  g.stroke();

  // 縁の内と外の角を締める
  g.strokeStyle = "rgba(12,12,12,0.75)";
  g.lineWidth = 4;
  g.beginPath();
  g.ellipse(cx, ry, iRx, iRy, 0, 0, Math.PI * 2);
  g.stroke();
  g.lineWidth = 3.4;
  g.beginPath();
  g.ellipse(cx, ry, oRx, oRy, 0, 0, Math.PI * 2);
  g.stroke();

  // 桶｡暗い右側の前に白い塊をひとつ置いて切る
  const bx = 234;
  const bTop = 236;
  const bucket = new Path2D();
  bucket.moveTo(bx - 46, bTop);
  bucket.lineTo(bx - 37, 292);
  bucket.quadraticCurveTo(bx, 306, bx + 37, 292);
  bucket.lineTo(bx + 46, bTop);
  bucket.closePath();
  const bg = g.createLinearGradient(bx - 46, 0, bx + 46, 0);
  bg.addColorStop(0, "#9e9e9e");
  bg.addColorStop(0.22, "#fbfbfb");
  bg.addColorStop(0.66, "#d0d0d0");
  bg.addColorStop(1, "#3a3a3a");
  g.fillStyle = bg;
  g.fill(bucket);
  // 箍｡二本だけ太く
  g.save();
  g.clip(bucket);
  g.strokeStyle = "rgba(14,14,14,0.85)";
  g.lineWidth = 9;
  for (const y of [256, 280]) {
    g.beginPath();
    g.moveTo(bx - 50, y);
    g.quadraticCurveTo(bx, y + 9, bx + 50, y);
    g.stroke();
  }
  g.restore();
  // 桶の内｡口を暗く落とす
  const bin = g.createLinearGradient(0, bTop - 14, 0, bTop + 14);
  bin.addColorStop(0, "#0c0c0c");
  bin.addColorStop(1, "#5e5e5e");
  g.fillStyle = bin;
  g.beginPath();
  g.ellipse(bx, bTop, 46, 15, 0, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "rgba(255,255,255,0.9)";
  g.lineWidth = 4.4;
  g.beginPath();
  g.ellipse(bx, bTop, 46, 15, 0, 0, Math.PI * 2);
  g.stroke();
  // 弦｡口の上に弧をひとつ渡す
  g.strokeStyle = "rgba(12,12,12,0.9)";
  g.lineWidth = 7;
  g.beginPath();
  g.moveTo(bx - 44, bTop - 4);
  g.quadraticCurveTo(bx, bTop - 62, bx + 44, bTop - 4);
  g.stroke();
  g.strokeStyle = "rgba(255,255,255,0.75)";
  g.lineWidth = 2.6;
  g.beginPath();
  g.moveTo(bx - 40, bTop - 10);
  g.quadraticCurveTo(bx, bTop - 60, bx + 40, bTop - 10);
  g.stroke();

  g.restore();
};

/** 児童婚｡はじめて引かれた線｡石板に彫った｢14｣と一本の溝 */
const carvedFourteen: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 石の厚み｡右と下に回して重さを出す
  const side = g.createLinearGradient(0, 240, 0, 276);
  side.addColorStop(0, "#5a5a5a");
  side.addColorStop(0.5, "#1a1a1a");
  side.addColorStop(1, "#0a0a0a");
  g.fillStyle = side;
  g.beginPath();
  g.moveTo(22, 244);
  g.lineTo(282, 244);
  g.lineTo(290, 272);
  g.lineTo(30, 272);
  g.closePath();
  g.fill();
  g.fillStyle = "#242424";
  g.beginPath();
  g.moveTo(278, 52);
  g.lineTo(290, 66);
  g.lineTo(290, 268);
  g.lineTo(278, 246);
  g.closePath();
  g.fill();

  // 石の面｡端を欠かせて彫り物の石に見せる
  const slab = new Path2D();
  slab.moveTo(22, 56);
  slab.lineTo(140, 50);
  slab.lineTo(214, 54);
  slab.lineTo(279, 50);
  slab.lineTo(281, 160);
  slab.lineTo(277, 246);
  slab.lineTo(150, 250);
  slab.lineTo(24, 245);
  slab.lineTo(20, 150);
  slab.closePath();
  const grain = g.createLinearGradient(20, 50, 282, 250);
  grain.addColorStop(0, "#fdfdfd");
  grain.addColorStop(0.42, "#ededed");
  grain.addColorStop(0.78, "#c0c0c0");
  grain.addColorStop(1, "#8e8e8e");
  g.fillStyle = grain;
  g.fill(slab);
  g.strokeStyle = "rgba(14,14,14,0.55)";
  g.lineWidth = 4;
  g.stroke(slab);

  // 彫った字｡下右にずらした明るい形を先に敷き､その上に暗い彫り口を置く
  const glyphs = (dx: number, dy: number, style: string | CanvasGradient) => {
    g.fillStyle = style;
    // 一
    g.beginPath();
    g.moveTo(75 + dx, 90 + dy);
    g.lineTo(103 + dx, 90 + dy);
    g.lineTo(103 + dx, 196 + dy);
    g.lineTo(75 + dx, 196 + dy);
    g.closePath();
    g.fill();
    g.beginPath();
    g.moveTo(55 + dx, 182 + dy);
    g.lineTo(123 + dx, 182 + dy);
    g.lineTo(123 + dx, 196 + dy);
    g.lineTo(55 + dx, 196 + dy);
    g.closePath();
    g.fill();
    g.beginPath();
    g.moveTo(75 + dx, 112 + dy);
    g.lineTo(75 + dx, 90 + dy);
    g.lineTo(53 + dx, 108 + dy);
    g.lineTo(59 + dx, 121 + dy);
    g.closePath();
    g.fill();
    // 四
    g.beginPath();
    g.moveTo(177 + dx, 90 + dy);
    g.lineTo(205 + dx, 90 + dy);
    g.lineTo(159 + dx, 162 + dy);
    g.lineTo(131 + dx, 162 + dy);
    g.closePath();
    g.fill();
    g.beginPath();
    g.moveTo(127 + dx, 162 + dy);
    g.lineTo(247 + dx, 162 + dy);
    g.lineTo(247 + dx, 182 + dy);
    g.lineTo(127 + dx, 182 + dy);
    g.closePath();
    g.fill();
    g.beginPath();
    g.moveTo(195 + dx, 90 + dy);
    g.lineTo(223 + dx, 90 + dy);
    g.lineTo(223 + dx, 196 + dy);
    g.lineTo(195 + dx, 196 + dy);
    g.closePath();
    g.fill();
  };
  glyphs(5, 6, "#ffffff");
  const cut = g.createLinearGradient(50, 88, 250, 200);
  cut.addColorStop(0, "#0a0a0a");
  cut.addColorStop(0.6, "#2e2e2e");
  cut.addColorStop(1, "#5a5a5a");
  glyphs(0, 0, cut);

  // 引かれた線｡数字の下に一本だけ深く彫る
  g.fillStyle = "#ffffff";
  g.fillRect(57, 220, 196, 12);
  g.fillStyle = cut;
  g.fillRect(52, 214, 196, 12);

  g.restore();
};

/** フェズをかぶる｡下へ広がる円筒の帽と一房｡人にはかぶせない */
const fez: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  const cx = 150;
  const tY = 72;
  const tRx = 82;
  const tRy = 26;
  const bY = 258;
  const bRx = 104;
  const bRy = 33;

  // 胴｡天の下半分から下へ｡下ほど広がる円錐にする
  const body = new Path2D();
  body.ellipse(cx, tY, tRx, tRy, 0, Math.PI, 0, true);
  body.lineTo(cx + bRx, bY);
  body.ellipse(cx, bY, bRx, bRy, 0, 0, Math.PI, false);
  body.lineTo(cx - tRx, tY);
  body.closePath();
  const felt = g.createLinearGradient(cx - bRx, 0, cx + bRx, 0);
  felt.addColorStop(0, "#b4b4b4");
  felt.addColorStop(0.17, "#fafafa");
  felt.addColorStop(0.48, "#c2c2c2");
  felt.addColorStop(0.8, "#3a3a3a");
  felt.addColorStop(1, "#0e0e0e");
  g.fillStyle = felt;
  g.fill(body);

  // 毛氈の畝｡広い帯を二本だけ｡明暗を対で入れる
  g.save();
  g.clip(body);
  g.strokeStyle = "rgba(255,255,255,0.5)";
  g.lineWidth = 17;
  g.beginPath();
  g.moveTo(cx - 40, 96);
  g.lineTo(cx - 52, 276);
  g.stroke();
  g.strokeStyle = "rgba(12,12,12,0.26)";
  g.lineWidth = 22;
  g.beginPath();
  g.moveTo(cx + 38, 94);
  g.lineTo(cx + 50, 276);
  g.stroke();
  g.restore();

  // 下端の口｡細く黒く締めるだけにする（開いた桶に見せない）
  g.strokeStyle = "rgba(12,12,12,0.8)";
  g.lineWidth = 5;
  g.beginPath();
  g.ellipse(cx, bY, bRx, bRy, 0, 0, Math.PI);
  g.stroke();

  // 天｡塞がった平らな面｡胴の明るい側より沈めて別の面にする
  const crown = g.createLinearGradient(cx - tRx, tY - tRy, cx + tRx, tY + tRy);
  crown.addColorStop(0, "#cfcfcf");
  crown.addColorStop(0.45, "#9a9a9a");
  crown.addColorStop(1, "#4e4e4e");
  g.fillStyle = crown;
  g.beginPath();
  g.ellipse(cx, tY, tRx, tRy, 0, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "rgba(10,10,10,0.85)";
  g.lineWidth = 5;
  g.beginPath();
  g.ellipse(cx, tY, tRx, tRy, 0, 0, Math.PI * 2);
  g.stroke();
  // 天の縫い目｡弧を一本だけ
  g.strokeStyle = "rgba(255,255,255,0.55)";
  g.lineWidth = 4;
  g.beginPath();
  g.ellipse(cx, tY, tRx - 16, tRy - 6, 0, Math.PI * 1.1, Math.PI * 1.9);
  g.stroke();

  // 房の紐｡天の真ん中の釦から右の縁を越えて外へ渡す
  g.strokeStyle = "#111111";
  g.lineWidth = 11;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(cx, tY);
  g.quadraticCurveTo(cx + 84, tY - 4, cx + 122, tY + 26);
  g.stroke();
  g.strokeStyle = "rgba(255,255,255,0.55)";
  g.lineWidth = 3.4;
  g.beginPath();
  g.moveTo(cx + 8, tY - 5);
  g.quadraticCurveTo(cx + 80, tY - 10, cx + 116, tY + 20);
  g.stroke();
  g.fillStyle = "#2c2c2c";
  g.beginPath();
  g.ellipse(cx, tY, 11, 6, 0, 0, Math.PI * 2);
  g.fill();

  // 房｡括りの瘤と垂れた束｡胴とのあいだは紙のまま白く空ける
  g.fillStyle = "#151515";
  g.beginPath();
  g.ellipse(274, 112, 21, 17, 0, 0, Math.PI * 2);
  g.fill();
  const hank = new Path2D();
  hank.moveTo(256, 122);
  hank.lineTo(292, 122);
  hank.quadraticCurveTo(300, 200, 296, 250);
  hank.quadraticCurveTo(274, 266, 250, 250);
  hank.quadraticCurveTo(250, 198, 256, 122);
  hank.closePath();
  const brush = g.createLinearGradient(246, 0, 300, 0);
  brush.addColorStop(0, "#5e5e5e");
  brush.addColorStop(0.32, "#141414");
  brush.addColorStop(0.72, "#4e4e4e");
  brush.addColorStop(1, "#0a0a0a");
  g.fillStyle = brush;
  g.fill(hank);
  g.save();
  g.clip(hank);
  g.fillStyle = "rgba(255,255,255,0.92)";
  g.fillRect(244, 128, 62, 12);
  g.strokeStyle = "rgba(255,255,255,0.5)";
  g.lineWidth = 5;
  for (let i = -1; i <= 1; i++) {
    g.beginPath();
    g.moveTo(272 + i * 12, 146);
    g.lineTo(274 + i * 17, 258);
    g.stroke();
  }
  g.restore();

  g.restore();
};

/** 一夫多妻｡ひとつの錠に三つの鍵穴｡黒い穴で白い金物を切る */
const padlock: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 掛け金｡太い弧をひとつ｡左を白く起こして右へ落とす
  const shackle = g.createLinearGradient(86, 0, 214, 0);
  shackle.addColorStop(0, "#f6f6f6");
  shackle.addColorStop(0.3, "#c0c0c0");
  shackle.addColorStop(0.68, "#4a4a4a");
  shackle.addColorStop(1, "#0d0d0d");
  g.strokeStyle = shackle;
  g.lineWidth = 27;
  g.lineCap = "butt";
  g.beginPath();
  g.arc(150, 122, 58, Math.PI, Math.PI * 2);
  g.stroke();
  g.fillStyle = shackle;
  g.fillRect(78, 116, 27, 26);
  g.fillRect(195, 116, 27, 26);
  g.strokeStyle = "rgba(255,255,255,0.75)";
  g.lineWidth = 5;
  g.beginPath();
  g.arc(150, 122, 50, Math.PI * 1.04, Math.PI * 1.62);
  g.stroke();
  g.strokeStyle = "rgba(10,10,10,0.7)";
  g.lineWidth = 3.4;
  g.beginPath();
  g.arc(150, 122, 71.5, Math.PI, Math.PI * 2);
  g.stroke();

  // 胴｡角の丸い大きな一枚｡左上から光を入れる
  const shell = new Path2D();
  const r = 28;
  const x0 = 44;
  const x1 = 256;
  const y0 = 132;
  const y1 = 284;
  shell.moveTo(x0 + r, y0);
  shell.lineTo(x1 - r, y0);
  shell.quadraticCurveTo(x1, y0, x1, y0 + r);
  shell.lineTo(x1, y1 - r);
  shell.quadraticCurveTo(x1, y1, x1 - r, y1);
  shell.lineTo(x0 + r, y1);
  shell.quadraticCurveTo(x0, y1, x0, y1 - r);
  shell.lineTo(x0, y0 + r);
  shell.quadraticCurveTo(x0, y0, x0 + r, y0);
  shell.closePath();
  const iron = g.createLinearGradient(x0, y0, x1, y1);
  iron.addColorStop(0, "#fdfdfd");
  iron.addColorStop(0.34, "#e2e2e2");
  iron.addColorStop(0.72, "#9a9a9a");
  iron.addColorStop(1, "#3a3a3a");
  g.fillStyle = iron;
  g.fill(shell);

  // 縁の面取り｡上と左を白く､下と右を黒く
  g.save();
  g.clip(shell);
  g.strokeStyle = "rgba(255,255,255,0.9)";
  g.lineWidth = 10;
  g.beginPath();
  g.moveTo(x0 + 6, y1 - 30);
  g.lineTo(x0 + 6, y0 + 22);
  g.quadraticCurveTo(x0 + 8, y0 + 6, x0 + 30, y0 + 6);
  g.lineTo(x1 - 30, y0 + 6);
  g.stroke();
  g.strokeStyle = "rgba(10,10,10,0.8)";
  g.lineWidth = 12;
  g.beginPath();
  g.moveTo(x1 - 6, y0 + 30);
  g.lineTo(x1 - 6, y1 - 24);
  g.quadraticCurveTo(x1 - 8, y1 - 6, x1 - 32, y1 - 6);
  g.lineTo(x0 + 32, y1 - 6);
  g.stroke();
  // 合わせ目｡横に一本だけ通す
  g.strokeStyle = "rgba(12,12,12,0.4)";
  g.lineWidth = 5;
  g.beginPath();
  g.moveTo(x0, y0 + 24);
  g.lineTo(x1, y0 + 24);
  g.stroke();
  g.strokeStyle = "rgba(255,255,255,0.85)";
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(x0, y0 + 30);
  g.lineTo(x1, y0 + 30);
  g.stroke();
  g.restore();
  g.strokeStyle = "rgba(12,12,12,0.7)";
  g.lineWidth = 4;
  g.stroke(shell);

  // 鍵穴｡同じ形を三つ｡明るい下縁を先に敷いて彫り込みに見せる
  const hole = (hx: number, dx: number, dy: number, style: string | CanvasGradient) => {
    g.fillStyle = style;
    g.beginPath();
    g.arc(hx + dx, 200 + dy, 20, 0, Math.PI * 2);
    g.fill();
    g.beginPath();
    g.moveTo(hx - 9 + dx, 208 + dy);
    g.lineTo(hx + 9 + dx, 208 + dy);
    g.lineTo(hx + 6 + dx, 252 + dy);
    g.lineTo(hx - 6 + dx, 252 + dy);
    g.closePath();
    g.fill();
  };
  for (const hx of [88, 150, 212]) {
    hole(hx, 5, 5, "#ffffff");
    const dark = g.createRadialGradient(hx - 8, 192, 3, hx, 208, 52);
    dark.addColorStop(0, "#3a3a3a");
    dark.addColorStop(0.5, "#141414");
    dark.addColorStop(1, "#000000");
    hole(hx, 0, 0, dark);
  }

  g.restore();
};

export const PLATES_G: Record<string, Draw> = {
  "069": birchRod,
  "070": holedCoin,
  "071": sanbo,
  "072": tweezers,
  "073": oilJar,
  "074": brokenBangle,
  "075": well,
  "076": carvedFourteen,
  "077": fez,
  "078": padlock,
};
