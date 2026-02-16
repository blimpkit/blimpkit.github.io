const fs = require('fs');
const { sync: globSync } = require('glob');
const { minify } = require('terser');
const CleanCSS = require('clean-css');
const cssMinify = new CleanCSS({
  inline: false,
});
const options = {
  compress: {},
  keep_classnames: true,
  keep_fnames: true,
  mangle: false,
  sourceMap: true,
};

fs.rmSync('./dist/', { recursive: true, force: true });

fs.mkdirSync('./dist/css', { recursive: true }, (error) => {
  if (error) throw error;
});

fs.mkdirSync('./dist/css/themes', { recursive: true }, (error) => {
  if (error) throw error;
});

const licenseHeader = fs.readFileSync('license-header.txt', 'utf8');

let bundle = '';

const jsFiles = globSync('./src/*.js').reverse();
jsFiles.map((file) => {
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(licenseHeader, '');

  if (file === 'src/blimpkit.js') {
    bundle = content + bundle;
  } else bundle += content;
});

// Set the license header and make sure it will not get deleted during minification
bundle = licenseHeader.replace('/*', '/*!') + bundle;

fs.writeFileSync('dist/blimpkit.js', bundle, 'utf8');

minify(bundle, options).then(
  (result) => {
    fs.writeFileSync('dist/blimpkit.min.js', result.code, 'utf8');
    fs.writeFileSync('dist/blimpkit.min.js.map', result.map, 'utf8');
  },
  (error) => {
    console.error(`Error minifying bundle`, error);
  }
);

const cssFiles = [...globSync('./css/*.css'), ...globSync('./css/themes/*.css')];
cssFiles.map((file) => {
  const result = cssMinify.minify(fs.readFileSync(file, 'utf8'));
  fs.writeFileSync(file.replace('css/', 'dist/css/'), licenseHeader + result.styles, 'utf8');
});

fs.cp('./docs/logo', './dist/logo', { recursive: true }, (error) => {
  if (error) throw error;
});
