import createPlayer from '../index.mjs'

if (window !== window.top) {
  document.documentElement.classList.add('is-iframe')
}

const source = document.createElement('video')

// Fallback video from
// https://www.pond5.com/stock-footage/43338828/czechoslovak-troops-marching-parade.html
source.setAttribute('src', 'clip.mp4')

const player = createPlayer(source)

const figure = document.querySelector('figure')
const target = document.querySelector('canvas').getContext('2d')

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

source.addEventListener('ended', () => {
  figure.classList.remove('is-active')
  looper.pause()
})

document.querySelector('a').addEventListener('click', (e) => {
  e.stopPropagation()
  e.preventDefault()

  if (figure.classList.contains('is-active')) {
    player.pause()
    looper.pause()
  } else {
    player.start()
    looper.start()
  }

  figure.classList.toggle('is-active')
}, false)
