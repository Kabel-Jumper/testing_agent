import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          darkBlue: "#1B4A6B",
          teal: "#29A9A3",
          orange: "#F2823A",
          slate: "#334155",
          bgSoft: "#F4F7F9",
          border: "#E2E8F0",
        },
      },
    },
  },
  plugins: [],
};
export default config;
