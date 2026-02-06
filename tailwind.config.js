/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        grove: {
          950: '#0a1410',
          900: '#0f1d16',
          800: '#152019',
          750: '#1a2b22',
          700: '#1e3328',
          600: '#2a4035',
          500: '#3a5442',
          400: '#5a7a65',
          300: '#6b8a76',
        },
        mithril: {
          50: '#fdf8ed',
          100: '#f9edcf',
          200: '#f0d99b',
          300: '#e5c167',
          400: '#d4b96b',
          500: '#c9a84c',
          600: '#a07c35',
          700: '#7a5c28',
        },
        sage: {
          200: '#d4ddd7',
          300: '#b8c9bd',
          400: '#8fa89b',
          500: '#6b8a76',
          600: '#5a7a65',
        },
        parchment: {
          50: '#faf8f3',
          100: '#f5f2eb',
          200: '#f0ede6',
          300: '#d4cbb8',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'Georgia', 'Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
}
