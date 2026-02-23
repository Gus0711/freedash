import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface SidebarItemProps {
  path: string
  label: string
  icon: LucideIcon
  isOpen: boolean
  isActive: boolean
  disabled?: boolean
}

export default function SidebarItem({
  path,
  label,
  icon: Icon,
  isOpen,
  isActive,
  disabled,
}: SidebarItemProps) {
  const content = (
    <motion.div
      whileHover={disabled ? undefined : { x: 2 }}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        isActive && "border-l-2 border-blue-500 bg-zinc-800 text-zinc-50",
        disabled && "cursor-default text-zinc-600",
        !isActive && !disabled && "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-50"
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {isOpen && <span className="truncate">{label}</span>}
    </motion.div>
  )

  if (disabled) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div>{content}</div>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Bientot disponible</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link to={path}>{content}</Link>
      </TooltipTrigger>
      {!isOpen && (
        <TooltipContent side="right">
          <p>{label}</p>
        </TooltipContent>
      )}
    </Tooltip>
  )
}
