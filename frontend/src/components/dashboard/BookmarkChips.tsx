import { useState } from "react"
import { Bookmark } from "lucide-react"
import { useBookmarks } from "@/hooks/useBookmarks"
import { useBookmarkFolders } from "@/hooks/useBookmarkFolders"
import { getDashboardIconUrl } from "@/lib/utils"
import type { Bookmark as BookmarkType, BookmarkFolder } from "@/lib/types"

function ChipIcon({ bookmark, folderColor }: { bookmark: BookmarkType; folderColor: string }) {
  const [imgError, setImgError] = useState(false)

  const iconSrc = bookmark.icon_url.startsWith("http")
    ? bookmark.icon_url
    : bookmark.icon_url
      ? getDashboardIconUrl(bookmark.icon_url)
      : null

  if (iconSrc && !imgError) {
    return (
      <img
        src={iconSrc}
        alt=""
        className="h-4 w-4 shrink-0 object-contain"
        onError={() => setImgError(true)}
      />
    )
  }

  if (bookmark.abbreviation) {
    return (
      <span className="text-[10px] font-bold leading-none" style={{ color: folderColor }}>
        {bookmark.abbreviation}
      </span>
    )
  }

  return <Bookmark className="h-3.5 w-3.5 text-zinc-500" />
}

export default function BookmarkChips() {
  const { bookmarks } = useBookmarks()
  const { folders } = useBookmarkFolders()

  if (bookmarks.length === 0 || folders.length === 0) return null

  const grouped = folders
    .map((folder) => ({
      folder,
      bookmarks: bookmarks
        .filter((b) => (b.expand?.folder?.id ?? b.folder) === folder.id)
        .sort((a, b) => a.sort_order - b.sort_order),
    }))
    .filter((g) => g.bookmarks.length > 0)

  return (
    <section>
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-50">
        <Bookmark className="h-5 w-5 text-blue-500" />
        Bookmarks
      </h2>
      <div className="space-y-3">
        {grouped.map(({ folder, bookmarks: items }) => (
          <FolderRow key={folder.id} folder={folder} bookmarks={items} />
        ))}
      </div>
    </section>
  )
}

function FolderRow({ folder, bookmarks }: { folder: BookmarkFolder; bookmarks: BookmarkType[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className="mr-1 inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400"
      >
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ backgroundColor: folder.color }}
        />
        {folder.name}
      </span>
      {bookmarks.map((b) => (
        <a
          key={b.id}
          href={b.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:bg-zinc-800 hover:text-zinc-50"
        >
          <ChipIcon bookmark={b} folderColor={folder.color} />
          {b.name}
        </a>
      ))}
    </div>
  )
}
