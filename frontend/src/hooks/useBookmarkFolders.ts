import { useState, useEffect, useCallback } from "react"
import type { BookmarkFolder } from "@/lib/types"
import pb from "@/lib/pocketbase"

export function useBookmarkFolders() {
  const [folders, setFolders] = useState<BookmarkFolder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const records = await pb.collection("bookmark_folders").getFullList<BookmarkFolder>({
        sort: "sort_order",
      })
      setFolders(records)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch bookmark folders"
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { folders, loading, error, refetch }
}
