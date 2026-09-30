/**
 * 図版の版下（その六）｡
 *
 * plates.ts と同じ約束で描く｡網のことは考えず､灰色の絵として置く｡
 * 面はベタにせずグラデーションで濃淡をつける｡座標は 300 四方｡
 * 人の姿は描かない｡道具･器物･文字･建物の一部で指す｡
 * 処刑･体罰･労働の札も器物だけで指して､残酷な図にしない｡
 */

import type { Draw } from "./draw";

/** NO.059 土地は長男が丸ごと取る｡荘園図｡区画は一枚きりで､中に分割線が一本もない */
const estateMap: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 図面の地｡羊皮紙をごく薄く沈める｡紙のままにすると網が何も乗らない
  const paper = g.createLinearGradient(0, 0, 300, 300);
  paper.addColorStop(0, "#fcfcfc");
  paper.addColorStop(0.55, "#f2f2f2");
  paper.addColorStop(1, "#e2e2e2");
  g.fillStyle = paper;
  g.fillRect(0, 0, 300, 300);

  // 図枠｡外は太く内は細く｡二重に引くと測量図に見える
  g.strokeStyle = "#1f1f1f";
  g.lineWidth = 8;
  g.strokeRect(20, 20, 260, 260);
  g.lineWidth = 2.6;
  g.strokeRect(32, 32, 236, 236);

  // 区画｡湾の入った不整形の一枚｡ここに区切りを一本も入れないのが図の全部
  const pts: Array<[number, number]> = [
    [50, 108],
    [90, 62],
    [158, 54],
    [176, 92],
    [212, 66],
    [246, 108],
    [238, 158],
    [182, 200],
    [104, 208],
    [54, 166],
  ];
  const lot = new Path2D();
  pts.forEach(([x, y], i) => (i === 0 ? lot.moveTo(x, y) : lot.lineTo(x, y)));
  lot.closePath();

  // 地境の土手｡縁の外へ短い髭を打つ｡地図の約束ごと
  g.strokeStyle = "#141414";
  g.lineWidth = 4.6;
  g.lineCap = "butt";
  for (let i = 0; i < pts.length; i++) {
    const [ax, ay] = pts[i];
    const [bx, by] = pts[(i + 1) % pts.length];
    const len = Math.hypot(bx - ax, by - ay);
    const nx = (by - ay) / len;
    const ny = -(bx - ax) / len;
    const n = Math.max(1, Math.round(len / 34));
    for (let k = 0; k < n; k++) {
      const t = (k + 0.5) / n;
      const px = ax + (bx - ax) * t;
      const py = ay + (by - ay) * t;
      g.beginPath();
      g.moveTo(px, py);
      g.lineTo(px + nx * 13, py + ny * 13);
      g.stroke();
    }
  }

  // まわりを白く太く抜いて､髭と図枠から離す
  g.strokeStyle = "#ffffff";
  g.lineWidth = 11;
  g.stroke(lot);

  // 一枚の面｡平らに寝ている畑なので立体にしない｡長手に薄く振るだけ
  const field = g.createLinearGradient(50, 54, 246, 208);
  field.addColorStop(0, "#b8b8b8");
  field.addColorStop(0.45, "#8e8e8e");
  field.addColorStop(1, "#5a5a5a");
  g.fillStyle = field;
  g.fill(lot);

  // 地境｡区画の縁だけを締める
  g.strokeStyle = "#0b0b0b";
  g.lineWidth = 4.4;
  g.stroke(lot);

  // 方位｡北だけ長い八つの尖り｡下の余白に濃い塊をひとつ
  const nx0 = 230;
  const ny0 = 240;
  const star = g.createLinearGradient(nx0 - 28, ny0 - 28, nx0 + 28, ny0 + 28);
  star.addColorStop(0, "#a2a2a2");
  star.addColorStop(0.45, "#2e2e2e");
  star.addColorStop(1, "#070707");
  g.fillStyle = star;
  for (let i = 0; i < 4; i++) {
    const a = (Math.PI / 2) * i - Math.PI / 2;
    const len = i === 0 ? 34 : 24;
    g.beginPath();
    g.moveTo(nx0 + Math.cos(a) * len, ny0 + Math.sin(a) * len);
    g.lineTo(nx0 + Math.cos(a + 0.5) * 11, ny0 + Math.sin(a + 0.5) * 11);
    g.lineTo(nx0 + Math.cos(a - 0.5) * 11, ny0 + Math.sin(a - 0.5) * 11);
    g.closePath();
    g.fill();
    const d = a + Math.PI / 4;
    g.beginPath();
    g.moveTo(nx0 + Math.cos(d) * 15, ny0 + Math.sin(d) * 15);
    g.lineTo(nx0 + Math.cos(d + 0.8) * 7, ny0 + Math.sin(d + 0.8) * 7);
    g.lineTo(nx0 + Math.cos(d - 0.8) * 7, ny0 + Math.sin(d - 0.8) * 7);
    g.closePath();
    g.fill();
  }

  // 縮尺｡白黒交互の五目｡目盛りは区画の外にだけ置く
  g.fillStyle = "#121212";
  for (let i = 0; i < 5; i += 2) {
    g.fillRect(46 + i * 25, 232, 25, 16);
  }
  g.strokeStyle = "#121212";
  g.lineWidth = 3.2;
  g.strokeRect(46, 232, 125, 16);
  g.restore();
};

/** NO.060 同姓同本不婚｡同じ字を彫った位牌がふたつ｡大きさも形も寸分たがわない */
const tablets: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 堂の地｡ごく薄く沈める
  const air = g.createLinearGradient(0, 0, 0, 300);
  air.addColorStop(0, "#f0f0f0");
  air.addColorStop(0.55, "#f8f8f8");
  air.addColorStop(1, "#d8d8d8");
  g.fillStyle = air;
  g.fillRect(0, 0, 300, 300);

  /** 位牌ひとつ｡頭･身･台の三つだけで組む｡dark で置く光の向きを変える */
  const tablet = (cx: number, dark: number) => {
    // 影｡台の下に薄く
    g.fillStyle = "rgba(8,8,8,0.3)";
    g.beginPath();
    g.ellipse(cx + 4, 262, 54, 10, 0, 0, Math.PI * 2);
    g.fill();

    // 身と頭｡ひと続きの一枚｡雲形の頭が身より外へ張り出す
    const slab = new Path2D();
    slab.moveTo(cx - 30, 214);
    slab.lineTo(cx - 30, 78);
    slab.lineTo(cx - 38, 73);
    slab.lineTo(cx - 38, 62);
    slab.quadraticCurveTo(cx - 34, 42, cx, 40);
    slab.quadraticCurveTo(cx + 34, 42, cx + 38, 62);
    slab.lineTo(cx + 38, 73);
    slab.lineTo(cx + 30, 78);
    slab.lineTo(cx + 30, 214);
    slab.closePath();

    // まわりを白く太く抜いてから置く｡二枚のあいだも白で切れる
    g.strokeStyle = "#ffffff";
    g.lineWidth = 13;
    g.stroke(slab);
    const lacquer = g.createLinearGradient(cx - 38, 0, cx + 38, 0);
    lacquer.addColorStop(0, "#2a2a2a");
    lacquer.addColorStop(0.16, dark ? "#8e8e8e" : "#b2b2b2");
    lacquer.addColorStop(0.46, dark ? "#4a4a4a" : "#5e5e5e");
    lacquer.addColorStop(0.8, "#1e1e1e");
    lacquer.addColorStop(1, "#050505");
    g.fillStyle = lacquer;
    g.fill(slab);

    // 頭と身の境｡白い線を一本だけ通す
    g.strokeStyle = "rgba(252,252,252,0.7)";
    g.lineWidth = 5;
    g.beginPath();
    g.moveTo(cx - 34, 76);
    g.lineTo(cx + 34, 76);
    g.stroke();

    // 台｡二段｡身との境を白く切る
    g.strokeStyle = "#ffffff";
    g.lineWidth = 10;
    g.beginPath();
    g.moveTo(cx - 44, 218);
    g.lineTo(cx + 44, 218);
    g.stroke();
    const foot = g.createLinearGradient(cx - 48, 0, cx + 48, 0);
    foot.addColorStop(0, "#3a3a3a");
    foot.addColorStop(0.2, dark ? "#9a9a9a" : "#c2c2c2");
    foot.addColorStop(0.6, "#3e3e3e");
    foot.addColorStop(1, "#070707");
    g.fillStyle = foot;
    g.fillRect(cx - 36, 220, 72, 18);
    g.beginPath();
    g.moveTo(cx - 42, 240);
    g.lineTo(cx + 42, 240);
    g.lineTo(cx + 48, 260);
    g.lineTo(cx - 48, 260);
    g.closePath();
    g.fill();
    g.strokeStyle = "rgba(252,252,252,0.62)";
    g.lineWidth = 4;
    g.beginPath();
    g.moveTo(cx - 40, 239);
    g.lineTo(cx + 40, 239);
    g.stroke();

    // 彫った字｡細長い白地に太い塊を三つ｡二枚ともまったく同じ
    g.fillStyle = "#fafafa";
    g.fillRect(cx - 17, 94, 34, 104);
    g.fillStyle = "#101010";
    for (let i = 0; i < 3; i++) {
      g.fillRect(cx - 12, 100 + i * 33, 24, 25);
    }
  };

  tablet(94, 0);
  tablet(206, 1);
  g.restore();
};

/** NO.061 自殺は犯罪｡十字路に立つ四つ腕の道標｡柱は地に深く打たれている */
const fingerpost: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 空｡ごく薄く沈めて､網が画面いっぱいに走るようにする
  const sky = g.createLinearGradient(0, 0, 0, 214);
  sky.addColorStop(0, "#e8e8e8");
  sky.addColorStop(0.6, "#f8f8f8");
  sky.addColorStop(1, "#ececec");
  g.fillStyle = sky;
  g.fillRect(0, 0, 300, 214);

  // 地面と十字路｡奥から手前へ広がる二本の道が足もとで交わる
  g.save();
  g.beginPath();
  g.rect(0, 214, 300, 86);
  g.clip();
  const ground = g.createLinearGradient(0, 214, 0, 300);
  ground.addColorStop(0, "#8e8e8e");
  ground.addColorStop(0.5, "#5e5e5e");
  ground.addColorStop(1, "#3a3a3a");
  g.fillStyle = ground;
  g.fillRect(0, 214, 300, 86);

  g.fillStyle = "rgba(252,252,252,0.82)";
  g.beginPath();
  g.moveTo(110, 214);
  g.lineTo(146, 214);
  g.lineTo(300, 300);
  g.lineTo(198, 300);
  g.closePath();
  g.fill();
  g.beginPath();
  g.moveTo(154, 214);
  g.lineTo(190, 214);
  g.lineTo(102, 300);
  g.lineTo(0, 300);
  g.closePath();
  g.fill();
  g.restore();

  // 柱｡地に打ち込まれた一本｡左に光の筋を通す
  const shaft = g.createLinearGradient(132, 0, 168, 0);
  shaft.addColorStop(0, "#484848");
  shaft.addColorStop(0.2, "#f0f0f0");
  shaft.addColorStop(0.52, "#8a8a8a");
  shaft.addColorStop(0.84, "#232323");
  shaft.addColorStop(1, "#0a0a0a");
  g.fillStyle = shaft;
  g.fillRect(132, 84, 36, 172);

  // 頂の玉｡柱の上に載る丸み
  const knob = g.createRadialGradient(142, 66, 4, 150, 76, 24);
  knob.addColorStop(0, "#f6f6f6");
  knob.addColorStop(0.45, "#8a8a8a");
  knob.addColorStop(1, "#111111");
  g.fillStyle = knob;
  g.beginPath();
  g.ellipse(150, 74, 19, 17, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#2a2a2a";
  g.fillRect(142, 84, 16, 8);

  /** 腕｡先の尖った一枚板｡根元は柱に隠れる｡dir が -1 なら左へ出る */
  const arm = (y: number, h: number, tip: number, dir: number) => {
    const root = dir < 0 ? 140 : 160;
    const blade = new Path2D();
    blade.moveTo(root, y);
    blade.lineTo(tip - dir * 26, y);
    blade.lineTo(tip, y + h / 2);
    blade.lineTo(tip - dir * 26, y + h);
    blade.lineTo(root, y + h);
    blade.closePath();

    // 柱との境を白く抜いてから置く
    g.strokeStyle = "#ffffff";
    g.lineWidth = 10;
    g.stroke(blade);
    const board = g.createLinearGradient(root, y, tip, y + h);
    board.addColorStop(0, "#e6e6e6");
    board.addColorStop(0.3, "#aeaeae");
    board.addColorStop(0.7, "#4e4e4e");
    board.addColorStop(1, "#181818");
    g.fillStyle = board;
    g.fill(blade);

    // 板の字面｡読ませずに白い帯を一本だけ通す
    g.save();
    g.clip(blade);
    g.strokeStyle = "rgba(252,252,252,0.72)";
    g.lineWidth = 7;
    g.beginPath();
    g.moveTo(root - dir * 4, y + h * 0.52);
    g.lineTo(tip - dir * 16, y + h * 0.52);
    g.stroke();
    g.restore();

    // 下の小口｡厚みの分だけ暗く
    g.strokeStyle = "rgba(8,8,8,0.72)";
    g.lineWidth = 3.4;
    g.beginPath();
    g.moveTo(root, y + h);
    g.lineTo(tip - dir * 26, y + h);
    g.stroke();
  };

  // 四方を指す四枚｡上の二枚を長く､下の二枚を短くして遠近を出す
  arm(96, 30, 24, -1);
  arm(112, 30, 276, 1);
  arm(158, 28, 46, -1);
  arm(174, 28, 254, 1);

  // 足もと｡土の盛り上がりと影｡杭が地に入っているところ
  const mound = g.createLinearGradient(0, 240, 0, 268);
  mound.addColorStop(0, "#5c5c5c");
  mound.addColorStop(1, "#0d0d0d");
  g.fillStyle = mound;
  g.beginPath();
  g.ellipse(150, 254, 54, 16, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "rgba(8,8,8,0.46)";
  g.beginPath();
  g.ellipse(150, 262, 86, 13, 0, 0, Math.PI * 2);
  g.fill();
  g.restore();
};

/** NO.062 人は財産である｡競りの木槌と受け台｡人が競り落とされた */
const gavel: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 地｡ごく薄く沈める
  const air = g.createLinearGradient(0, 0, 0, 300);
  air.addColorStop(0, "#ededed");
  air.addColorStop(0.45, "#fafafa");
  air.addColorStop(1, "#e2e2e2");
  g.fillStyle = air;
  g.fillRect(0, 0, 300, 300);

  // 受け台｡木の円盤｡小口を下に出して厚みを見せる
  const rim = g.createLinearGradient(64, 0, 236, 0);
  rim.addColorStop(0, "#5e5e5e");
  rim.addColorStop(0.32, "#141414");
  rim.addColorStop(0.78, "#3a3a3a");
  rim.addColorStop(1, "#080808");
  g.fillStyle = rim;
  g.beginPath();
  g.ellipse(150, 262, 84, 21, 0, 0, Math.PI * 2);
  g.fill();
  g.fillRect(66, 246, 168, 16);

  const disc = g.createRadialGradient(108, 234, 10, 150, 248, 100);
  disc.addColorStop(0, "#fafafa");
  disc.addColorStop(0.24, "#c6c6c6");
  disc.addColorStop(0.6, "#606060");
  disc.addColorStop(1, "#1a1a1a");
  g.fillStyle = disc;
  g.beginPath();
  g.ellipse(150, 246, 84, 21, 0, 0, Math.PI * 2);
  g.fill();

  // 台の縁の照り返し｡手前だけ
  g.strokeStyle = "rgba(252,252,252,0.46)";
  g.lineWidth = 3.2;
  g.beginPath();
  g.ellipse(150, 246, 78, 17, 0, Math.PI * 0.84, Math.PI * 1.9);
  g.stroke();

  // 台に落ちる影｡槌より先に置く
  g.fillStyle = "rgba(8,8,8,0.42)";
  g.beginPath();
  g.ellipse(112, 240, 50, 13, -0.2, 0, Math.PI * 2);
  g.fill();

  // 槌｡頭を左上へ､柄を右下へ｡斜めに寝かせて画面を大きく横切る
  g.save();
  g.translate(150, 168);
  g.rotate(-0.44);

  // 柄｡先に握りの膨らみ
  const grip = g.createLinearGradient(0, -13, 0, 13);
  grip.addColorStop(0, "#e2e2e2");
  grip.addColorStop(0.32, "#9a9a9a");
  grip.addColorStop(0.72, "#2e2e2e");
  grip.addColorStop(1, "#0b0b0b");
  g.fillStyle = grip;
  g.beginPath();
  g.moveTo(-24, -12);
  g.lineTo(96, -14);
  g.quadraticCurveTo(120, -20, 120, 0);
  g.quadraticCurveTo(120, 20, 96, 14);
  g.lineTo(-24, 12);
  g.closePath();
  g.fill();

  // 柄と頭のあいだを白く抜く
  g.strokeStyle = "#ffffff";
  g.lineWidth = 8;
  g.beginPath();
  g.moveTo(-18, -34);
  g.lineTo(-18, 34);
  g.stroke();

  // 頭｡いちばん大きな塊｡横に寝た円柱
  const head = new Path2D();
  head.moveTo(-118, -33);
  head.lineTo(-20, -33);
  head.lineTo(-20, 33);
  head.lineTo(-118, 33);
  head.quadraticCurveTo(-130, 0, -118, -33);
  head.closePath();
  g.strokeStyle = "#ffffff";
  g.lineWidth = 11;
  g.stroke(head);
  const wood = g.createLinearGradient(0, -33, 0, 33);
  wood.addColorStop(0, "#efefef");
  wood.addColorStop(0.24, "#bcbcbc");
  wood.addColorStop(0.58, "#5e5e5e");
  wood.addColorStop(1, "#101010");
  g.fillStyle = wood;
  g.fill(head);

  // 打つ面｡先端の小口をひとつ明るく置く
  const face = g.createLinearGradient(-130, -20, -110, 24);
  face.addColorStop(0, "#f8f8f8");
  face.addColorStop(0.5, "#8e8e8e");
  face.addColorStop(1, "#1e1e1e");
  g.fillStyle = face;
  g.beginPath();
  g.ellipse(-119, 0, 11, 33, 0, 0, Math.PI * 2);
  g.fill();

  // 頭の帯｡稜を白く抜いて一枚のベタにしない
  g.save();
  g.clip(head);
  g.strokeStyle = "rgba(252,252,252,0.85)";
  g.lineWidth = 7;
  for (const x of [-96, -44]) {
    g.beginPath();
    g.moveTo(x, -36);
    g.lineTo(x, 36);
    g.stroke();
  }
  g.restore();
  g.restore();
  g.restore();
};

/** NO.063 処刑は見世物｡見物のために組んだ階段状の桟敷｡段の板･前の斜材･脚と土台だけ */
const grandstand: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 広場の地｡ごく薄く沈める
  const air = g.createLinearGradient(0, 0, 0, 300);
  air.addColorStop(0, "#e8e8e8");
  air.addColorStop(0.5, "#f8f8f8");
  air.addColorStop(1, "#dcdcdc");
  g.fillStyle = air;
  g.fillRect(0, 0, 300, 300);

  // 段の板｡奥へ上がるほど短くなる四枚｡あいだを白く大きく空ける
  const rows: Array<[number, number, number]> = [
    [46, 278, 202],
    [68, 266, 160],
    [90, 254, 118],
    [112, 242, 76],
  ];
  for (const [x0, x1, y] of rows) {
    const plank = new Path2D();
    plank.rect(x0, y, x1 - x0, 28);
    g.strokeStyle = "#ffffff";
    g.lineWidth = 11;
    g.stroke(plank);
    const board = g.createLinearGradient(x0, 0, x1, 0);
    board.addColorStop(0, "#6e6e6e");
    board.addColorStop(0.3, "#454545");
    board.addColorStop(0.72, "#1c1c1c");
    board.addColorStop(1, "#050505");
    g.fillStyle = board;
    g.fill(plank);
    // 座面の前端｡白くひと筋抜いて､段板を一枚のベタにしない
    g.strokeStyle = "rgba(252,252,252,0.65)";
    g.lineWidth = 5;
    g.beginPath();
    g.moveTo(x0 + 5, y + 7);
    g.lineTo(x1 - 5, y + 7);
    g.stroke();
  }

  // 脚｡段板を地から持ち上げる太い二本｡仮に組んだ桟敷のしるし
  const legG = g.createLinearGradient(0, 228, 0, 260);
  legG.addColorStop(0, "#9a9a9a");
  legG.addColorStop(0.45, "#2e2e2e");
  legG.addColorStop(1, "#0a0a0a");
  for (const lx of [170, 242]) {
    g.strokeStyle = "#ffffff";
    g.lineWidth = 10;
    g.strokeRect(lx, 228, 34, 32);
    g.fillStyle = legG;
    g.fillRect(lx, 228, 34, 32);
  }

  // 土台｡桟敷を載せる一本の梁｡下をここで締める
  const sillG = g.createLinearGradient(30, 0, 284, 0);
  sillG.addColorStop(0, "#9a9a9a");
  sillG.addColorStop(0.24, "#4e4e4e");
  sillG.addColorStop(0.7, "#1c1c1c");
  sillG.addColorStop(1, "#050505");
  g.strokeStyle = "#ffffff";
  g.lineWidth = 10;
  g.strokeRect(30, 258, 254, 22);
  g.fillStyle = sillG;
  g.fillRect(30, 258, 254, 22);

  // 前の斜材｡段の前端を一本で受ける｡いちばん濃い塊
  const ax = 46;
  const ay = 266;
  const bx = 132;
  const by = 62;
  const len = Math.hypot(bx - ax, by - ay);
  const px = ((by - ay) / len) * 14;
  const py = (-(bx - ax) / len) * 14;
  const beam = new Path2D();
  beam.moveTo(ax + px, ay + py);
  beam.lineTo(bx + px, by + py);
  beam.lineTo(bx - px, by - py);
  beam.lineTo(ax - px, ay - py);
  beam.closePath();
  g.strokeStyle = "#ffffff";
  g.lineWidth = 7;
  g.stroke(beam);
  const beamG = g.createLinearGradient(30, 270, 150, 58);
  beamG.addColorStop(0, "#060606");
  beamG.addColorStop(0.34, "#5e5e5e");
  beamG.addColorStop(0.72, "#242424");
  beamG.addColorStop(1, "#0b0b0b");
  g.fillStyle = beamG;
  g.fill(beam);
  g.restore();
};

/** NO.064 息子でなければ｡供物をのせる高坏｡蓋物がただひとつ据わる */
const ritualVessel: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 地｡ごく薄く沈める
  const air = g.createRadialGradient(150, 150, 30, 150, 160, 190);
  air.addColorStop(0, "#fafafa");
  air.addColorStop(0.7, "#eeeeee");
  air.addColorStop(1, "#d6d6d6");
  g.fillStyle = air;
  g.fillRect(0, 0, 300, 300);

  // 台｡いちばん下の円盤｡小口を下に出す
  const rim = g.createLinearGradient(94, 0, 206, 0);
  rim.addColorStop(0, "#6a6a6a");
  rim.addColorStop(0.3, "#161616");
  rim.addColorStop(0.76, "#3e3e3e");
  rim.addColorStop(1, "#070707");
  g.fillStyle = rim;
  g.beginPath();
  g.ellipse(150, 272, 56, 14, 0, 0, Math.PI * 2);
  g.fill();
  g.fillRect(94, 260, 112, 12);
  const base = g.createLinearGradient(94, 0, 206, 0);
  base.addColorStop(0, "#d2d2d2");
  base.addColorStop(0.24, "#9a9a9a");
  base.addColorStop(0.7, "#3a3a3a");
  base.addColorStop(1, "#0d0d0d");
  g.fillStyle = base;
  g.beginPath();
  g.ellipse(150, 260, 56, 14, 0, 0, Math.PI * 2);
  g.fill();

  // 高足｡下へ朝顔に開く筒｡真鍮なので左に白い柱を通す
  const stem = g.createLinearGradient(98, 0, 202, 0);
  stem.addColorStop(0, "#3c3c3c");
  stem.addColorStop(0.18, "#f2f2f2");
  stem.addColorStop(0.46, "#9a9a9a");
  stem.addColorStop(0.8, "#3e3e3e");
  stem.addColorStop(1, "#151515");
  g.fillStyle = stem;
  g.beginPath();
  g.moveTo(126, 188);
  g.lineTo(174, 188);
  g.quadraticCurveTo(184, 228, 202, 256);
  g.lineTo(98, 256);
  g.quadraticCurveTo(116, 228, 126, 188);
  g.closePath();
  g.fill();

  // 足の窓｡供物の台にあける抜き｡ふたつだけ大きく取る
  g.fillStyle = "rgba(10,10,10,0.78)";
  for (const [dx, w] of [
    [-25, 12],
    [23, 12],
  ] as const) {
    g.beginPath();
    g.moveTo(150 + dx - w / 2, 212);
    g.lineTo(150 + dx + w / 2, 212);
    g.lineTo(150 + dx * 1.34 + w / 2, 248);
    g.lineTo(150 + dx * 1.34 - w / 2, 248);
    g.closePath();
    g.fill();
  }

  // 足の輪｡中ほどを一本締めて､筒を上下に割る
  const collar = g.createLinearGradient(0, 196, 0, 210);
  collar.addColorStop(0, "#e6e6e6");
  collar.addColorStop(0.5, "#787878");
  collar.addColorStop(1, "#131313");
  g.fillStyle = collar;
  g.fillRect(120, 196, 60, 13);

  // 足と盤のあいだを白く抜く
  g.strokeStyle = "#ffffff";
  g.lineWidth = 7;
  g.beginPath();
  g.moveTo(118, 190);
  g.lineTo(182, 190);
  g.stroke();

  // 盤｡広くて浅い皿｡足へ大きく絞る
  const bowl = g.createLinearGradient(80, 0, 220, 0);
  bowl.addColorStop(0, "#f0f0f0");
  bowl.addColorStop(0.2, "#c4c4c4");
  bowl.addColorStop(0.54, "#6a6a6a");
  bowl.addColorStop(0.84, "#222222");
  bowl.addColorStop(1, "#060606");
  g.fillStyle = bowl;
  g.beginPath();
  g.moveTo(80, 148);
  g.lineTo(220, 148);
  g.quadraticCurveTo(206, 176, 174, 190);
  g.lineTo(126, 190);
  g.quadraticCurveTo(94, 176, 80, 148);
  g.closePath();
  g.fill();

  // 合わせ目｡蓋と盤のあいだを白く太く切る
  g.strokeStyle = "#ffffff";
  g.lineWidth = 9;
  g.beginPath();
  g.moveTo(70, 150);
  g.lineTo(230, 150);
  g.stroke();

  // 蓋の縁｡盤より外へ張り出す平たい鍔｡ここで器と分かる
  const brim = g.createLinearGradient(0, 132, 0, 150);
  brim.addColorStop(0, "#f4f4f4");
  brim.addColorStop(0.42, "#a6a6a6");
  brim.addColorStop(1, "#1c1c1c");
  g.fillStyle = brim;
  g.beginPath();
  g.moveTo(74, 144);
  g.lineTo(226, 144);
  g.quadraticCurveTo(220, 132, 202, 130);
  g.lineTo(98, 130);
  g.quadraticCurveTo(80, 132, 74, 144);
  g.closePath();
  g.fill();

  // 蓋｡低くて広い山｡背を高くすると駒に見える
  const cover = new Path2D();
  cover.moveTo(96, 132);
  cover.quadraticCurveTo(104, 96, 150, 92);
  cover.quadraticCurveTo(196, 96, 204, 132);
  cover.closePath();
  const dome = g.createLinearGradient(96, 0, 204, 0);
  dome.addColorStop(0, "#fafafa");
  dome.addColorStop(0.18, "#cccccc");
  dome.addColorStop(0.5, "#8a8a8a");
  dome.addColorStop(0.82, "#333333");
  dome.addColorStop(1, "#0a0a0a");
  g.fillStyle = dome;
  g.fill(cover);

  // 蓋の稜｡白く抜いた太い筋をひと筋だけ
  g.save();
  g.clip(cover);
  g.strokeStyle = "rgba(252,252,252,0.55)";
  g.lineWidth = 8;
  g.beginPath();
  g.moveTo(124, 134);
  g.quadraticCurveTo(128, 104, 150, 94);
  g.stroke();
  g.restore();

  // 摘み｡平たい輪｡玉にすると駒の頭に見える
  g.fillStyle = "#161616";
  g.fillRect(142, 80, 16, 14);
  const knobG = g.createLinearGradient(122, 0, 178, 0);
  knobG.addColorStop(0, "#f6f6f6");
  knobG.addColorStop(0.4, "#9a9a9a");
  knobG.addColorStop(1, "#0b0b0b");
  g.fillStyle = knobG;
  g.beginPath();
  g.ellipse(150, 78, 28, 9, 0, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "rgba(252,252,252,0.6)";
  g.lineWidth = 3.4;
  g.beginPath();
  g.ellipse(150, 76, 20, 5, 0, Math.PI, Math.PI * 2);
  g.stroke();
  g.restore();
};

/** NO.065 子どもは9歳から工場で働く｡軸から降りる革帯と滑車｡大きな輪と､右へ走る二本の帯 */
const pulley: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 工場の中｡ごく薄く沈める
  const air = g.createLinearGradient(0, 0, 0, 300);
  air.addColorStop(0, "#e8e8e8");
  air.addColorStop(0.5, "#f6f6f6");
  air.addColorStop(1, "#dcdcdc");
  g.fillStyle = air;
  g.fillRect(0, 0, 300, 300);

  const CX = 126;
  const CY = 150;
  const R = 92;

  // 滑車｡輻を持たない平らな一枚の輪｡舵輪と取り違えないよう抜きを入れない
  const wheel = new Path2D();
  wheel.arc(CX, CY, R, 0, Math.PI * 2);
  g.strokeStyle = "#ffffff";
  g.lineWidth = 13;
  g.stroke(wheel);
  const iron = g.createRadialGradient(CX - 36, CY - 40, 12, CX, CY, R + 16);
  iron.addColorStop(0, "#ededed");
  iron.addColorStop(0.2, "#bcbcbc");
  iron.addColorStop(0.54, "#6e6e6e");
  iron.addColorStop(0.84, "#2a2a2a");
  iron.addColorStop(1, "#080808");
  g.fillStyle = iron;
  g.fill(wheel);

  // 溝の縁｡帯の掛からない右側だけ､白い弧をひと筋
  g.strokeStyle = "rgba(252,252,252,0.72)";
  g.lineWidth = 6;
  g.beginPath();
  g.arc(CX, CY, R - 17, Math.PI * 1.56, Math.PI * 0.44);
  g.stroke();

  // 革帯｡滑車の左半分を回って､二本とも右の軸へ真横に走る
  const belt = new Path2D();
  belt.moveTo(312, CY - R);
  belt.lineTo(CX, CY - R);
  belt.arc(CX, CY, R, Math.PI * 1.5, Math.PI * 0.5, true);
  belt.lineTo(312, CY + R);

  // 帯のまわりを白く抜いて､滑車の面から切り離す
  g.strokeStyle = "#ffffff";
  g.lineWidth = 42;
  g.lineCap = "butt";
  g.lineJoin = "round";
  g.stroke(belt);
  const hide = g.createLinearGradient(0, CY - R - 20, 0, CY + R + 20);
  hide.addColorStop(0, "#0a0a0a");
  hide.addColorStop(0.24, "#5a5a5a");
  hide.addColorStop(0.5, "#242424");
  hide.addColorStop(0.78, "#3e3e3e");
  hide.addColorStop(1, "#060606");
  g.strokeStyle = hide;
  g.lineWidth = 30;
  g.stroke(belt);

  // 帯の縫い目｡真ん中に白を一本通して一枚のベタにしない
  g.strokeStyle = "rgba(252,252,252,0.4)";
  g.lineWidth = 5;
  g.stroke(belt);

  // 軸受｡真ん中の座は六角の締め金｡丸を重ねると目玉に見えるので角を立てる
  const nut = new Path2D();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    const x = CX + Math.cos(a) * 36;
    const y = CY + Math.sin(a) * 36;
    if (i === 0) nut.moveTo(x, y);
    else nut.lineTo(x, y);
  }
  nut.closePath();
  g.strokeStyle = "#ffffff";
  g.lineWidth = 9;
  g.stroke(nut);
  const boss = g.createLinearGradient(CX - 36, CY - 36, CX + 36, CY + 36);
  boss.addColorStop(0, "#dcdcdc");
  boss.addColorStop(0.36, "#8a8a8a");
  boss.addColorStop(1, "#0c0c0c");
  g.fillStyle = boss;
  g.fill(nut);
  g.strokeStyle = "rgba(252,252,252,0.5)";
  g.lineWidth = 4;
  g.stroke(nut);
  g.fillStyle = "#0a0a0a";
  g.beginPath();
  g.arc(CX, CY, 13, 0, Math.PI * 2);
  g.fill();
  g.restore();
};

/** NO.066 体罰はしつけ｡斜めに寝かせた竹の物差し｡平らな面に目盛りと口金 */
const bambooRule: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 机の地｡薄い地に太い木目を二本だけ｡物差しの下の面
  const desk = g.createLinearGradient(0, 0, 300, 300);
  desk.addColorStop(0, "#f2f2f2");
  desk.addColorStop(0.5, "#e6e6e6");
  desk.addColorStop(1, "#d0d0d0");
  g.fillStyle = desk;
  g.fillRect(0, 0, 300, 300);
  g.strokeStyle = "rgba(252,252,252,0.85)";
  g.lineWidth = 16;
  for (const y of [78, 222]) {
    g.beginPath();
    g.moveTo(-10, y);
    g.quadraticCurveTo(150, y - 18, 310, y + 6);
    g.stroke();
  }

  g.save();
  g.translate(150, 156);
  g.rotate(-0.68);

  const HALF = 143;
  const T = 15;

  // 影｡物差しの下にずらして敷く
  g.fillStyle = "rgba(8,8,8,0.3)";
  g.fillRect(-HALF + 8, -T + 13, HALF * 2, T * 2);

  // 竹の面｡割って平らにした面なので､長手にだけ光を振る
  const stick = new Path2D();
  stick.rect(-HALF, -T, HALF * 2, T * 2);
  g.strokeStyle = "#ffffff";
  g.lineWidth = 11;
  g.stroke(stick);
  const face = g.createLinearGradient(-HALF, 0, HALF, 0);
  face.addColorStop(0, "#5e5e5e");
  face.addColorStop(0.22, "#d8d8d8");
  face.addColorStop(0.5, "#f2f2f2");
  face.addColorStop(0.78, "#a2a2a2");
  face.addColorStop(1, "#3a3a3a");
  g.fillStyle = face;
  g.fill(stick);

  // 上下の小口｡平たい板の厚みを細い線で締める
  g.strokeStyle = "rgba(10,10,10,0.7)";
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(-HALF, T);
  g.lineTo(HALF, T);
  g.stroke();
  g.strokeStyle = "rgba(252,252,252,0.9)";
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(-HALF, -T);
  g.lineTo(HALF, -T);
  g.stroke();

  // 目盛りの基線｡刻みを一本につなぐ
  g.strokeStyle = "rgba(14,14,14,0.75)";
  g.lineWidth = 2.6;
  g.beginPath();
  g.moveTo(-124, T - 1);
  g.lineTo(136, T - 1);
  g.stroke();

  // 目盛り｡下の縁にだけ｡五つめを長くして物差しと読ませる
  g.fillStyle = "rgba(12,12,12,0.9)";
  const ticks = [-110, -88, -44, -22, 0, 22, 44, 88, 110, 132];
  ticks.forEach((tx) => {
    const long = tx === -110 || tx === 0 || tx === 110;
    const h = long ? 21 : 12;
    g.fillRect(tx - 2.6, T - h, 5.2, h);
  });

  // 節｡ひとつだけ｡幅いっぱいの帯と両脇の濃い線
  const node = g.createLinearGradient(0, -T, 0, T);
  node.addColorStop(0, "#e8e8e8");
  node.addColorStop(0.5, "#8e8e8e");
  node.addColorStop(1, "#1a1a1a");
  g.fillStyle = node;
  g.fillRect(62, -T, 10, T * 2);
  g.strokeStyle = "rgba(8,8,8,0.85)";
  g.lineWidth = 3;
  for (const dx of [61, 73]) {
    g.beginPath();
    g.moveTo(dx, -T);
    g.lineTo(dx, T);
    g.stroke();
  }

  // 罫の溝｡面の真ん中を細く一本通す
  g.strokeStyle = "rgba(10,10,10,0.35)";
  g.lineWidth = 2.4;
  g.beginPath();
  g.moveTo(-118, -3);
  g.lineTo(136, -3);
  g.stroke();

  // 口金｡左の端に嵌めた真鍮｡ここで木口を締める
  const ferrule = g.createLinearGradient(0, -T, 0, T);
  ferrule.addColorStop(0, "#d6d6d6");
  ferrule.addColorStop(0.42, "#5a5a5a");
  ferrule.addColorStop(1, "#070707");
  g.fillStyle = ferrule;
  g.fillRect(-HALF, -T, 20, T * 2);
  g.strokeStyle = "rgba(252,252,252,0.8)";
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(-HALF + 20, -T);
  g.lineTo(-HALF + 20, T);
  g.stroke();

  // 右の木口｡切った端を暗く締める
  g.fillStyle = "rgba(10,10,10,0.5)";
  g.fillRect(HALF - 4, -T, 4, T * 2);
  g.restore();
  g.restore();
};

/** NO.067 カストラート｡教会のオルガンの管｡太い三本だけで組む */
const organPipes: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 堂の中｡ごく薄く沈める
  const air = g.createLinearGradient(0, 0, 0, 300);
  air.addColorStop(0, "#e6e6e6");
  air.addColorStop(0.5, "#f6f6f6");
  air.addColorStop(1, "#e0e0e0");
  g.fillStyle = air;
  g.fillRect(0, 0, 300, 300);

  const CHEST = 236;

  // 風箱｡管を載せる一枚の板｡先に置いて､足をその上へ挿す
  const chest = g.createLinearGradient(0, CHEST, 0, 276);
  chest.addColorStop(0, "#9a9a9a");
  chest.addColorStop(0.3, "#4a4a4a");
  chest.addColorStop(0.72, "#151515");
  chest.addColorStop(1, "#3c3c3c");
  g.fillStyle = chest;
  g.fillRect(28, CHEST, 244, 40);

  /** 管ひとつ｡胴と唄口と足｡足は短く太く､鉛筆に見せない */
  const pipe = (cx: number, w: number, top: number) => {
    const h = w / 2;

    // 足｡風箱へ挿さる短い円錐｡胴より先に置く
    const leg = g.createLinearGradient(cx - h, 196, cx + h, CHEST);
    leg.addColorStop(0, "#dadada");
    leg.addColorStop(0.34, "#8e8e8e");
    leg.addColorStop(0.74, "#2c2c2c");
    leg.addColorStop(1, "#060606");
    g.fillStyle = leg;
    g.beginPath();
    g.moveTo(cx - h, 198);
    g.lineTo(cx + h, 198);
    g.lineTo(cx + 19, 222);
    g.lineTo(cx + 19, CHEST + 4);
    g.lineTo(cx - 19, CHEST + 4);
    g.lineTo(cx - 19, 222);
    g.closePath();
    g.fill();

    const body = new Path2D();
    body.moveTo(cx - h, top);
    body.lineTo(cx - h, 200);
    body.lineTo(cx + h, 200);
    body.lineTo(cx + h, top);
    body.closePath();

    // 隣の管と離すため､まわりを白く太く抜いてから置く
    g.strokeStyle = "#ffffff";
    g.lineWidth = 13;
    g.stroke(body);
    const metal = g.createLinearGradient(cx - h, 0, cx + h, 0);
    metal.addColorStop(0, "#232323");
    metal.addColorStop(0.16, "#f4f4f4");
    metal.addColorStop(0.42, "#a2a2a2");
    metal.addColorStop(0.74, "#343434");
    metal.addColorStop(1, "#080808");
    g.fillStyle = metal;
    g.fill(body);

    // 上端｡口が開いている｡縁を白く残して中を落とす
    g.fillStyle = "#fafafa";
    g.beginPath();
    g.ellipse(cx, top, h, h * 0.3, 0, 0, Math.PI * 2);
    g.fill();
    const hole = g.createLinearGradient(cx - h, top, cx + h, top);
    hole.addColorStop(0, "#4e4e4e");
    hole.addColorStop(0.55, "#111111");
    hole.addColorStop(1, "#3c3c3c");
    g.fillStyle = hole;
    g.beginPath();
    g.ellipse(cx, top + 1, h * 0.76, h * 0.2, 0, 0, Math.PI * 2);
    g.fill();

    // 唄口｡胴の裾に大きくひとつ｡ここが管を管と読ませる
    const mouth = new Path2D();
    mouth.moveTo(cx - h * 0.58, 178);
    mouth.quadraticCurveTo(cx, 150, cx + h * 0.58, 178);
    mouth.lineTo(cx + h * 0.58, 192);
    mouth.lineTo(cx - h * 0.58, 192);
    mouth.closePath();
    g.strokeStyle = "#ffffff";
    g.lineWidth = 9;
    g.stroke(mouth);
    g.fillStyle = "#0b0b0b";
    g.fill(mouth);
    // 唇｡唄口の下に白い一本
    g.fillStyle = "#f8f8f8";
    g.fillRect(cx - h * 0.72, 193, h * 1.44, 6);
  };

  // 左から短くなる三本｡太さも落としていく
  pipe(74, 62, 46);
  pipe(150, 52, 76);
  pipe(228, 44, 112);

  // 箱の面取り｡下の小口を白く一本
  g.strokeStyle = "rgba(252,252,252,0.42)";
  g.lineWidth = 3.4;
  g.beginPath();
  g.moveTo(32, CHEST + 14);
  g.lineTo(268, CHEST + 14);
  g.stroke();
  g.restore();
};

/** NO.068 数え年｡切り株を真上から｡年を数えるための輪が五本 */
const treeRings: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 地｡ごく薄く
  const air = g.createLinearGradient(0, 0, 300, 300);
  air.addColorStop(0, "#f6f6f6");
  air.addColorStop(0.55, "#ececec");
  air.addColorStop(1, "#d8d8d8");
  g.fillStyle = air;
  g.fillRect(0, 0, 300, 300);

  const CX = 150;
  const CY = 152;
  const N = 30;

  /** 真円にしないための小さな揺れ｡大きく振ると花に見える */
  const wob = (i: number, k: number) => Math.sin(i * 1.3 + k) * 5 + Math.sin(i * 2.7 + k * 2) * 2.4;

  /** 中心をずらした環｡芯が偏っているので年輪ごとに動かす */
  const ring = (base: number, k: number, ox: number, oy: number) => {
    const p = new Path2D();
    for (let i = 0; i <= N; i++) {
      const a = (Math.PI * 2 * i) / N;
      const r = base + wob(i, k) * (base / 120);
      const x = CX + ox + Math.cos(a) * r;
      const y = CY + oy + Math.sin(a) * r;
      if (i === 0) p.moveTo(x, y);
      else p.lineTo(x, y);
    }
    p.closePath();
    return p;
  };

  const bark = ring(120, 0, 0, 0);
  const wood = ring(105, 0.5, 0, 0);

  // 樹皮｡外の環｡いちばん濃い一本｡幅は広げすぎない
  const skin = g.createRadialGradient(CX - 44, CY - 46, 20, CX, CY, 130);
  skin.addColorStop(0, "#7e7e7e");
  skin.addColorStop(0.5, "#2a2a2a");
  skin.addColorStop(0.92, "#080808");
  skin.addColorStop(1, "#262626");
  g.fillStyle = skin;
  g.fill(bark);

  // 木口｡切った面｡年輪が乗るので中くらいの明るさに保つ
  g.strokeStyle = "#ffffff";
  g.lineWidth = 7;
  g.stroke(wood);
  const facewood = g.createRadialGradient(CX - 36, CY - 40, 14, CX, CY, 118);
  facewood.addColorStop(0, "#f4f4f4");
  facewood.addColorStop(0.4, "#d8d8d8");
  facewood.addColorStop(0.8, "#b0b0b0");
  facewood.addColorStop(1, "#8e8e8e");
  g.fillStyle = facewood;
  g.fill(wood);

  g.save();
  g.clip(wood);

  // 鋸の目｡面が紙のままにならないように斜めの光をひと通り
  const saw = g.createLinearGradient(CX - 110, CY - 110, CX + 110, CY + 110);
  saw.addColorStop(0, "rgba(252,252,252,0.5)");
  saw.addColorStop(0.5, "rgba(10,10,10,0.04)");
  saw.addColorStop(1, "rgba(8,8,8,0.3)");
  g.fillStyle = saw;
  g.fillRect(CX - 118, CY - 118, 236, 236);

  // 年輪｡細い環を五本｡間は木の地のまま残す｡太くすると的に見える
  const years: Array<[number, number, number, number]> = [
    [20, 1.4, 6, -8],
    [40, 2.2, 4, -6],
    [62, 3.0, 1, -3],
    [82, 3.8, -3, 1],
    [98, 4.6, -6, 4],
  ];
  for (const [base, k, ox, oy] of years) {
    const p = ring(base, k, ox, oy);
    g.strokeStyle = "rgba(252,252,252,0.85)";
    g.lineWidth = 10;
    g.stroke(p);
    g.strokeStyle = "#232323";
    g.lineWidth = 6.4;
    g.stroke(p);
  }

  // 芯｡いちばん内の点｡真ん中からずれている
  g.fillStyle = "#0c0c0c";
  g.beginPath();
  g.ellipse(CX + 7, CY - 10, 7, 5, 0.3, 0, Math.PI * 2);
  g.fill();

  // 干割れ｡芯から外へ広がる楔｡年輪を横切らせて切り株と読ませる
  const crack = g.createLinearGradient(CX - 90, CY - 70, CX + 90, CY + 70);
  crack.addColorStop(0, "#0a0a0a");
  crack.addColorStop(0.5, "#303030");
  crack.addColorStop(1, "#0a0a0a");
  g.fillStyle = crack;
  g.beginPath();
  g.moveTo(CX + 10, CY - 6);
  g.lineTo(CX + 100, CY + 28);
  g.lineTo(CX + 88, CY + 58);
  g.lineTo(CX + 7, CY + 2);
  g.closePath();
  g.fill();
  // もう一本は芯まで届かない｡外側だけの短い割れ
  g.beginPath();
  g.moveTo(CX - 46, CY + 50);
  g.lineTo(CX - 92, CY + 58);
  g.lineTo(CX - 88, CY + 74);
  g.lineTo(CX - 42, CY + 62);
  g.closePath();
  g.fill();
  g.restore();

  // 樹皮の割れ｡外の環に縦の切れ目を四本｡皮を一枚のベタにしない
  g.save();
  g.clip(bark);
  g.strokeStyle = "rgba(252,252,252,0.34)";
  g.lineWidth = 6;
  for (let i = 0; i < 4; i++) {
    const a = (Math.PI / 2) * i + 0.55;
    g.beginPath();
    g.moveTo(CX + Math.cos(a) * 98, CY + Math.sin(a) * 98);
    g.lineTo(CX + Math.cos(a) * 130, CY + Math.sin(a) * 130);
    g.stroke();
  }
  g.restore();
  g.restore();
};

export const PLATES_F: Record<string, Draw> = {
  "059": estateMap,
  "060": tablets,
  "061": fingerpost,
  "062": gavel,
  "063": grandstand,
  "064": ritualVessel,
  "065": pulley,
  "066": bambooRule,
  "067": organPipes,
  "068": treeRings,
};
