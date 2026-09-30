/**
 * 図版の版下（第2次追加分・その二）｡
 *
 * plates.ts と同じ約束で描く｡網にかけるのは後の工程なので､
 * ここでは面を平らな黒で置かず､明るいところから暗いところへ必ず振る｡
 * 座標は 300 四方で書いて､s で伸ばす｡枠いっぱいに大きく取る｡
 *
 * 109〜113 は日本の戦前戦中が続くので､石・鉄・真鍮・革・アルミと
 * 物の材を変えて､同じ絵が並ばないようにした｡人の姿は描かない｡
 */

import type { Draw } from "./draw";

/** 角の丸い四角｡経路だけ作って､塗りは呼ぶ側に任せる */
function roundRect(x: number, y: number, w: number, h: number, r: number) {
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
}

/**
 * 不良な子孫は防止する｡壁に嵌めた石の銘板｡
 * 手術台や患者は描かない｡法が石に彫られて据わっている冷たさだけを出す｡
 * 四行のうち一行だけを削り直して彫り替えてあり､その区画を白で切って見せる
 * （名を母体保護法に改めただけで､公布日は 1948 年のまま残っている）｡
 */
const tablet: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 壁｡銘板のまわりをごく薄く沈めて､板だけが立つようにする
  const wall = g.createLinearGradient(0, 0, 0, 300);
  wall.addColorStop(0, "#f4f4f4");
  wall.addColorStop(0.5, "#fbfbfb");
  wall.addColorStop(1, "#eeeeee");
  g.fillStyle = wall;
  g.fillRect(0, 0, 300, 300);

  const L = 26;
  const R = 274;
  const T = 62;
  const B = 238;

  // 板の影｡右下へずらして壁からの厚みを出す
  g.fillStyle = "rgba(12,12,12,0.5)";
  g.fillRect(L + 12, T + 14, R - L, B - T);

  // 縁の面取り｡左上を白く起こして右下へ落とす
  const bevel = g.createLinearGradient(L, T, R, B);
  bevel.addColorStop(0, "#fcfcfc");
  bevel.addColorStop(0.46, "#8a8a8a");
  bevel.addColorStop(1, "#1c1c1c");
  g.fillStyle = bevel;
  g.fillRect(L, T, R - L, B - T);

  // 石の面｡上から下へ振る
  const face = g.createLinearGradient(0, T + 16, 0, B - 16);
  face.addColorStop(0, "#dcdcdc");
  face.addColorStop(0.44, "#ababab");
  face.addColorStop(1, "#6c6c6c");
  g.fillStyle = face;
  g.fillRect(L + 16, T + 16, R - L - 32, B - T - 32);

  // 彫った行｡溝の下に光を入れて陰刻にする｡四行だけ､太く
  const groove = (x: number, y: number, w: number) => {
    g.fillStyle = "rgba(252,252,252,0.72)";
    g.fillRect(x, y + 14, w, 5);
    g.fillStyle = "rgba(14,14,14,0.86)";
    g.fillRect(x, y, w, 14);
  };
  groove(70, 96, 170);
  groove(70, 130, 132);
  groove(70, 164, 170);
  groove(70, 196, 96);

  // 削り直した一区画｡地肌だけ明るく残し､白い枠で切って彫り替えを見せる
  g.fillStyle = "#f6f6f6";
  g.fillRect(62, 122, 188, 32);
  g.strokeStyle = "rgba(16,16,16,0.5)";
  g.lineWidth = 3;
  g.strokeRect(62, 122, 188, 32);
  g.fillStyle = "rgba(16,16,16,0.72)";
  g.fillRect(76, 132, 118, 12);

  // 留めの鋲｡四隅にひとつずつ
  for (const [bx, by] of [
    [52, 88],
    [248, 88],
    [52, 212],
    [248, 212],
  ] as const) {
    const rg = g.createRadialGradient(bx - 3, by - 3, 1, bx, by, 10);
    rg.addColorStop(0, "#eeeeee");
    rg.addColorStop(0.5, "#6a6a6a");
    rg.addColorStop(1, "#0b0b0b");
    g.fillStyle = rg;
    g.beginPath();
    g.arc(bx, by, 8, 0, Math.PI * 2);
    g.fill();
  }
  g.restore();
};

/**
 * 病者は療養所に入れる｡外から錠をかけた門扉｡
 * 中にいた人は描かない｡閉じている器物だけで指す｡
 * 合わせ目を白で切り､錠は白い輪郭で囲んで扉から離した｡
 */
const gate: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 冠木｡門の上を横に渡す
  const lintel = g.createLinearGradient(0, 26, 0, 62);
  lintel.addColorStop(0, "#d2d2d2");
  lintel.addColorStop(0.42, "#4a4a4a");
  lintel.addColorStop(1, "#262626");
  g.fillStyle = lintel;
  g.fillRect(8, 26, 284, 36);

  // 柱｡左右の太い塊｡外を明るく､内を黒く落とす
  for (const px of [16, 244]) {
    const outer = px === 16 ? px : px + 40;
    const inner = px === 16 ? px + 40 : px;
    const col = g.createLinearGradient(outer, 0, inner, 0);
    col.addColorStop(0, "#f0f0f0");
    col.addColorStop(0.34, "#b0b0b0");
    col.addColorStop(1, "#1f1f1f");
    g.fillStyle = col;
    g.fillRect(px, 58, 40, 230);
  }

  // 扉｡二枚｡合わせ目は紙のまま残して白で切る
  const leaf = (x0: number, x1: number, light: string, dark: string) => {
    const lg = g.createLinearGradient(x0, 66, x1, 282);
    lg.addColorStop(0, light);
    lg.addColorStop(0.55, "#8e8e8e");
    lg.addColorStop(1, dark);
    g.fillStyle = lg;
    g.fillRect(x0, 66, x1 - x0, 216);
  };
  leaf(60, 147, "#f2f2f2", "#4a4a4a");
  leaf(153, 240, "#d2d2d2", "#3a3a3a");

  // 羽目板の合わせ目｡白い縦線で面を割る
  g.strokeStyle = "rgba(252,252,252,0.9)";
  g.lineWidth = 4;
  for (const x of [89, 118, 182, 211]) {
    g.beginPath();
    g.moveTo(x, 70);
    g.lineTo(x, 278);
    g.stroke();
  }

  // 横桟｡上下に二本
  const rail = (y: number, h: number) => {
    const rg = g.createLinearGradient(0, y, 0, y + h);
    rg.addColorStop(0, "#dcdcdc");
    rg.addColorStop(0.4, "#575757");
    rg.addColorStop(1, "#1d1d1d");
    g.fillStyle = rg;
    g.fillRect(60, y, 87, h);
    g.fillRect(153, y, 87, h);
  };
  rail(84, 20);
  rail(250, 20);

  // 閂｡二枚をまたいで横に渡す
  const bolt = g.createLinearGradient(0, 150, 0, 178);
  bolt.addColorStop(0, "#f6f6f6");
  bolt.addColorStop(0.4, "#5e5e5e");
  bolt.addColorStop(1, "#0b0b0b");
  g.fillStyle = bolt;
  g.fillRect(96, 150, 108, 28);

  // 錠の弦｡閂の上をくぐらせる
  g.strokeStyle = "#141414";
  g.lineWidth = 13;
  g.lineCap = "round";
  g.beginPath();
  g.arc(150, 188, 25, Math.PI, 0);
  g.stroke();

  // 錠の胴｡扉より深く沈めて､白い輪郭で切り離す
  const lockP = roundRect(112, 186, 76, 70, 15);
  const lg2 = g.createRadialGradient(132, 202, 8, 150, 222, 88);
  lg2.addColorStop(0, "#f2f2f2");
  lg2.addColorStop(0.34, "#a0a0a0");
  lg2.addColorStop(0.72, "#2e2e2e");
  lg2.addColorStop(1, "#060606");
  g.fillStyle = lg2;
  g.fill(lockP);
  g.strokeStyle = "rgba(252,252,252,0.9)";
  g.lineWidth = 5;
  g.stroke(lockP);

  // 鍵穴
  g.fillStyle = "#090909";
  g.beginPath();
  g.arc(150, 212, 11, 0, Math.PI * 2);
  g.fill();
  g.beginPath();
  g.moveTo(143, 216);
  g.lineTo(157, 216);
  g.lineTo(153, 240);
  g.lineTo(147, 240);
  g.closePath();
  g.fill();

  // 敷居
  const sill = g.createLinearGradient(0, 282, 0, 296);
  sill.addColorStop(0, "#909090");
  sill.addColorStop(1, "#202020");
  g.fillStyle = sill;
  g.fillRect(8, 282, 284, 14);
  g.restore();
};

/**
 * 生きて虜囚の辱を受けず｡信号喇叭｡
 * 法ではなく訓令＝口で吹き回された命令なので､鳴り物ひとつで指す｡
 * 朝顔をひと息に開き､口の内側は暗く落として､縁を白で一周切った｡
 */
const bugle: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 管｡左下の吹き口から右上の喉へ､太い一本で通す｡濃淡は管を横切る向きに
  const pipe = g.createLinearGradient(91, 181, 107, 201);
  pipe.addColorStop(0, "#f2f2f2");
  pipe.addColorStop(0.32, "#a4a4a4");
  pipe.addColorStop(0.72, "#2c2c2c");
  pipe.addColorStop(1, "#0b0b0b");
  g.strokeStyle = pipe;
  g.lineWidth = 26;
  g.lineCap = "butt";
  g.beginPath();
  g.moveTo(44, 236);
  g.lineTo(156, 144);
  g.stroke();

  // 継ぎ輪｡白い帯で管を二か所で切る
  for (const t of [0.34, 0.64]) {
    const cx = 44 + (156 - 44) * t;
    const cy = 236 + (144 - 236) * t;
    g.save();
    g.translate(cx, cy);
    g.rotate(-0.687);
    g.fillStyle = "rgba(252,252,252,0.88)";
    g.fillRect(-5, -14, 9, 28);
    g.fillStyle = "rgba(14,14,14,0.55)";
    g.fillRect(4, -14, 5, 28);
    g.restore();
  }

  // 吹き口｡管の末を椀に広げる
  const cup = g.createLinearGradient(20, 252, 56, 228);
  cup.addColorStop(0, "#efefef");
  cup.addColorStop(0.5, "#5a5a5a");
  cup.addColorStop(1, "#0a0a0a");
  g.fillStyle = cup;
  g.beginPath();
  g.ellipse(38, 242, 25, 12, 0.887, 0, Math.PI * 2);
  g.fill();

  // 朝顔｡喉から口へ一枚で開く
  const bellP = new Path2D();
  bellP.moveTo(142, 137);
  bellP.quadraticCurveTo(159, 57, 208, 17);
  bellP.quadraticCurveTo(264, 54, 288, 117);
  bellP.quadraticCurveTo(239, 157, 158, 157);
  bellP.closePath();
  const bg = g.createLinearGradient(168, 36, 254, 152);
  bg.addColorStop(0, "#fbfbfb");
  bg.addColorStop(0.34, "#bebebe");
  bg.addColorStop(0.72, "#3a3a3a");
  bg.addColorStop(1, "#090909");
  g.fillStyle = bg;
  g.fill(bellP);

  // 口の内側｡奥を暗く落として穴にする
  const bore = g.createRadialGradient(236, 60, 6, 248, 67, 58);
  bore.addColorStop(0, "#5e5e5e");
  bore.addColorStop(0.55, "#1a1a1a");
  bore.addColorStop(1, "#040404");
  g.fillStyle = bore;
  g.beginPath();
  g.ellipse(248, 67, 52, 13, 0.887, 0, Math.PI * 2);
  g.fill();

  // 口縁｡白で一周切って朝顔を立てる
  g.strokeStyle = "rgba(252,252,252,0.92)";
  g.lineWidth = 5;
  g.beginPath();
  g.ellipse(248, 67, 58, 17, 0.887, 0, Math.PI * 2);
  g.stroke();
  g.restore();
};

/**
 * 血税を納める｡編上の軍靴をひとつ｡
 * 人は描かず､身体のかたちだけが残った器物として置く｡
 * 底と甲のあいだを白で切り､紐は白い×を三つだけ｡
 */
const boot: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 影
  g.fillStyle = "rgba(12,12,12,0.3)";
  g.beginPath();
  g.ellipse(146, 282, 124, 14, 0, 0, Math.PI * 2);
  g.fill();

  // 底｡一枚で通して踵だけ高くする
  const sole = g.createLinearGradient(0, 234, 0, 266);
  sole.addColorStop(0, "#a2a2a2");
  sole.addColorStop(0.4, "#2a2a2a");
  sole.addColorStop(1, "#0c0c0c");
  g.fillStyle = sole;
  const soleP = new Path2D();
  soleP.moveTo(34, 232);
  soleP.quadraticCurveTo(20, 242, 30, 260);
  soleP.lineTo(258, 260);
  soleP.lineTo(258, 232);
  soleP.closePath();
  g.fill(soleP);
  g.fillStyle = "#141414";
  g.fillRect(204, 258, 54, 20);

  // 甲と筒｡ひとつの塊として起こす
  const upperP = new Path2D();
  upperP.moveTo(36, 230);
  upperP.quadraticCurveTo(28, 204, 62, 190);
  upperP.quadraticCurveTo(104, 174, 130, 150);
  upperP.lineTo(142, 84);
  upperP.quadraticCurveTo(146, 68, 168, 64);
  upperP.lineTo(230, 60);
  upperP.quadraticCurveTo(250, 66, 250, 92);
  upperP.lineTo(254, 230);
  upperP.closePath();
  const up = g.createRadialGradient(96, 166, 12, 150, 180, 226);
  up.addColorStop(0, "#f6f6f6");
  up.addColorStop(0.28, "#c2c2c2");
  up.addColorStop(0.62, "#4a4a4a");
  up.addColorStop(1, "#0a0a0a");
  g.fillStyle = up;
  g.fill(upperP);

  // 底と甲の切れ目｡白で一本入れて離す
  g.strokeStyle = "rgba(252,252,252,0.85)";
  g.lineWidth = 5;
  g.beginPath();
  g.moveTo(40, 230);
  g.lineTo(252, 230);
  g.stroke();

  // 履き口｡内を暗く沈めて前縁だけ白く起こす
  const mouth = g.createLinearGradient(0, 52, 0, 88);
  mouth.addColorStop(0, "#090909");
  mouth.addColorStop(1, "#525252");
  g.fillStyle = mouth;
  g.beginPath();
  g.ellipse(190, 68, 48, 15, -0.12, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "rgba(252,252,252,0.9)";
  g.lineWidth = 5;
  g.beginPath();
  g.ellipse(190, 68, 48, 15, -0.12, Math.PI * 0.98, Math.PI * 1.98);
  g.stroke();

  // 甲の縫い目
  g.strokeStyle = "rgba(252,252,252,0.62)";
  g.lineWidth = 4;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(58, 196);
  g.quadraticCurveTo(98, 182, 128, 154);
  g.stroke();

  // 紐｡白い×を三つだけ｡数を増やすと網で潰れる
  g.strokeStyle = "rgba(252,252,252,0.94)";
  g.lineWidth = 6;
  for (let i = 0; i < 3; i++) {
    const y = 102 + i * 32;
    g.beginPath();
    g.moveTo(142, y);
    g.lineTo(184, y + 24);
    g.moveTo(184, y);
    g.lineTo(142, y + 24);
    g.stroke();
  }
  g.restore();
};

/**
 * 欲しがりません勝つまでは｡蓋を外した弁当箱｡飯の真ん中に梅がひとつ｡
 * 点刻の網で散らないよう､上面・飯・前面の三つの大きな面だけで組み､
 * 面の境は紙のまま残して太く切る｡細い線と留め金は置かない｡
 */
const bento: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 上面｡箱の口をひとつの台形の塊として置く
  const topP = new Path2D();
  topP.moveTo(52, 74);
  topP.lineTo(248, 74);
  topP.lineTo(276, 206);
  topP.lineTo(24, 206);
  topP.closePath();
  const topG = g.createLinearGradient(0, 74, 0, 206);
  topG.addColorStop(0, "#9a9a9a");
  topG.addColorStop(0.5, "#7c7c7c");
  topG.addColorStop(1, "#5a5a5a");
  g.fillStyle = topG;
  g.fill(topP);

  // 飯｡枠の内を白い面として大きく抜く｡奥だけわずかに沈める
  const riceP = new Path2D();
  riceP.moveTo(78, 96);
  riceP.lineTo(222, 96);
  riceP.lineTo(250, 184);
  riceP.lineTo(50, 184);
  riceP.closePath();
  const riceG = g.createLinearGradient(0, 96, 0, 184);
  riceG.addColorStop(0, "#dedede");
  riceG.addColorStop(0.28, "#f6f6f6");
  riceG.addColorStop(1, "#fdfdfd");
  g.fillStyle = riceG;
  g.fill(riceP);

  // 梅｡白い飯の中の濃い丸ひとつ｡小さいと点刻で散るので大きく取る
  const ume = g.createRadialGradient(134, 124, 6, 150, 140, 48);
  ume.addColorStop(0, "#3e3e3e");
  ume.addColorStop(0.5, "#151515");
  ume.addColorStop(1, "#030303");
  g.fillStyle = ume;
  g.beginPath();
  g.arc(150, 140, 39, 0, Math.PI * 2);
  g.fill();

  // 前面｡いちばん濃い面｡上面とのあいだは紙のまま残して太く切る
  const frontP = new Path2D();
  frontP.moveTo(24, 214);
  frontP.lineTo(276, 214);
  frontP.lineTo(262, 272);
  frontP.lineTo(38, 272);
  frontP.closePath();
  const frontG = g.createLinearGradient(0, 214, 0, 272);
  frontG.addColorStop(0, "#5e5e5e");
  frontG.addColorStop(0.45, "#2c2c2c");
  frontG.addColorStop(1, "#101010");
  g.fillStyle = frontG;
  g.fill(frontP);
  g.restore();
};

/**
 * ダウリー（持参金）｡婚礼に持たせる金の首飾りをひとつ｡
 * 花嫁も櫃も描かない｡渡される物そのものを枠いっぱいに置く｡
 * 環の断面は中心からの放射で作り､内と外を沈めて中ほどを起こした｡
 * 腕輪ではなく首飾り（開いた襟＋雫形の垂れ）にして､輪の図版と見分くようにしてある｡
 */
const necklace: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  const cx = 150;
  const cy = 100;
  const rx = 100;
  const ry = 76;
  const w = 28;
  const a0 = Math.PI * 0.1;
  const a1 = Math.PI * 0.9;

  // 影
  g.fillStyle = "rgba(12,12,12,0.24)";
  g.beginPath();
  g.ellipse(158, 292, 88, 12, 0, 0, Math.PI * 2);
  g.fill();

  // 襟の断面｡中心からの放射で内と外を沈め､中ほどを白く起こす
  const band = g.createRadialGradient(cx, cy, ry - w * 0.62, cx, cy, ry + w * 0.62);
  band.addColorStop(0, "#0b0b0b");
  band.addColorStop(0.22, "#666666");
  band.addColorStop(0.46, "#fbfbfb");
  band.addColorStop(0.72, "#8a8a8a");
  band.addColorStop(1, "#0a0a0a");
  g.strokeStyle = band;
  g.lineWidth = w;
  g.lineCap = "round";
  g.beginPath();
  g.ellipse(cx, cy, rx, ry, 0, a0, a1);
  g.stroke();

  // 左から回る光と､右下の落ち
  g.strokeStyle = "rgba(252,252,252,0.4)";
  g.lineWidth = 9;
  g.beginPath();
  g.ellipse(cx, cy, rx - 4, ry - 4, 0, Math.PI * 0.58, Math.PI * 0.88);
  g.stroke();
  g.strokeStyle = "rgba(10,10,10,0.4)";
  g.lineWidth = 11;
  g.beginPath();
  g.ellipse(cx, cy, rx + 3, ry + 3, 0, Math.PI * 0.12, Math.PI * 0.4);
  g.stroke();

  // 内と外の縁｡白と黒で一本ずつ入れて輪郭を立てる
  g.strokeStyle = "rgba(252,252,252,0.78)";
  g.lineWidth = 3.5;
  g.beginPath();
  g.ellipse(cx, cy, rx - w / 2 + 2, ry - w / 2 + 2, 0, a0, a1);
  g.stroke();
  g.strokeStyle = "rgba(10,10,10,0.88)";
  g.lineWidth = 3;
  g.beginPath();
  g.ellipse(cx, cy, rx + w / 2 - 2, ry + w / 2 - 2, 0, a0, a1);
  g.stroke();

  // 襟の両端の玉｡ここで首飾りだとわかる
  for (const a of [a0, a1]) {
    const px = cx + rx * Math.cos(a);
    const py = cy + ry * Math.sin(a);
    const kg = g.createRadialGradient(px - 6, py - 7, 2, px, py, 24);
    kg.addColorStop(0, "#fdfdfd");
    kg.addColorStop(0.34, "#c4c4c4");
    kg.addColorStop(0.74, "#3e3e3e");
    kg.addColorStop(1, "#070707");
    g.fillStyle = kg;
    g.beginPath();
    g.arc(px, py, 19, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = "rgba(252,252,252,0.85)";
    g.lineWidth = 4;
    g.beginPath();
    g.arc(px, py, 19, 0, Math.PI * 2);
    g.stroke();
  }

  // 吊り環｡襟の底と垂れのあいだを白で切る
  g.strokeStyle = "rgba(252,252,252,0.95)";
  g.lineWidth = 10;
  g.beginPath();
  g.arc(150, 190, 14, 0, Math.PI * 2);
  g.stroke();
  g.strokeStyle = "#151515";
  g.lineWidth = 9;
  g.beginPath();
  g.arc(150, 190, 14, 0, Math.PI * 2);
  g.stroke();

  // 垂れ｡雫の形にして丸い章と見分ける
  const drop = new Path2D();
  drop.moveTo(150, 198);
  drop.bezierCurveTo(178, 228, 194, 236, 194, 252);
  drop.bezierCurveTo(194, 276, 174, 292, 150, 292);
  drop.bezierCurveTo(126, 292, 106, 276, 106, 252);
  drop.bezierCurveTo(106, 236, 122, 228, 150, 198);
  drop.closePath();
  g.strokeStyle = "rgba(252,252,252,0.92)";
  g.lineWidth = 7;
  g.stroke(drop);
  const dg = g.createRadialGradient(126, 226, 6, 152, 254, 84);
  dg.addColorStop(0, "#fdfdfd");
  dg.addColorStop(0.3, "#c8c8c8");
  dg.addColorStop(0.68, "#464646");
  dg.addColorStop(1, "#060606");
  g.fillStyle = dg;
  g.fill(drop);

  // 垂れの彫り｡一本だけ
  g.strokeStyle = "rgba(252,252,252,0.62)";
  g.lineWidth = 5;
  g.beginPath();
  g.moveTo(124, 242);
  g.quadraticCurveTo(116, 266, 134, 280);
  g.stroke();
  g.restore();
};

/**
 * ヘジャーブを禁じる／義務づける｡布そのもの一枚｡
 * 着る・脱ぐは描かない｡命令の向きが二度変わった､その布だけを大きく置く｡
 * 右の角だけ裏へ折り返し､折り目を白で切って裏表を分けた｡
 */
const veilCloth: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 布の外形｡四隅のうち右上は折り返すので落としてある
  const p = new Path2D();
  p.moveTo(82, 26);
  p.quadraticCurveTo(140, 30, 190, 48);
  p.lineTo(248, 180);
  p.quadraticCurveTo(238, 230, 218, 274);
  p.quadraticCurveTo(112, 246, 26, 218);
  p.quadraticCurveTo(38, 108, 82, 26);
  p.closePath();

  const cloth = g.createLinearGradient(56, 36, 252, 262);
  cloth.addColorStop(0, "#fbfbfb");
  cloth.addColorStop(0.28, "#cbcbcb");
  cloth.addColorStop(0.62, "#6e6e6e");
  cloth.addColorStop(1, "#0f0f0f");
  g.fillStyle = cloth;
  g.fill(p);

  // 折り目｡明るい筋と暗い筋を交互に､角から角へ通す
  g.save();
  g.clip(p);
  g.lineCap = "round";
  const creases = [
    [70, 58, 150, 150, 200, 268, "rgba(252,252,252,0.7)", 10],
    [118, 30, 178, 146, 216, 252, "rgba(14,14,14,0.4)", 13],
    [38, 118, 118, 182, 194, 276, "rgba(252,252,252,0.5)", 8],
    [182, 48, 232, 132, 230, 232, "rgba(14,14,14,0.34)", 15],
  ] as const;
  for (const [x0, y0, cx, cy, x1, y1, col, w] of creases) {
    g.strokeStyle = col;
    g.lineWidth = w;
    g.beginPath();
    g.moveTo(x0, y0);
    g.quadraticCurveTo(cx, cy, x1, y1);
    g.stroke();
  }
  g.restore();

  // 縁のかがり｡内側に白い一本を回して布端を立てる
  g.save();
  g.clip(p);
  g.strokeStyle = "rgba(252,252,252,0.72)";
  g.lineWidth = 5;
  g.stroke(p);
  g.restore();
  g.strokeStyle = "rgba(14,14,14,0.72)";
  g.lineWidth = 4.5;
  g.stroke(p);

  // 折り返した角｡裏は平らに明るく､折り目は白で切る
  const fold = new Path2D();
  fold.moveTo(190, 48);
  fold.quadraticCurveTo(168, 84, 158, 133);
  fold.quadraticCurveTo(212, 160, 248, 180);
  fold.closePath();
  const back = g.createLinearGradient(160, 60, 246, 176);
  back.addColorStop(0, "#f4f4f4");
  back.addColorStop(0.5, "#bebebe");
  back.addColorStop(1, "#7c7c7c");
  g.fillStyle = back;
  g.fill(fold);
  g.strokeStyle = "rgba(252,252,252,0.95)";
  g.lineWidth = 6;
  g.beginPath();
  g.moveTo(190, 48);
  g.lineTo(248, 180);
  g.stroke();
  g.restore();
};

/**
 * 子は一人｡小さな腰掛けがひとつだけ｡
 * 子どもは描かない｡二つ目がない､という空白のほうを見せる｡
 * 座面の縁を白で一周切って､脚と離した｡
 */
const stool: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 影
  g.fillStyle = "rgba(12,12,12,0.3)";
  g.beginPath();
  g.ellipse(150, 268, 110, 16, 0, 0, Math.PI * 2);
  g.fill();

  // 奥の脚｡先に置いて根を座面で隠す
  const back = g.createLinearGradient(138, 0, 170, 0);
  back.addColorStop(0, "#4e4e4e");
  back.addColorStop(1, "#0c0c0c");
  g.fillStyle = back;
  g.beginPath();
  g.moveTo(140, 140);
  g.lineTo(162, 140);
  g.lineTo(170, 238);
  g.lineTo(148, 238);
  g.closePath();
  g.fill();

  // 手前の脚｡末を外へ開く
  const leg = (xt: number, xb: number, light: string, dark: string) => {
    const lg = g.createLinearGradient(xb, 0, xb + 30, 0);
    lg.addColorStop(0, light);
    lg.addColorStop(0.42, "#8a8a8a");
    lg.addColorStop(1, dark);
    g.fillStyle = lg;
    g.beginPath();
    g.moveTo(xt, 148);
    g.lineTo(xt + 24, 148);
    g.lineTo(xb + 30, 262);
    g.lineTo(xb, 262);
    g.closePath();
    g.fill();
  };
  leg(86, 54, "#f4f4f4", "#171717");
  leg(190, 216, "#cecece", "#0d0d0d");

  // 貫｡二本の脚をつなぐ一本｡白で縁を切る
  const railG = g.createLinearGradient(0, 206, 0, 226);
  railG.addColorStop(0, "#e4e4e4");
  railG.addColorStop(0.5, "#5c5c5c");
  railG.addColorStop(1, "#111111");
  g.fillStyle = railG;
  g.fillRect(74, 206, 158, 20);
  g.strokeStyle = "rgba(252,252,252,0.7)";
  g.lineWidth = 3.5;
  g.strokeRect(74, 206, 158, 20);

  // 座面の厚み
  const edge = g.createLinearGradient(0, 124, 0, 176);
  edge.addColorStop(0, "#cacaca");
  edge.addColorStop(0.42, "#3c3c3c");
  edge.addColorStop(1, "#0d0d0d");
  g.fillStyle = edge;
  g.beginPath();
  g.ellipse(150, 150, 98, 32, 0, 0, Math.PI * 2);
  g.fill();
  g.fillRect(52, 124, 196, 26);

  // 座面の上｡中を明るく残して縁へ沈める
  const top = g.createRadialGradient(112, 108, 12, 150, 124, 130);
  top.addColorStop(0, "#fdfdfd");
  top.addColorStop(0.42, "#dcdcdc");
  top.addColorStop(0.78, "#8e8e8e");
  top.addColorStop(1, "#383838");
  g.fillStyle = top;
  g.beginPath();
  g.ellipse(150, 124, 98, 32, 0, 0, Math.PI * 2);
  g.fill();

  // 口縁を白で一周
  g.strokeStyle = "rgba(252,252,252,0.82)";
  g.lineWidth = 4.5;
  g.beginPath();
  g.ellipse(150, 124, 93, 28, 0, 0, Math.PI * 2);
  g.stroke();
  g.restore();
};

/**
 * 専より紅｡台に据えたままの地球儀｡
 * 学問の道具をひとつ置く｡試験がなくなった11年半を､使われない器物で指す｡
 * 球と子午環のあいだは紙のまま残して白で切り､陸は大きな塊を三つだけにした｡
 */
const globe: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  const cx = 148;
  const cy = 136;
  const R = 82;
  const tilt = 0.28;

  // 影
  g.fillStyle = "rgba(12,12,12,0.28)";
  g.beginPath();
  g.ellipse(154, 290, 82, 11, 0, 0, Math.PI * 2);
  g.fill();

  // 柱｡環の底から台へ落とす
  const stem = g.createLinearGradient(128, 0, 170, 0);
  stem.addColorStop(0, "#f2f2f2");
  stem.addColorStop(0.32, "#a4a4a4");
  stem.addColorStop(0.74, "#343434");
  stem.addColorStop(1, "#0d0d0d");
  g.fillStyle = stem;
  g.beginPath();
  g.moveTo(134, 232);
  g.quadraticCurveTo(126, 250, 132, 266);
  g.lineTo(164, 266);
  g.quadraticCurveTo(170, 250, 162, 232);
  g.closePath();
  g.fill();

  // 台｡下を暗く､上の面を白く起こす
  g.fillStyle = "#0c0c0c";
  g.beginPath();
  g.ellipse(148, 280, 62, 16, 0, 0, Math.PI * 2);
  g.fill();
  const rim = g.createLinearGradient(0, 264, 0, 282);
  rim.addColorStop(0, "#8e8e8e");
  rim.addColorStop(1, "#111111");
  g.fillStyle = rim;
  g.fillRect(86, 266, 124, 14);
  const top = g.createRadialGradient(118, 258, 6, 148, 266, 78);
  top.addColorStop(0, "#fbfbfb");
  top.addColorStop(0.44, "#c4c4c4");
  top.addColorStop(1, "#3c3c3c");
  g.fillStyle = top;
  g.beginPath();
  g.ellipse(148, 266, 62, 16, 0, 0, Math.PI * 2);
  g.fill();

  // 子午環｡球の外を一周する太い環
  const ring = g.createLinearGradient(cx - 104, cy - 104, cx + 104, cy + 104);
  ring.addColorStop(0, "#fbfbfb");
  ring.addColorStop(0.32, "#b6b6b6");
  ring.addColorStop(0.7, "#3a3a3a");
  ring.addColorStop(1, "#080808");
  g.strokeStyle = ring;
  g.lineWidth = 15;
  g.beginPath();
  g.ellipse(cx, cy, 100, 104, tilt, 0, Math.PI * 2);
  g.stroke();

  // 極の軸｡環と球をつなぐ短い金物
  const ax = Math.sin(tilt);
  const ay = -Math.cos(tilt);
  for (const sgn of [1, -1]) {
    const x0 = cx + ax * (R - 4) * sgn;
    const y0 = cy + ay * (R - 4) * sgn;
    const x1 = cx + ax * 104 * sgn;
    const y1 = cy + ay * 104 * sgn;
    g.strokeStyle = "#151515";
    g.lineWidth = 11;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(x0, y0);
    g.lineTo(x1, y1);
    g.stroke();
  }

  // 球｡左上から光を当てて右下へ落とす
  const ball = g.createRadialGradient(cx - 34, cy - 38, 8, cx, cy, R * 1.34);
  ball.addColorStop(0, "#fdfdfd");
  ball.addColorStop(0.36, "#dedede");
  ball.addColorStop(0.74, "#7e7e7e");
  ball.addColorStop(1, "#121212");
  g.fillStyle = ball;
  g.beginPath();
  g.arc(cx, cy, R, 0, Math.PI * 2);
  g.fill();

  g.save();
  g.beginPath();
  g.arc(cx, cy, R, 0, Math.PI * 2);
  g.clip();

  // 陸｡大きな塊を三つだけ｡縁を白で切って海から離す
  const land = (p: Path2D) => {
    g.strokeStyle = "rgba(252,252,252,0.9)";
    g.lineWidth = 6;
    g.stroke(p);
    g.fillStyle = "rgba(14,14,14,0.66)";
    g.fill(p);
  };

  const c1 = new Path2D();
  c1.moveTo(96, 74);
  c1.bezierCurveTo(134, 62, 162, 80, 154, 104);
  c1.bezierCurveTo(146, 128, 104, 132, 90, 112);
  c1.bezierCurveTo(80, 98, 82, 80, 96, 74);
  c1.closePath();
  land(c1);

  const c2 = new Path2D();
  c2.moveTo(126, 160);
  c2.bezierCurveTo(158, 150, 178, 168, 170, 196);
  c2.bezierCurveTo(162, 224, 128, 232, 116, 210);
  c2.bezierCurveTo(106, 190, 110, 166, 126, 160);
  c2.closePath();
  land(c2);

  const c3 = new Path2D();
  c3.moveTo(198, 96);
  c3.bezierCurveTo(226, 92, 242, 112, 234, 136);
  c3.bezierCurveTo(226, 158, 200, 158, 194, 138);
  c3.bezierCurveTo(188, 120, 188, 100, 198, 96);
  c3.closePath();
  land(c3);

  // 赤道と経線｡白でひと筋ずつ
  g.strokeStyle = "rgba(252,252,252,0.82)";
  g.lineWidth = 4.5;
  g.beginPath();
  g.ellipse(cx, cy, R, R * 0.3, tilt, 0, Math.PI * 2);
  g.stroke();
  g.beginPath();
  g.ellipse(cx, cy, R * 0.4, R, tilt, 0, Math.PI * 2);
  g.stroke();
  g.restore();

  // 極の玉｡環の外に小さくひとつずつ
  for (const sgn of [1, -1]) {
    const x1 = cx + ax * 104 * sgn;
    const y1 = cy + ay * 104 * sgn;
    const kg = g.createRadialGradient(x1 - 4, y1 - 4, 1, x1, y1, 14);
    kg.addColorStop(0, "#f4f4f4");
    kg.addColorStop(0.5, "#787878");
    kg.addColorStop(1, "#080808");
    g.fillStyle = kg;
    g.beginPath();
    g.arc(x1, y1, 11, 0, Math.PI * 2);
    g.fill();
  }
  g.restore();
};

/**
 * 国語だけを話せ｡首に掛けさせた木の札（方言札／狗牌）｡
 * 掛けられた子どもは描かない｡札という道具だけで指す｡
 * 点刻の網で散らないよう､札は大きな一枚の塊､紐は太い帯を一本だけにし､
 * 彫った字は細い画をやめて白く抜いた太い塊にした｡
 */
const tag: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 紐｡太い帯を一本だけ｡札の後ろへ入る
  const cordG = g.createLinearGradient(104, 0, 150, 60);
  cordG.addColorStop(0, "#a0a0a0");
  cordG.addColorStop(0.45, "#4a4a4a");
  cordG.addColorStop(1, "#0f0f0f");
  g.fillStyle = cordG;
  g.beginPath();
  g.moveTo(104, 0);
  g.lineTo(136, 0);
  g.lineTo(168, 120);
  g.lineTo(134, 120);
  g.closePath();
  g.fill();

  // 札｡大きな一枚の塊｡左上から右下へ沈める
  const boardP = roundRect(58, 74, 184, 204, 15);
  const wood = g.createLinearGradient(58, 74, 242, 278);
  wood.addColorStop(0, "#8e8e8e");
  wood.addColorStop(0.42, "#6a6a6a");
  wood.addColorStop(0.78, "#3c3c3c");
  wood.addColorStop(1, "#1e1e1e");
  g.fillStyle = wood;
  g.fill(boardP);

  // 穴｡白く大きく抜いて､中に紐の断面をひとつ
  g.fillStyle = "#fcfcfc";
  g.beginPath();
  g.arc(150, 106, 21, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#141414";
  g.beginPath();
  g.arc(150, 106, 11, 0, Math.PI * 2);
  g.fill();

  // 彫った字｡太い塊で白く抜く｡画を細くすると点刻で散る
  g.fillStyle = "#fcfcfc";
  for (const y of [148, 194, 240]) g.fillRect(86, y, 128, 23);
  g.fillRect(138, 148, 24, 115);
  g.restore();
};

export const PLATES_K: Record<string, Draw> = {
  "109": tablet,
  "110": gate,
  "111": bugle,
  "112": boot,
  "113": bento,
  "114": necklace,
  "115": veilCloth,
  "116": stool,
  "117": globe,
  "118": tag,
};
