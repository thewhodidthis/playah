(() => {
  // ../main.js
  var createPlayer = (video, delay = 30) => {
    if (!video || !video.src || !video.nodeName || video.nodeName !== "VIDEO") {
      throw TypeError("Missing valid source");
    }
    let veto = delay && /iPad|iPhone|iPod/.test(navigator.platform);
    let idle = true;
    const tick = (since) => {
      const stamp = Date.now();
      const delta = stamp - (since || stamp);
      video.currentTime += delta * 1e-3;
      veto = setTimeout(tick, delay, stamp);
    };
    const kick = () => {
      if (idle) {
        tick();
      }
      idle = false;
      return idle;
    };
    const drop = () => {
      if (veto) {
        clearTimeout(veto);
      }
      idle = true;
      return idle;
    };
    const stop = veto ? drop : () => {
      video.pause();
      return video.paused;
    };
    const play = veto ? kick : () => {
      const playsMaybe = video.play();
      if (playsMaybe) {
        playsMaybe.catch(() => {
        });
      }
      return video.paused;
    };
    video.addEventListener("loadstart", function xloadstart() {
      video.currentTime = 0;
      video.removeEventListener("loadstart", xloadstart);
    });
    video.addEventListener("ended", () => {
      video.currentTime = 0;
      if (veto) {
        stop();
      }
      if (video.loop) {
        play();
      }
    });
    if (veto) {
      if (video.autoplay) {
        play();
      }
      video.removeAttribute("autoplay");
      video.load();
    }
    return { play, stop, start: play, pause: stop };
  };
  var main_default = createPlayer;

  // index.js
  var source = document.createElement("video");
  source.setAttribute("src", "clip.mp4");
  var player = main_default(source);
  var figure = document.querySelector("figure");
  var target = document.querySelector("canvas").getContext("2d");
  var createLoop = (loop) => {
    let id = false;
    const start = () => {
      loop();
      id = window.requestAnimationFrame(start);
    };
    const pause = () => {
      id = id && window.cancelAnimationFrame(id);
    };
    return { start, pause };
  };
  var looper = createLoop(() => {
    target.drawImage(source, 0, 0);
  });
  source.addEventListener("ended", () => {
    figure.classList.remove("is-active");
    looper.pause();
  });
  document.querySelector("a").addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (figure.classList.contains("is-active")) {
      player.pause();
      looper.pause();
    } else {
      player.start();
      looper.start();
    }
    figure.classList.toggle("is-active");
  }, false);
})();
