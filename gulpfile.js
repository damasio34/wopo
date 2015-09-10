var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var files = "./src/*/*.js";

gulp.task('lint', function() {
  // Aqui carregamos os arquivos que a gente quer rodar as tarefas com o `gulp.src`
  // E logo depois usamos o `pipe` para rodar a tarefa `jshint`
  return gulp.src(files)
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});
 
gulp.task('concat', function() {
  return gulp.src(files)
    .pipe(concat('wopo.concat.js'))
    .pipe(gulp.dest('./temp/'));
});
 
gulp.task('uglify', function() {
  return gulp.src(files)
    .pipe(uglify())
    .pipe(gulp.dest('./temp'));
});

gulp.task('build', function() {
   return gulp.src(files)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(uglify())
    .pipe(concat('wopo.min.js'))
    .pipe(gulp.dest('./dist/'));
});