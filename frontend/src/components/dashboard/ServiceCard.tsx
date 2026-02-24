import { useState } from "react"
import { motion } from "framer-motion"
import { Globe } from "lucide-react"
import { Card } from "@/components/ui/card"
import StatusBadge from "./StatusBadge"
import type { Service, UrlField } from "@/lib/types"
import { getDashboardIconUrl, cleanUrl } from "@/lib/utils"

interface ServiceCardProps {
  service: Service
  urlField: UrlField
}

export default function ServiceCard({ service, urlField }: ServiceCardProps) {
  const [imgError, setImgError] = useState(false)
  const [hovered, setHovered] = useState(false)
  const targetUrl = service[urlField] || service.url_external || service.url_local
  const categoryColor = service.expand?.category?.color ?? "#3b82f6"

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <a
        href={targetUrl}
        target={service.open_in_new_tab ? "_blank" : "_self"}
        rel="noopener noreferrer"
      >
        <Card
          className="glass-card glass-card-hover relative flex flex-row items-center gap-3 p-3"
          style={{
            borderLeft: `3px solid ${categoryColor}`,
            boxShadow: hovered
              ? `0 0 30px ${categoryColor}40, 0 0 60px ${categoryColor}15`
              : "none",
          }}
        >
          <StatusBadge url={targetUrl} />

          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white/[0.06]">
            {!imgError ? (
              <img
                src={getDashboardIconUrl(service.icon_slug)}
                alt={service.name}
                className="h-8 w-8 object-contain"
                onError={() => setImgError(true)}
              />
            ) : (
              <Globe className="h-5 w-5 text-zinc-500" />
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-medium text-zinc-50">
              {service.name}
            </span>
            {service.description && (
              <span className="truncate text-xs text-zinc-400">
                {service.description}
              </span>
            )}
            <span className="truncate text-xs font-mono text-zinc-500">
              {cleanUrl(targetUrl)}
            </span>
          </div>
        </Card>
      </a>
    </motion.div>
  )
}
