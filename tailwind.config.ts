import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        gold: {
          50: "#fffdf5",
          100: "#fff9e6",
          200: "#fff0bf",
          300: "#ffe699",
          400: "#ffdb73",
          500: "#ffd24d",
          600: "#e6bd45",
          700: "#bf9d3a",
          800: "#997e2e",
          900: "#735f23",
        },
      },
    },
  },
  plugins: [],
};
export default config;
