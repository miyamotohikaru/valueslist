/**
 * 図版の版下（その五）｡
 *
 * plates.ts と同じ約束で描く｡網のことは考えず､灰色の絵として置く｡
 * 面は平らに塗らずグラデーションで濃淡をつける｡ベタにすると網にかけたとき絵が死ぬ｡
 * 座標は 300 四方｡枠いっぱいに大きく取って､端には大事なものを置かない｡
 *
 * 法と条文の札が十枚続くので､器物を一枚ごとに変える｡
 * 合わせ椀･測量器･投票箱･白紙の答案･計数棒･彫った板･引き出しの箪笥･分銅･活字･砂時計｡
 * 人の姿は描かない｡
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

/** 汚された名誉は結婚で消える｡椀を伏せて合わせた蓋物｡中は二度と見えない */
const pairedBowls: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 地の影｡据わりを出す
  const cast = g.createRadialGradient(150, 262, 10, 150, 264, 126);
  cast.addColorStop(0, "#8a8a8a");
  cast.addColorStop(1, "#fbfbfb");
  g.fillStyle = cast;
  g.beginPath();
  g.ellipse(150, 262, 116, 16, 0, 0, Math.PI * 2);
  g.fill();

  // 下の椀｡口を上に向けたほう｡上の椀より暗く沈める
  const lower = new Path2D();
  lower.moveTo(44, 172);
  lower.quadraticCurveTo(52, 224, 106, 242);
  lower.lineTo(194, 242);
  lower.quadraticCurveTo(248, 224, 256, 172);
  lower.closePath();
  const low = g.createLinearGradient(44, 0, 256, 0);
  low.addColorStop(0, "#c8c8c8");
  low.addColorStop(0.24, "#7c7c7c");
  low.addColorStop(0.62, "#2e2e2e");
  low.addColorStop(1, "#070707");
  g.fillStyle = low;
  g.fill(lower);

  // 下の椀の口縁｡合わせ目の下側を締める
  g.strokeStyle = "rgba(8,8,8,0.85)";
  g.lineWidth = 6;
  g.beginPath();
  g.moveTo(44, 173);
  g.lineTo(256, 173);
  g.stroke();

  // 高台｡下の椀の脚
  const foot = g.createLinearGradient(0, 240, 0, 264);
  foot.addColorStop(0, "#8a8a8a");
  foot.addColorStop(0.5, "#1a1a1a");
  foot.addColorStop(1, "#040404");
  g.fillStyle = foot;
  g.beginPath();
  g.moveTo(112, 240);
  g.lineTo(188, 240);
  g.lineTo(180, 264);
  g.lineTo(120, 264);
  g.closePath();
  g.fill();

  // 合わせ目｡二つの椀のあいだを白く太く切る
  g.fillStyle = "#ffffff";
  g.fillRect(30, 152, 240, 20);

  // 上の椀｡伏せて重ねたほう｡少し右へずらして､載せたものと分からせる
  const upper = new Path2D();
  upper.moveTo(52, 158);
  upper.quadraticCurveTo(58, 100, 112, 82);
  upper.lineTo(200, 82);
  upper.quadraticCurveTo(254, 100, 260, 158);
  upper.closePath();
  const up = g.createLinearGradient(52, 0, 260, 0);
  up.addColorStop(0, "#fdfdfd");
  up.addColorStop(0.3, "#d2d2d2");
  up.addColorStop(0.74, "#7a7a7a");
  up.addColorStop(1, "#3a3a3a");
  g.fillStyle = up;
  g.fill(upper);
  g.strokeStyle = "rgba(10,10,10,0.7)";
  g.lineWidth = 3.4;
  g.stroke(upper);

  // 伏せた椀の口縁｡下を向いた縁を一本の帯で見せる
  const lip = g.createLinearGradient(52, 0, 260, 0);
  lip.addColorStop(0, "#6a6a6a");
  lip.addColorStop(0.5, "#1e1e1e");
  lip.addColorStop(1, "#0a0a0a");
  g.fillStyle = lip;
  g.fillRect(52, 148, 208, 11);

  // 伏せた椀の高台｡上に出る輪｡これで裏返しと分かる
  const topFoot = g.createLinearGradient(0, 56, 0, 84);
  topFoot.addColorStop(0, "#d0d0d0");
  topFoot.addColorStop(0.5, "#454545");
  topFoot.addColorStop(1, "#0d0d0d");
  g.fillStyle = topFoot;
  g.beginPath();
  g.moveTo(122, 84);
  g.lineTo(190, 84);
  g.lineTo(182, 58);
  g.lineTo(130, 58);
  g.closePath();
  g.fill();
  g.fillStyle = "#0b0b0b";
  g.beginPath();
  g.ellipse(156, 58, 26, 7.5, 0, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "rgba(252,252,252,0.75)";
  g.lineWidth = 3.4;
  g.beginPath();
  g.ellipse(156, 58, 26, 7.5, 0, 0, Math.PI * 2);
  g.stroke();

  // 照り｡上の椀に白帯をひとすじ｡面をベタにしない
  g.save();
  g.clip(upper);
  g.strokeStyle = "rgba(252,252,252,0.7)";
  g.lineWidth = 16;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(88, 144);
  g.quadraticCurveTo(74, 116, 102, 96);
  g.stroke();
  g.restore();
  g.restore();
};

/** 文明国が導いてやる｡三脚に据えた測量器｡導く側の器物だけを冷たく置く */
const theodolite: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 据えた跡｡地の影
  const cast = g.createRadialGradient(150, 282, 8, 150, 284, 132);
  cast.addColorStop(0, "#909090");
  cast.addColorStop(1, "#fbfbfb");
  g.fillStyle = cast;
  g.beginPath();
  g.ellipse(150, 282, 126, 16, 0, 0, Math.PI * 2);
  g.fill();

  /** 脚｡上を細く下へ広げ､先を尖らせる｡三本だけ */
  const leg = (tx: number, bx: number, by: number, dark: boolean) => {
    const gr = g.createLinearGradient(tx - 14, 0, tx + 14, 0);
    gr.addColorStop(0, dark ? "#5e5e5e" : "#e8e8e8");
    gr.addColorStop(0.4, dark ? "#242424" : "#8e8e8e");
    gr.addColorStop(1, dark ? "#090909" : "#1c1c1c");
    g.fillStyle = gr;
    g.beginPath();
    g.moveTo(tx - 11, 152);
    g.lineTo(tx + 11, 152);
    g.lineTo(bx + 10, by - 16);
    g.lineTo(bx + 3, by);
    g.lineTo(bx - 3, by);
    g.lineTo(bx - 10, by - 16);
    g.closePath();
    g.fill();
  };
  leg(158, 190, 248, true);
  leg(138, 54, 282, false);
  leg(164, 248, 282, false);

  // 台座｡脚を束ねる塊
  const base = g.createLinearGradient(112, 136, 188, 172);
  base.addColorStop(0, "#f0f0f0");
  base.addColorStop(0.4, "#8e8e8e");
  base.addColorStop(1, "#151515");
  g.fillStyle = base;
  g.beginPath();
  g.moveTo(112, 138);
  g.lineTo(188, 138);
  g.lineTo(176, 172);
  g.lineTo(124, 172);
  g.closePath();
  g.fill();

  // 目盛の円盤｡まわりを白く抜いて脚から離す
  g.strokeStyle = "#ffffff";
  g.lineWidth = 11;
  g.beginPath();
  g.ellipse(150, 132, 72, 17, 0, 0, Math.PI * 2);
  g.stroke();
  const dial = g.createLinearGradient(78, 0, 222, 0);
  dial.addColorStop(0, "#efefef");
  dial.addColorStop(0.35, "#8c8c8c");
  dial.addColorStop(0.78, "#2a2a2a");
  dial.addColorStop(1, "#0c0c0c");
  g.fillStyle = dial;
  g.beginPath();
  g.ellipse(150, 132, 72, 17, 0, 0, Math.PI * 2);
  g.fill();

  // 目盛｡手前の縁に七本だけ太く白く抜く
  g.strokeStyle = "rgba(252,252,252,0.88)";
  g.lineWidth = 4.6;
  for (let i = 0; i < 7; i++) {
    const a = Math.PI * (0.1 + (i * 0.8) / 6);
    const x = 150 + Math.cos(a) * 64;
    const y = 132 + Math.sin(a) * 15;
    g.beginPath();
    g.moveTo(x, y - 7);
    g.lineTo(x, y + 7);
    g.stroke();
  }

  // 支柱｡二本｡あいだは紙のまま空ける
  const post = g.createLinearGradient(0, 90, 0, 134);
  post.addColorStop(0, "#dadada");
  post.addColorStop(0.5, "#585858");
  post.addColorStop(1, "#111111");
  g.fillStyle = post;
  for (const x of [108, 172]) g.fillRect(x, 92, 20, 42);

  // 望遠鏡｡横に長い筒｡白く抜いてから置く
  g.save();
  g.translate(150, 84);
  g.rotate(-0.055);
  const tube = new Path2D();
  tube.moveTo(-116, -20);
  tube.lineTo(96, -17);
  tube.quadraticCurveTo(120, -17, 120, 0);
  tube.quadraticCurveTo(120, 17, 96, 17);
  tube.lineTo(-116, 20);
  tube.quadraticCurveTo(-126, 20, -126, 0);
  tube.quadraticCurveTo(-126, -20, -116, -20);
  tube.closePath();
  g.strokeStyle = "#ffffff";
  g.lineWidth = 12;
  g.stroke(tube);
  const barrel = g.createLinearGradient(0, -20, 0, 20);
  barrel.addColorStop(0, "#f4f4f4");
  barrel.addColorStop(0.3, "#a8a8a8");
  barrel.addColorStop(0.66, "#2e2e2e");
  barrel.addColorStop(1, "#0a0a0a");
  g.fillStyle = barrel;
  g.fill(tube);

  // 対物レンズ｡筒の先の暗い落ち込み｡縁を白く起こす
  g.fillStyle = "#101010";
  g.beginPath();
  g.ellipse(-122, 0, 9, 22, 0, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "rgba(252,252,252,0.72)";
  g.lineWidth = 4;
  g.beginPath();
  g.ellipse(-122, 0, 9, 22, 0, 0, Math.PI * 2);
  g.stroke();

  // 筒の帯｡ベタにしないための白い抜き
  g.strokeStyle = "rgba(252,252,252,0.8)";
  g.lineWidth = 6;
  for (const x of [-56, 36]) {
    g.beginPath();
    g.moveTo(x, -19);
    g.lineTo(x, 19);
    g.stroke();
  }
  g.restore();

  // 微動のねじ｡塊をひとつだけ
  const knob = g.createRadialGradient(196, 108, 4, 204, 116, 28);
  knob.addColorStop(0, "#d4d4d4");
  knob.addColorStop(0.5, "#4a4a4a");
  knob.addColorStop(1, "#090909");
  g.fillStyle = knob;
  g.beginPath();
  g.arc(202, 114, 20, 0, Math.PI * 2);
  g.fill();
  g.restore();
};

/** 離婚は憲法が禁じる｡封をした投票箱｡差し口に一枚だけ立つ */
const ballotBox: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 右の側面｡奥へ回る面｡いちばん暗い
  const side = g.createLinearGradient(206, 0, 244, 0);
  side.addColorStop(0, "#4c4c4c");
  side.addColorStop(1, "#090909");
  g.fillStyle = side;
  g.beginPath();
  g.moveTo(240, 132);
  g.lineTo(214, 100);
  g.lineTo(208, 230);
  g.lineTo(232, 262);
  g.closePath();
  g.fill();

  // 天面｡差し口の乗る面
  const top = g.createLinearGradient(60, 96, 240, 136);
  top.addColorStop(0, "#f4f4f4");
  top.addColorStop(0.45, "#b6b6b6");
  top.addColorStop(1, "#5c5c5c");
  g.fillStyle = top;
  g.beginPath();
  g.moveTo(60, 132);
  g.lineTo(86, 100);
  g.lineTo(214, 100);
  g.lineTo(240, 132);
  g.closePath();
  g.fill();

  // 前の面｡いちばん大きな塊
  const front = g.createLinearGradient(60, 0, 240, 0);
  front.addColorStop(0, "#f0f0f0");
  front.addColorStop(0.28, "#a2a2a2");
  front.addColorStop(0.7, "#2e2e2e");
  front.addColorStop(1, "#0b0b0b");
  g.fillStyle = front;
  g.beginPath();
  g.moveTo(60, 132);
  g.lineTo(240, 132);
  g.lineTo(232, 262);
  g.lineTo(68, 262);
  g.closePath();
  g.fill();

  // 稜｡白く抜いて面と面を離す
  g.strokeStyle = "rgba(252,252,252,0.92)";
  g.lineWidth = 6;
  g.beginPath();
  g.moveTo(60, 132);
  g.lineTo(240, 132);
  g.stroke();
  g.lineWidth = 5;
  g.beginPath();
  g.moveTo(240, 132);
  g.lineTo(214, 100);
  g.stroke();

  // 差し口｡天面に開いた暗い溝
  g.fillStyle = "#0a0a0a";
  g.beginPath();
  g.moveTo(112, 124);
  g.lineTo(190, 124);
  g.lineTo(178, 108);
  g.lineTo(124, 108);
  g.closePath();
  g.fill();

  // 入れかけの一枚｡溝から立ち上がる｡まわりを白く抜く
  const slip = new Path2D();
  slip.moveTo(120, 120);
  slip.lineTo(184, 112);
  slip.lineTo(206, 26);
  slip.lineTo(138, 32);
  slip.closePath();
  g.strokeStyle = "#ffffff";
  g.lineWidth = 11;
  g.stroke(slip);
  const paper = g.createLinearGradient(120, 26, 206, 120);
  paper.addColorStop(0, "#fdfdfd");
  paper.addColorStop(0.6, "#e2e2e2");
  paper.addColorStop(1, "#9e9e9e");
  g.fillStyle = paper;
  g.fill(slip);
  g.strokeStyle = "rgba(14,14,14,0.62)";
  g.lineWidth = 3.2;
  g.stroke(slip);

  // 一票の印｡太い斜め十字をひとつだけ
  g.save();
  g.clip(slip);
  g.strokeStyle = "rgba(18,18,18,0.88)";
  g.lineWidth = 14;
  g.beginPath();
  g.moveTo(152, 54);
  g.lineTo(192, 92);
  g.moveTo(192, 50);
  g.lineTo(152, 90);
  g.stroke();
  g.restore();

  // 封印の帯｡箱をひと巻き｡明るい帯で前の面を割る
  const band = g.createLinearGradient(62, 0, 238, 0);
  band.addColorStop(0, "#fbfbfb");
  band.addColorStop(0.5, "#d0d0d0");
  band.addColorStop(1, "#7e7e7e");
  g.fillStyle = band;
  g.beginPath();
  g.moveTo(63, 186);
  g.lineTo(237, 186);
  g.lineTo(236, 216);
  g.lineTo(64, 216);
  g.closePath();
  g.fill();
  g.strokeStyle = "rgba(16,16,16,0.55)";
  g.lineWidth = 3;
  g.stroke();

  // 封印｡帯の継ぎ目に押した印
  const seal = g.createRadialGradient(144, 194, 3, 150, 201, 21);
  seal.addColorStop(0, "#727272");
  seal.addColorStop(0.6, "#1e1e1e");
  seal.addColorStop(1, "#050505");
  g.fillStyle = seal;
  g.beginPath();
  g.arc(150, 201, 18, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "rgba(252,252,252,0.82)";
  g.lineWidth = 3.6;
  g.beginPath();
  g.arc(150, 201, 9, 0, Math.PI * 2);
  g.stroke();

  // 脚｡箱を持ち上げる二つ
  g.fillStyle = "#0e0e0e";
  g.fillRect(76, 262, 30, 15);
  g.fillRect(196, 262, 30, 15);
  g.restore();
};

/** 白豪主義｡書き取り試験の答案｡罫だけ刷ってあって一行も書かれていない */
const blankDictation: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 答案｡わずかに傾けた一枚
  g.save();
  g.translate(150, 150);
  g.rotate(-0.062);
  g.translate(-150, -150);

  const sheet = g.createLinearGradient(40, 40, 262, 272);
  sheet.addColorStop(0, "#fdfdfd");
  sheet.addColorStop(0.55, "#eeeeee");
  sheet.addColorStop(1, "#c6c6c6");
  g.fillStyle = sheet;
  g.fillRect(40, 40, 222, 230);
  g.strokeStyle = "rgba(12,12,12,0.62)";
  g.lineWidth = 3.4;
  g.strokeRect(40, 40, 222, 230);

  // 刷ってある見出し｡印字はここだけ
  g.fillStyle = "rgba(20,20,20,0.86)";
  g.fillRect(62, 62, 128, 17);
  g.fillRect(62, 90, 62, 9);

  // 書き取りの罫｡太い五本｡どれも空のまま
  g.fillStyle = "rgba(18,18,18,0.72)";
  for (let i = 0; i < 5; i++) g.fillRect(62, 128 + i * 28, 178, 10);
  g.restore();

  // ペン先｡紙の上に置かれた一本｡まわりを白く抜いてから置く
  g.save();
  g.translate(176, 204);
  g.rotate(-0.72);
  const nib = new Path2D();
  nib.moveTo(0, -80);
  nib.quadraticCurveTo(25, -34, 25, 18);
  nib.quadraticCurveTo(25, 46, 0, 54);
  nib.quadraticCurveTo(-25, 46, -25, 18);
  nib.quadraticCurveTo(-25, -34, 0, -80);
  nib.closePath();
  g.strokeStyle = "#ffffff";
  g.lineWidth = 13;
  g.stroke(nib);
  const steel = g.createLinearGradient(-25, 0, 25, 0);
  steel.addColorStop(0, "#f6f6f6");
  steel.addColorStop(0.28, "#aeaeae");
  steel.addColorStop(0.62, "#2e2e2e");
  steel.addColorStop(1, "#080808");
  g.fillStyle = steel;
  g.fill(nib);

  // 切り割り｡先から胴まで白く抜いた一本
  g.strokeStyle = "rgba(252,252,252,0.92)";
  g.lineWidth = 6.5;
  g.beginPath();
  g.moveTo(0, -76);
  g.lineTo(0, 4);
  g.stroke();

  // 空気穴｡白い抜きをひとつ
  g.fillStyle = "#fcfcfc";
  g.beginPath();
  g.ellipse(0, 14, 11, 13, 0, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "rgba(10,10,10,0.5)";
  g.lineWidth = 3;
  g.beginPath();
  g.ellipse(0, 14, 11, 13, 0, 0, Math.PI * 2);
  g.stroke();
  g.restore();

  // 落ちた墨｡先の近くにひと粒だけ｡書かれたのはこれきり
  const drop = g.createRadialGradient(112, 132, 2, 116, 138, 16);
  drop.addColorStop(0, "#6a6a6a");
  drop.addColorStop(0.55, "#1a1a1a");
  drop.addColorStop(1, "#050505");
  g.fillStyle = drop;
  g.beginPath();
  g.ellipse(115, 137, 12, 10, 0.4, 0, Math.PI * 2);
  g.fill();
  g.restore();
};

/** 先住民は人口に数えない｡刻みを入れた計数の棒｡途中から刻みがない */
const tallyStick: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);
  g.translate(150, 156);
  g.rotate(-0.335);

  const L = 122;
  const W = 30;

  // 棒｡いちばん大きな塊｡端を丸く落とす
  const bar = new Path2D();
  const r = 15;
  bar.moveTo(-L + r, -W);
  bar.lineTo(L - r, -W);
  bar.quadraticCurveTo(L, -W, L, -W + r);
  bar.lineTo(L, W - r);
  bar.quadraticCurveTo(L, W, L - r, W);
  bar.lineTo(-L + r, W);
  bar.quadraticCurveTo(-L, W, -L, W - r);
  bar.lineTo(-L, -W + r);
  bar.quadraticCurveTo(-L, -W, -L + r, -W);
  bar.closePath();

  const wood = g.createLinearGradient(0, -W, 0, W);
  wood.addColorStop(0, "#f0f0f0");
  wood.addColorStop(0.26, "#a8a8a8");
  wood.addColorStop(0.62, "#4c4c4c");
  wood.addColorStop(1, "#131313");
  g.fillStyle = wood;
  g.fill(bar);
  g.strokeStyle = "rgba(12,12,12,0.6)";
  g.lineWidth = 3.2;
  g.stroke(bar);

  g.save();
  g.clip(bar);

  // 木の目｡白く抜いた一筋
  g.strokeStyle = "rgba(252,252,252,0.6)";
  g.lineWidth = 5;
  g.beginPath();
  g.moveTo(-L, -8);
  g.quadraticCurveTo(0, -14, L, -6);
  g.stroke();

  // 刻み｡六つだけ｡白い楔で深く抜き､右側に影を落とす
  for (let i = 0; i < 6; i++) {
    const x = -104 + i * 25;
    g.fillStyle = "#ffffff";
    g.beginPath();
    g.moveTo(x - 10, -W - 4);
    g.lineTo(x + 10, -W - 4);
    g.lineTo(x, 9);
    g.closePath();
    g.fill();
    g.fillStyle = "rgba(10,10,10,0.82)";
    g.beginPath();
    g.moveTo(x + 10, -W - 4);
    g.lineTo(x + 17, -W - 4);
    g.lineTo(x + 5, 9);
    g.lineTo(x, 9);
    g.closePath();
    g.fill();
  }
  g.restore();

  // 吊り穴｡刻みのない側の端にひとつ｡右の四割は無地のまま残す
  g.fillStyle = "#0d0d0d";
  g.beginPath();
  g.ellipse(L - 28, 0, 10, 13, 0, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "rgba(252,252,252,0.75)";
  g.lineWidth = 3.6;
  g.beginPath();
  g.ellipse(L - 28, 0, 10, 13, 0, 0, Math.PI * 2);
  g.stroke();
  g.restore();
};

/** 公の言葉は英語だけ｡渦を彫った板｡奪われた言葉の側を大きく置く */
const carvedBoard: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);
  g.translate(150, 150);
  g.rotate(-0.055);

  // 板｡端をわずかに狂わせて､削り出した一枚に見せる
  const board = new Path2D();
  board.moveTo(-128, -78);
  board.lineTo(128, -86);
  board.lineTo(132, 78);
  board.lineTo(-124, 88);
  board.closePath();

  const wood = g.createLinearGradient(-128, -86, 132, 88);
  wood.addColorStop(0, "#f0f0f0");
  wood.addColorStop(0.3, "#ababab");
  wood.addColorStop(0.68, "#4e4e4e");
  wood.addColorStop(1, "#191919");
  g.fillStyle = wood;
  g.fill(board);
  g.strokeStyle = "rgba(10,10,10,0.6)";
  g.lineWidth = 3.4;
  g.stroke(board);

  g.save();
  g.clip(board);

  // 木の目｡白く抜いた二筋
  g.strokeStyle = "rgba(252,252,252,0.42)";
  g.lineWidth = 5;
  for (const y of [-56, 58]) {
    g.beginPath();
    g.moveTo(-130, y);
    g.quadraticCurveTo(0, y + 8, 134, y - 4);
    g.stroke();
  }

  // 彫りの渦｡一巻き強｡溝を暗く沈め､縁を白く起こす
  const ox = -44;
  const oy = 2;
  const a0 = -Math.PI * 0.45;
  const spiral = new Path2D();
  for (let i = 0; i <= 120; i++) {
    const t = i / 120;
    const a = a0 + t * Math.PI * 2.6;
    const rr = 18 + t * 56;
    const x = ox + Math.cos(a) * rr;
    const y = oy + Math.sin(a) * rr;
    if (i === 0) spiral.moveTo(x, y);
    else spiral.lineTo(x, y);
  }
  g.lineCap = "round";
  g.strokeStyle = "rgba(250,250,250,0.92)";
  g.lineWidth = 27;
  g.stroke(spiral);
  g.strokeStyle = "rgba(12,12,12,0.9)";
  g.lineWidth = 14;
  g.stroke(spiral);

  // 渦の芯｡いちばん深い点
  g.fillStyle = "rgba(10,10,10,0.94)";
  g.beginPath();
  g.arc(ox + Math.cos(a0) * 18, oy + Math.sin(a0) * 18, 12, 0, Math.PI * 2);
  g.fill();

  // 彫りの肋｡右の端に三日月を二つだけ｡同じく白で起こして暗く掘る
  const ribs = [66, 108];
  g.strokeStyle = "rgba(250,250,250,0.92)";
  g.lineWidth = 23;
  for (const x of ribs) {
    g.beginPath();
    g.arc(x, 2, 40, Math.PI * 0.62, Math.PI * 1.38);
    g.stroke();
  }
  g.strokeStyle = "rgba(12,12,12,0.9)";
  g.lineWidth = 12;
  for (const x of ribs) {
    g.beginPath();
    g.arc(x, 2, 40, Math.PI * 0.62, Math.PI * 1.38);
    g.stroke();
  }
  g.restore();
  g.restore();
};

/** 妻は夫の許可で動く｡引き出しの箪笥｡前板を大きな面で取り､隙間を白く太く切る */
const lockedChest: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  const FX0 = 52;
  const FX1 = 232;
  const FY0 = 86;
  const FY1 = 266;
  const DX = 32;
  const DY = -32;

  // 右の側板｡奥へ回る面｡いちばん暗くして箱の厚みを出す
  const side = g.createLinearGradient(FX1, 0, FX1 + DX, 0);
  side.addColorStop(0, "#3c3c3c");
  side.addColorStop(1, "#080808");
  g.fillStyle = side;
  g.beginPath();
  g.moveTo(FX1, FY0);
  g.lineTo(FX1 + DX, FY0 + DY);
  g.lineTo(FX1 + DX, FY1 + DY);
  g.lineTo(FX1, FY1);
  g.closePath();
  g.fill();

  // 天板｡上を向いた面｡いちばん明るい
  const top = g.createLinearGradient(FX0, FY0, FX1 + DX, FY0 + DY);
  top.addColorStop(0, "#fcfcfc");
  top.addColorStop(0.45, "#cfcfcf");
  top.addColorStop(1, "#838383");
  g.fillStyle = top;
  g.beginPath();
  g.moveTo(FX0, FY0);
  g.lineTo(FX1, FY0);
  g.lineTo(FX1 + DX, FY0 + DY);
  g.lineTo(FX0 + DX, FY0 + DY);
  g.closePath();
  g.fill();

  // 胴｡前の面｡引き出しの地になる
  const body = g.createLinearGradient(FX0, 0, FX1, 0);
  body.addColorStop(0, "#8e8e8e");
  body.addColorStop(0.5, "#3c3c3c");
  body.addColorStop(1, "#0f0f0f");
  g.fillStyle = body;
  g.fillRect(FX0, FY0, FX1 - FX0, FY1 - FY0);

  // 稜｡天板と前板､前板と側板｡白く一本ずつ入れて立体にする
  g.strokeStyle = "#ffffff";
  g.lineWidth = 7;
  g.beginPath();
  g.moveTo(FX0 - 3, FY0);
  g.lineTo(FX1, FY0);
  g.moveTo(FX1, FY0 - 3);
  g.lineTo(FX1, FY1 + 3);
  g.stroke();

  // 引き出しの前板｡三枚の大きな面｡そのあいだを白い帯で太く切る
  const rows: Array<[number, number]> = [
    [94, 138],
    [152, 198],
    [212, 258],
  ];
  for (const [y0, y1] of rows) {
    const gr = g.createLinearGradient(FX0 + 6, 0, FX1 - 6, 0);
    gr.addColorStop(0, "#f6f6f6");
    gr.addColorStop(0.26, "#c4c4c4");
    gr.addColorStop(0.66, "#5c5c5c");
    gr.addColorStop(1, "#1c1c1c");
    g.fillStyle = gr;
    g.fillRect(FX0 + 6, y0, FX1 - FX0 - 12, y1 - y0);
    // 前板の上の縁だけ白く起こす
    g.strokeStyle = "rgba(252,252,252,0.9)";
    g.lineWidth = 5;
    g.beginPath();
    g.moveTo(FX0 + 8, y0 + 3);
    g.lineTo(FX1 - 8, y0 + 3);
    g.stroke();
  }

  // 隙間｡引き出しどうしを白い帯ではっきり離す
  g.fillStyle = "#ffffff";
  for (const y of [86, 138, 198, 258]) g.fillRect(FX0, y, FX1 - FX0, y === 86 ? 8 : 14);

  // 引手｡前板の中に白く抜く｡細い線では描かない
  for (const [y0, y1] of rows) {
    const cy = (y0 + y1) / 2 + 2;
    g.fillStyle = "#fcfcfc";
    g.beginPath();
    g.ellipse(140, cy, 31, 11, 0, 0, Math.PI * 2);
    g.fill();
    // 沈んだ分の影｡上の縁にだけ落とす
    g.strokeStyle = "rgba(10,10,10,0.55)";
    g.lineWidth = 4.4;
    g.beginPath();
    g.ellipse(140, cy, 31, 11, 0, Math.PI * 1.08, Math.PI * 1.92);
    g.stroke();
  }

  // 錠｡中の段の右に小さく添えるだけ
  g.strokeStyle = "#101010";
  g.lineWidth = 5;
  g.beginPath();
  g.arc(205, 166, 9, Math.PI * 1.04, Math.PI * 1.96);
  g.stroke();
  const lock = g.createLinearGradient(190, 0, 220, 0);
  lock.addColorStop(0, "#d2d2d2");
  lock.addColorStop(0.45, "#4a4a4a");
  lock.addColorStop(1, "#080808");
  rrect(g, 190, 166, 30, 26, 5);
  g.strokeStyle = "#ffffff";
  g.lineWidth = 6;
  g.stroke();
  g.fillStyle = lock;
  g.fill();
  g.fillStyle = "#fafafa";
  g.beginPath();
  g.arc(205, 176, 4.6, 0, Math.PI * 2);
  g.fill();

  // 脚｡箱を持ち上げる二つ
  const legGr = g.createLinearGradient(0, FY1, 0, FY1 + 20);
  legGr.addColorStop(0, "#565656");
  legGr.addColorStop(0.5, "#141414");
  legGr.addColorStop(1, "#030303");
  g.fillStyle = legGr;
  g.fillRect(64, FY1, 34, 20);
  g.fillRect(186, FY1, 34, 20);
  g.beginPath();
  g.moveTo(FX1, FY1);
  g.lineTo(FX1 + DX, FY1 + DY);
  g.lineTo(FX1 + DX, FY1 + DY + 16);
  g.lineTo(FX1, FY1 + 16);
  g.closePath();
  g.fill();
  g.restore();
};

/** 親殺しは特別に重い｡環のついた分銅｡置いた地がわずかに沈む */
const weight: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 地の線｡分銅の下だけ沈ませる
  g.strokeStyle = "rgba(16,16,16,0.66)";
  g.lineWidth = 8;
  g.beginPath();
  g.moveTo(8, 254);
  g.lineTo(62, 254);
  g.quadraticCurveTo(150, 292, 238, 254);
  g.lineTo(292, 254);
  g.stroke();

  // くぼみの影
  const cast = g.createRadialGradient(150, 272, 10, 150, 274, 132);
  cast.addColorStop(0, "#828282");
  cast.addColorStop(1, "#fbfbfb");
  g.fillStyle = cast;
  g.beginPath();
  g.ellipse(150, 272, 122, 18, 0, 0, Math.PI * 2);
  g.fill();

  // 環｡上に出る取手｡中を白く抜いてから太く置く
  g.strokeStyle = "#ffffff";
  g.lineWidth = 12;
  g.beginPath();
  g.ellipse(150, 82, 35, 31, 0, 0, Math.PI * 2);
  g.stroke();
  const hoop = g.createLinearGradient(115, 51, 185, 113);
  hoop.addColorStop(0, "#ececec");
  hoop.addColorStop(0.35, "#8c8c8c");
  hoop.addColorStop(0.75, "#2a2a2a");
  hoop.addColorStop(1, "#0a0a0a");
  g.strokeStyle = hoop;
  g.lineWidth = 17;
  g.beginPath();
  g.ellipse(150, 82, 35, 31, 0, 0, Math.PI * 2);
  g.stroke();

  // 胴｡下へ広がる大きな塊｡まわりを白く抜いてから置く
  const mass = new Path2D();
  mass.moveTo(108, 118);
  mass.lineTo(192, 118);
  mass.quadraticCurveTo(206, 190, 224, 260);
  mass.quadraticCurveTo(150, 282, 76, 260);
  mass.quadraticCurveTo(94, 190, 108, 118);
  mass.closePath();
  g.strokeStyle = "#ffffff";
  g.lineWidth = 12;
  g.stroke(mass);
  const iron = g.createLinearGradient(76, 0, 224, 0);
  iron.addColorStop(0, "#f4f4f4");
  iron.addColorStop(0.22, "#b6b6b6");
  iron.addColorStop(0.5, "#606060");
  iron.addColorStop(0.82, "#212121");
  iron.addColorStop(1, "#070707");
  g.fillStyle = iron;
  g.fill(mass);

  // 肩｡環の付け根を白く切る
  g.strokeStyle = "rgba(252,252,252,0.88)";
  g.lineWidth = 6;
  g.beginPath();
  g.moveTo(110, 128);
  g.quadraticCurveTo(150, 140, 190, 128);
  g.stroke();

  // 照り｡胴に太い白帯をひとすじ｡面をベタにしない
  g.save();
  g.clip(mass);
  g.strokeStyle = "rgba(252,252,252,0.6)";
  g.lineWidth = 17;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(126, 136);
  g.quadraticCurveTo(114, 198, 102, 252);
  g.stroke();
  g.restore();
  g.restore();
};

/** 婚外の子は半分｡一本だけ抜いた活字の列｡抜けた分がそのまま空く */
const movableType: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  const W = 58;
  const D = 18;
  const TOP = 100;
  const BOT = 236;
  const FACE = TOP - 22;
  const slots = [22, 86, 150, 214];
  const gone = 2;

  // 抜けた場所｡明るく空けて､左の隣から影を落とす
  const hole = g.createLinearGradient(slots[gone], 0, slots[gone] + W + D, 0);
  hole.addColorStop(0, "#c2c2c2");
  hole.addColorStop(0.45, "#eeeeee");
  hole.addColorStop(1, "#f8f8f8");
  g.fillStyle = hole;
  g.beginPath();
  g.moveTo(slots[gone], BOT);
  g.lineTo(slots[gone] + D, BOT - 22);
  g.lineTo(slots[gone] + W + D, BOT - 22);
  g.lineTo(slots[gone] + W + D, FACE);
  g.lineTo(slots[gone] + W, TOP);
  g.closePath();
  g.fill();
  g.fillStyle = "rgba(12,12,12,0.55)";
  g.fillRect(slots[gone], TOP, 15, BOT - TOP);

  /** 活字一本｡前の面･右の面･上の字面の三つで組む */
  const sort = (x: number, mark: number) => {
    // 右の面｡奥へ回る面｡いちばん暗い
    const side = g.createLinearGradient(x + W, 0, x + W + D, 0);
    side.addColorStop(0, "#3c3c3c");
    side.addColorStop(1, "#090909");
    g.fillStyle = side;
    g.beginPath();
    g.moveTo(x + W, TOP);
    g.lineTo(x + W + D, FACE);
    g.lineTo(x + W + D, BOT - 22);
    g.lineTo(x + W, BOT);
    g.closePath();
    g.fill();

    // 前の面｡胴の塊
    const front = g.createLinearGradient(x, 0, x + W, 0);
    front.addColorStop(0, "#f2f2f2");
    front.addColorStop(0.28, "#ababab");
    front.addColorStop(0.72, "#3e3e3e");
    front.addColorStop(1, "#111111");
    g.fillStyle = front;
    g.fillRect(x, TOP, W, BOT - TOP);

    // ネッキ｡胴を一周する溝｡白く抜いて活字と分からせる
    g.strokeStyle = "rgba(252,252,252,0.86)";
    g.lineWidth = 7;
    g.beginPath();
    g.moveTo(x + 2, 206);
    g.lineTo(x + W - 2, 206);
    g.stroke();
    g.lineWidth = 4.4;
    g.beginPath();
    g.moveTo(x + W, 206);
    g.lineTo(x + W + D, 184);
    g.stroke();

    // 肩｡字面との境を白く切る
    g.strokeStyle = "rgba(252,252,252,0.9)";
    g.lineWidth = 5;
    g.beginPath();
    g.moveTo(x, TOP + 3);
    g.lineTo(x + W, TOP + 3);
    g.stroke();

    // 字面｡上を向いた面｡彫り残しを白く抜く
    const face = g.createLinearGradient(x, TOP, x + W + D, FACE);
    face.addColorStop(0, "#787878");
    face.addColorStop(0.5, "#2a2a2a");
    face.addColorStop(1, "#060606");
    g.fillStyle = face;
    g.beginPath();
    g.moveTo(x, TOP);
    g.lineTo(x + W, TOP);
    g.lineTo(x + W + D, FACE);
    g.lineTo(x + D, FACE);
    g.closePath();
    g.fill();

    // 字画｡面の傾きに合わせて引く｡一本ごとに違う形にする
    g.save();
    g.transform(1, 0, -D / 22, 1, (D / 22) * TOP, 0);
    g.fillStyle = "rgba(252,252,252,0.92)";
    if (mark === 0) {
      g.fillRect(x + 14, FACE + 4, 8, 14);
      g.fillRect(x + 36, FACE + 4, 8, 14);
    } else if (mark === 1) {
      g.fillRect(x + 12, FACE + 9, 34, 7);
      g.fillRect(x + 25, FACE + 3, 8, 16);
    } else {
      g.fillRect(x + 12, FACE + 4, 34, 7);
      g.fillRect(x + 30, FACE + 4, 8, 15);
    }
    g.restore();
  };
  slots.forEach((x, i) => {
    if (i !== gone) sort(x, i === 3 ? 2 : i);
  });

  // 込めの台｡活字を載せる一本｡上の縁を白く切る
  g.fillStyle = "#ffffff";
  g.fillRect(8, BOT, 286, 7);
  const rule = g.createLinearGradient(0, BOT + 6, 0, BOT + 30);
  rule.addColorStop(0, "#d2d2d2");
  rule.addColorStop(0.42, "#3a3a3a");
  rule.addColorStop(1, "#0a0a0a");
  g.fillStyle = rule;
  g.beginPath();
  g.moveTo(10, BOT + 6);
  g.lineTo(292, BOT + 6);
  g.lineTo(276, BOT + 30);
  g.lineTo(26, BOT + 30);
  g.closePath();
  g.fill();
  g.restore();
};

/** 女だけ半年は再婚できない｡砂時計｡上に半分残り､下へ落ちてゆく */
const hourglass: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 柱｡左右の二本｡先に置いて天地の板で押さえる
  const postGr = g.createLinearGradient(0, 52, 0, 256);
  postGr.addColorStop(0, "#d6d6d6");
  postGr.addColorStop(0.4, "#505050");
  postGr.addColorStop(1, "#101010");
  g.fillStyle = postGr;
  for (const x of [62, 222]) {
    g.beginPath();
    g.moveTo(x, 50);
    g.lineTo(x + 16, 50);
    g.lineTo(x + 13, 256);
    g.lineTo(x + 3, 256);
    g.closePath();
    g.fill();
  }

  // 硝子｡上下の球｡輪郭だけ引いて中は紙のまま残す
  const bulbTop = new Path2D();
  bulbTop.moveTo(94, 50);
  bulbTop.quadraticCurveTo(100, 126, 139, 148);
  bulbTop.lineTo(161, 148);
  bulbTop.quadraticCurveTo(200, 126, 206, 50);
  bulbTop.closePath();
  const bulbBot = new Path2D();
  bulbBot.moveTo(139, 156);
  bulbBot.lineTo(161, 156);
  bulbBot.quadraticCurveTo(200, 180, 206, 252);
  bulbBot.lineTo(94, 252);
  bulbBot.quadraticCurveTo(100, 180, 139, 156);
  bulbBot.closePath();

  const glass = g.createLinearGradient(94, 0, 206, 0);
  glass.addColorStop(0, "#fdfdfd");
  glass.addColorStop(0.5, "#f2f2f2");
  glass.addColorStop(1, "#d8d8d8");
  g.fillStyle = glass;
  g.fill(bulbTop);
  g.fill(bulbBot);
  g.strokeStyle = "rgba(14,14,14,0.85)";
  g.lineWidth = 5;
  g.stroke(bulbTop);
  g.stroke(bulbBot);

  // 上の砂｡半分だけ残す｡表は真ん中がくぼむ
  g.save();
  g.clip(bulbTop);
  const sand = g.createLinearGradient(0, 96, 0, 152);
  sand.addColorStop(0, "#949494");
  sand.addColorStop(0.35, "#4a4a4a");
  sand.addColorStop(1, "#0e0e0e");
  g.fillStyle = sand;
  g.beginPath();
  g.moveTo(84, 96);
  g.quadraticCurveTo(150, 124, 216, 96);
  g.lineTo(216, 156);
  g.lineTo(84, 156);
  g.closePath();
  g.fill();
  g.strokeStyle = "rgba(252,252,252,0.82)";
  g.lineWidth = 5;
  g.beginPath();
  g.moveTo(84, 96);
  g.quadraticCurveTo(150, 124, 216, 96);
  g.stroke();
  g.restore();

  // 落ちる砂｡細い一筋
  g.strokeStyle = "rgba(16,16,16,0.85)";
  g.lineWidth = 7;
  g.beginPath();
  g.moveTo(150, 148);
  g.lineTo(150, 214);
  g.stroke();

  // 下に溜まった砂｡小さな山｡表を白く切る
  g.save();
  g.clip(bulbBot);
  const heap = g.createLinearGradient(0, 206, 0, 252);
  heap.addColorStop(0, "#828282");
  heap.addColorStop(0.4, "#3a3a3a");
  heap.addColorStop(1, "#0b0b0b");
  g.fillStyle = heap;
  g.beginPath();
  g.moveTo(88, 254);
  g.lineTo(212, 254);
  g.lineTo(212, 230);
  g.quadraticCurveTo(150, 196, 88, 230);
  g.closePath();
  g.fill();
  g.strokeStyle = "rgba(252,252,252,0.78)";
  g.lineWidth = 5;
  g.beginPath();
  g.moveTo(90, 230);
  g.quadraticCurveTo(150, 198, 210, 230);
  g.stroke();
  g.restore();

  // 天板と地板｡塊で上下から挟む
  for (const [y, h] of [
    [30, 24],
    [250, 26],
  ] as const) {
    const gr = g.createLinearGradient(44, y, 256, y + h);
    gr.addColorStop(0, "#f0f0f0");
    gr.addColorStop(0.35, "#a0a0a0");
    gr.addColorStop(0.8, "#2c2c2c");
    gr.addColorStop(1, "#0c0c0c");
    rrect(g, 44, y, 212, h, 7);
    g.strokeStyle = "#ffffff";
    g.lineWidth = 9;
    g.stroke();
    g.fillStyle = gr;
    g.fill();
  }

  // 脚｡地板の下に二つ
  g.fillStyle = "#0b0b0b";
  g.fillRect(66, 276, 34, 13);
  g.fillRect(200, 276, 34, 13);
  g.restore();
};

export const PLATES_J: Record<string, Draw> = {
  "099": pairedBowls,
  "100": theodolite,
  "101": ballotBox,
  "102": blankDictation,
  "103": tallyStick,
  "104": carvedBoard,
  "105": lockedChest,
  "106": weight,
  "107": movableType,
  "108": hourglass,
};
