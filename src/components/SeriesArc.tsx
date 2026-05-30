"use client";

import { useState } from "react";
import { T, useLang, Bi } from "./lang";
import { BOOKS, SUB_SERIES, Book } from "./content";

/* ─── layout constants ─────────────────────────────────────── */
const SVG_W = 720;
const SVG_H = 320;
const PAD_L = 48;
const PAD_R = 40;
const PAD_B = 52;        // room for axis labels
const PAD_T = 24;
const AXIS_Y = SVG_H - PAD_B;
const PLOT_W = SVG_W - PAD_L - PAD_R;
const YEAR_MIN = 1940;
const YEAR_MAX = 2010;
const DECADES = [1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010];

/* Assign each sub-series its own row above the axis */
const ROW_GAP = 38;
const seriesRowMap: Record<string, number> = {
  "series-cosmos":    1,   // closest to axis
  "series-physics":   2,
  "series-life":      3,
  "series-synthesis": 4,
  "series-other":     5,
};

function xForYear(year: number): number {
  return PAD_L + ((year - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)) * PLOT_W;
}

function yForRow(row: number): number {
  return AXIS_Y - row * ROW_GAP;
}

/* Look up accent colour from the sub-series */
function accentFor(seriesId: string): string {
  return SUB_SERIES.find((s) => s.id === seriesId)?.accent ?? "#d4af55";
}

/* ─── Tooltip ───────────────────────────────────────────────── */
interface TooltipProps {
  book: Book;
  x: number;
  y: number;
}
function Tooltip({ book, x, y }: TooltipProps) {
  const { lang } = useLang();
  const accent = accentFor(book.seriesId);
  // keep tooltip inside SVG
  const tx = Math.min(x + 12, SVG_W - 160);
  const ty = Math.max(y - 90, 8);
  return (
    <g pointerEvents="none">
      <rect
        x={tx} y={ty} width={152} height={80} rx={6}
        fill="#0a0e1f" stroke={accent} strokeOpacity={0.5} strokeWidth={1}
      />
      <text x={tx + 8} y={ty + 16} fill={accent} fontSize={9} fontFamily="JetBrains Mono, monospace">
        {book.shelfNum} · {book.origYear}
      </text>
      <foreignObject x={tx + 8} y={ty + 22} width={136} height={52}>
        <div
          style={{ fontSize: 9, lineHeight: 1.35, color: "#f7f1de", fontFamily: "Manrope, sans-serif" }}
        >
          <div style={{ color: accent, fontFamily: "Cormorant Garamond, serif", fontSize: 10.5, marginBottom: 2 }}>
            {lang === "zh" ? book.zhTitle : book.enTitle}
          </div>
          <div style={{ opacity: 0.8 }}>
            {lang === "zh" ? book.author.zh : book.author.en}
          </div>
        </div>
      </foreignObject>
    </g>
  );
}

/* ─── Main Component ────────────────────────────────────────── */
export default function SeriesArc() {
  const { lang } = useLang();
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string>("b07-what-is-life");

  const selectedBook = BOOKS.find((b) => b.id === selected) ?? BOOKS[6];
  const hoveredBook  = hovered ? BOOKS.find((b) => b.id === hovered) ?? null : null;
  const tooltipBook  = hoveredBook ?? null;

  /* precompute dot positions */
  const dots = BOOKS.map((book) => {
    const row  = seriesRowMap[book.seriesId] ?? 1;
    const cx   = xForYear(parseInt(book.origYear, 10));
    const cy   = yForRow(row);
    const accent = accentFor(book.seriesId);
    return { book, cx, cy, accent };
  });

  /* find tooltip coords */
  const ttDot = tooltipBook ? dots.find((d) => d.book.id === tooltipBook.id) : null;

  return (
    <div className="holo rounded-2xl p-6 md:p-8">
      {/* heading */}
      <div className="mb-1">
        <p className="label-mono mb-2 text-vital-400">
          <T v={{ en: "Publication Timeline", zh: "出版时间线" }} />
        </p>
        <h3 className="display text-2xl md:text-3xl text-vital-300">
          <T v={{ en: "Sixty-Three Years of Publication", zh: "六十三年的出版" }} />
        </h3>
        <p className="mt-1.5 text-sm text-ghost-300">
          <T v={{
            en: "The 13 originals, from Schrödinger in 1944 to Gribbin in 2007.",
            zh: "十三本原书，自 1944 年的薛定谔，至 2007 年的格里宾。",
          }} />
        </p>
      </div>

      {/* SVG timeline */}
      <div className="mt-5 overflow-x-auto">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          width="100%"
          style={{ maxWidth: SVG_W, display: "block" }}
          aria-label={lang === "zh" ? "出版年份时间线" : "Publication year timeline"}
        >
          {/* faint background rows */}
          {SUB_SERIES.map((s) => {
            const row = seriesRowMap[s.id] ?? 1;
            const ry  = yForRow(row);
            return (
              <line
                key={s.id}
                x1={PAD_L} y1={ry} x2={SVG_W - PAD_R} y2={ry}
                stroke={s.accent} strokeOpacity={0.08} strokeWidth={1}
                strokeDasharray="3 6"
              />
            );
          })}

          {/* series row labels (right side) */}
          {SUB_SERIES.map((s) => {
            const row = seriesRowMap[s.id] ?? 1;
            const ry  = yForRow(row);
            return (
              <text
                key={s.id}
                x={SVG_W - PAD_R + 6}
                y={ry + 4}
                fill={s.accent}
                fontSize={9}
                fontFamily="JetBrains Mono, monospace"
                opacity={0.85}
              >
                {s.num}
              </text>
            );
          })}

          {/* axis baseline */}
          <line
            x1={PAD_L} y1={AXIS_Y} x2={SVG_W - PAD_R} y2={AXIS_Y}
            stroke="#d4af55" strokeOpacity={0.3} strokeWidth={1}
          />

          {/* decade ticks + labels */}
          {DECADES.map((yr) => {
            const tx = xForYear(yr);
            return (
              <g key={yr}>
                <line x1={tx} y1={AXIS_Y} x2={tx} y2={AXIS_Y + 6} stroke="#d4af55" strokeOpacity={0.35} strokeWidth={1} />
                <text
                  x={tx} y={AXIS_Y + 17}
                  fill="#a89c7e" fontSize={9}
                  fontFamily="JetBrains Mono, monospace"
                  textAnchor="middle"
                >
                  {yr}
                </text>
              </g>
            );
          })}

          {/* stems + dots */}
          {dots.map(({ book, cx, cy, accent }) => {
            const isSelected = book.id === selected;
            const isHovered  = book.id === hovered;
            const active     = isSelected || isHovered;
            const r = active ? 9 : 6;
            return (
              <g
                key={book.id}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHovered(book.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setSelected(book.id)}
              >
                {/* stem */}
                <line
                  x1={cx} y1={AXIS_Y}
                  x2={cx} y2={cy + r}
                  stroke={accent}
                  strokeOpacity={active ? 0.7 : 0.25}
                  strokeWidth={active ? 1.5 : 1}
                />
                {/* outer glow when active */}
                {active && (
                  <circle cx={cx} cy={cy} r={r + 5} fill={accent} opacity={0.15} />
                )}
                {/* dot */}
                <circle
                  cx={cx} cy={cy} r={r}
                  fill={active ? accent : "#0a0e1f"}
                  stroke={accent}
                  strokeWidth={active ? 0 : 1.5}
                  strokeOpacity={0.8}
                  style={{ transition: "r 0.15s" }}
                />
                {/* shelf number */}
                <text
                  x={cx} y={cy + 3.5}
                  textAnchor="middle"
                  fill={active ? "#05060f" : accent}
                  fontSize={active ? 7.5 : 6.5}
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="600"
                  pointerEvents="none"
                  opacity={active ? 1 : 0.75}
                >
                  {book.shelfNum}
                </text>
              </g>
            );
          })}

          {/* tooltip overlay */}
          {ttDot && (
            <Tooltip book={ttDot.book} x={ttDot.cx} y={ttDot.cy} />
          )}
        </svg>
      </div>

      {/* selected-book detail panel */}
      <div
        className="mt-5 rounded-xl border p-4 transition-colors"
        style={{
          borderColor: `${accentFor(selectedBook.seriesId)}40`,
          background: "rgba(10,14,31,0.6)",
        }}
      >
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-1">
              <span
                className="mono text-xs font-bold"
                style={{ color: accentFor(selectedBook.seriesId) }}
              >
                {selectedBook.shelfNum}
              </span>
              <span className="mono text-xs text-ghost-500">{selectedBook.origYear}</span>
            </div>
            <div className="display text-lg leading-tight" style={{ color: accentFor(selectedBook.seriesId) }}>
              {lang === "zh" ? selectedBook.zhTitle : selectedBook.enTitle}
            </div>
            {(lang === "zh" ? selectedBook.zhSubtitle : selectedBook.enSubtitle) && (
              <div className="mt-0.5 text-xs text-ghost-500 italic">
                {lang === "zh" ? selectedBook.zhSubtitle : selectedBook.enSubtitle}
              </div>
            )}
            <div className="mt-1 text-sm text-ghost-300">
              <T v={selectedBook.author} />
            </div>
          </div>
          <div className="shrink-0 self-end">
            <a
              href={`#${selectedBook.id}`}
              className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs transition hover:opacity-80"
              style={{
                borderColor: `${accentFor(selectedBook.seriesId)}50`,
                color: accentFor(selectedBook.seriesId),
                background: `${accentFor(selectedBook.seriesId)}18`,
              }}
            >
              <T v={{ en: "Open this book", zh: "打开这本书" }} />
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>

      {/* closing caption */}
      <p className="mt-5 text-center text-xs italic text-vital-300/70 leading-relaxed">
        <T v={{
          en: "\"Read the dates — and notice how many of these books are still standing.\"",
          zh: "\"读一读年份——并留意：其中有多少本仍然立着。\"",
        }} />
      </p>
    </div>
  );
}
