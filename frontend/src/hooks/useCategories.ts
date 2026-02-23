import { useState, useEffect, useCallback } from "react"
import type { Category } from "@/lib/types"
import pb from "@/lib/pocketbase"

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const records = await pb.collection("categories").getFullList<Category>({
        sort: "sort_order",
      })
      setCategories(records)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch categories"
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { categories, loading, error, refetch }
}
