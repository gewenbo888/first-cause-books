"use client";

import { T, useLang } from "./lang";
import { ROADMAPS, BOOKS, Roadmap, Book } from "./content";

/* ── helpers ──────────────────────────────────────────────────────────── */

function timeLabel(count: number): { en: string; zh: string } {
  if (count <= 2) return { en: "a long weekend", zh: "一个长周末" };
  return { en: "a fortnight", zh: "两周" };
}

/* ── Book chip ────────────────────────────────────────────────────────── */

function BookChip({ book }: { book: Book }) {
  const { lang } = useLang();
  const title = lang === "zh" ? book.zhTitle : book.enTitle;
  return (
    <a
      href={`#${book.id}`}
      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-void-900 shrink-0"
      style={{
        background: `${book.accent}1a`,
        border: `1px solid ${book.accent}55`,
        color: book.accent,
      }}
    >
      <span
        className="mono text-[0.58rem] font-bold opacity-70 shrink-0"
        style={{ color: book.accent }}
      >
        {book.shelfNum}
      </span>
      <span
        className="max-w-[120px] truncate leading-tight"
        style={{ fontFamily: lang === "zh" ? '"Noto Serif SC", serif' : "inherit" }}
      >
        {title}
      </span>
    </a>
  );
}

/* ── Arrow connector ─────────────────────────────────────────────────── */

function Arrow({ color }: { color: string }) {
  return (
    <svg
      width="18"
      height="10"
      viewBox="0 0 18 10"
      fill="none"
      aria-hidden
      className="shrink-0 self-center"
    >
      <path
        d="M0 5h14m0 0-4-4m4 4-4 4"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.6"
      />
    </svg>
  );
}

/* ── Roadmap card ─────────────────────────────────────────────────────── */

function RoadmapCard({ rm }: { rm: Roadmap }) {
  const books = rm.bookIds
    .map((id) => BOOKS.find((b) => b.id === id))
    .filter((b): b is Book => b !== undefined);
  const time = timeLabel(books.length);

  return (
    <article
      className="holo rounded-xl p-6 md:p-7 flex flex-col gap-4"
      style={{ borderLeft: `4px solid ${rm.accent}` }}
    >
      {/* Heading */}
      <div>
        <h3
          className="display text-xl md:text-2xl font-semibold leading-snug text-ghost-50"
          style={{ color: rm.accent }}
        >
          <T v={rm.name} />
        </h3>
        <p className="mt-2 text-sm md:text-base italic leading-relaxed text-ghost-300">
          <T v={rm.rationale} />
        </p>
      </div>

      {/* Path label */}
      <div className="label-mono" style={{ color: `${rm.accent}cc` }}>
        <T v={{ en: "The path:", zh: "路径：" }} />
      </div>

      {/* Book chip sequence */}
      <div className="flex flex-wrap items-center gap-2">
        {books.map((book, i) => (
          <div key={book.id} className="flex items-center gap-2">
            <BookChip book={book} />
            {i < books.length - 1 && <Arrow color={rm.accent} />}
          </div>
        ))}
      </div>

      {/* Total time */}
      <div
        className="mt-auto flex items-center gap-2 pt-2 border-t"
        style={{ borderColor: `${rm.accent}22` }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden
          className="shrink-0 opacity-60"
        >
          <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M6 3v3l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <span className="mono text-xs" style={{ color: `${rm.accent}99` }}>
          <T v={{ en: "Total time:", zh: "所需时间：" }} />{" "}
          <span style={{ color: rm.accent }}>
            <T v={time} />
          </span>
        </span>
      </div>
    </article>
  );
}

/* ── Root export ─────────────────────────────────────────────────────── */

export default function ReadingRoadmap() {
  return (
    <div>
      {/* Intro epigraph */}
      <p className="mb-10 max-w-2xl text-base italic leading-relaxed text-vital-300/80 md:text-lg">
        <T
          v={{
            en: "\"Pick the question you actually have. The right two or three books, in the right order, do more than reading the whole shelf in the wrong one.\"",
            zh: "\"挑出你确实抱着的那个问题。对的两三本，按对的顺序，比按错的顺序读完整架书更有用。\"",
          }}
        />
      </p>

      {/* 2-column grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {ROADMAPS.map((rm) => (
          <RoadmapCard key={rm.key} rm={rm} />
        ))}
      </div>
    </div>
  );
}
