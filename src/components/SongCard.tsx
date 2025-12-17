/*
    SongCard: Draggable song item for the charts list
    
    Props:
    - track: { id, rank, trackName, artistName, streams }
    - onDragStart: callback when drag starts
    - isDragging: whether this card is being dragged
*/
import { motion } from "motion/react";

interface SongCardProps {
  track: any;
  onDragStart?: (track: any) => void;
  isDragging?: boolean;
  onAdd?: (track: any) => void;
}

export function SongCard({
  track,
  onDragStart,
  isDragging,
  onAdd,
}: SongCardProps) {
  function handleDragStart(event) {
    // Set drag data for the drop zone
    event.dataTransfer.setData("application/json", JSON.stringify(track));
    event.dataTransfer.effectAllowed = "copy";
    onDragStart?.(track);
  }

  return (
    <motion.div
      draggable
      onDragStart={handleDragStart}
      className={`
                flex items-center gap-3 p-2 rounded-lg
                bg-dark/60 border border-light/20
                cursor-grab active:cursor-grabbing
                hover:border-green/50 hover:bg-dark/80
                transition-colors duration-150
                ${isDragging ? "opacity-50" : ""}
            `}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Rank */}
      <span className="w-6 text-center text-sm font-bold text-green">
        {track.rank}
      </span>

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">
          {track.trackName || track.name}
        </p>
        <p className="text-xs text-light/60 truncate">{track.artistName}</p>
      </div>

      {/* Add Button (Mobile only) */}
      <button
        onClick={() => onAdd?.(track)}
        className="lg:hidden p-2 -mr-2 text-green active:scale-95 transition-transform"
        aria-label="Add to playlist"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>

      {/* Drag indicator (Desktop only) */}
      <div className="hidden lg:flex flex-col gap-0.5 px-1 opacity-40">
        <div className="w-4 h-0.5 bg-light/60 rounded" />
        <div className="w-4 h-0.5 bg-light/60 rounded" />
        <div className="w-4 h-0.5 bg-light/60 rounded" />
      </div>
    </motion.div>
  );
}
