/**
 * 図版の版下（その九｡089-098）｡
 *
 * ここでは網のことは考えず､灰色の絵として描く｡
 * 立体感は濃淡で出しておくと､網にかけたときに刷り物の肌になる｡
 * 座標は 300 四方で書いて､s で伸ばす｡枠いっぱいに大きく取る｡
 *
 * この10枚は戸籍・法典・投票・婚姻と紙の話が続くので､紙の絵が並ばないように
 * 物を散らした｡演壇・袋・衣・竈・駕籠・椅子・鎹・幹・柱・花｡人の姿は描かない｡
 */

import type { Draw } from "./draw";

/** 角の丸い四角｡経路だけ返して､塗りと白抜きは呼ぶ側に任せる */
const rpath = (x: number, y: number, w: number, h: number, r: number) => {
  const p = new Path2D();
  p.moveTo(x + r, y);
  p.lineTo(x + w - r, y);
  p.quadraticCurveTo(x + w, y, x + w, y + r);
  p.lineTo(x + w, y + h - r);
  p.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  p.lineTo(x + r, y + h);
  p.quadraticCurveTo(x, y + h, x, y + h - r);
  p.lineTo(x, y + r);
  p.quadraticCurveTo(x, y, x + r, y);
  p.closePath();
  return p;
};

/** 政治は男のもの｡演壇｡結社にも政談集会にも入れない者がいた */
const lectern: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 天板｡手前へ傾けた面｡奥を狭めて見下ろす
  const deskTop = new Path2D();
  deskTop.moveTo(72, 62);
  deskTop.lineTo(228, 62);
  deskTop.lineTo(258, 108);
  deskTop.lineTo(42, 108);
  deskTop.closePath();
  const boardG = g.createLinearGradient(72, 62, 200, 108);
  boardG.addColorStop(0, "#d8d8d8");
  boardG.addColorStop(0.45, "#8a8a8a");
  boardG.addColorStop(1, "#3a3a3a");
  g.fillStyle = boardG;
  g.fill(deskTop);

  // 手前の縁｡落ちどめの桟｡白い一本で天板と切る
  g.fillStyle = "#fcfcfc";
  g.fillRect(40, 106, 220, 5);
  const lipG = g.createLinearGradient(0, 111, 0, 130);
  lipG.addColorStop(0, "#6e6e6e");
  lipG.addColorStop(0.5, "#0e0e0e");
  lipG.addColorStop(1, "#4a4a4a");
  g.fillStyle = lipG;
  g.beginPath();
  g.moveTo(42, 111);
  g.lineTo(258, 111);
  g.lineTo(252, 130);
  g.lineTo(48, 130);
  g.closePath();
  g.fill();

  // 胴｡下へ細る一枚板｡左右の縁を落として中を明るく残す
  const post = new Path2D();
  post.moveTo(84, 134);
  post.lineTo(216, 134);
  post.lineTo(198, 254);
  post.lineTo(102, 254);
  post.closePath();
  const postG = g.createLinearGradient(84, 0, 216, 0);
  postG.addColorStop(0, "#0b0b0b");
  postG.addColorStop(0.22, "#5a5a5a");
  postG.addColorStop(0.46, "#8e8e8e");
  postG.addColorStop(0.72, "#3c3c3c");
  postG.addColorStop(1, "#090909");
  g.fillStyle = postG;
  g.fill(post);

  // 胴の彫り込み｡白い枠を一本入れて､ただの箱に見えないようにする
  g.strokeStyle = "rgba(252,252,252,0.62)";
  g.lineWidth = 5;
  g.beginPath();
  g.moveTo(112, 154);
  g.lineTo(188, 154);
  g.lineTo(178, 232);
  g.lineTo(122, 232);
  g.closePath();
  g.stroke();

  // 台｡上に白い隙を空けて胴と切る
  g.fillStyle = "#fcfcfc";
  g.fillRect(84, 254, 132, 5);
  const baseG = g.createLinearGradient(0, 259, 0, 288);
  baseG.addColorStop(0, "#7a7a7a");
  baseG.addColorStop(0.45, "#101010");
  baseG.addColorStop(1, "#3e3e3e");
  g.fillStyle = baseG;
  g.beginPath();
  g.moveTo(78, 259);
  g.lineTo(222, 259);
  g.lineTo(234, 288);
  g.lineTo(66, 288);
  g.closePath();
  g.fill();
  g.restore();
};

/** 不適格者は子を残すな｡口を縛った種袋｡蒔かせない種に印がある */
const seedSack: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 括った上の余り｡扇のように開く
  const tuft = new Path2D();
  tuft.moveTo(118, 18);
  tuft.quadraticCurveTo(150, 8, 184, 20);
  tuft.lineTo(176, 64);
  tuft.lineTo(126, 64);
  tuft.closePath();
  const tuftG = g.createLinearGradient(118, 0, 184, 0);
  tuftG.addColorStop(0, "#1c1c1c");
  tuftG.addColorStop(0.4, "#9e9e9e");
  tuftG.addColorStop(0.7, "#484848");
  tuftG.addColorStop(1, "#111111");
  g.fillStyle = tuftG;
  g.fill(tuft);
  g.strokeStyle = "rgba(252,252,252,0.65)";
  g.lineWidth = 4;
  for (const x of [138, 160]) {
    g.beginPath();
    g.moveTo(x, 16);
    g.lineTo(x - 2, 62);
    g.stroke();
  }

  // 袋｡首から下へ大きく膨れる一つの塊
  const bag = new Path2D();
  bag.moveTo(126, 66);
  bag.lineTo(176, 66);
  bag.bezierCurveTo(200, 104, 244, 152, 240, 214);
  bag.bezierCurveTo(236, 254, 202, 278, 150, 278);
  bag.bezierCurveTo(98, 278, 64, 254, 60, 214);
  bag.bezierCurveTo(56, 152, 102, 104, 126, 66);
  bag.closePath();
  const cloth = g.createRadialGradient(108, 132, 14, 150, 200, 190);
  cloth.addColorStop(0, "#f2f2f2");
  cloth.addColorStop(0.3, "#b2b2b2");
  cloth.addColorStop(0.68, "#3a3a3a");
  cloth.addColorStop(1, "#0b0b0b");
  g.fillStyle = cloth;
  g.fill(bag);

  // 皺｡首から裾へ流れる太い筋を数本だけ
  g.save();
  g.clip(bag);
  for (const [x0, x1] of [
    [132, 92],
    [150, 150],
    [170, 208],
  ] as const) {
    g.strokeStyle = "rgba(8,8,8,0.42)";
    g.lineWidth = 9;
    g.beginPath();
    g.moveTo(x0, 74);
    g.quadraticCurveTo(x0 + (x1 - x0) * 0.6, 180, x1, 274);
    g.stroke();
    g.strokeStyle = "rgba(252,252,252,0.34)";
    g.lineWidth = 5;
    g.beginPath();
    g.moveTo(x0 + 8, 74);
    g.quadraticCurveTo(x0 + 8 + (x1 - x0) * 0.6, 180, x1 + 10, 274);
    g.stroke();
  }
  g.restore();

  // 縛った縄｡二重に巻いて結び目から端が垂れる
  const rope = g.createLinearGradient(0, 62, 0, 96);
  rope.addColorStop(0, "#d2d2d2");
  rope.addColorStop(0.45, "#151515");
  rope.addColorStop(1, "#4e4e4e");
  g.fillStyle = rope;
  g.fillRect(120, 62, 62, 16);
  g.fillRect(118, 82, 66, 14);
  g.strokeStyle = "#141414";
  g.lineWidth = 11;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(182, 90);
  g.quadraticCurveTo(214, 96, 226, 76);
  g.stroke();

  // 検印｡蒔かせないほうに押された大きなバツ
  g.lineCap = "butt";
  g.strokeStyle = "rgba(252,252,252,0.9)";
  g.lineWidth = 26;
  for (const d of [1, -1] as const) {
    g.beginPath();
    g.moveTo(146 - 38, 188 - 38 * d);
    g.lineTo(146 + 38, 188 + 38 * d);
    g.stroke();
  }
  g.strokeStyle = "#0c0c0c";
  g.lineWidth = 15;
  for (const d of [1, -1] as const) {
    g.beginPath();
    g.moveTo(146 - 38, 188 - 38 * d);
    g.lineTo(146 + 38, 188 + 38 * d);
    g.stroke();
  }
  g.restore();
};

/** 妻は夫の姓を名乗る｡背に一つ紋だけを置いた紋付｡着る紋は婚家のものになる */
const montsuki: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  /** 絹の濃さ｡肩を明るく､裾へ落とす */
  const silk = (x0: number, y0: number, y1: number) => {
    const grd = g.createLinearGradient(x0, y0, x0, y1);
    grd.addColorStop(0, "#c8c8c8");
    grd.addColorStop(0.28, "#7e7e7e");
    grd.addColorStop(0.68, "#2a2a2a");
    grd.addColorStop(1, "#0a0a0a");
    return grd;
  };

  // 袖｡左右に張り出す大きな箱｡外の下角だけ丸める
  for (const d of [-1, 1] as const) {
    const inX = 150 + d * 54;
    const outX = 150 + d * 130;
    const sleeve = new Path2D();
    sleeve.moveTo(inX, 72);
    sleeve.lineTo(outX, 72);
    sleeve.lineTo(outX, 168);
    sleeve.quadraticCurveTo(outX, 192, outX - d * 26, 192);
    sleeve.lineTo(inX, 192);
    sleeve.closePath();
    g.strokeStyle = "#fcfcfc";
    g.lineWidth = 11;
    g.lineJoin = "round";
    g.stroke(sleeve);
    g.fillStyle = silk(150, 72, 192);
    g.fill(sleeve);
    // 袖口｡内側の縁を白く一本
    g.strokeStyle = "rgba(252,252,252,0.5)";
    g.lineWidth = 5;
    g.beginPath();
    g.moveTo(outX - d * 7, 78);
    g.lineTo(outX - d * 7, 186);
    g.stroke();
  }

  // 身頃｡肩から裾へ､わずかに広がる一枚
  const body = new Path2D();
  body.moveTo(96, 72);
  body.lineTo(204, 72);
  body.quadraticCurveTo(210, 170, 214, 264);
  body.lineTo(86, 264);
  body.quadraticCurveTo(90, 170, 96, 72);
  body.closePath();
  g.strokeStyle = "#fcfcfc";
  g.lineWidth = 11;
  g.stroke(body);
  g.fillStyle = silk(150, 72, 264);
  g.fill(body);

  // 背縫い｡真ん中を白く割る
  g.strokeStyle = "rgba(252,252,252,0.55)";
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(150, 128);
  g.lineTo(150, 260);
  g.stroke();

  // 衿｡肩の上を横切る帯｡白い隙で身頃と切る
  g.fillStyle = "#fcfcfc";
  g.fillRect(106, 52, 88, 26);
  const collar = g.createLinearGradient(0, 56, 0, 74);
  collar.addColorStop(0, "#5e5e5e");
  collar.addColorStop(0.5, "#101010");
  collar.addColorStop(1, "#3c3c3c");
  g.fillStyle = collar;
  g.beginPath();
  g.moveTo(112, 56);
  g.quadraticCurveTo(150, 46, 188, 56);
  g.lineTo(188, 74);
  g.quadraticCurveTo(150, 64, 112, 74);
  g.closePath();
  g.fill();

  // 紋｡背にひとつだけ｡白く抜いた丸に隅立て四つ目
  g.fillStyle = "#fcfcfc";
  g.beginPath();
  g.arc(150, 122, 35, 0, Math.PI * 2);
  g.fill();
  const mon = g.createLinearGradient(122, 94, 178, 150);
  mon.addColorStop(0, "#3c3c3c");
  mon.addColorStop(0.5, "#0b0b0b");
  mon.addColorStop(1, "#262626");
  g.fillStyle = mon;
  for (const [dx, dy] of [
    [0, -15],
    [15, 0],
    [0, 15],
    [-15, 0],
  ] as const) {
    g.save();
    g.translate(150 + dx, 122 + dy);
    g.rotate(Math.PI / 4);
    g.fillRect(-9, -9, 18, 18);
    g.restore();
  }

  // 裾｡いちばん濃いところ｡上に白い一本を入れて身頃と切る
  g.strokeStyle = "rgba(252,252,252,0.4)";
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(88, 244);
  g.lineTo(212, 244);
  g.stroke();
  g.restore();
};

/** 戸主制｡竈｡家はひと竈で数えられ､火の口はひとつしかない */
const kamado: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 胴｡下へ広がる土の塊｡左から光を当てて右へ落とす
  const body = new Path2D();
  body.moveTo(56, 126);
  body.bezierCurveTo(48, 180, 42, 226, 40, 258);
  body.lineTo(260, 258);
  body.bezierCurveTo(258, 226, 252, 180, 244, 126);
  body.closePath();
  const clay = g.createLinearGradient(40, 0, 260, 0);
  clay.addColorStop(0, "#0c0c0c");
  clay.addColorStop(0.2, "#585858");
  clay.addColorStop(0.44, "#8e8e8e");
  clay.addColorStop(0.72, "#333333");
  clay.addColorStop(1, "#0a0a0a");
  g.fillStyle = clay;
  g.fill(body);

  // 天｡平らな面｡白い縁で胴と切る
  const topG = g.createLinearGradient(52, 104, 248, 148);
  topG.addColorStop(0, "#f0f0f0");
  topG.addColorStop(0.5, "#b0b0b0");
  topG.addColorStop(1, "#5e5e5e");
  g.fillStyle = topG;
  g.beginPath();
  g.ellipse(150, 126, 98, 28, 0, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "#fcfcfc";
  g.lineWidth = 5;
  g.beginPath();
  g.ellipse(150, 126, 98, 28, 0, 0, Math.PI * 2);
  g.stroke();

  // 釜口｡天に開いた丸い穴｡縁を明るく起こしてから中を黒く落とす
  g.strokeStyle = "#e8e8e8";
  g.lineWidth = 13;
  g.beginPath();
  g.ellipse(150, 122, 48, 15, 0, 0, Math.PI * 2);
  g.stroke();
  const hole = g.createLinearGradient(0, 108, 0, 138);
  hole.addColorStop(0, "#060606");
  hole.addColorStop(1, "#3a3a3a");
  g.fillStyle = hole;
  g.beginPath();
  g.ellipse(150, 122, 48, 15, 0, 0, Math.PI * 2);
  g.fill();

  // 焚き口｡前に開いた一つだけの口｡まわりを白く抜いて深さを出す
  const mouth = new Path2D();
  mouth.moveTo(110, 254);
  mouth.lineTo(110, 208);
  mouth.quadraticCurveTo(150, 178, 190, 208);
  mouth.lineTo(190, 254);
  mouth.closePath();
  g.strokeStyle = "#fbfbfb";
  g.lineWidth = 12;
  g.lineJoin = "round";
  g.stroke(mouth);
  const inside = g.createLinearGradient(0, 186, 0, 254);
  inside.addColorStop(0, "#050505");
  inside.addColorStop(0.7, "#0e0e0e");
  inside.addColorStop(1, "#4a4a4a");
  g.fillStyle = inside;
  g.fill(mouth);

  // 焚き口の縁石｡口の左右に厚みを見せる
  g.fillStyle = "rgba(252,252,252,0.5)";
  g.fillRect(96, 206, 8, 48);
  g.fillRect(196, 206, 8, 48);

  // 据わり｡地面につく台
  const foot = g.createLinearGradient(0, 258, 0, 280);
  foot.addColorStop(0, "#6a6a6a");
  foot.addColorStop(0.5, "#0e0e0e");
  foot.addColorStop(1, "#3c3c3c");
  g.fillStyle = foot;
  g.fillRect(32, 258, 236, 22);
  g.restore();
};

/** 女は15歳で嫁ぐ｡担ぎ棒を通した婚礼の駕籠｡乗る者は描かない */
const palanquin: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 担ぎ棒｡枠の左右へ抜ける一本｡わずかに撓む
  const pole = new Path2D();
  pole.moveTo(-10, 44);
  pole.quadraticCurveTo(150, 30, 310, 44);
  pole.lineTo(310, 68);
  pole.quadraticCurveTo(150, 54, -10, 68);
  pole.closePath();
  const poleG = g.createLinearGradient(0, 30, 0, 68);
  poleG.addColorStop(0, "#d6d6d6");
  poleG.addColorStop(0.42, "#6a6a6a");
  poleG.addColorStop(1, "#0d0d0d");
  g.fillStyle = poleG;
  g.fill(pole);

  // 吊り金具｡棒と屋根をつなぐ二本
  g.fillStyle = "#121212";
  g.fillRect(104, 58, 18, 38);
  g.fillRect(178, 58, 18, 38);

  // 屋根｡緩く反った一枚｡軒を白く抜いて胴と切る
  const roof = new Path2D();
  roof.moveTo(52, 112);
  roof.quadraticCurveTo(150, 74, 248, 112);
  roof.lineTo(248, 130);
  roof.quadraticCurveTo(150, 96, 52, 130);
  roof.closePath();
  const roofG = g.createLinearGradient(52, 74, 248, 130);
  roofG.addColorStop(0, "#e0e0e0");
  roofG.addColorStop(0.42, "#8a8a8a");
  roofG.addColorStop(1, "#141414");
  g.fillStyle = roofG;
  g.fill(roof);
  g.fillStyle = "#fcfcfc";
  g.fillRect(50, 130, 200, 6);

  // 胴｡下へわずかに細る箱｡両の縁を落として中を明るく残す
  const box = new Path2D();
  box.moveTo(66, 136);
  box.lineTo(234, 136);
  box.lineTo(222, 248);
  box.lineTo(78, 248);
  box.closePath();
  const lacquer = g.createLinearGradient(66, 0, 234, 0);
  lacquer.addColorStop(0, "#090909");
  lacquer.addColorStop(0.22, "#4e4e4e");
  lacquer.addColorStop(0.46, "#7e7e7e");
  lacquer.addColorStop(0.74, "#2e2e2e");
  lacquer.addColorStop(1, "#080808");
  g.fillStyle = lacquer;
  g.fill(box);

  // 物見窓｡角に丸みのある口をひとつ｡縁を白く起こしてから奥を黒く落とす
  const win = rpath(104, 150, 92, 72, 8);
  g.strokeStyle = "#fbfbfb";
  g.lineWidth = 12;
  g.stroke(win);
  const inner = g.createLinearGradient(0, 150, 0, 222);
  inner.addColorStop(0, "#040404");
  inner.addColorStop(0.7, "#0e0e0e");
  inner.addColorStop(1, "#3a3a3a");
  g.fillStyle = inner;
  g.fill(win);

  // 巻き上げた簾｡窓の上に一本だけ渡す
  const blindG = g.createLinearGradient(0, 152, 0, 180);
  blindG.addColorStop(0, "#e2e2e2");
  blindG.addColorStop(0.55, "#9a9a9a");
  blindG.addColorStop(1, "#4a4a4a");
  g.fillStyle = blindG;
  g.fill(rpath(108, 154, 84, 26, 9));
  g.strokeStyle = "rgba(10,10,10,0.55)";
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(112, 167);
  g.lineTo(188, 167);
  g.stroke();

  // 台｡駕籠を地に置くための横木｡白い隙で胴と切る
  g.fillStyle = "#fcfcfc";
  g.fillRect(70, 248, 162, 5);
  const skid = g.createLinearGradient(0, 253, 0, 274);
  skid.addColorStop(0, "#8a8a8a");
  skid.addColorStop(0.5, "#0e0e0e");
  skid.addColorStop(1, "#3a3a3a");
  g.fillStyle = skid;
  g.fillRect(58, 253, 184, 21);
  g.restore();
};

/** 妻は半分だけの大人｡背の高い子どもの椅子｡盆つきの席にすわらせる */
const highChair: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 背もたれ｡大きな一枚に白い隙を二本入れて三本の桟に割る
  const back = rpath(108, 18, 84, 132, 10);
  const panel = g.createLinearGradient(108, 0, 192, 0);
  panel.addColorStop(0, "#0d0d0d");
  panel.addColorStop(0.28, "#5e5e5e");
  panel.addColorStop(0.55, "#2e2e2e");
  panel.addColorStop(0.82, "#585858");
  panel.addColorStop(1, "#0b0b0b");
  g.fillStyle = panel;
  g.fill(back);
  g.strokeStyle = "#fcfcfc";
  g.lineWidth = 12;
  g.lineCap = "butt";
  for (const x of [136, 164]) {
    g.beginPath();
    g.moveTo(x, 22);
    g.lineTo(x, 146);
    g.stroke();
  }

  // 奥の脚｡灰色にして手前と奥を分ける
  const rear = g.createLinearGradient(182, 0, 210, 0);
  rear.addColorStop(0, "#787878");
  rear.addColorStop(1, "#3c3c3c");
  g.fillStyle = rear;
  g.beginPath();
  g.moveTo(182, 168);
  g.lineTo(202, 168);
  g.lineTo(214, 268);
  g.lineTo(194, 268);
  g.closePath();
  g.fill();

  // 座｡奥から手前へ広がる板
  const seat = g.createLinearGradient(0, 150, 0, 182);
  seat.addColorStop(0, "#b4b4b4");
  seat.addColorStop(0.5, "#4a4a4a");
  seat.addColorStop(1, "#151515");
  g.fillStyle = seat;
  g.beginPath();
  g.moveTo(90, 148);
  g.lineTo(210, 148);
  g.lineTo(222, 178);
  g.lineTo(78, 178);
  g.closePath();
  g.fill();

  // 手前の脚｡外へ開く｡白い縁で座と切る
  const legG = g.createLinearGradient(0, 176, 0, 294);
  legG.addColorStop(0, "#9e9e9e");
  legG.addColorStop(0.4, "#2a2a2a");
  legG.addColorStop(1, "#0a0a0a");
  for (const [x0, x1] of [
    [100, 64],
    [200, 236],
  ] as const) {
    const leg = new Path2D();
    leg.moveTo(x0 - 15, 172);
    leg.lineTo(x0 + 15, 172);
    leg.lineTo(x1 + 15, 294);
    leg.lineTo(x1 - 15, 294);
    leg.closePath();
    g.strokeStyle = "#fcfcfc";
    g.lineWidth = 10;
    g.stroke(leg);
    g.fillStyle = legG;
    g.fill(leg);
  }

  // 足掛け｡脚のあいだを一本渡す
  const bar = rpath(78, 248, 144, 17, 7);
  g.strokeStyle = "#fcfcfc";
  g.lineWidth = 9;
  g.stroke(bar);
  const barG = g.createLinearGradient(0, 248, 0, 265);
  barG.addColorStop(0, "#a6a6a6");
  barG.addColorStop(0.55, "#242424");
  barG.addColorStop(1, "#0c0c0c");
  g.fillStyle = barG;
  g.fill(bar);

  // 盆｡いちばん手前の大きな面｡上面は明るく､木口だけ濃く落とす｡
  // まわりを白く抜いて脚から切り離す
  const tray = new Path2D();
  tray.moveTo(46, 182);
  tray.quadraticCurveTo(150, 174, 254, 182);
  tray.lineTo(246, 210);
  tray.quadraticCurveTo(150, 220, 54, 210);
  tray.closePath();
  const lip = new Path2D();
  lip.moveTo(54, 210);
  lip.quadraticCurveTo(150, 220, 246, 210);
  lip.lineTo(242, 226);
  lip.quadraticCurveTo(150, 236, 58, 226);
  lip.closePath();
  g.strokeStyle = "#fcfcfc";
  g.lineWidth = 12;
  g.stroke(tray);
  g.stroke(lip);
  const trayG = g.createLinearGradient(46, 174, 254, 210);
  trayG.addColorStop(0, "#8e8e8e");
  trayG.addColorStop(0.22, "#e4e4e4");
  trayG.addColorStop(0.55, "#f4f4f4");
  trayG.addColorStop(0.82, "#b0b0b0");
  trayG.addColorStop(1, "#6a6a6a");
  g.fillStyle = trayG;
  g.fill(tray);
  const lipG = g.createLinearGradient(0, 210, 0, 226);
  lipG.addColorStop(0, "#4a4a4a");
  lipG.addColorStop(0.6, "#101010");
  lipG.addColorStop(1, "#2e2e2e");
  g.fillStyle = lipG;
  g.fill(lip);
  g.restore();
};

/** 結婚は解けない｡二本の材に打ち込まれた鎹｡抜くには材を割るしかない */
const cramp: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.translate(s / 2, s / 2);
  g.rotate(-0.24);
  g.translate(-s / 2, -s / 2);
  g.scale(u, u);

  /** 材｡木口を明るく､面は上から光を当てて下へ落とす｡鉄より明るく保つ */
  const beam = (y: number, h: number) => {
    const endG = g.createLinearGradient(16, y, 44, y + h);
    endG.addColorStop(0, "#fafafa");
    endG.addColorStop(0.55, "#cacaca");
    endG.addColorStop(1, "#7e7e7e");
    g.fillStyle = endG;
    g.beginPath();
    g.moveTo(16, y + 14);
    g.lineTo(44, y);
    g.lineTo(44, y + h);
    g.lineTo(16, y + h + 14);
    g.closePath();
    g.fill();

    const faceG = g.createLinearGradient(0, y, 0, y + h);
    faceG.addColorStop(0, "#242424");
    faceG.addColorStop(0.18, "#a8a8a8");
    faceG.addColorStop(0.48, "#d4d4d4");
    faceG.addColorStop(0.82, "#767676");
    faceG.addColorStop(1, "#1c1c1c");
    g.fillStyle = faceG;
    g.fillRect(44, y, 246, h);

    // 木目｡横に二本だけ
    g.save();
    g.beginPath();
    g.rect(44, y, 246, h);
    g.clip();
    g.strokeStyle = "rgba(8,8,8,0.34)";
    g.lineWidth = 5;
    for (const o of [0.34, 0.7]) {
      g.beginPath();
      g.moveTo(44, y + h * o);
      g.quadraticCurveTo(160, y + h * o + 10, 290, y + h * o);
      g.stroke();
    }
    g.restore();
  };

  beam(46, 96);
  beam(158, 104);

  // 継ぎ目｡二本の材のあいだ｡紙のまま白く空けて､際だけ濃く落とす
  g.fillStyle = "rgba(10,10,10,0.5)";
  g.fillRect(16, 142, 274, 5);
  g.fillRect(16, 153, 274, 5);

  // 鎹｡継ぎ目をまたぐ鉄｡材より濃くして白い縁で木から切る
  const bar = rpath(112, 88, 40, 124, 8);
  const legT = rpath(74, 88, 44, 34, 5);
  const legB = rpath(74, 178, 44, 34, 5);
  g.strokeStyle = "#fcfcfc";
  g.lineWidth = 11;
  g.lineJoin = "round";
  for (const p of [bar, legT, legB]) g.stroke(p);
  const ironG = g.createLinearGradient(112, 0, 152, 0);
  ironG.addColorStop(0, "#8e8e8e");
  ironG.addColorStop(0.35, "#333333");
  ironG.addColorStop(1, "#070707");
  g.fillStyle = ironG;
  g.fill(bar);
  const legG = g.createLinearGradient(74, 0, 118, 0);
  legG.addColorStop(0, "#050505");
  legG.addColorStop(0.55, "#111111");
  legG.addColorStop(1, "#4a4a4a");
  g.fillStyle = legG;
  g.fill(legT);
  g.fill(legB);

  // 打ち込み口｡脚が材に沈むところ
  g.fillStyle = "rgba(6,6,6,0.8)";
  g.fillRect(72, 90, 10, 30);
  g.fillRect(72, 180, 10, 30);

  // 叩かれた面｡鉄の上に白い一本
  g.strokeStyle = "rgba(252,252,252,0.8)";
  g.lineWidth = 6;
  g.beginPath();
  g.moveTo(122, 100);
  g.lineTo(122, 200);
  g.stroke();
  g.restore();
};

/** 認知できない子がいる｡枝を落とした幹｡落ちた枝は幹に戻らない */
const cutBranch: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 生きている枝｡幹の後ろから出して枠の外へ抜ける
  const limb = new Path2D();
  limb.moveTo(150, 98);
  limb.bezierCurveTo(212, 86, 258, 56, 306, 12);
  limb.lineTo(306, -28);
  limb.bezierCurveTo(250, 18, 206, 42, 148, 48);
  limb.closePath();
  g.strokeStyle = "#fcfcfc";
  g.lineWidth = 11;
  g.stroke(limb);
  const limbG = g.createLinearGradient(160, 96, 300, 0);
  limbG.addColorStop(0, "#2a2a2a");
  limbG.addColorStop(0.4, "#6e6e6e");
  limbG.addColorStop(1, "#0d0d0d");
  g.fillStyle = limbG;
  g.fill(limb);

  // 切った枝の付け根｡これも幹の後ろから出す
  const stub = new Path2D();
  stub.moveTo(160, 142);
  stub.lineTo(226, 150);
  stub.lineTo(226, 210);
  stub.lineTo(160, 220);
  stub.closePath();
  g.strokeStyle = "#fcfcfc";
  g.lineWidth = 11;
  g.stroke(stub);
  const stubG = g.createLinearGradient(0, 142, 0, 220);
  stubG.addColorStop(0, "#8e8e8e");
  stubG.addColorStop(0.45, "#333333");
  stubG.addColorStop(1, "#0b0b0b");
  g.fillStyle = stubG;
  g.fill(stub);

  // 幹｡上下を枠の外まで出した大きな一本
  const trunk = new Path2D();
  trunk.moveTo(72, -10);
  trunk.bezierCurveTo(66, 90, 84, 200, 92, 310);
  trunk.lineTo(186, 310);
  trunk.bezierCurveTo(176, 200, 172, 90, 164, -10);
  trunk.closePath();
  const bark = g.createLinearGradient(66, 0, 186, 0);
  bark.addColorStop(0, "#0b0b0b");
  bark.addColorStop(0.22, "#5a5a5a");
  bark.addColorStop(0.46, "#8a8a8a");
  bark.addColorStop(0.72, "#333333");
  bark.addColorStop(1, "#090909");
  g.fillStyle = bark;
  g.fill(trunk);

  // 樹皮の溝｡数は少なく､白と黒を並べて走らせる
  g.save();
  g.clip(trunk);
  for (const [x, w] of [
    [100, 6],
    [144, 5],
  ] as const) {
    g.strokeStyle = "rgba(6,6,6,0.5)";
    g.lineWidth = w + 3;
    g.beginPath();
    g.moveTo(x, -10);
    g.bezierCurveTo(x - 8, 100, x + 10, 200, x + 6, 310);
    g.stroke();
    g.strokeStyle = "rgba(252,252,252,0.34)";
    g.lineWidth = w - 1.5;
    g.beginPath();
    g.moveTo(x + 8, -10);
    g.bezierCurveTo(x, 100, x + 18, 200, x + 14, 310);
    g.stroke();
  }
  g.restore();

  // 切り口｡版でいちばん明るい面｡年輪は引かず､割れ目を一本だけ入れる
  const cut = g.createRadialGradient(220, 164, 4, 226, 180, 40);
  cut.addColorStop(0, "#fdfdfd");
  cut.addColorStop(0.55, "#e4e4e4");
  cut.addColorStop(1, "#9c9c9c");
  g.fillStyle = cut;
  g.beginPath();
  g.ellipse(226, 180, 19, 33, 0, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "rgba(14,14,14,0.75)";
  g.lineWidth = 3.5;
  g.beginPath();
  g.ellipse(226, 180, 19, 33, 0, 0, Math.PI * 2);
  g.stroke();
  g.lineWidth = 2.8;
  g.beginPath();
  g.moveTo(220, 150);
  g.lineTo(229, 182);
  g.lineTo(222, 210);
  g.stroke();

  // 落ちた枝｡幹から離れたまま転がっている｡あいだは紙のまま白く空ける
  g.save();
  g.translate(244, 254);
  g.rotate(-0.2);
  const log = rpath(-48, -17, 96, 34, 12);
  g.strokeStyle = "#fcfcfc";
  g.lineWidth = 12;
  g.stroke(log);
  const logG = g.createLinearGradient(0, -17, 0, 17);
  logG.addColorStop(0, "#7e7e7e");
  logG.addColorStop(0.45, "#2c2c2c");
  logG.addColorStop(1, "#0a0a0a");
  g.fillStyle = logG;
  g.fill(log);
  g.fillStyle = "#ededed";
  g.beginPath();
  g.ellipse(-46, 0, 10, 17, 0, 0, Math.PI * 2);
  g.fill();
  g.restore();
  g.restore();
};

/** 女に選挙権はいらない｡「慣習」と呼ばれた柱｡溝を彫った一本だけ */
const column: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 梁｡枠の上を横切らせて､柱が何を支えているかだけ見せる
  const beam = g.createLinearGradient(0, 0, 0, 28);
  beam.addColorStop(0, "#5e5e5e");
  beam.addColorStop(0.5, "#101010");
  beam.addColorStop(1, "#3a3a3a");
  g.fillStyle = beam;
  g.fillRect(28, 0, 244, 28);
  const fillet = g.createLinearGradient(0, 30, 0, 42);
  fillet.addColorStop(0, "#cfcfcf");
  fillet.addColorStop(1, "#6a6a6a");
  g.fillStyle = fillet;
  g.fillRect(40, 31, 220, 11);

  // 冠板｡白い隙で梁と切る
  const abacus = g.createLinearGradient(70, 0, 230, 0);
  abacus.addColorStop(0, "#111111");
  abacus.addColorStop(0.3, "#8a8a8a");
  abacus.addColorStop(0.62, "#454545");
  abacus.addColorStop(1, "#0d0d0d");
  g.fillStyle = abacus;
  g.fillRect(70, 46, 160, 24);

  // 皿｡冠板から柱へ絞る
  const echinus = g.createLinearGradient(84, 0, 216, 0);
  echinus.addColorStop(0, "#161616");
  echinus.addColorStop(0.32, "#9a9a9a");
  echinus.addColorStop(0.66, "#3e3e3e");
  echinus.addColorStop(1, "#101010");
  g.fillStyle = echinus;
  g.beginPath();
  g.moveTo(84, 74);
  g.lineTo(216, 74);
  g.quadraticCurveTo(206, 88, 198, 96);
  g.lineTo(102, 96);
  g.quadraticCurveTo(94, 88, 84, 74);
  g.closePath();
  g.fill();

  // 柱身｡中ほどを膨らませる｡溝は濃淡の繰り返しだけで彫る
  const shaft = new Path2D();
  shaft.moveTo(104, 96);
  shaft.bezierCurveTo(99, 150, 97, 200, 96, 250);
  shaft.lineTo(204, 250);
  shaft.bezierCurveTo(203, 200, 201, 150, 196, 96);
  shaft.closePath();
  const flute = g.createLinearGradient(96, 0, 204, 0);
  flute.addColorStop(0, "#151515");
  flute.addColorStop(0.06, "#b6b6b6");
  flute.addColorStop(0.18, "#2c2c2c");
  flute.addColorStop(0.26, "#aeaeae");
  flute.addColorStop(0.38, "#242424");
  flute.addColorStop(0.46, "#bababa");
  flute.addColorStop(0.58, "#222222");
  flute.addColorStop(0.66, "#a4a4a4");
  flute.addColorStop(0.78, "#1e1e1e");
  flute.addColorStop(0.88, "#8e8e8e");
  flute.addColorStop(1, "#0e0e0e");
  g.fillStyle = flute;
  g.fill(shaft);

  // 柱身の上下｡白く抜いて皿と台から切る
  g.fillStyle = "#fcfcfc";
  g.fillRect(90, 92, 120, 5);
  g.fillRect(84, 250, 132, 5);

  // 台輪と礎石｡下を重くして柱を立たせる
  const torus = g.createLinearGradient(0, 255, 0, 278);
  torus.addColorStop(0, "#c2c2c2");
  torus.addColorStop(0.45, "#4a4a4a");
  torus.addColorStop(1, "#111111");
  g.fillStyle = torus;
  g.fill(rpath(82, 255, 136, 23, 10));
  const plinth = g.createLinearGradient(62, 0, 238, 0);
  plinth.addColorStop(0, "#0c0c0c");
  plinth.addColorStop(0.32, "#6e6e6e");
  plinth.addColorStop(0.68, "#2e2e2e");
  plinth.addColorStop(1, "#0a0a0a");
  g.fillStyle = plinth;
  g.fillRect(62, 281, 176, 19);
  g.fillStyle = "#fcfcfc";
  g.fillRect(78, 278, 144, 4);
  g.restore();
};

/**
 * 同性愛は犯罪｡上着の釦穴に挿した一輪｡罪に問われた側が合図に使った花｡
 *
 * 点刻の網は細い線を散らすので､この版は線を使わない｡
 * 濃い塊（襟・花）と､白く広く抜いた間（花の縁・返り・刻み・釦穴）だけで組む｡
 */
const buttonhole: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.translate(s / 2, s / 2);
  g.rotate(-0.55);
  g.translate(-s / 2, -s / 2);
  g.scale(u, u);

  // 衿｡刻みより上だけ外へ張り出す濃い面
  const collarG = g.createLinearGradient(36, 0, 202, 0);
  collarG.addColorStop(0, "#111111");
  collarG.addColorStop(0.5, "#3a3a3a");
  collarG.addColorStop(1, "#141414");
  g.fillStyle = collarG;
  g.fillRect(36, -90, 166, 128);

  // 襟｡枠を斜めに横切る濃い帯｡右の縁から先は紙のまま
  const lapelG = g.createLinearGradient(36, 0, 172, 0);
  lapelG.addColorStop(0, "#101010");
  lapelG.addColorStop(0.42, "#3e3e3e");
  lapelG.addColorStop(0.78, "#262626");
  lapelG.addColorStop(1, "#0d0d0d");
  g.fillStyle = lapelG;
  g.fillRect(36, 74, 136, 316);

  // 刻み（ノッチ）｡衿と襟のあいだ｡線ではなく面の境として白く広く抜く
  g.fillStyle = "#ffffff";
  g.beginPath();
  g.moveTo(202, 22);
  g.lineTo(172, 106);
  g.lineTo(96, 66);
  g.closePath();
  g.fill();
  g.fillRect(36, 38, 166, 12);

  // 返り｡襟の折り目｡白く広く抜いて内側と襟を切る
  g.fillStyle = "#ffffff";
  g.fillRect(62, -90, 15, 480);

  // 釦穴｡花の下に白く抜いた切れ込みひとつ
  g.fillStyle = "#ffffff";
  g.fillRect(92, 240, 72, 20);

  // 花｡縁を大きく波立たせた濃い塊｡まわりを白く広く抜いて布から切る
  const cx = 166;
  const cy = 152;
  const R = [64, 50, 61, 47, 66, 49, 58, 52, 63, 46, 60, 51];
  const head = new Path2D();
  for (let i = 0; i <= R.length; i++) {
    const a = (Math.PI * 2 * i) / R.length - Math.PI / 2;
    const r = R[i % R.length];
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i === 0) {
      head.moveTo(x, y);
      continue;
    }
    const ma = (Math.PI * 2 * (i - 0.5)) / R.length - Math.PI / 2;
    const mr = ((R[(i - 1) % R.length] + r) / 2) * 1.24;
    head.quadraticCurveTo(cx + Math.cos(ma) * mr, cy + Math.sin(ma) * mr, x, y);
  }
  head.closePath();
  g.strokeStyle = "#ffffff";
  g.lineWidth = 18;
  g.lineJoin = "round";
  g.stroke(head);
  const petal = g.createRadialGradient(cx - 20, cy - 22, 10, cx, cy, 76);
  petal.addColorStop(0, "#4e4e4e");
  petal.addColorStop(0.45, "#252525");
  petal.addColorStop(1, "#070707");
  g.fillStyle = petal;
  g.fill(head);

  // 弁の合わせ目｡塊の中を白く割る｡太く五本だけ
  g.save();
  g.clip(head);
  g.strokeStyle = "#ffffff";
  g.lineWidth = 15;
  g.lineCap = "butt";
  for (let i = 0; i < 5; i++) {
    const a = (Math.PI * 2 * i) / 5 + 0.55;
    g.beginPath();
    g.moveTo(cx + Math.cos(a) * 16, cy + Math.sin(a) * 16);
    g.lineTo(cx + Math.cos(a) * 78, cy + Math.sin(a) * 78);
    g.stroke();
  }
  g.restore();

  // 花芯｡白く空けて濃い丸をひとつ置く
  g.fillStyle = "#ffffff";
  g.beginPath();
  g.arc(cx, cy, 25, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#080808";
  g.beginPath();
  g.arc(cx, cy, 16, 0, Math.PI * 2);
  g.fill();
  g.restore();
};

export const PLATES_I: Record<string, Draw> = {
  "089": lectern,
  "090": seedSack,
  "091": montsuki,
  "092": kamado,
  "093": palanquin,
  "094": highChair,
  "095": cramp,
  "096": cutBranch,
  "097": column,
  "098": buttonhole,
};
