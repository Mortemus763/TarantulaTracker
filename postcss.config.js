module.exports = {
  plugins: [
    require('@tailwindcss/postcss')(), // Use the new plugin
    require('autoprefixer'),
  ],
};