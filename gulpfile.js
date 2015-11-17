var gulp = require('gulp');
var sh = require('shelljs');
var bower = require('bower');
var args = require('yargs').argv;
var gulpif = require('gulp-if');
var bower = require('./bower.json');
var $ = require('gulp-load-plugins')({
  lazy: true
});

var paths = {
  lib: './www/lib',
  sass: ['./scss/**/*.scss'],
  src_js: ['./www/js/{,*/}*.module.js', './www/js/{,*/}*.js'],
  annotated_js: ['./www/annotated_js/{,*/}*.module.js', './www/annotated_js/{,*/}*.js'],
  templates: ['./www/templates/{,*/}*.html'],
  index: './www/index.html',
  useref: ['./www/*.html'],
  dist: ['./www/dist/**']
};

gulp.task('default', ['sass', 'wiredep']);

gulp.task('sass', function(done) {
  gulp.src('./scss/style.scss')
    .pipe($.sass())
    .on('error', $.sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe($.minifyCss({
      keepSpecialComments: 0
    }))
    .pipe($.rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.templates, ['templateCache']);
  gulp.watch(paths.src_js, ['wiredep']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('templateCache', function() {
  return gulp.src(paths.templates)
    .pipe($.angularTemplatecache({
      standalone: true
    }))
    .pipe(gulp.dest('./www/annotated_js'));
});

gulp.task('clean-dist', function() {
  return gulp
    .src(config.dist, {
      read: false
    })
    .pipe($.rimraf());
});

// 增加依赖注入
gulp.task('ngAnnotate', ['templateCache'], function() {
  return gulp.src(paths.src_js)
    .pipe($.ngAnnotate({
      single_quotes: true
    }))
    .pipe(gulp.dest('./www/annotated_js'));
});

// 将所有JS及CSS引用添加到index.html
gulp.task('wiredep', ['ngAnnotate'], function() {
  var options = {
    bowerJson: bower,
    directory: paths.lib,
    ignorePath: '../..',
    devDependencies: true
  };
  var wiredep = require('wiredep').stream;

  return gulp
    .src(paths.index)
    .pipe(wiredep(options))
    .pipe($.inject(gulp.src(paths.annotated_js, {
      read: false
    }), {
      relative: true
    }))
    .pipe(gulp.dest('./www'));
});


gulp.task('useref', ['wiredep'], function() {
  return gulp.src(paths.useref)
    .pipe($.useref())
    .pipe(gulpif('*.js', $.uglify()))
    .pipe(gulpif('*.css', $.minifyCss()))
    .pipe(gulp.dest('./www/dist'));
});
