var gulp            = require('gulp');


gulp.task('dist', ['iconfont', 'scripts-nowatch', 'build-styles']);

gulp.task('build-styles', ['iconfont'], function() {
    return gulp.start('styles');
});