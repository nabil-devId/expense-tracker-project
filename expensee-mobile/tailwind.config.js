/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './index.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Primary
        primary: {
          DEFAULT: '#0A3D62',
          // light: '#1560A0', // Lighter version for hover states
          // dark: '#072D47', // Darker version for pressed states
        },

        // Accent colors
        accent: {
          blue: '#3498db', // Teal/Turquoise for positive indicators
          orange: '#e67e22', // Coral Orange for notifications/CTAs
        },

        // Functional colors
        // functional: {
        //   positive: '#2ecc71', // Green for positive balances
        //   negative: '#e74c3c', // Red for negative balances
        //   neutral: '#3498db', // Blue for informational elements
        // },

        // Light mode specific
        // light: {
        //   background: '#FFFFFF',
        //   surface: '#F5F7FA',
        //   card: '#FFFFFF',
        //   textPrimary: '#1A1C1E',
        //   textSecondary: '#4B5563',
        //   border: '#E2E8F0',
        // },

        // // Dark mode specific
        // dark: {
        //   background: '#121212',
        //   surface: '#1E1E1E',
        //   card: '#2C2C2C',
        //   textPrimary: '#F9FAFB',
        //   textSecondary: '#9CA3AF',
        //   border: '#374151',
        // },
      },
    },
  },
  plugins: [],
};
