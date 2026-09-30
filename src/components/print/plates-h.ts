/**
 * 図版の版下（その八）｡
 *
 * ここでは網のことは考えず､灰色の絵として描く｡
 * 立体感は濃淡で出しておくと､網にかけたときに刷り物の肌になる｡
 * 座標は 300 四方で書いて､s で伸ばす｡枠いっぱいに大きく取る｡
 *
 * 人の姿は描かない｡奴隷制･人種隔離･同化政策は､制度の側の器物で指す｡
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

/**
 * NO.079 人を所有できる｡口の開いた足枷｡
 *
 * 人は描かず､制度が使った鉄の器物だけを置く｡
 * 蝶番から上の環を外へ振って開かせ､抜けた楔を左下に転がす｡
 * 環の内側は紙のまま白く空くので､輪郭が三秒で読める｡
 */
const shackle: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  const cx = 150;
  const cy = 148;
  const R = 88;
  const band = 38;

  // 鉄の肌｡左上から光を入れて右下へ落とす
  const iron = g.createLinearGradient(cx - R - band, cy - R, cx + R + band, cy + R);
  iron.addColorStop(0, "#f2f2f2");
  iron.addColorStop(0.26, "#b4b4b4");
  iron.addColorStop(0.58, "#4e4e4e");
  iron.addColorStop(1, "#0b0b0b");

  // 下側の環｡右の受け口から蝶番まで一本の太い弧
  g.strokeStyle = iron;
  g.lineWidth = band;
  g.lineCap = "butt";
  g.beginPath();
  g.arc(cx, cy, R, 0.02, Math.PI * 0.99);
  g.stroke();

  // 下側の受け口｡穴を白で抜いて楔が通る所を見せる
  g.fillStyle = iron;
  rrect(g, 224, 126, 32, 44, 9);
  g.fill();
  g.fillStyle = "#ffffff";
  g.beginPath();
  g.arc(240, 148, 8, 0, Math.PI * 2);
  g.fill();

  // 上側の環｡蝶番を軸に外へ振る
  g.save();
  g.translate(cx - R, cy);
  g.rotate(-0.52);
  g.translate(-(cx - R), -cy);

  // 開いて手前に来るぶん､少し明るくして下の環から離す
  const lift = g.createLinearGradient(cx - R - band, cy - R, cx + R + band, cy + R);
  lift.addColorStop(0, "#fafafa");
  lift.addColorStop(0.3, "#cccccc");
  lift.addColorStop(0.66, "#5e5e5e");
  lift.addColorStop(1, "#191919");
  g.strokeStyle = lift;
  g.lineWidth = band;
  g.beginPath();
  g.arc(cx, cy, R, Math.PI * 1.02, Math.PI * 1.99);
  g.stroke();

  // 上側の耳｡こちらも穴を白で抜く
  g.fillStyle = lift;
  rrect(g, 224, 128, 32, 40, 9);
  g.fill();
  g.fillStyle = "#ffffff";
  g.beginPath();
  g.arc(240, 148, 7.5, 0, Math.PI * 2);
  g.fill();
  g.restore();

  // 蝶番｡環の幅に収めて､まわりを白で切る
  g.strokeStyle = "#ffffff";
  g.lineWidth = 6;
  g.beginPath();
  g.arc(cx - R, cy, 23, 0, Math.PI * 2);
  g.stroke();
  const pivot = g.createRadialGradient(cx - R - 9, cy - 9, 3, cx - R, cy, 22);
  pivot.addColorStop(0, "#e8e8e8");
  pivot.addColorStop(0.5, "#6a6a6a");
  pivot.addColorStop(1, "#0d0d0d");
  g.fillStyle = pivot;
  g.beginPath();
  g.arc(cx - R, cy, 19, 0, Math.PI * 2);
  g.fill();

  // 鎖は一環だけ｡細かい環を連ねない
  const link = g.createLinearGradient(126, 250, 176, 298);
  link.addColorStop(0, "#d2d2d2");
  link.addColorStop(0.5, "#4a4a4a");
  link.addColorStop(1, "#101010");
  g.strokeStyle = link;
  g.lineWidth = 15;
  g.beginPath();
  g.ellipse(150, 272, 19, 25, 0, 0, Math.PI * 2);
  g.stroke();

  // 抜けた楔｡左下に一本だけ転がす
  g.save();
  g.translate(70, 266);
  g.rotate(0.3);
  const pin = g.createLinearGradient(0, -11, 0, 11);
  pin.addColorStop(0, "#efefef");
  pin.addColorStop(0.45, "#8e8e8e");
  pin.addColorStop(1, "#131313");
  g.fillStyle = pin;
  rrect(g, -44, -10, 90, 20, 10);
  g.fill();
  g.fillStyle = "#121212";
  g.beginPath();
  g.ellipse(-46, 0, 9, 17, 0, 0, Math.PI * 2);
  g.fill();
  g.restore();
  g.restore();
};

/**
 * NO.080 禁酒法｡封印の帯を十字に貼った酒樽｡
 *
 * 樽は明るい灰から右へ落とす一つの塊｡
 * 封緘の帯を白い太線で十字に渡すので､黒い胴がはっきり切れる｡
 * 交わる所に封蝋の丸をひとつだけ置く｡
 */
const cask: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 胴｡真ん中が張る一つの塊
  const body = new Path2D();
  body.moveTo(80, 68);
  body.bezierCurveTo(52, 122, 52, 214, 82, 272);
  body.lineTo(218, 272);
  body.bezierCurveTo(248, 214, 248, 122, 220, 68);
  body.closePath();

  const stave = g.createLinearGradient(52, 0, 248, 0);
  stave.addColorStop(0, "#efefef");
  stave.addColorStop(0.22, "#c6c6c6");
  stave.addColorStop(0.55, "#6e6e6e");
  stave.addColorStop(0.84, "#2c2c2c");
  stave.addColorStop(1, "#0d0d0d");
  g.fillStyle = stave;
  g.fill(body);

  g.save();
  g.clip(body);

  // 板の継ぎ目｡三本だけ白で入れる
  g.strokeStyle = "rgba(252,252,252,0.42)";
  g.lineWidth = 3.4;
  for (const x of [96, 150, 204]) {
    g.beginPath();
    g.moveTo(x, 66);
    g.lineTo(x, 274);
    g.stroke();
  }

  // 箍｡上と下に二本だけ｡真ん中は封印のために空ける
  for (const y of [92, 242]) {
    const hoop = g.createLinearGradient(52, 0, 248, 0);
    hoop.addColorStop(0, "#9c9c9c");
    hoop.addColorStop(0.3, "#3a3a3a");
    hoop.addColorStop(0.72, "#141414");
    hoop.addColorStop(1, "#000000");
    g.fillStyle = hoop;
    g.fillRect(40, y, 220, 22);
    g.fillStyle = "rgba(250,250,250,0.55)";
    g.fillRect(40, y, 220, 4);
  }

  // 封緘の帯｡白で十字に切る
  g.strokeStyle = "#fbfbfb";
  g.lineWidth = 25;
  g.lineCap = "butt";
  for (const [x0, y0, x1, y1] of [
    [62, 112, 238, 240],
    [238, 112, 62, 240],
  ] as const) {
    g.beginPath();
    g.moveTo(x0, y0);
    g.lineTo(x1, y1);
    g.stroke();
  }
  // 帯の紙の厚み｡ごく薄い芯を一本ずつ
  g.strokeStyle = "rgba(160,160,160,0.5)";
  g.lineWidth = 4;
  for (const [x0, y0, x1, y1] of [
    [62, 112, 238, 240],
    [238, 112, 62, 240],
  ] as const) {
    g.beginPath();
    g.moveTo(x0, y0);
    g.lineTo(x1, y1);
    g.stroke();
  }
  g.restore();

  // 胴の輪郭
  g.strokeStyle = "rgba(12,12,12,0.8)";
  g.lineWidth = 3.6;
  g.stroke(body);

  // 鏡板｡上から見える蓋の面
  const head = g.createLinearGradient(0, 48, 0, 90);
  head.addColorStop(0, "#fdfdfd");
  head.addColorStop(0.5, "#d0d0d0");
  head.addColorStop(1, "#6c6c6c");
  g.fillStyle = head;
  g.beginPath();
  g.ellipse(150, 68, 70, 21, 0, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "rgba(14,14,14,0.85)";
  g.lineWidth = 3.4;
  g.stroke();

  // 栓｡鏡板に一つだけ
  g.fillStyle = "#151515";
  g.beginPath();
  g.ellipse(180, 64, 14, 7, 0, 0, Math.PI * 2);
  g.fill();

  // 封蝋｡帯の交わる所に大きな丸ひとつ
  const wax = g.createRadialGradient(138, 164, 5, 150, 176, 40);
  wax.addColorStop(0, "#a6a6a6");
  wax.addColorStop(0.42, "#3c3c3c");
  wax.addColorStop(1, "#070707");
  g.fillStyle = wax;
  g.beginPath();
  g.arc(150, 176, 37, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "rgba(250,250,250,0.8)";
  g.lineWidth = 4.4;
  g.beginPath();
  g.arc(150, 176, 20, 0, Math.PI * 2);
  g.stroke();
  g.restore();
};

/**
 * NO.081 分離すれど平等｡同じ形で大きさの違う二つの水飲み場｡
 *
 * 人は描かず､制度が壁に取り付けた器物だけを並べる｡
 * 形はまったく同じで､右だけ小さく､台もない｡
 * 真ん中に壁の継ぎ目を一本立てて､二つを隔てる｡
 */
const fountains: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 壁｡ごく薄く沈めて器物を浮かせる
  const wall = g.createLinearGradient(0, 18, 0, 268);
  wall.addColorStop(0, "#ededed");
  wall.addColorStop(0.55, "#f7f7f7");
  wall.addColorStop(1, "#e4e4e4");
  g.fillStyle = wall;
  g.fillRect(0, 18, 300, 250);

  // 壁の上端の帯
  const cor = g.createLinearGradient(0, 18, 0, 40);
  cor.addColorStop(0, "#c6c6c6");
  cor.addColorStop(1, "#ebebeb");
  g.fillStyle = cor;
  g.fillRect(0, 18, 300, 22);

  // 床の線
  g.fillStyle = "rgba(24,24,24,0.4)";
  g.fillRect(0, 266, 300, 4);

  // 真ん中の隔て｡白い帯を細い線二本ではさむ
  g.strokeStyle = "rgba(20,20,20,0.5)";
  g.lineWidth = 4;
  for (const x of [168, 182]) {
    g.beginPath();
    g.moveTo(x, 40);
    g.lineTo(x, 266);
    g.stroke();
  }

  /** 水飲み場ひとつ｡鉢の縁の中心を原点にして描く */
  const unit = (tx: number, ty: number, k: number, pedestal: boolean) => {
    g.save();
    g.translate(tx, ty);
    g.scale(k, k);

    // 壁に落ちる影｡ぼかさずに薄い一枚で置く
    g.fillStyle = "rgba(26,26,26,0.14)";
    g.beginPath();
    g.ellipse(10, 16, 74, 34, 0, 0, Math.PI * 2);
    g.fill();

    // 台｡ある方だけ細い柱で床まで伸ばす
    if (pedestal) {
      const post = g.createLinearGradient(-26, 0, 26, 0);
      post.addColorStop(0, "#f0f0f0");
      post.addColorStop(0.32, "#a8a8a8");
      post.addColorStop(0.74, "#3a3a3a");
      post.addColorStop(1, "#111111");
      g.fillStyle = post;
      g.beginPath();
      g.moveTo(-16, 30);
      g.lineTo(-25, 102);
      g.lineTo(25, 102);
      g.lineTo(16, 30);
      g.closePath();
      g.fill();
    } else {
      // 台の代わりの受け金具
      g.fillStyle = "#1c1c1c";
      g.beginPath();
      g.moveTo(-17, 28);
      g.lineTo(0, 62);
      g.lineTo(17, 28);
      g.closePath();
      g.fill();
    }

    // 鉢の外側｡浅く広く取る
    const bowl = g.createLinearGradient(-62, 0, 62, 0);
    bowl.addColorStop(0, "#fafafa");
    bowl.addColorStop(0.3, "#bcbcbc");
    bowl.addColorStop(0.7, "#494949");
    bowl.addColorStop(1, "#131313");
    g.fillStyle = bowl;
    g.beginPath();
    g.moveTo(-62, 0);
    g.bezierCurveTo(-58, 22, -38, 32, 0, 32);
    g.bezierCurveTo(38, 32, 58, 22, 62, 0);
    g.closePath();
    g.fill();

    // 縁｡白く残して鉢と内がわを切る
    const rim = g.createLinearGradient(0, -16, 0, 16);
    rim.addColorStop(0, "#ffffff");
    rim.addColorStop(0.6, "#e0e0e0");
    rim.addColorStop(1, "#8e8e8e");
    g.fillStyle = rim;
    g.beginPath();
    g.ellipse(0, 0, 62, 16, 0, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = "rgba(14,14,14,0.85)";
    g.lineWidth = 3.4;
    g.stroke();

    // 内がわ｡奥が暗い窪み
    const hole = g.createRadialGradient(-12, -2, 3, 0, 4, 54);
    hole.addColorStop(0, "#6e6e6e");
    hole.addColorStop(0.5, "#2a2a2a");
    hole.addColorStop(1, "#0a0a0a");
    g.fillStyle = hole;
    g.beginPath();
    g.ellipse(0, 3, 49, 11, 0, 0, Math.PI * 2);
    g.fill();

    // 壁につく座金｡蛇口が壁から出ていることを見せる
    const plate = g.createLinearGradient(-22, 0, 22, 0);
    plate.addColorStop(0, "#fbfbfb");
    plate.addColorStop(0.5, "#b0b0b0");
    plate.addColorStop(1, "#4e4e4e");
    g.fillStyle = plate;
    rrect(g, -22, -112, 44, 26, 6);
    g.fill();
    g.strokeStyle = "rgba(14,14,14,0.7)";
    g.lineWidth = 3;
    g.stroke();

    // 蛇口｡壁から下りて手前へ曲がる一本
    const pipe = g.createLinearGradient(-9, 0, 9, 0);
    pipe.addColorStop(0, "#e6e6e6");
    pipe.addColorStop(0.45, "#141414");
    pipe.addColorStop(1, "#5a5a5a");
    g.strokeStyle = pipe;
    g.lineWidth = 16;
    g.lineCap = "butt";
    g.beginPath();
    g.moveTo(0, -100);
    g.lineTo(0, -60);
    g.quadraticCurveTo(2, -40, 26, -38);
    g.stroke();

    // 吐水口
    g.fillStyle = "#0f0f0f";
    rrect(g, 18, -46, 20, 18, 5);
    g.fill();

    // 落ちる水｡鉢まで届く一本の塊
    g.fillStyle = "rgba(44,44,44,0.55)";
    g.beginPath();
    g.moveTo(22, -26);
    g.lineTo(34, -26);
    g.lineTo(30, -2);
    g.lineTo(24, -2);
    g.closePath();
    g.fill();
    g.restore();
  };

  // 左｡台つきの大きいほう
  unit(94, 176, 1, true);
  // 右｡同じ形の小さいほう｡台がない
  unit(238, 168, 0.6, false);
  g.restore();
};

/**
 * NO.082 妻の姦通だけが離婚原因｡片方だけ貫木を打ちつけた二枚扉｡
 *
 * 同じ形･同じ大きさの扉が二枚｡左だけ明るい貫木で塞がれ､
 * 右は環を下げたまま開く｡真ん中は紙のまま白く空けて二枚を切る｡
 */
const barredDoor: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 上枠
  const lintel = g.createLinearGradient(0, 30, 0, 62);
  lintel.addColorStop(0, "#cfcfcf");
  lintel.addColorStop(0.45, "#4a4a4a");
  lintel.addColorStop(1, "#121212");
  g.fillStyle = lintel;
  g.fillRect(34, 30, 232, 32);

  // 左右の柱
  for (const x of [34, 242]) {
    const postG = g.createLinearGradient(x, 0, x + 24, 0);
    postG.addColorStop(0, "#dcdcdc");
    postG.addColorStop(0.5, "#3c3c3c");
    postG.addColorStop(1, "#0e0e0e");
    g.fillStyle = postG;
    g.fillRect(x, 60, 24, 202);
  }

  // 敷居｡明るくして下を重くしない
  const sill = g.createLinearGradient(0, 258, 0, 280);
  sill.addColorStop(0, "#f2f2f2");
  sill.addColorStop(1, "#8e8e8e");
  g.fillStyle = sill;
  g.fillRect(34, 258, 232, 22);
  g.strokeStyle = "rgba(14,14,14,0.7)";
  g.lineWidth = 3;
  g.strokeRect(34, 258, 232, 22);

  /** 扉一枚｡板目を白い継ぎ目で三枚に割る */
  const leaf = (x0: number, dark: boolean) => {
    const face = g.createLinearGradient(x0, 0, x0 + 88, 0);
    face.addColorStop(0, dark ? "#e2e2e2" : "#fbfbfb");
    face.addColorStop(0.34, dark ? "#9c9c9c" : "#cfcfcf");
    face.addColorStop(0.72, dark ? "#3a3a3a" : "#6e6e6e");
    face.addColorStop(1, dark ? "#0d0d0d" : "#2a2a2a");
    g.fillStyle = face;
    g.fillRect(x0, 62, 88, 196);
    g.strokeStyle = "rgba(12,12,12,0.8)";
    g.lineWidth = 3;
    g.strokeRect(x0, 62, 88, 196);
    g.strokeStyle = "rgba(252,252,252,0.62)";
    g.lineWidth = 3.4;
    for (const o of [29, 58]) {
      g.beginPath();
      g.moveTo(x0 + o, 64);
      g.lineTo(x0 + o, 256);
      g.stroke();
    }
  };

  leaf(58, true);
  leaf(154, false);

  // 貫木｡左の扉だけに渡す明るい一本
  const bar = g.createLinearGradient(0, 142, 0, 180);
  bar.addColorStop(0, "#ffffff");
  bar.addColorStop(0.42, "#d2d2d2");
  bar.addColorStop(1, "#767676");
  g.fillStyle = bar;
  rrect(g, 40, 142, 106, 38, 5);
  g.fill();
  g.strokeStyle = "rgba(12,12,12,0.85)";
  g.lineWidth = 3.4;
  g.stroke();

  // 打ちつけた釘｡頭を二つだけ
  for (const x of [68, 130]) {
    const nail = g.createRadialGradient(x - 4, 157, 2, x, 161, 12);
    nail.addColorStop(0, "#c8c8c8");
    nail.addColorStop(0.5, "#2e2e2e");
    nail.addColorStop(1, "#050505");
    g.fillStyle = nail;
    g.beginPath();
    g.arc(x, 161, 11, 0, Math.PI * 2);
    g.fill();
  }

  // 右の扉の引手｡座金と環｡白で一回り抜いて扉から離す
  g.strokeStyle = "#ffffff";
  g.lineWidth = 8;
  rrect(g, 180, 142, 38, 28, 5);
  g.stroke();
  g.beginPath();
  g.arc(199, 196, 27, 0, Math.PI * 2);
  g.stroke();
  g.fillStyle = "#101010";
  rrect(g, 180, 142, 38, 28, 5);
  g.fill();
  const ring = g.createLinearGradient(172, 0, 226, 0);
  ring.addColorStop(0, "#fafafa");
  ring.addColorStop(0.45, "#4a4a4a");
  ring.addColorStop(1, "#0c0c0c");
  g.strokeStyle = ring;
  g.lineWidth = 13;
  g.beginPath();
  g.arc(199, 196, 26, 0, Math.PI * 2);
  g.stroke();
  g.restore();
};

/**
 * NO.083 異人種間の結婚は無効｡抹消の二本線を引かれた婚姻の証書｡
 *
 * 紙は白く残し､文字は太い帯だけにして読ませない｡
 * 上を斜めに横切る二本の黒い帯が主役｡帯のまわりは白で切る｡
 */
const voided: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);
  g.translate(150, 150);
  g.rotate(-0.035);
  g.translate(-150, -150);

  // 紙の影
  g.fillStyle = "#dadada";
  g.fillRect(52, 44, 212, 228);

  // 紙
  const paper = g.createLinearGradient(0, 36, 0, 264);
  paper.addColorStop(0, "#ffffff");
  paper.addColorStop(0.6, "#f6f6f6");
  paper.addColorStop(1, "#e2e2e2");
  const sheet = new Path2D();
  sheet.rect(44, 36, 212, 228);
  g.fillStyle = paper;
  g.fill(sheet);
  g.strokeStyle = "rgba(14,14,14,0.55)";
  g.lineWidth = 2.6;
  g.stroke(sheet);

  // 罫の二重枠
  g.strokeStyle = "rgba(16,16,16,0.85)";
  g.lineWidth = 3.4;
  g.strokeRect(58, 50, 184, 200);
  g.strokeStyle = "rgba(24,24,24,0.4)";
  g.lineWidth = 1.8;
  g.strokeRect(66, 58, 168, 184);

  // 表題｡太い帯を二本だけ
  g.fillStyle = "rgba(16,16,16,0.88)";
  g.fillRect(104, 74, 92, 14);
  g.fillStyle = "rgba(20,20,20,0.6)";
  g.fillRect(122, 96, 56, 8);

  // 本文｡三行だけの帯
  g.fillStyle = "rgba(28,28,28,0.42)";
  for (const [y, w] of [
    [124, 140],
    [144, 140],
    [164, 104],
  ] as const) {
    g.fillRect(80, y, w, 9);
  }

  // 署名の欄｡名の帯と罫を左右に一つずつ
  for (const x of [78, 160]) {
    g.fillStyle = "rgba(24,24,24,0.5)";
    g.fillRect(x + 4, 198, 50, 8);
    g.fillStyle = "rgba(16,16,16,0.8)";
    g.fillRect(x, 214, 62, 3.6);
  }

  // 抹消の二本線｡紙の外へは出さない
  g.save();
  g.clip(sheet);
  g.translate(150, 150);
  g.rotate(-0.62);
  const strike = g.createLinearGradient(-170, 0, 170, 0);
  strike.addColorStop(0, "#565656");
  strike.addColorStop(0.42, "#0c0c0c");
  strike.addColorStop(1, "#3a3a3a");
  for (const y of [-50, 20] as const) {
    rrect(g, -180, y, 360, 30, 5);
    g.strokeStyle = "#ffffff";
    g.lineWidth = 11;
    g.stroke();
    g.fillStyle = strike;
    g.fill();
  }
  g.restore();
  g.restore();
};

/**
 * NO.084 親権は父が持つ｡家の鍵を一本だけ｡
 *
 * 弓の穴と刻みを紙の白で抜くので､細い線を使わずに鍵の形が出る｡
 * 斜めに寝かせて枠の対角いっぱいに取る｡
 */
const houseKey: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.translate(s / 2, s / 2);
  g.rotate(-0.36);
  g.translate(-s / 2, -s / 2);
  g.scale(u, u);

  const brass = g.createLinearGradient(100, 34, 246, 278);
  brass.addColorStop(0, "#f8f8f8");
  brass.addColorStop(0.26, "#c2c2c2");
  brass.addColorStop(0.62, "#5c5c5c");
  brass.addColorStop(1, "#0c0c0c");

  // 弓（持つ所）
  g.fillStyle = brass;
  rrect(g, 100, 34, 100, 106, 28);
  g.fill();
  g.strokeStyle = "rgba(12,12,12,0.85)";
  g.lineWidth = 3.6;
  g.stroke();

  // 弓の穴｡紙の白で抜く
  g.fillStyle = "#ffffff";
  rrect(g, 126, 60, 48, 54, 17);
  g.fill();
  g.strokeStyle = "rgba(14,14,14,0.6)";
  g.lineWidth = 2.6;
  g.stroke();

  // 軸
  g.fillStyle = brass;
  rrect(g, 132, 128, 36, 150, 10);
  g.fill();
  g.strokeStyle = "rgba(12,12,12,0.8)";
  g.lineWidth = 3.2;
  g.stroke();

  // 軸の照り｡白を一本通して黒い塊を切る
  g.fillStyle = "rgba(252,252,252,0.72)";
  g.fillRect(138, 134, 7, 138);

  // 留めの輪｡明るい帯で軸を切る
  const collar = g.createLinearGradient(0, 178, 0, 200);
  collar.addColorStop(0, "#ffffff");
  collar.addColorStop(0.5, "#cacaca");
  collar.addColorStop(1, "#6a6a6a");
  g.fillStyle = collar;
  rrect(g, 116, 178, 68, 22, 5);
  g.fill();
  g.strokeStyle = "rgba(12,12,12,0.8)";
  g.lineWidth = 3;
  g.stroke();

  // 刃（刻みのある板）
  g.fillStyle = brass;
  g.beginPath();
  g.moveTo(166, 208);
  g.lineTo(246, 208);
  g.lineTo(246, 276);
  g.lineTo(166, 276);
  g.closePath();
  g.fill();
  g.strokeStyle = "rgba(12,12,12,0.85)";
  g.lineWidth = 3.4;
  g.stroke();

  // 刻み｡二つだけを白で抜く
  g.fillStyle = "#ffffff";
  g.fillRect(190, 204, 24, 32);
  g.fillRect(218, 232, 32, 24);
  g.strokeStyle = "rgba(14,14,14,0.55)";
  g.lineWidth = 2.4;
  g.beginPath();
  g.moveTo(190, 236);
  g.lineTo(214, 236);
  g.lineTo(214, 206);
  g.stroke();
  g.beginPath();
  g.moveTo(218, 232);
  g.lineTo(218, 256);
  g.lineTo(248, 256);
  g.stroke();
  g.restore();
};

/**
 * NO.085 複婚は信仰の務め｡教会の尖塔｡
 *
 * 人も宗派の印も描かず､信仰の側の建物の一部だけを取る｡
 * 尖りは三つの面に割り､境目を白い筋で切って一つの塊のまま立たせる｡
 * 下は枠で断って､塔がまだ続くことにする｡
 */
const steeple: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 頂の飾り｡細い尖りと玉｡十字は置かない
  g.strokeStyle = "#151515";
  g.lineWidth = 6;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(150, 12);
  g.lineTo(150, 34);
  g.stroke();
  const knob = g.createRadialGradient(145, 36, 2, 150, 42, 14);
  knob.addColorStop(0, "#f2f2f2");
  knob.addColorStop(0.48, "#5e5e5e");
  knob.addColorStop(1, "#0a0a0a");
  g.fillStyle = knob;
  g.beginPath();
  g.arc(150, 42, 12, 0, Math.PI * 2);
  g.fill();

  const apex = 54;
  const base = 180;

  // 尖り｡左･正面･右の三つの面｡正面を白く残して右へ落とす
  for (const [x0, x1, c0, c1] of [
    [74, 116, "#d8d8d8", "#7a7a7a"],
    [116, 184, "#ffffff", "#c2c2c2"],
    [184, 226, "#6a6a6a", "#1e1e1e"],
  ] as const) {
    const face = g.createLinearGradient(0, apex, 0, base);
    face.addColorStop(0, c0);
    face.addColorStop(1, c1);
    g.fillStyle = face;
    g.beginPath();
    g.moveTo(150, apex);
    g.lineTo(x0, base);
    g.lineTo(x1, base);
    g.closePath();
    g.fill();
  }

  // 面の境目｡白で切って三つの面を離す
  g.strokeStyle = "#ffffff";
  g.lineWidth = 4.4;
  for (const x of [116, 184]) {
    g.beginPath();
    g.moveTo(150, apex + 6);
    g.lineTo(x, base);
    g.stroke();
  }

  // 尖りの輪郭
  g.strokeStyle = "rgba(10,10,10,0.85)";
  g.lineWidth = 3.6;
  g.beginPath();
  g.moveTo(150, apex);
  g.lineTo(74, base);
  g.lineTo(226, base);
  g.closePath();
  g.stroke();

  // 軒｡二段に張り出す
  const eaveA = g.createLinearGradient(0, 180, 0, 202);
  eaveA.addColorStop(0, "#fafafa");
  eaveA.addColorStop(0.45, "#bcbcbc");
  eaveA.addColorStop(1, "#3c3c3c");
  g.fillStyle = eaveA;
  g.fillRect(64, 180, 172, 22);
  const eaveB = g.createLinearGradient(52, 0, 248, 0);
  eaveB.addColorStop(0, "#efefef");
  eaveB.addColorStop(0.36, "#9a9a9a");
  eaveB.addColorStop(0.78, "#2c2c2c");
  eaveB.addColorStop(1, "#0c0c0c");
  g.fillStyle = eaveB;
  g.fillRect(52, 202, 196, 18);
  g.strokeStyle = "rgba(12,12,12,0.8)";
  g.lineWidth = 3.2;
  g.strokeRect(52, 202, 196, 18);

  // 軒と塔身のあいだは紙のまま白く空ける

  // 塔身｡下は枠で断ち切る
  const tower = g.createLinearGradient(74, 0, 226, 0);
  tower.addColorStop(0, "#fbfbfb");
  tower.addColorStop(0.3, "#cacaca");
  tower.addColorStop(0.68, "#5a5a5a");
  tower.addColorStop(1, "#111111");
  g.fillStyle = tower;
  g.fillRect(74, 228, 152, 72);
  g.strokeStyle = "rgba(12,12,12,0.8)";
  g.lineWidth = 3.4;
  g.beginPath();
  g.moveTo(74, 300);
  g.lineTo(74, 228);
  g.lineTo(226, 228);
  g.lineTo(226, 300);
  g.stroke();

  // 鐘楼の窓｡半円の頭を持つ窪み
  const win = new Path2D();
  win.moveTo(110, 300);
  win.lineTo(110, 278);
  win.arc(150, 278, 40, Math.PI, 0);
  win.lineTo(190, 300);
  win.closePath();
  const dark = g.createLinearGradient(110, 0, 190, 0);
  dark.addColorStop(0, "#3a3a3a");
  dark.addColorStop(0.5, "#0d0d0d");
  dark.addColorStop(1, "#020202");
  g.fillStyle = dark;
  g.fill(win);

  // 鎧戸｡太い白い板を三枚だけ渡して窪みを切る
  g.save();
  g.clip(win);
  g.fillStyle = "rgba(250,250,250,0.86)";
  for (const y of [256, 276, 296]) {
    g.beginPath();
    g.moveTo(102, y);
    g.lineTo(198, y - 9);
    g.lineTo(198, y + 4);
    g.lineTo(102, y + 13);
    g.closePath();
    g.fill();
  }
  g.restore();

  // 窓の縁
  g.strokeStyle = "rgba(10,10,10,0.85)";
  g.lineWidth = 3.4;
  g.stroke(win);
  g.restore();
};

/**
 * NO.086 産めよ殖やせよ｡割れた石榴｡粒は五つだけ｡
 *
 * 多産の実を一つ大きく置く｡割れ口のまわりに白い綿の帯を回して
 * 皮と中身をはっきり切る｡粒は一夫婦五児に合わせて五つだけ大きく置く｡
 */
const pomegranate: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 実｡左上から光を入れて右下へ落とす一つの塊
  const skin = g.createRadialGradient(92, 110, 12, 150, 186, 200);
  skin.addColorStop(0, "#fafafa");
  skin.addColorStop(0.3, "#cdcdcd");
  skin.addColorStop(0.66, "#5a5a5a");
  skin.addColorStop(1, "#111111");
  const fruit = new Path2D();
  fruit.ellipse(150, 178, 112, 106, 0, 0, Math.PI * 2);
  g.fillStyle = skin;
  g.fill(fruit);

  // 蕚｡筒と五つの尖り｡石榴と読ませる目印なので大きく取る
  const calyx = g.createLinearGradient(118, 0, 182, 0);
  calyx.addColorStop(0, "#d4d4d4");
  calyx.addColorStop(0.44, "#3c3c3c");
  calyx.addColorStop(1, "#080808");
  g.fillStyle = calyx;
  g.beginPath();
  g.moveTo(120, 92);
  g.lineTo(130, 46);
  g.lineTo(170, 46);
  g.lineTo(180, 92);
  g.closePath();
  g.fill();
  for (const a of [-2.52, -2.05, -1.57, -1.09, -0.62]) {
    const px = 150 + Math.cos(a) * 42;
    const py = 54 + Math.sin(a) * 42;
    const nx = -Math.sin(a) * 15;
    const ny = Math.cos(a) * 15;
    g.beginPath();
    g.moveTo(px, py);
    g.lineTo(150 + nx, 56 + ny);
    g.lineTo(150 - nx, 56 - ny);
    g.closePath();
    g.fill();
  }

  // 皮の照り｡上のほうに一枚だけ
  g.fillStyle = "rgba(255,255,255,0.5)";
  g.beginPath();
  g.ellipse(100, 130, 40, 22, -0.5, 0, Math.PI * 2);
  g.fill();

  g.save();
  g.clip(fruit);

  /** 割れ口｡右の皮が破れて外へ抜ける｡皮は左と下に残す｡o だけ外へ膨らむ */
  const tear = (o: number) => {
    const p = new Path2D();
    p.moveTo(118 - o, 132);
    p.bezierCurveTo(94 - o, 180, 108, 220 + o, 148, 238 + o);
    p.bezierCurveTo(192, 258, 246, 234, 272, 184);
    p.bezierCurveTo(292, 140, 262, 108, 212, 100 - o);
    p.bezierCurveTo(170, 92 - o, 134, 104 - o, 118 - o, 132);
    p.closePath();
    return p;
  };

  // 綿｡白で皮と中身をはっきり切る
  g.fillStyle = "#fafafa";
  g.fill(tear(13));

  // 中の室｡暗い窪み
  const inner = g.createRadialGradient(136, 128, 8, 168, 172, 122);
  inner.addColorStop(0, "#606060");
  inner.addColorStop(0.42, "#1e1e1e");
  inner.addColorStop(1, "#030303");
  const cavity = tear(0);
  g.fillStyle = inner;
  g.fill(cavity);

  // 粒｡五つだけ｡先の尖った粒を大きさも向きも変えて置き､白い縁で一つずつ離す
  g.save();
  g.clip(cavity);
  for (const [x, y, r, rot] of [
    [124, 136, 25, -0.62],
    [182, 118, 23, 0.42],
    [222, 164, 24, 1.05],
    [168, 184, 27, -0.18],
    [120, 208, 22, 0.34],
  ] as const) {
    g.save();
    g.translate(x, y);
    g.rotate(rot);
    g.beginPath();
    g.moveTo(0, -r);
    g.quadraticCurveTo(r * 0.98, -r * 0.44, r * 0.82, r * 0.38);
    g.quadraticCurveTo(r * 0.42, r, 0, r);
    g.quadraticCurveTo(-r * 0.42, r, -r * 0.82, r * 0.38);
    g.quadraticCurveTo(-r * 0.98, -r * 0.44, 0, -r);
    g.closePath();
    g.strokeStyle = "#fbfbfb";
    g.lineWidth = 10;
    g.stroke();
    const aril = g.createRadialGradient(-r * 0.34, -r * 0.4, 2, 0, 0, r * 1.3);
    aril.addColorStop(0, "#ffffff");
    aril.addColorStop(0.46, "#c6c6c6");
    aril.addColorStop(1, "#4e4e4e");
    g.fillStyle = aril;
    g.fill();
    g.restore();
  }
  g.restore();
  g.restore();

  // 実の輪郭
  g.strokeStyle = "rgba(10,10,10,0.7)";
  g.lineWidth = 3.4;
  g.stroke(fruit);
  g.restore();
};

/**
 * NO.087 贈り与えるのは野蛮｡贈与の儀礼で贈られた銅の板｡
 *
 * 禁じられた側の器物を､敬意をもって枠いっぱいに正面から据える｡
 * 上が広く下が締まる銅板の形をそのまま取り､面には打ち出しの稜をT字に
 * 一本だけ通す｡その土地の文様は真似ない｡
 */
const copperPlate: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.translate(s / 2, s / 2);
  g.rotate(-0.075);
  g.translate(-s / 2, -s / 2);
  g.scale(u, u);

  /** 板の輪郭｡上が広く､稜の所で一段締まり､そこから裾へまた張る */
  const outline = () => {
    g.beginPath();
    g.moveTo(62, 62);
    g.quadraticCurveTo(62, 44, 82, 42);
    g.quadraticCurveTo(150, 32, 218, 42);
    g.quadraticCurveTo(238, 44, 238, 62);
    g.lineTo(224, 138);
    g.lineTo(210, 156);
    g.quadraticCurveTo(214, 216, 220, 272);
    g.quadraticCurveTo(150, 284, 80, 272);
    g.quadraticCurveTo(86, 216, 90, 156);
    g.lineTo(76, 138);
    g.closePath();
  };

  // 板の地｡薄い一枚の金属として横から光を当てる（上下に振らない）
  const metal = g.createLinearGradient(62, 0, 238, 0);
  metal.addColorStop(0, "#f0f0f0");
  metal.addColorStop(0.16, "#fcfcfc");
  metal.addColorStop(0.44, "#c4c4c4");
  metal.addColorStop(0.72, "#787878");
  metal.addColorStop(0.9, "#2e2e2e");
  metal.addColorStop(1, "#101010");
  outline();
  g.fillStyle = metal;
  g.fill();
  g.save();
  g.clip();

  // 叩いた面の照り｡斜めの広い帯を一本だけ
  g.save();
  g.translate(150, 150);
  g.rotate(-1.05);
  g.fillStyle = "rgba(255,255,255,0.42)";
  g.fillRect(-190, -122, 380, 52);
  g.restore();

  // 横の稜｡明るい山と暗い谷でT字の横棒を出す
  g.fillStyle = "rgba(252,252,252,0.92)";
  g.fillRect(56, 134, 192, 12);
  g.fillStyle = "rgba(14,14,14,0.62)";
  g.fillRect(56, 146, 192, 15);

  // 縦の稜｡裾まで一本
  g.fillStyle = "rgba(252,252,252,0.92)";
  g.fillRect(135, 158, 15, 122);
  g.fillStyle = "rgba(14,14,14,0.62)";
  g.fillRect(150, 158, 17, 122);
  g.restore();

  // 縁｡輪郭と､内側に一回り小さい二重線
  outline();
  g.strokeStyle = "rgba(10,10,10,0.85)";
  g.lineWidth = 4.4;
  g.stroke();
  g.save();
  g.translate(150, 160);
  g.scale(0.89, 0.89);
  g.translate(-150, -160);
  outline();
  g.strokeStyle = "rgba(252,252,252,0.8)";
  g.lineWidth = 6;
  g.stroke();
  outline();
  g.strokeStyle = "rgba(14,14,14,0.45)";
  g.lineWidth = 2.4;
  g.stroke();
  g.restore();
  g.restore();
};

/**
 * NO.088 子は親から離して育てる｡校舎の梁に吊った鐘｡
 *
 * 人は描かず､子を集めた側の器物を描く｡
 * 鐘は左から右へ落ちる一つの塊｡胴に白い帯を二本回して切る｡
 * 引き綱は右へ寄せて､鐘の輪郭にかからないようにする｡
 */
const schoolBell: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 鐘楼の柱｡枠の上へ抜ける
  for (const x of [46, 230]) {
    const leg = g.createLinearGradient(x, 0, x + 24, 0);
    leg.addColorStop(0, "#cacaca");
    leg.addColorStop(0.5, "#3a3a3a");
    leg.addColorStop(1, "#0d0d0d");
    g.fillStyle = leg;
    g.fillRect(x, 20, 24, 38);
  }

  // 梁
  const beam = g.createLinearGradient(0, 52, 0, 86);
  beam.addColorStop(0, "#fafafa");
  beam.addColorStop(0.4, "#b4b4b4");
  beam.addColorStop(0.8, "#3c3c3c");
  beam.addColorStop(1, "#141414");
  g.fillStyle = beam;
  rrect(g, 36, 52, 228, 34, 5);
  g.fill();
  g.strokeStyle = "rgba(12,12,12,0.85)";
  g.lineWidth = 3.4;
  g.stroke();

  // 吊り金具と環
  const hang = g.createLinearGradient(134, 0, 166, 0);
  hang.addColorStop(0, "#dedede");
  hang.addColorStop(0.5, "#2a2a2a");
  hang.addColorStop(1, "#0a0a0a");
  g.fillStyle = hang;
  g.fillRect(136, 86, 28, 26);
  g.strokeStyle = hang;
  g.lineWidth = 9;
  g.beginPath();
  g.arc(150, 120, 13, 0, Math.PI * 2);
  g.stroke();

  // 舌｡口から少しだけ覗かせる
  const tongue = g.createRadialGradient(144, 244, 3, 150, 250, 20);
  tongue.addColorStop(0, "#9a9a9a");
  tongue.addColorStop(0.5, "#2a2a2a");
  tongue.addColorStop(1, "#060606");
  g.fillStyle = tongue;
  g.beginPath();
  g.ellipse(150, 250, 15, 18, 0, 0, Math.PI * 2);
  g.fill();

  // 鐘の胴
  const bell = new Path2D();
  bell.moveTo(118, 132);
  bell.bezierCurveTo(112, 178, 84, 202, 64, 228);
  bell.quadraticCurveTo(150, 254, 236, 228);
  bell.bezierCurveTo(216, 202, 188, 178, 182, 132);
  bell.quadraticCurveTo(150, 122, 118, 132);
  bell.closePath();

  const cast = g.createLinearGradient(64, 0, 236, 0);
  cast.addColorStop(0, "#f8f8f8");
  cast.addColorStop(0.26, "#c8c8c8");
  cast.addColorStop(0.64, "#4e4e4e");
  cast.addColorStop(1, "#0f0f0f");
  g.fillStyle = cast;
  g.fill(bell);

  // 胴の帯｡白で二本切る
  g.save();
  g.clip(bell);
  g.fillStyle = "rgba(252,252,252,0.72)";
  g.fillRect(56, 168, 192, 10);
  g.fillRect(56, 204, 192, 10);
  g.restore();

  // 口の縁｡太い一本
  const lip = g.createLinearGradient(64, 0, 236, 0);
  lip.addColorStop(0, "#a8a8a8");
  lip.addColorStop(0.4, "#2c2c2c");
  lip.addColorStop(1, "#050505");
  g.strokeStyle = lip;
  g.lineWidth = 19;
  g.lineCap = "butt";
  g.beginPath();
  g.moveTo(64, 228);
  g.quadraticCurveTo(150, 254, 236, 228);
  g.stroke();

  g.strokeStyle = "rgba(10,10,10,0.85)";
  g.lineWidth = 3.6;
  g.stroke(bell);

  // 肩｡明るい面をひとつ置いて金具と胴を切る
  const crown = g.createLinearGradient(0, 122, 0, 144);
  crown.addColorStop(0, "#ffffff");
  crown.addColorStop(0.6, "#d8d8d8");
  crown.addColorStop(1, "#8a8a8a");
  g.fillStyle = crown;
  g.beginPath();
  g.ellipse(150, 133, 33, 11, 0, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "rgba(12,12,12,0.8)";
  g.lineWidth = 3;
  g.stroke();

  // 引き綱｡右へ寄せて胴から離す
  const rope = g.createLinearGradient(244, 0, 272, 0);
  rope.addColorStop(0, "#d8d8d8");
  rope.addColorStop(0.45, "#2e2e2e");
  rope.addColorStop(1, "#0c0c0c");
  g.strokeStyle = rope;
  g.lineWidth = 10;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(246, 84);
  g.bezierCurveTo(272, 142, 256, 206, 264, 264);
  g.stroke();
  g.fillStyle = "#101010";
  g.beginPath();
  g.ellipse(264, 276, 14, 18, 0, 0, Math.PI * 2);
  g.fill();
  g.restore();
};

export const PLATES_H: Record<string, Draw> = {
  "079": shackle,
  "080": cask,
  "081": fountains,
  "082": barredDoor,
  "083": voided,
  "084": houseKey,
  "085": steeple,
  "086": pomegranate,
  "087": copperPlate,
  "088": schoolBell,
};
