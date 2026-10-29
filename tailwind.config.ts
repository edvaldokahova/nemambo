import type { Config } from "tailwindcss";

// Identidade Pedro Nemambo: tinta azul-noite, papel, carmim.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        tinta: { DEFAULT: "#0F1A29", soft: "#1B2A3F", deep: "#0A121D" },
        papel: { DEFAULT: "#F7F4EE", escuro: "#EDE8DF", claro: "#FCFAF6" },
        carmim: { DEFAULT: "#A3211A", claro: "#C0392B" },
        texto: "#1D232B",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      opacity: { 15: ".15", 35: ".35", 45: ".45", 55: ".55", 65: ".65", 85: ".85" },
      keyframes: {
        sobe: { "0%": { opacity: "0", transform: "translateY(14px)" }, "100%": { opacity: "1", transform: "none" } },
        fade: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
      },
      animation: { sobe: "sobe .8s cubic-bezier(.2,.7,.2,1) both", fade: "fade .3s ease both" },
    },
  },
  plugins: [],
};
export default config;
