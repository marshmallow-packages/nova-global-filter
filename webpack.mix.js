let path = require('path');
let mix = require('laravel-mix');
let NovaExtension = require('laravel-nova-devtool');

mix
  .setPublicPath('dist')
  .js('resources/js/card.js', 'js')
  .extend('nova', new NovaExtension())
  .vue({ version: 3 })
  .webpackConfig({
    externals: {
      vue: 'Vue',
    },
    output: {
      uniqueName: 'marshmallow/nova-global-filter',
    },
  })
  .alias({
    '@': path.join(__dirname, 'resources/js/'),
    'laravel-nova-mixins': path.join(__dirname, 'vendor/laravel/nova/resources/js/mixins/index.js'),
    'laravel-nova-components': path.join(__dirname, 'vendor/laravel/nova/resources/js/components.js'),
  })
  .nova('marshmallow/nova-global-filter')
  .version();
