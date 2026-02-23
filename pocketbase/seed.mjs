/**
 * Freedash — PocketBase Seed Script
 *
 * Usage:
 *   1. Start PocketBase: docker compose up pocketbase -d
 *   2. Create admin account at http://localhost:8090/_/
 *   3. Create the 3 collections (categories, services, settings) — see docs/seed-data.md
 *   4. Run: node pocketbase/seed.mjs <admin-email> <admin-password>
 *
 * This script will authenticate as admin and create all initial data.
 */

const PB_URL = process.env.PB_URL || "http://localhost:8090"
const [email, password] = process.argv.slice(2)

if (!email || !password) {
  console.error("Usage: node pocketbase/seed.mjs <admin-email> <admin-password>")
  process.exit(1)
}

// ─── Categories ──────────────────────────────────────────────
const categories = [
  { name: "Infrastructure", slug: "infrastructure", icon: "server",     color: "#3b82f6", sort_order: 10 },
  { name: "Domotique",      slug: "domotique",      icon: "home",       color: "#22c55e", sort_order: 20 },
  { name: "Media",           slug: "media",          icon: "play",       color: "#8b5cf6", sort_order: 30 },
  { name: "Productivite",    slug: "productivite",   icon: "file-text",  color: "#f59e0b", sort_order: 40 },
  { name: "Veille",          slug: "veille",         icon: "rss",        color: "#ec4899", sort_order: 50 },
]

// ─── Services (merged from Homepage distant + local tabs) ────
// icon_slug = Dashboard Icons CDN slug (empty string if none)
// icon_fallback = Lucide icon name for fallback
const services = [
  // Infrastructure
  { name: "Proxmox",        description: "Hyperviseur principal",   icon_slug: "proxmox",       icon_fallback: "monitor",    url_external: "https://prox.datagtb.com",       url_local: "https://192.168.1.200:8006",  category_slug: "infrastructure", sort_order: 10, is_favorite: true  },
  { name: "Portainer",      description: "Orchestration Docker",    icon_slug: "portainer",     icon_fallback: "container",  url_external: "https://portainer.datagtb.com",  url_local: "https://192.168.1.205:9443",  category_slug: "infrastructure", sort_order: 20, is_favorite: true  },
  { name: "Netdata",        description: "Monitoring centralise",   icon_slug: "netdata",       icon_fallback: "activity",   url_external: "https://app.netdata.cloud",      url_local: "http://192.168.1.200:19999",  category_slug: "infrastructure", sort_order: 30, is_favorite: false },
  { name: "File Browser",   description: "Explorateur de fichiers", icon_slug: "filebrowser",   icon_fallback: "folder",     url_external: "https://fb.datagtb.com",         url_local: "http://192.168.1.205:8889",   category_slug: "infrastructure", sort_order: 40, is_favorite: false },
  { name: "Code Server",    description: "IDE Web",                 icon_slug: "code-server",   icon_fallback: "code",       url_external: "https://vscode.datagtb.com",     url_local: "http://192.168.1.205:8443",   category_slug: "infrastructure", sort_order: 50, is_favorite: false },
  { name: "Plan IP",        description: "Cartographie reseau",     icon_slug: "",              icon_fallback: "network",    url_external: "https://ip.datagtb.com",         url_local: "http://192.168.1.200:8888",   category_slug: "infrastructure", sort_order: 60, is_favorite: false },

  // Domotique
  { name: "Home Assistant",    description: "Maison intelligente",  icon_slug: "home-assistant", icon_fallback: "home",      url_external: "https://ha.datagtb.com",         url_local: "http://192.168.1.202:8123",   category_slug: "domotique", sort_order: 10, is_favorite: true  },
  { name: "Milesight Gateway", description: "Gateway LoRa Maison", icon_slug: "",               icon_fallback: "radio",     url_external: "https://milesight.datagtb.com",  url_local: "https://192.168.1.206",       category_slug: "domotique", sort_order: 20, is_favorite: false },
  { name: "AdGuard Home",     description: "DNS securise",          icon_slug: "adguard-home",  icon_fallback: "shield",    url_external: "https://adguard.datagtb.com",    url_local: "http://192.168.1.201",        category_slug: "domotique", sort_order: 30, is_favorite: false },
  { name: "Zigbee2MQTT",      description: "Bridge Zigbee",         icon_slug: "zigbee2mqtt",   icon_fallback: "radio",     url_external: "",                               url_local: "http://192.168.1.207:8080",   category_slug: "domotique", sort_order: 40, is_favorite: false },

  // Media
  { name: "Jellyfin", description: "Streaming personnel", icon_slug: "jellyfin", icon_fallback: "play",       url_external: "https://gustflix.datagtb.com", url_local: "http://192.168.1.205:8096", category_slug: "media", sort_order: 10, is_favorite: true  },
  { name: "Immich",   description: "Galerie photos",      icon_slug: "immich",   icon_fallback: "image",      url_external: "https://photos.datagtb.com",   url_local: "http://192.168.1.205:2283", category_slug: "media", sort_order: 20, is_favorite: true  },
  { name: "Romm",     description: "ROMs retro",          icon_slug: "",         icon_fallback: "gamepad-2",  url_external: "",                             url_local: "http://192.168.1.205:8082", category_slug: "media", sort_order: 30, is_favorite: false },

  // Productivite
  { name: "Paperless-ngx", description: "Archives numeriques",  icon_slug: "paperless-ngx", icon_fallback: "file-text",   url_external: "https://docs.datagtb.com",    url_local: "http://192.168.1.205:8000", category_slug: "productivite", sort_order: 10, is_favorite: false },
  { name: "ConvertX",      description: "Convertisseur",        icon_slug: "",              icon_fallback: "repeat",      url_external: "https://convert.datagtb.com", url_local: "http://192.168.1.205:3100", category_slug: "productivite", sort_order: 20, is_favorite: false },
  { name: "Memos",         description: "Notes couple",         icon_slug: "memos",         icon_fallback: "sticky-note", url_external: "https://notes.datagtb.com",   url_local: "http://192.168.1.205:5230", category_slug: "productivite", sort_order: 30, is_favorite: false },
  { name: "Vaultwarden",   description: "Coffre-fort MDP",      icon_slug: "vaultwarden",   icon_fallback: "lock",        url_external: "https://vault.datagtb.com",   url_local: "https://vault.datagtb.com", category_slug: "productivite", sort_order: 40, is_favorite: true  },
  { name: "ActivityWatch",  description: "Suivi d'activite PC", icon_slug: "",              icon_fallback: "activity",    url_external: "",                            url_local: "http://localhost:5600",     category_slug: "productivite", sort_order: 50, is_favorite: false },

  // Veille
  { name: "FreshRSS",       description: "Flux d'actualites",  icon_slug: "freshrss",  icon_fallback: "rss",      url_external: "https://freshrss.datagtb.com",     url_local: "http://192.168.1.205:8084", category_slug: "veille", sort_order: 10, is_favorite: false },
  { name: "RSS-Bridge",     description: "Generateur RSS",     icon_slug: "",          icon_fallback: "link",     url_external: "https://rss-bridge.datagtb.com",   url_local: "http://192.168.1.205:8083", category_slug: "veille", sort_order: 20, is_favorite: false },
  { name: "n8n",            description: "Automatisation",      icon_slug: "n8n",       icon_fallback: "workflow", url_external: "https://n8n.datagtb.com",          url_local: "http://192.168.1.205:5678", category_slug: "veille", sort_order: 30, is_favorite: false },
  { name: "GTB Downloader", description: "Telechargements",    icon_slug: "",          icon_fallback: "download", url_external: "https://dl.datagtb.com",           url_local: "http://192.168.1.205:8001", category_slug: "veille", sort_order: 40, is_favorite: false },
]

// ─── Settings ────────────────────────────────────────────────
const settings = {
  site_title: "Freedash",
  weather_latitude: 48.8566,
  weather_longitude: 2.3522,
  weather_city: "Paris",
  theme: "dark",
  sidebar_default_open: false,
}

// ─── Seed logic ──────────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const res = await fetch(`${PB_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`${res.status} ${path}: ${body}`)
  }
  return res.json()
}

async function main() {
  console.log(`Connecting to PocketBase at ${PB_URL}...`)

  // Auth as admin
  const auth = await apiFetch("/api/admins/auth-with-password", {
    method: "POST",
    body: JSON.stringify({ identity: email, password }),
  })
  const token = auth.token
  const authHeaders = { Authorization: `Bearer ${token}` }
  console.log("Authenticated as admin.")

  // Create categories
  console.log("\n--- Categories ---")
  const catMap = new Map()
  for (const cat of categories) {
    try {
      const created = await apiFetch("/api/collections/categories/records", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(cat),
      })
      catMap.set(cat.slug, created.id)
      console.log(`  + ${cat.name} (${created.id})`)
    } catch (e) {
      console.log(`  ! ${cat.name}: ${e.message}`)
    }
  }

  // Create services
  console.log("\n--- Services ---")
  for (const svc of services) {
    const catId = catMap.get(svc.category_slug)
    if (!catId) {
      console.log(`  ! ${svc.name}: category "${svc.category_slug}" not found, skipping`)
      continue
    }
    const { category_slug, ...data } = svc
    try {
      const created = await apiFetch("/api/collections/services/records", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          ...data,
          category: catId,
          is_active: true,
          open_in_new_tab: true,
        }),
      })
      console.log(`  + ${svc.name} (${created.id})`)
    } catch (e) {
      console.log(`  ! ${svc.name}: ${e.message}`)
    }
  }

  // Create settings
  console.log("\n--- Settings ---")
  try {
    const created = await apiFetch("/api/collections/settings/records", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify(settings),
    })
    console.log(`  + Settings (${created.id})`)
  } catch (e) {
    console.log(`  ! Settings: ${e.message}`)
  }

  console.log("\nSeed complete!")
  console.log(`  Categories: ${categories.length}`)
  console.log(`  Services:   ${services.length}`)
  console.log(`  Favorites:  ${services.filter(s => s.is_favorite).length}`)
}

main().catch((e) => {
  console.error("Seed failed:", e.message)
  process.exit(1)
})
