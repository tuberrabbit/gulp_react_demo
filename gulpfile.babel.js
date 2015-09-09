import gulp from 'gulp'
import gutil from 'gulp-util'
import loadTasks from 'require-dir'
import _ from 'lodash'
import watcher from './tasks/libs/watcher'

loadTasks('./tasks')
_.set(gutil.env, 'base.src', 'src')
_.set(gutil.env, 'base.dest', 'dest')
_.set(gutil.env, 'tasks.build', {
  taskQuene: [
    'clean',
    'copy',
    'jade',
    'stylus',
    'browserify'
  ]
})

if (gutil.env.prod) {
  process.env.NODE_ENV = 'production'
}

if (gutil.env.watch) {
  watcher.setWatcher()
}

gulp.task('dev', ()=> {
  watcher.setWatcher()
  gulp.start(['build', 'server'])
})

gulp.task('default', ['build'])
