var filterCoffeeScript = require('broccoli-coffee')
var compileSass = require('broccoli-sass')
var compass = require('broccoli-compass')
var compileJade = require('broccoli-jade')
var pickFiles = require('broccoli-static-compiler')
var mergeTrees = require('broccoli-merge-trees')
var findBowerTrees = require('broccoli-bower')
var removeTrees = require('broccoli-file-remover')
var concatenate = require('broccoli-concat')
var uglify = require('broccoli-uglify-js');

removeTrees('dist', {
  files: '**.*'
})

var coffee = pickFiles('', {
  srcDir: 'app/scripts',
  files: ['**/*.coffee'],
  destDir: 'scripts'
})

var scripts = filterCoffeeScript(coffee, {
  bare: true
})

var styles = pickFiles('', {
  srcDir: 'app/styles',
  files: ['**/*.scss'],
  destDir: 'styles'
})

styles = compass(styles, {
  outputStyle: 'expanded'
})

styles = concatenate(styles, {
  inputFiles: ['**/*.css'],
  outputFile: '/styles/app.css'
})

styles_vendor = pickFiles('', {
  srcDir: 'app/styles',
  files: ['**/*.css'],
  destDir: 'styles'
})

styles = mergeTrees([
  styles_vendor,
  styles
])

var views = pickFiles('', {
  srcDir: 'app',
  files: ['**/*.jade'],
  destDir: ''
})

var fonts = pickFiles('', {
  srcDir: 'app/fonts',
  destDir: 'fonts'
})

var appCss = styles

var bower = mergeTrees(findBowerTrees())

bower = concatenate(bower, {
  inputFiles: ['**/*.js'],
  outputFile: '/scripts/vendor.js'
})

bower = uglify(bower, {
  mangle: false
})

scripts = concatenate(scripts, {
  inputFiles: ['**/*.js'],
  outputFile: '/scripts/app.js'
})

var appJs = mergeTrees([scripts, bower])

var appHtml = compileJade(views)


module.exports = mergeTrees([appJs, appHtml, appCss, fonts])
