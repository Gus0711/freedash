import type { Category } from "@/lib/types"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"

interface CategoryListProps {
  categories: Category[]
  onEdit: (cat: Category) => void
  onDelete: (id: string) => void
}

export function CategoryList({ categories, onEdit, onDelete }: CategoryListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-zinc-800">
          <TableHead className="w-10">Couleur</TableHead>
          <TableHead>Icone</TableHead>
          <TableHead>Nom</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead className="w-20">Ordre</TableHead>
          <TableHead className="w-24 text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-zinc-500 py-8">
              Aucune categorie trouvee.
            </TableCell>
          </TableRow>
        )}
        {categories.map((cat) => (
          <TableRow key={cat.id} className="border-zinc-800">
            <TableCell>
              <span
                className="inline-block size-4 rounded-full border border-zinc-700"
                style={{ backgroundColor: cat.color || "#71717a" }}
              />
            </TableCell>
            <TableCell className="text-zinc-400">
              {cat.icon || "-"}
            </TableCell>
            <TableCell className="font-medium text-zinc-100">
              {cat.name}
            </TableCell>
            <TableCell className="text-zinc-400 font-mono text-xs">
              {cat.slug}
            </TableCell>
            <TableCell className="text-zinc-400">
              {cat.sort_order}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => onEdit(cat)}
                  title="Modifier"
                >
                  <Pencil className="size-3.5 text-zinc-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => onDelete(cat.id)}
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
