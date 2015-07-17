import gulp from 'gulp'
import gutil from 'gulp-util'
import _ from 'lodash'
import del from 'del'

const TASK_NAME = 'clean'
export default gulp.task(TASK_NAME, (cb)=> {
    const defaultConfig = {
        src: _.get(gutil.env, 'base.dist')
    }
    const conf = _.merge({}, defaultConfig, _.get(gutil.env, ['task', TASK_NAME]))
    del(conf.src, cb)
})