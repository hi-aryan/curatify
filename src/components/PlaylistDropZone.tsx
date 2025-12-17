/*
    PlaylistDropZone: Drop target for creating a dummy playlist
    
    Props:
    - playlist: array of tracks in the playlist
    - onAddTrack: callback when a track is dropped
    - onRemoveTrack: callback when a track is removed
    - onReorder: callback when tracks are reordered
*/
import { useState } from "react";
import { motion, Reorder } from "motion/react";

export function PlaylistDropZone({
  playlist,
  onAddTrack,
  onRemoveTrack,
  onReorder,
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setIsDragOver(true);
  }

  function handleDragLeave() {
    setIsDragOver(false);
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragOver(false);

    try {
      const trackData = event.dataTransfer.getData("application/json");
      const track = JSON.parse(trackData);
      onAddTrack(track);
    } catch {
      // Invalid drop data
    }
  }

  function removeTrackACB(trackId) {
    return function handleRemove() {
      onRemoveTrack(trackId);
    };
  }

  function renderPlaylistItemCB(track) {
    return (
      <Reorder.Item
        key={track.id}
        value={track}
        className="flex items-center gap-2 p-2 rounded bg-dark/60 border border-light/20 cursor-grab"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-light truncate">
            {track.trackName}
          </p>
          <p className="text-xs text-light/60 truncate">{track.artistName}</p>
        </div>
        <button
          onClick={removeTrackACB(track.id)}
          className="p-1 text-light/40 hover:text-pink transition-colors"
          aria-label="Remove track"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </Reorder.Item>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
                h-full overflow-y-auto pr-2 custom-scrollbar p-4 rounded-lg border-2 border-dashed
                transition-colors duration-200
                ${
                  isDragOver
                    ? "border-green bg-green/10"
                    : "border-light/30 bg-dark/30"
                }
            `}
    >
      {playlist.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center py-8">
          <motion.div animate={{ y: isDragOver ? -4 : 0 }} className="mb-3">
            <svg
              className="w-12 h-12 text-light/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          </motion.div>
          <p className="text-light/50 text-sm">
            {isDragOver
              ? "Drop to add!"
              : "Drag songs here to create your playlist"}
          </p>
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={playlist}
          onReorder={onReorder}
          className="space-y-2"
        >
          {playlist.map(renderPlaylistItemCB)}
        </Reorder.Group>
      )}

      {playlist.length > 0 && (
        <p className="mt-3 text-xs text-light/40 text-center">
          {playlist.length} track{playlist.length !== 1 ? "s" : ""} • Drag to
          reorder
        </p>
      )}
    </div>
  );
}
