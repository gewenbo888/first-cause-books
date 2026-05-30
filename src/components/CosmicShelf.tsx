"use client";

import { useEffect, useRef } from "react";

// Seeded RNG — mulberry32
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Palette
const GOLD_HI = "#fae4a3";
const GOLD_LO = "#d4af55";
const CRIMSON = "#c4304a";
const EMERALD = "#2eb88c";
const CYAN = "#5ddcff";
const VIOLET = "#9986ff";
const VOID_DEEP = "#05060f";
const VOID_MID = "#0a0e1f";

// 13 book-star sub-series colors (cycle through 5 palettes)
const BOOK_COLORS = [
  GOLD_HI, VIOLET, EMERALD, CYAN, CRIMSON,
  GOLD_LO, VIOLET, EMERALD, CYAN, GOLD_HI,
  CRIMSON, VIOLET, EMERALD,
];

// Fixed fractional positions for the 13 book-stars (fx,fy in 0..1)
const BOOK_POS: [number, number][] = [
  [0.12, 0.18], [0.28, 0.08], [0.42, 0.22], [0.55, 0.12],
  [0.70, 0.25], [0.82, 0.14], [0.18, 0.45], [0.38, 0.55],
  [0.60, 0.42], [0.75, 0.55], [0.88, 0.40], [0.30, 0.72],
  [0.65, 0.70],
];

// Constellation: 9 edges between book-star indices
const CONST_EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
  [1, 6], [6, 7], [7, 8], [8, 9],
];

// Drifting bilingual words
const DRIFT_WORDS = [
  "宇宙", "时间", "生命", "心智", "计算",
  "cosmos", "time", "life", "mind", "computation",
];

interface Star {
  x: number; y: number; r: number; color: string;
  phase: number; speed: number;
}

interface DriftWord {
  text: string; x: number; y: number; vy: number;
  phase: number; phaseSpeed: number;
}

interface ShootStar {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; active: boolean;
}

export default function CosmicShelf() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rng = mulberry32(20240601);

    // ── build scene data ──────────────────────────────────────────────
    const BG_COLORS = ["#ffffff", "#fffef5", "#fdf8e8", GOLD_HI, CYAN, VIOLET, EMERALD];
    const stars: Star[] = Array.from({ length: 180 }, () => ({
      x: rng(), y: rng(),
      r: 0.3 + rng() * 1.1,
      color: BG_COLORS[Math.floor(rng() * BG_COLORS.length)],
      phase: rng() * Math.PI * 2,
      speed: 0.3 + rng() * 0.9,
    }));

    const driftWords: DriftWord[] = DRIFT_WORDS.map((text, i) => ({
      text,
      x: 0.05 + rng() * 0.85,
      y: 0.1 + rng() * 0.8,
      vy: 0.008 + rng() * 0.006,
      phase: (i / DRIFT_WORDS.length) * Math.PI * 2,
      phaseSpeed: 0.15 + rng() * 0.2,
    }));

    const shoot: ShootStar = { x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 1500, active: false };
    let lastShootTime = 0;

    // ── resize ────────────────────────────────────────────────────────
    let W = 0, H = 0, dpr = 1;
    function resize() {
      dpr = window.devicePixelRatio || 1;
      W = canvas!.offsetWidth;
      H = canvas!.offsetHeight;
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      ctx!.scale(dpr, dpr);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // ── helpers ───────────────────────────────────────────────────────
    function bookX(i: number) { return BOOK_POS[i][0] * W; }
    function bookY(i: number) { return BOOK_POS[i][1] * H; }

    function drawGlow(cx: number, cy: number, r: number, color: string, alpha: number) {
      ctx!.save();
      ctx!.globalAlpha = alpha;
      const grd = ctx!.createRadialGradient(cx, cy, 0, cx, cy, r);
      grd.addColorStop(0, color);
      grd.addColorStop(1, "transparent");
      ctx!.fillStyle = grd;
      ctx!.beginPath();
      ctx!.arc(cx, cy, r, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();
    }

    // ── main render loop ──────────────────────────────────────────────
    let raf = 0;
    let startTime = performance.now();

    function draw(now: number) {
      const t = (now - startTime) / 1000; // seconds
      const ms = now - startTime;         // milliseconds since start

      ctx!.clearRect(0, 0, W, H);

      // 1. VOID background gradient
      const bg = ctx!.createLinearGradient(0, 0, W * 0.4, H);
      bg.addColorStop(0, VOID_MID);
      bg.addColorStop(1, VOID_DEEP);
      ctx!.fillStyle = bg;
      ctx!.fillRect(0, 0, W, H);

      // 2. Nebula glow — lower-left, breathes ~10s
      const nebAlpha = 0.06 + 0.025 * Math.sin(t * (Math.PI * 2) / 10);
      const nebG = ctx!.createRadialGradient(W * 0.18, H * 0.78, 0, W * 0.18, H * 0.78, W * 0.45);
      nebG.addColorStop(0, `rgba(212,175,85,${nebAlpha * 2})`);
      nebG.addColorStop(0.5, `rgba(212,175,85,${nebAlpha})`);
      nebG.addColorStop(1, "transparent");
      ctx!.fillStyle = nebG;
      ctx!.fillRect(0, 0, W, H);

      // 3. Background starfield
      for (const s of stars) {
        const alpha = 0.35 + 0.45 * Math.sin(t * s.speed + s.phase);
        ctx!.save();
        ctx!.globalAlpha = alpha;
        ctx!.fillStyle = s.color;
        ctx!.beginPath();
        ctx!.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      }

      // 4. Drifting words — very faint, slow upward drift
      ctx!.save();
      ctx!.font = `11px Georgia, "Times New Roman", serif`;
      ctx!.textAlign = "center";
      for (const w of driftWords) {
        w.y -= w.vy * 0.016; // ~per frame at 60fps
        if (w.y < -0.05) w.y = 1.05; // wrap
        const wAlpha = 0.055 + 0.03 * Math.sin(t * w.phaseSpeed + w.phase);
        ctx!.globalAlpha = wAlpha;
        ctx!.fillStyle = GOLD_LO;
        ctx!.fillText(w.text, w.x * W, w.y * H);
      }
      ctx!.restore();

      // 5. Constellation lines
      ctx!.save();
      ctx!.strokeStyle = `rgba(212,175,85,0.10)`;
      ctx!.lineWidth = 0.6;
      for (const [a, b] of CONST_EDGES) {
        ctx!.beginPath();
        ctx!.moveTo(bookX(a), bookY(a));
        ctx!.lineTo(bookX(b), bookY(b));
        ctx!.stroke();
      }
      ctx!.restore();

      // 6. Book-stars (13 brighter stars with halos)
      for (let i = 0; i < 13; i++) {
        const bx = bookX(i);
        const by = bookY(i);
        const col = BOOK_COLORS[i];
        const pulse = 0.6 + 0.3 * Math.sin(t * 0.6 + i * 0.8);

        // outer halo
        drawGlow(bx, by, 22, col, 0.04 * pulse);
        // inner glow
        drawGlow(bx, by, 9, col, 0.14 * pulse);

        // star core
        ctx!.save();
        ctx!.globalAlpha = 0.75 + 0.2 * pulse;
        ctx!.fillStyle = col;
        ctx!.shadowColor = col;
        ctx!.shadowBlur = 6;
        ctx!.beginPath();
        ctx!.arc(bx, by, 1.8, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();

        // bright center point
        ctx!.save();
        ctx!.globalAlpha = 1;
        ctx!.fillStyle = "#ffffff";
        ctx!.beginPath();
        ctx!.arc(bx, by, 0.8, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      }

      // 7. Shooting star — every ~6s
      if (!shoot.active && ms - lastShootTime > 6000) {
        const rr = mulberry32(Math.floor(ms / 100) * 7);
        shoot.x = rr() * W * 0.7 + W * 0.1;
        shoot.y = rr() * H * 0.4;
        shoot.vx = 180 + rr() * 80;   // px/s rightward
        shoot.vy = 55 + rr() * 40;    // px/s downward
        shoot.life = 0;
        shoot.maxLife = 1400;
        shoot.active = true;
        lastShootTime = ms;
      }

      if (shoot.active) {
        shoot.life += 16; // ~60fps step
        const progress = shoot.life / shoot.maxLife;
        if (progress >= 1) {
          shoot.active = false;
        } else {
          const alpha = progress < 0.15
            ? progress / 0.15
            : 1 - (progress - 0.15) / 0.85;
          const tailLen = 28 + progress * 20;
          const sx = shoot.x + (shoot.vx * shoot.life) / 1000;
          const sy = shoot.y + (shoot.vy * shoot.life) / 1000;
          const angle = Math.atan2(shoot.vy, shoot.vx);
          const tx = sx - Math.cos(angle) * tailLen;
          const ty = sy - Math.sin(angle) * tailLen;

          const sg = ctx!.createLinearGradient(tx, ty, sx, sy);
          sg.addColorStop(0, `rgba(250,228,163,0)`);
          sg.addColorStop(1, `rgba(250,228,163,${alpha * 0.85})`);
          ctx!.save();
          ctx!.strokeStyle = sg;
          ctx!.lineWidth = 1.1;
          ctx!.beginPath();
          ctx!.moveTo(tx, ty);
          ctx!.lineTo(sx, sy);
          ctx!.stroke();
          ctx!.restore();
        }
      }

      // 8. Radial vignette — darkens edges, lightens center-left for hero text
      const vx = W * 0.35, vy = H * 0.45, vr = Math.max(W, H) * 0.82;
      const vig = ctx!.createRadialGradient(vx, vy, vr * 0.12, vx, vy, vr);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(0.55, "rgba(0,0,0,0.12)");
      vig.addColorStop(1, "rgba(0,0,0,0.72)");
      ctx!.fillStyle = vig;
      ctx!.fillRect(0, 0, W, H);

      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 w-full h-full"
      aria-hidden="true"
    />
  );
}
