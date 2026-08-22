/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        anj: {
          bg: '#E4E4FF',
          accent: '#FB5EA8',
          accentDark: '#E04E96',
          ink: '#1A1530',
          muted: '#6B6480',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '18px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        soft: '0 4px 24px -8px rgba(26, 21, 48, 0.10)',
        softer: '0 2px 12px -4px rgba(26, 21, 48, 0.08)',
        accent: '0 8px 24px -8px rgba(251, 94, 168, 0.45)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pop': {
          '0%': { transform: 'scale(0.96)' },
          '60%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out both',
        'pop': 'pop 0.3s ease-out both',
        'shimmer': 'shimmer 1.4s linear infinite',
      },
    },
  },
  plugins: [],
};
