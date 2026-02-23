import { motion } from "framer-motion"
import { useServiceStatus } from "@/hooks/useServiceStatus"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  url: string | undefined
}

const colorMap: Record<string, string> = {
  online: "bg-green-500",
  offline: "bg-red-500",
  checking: "bg-amber-500",
}

export default function StatusBadge({ url }: StatusBadgeProps) {
  const status = useServiceStatus(url)

  return (
    <span className="absolute right-2 top-2">
      <motion.span
        className={cn("block h-2 w-2 rounded-full", colorMap[status])}
        animate={
          status === "checking"
            ? { scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }
            : { scale: 1, opacity: 1 }
        }
        transition={
          status === "checking"
            ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.3 }
        }
      />
    </span>
  )
}
