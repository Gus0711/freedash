import { motion } from "framer-motion"
import {
  Folder,
  Globe,
  Code,
  Play,
  Sparkles,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import BookmarkCard from "./BookmarkCard"
import type { BookmarkFolder, Bookmark } from "@/lib/types"

interface BookmarkFolderSectionProps {
  folder: BookmarkFolder
  bookmarks: Bookmark[]
}

const iconMap: Record<string, LucideIcon> = {
  globe: Globe,
  sparkles: Sparkles,
  code: Code,
  play: Play,
  folder: Folder,
}

export default function BookmarkFolderSection({
  folder,
  bookmarks,
}: BookmarkFolderSectionProps) {
  const Icon = iconMap[folder.icon] ?? Folder

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2">
        <span
          className="block h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: folder.color }}
        />
        <Icon className="h-4 w-4 text-zinc-400" />
        <h2 className="text-sm font-semibold text-zinc-50">{folder.name}</h2>
        <span className="text-xs text-zinc-500">({bookmarks.length})</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {bookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            folderColor={folder.color}
          />
        ))}
      </div>
    </motion.section>
  )
}
