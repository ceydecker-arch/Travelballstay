import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          primary: '#2D6A4F',
          light: '#e8f5ee',
          mid: '#3a8c64',
          dark: '#1f4d38',
        },
        amber: {
          accent: '#f59e0b',
          light: '#fef3c7',
        },
        navy: '#0f1f2e',
        bg: '#f5f8fa',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
}
export default config
