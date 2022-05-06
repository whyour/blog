var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var htmlclean = require('gulp-htmlclean');
var uglify = require('gulp-uglify');
var babel = require("gulp-babel");

gulp.task('minify-html', async () => {
    await new Promise(function (resolve) {
        gulp.src('./public/**/*.html')
            .pipe(htmlclean())
            .pipe(htmlmin({
                removeComments: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            }))
            .pipe(gulp.dest('./public'))
            .on('end', resolve)
    })
});

gulp.task('copy1', async () => {
    await new Promise(function (resolve) {
        gulp.src('./photos/*')
            .pipe(gulp.dest('./public/sheying/photos'))
            .on('end', resolve)
    })
})
gulp.task('copy2', async () => {
    await new Promise(function (resolve) {
        gulp.src('./min_photos/*')
            .pipe(gulp.dest('./public/sheying/min_photos'))
        .on('end', resolve)
    })
})

//压缩js
gulp.task('minify-js', async () => {
    await new Promise(function (resolve) {
        gulp.src('./public/sw.js')
            .pipe(babel({
                presets: ['@babel/env']
            }))
            // 2. 压缩文件
            .pipe(uglify())
            // 3. 另存压缩后的文件
            .pipe(gulp.dest('./public'))
            .on('end', resolve)
    })
})


// 执行 gulp 命令时执行的任务
gulp.task('default', gulp.series('minify-js', 'copy1', 'copy2'));

gulp.task('no-cp', gulp.series('minify-js', 'minify-html'));