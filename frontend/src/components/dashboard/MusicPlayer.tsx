import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Music,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react"
import { useHomeAssistant } from "@/hooks/useHomeAssistant"

export default function MusicPlayer() {
  const { player, isConfigured, play, pause, next, previous, setVolume } =
    useHomeAssistant()
  const [open, setOpen] = useState(false)

  if (!isConfigured) return null

  const isPlaying = player?.state === "playing"
  const attrs = player?.attributes
  const volume = attrs?.volume_level ?? 0.5

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-white/[0.08]"
      >
        <Music
          className={`h-4 w-4 transition-colors ${
            isPlaying ? "text-green-400" : open ? "text-purple-400" : "text-zinc-400"
          }`}
        />
        {isPlaying && (
          <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-green-400" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="glass-card absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl p-4"
          >
            {/* Track info */}
            <div className="mb-3 flex items-center gap-3">
              {attrs?.entity_picture ? (
                <img
                  src={`/ha-api/../${attrs.entity_picture}`}
                  alt="cover"
                  className="h-12 w-12 shrink-0 rounded-lg object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = "none"
                  }}
                />
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">
                  <Music className="h-5 w-5 text-zinc-500" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-50">
                  {attrs?.media_title ?? "Aucune lecture"}
                </p>
                <p className="truncate text-xs text-zinc-400">
                  {attrs?.media_artist ?? "—"}
                </p>
                {attrs?.media_album_name && (
                  <p className="truncate text-[10px] text-zinc-500">
                    {attrs.media_album_name}
                  </p>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="mb-3 flex items-center justify-center gap-4">
              <button
                onClick={previous}
                className="rounded-full p-1.5 transition-colors hover:bg-white/[0.08]"
              >
                <SkipBack className="h-4 w-4 text-zinc-300" />
              </button>
              <button
                onClick={isPlaying ? pause : play}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.1] transition-colors hover:bg-white/[0.18]"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 text-zinc-50" />
                ) : (
                  <Play className="h-4 w-4 translate-x-[1px] text-zinc-50" />
                )}
              </button>
              <button
                onClick={next}
                className="rounded-full p-1.5 transition-colors hover:bg-white/[0.08]"
              >
                <SkipForward className="h-4 w-4 text-zinc-300" />
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setVolume(volume > 0 ? 0 : 0.5)}
                className="p-1 transition-colors hover:text-zinc-300"
              >
                {volume === 0 ? (
                  <VolumeX className="h-3.5 w-3.5 text-zinc-500" />
                ) : (
                  <Volume2 className="h-3.5 w-3.5 text-zinc-400" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/[0.1] accent-purple-500"
              />
              <span className="w-8 text-right text-[10px] text-zinc-500">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
