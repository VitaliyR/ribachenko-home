module.exports = {
  files: {
    javascripts: { joinTo: 'app.js' },
    stylesheets: {
      joinTo: {
        'app.css': /app\/css/
      }
    },
    templates: { joinTo: 'app.js' }
  },
  plugins: {
    postcss: {
      processors: [
        require('postcss-partial-import')(),
        require('postcss-nested')(),
        require('postcss-inline-svg')(),
        require('postcss-svgo')(),
        require('stylelint')()
      ]
    }
  },
  overrides: {
    production: {
      plugins: {
        off: ['eslint-brunch'],
        postcss: {
          processors: [
            require('postcss-partial-import')(),
            require('postcss-nested')(),
            require('postcss-inline-svg')(),
            require('postcss-svgo')()
          ]
        }
      }
    }
  }
};
