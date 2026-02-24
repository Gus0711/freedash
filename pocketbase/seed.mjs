/**
 * Freedash — PocketBase Seed Script (PocketBase 0.25+)
 *
 * Usage:
 *   1. Start PocketBase: docker compose up pocketbase -d
 *   2. Create superuser: docker exec -it freedash-pb /app/pocketbase superuser create email password
 *   3. Run: node pocketbase/seed.mjs <email> <password>
 *
 * This script will:
 *   - Authenticate as superuser
 *   - Create the 5 collections (categories, services, settings, bookmark_folders, bookmarks)
 *   - Insert all seed data (5 categories, 22 services, 1 settings row, 4 folders, 16 bookmarks)
 */

const PB_URL = process.env.PB_URL || "http://localhost:8090"
const [email, password] = process.argv.slice(2)

if (!email || !password) {
  console.error("Usage: node pocketbase/seed.mjs <admin-email> <admin-password>")
  process.exit(1)
}

// ─── Collection schemas ─────────────────────────────────────
const collectionsSchema = [
  {
    name: "categories",
    type: "base",
    fields: [
      { name: "name",       type: "text", required: true, options: {} },
      { name: "slug",       type: "text", required: true, options: {} },
      { name: "icon",       type: "text", required: false, options: {} },
      { name: "color",      type: "text", required: false, options: {} },
      { name: "sort_order", type: "number", required: true, options: {} },
    ],
    indexes: [
      "CREATE UNIQUE INDEX idx_categories_name ON categories (name)",
      "CREATE UNIQUE INDEX idx_categories_slug ON categories (slug)",
    ],
    listRule: "",
    viewRule: "",
    createRule: "@request.auth.id != ''",
    updateRule: "@request.auth.id != ''",
    deleteRule: "@request.auth.id != ''",
  },
  {
    name: "services",
    type: "base",
    fields: [
      { name: "name",            type: "text",     required: true,  options: {} },
      { name: "description",     type: "text",     required: false, options: {} },
      { name: "url_external",    type: "url",      required: false, options: {} },
      { name: "url_local",       type: "url",      required: false, options: {} },
      { name: "icon_slug",       type: "text",     required: false, options: {} },
      { name: "icon_fallback",   type: "text",     required: false, options: {} },
      { name: "category",        type: "relation", required: true,  collectionId: "", maxSelect: 1 },
      { name: "sort_order",      type: "number",   required: true,  options: {} },
      { name: "is_favorite",     type: "bool",     required: false, options: {} },
      { name: "is_active",       type: "bool",     required: false, options: {} },
      { name: "open_in_new_tab", type: "bool",     required: false, options: {} },
      { name: "notes",           type: "text",     required: false, options: {} },
    ],
    listRule: "",
    viewRule: "",
    createRule: "@request.auth.id != ''",
    updateRule: "@request.auth.id != ''",
    deleteRule: "@request.auth.id != ''",
  },
  {
    name: "settings",
    type: "base",
    fields: [
      { name: "site_title",           type: "text",   required: false, options: {} },
      { name: "weather_latitude",     type: "number", required: false, options: {} },
      { name: "weather_longitude",    type: "number", required: false, options: {} },
      { name: "weather_city",         type: "text",   required: false, options: {} },
      { name: "theme",                type: "text",   required: false, options: {} },
      { name: "sidebar_default_open", type: "bool",   required: false, options: {} },
      { name: "deezer_url",          type: "url",    required: false, options: {} },
    ],
    listRule: "",
    viewRule: "",
    createRule: "@request.auth.id != ''",
    updateRule: "@request.auth.id != ''",
    deleteRule: "@request.auth.id != ''",
  },
  {
    name: "bookmark_folders",
    type: "base",
    fields: [
      { name: "name",       type: "text",   required: true,  options: {} },
      { name: "icon",       type: "text",   required: false, options: {} },
      { name: "color",      type: "text",   required: false, options: {} },
      { name: "sort_order", type: "number", required: true,  options: {} },
    ],
    indexes: [
      "CREATE UNIQUE INDEX idx_bookmark_folders_name ON bookmark_folders (name)",
    ],
    listRule: "",
    viewRule: "",
    createRule: "@request.auth.id != ''",
    updateRule: "@request.auth.id != ''",
    deleteRule: "@request.auth.id != ''",
  },
  {
    name: "bookmarks",
    type: "base",
    fields: [
      { name: "name",         type: "text",     required: true,  options: {} },
      { name: "url",          type: "url",      required: true,  options: {} },
      { name: "icon_url",     type: "text",     required: false, options: {} },
      { name: "abbreviation", type: "text",     required: false, options: {} },
      { name: "folder",       type: "relation", required: true,  collectionId: "", maxSelect: 1 },
      { name: "sort_order",   type: "number",   required: true,  options: {} },
    ],
    listRule: "",
    viewRule: "",
    createRule: "@request.auth.id != ''",
    updateRule: "@request.auth.id != ''",
    deleteRule: "@request.auth.id != ''",
  },
]

// ─── Categories ──────────────────────────────────────────────
const categories = [
  { name: "Infrastructure", slug: "infrastructure", icon: "server",     color: "#3b82f6", sort_order: 10 },
  { name: "Domotique",      slug: "domotique",      icon: "home",       color: "#22c55e", sort_order: 20 },
  { name: "Media",           slug: "media",          icon: "play",       color: "#8b5cf6", sort_order: 30 },
  { name: "Productivite",    slug: "productivite",   icon: "file-text",  color: "#f59e0b", sort_order: 40 },
  { name: "Veille",          slug: "veille",         icon: "rss",        color: "#ec4899", sort_order: 50 },
]

// ─── Services (merged from Homepage distant + local tabs) ────
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
  weather_latitude: 49.2583,
  weather_longitude: 3.9842,
  weather_city: "Reims",
  theme: "dark",
  sidebar_default_open: false,
  deezer_url: "https://www.deezer.com/fr/playlist/53362031",
}

// ─── Bookmark Folders ────────────────────────────────────────
const bookmarkFolders = [
  { name: "Google",    icon: "globe",    color: "#4285f4", sort_order: 10 },
  { name: "Outils IA", icon: "sparkles", color: "#8b5cf6", sort_order: 20 },
  { name: "Dev",       icon: "code",     color: "#22c55e", sort_order: 30 },
  { name: "Medias",    icon: "play",     color: "#ef4444", sort_order: 40 },
]

// ─── Bookmarks ───────────────────────────────────────────────
const bookmarks = [
  // Google
  { name: "Gmail",          url: "https://mail.google.com",       icon_url: "gmail",       abbreviation: "GM", folder_name: "Google",    sort_order: 10 },
  { name: "Google Drive",   url: "https://drive.google.com",      icon_url: "google-drive", abbreviation: "GD", folder_name: "Google",    sort_order: 20 },
  { name: "Google Calendar", url: "https://calendar.google.com",  icon_url: "google-calendar", abbreviation: "GC", folder_name: "Google", sort_order: 30 },
  { name: "YouTube",        url: "https://www.youtube.com",       icon_url: "youtube",     abbreviation: "YT", folder_name: "Google",    sort_order: 40 },

  // Outils IA
  { name: "ChatGPT",    url: "https://chat.openai.com",     icon_url: "chatgpt",     abbreviation: "GP", folder_name: "Outils IA", sort_order: 10 },
  { name: "Claude",     url: "https://claude.ai",           icon_url: "https://www.anthropic.com/favicon.ico", abbreviation: "CL", folder_name: "Outils IA", sort_order: 20 },
  { name: "Perplexity", url: "https://www.perplexity.ai",   icon_url: "perplexity",  abbreviation: "PX", folder_name: "Outils IA", sort_order: 30 },
  { name: "Midjourney", url: "https://www.midjourney.com",  icon_url: "midjourney",  abbreviation: "MJ", folder_name: "Outils IA", sort_order: 40 },

  // Dev
  { name: "GitHub",       url: "https://github.com",            icon_url: "github",      abbreviation: "GH", folder_name: "Dev", sort_order: 10 },
  { name: "Stack Overflow", url: "https://stackoverflow.com",   icon_url: "stackoverflow", abbreviation: "SO", folder_name: "Dev", sort_order: 20 },
  { name: "NPM",          url: "https://www.npmjs.com",         icon_url: "npm",         abbreviation: "NP", folder_name: "Dev", sort_order: 30 },
  { name: "MDN",          url: "https://developer.mozilla.org", icon_url: "https://developer.mozilla.org/favicon-48x48.png", abbreviation: "MD", folder_name: "Dev", sort_order: 40 },

  // Medias
  { name: "Reddit",    url: "https://www.reddit.com",       icon_url: "reddit",   abbreviation: "RD", folder_name: "Medias", sort_order: 10 },
  { name: "Twitch",    url: "https://www.twitch.tv",        icon_url: "twitch",   abbreviation: "TW", folder_name: "Medias", sort_order: 20 },
  { name: "Spotify",   url: "https://open.spotify.com",     icon_url: "spotify",  abbreviation: "SP", folder_name: "Medias", sort_order: 30 },
  { name: "Twitter/X", url: "https://x.com",                icon_url: "twitter",  abbreviation: "TX", folder_name: "Medias", sort_order: 40 },
]

// ─── Seed logic ──────────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const { headers: optHeaders, ...restOptions } = options
  const res = await fetch(`${PB_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...optHeaders },
    ...restOptions,
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`${res.status} ${path}: ${body}`)
  }
  return res.json()
}

async function main() {
  console.log(`Connecting to PocketBase at ${PB_URL}...`)

  // Auth as superuser (PocketBase 0.25+)
  const auth = await apiFetch("/api/collections/_superusers/auth-with-password", {
    method: "POST",
    body: JSON.stringify({ identity: email, password }),
  })
  const token = auth.token
  const authHeaders = { Authorization: `Bearer ${token}` }
  console.log("Authenticated as superuser.")

  // ── Create collections ──────────────────────────────────
  console.log("\n=== Creating collections ===")
  const collectionIds = {}

  // Helper: create or fetch+update existing collection (syncs schema)
  async function createOrFetch(col) {
    try {
      const created = await apiFetch("/api/collections", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(col),
      })
      collectionIds[col.name] = created.id
      console.log(`  + Collection "${col.name}" (${created.id})`)
    } catch (e) {
      // Already exists — fetch and update schema to add missing fields
      try {
        const existing = await apiFetch(`/api/collections/${col.name}`, {
          headers: authHeaders,
        })
        collectionIds[col.name] = existing.id

        // Merge fields: add any new fields from schema that don't exist yet
        const existingFieldNames = new Set(existing.fields.map(f => f.name))
        const newFields = (col.fields || []).filter(f => !existingFieldNames.has(f.name))
        if (newFields.length > 0) {
          const mergedFields = [...existing.fields, ...newFields]
          await apiFetch(`/api/collections/${col.name}`, {
            method: "PATCH",
            headers: authHeaders,
            body: JSON.stringify({ fields: mergedFields }),
          })
          console.log(`  ~ Collection "${col.name}" updated — added fields: ${newFields.map(f => f.name).join(", ")}`)
        } else {
          console.log(`  ~ Collection "${col.name}" already exists (${existing.id})`)
        }
      } catch {
        throw new Error(`Failed to create "${col.name}": ${e.message}`)
      }
    }
  }

  // 1. Create collections without relations first (categories, settings, bookmark_folders)
  for (const col of collectionsSchema.filter(c => c.name !== "services" && c.name !== "bookmarks")) {
    await createOrFetch(col)
  }

  // 2. Create services with correct category relation collectionId
  const svcSchema = collectionsSchema.find(c => c.name === "services")
  const svcWithRelation = {
    ...svcSchema,
    fields: svcSchema.fields.map(f =>
      f.name === "category"
        ? { ...f, collectionId: collectionIds["categories"], maxSelect: 1 }
        : f
    ),
  }
  await createOrFetch(svcWithRelation)

  // 3. Create bookmarks with correct folder relation collectionId
  const bmkSchema = collectionsSchema.find(c => c.name === "bookmarks")
  const bmkWithRelation = {
    ...bmkSchema,
    fields: bmkSchema.fields.map(f =>
      f.name === "folder"
        ? { ...f, collectionId: collectionIds["bookmark_folders"], maxSelect: 1 }
        : f
    ),
  }
  await createOrFetch(bmkWithRelation)

  // ── Create categories ───────────────────────────────────
  console.log("\n=== Seeding categories ===")
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

  // ── Create services ─────────────────────────────────────
  console.log("\n=== Seeding services ===")
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

  // ── Create bookmark folders ─────────────────────────────
  console.log("\n=== Seeding bookmark folders ===")
  const folderMap = new Map()
  for (const folder of bookmarkFolders) {
    try {
      const created = await apiFetch("/api/collections/bookmark_folders/records", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(folder),
      })
      folderMap.set(folder.name, created.id)
      console.log(`  + ${folder.name} (${created.id})`)
    } catch (e) {
      console.log(`  ! ${folder.name}: ${e.message}`)
    }
  }

  // ── Create bookmarks ──────────────────────────────────
  console.log("\n=== Seeding bookmarks ===")
  for (const bmk of bookmarks) {
    const folderId = folderMap.get(bmk.folder_name)
    if (!folderId) {
      console.log(`  ! ${bmk.name}: folder "${bmk.folder_name}" not found, skipping`)
      continue
    }
    const { folder_name, ...data } = bmk
    try {
      const created = await apiFetch("/api/collections/bookmarks/records", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ ...data, folder: folderId }),
      })
      console.log(`  + ${bmk.name} (${created.id})`)
    } catch (e) {
      console.log(`  ! ${bmk.name}: ${e.message}`)
    }
  }

  // ── Create or update settings (single row) ─────────────────
  console.log("\n=== Seeding settings ===")
  try {
    const existing = await apiFetch("/api/collections/settings/records?perPage=1", {
      headers: authHeaders,
    })
    if (existing.items?.length > 0) {
      // Update existing record
      const id = existing.items[0].id
      await apiFetch(`/api/collections/settings/records/${id}`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify(settings),
      })
      console.log(`  ~ Settings updated (${id})`)
    } else {
      // No record yet — create one
      const created = await apiFetch("/api/collections/settings/records", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(settings),
      })
      console.log(`  + Settings created (${created.id})`)
    }
  } catch (e) {
    console.log(`  ! Settings: ${e.message}`)
  }

  console.log("\n✓ Seed complete!")
  console.log(`  Collections:      5`)
  console.log(`  Categories:       ${categories.length}`)
  console.log(`  Services:         ${services.length}`)
  console.log(`  Favorites:        ${services.filter(s => s.is_favorite).length}`)
  console.log(`  Bookmark folders: ${bookmarkFolders.length}`)
  console.log(`  Bookmarks:        ${bookmarks.length}`)
}

main().catch((e) => {
  console.error("Seed failed:", e.message)
  process.exit(1)
})
