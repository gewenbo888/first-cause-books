"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { T, useLang } from "./lang";
import { RECURSION_LAYERS } from "./content";
import type { RecursionLayer } from "./content";

// ─── per-layer "Try this" advice ──────────────────────────────────────────────
const ADVICE: Record<string, { en: string; zh: string }> = {
  cover: {
    en: "Just look at the cover designs. The original 1992 covers were starry-sky black-and-gold; that aesthetic was a deliberate signal that this would be serious.",
    zh: "只看封面的设计就够。1992 年最初的封面是夜空黑加金边；那种美学是一种刻意的信号：这套书是认真的。",
  },
  preface: {
    en: "Read only the preface and the first page of chapter one. You will know within ten minutes whether this book is worth your week.",
    zh: "只读序，再加第一章的第一页。十分钟之内，你就会知道这本书是否值得用你一周的时间。",
  },
  chapter: {
    en: "Find the chapter in any book that the table of contents makes sound strangest. That is almost always the one most worth reading first.",
    zh: "在任何一本书里，找目录里听起来最陌生的那一章。那通常就是最值得先读的那章。",
  },
  book: {
    en: "Read one complete book before picking up a second. The shape of a whole book is itself an argument you cannot see from a chapter.",
    zh: "读完一整本，再拿起第二本。一本书的整体形状，本身就是一个论点——那个论点，从某一章是看不见的。",
  },
  shelf: {
    en: "After finishing one sub-series, write a single sentence summarizing what the books had in common. The sentence will surprise you.",
    zh: "读完一组子系列后，写一句话，概括这几本书的共同之处。那句话会让你自己意外。",
  },
  library: {
    en: "Read all thirteen without insisting on an order. The conversation between books in different sub-series is more interesting than any one shelf.",
    zh: "读十三本，不必坚持顺序。不同子系列之间书与书的对话，比任何单独一架都有趣。",
  },
  series: {
    en: "Choose one topic — say, time — and follow it through the full First Cause catalogue. You will be reading for years, and the reading will keep paying.",
    zh: "选一个主题——比如「时间」——顺着它在完整「第一推动」书目里走下去。那会是几年的阅读，而那阅读会一直有回报。",
  },
  next: {
    en: "Find one person who would benefit from one specific book on this shelf. Hand it to them in person. That is the oldest form of library.",
    zh: "找到一个人，他会从这架上某一本特定的书里受益。亲手把那本书递给他。那是图书馆最古老的形式。",
  },
};

// ─── SVG icons (28×28 viewBox) ───────────────────────────────────────────────
function LayerIcon({ k, color }: { k: string; color: string }) {
  const s = color;
  const faint = color + "55";
  switch (k) {
    case "cover":
      return (
        <svg viewBox="0 0 28 28" width={28} height={28} fill="none">
          <rect x={5} y={3} width={18} height={22} rx={2} fill={faint} stroke={s} strokeWidth={1.5} />
          <line x1={5} y1={3} x2={5} y2={25} stroke={s} strokeWidth={2.5} />
          <line x1={9} y1={8} x2={21} y2={8} stroke={s} strokeWidth={1} strokeOpacity={0.6} />
          <line x1={9} y1={11} x2={18} y2={11} stroke={s} strokeWidth={1} strokeOpacity={0.4} />
        </svg>
      );
    case "preface":
      return (
        <svg viewBox="0 0 28 28" width={28} height={28} fill="none">
          <path d="M4 5 Q14 3 24 5 L24 23 Q14 21 4 23 Z" fill={faint} stroke={s} strokeWidth={1.5} />
          <line x1={14} y1={4} x2={14} y2={22} stroke={s} strokeWidth={1.5} />
          <line x1={6} y1={9} x2={12} y2={9} stroke={s} strokeWidth={1} strokeOpacity={0.5} />
          <line x1={6} y1={12} x2={12} y2={12} stroke={s} strokeWidth={1} strokeOpacity={0.4} />
          <line x1={16} y1={9} x2={22} y2={9} stroke={s} strokeWidth={1} strokeOpacity={0.5} />
        </svg>
      );
    case "chapter":
      return (
        <svg viewBox="0 0 28 28" width={28} height={28} fill="none">
          <rect x={7} y={3} width={14} height={22} rx={1.5} fill={faint} stroke={s} strokeWidth={1.5} />
          <path d="M11 3 L11 13 L14 10 L17 13 L17 3" fill={s} fillOpacity={0.45} stroke={s} strokeWidth={1.2} strokeLinejoin="round" />
        </svg>
      );
    case "book":
      return (
        <svg viewBox="0 0 28 28" width={28} height={28} fill="none">
          <rect x={4} y={4} width={4} height={20} rx={1} fill={s} fillOpacity={0.7} />
          <rect x={9} y={4} width={15} height={20} rx={1.5} fill={faint} stroke={s} strokeWidth={1.5} />
          <line x1={12} y1={9} x2={21} y2={9} stroke={s} strokeWidth={1} strokeOpacity={0.5} />
          <line x1={12} y1={12} x2={20} y2={12} stroke={s} strokeWidth={1} strokeOpacity={0.4} />
          <line x1={12} y1={15} x2={19} y2={15} stroke={s} strokeWidth={1} strokeOpacity={0.35} />
        </svg>
      );
    case "shelf":
      return (
        <svg viewBox="0 0 28 28" width={28} height={28} fill="none">
          <rect x={3}  y={6} width={5} height={18} rx={1} fill={s} fillOpacity={0.65} />
          <rect x={10} y={8} width={5} height={16} rx={1} fill={faint} stroke={s} strokeWidth={1.5} />
          <rect x={17} y={5} width={5} height={19} rx={1} fill={s} fillOpacity={0.5} />
          <line x1={1} y1={25} x2={27} y2={25} stroke={s} strokeWidth={1.5} />
        </svg>
      );
    case "library":
      return (
        <svg viewBox="0 0 28 28" width={28} height={28} fill="none">
          {[2, 6, 10, 14, 18, 22].map((x, i) => (
            <rect key={i} x={x} y={6 + (i % 3) * 2} width={3} height={18 - (i % 3) * 2} rx={0.5} fill={s} fillOpacity={0.4 + (i % 3) * 0.15} />
          ))}
          <line x1={0} y1={25} x2={28} y2={25} stroke={s} strokeWidth={1.5} />
        </svg>
      );
    case "series":
      return (
        <svg viewBox="0 0 28 28" width={28} height={28} fill="none">
          {[1, 3.5, 6, 8.5, 11, 13.5, 16, 18.5, 21, 23.5].map((x, i) => (
            <rect key={i} x={x} y={5 + (i % 4) * 1.5} width={2} height={18 - (i % 4) * 1.5} rx={0.5}
              fill={s} fillOpacity={0.3 + (i % 4) * 0.15} />
          ))}
          <line x1={0} y1={25} x2={28} y2={25} stroke={s} strokeWidth={1.5} />
        </svg>
      );
    case "next":
      return (
        <svg viewBox="0 0 28 28" width={28} height={28} fill="none">
          {/* book */}
          <rect x={3} y={8} width={12} height={15} rx={1.5} fill={faint} stroke={s} strokeWidth={1.5} />
          <line x1={3} y1={8} x2={3} y2={23} stroke={s} strokeWidth={2} />
          {/* hand receiving */}
          <path d="M14 18 Q18 16 22 17 L25 17 Q26 18 25 19 L16 21" stroke={s} strokeWidth={1.5} fill="none" strokeLinecap="round" />
          <path d="M16 21 L14 22" stroke={s} strokeWidth={1.5} strokeLinecap="round" />
          {/* motion arrow */}
          <path d="M18 13 L22 16 L18 19" stroke={s} strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return <svg viewBox="0 0 28 28" width={28} height={28} />;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function LibraryRecursion() {
  const { lang } = useLang();
  const [selected, setSelected] = useState(3); // default: "book" (index 3)
  const [autoPlay, setAutoPlay] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const layer = RECURSION_LAYERS[selected];
  const totalLayers = RECURSION_LAYERS.length;

  const goTo = useCallback((idx: number) => {
    setSelected((idx + totalLayers) % totalLayers);
  }, [totalLayers]);

  // Auto-play
  useEffect(() => {
    if (autoPlay) {
      intervalRef.current = setInterval(() => {
        setSelected(prev => (prev + 1) % totalLayers);
      }, 3500);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [autoPlay, totalLayers]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(selected - 1);
      } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        goTo(selected + 1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected, goTo]);

  const advice = ADVICE[layer.k];

  return (
    <div className="holo rounded-2xl p-6 md:p-8" ref={containerRef}>

      {/* ── gold quote bar ─────────────────────────────────────────────── */}
      <div className="flex gap-3 items-start mb-8 p-4 rounded-xl"
        style={{ background: "rgba(212,175,85,0.06)", border: "1px solid rgba(212,175,85,0.14)" }}>
        <span className="text-vital-500 text-2xl font-display leading-none mt-0.5 flex-shrink-0">"</span>
        <p className="italic text-vital-300 text-sm leading-relaxed font-display">
          <T v={{
            en: "There is no right way to use a library. There is only the wrong way — to walk past it.",
            zh: "使用图书馆没有对的方式。只有错的一种——从它身边走过去。",
          }} />
        </p>
      </div>

      {/* ── main body: ladder + detail panel ──────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-8">

        {/* ── Ladder SVG ────────────────────────────────────────────────── */}
        <div className="flex-shrink-0">
          <svg
            viewBox="0 0 220 400"
            width={220}
            height={400}
            className="block"
            aria-label="Reading ladder with 8 levels"
          >
            {RECURSION_LAYERS.map((l, i) => {
              const y = i * 50;
              const isActive = i === selected;
              const baseColor = l.color;
              return (
                <g
                  key={l.k}
                  className="cursor-pointer"
                  onClick={() => setSelected(i)}
                  tabIndex={0}
                  role="button"
                  aria-label={l.name[lang]}
                  onKeyDown={e => { if (e.key === "Enter") setSelected(i); }}
                >
                  {/* band fill */}
                  <rect
                    x={0} y={y} width={220} height={49}
                    fill={baseColor}
                    fillOpacity={isActive ? 0.22 : 0.09}
                    style={{ transition: "fill-opacity 0.25s" }}
                  />
                  {/* active outline */}
                  {isActive && (
                    <rect
                      x={0.5} y={y + 0.5} width={219} height={48}
                      fill="none"
                      stroke={baseColor}
                      strokeWidth={1.5}
                      rx={2}
                    />
                  )}
                  {/* index label */}
                  <text
                    x={10} y={y + 29}
                    fontFamily="JetBrains Mono, monospace"
                    fontSize={9}
                    letterSpacing={2}
                    fill={baseColor}
                    fillOpacity={0.7}
                    textAnchor="start"
                    dominantBaseline="middle"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </text>
                  {/* icon */}
                  <foreignObject x={30} y={y + 11} width={28} height={28}>
                    <div style={{ width: 28, height: 28 }}>
                      <LayerIcon k={l.k} color={baseColor} />
                    </div>
                  </foreignObject>
                  {/* layer name */}
                  <text
                    x={68} y={y + 26}
                    fontFamily="Cormorant Garamond, EB Garamond, Georgia, serif"
                    fontSize={13}
                    fontWeight={isActive ? "600" : "400"}
                    fill={isActive ? "#fae4a3" : "#cfc6a8"}
                    dominantBaseline="middle"
                    style={{ transition: "fill 0.2s, font-weight 0.2s" }}
                  >
                    {l.name[lang]}
                  </text>
                  {/* scale badge */}
                  <text
                    x={210} y={y + 26}
                    fontFamily="JetBrains Mono, monospace"
                    fontSize={8}
                    letterSpacing={1}
                    fill={baseColor}
                    fillOpacity={isActive ? 0.9 : 0.5}
                    textAnchor="end"
                    dominantBaseline="middle"
                  >
                    {l.scale[lang]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* ── Detail panel ──────────────────────────────────────────────── */}
        <div
          key={layer.k}
          className="flex-1 rounded-xl p-5 flex flex-col gap-4"
          style={{
            border: `1px solid ${layer.color}33`,
            background: `linear-gradient(145deg, ${layer.color}0a, rgba(5,6,15,0.7))`,
            animation: "riseIn 0.38s cubic-bezier(0.2,0.7,0.2,1) both",
          }}
        >
          {/* layer name */}
          <div>
            <div
              className="font-display text-3xl font-semibold leading-tight mb-1"
              style={{ color: layer.color }}
            >
              <T v={layer.name} />
            </div>
            <div className="label-mono text-[0.6rem]" style={{ color: layer.color, opacity: 0.7 }}>
              <T v={layer.scale} />
            </div>
          </div>

          {/* move */}
          <div className="text-sm text-ghost-200 leading-relaxed">
            <T v={layer.move} />
          </div>

          {/* Try this */}
          <div
            className="rounded-lg p-4"
            style={{ background: `${layer.color}12`, border: `1px solid ${layer.color}22` }}
          >
            <div className="label-mono text-[0.58rem] mb-2" style={{ color: layer.color }}>
              <T v={{ en: "TRY THIS", zh: "如何实践" }} />
            </div>
            <p className="text-sm text-ghost-200 leading-relaxed">
              <T v={advice} />
            </p>
          </div>

          {/* spacer */}
          <div className="flex-1" />

          {/* step indicator */}
          <div
            className="text-right font-mono text-[0.62rem]"
            style={{ color: layer.color, opacity: 0.6 }}
          >
            {String(selected + 1).padStart(2, "0")} / {String(totalLayers).padStart(2, "0")}
          </div>
        </div>
      </div>

      {/* ── Controls ───────────────────────────────────────────────────── */}
      <div className="mt-6 flex flex-col gap-4">

        {/* Progress dots */}
        <div className="flex items-center gap-1.5 justify-center">
          {RECURSION_LAYERS.map((l, i) => (
            <button
              key={l.k}
              onClick={() => setSelected(i)}
              aria-label={l.name[lang]}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === selected ? "24px" : "6px",
                height: "6px",
                background: i === selected ? layer.color : "rgba(212,175,85,0.25)",
              }}
            />
          ))}
        </div>

        {/* Button row */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => goTo(selected - 1)}
            className="px-4 py-1.5 rounded-full border border-vital-500/25 text-vital-300 text-sm hover:border-vital-500/60 hover:text-vital-200 transition-colors"
          >
            <T v={{ en: "← Prev", zh: "← 上一级" }} />
          </button>

          <button
            onClick={() => setAutoPlay(ap => !ap)}
            className="px-4 py-1.5 rounded-full border text-sm transition-all duration-200"
            style={autoPlay
              ? { borderColor: layer.color, color: layer.color, background: `${layer.color}15` }
              : { borderColor: "rgba(212,175,85,0.25)", color: "#a89c7e" }}
          >
            <T v={{ en: autoPlay ? "⏸ Pause" : "▶ Auto", zh: autoPlay ? "⏸ 暂停" : "▶ 自动" }} />
          </button>

          <button
            onClick={() => goTo(selected + 1)}
            className="px-4 py-1.5 rounded-full border border-vital-500/25 text-vital-300 text-sm hover:border-vital-500/60 hover:text-vital-200 transition-colors"
          >
            <T v={{ en: "Next →", zh: "下一级 →" }} />
          </button>
        </div>

        {/* Footnote label */}
        <p className="text-center label-mono text-[0.58rem] text-vital-500/60">
          <T v={{ en: "From a cover to a life", zh: "从封面到一生" }} />
        </p>
      </div>

      {/* ── Closing footnote ───────────────────────────────────────────── */}
      <p className="mt-8 italic text-sm text-vital-300 border-t border-vital-500/10 pt-5">
        <T v={{
          en: "\"The shelf belongs to whoever opens it. Open it.\"",
          zh: "\"书架属于打开它的人。打开它。\"",
        }} />
      </p>
    </div>
  );
}
