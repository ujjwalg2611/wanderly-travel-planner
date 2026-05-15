/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['DM Sans', 'sans-serif'],
        accent: ['Cormorant Garamond', 'serif'],
      },
      colors: {
        sand: { 50: '#fdf8f0', 100: '#f7edd8', 200: '#efd9b0', 300: '#e4be80', 400: '#d69e4e', 500: '#c4842a', 600: '#a86820', 700: '#8b5119', 800: '#72411a', 900: '#5d3619' },
        ocean: { 50: '#eef8ff', 100: '#d8effe', 200: '#b9e3fd', 300: '#89d2fb', 400: '#53baf6', 500: '#2c9eef', 600: '#1a7fd4', 700: '#1764ab', 800: '#19548c', 900: '#1a4774' },
        forest: { 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d' },
        coral: { 400: '#f87171', 500: '#ef4444', 600: '#dc2626' },
        dusk: { 50: '#fdf4ff', 100: '#fae8ff', 200: '#f5d0fe', 300: '#f0abfc', 400: '#e879f9', 500: '#d946ef', 600: '#c026d3' }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-20px)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(30px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        bounceSoft: { '0%, 100%': { transform: 'translateY(-5%)' }, '50%': { transform: 'translateY(0)' } },
        pulseGlow: { '0%, 100%': { boxShadow: '0 0 20px rgba(196, 132, 42, 0.3)' }, '50%': { boxShadow: '0 0 40px rgba(196, 132, 42, 0.6)' } }
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
        'card-hover': '0 12px 40px rgba(0,0,0,0.16), 0 4px 12px rgba(0,0,0,0.08)',
        'glow-sand': '0 0 30px rgba(196, 132, 42, 0.4)',
        'glow-ocean': '0 0 30px rgba(44, 158, 239, 0.4)',
      }
    }
  },
  plugins: []
};
