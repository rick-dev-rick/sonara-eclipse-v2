import test from 'node:test';
import assert from 'node:assert/strict';
const { startLegacyAudio } = await import('../src/legacy-audio.mjs').catch(() => ({}));
const flush = () => new Promise(resolve => setImmediate(resolve));
function fixture(play = () => Promise.resolve()) {
  const target = new EventTarget();
  const audio = { loop: false, controls: true, currentTime: 25, paused: true, src: '',
    play() { this.calls = (this.calls || 0) + 1; this.paused = false; return play(); },
    pause() { this.paused = true; },
    removeAttribute(name) { if (name === 'src') this.src = ''; },
    load() { this.released = true; },
  };
  return { target, audio };
}
test('Legacy starts its background track in a loop without media controls', async () => {
  assert.equal(typeof startLegacyAudio, 'function');
  const { audio, target } = fixture();
  const stop = startLegacyAudio(audio, '/assets/hope.mp3', target);
  await flush();
  assert.equal(audio.src, '/assets/hope.mp3');
  assert.equal(audio.loop, true);
  assert.equal(audio.controls, false);
  assert.equal(audio.calls, 1);
  target.dispatchEvent(new Event('pointerdown'));
  assert.equal(audio.calls, 1);
  stop();
});
test('blocked autoplay retries on interaction and removes its retry listeners after success', async () => {
  assert.equal(typeof startLegacyAudio, 'function');
  let attempts = 0;
  const { audio, target } = fixture(() => ++attempts === 1 ? Promise.reject(new Error('NotAllowedError')) : Promise.resolve());
  const stop = startLegacyAudio(audio, '/assets/hope.mp3', target);
  await flush();
  target.dispatchEvent(new Event('touchend'));
  await flush();
  assert.equal(attempts, 2);
  target.dispatchEvent(new Event('keydown'));
  assert.equal(attempts, 2);
  stop();
});
test('leaving Legacy stops and releases the track and prevents a gesture from restarting it', async () => {
  assert.equal(typeof startLegacyAudio, 'function');
  const { audio, target } = fixture(() => Promise.reject(new Error('blocked')));
  const stop = startLegacyAudio(audio, '/assets/hope.mp3', target);
  await flush();
  stop();
  assert.equal(audio.paused, true);
  assert.equal(audio.currentTime, 0);
  assert.equal(audio.src, '');
  assert.equal(audio.released, true);
  target.dispatchEvent(new Event('pointerdown'));
  assert.equal(audio.calls, 1);
});
test('a pending play promise cannot restart playback after leaving Legacy', async () => {
  assert.equal(typeof startLegacyAudio, 'function');
  let resolvePlay;
  const { audio, target } = fixture(() => new Promise(resolve => { resolvePlay = resolve; }));
  const stop = startLegacyAudio(audio, '/assets/hope.mp3', target);
  stop();
  audio.paused = false;
  resolvePlay();
  await flush();
  assert.equal(audio.paused, true);
});
