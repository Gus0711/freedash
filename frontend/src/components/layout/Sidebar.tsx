import { useState } from "react"
import { motion } from "framer-motion"
import { useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Globe,
  Wifi,
  BarChart3,
  Thermometer,
  Bookmark,
  Activity,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  Hexagon,
} from "lucide-react"
import SidebarItem from "./SidebarItem"
import { Separator } from "@/components/ui/separator"

const sidebarVariants = {
  open: { width: 240, transition: { type: "spring" as const, stiffness: 300, damping: 30 } },
  closed: { width: 64, transition: { type: "spring" as const, stiffness: 300, damping: 30 } },
}

const mvpNav = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/distant", label: "Distant", icon: Globe },
  { path: "/local", label: "Local", icon: Wifi },
  { path: "/bookmarks", label: "Bookmarks", icon: Bookmark },
]

const futureNav = [
  { path: "/stats", label: "Stats", icon: BarChart3 },
  { path: "/domotique", label: "Domotique", icon: Thermometer },
  { path: "/logs", label: "Logs", icon: Activity },
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  return (
    <motion.div
      variants={sidebarVariants}
      animate={isOpen ? "open" : "closed"}
      className="flex h-full flex-col border-r border-zinc-800 bg-[#0c0c0e]"
    >
      <div className="flex h-16 items-center gap-3 px-4">
        <Hexagon className="h-6 w-6 shrink-0 text-blue-500" />
        {isOpen && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg font-semibold text-zinc-50"
          >
            Freedash
          </motion.span>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-2">
        {mvpNav.map((item) => (
          <SidebarItem
            key={item.path}
            path={item.path}
            label={item.label}
            icon={item.icon}
            isOpen={isOpen}
            isActive={location.pathname === item.path}
          />
        ))}

        <Separator className="my-2 bg-zinc-800" />

        {futureNav.map((item) => (
          <SidebarItem
            key={item.path}
            path={item.path}
            label={item.label}
            icon={item.icon}
            isOpen={isOpen}
            isActive={false}
            disabled
          />
        ))}

        <Separator className="my-2 bg-zinc-800" />

        <div className="mt-auto">
          <SidebarItem
            path="/admin"
            label="Admin"
            icon={Settings}
            isOpen={isOpen}
            isActive={location.pathname === "/admin"}
          />
        </div>
      </nav>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-12 items-center justify-center border-t border-zinc-800 text-zinc-400 transition-colors hover:text-zinc-50"
      >
        {isOpen ? <ChevronsLeft className="h-5 w-5" /> : <ChevronsRight className="h-5 w-5" />}
      </button>
    </motion.div>
  )
}
