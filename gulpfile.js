var
bower         = require('main-bower-files'),
concat        = require('gulp-concat'),
filter        = require('gulp-filter'),
gulp          = require('gulp'),
merge         = require('merge-stream'),
minify        = require('gulp-minify-css'),
rename        = require('gulp-rename'),
uglify        = require('gulp-uglify')
;

var paths = {
  'assets': {
    'css':      'assets/css/*.css',
    'js':       'assets/js/*.js',
    'fonts':    'assets/fonts/*',
    'img':      'assets/img/*',
    'favicon':  'assets/icon.ico',
    'html':     'views/*.html'
  },
  'public': {
    'css':      'public/css',
    'js':       'public/js',
    'fonts':    'public/fonts',
    'img':      'public/img',
    'favicon':  'public/',
    'html':     'public/'
  }
};

gulp.task('bower', function() {
  var jsFilter = filter('**/*.js');
  var styleFilter = filter(['**/*.css']);
  var fontFilter = filter(['**/*.woff', '**/*.ttf']);

  var files = bower();

  console.log('Files to process:');
  files.forEach(function(filepath) {
    console.log('\t' + filepath.replace(/^.*[\\\/]/, ''));
  });

  return gulp.src(files)
    .pipe(jsFilter)
    .pipe(concat('vendor.js'))
    .pipe(uglify({mangle: false}))
    .pipe(gulp.dest(paths.public.js))
    .pipe(jsFilter.restore())

    .pipe(styleFilter)
    .pipe(concat('vendor.css'))
    .pipe(minify())
    .pipe(gulp.dest(paths.public.css))
    .pipe(styleFilter.restore())

    .pipe(fontFilter)
    .pipe(gulp.dest(paths.public.fonts))
    .pipe(fontFilter.restore());
});

gulp.task('assets', function() {
  var fonts = gulp.src(paths.assets.fonts)
    .pipe(gulp.dest(paths.public.fonts));

  var img = gulp.src(paths.assets.img)
    .pipe(gulp.dest(paths.public.img));

  var favicon = gulp.src(paths.assets.favicon)
    .pipe(rename('favicon.ico'))
    .pipe(gulp.dest(paths.public.favicon));

  var html = gulp.src(paths.assets.html)
    .pipe(gulp.dest(paths.public.html));

  return merge(fonts, img, favicon, html);
});

gulp.task('css', function() {
  return gulp.src(paths.assets.css)
    .pipe(concat('app.css'))
    .pipe(minify())
    .pipe(gulp.dest(paths.public.css));
});

gulp.task('js', function() {
  return gulp.src(paths.assets.js)
    .pipe(concat('app.js'))
    .pipe(uglify({mangle: false}))
    .pipe(gulp.dest(paths.public.js));
});

gulp.task('minimize', ['bower', 'css', 'js'], function() {
  var css = gulp.src(paths.public.css + '/*')
    .pipe(minify())
    .pipe(gulp.dest(paths.public.css));

  var js = gulp.src(paths.public.js + '/*')
    .pipe(uglify())
    .pipe(gulp.dest(paths.public.js));

  return merge(css, js);
});

gulp.task('default', ['bower', 'assets', 'css', 'js']);
