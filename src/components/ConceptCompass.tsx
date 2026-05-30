"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { T, useLang } from "./lang";
import { CONCEPTS, PROFILES } from "./content";
import type { Concept, Profile } from "./content";

// ─── per-profile scores (E C G M U L A Z) ───────────────────────────────────
const SCORES: Record<Profile["key"], number[]> = {
  "first-time": [55, 70, 85, 60, 50, 80, 40, 55],
  "deep":       [75, 80, 75, 85, 85, 78, 60, 82],
  "humanist":   [55, 70, 50, 72, 58, 68, 92, 60],
};

const PROFILE_COLORS: Record<Profile["key"], string> = {
  "first-time": "#d4af55",
  "deep":       "#9986ff",
  "humanist":   "#c4304a",
};

const PROFILE_BG: Record<Profile["key"], string> = {
  "first-time": "rgba(212,175,85,0.15)",
  "deep":       "rgba(153,134,255,0.15)",
  "humanist":   "rgba(196,48,74,0.15)",
};

const PROFILE_BORDER: Record<Profile["key"], string> = {
  "first-time": "rgba(212,175,85,0.55)",
  "deep":       "rgba(153,134,255,0.55)",
  "humanist":   "rgba(196,48,74,0.55)",
};

// ─── octagon maths ───────────────────────────────────────────────────────────
const CX = 180;
const CY = 180;
const R  = 150;   // outer radius

function octagonPoint(axisIdx: number, frac: number): [number, number] {
  // axis 0 = top, going clockwise
  const angle = (Math.PI * 2 * axisIdx) / 8 - Math.PI / 2;
  return [CX + frac * R * Math.cos(angle), CY + frac * R * Math.sin(angle)];
}

function octagonRingPoints(frac: number): string {
  return Array.from({ length: 8 }, (_, i) => {
    const [x, y] = octagonPoint(i, frac);
    return `${x},${y}`;
  }).join(" ");
}

function profilePolygon(scores: number[]): string {
  return scores
    .map((s, i) => {
      const [x, y] = octagonPoint(i, s / 100);
      return `${x},${y}`;
    })
    .join(" ");
}

// ─── lerp between two polygons ───────────────────────────────────────────────
function lerpPoints(a: number[], b: number[], t: number): number[] {
  return a.map((v, i) => v + (b[i] - v) * t);
}

function scoresFromPoints(pts: string): number[] {
  return pts.split(" ").map(p => parseFloat(p));
}

function pointsFromScores(scores: number[]): number[] {
  return scores.flatMap((s, i) => {
    const [x, y] = octagonPoint(i, s / 100);
    return [x, y];
  });
}

function flatToPolyStr(flat: number[]): string {
  const pairs: string[] = [];
  for (let i = 0; i < flat.length; i += 2) pairs.push(`${flat[i]},${flat[i + 1]}`);
  return pairs.join(" ");
}

export default function ConceptCompass() {
  const { lang } = useLang();
  const [activeProfile, setActiveProfile] = useState<Profile["key"]>("first-time");
  const [hoveredConcept, setHoveredConcept] = useState<number | null>(null);
  const [animPoly, setAnimPoly] = useState<string>(() => profilePolygon(SCORES["first-time"]));
  const animRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);
  const prevPolyRef = useRef<string>(profilePolygon(SCORES["first-time"]));
  const targetKeyRef = useRef<Profile["key"]>("first-time");

  const startAnim = useCallback((toKey: Profile["key"]) => {
    targetKeyRef.current = toKey;
    const fromFlat = scoresFromPoints(prevPolyRef.current)
      .reduce<number[][]>((acc, _, i, arr) => {
        if (i % 2 === 0) acc.push([arr[i], arr[i + 1]]);
        return acc;
      }, [])
      .flat();
    const toFlat = pointsFromScores(SCORES[toKey]);

    const startTime = performance.now();
    const duration = 600;

    if (animRef.current) cancelAnimationFrame(animRef.current);

    const tick = (now: number) => {
      const raw = (now - startTime) / duration;
      const t = raw >= 1 ? 1 : 1 - Math.pow(1 - raw, 3); // ease-out cubic
      const interp = lerpPoints(fromFlat, toFlat, t);
      const polyStr = flatToPolyStr(interp);
      setAnimPoly(polyStr);
      if (raw < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        prevPolyRef.current = polyStr;
      }
    };
    animRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  const handleProfileChange = (key: Profile["key"]) => {
    prevPolyRef.current = animPoly;
    setActiveProfile(key);
    startAnim(key);
  };

  const activeColor = PROFILE_COLORS[activeProfile];
  const otherProfiles = (["first-time", "deep", "humanist"] as Profile["key"][]).filter(k => k !== activeProfile);

  // ── label positions (outside the octagon) ─────────────────────────────────
  const labelPositions = CONCEPTS.map((_, i) => {
    const [x, y] = octagonPoint(i, 1.18);
    return { x, y };
  });

  // ── spoke highlight for hovered concept ──────────────────────────────────
  const activeSpokeEnd = hoveredConcept !== null ? octagonPoint(hoveredConcept, 1) : null;

  return (
    <div className="holo rounded-2xl p-6 md:p-10">
      {/* Subtitle */}
      <p className="text-ghost-300 text-sm mb-8 max-w-xl">
        <T v={{ en: "Eight concepts the series keeps returning to. Pick a reader profile to see how it weights them.", zh: "丛书反复回返的八个概念。选一种读者档案，看它对这些概念的加权。" }} />
      </p>

      {/* Profile toggle pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {PROFILES.map(p => {
          const isActive = p.key === activeProfile;
          return (
            <button
              key={p.key}
              onClick={() => handleProfileChange(p.key)}
              style={isActive ? { background: PROFILE_BG[p.key], borderColor: PROFILE_BORDER[p.key], color: PROFILE_COLORS[p.key] } : {}}
              className={[
                "px-4 py-1.5 rounded-full border text-sm transition-all duration-200",
                isActive
                  ? "border-transparent font-semibold"
                  : "border-ghost-700/40 text-ghost-300 hover:border-ghost-500/60",
              ].join(" ")}
            >
              <T v={p.name} />
            </button>
          );
        })}
      </div>

      {/* Main content: radar + grid */}
      <div className="flex flex-col lg:flex-row gap-10 items-start">

        {/* ── SVG radar ─────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 mx-auto lg:mx-0">
          <svg viewBox="0 0 360 360" width={360} height={360} className="overflow-visible">
            {/* concentric octagonal grid rings */}
            {[0.2, 0.4, 0.6, 0.8, 1.0].map(f => (
              <polygon
                key={f}
                points={octagonRingPoints(f)}
                fill="none"
                stroke="rgba(212,175,85,0.12)"
                strokeWidth={1}
              />
            ))}

            {/* spokes */}
            {CONCEPTS.map((_, i) => {
              const [x, y] = octagonPoint(i, 1);
              const isHovered = hoveredConcept === i;
              return (
                <line
                  key={i}
                  x1={CX} y1={CY} x2={x} y2={y}
                  stroke={isHovered ? activeColor : "rgba(212,175,85,0.14)"}
                  strokeWidth={isHovered ? 2 : 1}
                  style={{ transition: "stroke 0.2s, stroke-width 0.2s" }}
                />
              );
            })}

            {/* ghost polygons for the other two profiles */}
            {otherProfiles.map(k => (
              <polygon
                key={k}
                points={profilePolygon(SCORES[k])}
                fill={PROFILE_COLORS[k]}
                fillOpacity={0.07}
                stroke={PROFILE_COLORS[k]}
                strokeWidth={1}
                strokeOpacity={0.15}
              />
            ))}

            {/* active profile polygon — animated */}
            <polygon
              points={animPoly}
              fill={activeColor}
              fillOpacity={0.24}
              stroke={activeColor}
              strokeWidth={2}
              strokeLinejoin="round"
            />

            {/* glowing dots at active vertices */}
            {SCORES[activeProfile].map((s, i) => {
              const [x, y] = octagonPoint(i, s / 100);
              return (
                <circle
                  key={i}
                  cx={x} cy={y} r={hoveredConcept === i ? 6 : 4}
                  fill={activeColor}
                  style={{
                    filter: `drop-shadow(0 0 6px ${activeColor})`,
                    transition: "r 0.2s",
                  }}
                />
              );
            })}

            {/* axis labels */}
            {CONCEPTS.map((c, i) => {
              const { x, y } = labelPositions[i];
              const isHovered = hoveredConcept === i;
              return (
                <text
                  key={i}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={isHovered ? "15" : "13"}
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="700"
                  fill={isHovered ? activeColor : "#d4af55"}
                  style={{ transition: "font-size 0.2s, fill 0.2s", cursor: "pointer" }}
                  onMouseEnter={() => setHoveredConcept(i)}
                  onMouseLeave={() => setHoveredConcept(null)}
                >
                  {c.sym}
                </text>
              );
            })}
          </svg>
        </div>

        {/* ── Concept grid ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3 flex-1 w-full">
          {CONCEPTS.map((c, i) => {
            const score = SCORES[activeProfile][i];
            const isHovered = hoveredConcept === i;
            return (
              <div
                key={c.sym}
                onMouseEnter={() => setHoveredConcept(i)}
                onMouseLeave={() => setHoveredConcept(null)}
                style={{
                  borderColor: isHovered ? activeColor : "rgba(212,175,85,0.12)",
                  boxShadow: isHovered ? `0 0 18px -6px ${activeColor}` : "none",
                }}
                className="relative rounded-xl border bg-void-900/60 p-3 cursor-default transition-all duration-200"
              >
                {/* big symbol */}
                <div
                  className="font-display text-4xl font-bold leading-none mb-1"
                  style={{ color: isHovered ? activeColor : "#d4af55" }}
                >
                  {c.sym}
                </div>

                {/* concept name */}
                <div className="text-xs font-semibold text-ghost-100 mb-0.5">
                  <T v={c.name} />
                </div>

                {/* gloss */}
                <div className="text-[0.65rem] text-ghost-500 leading-snug mb-2">
                  <T v={c.gloss} />
                </div>

                {/* score bar */}
                <div className="w-full h-1 rounded-full bg-void-700 overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${score}%`, background: activeColor }}
                  />
                </div>
                <div className="text-[0.6rem] font-mono" style={{ color: activeColor }}>
                  {score}
                </div>

                {/* book chips */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {c.bookIds.map(bid => (
                    <a
                      key={bid}
                      href={`#${bid}`}
                      className="text-[0.58rem] font-mono px-1.5 py-0.5 rounded border border-vital-500/20 text-vital-300 hover:border-vital-500/60 hover:text-vital-300 transition-colors"
                      style={{ background: "rgba(212,175,85,0.06)" }}
                    >
                      {bid.slice(0, 3).toUpperCase()}
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Profile description */}
      {PROFILES.map(p =>
        p.key === activeProfile ? (
          <div key={p.key} className="mt-8 flex gap-3 items-start">
            <div
              className="w-1 flex-shrink-0 rounded-full h-12 mt-0.5"
              style={{ background: activeColor }}
            />
            <div>
              <div className="text-sm font-semibold mb-0.5" style={{ color: activeColor }}>
                <T v={p.name} />
              </div>
              <div className="text-sm text-ghost-300">
                <T v={p.note} />
              </div>
            </div>
          </div>
        ) : null
      )}

      {/* Closing quote */}
      <p className="mt-8 italic text-sm text-vital-300 border-t border-vital-500/10 pt-5">
        <T v={{
          en: "\"The deepest concepts in popular science are usually the ones you can carry without knowing the equations.\"",
          zh: "\"科普中最深的概念，往往是『不必会公式也能带走』的那些。\"",
        }} />
      </p>
    </div>
  );
}
