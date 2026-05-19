/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B35',     // Nepal orange
        secondary: '#004E89',   // Nepal blue
        accent: '#F7B801',      // Accent yellow
        success: '#06A77D',     // Green
        error: '#D62828',       // Red
        warning: '#F77F00',     // Orange
        light: '#F5F5F5',       // Light background
        dark: '#1A1A1A',        // Dark text
      },
      spacing: {
        'safe': 'max(1rem, env(safe-area-inset-bottom))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
