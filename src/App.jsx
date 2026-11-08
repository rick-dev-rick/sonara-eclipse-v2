import Hero from "./Hero.jsx";
import {
  trackId,
  migrateFavorites,
  queueWithTrack,
  favoriteLabel,
} from "./catalog.js";
import Art from "./Art.jsx";
import Legacy from "./Legacy.jsx";
import Player from "./Player.jsx";
import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import {
  House,
  Compass,
  Library,
  Disc3,
  UserRound,
  Heart,
  ListMusic,
  Search,
  ChevronRight,
  Play,
  Shuffle,
  Plus,
  Music2,
  Clock3,
  Menu,
  X,
  CalendarDays,
  Tag,
  Bell,
  ChevronDown,
  Moon,
  Headphones,
} from "lucide-react";
import { demoTracks, xTracks, matueTracks, albums } from "./data.js";
const NAV = [
  ["Início", House],
  ["Explorar", Compass],
  ["Biblioteca", Library],
  ["Álbuns", Disc3],
  ["Artistas", UserRound],
  ["Favoritos", Heart],
  ["Playlists", ListMusic],
];
const remembered = (name, initial) => {
  try {
    return JSON.parse(localStorage.getItem(name)) ?? initial;
  } catch {
    return initial;
  }
};
function Brand() {
  return (
    <div className="brand">
      <img
        className="brand-symbol"
        src={`${import.meta.env.BASE_URL}assets/brand-s.webp`}
        alt=""
      />
      <Moon className="brand-crescent" size={31} />
      <div className="brand-words">
        <strong>SONARA</strong>
        <span>ECLIPSE</span>
      </div>
    </div>
  );
}
function Label({ children }) {
  return (
    <div className="eyebrow">
      <span /> {children}
    </div>
  );
}
function PaneTitle({ children, action, onClick }) {
  return (
    <div className="pane-title">
      <h2>{children}</h2>
      {action && (
        <button onClick={onClick}>
          {action} <span>→</span>
        </button>
      )}
    </div>
  );
}
function IconButton({ Icon, active = false, onClick, title, fill = false }) {
  return (
    <button
      title={title || ""}
      aria-label={title || ""}
      className={"icon-button " + (active ? "red" : "")}
      onClick={onClick}
    >
      <Icon size={19} fill={fill ? "currentColor" : "none"} />
    </button>
  );
}
function StatCard({ title, children }) {
  return (
    <section className="aside-panel">
      <h3 className="aside-title">{title}</h3>
      {children}
    </section>
  );
}
export default function App() {
  const initialRoute = () => {
    try {
      return decodeURIComponent(location.hash.slice(1)).split("/");
    } catch {
      return ["Início"];
    }
  };
  const [page, setPage] = useState(() => initialRoute()[0] || "Início"),
    [search, setSearch] = useState(""),
    [selectedAlbum, setSelectedAlbum] = useState(
      () => initialRoute()[1] || "Máquina do Tempo",
    ),
    [selectedArtist, setSelectedArtist] = useState(
      () => initialRoute()[1] || "XXXTENTACION",
    ),
    [mobileNav, setMobileNav] = useState(false);
  const navRef = useRef(null);
  useEffect(() => {
    if (!mobileNav) return;
    const previous = document.activeElement,
      old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const links = () =>
      [...navRef.current.querySelectorAll("button,a")].filter(
        (n) => !n.disabled,
      );
    links()[0]?.focus();
    const trap = (e) => {
      if (e.key !== "Tab") return;
      const a = links(),
        first = a[0],
        last = a[a.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", trap);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener("keydown", trap);
      previous?.focus();
    };
  }, [mobileNav]);
  const [favorites, setFavorites] = useState(() =>
    migrateFavorites(
      Array.isArray(remembered("sonara-v2-faves", []))
        ? remembered("sonara-v2-faves", [])
        : [],
    ),
  );
  const [albumCatalog, setAlbumCatalog] = useState({});
  useEffect(() => {
    let cancelled = false;
    fetch(`${import.meta.env.BASE_URL}album-tracklists.json`)
      .then((r) => (r.ok ? r.json() : {}))
      .then((j) => {
        if (!cancelled) setAlbumCatalog(j || {});
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const [playlists] = useState([
    {
      name: "XXXTENTACION",
      ids: [],
      art: "artist-x",
      note: "Discografia de Jahseh · catálogo em expansão",
    },
    {
      name: "Trap BR — 30PRAUM",
      ids: [],
      art: "artist-trio",
      note: "Matuê, Teto e WIU · catálogo em expansão",
    },
  ]);
  const [playlistSelected, setPlaylistSelected] = useState(0);
  const [currentTrack, setCurrentTrack] = useState({
      ...demoTracks[0],
      id: trackId(demoTracks[0]),
    }),
    [currentQueue, setCurrentQueue] = useState(
      demoTracks.map((t) => ({ ...t, id: trackId(t) })),
    );

  useEffect(() => {
    try {
      localStorage.setItem("sonara-v2-faves", JSON.stringify(favorites));
    } catch {
      /* In-memory favourites remain usable if browser storage is unavailable. */
    }
  }, [favorites]);
  // O player mantém a identidade visual, sem áudio fictício ou reprodução comercial.
  const navigate = (p, detail) => {
    setPage(p);
    setMobileNav(false);
    const hash =
      encodeURIComponent(p) + (detail ? "/" + encodeURIComponent(detail) : "");
    if (location.hash.slice(1) !== hash) location.hash = hash;
  };
  useEffect(() => {
    const route = () => {
      const [p, d] = initialRoute();
      setPage(p || "Início");
      if (p === "Detalhe Álbum" && d) setSelectedAlbum(d);
      if (p === "Detalhe Artista" && d) setSelectedArtist(d);
      setMobileNav(false);
    };
    window.addEventListener("hashchange", route);
    return () => window.removeEventListener("hashchange", route);
  }, []);
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.title =
      page === "Início" ? "SONARA Eclipse" : page + " · SONARA Eclipse";
  }, [page, selectedAlbum, selectedArtist]);
  useEffect(() => {
    const escape = (e) => {
      if (e.key === "Escape") setMobileNav(false);
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, []);
  const chooseAlbum = (a) => {
    setSelectedAlbum(a);
    navigate("Detalhe Álbum", a);
  };
  const chooseArtist = (a) => {
    setSelectedArtist(a);
    navigate("Detalhe Artista", a);
  };
  const selectTrack = (t, artist = selectedArtist) => {
    const normalized = { ...t, artist: t.artist || artist };
    const queue = queueWithTrack(normalized, demoTracks);
    setCurrentTrack(queue[0]);
    setCurrentQueue(queue);
  };
  const toggleLike = (id) =>
    setFavorites((s) =>
      s.includes(id) ? s.filter((t) => t !== id) : [...s, id],
    );
  const showDemo = () =>
    selectTrack(
      selectedArtist === "XXXTENTACION"
        ? { ...xTracks[0], artist: "XXXTENTACION" }
        : selectedArtist === "Matuê"
          ? { ...matueTracks[0], artist: "Matuê" }
          : demoTracks.find((t) => t.artist === selectedArtist),
    );
  const tile = (
    title,
    type,
    artist = "SONARA Sessions",
    onClick = () => chooseAlbum(title),
  ) => (
    <button key={title} className="record" onClick={onClick}>
      <Art type={type} />
      <span className="record-play">
        <Play size={16} fill="currentColor" />
      </span>
      <b>{title}</b>
      <small>{artist}</small>
    </button>
  );
  const albumTile = (a) =>
    tile(a.title, a.art, a.artist, () => chooseAlbum(a.title));
  const tableX = (items = xTracks) => (
    <div className="music-table">
      <div className="music-table-header">
        <span>#</span>
        <span>Título</span>
        <span>Reproduções</span>
        <Clock3 size={16} />
        <span />
      </div>
      {items.map((t, i) => (
        <div className="music-row" key={t.id || t.title}>
          <button
            className="track-num"
            onClick={() => selectTrack(t)}
            aria-label={"Selecionar " + t.title}
          >
            {i + 1}
          </button>
          <button className="row-track" onClick={() => selectTrack(t)}>
            <Art type={t.cover || "three"} />
            <strong>{t.title}</strong>
            <small className="explicit">E</small>
          </button>
          <span className="plays">{t.plays || "—"}</span>
          <span className="duration">{t.length}</span>
          <IconButton
            Icon={Heart}
            title="Favoritar faixa"
            active={favorites.includes(
              trackId({ ...t, artist: t.artist || selectedArtist }),
            )}
            fill={favorites.includes(
              trackId({ ...t, artist: t.artist || selectedArtist }),
            )}
            onClick={() =>
              toggleLike(trackId({ ...t, artist: t.artist || selectedArtist }))
            }
          />
        </div>
      ))}
    </div>
  );
  const pageHome = (
    <>
      <Hero kind="home" artist="Matuê">
        <div className="hero-copy">
          <Label>SONARA EXCLUSIVE</Label>
          <h1>Trap BR</h1>
          <p>
            O universo de Matuê, Teto e WIU.
            <br />
            Encontre a sua próxima descoberta.
          </p>
          <button
            className="primary"
            onClick={() => {
              setPlaylistSelected(1);
              navigate("Playlists");
            }}
          >
            <Play size={17} fill="currentColor" />
            Explorar coleção
          </button>
        </div>
        <span className="cinematic-edition">CURADORIA SONARA / VOL. 02</span>
      </Hero>
      <PaneTitle action="Ver discografia" onClick={() => navigate("Álbuns")}>
        Álbuns em destaque
      </PaneTitle>
      <div className="recent-grid home-records">
        {[albums[6], albums[7], albums[0], albums[1], albums[11]].map(
          albumTile,
        )}
      </div>
      <PaneTitle action="Ver artistas" onClick={() => navigate("Artistas")}>
        Em destaque
      </PaneTitle>
      <div className="recent-grid featured-artists">
        {[
          ["XXXTENTACION", "artist-x", "LEGACY"],
          ["Matuê", "artist-matue", "30PRAUM"],
          ["Teto", "artist-teto", "30PRAUM"],
          ["WIU", "artist-wiu", "30PRAUM"],
        ].map(([name, type, label]) => (
          <button
            className="record"
            key={name}
            onClick={() => chooseArtist(name)}
          >
            <Art type={type} />
            <b>{name}</b>
            <small>{label}</small>
            <span className="record-play">
              <ChevronRight size={17} />
            </span>
          </button>
        ))}
      </div>
      <PaneTitle action="Ver todas" onClick={() => navigate("Playlists")}>
        Coleções em destaque
      </PaneTitle>
      <div className="home-collections">
        {playlists.map((l, i) => (
          <button
            key={l.name}
            className="home-collection"
            onClick={() => {
              setPlaylistSelected(i);
              navigate("Playlists");
            }}
          >
            <Art type={l.art} />
            <span>
              <small>{i === 0 ? "SONARA · LEGACY" : "SONARA · 30PRAUM"}</small>
              <strong>{l.name}</strong>
              <span>
                {i === 0 ? "O legado musical de Jahseh." : "Matuê, Teto e WIU."}
              </span>
            </span>
            <ChevronRight size={20} />
          </button>
        ))}
      </div>
      <button className="home-legacy" onClick={() => navigate("LEGACY")}>
        <Art type="artist-x" />
        <span>
          <strong>FOREVER JAHSEH</strong>
          <small>Uma homenagem especial. The Music Lives On.</small>
        </span>
        <ChevronRight size={20} />
      </button>
    </>
  );
  const pageArtist = (
    <div className="artist-page">
      <Hero artist={selectedArtist}>
        <div className="hero-copy">
          <Label>Artista</Label>
          <h1>{selectedArtist}</h1>
          <p>
            {selectedArtist === "XXXTENTACION"
              ? "Artista que transformou dor, solidão e reflexão em música, marcando uma geração com sua autenticidade e vulnerabilidade."
              : "Trap brasileiro, identidade sonora marcante e uma trajetória de grandes lançamentos."}
          </p>
          <div className="hero-actions">
            <button className="primary" onClick={showDemo}>
              <Play size={18} fill="currentColor" /> Selecionar faixa
            </button>
            <button
              className="outline"
              onClick={() => toggleLike(selectedArtist)}
            >
              {favorites.includes(selectedArtist) ? "Seguindo" : "Seguir"}
            </button>
            <IconButton
              Icon={Heart}
              title="Favoritar artista"
              active={favorites.includes(selectedArtist)}
              onClick={() => toggleLike(selectedArtist)}
            />
          </div>
        </div>
      </Hero>
      <PaneTitle action="Ver todas" onClick={() => navigate("Biblioteca")}>
        Músicas populares
      </PaneTitle>
      {selectedArtist === "XXXTENTACION" ? (
        tableX(xTracks.slice(0, 3))
      ) : selectedArtist === "Matuê" ? (
        tableX(matueTracks.slice(0, 3))
      ) : (
        <div className="playlist-disclaimer">
          O catálogo de {selectedArtist} será incorporado após a conferência das
          faixas. A playlist Trap BR já está disponível.
        </div>
      )}
      <PaneTitle action="Ver discografia" onClick={() => navigate("Álbuns")}>
        Álbuns em destaque
      </PaneTitle>
      <div className="album-strips">
        {albums
          .filter((album) => album.artist === selectedArtist)
          .slice(0, 3)
          .map((a) => (
            <button
              className="album-strip"
              key={a.title}
              onClick={() => chooseAlbum(a.title)}
            >
              <Art type={a.art} />
              <span>
                <b>{a.title}</b>
                <small>{a.artist}</small>
                <small>{a.year} · Álbum</small>
              </span>
              <span className="record-play">
                <Play size={15} fill="currentColor" />
              </span>
            </button>
          ))}
      </div>
      <PaneTitle action="Ver álbuns" onClick={() => navigate("Álbuns")}>
        Outros projetos de {selectedArtist}
      </PaneTitle>
      <div className="recent-grid artist-discography">
        {albums
          .filter((album) => album.artist === selectedArtist)
          .slice(0, 4)
          .map(albumTile)}
      </div>
    </div>
  );
  const a = albums.find((v) => v.title === selectedAlbum) || {
    title: selectedAlbum,
    artist: "SONARA Sessions",
    year: "2026",
    art: "dark",
  };
  const albumEntry = albumCatalog[a.art];
  const albumTracks = albumEntry?.tracks?.length
    ? albumEntry.tracks
    : (a.tracks || []).map((title) => ({
        title,
        duration: null,
        number: null,
      }));
  const albumVerified = !!albumEntry?.complete;
  const pageAlbum = (
    <>
      <Hero kind="album" artist={a.artist}>
        <div className="album-cover">
          <Art type={a.art} />
        </div>
        <div className="album-description">
          <Label>{a.kind || "Álbum"} · SONARA DISCOGRAPHY</Label>
          <h1>{a.title}</h1>
          <button
            className="album-artist-link"
            onClick={() => chooseArtist(a.artist)}
          >
            {a.artist} <ChevronRight size={16} />
          </button>
          <div className="album-stats">
            {a.year} <span>·</span> {a.kind || "Álbum"} <span>·</span>{" "}
            {albumTracks.length
              ? albumTracks.length +
                (albumVerified ? " faixas" : " faixas catalogadas até agora")
              : "Faixas em catalogação"}
          </div>
          <p>{a.desc}</p>
          <div className="hero-actions">
            <button
              className="primary"
              onClick={() => {
                if (a.artist === "XXXTENTACION") {
                  setPlaylistSelected(0);
                } else {
                  setPlaylistSelected(1);
                }
                navigate("Playlists");
              }}
            >
              <ListMusic size={18} /> Ver na playlist
            </button>
            <IconButton
              Icon={Heart}
              title="Favoritar álbum"
              active={favorites.includes(a.title)}
              fill={favorites.includes(a.title)}
              onClick={() => toggleLike(a.title)}
            />
          </div>
        </div>
      </Hero>
      <div className="album-track-panel sonara-album-table">
        <div className="album-track-header">
          <span>#</span>
          <span>Título</span>
          <span>Álbum</span>
          <Clock3 size={16} />
          <span />
        </div>
        {albumTracks.length ? (
          <div className="album-track-list">
            {albumTracks.map((track, i) => (
              <div className="album-track-item" key={track.title + "-" + i}>
                <span className="album-track-index">
                  {String(track.number || i + 1).padStart(2, "0")}
                </span>
                <span className="album-track-name">
                  <strong>{track.title}</strong>
                  <small className="track-artist">{a.artist}</small>
                </span>
                <span className="album-row-album">{a.title}</span>
                <span className="album-row-time">{track.duration || "—"}</span>
                <button
                  title="Favoritar faixa"
                  className={
                    favorites.includes(
                      trackId({ title: track.title, artist: a.artist }),
                    )
                      ? "favored"
                      : ""
                  }
                  onClick={() =>
                    toggleLike(
                      trackId({ title: track.title, artist: a.artist }),
                    )
                  }
                >
                  <Heart
                    size={18}
                    fill={
                      favorites.includes(
                        trackId({ title: track.title, artist: a.artist }),
                      )
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="album-empty">
            <Disc3 size={29} />
            <strong>Repertório em catalogação</strong>
            <p>As músicas deste projeto serão adicionadas após conferência.</p>
          </div>
        )}
      </div>
      <div className="album-note">
        {albumVerified
          ? "Lista de faixas do lançamento consultada em " +
            albumEntry.source +
            "."
          : "Catálogo em expansão: a lista ainda pode estar incompleta."}{" "}
        A SONARA não hospeda gravações comerciais.
      </div>
    </>
  );
  const pageLegacy = (
    <Legacy
      favorites={favorites}
      toggleLike={toggleLike}
      chooseAlbum={chooseAlbum}
      chooseArtist={chooseArtist}
    />
  );
  const pageExplore = (
    <>
      <div className="page-heading">
        <Label>SONARA ECLIPSE · DESCUBRA</Label>
        <h1>Explorar</h1>
        <p>O universo de XXXTENTACION e dos artistas da 30PRAUM.</p>
      </div>
      <PaneTitle>Artistas</PaneTitle>
      <div className="recent-grid featured-artists">
        {[
          ["XXXTENTACION", "artist-x"],
          ["Matuê", "artist-matue"],
          ["Teto", "artist-teto"],
          ["WIU", "artist-wiu"],
        ].map(([name, type]) => (
          <button
            className="record"
            key={name}
            onClick={() => chooseArtist(name)}
          >
            <Art type={type} />
            <b>{name}</b>
            <small>{name === "XXXTENTACION" ? "LEGACY" : "30PRAUM"}</small>
          </button>
        ))}
      </div>
      <PaneTitle>Playlists em destaque</PaneTitle>
      <div className="home-collections">
        {playlists.map((l, i) => (
          <button
            className="home-collection"
            key={l.name}
            onClick={() => {
              setPlaylistSelected(i);
              navigate("Playlists");
            }}
          >
            <Art type={l.art} />
            <span>
              <small>{i === 0 ? "JAHSEH" : "30PRAUM"}</small>
              <strong>{l.name}</strong>
              <span>{l.note}</span>
            </span>
            <ChevronRight size={20} />
          </button>
        ))}
      </div>
      <PaneTitle>Álbuns</PaneTitle>
      <div className="recent-grid">
        {albums
          .filter((a) => a.artist === "XXXTENTACION" || a.artist === "Matuê")
          .slice(0, 5)
          .map(albumTile)}
      </div>
    </>
  );
  const pageLibrary = (
    <>
      <div className="page-heading">
        <Label>SUA COLEÇÃO</Label>
        <h1>Biblioteca</h1>
        <p>Suas músicas, playlists e descobertas em um só lugar.</p>
      </div>
      <div className="library-stats">
        {[
          [albums.length, "Álbuns catalogados"],
          [favorites.length, "Favoritos"],
          [playlists.length, "Playlists"],
        ].map(([v, l]) => (
          <div key={l}>
            <strong>{v}</strong>
            <small>{l}</small>
          </div>
        ))}
      </div>
      <PaneTitle>Suas playlists</PaneTitle>
      <div className="personal-playlists library-playlists">
        {playlists.map((l, i) => (
          <button
            className="personal-playlist"
            key={l.name}
            onClick={() => {
              setPlaylistSelected(i);
              navigate("Playlists");
            }}
          >
            <Art type={l.art} />
            <span className="personal-playlist-info">
              <small>{i === 0 ? "LEGADO · JAHSEH" : "TRAP BR · 30PRAUM"}</small>
              <strong>{l.name}</strong>
              <span>{l.note}</span>
            </span>
            <ChevronRight size={19} />
          </button>
        ))}
      </div>
    </>
  );
  const pageAlbums = (
    <>
      <div className="page-heading discography-heading">
        <Label>SONARA ECLIPSE · DISCOGRAFIA</Label>
        <h1>Álbuns & projetos</h1>
        <p>Quatro artistas. Histórias diferentes. Um universo musical.</p>
        <div className="discography-count">
          <Disc3 size={17} /> {albums.length} lançamentos catalogados
        </div>
      </div>
      {["XXXTENTACION", "Matuê", "Teto", "WIU"].map((artist) => (
        <section className="discography-section" key={artist}>
          <div className="discography-section-title">
            <div>
              <span className="discography-number">
                0{["XXXTENTACION", "Matuê", "Teto", "WIU"].indexOf(artist) + 1}
              </span>
              <h2>{artist}</h2>
            </div>
            <small>
              {albums.filter((a) => a.artist === artist).length} projetos
            </small>
          </div>
          <div className="album-gallery">
            {albums.filter((a) => a.artist === artist).map(albumTile)}
          </div>
        </section>
      ))}
    </>
  );
  const pageArtists = (
    <>
      <div className="page-heading">
        <Label>QUEM FAZ A MÚSICA</Label>
        <h1>Artistas</h1>
        <p>Conheça os artistas em destaque na SONARA.</p>
      </div>
      <div className="recent-grid featured-artists">
        {[
          ["XXXTENTACION", "artist-x"],
          ["Matuê", "artist-matue"],
          ["Teto", "artist-teto"],
          ["WIU", "artist-wiu"],
        ].map(([name, type]) => (
          <button
            className="record"
            key={name}
            onClick={() => chooseArtist(name)}
          >
            <Art type={type} />
            <b>{name}</b>
            <small>{name === "XXXTENTACION" ? "LEGACY" : "30PRAUM"}</small>
          </button>
        ))}
      </div>
      <PaneTitle>Homenagem especial</PaneTitle>
      <button className="legacy-invite" onClick={() => navigate("LEGACY")}>
        <strong>LEGACY — The Music Lives On.</strong>
        <span>Conhecer FOREVER JAHSEH →</span>
      </button>
    </>
  );
  const pageFavorites = (
    <>
      <div className="page-heading">
        <Label>SUAS ESCOLHAS</Label>
        <h1>Favoritos</h1>
        <p>Tudo aquilo que merece ficar com você.</p>
      </div>
      <PaneTitle>Salvos na SONARA</PaneTitle>
      {favorites.length ? (
        <div className="favorites-stack">
          {favorites.map((id) => (
            <div key={id}>
              <Heart size={18} fill="#ff0000" color="#ff0000" />
              <strong>{favoriteLabel(id)}</strong>
              <button onClick={() => toggleLike(id)}>Remover</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Heart size={36} />
          <h3>Seu universo começa aqui</h3>
          <p>Favorite músicas, álbuns e artistas para encontrá-los depois.</p>
        </div>
      )}
    </>
  );
  const pagePlaylists = (
    <>
      <div className="page-heading">
        <Label>SUAS PLAYLISTS · SONARA ECLIPSE</Label>
        <h1>Minhas Playlists</h1>
        <p>Duas coleções pessoais. Mais playlists só quando fizer sentido.</p>
      </div>
      <div className="personal-playlists">
        {playlists.map((l, i) => (
          <button
            className={
              "personal-playlist " + (playlistSelected === i ? "selected" : "")
            }
            key={l.name}
            onClick={() => setPlaylistSelected(i)}
          >
            <Art type={l.art} />
            <span className="personal-playlist-info">
              <small>
                {i === 0 ? "LEGADO · JAHSEH" : "TRAP NACIONAL · 30PRAUM"}
              </small>
              <strong>{l.name}</strong>
              <span>{l.note}</span>
            </span>
            <ChevronRight size={21} />
          </button>
        ))}
      </div>
      {playlistSelected === 0 ? (
        <div className="playlist-detail">
          <div className="playlist-heading">
            <Label>DISCOGRAFIA · XXXTENTACION</Label>
            <h2>XXXTENTACION</h2>
            <p>
              Uma coleção dedicada à obra de Jahseh. A meta é catalogar todas as
              faixas, incluindo álbuns, singles e participações. O catálogo
              completo e o streaming autorizado serão integrados em etapas.
            </p>
            <button
              className="playlist-legacy-link"
              onClick={() => navigate("LEGACY")}
            >
              <Heart size={17} /> Conhecer FOREVER JAHSEH na LEGACY{" "}
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="playlist-artists">
            <div>
              <Art type="artist-x" />
              <span>
                <strong>XXXTENTACION</strong>
                <small>Artista da coleção · catálogo em expansão</small>
              </span>
            </div>
          </div>
          <div className="playlist-song-section">
            <h3>Faixas em destaque</h3>
            <span>Discografia catalogada · sem reprodução comercial</span>
            <div className="playlist-song-list">
              {(albums
                .filter((v) => v.artist === "XXXTENTACION")
                .flatMap((v) =>
                  (albumCatalog[v.art]?.tracks || []).map((t) => ({
                    ...t,
                    cover: v.art,
                    album: v.title,
                  })),
                ).length
                ? albums
                    .filter((v) => v.artist === "XXXTENTACION")
                    .flatMap((v) =>
                      (albumCatalog[v.art]?.tracks || []).map((t) => ({
                        ...t,
                        cover: v.art,
                        album: v.title,
                      })),
                    )
                : xTracks
              ).map((t, i) => (
                <div className="playlist-song-row" key={t.title + "-" + i}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <Art type={t.cover || "album-17"} />
                  <div>
                    <strong>{t.title}</strong>
                    <small>{t.album || "XXXTENTACION"}</small>
                  </div>
                  {(t.duration || t.length) && (
                    <em>{t.duration || t.length}</em>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="playlist-detail">
          <div className="playlist-heading">
            <Label>TRAP BR · 30PRAUM</Label>
            <h2>Matuê · Teto · WIU</h2>
            <p>
              Uma coleção para reunir as discografias dos três artistas,
              incluindo álbuns, singles e participações. Vamos ampliar e
              conferir o catálogo antes de marcar a playlist como completa.
            </p>
          </div>
          <div className="playlist-artists">
            {["Matuê", "Teto", "WIU"].map((name, i) => (
              <div key={name}>
                <Art
                  type={
                    name === "Matuê"
                      ? "artist-matue"
                      : name === "Teto"
                        ? "artist-teto"
                        : "artist-wiu"
                  }
                />
                <span>
                  <strong>{name}</strong>
                  <small>30PRAUM · catálogo em expansão</small>
                </span>
              </div>
            ))}
          </div>
          <div className="playlist-song-section">
            <h3>Faixas em destaque</h3>
            <span>Discografias · Matuê, Teto e WIU</span>
            <div className="playlist-song-list">
              {(albums
                .filter((v) => ["Matuê", "Teto", "WIU"].includes(v.artist))
                .flatMap((v) =>
                  (albumCatalog[v.art]?.tracks || []).map((t) => ({
                    ...t,
                    cover: v.art,
                    artist: v.artist,
                  })),
                ).length
                ? albums
                    .filter((v) => ["Matuê", "Teto", "WIU"].includes(v.artist))
                    .flatMap((v) =>
                      (albumCatalog[v.art]?.tracks || []).map((t) => ({
                        ...t,
                        cover: v.art,
                        artist: v.artist,
                      })),
                    )
                : matueTracks.map((t) => ({ ...t, artist: "Matuê" }))
              ).map((t, i) => (
                <div className="playlist-song-row" key={t.title + "-" + i}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <Art type={t.cover || "album-maquina"} />
                  <div>
                    <strong>{t.title}</strong>
                    <small>{t.artist}</small>
                  </div>
                  {(t.duration || t.length) && (
                    <em>{t.duration || t.length}</em>
                  )}
                </div>
              ))}
            </div>
            <p className="playlist-catalogue-note">
              Músicas organizadas por lançamento e artista. Álbuns não
              encontrados nos catálogos continuam em conferência.
            </p>
          </div>
        </div>
      )}
      <p className="playlist-disclaimer">
        As coleções representam os artistas e o repertório planejado. A
        reprodução de gravações comerciais depende de integrações licenciadas.
      </p>
    </>
  );
  const normal = (s) =>
    String(s)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const matches = (s) => normal(s).includes(normal(search.trim()));
  const results = albums.filter((a) =>
    matches([a.title, a.artist, a.year].join(" ")),
  );
  const searchArtists = ["XXXTENTACION", "Matuê", "Teto", "WIU"].filter(
    matches,
  );
  const searchTracks = albums
    .flatMap((a) =>
      (albumCatalog[a.art]?.tracks?.length
        ? albumCatalog[a.art].tracks
        : (a.tracks || []).map((title) => ({ title }))
      )
        .filter((t) => matches(t.title))
        .map((t) => ({
          ...t,
          artist: a.artist,
          cover: a.art,
          art: a.art,
          length: t.duration || "—",
          id: a.title + "|" + t.title,
          album: a.title,
        })),
    )
    .filter(
      (t, i, all) => all.findIndex((x) => trackId(x) === trackId(t)) === i,
    );
  const pageSearch = (
    <>
      <div className="page-heading">
        <Label>RESULTADOS DA BUSCA</Label>
        <h1>Buscar</h1>
        <p>
          {search
            ? "Resultados para “" + search + "”"
            : "Pesquise músicas, álbuns e artistas."}
        </p>
      </div>
      {searchArtists.length > 0 && (
        <>
          <PaneTitle>Artistas</PaneTitle>
          <div className="search-artists">
            {searchArtists.map((name) => (
              <button
                className="outline"
                key={name}
                onClick={() => chooseArtist(name)}
              >
                {name}
                <ChevronRight size={14} />
              </button>
            ))}
          </div>
        </>
      )}
      {results.length > 0 && (
        <>
          <PaneTitle>Álbuns</PaneTitle>
          <div className="album-gallery">{results.map(albumTile)}</div>
        </>
      )}
      {search.trim() && searchTracks.length > 0 && (
        <>
          <PaneTitle>Músicas</PaneTitle>
          {tableX(searchTracks)}
        </>
      )}
      {!results.length && !searchArtists.length && !searchTracks.length && (
        <div className="empty-state">Nenhum resultado encontrado.</div>
      )}
    </>
  );
  let main =
    {
      Início: pageHome,
      Explorar: pageExplore,
      Biblioteca: pageLibrary,
      Álbuns: pageAlbums,
      Artistas: pageArtists,
      Favoritos: pageFavorites,
      Playlists: pagePlaylists,
      "Detalhe Álbum": pageAlbum,
      "Detalhe Artista": pageArtist,
      LEGACY: pageLegacy,
      Buscar: pageSearch,
    }[page] || pageHome;
  const isArtist = page === "Detalhe Artista",
    isAlbum = page === "Detalhe Álbum";
  const sidebarRight = isArtist ? (
    <>
      <StatCard title="Sobre o artista">
        <p>
          {selectedArtist === "XXXTENTACION"
            ? "XXXTENTACION foi um artista e compositor cuja obra marcou uma geração pela mistura de rap, rock e R&B e pela intensidade emocional."
            : selectedArtist === "Matuê"
              ? "Matuê é um artista brasileiro de trap, conhecido por sua sonoridade e estética marcantes."
              : selectedArtist +
                " integra o universo do trap brasileiro e da 30PRAUM."}
        </p>
        <div className="facts">
          <span>
            <CalendarDays size={16} />{" "}
            {selectedArtist === "XXXTENTACION"
              ? "Nascimento: 23 jan. 1998"
              : "Artista brasileiro"}
          </span>
          <span>
            <Music2 size={16} /> Gêneros: Rap, Hip-hop
          </span>
          <span>
            <Tag size={16} /> Perfil demonstrativo
          </span>
        </div>
      </StatCard>
      <StatCard title="O universo do artista">
        <div className="metric">
          <strong>
            <Headphones size={28} />
          </strong>
          <span>Conheça os álbuns e as histórias de {selectedArtist}.</span>
        </div>
      </StatCard>
      <StatCard title="Artistas relacionados">
        <div className="relation-list">
          {["XXXTENTACION", "Matuê", "Teto", "WIU"]
            .filter((name) => name !== selectedArtist)
            .map((name) => (
              <button
                className="home-related-artist"
                key={name}
                onClick={() => chooseArtist(name)}
              >
                <Art
                  type={
                    name === "XXXTENTACION"
                      ? "artist-x"
                      : name === "Matuê"
                        ? "artist-matue"
                        : name === "Teto"
                          ? "artist-teto"
                          : "artist-wiu"
                  }
                />
                <span>
                  <strong>{name}</strong>
                  <small>
                    {name === "XXXTENTACION" ? "LEGACY" : "30PRAUM"}
                  </small>
                </span>
                <ChevronRight size={15} />
              </button>
            ))}
        </div>
      </StatCard>
    </>
  ) : isAlbum ? (
    <>
      <StatCard title="Sobre o álbum">
        <div className="facts">
          <span>
            <CalendarDays size={16} /> Lançamento: {a.year}
          </span>
          <span>
            <Disc3 size={16} /> Tipo: {a.kind || "Álbum"}
          </span>
          <span>
            <Music2 size={16} />{" "}
            {a.tracks?.length
              ? a.tracks.length + " faixas na prévia"
              : "Repertório em catalogação"}
          </span>
          <span>
            <Tag size={16} />{" "}
            {a.artist === "XXXTENTACION"
              ? "Hip-hop / Emo Rap"
              : "Trap brasileiro"}
          </span>
        </div>
      </StatCard>
      <StatCard title={"Mais de " + a.artist}>
        <div className="side-album-grid">
          {albums
            .filter((v) => v.artist === a.artist && v.title !== a.title)
            .slice(0, 3)
            .map((v) => (
              <button onClick={() => chooseAlbum(v.title)} key={v.title}>
                <Art type={v.art} />
                <b>{v.title}</b>
                <small>{v.year}</small>
              </button>
            ))}
        </div>
      </StatCard>
      <StatCard title="Outros lançamentos">
        <div className="side-album-grid">
          {albums
            .filter((v) => v.artist !== a.artist)
            .slice(0, 3)
            .map((v) => (
              <button onClick={() => chooseAlbum(v.title)} key={v.title}>
                <Art type={v.art} />
                <b>{v.title}</b>
                <small>{v.artist}</small>
              </button>
            ))}
        </div>
      </StatCard>
    </>
  ) : page === "Início" ? (
    <>
      <StatCard title="ARTISTAS EM DESTAQUE">
        <div className="relation-list">
          {[
            ["XXXTENTACION", "artist-x"],
            ["Matuê", "artist-matue"],
            ["Teto", "artist-teto"],
            ["WIU", "artist-wiu"],
          ].map(([name, type]) => (
            <button
              className="home-related-artist"
              key={name}
              onClick={() => chooseArtist(name)}
            >
              <Art type={type} />
              <span>
                <strong>{name}</strong>
                <small>{name === "XXXTENTACION" ? "LEGACY" : "30PRAUM"}</small>
              </span>
              <ChevronRight size={16} />
            </button>
          ))}
        </div>
      </StatCard>
      <StatCard title="LEGACY · FOREVER JAHSEH">
        <button className="legacy-aside" onClick={() => navigate("LEGACY")}>
          <Art type="artist-x" />
          <span>
            <b>The Music Lives On.</b>
            <small>Homenagem especial ao Jahseh</small>
          </span>
          <ChevronRight size={17} />
        </button>
      </StatCard>
      <StatCard title="SELEÇÃO SONARA">
        <div className="editorial-picks">
          {[albums[0], albums[7], albums[3]].map((v) => (
            <button key={v.title} onClick={() => chooseAlbum(v.title)}>
              <Art type={v.art} />
              <span>
                <strong>{v.title}</strong>
                <small>{v.artist}</small>
              </span>
              <ChevronRight size={16} />
            </button>
          ))}
        </div>
      </StatCard>
    </>
  ) : (
    <>
      <StatCard title="SONARA EXCLUSIVE">
        <Art className="aside-feature" type="dark" />
        <strong className="side-feature-name">Sua música, seu universo.</strong>
        <p>Explore, salve e organize tudo o que inspira você.</p>
      </StatCard>
      <StatCard title="LEGACY">
        <button className="legacy-aside" onClick={() => navigate("LEGACY")}>
          <Art type="x" />
          <span>
            <b>FOREVER JAHSEH</b>
            <small>The Music Lives On.</small>
          </span>
          <ChevronRight size={17} />
        </button>
      </StatCard>
    </>
  );
  return (
    <div className={"app-shell " + (page === "LEGACY" ? "legacy17-mode" : "")}>
      <aside
        ref={navRef}
        role={mobileNav ? "dialog" : undefined}
        aria-modal={mobileNav ? true : undefined}
        aria-label="Navegação SONARA"
        className={"nav-sidebar " + (mobileNav ? "open" : "")}
      >
        <div className="brand-area">
          <Brand />
          <button
            className="mobile-x"
            aria-label="Fechar navegação"
            onClick={() => setMobileNav(false)}
          >
            <X />
          </button>
        </div>
        <div className="navigation">
          {NAV.map(([name, Icon]) => (
            <button
              key={name}
              className={
                page === name ||
                (page === "Detalhe Álbum" && name === "Álbuns") ||
                (page === "Detalhe Artista" && name === "Artistas")
                  ? "active"
                  : ""
              }
              onClick={() => navigate(name)}
            >
              <Icon size={23} strokeWidth={1.8} />
              <span>{name}</span>
            </button>
          ))}
        </div>
        <button
          className={"legacy-spotlight " + (page === "LEGACY" ? "active" : "")}
          onClick={() => navigate("LEGACY")}
          aria-label="Abrir LEGACY — FOREVER JAHSEH"
        >
          <Art type="artist-x" />
          <span className="legacy-spotlight-copy">
            <small>SONARA EXCLUSIVE</small>
            <strong>LEGACY</strong>
            <span>FOREVER JAHSEH</span>
            <em>The Music Lives On.</em>
          </span>
          <ChevronRight size={19} />
        </button>
        <div className="my-playlists">
          <div className="sidebar-section-title">
            Minhas Playlists{" "}
            <button
              aria-label="Ver playlists"
              onClick={() => navigate("Playlists")}
            >
              <Plus size={21} />
            </button>
          </div>
          {playlists.map((l, i) => (
            <button
              className="sidebar-playlist"
              key={l.name}
              onClick={() => {
                setPlaylistSelected(i);
                navigate("Playlists");
              }}
            >
              <Art type={l.art} />
              <span>
                <b>{l.name}</b>
                <small>
                  {i === 0 ? "Jahseh · discografia" : "Matuê · Teto · WIU"}
                </small>
              </span>
            </button>
          ))}
        </div>
        <div className="sidebar-wave" />
        <a
          className="credits-link"
          href={`${import.meta.env.BASE_URL}credits.html`}
        >
          Créditos & fontes ↗
        </a>
      </aside>
      {mobileNav && (
        <div className="screen-shade" onClick={() => setMobileNav(false)} />
      )}
      <div className="main-area" inert={mobileNav}>
        <header className="top-header">
          <button
            className="mobile-menu"
            aria-label="Abrir navegação"
            aria-expanded={mobileNav}
            onClick={() => setMobileNav(true)}
          >
            <Menu size={25} />
          </button>
          <div className="legacy-header-trail">
            <button onClick={() => navigate("Início")}>Eclipse</button>
            <ChevronRight size={13} />
            <span>Legacy</span>
          </div>
          <div className="search-box">
            <Search size={23} />
            <input
              aria-label="Buscar músicas, artistas e álbuns"
              placeholder="Buscar músicas, artistas, álbuns..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                navigate("Buscar");
              }}
            />
          </div>
          <span className="mobile-legacy-brand">
            SONARA <Moon size={22} />
          </span>
          <div className="header-tools">
            <button
              className="header-bell"
              aria-label="Explorar novidades"
              onClick={() => navigate("Explorar")}
            >
              <Bell size={22} />
            </button>
            <button
              className="header-profile"
              aria-label="Abrir biblioteca"
              onClick={() => navigate("Biblioteca")}
            >
              <Art type="eclipse" />
              <ChevronDown size={15} />
            </button>
          </div>
        </header>
        <div className="page-columns">
          <main id="main-content" className="main-content">
            {main}
          </main>
          {page !== "LEGACY" && (
            <aside className="context-sidebar">{sidebarRight}</aside>
          )}
        </div>
      </div>
      <div inert={mobileNav}>
        <Player
          track={currentTrack}
          queue={currentQueue}
          onSelect={setCurrentTrack}
          favorites={favorites}
          toggleLike={toggleLike}
        />
      </div>
    </div>
  );
}
