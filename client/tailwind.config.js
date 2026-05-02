/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 950: '#03030e', 900: '#070714', 800: '#0c0c20', 700: '#11112e', 600: '#181840' },
        violet: { 300: '#c4b5fd', 400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9' },
        indigo: { 400: '#818cf8', 500: '#6366f1', 600: '#4f46e5' },
        rose: { 400: '#fb7185', 500: '#f43f5e' },
        gold: '#fbbf24',
      },
      fontFamily: {
        script:  ['"Dancing Script"', 'cursive'],
        display: ['"Playfair Display"', 'serif'],
        sans:    ['"Plus Jakarta Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'float':      'float 5s ease-in-out infinite',
        'glow':       'glow 2s ease-in-out infinite alternate',
        'fade-up':    'fadeUp 0.5s ease forwards',
        'shimmer':    'shimmer 1.8s linear infinite',
        'spin-slow':  'spin 25s linear infinite',
        'twinkle':    'twinkle 3s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        float:    { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        glow:     { from: { boxShadow: '0 0 10px #7c3aed55' }, to: { boxShadow: '0 0 40px #7c3aed, 0 0 80px #7c3aed55' } },
        fadeUp:   { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer:  { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        twinkle:  { '0%': { opacity: '0.3', transform: 'scale(0.8)' }, '100%': { opacity: '1', transform: 'scale(1.2)' } },
      },
    },
  },
  plugins: [],
}
