import React, { useState, useEffect } from "react";

const base = `${import.meta.env.BASE_URL}assets/`;
const files = {
  "artist-x": "legacy-portrait.webp",
  x: "legacy-jahseh.webp",
  legacy: "legacy-portrait.webp",
  "artist-matue": "artist-matue.jpg",
  "artist-teto": "artist-teto.jpg",
  "artist-wiu": "artist-wiu.jpg",
  "artist-trio": "artist-trio.jpg",
  "playlist-x": "playlist-jahseh.svg",
  "playlist-trap": "playlist-trap-br.svg",
  dark: "cover-after-dark.webp",
  focus: "cover-deep-focus.webp",
  drive: "cover-night-drive.webp",
  energy: "cover-energy.webp",
  time: "album-eterno.webp",
};
export default function Art({
  type = "dark",
  className = "",
  children,
  alt = "",
  eager = false,
}) {
  const [failed, setFailed] = useState(false);
  const file = type.startsWith("album-") ? `official-${type}.jpg` : files[type];
  useEffect(() => setFailed(false), [type]);
  return (
    <div className={`cover cover-${type} ${className}`}>
      {file && !failed ? (
        <img
          key={file}
          src={base + file}
          alt={alt}
          loading={eager || type === "artist-x" ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="art-placeholder" aria-label="Visual indisponível">
          {type === "eclipse" ? "S" : type.replace("album-", "").toUpperCase()}
        </span>
      )}
      {children}
    </div>
  );
}
