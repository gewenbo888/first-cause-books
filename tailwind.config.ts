import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // void — deep cosmic night, the colour of the 第一推动 series covers
        void: {
          950: "#05060f",
          900: "#0a0e1f",
          800: "#10162c",
          700: "#181f3c",
          600: "#1f2a4d",
          500: "#28365f",
        },
        // vital — STARLIGHT GOLD (PRIMARY — the series mark, the carried lantern)
        vital: {
          600: "#a88638",
          500: "#d4af55",
          400: "#e8c466",
          300: "#fae4a3",
        },
        // pulse — CRIMSON (medicine, attention, the body)
        pulse: {
          600: "#9a1f33",
          500: "#c4304a",
          400: "#dc4664",
          300: "#e87a93",
        },
        // bio — EMERALD (life sciences, the green of the living shelf)
        bio: {
          600: "#1f8868",
          500: "#2eb88c",
          400: "#52d2a8",
          300: "#80e1c0",
        },
        // clinical — AURORA CYAN (computation, the synthesis shelf)
        clinical: {
          600: "#1ea4d4",
          500: "#5ddcff",
          400: "#88e6ff",
          300: "#b6f0ff",
        },
        // neuro — DEEP VIOLET (physics & mind, the emergent shelf)
        neuro: {
          600: "#6f5dde",
          500: "#9986ff",
          400: "#b3a4ff",
          300: "#d0c5ff",
        },
        // ghost — aged starlit paper
        ghost: {
          50:  "#f7f1de",
          100: "#ede6ca",
          200: "#cfc6a8",
          300: "#a89c7e",
          500: "#7a705a",
          700: "#3a3528",
        },
      },
      fontFamily: {
        // display — Cormorant Garamond (literary serif, fits cosmic gravitas)
        display: ['"Cormorant Garamond"', '"EB Garamond"', "ui-serif", "Georgia", "serif"],
        sans: ['"Manrope"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
        zh: ['"Noto Serif SC"', "serif"],
      },
      boxShadow: {
        biocard: "inset 0 1px 0 rgba(232,196,102,0.08), 0 24px 60px -28px rgba(0,0,0,0.95)",
        glow:    "0 0 40px -8px rgba(212,175,85,0.55)",
        star:    "0 0 28px -6px rgba(232,196,102,0.65)",
      },
    },
  },
  plugins: [],
};

export default config;
