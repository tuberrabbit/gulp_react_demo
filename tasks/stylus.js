import gulp from 'gulp';
import _ from 'lodash';
import gutil from 'gulp-util';
import path from 'path';
import stylus from 'gulp-stylus';
import mergeStream from 'merge-stream';
import autoprefixer from 'autoprefixer-stylus';
import bootstrap from 'bootstrap-styl';

import watcher from './libs/watcher';

const TASK_NAME = 'stylus';

export default gulp.task(TASK_NAME, ()=> {

    const defaultConfig = {
        files: [
            {
                'entry': [
                    `${_.get(gutil.env, 'base.src')}/index.styl`
                ],
                'src': [
                    `${_.get(gutil.env, 'base.src')}/**/*.styl`
                ],
                'dest': `${_.get(gutil.env, 'base.dest')}/css`
            }
        ],
        'options': {
            use: [
                autoprefixer({
                    browsers: ['> 1%', 'last 2 version', 'ie 10', 'Firefox ESR']
                }),
                includeCss(),
                components(),
                bootstrap()
            ],
            compress: process.env.NODE_ENV === 'production'
        }
    };

    const conf = _.merge({}, defaultConfig, _.get(gutil.env, ['tasks', TASK_NAME]));

    return mergeStream.apply(gulp, _.map(conf.files, bundleThis));

    function bundleThis(fileConfig = {}) {

        fileConfig.options = _.merge({}, conf.options, fileConfig.options);

        function bundle(fileConf) {
            return gulp.src(fileConf.entry)
                .pipe(stylus(fileConf.options))
                .pipe(gulp.dest(fileConf.dest))
                .pipe(watcher.pipeTimer(TASK_NAME));
        }

        if (watcher.isWatching()) {
            gulp.watch([].concat(fileConfig.src), function (evt) {
                gutil.log(evt.path, evt.type);
                bundle(fileConfig);
            });
        }

        return bundle(fileConfig);
    }

});

function includeCss() {
    return function (styleInst) {
        styleInst.set('include css', true);
    };
}

function components() {
    return function (styleInst) {
        styleInst.include(path.join(process.cwd(), 'node_modules'));
    };
}