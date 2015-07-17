import gutil from 'gulp-util'
import through from 'through'

let watcher = false
export default {
    isWatcher() {
        return watcher
    },
    setWatcher() {
        watcher = true
    },
    pipeTimer(taskName) {
        taskName = taskName || '~~~'
        const startTime = new Date()
        return through(start, end)
        function start() {

        }

        function end() {
            if (watcher) {
                this.on('end', ()=> {
                    const interval = new Date() - startTime
                    gutil.log(`Watching: \'${gutil.colors.cyan(taskName)}\'`
                     +` re-bundle after${gutil.colors.magenta(interval > 1000 ? interval / 1000 + ' s' : interval + ' ms')}`)
                })
            }
            this.queue(null)
        }
    }
}