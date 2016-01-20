var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var del = require('del');

var files = './src/**/*.js';
var services = './src/services/';
var interceptors = './src/interceptors/';
var wopo_provider = './src/providers/wopo-provider.js';
var cryptojs_sha1 = './lib/cryptojs-sha1/cryptojs-sha1.js';
var wopo = './src/wopo.js';

gulp.task('lint', function() {
    return gulp.src(files)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('build', function() {
    gulp.start('lint');

    del(['./dist/']).then(function (paths) {
        gulp.src([
            cryptojs_sha1,
            services + 'wopo-services.js',
            wopo,
            wopo_provider,
            services + 'crypt-sha1-service.js', 
            services + 'ionic-popup-service.js',
            services + 'web-storage-service.js',
            services + 'login-service.js',
            services + '*.js',
            // interceptors + 'wopo-interceptors.js',
            // interceptors + '*.js'
        ])     
        .pipe(concat('wopo.js'))
        .pipe(gulp.dest('./dist/'));

        gulp.src([
            cryptojs_sha1,      
            services + 'wopo-services.js',
            wopo,
            wopo_provider,
            services + 'crypt-sha1-service.js', 
            services + 'ionic-popup-service.js',
            services + 'web-storage-service.js',
            services + 'login-service.js',
            services + '*.js',
            // interceptors + 'wopo-interceptors.js',
            // interceptors + '*.js'
        ])     
        .pipe(concat('wopo.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'));
    });
});

gulp.task('default', function() {    
    gulp.start('build');
});