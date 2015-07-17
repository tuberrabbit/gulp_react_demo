import gulp from 'gulp'
import _ from 'lodash'
import gutil from 'gulp-util'
import runSequence from 'run-sequence'

const TASK_NAME = 'build'
export default gulp.task(TASK_NAME, (cb)=> {
    const defaultConfig = {
        taskQuene: []
    }
    const conf = _.merge({}, defaultConfig, _.get(gutil.env, ['tasks', TASK_NAME]))

    runSequence.apply(gulp, [].concat(conf.taskQuene).concat(cb))
})
