import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a08",
        bg2: "#0f0e0b",
        bg3: "#141310",
        bg4: "#1a1916",
        or: "#ff5e1a",
        or2: "#ff7a3d",
        or3: "#ff3d00",
        fg: "#f5f0e8",
      },
      fontFamily: {
        syne: ["var(--font-syne)", "sans-serif"],
        mono: ["var(--font-syne-mono)", "monospace"],
      },
      letterSpacing: {
        wider2: "0.38em",
        widest2: "0.28em",
      },
    },
  },
  plugins: [],
};
export default config;
