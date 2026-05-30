"use client";

import { ReactNode, useEffect, useState } from "react";
import { LangProvider, LangToggle, T, useLang } from "./lang";
import { SERIES, HERO, TICKER, FOREWORD, AFTERWORD, SUB_SERIES, BOOKS, Book, Series } from "./content";

import CosmicShelf from "./CosmicShelf";
import SeriesArc from "./SeriesArc";
import ThemeWeb from "./ThemeWeb";
import ReadingRoadmap from "./ReadingRoadmap";
import AuthorsConstellation from "./AuthorsConstellation";
import ConceptCompass from "./ConceptCompass";
import LibraryRecursion from "./LibraryRecursion";

/* ---------------- Header ---------------- */
function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-vital-500/10 bg-void-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
        <a href="#top" className="flex items-center gap-2.5 group">
          <svg viewBox="0 0 32 32" className="h-7 w-7 shrink-0" aria-hidden>
            <defs>
              <linearGradient id="glyph-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#fae4a3" />
                <stop offset="1" stopColor="#a88638" />
              </linearGradient>
              <radialGradient id="glyph-glow" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0"   stopColor="#fae4a3" stopOpacity="0.85" />
                <stop offset="0.5" stopColor="#d4af55" stopOpacity="0.4" />
                <stop offset="1"   stopColor="#d4af55" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="32" height="32" rx="8" fill="#0a0e1f" />
            <rect x="0.6" y="0.6" width="30.8" height="30.8" rx="7.6" fill="none" stroke="#d4af55" strokeOpacity="0.36" />
            <circle cx="6"  cy="6"  r={0.5} fill="#fae4a3"/>
            <circle cx="26" cy="7"  r={0.6} fill="#fae4a3"/>
            <circle cx="8"  cy="24" r={0.5} fill="#fae4a3"/>
            <circle cx="25" cy="25" r={0.7} fill="#fae4a3"/>
            <circle cx="16" cy="16" r={9} fill="url(#glyph-glow)"/>
            <path d="M16 5 L17.2 14.8 L27 16 L17.2 17.2 L16 27 L14.8 17.2 L5 16 L14.8 14.8 Z" fill="url(#glyph-g)" stroke="#a88638" strokeWidth={0.3}/>
          </svg>
          <div className="leading-none">
            <div className="display text-base font-semibold tracking-tight text-ghost-50">First Cause</div>
            <div className="label-mono mt-0.5 text-[0.5rem]">第一推动</div>
          </div>
        </a>

        <nav className="hidden items-center gap-5 text-[0.82rem] text-ghost-300 lg:flex">
          <a href="#foreword" className="transition hover:text-vital-300"><T v={{ en: "Foreword", zh: "前言" }}/></a>
          {SUB_SERIES.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="transition hover:text-vital-300">
              <T v={{ en: s.num, zh: s.title.zh.split(" · ")[0] }} />
            </a>
          ))}
          <a href="#roadmap" className="transition hover:text-vital-300"><T v={{ en: "Roadmap", zh: "路径" }}/></a>
          <a href="#compass" className="transition hover:text-vital-300"><T v={{ en: "Concepts", zh: "概念" }}/></a>
          <a href="#afterword" className="transition hover:text-vital-300"><T v={{ en: "After", zh: "之后" }}/></a>
        </nav>

        <div className="flex items-center gap-3">
          <LangToggle />
          <button onClick={() => setOpen((o) => !o)} className="lg:hidden rounded-md border border-vital-500/20 px-2 py-1 text-ghost-300" aria-label="menu">☰</button>
        </div>
      </div>
      {open && (
        <div className="border-t border-vital-500/10 bg-void-900/95 px-5 py-3 lg:hidden">
          <div className="grid grid-cols-1 gap-2 text-sm text-ghost-300">
            <a href="#foreword" onClick={() => setOpen(false)} className="py-1 hover:text-vital-300"><span className="mono mr-2 text-vital-500/70">0</span><T v={{ en: "Foreword", zh: "前言" }}/></a>
            {SUB_SERIES.map((s) => (
              <a key={s.id} href={`#${s.id}`} onClick={() => setOpen(false)} className="py-1 hover:text-vital-300">
                <span className="mono mr-2 text-vital-500/70">{s.num}</span><T v={s.title}/>
              </a>
            ))}
            <a href="#afterword" onClick={() => setOpen(false)} className="py-1 hover:text-vital-300"><span className="mono mr-2 text-vital-500/70">∞</span><T v={{ en: "Afterword", zh: "之后" }}/></a>
          </div>
        </div>
      )}
    </header>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden">
      <CosmicShelf />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-32 md:px-10">
        <div className="rise-in">
          <div className="label-mono mb-5 flex items-center gap-3">
            <span className="inline-block h-2 w-2 rounded-full bg-vital-500 twinkle" />
            <T v={HERO.kicker} /> · A Psyverse Atlas
          </div>
          <h1 className="display max-w-4xl text-4xl leading-[1.04] text-ghost-50 sm:text-5xl md:text-6xl lg:text-7xl">
            <T v={HERO.title} />
            <br />
            <span className="vital-text"><T v={HERO.title2} /></span>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-ghost-200 md:text-lg">
            <T v={HERO.lede} />
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <a href="#foreword" className="rounded-full bg-vital-500/15 px-6 py-3 text-sm font-semibold text-vital-300 ring-1 ring-vital-500/40 transition hover:bg-vital-500/25">
              <T v={HERO.scrollHint} /> ↓
            </a>
            <a href="#roadmap" className="text-sm text-ghost-300 underline-offset-4 transition hover:text-vital-300 hover:underline">
              <T v={{ en: "Or — start with where you want to go", zh: "或：从你想去的方向开始" }} />
            </a>
          </div>
          {/* series card */}
          <div className="mt-14 max-w-md holo rounded-xl p-5 text-sm text-ghost-200">
            <div className="label-mono mb-2"><T v={{ en: "About the series", zh: "关于丛书" }}/></div>
            <div className="display text-2xl text-vital-300"><T v={SERIES.fullName}/></div>
            <div className="text-ghost-300 mt-1 text-[0.95rem]"><T v={SERIES.tagline}/></div>
            <div className="mt-3 text-ghost-300/90 text-sm">
              <T v={SERIES.publisher}/>
              <br/><T v={{ en: "Founded", zh: "创办" }}/>: {SERIES.founded}
            </div>
            <div className="mt-4 border-t border-vital-500/20 pt-3 text-[0.78rem] leading-relaxed text-vital-300/80 italic">
              <T v={SERIES.caveat}/>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Ticker ---------------- */
function Ticker() {
  const { lang } = useLang();
  const items = [...TICKER, ...TICKER];
  return (
    <div className="relative overflow-hidden border-y border-vital-500/10 bg-void-900/50 py-3">
      <div className="ticker flex w-max gap-8 whitespace-nowrap">
        {items.map((it, i) => (
          <span key={i} className={`mono text-xs tracking-wide text-ghost-300/80 ${lang === "zh" ? "zh" : ""}`}>
            <span className="text-vital-500/70">✦</span> {it[lang]}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Foreword / Afterword ---------------- */
function FrontMatter({ block, id, viz }: { block: typeof FOREWORD; id: string; viz?: ReactNode }) {
  return (
    <section id={id} className="relative scroll-mt-20 border-t border-vital-500/10 px-6 py-24 md:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-baseline gap-4">
          <span className="display text-3xl text-vital-500/50">{block.num}</span>
          <div className="h-px flex-1 rule-life opacity-50" />
        </div>
        <h2 className="display mt-5 text-3xl text-ghost-50 md:text-5xl">
          <T v={block.title} />
        </h2>
        <h3 className="mt-2 text-base text-clinical-400 md:text-lg italic">
          <T v={block.sub} />
        </h3>
        <p className="dropcap mt-7 text-base leading-relaxed text-ghost-200 md:text-lg max-w-3xl">
          <T v={block.body} />
        </p>
        {viz && <div className="mt-12">{viz}</div>}
      </div>
    </section>
  );
}

/* ---------------- A Single Book card ---------------- */
function BookCard({ b }: { b: Book }) {
  const { lang } = useLang();
  return (
    <article id={b.id} className="relative scroll-mt-20 px-6 py-12 md:px-12">
      <div className="mx-auto max-w-5xl book-card rounded-2xl p-6 md:p-10">
        <div className="flex items-baseline gap-4 mb-4">
          <span className="display text-xl" style={{ color: `${b.accent}cc` }}>{b.shelfNum}</span>
          <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${b.accent}55, transparent)` }} />
          <span className="mono text-xs text-ghost-500">{b.origYear}</span>
        </div>

        {/* bilingual title block */}
        <div className="mb-5">
          <h3 className="display text-2xl md:text-4xl text-ghost-50">
            <span className={lang === "zh" ? "zh" : ""}>
              {lang === "zh" ? b.zhTitle : b.enTitle}
            </span>
            {(lang === "zh" ? b.zhSubtitle : b.enSubtitle) && (
              <span className="block text-base md:text-xl mt-1 text-ghost-300 italic">
                {lang === "zh" ? b.zhSubtitle : b.enSubtitle}
              </span>
            )}
          </h3>
          <div className="mt-2 text-sm md:text-base" style={{ color: b.accent }}>
            {lang === "zh"
              ? <>原书：<span className="italic">{b.enTitle}{b.enSubtitle ? `: ${b.enSubtitle}` : ""}</span></>
              : <>Chinese title: <span className={`italic ${lang === "en" ? "zh" : ""}`}>{b.zhTitle}{b.zhSubtitle ? `——${b.zhSubtitle}` : ""}</span></>}
          </div>
        </div>

        {/* author + publisher meta */}
        <div className="mb-7 text-sm text-ghost-300">
          <T v={b.author} /> · {b.origYear}
          {b.origPublisher && (<> · <T v={b.origPublisher}/></>)}
        </div>

        {/* synopsis */}
        <p className="text-[0.96rem] leading-relaxed text-ghost-200 md:text-[1.05rem]">
          <T v={b.synopsis} />
        </p>

        {/* why it matters */}
        <div className="mt-6 rounded-xl p-4" style={{ background: `${b.accent}12`, border: `1px solid ${b.accent}33` }}>
          <div className="label-mono mb-2" style={{ color: b.accent }}>
            <T v={{ en: "Why it matters", zh: "它为何重要" }} />
          </div>
          <p className="text-sm text-ghost-200 leading-relaxed">
            <T v={b.whyItMatters} />
          </p>
        </div>

        {/* key idea pull-quote */}
        <div className="mt-6 border-l-2 pl-4 italic" style={{ borderColor: b.accent }}>
          <p className="display text-base font-medium md:text-lg" style={{ color: b.accent }}>
            <T v={b.keyIdea} />
          </p>
        </div>
      </div>
    </article>
  );
}

/* ---------------- Sub-series block ---------------- */
function SeriesBlock({ s }: { s: Series }) {
  const books = BOOKS.filter((b) => b.seriesId === s.id);
  return (
    <section id={s.id} className="relative scroll-mt-20 border-t border-vital-500/10 px-6 py-24 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-baseline gap-4">
          <span className="display text-3xl" style={{ color: `${s.accent}cc` }}>· {s.num} ·</span>
          <div className="h-px flex-1 rule-life opacity-50" />
        </div>
        <h2 className="display mt-5 text-3xl text-ghost-50 md:text-5xl">
          <T v={s.title} />
        </h2>
        <h3 className="mt-2 text-base md:text-lg" style={{ color: s.accent }}>
          <T v={s.sub} />
        </h3>
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-ghost-200 md:text-lg">
          <T v={s.intro} />
        </p>
      </div>

      <div className="mt-6 space-y-2">
        {books.map((b) => <BookCard key={b.id} b={b} />)}
      </div>
    </section>
  );
}

/* ---------------- Root ---------------- */
function Engine() {
  const { lang } = useLang();
  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang]);

  return (
    <main className="relative min-h-screen grid-bg">
      <Header />
      <Hero />
      <Ticker />

      {/* foreword + timeline */}
      <FrontMatter block={FOREWORD} id="foreword" viz={<SeriesArc />} />

      {/* sub-series I + II */}
      {SUB_SERIES.slice(0, 2).map((s) => <SeriesBlock key={s.id} s={s} />)}

      {/* theme web — between Physics and Life */}
      <section className="relative scroll-mt-20 border-t border-vital-500/10 px-6 py-20 md:px-12">
        <div className="mx-auto max-w-6xl">
          <ThemeWeb />
        </div>
      </section>

      {/* sub-series III + IV */}
      {SUB_SERIES.slice(2, 4).map((s) => <SeriesBlock key={s.id} s={s} />)}

      {/* authors constellation — between Synthesis and Medicine */}
      <section className="relative scroll-mt-20 border-t border-vital-500/10 px-6 py-20 md:px-12">
        <div className="mx-auto max-w-6xl">
          <AuthorsConstellation />
        </div>
      </section>

      {/* sub-series V */}
      {SUB_SERIES.slice(4, 5).map((s) => <SeriesBlock key={s.id} s={s} />)}

      {/* reading roadmaps */}
      <section id="roadmap" className="relative scroll-mt-20 border-t border-vital-500/10 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-baseline gap-4">
            <span className="display text-2xl text-vital-500/50">↦</span>
            <div className="h-px flex-1 rule-life opacity-50" />
          </div>
          <h2 className="display mt-5 text-3xl text-ghost-50 md:text-5xl">
            <T v={{ en: "Six Reading Roadmaps", zh: "六条阅读路径" }} />
          </h2>
          <h3 className="mt-2 text-base text-clinical-400 md:text-lg italic">
            <T v={{ en: "Pick the question you bring; the books reorder themselves around it.", zh: "挑出你所带的问题；书本自会围着它重新排序。" }} />
          </h3>
          <div className="mt-12">
            <ReadingRoadmap />
          </div>
        </div>
      </section>

      {/* concept compass */}
      <section id="compass" className="relative scroll-mt-20 border-t border-vital-500/10 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-baseline gap-4">
            <span className="display text-2xl text-vital-500/50">⊕</span>
            <div className="h-px flex-1 rule-life opacity-50" />
          </div>
          <h2 className="display mt-5 text-3xl text-ghost-50 md:text-5xl">
            <T v={{ en: "Eight Concepts the Series Circles", zh: "丛书围绕的八个概念" }} />
          </h2>
          <h3 className="mt-2 text-base text-clinical-400 md:text-lg italic">
            <T v={{ en: "Entropy, code, gravity, mind, universality, life, aesthetics, emergence.", zh: "熵、编码、引力、心智、通用性、生命、美学、涌现。" }} />
          </h3>
          <div className="mt-12">
            <ConceptCompass />
          </div>
        </div>
      </section>

      {/* recursive library */}
      <section id="recursion" className="relative scroll-mt-20 border-t border-vital-500/10 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-baseline gap-4">
            <span className="display text-2xl text-vital-500/50">∞</span>
            <div className="h-px flex-1 rule-life opacity-50" />
          </div>
          <h2 className="display mt-5 text-3xl text-ghost-50 md:text-5xl">
            <T v={{ en: "Eight Ways to Use This Shelf", zh: "使用这座书架的八种方式" }} />
          </h2>
          <h3 className="mt-2 text-base text-clinical-400 md:text-lg italic">
            <T v={{ en: "From opening a cover for one minute to handing this collection to someone else.", zh: "从打开封面一分钟，到把这一合集递给另一个人。" }} />
          </h3>
          <div className="mt-12">
            <LibraryRecursion />
          </div>
        </div>
      </section>

      {/* afterword */}
      <FrontMatter block={AFTERWORD} id="afterword" />

      <section className="relative border-t border-vital-500/10 px-6 py-28 md:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <div className="label-mono mb-6"><T v={{ en: "About this atlas", zh: "关于本图集" }} /></div>
          <p className="display text-2xl leading-snug text-ghost-50 md:text-3xl">
            <T v={{ en: "An interpretive companion to a collection — not the books themselves.", zh: "对一个合集的诠释性陪读——而非那些书本身。" }} />
          </p>
          <p className="mt-6 text-base text-ghost-300">
            <T v={{ en: "Buy the books; the series is one of the great cultural projects of contemporary Chinese publishing.", zh: "请买原书；这套丛书是当代中文出版界一项伟大的文化工程。" }} />
          </p>
          <div className="mx-auto mt-12 h-px w-40 rule-life" />
          <p className="mt-10 text-sm text-ghost-500">
            <T v={{ en: "Part of the", zh: "属于" }} />{" "}
            <a href="https://psyverse.fun" className="text-vital-400 underline-offset-4 hover:underline">Psyverse</a>{" "}
            <T v={{ en: "portfolio. Source EPUB collection:", zh: "作品集。EPUB 收集来源：" }}/>{" "}
            <a href="https://github.com/cs-zone/first-cause-books" className="text-vital-400 underline-offset-4 hover:underline">cs-zone/first-cause-books</a>.
          </p>
        </div>
      </section>
    </main>
  );
}

export default function FirstCauseBooks() {
  return (
    <LangProvider>
      <Engine />
    </LangProvider>
  );
}
