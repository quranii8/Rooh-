import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1B5E20",
          dark: "#0F3E13",
          light: "#2E7D32",
          50: "#E8F3E9",
          100: "#C8E2CB",
          500: "#2E7D32",
          600: "#1B5E20",
          700: "#0F3E13",
        },
        gold: {
          DEFAULT: "#C8A951",
          light: "#E5CB7A",
          dark: "#A88830",
          50: "#FBF3DC",
          100: "#F5E5B5",
        },
        cream: "#FFF8E7",
      },
      fontFamily: {
        quran: ["var(--font-amiri)", "Amiri", "Scheherazade New", "serif"],
        arabic: ["var(--font-noto-kufi)", "Noto Kufi Arabic", "system-ui", "sans-serif"],
        naskh: ["var(--font-noto-naskh)", "Noto Naskh Arabic", "serif"],
        en: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "shimmer": "shimmer 1.5s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
