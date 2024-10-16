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

fs.rmSync('./dist/', { recursive: true, force: true });

fs.mkdirSync('./dist/js', { recursive: true }, (error) => {
    if (error) throw error;
});

fs.mkdirSync('./dist/css', { recursive: true }, (error) => {
    if (error) throw error;
});

fs.mkdirSync('./dist/css/themes', { recursive: true }, (error) => {
    if (error) throw error;
});

const licenseHeader = fs.readFileSync('license-header.txt', 'utf8');

let bundle = '';

const jsFiles = globSync('./src/*.js').reverse();
jsFiles.map(file => {
    const content = fs.readFileSync(file, 'utf8');

    if (file === 'src/blimpkit.js') {
        bundle = content + bundle;
    } else bundle += content;

    minify(content, options).then((result) => {
        fs.writeFileSync(file.replace('src/', 'dist/js/').replace('.js', '.min.js'), licenseHeader + result.code, 'utf8');
    }, (error) => {
        console.error(`Error minifying ${file}`, error);
    });
});

minify(bundle, options).then((result) => {
    fs.writeFileSync('dist/js/blimpkit.bundle.min.js', licenseHeader + result.code, 'utf8');
}, (error) => {
    console.error(`Error minifying bundle`, error);
});

const cssFiles = [...globSync('./css/*.css'), ...globSync('./css/themes/*.css')];
cssFiles.map(file => {
    const result = cssMinify.minify(fs.readFileSync(file, 'utf8'));
    fs.writeFileSync(file.replace('css/', 'dist/css/').replace('.css', '.min.css'), licenseHeader + result.styles, 'utf8');
});

fs.cp('./logo', './dist/logo', { recursive: true }, (error) => {
    if (error) throw error;
});