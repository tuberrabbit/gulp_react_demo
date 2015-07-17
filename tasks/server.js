import _ from 'lodash';
import gulp from 'gulp';
import gutil from 'gulp-util';

import browserSync from 'browser-sync';

import compress from 'compression';

import watcher from './libs/watcher';

const TASK_NAME = 'server';

export default gulp.task(TASK_NAME, function () {

    const defaultConfig = {
        'src': [
            `${_.get(gutil.env, 'base.dest')}/**/*.*'`
        ],
        'options': {
            server: {
                baseDir: `${_.get(gutil.env, 'base.dest')}`,
                middleware: [
                    (process.env.NODE_ENV === 'production' || gutil.env.debug) ? compress() : middlewareNope()
                ]
            },
            ui: {
                port: 9999
            }
        }
    };

    const conf = _.merge({}, defaultConfig, _.get(gutil.env, ['tasks', TASK_NAME]));

    browserSync(conf.options);

    if (watcher.isWatching()) {
        gulp.watch(conf.src).on('change', browserSync.reload);
    }

});

function middlewareNope() {
    return (req, res, next)=> {
        return next();
    };
}
