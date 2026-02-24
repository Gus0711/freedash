import type { RecordModel } from "pocketbase"

export interface Category extends RecordModel {
  name: string
  slug: string
  icon: string
  color: string
  sort_order: number
}

export interface Service extends RecordModel {
  name: string
  description: string
  url_external: string
  url_local: string
  icon_slug: string
  icon_fallback: string
  category: string
  sort_order: number
  is_favorite: boolean
  is_active: boolean
  open_in_new_tab: boolean
  notes: string
  expand?: {
    category?: Category
  }
}

export interface Settings extends RecordModel {
  site_title: string
  weather_latitude: number
  weather_longitude: number
  weather_city: string
  theme: string
  sidebar_default_open: boolean
  deezer_url: string
  ha_url: string
  ha_token: string
  ha_player_entity_id: string
}

export interface BookmarkFolder extends RecordModel {
  name: string
  icon: string
  color: string
  sort_order: number
}

export interface Bookmark extends RecordModel {
  name: string
  url: string
  icon_url: string
  abbreviation: string
  folder: string
  sort_order: number
  expand?: { folder?: BookmarkFolder }
}

export type ServiceStatus = "online" | "offline" | "checking"

export type UrlField = "url_external" | "url_local"

export interface WeatherData {
  temperature: number
  weathercode: number
}

export interface HourlyForecast {
  time: string
  temperature: number
  weathercode: number
}

export interface NavItem {
  path: string
  label: string
  icon: string
  disabled?: boolean
}
