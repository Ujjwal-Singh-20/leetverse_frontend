/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: {
                    DEFAULT: 'var(--bg-primary)',
                    secondary: 'var(--bg-secondary)',
                },
                accent: {
                    DEFAULT: 'var(--accent-primary)',
                    glow: 'var(--accent-glow)',
                },
                text: {
                    primary: 'var(--text-primary)',
                    secondary: 'var(--text-secondary)',
                },
            },
            fontFamily: {
                display: ['var(--font-display)', 'system-ui'],
                mono: ['var(--font-mono)', 'monospace'],
                body: ['var(--font-body)', 'sans-serif'],
            },
            animation: {
                'staggered-reveal': 'reveal 0.5s ease-out forwards',
                'glow-pulse': 'glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'scanline': 'scanline 8s linear infinite',
            },
            keyframes: {
                reveal: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'glow-pulse': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.6' },
                },
                scanline: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100%)' },
                },
            },
        },
    },
    plugins: [],
}
