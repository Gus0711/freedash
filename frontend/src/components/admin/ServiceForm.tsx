import { useState, useEffect } from "react"
import type { Service, Category } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IconPicker } from "./IconPicker"

interface ServiceFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  service: Service | null
  categories: Category[]
  onSave: (data: Partial<Service>) => void
}

const EMPTY_FORM: Partial<Service> = {
  name: "",
  description: "",
  url_external: "",
  url_local: "",
  icon_slug: "",
  icon_fallback: "",
  category: "",
  sort_order: 0,
  is_favorite: false,
  is_active: true,
  open_in_new_tab: true,
  notes: "",
}

export function ServiceForm({
  open,
  onOpenChange,
  service,
  categories,
  onSave,
}: ServiceFormProps) {
  const [form, setForm] = useState<Partial<Service>>(EMPTY_FORM)

  useEffect(() => {
    if (service) {
      setForm({
        name: service.name,
        description: service.description,
        url_external: service.url_external,
        url_local: service.url_local,
        icon_slug: service.icon_slug,
        icon_fallback: service.icon_fallback,
        category: service.category,
        sort_order: service.sort_order,
        is_favorite: service.is_favorite,
        is_active: service.is_active,
        open_in_new_tab: service.open_in_new_tab,
        notes: service.notes,
      })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [service, open])

  function handleField(field: keyof typeof form, value: string | number | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave(form)
  }

  const isEdit = service !== null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Modifier le service" : "Ajouter un service"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="svc-name">Nom *</Label>
              <Input
                id="svc-name"
                value={form.name ?? ""}
                onChange={(e) => handleField("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="svc-category">Categorie</Label>
              <Select
                value={form.category ?? ""}
                onValueChange={(v) => handleField("category", v)}
              >
                <SelectTrigger id="svc-category" className="w-full">
                  <SelectValue placeholder="Aucune" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="svc-desc">Description</Label>
            <Input
              id="svc-desc"
              value={form.description ?? ""}
              onChange={(e) => handleField("description", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="svc-url-ext">URL externe</Label>
              <Input
                id="svc-url-ext"
                value={form.url_external ?? ""}
                onChange={(e) => handleField("url_external", e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="svc-url-local">URL locale</Label>
              <Input
                id="svc-url-local"
                value={form.url_local ?? ""}
                onChange={(e) => handleField("url_local", e.target.value)}
                placeholder="http://192.168..."
              />
            </div>
          </div>

          <Separator className="bg-zinc-800" />

          <IconPicker
            value={form.icon_slug ?? ""}
            onChange={(v) => handleField("icon_slug", v)}
          />

          <div className="space-y-2">
            <Label htmlFor="svc-icon-fallback">Icone fallback (emoji ou texte)</Label>
            <Input
              id="svc-icon-fallback"
              value={form.icon_fallback ?? ""}
              onChange={(e) => handleField("icon_fallback", e.target.value)}
              placeholder="ex: P, NX, ..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="svc-sort">Ordre de tri</Label>
            <Input
              id="svc-sort"
              type="number"
              value={form.sort_order ?? 0}
              onChange={(e) => handleField("sort_order", parseInt(e.target.value, 10) || 0)}
            />
          </div>

          <Separator className="bg-zinc-800" />

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Switch
                id="svc-fav"
                checked={form.is_favorite ?? false}
                onCheckedChange={(v) => handleField("is_favorite", v)}
              />
              <Label htmlFor="svc-fav">Favori</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="svc-active"
                checked={form.is_active ?? true}
                onCheckedChange={(v) => handleField("is_active", v)}
              />
              <Label htmlFor="svc-active">Actif</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="svc-newtab"
                checked={form.open_in_new_tab ?? true}
                onCheckedChange={(v) => handleField("open_in_new_tab", v)}
              />
              <Label htmlFor="svc-newtab">Nouvel onglet</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="svc-notes">Notes</Label>
            <textarea
              id="svc-notes"
              value={form.notes ?? ""}
              onChange={(e) => handleField("notes", e.target.value)}
              rows={3}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none dark:bg-input/30"
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
