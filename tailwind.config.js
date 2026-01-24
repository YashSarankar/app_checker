/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#6366f1",
                secondary: "#a855f7",
                background: "#0f172a",
                surface: "#1e293b",
            },
        },
    },
    plugins: [],
}
