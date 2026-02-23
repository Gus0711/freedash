import { useState, useEffect, useCallback } from "react"
import type { Settings } from "@/lib/types"
import pb from "@/lib/pocketbase"

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const records = await pb.collection("settings").getFullList<Settings>()
      setSettings(records[0] ?? null)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch settings"
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { settings, loading, error, refetch }
}
