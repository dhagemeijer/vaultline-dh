/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0D0C0A",
        panel: "#17150F",
        panel2: "#1D1B15",
        hairline: "#2C2820",
        parchment: "#F3F1EA",
        risky: "#C23B3B",
        safe: "#8A8680",
        stable: "#F3F1EA",
        pos: "#4CAF7D",
        neg: "#C23B3B",
        accent: "#C23B3B",
      },
      fontFamily: {
        display: ["var(--font-display)", "Space Grotesk", "-apple-system", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono-jb)", "ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      boxShadow: {
        glow: "0 0 12px 1px rgba(194, 59, 59, 0.35)",
        "glow-pos": "0 0 12px 1px rgba(76, 175, 125, 0.35)",
      },
    },
  },
  plugins: [],
};
