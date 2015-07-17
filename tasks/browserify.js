import path from 'path';
import _ from 'lodash';
import gulp from 'gulp';
import gutil from 'gulp-util';

import source from 'vinyl-source-stream';
import rename from 'gulp-rename';
import browserify from 'browserify';
import watchify from 'watchify';

import mergeSteam from 'merge-stream';

import streamify from 'gulp-streamify';
import uglify from 'gulp-uglify';

import watcher from './libs/watcher';

const TASK_NAME = 'browserify';

export default gulp.task(TASK_NAME, ()=> {

    const vendorBrowser = require(path.join(process.cwd(), _.get(gutil.env, 'base.src'), 'package.json')).browser;

    const defaultConfig = {
        files: [
            {
                'entry': `vendor.js`,
                'dest': `${_.get(gutil.env, 'base.dest')}/js`,
                'options': {
                    'basedir': path.join(process.cwd(), _.get(gutil.env, 'base.src')),
                    'debug': false,
                    'require': _.map(_.keys(vendorBrowser), function (key) {
                        return [
                            vendorBrowser[key], {
                                expose: key
                            }
                        ];
                    })
                }
            },
            {
                'entry': `${_.get(gutil.env, 'base.src')}/index.jsx`,
                'dest': `${_.get(gutil.env, 'base.dest')}/js`,
                'options': {
                    'debug': true,
                    'external': _.keys(vendorBrowser)
                }
            }
        ],
        options: {
            'extensions': ['.jsx'],
            'plugin': (process.env.NODE_ENV === 'production') ? require('bundle-collapser/plugin') : null
        }
    };

    const conf = _.merge({}, defaultConfig, _.get(gutil.env, ['tasks', TASK_NAME]));
    return mergeSteam.apply(gulp, _.map(conf.files, bundleThis));


    function bundleThis(fileConf = {}) {

        fileConf.entry = path.join(process.cwd(), fileConf.entry);
        fileConf.options = _.merge({}, conf.options, fileConf.options);

        const isVendor = /vendor\.js$/.exec(fileConf.entry);

        let bundler;

        if (watcher.isWatching()) {
            bundler = browserify(_.merge({}, fileConf.options, watchify.args));
        } else {
            bundler = browserify(fileConf.options);
        }

        if (!isVendor) {
            bundler.add(fileConf.entry);
        }

        [
            'plugin',
            'require',
            'external'
        ].forEach((method)=> {
                [].concat(fileConf.options[method])
                    .forEach((args)=> {
                        if (args) {
                            bundler[method].apply(bundler, [].concat(args));
                        }
                    });
            });

        if (watcher.isWatching()) {
            bundler = watchify(bundler);
            bundler.on('update', bundle);
            bundler.on('time', (time)=> {
                gutil.log(gutil.colors.cyan('watchify'),
                    're-bundled', 'after', gutil.colors.magenta(time > 1000 ? time / 1000 + ' s' : time + ' ms'));
            });
        }


        function bundle() {
            return bundler.bundle()
                .on('error', function (e) {
                    gutil.log('Browserify Error', wrapWithPluginError(e));
                })
                .pipe(source(fileConf.entry))
                .pipe(rename(function (pathObj) {
                    pathObj.dirname = '';
                    pathObj.extname = '.js';
                }))
                .pipe(whenInProductionDoUglify())
                .pipe(gulp.dest(fileConf.dest));
        }

        return bundle();
    }

});

function wrapWithPluginError(originalError) {
    var message;

    if (typeof originalError === 'string') {
        message = originalError;
    } else {
        message = originalError.message.toString();
    }
    if (process.env.NODE_ENV === 'production') {
        throw new Error(message);
    }
    return new gutil.PluginError('watchify', message);
}

function whenInProductionDoUglify() {
    return process.env.NODE_ENV === 'production' || gutil.env.debug ? streamify(uglify({
        compress: {
            'pure_funcs': ['console.log']
        }
    })) : gutil.noop();
}
