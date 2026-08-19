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
        'dusk-navy': '#14213D',
        'mist-white': '#F5F7FA',
        'beacon-amber': '#FFB627',
        'guardian-teal': '#2EC4B6',
        'alert-crimson': '#E63946',
        'slate-muted': '#6B7280',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Public Sans', 'Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse-slow 2.4s ease-out infinite',
        'pulse-fast': 'pulse-fast 0.8s ease-out infinite',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.1)', opacity: '0.4' },
        },
        'pulse-fast': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.3)', opacity: '0.2' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
