import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Bookmark } from "lucide-react"
import { useBookmarks } from "@/hooks/useBookmarks"
import { useBookmarkFolders } from "@/hooks/useBookmarkFolders"
import SearchBar from "@/components/dashboard/SearchBar"
import BookmarkFolderSection from "@/components/bookmarks/BookmarkFolderSection"
import { Badge } from "@/components/ui/badge"
import type { Bookmark as BookmarkType, BookmarkFolder } from "@/lib/types"

function groupByFolder(
  bookmarks: BookmarkType[],
  folders: BookmarkFolder[]
): { folder: BookmarkFolder; bookmarks: BookmarkType[] }[] {
  const map = new Map<string, BookmarkType[]>()
  for (const b of bookmarks) {
    const folderId = b.expand?.folder?.id ?? b.folder
    const list = map.get(folderId) ?? []
    list.push(b)
    map.set(folderId, list)
  }

  return folders
    .filter((f) => map.has(f.id))
    .map((f) => ({ folder: f, bookmarks: map.get(f.id)! }))
}

export default function BookmarksPage() {
  const { bookmarks, loading } = useBookmarks()
  const { folders } = useBookmarkFolders()
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const trimmed = query.trim().toLowerCase()
    if (!trimmed) return bookmarks
    return bookmarks.filter((b) => {
      const haystack = [b.name, b.url].join(" ").toLowerCase()
      return haystack.includes(trimmed)
    })
  }, [bookmarks, query])

  const groups = useMemo(
    () => groupByFolder(filtered, folders),
    [filtered, folders]
  )

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
    >
      {/* Title */}
      <div className="mb-6 flex items-center gap-3">
        <Bookmark className="h-6 w-6 text-blue-500" />
        <h1 className="text-2xl font-bold text-zinc-50">Bookmarks</h1>
        <Badge variant="secondary">{bookmarks.length}</Badge>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchBar variant="page" value={query} onChange={setQuery} />
      </div>

      {/* Grouped bookmarks */}
      {loading ? (
        <p className="text-sm text-zinc-500">Chargement...</p>
      ) : groups.length === 0 ? (
        <p className="text-sm text-zinc-500">Aucun bookmark trouve.</p>
      ) : (
        <div className="space-y-8">
          {groups.map(({ folder, bookmarks: groupBookmarks }) => (
            <BookmarkFolderSection
              key={folder.id}
              folder={folder}
              bookmarks={groupBookmarks}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}
