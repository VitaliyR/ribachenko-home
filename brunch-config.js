module.exports = {
  files: {
    javascripts: {joinTo: 'app.js'},
    stylesheets: {joinTo: 'app.css'},
    templates: {joinTo: 'app.js'}
  },
  plugins: {
    postcss: {
      processors: [
        require('postcss-partial-import')(),
        require('postcss-nested')(),
        require('stylelint')()
      ]
    }
  },
  overrides: {
    production: {
    }
  }
};
