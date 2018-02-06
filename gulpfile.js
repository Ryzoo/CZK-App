let concat = require('gulp-concat');
var uglify = require('gulp-uglifyes');
let ignore = require('gulp-ignore');
let gulp = require('gulp');
let cleanCSS = require('gulp-clean-css');
let babel = require('gulp-babel');

gulp.task('buildCss', function() {
    return gulp.src([
        'core/css/*.css',
        'core/js/libraries/**/*.css',
        'core/js/libraries/**/css/*.css',
        'core/modules/**/assets/css/*.css',
        'modules/**/assets/css/*.css',
        '!core/css/login.css',
        'core/modules/**/assets/js/*.css',
        'modules/**/assets/js/*.css'
    ])
        .pipe(concat('styles.min.css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe( gulp.dest('public'));
});

gulp.task('buildJs', function() {
    return gulp.src([
        'core/js/libraries/*.js',
        'core/js/libraries/**/*.js',
        'core/modules/**/assets/js/*.js',
        'core/js/libraries/**/js/*.js',
        'modules/**/assets/js/*.js',
    ])
        .pipe(concat('additionalScripts.min.js'))
        .pipe( gulp.dest('public'));
});

gulp.task('buildAngularJs', function() {
    return gulp.src([
        'core/js/services.js',
        'core/modules/**/assets/services/*.js',
        'modules/**/assets/services/*.js',
        'core/modules/**/assets/controllers/*.js',
        'modules/**/assets/controllers/*.js',
        'core/js/controllers/*.js',
        'core/js/route.js',
    ])
        .pipe(concat('angularScripts.min.js'))
        .pipe( gulp.dest('public'));
});

gulp.task('buildJsProd', function() {
    return gulp.src([
        'core/js/libraries/*.js',
        'core/js/libraries/**/*.js',
        'core/modules/**/assets/js/*.js',
        'core/js/libraries/**/js/*.js',
        'modules/**/assets/js/*.js',
    ])
        .pipe(concat('additionalScripts.min.js'))
        .pipe(uglify({mangle: false,ecma: 6}))
        .pipe( gulp.dest('public'));
});

gulp.task('buildAngularJsProd', function() {
    return gulp.src([
        'core/js/services.js',
        'core/modules/**/assets/services/*.js',
        'modules/**/assets/services/*.js',
        'core/modules/**/assets/controllers/*.js',
        'modules/**/assets/controllers/*.js',
        'core/js/controllers/*.js',
        'core/js/route.js',
    ])
        .pipe(concat('angularScripts.min.js'))
        .pipe(uglify({mangle: false,ecma: 6}))
        .pipe( gulp.dest('public'));
});

gulp.task('buildProd', function(){
    gulp.start('buildAngularJsProd');
    gulp.start('buildJsProd');
    gulp.start('buildCss');
});

gulp.task('buildDev', function(){
    gulp.start('buildAngularJs');
    gulp.start('buildJs');
    gulp.start('buildCss');
});