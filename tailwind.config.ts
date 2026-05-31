import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          50: "#e8f5f0",
          100: "#c5e6d8",
          200: "#9ed5be",
          300: "#6dc29f",
          400: "#3fae85",
          500: "#178B6A",
          600: "#147a5d",
          700: "#10654c",
          800: "#0c4f3c",
          900: "#08382a",
        },
        status: {
          confirmed: "#178B6A",
          pending: "#D97706",
          cancelled: "#DC2626",
          checked_in: "#2563EB",
          checked_out: "#6B7280",
        },
        ink: {
          DEFAULT: "rgb(var(--color-ink) / <alpha-value>)",
          muted: "rgb(var(--color-ink-muted) / <alpha-value>)",
          subtle: "rgb(var(--color-ink-subtle) / <alpha-value>)",
        },
        line: "rgb(var(--color-line) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        canvas: "rgb(var(--color-canvas) / <alpha-value>)",
      },
      borderRadius: {
        card: "12px",
      },
      borderWidth: {
        hair: "0.5px",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
