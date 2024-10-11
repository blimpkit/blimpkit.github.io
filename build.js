const fs = require('fs');
const { sync: globSync } = require('glob');
const { minify } = require("terser");
const options = {
    compress: {},
    keep_classnames: true,
    keep_fnames: true,
    mangle: false
};

fs.mkdirSync('./dist/js', { recursive: true }, (error) => {
    if (error) throw error;
});

const jsFiles = globSync(`${process.env.TERSER_DIST_PATH || './src'}/*.js`);
jsFiles.map(file => {
    minify(fs.readFileSync(file, 'utf8'), options).then((result) => {
        fs.writeFileSync(file.replace('src/', 'dist/js/'), result.code, 'utf8');
    }, (error) => {
        console.error(`Error minifying ${file}`, error);
    });
});

fs.cp('./css', './dist/css', { recursive: true }, (error) => {
    if (error) throw error;
});

fs.cp('./logo', './dist/logo', { recursive: true }, (error) => {
    if (error) throw error;
});