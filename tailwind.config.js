/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {
            colors: {
                // Brand colors
                primary: {
                    DEFAULT: '#0066CC',
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#0066CC',
                    600: '#0052A3',
                    700: '#1e40af',
                    800: '#1e3a8a',
                    900: '#1e3a8a',
                },
                secondary: {
                    DEFAULT: '#059669',
                    50: '#ecfdf5',
                    100: '#d1fae5',
                    200: '#a7f3d0',
                    300: '#6ee7b7',
                    400: '#34d399',
                    500: '#059669',
                    600: '#047857',
                    700: '#047857',
                    800: '#065f46',
                    900: '#064e3b',
                },
                accent: {
                    DEFAULT: '#F97316',
                    50: '#fff7ed',
                    100: '#ffedd5',
                    200: '#fed7aa',
                    300: '#fdba74',
                    400: '#fb923c',
                    500: '#F97316',
                    600: '#EA580C',
                    700: '#c2410c',
                    800: '#9a3412',
                    900: '#7c2d12',
                },
                earth: {
                    DEFAULT: '#6b7280',
                    50: '#f9fafb',
                    100: '#f3f4f6',
                    200: '#e5e7eb',
                    300: '#d1d5db',
                    400: '#9ca3af',
                    500: '#6b7280',
                    600: '#4b5563',
                    700: '#374151',
                    800: '#1f2937',
                    900: '#111827',
                },
                // Professional category colors with full palettes
                yoga: {
                    DEFAULT: '#7C3AED',
                    50: '#f5f3ff',
                    100: '#ede9fe',
                    200: '#ddd6fe',
                    300: '#c4b5fd',
                    400: '#a78bfa',
                    500: '#7C3AED',
                    600: '#6d28d9',
                    700: '#5b21b6',
                },
                doctor: {
                    DEFAULT: '#0066CC',
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#0066CC',
                    600: '#0052A3',
                    700: '#1e40af',
                },
                nutrition: {
                    DEFAULT: '#059669',
                    50: '#ecfdf5',
                    100: '#d1fae5',
                    200: '#a7f3d0',
                    300: '#6ee7b7',
                    400: '#34d399',
                    500: '#059669',
                    600: '#047857',
                    700: '#047857',
                },
                psychology: {
                    DEFAULT: '#0D9488',
                    50: '#f0fdfa',
                    100: '#ccfbf1',
                    200: '#99f6e4',
                    300: '#5eead4',
                    400: '#2dd4bf',
                    500: '#0D9488',
                    600: '#0d9488',
                    700: '#0f766e',
                },
                nurse: {
                    DEFAULT: '#EC4899',
                    50: '#fdf2f8',
                    100: '#fce7f3',
                    200: '#fbcfe8',
                    300: '#f9a8d4',
                    400: '#f472b6',
                    500: '#EC4899',
                    600: '#db2777',
                    700: '#be185d',
                },
                // Semantic colors
                success: {
                    DEFAULT: '#10B981',
                    50: '#ecfdf5',
                    100: '#d1fae5',
                    500: '#10B981',
                    600: '#059669',
                },
                warning: {
                    DEFAULT: '#F59E0B',
                    50: '#fffbeb',
                    100: '#fef3c7',
                    500: '#F59E0B',
                    600: '#d97706',
                },
                error: {
                    DEFAULT: '#EF4444',
                    50: '#fef2f2',
                    100: '#fee2e2',
                    500: '#EF4444',
                    600: '#dc2626',
                },
                info: {
                    DEFAULT: '#3B82F6',
                    50: '#eff6ff',
                    100: '#dbeafe',
                    500: '#3B82F6',
                    600: '#2563eb',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                heading: ['Poppins', 'sans-serif'],
                secondary: ['Inter', 'sans-serif'],
                primary: ['Poppins', 'sans-serif'],
            },
            spacing: {
                '128': '32rem',
                '144': '36rem',
            },
            borderRadius: {
                '4xl': '2rem',
            },
            boxShadow: {
                // Standard shadows
                'card': '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                'soft': '0 2px 15px -3px rgb(0 0 0 / 0.07), 0 10px 20px -2px rgb(0 0 0 / 0.04)',
                'glow': '0 0 20px -5px rgb(0 102 204 / 0.3)',
                // Colored shadows
                'yoga': '0 10px 25px -5px rgb(124 58 237 / 0.25)',
                'doctor': '0 10px 25px -5px rgb(0 102 204 / 0.25)',
                'nutrition': '0 10px 25px -5px rgb(5 150 105 / 0.25)',
                'psychology': '0 10px 25px -5px rgb(13 148 136 / 0.25)',
                'nurse': '0 10px 25px -5px rgb(236 72 153 / 0.25)',
                // Glow effects
                'glow-primary': '0 0 30px -5px rgb(0 102 204 / 0.4)',
                'glow-success': '0 0 30px -5px rgb(16 185 129 / 0.4)',
                'glow-yoga': '0 0 30px -5px rgb(124 58 237 / 0.4)',
            },
            backgroundImage: {
                // Gradients
                'gradient-primary': 'linear-gradient(135deg, #0066CC 0%, #0D9488 100%)',
                'gradient-warm': 'linear-gradient(135deg, #F97316 0%, #EC4899 100%)',
                'gradient-yoga': 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
                'gradient-doctor': 'linear-gradient(135deg, #0066CC 0%, #3B82F6 100%)',
                'gradient-nutrition': 'linear-gradient(135deg, #059669 0%, #34d399 100%)',
                'gradient-psychology': 'linear-gradient(135deg, #0D9488 0%, #06b6d4 100%)',
                'gradient-nurse': 'linear-gradient(135deg, #EC4899 0%, #f472b6 100%)',
                'gradient-gold': 'linear-gradient(135deg, #F59E0B 0%, #FCD34D 100%)',
                // Mesh gradients for backgrounds
                'mesh-light': 'radial-gradient(at 40% 20%, hsla(240, 76%, 97%, 1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189, 100%, 96%, 1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355, 100%, 97%, 1) 0px, transparent 50%)',
                // Shimmer
                'shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
            },
            animation: {
                // Subtle floating
                'float': 'float 6s ease-in-out infinite',
                'float-slow': 'float 8s ease-in-out infinite',
                'float-delayed': 'float 6s ease-in-out 2s infinite',
                // Pulse effects
                'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                // Shimmer loading
                'shimmer': 'shimmer 2s linear infinite',
                // Bounce variations
                'bounce-slow': 'bounce 3s infinite',
                'bounce-once': 'bounce 0.5s ease-out',
                // Fade in
                'fade-in': 'fadeIn 0.5s ease-out',
                'fade-in-up': 'fadeInUp 0.5s ease-out',
                'fade-in-down': 'fadeInDown 0.5s ease-out',
                // Scale
                'scale-in': 'scaleIn 0.3s ease-out',
                // Spin slow
                'spin-slow': 'spin 8s linear infinite',
                // Gradient shift
                'gradient-shift': 'gradientShift 3s ease infinite',
                // Sparkle
                'sparkle': 'sparkle 1.5s ease-in-out infinite',
                // Count up (for numbers)
                'count-up': 'countUp 2s ease-out forwards',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'pulse-ring': {
                    '0%': { transform: 'scale(1)', opacity: '1' },
                    '50%': { transform: 'scale(1.1)', opacity: '0.5' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                shimmer: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeInDown: {
                    '0%': { opacity: '0', transform: 'translateY(-20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                gradientShift: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                sparkle: {
                    '0%, 100%': { opacity: '1', transform: 'scale(1)' },
                    '50%': { opacity: '0.5', transform: 'scale(1.2)' },
                },
                countUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
            transitionTimingFunction: {
                'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
};
