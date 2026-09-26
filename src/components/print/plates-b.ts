/**
 * 図版の版下（その二）｡
 *
 * plates.ts と同じ約束で描く｡網のことは考えず､灰色の絵として置く｡
 * 面は平らに塗らずグラデーションで濃淡をつける｡ベタにすると網にかけたとき絵が死ぬ｡
 * 座標は 300 四方｡枠いっぱいに大きく取って､端には大事なものを置かない｡
 */

import type { Draw } from "./draw";

/** 武士道｡真横から見た兜｡鉢の塊と鍬形と吹返し､三つだけで組む */
const kabuto: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 鍬形｡前へ反る一枚と上へ立つ一枚｡鉢より先に置く
  const horn = g.createLinearGradient(20, 20, 170, 180);
  horn.addColorStop(0, "#6e6e6e");
  horn.addColorStop(0.3, "#5a5a5a");
  horn.addColorStop(0.7, "#424242");
  horn.addColorStop(1, "#2a2a2a");
  g.fillStyle = horn;
  g.beginPath();
  g.moveTo(148, 160);
  g.quadraticCurveTo(96, 122, 30, 54);
  g.lineTo(36, 98);
  g.quadraticCurveTo(98, 140, 154, 178);
  g.closePath();
  g.fill();
  g.beginPath();
  g.moveTo(156, 158);
  g.quadraticCurveTo(136, 96, 108, 24);
  g.lineTo(144, 34);
  g.quadraticCurveTo(160, 100, 176, 170);
  g.closePath();
  g.fill();

  // しころと吹返し｡鉢の下に広がる一枚の板｡前の端が跳ね上がる
  const skirt = g.createLinearGradient(40, 206, 276, 266);
  skirt.addColorStop(0, "#828282");
  skirt.addColorStop(0.28, "#6e6e6e");
  skirt.addColorStop(0.7, "#3e3e3e");
  skirt.addColorStop(1, "#262626");
  const board = new Path2D();
  board.moveTo(96, 210);
  board.lineTo(240, 210);
  board.lineTo(272, 252);
  board.quadraticCurveTo(150, 274, 62, 252);
  board.lineTo(30, 196);
  board.lineTo(82, 216);
  board.closePath();
  g.fillStyle = skirt;
  g.fill(board);

  // 板の段｡白く抜いて一枚のベタにしない
  g.strokeStyle = "rgba(252,252,252,0.85)";
  g.lineWidth = 5;
  g.beginPath();
  g.moveTo(74, 232);
  g.quadraticCurveTo(150, 250, 258, 234);
  g.stroke();

  // 鉢｡いちばん大きな塊｡まわりを白く抜いてから置く
  const dome = new Path2D();
  dome.moveTo(70, 212);
  dome.quadraticCurveTo(62, 116, 160, 90);
  dome.quadraticCurveTo(254, 110, 258, 212);
  dome.closePath();
  g.strokeStyle = "#ffffff";
  g.lineWidth = 13;
  g.stroke(dome);
  const bowl = g.createRadialGradient(112, 120, 10, 166, 200, 178);
  bowl.addColorStop(0, "#b6b6b6");
  bowl.addColorStop(0.08, "#8a8a8a");
  bowl.addColorStop(0.2, "#5e5e5e");
  bowl.addColorStop(0.5, "#484848");
  bowl.addColorStop(1, "#282828");
  g.fillStyle = bowl;
  g.fill(dome);

  // 鉢の筋｡白く抜いた太い稜
  g.save();
  g.clip(dome);
  g.strokeStyle = "rgba(252,252,252,0.8)";
  g.lineWidth = 6;
  for (const dx of [-62, 0, 62]) {
    g.beginPath();
    g.moveTo(164 + dx * 1.35, 214);
    g.quadraticCurveTo(164 + dx * 1.1, 130, 164 + dx * 0.2, 94);
    g.stroke();
  }
  g.restore();

  // 眉庇｡鉢の前にひと筋
  g.strokeStyle = "rgba(250,250,250,0.9)";
  g.lineWidth = 7;
  g.beginPath();
  g.moveTo(70, 200);
  g.quadraticCurveTo(160, 182, 256, 200);
  g.stroke();
  g.restore();
};

/** 勤勉こそ美徳｡三桁だけの算盤｡珠をひとつずつ大きく */
const abacus: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  const IX0 = 52;
  const IX1 = 248;
  const IY0 = 44;
  const IY1 = 248;
  const FT = 19;
  const beamY = 104;
  const rods = [92, 150, 208];

  // 框｡外を囲む太い板｡内側は紙のまま白く残す
  const frame = g.createLinearGradient(IX0 - FT, IY0 - FT, IX1 + FT, IY1 + FT);
  frame.addColorStop(0, "#626262");
  frame.addColorStop(0.3, "#5a5a5a");
  frame.addColorStop(0.72, "#3a3a3a");
  frame.addColorStop(1, "#242424");
  g.fillStyle = frame;
  g.beginPath();
  g.rect(IX0 - FT, IY0 - FT, IX1 - IX0 + FT * 2, IY1 - IY0 + FT * 2);
  g.rect(IX0, IY0, IX1 - IX0, IY1 - IY0);
  g.fill("evenodd");

  // 桁｡珠より薄く｡三本だけ
  g.strokeStyle = "#6e6e6e";
  g.lineWidth = 7;
  for (const x of rods) {
    g.beginPath();
    g.moveTo(x, IY0 + 4);
    g.lineTo(x, IY1 - 4);
    g.stroke();
  }

  // 梁｡上下を分ける一本
  const beam = g.createLinearGradient(IX0, beamY - 9, IX1, beamY + 9);
  beam.addColorStop(0, "#8a8a8a");
  beam.addColorStop(0.35, "#525252");
  beam.addColorStop(1, "#2a2a2a");
  g.fillStyle = beam;
  g.fillRect(IX0, beamY - 9, IX1 - IX0, 18);

  /** 珠｡大きな菱の塊｡稜を白く抜いて平らにしない */
  const bead = (x: number, y: number) => {
    const w = 25;
    const h = 14;
    const sh = g.createLinearGradient(x - w, y - h, x + w, y + h);
    sh.addColorStop(0, "#8a8a8a");
    sh.addColorStop(0.24, "#6c6c6c");
    sh.addColorStop(0.6, "#464646");
    sh.addColorStop(1, "#262626");
    g.fillStyle = sh;
    g.beginPath();
    g.moveTo(x, y - h);
    g.quadraticCurveTo(x + w, y - h * 0.28, x + w, y);
    g.quadraticCurveTo(x + w, y + h * 0.28, x, y + h);
    g.quadraticCurveTo(x - w, y + h * 0.28, x - w, y);
    g.quadraticCurveTo(x - w, y - h * 0.28, x, y - h);
    g.closePath();
    g.fill();
    g.strokeStyle = "rgba(252,252,252,0.9)";
    g.lineWidth = 4;
    g.beginPath();
    g.moveTo(x - w + 4, y);
    g.lineTo(x + w - 4, y);
    g.stroke();
  };

  // 五珠｡真ん中の桁だけ梁に寄せてある
  rods.forEach((x, i) => bead(x, i === 1 ? 78 : 60));

  // 一珠｡四つずつ｡左の桁だけ二つ上げてある
  rods.forEach((x, i) => {
    const up = i === 0 ? 2 : 0;
    for (let k = 0; k < 4; k++) {
      bead(x, k < up ? 129 + k * 32 : 195 + (k - 2) * 32);
    }
  });
  g.restore();
};

/** 家族団らん｡湯呑をのせた丸いちゃぶ台 */
const chabudai: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 脚｡三本｡手前を明るく残して奥を沈める
  for (const [x0, x1, sp, dark] of [
    [96, 84, -16, 1],
    [204, 216, 16, 1],
    [150, 150, 0, 0],
  ] as const) {
    const leg = g.createLinearGradient(x0 - 14, 0, x0 + 14, 0);
    leg.addColorStop(0, dark ? "#6e6e6e" : "#9a9a9a");
    leg.addColorStop(0.45, "#131313");
    leg.addColorStop(1, "#4a4a4a");
    g.fillStyle = leg;
    g.beginPath();
    g.moveTo(x0 - 15, 186);
    g.lineTo(x0 + 15, 186);
    g.lineTo(x1 + 11 + sp * 0.2, 268);
    g.lineTo(x1 - 11 + sp * 0.2, 268);
    g.closePath();
    g.fill();
  }

  // 天板の小口｡厚みの分だけ下に出す
  const edge = g.createLinearGradient(22, 0, 278, 0);
  edge.addColorStop(0, "#585858");
  edge.addColorStop(0.35, "#161616");
  edge.addColorStop(0.8, "#3c3c3c");
  edge.addColorStop(1, "#0a0a0a");
  g.fillStyle = edge;
  g.beginPath();
  g.ellipse(150, 176, 132, 50, 0, 0, Math.PI * 2);
  g.fill();

  // 天板｡拭いた漆の照り｡左上に窓明かりを置く
  const top = g.createRadialGradient(96, 128, 14, 150, 164, 152);
  top.addColorStop(0, "#fafafa");
  top.addColorStop(0.22, "#cdcdcd");
  top.addColorStop(0.58, "#5e5e5e");
  top.addColorStop(1, "#191919");
  g.fillStyle = top;
  g.beginPath();
  g.ellipse(150, 162, 132, 50, 0, 0, Math.PI * 2);
  g.fill();

  // 縁の照り返し
  g.strokeStyle = "rgba(252,252,252,0.5)";
  g.lineWidth = 3.4;
  g.beginPath();
  g.ellipse(150, 162, 126, 45, 0, Math.PI * 0.82, Math.PI * 1.92);
  g.stroke();

  /** 湯呑｡口を明るく開けて胴を落とす */
  const cup = (cx: number, cy: number, r: number) => {
    const h = r * 1.5;
    const body = g.createLinearGradient(cx - r, 0, cx + r, 0);
    body.addColorStop(0, "#efefef");
    body.addColorStop(0.32, "#9e9e9e");
    body.addColorStop(0.7, "#2a2a2a");
    body.addColorStop(1, "#0d0d0d");
    g.fillStyle = body;
    g.beginPath();
    g.moveTo(cx - r, cy);
    g.quadraticCurveTo(cx - r * 0.9, cy + h, cx - r * 0.66, cy + h);
    g.lineTo(cx + r * 0.66, cy + h);
    g.quadraticCurveTo(cx + r * 0.9, cy + h, cx + r, cy);
    g.closePath();
    g.fill();
    // 口｡中は暗い
    g.fillStyle = "#e6e6e6";
    g.beginPath();
    g.ellipse(cx, cy, r, r * 0.34, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#1c1c1c";
    g.beginPath();
    g.ellipse(cx, cy + 1.5, r * 0.78, r * 0.24, 0, 0, Math.PI * 2);
    g.fill();
  };

  cup(92, 148, 24);
  cup(150, 126, 22);
  cup(212, 152, 24);

  // 湯気｡真ん中の湯呑から一筋
  g.strokeStyle = "rgba(24,24,24,0.5)";
  g.lineWidth = 4.6;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(150, 112);
  g.quadraticCurveTo(166, 90, 150, 68);
  g.quadraticCurveTo(136, 50, 154, 32);
  g.stroke();
  g.restore();
};

/** 終身雇用｡立てた印章｡胴と印面 */
const hanko: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  const cx = 110;
  const w = 44;

  // 押した跡｡紙に残る輪と字画
  const mark = g.createRadialGradient(210, 190, 8, 226, 212, 58);
  mark.addColorStop(0, "#7a7a7a");
  mark.addColorStop(0.5, "#242424");
  mark.addColorStop(1, "#050505");
  g.strokeStyle = mark;
  g.lineWidth = 12;
  g.beginPath();
  g.arc(226, 212, 42, 0, Math.PI * 2);
  g.stroke();
  g.fillStyle = mark;
  for (const dx of [-26, 0, 26]) {
    g.fillRect(226 + dx - 3.5, 190, 7, 46);
  }
  for (const y of [196, 220]) {
    g.fillRect(196, y, 60, 7);
  }

  // 胴｡丸い柱｡左に光の筋を通す
  const body = g.createLinearGradient(cx - w, 0, cx + w, 0);
  body.addColorStop(0, "#3a3a3a");
  body.addColorStop(0.16, "#f2f2f2");
  body.addColorStop(0.42, "#8a8a8a");
  body.addColorStop(0.78, "#1d1d1d");
  body.addColorStop(1, "#0a0a0a");
  g.fillStyle = body;
  g.fillRect(cx - w, 40, w * 2, 176);

  // 天｡柱の上の丸み
  g.fillStyle = body;
  g.beginPath();
  g.ellipse(cx, 40, w, 15, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "rgba(252,252,252,0.42)";
  g.beginPath();
  g.ellipse(cx - 10, 36, w * 0.5, 7, 0, 0, Math.PI * 2);
  g.fill();

  // 当たり｡向きを示す彫り込み
  g.fillStyle = "rgba(10,10,10,0.72)";
  g.beginPath();
  g.ellipse(cx - 26, 92, 7, 14, 0, 0, Math.PI * 2);
  g.fill();

  // 印面の台｡胴より太い鍔
  const flange = g.createLinearGradient(0, 212, 0, 246);
  flange.addColorStop(0, "#cacaca");
  flange.addColorStop(0.45, "#2c2c2c");
  flange.addColorStop(1, "#0d0d0d");
  g.fillStyle = flange;
  g.beginPath();
  g.moveTo(cx - w, 214);
  g.lineTo(cx + w, 214);
  g.quadraticCurveTo(cx + 64, 224, cx + 62, 240);
  g.lineTo(cx - 62, 240);
  g.quadraticCurveTo(cx - 64, 224, cx - w, 214);
  g.closePath();
  g.fill();

  // 印面｡伏せた面を浅い楕円で見せる
  const face = g.createRadialGradient(cx - 20, 244, 5, cx, 250, 68);
  face.addColorStop(0, "#a2a2a2");
  face.addColorStop(0.55, "#333333");
  face.addColorStop(1, "#080808");
  g.fillStyle = face;
  g.beginPath();
  g.ellipse(cx, 246, 62, 17, 0, 0, Math.PI * 2);
  g.fill();

  // 彫り残し｡面に白く浮く字画
  g.strokeStyle = "rgba(250,250,250,0.6)";
  g.lineWidth = 3;
  g.beginPath();
  g.ellipse(cx, 246, 48, 11, 0, 0, Math.PI * 2);
  g.stroke();
  g.lineWidth = 3.4;
  for (const dx of [-18, 18]) {
    g.beginPath();
    g.moveTo(cx + dx, 239);
    g.lineTo(cx + dx, 253);
    g.stroke();
  }
  g.beginPath();
  g.moveTo(cx - 34, 246);
  g.lineTo(cx + 34, 246);
  g.stroke();
  g.restore();
};

/** 年功序列｡階段に積み上げた枡 */
const masu: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  const w = 70;
  const h = 54;
  const dx = -28;
  const dy = -22;
  const base = 266;

  /** 枡ひとつ｡正面･上･横の三面を濃さで分ける */
  const box = (x: number, y: number, open: boolean) => {
    // 横（左の奥）
    const side = g.createLinearGradient(x + dx, y + dy, x, y + h);
    side.addColorStop(0, "#5c5c5c");
    side.addColorStop(0.6, "#1a1a1a");
    side.addColorStop(1, "#070707");
    g.fillStyle = side;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + dx, y + dy);
    g.lineTo(x + dx, y + dy + h);
    g.lineTo(x, y + h);
    g.closePath();
    g.fill();

    // 正面
    const front = g.createLinearGradient(x, y, x + w, y + h);
    front.addColorStop(0, "#dcdcdc");
    front.addColorStop(0.38, "#8e8e8e");
    front.addColorStop(0.78, "#333333");
    front.addColorStop(1, "#121212");
    g.fillStyle = front;
    g.fillRect(x, y, w, h);

    // 上｡天は明るい
    const top = g.createLinearGradient(x + dx, y + dy, x + w, y);
    top.addColorStop(0, "#fbfbfb");
    top.addColorStop(0.5, "#cfcfcf");
    top.addColorStop(1, "#6e6e6e");
    g.fillStyle = top;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + w, y);
    g.lineTo(x + w + dx, y + dy);
    g.lineTo(x + dx, y + dy);
    g.closePath();
    g.fill();

    // 一番上の枡だけ中を見せる｡枡は蓋のない箱
    if (open) {
      const hole = g.createLinearGradient(x + 12, y - 4, x + w - 12, y + dy + 6);
      hole.addColorStop(0, "#2a2a2a");
      hole.addColorStop(0.7, "#101010");
      hole.addColorStop(1, "#040404");
      g.fillStyle = hole;
      g.beginPath();
      g.moveTo(x + 11, y - 3);
      g.lineTo(x + w - 11, y - 3);
      g.lineTo(x + w - 11 + dx * 0.72, y + dy * 0.72 - 3);
      g.lineTo(x + 11 + dx * 0.72, y + dy * 0.72 - 3);
      g.closePath();
      g.fill();
    }

    // 稜｡輪郭を締める
    g.strokeStyle = "rgba(6,6,6,0.9)";
    g.lineWidth = 2.6;
    g.beginPath();
    g.moveTo(x, y + h);
    g.lineTo(x, y);
    g.lineTo(x + dx, y + dy);
    g.moveTo(x, y);
    g.lineTo(x + w, y);
    g.stroke();
  };

  // 左から一段ずつ高くなる｡手前（右）を後から刷る
  const steps = [1, 2, 3];
  steps.forEach((n, i) => {
    const x = 46 + i * 76;
    for (let k = 0; k < n; k++) {
      box(x, base - h - k * h, k === n - 1);
    }
  });
  g.restore();
};

/** 夫は外で働き､妻は家庭を守る｡吊るされた割烹着 */
const kappogi: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 肩紐｡竿に掛けて真下へ落ちる｡二本のあいだを大きく開けておく
  const strap = g.createLinearGradient(90, 30, 210, 132);
  strap.addColorStop(0, "#e6e6e6");
  strap.addColorStop(0.45, "#767676");
  strap.addColorStop(1, "#111111");
  g.fillStyle = strap;
  for (const dir of [-1, 1]) {
    g.beginPath();
    g.moveTo(150 + dir * 38, 26);
    g.quadraticCurveTo(150 + dir * 46, 80, 150 + dir * 52, 130);
    g.lineTo(150 + dir * 68, 130);
    g.quadraticCurveTo(150 + dir * 60, 80, 150 + dir * 54, 26);
    g.closePath();
    g.fill();
  }

  // 物干しの竿｡紐はこの後ろを通っている
  const pole = g.createLinearGradient(0, 34, 0, 52);
  pole.addColorStop(0, "#8a8a8a");
  pole.addColorStop(0.45, "#111111");
  pole.addColorStop(1, "#4e4e4e");
  g.fillStyle = pole;
  g.beginPath();
  g.moveTo(22, 34);
  g.lineTo(278, 34);
  g.quadraticCurveTo(286, 43, 278, 52);
  g.lineTo(22, 52);
  g.quadraticCurveTo(14, 43, 22, 34);
  g.closePath();
  g.fill();

  // 前身頃｡肩幅から裾へ真っ直ぐ落ちる一枚｡丸く膨らませない
  const cloth = g.createLinearGradient(46, 0, 254, 0);
  cloth.addColorStop(0, "#f2f2f2");
  cloth.addColorStop(0.24, "#cdcdcd");
  cloth.addColorStop(0.52, "#909090");
  cloth.addColorStop(0.82, "#323232");
  cloth.addColorStop(1, "#0f0f0f");
  const front = new Path2D();
  front.moveTo(58, 126);
  front.lineTo(242, 126);
  front.quadraticCurveTo(248, 200, 252, 272);
  front.quadraticCurveTo(150, 262, 48, 272);
  front.quadraticCurveTo(52, 200, 58, 126);
  front.closePath();
  g.fillStyle = cloth;
  g.fill(front);

  // 裾へ向かう沈み｡布の重さ
  g.save();
  g.clip(front);
  const drop = g.createLinearGradient(0, 196, 0, 276);
  drop.addColorStop(0, "rgba(10,10,10,0)");
  drop.addColorStop(1, "rgba(10,10,10,0.5)");
  g.fillStyle = drop;
  g.fillRect(40, 190, 220, 90);

  // 皺｡縦に走る折り目
  g.strokeStyle = "rgba(252,252,252,0.4)";
  g.lineWidth = 3;
  for (const x of [84, 116, 184, 216]) {
    g.beginPath();
    g.moveTo(x, 138);
    g.quadraticCurveTo(x + (x < 150 ? -6 : 6), 200, x + (x < 150 ? -12 : 12), 268);
    g.stroke();
  }

  // 腰紐｡両脇から真下へ垂れる
  g.strokeStyle = "rgba(12,12,12,0.8)";
  g.lineWidth = 7;
  g.lineCap = "round";
  for (const dir of [-1, 1]) {
    g.beginPath();
    g.moveTo(150 + dir * 96, 178);
    g.quadraticCurveTo(150 + dir * 104, 216, 150 + dir * 94, 258);
    g.stroke();
  }
  g.restore();

  // 胸当ての上端｡縫い返しの線
  g.strokeStyle = "rgba(250,250,250,0.55)";
  g.lineWidth = 3.4;
  g.beginPath();
  g.moveTo(62, 136);
  g.lineTo(238, 136);
  g.stroke();

  // 肩口のぐし縫い｡上端に細かく刻みを入れて布と分かるようにする
  g.strokeStyle = "rgba(14,14,14,0.55)";
  g.lineWidth = 2.6;
  for (let i = 0; i < 16; i++) {
    const x = 66 + i * 11.4;
    g.beginPath();
    g.moveTo(x, 127);
    g.lineTo(x, 137);
    g.stroke();
  }

  // 前隠し｡大きな貼り付け
  const pocket = g.createLinearGradient(112, 198, 188, 252);
  pocket.addColorStop(0, "#e4e4e4");
  pocket.addColorStop(0.5, "#8e8e8e");
  pocket.addColorStop(1, "#1e1e1e");
  g.fillStyle = pocket;
  g.beginPath();
  g.moveTo(112, 198);
  g.lineTo(188, 198);
  g.lineTo(184, 250);
  g.lineTo(116, 250);
  g.closePath();
  g.fill();
  g.strokeStyle = "rgba(252,252,252,0.62)";
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(112, 204);
  g.lineTo(188, 204);
  g.stroke();
  g.restore();
};

/** 見合い結婚｡向かい合う夫婦湯呑｡大小ふたつの塊だけ */
const pairCups: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  /** 湯呑｡胴の塊と､口の暗い落ち込み */
  const cup = (cx: number, top: number, r: number, tilt: number) => {
    const bottom = 248;
    const rb = r * 0.7;
    g.save();
    g.translate(cx, top);
    g.rotate(tilt);
    g.translate(-cx, -top);

    const body = g.createLinearGradient(cx - r, 0, cx + r, 0);
    body.addColorStop(0, "#a4a4a4");
    body.addColorStop(0.2, "#767676");
    body.addColorStop(0.55, "#4a4a4a");
    body.addColorStop(0.85, "#2c2c2c");
    body.addColorStop(1, "#3c3c3c");
    g.fillStyle = body;
    g.beginPath();
    g.moveTo(cx - r, top);
    g.quadraticCurveTo(cx - r * 0.94, bottom - 26, cx - rb, bottom);
    g.lineTo(cx + rb, bottom);
    g.quadraticCurveTo(cx + r * 0.94, bottom - 26, cx + r, top);
    g.closePath();
    g.fill();

    // 胴の白い帯｡塊の真ん中を抜いて平らにしない
    g.strokeStyle = "rgba(252,252,252,0.85)";
    g.lineWidth = 8;
    g.beginPath();
    g.moveTo(cx - r * 0.92, top + 52);
    g.quadraticCurveTo(cx, top + 64, cx + r * 0.92, top + 52);
    g.stroke();

    // 口｡縁を白く残して中を暗く落とす
    g.fillStyle = "#f4f4f4";
    g.beginPath();
    g.ellipse(cx, top, r, r * 0.3, 0, 0, Math.PI * 2);
    g.fill();
    const hole = g.createLinearGradient(cx - r, top, cx + r, top);
    hole.addColorStop(0, "#5a5a5a");
    hole.addColorStop(0.6, "#2a2a2a");
    hole.addColorStop(1, "#464646");
    g.fillStyle = hole;
    g.beginPath();
    g.ellipse(cx, top + 2, r * 0.78, r * 0.2, 0, 0, Math.PI * 2);
    g.fill();
    g.restore();
  };

  // 大きいほうと小さいほう｡あいだは白く空ける
  cup(94, 92, 54, 0.05);
  cup(212, 118, 46, -0.05);

  // 盆の縁｡二つを載せる一本
  const tray = g.createLinearGradient(24, 0, 276, 0);
  tray.addColorStop(0, "#8c8c8c");
  tray.addColorStop(0.4, "#555555");
  tray.addColorStop(1, "#2e2e2e");
  g.fillStyle = tray;
  g.beginPath();
  g.moveTo(28, 250);
  g.lineTo(272, 250);
  g.quadraticCurveTo(268, 272, 240, 272);
  g.lineTo(60, 272);
  g.quadraticCurveTo(32, 272, 28, 250);
  g.closePath();
  g.fill();
  g.restore();
};

/** 恋愛結婚こそ本物｡台に石をひとつ抱いた指輪 */
const ring: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  const cx = 150;
  const cy = 194;
  const R = 74;
  const t = 21;

  // 環｡向こう側は細く暗く､手前は太く光る
  const band = g.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
  band.addColorStop(0, "#fafafa");
  band.addColorStop(0.24, "#a4a4a4");
  band.addColorStop(0.5, "#2c2c2c");
  band.addColorStop(0.74, "#7c7c7c");
  band.addColorStop(1, "#0c0c0c");
  g.strokeStyle = band;
  g.lineWidth = t;
  g.beginPath();
  g.arc(cx, cy, R, 0, Math.PI * 2);
  g.stroke();

  // 内側の影と外側の照り｡輪の厚みを出す
  g.strokeStyle = "rgba(8,8,8,0.55)";
  g.lineWidth = 5;
  g.beginPath();
  g.arc(cx, cy, R - t / 2 + 2, Math.PI * 0.08, Math.PI * 0.92);
  g.stroke();
  g.strokeStyle = "rgba(252,252,252,0.6)";
  g.lineWidth = 4;
  g.beginPath();
  g.arc(cx, cy, R - 2, Math.PI * 1.08, Math.PI * 1.5);
  g.stroke();

  const top = 44;
  const girdle = 96;
  const tip = 128;
  const hw = 56;
  const tw = 26;

  // 台｡石を受ける腰｡尖底の陰から両脇だけ覗く
  const seat = g.createLinearGradient(cx - 34, girdle, cx + 34, 142);
  seat.addColorStop(0, "#c8c8c8");
  seat.addColorStop(0.5, "#4e4e4e");
  seat.addColorStop(1, "#0c0c0c");
  g.fillStyle = seat;
  g.beginPath();
  g.moveTo(cx - 38, girdle + 2);
  g.lineTo(cx + 38, girdle + 2);
  g.lineTo(cx + 16, 142);
  g.lineTo(cx - 16, 142);
  g.closePath();
  g.fill();

  // 尖底｡下へ絞る三角
  const pav = g.createLinearGradient(cx - hw, girdle, cx + hw * 0.4, tip);
  pav.addColorStop(0, "#e8e8e8");
  pav.addColorStop(0.35, "#8a8a8a");
  pav.addColorStop(0.7, "#262626");
  pav.addColorStop(1, "#070707");
  g.fillStyle = pav;
  g.beginPath();
  g.moveTo(cx - hw, girdle);
  g.lineTo(cx + hw, girdle);
  g.lineTo(cx, tip);
  g.closePath();
  g.fill();

  // 冠｡上の斜面
  const crown = g.createLinearGradient(cx - hw, top, cx + hw, girdle);
  crown.addColorStop(0, "#ffffff");
  crown.addColorStop(0.4, "#c0c0c0");
  crown.addColorStop(0.75, "#4e4e4e");
  crown.addColorStop(1, "#151515");
  g.fillStyle = crown;
  g.beginPath();
  g.moveTo(cx - tw, top);
  g.lineTo(cx + tw, top);
  g.lineTo(cx + hw, girdle);
  g.lineTo(cx - hw, girdle);
  g.closePath();
  g.fill();

  // 冠の切子｡明暗を交互に置く
  const facets: Array<[number, number, string]> = [
    [-tw, -hw, "rgba(252,252,252,0.58)"],
    [-tw * 0.34, -hw * 0.34, "rgba(12,12,12,0.42)"],
    [tw * 0.34, hw * 0.34, "rgba(252,252,252,0.34)"],
    [tw, hw, "rgba(12,12,12,0.5)"],
  ];
  for (const [a, b, col] of facets) {
    g.strokeStyle = col;
    g.lineWidth = 4;
    g.beginPath();
    g.moveTo(cx + a, top);
    g.lineTo(cx + b, girdle);
    g.stroke();
  }

  // 卓面とガードル｡石の上下を締める
  g.strokeStyle = "rgba(252,252,252,0.72)";
  g.lineWidth = 4.6;
  g.beginPath();
  g.moveTo(cx - tw, top);
  g.lineTo(cx + tw, top);
  g.stroke();
  g.strokeStyle = "rgba(250,250,250,0.55)";
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(cx - hw, girdle);
  g.lineTo(cx + hw, girdle);
  g.stroke();

  // 爪｡腰から冠へ掛かる四本
  g.strokeStyle = "#131313";
  g.lineWidth = 7;
  g.lineCap = "round";
  g.lineWidth = 6;
  for (const dir of [-1, 1]) {
    g.beginPath();
    g.moveTo(cx + dir * (hw - 2), girdle + 8);
    g.quadraticCurveTo(cx + dir * (hw + 2), girdle - 8, cx + dir * (hw - 12), girdle - 20);
    g.stroke();
  }
  g.restore();
};

/** 寿退社｡紙に包んだ花束｡花は三輪だけ､ひとつずつ大きく */
const bouquet: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  const heads: Array<[number, number, number]> = [
    [70, 122, 42],
    [150, 70, 48],
    [230, 122, 42],
  ];

  // 茎｡太い三本だけ
  const stem = g.createLinearGradient(70, 70, 230, 200);
  stem.addColorStop(0, "#5a5a5a");
  stem.addColorStop(0.6, "#3a3a3a");
  stem.addColorStop(1, "#262626");
  g.strokeStyle = stem;
  g.lineWidth = 15;
  g.lineCap = "round";
  for (const [hx, hy] of heads) {
    g.beginPath();
    g.moveTo(150, 196);
    g.quadraticCurveTo((150 + hx) / 2, (196 + hy) / 2, hx, hy);
    g.stroke();
  }

  // 花｡六弁の濃い塊に､白い芯をひとつ抜く
  for (const [cx, cy, r] of heads) {
    const pet = g.createRadialGradient(cx - r * 0.4, cy - r * 0.4, r * 0.1, cx, cy, r * 1.25);
    pet.addColorStop(0, "#8a8a8a");
    pet.addColorStop(0.45, "#4c4c4c");
    pet.addColorStop(1, "#262626");
    g.fillStyle = pet;
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * 2 * i) / 6 - Math.PI / 2;
      g.beginPath();
      g.ellipse(cx + Math.cos(a) * r * 0.58, cy + Math.sin(a) * r * 0.58, r * 0.52, r * 0.4, a, 0, Math.PI * 2);
      g.fill();
    }
    g.fillStyle = "#fafafa";
    g.beginPath();
    g.arc(cx, cy, r * 0.36, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#3c3c3c";
    g.beginPath();
    g.arc(cx, cy, r * 0.15, 0, Math.PI * 2);
    g.fill();
  }

  // 包み紙｡下へ絞る大きな三角ひとつ
  const paper = g.createLinearGradient(44, 166, 256, 280);
  paper.addColorStop(0, "#9a9a9a");
  paper.addColorStop(0.28, "#707070");
  paper.addColorStop(0.68, "#454545");
  paper.addColorStop(1, "#282828");
  const cone = new Path2D();
  cone.moveTo(42, 162);
  cone.quadraticCurveTo(150, 196, 258, 162);
  cone.lineTo(164, 284);
  cone.lineTo(136, 284);
  cone.closePath();
  g.strokeStyle = "#ffffff";
  g.lineWidth = 12;
  g.stroke(cone);
  g.fillStyle = paper;
  g.fill(cone);

  // 紙の折り｡白く抜いた太い筋
  g.save();
  g.clip(cone);
  g.strokeStyle = "rgba(252,252,252,0.85)";
  g.lineWidth = 7;
  for (const ex of [82, 150, 218]) {
    g.beginPath();
    g.moveTo(150, 280);
    g.lineTo(ex, 168);
    g.stroke();
  }
  // 結び｡紙を巻く白い帯
  g.lineWidth = 15;
  g.beginPath();
  g.moveTo(40, 208);
  g.quadraticCurveTo(150, 236, 260, 208);
  g.stroke();
  g.restore();
  g.restore();
};

/** 石の上にも三年｡座れるほどの大きな石 */
const boulder: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 地の影｡石の据わりを出す
  const cast = g.createRadialGradient(150, 248, 10, 150, 250, 140);
  cast.addColorStop(0, "rgba(10,10,10,0.72)");
  cast.addColorStop(0.6, "rgba(10,10,10,0.22)");
  cast.addColorStop(1, "rgba(10,10,10,0)");
  g.fillStyle = cast;
  g.beginPath();
  g.ellipse(150, 246, 138, 30, 0, 0, Math.PI * 2);
  g.fill();

  // 岩の胴｡角を立てた輪郭｡左右を揃えない
  const stone = new Path2D();
  stone.moveTo(24, 202);
  stone.lineTo(44, 132);
  stone.lineTo(92, 88);
  stone.lineTo(158, 62);
  stone.lineTo(212, 80);
  stone.lineTo(264, 130);
  stone.lineTo(278, 184);
  stone.lineTo(252, 232);
  stone.lineTo(154, 250);
  stone.lineTo(58, 240);
  stone.closePath();

  const rock = g.createRadialGradient(96, 96, 14, 152, 176, 176);
  rock.addColorStop(0, "#f4f4f4");
  rock.addColorStop(0.22, "#c8c8c8");
  rock.addColorStop(0.5, "#7e7e7e");
  rock.addColorStop(0.76, "#343434");
  rock.addColorStop(1, "#0a0a0a");
  g.fillStyle = rock;
  g.fill(stone);

  g.save();
  g.clip(stone);

  // 天の面｡座る所は平らで明るい
  const seat = g.createLinearGradient(60, 70, 230, 150);
  seat.addColorStop(0, "#fbfbfb");
  seat.addColorStop(0.5, "#d2d2d2");
  seat.addColorStop(1, "#7a7a7a");
  g.fillStyle = seat;
  g.beginPath();
  g.moveTo(44, 132);
  g.lineTo(92, 88);
  g.lineTo(158, 62);
  g.lineTo(212, 80);
  g.lineTo(196, 128);
  g.lineTo(104, 152);
  g.closePath();
  g.fill();

  // 右の面｡光の回らない側
  const right = g.createLinearGradient(196, 100, 280, 240);
  right.addColorStop(0, "#5c5c5c");
  right.addColorStop(0.5, "#242424");
  right.addColorStop(1, "#050505");
  g.fillStyle = right;
  g.beginPath();
  g.moveTo(212, 80);
  g.lineTo(264, 130);
  g.lineTo(278, 184);
  g.lineTo(252, 232);
  g.lineTo(198, 242);
  g.lineTo(196, 128);
  g.closePath();
  g.fill();

  // 正面の面｡天から下へ落ちる
  const face = g.createLinearGradient(50, 130, 180, 252);
  face.addColorStop(0, "#e2e2e2");
  face.addColorStop(0.42, "#9c9c9c");
  face.addColorStop(0.8, "#3a3a3a");
  face.addColorStop(1, "#111111");
  g.fillStyle = face;
  g.beginPath();
  g.moveTo(44, 132);
  g.lineTo(104, 152);
  g.lineTo(196, 128);
  g.lineTo(198, 242);
  g.lineTo(58, 240);
  g.lineTo(24, 202);
  g.closePath();
  g.fill();

  // 割れ目｡面を跨いで走る
  g.strokeStyle = "rgba(6,6,6,0.55)";
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(116, 150);
  g.lineTo(132, 192);
  g.lineTo(112, 244);
  g.stroke();
  g.lineWidth = 3.2;
  g.beginPath();
  g.moveTo(158, 62);
  g.lineTo(150, 104);
  g.lineTo(178, 132);
  g.stroke();

  // 抉れ｡へこみを暗く落とす
  const dent = g.createRadialGradient(72, 196, 6, 74, 200, 54);
  dent.addColorStop(0, "rgba(8,8,8,0.55)");
  dent.addColorStop(1, "rgba(8,8,8,0)");
  g.fillStyle = dent;
  g.beginPath();
  g.ellipse(74, 198, 50, 34, 0.2, 0, Math.PI * 2);
  g.fill();

  // 下の縁｡地に接する所は締める
  const foot = g.createLinearGradient(0, 198, 0, 250);
  foot.addColorStop(0, "rgba(8,8,8,0)");
  foot.addColorStop(1, "rgba(8,8,8,0.72)");
  g.fillStyle = foot;
  g.fillRect(10, 190, 280, 62);
  g.restore();

  // 小石｡足もとに二つ
  for (const [px, py, pr] of [
    [44, 254, 14],
    [254, 250, 11],
  ] as const) {
    const peb = g.createRadialGradient(px - pr * 0.4, py - pr * 0.5, 2, px, py, pr * 1.4);
    peb.addColorStop(0, "#d2d2d2");
    peb.addColorStop(0.6, "#4a4a4a");
    peb.addColorStop(1, "#0a0a0a");
    g.fillStyle = peb;
    g.beginPath();
    g.ellipse(px, py, pr, pr * 0.72, 0.2, 0, Math.PI * 2);
    g.fill();
  }
  g.restore();
};

/** 24時間戦えますか｡王冠つきの栄養ドリンクの小瓶 */
const tonic: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  const L = 88;
  const R = 212;

  // 瓶｡褐色の硝子｡左に光の柱､右の縁を暗く残す
  const glass = g.createLinearGradient(L, 0, R, 0);
  glass.addColorStop(0, "#2e2e2e");
  glass.addColorStop(0.12, "#c8c8c8");
  glass.addColorStop(0.3, "#6e6e6e");
  glass.addColorStop(0.6, "#232323");
  glass.addColorStop(0.86, "#3e3e3e");
  glass.addColorStop(1, "#080808");
  const bottle = new Path2D();
  bottle.moveTo(128, 54);
  bottle.lineTo(172, 54);
  bottle.lineTo(172, 96);
  bottle.quadraticCurveTo(R, 110, R, 156);
  bottle.lineTo(R, 250);
  bottle.quadraticCurveTo(R, 272, 188, 272);
  bottle.lineTo(112, 272);
  bottle.quadraticCurveTo(L, 272, L, 250);
  bottle.lineTo(L, 156);
  bottle.quadraticCurveTo(L, 110, 128, 96);
  bottle.closePath();
  g.fillStyle = glass;
  g.fill(bottle);

  // 中身の嵩｡液の面から下をさらに沈める
  g.save();
  g.clip(bottle);
  const juice = g.createLinearGradient(0, 140, 0, 272);
  juice.addColorStop(0, "rgba(8,8,8,0.12)");
  juice.addColorStop(1, "rgba(8,8,8,0.6)");
  g.fillStyle = juice;
  g.fillRect(L, 140, R - L, 140);
  // 硝子の照り｡肩から裾へ通る白い筋
  g.fillStyle = "rgba(252,252,252,0.5)";
  g.beginPath();
  g.moveTo(106, 132);
  g.quadraticCurveTo(100, 200, 104, 262);
  g.lineTo(120, 262);
  g.quadraticCurveTo(116, 200, 122, 132);
  g.closePath();
  g.fill();
  g.restore();

  // 首の帯｡瓶の肩を締める
  g.fillStyle = "rgba(240,240,240,0.8)";
  g.fillRect(126, 100, 48, 7);

  // ラベル帯｡胴を横に巻く
  const label = g.createLinearGradient(0, 164, 0, 232);
  label.addColorStop(0, "#fcfcfc");
  label.addColorStop(0.45, "#e2e2e2");
  label.addColorStop(1, "#9a9a9a");
  g.fillStyle = label;
  g.beginPath();
  g.moveTo(L - 1, 166);
  g.quadraticCurveTo(150, 174, R + 1, 166);
  g.lineTo(R + 1, 230);
  g.quadraticCurveTo(150, 238, L - 1, 230);
  g.closePath();
  g.fill();

  // ラベルの罫と字面｡読ませずに帯の調子だけ置く
  g.fillStyle = "rgba(16,16,16,0.84)";
  g.beginPath();
  g.moveTo(L + 4, 178);
  g.quadraticCurveTo(150, 186, R - 4, 178);
  g.lineTo(R - 4, 188);
  g.quadraticCurveTo(150, 196, L + 4, 188);
  g.closePath();
  g.fill();
  g.fillStyle = "rgba(26,26,26,0.7)";
  for (let i = 0; i < 7; i++) {
    const x = L + 12 + i * 15;
    g.fillRect(x, 204 + (i % 2) * 2, 10, 12);
  }
  g.strokeStyle = "rgba(20,20,20,0.5)";
  g.lineWidth = 2.4;
  g.beginPath();
  g.moveTo(L + 4, 224);
  g.quadraticCurveTo(150, 232, R - 4, 224);
  g.stroke();

  // 王冠｡上に座る蓋｡裾に刻みを入れる
  const cap = g.createLinearGradient(124, 22, 178, 58);
  cap.addColorStop(0, "#f2f2f2");
  cap.addColorStop(0.32, "#a2a2a2");
  cap.addColorStop(0.7, "#2c2c2c");
  cap.addColorStop(1, "#0a0a0a");
  g.fillStyle = cap;
  g.beginPath();
  g.moveTo(122, 40);
  g.quadraticCurveTo(124, 20, 150, 18);
  g.quadraticCurveTo(176, 20, 178, 40);
  g.lineTo(178, 52);
  g.lineTo(122, 52);
  g.closePath();
  g.fill();
  g.fillStyle = "#0d0d0d";
  for (let i = 0; i < 10; i++) {
    g.fillRect(122 + i * 6, 46, 3, 11);
  }
  g.restore();
};

export const PLATES_B: Record<string, Draw> = {
  "017": kabuto,
  "018": abacus,
  "019": chabudai,
  "020": hanko,
  "021": masu,
  "022": kappogi,
  "023": pairCups,
  "024": ring,
  "025": bouquet,
  "026": boulder,
  "027": tonic,
};
