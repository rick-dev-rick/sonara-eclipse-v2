import LegacySoundtrack from "./LegacySoundtrack.jsx";
import { trackId } from "./catalog.js";
import React from "react";
import { ArrowUpRight, Disc3, Heart, ListMusic } from "lucide-react";
import Art from "./Art.jsx";
import { legacyTracks } from "./data.js";
import "./legacy.css";

const coverFor = (name) =>
  [
    "Carry On",
    "Jocelyn Flores",
    "Everybody Dies In Their Nightmares",
    "Save Me",
    "Fuck Love",
  ].includes(name)
    ? "album-17"
    : [
          "Hope",
          "changes",
          "the remedy for a broken heart (why am I so in love)",
          "Moonlight",
        ].includes(name)
      ? "album-question"
      : ["whoa (mind in awe)", "Guardian angel"].includes(name)
        ? "album-skins"
        : "artist-x";
function ArchiveQuote({ children, placement }) {
  return (
    <figure className={`archive-quote archive-quote-${placement}`}>
      <blockquote lang="en">“{children}”</blockquote>
      <figcaption>XXXTENTACION</figcaption>
    </figure>
  );
}

export default function Legacy({
  favorites,
  toggleLike,
  chooseAlbum,
  chooseArtist,
}) {
  const jump = (id) =>
    document.getElementById(id)?.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "start",
    });
  return (
    <article className="memorial">
      <LegacySoundtrack />
      <div className="archive-line">
        <span>SONARA / THE ARCHIVE</span>
        <span>IN MEMORY OF JAHSEH</span>
      </div>
      <section className="memorial-hero" aria-labelledby="legacy-title">
        <picture className="archive-picture">
          <source
            media="(max-width:760px)"
            srcSet={`${import.meta.env.BASE_URL}assets/legacy-archive-mobile.webp`}
          />
          <img
            className="archive-hero-image"
            src={`${import.meta.env.BASE_URL}assets/legacy-archive-final.webp`}
            alt="Composição artística de arquivo com retrato de Jahseh, fotografia antiga e papel de caderno"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <div className="memorial-copy">
          <span className="archive-label">1998 — 2018 / FOREVER</span>
          <h1 id="legacy-title">LEGACY</h1>
          <p className="memorial-script">FOREVER JAHSEH</p>
          <div className="memorial-rule" />
          <p className="memorial-tagline">The Music Lives On.</p>
          <p className="memorial-intro">
            Algumas vozes nunca vão embora.
            <br />
            Continuam nas músicas que ficam com a gente.
          </p>
          <div className="memorial-actions">
            <button
              className="paper-button"
              onClick={() => jump("legacy-songs")}
            >
              <ListMusic size={17} />
              Explorar músicas
            </button>
            <button
              className="archive-button"
              onClick={() => chooseArtist("XXXTENTACION")}
            >
              <Disc3 size={17} />
              Discografia
            </button>
          </div>
        </div>
      </section>
      <nav className="memorial-chapters" aria-label="Capítulos da homenagem">
        {[
          [
            "01",
            "A música",
            "As canções que permanecem.",
            "album-17",
            "legacy-songs",
          ],
          [
            "02",
            "A história",
            "A pessoa por trás da voz.",
            "archive-palms",
            "legacy-story",
          ],
          [
            "03",
            "O legado",
            "Uma memória que continua viva.",
            "archive-impact",
            "legacy-impact",
          ],
        ].map(([n, title, desc, art, id]) => (
          <button key={id} onClick={() => jump(id)}>
            <Art type={art} eager />
            <span>
              <small>CHAPTER {n}</small>
              <strong>{title}</strong>
              <em>{desc}</em>
            </span>
            <ArrowUpRight size={18} />
          </button>
        ))}
      </nav>
      <ArchiveQuote placement="opening">Your mind is limitless.</ArchiveQuote>
      <section
        id="legacy-songs"
        className="memorial-collection"
        aria-labelledby="collection-title"
      >
        <div className="memorial-collection-head">
          <button
            className="memorial-album"
            aria-label="Ver álbum 17"
            onClick={() => chooseAlbum("17")}
          >
            <Art
              type="album-17"
              alt="Capa original do álbum 17 de XXXTENTACION"
              eager
            />
            <span>
              17 / THE DEBUT ALBUM · 2017 <ArrowUpRight size={14} />
            </span>
          </button>
          <div>
            <span className="archive-label">A PERSONAL COLLECTION / 01</span>
            <h2 id="collection-title">
              FOREVER
              <br />
              <em>JAHSEH</em>
            </h2>
            <p>
              Canções que deixaram marcas.
              <br />
              Uma seleção pessoal para atravessar o tempo.
            </p>
            <span className="collection-count">
              {legacyTracks.length} FAIXAS · THE MUSIC LIVES ON
            </span>
          </div>
        </div>
        <div className="memorial-section-title">
          <h3>Every song tells a story.</h3>
          <span>CURATED BY RICK_DEV</span>
        </div>
        <ol className="memorial-tracks">
          {legacyTracks.map((name, i) => {
            const id = trackId({ title: name, artist: "XXXTENTACION" }),
              liked = favorites.includes(id);
            return (
              <li
                key={name}
                className={
                  name === "Everybody Dies In Their Nightmares"
                    ? "special-track"
                    : ""
                }
              >
                <span className="memorial-track-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Art type={coverFor(name)} eager />
                <span className="memorial-track-name">
                  <strong>{name}</strong>
                  <small>XXXTENTACION</small>
                  {name === "Everybody Dies In Their Nightmares" && (
                    <em>✦ SELEÇÃO ESPECIAL</em>
                  )}
                </span>
                <button
                  className={liked ? "liked" : ""}
                  aria-label={`${liked ? "Remover" : "Adicionar"} ${name} ${liked ? "dos" : "aos"} favoritos`}
                  aria-pressed={liked}
                  onClick={() => toggleLike(id)}
                >
                  <Heart size={19} fill={liked ? "currentColor" : "none"} />
                </button>
              </li>
            );
          })}
        </ol>
        <p className="archive-disclaimer">
          Coleção editorial. As faixas listadas não são reproduzidas pelo player.
          Trilha de fundo: Hope instrumental.
        </p>
      </section>
      <ArchiveQuote placement="margin">You are worth more than you can believe.</ArchiveQuote>
      <section id="legacy-story" className="memorial-story">
        <div>
          <span className="archive-label">02 / THE STORY</span>
          <h2>
            Uma voz que
            <br />
            <em>permanece.</em>
          </h2>
          <p>
            Jahseh Dwayne Ricardo Onfroy (1998–2018) deixou uma obra marcada por
            vulnerabilidade, intensidade e busca por compreensão. Entre rap,
            rock e R&amp;B, encontrou uma linguagem que continua acompanhando
            momentos difíceis de colocar em palavras.
          </p>
          <div className="memorial-dates">
            <span>
              1998<small>23 DE JANEIRO</small>
            </span>
            <span>
              2017<small>17 · ÁLBUM DE ESTREIA</small>
            </span>
            <span>
              2018<small>A MÚSICA CONTINUA</small>
            </span>
          </div>
        </div>
        <figure>
          <Art type="x" alt="Fotografia de Jahseh na coleção memorial" />
          <figcaption>THE HUMAN BEHIND THE MUSIC.</figcaption>
        </figure>
      </section>
      <ArchiveQuote placement="pause">Do not let your body define your soul.</ArchiveQuote>
      <section id="legacy-impact" className="memorial-impact">
        <Art type="artist-x" eager />
        <div>
          <span className="archive-label">03 / THE IMPACT</span>
          <span className="memorial-seventeen" aria-hidden="true">
            17
          </span>
          <h2>O legado vive.</h2>
          <p>
            Nas palavras que confortam.
            <br />
            Nas canções que encontram a gente.
            <br />
            Na memória de quem continua ouvindo.
          </p>
          <span className="impact-signature">
            LONG LIVE JAHSEH / 1998 — 2018
          </span>
        </div>
      </section>
      <ArchiveQuote placement="believe">I believe in you all.</ArchiveQuote>
      <footer className="memorial-end">
        <span>SONARA ECLIPSE / LEGACY</span>
        <a href={`${import.meta.env.BASE_URL}credits.html`}>
          CRÉDITOS & FONTES ↗
        </a>
      </footer>
      <section className="legacy-dedication" aria-labelledby="dedication-title">
        <span className="archive-label">DE RICK_DEV, PARA JAHSEH</span>
        <span className="dedication-seventeen" aria-hidden="true">17</span>
        <h2 id="dedication-title">O que o X representa pra mim.</h2>
        <blockquote>
          <p>Pra mim o X foi Alguém muito especial pra minha vida como pessoa e extremamente como artista suas músicas suas frases motivacionais a forma como ele tratava seus fãs me fez sentir admiração pelo artista que ele foi e ainda é alguém tão grande como ele nunca vai morrer em nossos corações</p>
          <p>Ele merece essa página só pra ele isso é um pouquinho por tudo aquilo que ele fez na minha vida</p>
          <p className="dedication-long-live">“LLJ”🥀🖤🥀🖤 LONG LIVE X você sempre estará vivo em nossos corações 🖤🖤</p>
          <p className="dedication-dates">23/01/98&nbsp; 18/06/18 <span>🕊️ 🕊️ 🖤🖤</span></p>
        </blockquote>
      </section>
    </article>
  );
}
