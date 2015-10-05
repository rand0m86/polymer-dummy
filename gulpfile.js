'use strict';
var path        = require('path');
var gulp        = require('gulp');
var debug       = require('gulp-debug');
var filters     = require('gulp-filter');
var insert      = require('gulp-insert');
var sass        = require('gulp-sass');
var merge       = require('merge-stream');
var vulcanize   = require('gulp-vulcanize');
var $           = require('gulp-load-plugins')();
var runSequence = require('run-sequence');

var filter = filters(['**', '!skins/color-vars-template.scss', '!skins/skin-template.scss']);

gulp.task('sass', function () {
    gulp.src(['sass/**/*.scss'], {base: "sass/"})
        .pipe(debug({title: 'matches:'}))
        .pipe(filter)
        .pipe(debug({title: 'after filter:'}))
        .pipe(sass().on('error', sass.logError))
        .pipe(debug({title: 'after sass:'}))
        .pipe(gulp.dest('css/'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./**/*.scss', ['sass'])
        .pipe(filter);
});

gulp.task('insert', function(){
    gulp.src(['css/skins/default/color-vars-body.css',
              'css/skins/default/color-vars.css'])
        .pipe(insert.append('</style>'))
        .pipe(insert.prepend("<style is=\"custom-style\">"));
});

gulp.task('copy', function () {
    //var bower = gulp.src([
    //    'bower_components/**/*'
    //]).pipe(gulp.dest('bower_components'));

    var vulcanized = gulp.src(['components/pd-dashboard/pd-dashboard.html'])
        .pipe($.rename('pd-dashboard.vulcanized.html'))
        .pipe(gulp.dest('components/pd-dashboard'));

    //return merge(bower);
    return merge(vulcanized);
});

gulp.task('vulcanize', function () {
    return gulp.src('../components/pd-dashboard/pd-dashboard.vulcanized.html')
        .pipe(vulcanize({
            abspath: '',
            excludes: ['../bower_components/polymer/polymer.html',
                '../bower_components/polymer/polymer.html'
            ],
            stripExcludes: false
        }))
        .pipe(gulp.dest('../components/pd-dashboard'));
});

gulp.task('precache', function (callback) {

});

gulp.task('default',  function (cb) {
    runSequence(
        ['sass','insert', 'copy'],
        'vulcanize', 'precache',
        cb)
    });

require('web-component-tester').gulp.init(gulp);