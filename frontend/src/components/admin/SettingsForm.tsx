import { useState, useEffect } from "react"
import type { Settings } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Save } from "lucide-react"

interface SettingsFormProps {
  settings: Settings | null
  onSave: (data: Partial<Settings>) => void
}

export function SettingsForm({ settings, onSave }: SettingsFormProps) {
  const [form, setForm] = useState<Partial<Settings>>({
    site_title: "",
    weather_latitude: 0,
    weather_longitude: 0,
    weather_city: "",
    theme: "dark",
    sidebar_default_open: true,
    deezer_url: "",
    ha_url: "",
    ha_token: "",
    ha_player_entity_id: "",
  })

  useEffect(() => {
    if (settings) {
      setForm({
        site_title: settings.site_title,
        weather_latitude: settings.weather_latitude,
        weather_longitude: settings.weather_longitude,
        weather_city: settings.weather_city,
        theme: settings.theme,
        sidebar_default_open: settings.sidebar_default_open,
        deezer_url: settings.deezer_url,
        ha_url: settings.ha_url,
        ha_token: settings.ha_token,
        ha_player_entity_id: settings.ha_player_entity_id,
      })
    }
  }, [settings])

  function handleField(field: keyof typeof form, value: string | number | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave(form)
  }

  return (
    <Card className="border-zinc-800 bg-zinc-900/50">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="set-title">Titre du site</Label>
            <Input
              id="set-title"
              value={form.site_title ?? ""}
              onChange={(e) => handleField("site_title", e.target.value)}
              placeholder="Freedash"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="set-city">Ville meteo</Label>
              <Input
                id="set-city"
                value={form.weather_city ?? ""}
                onChange={(e) => handleField("weather_city", e.target.value)}
                placeholder="Montreal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="set-lat">Latitude</Label>
              <Input
                id="set-lat"
                type="number"
                step="0.0001"
                value={form.weather_latitude ?? 0}
                onChange={(e) =>
                  handleField("weather_latitude", parseFloat(e.target.value) || 0)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="set-lon">Longitude</Label>
              <Input
                id="set-lon"
                type="number"
                step="0.0001"
                value={form.weather_longitude ?? 0}
                onChange={(e) =>
                  handleField("weather_longitude", parseFloat(e.target.value) || 0)
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="set-theme">Theme</Label>
            <Input
              id="set-theme"
              value="dark"
              disabled
              className="text-zinc-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="set-deezer">URL Deezer (playlist, album, artiste)</Label>
            <Input
              id="set-deezer"
              value={form.deezer_url ?? ""}
              onChange={(e) => handleField("deezer_url", e.target.value)}
              placeholder="https://www.deezer.com/fr/playlist/53362031"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="set-ha-url">Home Assistant URL</Label>
              <Input
                id="set-ha-url"
                value={form.ha_url ?? ""}
                onChange={(e) => handleField("ha_url", e.target.value)}
                placeholder="http://192.168.1.202:8123"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="set-ha-entity">Player Entity ID</Label>
              <Input
                id="set-ha-entity"
                value={form.ha_player_entity_id ?? ""}
                onChange={(e) => handleField("ha_player_entity_id", e.target.value)}
                placeholder="media_player.ma_yhh8puhihy"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="set-ha-token">Token Home Assistant</Label>
            <Input
              id="set-ha-token"
              type="password"
              value={form.ha_token ?? ""}
              onChange={(e) => handleField("ha_token", e.target.value)}
              placeholder="eyJhbGciOiJIUzI1..."
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="set-sidebar"
              checked={form.sidebar_default_open ?? true}
              onCheckedChange={(v) => handleField("sidebar_default_open", v)}
            />
            <Label htmlFor="set-sidebar">Sidebar ouverte par defaut</Label>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit">
              <Save className="size-4" />
              Enregistrer
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
