import { useState, useEffect } from "react"
import type { Category } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface CategoryFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Category | null
  onSave: (data: Partial<Category>) => void
}

const EMPTY_FORM: Partial<Category> = {
  name: "",
  slug: "",
  icon: "",
  color: "",
  sort_order: 0,
}

export function CategoryForm({
  open,
  onOpenChange,
  category,
  onSave,
}: CategoryFormProps) {
  const [form, setForm] = useState<Partial<Category>>(EMPTY_FORM)

  useEffect(() => {
    if (category) {
      setForm({
        name: category.name,
        slug: category.slug,
        icon: category.icon,
        color: category.color,
        sort_order: category.sort_order,
      })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [category, open])

  function handleField(field: keyof typeof form, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave(form)
  }

  const isEdit = category !== null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Modifier la categorie" : "Ajouter une categorie"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cat-name">Nom *</Label>
            <Input
              id="cat-name"
              value={form.name ?? ""}
              onChange={(e) => handleField("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cat-slug">Slug *</Label>
            <Input
              id="cat-slug"
              value={form.slug ?? ""}
              onChange={(e) => handleField("slug", e.target.value)}
              placeholder="ex: media, infra, outils"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cat-icon">Icone (nom Lucide)</Label>
              <Input
                id="cat-icon"
                value={form.icon ?? ""}
                onChange={(e) => handleField("icon", e.target.value)}
                placeholder="ex: server, film, wrench"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-color">Couleur (hex)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="cat-color"
                  value={form.color ?? ""}
                  onChange={(e) => handleField("color", e.target.value)}
                  placeholder="#3b82f6"
                  className="flex-1"
                />
                {form.color && (
                  <span
                    className="inline-block size-6 shrink-0 rounded-md border border-zinc-700"
                    style={{ backgroundColor: form.color }}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cat-sort">Ordre de tri</Label>
            <Input
              id="cat-sort"
              type="number"
              value={form.sort_order ?? 0}
              onChange={(e) => handleField("sort_order", parseInt(e.target.value, 10) || 0)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit">
              {isEdit ? "Enregistrer" : "Creer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
