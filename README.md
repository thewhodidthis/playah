## about

Helps control video elements with autoplay available down to iOS 8.

## setup

Download from the _npm_ registry:

```sh
# Add to package.json
npm install playah
```

## usage

Feed with a `<video>` element as for example,

```js
import createPlayer from "playah"

const video = document.createElement("video")

"playsinline loop autoplay".split(" ").forEach((v) => {
  video.setAttribute(v, "")
})

video.setAttribute("src", "BigBuckBunny.mp4")

// Instantiating past video setup is
// kind of important in this example
const { play, stop } = createPlayer(video)

let paused = 1

video.addEventListener("loadstart", () => {
  paused = 0
})

video.addEventListener("click", (e) => {
  e.preventDefault()

  paused = paused ? play() : stop()
}, false)

document.body.appendChild(video)
```
