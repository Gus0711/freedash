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

  const iconSrc = bookmark.icon_url.startsWith("http")
    ? bookmark.icon_url
    : bookmark.icon_url
      ? getDashboardIconUrl(bookmark.icon_url)
      : null

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
        <Card className="flex flex-row items-center gap-3 border-zinc-800 bg-zinc-900 p-3 transition-colors hover:border-zinc-700">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-zinc-800">
            {iconSrc && !imgError ? (
              <img
                src={iconSrc}
                alt={bookmark.name}
                className="h-8 w-8 object-contain"
                onError={() => setImgError(true)}
              />
            ) : bookmark.abbreviation ? (
              <span
                className="text-xs font-bold text-white"
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
