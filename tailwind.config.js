/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        fontFamily: {
            primary: 'Playfair Display',
            secondary: 'Inter',
        },
        container: {
            padding: {
                DEFAULT: '1.5rem',
                lg: '3rem',
            },
        },
        screens: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
        },
        extend: {
            colors: {
                earth: {
                    100: '#F4F1EA', // Light cream/sand
                    200: '#E6E2D6',
                    300: '#D3CBB8',
                    DEFAULT: '#8C8471', // Muted brown
                    800: '#5C5648',
                    900: '#3D3930',
                },
                sage: {
                    100: '#EBF2EE',
                    300: '#C4D9CD',
                    DEFAULT: '#8FB39E', // Calming green
                    700: '#5F8570',
                },
                ocean: {
                    DEFAULT: '#6B8E9B', // Muted blue
                    dark: '#4A6570',
                },
                accent: {
                    DEFAULT: '#D99175', // Terracotta/Clay
                    hover: '#C27A5E',
                }
            },
            backgroundImage: {
                // We might need to adjust this path for Vite, usually put images in public or import them. 
                // For now keeping consistent with previous, but will verify.
                'hero': "url('/src/images2/img6.jpg.jpg')",
            },
        },
    },
    plugins: [],
}
