/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          'IBM Plex Mono',
          'ui-monospace',
          'SFMono-Regular',
          'monospace',
        ],
      },
      colors: {
        brand: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
      },
      borderRadius: {
        'sm': '6px',
        'DEFAULT': '8px',
        'md': '8px',
        'lg': '10px',
        'xl': '12px',
      },
      fontSize: {
        'financial-sm': ['24px', { lineHeight: '30px', fontWeight: '700', letterSpacing: '-0.02em' }],
        'financial': ['32px', { lineHeight: '38px', fontWeight: '700', letterSpacing: '-0.02em' }],
        'financial-lg': ['36px', { lineHeight: '42px', fontWeight: '700', letterSpacing: '-0.02em' }],
      },
    },
  },
  plugins: [],
}
