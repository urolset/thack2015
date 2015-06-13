/* Paths to static files */
var paths = (function () {
    return {
        paths: {
            js: {
                src: './static/js/src',
                src_files: './static/js/src/**/*.js',
                dist: './static/js/dist',
                libs: './static/js/libs',
                libs_files: [
                    './static/js/libs/**/*.js',
                    '!./static/js/libs/offline/*.js',
                    '!./static/js/libs/angular/*.js'
                ],
                ng_libs: './static/js/libs/angular/'
            },
            css: {
                src: './static/css/src',
                src_files: './static/css/src/**/*.scss',
                dist: './static/css/dist',
                libs: './static/css/libs',
                libs_files: [
                    './static/css/libs/*.min.css',
                    '!./static/css/libs/offline/*.css'
                ],
            },
            images: ['./static/images/*'],
            html_files: '/templates/**/*.html'
        },
        outFile: {
            js: 'wanderlust.js',
            css: 'wanderlust.css'
        }
    };
})();

module.exports = paths;
