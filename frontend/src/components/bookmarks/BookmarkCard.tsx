import { useState } from "react"
import { motion } from "framer-motion"
import { Globe } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { Bookmark } from "@/lib/types"
import { getDashboardIconUrl, cleanUrl } from "@/lib/utils"

interface BookmarkCardProps {
  bookmark: Bookmark
  folderColor: string
}

export default function BookmarkCard({ bookmark, folderColor }: BookmarkCardProps) {
  const [imgError, setImgError] = useState(false)
  const [hovered, setHovered] = useState(false)

  const iconSrc = bookmark.icon_url.startsWith("http")
    ? bookmark.icon_url
    : bookmark.icon_url
      ? getDashboardIconUrl(bookmark.icon_url)
      : null

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
        <Card
          className="glass-card glass-card-hover flex flex-row items-center gap-3 p-3"
          style={{
            borderLeft: `3px solid ${folderColor}`,
            boxShadow: hovered
              ? `0 0 30px ${folderColor}40, 0 0 60px ${folderColor}15`
              : "none",
          }}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white/[0.06]">
            {iconSrc && !imgError ? (
              <img
                src={iconSrc}
                alt={bookmark.name}
                className="h-8 w-8 object-contain"
                onError={() => setImgError(true)}
              />
            ) : bookmark.abbreviation ? (
              <span
                className="text-xs font-bold"
                style={{ color: folderColor }}
              >
                {bookmark.abbreviation}
              </span>
            ) : (
              <Globe className="h-5 w-5 text-zinc-500" />
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-medium text-zinc-50">
              {bookmark.name}
            </span>
            <span className="truncate text-xs font-mono text-zinc-500">
              {cleanUrl(bookmark.url)}
            </span>
          </div>
        </Card>
      </a>
    </motion.div>
  )
}
