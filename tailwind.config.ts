import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        axo: {
          black: "#020403",
          panel: "#07100c",
          glass: "rgba(9, 24, 17, 0.68)",
          green: "#39ff88",
          mint: "#8fffd0",
          red: "#ff5a7a",
          amber: "#f8d267",
          steel: "#91a99b"
        }
      },
      boxShadow: {
        glow: "0 0 36px rgba(57, 255, 136, 0.22)",
        panel: "0 24px 80px rgba(0, 0, 0, 0.42)"
      },
      backgroundImage: {
        "matrix-grid":
          "linear-gradient(rgba(57,255,136,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,136,0.08) 1px, transparent 1px)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.04)" }
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        }
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
        ticker: "ticker 28s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
