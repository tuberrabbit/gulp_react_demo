import gulp from 'gulp'
import gutil from 'gulp-util'
import loadTasks from 'require-dir'
import _ from 'lodash'

loadTasks('./tasks')
//_.set(gutil.env, 'base.src', 'src')
_.set(gutil.env, 'base.dist', 'dist')
_.set(gutil.env, 'tasks.build', {
    taskQuene: [
        'clean'
    ]
})
gulp.task('default', ['build'])
