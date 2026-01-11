/** @type {import('tailwindcss').Config} */
module.exports = {
  // Update this to scan your new index file and everything in pages/
  content: [
    "./index.html", 
    "./pages/**/*.html",
    "./semanticElements/**/*.html" // Good to include this for nav/footer!
  ],
  theme: { extend: {} },
  plugins: [],
}