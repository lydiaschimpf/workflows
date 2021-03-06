var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    concat = require ('gulp-concat'), 
    compass = require ('gulp-compass'),    
    path = require ('path'), 
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    jsonminify = require('gulp-jsonminify'),  
    browserify = require('gulp-browserify');
   
 var env,
    coffeeSources,
    jsSources,
    sassSources,
    htmlSources,
    jsonSources,
    outputDir,
    sassStyle;

env = process.env.NODE_ENV || 'development';

if (env==='development') {
  outputDir = 'builds/development/';
  sassStyle = 'expanded';
} else {
  outputDir = 'builds/production/';
    sassStyle = 'compressed';
  
  
}


coffeeSources = ['components/coffee/tagline.coffee'];
jsSources = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
];
sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];
jsonSources = [outputDir + 'js/*.json'];




gulp.task('coffee', function(){
  gulp.src(coffeeSources)
	.pipe(coffee({bare: true})
	.on('error', gutil.log))
	.pipe(gulp.dest('components/scripts'))
	});

gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulpif(env==='production', uglify()))
    .pipe(gulp.dest(outputDir + 'js'))
    .pipe(connect.reload())
});

gulp.task('compass', function() {
  gulp.src(sassSources)
    .pipe(compass({
      css: outputDir + 'css',
      sass: 'components/sass',
      image: outputDir + 'images',
      style: sassStyle
    })
    .on('error', gutil.log))
    .pipe(gulp.dest(outputDir + 'css'))
    .pipe(connect.reload())
});


gulp.task('watch', function(){
    gulp.watch('components/coffee/tagline.coffee', ['coffee']);
    gulp.watch('components/scripts/*.js', ['js']);
    gulp.watch('components/sass/*.scss', ['compass']);
    gulp.watch('builds/development/*.html', ['html']);
    gulp.watch('builds/development/js/*.json',['json']);
});

gulp.task('connect', function(){
    connect.server({
        root:outputDir,
        livereload: true
    });
});

gulp.task('html', function(){
    gulp.src('builds/development/*.html')
    .pipe(gulpif(env === 'production', htmlmin({collapseWhitespace: true})))
    .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
    
    .pipe(connect.reload())
});
gulp.task('json', function(){
    gulp.src('builds/development/js/*.json')
     .pipe(gulpif(env === 'production', jsonminify()))
    .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
    
    .pipe(connect.reload())
});





gulp.task('default',['html','json','coffee','js','compass','connect','watch']);











