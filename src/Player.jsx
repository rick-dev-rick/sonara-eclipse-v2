import React, { useEffect, useRef, useState } from "react";
import {
  Heart,
  ListMusic,
  Maximize,
  Play,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat2,
  Volume2,
  X,
} from "lucide-react";
import Art from "./Art.jsx";

export default function Player({
  track,
  queue,
  onSelect,
  favorites,
  toggleLike,
}) {
  const [panel, setPanel] = useState(null),
    [shuffle, setShuffle] = useState(false),
    [repeat, setRepeat] = useState(false);
  const modal = useRef(null),
    opener = useRef(null);
  useEffect(() => {
    if (!panel) return;
    const d = modal.current;
    opener.current = document.activeElement;
    d.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      d.close();
      document.body.style.overflow = old;
      opener.current?.focus();
    };
  }, [panel]);
  const idx = queue.findIndex((t) => t.id === track.id);
  const step = (direction) => {
    if (!queue.length) return;
    let n =
      shuffle && queue.length > 1
        ? (Math.max(idx, 0) +
            1 +
            Math.floor(Math.random() * (queue.length - 1))) %
          queue.length
        : repeat
          ? (Math.max(idx, 0) + direction + queue.length) % queue.length
          : Math.min(
              queue.length - 1,
              Math.max(0, Math.max(idx, 0) + direction),
            );
    onSelect(queue[n]);
  };
  const liked = favorites.includes(track.id);
  const like = (
    <button
      className={"icon-button " + (liked ? "red" : "")}
      aria-label={`Favoritar ${track.title}`}
      aria-pressed={liked}
      onClick={() => toggleLike(track.id)}
    >
      <Heart size={20} fill={liked ? "currentColor" : "none"} />
    </button>
  );
  const controls = (
    <div className="transport-buttons">
      <button
        className={"icon-button " + (shuffle ? "red" : "")}
        aria-label="Ordem aleatória da fila"
        aria-pressed={shuffle}
        onClick={() => setShuffle(!shuffle)}
      >
        <Shuffle size={18} />
      </button>
      <button
        className="icon-button"
        aria-label="Faixa anterior"
        onClick={() => step(-1)}
      >
        <SkipBack size={20} />
      </button>
      <button
        className="transport-play"
        disabled
        aria-label="Reprodução indisponível — catálogo demonstrativo"
      >
        <Play size={20} fill="currentColor" />
      </button>
      <button
        className="icon-button"
        aria-label="Próxima faixa"
        onClick={() => step(1)}
      >
        <SkipForward size={20} />
      </button>
      <button
        className={"icon-button " + (repeat ? "red" : "")}
        aria-label="Repetir fila"
        aria-pressed={repeat}
        onClick={() => setRepeat(!repeat)}
      >
        <Repeat2 size={18} />
      </button>
    </div>
  );
  const progress = (
    <div className="progress">
      <span>—</span>
      <input
        aria-label="Progresso indisponível sem áudio"
        type="range"
        min="0"
        max="100"
        value="0"
        readOnly
        disabled
      />
      <span>{track.length || "—"}</span>
    </div>
  );
  return (
    <>
      <footer className="bottom-player" aria-label="Player demonstrativo">
        <div className="now-song">
          <button
            className="now-cover"
            aria-label="Abrir player"
            onClick={() => setPanel("player")}
          >
            <Art type={track.art} />
          </button>
          <button
            className="now-title"
            onClick={() => setPanel("player")}
            aria-label={`Abrir player: ${track.title}`}
          >
            <b>{track.title}</b>
            <small>
              {track.artist} <span>· SEM ÁUDIO</span>
            </small>
          </button>
          {like}
        </div>
        <div className="transport">
          {controls}
          {progress}
        </div>
        <div className="volume-area">
          <Volume2 size={18} />
          <input
            aria-label="Volume indisponível sem áudio"
            type="range"
            value="0"
            readOnly
            disabled
          />
          <button
            className="icon-button"
            aria-label="Abrir fila"
            onClick={() => setPanel("queue")}
          >
            <ListMusic size={20} />
          </button>
          <button
            className="icon-button"
            aria-label="Expandir player"
            onClick={() => setPanel("player")}
          >
            <Maximize size={19} />
          </button>
        </div>
      </footer>
      <dialog
        ref={modal}
        className="player-dialog"
        aria-labelledby="player-title"
        onCancel={() => setPanel(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setPanel(null);
        }}
      >
        <div className="player-modal">
          <div className="player-modal-top">
            <span>SONARA / CATÁLOGO EDITORIAL</span>
            <button
              className="icon-button"
              aria-label="Fechar player"
              onClick={() => setPanel(null)}
            >
              <X size={22} />
            </button>
          </div>
          <div className="player-tabs">
            <button
              className={panel === "player" ? "active" : ""}
              onClick={() => setPanel("player")}
            >
              Faixa selecionada
            </button>
            <button
              className={panel === "queue" ? "active" : ""}
              onClick={() => setPanel("queue")}
            >
              Fila · {queue.length}
            </button>
          </div>
          {panel === "queue" ? (
            <>
              <h2 id="player-title">Sua próxima descoberta.</h2>
              <ol className="player-queue">
                {queue.map((t) => (
                  <li key={t.id}>
                    <button
                      aria-current={t.id === track.id ? "true" : undefined}
                      onClick={() => onSelect(t)}
                    >
                      <Art type={t.art} />
                      <span>
                        <strong>{t.title}</strong>
                        <small>{t.artist}</small>
                      </span>
                      {t.id === track.id && (
                        <span className="queue-selected">SELECIONADA</span>
                      )}
                    </button>
                  </li>
                ))}
              </ol>
            </>
          ) : (
            <div className="expanded-track">
              <Art
                type={track.art}
                alt={`Capa de ${track.album || track.title}`}
                eager
              />
              <div className="expanded-name">
                <div>
                  <h2 id="player-title">{track.title}</h2>
                  <p>{track.artist}</p>
                </div>
                {like}
              </div>
              {progress}
              {controls}
            </div>
          )}
          <p className="player-notice">
            <span>DEMONSTRAÇÃO</span> Explore o catálogo, organize a fila e
            salve favoritos. A reprodução de gravações comerciais não está
            disponível. Progresso e volume ficam desativados.
          </p>
        </div>
      </dialog>
    </>
  );
}
