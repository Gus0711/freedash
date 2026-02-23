import { useState, useMemo } from "react"
import type { Service } from "@/lib/types"

export function useSearch(services: Service[]) {
  const [query, setQuery] = useState("")

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase()
    if (!trimmed) return services

    return services.filter((s) => {
      const haystack = [s.name, s.description, s.url_external, s.url_local]
        .join(" ")
        .toLowerCase()
      return haystack.includes(trimmed)
    })
  }, [services, query])

  return { results, query, setQuery }
}
