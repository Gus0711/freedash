import { useState, useEffect, useCallback } from "react"
import type { Bookmark } from "@/lib/types"
import pb from "@/lib/pocketbase"

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const records = await pb.collection("bookmarks").getFullList<Bookmark>({
        sort: "sort_order",
        expand: "folder",
      })
      setBookmarks(records)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch bookmarks"
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { bookmarks, loading, error, refetch }
}
