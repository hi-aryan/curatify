/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            colors: {
                dark: '#2F2F2F',
                light: '#FAFFEC',
                green: '#6CE395',
                blue: '#2757B2',
                pink: '#EF476F',
            },
            borderRadius: {
                DEFAULT: 'var(--radius)',
            },
            animation: {
                'equalizer-1': 'equalizer 0.8s ease-in-out infinite',
                'equalizer-2': 'equalizer 1s ease-in-out 0.1s infinite',
                'equalizer-3': 'equalizer 0.75s ease-in-out 0.2s infinite',
                'equalizer-4': 'equalizer 0.9s ease-in-out 0.15s infinite',
                'equalizer-5': 'equalizer 0.85s ease-in-out 0.25s infinite',
            },
            keyframes: {
                equalizer: {
                    '0%, 100%': {
                        transform: 'scaleY(0.3)',
                    },
                    '50%': {
                        transform: 'scaleY(1)',
                    },
                },
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
