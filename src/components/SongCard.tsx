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
}

export function SongCard({ track, onDragStart, isDragging }: SongCardProps) {
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
        <p className="text-sm font-medium text-light truncate">
          {track.trackName}
        </p>
        <p className="text-xs text-light/60 truncate">{track.artistName}</p>
      </div>

      {/* Drag indicator */}
      <div className="flex flex-col gap-0.5 px-1 opacity-40">
        <div className="w-4 h-0.5 bg-light/60 rounded" />
        <div className="w-4 h-0.5 bg-light/60 rounded" />
        <div className="w-4 h-0.5 bg-light/60 rounded" />
      </div>
    </motion.div>
  );
}
