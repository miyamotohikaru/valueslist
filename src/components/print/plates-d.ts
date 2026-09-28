/**
 * 図版の版下（その四）｡
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

/** 推し活｡斜めに立てたペンライト */
const penlight: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.translate(s / 2, s / 2);
  g.rotate(-0.3);
  g.translate(-s / 2, -s / 2);
  g.scale(u, u);

  // 光る筒｡真ん中を白く抜いて､両縁で沈める
  const tube = g.createLinearGradient(114, 0, 186, 0);
  tube.addColorStop(0, "#8f8f8f");
  tube.addColorStop(0.2, "#f2f2f2");
  tube.addColorStop(0.46, "#ffffff");
  tube.addColorStop(0.74, "#e6e6e6");
  tube.addColorStop(1, "#7c7c7c");
  g.fillStyle = tube;
  rrect(g, 114, 54, 72, 130, 34);
  g.fill();
  g.strokeStyle = "rgba(18,18,18,0.7)";
  g.lineWidth = 3.4;
  g.stroke();

  // 筒の中の輪｡光が段になって溜まる
  g.save();
  rrect(g, 114, 54, 72, 130, 34);
  g.clip();
  for (let i = 0; i < 4; i++) {
    const y = 82 + i * 27;
    const ring = g.createLinearGradient(0, y - 8, 0, y + 8);
    ring.addColorStop(0, "rgba(250,250,250,0)");
    ring.addColorStop(0.5, "rgba(118,118,118,0.55)");
    ring.addColorStop(1, "rgba(250,250,250,0)");
    g.fillStyle = ring;
    g.fillRect(108, y - 8, 84, 16);
  }
  g.restore();

  // 口金｡筒と握りの継ぎ目
  const collar = g.createLinearGradient(106, 0, 194, 0);
  collar.addColorStop(0, "#585858");
  collar.addColorStop(0.32, "#dadada");
  collar.addColorStop(0.68, "#3c3c3c");
  collar.addColorStop(1, "#0f0f0f");
  g.fillStyle = collar;
  rrect(g, 106, 176, 88, 24, 7);
  g.fill();

  // 握り
  const grip = g.createLinearGradient(118, 0, 182, 0);
  grip.addColorStop(0, "#6b6b6b");
  grip.addColorStop(0.3, "#111111");
  grip.addColorStop(0.68, "#3e3e3e");
  grip.addColorStop(1, "#0c0c0c");
  g.fillStyle = grip;
  rrect(g, 118, 198, 64, 74, 20);
  g.fill();

  // 押しぼたん
  g.fillStyle = "rgba(244,244,244,0.82)";
  rrect(g, 137, 212, 26, 17, 6);
  g.fill();

  // 尻の帯
  g.fillStyle = "rgba(228,228,228,0.6)";
  g.fillRect(124, 254, 52, 6);

  // 先から散る光｡横へ振って枠の外に出さない
  g.strokeStyle = "rgba(24,24,24,0.45)";
  g.lineWidth = 4.2;
  g.lineCap = "round";
  for (const a of [-1.55, -1.25, -0.95, 0.95, 1.25, 1.55]) {
    const dx = Math.sin(a);
    const dy = -Math.cos(a);
    g.beginPath();
    g.moveTo(150 + dx * 36, 54 + dy * 36);
    g.lineTo(150 + dx * 54, 54 + dy * 54);
    g.stroke();
  }
  g.restore();
};

/** 婚活｡画面に心臓形が出た携帯 */
const phoneHeart: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 筐体
  const shell = g.createRadialGradient(100, 46, 14, 150, 160, 240);
  shell.addColorStop(0, "#7c7c7c");
  shell.addColorStop(0.42, "#2a2a2a");
  shell.addColorStop(1, "#080808");
  g.fillStyle = shell;
  rrect(g, 74, 20, 152, 262, 28);
  g.fill();

  // 受話口
  g.fillStyle = "rgba(226,226,226,0.6)";
  rrect(g, 132, 30, 36, 7, 3.5);
  g.fill();

  // 画面｡白く残して下へ沈める
  const screen = g.createLinearGradient(0, 44, 0, 258);
  screen.addColorStop(0, "#fdfdfd");
  screen.addColorStop(0.55, "#efefef");
  screen.addColorStop(1, "#c8c8c8");
  g.fillStyle = screen;
  rrect(g, 88, 44, 124, 214, 14);
  g.fill();

  // 心臓形｡画面の中にひとつだけ
  g.save();
  rrect(g, 88, 44, 124, 214, 14);
  g.clip();
  const heart = g.createRadialGradient(120, 112, 6, 150, 172, 116);
  heart.addColorStop(0, "#a4a4a4");
  heart.addColorStop(0.4, "#3a3a3a");
  heart.addColorStop(1, "#0a0a0a");
  g.fillStyle = heart;
  g.beginPath();
  g.moveTo(150, 204);
  g.bezierCurveTo(74, 168, 76, 76, 150, 118);
  g.bezierCurveTo(224, 76, 226, 168, 150, 204);
  g.closePath();
  g.fill();
  // 照り
  g.fillStyle = "rgba(252,252,252,0.72)";
  g.beginPath();
  g.ellipse(120, 126, 15, 9, -0.7, 0, Math.PI * 2);
  g.fill();
  g.restore();

  // 下の帯
  g.fillStyle = "rgba(232,232,232,0.72)";
  rrect(g, 128, 266, 44, 7, 3.5);
  g.fill();
  g.restore();
};

/** 終活｡斜め上から見た帳面と万年筆 */
const notebook: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 栞の紐｡帳面の下から出るので先に置く
  const cord = g.createLinearGradient(134, 0, 180, 0);
  cord.addColorStop(0, "#3c3c3c");
  cord.addColorStop(0.5, "#161616");
  cord.addColorStop(1, "#303030");
  g.fillStyle = cord;
  g.beginPath();
  g.moveTo(136, 214);
  g.quadraticCurveTo(132, 250, 146, 278);
  g.lineTo(178, 268);
  g.quadraticCurveTo(164, 244, 170, 214);
  g.closePath();
  g.fill();
  g.fillStyle = "#fbfbfb";
  g.beginPath();
  g.moveTo(146, 278);
  g.lineTo(162, 264);
  g.lineTo(178, 268);
  g.lineTo(158, 286);
  g.closePath();
  g.fill();

  // 帳面｡斜めに寝かせて上から見る
  g.save();
  g.translate(150, 136);
  g.rotate(-0.13);
  const W = 98;
  const V = 96;
  const dx = 9;
  const dy = 14;

  // 紙束｡厚みは白く残して線だけで見せる
  g.fillStyle = "#fcfcfc";
  g.fillRect(-W + dx, -V + dy, W * 2, V * 2);
  g.strokeStyle = "rgba(14,14,14,0.85)";
  g.lineWidth = 3;
  g.strokeRect(-W + dx, -V + dy, W * 2, V * 2);
  g.strokeStyle = "rgba(26,26,26,0.32)";
  g.lineWidth = 1.6;
  for (let i = 1; i < 4; i++) {
    const t = i / 4;
    g.strokeRect(-W + dx * t, -V + dy * t, W * 2, V * 2);
  }

  // 表紙｡明るい灰の一枚板にして､潰れる面を作らない
  const cover = g.createLinearGradient(-W, -V, W, V);
  cover.addColorStop(0, "#f2f2f2");
  cover.addColorStop(0.5, "#dcdcdc");
  cover.addColorStop(1, "#bebebe");
  g.fillStyle = cover;
  g.fillRect(-W, -V, W * 2, V * 2);
  g.strokeStyle = "rgba(12,12,12,0.9)";
  g.lineWidth = 3.8;
  g.strokeRect(-W, -V, W * 2, V * 2);

  // 背の綴じ帯｡黒いのはここと栞だけ
  const band = g.createLinearGradient(-W, 0, -W + 40, 0);
  band.addColorStop(0, "#3a3a3a");
  band.addColorStop(0.5, "#191919");
  band.addColorStop(1, "#2c2c2c");
  g.fillStyle = band;
  g.fillRect(-W, -V, 40, V * 2);

  // 帯のとなりは白く空ける
  g.strokeStyle = "#fbfbfb";
  g.lineWidth = 6;
  g.beginPath();
  g.moveTo(-W + 45, -V + 4);
  g.lineTo(-W + 45, V - 4);
  g.stroke();

  // 題箋｡白い札をひとつだけ置く
  g.fillStyle = "#fcfcfc";
  g.fillRect(-26, 20, 104, 52);
  g.strokeStyle = "rgba(14,14,14,0.85)";
  g.lineWidth = 3;
  g.strokeRect(-26, 20, 104, 52);
  g.fillStyle = "rgba(22,22,22,0.8)";
  g.fillRect(-12, 41, 76, 8);
  g.restore();

  // 万年筆｡画面を斜めに横切る一本の塊｡まわりを白く空けて表紙から離す
  g.save();
  g.translate(150, 108);
  g.rotate(-0.42);
  g.fillStyle = "#ffffff";
  rrect(g, -126, -17, 258, 34, 17);
  g.fill();

  const barrel = g.createLinearGradient(0, -11, 0, 11);
  barrel.addColorStop(0, "#5e5e5e");
  barrel.addColorStop(0.34, "#141414");
  barrel.addColorStop(0.8, "#3e3e3e");
  barrel.addColorStop(1, "#111111");
  g.fillStyle = barrel;
  rrect(g, -118, -11, 196, 22, 11);
  g.fill();
  // 軸の照り
  g.fillStyle = "rgba(242,242,242,0.85)";
  g.fillRect(-108, -8, 176, 4);
  // 帽子の帯
  g.fillStyle = "#ededed";
  g.fillRect(6, -12, 16, 24);

  // ペン先
  const nib = g.createLinearGradient(78, 0, 126, 0);
  nib.addColorStop(0, "#f6f6f6");
  nib.addColorStop(0.5, "#b0b0b0");
  nib.addColorStop(1, "#242424");
  g.fillStyle = nib;
  g.beginPath();
  g.moveTo(78, -11);
  g.quadraticCurveTo(110, -8, 126, 0);
  g.quadraticCurveTo(110, 8, 78, 11);
  g.closePath();
  g.fill();
  g.strokeStyle = "rgba(18,18,18,0.8)";
  g.lineWidth = 2.4;
  g.beginPath();
  g.moveTo(86, 0);
  g.lineTo(120, 0);
  g.stroke();
  g.restore();
  g.restore();
};

/** 親ガチャ｡合わせ目のあるカプセル */
const capsule: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);
  const cx = 150;
  const cy = 150;
  const R = 118;

  // 下半分｡色の濃いほう
  const under = g.createRadialGradient(104, 178, 10, cx, 200, 158);
  under.addColorStop(0, "#9a9a9a");
  under.addColorStop(0.34, "#3c3c3c");
  under.addColorStop(1, "#060606");
  g.fillStyle = under;
  g.beginPath();
  g.arc(cx, cy, R, 0, Math.PI);
  g.closePath();
  g.fill();

  // 上半分｡透けるほう｡白く残して右へ落とす
  const over = g.createRadialGradient(108, 88, 8, cx, 136, 170);
  over.addColorStop(0, "#ffffff");
  over.addColorStop(0.46, "#f0f0f0");
  over.addColorStop(0.86, "#cfcfcf");
  over.addColorStop(1, "#9c9c9c");
  g.fillStyle = over;
  g.beginPath();
  g.arc(cx, cy, R, Math.PI, Math.PI * 2);
  g.closePath();
  g.fill();
  g.strokeStyle = "rgba(16,16,16,0.82)";
  g.lineWidth = 4.2;
  g.beginPath();
  g.arc(cx, cy, R - 2, Math.PI, Math.PI * 2);
  g.stroke();

  // 殻の厚み｡内側に沿う影
  g.strokeStyle = "rgba(22,22,22,0.34)";
  g.lineWidth = 11;
  g.beginPath();
  g.arc(cx, cy, R - 16, Math.PI * 1.04, Math.PI * 1.46);
  g.stroke();

  // 合わせ目｡受け口が少し張り出す
  const lip = g.createLinearGradient(cx - 124, 0, cx + 124, 0);
  lip.addColorStop(0, "#1d1d1d");
  lip.addColorStop(0.24, "#e2e2e2");
  lip.addColorStop(0.58, "#6a6a6a");
  lip.addColorStop(1, "#0d0d0d");
  g.fillStyle = lip;
  g.beginPath();
  g.ellipse(cx, cy, 124, 16, 0, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "rgba(10,10,10,0.8)";
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(cx - 124, cy);
  g.lineTo(cx + 124, cy);
  g.stroke();
  g.restore();
};

/** 好きなことで､生きていく｡スタンドに立つマイク */
const microphone: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 支柱｡台に差さるので先に置く｡長く太く取る
  const post = g.createLinearGradient(138, 0, 162, 0);
  post.addColorStop(0, "#a2a2a2");
  post.addColorStop(0.4, "#1c1c1c");
  post.addColorStop(1, "#4e4e4e");
  g.fillStyle = post;
  g.fillRect(140, 182, 20, 74);

  // 台｡横に長い楕円ひとつ
  const base = g.createLinearGradient(0, 248, 0, 280);
  base.addColorStop(0, "#e6e6e6");
  base.addColorStop(0.42, "#909090");
  base.addColorStop(1, "#242424");
  g.fillStyle = base;
  g.beginPath();
  g.ellipse(150, 264, 100, 16, 0, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "rgba(12,12,12,0.85)";
  g.lineWidth = 3.4;
  g.stroke();

  // 胴｡絞りをはっきり出して球と台をつなぐ
  const body = g.createLinearGradient(118, 0, 182, 0);
  body.addColorStop(0, "#f2f2f2");
  body.addColorStop(0.3, "#aaaaaa");
  body.addColorStop(0.68, "#363636");
  body.addColorStop(1, "#1c1c1c");
  g.fillStyle = body;
  g.beginPath();
  g.moveTo(122, 150);
  g.lineTo(178, 150);
  g.lineTo(164, 188);
  g.lineTo(136, 188);
  g.closePath();
  g.fill();
  g.strokeStyle = "rgba(12,12,12,0.85)";
  g.lineWidth = 3.4;
  g.stroke();

  // 締め輪｡白く一本入れて胴を切る
  g.fillStyle = "#fbfbfb";
  g.fillRect(125, 160, 50, 8);

  // 球｡明るい灰から濃い灰へ落とす塊｡点では埋めない
  const head = g.createRadialGradient(120, 50, 8, 158, 90, 116);
  head.addColorStop(0, "#fafafa");
  head.addColorStop(0.34, "#d2d2d2");
  head.addColorStop(0.7, "#8c8c8c");
  head.addColorStop(1, "#4a4a4a");
  g.fillStyle = head;
  g.beginPath();
  g.ellipse(150, 80, 58, 62, 0, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "rgba(10,10,10,0.9)";
  g.lineWidth = 4.2;
  g.stroke();

  // 網目｡太い斜めを三本ずつだけ｡白を敷いて黒を重ねる
  g.save();
  g.beginPath();
  g.ellipse(150, 80, 54, 58, 0, 0, Math.PI * 2);
  g.clip();
  for (const [c, lw] of [
    ["rgba(252,252,252,0.8)", 14],
    ["rgba(16,16,16,0.5)", 6],
  ] as const) {
    g.strokeStyle = c;
    g.lineWidth = lw;
    for (const o of [-38, 0, 38]) {
      g.beginPath();
      g.moveTo(150 + o - 86, 80 - 86);
      g.lineTo(150 + o + 86, 80 + 86);
      g.stroke();
      g.beginPath();
      g.moveTo(150 + o - 86, 80 + 86);
      g.lineTo(150 + o + 86, 80 - 86);
      g.stroke();
    }
  }
  g.restore();
  g.restore();
};

/** FIRE｡横から見た硬貨の山 */
const coins: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  const rx = 42;
  const ry = 13;
  const t = 15;
  const floor = 258;

  // 三つの山｡低いほうから並べる
  for (const [cx, n] of [
    [64, 7],
    [150, 12],
    [236, 5],
  ] as const) {
    for (let i = 0; i < n; i++) {
      const y = floor - i * t;

      // 側面
      const side = g.createLinearGradient(cx - rx, 0, cx + rx, 0);
      side.addColorStop(0, "#1c1c1c");
      side.addColorStop(0.2, "#e4e4e4");
      side.addColorStop(0.52, "#8e8e8e");
      side.addColorStop(0.8, "#2e2e2e");
      side.addColorStop(1, "#0c0c0c");
      g.fillStyle = side;
      g.fillRect(cx - rx, y - t, rx * 2, t);
      g.beginPath();
      g.ellipse(cx, y, rx, ry, 0, 0, Math.PI * 2);
      g.fill();

      // 上面｡一枚ごとに縁が見える
      const top = g.createRadialGradient(cx - 16, y - t - 5, 4, cx, y - t, rx);
      top.addColorStop(0, "#f8f8f8");
      top.addColorStop(0.5, "#b4b4b4");
      top.addColorStop(1, "#5a5a5a");
      g.fillStyle = top;
      g.beginPath();
      g.ellipse(cx, y - t, rx, ry, 0, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = "rgba(18,18,18,0.5)";
      g.lineWidth = 2;
      g.stroke();
    }

    // 一番上の刻印
    const face = floor - (n - 1) * t - t;
    g.strokeStyle = "rgba(20,20,20,0.6)";
    g.lineWidth = 2.6;
    g.beginPath();
    g.ellipse(cx, face, rx - 13, ry - 4, 0, 0, Math.PI * 2);
    g.stroke();
  }
  g.restore();
};

/** サステナブル｡輪になって回る二本の矢印 */
const cycle: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);
  const cx = 150;
  const cy = 150;
  const R = 100;

  for (const k of [0, 1]) {
    const b = k * Math.PI;
    const a0 = b + 0.46;
    const a1 = b + Math.PI - 0.26;

    // 濃淡は向きを互い違いにして､二本が回って見えるようにする
    const arm = g.createLinearGradient(
      cx + Math.cos(b) * R,
      cy + Math.sin(b) * R,
      cx - Math.cos(b) * R,
      cy - Math.sin(b) * R,
    );
    arm.addColorStop(0, "#f0f0f0");
    arm.addColorStop(0.32, "#909090");
    arm.addColorStop(0.72, "#2a2a2a");
    arm.addColorStop(1, "#0d0d0d");

    g.strokeStyle = arm;
    g.lineWidth = 30;
    g.lineCap = "butt";
    g.beginPath();
    g.arc(cx, cy, R, a0, a1);
    g.stroke();

    // 鏃｡輪の接線の向きに出す
    const nx = Math.cos(a1);
    const ny = Math.sin(a1);
    const tx = -Math.sin(a1);
    const ty = Math.cos(a1);
    const px = cx + nx * R;
    const py = cy + ny * R;
    g.fillStyle = arm;
    g.beginPath();
    g.moveTo(px + tx * 46, py + ty * 46);
    g.lineTo(px + nx * 31, py + ny * 31);
    g.lineTo(px - nx * 31, py - ny * 31);
    g.closePath();
    g.fill();
  }

  // 中心の葉
  const leaf = g.createLinearGradient(108, 192, 192, 108);
  leaf.addColorStop(0, "#a8a8a8");
  leaf.addColorStop(0.5, "#3a3a3a");
  leaf.addColorStop(1, "#0c0c0c");
  g.fillStyle = leaf;
  g.beginPath();
  g.moveTo(108, 192);
  g.quadraticCurveTo(114, 114, 192, 108);
  g.quadraticCurveTo(186, 186, 108, 192);
  g.closePath();
  g.fill();
  g.strokeStyle = "rgba(252,252,252,0.72)";
  g.lineWidth = 3.4;
  g.beginPath();
  g.moveTo(113, 187);
  g.quadraticCurveTo(150, 150, 187, 113);
  g.stroke();
  g.restore();
};

/** 断捨離｡蓋の開いた空の段ボール箱 */
const emptyBox: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  const edge = "rgba(12,12,12,0.78)";

  // 奥の蓋｡先に伏せて置く
  const backFlap = g.createLinearGradient(0, 40, 0, 104);
  backFlap.addColorStop(0, "#4e4e4e");
  backFlap.addColorStop(1, "#d6d6d6");
  g.fillStyle = backFlap;
  g.beginPath();
  g.moveTo(80, 104);
  g.lineTo(220, 104);
  g.lineTo(208, 40);
  g.lineTo(92, 40);
  g.closePath();
  g.fill();
  g.strokeStyle = edge;
  g.lineWidth = 3;
  g.stroke();

  // 内側｡空なので奥ほど明るく､手前ほど暗い
  const inside = g.createLinearGradient(0, 104, 0, 156);
  inside.addColorStop(0, "#6e6e6e");
  inside.addColorStop(0.45, "#2a2a2a");
  inside.addColorStop(1, "#0b0b0b");
  g.fillStyle = inside;
  g.beginPath();
  g.moveTo(80, 104);
  g.lineTo(220, 104);
  g.lineTo(246, 156);
  g.lineTo(54, 156);
  g.closePath();
  g.fill();

  // 奥の内壁に当たる光
  g.fillStyle = "rgba(226,226,226,0.5)";
  g.beginPath();
  g.moveTo(80, 104);
  g.lineTo(220, 104);
  g.lineTo(216, 122);
  g.lineTo(84, 122);
  g.closePath();
  g.fill();

  // 前の面
  const front = g.createLinearGradient(54, 0, 246, 0);
  front.addColorStop(0, "#f0f0f0");
  front.addColorStop(0.3, "#a2a2a2");
  front.addColorStop(0.66, "#2c2c2c");
  front.addColorStop(1, "#080808");
  g.fillStyle = front;
  g.beginPath();
  g.moveTo(54, 156);
  g.lineTo(246, 156);
  g.lineTo(238, 262);
  g.lineTo(62, 262);
  g.closePath();
  g.fill();
  g.strokeStyle = edge;
  g.lineWidth = 3.4;
  g.stroke();

  // 両脇の蓋｡外へ開いて立つ
  for (const dir of [-1, 1]) {
    const bx = dir < 0 ? 54 : 246;
    const tx = dir < 0 ? 80 : 220;
    const flap = g.createLinearGradient(0, 44, 0, 156);
    flap.addColorStop(0, "#fafafa");
    flap.addColorStop(0.5, "#9e9e9e");
    flap.addColorStop(1, "#2e2e2e");
    g.fillStyle = flap;
    g.beginPath();
    g.moveTo(bx, 156);
    g.lineTo(tx, 104);
    g.lineTo(tx + dir * 16, 44);
    g.lineTo(bx + dir * 16, 96);
    g.closePath();
    g.fill();
    g.strokeStyle = edge;
    g.lineWidth = 3;
    g.stroke();
  }
  g.restore();
};

/** リスキリング｡横に寝かせて重ねた本 */
const books: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 下から順に積む｡少しずつずらして角度を振る
  const pile = [
    [150, 214, 36, 0.012],
    [144, 188, 34, -0.02],
    [156, 204, 34, 0.022],
    [146, 176, 32, -0.016],
    [152, 196, 32, 0.018],
  ] as const;

  let bottom = 258;
  pile.forEach(([cx, w, h, rot], i) => {
    const top = bottom - h;
    g.save();
    g.translate(cx, top + h / 2);
    g.rotate(rot);

    // 背｡上を白く残して下へ落とす
    const spine = g.createLinearGradient(0, -h / 2, 0, h / 2);
    spine.addColorStop(0, "#f6f6f6");
    spine.addColorStop(0.34, "#b6b6b6");
    spine.addColorStop(0.72, "#3c3c3c");
    spine.addColorStop(1, "#101010");
    g.fillStyle = spine;
    rrect(g, -w / 2, -h / 2, w, h, h * 0.3);
    g.fill();
    g.strokeStyle = "rgba(14,14,14,0.6)";
    g.lineWidth = 2.6;
    g.stroke();

    // 背バンド
    g.fillStyle = "rgba(16,16,16,0.72)";
    for (const o of [-1, 1]) {
      g.fillRect(o * (w / 2 - 34) - 5, -h / 2 + 3, 10, h - 6);
    }

    // 背文字の代わりの白帯
    g.fillStyle = "rgba(250,250,250,0.82)";
    g.fillRect(-w * 0.16, -6, w * 0.32, 12);

    // 一番上だけ天が見える
    if (i === pile.length - 1) {
      const lid = g.createLinearGradient(0, -h / 2 - 17, 0, -h / 2);
      lid.addColorStop(0, "#ececec");
      lid.addColorStop(1, "#8e8e8e");
      g.fillStyle = lid;
      g.beginPath();
      g.moveTo(-w / 2, -h / 2);
      g.lineTo(w / 2, -h / 2);
      g.lineTo(w / 2 + 11, -h / 2 - 17);
      g.lineTo(-w / 2 + 11, -h / 2 - 17);
      g.closePath();
      g.fill();
      g.strokeStyle = "rgba(14,14,14,0.55)";
      g.lineWidth = 2.4;
      g.stroke();
    }
    g.restore();
    bottom = top;
  });
  g.restore();
};

/** 江戸しぐさ｡すれ違いに互いを傾ける傘かしげ */
const umbrellas: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  const R = 90;
  const H = 56;
  const n = 6;

  // 前縁は楕円の手前半分｡中ほどが下がる
  const rim = (i: number) => {
    const t = -1 + (2 * i) / n;
    return [R * t, H + 22 * (1 - t * t)] as const;
  };

  // 一本を原点まわりに描く｡near のほうを濃くして前後を分ける
  const one = (near: boolean) => {
    const face = g.createRadialGradient(-R * 0.45, -12, 8, 0, 10, 152);
    face.addColorStop(0, near ? "#fafafa" : "#fdfdfd");
    face.addColorStop(0.3, near ? "#c0c0c0" : "#e2e2e2");
    face.addColorStop(0.62, near ? "#4a4a4a" : "#a4a4a4");
    face.addColorStop(1, near ? "#080808" : "#5c5c5c");

    // 柄｡骨に隠れる上端から下の握りまで
    const pole = g.createLinearGradient(-6, 0, 6, 0);
    pole.addColorStop(0, "#6e6e6e");
    pole.addColorStop(0.5, "#101010");
    pole.addColorStop(1, "#4a4a4a");
    g.strokeStyle = pole;
    g.lineWidth = 11;
    g.lineCap = "butt";
    g.beginPath();
    g.moveTo(0, H + 18);
    g.lineTo(0, H + 92);
    g.stroke();
    g.strokeStyle = "#151515";
    g.lineWidth = 13;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(0, H + 80);
    g.quadraticCurveTo(0, H + 104, -24, H + 100);
    g.stroke();

    // 石突
    g.strokeStyle = "#101010";
    g.lineWidth = 7;
    g.beginPath();
    g.moveTo(0, -8);
    g.lineTo(0, -36);
    g.stroke();

    // 傘布｡前縁を菊形に食ませる
    g.beginPath();
    g.moveTo(-R, H);
    g.quadraticCurveTo(-R * 0.84, -H * 0.5, 0, -8);
    g.quadraticCurveTo(R * 0.84, -H * 0.5, R, H);
    for (let i = n - 1; i >= 0; i--) {
      const [x1, y1] = rim(i + 1);
      const [x0, y0] = rim(i);
      g.quadraticCurveTo((x0 + x1) / 2, (y0 + y1) / 2 + 15, x0, y0);
    }
    g.closePath();
    g.fillStyle = face;
    g.fill();
    g.strokeStyle = "rgba(12,12,12,0.85)";
    g.lineWidth = 3.4;
    g.lineCap = "butt";
    g.stroke();

    // 骨｡白を敷いて黒を重ね､布の明暗どちらでも残るようにする
    for (const [c, lw] of [
      ["rgba(250,250,250,0.55)", 4.4],
      ["rgba(14,14,14,0.5)", 1.8],
    ] as const) {
      g.strokeStyle = c;
      g.lineWidth = lw;
      for (let i = 1; i < n; i++) {
        const [x, y] = rim(i);
        g.beginPath();
        g.moveTo(0, -4);
        g.lineTo(x, y);
        g.stroke();
      }
    }
  };

  // 奥の一本｡淡く沈めて離す
  g.save();
  g.translate(206, 100);
  g.rotate(0.42);
  one(false);
  g.restore();

  // 手前の一本
  g.save();
  g.translate(96, 122);
  g.rotate(-0.42);
  one(true);
  g.restore();
  g.restore();
};

export const PLATES_D: Record<string, Draw> = {
  "039": penlight,
  "040": phoneHeart,
  "041": notebook,
  "042": capsule,
  "043": microphone,
  "044": coins,
  "045": cycle,
  "046": emptyBox,
  "047": books,
  "048": umbrellas,
};
