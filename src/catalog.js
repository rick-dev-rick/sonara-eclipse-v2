import { albums, demoTracks, xTracks, matueTracks } from "./data.js";

export function trackId(track) {
  return (
    "track:" +
    encodeURIComponent(track.artist || "XXXTENTACION") +
    "|" +
    encodeURIComponent(track.title)
  );
}
export function queueWithTrack(track, queue) {
  const item = {
    ...track,
    id: trackId(track),
    art: track.art || track.cover || "album-17",
  };
  return [
    item,
    ...queue
      .filter((t) => trackId(t) !== item.id)
      .map((t) => ({ ...t, id: trackId(t) })),
  ];
}
export function migrateFavorites(values) {
  return [
    ...new Set(
      values
        .filter((v) => typeof v === "string")
        .map((id) => {
          if (id.startsWith("track:")) return id;
          const demo = demoTracks.find((t) => t.id === id);
          if (demo) return trackId(demo);
          if (id.startsWith("legacy-"))
            return trackId({ title: id.slice(7), artist: "XXXTENTACION" });
          const separator = id.indexOf("|");
          if (separator > 0) {
            const album = albums.find(
              (a) => a.title === id.slice(0, separator),
            );
            if (album)
              return trackId({
                title: id.slice(separator + 1),
                artist: album.artist,
              });
          }
          if (albums.some((a) => a.title === id)) return id;
          if (xTracks.some((t) => t.title === id))
            return trackId({ title: id, artist: "XXXTENTACION" });
          if (matueTracks.some((t) => t.title === id))
            return trackId({ title: id, artist: "Matuê" });
          return id;
        }),
    ),
  ];
}
export function favoriteLabel(id) {
  if (!id.startsWith("track:")) return id;
  try {
    return decodeURIComponent(id.slice(id.indexOf("|") + 1));
  } catch {
    return id;
  }
}
