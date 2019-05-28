const gulp = require('gulp');
const yargs = require('yargs');
const imagemin = require('gulp-imagemin');
const plumber = require('gulp-plumber');
const runSequence = require('gulp-run-sequence');

const path = require('path');
const process = require('process');

const imageminConfig = [
  imagemin.jpegtran({ progressive: true }),
  imagemin.gifsicle(),
  imagemin.optipng(),
  imagemin.svgo({ plugins: [{ removeTitle: true }] }),
];

const temp = path.resolve(process.cwd(), 'temp');
const tempDest = path.resolve(process.cwd(), 'temp-dest');

// 获取参数
const imageSrc = yargs
  .options('images-src', {
    describe: 'glob pattern to match images to be minified',
    demand: true,
  })
  .check((argv) => {
    if (argv.imagesSrc) {
      return true;
    }
    throw new Error('images-src must be a valid glob pattern');
  })
  .argv.imagesSrc;

// 复制对应文件夹的图片到当前文件夹的 tmp/ 下。
const copyImages = () => {
  return gulp
    .src([
      `${imageSrc}/**/*.{png,jpg,gif,svg}`,
      `!${imageSrc}/**/{android,android/**}`, // 排除 android/
      `!${imageSrc}/**/{ios,ios/**}`, // 排除 ios/
      `!${imageSrc}/**/{node_modules,node_modules/**}`, // 排除 node_modules/
    ])
    .pipe(gulp.dest(temp));
}

const minifyTempFolder = () => {
  return gulp
    .src(path.join(temp, '**/*.{png,jpg,gif,svg}'))
    .pipe(plumber()) // 错误处理
    .pipe(imagemin(imageminConfig, { verbose: true }))
    .pipe(gulp.dest(tempDest));
}

const minifyImages = () => {
  // 获取命令行输入
  const imageSrc = yargs
    .options('images-src', {
      describe: 'glob pattern to match images to be minified',
      demand: true,
    })
    .check((argv) => {
      if (argv.imagesSrc) {
        return true;
      }
      throw new Error('images-src must be a valid glob pattern');
    })
    .argv.imagesSrc;

  return gulp
    .src([
      `${imageSrc}/**/*.{png,jpg,gif,svg}`,
      `!${imageSrc}/**/{android,android/**}`, // 排除 android/
      `!${imageSrc}/**/{ios,ios/**}`, // 排除 ios/
      `!${imageSrc}/**/{node_modules,node_modules/**}`, // 排除 node_modules/
    ], { base: '.' })
    .pipe(plumber()) // 错误处理
    .pipe(imagemin(imageminConfig, { verbose: true }))
    .pipe(gulp.dest(dest));
};

gulp.task('copy-images', copyImages);
gulp.task('minify-temp', minifyTempFolder);
// 压缩命令
gulp.task('minify-images', minifyImages);

/**
 * 压缩性能测试
 * 1. 会将目录下的所有文件夹迁移过来；
 * 2. 对当前目录的图片进行压缩。
 */
gulp.task('test', function(cb) {
  runSequence('copy-images', 'minify-temp', cb);
});

