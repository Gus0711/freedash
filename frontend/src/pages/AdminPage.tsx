import { useState } from "react"
import { motion } from "framer-motion"
import { Settings, ExternalLink, Plus } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useServices } from "@/hooks/useServices"
import { useCategories } from "@/hooks/useCategories"
import { useSettings } from "@/hooks/useSettings"
import { ServiceList } from "@/components/admin/ServiceList"
import { ServiceForm } from "@/components/admin/ServiceForm"
import { CategoryList } from "@/components/admin/CategoryList"
import { CategoryForm } from "@/components/admin/CategoryForm"
import { SettingsForm } from "@/components/admin/SettingsForm"
import pb from "@/lib/pocketbase"
import type { Service, Category, Settings as SettingsType } from "@/lib/types"

export default function AdminPage() {
  const { services, refetch: refetchServices } = useServices({ includeInactive: true })
  const { categories, refetch: refetchCategories } = useCategories()
  const { settings, refetch: refetchSettings } = useSettings()

  const [serviceFormOpen, setServiceFormOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [categoryFormOpen, setCategoryFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const handleSaveService = async (data: Partial<Service>) => {
    if (editingService) {
      await pb.collection("services").update(editingService.id, data)
    } else {
      await pb.collection("services").create(data)
    }
    setServiceFormOpen(false)
    setEditingService(null)
    refetchServices()
  }

  const handleDeleteService = async (id: string) => {
    await pb.collection("services").delete(id)
    refetchServices()
  }

  const handleSaveCategory = async (data: Partial<Category>) => {
    if (editingCategory) {
      await pb.collection("categories").update(editingCategory.id, data)
    } else {
      await pb.collection("categories").create(data)
    }
    setCategoryFormOpen(false)
    setEditingCategory(null)
    refetchCategories()
  }

  const handleDeleteCategory = async (id: string) => {
    await pb.collection("categories").delete(id)
    refetchCategories()
  }

  const handleSaveSettings = async (data: Partial<SettingsType>) => {
    if (settings) {
      await pb.collection("settings").update(settings.id, data)
    } else {
      await pb.collection("settings").create(data)
    }
    refetchSettings()
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-zinc-400" />
          <h1 className="text-2xl font-bold text-zinc-50">Administration</h1>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.open("/_/", "_blank")}>
          Ouvrir Admin PocketBase
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="services">
        <TabsList>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="settings">Parametres</TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          <div className="mb-4">
            <Button
              onClick={() => { setEditingService(null); setServiceFormOpen(true) }}
              size="sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un service
            </Button>
          </div>
          <ServiceList
            services={services}
            onEdit={(s) => { setEditingService(s); setServiceFormOpen(true) }}
            onDelete={handleDeleteService}
          />
          <ServiceForm
            open={serviceFormOpen}
            onOpenChange={setServiceFormOpen}
            service={editingService}
            categories={categories}
            onSave={handleSaveService}
          />
        </TabsContent>

        <TabsContent value="categories">
          <div className="mb-4">
            <Button
              onClick={() => { setEditingCategory(null); setCategoryFormOpen(true) }}
              size="sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une categorie
            </Button>
          </div>
          <CategoryList
            categories={categories}
            onEdit={(c) => { setEditingCategory(c); setCategoryFormOpen(true) }}
            onDelete={handleDeleteCategory}
          />
          <CategoryForm
            open={categoryFormOpen}
            onOpenChange={setCategoryFormOpen}
            category={editingCategory}
            onSave={handleSaveCategory}
          />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsForm settings={settings} onSave={handleSaveSettings} />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
