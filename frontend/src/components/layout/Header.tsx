import { motion } from "framer-motion"
import ClockWidget from "@/components/dashboard/ClockWidget"
import SearchBar from "@/components/dashboard/SearchBar"
import WeatherWidget from "@/components/dashboard/WeatherWidget"
import MusicPlayer from "@/components/dashboard/MusicPlayer"

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10 flex h-16 shrink-0 items-center justify-between border-b border-white/[0.06] bg-zinc-950/60 px-6 backdrop-blur-xl"
    >
      <ClockWidget />
      <SearchBar variant="header" />
      <div className="flex items-center gap-3">
        <WeatherWidget />
        <MusicPlayer />
      </div>
    </motion.header>
  )
}
