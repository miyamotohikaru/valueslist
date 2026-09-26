/**
 * 網（スクリーン）｡
 *
 * 図版はいちど灰色の版として描いてから､濃さを読んで点や線に置きかえる｡
 * 印刷の製版と同じ順番なので､同じ絵でも網を変えると刷り上がりが変わる｡
 * phase を送ると網の角度や目が動くので､送るたびに刷り直したように見える｡
 */

export type Technique = "halftone" | "linescreen" | "stipple" | "contour" | "solarise";

/** 灰色の版｡0=紙のまま 1=真っ黒 */
export type Plate = { size: number; d: Float32Array };

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** 版の (x, y) の濃さ｡外は紙 */
function at(p: Plate, x: number, y: number) {
  const i = Math.round(x);
  const j = Math.round(y);
  if (i < 0 || j < 0 || i >= p.size || j >= p.size) return 0;
  return p.d[j * p.size + i];
}

/** 送るたびに同じ並びを出す小さな乱数 */
function rng(seed: number) {
  let s = (seed * 2654435761) >>> 0;
  return () => {
    s ^= s << 13;
    s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 4294967296;
  };
}

/** 灰色の版を作る（描く → 濃さだけ抜き出す） */
export function makePlate(size: number, draw: (g: CanvasRenderingContext2D, s: number) => void): Plate {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const g = c.getContext("2d", { willReadFrequently: true })!;
  g.fillStyle = "#fff";
  g.fillRect(0, 0, size, size);
  draw(g, size);
  const px = g.getImageData(0, 0, size, size).data;
  const d = new Float32Array(size * size);
  for (let i = 0; i < d.length; i++) {
    const o = i * 4;
    // 人の目に合わせた明るさ｡そのまま裏返して濃さにする
    const l = (px[o] * 0.299 + px[o + 1] * 0.587 + px[o + 2] * 0.114) / 255;
    d[i] = clamp01(1 - l);
  }
  return { size, d };
}

type Ink = { fg: string; bg: string };

/**
 * 版を網にかけて刷る｡
 *
 * ctx は CSS ピクセルに合わせてあるものとする｡枠は正方形とはかぎらないので､
 * 版は短いほうの辺に合わせて中に納める（まわりは地のまま）｡
 */
export function screenPlate(
  g: CanvasRenderingContext2D,
  plate: Plate,
  w: number,
  h: number,
  tech: Technique,
  phase: number,
  ink: Ink,
) {
  const out = Math.min(w, h); // 版を納める一辺
  const ox = (w - out) / 2;
  const oy = (h - out) / 2;
  const k = plate.size / out; // 出力1pxあたりの版の座標
  g.clearRect(0, 0, w, h);
  if (ink.bg !== "transparent") {
    g.fillStyle = ink.bg;
    g.fillRect(0, 0, w, h);
  }
  g.fillStyle = ink.fg;
  const D = (x: number, y: number) => at(plate, (x - ox) * k, (y - oy) * k);

  if (tech === "halftone") {
    // 網点｡正方の目を斜めに倒して､濃さを点の大きさにする
    const cell = Math.max(1.9, out / 72);
    const a = (15 + phase * 9) * (Math.PI / 180);
    const co = Math.cos(a);
    const si = Math.sin(a);
    const cx = w / 2;
    const cy = h / 2;
    const n = Math.ceil((Math.max(w, h) * 0.78) / cell) + 2;
    for (let j = -n; j <= n; j++) {
      for (let i = -n; i <= n; i++) {
        const gx = i * cell;
        const gy = j * cell;
        const x = cx + gx * co - gy * si;
        const y = cy + gx * si + gy * co;
        if (x < -cell || y < -cell || x > w + cell || y > h + cell) continue;
        const r = cell * 0.66 * Math.sqrt(D(x, y));
        if (r < 0.3) continue;
        g.beginPath();
        g.arc(x, y, r, 0, Math.PI * 2);
        g.fill();
      }
    }
    return;
  }

  if (tech === "linescreen") {
    // 線網｡横に引いた線の太さで濃さを出す（木口木版のような肌）
    const pitch = Math.max(1.8, out / 54);
    const step = pitch * 0.42;
    const off = (phase % 4) * (pitch / 4);
    for (let y = off; y < h; y += pitch) {
      for (let x = 0; x < w; x += step) {
        const t = pitch * 0.92 * D(x + step / 2, y);
        if (t < 0.18) continue;
        g.fillRect(x, y - t / 2, step * 1.1, t);
      }
    }
    return;
  }

  if (tech === "stipple") {
    // 点刻｡同じ大きさの点を､濃いところほど多く落とす
    const rand = rng(phase + 11);
    const shots = Math.round(w * h * 0.45);
    const rad = Math.max(0.55, out / 200);
    for (let i = 0; i < shots; i++) {
      const x = rand() * w;
      const y = rand() * h;
      const d = D(x, y);
      if (d < 0.04 || rand() > Math.pow(d, 1.15)) continue;
      g.beginPath();
      g.arc(x, y, rad, 0, Math.PI * 2);
      g.fill();
    }
    return;
  }

  if (tech === "contour") {
    // 等高｡濃さを段に割って､段の境目だけを線にする
    const bands = 8;
    const shift = (phase % 5) / 5;
    const st = Math.max(0.9, out / 140);
    const band = (x: number, y: number) => Math.floor(D(x, y) * bands + shift);
    for (let y = 0; y < h; y += st) {
      for (let x = 0; x < w; x += st) {
        const b = band(x, y);
        if (b === band(x + st, y) && b === band(x, y + st)) continue;
        g.beginPath();
        g.arc(x, y, st * 0.6, 0, Math.PI * 2);
        g.fill();
      }
    }
    return;
  }

  // 反転｡濃さを2段に割って､境目のところだけ粗い網を残す
  const t = 0.46 + ((phase % 4) - 1.5) * 0.045;
  const st = Math.max(0.9, out / 165);
  for (let y = 0; y < h; y += st) {
    for (let x = 0; x < w; x += st) {
      if (D(x, y) > t + 0.16) g.fillRect(x, y, st * 1.2, st * 1.2);
    }
  }
  const cell = Math.max(2.2, out / 40);
  for (let y = cell / 2; y < h; y += cell) {
    for (let x = cell / 2; x < w; x += cell) {
      const d = D(x, y);
      if (d <= t - 0.1 || d > t + 0.16) continue;
      const r = cell * 0.42;
      g.beginPath();
      g.arc(x, y, r, 0, Math.PI * 2);
      g.fill();
    }
  }
}
