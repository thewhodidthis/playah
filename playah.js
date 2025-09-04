var playah = (function() {
  "use strict"

  // # Playah
  // Helps control video elements

  const createPlayer = (video, delay = 30) => {
    if (!video || !video.src || !video.nodeName || video.nodeName !== "VIDEO") {
      throw TypeError("Missing valid source")
    }

    // Needs fixing?
    let veto = delay && /iPad|iPhone|iPod/.test(navigator.platform)

    // Paused?
    let idle = true

    const tick = (since) => {
      const stamp = Date.now()
      const delta = stamp - (since || stamp)

      // In ms
      video.currentTime += delta * 0.001

      // Repeat, repurpose veto flag.
      veto = setTimeout(tick, delay, stamp)
    }

    const kick = () => {
      if (idle) {
        tick()
      }

      idle = false

      return idle
    }

    const drop = () => {
      if (veto) {
        clearTimeout(veto)
      }

      idle = true

      return idle
    }

    const stop = veto ? drop : () => {
      video.pause()

      return video.paused
    }

    const play = veto ? kick : () => {
      const playsMaybe = video.play()

      // Some browsers don't support the promise based version yet.
      if (playsMaybe) {
        // Fail silently, because the `paused` attribute remains unchanged regardless.
        playsMaybe.catch(() => {})
      }

      return video.paused
    }

    // Check availability.
    video.addEventListener("loadstart", function xloadstart() {
      // Throws if no currentTime hack available.
      video.currentTime = 0

      video.removeEventListener("loadstart", xloadstart)
    })

    // Done playing.
    video.addEventListener("ended", () => {
      video.currentTime = 0

      if (veto) {
        stop()
      }

      if (video.loop) {
        play()
      }
    })

    if (veto) {
      if (video.autoplay) {
        play()
      }

      // Drop before anyone gets hurt.
      video.removeAttribute("autoplay")

      // Must have.
      video.load()
    }

    return { play, stop, start: play, pause: stop }
  }

  return createPlayer
})()
