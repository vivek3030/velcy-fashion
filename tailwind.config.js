/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Poppins', 'sans-serif'],
            },
            colors: {
                primary: '#1a1a1a',
                secondary: '#f5f5f5',
                accent: '#d4af37', // Gold-ish
            }
        },
    },
    plugins: [],
}
