import React from "react";
import { artistHeroes } from "./artist-heroes.mjs";
import "./hero.css";

export default function Hero({
  kind = "artist",
  artist = "XXXTENTACION",
  children,
}) {
  const artwork = kind === "home"
    ? { file: "hero-trap-cinematic.webp", alt: "" }
    : artistHeroes[artist];
  return (
    <section
      className={`featured cinematic-hero cinematic-${kind}`}
    >
      {artwork && (
        <img
          className={`cinematic-backdrop ${artwork.file.endsWith("-portrait.webp") ? "artist-photo-backdrop" : ""}`}
          src={`${import.meta.env.BASE_URL}assets/${artwork.file}`}
          alt={artwork.alt}
          decoding="async"
          fetchPriority="high"
        />
      )}
      {children}
    </section>
  );
}
