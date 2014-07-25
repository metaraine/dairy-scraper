gulp = 				 require('gulp')
gutil = 			 require('gulp-util')
coffee = 			 require('gulp-coffee')
jshint =       require('gulp-jshint')
rename =       require('gulp-rename')
clean =        require('gulp-clean')

gulp.task 'scripts', ->
	gulp.src('*.coffee')
		.pipe(coffee().on('error', gutil.log))
		.pipe(gulp.dest('./'))

gulp.task 'default', (callback) ->
	gulp.watch('*.coffee', ['scripts'])
