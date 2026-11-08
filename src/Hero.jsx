import React from "react";
import Art from "./Art.jsx";
import "./hero.css";

export default function Hero({
  kind = "artist",
  artist = "XXXTENTACION",
  children,
}) {
  const file =
    artist === "XXXTENTACION"
      ? "hero-x-cinematic.webp"
      : artist === "Matuê"
        ? "hero-trap-cinematic.webp"
        : null;
  return (
    <section
      className={`featured cinematic-hero cinematic-${kind} ${file ? "" : "portrait-hero"}`}
    >
      {file ? (
        <img
          className="cinematic-backdrop"
          src={`${import.meta.env.BASE_URL}assets/${file}`}
          alt=""
          decoding="async"
          fetchPriority="high"
        />
      ) : (
        <div className="cinematic-portrait">
          <Art type={artist === "Teto" ? "artist-teto" : "artist-wiu"} eager />
        </div>
      )}
      {children}
    </section>
  );
}
