import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0a0a0a",
          soft: "#141414",
          line: "#1f1f1f",
        },
        bone: {
          DEFAULT: "#f6f3ee",
          soft: "#ece8e0",
        },
        gold: {
          DEFAULT: "#c8a96a",
          soft: "#d9bf86",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        widest2: "0.32em",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        floaty: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        shimmer: "shimmer 6s ease-in-out infinite",
        floaty: "floaty 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
