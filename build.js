const fs = require('fs');
const { sync: globSync } = require('glob');
const { minify } = require('terser');
const CleanCSS = require('clean-css');
const cssMinify = new CleanCSS();
const options = {
    compress: {},
    keep_classnames: true,
    keep_fnames: true,
    mangle: false
};

fs.mkdirSync('./dist/js', { recursive: true }, (error) => {
    if (error) throw error;
});

fs.mkdirSync('./dist/css', { recursive: true }, (error) => {
    if (error) throw error;
});

const licenseHeader = fs.readFileSync('license-header.txt', 'utf8');

const jsFiles = globSync('./src/*.js');
jsFiles.map(file => {
    minify(fs.readFileSync(file, 'utf8'), options).then((result) => {
        fs.writeFileSync(file.replace('src/', 'dist/js/').replace('.js', '.min.js'), licenseHeader + result.code, 'utf8');
    }, (error) => {
        console.error(`Error minifying ${file}`, error);
    });
});

const cssFiles = globSync('./css/*.css');
cssFiles.map(file => {
    const result = cssMinify.minify(fs.readFileSync(file, 'utf8'));
    fs.writeFileSync(file.replace('css/', 'dist/css/').replace('.css', '.min.css'), licenseHeader + result.styles, 'utf8');
});

fs.cp('./logo', './dist/logo', { recursive: true }, (error) => {
    if (error) throw error;
});