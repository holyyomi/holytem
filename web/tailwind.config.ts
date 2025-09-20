/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { gold: "#D4AF37", deep: "#C9A227", brown: "#8C6A00" },
        neutral: { 11: "#111111", 44: "#444444", 77: "#777777", line: "#EAEAEA" },
        surface: { base: "#FFFFFF", card: "#FCFCFC" },
        state: { good: "#10B981", warn: "#F59E0B", bad: "#EF4444" },
      },
      borderRadius: { xl: "12px", "2xl": "16px" },
      boxShadow: {
        card: "0 6px 20px rgba(0,0,0,.06)",
        "card-hover": "0 10px 30px rgba(0,0,0,.08)",
      },
      transitionTimingFunction: { pleasant: "cubic-bezier(.2,.8,.2,1)" },
    },
  },
  plugins: [],
};
