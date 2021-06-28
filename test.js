import "cutaway"
import { assert, report } from "tapeless"
import createPlayer from "./main.js"

const { ok, notOk, equal } = assert

try {
  createPlayer()
} catch (e) {
  ok
    .describe("will throw sans video input")
    .test(e, e.message)
}

const source = document.createElement("video")

source.src = ""

const { play, stop } = createPlayer(source)

equal
  .describe("play")
  .test(typeof play, "function")

notOk
  .describe("playing")
  .test(play())

equal
  .describe("stop")
  .test(typeof stop, "function")

ok
  .describe("paused", "will operate")
  .test(stop())

report()
