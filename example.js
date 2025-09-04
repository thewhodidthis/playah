import createPlayer from "./main.js"

const source = document.createElement("video")

// Fallback video from:
// https://www.pond5.com/stock-footage/43338828/czechoslovak-troops-marching-parade.html
source.setAttribute("src", "clip.mp4")

const player = createPlayer(source)

const button = document.querySelector("figure > a")
const target = document.querySelector("canvas").getContext("2d")

const createLoop = (loop) => {
  let id = false

  const start = () => {
    loop()

    id = window.requestAnimationFrame(start)
  }

  const pause = () => {
    id = id && window.cancelAnimationFrame(id)
  }

  return { start, pause }
}

const looper = createLoop(() => {
  target.drawImage(source, 0, 0)
})

source.addEventListener("ended", () => {
  button.classList.remove("pause")
  looper.pause()
})

button.addEventListener("click", function onclick(e) {
  e.stopPropagation()
  e.preventDefault()

  if (this.classList.contains("pause")) {
    player.pause()
    looper.pause()
  } else {
    player.start()
    looper.start()
  }

  this.classList.toggle("pause")
}, false)
