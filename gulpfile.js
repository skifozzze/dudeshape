const { src, dest, watch, parallel, series } = require('gulp');

const scss            = require('gulp-sass')(require('sass'));
const concat          = require('gulp-concat');
const autoprefixer    = require('gulp-autoprefixer');
const uglify          = require('gulp-uglify');
const cssnano         = require('gulp-cssnano');
const fonter          = require('gulp-fonter');
const imagemin        = require('gulp-imagemin');
const rename          = require('gulp-rename');
const del             = require('del');
const browserSync     = require('browser-sync').create();



function browsersync() {
  browserSync.init({
    server: {
      baseDir: 'app/'
    },
    notify: false
  })
}

function styles() {
  return src('app/scss/*.scss')
    .pipe(scss({ outputStyle: 'compressed' }))  
    .pipe(cssnano())   
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 versions'],
      grid: true
    }))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
}

function scripts() {
  return src([
    'node_modules/jquery/dist/jquery.js',
    'node_modules/slick-carousel/slick/slick.js',    
    'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js',
    'node_modules/ion-rangeslider/js/ion.rangeSlider.js',
    'node_modules/rateyo/src/jquery.rateyo.js',
    'node_modules/jquery-form-styler/dist/jquery.formstyler.js',
    'node_modules/mixitup/dist/mixitup.js',
    'app/js/main.js'
  ])
    
  .pipe(concat('main.min.js'))
  .pipe(uglify())
  .pipe(dest('app/js'))
  .pipe(browserSync.stream())
}

function images() {
  return src('app/images/**/*.*')
  .pipe(imagemin([
    imagemin.gifsicle({interlaced: true}),
	  imagemin.mozjpeg({quality: 75, progressive: true}),
  	imagemin.optipng({optimizationLevel: 5}),
  	imagemin.svgo({
	  	plugins: [
		  	{removeViewBox: true},
			  {cleanupIDs: false}
		  ]
  	})
  ]))
  .pipe(dest('dist/images'))
}

function fonts () {
  return src('app/fonts/*')
    .pipe(fonter({
      subset: [66,67,68, 69, 70, 71],
      formats: ['woff', 'ttf']
    }))
    .pipe(dest('dist/fonts'));
}

function build() {
  return src([
    'app/**/*.html',
    'app/fonts/*',
    'app/css/style.min.css',
    'app/js/main.min.js'
  ], {base: 'app'})
  .pipe(dest('dist'))
}

function cleanDist() {
  return del('dist')
}

function watching() {
  watch(['app/scss/**/*.scss'], styles);
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
  watch(['app/**/*.html']).on('change', browserSync.reload)
}
 

exports.styles         = styles;
exports.scripts        = scripts;
exports.browsersync    = browsersync;
exports.watching       = watching;
exports.images         = images;
exports.fonts          = fonts;
exports.cleanDist      = cleanDist;
exports.build          = series(cleanDist, images, build);

exports.default = parallel(styles, scripts, browsersync, watching);
