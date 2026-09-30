/**
 * 図版の版下（その十二）｡
 *
 * ここでは網のことは考えず､灰色の絵として描く｡
 * 立体感は濃淡で出しておくと､網にかけたときに刷り物の肌になる｡
 * 座標は 300 四方で書いて､s で伸ばす｡枠いっぱいに大きく取る｡
 *
 * 人の姿は描かない｡どの札も器物・文字・建物の一部だけで指す｡
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

/** NO.119 人種は登録される｡分類の欄がひとつ墨で潰れた登録票 */
const registerCard: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 後ろに重なる二枚｡生まれた者全員に同じ票が出ることだけ見せる｡中は塗らない
  for (const [cx, cy, rot] of [
    [178, 132, 0.1],
    [160, 142, 0.05],
  ] as const) {
    g.save();
    g.translate(cx, cy);
    g.rotate(rot);
    g.fillStyle = "#f4f4f4";
    rrect(g, -84, -112, 168, 224, 8);
    g.fill();
    g.strokeStyle = "rgba(14,14,14,0.8)";
    g.lineWidth = 3.4;
    g.stroke();
    g.restore();
  }

  // 手前の一枚
  g.save();
  g.translate(140, 156);
  g.rotate(-0.045);

  const card = g.createLinearGradient(-84, -112, 84, 112);
  card.addColorStop(0, "#ffffff");
  card.addColorStop(0.58, "#f4f4f4");
  card.addColorStop(1, "#d8d8d8");
  g.fillStyle = card;
  rrect(g, -84, -112, 168, 224, 8);
  g.fill();

  // 見出しの帯｡黒く敷くのはここだけ｡角は札に合わせて切る
  g.save();
  rrect(g, -84, -112, 168, 224, 8);
  g.clip();
  const band = g.createLinearGradient(-84, -112, 84, -74);
  band.addColorStop(0, "#5a5a5a");
  band.addColorStop(0.42, "#111111");
  band.addColorStop(1, "#343434");
  g.fillStyle = band;
  g.fillRect(-84, -112, 168, 38);
  g.restore();

  // 帯の下を白で切る
  g.fillStyle = "#fbfbfb";
  g.fillRect(-84, -74, 168, 8);

  // 記入の二本｡名と生まれ｡太い棒だけで字を表す
  g.fillStyle = "rgba(20,20,20,0.82)";
  g.fillRect(-64, -50, 108, 10);
  g.fillRect(-64, -24, 74, 10);

  // 分類の欄｡三つ並べて､ひとつだけ墨で埋める
  for (let i = 0; i < 3; i++) {
    const x = -66 + i * 46;
    g.fillStyle = "#ffffff";
    rrect(g, x, 12, 38, 38, 4);
    g.fill();
    g.strokeStyle = "rgba(12,12,12,0.88)";
    g.lineWidth = 4.2;
    g.stroke();
    if (i === 1) {
      const ink = g.createRadialGradient(x + 11, 21, 3, x + 19, 31, 27);
      ink.addColorStop(0, "#464646");
      ink.addColorStop(0.5, "#101010");
      ink.addColorStop(1, "#000000");
      g.fillStyle = ink;
      rrect(g, x + 5, 17, 28, 28, 3);
      g.fill();
    }
  }

  // 下の一本｡署名のところ
  g.fillStyle = "rgba(18,18,18,0.7)";
  g.fillRect(-64, 78, 94, 9);

  // 札の輪郭｡帯や欄で消えた縁を引き直す
  g.strokeStyle = "rgba(10,10,10,0.9)";
  g.lineWidth = 4.6;
  rrect(g, -84, -112, 168, 224, 8);
  g.stroke();
  g.restore();
  g.restore();
};

/**
 * NO.120 人種をまたぐ結婚は犯罪｡
 * 高台に載った婚礼の菓子ひとつを､真ん中で断ち切って左右へ開く｡
 * 器をふたつ並べる形は既存と重なるので使わない｡ひとつの物が裂かれた形で出す｡
 */
const cutCake: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // ── 高台｡ここだけは断たれずに一台のまま残る ──
  const foot = g.createLinearGradient(0, 272, 0, 294);
  foot.addColorStop(0, "#9e9e9e");
  foot.addColorStop(0.5, "#2a2a2a");
  foot.addColorStop(1, "#0d0d0d");
  g.fillStyle = foot;
  g.beginPath();
  g.ellipse(150, 282, 54, 12, 0, 0, Math.PI * 2);
  g.fill();

  const stem = g.createLinearGradient(130, 0, 170, 0);
  stem.addColorStop(0, "#8a8a8a");
  stem.addColorStop(0.32, "#f0f0f0");
  stem.addColorStop(0.72, "#5e5e5e");
  stem.addColorStop(1, "#121212");
  g.fillStyle = stem;
  g.beginPath();
  g.moveTo(132, 250);
  g.quadraticCurveTo(140, 268, 138, 282);
  g.lineTo(162, 282);
  g.quadraticCurveTo(160, 268, 168, 250);
  g.closePath();
  g.fill();

  const tray = g.createLinearGradient(26, 240, 274, 270);
  tray.addColorStop(0, "#fcfcfc");
  tray.addColorStop(0.42, "#c6c6c6");
  tray.addColorStop(0.78, "#5e5e5e");
  tray.addColorStop(1, "#101010");
  g.fillStyle = tray;
  g.beginPath();
  g.ellipse(150, 248, 124, 19, 0, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "rgba(10,10,10,0.82)";
  g.lineWidth = 3.4;
  g.stroke();

  /** 氷菓の垂れ｡張り出した天の下を波で切る */
  const drip = (x0: number, x1: number, y: number, n: number, d: number) => {
    g.beginPath();
    g.moveTo(x0, y);
    for (let i = 0; i < n; i++) {
      const a = x0 + ((x1 - x0) * i) / n;
      const b = x0 + ((x1 - x0) * (i + 1)) / n;
      g.quadraticCurveTo((a + b) / 2, y + d, b, y);
    }
    g.strokeStyle = "rgba(14,14,14,0.7)";
    g.lineWidth = 4;
    g.stroke();
  };

  /** 婚礼の菓子｡二段｡中心 150 で組む｡上には何も乗らない */
  const cake = () => {
    // 下の段｡砂糖衣なので側面は白を主にする
    const lower = g.createLinearGradient(58, 0, 242, 0);
    lower.addColorStop(0, "#9e9e9e");
    lower.addColorStop(0.18, "#fcfcfc");
    lower.addColorStop(0.58, "#f0f0f0");
    lower.addColorStop(0.86, "#9a9a9a");
    lower.addColorStop(1, "#343434");
    g.fillStyle = lower;
    g.fillRect(58, 176, 184, 62);
    g.beginPath();
    g.ellipse(150, 238, 92, 17, 0, 0, Math.PI * 2);
    g.fill();

    // 下の段の天｡少し張り出させて菓子らしくする
    const lowerTop = g.createLinearGradient(53, 158, 247, 194);
    lowerTop.addColorStop(0, "#ffffff");
    lowerTop.addColorStop(0.5, "#ececec");
    lowerTop.addColorStop(1, "#9a9a9a");
    g.fillStyle = lowerTop;
    g.beginPath();
    g.ellipse(150, 176, 97, 18, 0, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = "rgba(12,12,12,0.58)";
    g.lineWidth = 3;
    g.stroke();
    drip(60, 240, 190, 5, 15);

    // 裾の帯｡黒いのは段にひとつずつだけ
    g.fillStyle = "rgba(18,18,18,0.72)";
    g.fillRect(58, 212, 184, 11);

    // 上の段
    const upper = g.createLinearGradient(94, 0, 206, 0);
    upper.addColorStop(0, "#a2a2a2");
    upper.addColorStop(0.2, "#fcfcfc");
    upper.addColorStop(0.6, "#f2f2f2");
    upper.addColorStop(0.88, "#9a9a9a");
    upper.addColorStop(1, "#383838");
    g.fillStyle = upper;
    g.fillRect(94, 106, 112, 70);
    g.beginPath();
    g.ellipse(150, 176, 56, 12, 0, 0, Math.PI * 2);
    g.fill();

    // 上の段の天｡何も置かない
    const upperTop = g.createLinearGradient(90, 92, 210, 120);
    upperTop.addColorStop(0, "#ffffff");
    upperTop.addColorStop(0.5, "#ededed");
    upperTop.addColorStop(1, "#9e9e9e");
    g.fillStyle = upperTop;
    g.beginPath();
    g.ellipse(150, 106, 60, 13, 0, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = "rgba(12,12,12,0.55)";
    g.lineWidth = 2.8;
    g.stroke();
    drip(96, 204, 120, 4, 12);

    g.fillStyle = "rgba(18,18,18,0.72)";
    g.fillRect(94, 150, 112, 9);

    // 段の脇｡輪郭を引いて柱を立てる
    g.strokeStyle = "rgba(10,10,10,0.7)";
    g.lineWidth = 3.4;
    g.beginPath();
    g.moveTo(58, 176);
    g.lineTo(58, 238);
    g.moveTo(242, 176);
    g.lineTo(242, 238);
    g.moveTo(94, 106);
    g.lineTo(94, 176);
    g.moveTo(206, 106);
    g.lineTo(206, 176);
    g.stroke();
  };

  /** 半分ずつ描く｡真ん中を紙のまま残して断ち切り､左右へ開く */
  const half = (dir: number) => {
    g.save();
    g.beginPath();
    g.rect(dir < 0 ? 0 : 161, 0, 139, 300);
    g.clip();
    g.translate(dir * 11, 0);
    cake();
    // 切り口｡細い一本だけ｡太く落とすと柱が立って菓子に見えなくなる
    g.fillStyle = "rgba(16,16,16,0.5)";
    g.fillRect(dir < 0 ? 146 : 150, 104, 4, 140);
    g.restore();
  };
  half(-1);
  half(1);
  g.restore();
};

/** NO.121 女性は運転しない｡輻が三本の舵輪 */
const steeringWheel: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);
  const cx = 150;
  const cy = 152;
  const RO = 128;
  const RI = 97;

  // 輪｡中は紙のまま白く抜けるので､外と内の縁だけで形が立つ
  const rim = g.createLinearGradient(cx - RO, cy - RO, cx + RO, cy + RO);
  rim.addColorStop(0, "#fcfcfc");
  rim.addColorStop(0.24, "#cacaca");
  rim.addColorStop(0.56, "#5e5e5e");
  rim.addColorStop(1, "#0c0c0c");
  g.fillStyle = rim;
  g.beginPath();
  g.ellipse(cx, cy, RO, RO * 0.96, 0, 0, Math.PI * 2);
  g.moveTo(cx + RI, cy);
  g.ellipse(cx, cy, RI, RI * 0.95, 0, 0, Math.PI * 2, true);
  g.fill();

  g.strokeStyle = "rgba(10,10,10,0.85)";
  g.lineWidth = 4.2;
  g.beginPath();
  g.ellipse(cx, cy, RO, RO * 0.96, 0, 0, Math.PI * 2);
  g.stroke();
  g.beginPath();
  g.ellipse(cx, cy, RI, RI * 0.95, 0, 0, Math.PI * 2);
  g.stroke();

  // 輻｡三本だけ｡付け根を太く､輪際で細める
  const spoke = (a: number) => {
    const co = Math.cos(a);
    const si = Math.sin(a);
    const nx = -si;
    const ny = co;
    const r0 = 30;
    const r1 = RI + 8;
    const w0 = 22;
    const w1 = 13;
    const arm = g.createLinearGradient(
      cx - nx * w0 * 2,
      cy - ny * w0 * 2,
      cx + nx * w0 * 2,
      cy + ny * w0 * 2,
    );
    arm.addColorStop(0, "#efefef");
    arm.addColorStop(0.4, "#a0a0a0");
    arm.addColorStop(0.76, "#303030");
    arm.addColorStop(1, "#101010");
    g.fillStyle = arm;
    g.beginPath();
    g.moveTo(cx + co * r0 + nx * w0, cy + si * r0 + ny * w0);
    g.lineTo(cx + co * r1 + nx * w1, cy + si * r1 + ny * w1);
    g.lineTo(cx + co * r1 - nx * w1, cy + si * r1 - ny * w1);
    g.lineTo(cx + co * r0 - nx * w0, cy + si * r0 - ny * w0);
    g.closePath();
    g.fill();
    g.strokeStyle = "rgba(12,12,12,0.72)";
    g.lineWidth = 3.2;
    g.stroke();
  };
  for (const a of [Math.PI * 1.22, Math.PI * 1.78, Math.PI * 0.5]) spoke(a);

  // 中心の鉢｡白い輪をひと回り敷いて輻から切り離す
  g.fillStyle = "#fbfbfb";
  g.beginPath();
  g.ellipse(cx, cy, 47, 45, 0, 0, Math.PI * 2);
  g.fill();
  const hub = g.createRadialGradient(cx - 16, cy - 16, 5, cx, cy, 44);
  hub.addColorStop(0, "#e2e2e2");
  hub.addColorStop(0.46, "#6a6a6a");
  hub.addColorStop(1, "#111111");
  g.fillStyle = hub;
  g.beginPath();
  g.ellipse(cx, cy, 37, 35, 0, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "rgba(10,10,10,0.85)";
  g.lineWidth = 3.4;
  g.stroke();
  g.restore();
};

/**
 * NO.122 女性の移動には後見人の許可が要る｡締め革を締め切った旅行鞄｡
 * 自分では開けられない鞄として出す｡吊り札は使わない
 */
const suitcase: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 把手｡下は紙のまま白く空けて胴から離す
  const bar = g.createLinearGradient(0, 84, 0, 118);
  bar.addColorStop(0, "#a4a4a4");
  bar.addColorStop(0.44, "#121212");
  bar.addColorStop(1, "#3e3e3e");
  g.strokeStyle = bar;
  g.lineWidth = 15;
  g.lineCap = "butt";
  g.beginPath();
  g.moveTo(118, 152);
  g.lineTo(118, 110);
  g.quadraticCurveTo(150, 84, 182, 110);
  g.lineTo(182, 152);
  g.stroke();

  // 胴｡大きな塊ひとつ
  const shell = g.createLinearGradient(40, 146, 260, 280);
  shell.addColorStop(0, "#f8f8f8");
  shell.addColorStop(0.24, "#cacaca");
  shell.addColorStop(0.58, "#6e6e6e");
  shell.addColorStop(1, "#141414");
  g.fillStyle = shell;
  rrect(g, 40, 146, 220, 134, 18);
  g.fill();

  // 蓋の合わせ目｡白で一本通して上下を切る
  g.fillStyle = "#fbfbfb";
  g.fillRect(42, 186, 216, 9);
  g.fillStyle = "rgba(14,14,14,0.5)";
  g.fillRect(42, 195, 216, 3.4);

  // 留め革｡二本だけ｡両側に白を空ける
  for (const x of [84, 194]) {
    g.fillStyle = "#fbfbfb";
    g.fillRect(x - 6, 146, 38, 134);
    const belt = g.createLinearGradient(x, 0, x + 26, 0);
    belt.addColorStop(0, "#6a6a6a");
    belt.addColorStop(0.4, "#101010");
    belt.addColorStop(1, "#3c3c3c");
    g.fillStyle = belt;
    g.fillRect(x, 146, 26, 134);

    // 締め金具｡蓋の合わせ目をまたいで留まっている｡まわりを白で空ける
    g.fillStyle = "#fbfbfb";
    rrect(g, x - 10, 170, 46, 38, 8);
    g.fill();
    const clasp = g.createLinearGradient(x - 5, 174, x + 31, 204);
    clasp.addColorStop(0, "#f4f4f4");
    clasp.addColorStop(0.44, "#a6a6a6");
    clasp.addColorStop(1, "#1a1a1a");
    g.fillStyle = clasp;
    rrect(g, x - 5, 174, 36, 30, 6);
    g.fill();
    g.strokeStyle = "rgba(10,10,10,0.88)";
    g.lineWidth = 3.4;
    g.stroke();
    // 革の通る溝｡白で一本
    g.fillStyle = "#fbfbfb";
    g.fillRect(x + 3, 184, 20, 7);
  }

  // 胴の輪郭｡革で消えた縁を引き直す
  g.strokeStyle = "rgba(10,10,10,0.9)";
  g.lineWidth = 5;
  rrect(g, 40, 146, 220, 134, 18);
  g.stroke();

  g.restore();
};

/**
 * NO.123 姥捨て｡物語を刷るための版木と､そこから剥がれかけた摺り紙｡
 * 掟の証拠はない札なので､捨てる場は描かない｡話が刷られて残った側から指す｡
 * 板だけだと高札（掟の札）に見えるので､紙を一枚めくって刷り物だと分かるようにする｡
 */
const woodblock: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  /** 彫った字｡縦画の寄せ方で表と裏を分ける｡版木の側は裏返し */
  const glyph = (
    x: number,
    y: number,
    w: number,
    h: number,
    kind: number,
    mirror: boolean,
    ink: string,
    halo: string,
  ) => {
    g.fillStyle = halo;
    g.fillRect(x - 8, y - 6, w + 16, h + 12);
    g.fillStyle = ink;
    const t = h * 0.18;
    if (kind === 0) {
      // 横画三本に縦画一本｡真ん中の一本を短くして､ありあわせの字にしない
      for (let i = 0; i < 3; i++) {
        const bw = i === 1 ? w * 0.6 : w;
        g.fillRect(x + (i === 1 ? w * 0.18 : 0), y + (i * (h - t)) / 2, bw, t);
      }
      g.fillRect(x + (mirror ? w * 0.24 : w * 0.76 - t), y, t, h);
    } else {
      // 囲いの中に横画一本｡片側に足をひとつ出す
      g.fillRect(x, y, w, t);
      g.fillRect(x, y + h - t, w, t);
      g.fillRect(x, y, t, h);
      g.fillRect(x + w - t, y, t, h);
      g.fillRect(x + t, y + (h - t) / 2, w - t * 2, t);
      g.fillRect(mirror ? x - t * 1.5 : x + w + t * 0.5, y + h * 0.6, t * 1.5, t);
    }
  };

  // ── 版木 ──────────────────────────────
  g.save();
  g.translate(150, 138);
  g.rotate(-0.05);

  const W = 114; // 半幅
  const H = 102; // 半高
  const dx = 12; // 厚みのずれ（右へ）
  const dy = 18; // 厚みのずれ（下へ）

  // 木口｡右と下に厚みを見せて､板であることを出す
  const foot = g.createLinearGradient(0, H, 0, H + dy);
  foot.addColorStop(0, "#8a8a8a");
  foot.addColorStop(0.36, "#282828");
  foot.addColorStop(1, "#0f0f0f");
  g.fillStyle = foot;
  g.beginPath();
  g.moveTo(-W, H);
  g.lineTo(W, H);
  g.lineTo(W + dx, H + dy);
  g.lineTo(-W + dx, H + dy);
  g.closePath();
  g.fill();

  const side = g.createLinearGradient(W, 0, W + dx, 0);
  side.addColorStop(0, "#6e6e6e");
  side.addColorStop(1, "#121212");
  g.fillStyle = side;
  g.beginPath();
  g.moveTo(W, -H);
  g.lineTo(W + dx, -H + dy);
  g.lineTo(W + dx, H + dy);
  g.lineTo(W, H);
  g.closePath();
  g.fill();

  // 彫り面｡紙より一段沈めて､白い紙が上に浮くようにする
  const face = g.createLinearGradient(-W, -H, W, H);
  face.addColorStop(0, "#dedede");
  face.addColorStop(0.42, "#bababa");
  face.addColorStop(1, "#868686");
  g.fillStyle = face;
  g.fillRect(-W, -H, W * 2, H * 2);

  // 木目｡三本だけ長く流す
  g.save();
  g.beginPath();
  g.rect(-W, -H, W * 2, H * 2);
  g.clip();
  g.strokeStyle = "rgba(20,20,20,0.34)";
  g.lineWidth = 4.6;
  for (let i = 0; i < 4; i++) {
    const x = -W + 26 + i * 62;
    g.beginPath();
    g.moveTo(x, -H);
    g.bezierCurveTo(x + 18, -44, x - 16, 44, x + 10, H);
    g.stroke();
  }
  g.restore();

  // 彫り残した字｡紙に隠れない上半分に二字だけ｡版木なので裏返し
  // 板の地が中間灰なので､白い縁は敷かない（敷くと紙がもう一枚あるように見える）
  glyph(-88, -84, 62, 62, 0, true, "#0e0e0e", "rgba(255,255,255,0)");
  glyph(16, -84, 62, 62, 1, true, "#121212", "rgba(255,255,255,0)");

  // 板の輪郭
  g.strokeStyle = "rgba(10,10,10,0.75)";
  g.lineWidth = 3.4;
  g.strokeRect(-W, -H, W * 2, H * 2);
  g.restore();

  // ── 摺り紙 ────────────────────────────
  // 板の下辺からめくれ上がった一枚｡板より狭く取って､板が両脇に残るようにする
  g.save();
  g.translate(150, 160);
  g.rotate(0.035);

  const sheet = new Path2D();
  sheet.moveTo(-88, -34);
  sheet.lineTo(88, -34);
  sheet.bezierCurveTo(96, 24, 92, 76, 98, 118);
  sheet.quadraticCurveTo(20, 140, -94, 126);
  sheet.bezierCurveTo(-90, 76, -94, 22, -88, -34);
  sheet.closePath();

  // 紙の影｡板に落として一枚だけ浮いていると分かるようにする
  g.save();
  g.translate(10, 12);
  g.fillStyle = "rgba(20,20,20,0.5)";
  g.fill(sheet);
  g.restore();

  // 紙｡上は白く､めくれた裾へ向かって沈める
  const paper = g.createLinearGradient(0, -34, 0, 132);
  paper.addColorStop(0, "#ffffff");
  paper.addColorStop(0.5, "#fafafa");
  paper.addColorStop(0.82, "#e4e4e4");
  paper.addColorStop(1, "#b6b6b6");
  g.fillStyle = paper;
  g.fill(sheet);

  // 刷られた字｡版木とは逆で縦画が右に寄る
  glyph(-74, -8, 56, 56, 0, false, "rgba(20,20,20,0.86)", "rgba(255,255,255,0)");
  glyph(16, -14, 56, 56, 1, false, "rgba(20,20,20,0.86)", "rgba(255,255,255,0)");

  // 紙の縁と､板から浮いた折り目｡上の一本を濃くして板と切る
  g.strokeStyle = "rgba(12,12,12,0.85)";
  g.lineWidth = 3.4;
  g.stroke(sheet);
  g.fillStyle = "rgba(14,14,14,0.75)";
  g.fillRect(-88, -38, 176, 6);

  // めくれた裾の裏側｡一本の帯だけで浮きを出す
  const back = g.createLinearGradient(0, 108, 0, 134);
  back.addColorStop(0, "#9e9e9e");
  back.addColorStop(1, "#2e2e2e");
  g.fillStyle = back;
  g.beginPath();
  g.moveTo(-94, 126);
  g.quadraticCurveTo(20, 140, 98, 118);
  g.lineTo(100, 134);
  g.quadraticCurveTo(20, 158, -96, 142);
  g.closePath();
  g.fill();
  g.restore();
  g.restore();
};

/**
 * NO.124 初夜権｡幕を絞った舞台｡
 * 中世にはなかった話なので出来事は描かず､名がついた場＝舞台の側から指す｡
 * 窓に見えないように､口は横長に取り､上に飾り幕､下に舞台の床を入れる｡
 */
const stage: Draw = (g, s) => {
  const u = s / 300;
  g.save();
  g.scale(u, u);

  // 舞台の口｡横長で､天だけをゆるく反らせる
  const mouth = new Path2D();
  mouth.moveTo(44, 274);
  mouth.lineTo(44, 74);
  mouth.quadraticCurveTo(150, 40, 256, 74);
  mouth.lineTo(256, 274);
  mouth.closePath();

  // 額縁｡口のひと回り外を通す
  const outer = new Path2D();
  outer.moveTo(16, 290);
  outer.lineTo(16, 56);
  outer.quadraticCurveTo(150, 16, 284, 56);
  outer.lineTo(284, 290);
  outer.closePath();

  const arch = g.createLinearGradient(16, 16, 284, 290);
  arch.addColorStop(0, "#f4f4f4");
  arch.addColorStop(0.3, "#b0b0b0");
  arch.addColorStop(0.66, "#3c3c3c");
  arch.addColorStop(1, "#101010");
  g.fillStyle = arch;
  g.fill(outer);

  // 口の中は紙のまま｡白で抜いて額縁を一本の帯にする
  g.fillStyle = "#ffffff";
  g.fill(mouth);

  g.save();
  g.clip(mouth);

  // 床｡奥は白いまま｡手前の縁に一本だけ引く｡何も置かない
  g.fillStyle = "rgba(16,16,16,0.72)";
  g.fillRect(36, 240, 232, 8);
  const deck = g.createLinearGradient(0, 248, 0, 278);
  deck.addColorStop(0, "#e8e8e8");
  deck.addColorStop(1, "#bcbcbc");
  g.fillStyle = deck;
  g.fillRect(36, 248, 232, 32);

  /** 幕の一枚｡腰を紐で絞って外へ寄せる */
  const drape = () => {
    const p = new Path2D();
    p.moveTo(36, 56);
    p.lineTo(128, 56);
    p.bezierCurveTo(122, 108, 98, 136, 94, 172);
    p.bezierCurveTo(90, 208, 106, 234, 112, 280);
    p.lineTo(36, 280);
    p.closePath();

    // ひだ｡明暗を横に並べて布の厚みを出す
    const fold = g.createLinearGradient(36, 0, 128, 0);
    fold.addColorStop(0, "#2a2a2a");
    fold.addColorStop(0.13, "#a6a6a6");
    fold.addColorStop(0.28, "#2e2e2e");
    fold.addColorStop(0.44, "#b2b2b2");
    fold.addColorStop(0.6, "#282828");
    fold.addColorStop(0.78, "#989898");
    fold.addColorStop(1, "#1c1c1c");
    g.fillStyle = fold;
    g.fill(p);

    // ひだの谷｡布の中を四本だけ走らせる
    g.save();
    g.clip(p);
    g.strokeStyle = "rgba(8,8,8,0.45)";
    g.lineWidth = 3.4;
    for (let i = 1; i < 5; i++) {
      const x = 36 + (92 * i) / 5;
      g.beginPath();
      g.moveTo(x, 56);
      g.bezierCurveTo(x - 8, 108, x - 28, 136, x - 32, 172);
      g.bezierCurveTo(x - 36, 208, x - 24, 234, x - 18, 280);
      g.stroke();
    }
    g.restore();
    g.strokeStyle = "rgba(10,10,10,0.8)";
    g.lineWidth = 3.4;
    g.stroke(p);

    // 絞りの紐｡腰を一本きつく締める
    const tie = g.createLinearGradient(0, 148, 0, 188);
    tie.addColorStop(0, "#7c7c7c");
    tie.addColorStop(0.44, "#0d0d0d");
    tie.addColorStop(1, "#3e3e3e");
    g.fillStyle = tie;
    g.beginPath();
    g.moveTo(34, 156);
    g.lineTo(96, 148);
    g.lineTo(100, 176);
    g.lineTo(34, 186);
    g.closePath();
    g.fill();
    // 紐の上を白で切る
    g.strokeStyle = "rgba(252,252,252,0.8)";
    g.lineWidth = 5;
    g.beginPath();
    g.moveTo(34, 156);
    g.lineTo(96, 148);
    g.stroke();

    // 房｡白い縁を形に沿わせてから落とす
    const tuft = new Path2D();
    tuft.arc(94, 189, 9.5, Math.PI, 0);
    tuft.lineTo(102, 195);
    tuft.lineTo(106, 220);
    tuft.lineTo(82, 220);
    tuft.lineTo(86, 195);
    tuft.closePath();
    g.strokeStyle = "#fbfbfb";
    g.lineWidth = 9;
    g.lineJoin = "round";
    g.stroke(tuft);
    const tass = g.createLinearGradient(82, 180, 106, 220);
    tass.addColorStop(0, "#7c7c7c");
    tass.addColorStop(0.45, "#121212");
    tass.addColorStop(1, "#2e2e2e");
    g.fillStyle = tass;
    g.beginPath();
    g.arc(94, 189, 9.5, 0, Math.PI * 2);
    g.fill();
    g.beginPath();
    g.moveTo(86, 195);
    g.lineTo(102, 195);
    g.lineTo(106, 220);
    g.lineTo(82, 220);
    g.closePath();
    g.fill();
  };

  // 左の一枚
  drape();
  // 右の一枚｡中心で折り返す
  g.save();
  g.translate(300, 0);
  g.scale(-1, 1);
  drape();
  g.restore();

  // 飾り幕｡口の上を渡して裾を四つの山に食ませる｡舞台だと分かる目印
  const pel = new Path2D();
  pel.moveTo(36, 46);
  pel.quadraticCurveTo(150, 12, 264, 46);
  pel.lineTo(264, 78);
  for (let i = 4; i > 0; i--) {
    const x0 = 36 + (228 * i) / 4;
    const x1 = 36 + (228 * (i - 1)) / 4;
    pel.quadraticCurveTo((x0 + x1) / 2, 116, x1, 78);
  }
  pel.closePath();

  // まわりを白で切ってから置く｡幕の頭と重ならないようにする
  g.strokeStyle = "#fbfbfb";
  g.lineWidth = 9;
  g.stroke(pel);
  const val = g.createLinearGradient(36, 0, 264, 0);
  val.addColorStop(0, "#1e1e1e");
  val.addColorStop(0.16, "#b4b4b4");
  val.addColorStop(0.34, "#2a2a2a");
  val.addColorStop(0.52, "#c0c0c0");
  val.addColorStop(0.7, "#262626");
  val.addColorStop(0.86, "#a8a8a8");
  val.addColorStop(1, "#181818");
  g.fillStyle = val;
  g.fill(pel);
  g.strokeStyle = "rgba(10,10,10,0.82)";
  g.lineWidth = 3.2;
  g.stroke(pel);

  g.restore();

  // 額縁と口の縁
  g.strokeStyle = "rgba(10,10,10,0.85)";
  g.lineWidth = 4.4;
  g.stroke(outer);
  g.lineWidth = 3.4;
  g.stroke(mouth);
  g.restore();
};

export const PLATES_L: Record<string, Draw> = {
  "119": registerCard,
  "120": cutCake,
  "121": steeringWheel,
  "122": suitcase,
  "123": woodblock,
  "124": stage,
};
