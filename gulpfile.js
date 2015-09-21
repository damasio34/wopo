var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var del = require('del');

var files = "./src/**/*.js";
var services = './src/services/';
var lib = './lib/**/*.js';

gulp.task('lint', function() {
  return gulp.src(files)
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

gulp.task('build', function() {
  gulp.run('lint');

  del(['./dist/']).then(function (paths) {
    gulp.src([
      lib, 
      './src/wopo.js',
      services + 'crypt-sha1-service.js', 
      services + 'ionic-popup-service.js',
      services + 'web-storage-service.js',
      services + 'login-service.js',
      services + '*.js'
    ])     
      .pipe(concat('wopo.js'))
      .pipe(gulp.dest('./dist/'));
    
    gulp.src([
      lib, 
      './src/wopo.js',
      services + 'crypt-sha1-service.js', 
      services + 'ionic-popup-service.js',
      services + 'web-storage-service.js',
      services + 'login-service.js',
      services + '*.js'
    ])     
      .pipe(concat('wopo.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('./dist/'));
  });
});

gulp.task('default', function() {    
  gulp.run('build');
});