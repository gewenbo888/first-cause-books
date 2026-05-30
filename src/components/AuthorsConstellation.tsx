"use client";

import { T, useLang } from "./lang";
import { AUTHORS, BOOKS, Author, Book } from "./content";

/* ── helpers ──────────────────────────────────────────────────────────── */

const BIRTH_MIN = 1880;
const BIRTH_MAX = 1965;
const SVG_W = 720;
const SVG_H = 96;
const AXIS_Y = 56;
const TICK_YEARS = [1880, 1900, 1920, 1940, 1960];
const LABEL_H = 18; // vertical spacing for staggered labels

function yearToX(year: number): number {
  return 28 + ((year - BIRTH_MIN) / (BIRTH_MAX - BIRTH_MIN)) * (SVG_W - 56);
}

/* Deterministic stagger: authors sorted by birth year, alternating above/below */
function buildAxisData(authors: Author[]) {
  const sorted = [...authors].sort((a, b) => Number(a.born) - Number(b.born));
  return sorted.map((a, i) => ({
    author: a,
    x: yearToX(Number(a.born)),
    above: i % 2 === 0, // even → above axis, odd → below
  }));
}

/* ── Birth-year axis SVG ─────────────────────────────────────────────── */

function BirthAxis({ authors }: { authors: Author[] }) {
  const { lang } = useLang();
  const items = buildAxisData(authors);

  return (
    <div className="w-full overflow-x-auto pb-2">
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full min-w-[480px]"
        aria-label={lang === "zh" ? "作者出生年轴" : "Author birth-year axis"}
        role="img"
      >
        {/* baseline */}
        <line
          x1={24}
          y1={AXIS_Y}
          x2={SVG_W - 24}
          y2={AXIS_Y}
          stroke="#d4af5540"
          strokeWidth="1"
        />

        {/* tick marks + year labels */}
        {TICK_YEARS.map((yr) => {
          const tx = yearToX(yr);
          return (
            <g key={yr}>
              <line x1={tx} y1={AXIS_Y - 5} x2={tx} y2={AXIS_Y + 5} stroke="#d4af5566" strokeWidth="1" />
              <text
                x={tx}
                y={AXIS_Y + 16}
                textAnchor="middle"
                fontSize="9"
                fontFamily='"JetBrains Mono", monospace'
                fill="#d4af5580"
              >
                {yr}
              </text>
            </g>
          );
        })}

        {/* author dots + labels */}
        {items.map(({ author, x, above }) => {
          const labelY = above ? AXIS_Y - LABEL_H : AXIS_Y + LABEL_H + 8;
          const tickEnd = above ? AXIS_Y - 3 : AXIS_Y + 3;
          const tickStart = above ? AXIS_Y - 10 : AXIS_Y + 10;
          const nameStr = author.name[lang];
          // Truncate long names for axis display
          const shortName = nameStr.length > 16 ? nameStr.slice(0, 14) + "…" : nameStr;
          return (
            <g key={author.key}>
              {/* connector line from dot to label */}
              <line
                x1={x}
                y1={tickStart}
                x2={x}
                y2={tickEnd}
                stroke={`${author.accent}55`}
                strokeWidth="1"
              />
              {/* glow behind dot */}
              <circle cx={x} cy={AXIS_Y} r="5" fill={author.accent} fillOpacity="0.18" />
              {/* dot */}
              <circle
                cx={x}
                cy={AXIS_Y}
                r="3.2"
                fill={author.accent}
                fillOpacity="0.85"
                stroke={author.accent}
                strokeWidth="0.5"
              />
              {/* white pinpoint */}
              <circle cx={x} cy={AXIS_Y} r="1.0" fill="#fff" fillOpacity="0.75" />
              {/* name label */}
              <text
                x={x}
                y={labelY}
                textAnchor="middle"
                fontSize="7.5"
                fontFamily={lang === "zh" ? '"Noto Serif SC", serif' : '"Manrope", sans-serif'}
                fill={author.accent}
                fillOpacity="0.82"
              >
                {shortName}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ── Book chip (for author's book list) ──────────────────────────────── */

function BookPill({ book }: { book: Book }) {
  const { lang } = useLang();
  const title = lang === "zh" ? book.zhTitle : book.enTitle;
  return (
    <a
      href={`#${book.id}`}
      className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[0.65rem] transition hover:opacity-90"
      style={{
        background: `${book.accent}18`,
        border: `1px solid ${book.accent}44`,
        color: book.accent,
      }}
    >
      <span className="mono font-bold opacity-60 text-[0.58rem]">{book.shelfNum}</span>
      <span
        className="truncate max-w-[140px]"
        style={{ fontFamily: lang === "zh" ? '"Noto Serif SC", serif' : "inherit" }}
      >
        {title}
      </span>
    </a>
  );
}

/* ── Individual author card ───────────────────────────────────────────── */

function AuthorCard({ author }: { author: Author }) {
  const { lang } = useLang();
  const books = author.bookIds
    .map((id) => BOOKS.find((b) => b.id === id))
    .filter((b): b is Book => b !== undefined);

  return (
    <article
      className="holo rounded-xl p-4 flex flex-col gap-2.5"
      style={{ borderLeft: `3px solid ${author.accent}` }}
    >
      {/* Name */}
      <div>
        <h4
          className="display text-base md:text-lg font-semibold leading-tight"
          style={{ color: author.accent }}
        >
          <span style={{ fontFamily: lang === "zh" ? '"Noto Serif SC", serif' : '"Cormorant Garamond", serif' }}>
            {author.name[lang]}
          </span>
        </h4>
        {/* Lifespan */}
        <div className="mono mt-0.5 text-[0.65rem] text-ghost-500">
          {author.born} – {author.died ?? <T v={{ en: "present", zh: "在世" }} />}
        </div>
      </div>

      {/* Discipline */}
      <div className="label-mono" style={{ color: `${author.accent}cc` }}>
        <T v={author.discipline} />
      </div>

      {/* Nobel badge */}
      {author.nobel && (
        <div
          className="inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-[0.62rem] font-medium"
          style={{
            background: `${author.accent}18`,
            border: `1px solid ${author.accent}44`,
            color: author.accent,
          }}
        >
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden>
            <polygon
              points="4.5,0.5 5.5,3.3 8.5,3.3 6.1,5.1 7,8 4.5,6.3 2,8 2.9,5.1 0.5,3.3 3.5,3.3"
              fill="currentColor"
              opacity="0.85"
            />
          </svg>
          <T v={author.nobel} />
        </div>
      )}

      {/* Wrote */}
      <div className="flex flex-col gap-1">
        <span className="mono text-[0.6rem] text-ghost-500 uppercase tracking-widest">
          <T v={{ en: "Wrote:", zh: "著有：" }} />
        </span>
        <div className="flex flex-wrap gap-1.5">
          {books.map((bk) => (
            <BookPill key={bk.id} book={bk} />
          ))}
        </div>
      </div>
    </article>
  );
}

/* ── Root export ─────────────────────────────────────────────────────── */

export default function AuthorsConstellation() {
  return (
    <div className="holo rounded-2xl p-6 md:p-8">
      {/* Section heading */}
      <div className="mb-1">
        <h2 className="display text-2xl font-semibold text-ghost-50 md:text-4xl">
          <T v={{ en: "Fifteen Minds Behind Thirteen Books", zh: "十三本书背后的十五颗心" }} />
        </h2>
        <p className="mt-2 text-sm italic text-ghost-300 md:text-base">
          <T
            v={{
              en: "Six Nobel laureates among them. Most born within fifty years of each other.",
              zh: "其中六位诺奖得主。多数人出生年相差不到五十年。",
            }}
          />
        </p>
      </div>

      {/* Divider */}
      <div className="my-6 h-px rule-life opacity-40" />

      {/* Part A — Birth-year axis */}
      <div className="mb-8">
        <div className="label-mono mb-3 text-vital-400">
          <T v={{ en: "Birth years, 1880–1965", zh: "出生年，1880–1965" }} />
        </div>
        <BirthAxis authors={AUTHORS} />
      </div>

      {/* Part B — Author cards grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {AUTHORS.map((a) => (
          <AuthorCard key={a.key} author={a} />
        ))}
      </div>

      {/* Closing caption */}
      <p className="mt-8 text-sm italic leading-relaxed text-vital-300/70 md:text-base">
        <T
          v={{
            en: "\"The shape of a popular-science library is, in the end, a portrait of who its authors were willing to write for.\"",
            zh: "\"一座科普图书馆的形状，归根到底，是『它的作者们愿意为谁而写』的一幅肖像。\"",
          }}
        />
      </p>
    </div>
  );
}
