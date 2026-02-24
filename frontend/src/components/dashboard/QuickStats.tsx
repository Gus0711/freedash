import { motion } from "framer-motion"
import { CheckCircle2, XCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import WeatherWidget from "./WeatherWidget"

interface QuickStatsProps {
  onlineCount: number
  offlineCount: number
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export default function QuickStats({ onlineCount, offlineCount }: QuickStatsProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-3 sm:grid-cols-3"
    >
      <motion.div variants={item}>
        <Card className="glass-card py-0">
          <CardContent className="flex items-center gap-3 py-4">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-zinc-50">{onlineCount}</span>
              <span className="text-xs text-zinc-400">Services en ligne</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="glass-card py-0">
          <CardContent className="flex items-center gap-3 py-4">
            <XCircle className="h-5 w-5 text-red-500" />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-zinc-50">{offlineCount}</span>
              <span className="text-xs text-zinc-400">Services hors ligne</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="glass-card py-0">
          <CardContent className="flex items-center gap-3 py-4">
            <WeatherWidget />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
