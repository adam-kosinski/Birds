initSpectrogram();

function initSpectrogram() {
  const audio = document.getElementById("birdsong-audio-0");
  const imgs_div = document.getElementById("spectrogram-images");

  // spectrogram scrolling
  let stopScroll = () => {};
  audio.addEventListener("play", () => {
    stopScroll();
    stopScroll = scrollSpectrogram();
  });
  audio.addEventListener("pause", () => {
    stopScroll();
  });
  audio.addEventListener("seeking", () =>
    updateSpectrogramPosition(audio.currentTime)
  );

  audio.addEventListener("loadstart", () => {
    // clean up from last time
    imgs_div.innerHTML = "";
  });
  audio.addEventListener("timeupdate", () => {
    if (!current.is_squirrel_intruder) {
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
  // need to animate scrolling start/stop based on audio events rather than the timeupdate event,
  // because the timeupdate event doesn't happen frequently enough

  const time0 = document.timeline.currentTime;
  const audioStartPos = document.getElementById("birdsong-audio-0").currentTime;
  let shouldStop = false;

  const callback = (time) => {
    const elapsed_sec = (time - time0) / 1000;
    updateSpectrogramPosition(audioStartPos + elapsed_sec);
    if (!shouldStop) {
      requestAnimationFrame(callback);
    }
  };

  requestAnimationFrame(callback);

  return () => {
    shouldStop = true;
  };
}
