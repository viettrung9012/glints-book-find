var gulp = require('gulp'),
		browserSync = require('browser-sync'),
		nodemon = require('gulp-nodemon');

gulp.task('serve', ['browser-sync']);

gulp.task('browser-sync', ['nodemon'], function() {
	browserSync.init(null, {
		proxy: "http://localhost:3000",
        files: ["public/**/*.*"],
        browser: "google chrome",
        port: 7000,
	});
});

gulp.task('nodemon', function (cb) {
	var started = false;
	return nodemon({
		script: 'server.js'
	}).on('start', function () {
		if (!started) {
			cb();
			started = true;
		}
	});
});
