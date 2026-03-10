import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#c17f59",
          light: "#e8c4b0",
          dark: "#9d6344",
        },
      },
    },
  },
  plugins: [],
};

export default config;
