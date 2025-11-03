import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0b0f19",
        surface: "#121827",
        muted: "#93a4b7",
        primary: {
          DEFAULT: "#7c5cff",
          foreground: "#0b0f19"
        },
        accent: "#22d3ee",
        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.25)",
      },
    },
  },
  plugins: [],
} satisfies Config;
