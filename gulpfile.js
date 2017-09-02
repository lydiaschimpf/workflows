var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    concat = require ('gulp-concat'), 
    compass = require ('gulp-compass'),
    path = require ('path'),
    broserify = require('gulp-browserify');
    
   

var coffeeScripts = ['components/coffee/tagline.coffee'];
var jsSources = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js',
];




gulp.task('coffee', function(){
  gulp.src(coffeeScripts)
	.pipe(coffee({bare: true})
	.on('error', gutil.log))
	.pipe(gulp.dest('components/scripts'))
	});

gulp.task('js',['coffee'], function(){
    gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(broserify())
    .pipe(gulp.dest('builds/development/js'))    
});

gulp.task('compass', function() {
  gulp.src('components/sass/style.scss')
    .pipe(compass({     
      sass: 'components/sass',
      image: 'builds/development/images',
      style: 'expanded'
    }))
    .on('error', gutil.log)
    .pipe(gulp.dest('builds/development/css'))
    
});
gulp.task('default',['coffee','js','compass']);