// The bundled MP3 is attenuated by 18 dB so iOS also gets a quiet soundtrack.
export function startLegacyAudio(audio, source, target = document) {
  let active = true;
  const gestures = ['pointerdown', 'touchend', 'keydown'];
  const removeListeners = () => {
    for (const event of gestures) target.removeEventListener(event, play, { capture: true });
  };
  function play() {
    if (!active) return;
    try {
      Promise.resolve(audio.play()).then(() => {
        if (!active) {
          audio.pause();
          return;
        }
        removeListeners();
      }).catch(() => {
        // Browser autoplay restrictions are retried on a real user gesture.
      });
    } catch {
      // Keep the same gesture fallback if a browser throws synchronously.
    }
  }
  audio.src = source;
  audio.loop = true;
  audio.controls = false;
  audio.preload = 'auto';
  for (const event of gestures) target.addEventListener(event, play, { capture: true });
  play();
  return () => {
    active = false;
    removeListeners();
    audio.pause();
    audio.currentTime = 0;
    audio.removeAttribute('src');
    audio.load();
  };
}
