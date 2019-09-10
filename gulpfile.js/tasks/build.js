var gulp            = require('gulp');
gulp.task('build', ['copyScripts', 'copyImg', 'copyFonts', 'ejs', 'iconfont', 'scripts', 'styles']);