// /** @type {import('tailwindcss').Config} */
// export default {
//     content: "*",
//     theme: {
//         extend: {},
//     },
//     plugins: [],
// };

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{js,ts,jsx,tsx}", "./**/*.{js,ts,jsx,tsx}"],
    safelist: [
        { pattern: /.*/ },
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};
