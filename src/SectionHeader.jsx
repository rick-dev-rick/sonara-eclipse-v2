import React from "react";
import { Heart, Disc3, Radio } from "lucide-react";
import "./section-header.css";

const base = `${import.meta.env.BASE_URL}assets/`;
const editions = {
  explore: { number: "01", word: "DISCOVER", label: "SONARA ECLIPSE · DESCUBRA", title: "Explorar", description: "O universo de XXXTENTACION e dos artistas da 30PRAUM.", detail: "QUATRO VOZES. INFINITAS CONEXÕES." },
  library: { number: "02", word: "COLLECTION", label: "SUA COLEÇÃO", title: "Biblioteca", description: "Suas músicas, playlists e descobertas em um só lugar.", detail: "SEU UNIVERSO, SEMPRE POR PERTO." },
  albums: { number: "03", word: "RECORDS", label: "SONARA ECLIPSE · DISCOGRAFIA", title: "Álbuns & projetos", description: "Quatro artistas. Histórias diferentes. Um universo musical." },
  artists: { number: "04", word: "VOICES", label: "QUEM FAZ A MÚSICA", title: "Artistas", description: "Conheça as vozes que dão vida ao universo SONARA.", detail: "XXXTENTACION / MATUÊ / TETO / WIU" },
  favorites: { number: "05", word: "ON REPEAT", label: "SUAS ESCOLHAS", title: "Favoritos", description: "Tudo aquilo que merece ficar com você.", detail: "AS CONEXÕES QUE PERMANECEM." },
  playlists: { number: "06", word: "SELECTED", label: "SUAS PLAYLISTS · SONARA ECLIPSE", title: "Minhas Playlists", description: "Duas coleções pessoais. Cada uma com seu próprio universo.", detail: "JAHSEH / TRAP BR — 30PRAUM" },
};
const covers = ["official-album-333.jpg", "official-album-17.jpg", "official-album-808.jpg"];
export default function SectionHeader({ kind, count }) {
  const edition = editions[kind];
  return (
    <header className={`section-banner section-banner-${kind}`}>
      <div className="section-banner-art" aria-hidden="true">
        {kind === "explore" && <img className="section-scene" src={base + "hero-matue-portrait.webp"} alt="" />}
        {kind === "artists" && <div className="section-portraits">{["legacy-portrait.webp", "artist-matue.jpg", "artist-teto.jpg", "artist-wiu-verified.webp"].map(file => <img key={file} src={base + file} alt="" />)}</div>}
        {["library", "albums"].includes(kind) && <div className="section-records"><div className="section-vinyl" />{covers.map(file => <img key={file} src={base + file} alt="" />)}</div>}
        {kind === "favorites" && <div className="section-heart-orbit"><img src={base + "eclipse-avatar.webp"} alt="" /><Heart size={60} strokeWidth={1} /><span>KEEP WHAT MOVES YOU</span></div>}
        {kind === "playlists" && <div className="section-mixtapes">{["playlist-jahseh.svg", "playlist-trap-br.svg"].map(file => <img key={file} src={base + file} alt="" />)}</div>}
      </div>
      <div className="section-banner-shade" aria-hidden="true" />
      <div className="section-banner-top"><span><i /> {edition.label}</span><span>SONARA / {edition.number}</span></div>
      <div className="section-banner-copy"><span className="section-banner-word">{edition.word}</span><h1>{edition.title}</h1><p>{edition.description}</p></div>
      <div className="section-banner-bottom"><span>{kind === "albums" ? <><Disc3 size={13} /> {count} LANÇAMENTOS CATALOGADOS</> : <><Radio size={13} /> {edition.detail}</>}</span><span className="section-signal" aria-hidden="true">{[6, 13, 9, 18, 12, 22, 8, 16, 11].map((height, i) => <i key={i} style={{ height }} />)}</span></div>
    </header>
  );
}
