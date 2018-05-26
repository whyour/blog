var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var htmlmin = require('gulp-htmlmin');
var htmlclean = require('gulp-htmlclean');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var babel = require("gulp-babel");

// 获取 gulp-imagemin 模块
var imagemin = require('gulp-imagemin')

// 压缩 public 目录 css
gulp.task('minify-css', function() {
    return gulp.src('./public/**/*.css')
        .pipe(minifycss())
        .pipe(gulp.dest('./public'));
});

gulp.task('minify-html', function () {
    return gulp.src('./public/**/*.html')
        .pipe(htmlclean())
        .pipe(htmlmin({
            removeComments: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
        }))
        .pipe(gulp.dest('./public'))
});

// 压缩图片任务
// 在命令行输入 gulp images 启动此任务
gulp.task('images', function () {
    // 1. 找到图片
    gulp.src(['./source/**/*.jpg','./source/**/*.png','./source/**/*.gif'])
    // 2. 压缩图片
        .pipe(imagemin({
            progressive: true
        }))
    // 3. 另存图片
        .pipe(gulp.dest('./public'))
});

gulp.task('copy1', function () {
    gulp.src('./photos/*')
        .pipe(gulp.dest('./public/sheying/photos'))
})
gulp.task('copy2', function () {
    gulp.src('./min_photos/*')
        .pipe(gulp.dest('./public/sheying/min_photos'))
})

//压缩js
gulp.task('minify-js', function() {
    // 1. 找到文件
    gulp.src('./public/sw.js')
        .pipe(babel({
            presets: ['es2015']
          }))
    // 2. 压缩文件
        .pipe(uglify())
        .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    // 3. 另存压缩后的文件
        .pipe(gulp.dest('./public'))
})


// 执行 gulp 命令时执行的任务
gulp.task('default', [
    'minify-css','minify-js','minify-html','copy1','copy2'
]);