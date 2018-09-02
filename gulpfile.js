var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var htmlclean = require('gulp-htmlclean');
var uglify = require('gulp-uglify');
var babel = require("gulp-babel");

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
    // 3. 另存压缩后的文件
        .pipe(gulp.dest('./public'))
})


// 执行 gulp 命令时执行的任务
gulp.task('default', [
    'minify-js','copy1','copy2'
]);

gulp.task('no-cp', [
    'minify-js','minify-html'
]);

gulp.task('no-cpb', [
    'minify-js','minify-html'
]);