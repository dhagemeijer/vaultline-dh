/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#F6F4EF",
        panel: "#FFFFFF",
        panel2: "#FBF9F4",
        hairline: "#E4E1D8",
        parchment: "#141210",
        risky: "#8B0000",
        safe: "#5C5952",
        stable: "#141210",
        pos: "#2F6B3A",
        neg: "#8B0000",
      },
      fontFamily: {
        display: ["Georgia", "Iowan Old Style", "Palatino Linotype", "serif"],
        body: ["-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};
