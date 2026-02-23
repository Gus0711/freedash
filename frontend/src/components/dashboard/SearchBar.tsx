import { useRef, useEffect, useCallback } from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSearch } from "@/hooks/useSearch"
import { useServices } from "@/hooks/useServices"
import type { Service } from "@/lib/types"

interface HeaderProps {
  variant: "header"
  value?: never
  onChange?: never
}

interface PageProps {
  variant: "page"
  value: string
  onChange: (value: string) => void
}

type SearchBarProps = HeaderProps | PageProps

export default function SearchBar(props: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { services } = useServices()
  const { results, query, setQuery } = useSearch(
    props.variant === "header" ? services : []
  )

  const handleKeydown = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey && e.key === "k") || (e.key === "/" && document.activeElement === document.body)) {
      e.preventDefault()
      inputRef.current?.focus()
    }
  }, [])

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown)
    return () => window.removeEventListener("keydown", handleKeydown)
  }, [handleKeydown])

  const handleChange = (value: string) => {
    if (props.variant === "header") {
      setQuery(value)
    } else {
      props.onChange(value)
    }
  }

  const showDropdown = props.variant === "header" && query.trim().length > 0

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
      <input
        ref={inputRef}
        type="text"
        placeholder="Rechercher un service... (Ctrl+K)"
        value={props.variant === "header" ? query : props.value}
        onChange={(e) => handleChange(e.target.value)}
        className={cn(
          "h-9 w-full rounded-md border border-zinc-800 bg-zinc-900 pl-9 pr-3 text-sm text-zinc-50",
          "placeholder:text-zinc-500 outline-none transition-colors",
          "focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700"
        )}
      />
      {showDropdown && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border border-zinc-800 bg-zinc-900 p-1 shadow-lg">
          {results.length === 0 ? (
            <p className="px-3 py-2 text-xs text-zinc-500">Aucun resultat</p>
          ) : (
            results.slice(0, 6).map((s: Service) => (
              <a
                key={s.id}
                href={s.url_external || s.url_local}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                {s.name}
              </a>
            ))
          )}
        </div>
      )}
    </div>
  )
}
