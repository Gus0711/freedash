import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Globe, Wifi, Star, ArrowRight } from "lucide-react"
import { useServices } from "@/hooks/useServices"
import SearchBar from "@/components/dashboard/SearchBar"
import ServiceGrid from "@/components/dashboard/ServiceGrid"
import QuickStats from "@/components/dashboard/QuickStats"
import BookmarkChips from "@/components/dashboard/BookmarkChips"
import { Button } from "@/components/ui/button"

function useClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

function getGreeting(hour: number): string {
  if (hour >= 6 && hour < 12) return "Bonjour"
  if (hour >= 12 && hour < 18) return "Bon apres-midi"
  if (hour >= 18 && hour < 22) return "Bonsoir"
  return "Bonne nuit"
}

export default function DashboardPage() {
  const { services } = useServices()
  const now = useClock()

  const favorites = services.filter((s) => s.is_favorite)
  const activeCount = services.filter((s) => s.is_active).length

  const greeting = useMemo(() => getGreeting(now.getHours()), [now.getHours()])

  const dateStr = now.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const timeStr = now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const seconds = now.toLocaleTimeString("fr-FR", { second: "2-digit" }).slice(-2)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
    >
      {/* Welcome + Clock */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-zinc-50">{greeting}</h1>
        <div className="mx-auto mt-4 inline-block rounded-2xl border border-white/[0.06] bg-zinc-900/50 px-8 py-4 backdrop-blur-xl">
          <p className="text-6xl font-bold tabular-nums text-zinc-50">
            {timeStr}
            <span className="text-3xl text-zinc-500">:{seconds}</span>
          </p>
        </div>
        <p className="mt-3 text-sm font-medium capitalize text-zinc-400">{dateStr}</p>
      </div>

      {/* Search */}
      <div className="mx-auto mb-8 max-w-xl">
        <SearchBar variant="header" />
      </div>

      {/* Quick Stats */}
      <div className="mb-8">
        <QuickStats onlineCount={activeCount} offlineCount={0} />
      </div>

      {/* Favorites */}
      {favorites.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-50">
            <Star className="h-5 w-5 text-amber-500" />
            Favoris
          </h2>
          <ServiceGrid services={favorites} urlField="url_external" />
        </section>
      )}

      {/* Bookmarks */}
      <section className="mb-8">
        <BookmarkChips />
      </section>

      {/* Quick Links */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-50">Acces rapide</h2>
        <div className="flex flex-wrap gap-4">
          <Button asChild variant="outline" size="lg">
            <Link to="/distant" className="gap-2">
              <Globe className="h-4 w-4" />
              Services distants
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/local" className="gap-2">
              <Wifi className="h-4 w-4" />
              Services locaux
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </motion.div>
  )
}
