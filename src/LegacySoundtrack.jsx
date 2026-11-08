import React, { useEffect, useRef } from 'react';
import { startLegacyAudio } from './legacy-audio.mjs';

export default function LegacySoundtrack() {
  const audio = useRef(null);
  useEffect(() => startLegacyAudio(
    audio.current,
    `${import.meta.env.BASE_URL}audio/hope-instrumental-ambient.mp3`,
  ), []);
  return <audio ref={audio} hidden aria-hidden="true" loop preload="auto" />;
}
