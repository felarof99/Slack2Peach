var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');

const FILES = [
    './app/js/app.jsx',
    './app/js/login.jsx',
    './app/js/privacy.jsx',
    './app/js/help.jsx',
];

gulp.task('minified',function(){

    var tasks = FILES.map(function(file){
        var temp = file.split('/')[3];
        var output_name = 'index-'+temp.split('.')[0]+'.js';

        var bundler = browserify({
            entries: [file],
            transform: [reactify],
            extensions: ['.jsx'],
            debug: true,
            cache: {},
            packageCache: {},
            fullPaths: true,

        });

        function build(file){
            if(file) gutil.log('Recomipiling ' + file);
            return bundler
                .bundle()
                .on('error', gutil.log.bind(gutil, 'Browserify Error'))
                .pipe(source(output_name))
                .pipe(streamify(uglify()))
                .pipe(gulp.dest('./www/js/'));
        };

        build();
    });

});

gulp.task('default',function(){


    var tasks = FILES.map(function(file){
        var temp = file.split('/')[3];
        var output_name = 'index-'+temp.split('.')[0]+'.js';

        var bundler = watchify(browserify({
            entries: [file],
            transform: [reactify],
            extensions: ['.jsx'],
            debug: true,
            cache: {},
            packageCache: {},
            fullPaths: true,

        }));

        function build(file){
            if(file) gutil.log('Recomipiling ' + file);
            return bundler
                .bundle()
                .on('error', gutil.log.bind(gutil, 'Browserify Error'))
                .pipe(source(output_name))
                .pipe(gulp.dest('./www/js/'));
        };

        build();
        bundler.on('update', build);
    });
});
