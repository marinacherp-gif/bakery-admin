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
        cream: {
          50: '#FFFDF7',
          100: '#FFF8EC',
          200: '#FFF0D3',
          300: '#FFE4B5',
        },
        brown: {
          50: '#FAF5F0',
          100: '#F0E4D4',
          200: '#D4A574',
          300: '#B8835A',
          400: '#9C6A45',
          500: '#7D5035',
          600: '#6B3F28',
          700: '#4A2C1A',
          800: '#2E1A0E',
          900: '#1A0F08',
        },
        warm: {
          gray: '#F7F4F1',
          border: '#E8DDD4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
