var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var compass = require('gulp-compass');
var autoprefixer = require('gulp-autoprefixer');
var coffee = require('gulp-coffee');
var coffeelint = require('gulp-coffeelint');
var jshint = require('gulp-jshint');
var browserify = require('browserify');
var browserSync = require('browser-sync').create();
var source = require('vinyl-source-stream');


// SASS (scss)
gulp.task('sass', function() {
  return sass('./scss/all.scss')
    .pipe(gulp.dest('./css'))
});

// compass
// remember to edit accordingly to your compass setup
gulp.task('comp', function() {
  return gulp.src('./scss/*.scss')
    .pipe(compass({
      config_file: 'config.rb',
      css: 'stylesheets',
      sass: 'scss',
    }))
    .pipe(gulp.dest('./stylesheets'));
});

// autoprefixer
gulp.task('auto', function() {
  return gulp.src('./css/*.css')
    .pipe(autoprefixer({
      browsers: ['last 3 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./css'));
})

// CoffeeScript
gulp.task('coffee', function() {
  return gulp.src('./coffee/*.coffee')
    .pipe(coffeelint())
    .pipe(coffee({ bare:true }))
    .pipe(gulp.dest('./js'));
});

// lint
gulp.task('lint', function() {
  return gulp.src('./js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// browserify
gulp.task('brow', function() {
  return browserify('./js/script.js')
    .bundle()
    // pass ot vinyl source stream
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./js/build/'));
});

// serve & watch (browserSync server)
gulp.task('serve', ['sass', 'auto', 'coffee'], function() {

  browserSync.init({
    server: '.'
  });

  gulp.watch('./scss/*.scss', ['sass']).on('change', browserSync.reload);
  gulp.watch('./css/*.css', ['auto']).on('change', browserSync.reload);
  gulp.watch('./coffee/*.coffee', ['coffee']).on('change', browserSync.reload);
  gulp.watch('./js/*.js', ['brow']).on('change', browserSync.reload);
  gulp.watch('./*.html').on('change', browserSync.reload);
});

// watch
gulp.task('watch', function() {
  gulp.watch('./scss/*.scss', ['sass']);
  gulp.watch('./css/*.css', ['auto']);
  gulp.watch('./coffee/*.coffee', ['coffee']);
  gulp.watch('./js/*.js', ['brow']);
  gulp.watch('./*.html');

});

// default
gulp.task('default', ['sass', 'coffee']);
