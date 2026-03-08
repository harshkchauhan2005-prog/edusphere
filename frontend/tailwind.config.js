/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#2DD4BF",
                "background-light": "#F8FAFC",
                "background-dark": "#121212",
                "card-dark": "#1E1E1E",
            },
            fontFamily: {
                display: ["Plus Jakarta Sans", "Inter", "sans-serif"],
                sans: ["Inter", "sans-serif"],
            },
            borderRadius: {
                DEFAULT: "1rem",
                'xl': '1.5rem',
                '2xl': '2rem',
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms')
    ],
}
