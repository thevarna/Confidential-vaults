import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}'
	],
	theme: {
		extend: {
			colors: {
				'primary-dark': '#0C0C0C',
				'primary-brand': '#5024FF',
				'primary-brand-light': '#987FFF',
				'secondary-brand': '#763D16',
				'secondary-brand-light': '#F6851B',
			},
			fontFamily: {
				mono: ['var(--font-mono)'],
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
			keyframes: {
				monaldak: {
					'0%': { transform: 'translateY(-100px) rotate(0deg)' },
					'100%': { transform: 'translateY(85vh) rotate(360deg)' },
				}
			},
			animation: {
				monaldak: 'monaldak 4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
			}
		},
	},
	plugins: [],
};
export default config;
