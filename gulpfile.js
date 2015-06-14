/*
 * Gulpfile for Wanderlust taskrunning
 * @author Phil Long
 */

//prod and dev dependencies
var gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  concat = require('gulp-concat'),
  livereload = require('gulp-livereload'),
  ngAnnotate = require('gulp-ng-annotate'),
  plumber = require('gulp-plumber'),
  rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify');

var config = require('./gulp.config'),
  paths = config.paths,
  outFile = config.outFile;

/*
 * runs through all js in the src directory
 * concatenates and ugilfies them into tesla.js
 */
gulp.task('js', function () {
  return gulp.src(paths.js.src_files)
    .pipe(plumber({ errorHandler: errHandler }))
    .pipe(sourcemaps.init())
    .pipe(ngAnnotate())
    .pipe(concat(outFile.js))
    //.pipe(uglify({mangle: false}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.js.dist))
    .pipe(livereload());
});

//concat lib js all into one file
gulp.task('js_libs', function () {
  return gulp.src(paths.js.libs_files)
    .pipe(sourcemaps.init())
    .pipe(concat('libs.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.js.dist));
});

gulp.task('sass', function () {
  return gulp.src(paths.css.src_files)
    .pipe(plumber({ errorHandler: errHandler }))
    .pipe(sourcemaps.init())
      .pipe(sass({errLogToConsole: true}))
      .pipe(rename(outFile.css))
    .pipe(sourcemaps.write())
    .pipe(sourcemaps.init({loadMaps: true, debug: true}))
      .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.css.dist))
    .pipe(livereload());
});

gulp.task('watch', ['default'], function () {
  livereload.listen();
  gulp.watch(paths.html_files, ['sass'], livereload);
  gulp.watch(paths.js.src_files, ['js']);
  gulp.watch(paths.css.src_files, ['sass']);
});

/*
gulp.task('build:css_libs', function () {
  return gulp.src(paths.css.libs_files)
    .pipe(concat('libs.css'))
    .pipe(gulp.dest(paths.css.dist));
})*/

/*gulp.task('build:ng', function () {
  var src = paths.js.ng_libs,
      ng_files = [src + '*.min.js'],
      exclude = ['core', 'resource', 'touch'];

  for (var i = 0, len = exclude.length; i < len; i++) {
    if (exclude[i] === 'core') {
      ng_files.push('!' + src + 'angular.min.js');
    } else {
      ng_files.push('!' + src + 'angular-' + exclude[i] + '.min.js');
    }
  }

  return gulp.src(ng_files)
    .pipe(concat('ng.js'))
    .pipe(uglify({
      mangle:false
    }))
    .pipe(gulp.dest(paths.js.dist));
})*/

gulp.task('default', ['js', 'sass', 'js_libs']);

function errHandler (err) {
  console.log(err);
  this.emit('end');
}
