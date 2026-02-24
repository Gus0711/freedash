import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Music } from "lucide-react"
import { useSettings } from "@/hooks/useSettings"

function toWidgetUrl(deezerUrl: string): string | null {
  // Convert deezer.com URL to widget.deezer.com URL
  // e.g. https://www.deezer.com/fr/playlist/53362031 → https://widget.deezer.com/widget/dark/playlist/53362031
  const match = deezerUrl.match(
    /deezer\.com\/(?:\w+\/)?(track|album|playlist|artist|podcast|episode)\/(\d+)/
  )
  if (!match) return null
  const [, type, id] = match
  return `https://widget.deezer.com/widget/dark/${type}/${id}?tracklist=true&radius=true`
}

export default function DeezerMiniPlayer() {
  const { settings } = useSettings()
  const [open, setOpen] = useState(false)

  const widgetUrl = useMemo(
    () => (settings?.deezer_url ? toWidgetUrl(settings.deezer_url) : null),
    [settings?.deezer_url]
  )

  if (!widgetUrl) return null

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-white/[0.08]"
        title="Deezer"
      >
        <Music
          className={`h-4 w-4 transition-colors ${open ? "text-purple-400" : "text-zinc-400"}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="glass-card absolute right-0 top-full z-50 mt-2 overflow-hidden rounded-xl"
            style={{ width: 350, height: 380 }}
          >
            <iframe
              title="Deezer Player"
              src={widgetUrl}
              width="350"
              height="380"
              allow="encrypted-media; clipboard-write"
              style={{ border: "none" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
