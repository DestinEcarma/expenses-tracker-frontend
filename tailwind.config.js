/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			gridTemplateRows: {
				0: "repeat(1, minmax(0, 0fr))",
			},
			keyframes: {
				"fade-in": {
					"0%": { opacity: 0 },
					"100%": { opacity: 1 },
				},
				"fade-out": {
					"0%": { opacity: 1 },
					"100%": { opacity: 0, display: "none" },
				},
			},
			animation: {
				"fade-in": "fade-in 200ms ease-in-out forwards",
				"fade-out": "fade-out 200ms ease-in-out forwards",
			},
		},
	},
	plugins: [],
};
