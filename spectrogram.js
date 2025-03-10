initSpectrogram();

function initSpectrogram() {
  if (data_source !== "ebird_calls") return;

  const audio = document.getElementById("birdsong-audio-0");
  const imgs_div = document.getElementById("spectrogram-images");

  // spectrogram scrolling
  let stopScroll = () => {};

  audio.addEventListener("pause", () => {
    stopScroll();
  });
  audio.addEventListener("seeking", () => {
    stopScroll(true);
    updateSpectrogramPosition(audio.currentTime);
  });

  audio.addEventListener("loadstart", () => {
    // clean up from last time
    imgs_div.innerHTML = "";
    stopScroll(true);
  });

  audio.addEventListener("timeupdate", () => {
    // start audio on a timeupdate event, because this is the only reliable way to sync animation on iOS,
    // which starts actually playing the audio some undetermined amount of time after the "play" event fires
    // try not to activate this multiple times? detect if already scrolling?
    if (!audio.paused) {
      stopScroll(); // just in case
      stopScroll = scrollSpectrogram();
    }

    if (current && !current.is_squirrel_intruder) {
      // fetch spectrogram images as needed
      const t_buffered = Math.min(
        audio.duration,
        audio.currentTime + SPECTROGRAM_IMAGE_FETCH_BUFFER_SEC
      );
      const nImgsNeeded = Math.ceil(t_buffered / SPECTROGRAM_SEC_PER_IMAGE);
      while (imgs_div.children.length < nImgsNeeded) {
        const img = document.createElement("img");
        img.src = getSpectrogramURI(imgs_div.children.length + 1);
        imgs_div.appendChild(img);
      }
    }
  });
}

function getSpectrogramURI(index) {
  if (current.id.substring(0, 2) !== "ML") {
    throw new Error(
      "Can't get spectrogram images if observation isn't from the Macaulay Library"
    );
  }
  const id = current.id.split("ML")[1];
  const indexStr = String(index).padStart(4, "0");
  return `https://cdn.download.ams.birds.cornell.edu/api/v2/asset/${id}/default/partial/${indexStr}`;
}

function updateSpectrogramPosition(sec) {
  const scroller = document.getElementById("spectrogram-scroll-container");
  scroller.style.transform = `translate(-${
    sec * SPECTROGRAM_HORIZ_PERCENT_PER_SEC
  }%)`;
}

function scrollSpectrogram() {
  // starts spectrogram scrolling, returns function to call to stop the scrolling
  // by default, scrolling will stop at the next audio.currentTime spot (every 0.25 sec on avg)
  // because when scrolling resumes, it will be from that spot, and we want to avoid a jump
  // it's also possible to tell the scrolling to stop immediately

  const audio = document.getElementById("birdsong-audio-0");

  const time0 = document.timeline.currentTime;
  const audioStartPos = audio.currentTime;

  let timeToStop = Infinity;
  let stopImmediately = false;

  const callback = (time) => {
    const elapsed_sec = (time - time0) / 1000;
    updateSpectrogramPosition(audioStartPos + elapsed_sec);
    if (audioStartPos + elapsed_sec < timeToStop && !stopImmediately) {
      requestAnimationFrame(callback);
    }
  };

  requestAnimationFrame(callback);

  return (stopNow = false) => {
    timeToStop = audio.currentTime + 0.25; //next approx currentTime position
    stopImmediately = stopNow;
  };
}
