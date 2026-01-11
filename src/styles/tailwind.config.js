/** @type {import('tailwindcss').Config} */
module.exports = {
  // Update this to scan your new gallery file and everything in pages/
  content: [
    "./gallery.html", 
    "./pages/**/*.html",
    "./semanticElements/**/*.html" // Good to include this for nav/footer!
  ],
  theme: { extend: {} },
  plugins: [],
}