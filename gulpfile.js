var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');

gulp.task('serve', ['sass'], function() {

    browserSync.init({
        proxy: "localhost:4200",
        reloadDelay: 500
    });

    gulp.watch("style.scss", ['sass']);
    gulp.watch(["index.html", "script.js", "server.js"]).on('change', browserSync.reload);
});


// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("style.scss")
        .pipe(sass())
        .pipe(gulp.dest("./"))
        .pipe(browserSync.stream());
});


gulp.task('default', ['serve']);