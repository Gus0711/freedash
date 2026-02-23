import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function ClockWidget() {
  const [now, setNow] = useState<Date>(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const hours = now.getHours().toString().padStart(2, "0")
  const minutes = now.getMinutes().toString().padStart(2, "0")
  const seconds = now.getSeconds().toString().padStart(2, "0")

  const dateStr = now.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const capitalizedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1)

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-start"
    >
      <div className="flex items-baseline gap-0.5">
        <span className="text-2xl font-bold tracking-tight text-zinc-50">
          {hours}:{minutes}
        </span>
        <span className="text-xs text-zinc-500">:{seconds}</span>
      </div>
      <span className="text-xs text-zinc-400">{capitalizedDate}</span>
    </motion.div>
  )
}
