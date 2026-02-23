import { motion } from "framer-motion"
import ClockWidget from "@/components/dashboard/ClockWidget"
import SearchBar from "@/components/dashboard/SearchBar"
import WeatherWidget from "@/components/dashboard/WeatherWidget"

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6"
    >
      <ClockWidget />
      <SearchBar variant="header" />
      <WeatherWidget />
    </motion.header>
  )
}
