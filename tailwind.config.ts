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
          primary: '#1a7a4a',
          light: '#e6f7ee',
          mid: '#25a863',
          dark: '#15633c',
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
