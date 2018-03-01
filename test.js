import 'cutaway'
import { report, assert } from 'tapeless'
import createPlayer from './index.mjs'

const { ok, notOk, equal } = assert

try {
  createPlayer()
} catch (e) {
  ok(e, e.message, 'will throw sans video input')
}

const source = document.createElement('video')

source.src = ''

const { play, stop } = createPlayer(source)

equal(typeof play, 'function', 'play', 'will operate')
notOk(play(), 'playing')

equal(typeof stop, 'function', 'stop')
ok(stop(), 'paused')

report()
