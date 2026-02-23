import { useState, useEffect, useCallback } from "react"
import type { Service } from "@/lib/types"
import pb from "@/lib/pocketbase"

export function useServices(options?: { includeInactive?: boolean }) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const includeInactive = options?.includeInactive ?? false

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const records = await pb.collection("services").getFullList<Service>({
        sort: "sort_order",
        expand: "category",
        ...(includeInactive ? {} : { filter: "is_active=true" }),
      })
      setServices(records)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch services"
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { services, loading, error, refetch }
}
