/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        LamaSky: "#C3EBFA",
        LamaSkyLight: "#EDF9FD",
        LamaPurple: "#CFCEFF",
        LamaPurpleLight: "#F1F0FF",
        LamaYellow: "#FAE27C",
        LamaYellowLight: "#FEFCE8",
        LamaGreen: "#29bf12",
      },
    },
  },
  plugins: [],
};

export default config; // ✅ Use `export default` instead of `module.exports`
