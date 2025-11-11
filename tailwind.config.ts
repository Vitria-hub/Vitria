import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1B5568',
        accent: '#F5D35E',
        secondary: '#6F9CEB',
        lilac: '#BCBDF6',
        lilacDark: '#9893DA',
        mint: '#64D5C3',
        dark: '#20262E',
        black: '#000000',
      },
      fontFamily: {
        sans: ['Quicksand', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
