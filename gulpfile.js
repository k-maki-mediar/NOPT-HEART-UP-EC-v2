const gulp = require('gulp');
const fileinclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const postcss = require('gulp-postcss');
const pxtorem = require('postcss-pxtorem');
const rename = require('gulp-rename');

// postcss-pxtorem 設定
const pxtoremOptions = {
  rootValue: 16,
  unitPrecision: 5,
  propList: ['font-size', 'font', 'line-height', 'letter-spacing'],
  selectorBlackList: [],
  replace: true,
  mediaQuery: false,
  minPixelValue: 0
};

// パス設定（workbench → mock）
const paths = {
  src: {
    html: 'workbench/pages/**/*.html',
    scss: 'workbench/styles/**/*.scss',
    scssEntry: 'workbench/styles/main.scss',
    js: 'workbench/scripts/**/*.js',
    assets: 'workbench/assets/**/*',
    includes: 'workbench/includes/**/*.html',
    partsGeneral: 'workbench/includes/parts/general/**/*.html',
    partsMain: 'workbench/includes/parts/main/**/*.html'
  },
  dist: {
    root: 'mock/',
    html: 'mock/cms/pc/',
    css: 'mock/files/commonfiles/styles/',
    cssComponent: 'mock/files/partsfiles/styles/',
    js: 'mock/files/commonfiles/scripts/',
    jsparts: 'mock/files/partsfiles/scripts/',
    assets: 'mock/files/commonfiles/',
    partsGeneral: 'mock/cms/pc/parts/general/',
    partsMain: 'mock/cms/pc/parts/main/'
  },
  watch: {
    html: ['workbench/pages/**/*.html', 'workbench/includes/**/*.html']
  }
};

// クリーンタスク（生成されるファイルのみを削除）
gulp.task('clean:generated', () => {
  return gulp.src([
    paths.dist.css + 'common.css',
    paths.dist.cssComponent + '*.css',
    paths.dist.js + '**/*.js'
  ], { read: false, allowEmpty: true })
    .pipe(clean());
});

// HTML展開タスク（workbench/pages → mock/cms/pc/）
gulp.task('html', () => {
  return gulp.src(paths.src.html)
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('mock/cms/pc/'))
    .pipe(browserSync.stream());
});

// パーツHTMLを単体ファイルとしてcms/pc/parts/にコピー
gulp.task('parts', () => {
  return gulp.src([
    paths.src.partsGeneral,
    paths.src.partsMain
  ], { base: 'workbench/includes/parts', allowEmpty: true })
    .pipe(gulp.dest('mock/cms/pc/parts/'));
});

// SCSSコンパイルタスク - メイン（共通スタイル → common.css）
gulp.task('scss-main', () => {
  return gulp.src(paths.src.scssEntry)
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(postcss([pxtorem(pxtoremOptions)]))
    .pipe(rename('common.css'))
    .pipe(gulp.dest(paths.dist.css))
    .pipe(browserSync.stream());
});

// SCSSコンパイルタスク - 個別コンポーネント（_なしのSCSSファイル）
gulp.task('scss-components', () => {
  return gulp.src([
    'workbench/styles/layout/[!_]*.scss',
    'workbench/styles/components/[!_]*.scss',
    'workbench/styles/pages/[!_]*.scss'
  ], { allowEmpty: true })
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(postcss([pxtorem(pxtoremOptions)]))
    .pipe(gulp.dest(paths.dist.cssComponent))
    .pipe(browserSync.stream());
});

// SCSSタスク統合
gulp.task('scss', gulp.parallel('scss-main', 'scss-components'));

// JavaScriptタスク
gulp.task('js', () => {
  return gulp.src([
    'workbench/scripts/main.js',
    'workbench/scripts/modules/**/*.js'
  ], { base: 'workbench/scripts', allowEmpty: true })
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(gulp.dest(paths.dist.js))
    .pipe(browserSync.stream());
});

// アセットコピータスク
gulp.task('assets', () => {
  return gulp.src(paths.src.assets, { allowEmpty: true })
    .pipe(gulp.dest(paths.dist.assets));
});

// reset.cssのみコピー（common.cssは新規生成するため除外）
gulp.task('vendor-css', () => {
  return gulp.src('workbench/vendor/reset.css', { allowEmpty: true })
    .pipe(gulp.dest(paths.dist.css))
    .pipe(browserSync.stream());
});

// BrowserSync起動
gulp.task('serve', (done) => {
  browserSync.init({
    server: {
      baseDir: 'mock/'
    },
    port: 3000,
    open: false,
    notify: false
  });
  done();
});

// 監視タスク
gulp.task('watch', gulp.series(
  gulp.parallel('html', 'parts', 'scss', 'js', 'assets', 'vendor-css'),
  'serve',
  () => {
    gulp.watch(paths.watch.html, gulp.series('html', 'parts'));
    gulp.watch(paths.src.scss, gulp.series('scss'));
    gulp.watch(paths.src.js, gulp.series('js'));
    gulp.watch(paths.src.assets, gulp.series('assets'));
  }
));

// ビルドタスク
gulp.task('build', gulp.series(
  'clean:generated',
  gulp.parallel('html', 'parts', 'scss', 'js', 'assets', 'vendor-css')
));

// デフォルトタスク
gulp.task('default', gulp.series('watch'));
