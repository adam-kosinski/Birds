initSpectrogram();

function initSpectrogram() {
  const audio = document.getElementById("birdsong-audio-0");
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
}

function updateSpectrogramPosition(sec) {
  const scroller = document.getElementById("spectrogram-scroll-container");
  scroller.style.transform = `translate(-${
    sec * SPECTROGRAM_HORIZ_PERCENT_PER_SEC
  }%)`;
}

function scrollSpectrogram() {
  // starts spectrogram scrolling, returns function to call to stop the scrolling

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
