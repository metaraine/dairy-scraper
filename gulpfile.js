(function() {
  var clean, coffee, gulp, gutil, jshint, rename;

  gulp = require('gulp');

  gutil = require('gulp-util');

  coffee = require('gulp-coffee');

  jshint = require('gulp-jshint');

  rename = require('gulp-rename');

  clean = require('gulp-clean');

  gulp.task('scripts', function() {
    return gulp.src('*.coffee').pipe(coffee().on('error', gutil.log)).pipe(gulp.dest('./'));
  });

  gulp.task('default', function(callback) {
    return gulp.watch('*.coffee', ['scripts']);
  });

}).call(this);
