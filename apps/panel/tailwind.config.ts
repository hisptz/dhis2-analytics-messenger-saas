import type {Config} from 'tailwindcss'

const config: Config = {
		content: [
				'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
				'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
				'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
		], theme: {
				extend: {
						colors: {
								primary: {
										'50': '#f0f9ff',
										'100': '#e0f1fe',
										'200': '#b9e5fe',
										'300': '#7cd1fd',
										'400': '#36bbfa',
										'500': '#0ca2eb',
										'600': '#008edd',
										'700': '#0166a3',
										'800': '#065786',
										'900': '#0b486f',
										'950': '#072e4a',
								},
								secondary: {
										'50': '#ffffe7',
										'100': '#feffc1',
										'200': '#fffc86',
										'300': '#fff241',
										'400': '#ffe30d',
										'500': '#ffd400',
										'600': '#d19c00',
										'700': '#a66f02',
										'800': '#89560a',
										'900': '#74470f',
										'950': '#442504',
								},
						}
				}
		},
		plugins: [],
}
export default config
