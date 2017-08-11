const fs = require('fs');
const postcss = require('postcss');
const cssnext = require("postcss-cssnext")
const precss = require('precss');
const autoprefixer = require('autoprefixer');

fs.readFile('src/chart/pie/index.css', (err, css) => {
    postcss([cssnext])
        .process(css, {
            from: 'src/chart/pie/index3.css',
            to: 'src/chart/pie/index3.css'
        })
        .then(result => {
            fs.writeFile('src/chart/pie/index3.css', result.css);
            if (result.map) fs.writeFile('src/chart/pie/index3.css.map', result.map);
        });
});