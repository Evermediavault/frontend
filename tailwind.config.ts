import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      aspectRatio: {
        projectCard: '711 / 506',
      },
      keyframes: {
        /* Transform-only enter animation; avoids opacity utility fighting keyframes */
        'modal-in': {
          from: { transform: 'scale(0.96) translateY(0.35rem)' },
          to: { transform: 'scale(1) translateY(0)' },
        },
        'vault-panel-in': {
          from: { opacity: '0', transform: 'scale(0.96) translateY(8px)' },
          to: { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'vault-card-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'modal-in': 'modal-in 0.22s cubic-bezier(0.22, 1, 0.36, 1) both',
        'vault-panel-in': 'vault-panel-in 0.25s cubic-bezier(0.22, 1, 0.36, 1) both',
        'vault-card-in': 'vault-card-in 0.3s ease both',
      },
    },
  },
  plugins: [],
};
export default config;
