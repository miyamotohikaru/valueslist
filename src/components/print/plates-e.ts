/**
 * 図版の版下（その五）｡
 *
 * ここでは網のことは考えず､灰色の絵として描く｡
 * 立体感は濃淡で出しておくと､網にかけたときに刷り物の肌になる｡
 * 座標は 300 四方で書いて､s で伸ばす｡枠いっぱいに大きく取る｡
 */

import type { Draw } from "./draw";

/** 角の丸い四角｡経路だけ作って､塗りは呼ぶ側に任せる */
const rrect = (
  g: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) => {
  g.beginPath();
  g.moveTo(x + r, y);
  g.lineTo(x + w - r, y);
  g.quadraticCurveTo(x + w, y, x + w, y + r);
  g.lineTo(x + w, y + h - r);
  g.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  g.lineTo(x + r, y + h);
  g.quadraticCurveTo(x, y + h, x, y + h - r);
  g.lineTo(x, y + r);
  g.quadraticCurveTo(x, y, x + r, y);
  g.closePath();
};

/** 科挙｡墨を溜めた硯と､手前に置いた筆｡読み書きで官が決まったことを指す */
const suzuri: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 天面｡奥が狭く手前が広い台形｡一番大きな明るい塊
  const top = new Path2D();
  top.moveTo(74, 52);
  top.quadraticCurveTo(62, 52, 58, 62);
  top.lineTo(16, 168);
  top.lineTo(284, 168);
  top.lineTo(242, 62);
  top.quadraticCurveTo(238, 52, 226, 52);
  top.closePath();
  const face = g.createLinearGradient(40, 52, 260, 168);
  face.addColorStop(0, "#f2f2f2");
  face.addColorStop(0.34, "#cecece");
  face.addColorStop(0.68, "#9a9a9a");
  face.addColorStop(1, "#6e6e6e");
  g.fillStyle = face;
  g.fill(top);

  // 手前の側面｡厚みだけを黒く落として天面から切り離す
  const side = new Path2D();
  side.moveTo(16, 168);
  side.lineTo(284, 168);
  side.quadraticCurveTo(280, 202, 268, 202);
  side.lineTo(32, 202);
  side.quadraticCurveTo(20, 202, 16, 168);
  side.closePath();
  const wall = g.createLinearGradient(0, 168, 0, 202);
  wall.addColorStop(0, "#565656");
  wall.addColorStop(0.45, "#0e0e0e");
  wall.addColorStop(1, "#3a3a3a");
  g.fillStyle = wall;
  g.fill(side);

  // 天面と側面のあいだを白く切る
  g.strokeStyle = "#fbfbfb";
  g.lineWidth = 7;
  g.beginPath();
  g.moveTo(16, 168);
  g.lineTo(284, 168);
  g.stroke();

  // 研ぎ面（堂）｡縁を残して一段くぼませる
  const hall = new Path2D();
  hall.moveTo(92, 74);
  hall.lineTo(208, 74);
  hall.lineTo(246, 148);
  hall.lineTo(54, 148);
  hall.closePath();
  const inner = g.createLinearGradient(0, 74, 0, 148);
  inner.addColorStop(0, "#4e4e4e");
  inner.addColorStop(0.36, "#a6a6a6");
  inner.addColorStop(1, "#e4e4e4");
  g.fillStyle = inner;
  g.fill(hall);

  // 窪みの縁｡白い細線で段を立てる
  g.strokeStyle = "rgba(252,252,252,0.9)";
  g.lineWidth = 4.5;
  g.beginPath();
  g.moveTo(54, 148);
  g.lineTo(92, 74);
  g.lineTo(208, 74);
  g.lineTo(246, 148);
  g.stroke();

  // 磨り跡｡堂の上を横に走る太い光
  g.save();
  g.clip(hall);
  g.strokeStyle = "rgba(255,255,255,0.5)";
  g.lineWidth = 9;
  for (let i = 0; i < 3; i++) {
    const y = 116 + i * 12;
    g.beginPath();
    g.moveTo(58, y);
    g.quadraticCurveTo(150, y - 7, 242, y);
    g.stroke();
  }
  g.restore();

  // 池｡奥の端に墨が溜まって真っ黒になる｡この黒が一番濃い
  const pool = new Path2D();
  pool.moveTo(98, 78);
  pool.lineTo(202, 78);
  pool.bezierCurveTo(198, 132, 102, 132, 98, 78);
  pool.closePath();
  const ink = g.createLinearGradient(0, 78, 0, 132);
  ink.addColorStop(0, "#050505");
  ink.addColorStop(0.62, "#161616");
  ink.addColorStop(1, "#3c3c3c");
  g.fillStyle = ink;
  g.fill(pool);

  // 墨の面の照り｡黒の中に白を一本だけ入れる
  g.strokeStyle = "rgba(250,250,250,0.72)";
  g.lineWidth = 5;
  g.beginPath();
  g.moveTo(114, 108);
  g.quadraticCurveTo(150, 122, 188, 106);
  g.stroke();

  // 筆｡硯の手前に横たえる｡白い間をあけて別の塊にする
  const tuft = new Path2D();
  tuft.moveTo(18, 278);
  tuft.quadraticCurveTo(54, 278, 86, 272);
  tuft.lineTo(88, 246);
  tuft.quadraticCurveTo(52, 264, 18, 278);
  tuft.closePath();
  g.strokeStyle = "#fcfcfc";
  g.lineWidth = 7;
  g.stroke(tuft);
  const hair = g.createLinearGradient(88, 0, 18, 0);
  hair.addColorStop(0, "#6e6e6e");
  hair.addColorStop(0.45, "#1c1c1c");
  hair.addColorStop(1, "#040404");
  g.fillStyle = hair;
  g.fill(tuft);

  const shaft = new Path2D();
  shaft.moveTo(100, 271);
  shaft.lineTo(288, 250);
  shaft.lineTo(286, 226);
  shaft.lineTo(98, 246);
  shaft.closePath();
  g.strokeStyle = "#fcfcfc";
  g.lineWidth = 7;
  g.stroke(shaft);
  const bamboo = g.createLinearGradient(0, 226, 0, 271);
  bamboo.addColorStop(0, "#efefef");
  bamboo.addColorStop(0.34, "#b6b6b6");
  bamboo.addColorStop(0.76, "#303030");
  bamboo.addColorStop(1, "#0b0b0b");
  g.fillStyle = bamboo;
  g.fill(shaft);

  // 口金｡穂と軸を締める黒い帯
  const ferrule = g.createLinearGradient(0, 244, 0, 274);
  ferrule.addColorStop(0, "#d8d8d8");
  ferrule.addColorStop(0.5, "#2a2a2a");
  ferrule.addColorStop(1, "#0a0a0a");
  g.fillStyle = ferrule;
  g.beginPath();
  g.moveTo(84, 274);
  g.lineTo(104, 272);
  g.lineTo(102, 244);
  g.lineTo(86, 246);
  g.closePath();
  g.fill();
  g.restore();
};

/** 決闘｡投げつけられた籠手｡名誉の挑みを器物ひとつで指す */
const gauntlet: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);
  g.translate(150, 150);
  g.rotate(-0.5);

  // 革の濃淡｡左上から光が当たって右下へ沈む
  const hide = g.createRadialGradient(-24, -16, 12, 8, 34, 196);
  hide.addColorStop(0, "#e8e8e8");
  hide.addColorStop(0.3, "#a0a0a0");
  hide.addColorStop(0.62, "#414141");
  hide.addColorStop(1, "#0a0a0a");

  // 指｡太い丸筒を四本｡塗りは同じなのでひと続きの塊になる
  g.strokeStyle = hide;
  g.lineCap = "round";
  g.lineWidth = 30;
  for (const [x, tip] of [
    [-54, -100],
    [-26, -124],
    [2, -132],
    [30, -120],
  ] as const) {
    g.beginPath();
    g.moveTo(x, -40);
    g.lineTo(x, tip);
    g.stroke();
  }

  // 親指｡右へ張り出す
  g.lineWidth = 36;
  g.beginPath();
  g.moveTo(34, -8);
  g.lineTo(82, -40);
  g.stroke();

  // 甲｡指の付け根をまとめる大きな塊
  g.fillStyle = hide;
  rrect(g, -70, -62, 116, 92, 26);
  g.fill();

  // 筒（ゴントレットの口）｡外へ開く
  const cuff = new Path2D();
  cuff.moveTo(-52, 22);
  cuff.lineTo(52, 22);
  cuff.quadraticCurveTo(68, 76, 66, 112);
  cuff.quadraticCurveTo(0, 138, -66, 112);
  cuff.quadraticCurveTo(-68, 76, -52, 22);
  cuff.closePath();
  g.fillStyle = hide;
  g.fill(cuff);

  // 指のあいだ｡白く抜いて四本に割る
  g.strokeStyle = "#fcfcfc";
  g.lineWidth = 7;
  for (const x of [-40, -12, 16] as const) {
    g.beginPath();
    g.moveTo(x, -34);
    g.lineTo(x, -104);
    g.stroke();
  }

  // 親指と甲のあいだ､甲と筒のあいだ｡ここも白で切る
  g.lineWidth = 8;
  g.beginPath();
  g.moveTo(30, -34);
  g.quadraticCurveTo(48, -16, 62, -22);
  g.stroke();
  g.lineWidth = 9;
  g.beginPath();
  g.moveTo(-58, 22);
  g.quadraticCurveTo(0, 36, 58, 22);
  g.stroke();

  // 口の内｡空っぽの穴を黒く見せる
  const hole = g.createLinearGradient(0, 100, 0, 136);
  hole.addColorStop(0, "#080808");
  hole.addColorStop(1, "#4c4c4c");
  g.fillStyle = hole;
  g.beginPath();
  g.ellipse(0, 116, 66, 20, 0, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "rgba(252,252,252,0.85)";
  g.lineWidth = 6;
  g.beginPath();
  g.ellipse(0, 114, 66, 20, 0, Math.PI, Math.PI * 2);
  g.stroke();

  // 甲の大きな皺｡一本だけ深く入れる
  g.strokeStyle = "rgba(10,10,10,0.55)";
  g.lineWidth = 11;
  g.beginPath();
  g.moveTo(-62, -14);
  g.quadraticCurveTo(-8, 4, 40, -18);
  g.stroke();
  g.restore();
};

/** 纏足｡弓鞋（長さ十五センチに満たない靴）と巻いた布帯 */
const bowShoe: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 布帯｡二百十センチを巻いた一巻き｡平たい円盤にして球に見せない
  const roll = g.createLinearGradient(40, 44, 148, 134);
  roll.addColorStop(0, "#f2f2f2");
  roll.addColorStop(0.32, "#c4c4c4");
  roll.addColorStop(0.7, "#565656");
  roll.addColorStop(1, "#111111");
  g.fillStyle = roll;
  g.beginPath();
  g.ellipse(92, 88, 56, 50, 0, 0, Math.PI * 2);
  g.fill();

  // 巻きの重なり｡渦を一本だけ入れて布であることを示す
  g.strokeStyle = "rgba(252,252,252,0.75)";
  g.lineWidth = 6;
  g.beginPath();
  for (let i = 0; i <= 70; i++) {
    const t = i / 70;
    const a = -0.9 + t * Math.PI * 2.4;
    const x = 92 + Math.cos(a) * (50 - t * 28);
    const y = 88 + Math.sin(a) * (44 - t * 25);
    if (i === 0) g.moveTo(x, y);
    else g.lineTo(x, y);
  }
  g.stroke();

  // 芯｡真ん中に穴を開けて巻物だと分からせる
  const core = g.createLinearGradient(0, 74, 0, 104);
  core.addColorStop(0, "#060606");
  core.addColorStop(1, "#525252");
  g.fillStyle = core;
  g.beginPath();
  g.ellipse(92, 88, 18, 16, 0, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "rgba(252,252,252,0.92)";
  g.lineWidth = 5;
  g.beginPath();
  g.ellipse(92, 88, 18, 16, 0, 0, Math.PI * 2);
  g.stroke();

  // 解けた端｡右へ伸びて厚みを見せる
  const tail = new Path2D();
  tail.moveTo(142, 62);
  tail.quadraticCurveTo(190, 46, 224, 62);
  tail.lineTo(222, 80);
  tail.quadraticCurveTo(190, 66, 144, 82);
  tail.closePath();
  const band = g.createLinearGradient(142, 0, 224, 0);
  band.addColorStop(0, "#3c3c3c");
  band.addColorStop(0.5, "#b2b2b2");
  band.addColorStop(1, "#242424");
  g.fillStyle = band;
  g.fill(tail);
  g.strokeStyle = "#fcfcfc";
  g.lineWidth = 6;
  g.stroke(tail);

  // 靴｡爪先が尖って反り上がり､踵が高く立つ｡ひと続きの塊で描く
  const shoe = new Path2D();
  shoe.moveTo(42, 202);
  shoe.quadraticCurveTo(54, 240, 110, 250);
  shoe.lineTo(212, 252);
  shoe.quadraticCurveTo(252, 252, 254, 224);
  shoe.lineTo(248, 172);
  shoe.quadraticCurveTo(246, 152, 224, 152);
  shoe.quadraticCurveTo(194, 154, 172, 166);
  shoe.bezierCurveTo(136, 180, 84, 194, 42, 202);
  shoe.closePath();
  const silk = g.createLinearGradient(60, 160, 240, 250);
  silk.addColorStop(0, "#efefef");
  silk.addColorStop(0.28, "#b6b6b6");
  silk.addColorStop(0.62, "#3e3e3e");
  silk.addColorStop(1, "#0b0b0b");
  g.fillStyle = silk;
  g.fill(shoe);

  // 白い縁取り｡紙から､また布帯から切り離す
  g.strokeStyle = "#fcfcfc";
  g.lineWidth = 8;
  g.stroke(shoe);

  // 底｡楔形の厚みを黒く敷く
  g.save();
  g.clip(shoe);
  const sole = new Path2D();
  sole.moveTo(42, 202);
  sole.quadraticCurveTo(54, 240, 110, 250);
  sole.lineTo(212, 252);
  sole.quadraticCurveTo(252, 252, 254, 224);
  sole.lineTo(254, 260);
  sole.lineTo(40, 258);
  sole.closePath();
  const under = g.createLinearGradient(0, 216, 0, 258);
  under.addColorStop(0, "#5a5a5a");
  under.addColorStop(0.5, "#101010");
  under.addColorStop(1, "#2e2e2e");
  g.fillStyle = under;
  g.fill(sole);
  g.restore();

  // 底と甲のあいだ｡白い一本で二つの塊に割る
  g.strokeStyle = "rgba(252,252,252,0.92)";
  g.lineWidth = 7;
  g.beginPath();
  g.moveTo(48, 208);
  g.quadraticCurveTo(140, 232, 250, 220);
  g.stroke();

  // 履き口｡踵の上に空いた穴
  const mouth = g.createLinearGradient(0, 148, 0, 178);
  mouth.addColorStop(0, "#070707");
  mouth.addColorStop(1, "#4a4a4a");
  g.fillStyle = mouth;
  g.beginPath();
  g.ellipse(214, 162, 34, 13, -0.22, 0, Math.PI * 2);
  g.fill();

  // 甲の縫い｡太い光を一本だけ通す
  g.strokeStyle = "rgba(255,255,255,0.62)";
  g.lineWidth = 7;
  g.beginPath();
  g.moveTo(58, 198);
  g.quadraticCurveTo(140, 178, 196, 172);
  g.stroke();
  g.restore();
};

/** 魔女は焼く｡『魔女に与える鉄槌』の鉄槌｡頭を振り上げた形にする */
const malletHead: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);
  g.translate(150, 150);
  g.rotate(-0.12);
  g.translate(-150, -150);

  // 柄｡頭の目から下へ｡木の肌は太い筋を二本だけ
  const wood = g.createLinearGradient(126, 0, 190, 0);
  wood.addColorStop(0, "#0d0d0d");
  wood.addColorStop(0.24, "#8e8e8e");
  wood.addColorStop(0.5, "#d4d4d4");
  wood.addColorStop(0.78, "#464646");
  wood.addColorStop(1, "#0f0f0f");
  const shaft = new Path2D();
  shaft.moveTo(128, 104);
  shaft.lineTo(172, 102);
  shaft.lineTo(198, 274);
  shaft.lineTo(150, 278);
  shaft.closePath();
  g.fillStyle = wood;
  g.fill(shaft);
  g.save();
  g.clip(shaft);
  g.strokeStyle = "rgba(255,255,255,0.3)";
  g.lineWidth = 3.5;
  for (const o of [-10, 6] as const) {
    g.beginPath();
    g.moveTo(150 + o, 106);
    g.lineTo(174 + o, 272);
    g.stroke();
  }
  g.restore();

  // 柄尻｡端を膨らませて握りを締める
  g.fillStyle = "#121212";
  g.beginPath();
  g.ellipse(174, 274, 26, 10, -0.12, 0, Math.PI * 2);
  g.fill();

  // 頭｡横に寝た鉄の塊｡左が打ち面で右の尻が丸く細る
  const head = new Path2D();
  head.moveTo(44, 76);
  head.quadraticCurveTo(44, 58, 62, 56);
  head.lineTo(196, 46);
  head.quadraticCurveTo(234, 43, 240, 78);
  head.quadraticCurveTo(245, 113, 206, 119);
  head.lineTo(62, 128);
  head.quadraticCurveTo(44, 128, 44, 110);
  head.closePath();
  const ironG = g.createLinearGradient(0, 44, 0, 130);
  ironG.addColorStop(0, "#f2f2f2");
  ironG.addColorStop(0.24, "#a4a4a4");
  ironG.addColorStop(0.56, "#2a2a2a");
  ironG.addColorStop(0.84, "#0b0b0b");
  ironG.addColorStop(1, "#4c4c4c");
  g.fillStyle = ironG;
  g.fill(head);

  // 頭と柄のあいだ｡白い一本で切る
  g.strokeStyle = "#fcfcfc";
  g.lineWidth = 9;
  g.beginPath();
  g.moveTo(62, 130);
  g.lineTo(206, 121);
  g.stroke();

  // 打ち面｡左の端だけ磨り上がって白い
  const hit = g.createLinearGradient(36, 0, 66, 0);
  hit.addColorStop(0, "#fdfdfd");
  hit.addColorStop(0.62, "#c8c8c8");
  hit.addColorStop(1, "#6e6e6e");
  g.fillStyle = hit;
  rrect(g, 34, 62, 30, 62, 10);
  g.fill();
  g.strokeStyle = "rgba(252,252,252,0.9)";
  g.lineWidth = 6;
  g.beginPath();
  g.moveTo(64, 58);
  g.lineTo(64, 128);
  g.stroke();

  // 目｡柄を通す襟を一段高く出す｡ここで槌だと分かる
  const collar = g.createLinearGradient(116, 0, 188, 0);
  collar.addColorStop(0, "#efefef");
  collar.addColorStop(0.38, "#828282");
  collar.addColorStop(1, "#111111");
  g.fillStyle = collar;
  rrect(g, 118, 34, 66, 106, 12);
  g.fill();
  g.strokeStyle = "#fcfcfc";
  g.lineWidth = 8;
  rrect(g, 118, 34, 66, 106, 12);
  g.stroke();

  // 楔｡目に打ち込んだ白い一片
  g.fillStyle = "#fbfbfb";
  g.beginPath();
  g.moveTo(138, 54);
  g.lineTo(164, 52);
  g.lineTo(159, 80);
  g.lineTo(143, 80);
  g.closePath();
  g.fill();
  g.restore();
};

/** 辮髪｡開いた鋏と､切り落とされた編み髪 */
const shears: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  g.save();
  g.translate(150, 150);
  g.rotate(-0.52);

  const steel = g.createLinearGradient(-72, 0, 72, 0);
  steel.addColorStop(0, "#101010");
  steel.addColorStop(0.24, "#9c9c9c");
  steel.addColorStop(0.46, "#f0f0f0");
  steel.addColorStop(0.74, "#464646");
  steel.addColorStop(1, "#0b0b0b");

  // 刃｡二枚をV字に開く｡あいだは紙のまま白く空ける
  const bladeL = new Path2D();
  bladeL.moveTo(10, 2);
  bladeL.quadraticCurveTo(-8, -60, -52, -122);
  bladeL.quadraticCurveTo(-40, -74, -18, 4);
  bladeL.closePath();
  const bladeR = new Path2D();
  bladeR.moveTo(-6, 2);
  bladeR.quadraticCurveTo(12, -58, 44, -128);
  bladeR.quadraticCurveTo(40, -70, 22, 4);
  bladeR.closePath();
  g.fillStyle = steel;
  g.fill(bladeL);
  g.fill(bladeR);

  // 刃先の光｡切る側の縁だけ白く残す
  g.strokeStyle = "rgba(255,255,255,0.92)";
  g.lineWidth = 5;
  g.beginPath();
  g.moveTo(-52, -122);
  g.quadraticCurveTo(-8, -60, 10, 2);
  g.stroke();
  g.beginPath();
  g.moveTo(44, -128);
  g.quadraticCurveTo(12, -58, -6, 2);
  g.stroke();

  // 脚｡要から下へ開いて環に入る
  g.strokeStyle = steel;
  g.lineCap = "round";
  g.lineWidth = 19;
  g.beginPath();
  g.moveTo(-2, 4);
  g.quadraticCurveTo(-22, 44, -32, 62);
  g.stroke();
  g.beginPath();
  g.moveTo(8, 4);
  g.quadraticCurveTo(30, 40, 38, 58);
  g.stroke();

  // 環｡指を入れる大きな輪を二つ
  for (const [cx, cy, r] of [
    [-36, 92, 36],
    [44, 88, 33],
  ] as const) {
    g.strokeStyle = "#fbfbfb";
    g.lineWidth = 27;
    g.beginPath();
    g.arc(cx, cy, r, 0, Math.PI * 2);
    g.stroke();
    g.strokeStyle = steel;
    g.lineWidth = 17;
    g.beginPath();
    g.arc(cx, cy, r, 0, Math.PI * 2);
    g.stroke();
  }

  // 要の鑚｡二枚を留める小さな円
  const pin = g.createRadialGradient(-2, -3, 1, 2, 0, 14);
  pin.addColorStop(0, "#fdfdfd");
  pin.addColorStop(0.6, "#8e8e8e");
  pin.addColorStop(1, "#0b0b0b");
  g.fillStyle = pin;
  g.beginPath();
  g.arc(2, 0, 13, 0, Math.PI * 2);
  g.fill();
  g.restore();

  // 切り落とされた編み髪｡太い一筋に山形の綾を重ねる
  const hair = new Path2D();
  hair.moveTo(20, 186);
  hair.quadraticCurveTo(58, 214, 104, 264);
  hair.lineTo(84, 282);
  hair.quadraticCurveTo(44, 236, 6, 212);
  hair.closePath();
  const plait = g.createLinearGradient(6, 186, 104, 282);
  plait.addColorStop(0, "#6e6e6e");
  plait.addColorStop(0.4, "#262626");
  plait.addColorStop(1, "#070707");
  g.strokeStyle = "#fcfcfc";
  g.lineWidth = 9;
  g.stroke(hair);
  g.fillStyle = plait;
  g.fill(hair);

  // 綾｡白い山形で編み目を出す
  g.save();
  g.clip(hair);
  g.strokeStyle = "rgba(252,252,252,0.72)";
  g.lineWidth = 6;
  g.lineCap = "butt";
  for (let i = 0; i < 5; i++) {
    const t = 0.1 + i * 0.2;
    const x = 12 + t * 82;
    const y = 196 + t * 76;
    g.beginPath();
    g.moveTo(x - 20, y - 8);
    g.lineTo(x + 6, y + 10);
    g.lineTo(x - 12, y + 26);
    g.stroke();
  }
  g.restore();

  // 結わえた先｡黒い留めと房
  g.fillStyle = "#0a0a0a";
  g.beginPath();
  g.ellipse(96, 272, 16, 9, 0.9, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "rgba(14,14,14,0.85)";
  g.lineWidth = 5;
  g.lineCap = "round";
  for (const a of [0.5, 0.85, 1.2] as const) {
    g.beginPath();
    g.moveTo(100, 278);
    g.lineTo(100 + Math.cos(a) * 30, 278 + Math.sin(a) * 26);
    g.stroke();
  }
  g.restore();
};

/** 人は土地に付いてくる｡黒土に噛まれた繋ぎの鉄環 */
const tetherRing: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 環｡鍛えた鉄｡左へ寄せて深く傾ける｡真ん中に立てると人の影に見える
  const iron = g.createLinearGradient(48, 42, 176, 190);
  iron.addColorStop(0, "#fbfbfb");
  iron.addColorStop(0.24, "#c6c6c6");
  iron.addColorStop(0.56, "#4a4a4a");
  iron.addColorStop(0.82, "#131313");
  iron.addColorStop(1, "#3c3c3c");
  g.strokeStyle = iron;
  g.lineWidth = 30;
  g.beginPath();
  g.ellipse(104, 112, 54, 74, 0.52, 0, Math.PI * 2);
  g.stroke();

  // 環の内側を白で締める｡穴がはっきり空く
  g.strokeStyle = "rgba(252,252,252,0.95)";
  g.lineWidth = 5;
  g.beginPath();
  g.ellipse(104, 112, 39, 59, 0.52, 0, Math.PI * 2);
  g.stroke();

  // 鍛接の継ぎ目｡環の上に白を一本｡下に出すと尻尾に見える
  g.strokeStyle = "rgba(252,252,252,0.82)";
  g.lineWidth = 6;
  g.beginPath();
  g.moveTo(74, 56);
  g.lineTo(90, 46);
  g.stroke();

  // 土｡端から端まで走らせ､右を高くして釣り合いを崩す
  const clod = new Path2D();
  clod.moveTo(2, 256);
  clod.quadraticCurveTo(28, 232, 60, 222);
  clod.quadraticCurveTo(92, 210, 120, 182);
  clod.quadraticCurveTo(148, 212, 182, 226);
  clod.quadraticCurveTo(216, 240, 242, 204);
  clod.quadraticCurveTo(270, 170, 298, 212);
  clod.lineTo(298, 296);
  clod.lineTo(2, 296);
  clod.closePath();
  const soil = g.createLinearGradient(0, 172, 0, 296);
  soil.addColorStop(0, "#c6c6c6");
  soil.addColorStop(0.26, "#7a7a7a");
  soil.addColorStop(0.62, "#343434");
  soil.addColorStop(1, "#0e0e0e");
  g.fillStyle = soil;
  g.fill(clod);

  // 土と鉄のあいだ｡白い一本で切り離す
  g.strokeStyle = "#fcfcfc";
  g.lineWidth = 7;
  g.beginPath();
  g.moveTo(2, 256);
  g.quadraticCurveTo(28, 232, 60, 222);
  g.quadraticCurveTo(92, 210, 120, 182);
  g.quadraticCurveTo(148, 212, 182, 226);
  g.quadraticCurveTo(216, 240, 242, 204);
  g.quadraticCurveTo(270, 170, 298, 212);
  g.stroke();

  // 土の割れ｡太い白を入れて塊を面に割る
  g.save();
  g.clip(clod);
  g.strokeStyle = "rgba(250,250,250,0.44)";
  g.lineWidth = 9;
  g.lineCap = "round";
  for (const [x0, y0, x1, y1] of [
    [36, 240, 66, 292],
    [104, 204, 122, 290],
    [186, 236, 200, 292],
    [250, 200, 282, 282],
  ] as const) {
    g.beginPath();
    g.moveTo(x0, y0);
    g.lineTo(x1, y1);
    g.stroke();
  }
  g.restore();
  g.restore();
};

/** 異端は火で正す｡井桁に組んだ火刑の薪｡下ほど焼け落ちている */
const pyre: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);
  g.translate(150, 150);
  g.rotate(-0.05);
  g.translate(-150, -150);

  /** 横に寝かせた丸太｡上を明るく下を沈め､左端に木口を出す */
  const log = (x0: number, x1: number, y: number, h: number, burnt: boolean) => {
    const bark = g.createLinearGradient(0, y, 0, y + h);
    if (burnt) {
      bark.addColorStop(0, "#606060");
      bark.addColorStop(0.32, "#171717");
      bark.addColorStop(1, "#050505");
    } else {
      bark.addColorStop(0, "#f0f0f0");
      bark.addColorStop(0.26, "#a8a8a8");
      bark.addColorStop(0.64, "#2e2e2e");
      bark.addColorStop(1, "#0a0a0a");
    }
    g.fillStyle = bark;
    rrect(g, x0, y, x1 - x0, h, h / 2);
    g.fill();
    g.strokeStyle = "#fcfcfc";
    g.lineWidth = 6;
    g.stroke();

    // 木口｡左の端に楕円をひとつ置くと丸太に見える
    const cap = g.createLinearGradient(x0 - h / 2, 0, x0 + h / 2, 0);
    cap.addColorStop(0, burnt ? "#303030" : "#fafafa");
    cap.addColorStop(1, burnt ? "#070707" : "#8a8a8a");
    g.fillStyle = cap;
    g.beginPath();
    g.ellipse(x0 + 3, y + h / 2, h / 2.8, h / 2 - 3, 0, 0, Math.PI * 2);
    g.fill();
  };

  // 上の段｡長さを違えて二本
  log(52, 264, 52, 36, false);
  log(28, 244, 98, 38, false);

  // 中の段｡こちらを向いた木口を三つ｡年輪と割れを片側に寄せる
  for (const [cx, cy, r] of [
    [78, 184, 38],
    [150, 179, 42],
    [222, 187, 35],
  ] as const) {
    g.strokeStyle = "#fcfcfc";
    g.lineWidth = 11;
    g.beginPath();
    g.arc(cx, cy, r, 0, Math.PI * 2);
    g.stroke();
    const cut = g.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    cut.addColorStop(0, "#fbfbfb");
    cut.addColorStop(0.46, "#d2d2d2");
    cut.addColorStop(1, "#8a8a8a");
    g.fillStyle = cut;
    g.beginPath();
    g.arc(cx, cy, r, 0, Math.PI * 2);
    g.fill();

    // 樹皮｡縁を黒く巻いて平らな割れ面から切る
    const skin = g.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    skin.addColorStop(0, "#5e5e5e");
    skin.addColorStop(0.5, "#141414");
    skin.addColorStop(1, "#050505");
    g.strokeStyle = skin;
    g.lineWidth = 9;
    g.beginPath();
    g.arc(cx, cy, r - 4.5, 0, Math.PI * 2);
    g.stroke();

    // 割れ｡芯から外へ二本だけ｡樹皮までは届かせない
    const hx = cx - r * 0.18;
    const hy = cy - r * 0.14;
    g.strokeStyle = "rgba(14,14,14,0.58)";
    g.lineWidth = 7;
    g.lineCap = "round";
    for (const [dx, dy] of [
      [0.72, 0.24],
      [-0.3, 0.68],
    ] as const) {
      g.beginPath();
      g.moveTo(hx, hy);
      g.lineTo(hx + r * dx, hy + r * dy);
      g.stroke();
    }
  }

  // 下の段｡焼け落ちて炭になった一本
  log(22, 262, 226, 34, true);

  // 灰｡いちばん下に白っぽい帯を敷いて炭を紙から切り離す
  const ash = g.createLinearGradient(0, 274, 0, 292);
  ash.addColorStop(0, "#9c9c9c");
  ash.addColorStop(0.6, "#c8c8c8");
  ash.addColorStop(1, "#efefef");
  g.fillStyle = ash;
  g.beginPath();
  g.moveTo(34, 290);
  g.quadraticCurveTo(70, 272, 150, 274);
  g.quadraticCurveTo(232, 276, 266, 290);
  g.closePath();
  g.fill();
  g.restore();
};

/** 読んでよい本は教会が決める｡開いた頁｡行が墨で塗り潰されている */
const censoredBook: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  /** 頁の経路｡左右で同じ形を折り返す */
  const page = (dir: number) => {
    const x = (v: number) => 150 + dir * (v - 150);
    const q = new Path2D();
    q.moveTo(x(150), 110);
    q.bezierCurveTo(x(118), 90, x(72), 80, x(30), 90);
    q.lineTo(x(20), 192);
    q.bezierCurveTo(x(70), 200, x(116), 212, x(150), 232);
    q.closePath();
    return q;
  };
  /** 小口｡頁の束の厚み */
  const block = (dir: number) => {
    const x = (v: number) => 150 + dir * (v - 150);
    const q = new Path2D();
    q.moveTo(x(20), 192);
    q.bezierCurveTo(x(70), 200, x(116), 212, x(150), 232);
    q.lineTo(x(150), 256);
    q.bezierCurveTo(x(114), 234, x(68), 222, x(24), 214);
    q.closePath();
    return q;
  };

  // 小口｡開いた本の厚みを黒く敷いて､頁を紙から持ち上げる
  for (const dir of [-1, 1] as const) {
    const edge = g.createLinearGradient(0, 192, 0, 256);
    edge.addColorStop(0, "#a6a6a6");
    edge.addColorStop(0.34, "#2e2e2e");
    edge.addColorStop(0.78, "#0a0a0a");
    edge.addColorStop(1, "#4a4a4a");
    g.fillStyle = edge;
    g.fill(block(dir));
  }

  // 綴じた葉の縁｡太い白を二本だけ渡して黒い厚みを割る
  g.strokeStyle = "rgba(252,252,252,0.5)";
  g.lineWidth = 5;
  for (const o of [10, 20] as const) {
    g.beginPath();
    g.moveTo(24, 200 + o);
    g.bezierCurveTo(70, 208 + o, 116, 220 + o, 150, 240 + o);
    g.bezierCurveTo(184, 220 + o, 230, 208 + o, 276, 200 + o);
    g.stroke();
  }

  // 頁｡左右の大きな明るい面｡喉へ向かって沈む
  for (const dir of [-1, 1] as const) {
    const sheet = g.createLinearGradient(150 - dir * 130, 0, 150, 0);
    sheet.addColorStop(0, "#fdfdfd");
    sheet.addColorStop(0.5, "#f0f0f0");
    sheet.addColorStop(0.86, "#c8c8c8");
    sheet.addColorStop(1, "#8e8e8e");
    g.fillStyle = sheet;
    g.fill(page(dir));
    g.strokeStyle = "rgba(14,14,14,0.55)";
    g.lineWidth = 4;
    g.stroke(page(dir));
  }

  // 喉｡真ん中の谷を黒く落として二枚に割る
  const gut = g.createLinearGradient(138, 0, 162, 0);
  gut.addColorStop(0, "#9c9c9c");
  gut.addColorStop(0.5, "#0d0d0d");
  gut.addColorStop(1, "#9c9c9c");
  g.fillStyle = gut;
  g.beginPath();
  g.moveTo(140, 106);
  g.lineTo(160, 106);
  g.lineTo(158, 236);
  g.lineTo(142, 236);
  g.closePath();
  g.fill();

  /** 行｡頁の傾きに沿わせて引く｡墨は太く黒く､残った字は細く薄く */
  const line = (
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    w: number,
    ink: boolean,
  ) => {
    g.strokeStyle = ink ? "#0a0a0a" : "rgba(74,74,74,0.58)";
    g.lineWidth = w;
    g.lineCap = ink ? "round" : "butt";
    g.beginPath();
    g.moveTo(x0, y0);
    g.quadraticCurveTo((x0 + x1) / 2, (y0 + y1) / 2 - 3, x1, y1);
    g.stroke();
  };

  // 左の頁｡読める行のあいだを､墨の太い二本が潰している
  g.save();
  g.clip(page(1));
  line(40, 108, 88, 117, 9, false);
  line(98, 119, 134, 125, 9, false);
  line(36, 134, 138, 151, 25, true);
  line(38, 160, 78, 167, 9, false);
  line(88, 169, 128, 176, 9, false);
  line(34, 186, 136, 203, 25, true);
  g.restore();

  // 右の頁｡潰されたのは一行｡残りは読める
  g.save();
  g.clip(page(-1));
  line(166, 125, 214, 117, 9, false);
  line(224, 115, 258, 109, 9, false);
  line(164, 151, 266, 134, 27, true);
  line(168, 177, 216, 169, 9, false);
  line(226, 167, 258, 162, 9, false);
  line(170, 203, 214, 196, 9, false);
  g.restore();

  // 墨のはみ出し｡引いた線が小口まで走って止まらない
  g.strokeStyle = "rgba(10,10,10,0.92)";
  g.lineWidth = 12;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(40, 136);
  g.lineTo(24, 133);
  g.stroke();
  g.beginPath();
  g.moveTo(262, 135);
  g.lineTo(278, 131);
  g.stroke();
  g.restore();
};

/** 女人禁制｡霊山の女人結界石｡「女人」を刻んだ石柱 */
const kekkaiStone: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 笠｡柱の頭を四方に寄せる
  const cap = new Path2D();
  cap.moveTo(96, 62);
  cap.lineTo(150, 36);
  cap.lineTo(214, 60);
  cap.lineTo(214, 76);
  cap.lineTo(96, 78);
  cap.closePath();
  const capG = g.createLinearGradient(96, 36, 214, 78);
  capG.addColorStop(0, "#e6e6e6");
  capG.addColorStop(0.5, "#9a9a9a");
  capG.addColorStop(1, "#2e2e2e");
  g.fillStyle = capG;
  g.fill(cap);

  // 正面｡一番大きな明るい面｡ここに字を刻む
  const front = new Path2D();
  front.moveTo(100, 78);
  front.lineTo(184, 78);
  front.lineTo(188, 252);
  front.lineTo(98, 252);
  front.closePath();
  const stone = g.createLinearGradient(98, 0, 188, 0);
  stone.addColorStop(0, "#8e8e8e");
  stone.addColorStop(0.22, "#e2e2e2");
  stone.addColorStop(0.7, "#c0c0c0");
  stone.addColorStop(1, "#8a8a8a");
  g.fillStyle = stone;
  g.fill(front);

  // 右の側面｡厚みを黒く落として正面から切る
  const flank = new Path2D();
  flank.moveTo(184, 78);
  flank.lineTo(214, 76);
  flank.lineTo(218, 246);
  flank.lineTo(188, 252);
  flank.closePath();
  const dark = g.createLinearGradient(184, 0, 218, 0);
  dark.addColorStop(0, "#484848");
  dark.addColorStop(0.5, "#131313");
  dark.addColorStop(1, "#343434");
  g.fillStyle = dark;
  g.fill(flank);

  g.strokeStyle = "#fcfcfc";
  g.lineWidth = 6;
  g.beginPath();
  g.moveTo(184, 78);
  g.lineTo(188, 252);
  g.stroke();

  /** 陰刻｡影を先に置いて､その上に黒い画を落とす */
  const cut = (pts: [number, number][][]) => {
    for (const line of pts) {
      g.strokeStyle = "rgba(255,255,255,0.85)";
      g.lineWidth = 11;
      g.lineCap = "round";
      g.beginPath();
      g.moveTo(line[0][0] - 4, line[0][1] - 4);
      for (let i = 1; i < line.length; i++) g.lineTo(line[i][0] - 4, line[i][1] - 4);
      g.stroke();
      g.strokeStyle = "#0b0b0b";
      g.lineWidth = 10;
      g.beginPath();
      g.moveTo(line[0][0], line[0][1]);
      for (let i = 1; i < line.length; i++) g.lineTo(line[i][0], line[i][1]);
      g.stroke();
    }
  };

  // 「女」｡交わる二画と､中ほどを貫く横一本
  cut([
    [
      [166, 90],
      [126, 150],
    ],
    [
      [122, 98],
      [166, 146],
    ],
    [
      [102, 140],
      [182, 132],
    ],
  ]);

  // 「人」｡二画だけ
  cut([
    [
      [146, 168],
      [116, 224],
    ],
    [
      [142, 188],
      [172, 226],
    ],
  ]);

  // 根石｡柱を据える土台｡大きな塊を二つだけ
  const base = new Path2D();
  base.moveTo(62, 288);
  base.quadraticCurveTo(66, 250, 112, 246);
  base.lineTo(196, 244);
  base.quadraticCurveTo(244, 248, 250, 288);
  base.closePath();
  const bed = g.createLinearGradient(0, 244, 0, 288);
  bed.addColorStop(0, "#a6a6a6");
  bed.addColorStop(0.42, "#3a3a3a");
  bed.addColorStop(1, "#0c0c0c");
  g.fillStyle = bed;
  g.fill(base);
  g.strokeStyle = "#fcfcfc";
  g.lineWidth = 8;
  g.stroke(base);
  g.restore();
};

/** 両班｡黒笠｡科挙に及第した者だけが許された被り物 */
const gatHat: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 紐｡笠の下に垂れる一本
  g.strokeStyle = "rgba(16,16,16,0.82)";
  g.lineWidth = 7;
  g.lineCap = "round";
  g.lineWidth = 9;
  g.beginPath();
  g.moveTo(66, 218);
  g.quadraticCurveTo(150, 292, 234, 216);
  g.stroke();

  // 양태（つば）｡真円を伏せた大きな黒｡外の縁を持ち上げる
  const brim = g.createRadialGradient(104, 182, 14, 150, 204, 152);
  brim.addColorStop(0, "#c8c8c8");
  brim.addColorStop(0.32, "#6e6e6e");
  brim.addColorStop(0.72, "#1c1c1c");
  brim.addColorStop(1, "#060606");
  g.fillStyle = brim;
  g.beginPath();
  g.ellipse(150, 202, 144, 44, 0, 0, Math.PI * 2);
  g.fill();

  // つばの縁｡白い細線で紙から切り離し､反りを出す
  g.strokeStyle = "rgba(252,252,252,0.9)";
  g.lineWidth = 6;
  g.beginPath();
  g.ellipse(150, 202, 144, 44, 0, 0, Math.PI * 2);
  g.stroke();
  g.strokeStyle = "rgba(255,255,255,0.4)";
  g.lineWidth = 7;
  g.beginPath();
  g.ellipse(150, 200, 116, 33, 0, 0, Math.PI * 2);
  g.stroke();

  // 총모자（胴）｡真っすぐ立った筒
  const crown = new Path2D();
  crown.moveTo(94, 194);
  crown.lineTo(92, 120);
  crown.quadraticCurveTo(92, 106, 150, 104);
  crown.quadraticCurveTo(208, 106, 208, 120);
  crown.lineTo(206, 194);
  crown.closePath();
  const gauze = g.createLinearGradient(92, 0, 208, 0);
  gauze.addColorStop(0, "#0a0a0a");
  gauze.addColorStop(0.2, "#5c5c5c");
  gauze.addColorStop(0.42, "#a8a8a8");
  gauze.addColorStop(0.68, "#2a2a2a");
  gauze.addColorStop(1, "#080808");
  g.fillStyle = gauze;
  g.fill(crown);

  // 馬の尾の織り｡太い縦の筋を三本だけ｡目を細かく刻まない
  g.save();
  g.clip(crown);
  g.strokeStyle = "rgba(255,255,255,0.3)";
  g.lineWidth = 7;
  for (const x of [116, 150, 184] as const) {
    g.beginPath();
    g.moveTo(x, 108);
    g.lineTo(x, 194);
    g.stroke();
  }
  g.restore();

  // 天井｡平らな面を明るく残す
  const lidG = g.createLinearGradient(0, 88, 0, 122);
  lidG.addColorStop(0, "#f4f4f4");
  lidG.addColorStop(0.6, "#bcbcbc");
  lidG.addColorStop(1, "#6c6c6c");
  g.fillStyle = lidG;
  g.beginPath();
  g.ellipse(150, 106, 58, 19, 0, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "rgba(14,14,14,0.75)";
  g.lineWidth = 4;
  g.beginPath();
  g.ellipse(150, 106, 58, 19, 0, 0, Math.PI * 2);
  g.stroke();

  // 胴とつばのあいだ｡白い一本で二つの塊に割る
  g.strokeStyle = "#fcfcfc";
  g.lineWidth = 9;
  g.beginPath();
  g.moveTo(88, 192);
  g.quadraticCurveTo(150, 206, 212, 192);
  g.stroke();

  // 胴の裾を締める帯
  const ribbon = g.createLinearGradient(92, 0, 208, 0);
  ribbon.addColorStop(0, "#0b0b0b");
  ribbon.addColorStop(0.44, "#8e8e8e");
  ribbon.addColorStop(1, "#111111");
  g.fillStyle = ribbon;
  g.beginPath();
  g.moveTo(94, 172);
  g.quadraticCurveTo(150, 184, 206, 172);
  g.lineTo(206, 188);
  g.quadraticCurveTo(150, 200, 94, 188);
  g.closePath();
  g.fill();
  g.restore();
};

export const PLATES_E: Record<string, Draw> = {
  "049": suzuri,
  "050": gauntlet,
  "051": bowShoe,
  "052": malletHead,
  "053": shears,
  "054": tetherRing,
  "055": pyre,
  "056": censoredBook,
  "057": kekkaiStone,
  "058": gatHat,
};
