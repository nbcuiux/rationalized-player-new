var config = require('../config');
var path = require('path');
var gulp = require('gulp');
var glob = require('glob');
var browserSync  = require('browser-sync');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('babelify');
var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var merge = require('utils-merge');
var duration = require('gulp-duration');
var task = config.tasks.scripts;


if (!task)
{
    console.error('Unable to find task "scripts" in config.js');
}



var bundlers = [];

var getBundler = function(inputFile, watch)
{
    var args = {
        debug: true, delay: 0
    };
    if (watch)
    {
        args = merge(watchify.args, args);
    }

    var browserifyBundle = browserify(inputFile, args);
    if (watch)
    {
        browserifyBundle = browserifyBundle.plugin(watchify, {delay: 0}) // Watchify to watch source file changes
    }
    browserifyBundle = browserifyBundle.transform(babel, {presets: ["es2015", "react", "stage-2"], compact: false});
    return browserifyBundle;
}



function rebundle(minified, bundlerObj) {

    let bundler = bundlerObj.bundler;
    let outputFile = bundlerObj.outputFile;

    bundler
        .bundle()
        .on('log', function(log) { console.log(log); })
        .on('error', function (err) { console.error(err); this.emit('end'); })
        .pipe(source(outputFile))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write('./'))
        .pipe(duration('Bundling javascript'))
        .pipe(gulp.dest(path.join(config.root.dest, task.dest)))
        .pipe(browserSync.stream({match: '**/*.js'}));
}


function compile(watch, inputFile, outputFile) {
    for (var i = 0; i < bundlers.length; i++) {
        let b = bundlers[i];
        if (!watch)
        {
            rebundle(watch, b);
            return;
        }
        
        if (b.firstTimeBundling) {
            b.firstTimeBundling = false;
            b.bundler.on('update', function() {
                console.log('-> Rebundling JS...');
                rebundle(watch, b);
            });
            rebundle(watch, b);
        }
    }
}

function setup(watch) {

    if (bundlers.length === 0) {

        bundlers = task.sources.map(function(source, index) {
            var inputFile = path.join(config.root.src, task.src, source.input);    
            var outputFile = source.output;
            return {
                bundler: getBundler(inputFile, watch),
                outputFile: source.output,
                firstTimeBundling: true
            }
        });  
    }
    compile(watch);
}

gulp.task('scripts-nowatch', function () {
    setup(false);
});

gulp.task('scripts', function () {
    setup(true);
});