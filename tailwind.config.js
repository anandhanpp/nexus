/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        black: '#000000',
        carbon: {
          950: '#000000',
          900: '#080808',
          850: '#0e0e10',
          800: '#17171a',
          750: '#222226',
          700: '#2c2c32',
          600: '#3f3f46'
        },
        navy: {
          950: '#000000',
          900: '#080808',
          850: '#0e0e10',
          800: '#17171a',
          700: '#222226',
          600: '#2c2c32'
        },
        cyber: {
          emerald: '#10b981',
          cyan: '#06b6d4',
          amber: '#f59e0b',
          crimson: '#f43f5e'
        }
      },
      fontFamily: {
        pixel: ['"Pixelify Sans"', '"Silkscreen"', 'monospace'],
        silkscreen: ['"Silkscreen"', 'monospace'],
        sans: ['"Space Grotesk"', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid-size': '24px 24px',
      }
    },
  },
  plugins: [],
}
