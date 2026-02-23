# Seed Data -- Freedash

Guide pour initialiser les donnees PocketBase apres le premier lancement.

## Methode rapide : Script automatique

```bash
# 1. Lancer PocketBase
docker compose up pocketbase -d

# 2. Creer le compte admin sur http://localhost:8090/_/

# 3. Creer les 3 collections (voir section "Collections" ci-dessous)

# 4. Lancer le script de seed
node pocketbase/seed.mjs votre-email@admin.com votre-mot-de-passe
```

Le script cree automatiquement : 5 categories, 22 services, 1 ligne settings.

---

## Methode manuelle : Creer les collections

### Collection `categories`

1. New Collection -> Name: `categories`, Type: Base
2. Champs :
   - `name` : Text, Required, Unique
   - `slug` : Text, Required, Unique
   - `icon` : Text
   - `color` : Text
   - `sort_order` : Number, Required
3. API Rules :
   - List/View : (vide = public)
   - Create/Update/Delete : `@request.auth.id != ""`

### Collection `services`

1. New Collection -> Name: `services`, Type: Base
2. Champs :
   - `name` : Text, Required
   - `description` : Text
   - `url_external` : URL
   - `url_local` : URL
   - `icon_slug` : Text
   - `icon_fallback` : Text
   - `category` : Relation -> categories, Required
   - `sort_order` : Number, Required
   - `is_favorite` : Bool, Default: false
   - `is_active` : Bool, Default: true
   - `open_in_new_tab` : Bool, Default: true
   - `notes` : Text
3. API Rules : memes que `categories`

### Collection `settings`

1. New Collection -> Name: `settings`, Type: Base
2. Champs :
   - `site_title` : Text
   - `weather_latitude` : Number
   - `weather_longitude` : Number
   - `weather_city` : Text
   - `theme` : Text
   - `sidebar_default_open` : Bool
3. API Rules : memes que `categories`

---

## Donnees injectees par le script

### Settings

| Champ                  | Valeur    |
|------------------------|-----------|
| `site_title`           | Freedash  |
| `weather_latitude`     | 48.8566   |
| `weather_longitude`    | 2.3522    |
| `weather_city`         | Paris     |
| `theme`                | dark      |
| `sidebar_default_open` | false     |

### Categories (5)

| name           | slug           | icon       | color   | sort_order |
|----------------|----------------|------------|---------|------------|
| Infrastructure | infrastructure | server     | #3b82f6 | 10         |
| Domotique      | domotique      | home       | #22c55e | 20         |
| Media          | media          | play       | #8b5cf6 | 30         |
| Productivite   | productivite   | file-text  | #f59e0b | 40         |
| Veille         | veille         | rss        | #ec4899 | 50         |

### Services (22) — Source : Homepage YAML

#### Infrastructure (6 services)

| name         | icon_slug    | icon_fallback | url_external                 | url_local                     | fav |
|--------------|-------------|---------------|------------------------------|-------------------------------|-----|
| Proxmox      | proxmox     | monitor       | https://prox.datagtb.com     | https://192.168.1.200:8006    | oui |
| Portainer    | portainer   | container     | https://portainer.datagtb.com| https://192.168.1.205:9443    | oui |
| Netdata      | netdata     | activity      | https://app.netdata.cloud    | http://192.168.1.200:19999    | non |
| File Browser | filebrowser | folder        | https://fb.datagtb.com       | http://192.168.1.205:8889     | non |
| Code Server  | code-server | code          | https://vscode.datagtb.com   | http://192.168.1.205:8443     | non |
| Plan IP      | —           | network       | https://ip.datagtb.com       | http://192.168.1.200:8888     | non |

#### Domotique (4 services)

| name             | icon_slug      | icon_fallback | url_external                  | url_local                  | fav |
|------------------|---------------|---------------|-------------------------------|----------------------------|-----|
| Home Assistant   | home-assistant| home          | https://ha.datagtb.com        | http://192.168.1.202:8123  | oui |
| Milesight Gateway| —             | radio         | https://milesight.datagtb.com | https://192.168.1.206      | non |
| AdGuard Home     | adguard-home  | shield        | https://adguard.datagtb.com   | http://192.168.1.201       | non |
| Zigbee2MQTT      | zigbee2mqtt   | radio         | —                             | http://192.168.1.207:8080  | non |

#### Media (3 services)

| name    | icon_slug | icon_fallback | url_external                  | url_local                  | fav |
|---------|----------|---------------|-------------------------------|----------------------------|-----|
| Jellyfin| jellyfin | play          | https://gustflix.datagtb.com  | http://192.168.1.205:8096  | oui |
| Immich  | immich   | image         | https://photos.datagtb.com   | http://192.168.1.205:2283  | oui |
| Romm    | —        | gamepad-2     | —                             | http://192.168.1.205:8082  | non |

#### Productivite (5 services)

| name          | icon_slug     | icon_fallback | url_external                 | url_local                  | fav |
|---------------|--------------|---------------|------------------------------|----------------------------|-----|
| Paperless-ngx | paperless-ngx| file-text     | https://docs.datagtb.com    | http://192.168.1.205:8000  | non |
| ConvertX      | —            | repeat        | https://convert.datagtb.com | http://192.168.1.205:3100  | non |
| Memos         | memos        | sticky-note   | https://notes.datagtb.com   | http://192.168.1.205:5230  | non |
| Vaultwarden   | vaultwarden  | lock          | https://vault.datagtb.com   | https://vault.datagtb.com  | oui |
| ActivityWatch | —            | activity      | —                            | http://localhost:5600      | non |

#### Veille (4 services)

| name           | icon_slug | icon_fallback | url_external                     | url_local                  | fav |
|----------------|----------|---------------|----------------------------------|----------------------------|-----|
| FreshRSS       | freshrss | rss           | https://freshrss.datagtb.com    | http://192.168.1.205:8084  | non |
| RSS-Bridge     | —        | link          | https://rss-bridge.datagtb.com  | http://192.168.1.205:8083  | non |
| n8n            | n8n      | workflow      | https://n8n.datagtb.com         | http://192.168.1.205:5678  | non |
| GTB Downloader | —        | download      | https://dl.datagtb.com          | http://192.168.1.205:8001  | non |

### Favoris (7 services)

Proxmox, Portainer, Home Assistant, Jellyfin, Immich, Vaultwarden

---

## Bookmarks (futur — page /bookmarks)

Les bookmarks de Homepage sont sauvegardes dans `pocketbase/bookmarks-seed.json`.
Ils seront importes quand la page /bookmarks sera implementee.

| Dossier    | Liens                                                    |
|------------|----------------------------------------------------------|
| Google     | Gmail, Drive, Calendar, Photos, Maps                     |
| Outils IA  | Claude, Gemini                                           |
| Dev        | GitHub, Netdata, Cloudflare, SnippetVault, SO, Json viz  |
| Medias     | YouTube, Reddit                                          |
