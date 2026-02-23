import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getDashboardIconUrl } from "@/lib/utils"
import { ExternalLink } from "lucide-react"

interface IconPickerProps {
  value: string
  onChange: (value: string) => void
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [hasError, setHasError] = useState(false)

  const iconUrl = value ? getDashboardIconUrl(value) : ""

  return (
    <div className="space-y-2">
      <Label htmlFor="icon-slug">Slug icone (Dashboard Icons)</Label>
      <div className="flex items-center gap-3">
        <Input
          id="icon-slug"
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setHasError(false)
          }}
          placeholder="ex: proxmox, plex, nextcloud"
          className="flex-1"
        />
        {value && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-zinc-700 bg-zinc-800">
            {hasError ? (
              <span className="text-[9px] leading-tight text-red-400 text-center">
                Icone non trouvee
              </span>
            ) : (
              <img
                src={iconUrl}
                alt={value}
                width={24}
                height={24}
                onError={() => setHasError(true)}
                className="rounded-sm"
              />
            )}
          </div>
        )}
      </div>
      <a
        href="https://github.com/walkxcode/dashboard-icons"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
      >
        <ExternalLink className="size-3" />
        Voir les icones disponibles
      </a>
    </div>
  )
}
