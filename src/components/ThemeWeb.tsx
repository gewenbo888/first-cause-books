"use client";

import { useState } from "react";
import { T, useLang } from "./lang";
import { THEMES, BOOKS, Theme, Book } from "./content";

/* ─── layout constants ──────────────────────────────────────── */
const SVG_W = 720;
const SVG_H = 480;
const CX     = 360;
const CY     = 240;
const T_RADIUS = 190;   // theme nodes orbit radius
const B_RADIUS = 110;   // book nodes inner orbit

/* ─── deterministic positions ──────────────────────────────── */
// 9 themes evenly around the circle, starting at -90° (top)
function themePos(i: number): [number, number] {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 9;
  return [CX + T_RADIUS * Math.cos(angle), CY + T_RADIUS * Math.sin(angle)];
}

// 13 books: fixed positions derived by distributing them in two rings,
// staggered so they sit between theme nodes.
// Inner ring (6 books) + outer belt (7 books), both smaller than T_RADIUS.
const BOOK_POSITIONS: [number, number][] = [
  // inner ring — 6 books at radius ~70, starting 10° offset
  [ CX + 70 * Math.cos(-Math.PI/2 + 0.18),        CY + 70 * Math.sin(-Math.PI/2 + 0.18)        ],
  [ CX + 70 * Math.cos(-Math.PI/2 + 1.22),        CY + 70 * Math.sin(-Math.PI/2 + 1.22)        ],
  [ CX + 70 * Math.cos(-Math.PI/2 + 2.28),        CY + 70 * Math.sin(-Math.PI/2 + 2.28)        ],
  [ CX + 70 * Math.cos(-Math.PI/2 + 3.30),        CY + 70 * Math.sin(-Math.PI/2 + 3.30)        ],
  [ CX + 70 * Math.cos(-Math.PI/2 + 4.35),        CY + 70 * Math.sin(-Math.PI/2 + 4.35)        ],
  [ CX + 70 * Math.cos(-Math.PI/2 + 5.40),        CY + 70 * Math.sin(-Math.PI/2 + 5.40)        ],
  // middle ring — 7 books at radius ~130, offset by half a step
  [ CX + 130 * Math.cos(-Math.PI/2 + 0.48),       CY + 130 * Math.sin(-Math.PI/2 + 0.48)       ],
  [ CX + 130 * Math.cos(-Math.PI/2 + 1.38),       CY + 130 * Math.sin(-Math.PI/2 + 1.38)       ],
  [ CX + 130 * Math.cos(-Math.PI/2 + 2.28),       CY + 130 * Math.sin(-Math.PI/2 + 2.28)       ],
  [ CX + 130 * Math.cos(-Math.PI/2 + 3.18),       CY + 130 * Math.sin(-Math.PI/2 + 3.18)       ],
  [ CX + 130 * Math.cos(-Math.PI/2 + 4.08),       CY + 130 * Math.sin(-Math.PI/2 + 4.08)       ],
  [ CX + 130 * Math.cos(-Math.PI/2 + 4.98),       CY + 130 * Math.sin(-Math.PI/2 + 4.98)       ],
  [ CX + 130 * Math.cos(-Math.PI/2 + 5.88),       CY + 130 * Math.sin(-Math.PI/2 + 5.88)       ],
];

/* build a stable index */
const BOOK_INDEX = Object.fromEntries(BOOKS.map((b) => [b.id, b]));
const THEME_INDEX = Object.fromEntries(THEMES.map((t, i) => [t.key, i]));
const BOOK_ORDER = BOOKS.map((b) => b.id);   // 0-based order

/* for each book, which themes reference it */
function themesForBook(bookId: string): string[] {
  return THEMES.filter((t) => t.bookIds.includes(bookId)).map((t) => t.key);
}

/* ─── component ─────────────────────────────────────────────── */
export default function ThemeWeb() {
  const { lang } = useLang();
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);
  const [hoveredBook,  setHoveredBook]  = useState<string | null>(null);
  const [selected,     setSelected]     = useState<string>("life");

  /* resolve what to highlight */
  const activeTheme = hoveredTheme ?? selected;
  const activeBook  = hoveredBook ?? null;

  function isEdgeActive(themeKey: string, bookId: string): boolean {
    if (activeBook)  return themesForBook(activeBook).includes(themeKey);
    if (activeTheme) return themeKey === activeTheme;
    return false;
  }

  function themeNodeOpacity(themeKey: string): number {
    if (!activeTheme && !activeBook) return 1;
    if (activeBook) return themesForBook(activeBook).includes(themeKey) ? 1 : 0.18;
    return themeKey === activeTheme ? 1 : 0.22;
  }

  function bookNodeOpacity(bookId: string): number {
    if (!activeTheme && !activeBook) return 1;
    if (activeBook) return bookId === activeBook ? 1 : 0.18;
    if (activeTheme) {
      const theme = THEMES[THEME_INDEX[activeTheme]];
      return theme?.bookIds.includes(bookId) ? 1 : 0.18;
    }
    return 1;
  }

  const selectedThemeObj = THEMES.find((t) => t.key === selected);

  return (
    <div className="holo rounded-2xl p-6 md:p-8">
      {/* heading */}
      <div className="mb-1">
        <p className="label-mono mb-2 text-vital-400">
          <T v={{ en: "Thematic Web", zh: "主题关系网" }} />
        </p>
        <h3 className="display text-2xl md:text-3xl text-vital-300">
          <T v={{ en: "Nine Themes That Cross the Shelves", zh: "贯穿书架的九条线索" }} />
        </h3>
        <p className="mt-1.5 text-sm text-ghost-300">
          <T v={{
            en: "Each theme picks out the books that speak to it. Books appear under multiple themes.",
            zh: "每一线索挑出与之对话的书。书可以出现在多条线索之下。",
          }} />
        </p>
      </div>

      {/* SVG graph */}
      <div className="mt-5 overflow-x-auto">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          width="100%"
          style={{ maxWidth: SVG_W, display: "block" }}
          aria-label={lang === "zh" ? "主题与书目关系网络图" : "Theme-to-book network diagram"}
        >
          {/* subtle radial guide circles */}
          <circle cx={CX} cy={CY} r={70}  fill="none" stroke="#d4af55" strokeOpacity={0.05} strokeWidth={1} />
          <circle cx={CX} cy={CY} r={130} fill="none" stroke="#d4af55" strokeOpacity={0.05} strokeWidth={1} />
          <circle cx={CX} cy={CY} r={T_RADIUS} fill="none" stroke="#d4af55" strokeOpacity={0.06} strokeWidth={1} />

          {/* edges — rendered first so they appear below nodes */}
          {THEMES.map((theme, ti) => {
            const [tx, ty] = themePos(ti);
            return theme.bookIds.map((bookId) => {
              const bi = BOOK_ORDER.indexOf(bookId);
              if (bi < 0) return null;
              const [bx, by] = BOOK_POSITIONS[bi];
              const active = isEdgeActive(theme.key, bookId);
              return (
                <line
                  key={`e-${theme.key}-${bookId}`}
                  x1={tx} y1={ty} x2={bx} y2={by}
                  stroke={theme.accent}
                  strokeOpacity={active ? 0.55 : 0.06}
                  strokeWidth={active ? 1.5 : 1}
                  style={{ transition: "stroke-opacity 0.2s, stroke-width 0.2s" }}
                />
              );
            });
          })}

          {/* book nodes */}
          {BOOKS.map((book, bi) => {
            const [bx, by] = BOOK_POSITIONS[bi];
            const opacity  = bookNodeOpacity(book.id);
            const isActive = book.id === activeBook;
            const r = isActive ? 12 : 9;
            return (
              <g
                key={book.id}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoveredBook(book.id)}
                onMouseLeave={() => setHoveredBook(null)}
              >
                {isActive && (
                  <circle cx={bx} cy={by} r={r + 6} fill={book.accent} opacity={0.15} />
                )}
                <circle
                  cx={bx} cy={by} r={r}
                  fill={isActive ? book.accent : "#0a0e1f"}
                  stroke={book.accent}
                  strokeWidth={isActive ? 0 : 1.5}
                  strokeOpacity={0.8}
                  opacity={opacity}
                  style={{ transition: "opacity 0.2s, r 0.15s" }}
                />
                <text
                  x={bx} y={by + 3.5}
                  textAnchor="middle"
                  fill={isActive ? "#05060f" : book.accent}
                  fontSize={6.5}
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="600"
                  pointerEvents="none"
                  opacity={opacity}
                  style={{ transition: "opacity 0.2s" }}
                >
                  {book.shelfNum}
                </text>
              </g>
            );
          })}

          {/* theme nodes — rendered last (on top) */}
          {THEMES.map((theme, ti) => {
            const [tx, ty] = themePos(ti);
            const opacity  = themeNodeOpacity(theme.key);
            const isActive = theme.key === activeTheme && !activeBook;
            const r = isActive ? 22 : 18;
            const label = theme.name[lang];
            return (
              <g
                key={theme.key}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoveredTheme(theme.key)}
                onMouseLeave={() => setHoveredTheme(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (selected === theme.key) setSelected("");
                  else setSelected(theme.key);
                }}
                onDoubleClick={(e) => { e.stopPropagation(); setSelected(""); }}
              >
                {isActive && (
                  <circle cx={tx} cy={ty} r={r + 8} fill={theme.accent} opacity={0.13} />
                )}
                <circle
                  cx={tx} cy={ty} r={r}
                  fill={isActive ? `${theme.accent}22` : "#0a0e1f"}
                  stroke={theme.accent}
                  strokeWidth={isActive ? 2 : 1.5}
                  strokeOpacity={0.9}
                  opacity={opacity}
                  style={{ transition: "opacity 0.2s" }}
                />
                {/* label — split into two lines if too long */}
                <text
                  x={tx} y={ty + 3}
                  textAnchor="middle"
                  fill={theme.accent}
                  fontSize={lang === "zh" ? 9 : 8}
                  fontFamily={lang === "zh" ? "Noto Serif SC, serif" : "Cormorant Garamond, serif"}
                  fontWeight="600"
                  pointerEvents="none"
                  opacity={opacity}
                  style={{ transition: "opacity 0.2s" }}
                >
                  {label.length > 9
                    ? (
                      <>
                        <tspan x={tx} dy="-4">{label.slice(0, Math.ceil(label.length / 2))}</tspan>
                        <tspan x={tx} dy="11">{label.slice(Math.ceil(label.length / 2))}</tspan>
                      </>
                    )
                    : label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* selected-theme detail card */}
      {selectedThemeObj && (
        <div
          className="mt-5 rounded-xl border p-4 transition-colors"
          style={{
            borderColor: `${selectedThemeObj.accent}40`,
            background: "rgba(10,14,31,0.6)",
          }}
        >
          <div
            className="display text-xl mb-1"
            style={{ color: selectedThemeObj.accent }}
          >
            <T v={selectedThemeObj.name} />
          </div>
          <p className="text-sm text-ghost-300 mb-3">
            <T v={selectedThemeObj.gloss} />
          </p>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-ghost-500">
              <T v={{ en: "Books in this theme:", zh: "此线索中的书：" }} />
            </span>
            {selectedThemeObj.bookIds.map((bookId) => {
              const book = BOOK_INDEX[bookId];
              if (!book) return null;
              return (
                <a
                  key={bookId}
                  href={`#${bookId}`}
                  className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs transition hover:opacity-80"
                  style={{
                    borderColor: `${selectedThemeObj.accent}40`,
                    color: selectedThemeObj.accent,
                    background: `${selectedThemeObj.accent}14`,
                  }}
                >
                  <span className="mono opacity-60">{book.shelfNum}</span>
                  <span>{lang === "zh" ? book.zhTitle : book.enTitle}</span>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* closing caption */}
      <p className="mt-5 text-center text-xs italic text-vital-300/70 leading-relaxed">
        <T v={{
          en: "\"A bookshelf is not a list. It is a network of cross-references the reader assembles.\"",
          zh: "\"一座书架不是一份清单。它是读者所组装出来的、一张交叉引用之网。\"",
        }} />
      </p>
    </div>
  );
}
