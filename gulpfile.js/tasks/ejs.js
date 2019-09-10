var config = require('../config');
var path = require('path');
var browserSync  = require('browser-sync');
var gulp = require('gulp');
var ejs = require('gulp-ejs');
var plumber = require('gulp-plumber');
var notify = require("gulp-notify");
var rename = require("gulp-rename");
var task = config.tasks.ejs;

var onError = function (err) {
  console.log(err);
};

gulp.task('ejs', function(){
    return gulp.src(path.join(config.root.src, task.src, '*.ejs'))
    .pipe(plumber({
      errorHandler: onError
    }))

    .pipe(ejs("",task.options).on('error', notify.onError(function (error) {
            return 'An error occurred while compiling ejs.\nLook in the console for details.\n' + error;
    })))
    .pipe(rename(function (path) {
        path.extname = ".html"
    }))
    .pipe(gulp.dest(path.join(config.root.dest, task.dest)))
    .pipe(browserSync.stream({match: '**/*.html'}));
});
