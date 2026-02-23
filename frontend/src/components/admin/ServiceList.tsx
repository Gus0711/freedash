import type { Service } from "@/lib/types"
import { getDashboardIconUrl, cleanUrl } from "@/lib/utils"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Star, Pencil, Trash2 } from "lucide-react"

interface ServiceListProps {
  services: Service[]
  onEdit: (service: Service) => void
  onDelete: (id: string) => void
}

export function ServiceList({ services, onEdit, onDelete }: ServiceListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-zinc-800">
          <TableHead className="w-10">Icone</TableHead>
          <TableHead>Nom</TableHead>
          <TableHead>URL externe</TableHead>
          <TableHead>URL locale</TableHead>
          <TableHead>Categorie</TableHead>
          <TableHead className="w-10 text-center">Favori</TableHead>
          <TableHead className="w-10 text-center">Actif</TableHead>
          <TableHead className="w-24 text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.length === 0 && (
          <TableRow>
            <TableCell colSpan={8} className="text-center text-zinc-500 py-8">
              Aucun service trouve.
            </TableCell>
          </TableRow>
        )}
        {services.map((service) => (
          <TableRow key={service.id} className="border-zinc-800">
            <TableCell>
              {service.icon_slug ? (
                <img
                  src={getDashboardIconUrl(service.icon_slug)}
                  alt={service.name}
                  width={24}
                  height={24}
                  className="rounded-sm"
                />
              ) : (
                <div className="size-6 rounded-sm bg-zinc-700" />
              )}
            </TableCell>
            <TableCell className="font-medium text-zinc-100">
              {service.name}
            </TableCell>
            <TableCell className="text-zinc-400">
              {service.url_external ? cleanUrl(service.url_external) : "-"}
            </TableCell>
            <TableCell className="text-zinc-400">
              {service.url_local ? cleanUrl(service.url_local) : "-"}
            </TableCell>
            <TableCell className="text-zinc-400">
              {service.expand?.category?.name ?? "-"}
            </TableCell>
            <TableCell className="text-center">
              <Star
                className={`size-4 mx-auto ${
                  service.is_favorite
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-zinc-600"
                }`}
              />
            </TableCell>
            <TableCell className="text-center">
              <span
                className={`inline-block size-2.5 rounded-full ${
                  service.is_active ? "bg-green-500" : "bg-red-500"
                }`}
              />
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => onEdit(service)}
                  title="Modifier"
                >
                  <Pencil className="size-3.5 text-zinc-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => onDelete(service.id)}
                  title="Supprimer"
                >
                  <Trash2 className="size-3.5 text-red-400" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
