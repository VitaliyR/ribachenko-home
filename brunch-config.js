const postcssPlugins = [
  require('postcss-processor-order'),
  require('stylelint')(),
  require('postcss-each')(),
  require('postcss-nested')(),
  require('postcss-inline-svg')(),
  require('postcss-svgo')(),
  require('postcss-reporter')({ clearMessages: true })
];
const postcssPluginsProd = postcssPlugins.filter(p => !~['stylelint'].indexOf(p.postcssPlugin)).concat([ require('csswring') ]);
postcssPlugins.splice(1, 0, require('postcss-partial-import')({ plugins: postcssPlugins }));
postcssPluginsProd.splice(1, 0, require('postcss-partial-import')({ plugins: postcssPluginsProd }));

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
  npm: {
    globals: {
      'Hammer': 'hammerjs'
    }
  },
  plugins: {
    postcss: {
      processors: postcssPlugins,
      progeny: {
        prefix: '_'
      }
    }
  },
  overrides: {
    production: {
      plugins: {
        off: ['eslint-brunch'],
        postcss: {
          processors: postcssPluginsProd
        }
      }
    }
  }
};
