"use strict";

const gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
      sass = require('gulp-sass'),
      maps = require('gulp-sourcemaps'),
      csso = require('gulp-csso'),
  imagemin = require('gulp-imagemin'),
       del = require('del'),
 webserver = require('gulp-webserver');

const options = {
  src : "src",
  dist: "dist"
}

/*-------------------
  Concat scripts task
-------------------*/
gulp.task("concatScripts", function() {
  return gulp.src(['js/**', 'js/**/*'])
  .pipe(maps.init())
  .pipe(concat('all.js'))
  .pipe(maps.write('./'))
  .pipe(gulp.dest(options.dist + '/scripts'));
});

/*-----------------
  Scripts task
-----------------*/
gulp.task("scripts", ["concatScripts"], function() {
  return gulp.src(options.dist + "/scripts/all.js")
  .pipe(uglify())
  .pipe(rename('all.min.js'))
  .pipe(gulp.dest(options.dist + '/scripts'));
});

/*-------------------
  Compile sass task
-------------------*/
gulp.task('compileSass', function() {
  return gulp.src("sass/global.scss")
  .pipe(maps.init())
  .pipe(sass())
  .pipe(rename('all.css'))
  .pipe(maps.write('./'))
  .pipe(gulp.dest(options.dist + '/styles'));
});

/*-------------------
  Styles task
-------------------*/
gulp.task("styles", ["compileSass"], function() {
  return gulp.src(options.dist + "/styles/all.css")
  .pipe(csso())
  .pipe(rename('all.min.css'))
  .pipe(gulp.dest(options.dist + '/styles'));
});

/*-------------------
  Images task
-------------------*/
gulp.task("images", function(){
  return gulp.src("images/*")
  .pipe(imagemin())
  .pipe(gulp.dest(options.dist + '/content'))
});

/*-----------------
  Clean task
-----------------*/
gulp.task('clean', function() {
  return del(['dist', 'css/application.css*', 'js/app*.js*']);
});

/*-----------------
  Build task
-----------------*/
gulp.task('buildTasks', ['scripts', 'styles', 'images']);

gulp.task("build", ['clean'], function() {
  gulp.start('buildTasks');
});

/*-----------------
  Server task
-----------------*/
gulp.task('webserver', function() {
  gulp.src('root')
    .pipe(webserver({
      livereload: true,
      port: 3000,
      directoryListing: true,
      open: true
    }));
});

/*-----------------
  Default task
-----------------*/
gulp.task('default', ['build'], function(){
  gulp.start('webserver');
});