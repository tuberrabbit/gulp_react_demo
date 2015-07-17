import gulp from 'gulp'
import gutil from 'gulp-util'
import _ from 'lodash'
import mergeStream from 'merge-stream'
import rename from 'gulp-rename'

const TASK_NAME = 'copy'
export default gulp.task(TASK_NAME, ()=> {
    const defaultConfig = {
        'files': [
            {
                'src': `${_.get(gutil.env, 'base.src')}/{,**/}images/*.*`,
                'dest': `${_.get(gutil.env, 'base.dest')}/images`
            }
        ]
    }
    const conf = _.merge({}, defaultConfig, _.get(gutil.env, ['tasks', TASK_NAME]))
    function bundleThis(fileConfig = {}) {
        fileConfig.options = _.merge({}, conf.options, fileConfig.options)
        function bundle(fileConf) {
            return gulp.src(fileConf.src)
                .pipe(rename({
                    dirname: ''
                }))
                .pipe(gulp.dest(fileConf.dest))
        }
        return bundle(fileConfig)
    }
    return mergeStream.apply(gulp, _.map(conf.files, bundleThis))
})