import { useMemo } from "react"
import { motion } from "framer-motion"
import { Wifi } from "lucide-react"
import { useServices } from "@/hooks/useServices"
import { useCategories } from "@/hooks/useCategories"
import { useSearch } from "@/hooks/useSearch"
import SearchBar from "@/components/dashboard/SearchBar"
import CategorySection from "@/components/dashboard/CategorySection"
import { Badge } from "@/components/ui/badge"
import type { Service, Category } from "@/lib/types"

function groupByCategory(
  services: Service[],
  categories: Category[]
): { category: Category; services: Service[] }[] {
  const map = new Map<string, Service[]>()
  for (const s of services) {
    const catId = s.expand?.category?.id ?? s.category
    const list = map.get(catId) ?? []
    list.push(s)
    map.set(catId, list)
  }

  return categories
    .filter((c) => map.has(c.id))
    .map((c) => ({ category: c, services: map.get(c.id)! }))
}

export default function LocalPage() {
  const { services, loading } = useServices()
  const { categories } = useCategories()

  const filtered = useMemo(
    () => services.filter((s) => s.url_local && s.is_active),
    [services]
  )

  const { results, query, setQuery } = useSearch(filtered)

  const groups = useMemo(
    () => groupByCategory(results, categories),
    [results, categories]
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
        <Wifi className="h-6 w-6 text-green-500" />
        <h1 className="text-2xl font-bold text-zinc-50">
          Services locaux
        </h1>
        <Badge variant="secondary">{filtered.length}</Badge>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchBar
          variant="page"
          value={query}
          onChange={setQuery}
        />
      </div>

      {/* Grouped services */}
      {loading ? (
        <p className="text-sm text-zinc-500">Chargement...</p>
      ) : groups.length === 0 ? (
        <p className="text-sm text-zinc-500">Aucun service trouve.</p>
      ) : (
        <div className="space-y-8">
          {groups.map(({ category, services: groupServices }) => (
            <CategorySection
              key={category.id}
              category={category}
              services={groupServices}
              urlField="url_local"
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}
