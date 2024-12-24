/** @type {import('tailwindcss').Config} */
export const content = [
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  './pages/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
];

export const theme = {
  extend: {
    colors: {
      light: {
        primary: '#4F46E5',
        primary_light: '#6366f1',
        secondary: '#FB923C',
        accent: '#155E75',
        border: '#D6DADF',
        background: '#F9FAFB',
        card: '#FFFFFF',
        title: '#1e293b',
        body: '#333333',
      },
      dark: {
        primary: '#4F46E5',
        secondary: '#FB923C',
        background: '#0f172a',
        card: '#334155',
        title: '#FAFAFA',
        body: '#94a3b8',
      },
    },
    fontFamily: {
      inter: ['Inter', 'sans-serif'],
      inria: ['Inria Sans', 'sans-serif'],
    },
    backgroundImage: {
      'splash-background-small': "url('/images/small 640x426 house.jpg')",
      'splash-background-medium': "url('/images/medium 1920x1280 house.jpg')",
      'splash-background-large': "url('/images/large 2400x1600 house.jpg')",
      'splash-background-xlarge':
        "url('/images/extra large 5352x3568 house.jpg')",
    },
  },
};

export const plugins = [];

export const darkMode = 'selector'; // Configures Dark Mode when the HTML tag has class="dark" set.
