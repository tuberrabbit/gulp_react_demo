import gulp from 'gulp';
import gutil from 'gulp-util';
import eslint from 'gulp-eslint';
import _ from 'lodash';
import mergeStream from 'merge-stream';

import watcher from './libs/watcher';

const TASK_NAME = 'eslint';

export default gulp.task(TASK_NAME, function () {

  const defaultConfig = {
    'files': [
      {
        'src': [
          `src/{,**/}*.js{,x}`
        ],
        'options': {
          'env': [
            'browser',
            'node',
            'es6'
          ]
        }
      },
      {
        'src': [
          '{,**/}__tests__/*.js{,x}'
        ],
        'options': {
          'rules': {
            'no-unused-expressions': 0
          },
          'env': [
            'mocha',
            'node',
            'es6'
          ]
        }
      }
    ]
  };

  const conf = _.merge({}, defaultConfig, _.get(gutil.env, ['tasks', TASK_NAME]));

  return mergeStream.apply(gulp, _.map(conf.files, bundleThis));

  function bundleThis(fileConfig = {}) {

    fileConfig.options = _.merge({}, conf.options, fileConfig.options);

    function bundle(fileConf) {
      return gulp.src(fileConf.src)
        .pipe(eslint(fileConf.options))
        .pipe(eslint.formatEach('compact', process.stderr))
        .pipe(watcher.isWatching() ? gutil.noop() : eslint.failOnError())
        .pipe(watcher.pipeTimer(TASK_NAME));
    }

    if (watcher.isWatching()) {
      gulp.watch(fileConfig.src, function (evt) {
        if (evt.type === 'changed') {
          bundle(_.merge({}, fileConfig, {
            src: evt.path
          }));
        }
      });
    }

    return bundle(fileConfig);

  }
});

