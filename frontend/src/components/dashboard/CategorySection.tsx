import { motion } from "framer-motion"
import {
  Folder,
  Server,
  Home,
  Play,
  FileText,
  Rss,
  Gamepad2,
  Settings,
  Shield,
  Activity,
  HardDrive,
  Network,
  Thermometer,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import ServiceGrid from "./ServiceGrid"
import type { Category, Service, UrlField } from "@/lib/types"

interface CategorySectionProps {
  category: Category
  services: Service[]
  urlField: UrlField
}

const iconMap: Record<string, LucideIcon> = {
  server: Server,
  home: Home,
  play: Play,
  "file-text": FileText,
  rss: Rss,
  "gamepad-2": Gamepad2,
  settings: Settings,
  shield: Shield,
  activity: Activity,
  "hard-drive": HardDrive,
  network: Network,
  thermometer: Thermometer,
  folder: Folder,
}

export default function CategorySection({
  category,
  services,
  urlField,
}: CategorySectionProps) {
  const Icon = iconMap[category.icon] ?? Folder

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2">
        <span
          className="block h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: category.color }}
        />
        <Icon className="h-4 w-4 text-zinc-400" />
        <h2 className="text-sm font-semibold text-zinc-50">{category.name}</h2>
        <span className="text-xs text-zinc-500">({services.length})</span>
      </div>

      <ServiceGrid services={services} urlField={urlField} />
    </motion.section>
  )
}
