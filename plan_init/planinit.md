# 🚀 FREEDASH — Plan Projet Complet & Prompt Claude Code

> **Projet** : Freedash — Dashboard Homelab multi-pages sur-mesure
> **Auteur** : Gus
> **Date** : Février 2026
> **Objectif** : Remplacer Homepage (YAML) par un vrai Command Center avec routing, admin intégré, animations premium, < 50 Mo RAM

---

## 📋 TABLE DES MATIÈRES

1. [Vue d'ensemble](#1-vue-densemble)
2. [Architecture technique](#2-architecture-technique)
3. [Structure des pages & routing](#3-structure-des-pages--routing)
4. [Schéma PocketBase](#4-schéma-pocketbase)
5. [Arborescence du projet](#5-arborescence-du-projet)
6. [Design System & UI](#6-design-system--ui)
7. [Composants détaillés](#7-composants-détaillés)
8. [Conteneurisation Docker](#8-conteneurisation-docker)
9. [Données de seed](#9-données-de-seed)
10. [Plan d'exécution phase par phase](#10-plan-dexécution-phase-par-phase)
11. [MEGA-PROMPT CLAUDE CODE](#11-mega-prompt-claude-code)

---

## 1. VUE D'ENSEMBLE

### Le produit

**Freedash** est une application web multi-pages qui sert de Command Center pour un homelab. Ce n'est pas un simple dashboard de liens — c'est une vraie app avec :

- **4 pages MVP** : Dashboard (accueil), Distant, Local, Admin
- **4 pages futures prévues** : Stats/Infra, Domotique, Bookmarks, Logs/Health
- **Sidebar collapsible** : navigation premium (icônes seules quand fermée, labels quand ouverte)
- **Admin intégré** : CRUD complet des services et catégories directement dans l'app React
- **Status temps réel** : ping client-side pour afficher up/down sur chaque service
- **Widgets** : horloge, météo, recherche rapide
- **Animations** : Framer Motion partout (hover, stagger, transitions de page)
- **Dark mode natif** : thème sombre par défaut, esthétique "Command Center"

### Contraintes techniques

| Contrainte | Valeur |
|---|---|
| RAM max totale | < 50 Mo (objectif ~25 Mo) |
| Port de déploiement | `3010` (parallèle à Homepage `3000`) |
| Serveur cible | LXC 103 — `192.168.1.205` |
| URL distante future | `https://dash.datagtb.com` |
| Auth | Cloudflare Access (pas de login dans l'app) |
| Emplacement sur serveur | `/opt/freedash/` |

### Stack technique définitive

| Couche | Technologie | Rôle | RAM estimée |
|---|---|---|---|
| Frontend | React 18 + Vite + TypeScript | SPA avec React Router | 0 (statique) |
| Styling | Tailwind CSS 3 + shadcn/ui | Design system, dark mode | 0 (statique) |
| Animations | Framer Motion | Transitions, hover, stagger | 0 (client) |
| Graphiques | Tremor | Widgets système | 0 (client) |
| Icônes apps | Dashboard Icons (CDN) | Logos exacts Jellyfin, Proxmox... | 0 (CDN) |
| Icônes UI | Lucide React | Icônes interface + fallback | 0 (client) |
| Backend/BDD | PocketBase 0.25+ (Go + SQLite) | API REST + admin natif | ~15 Mo |
| Serving | Nginx Alpine | Reverse proxy + statique | ~5 Mo |
| Container | Docker Compose | Orchestration | — |

---

## 2. ARCHITECTURE TECHNIQUE

### Diagramme d'architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     Docker Compose (port 3010)                │
│                                                                │
│  ┌─────────────────────┐       ┌───────────────────────────┐  │
│  │      Nginx Alpine    │       │       PocketBase           │  │
│  │      (~5 Mo RAM)     │       │     (Go + SQLite)          │  │
│  │                      │       │      (~15 Mo RAM)          │  │
│  │  :3010               │       │                            │  │
│  │                      │       │  :8090                     │  │
│  │  /          → static │       │  /_/    → Admin PB natif   │  │
│  │  /assets/*  → static │       │  /api/* → REST API         │  │
│  │  /api/*     → proxy ─┼──────▶│                            │  │
│  │  /_/*       → proxy ─┼──────▶│                            │  │
│  │  /*         → index  │       │  SQLite: freedash.db       │  │
│  │  (SPA fallback)      │       │                            │  │
│  └─────────────────────┘       └───────────────────────────┘  │
│                                                                │
│                    Total : ~20-25 Mo RAM                       │
└──────────────────────────────────────────────────────────────┘
```

### Flux de données

```
Navigateur (React SPA)
  │
  ├─ React Router (client-side)
  │   ├── /              → Page Dashboard
  │   ├── /distant       → Page Distant
  │   ├── /local         → Page Local
  │   ├── /admin         → Page Admin (CRUD)
  │   ├── /stats         → Page Stats (futur)
  │   ├── /domotique     → Page Domotique (futur)
  │   ├── /bookmarks     → Page Bookmarks (futur)
  │   └── /logs          → Page Logs/Health (futur)
  │
  ├─ API Calls (PocketBase SDK)
  │   ├── GET  /api/collections/categories/records
  │   ├── GET  /api/collections/services/records?expand=category
  │   ├── GET  /api/collections/settings/records
  │   ├── POST /api/collections/services/records    (admin)
  │   ├── PATCH /api/collections/services/records/:id (admin)
  │   └── DELETE /api/collections/services/records/:id (admin)
  │
  ├─ Status Ping (client-side)
  │   └── fetch(service.url, {mode:'no-cors'}) → up/down indicator
  │
  └─ Widgets (client-side)
      ├── Horloge → new Date() local
      └── Météo   → Open-Meteo API (gratuit, sans clé)
```

---

## 3. STRUCTURE DES PAGES & ROUTING

### Layout global

```
┌──────────────────────────────────────────────────┐
│ ┌──────┐ ┌──────────────────────────────────────┐│
│ │      │ │           Header                      ││
│ │      │ │  [Horloge]  [Recherche]  [Météo]     ││
│ │  S   │ ├──────────────────────────────────────┤│
│ │  I   │ │                                       ││
│ │  D   │ │         Contenu de la page            ││
│ │  E   │ │                                       ││
│ │  B   │ │    (React Router <Outlet />)          ││
│ │  A   │ │                                       ││
│ │  R   │ │                                       ││
│ │      │ │                                       ││
│ └──────┘ └──────────────────────────────────────┘│
└──────────────────────────────────────────────────┘
```

### Sidebar collapsible

```
État fermé (64px)          État ouvert (240px)
┌──────┐                   ┌────────────────────┐
│  ◈   │                   │  ◈  Freedash       │
│──────│                   │────────────────────│
│  🏠  │                   │  🏠  Dashboard      │
│  🌐  │                   │  🌐  Distant        │
│  📡  │                   │  📡  Local           │
│      │                   │                    │
│      │                   │  ── Futur ──       │
│      │                   │  📊  Stats          │
│      │                   │  🏠  Domotique      │
│      │                   │  🔖  Bookmarks      │
│      │                   │  📋  Logs           │
│      │                   │                    │
│──────│                   │────────────────────│
│  ⚙️  │                   │  ⚙️  Admin          │
└──────┘                   └────────────────────┘
     ▲ bouton toggle              ▲ bouton toggle
```

### Pages MVP (v1.0)

#### Page Dashboard (`/`)
- Widget horloge + date animée
- Widget météo (Open-Meteo, position configurable dans settings)
- Barre de recherche rapide (filtre en temps réel tous les services)
- Grille des services FAVORIS (champ `is_favorite` dans PocketBase)
- Mini status overview : X services up / Y down
- Lien rapide vers Distant et Local

#### Page Distant (`/distant`)
- Tous les services qui ont un `url_external`
- Groupés par catégorie
- Chaque ServiceCard affiche : icône, nom, description, status (ping), lien
- Barre de recherche contextuelle
- Animation stagger au chargement

#### Page Local (`/local`)
- Tous les services qui ont un `url_local`
- Même layout que Distant mais avec les URLs locales
- Même groupement par catégorie

#### Page Admin (`/admin`)
- CRUD Catégories : liste, ajout, édition inline, suppression, réordonnancement
- CRUD Services : liste, ajout (formulaire modal), édition, suppression
- Prévisualisation de l'icône Dashboard Icons en temps réel
- Lien vers l'admin PocketBase natif (`/_/`)

### Pages futures (prévues dans le routing, non implémentées)

| Route | Page | Description |
|---|---|---|
| `/stats` | Stats/Infra | Détails Proxmox (CPU, RAM, stockage, conteneurs) via API PVE |
| `/domotique` | Domotique | Thermostats MClimate, capteurs HA via WebSocket |
| `/bookmarks` | Bookmarks | Liens externes organisés par dossier (collection PB dédiée) |
| `/logs` | Logs/Health | Historique uptime, ping history, alertes |

---

## 4. SCHÉMA POCKETBASE

### Collection : `categories`

| Champ | Type PB | Requis | Unique | Description |
|---|---|---|---|---|
| `name` | text | ✅ | ✅ | Nom affiché ("Infrastructure", "Média"...) |
| `slug` | text | ✅ | ✅ | Slug URL-safe ("infrastructure", "media") |
| `icon` | text | ❌ | ❌ | Nom Lucide icon ("server", "film", "shield") |
| `color` | text | ❌ | ❌ | Couleur accent hex ("#3b82f6") |
| `sort_order` | number | ✅ | ❌ | Ordre d'affichage (10, 20, 30...) |

API Rules : List/View = public. Create/Update/Delete = admin only.

### Collection : `services`

| Champ | Type PB | Requis | Unique | Description |
|---|---|---|---|---|
| `name` | text | ✅ | ❌ | Nom du service ("Proxmox", "Jellyfin") |
| `description` | text | ❌ | ❌ | Description courte ("Hyperviseur", "Streaming") |
| `url_external` | url | ❌ | ❌ | URL publique Cloudflare |
| `url_local` | url | ❌ | ❌ | URL locale (192.168.x) |
| `icon_slug` | text | ❌ | ❌ | Slug Dashboard Icons ("proxmox", "jellyfin") |
| `icon_fallback` | text | ❌ | ❌ | Nom Lucide en fallback ("monitor", "play") |
| `category` | relation | ✅ | ❌ | Relation → `categories` |
| `sort_order` | number | ✅ | ❌ | Ordre dans sa catégorie |
| `is_favorite` | bool | ❌ | ❌ | Affiché sur le Dashboard accueil |
| `is_active` | bool | ❌ | ❌ | Masquer sans supprimer (défaut: true) |
| `open_in_new_tab` | bool | ❌ | ❌ | Ouvrir dans un nouvel onglet (défaut: true) |
| `notes` | text | ❌ | ❌ | Notes internes (visible admin uniquement) |

API Rules : List/View = public. Create/Update/Delete = admin only.

### Collection : `settings` (single-row, type "base")

| Champ | Type PB | Description |
|---|---|---|
| `site_title` | text | Titre affiché ("Freedash") |
| `weather_latitude` | number | Latitude pour Open-Meteo |
| `weather_longitude` | number | Longitude pour Open-Meteo |
| `weather_city` | text | Nom ville affiché ("Paris") |
| `theme` | text | Réservé futur ("dark", "light", "auto") |
| `sidebar_default_open` | bool | Sidebar ouverte par défaut |

API Rules : List/View = public. Create/Update/Delete = admin only.

### Collections futures (non créées au MVP)

| Collection | Usage futur |
|---|---|
| `bookmarks` | Liens externes organisés (page Bookmarks) |
| `bookmark_folders` | Dossiers de bookmarks |
| `uptime_logs` | Historique des pings (page Logs/Health) |
| `notes` | Notes rapides (page Notes/Todo) |

---

## 5. ARBORESCENCE DU PROJET

```
freedash/
├── docker-compose.yml
├── .env
├── .env.example
├── pocketbase/
│   ├── Dockerfile
│   └── pb_data/              (volume Docker, gitignored)
├── nginx/
│   ├── Dockerfile
│   └── nginx.conf
└── frontend/
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── tailwind.config.ts
    ├── postcss.config.js
    ├── components.json
    ├── index.html
    ├── public/
    │   └── favicon.svg
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── index.css
        ├── lib/
        │   ├── pocketbase.ts
        │   ├── utils.ts
        │   └── types.ts
        ├── hooks/
        │   ├── useServices.ts
        │   ├── useCategories.ts
        │   ├── useSettings.ts
        │   ├── useServiceStatus.ts
        │   ├── useWeather.ts
        │   └── useSearch.ts
        ├── components/
        │   ├── layout/
        │   │   ├── Sidebar.tsx
        │   │   ├── SidebarItem.tsx
        │   │   ├── Header.tsx
        │   │   └── AppLayout.tsx
        │   ├── ui/              (shadcn auto-generated)
        │   │   ├── button.tsx
        │   │   ├── card.tsx
        │   │   ├── input.tsx
        │   │   ├── badge.tsx
        │   │   ├── dialog.tsx
        │   │   ├── dropdown-menu.tsx
        │   │   ├── tooltip.tsx
        │   │   ├── skeleton.tsx
        │   │   └── ...
        │   ├── dashboard/
        │   │   ├── ServiceCard.tsx
        │   │   ├── ServiceGrid.tsx
        │   │   ├── CategorySection.tsx
        │   │   ├── StatusBadge.tsx
        │   │   ├── SearchBar.tsx
        │   │   ├── ClockWidget.tsx
        │   │   ├── WeatherWidget.tsx
        │   │   └── QuickStats.tsx
        │   └── admin/
        │       ├── ServiceForm.tsx
        │       ├── ServiceList.tsx
        │       ├── CategoryForm.tsx
        │       ├── CategoryList.tsx
        │       └── IconPicker.tsx
        └── pages/
            ├── DashboardPage.tsx
            ├── DistantPage.tsx
            ├── LocalPage.tsx
            ├── AdminPage.tsx
            ├── StatsPage.tsx        (placeholder)
            ├── DomotiquePage.tsx    (placeholder)
            ├── BookmarksPage.tsx    (placeholder)
            ├── LogsPage.tsx         (placeholder)
            └── NotFoundPage.tsx
```

---

## 6. DESIGN SYSTEM & UI

### Palette de couleurs (Dark mode natif exclusif)

```
Background principal  : #09090b  (zinc-950)
Background cards      : #18181b  (zinc-900)
Background hover      : #27272a  (zinc-800)
Background sidebar    : #0c0c0e  (légèrement plus sombre)
Bordures              : #27272a  (zinc-800)
Bordures hover        : #3f3f46  (zinc-700)
Texte principal       : #fafafa  (zinc-50)
Texte secondaire      : #a1a1aa  (zinc-400)
Texte muted           : #71717a  (zinc-500)

Accent primaire       : #3b82f6  (blue-500)
Accent hover          : #60a5fa  (blue-400)
Status up (online)    : #22c55e  (green-500)
Status down (offline) : #ef4444  (red-500)
Status unknown        : #f59e0b  (amber-500)
Favoris               : #f59e0b  (amber-500)
```

### Typographie

```
Font principale : Inter (Google Fonts)
Font mono/tech  : JetBrains Mono (pour les IPs, ports, URLs)
```

### Animations Framer Motion — Catalogue

```typescript
// Stagger enfants (apparition en cascade)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
};

// Apparition d'un élément (slide up + fade)
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

// Hover sur ServiceCard (scale + glow)
const cardHover = {
  scale: 1.03,
  transition: { type: "spring", stiffness: 400, damping: 17 }
};

// Transition de page
const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.2 }
};

// Sidebar toggle
const sidebarVariants = {
  open: { width: 240, transition: { type: "spring", stiffness: 300, damping: 30 } },
  closed: { width: 64, transition: { type: "spring", stiffness: 300, damping: 30 } }
};

// Status badge pulse
const pulseDot = {
  animate: { scale: [1, 1.2, 1], opacity: [1, 0.7, 1] },
  transition: { repeat: Infinity, duration: 2 }
};
```

### Icônes — Stratégie Dashboard Icons + Lucide fallback

```typescript
// URL Dashboard Icons via CDN
const getDashboardIconUrl = (slug: string): string =>
  `https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/${slug}.png`;

// Composant ServiceIcon avec fallback automatique
// Si icon_slug défini → charge depuis Dashboard Icons CDN
// Si erreur de chargement ou pas de slug → fallback Lucide (icon_fallback)
// Si rien → icône "globe" par défaut
```

---

## 7. COMPOSANTS DÉTAILLÉS

### ServiceCard — Le composant central

```
┌─────────────────────────────────────┐
│  ┌────┐                        ●   │  ← StatusBadge (vert/rouge/ambre)
│  │icon│  Proxmox                   │
│  │    │  Hyperviseur               │  ← description
│  └────┘  prox.datagtb.com         │  ← URL tronquée, font mono
└─────────────────────────────────────┘
  ↑ Hover : scale 1.03 + border glow blue-500/20
  ↑ Clic  : ouvre l'URL dans un nouvel onglet
```

Affiche `url_external` sur page Distant, `url_local` sur Local, `url_external` (fallback `url_local`) sur Dashboard.

### Header

```
┌──────────────────────────────────────────────────────────┐
│  Lun. 24 Fév — 14:32     [🔍 Rechercher...]     ⛅ 8°C  │
└──────────────────────────────────────────────────────────┘
```

### Page Dashboard layout

```
┌──────────────────────────────────────────────────────────┐
│                    Bonjour, Gus 👋                       │
│              Lundi 24 Février 2026 — 14:32               │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ 🔍 Rechercher un service...                         │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │ 18 up    │  │  1 down  │  │  ⛅ 8°C  │               │
│  │ services │  │ service  │  │  Paris   │               │
│  └──────────┘  └──────────┘  └──────────┘               │
│                                                           │
│  ⭐ Favoris                                              │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐           │
│  │Proxmox │ │  HA    │ │Jellyfin│ │Portainer│           │
│  └────────┘ └────────┘ └────────┘ └────────┘           │
│                                                           │
│  🔗 Accès rapide                                         │
│  [→ Tous les services distants]  [→ Services locaux]    │
└──────────────────────────────────────────────────────────┘
```

### Page Admin layout

```
┌──────────────────────────────────────────────────────────┐
│  Administration                    [Ouvrir Admin PB ↗]   │
│                                                           │
│  [Services]  [Catégories]  [Paramètres]    ← onglets    │
│                                                           │
│  [+ Ajouter un service]                                  │
│                                                           │
│  ┌──────┬──────────┬──────────────┬────────┬─────────┐  │
│  │ Icône│ Nom      │ URLs         │ Cat.   │ Actions │  │
│  ├──────┼──────────┼──────────────┼────────┼─────────┤  │
│  │  🖥️ │ Proxmox  │ prox.data...│ Infra  │ ✏️ 🗑️  │  │
│  │  🎬 │ Jellyfin │ gustflix... │ Média  │ ✏️ 🗑️  │  │
│  └──────┴──────────┴──────────────┴────────┴─────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

## 8. CONTENEURISATION DOCKER

### docker-compose.yml

```yaml
version: "3.8"

services:
  pocketbase:
    build: ./pocketbase
    container_name: freedash-pb
    restart: unless-stopped
    volumes:
      - ./pocketbase/pb_data:/app/pb_data
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:8090/api/health"]
      interval: 30s
      timeout: 5s
      retries: 3

  nginx:
    build:
      context: .
      dockerfile: ./nginx/Dockerfile
    container_name: freedash-web
    restart: unless-stopped
    ports:
      - "3010:80"
    depends_on:
      pocketbase:
        condition: service_healthy
```

### pocketbase/Dockerfile

```dockerfile
FROM alpine:3.19
ARG PB_VERSION=0.25.0
ARG TARGETARCH
RUN apk add --no-cache wget unzip ca-certificates
RUN wget -q "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_${TARGETARCH}.zip" \
    -O /tmp/pb.zip \
    && unzip /tmp/pb.zip -d /app \
    && rm /tmp/pb.zip \
    && chmod +x /app/pocketbase
WORKDIR /app
EXPOSE 8090
CMD ["/app/pocketbase", "serve", "--http=0.0.0.0:8090"]
```

### nginx/Dockerfile (multi-stage)

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

### nginx/nginx.conf

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_min_length 256;

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /api/ {
        proxy_pass http://pocketbase:8090;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /_/ {
        proxy_pass http://pocketbase:8090;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 9. DONNÉES DE SEED

### Catégories initiales

| name | slug | icon | color | sort_order |
|---|---|---|---|---|
| Infrastructure | infrastructure | server | #3b82f6 | 10 |
| Domotique | domotique | home | #22c55e | 20 |
| Média | media | play | #8b5cf6 | 30 |
| Productivité | productivite | file-text | #f59e0b | 40 |
| Veille & IA | veille | rss | #ec4899 | 50 |
| Gaming | gaming | gamepad-2 | #06b6d4 | 60 |
| Admin | admin | settings | #6b7280 | 70 |

### Services initiaux (19 services)

| name | description | icon_slug | icon_fallback | url_external | url_local | category_slug | sort | fav |
|---|---|---|---|---|---|---|---|---|
| Proxmox | Hyperviseur | proxmox | monitor | https://prox.datagtb.com | https://192.168.1.200:8006 | infrastructure | 10 | ✅ |
| AdGuard Home | DNS + Anti-pub | adguard-home | shield | https://adguard.datagtb.com | http://192.168.1.201:80 | infrastructure | 20 | ❌ |
| Plan IP | Visualisation réseau | — | network | https://ip.datagtb.com | http://192.168.1.200:8888 | infrastructure | 30 | ❌ |
| Home Assistant | Domotique | home-assistant | home | https://ha.datagtb.com | http://192.168.1.202:8123 | domotique | 10 | ✅ |
| Zigbee2MQTT | Bridge Zigbee | zigbee2mqtt | radio | — | http://192.168.1.207:8080 | domotique | 20 | ❌ |
| Jellyfin | Streaming | jellyfin | play | https://gustflix.datagtb.com | http://192.168.1.205:8096 | media | 10 | ✅ |
| Immich | Galerie photos IA | immich | image | https://photos.datagtb.com | http://192.168.1.205:2283 | media | 20 | ✅ |
| Paperless-ngx | Archives numériques | paperless-ngx | file-text | https://docs.datagtb.com | http://192.168.1.205:8000 | productivite | 10 | ❌ |
| ConvertX | Convertisseur | — | repeat | https://convert.datagtb.com | http://192.168.1.205:3100 | productivite | 20 | ❌ |
| Memos | Notes couple | memos | sticky-note | https://notes.datagtb.com | http://192.168.1.205:5230 | productivite | 30 | ❌ |
| Vaultwarden | Coffre-fort MDP | vaultwarden | lock | https://vault.datagtb.com | https://vault.datagtb.com | productivite | 40 | ✅ |
| FreshRSS | Agrégateur RSS | freshrss | rss | https://freshrss.datagtb.com | http://192.168.1.205:8084 | veille | 10 | ❌ |
| RSS-Bridge | Générateur flux | — | link | https://rss-bridge.datagtb.com | http://192.168.1.205:8083 | veille | 20 | ❌ |
| n8n | Automatisation | n8n | workflow | https://n8n.datagtb.com | http://192.168.1.205:5678 | veille | 30 | ❌ |
| GTB Downloader | Téléchargement | — | download | https://dl.datagtb.com | http://192.168.1.205:8001 | veille | 40 | ❌ |
| Romm | ROMs rétro | — | gamepad-2 | — | http://192.168.1.205:8082 | gaming | 10 | ❌ |
| Portainer | Gestion Docker | portainer | container | https://portainer.datagtb.com | https://192.168.1.205:9443 | admin | 10 | ✅ |
| File Browser | Fichiers web | filebrowser | folder | https://fb.datagtb.com | http://192.168.1.205:8889 | admin | 20 | ❌ |
| Code Server | IDE Web | code-server-vscode | code | https://vscode.datagtb.com | http://192.168.1.205:8443 | admin | 30 | ❌ |

### Settings initiaux

| Champ | Valeur |
|---|---|
| site_title | Freedash |
| weather_latitude | 48.8566 |
| weather_longitude | 2.3522 |
| weather_city | Paris |
| theme | dark |
| sidebar_default_open | false |

---

## 10. PLAN D'EXÉCUTION PHASE PAR PHASE

### Phase 1 — Fondations (PocketBase + Docker)
1. Créer l'arborescence `/opt/freedash/`
2. Écrire `docker-compose.yml`, Dockerfiles, `nginx.conf`
3. Lancer PocketBase, créer les 3 collections via `/_/`
4. Saisir toutes les données de seed
5. ✅ Validation : `curl http://localhost:8090/api/collections/services/records` retourne les 19 services

### Phase 2 — Scaffold Frontend
1. `npm create vite@latest frontend -- --template react-ts`
2. Configurer Tailwind CSS 3 + shadcn/ui (thème zinc, dark)
3. Installer : `framer-motion react-router-dom pocketbase lucide-react @tremor/react`
4. Configurer proxy Vite → PocketBase (dev mode)
5. Créer `lib/pocketbase.ts`, `lib/types.ts`, `lib/utils.ts`
6. ✅ Validation : `npm run dev` sert une page blanche Tailwind

### Phase 3 — Layout & Navigation
1. `AppLayout.tsx` avec Sidebar + Header + `<Outlet />`
2. `Sidebar.tsx` collapsible (Framer Motion spring)
3. `Header.tsx` (horloge, recherche, météo)
4. React Router avec toutes les routes (MVP + placeholders)
5. ✅ Validation : navigation entre pages avec sidebar animée

### Phase 4 — Pages Dashboard, Distant, Local
1. Hooks : `useServices`, `useCategories`, `useSettings`, `useServiceStatus`, `useWeather`, `useSearch`
2. Composants : `ServiceCard`, `ServiceGrid`, `CategorySection`, `StatusBadge`, `SearchBar`, `ClockWidget`, `WeatherWidget`, `QuickStats`
3. Pages : `DashboardPage`, `DistantPage`, `LocalPage`
4. ✅ Validation : 3 pages affichent les vrais services PocketBase avec animations

### Phase 5 — Page Admin
1. `AdminPage.tsx` avec onglets (Services / Catégories / Paramètres)
2. CRUD Services : `ServiceList` + `ServiceForm` (modal Dialog)
3. CRUD Catégories : `CategoryList` + `CategoryForm`
4. `IconPicker.tsx` (preview Dashboard Icons)
5. ✅ Validation : ajout/édition/suppression fonctionnels

### Phase 6 — Polish & Deploy
1. Animations stagger sur toutes les grilles, transitions AnimatePresence
2. Widget météo Open-Meteo
3. Responsive mobile/tablette
4. Build prod, vérifier bundle < 500 Ko gzip
5. Docker Compose complet, `docker stats` < 50 Mo RAM
6. ✅ Validation : accessible sur `http://192.168.1.205:3010`

---

## 11. MEGA-PROMPT CLAUDE CODE

> **Le prompt ci-dessous est à copier-coller intégralement dans Claude Code.**
> Il contient toutes les spécifications nécessaires pour développer Freedash de A à Z.

---

~~~
Tu es un Développeur Full-Stack Senior et Expert UI/UX. Tu vas construire "Freedash", un dashboard homelab multi-pages sur-mesure.

## CONTEXTE PROJET

Freedash remplace Homepage (solution YAML) par un vrai Command Center avec :
- React SPA multi-pages avec React Router
- Backend PocketBase (Go + SQLite) — ~15 Mo RAM
- Nginx Alpine pour servir le frontend statique — ~5 Mo RAM
- Total < 50 Mo RAM en production
- Déploiement Docker Compose sur LXC 103 (192.168.1.205), port 3010
- Le projet sera dans /opt/freedash/ sur le serveur

## STACK TECHNIQUE OBLIGATOIRE

- Frontend : React 18 + Vite + TypeScript (strict mode)
- Styling : Tailwind CSS 3 + shadcn/ui (dark mode par défaut, thème zinc)
- Animations : Framer Motion (hover, stagger, page transitions, sidebar toggle)
- Graphiques futurs : Tremor (installer mais utiliser plus tard)
- Icônes apps : Dashboard Icons via CDN jsdelivr (`https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/{slug}.png`)
- Icônes UI : Lucide React (navigation, fallback, actions)
- Backend : PocketBase 0.25+ (API REST auto + admin UI natif via /_/)
- Routing : React Router v6 (createBrowserRouter)
- HTTP client : PocketBase JavaScript SDK (`pocketbase` npm package)
- Déploiement : Docker Compose (Nginx multi-stage build + PocketBase Alpine)

## PAGES DE L'APPLICATION

### Pages MVP (à implémenter complètement)

1. **`/` — Dashboard (accueil)**
   - Message de bienvenue avec horloge animée et date en français
   - Widget météo via Open-Meteo API (gratuit, sans clé API) : `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true`
   - Barre de recherche globale (filtre en temps réel TOUS les services, résultats en dropdown avec lien)
   - Quick Stats : 3 cards (X services up en vert, Y services down en rouge, météo)
   - Grille des services favoris (filtrés par is_favorite=true) avec ServiceCards
   - Liens rapides : boutons "Voir tous les services distants →" et "Services locaux →"

2. **`/distant` — Services distants**
   - Titre "Services distants" avec compteur
   - Barre de recherche contextuelle (filtre uniquement les services de cette page)
   - Services groupés par catégorie (CategorySection), triés par sort_order
   - Filtre : uniquement les services ayant un `url_external` non vide ET `is_active=true`
   - Chaque ServiceCard affiche l'URL externe et le StatusBadge ping cette URL

3. **`/local` — Services locaux**
   - Même layout exact que /distant
   - Filtre : services ayant un `url_local` non vide ET `is_active=true`
   - Chaque ServiceCard affiche l'URL locale et le StatusBadge ping cette URL

4. **`/admin` — Administration**
   - 3 onglets : Services | Catégories | Paramètres
   - **Onglet Services** : tableau listant tous les services avec colonnes (icône, nom, URLs, catégorie, favori, actif, actions). Bouton "+ Ajouter" ouvre un Dialog modal shadcn avec formulaire complet. Bouton "Éditer" pré-remplit le formulaire. Bouton "Supprimer" avec confirmation.
   - **Onglet Catégories** : tableau listant les catégories avec édition inline. Bouton ajouter.
   - **Onglet Paramètres** : formulaire pour modifier les settings (titre, coordonnées météo, etc.)
   - Bouton "Ouvrir Admin PocketBase ↗" qui ouvre `/_/` dans un nouvel onglet
   - Toutes les opérations CRUD via PocketBase SDK (pb.collection('services').create/update/delete)

### Pages futures (créer les routes avec placeholder "Coming Soon")

- `/stats` — Stats/Infra (icône: bar-chart-3)
- `/domotique` — Domotique (icône: thermometer)
- `/bookmarks` — Bookmarks (icône: bookmark)
- `/logs` — Logs/Health (icône: activity)

Chaque placeholder affiche : icône Lucide grande + titre + "Cette page arrive bientôt" + lien retour Dashboard.

## LAYOUT GLOBAL

### AppLayout.tsx
- Flexbox horizontal : Sidebar à gauche + zone principale à droite
- Zone principale : Header fixe en haut + contenu scrollable en dessous (<Outlet />)
- Le contenu a un padding de 24px (p-6) et un max-width pour rester lisible

### Sidebar collapsible (Framer Motion)
- État fermé (défaut) : width 64px, affiche uniquement les icônes centrées
- État ouvert : width 240px, affiche icônes + labels
- Toggle via bouton chevron en bas
- Animation : motion.div avec width animée, type spring, stiffness 300, damping 30
- Background : plus sombre que le fond principal (bg-zinc-950/80 avec backdrop-blur ou bg-[#0c0c0e])
- Bordure droite : border-r border-zinc-800
- Structure verticale :
  1. Logo : icône ◈ (ou Lucide "hexagon") + "Freedash" (texte masqué quand fermé)
  2. Section navigation MVP : Dashboard (layout-dashboard), Distant (globe), Local (wifi)
  3. Séparateur
  4. Section future (grisée, non cliquable) : Stats (bar-chart-3), Domotique (thermometer), Bookmarks (bookmark), Logs (activity)
  5. Séparateur
  6. Admin (settings) — toujours en bas
  7. Bouton toggle (chevrons-left / chevrons-right)
- Item actif : bg-zinc-800 + bordure left 2px blue-500
- Items futurs : text-zinc-600, curseur default, tooltip "Bientôt disponible"

### Header.tsx
- Hauteur fixe 64px, bg-zinc-950, border-b border-zinc-800
- Gauche : ClockWidget (horloge HH:MM:SS + date en français)
- Centre : SearchBar (Input shadcn avec icône Search, largeur max 400px)
- Droite : WeatherWidget (icône météo + temp + ville)

## SCHÉMA POCKETBASE (3 collections)

### Collection "categories" (type: base)
- name (text, required, unique)
- slug (text, required, unique)
- icon (text) — nom Lucide icon
- color (text) — hex color
- sort_order (number, required)
API Rules : List/View = (laisser vide = public). Create/Update/Delete = @request.auth.id != ""

### Collection "services" (type: base)
- name (text, required)
- description (text)
- url_external (url)
- url_local (url)
- icon_slug (text) — slug pour Dashboard Icons CDN
- icon_fallback (text) — nom Lucide fallback
- category (relation → categories, required)
- sort_order (number, required)
- is_favorite (bool, default false)
- is_active (bool, default true)
- open_in_new_tab (bool, default true)
- notes (text) — notes admin uniquement
API Rules : List/View = (vide = public). Create/Update/Delete = @request.auth.id != ""

### Collection "settings" (type: base, une seule ligne)
- site_title (text) — "Freedash"
- weather_latitude (number) — 48.8566
- weather_longitude (number) — 2.3522
- weather_city (text) — "Paris"
- theme (text) — "dark"
- sidebar_default_open (bool) — false
API Rules : List/View = public. Create/Update/Delete = @request.auth.id != ""

## COMPOSANTS CLÉS — SPÉCIFICATIONS

### ServiceCard.tsx
- shadcn Card avec padding 16px
- Layout horizontal : icône à gauche (40x40) + contenu à droite + StatusBadge en haut à droite
- Icône : `<img src="https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/${icon_slug}.png" />` avec onError fallback vers icône Lucide (icon_fallback, ou "globe" par défaut)
- Contenu : nom (text-sm font-medium text-zinc-50), description (text-xs text-zinc-400), URL tronquée (text-xs font-mono text-zinc-500)
- Hover Framer Motion : whileHover={{ scale: 1.03 }} avec spring stiffness 400 damping 17
- Hover CSS : border passe de border-zinc-800 à border-zinc-700, ombre subtile ring-1 ring-blue-500/10
- Clic : window.open(url, open_in_new_tab ? '_blank' : '_self')
- Props : reçoit `service` (type Service) + `urlField` ('url_external' | 'url_local') pour savoir quelle URL afficher
- L'URL affichée est nettoyée : retirer le protocole, tronquer à 30 chars

### StatusBadge.tsx
- Pastille ronde 8px absolue en haut à droite de la card
- 3 états : "online" (bg-green-500), "offline" (bg-red-500), "checking" (bg-amber-500 avec animation pulse)
- Le hook useServiceStatus gère le ping :
  - fetch(url, { mode: 'no-cors', signal: AbortSignal.timeout(5000) })
  - Si pas d'erreur → online. Si erreur → offline.
  - Vérification initiale au mount + toutes les 60 secondes
  - ATTENTION : les URLs HTTPS locales avec cert self-signed vont souvent fail en no-cors. Afficher "checking" (ambre) dans le doute, ne pas bloquer.

### SearchBar.tsx
- Input shadcn avec icône Search (Lucide) à gauche
- Placeholder : "Rechercher un service... (Ctrl+K)"
- Raccourci clavier : Ctrl+K ou "/" pour focus
- Filtre en temps réel : match insensible à la casse sur name, description, url_external, url_local
- Sur la page Dashboard : filtre tous les services, affiche les résultats dans un dropdown positionné sous l'input
- Sur les pages Distant/Local : filtre la liste affichée en temps réel (pas de dropdown, filtrage direct de la grille)

### ClockWidget.tsx
- Affiche l'heure en HH:MM avec les secondes en plus petit (:SS en text-xs text-zinc-500)
- Date en français sous l'heure : "Lundi 24 Février 2026" (utiliser toLocaleDateString('fr-FR'))
- Update chaque seconde

### WeatherWidget.tsx
- Appel Open-Meteo au mount puis toutes les 15 minutes
- Affiche : icône Lucide selon weathercode (0-1: sun, 2-3: cloud, 45-48: cloud-fog, 51-67: cloud-rain, 71-77: snowflake, 80+: cloud-rain), température arrondie en °C, nom de la ville depuis settings
- Skeleton shadcn pendant le chargement
- Coordonnées et ville récupérées depuis la collection settings PB

### IconPicker.tsx (admin)
- Input texte pour taper le slug (ex: "proxmox")
- Prévisualisation en temps réel : affiche l'image Dashboard Icons à côté de l'input
- Si l'image ne charge pas, affiche "Icône non trouvée" en rouge
- Lien vers https://github.com/walkxcode/dashboard-icons pour consulter les slugs disponibles

## ANIMATIONS FRAMER MOTION — OBLIGATOIRES

1. **Stagger** sur toutes les grilles de ServiceCards : container variants avec staggerChildren 0.06, items avec opacity 0→1 et y 20→0 (spring)
2. **Hover** sur chaque ServiceCard : whileHover scale 1.03 (spring stiffness 400 damping 17)
3. **Page transitions** : AnimatePresence dans App.tsx, chaque page wrapped dans motion.div avec initial/animate/exit (opacity + x)
4. **Sidebar toggle** : motion.div avec width animée (64 ↔ 240, spring)
5. **Status pulse** : animation pulse Framer Motion sur le StatusBadge quand "checking"
6. **Apparition Header widgets** : fade in au premier mount

## DESIGN — RÈGLES STRICTES

- Dark mode EXCLUSIF : bg-zinc-950 fond, bg-zinc-900 cards, JAMAIS de fond clair
- Bordures subtiles : border-zinc-800 par défaut, border-zinc-700 au hover
- Texte : text-zinc-50 (principal), text-zinc-400 (secondaire), text-zinc-500 (muted)
- Accent : blue-500 pour les éléments interactifs et l'item actif sidebar
- Status : green-500 (up), red-500 (down), amber-500 (unknown)
- Font : Inter (principal) + JetBrains Mono (URLs, IPs, ports) — importer via Google Fonts dans index.html
- Espacement cohérent : gap-4 entre les cards, gap-6 entre les sections
- Cards : rounded-lg, bg-zinc-900, border border-zinc-800, hover:border-zinc-700
- Pas d'ombres lourdes, préférer les border + ring subtils
- Responsive : grille 1 col mobile, 2 cols tablette, 3-4 cols desktop (grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4)

## DOCKER

### docker-compose.yml
```yaml
version: "3.8"
services:
  pocketbase:
    build: ./pocketbase
    container_name: freedash-pb
    restart: unless-stopped
    volumes:
      - ./pocketbase/pb_data:/app/pb_data
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:8090/api/health"]
      interval: 30s
      timeout: 5s
      retries: 3
  nginx:
    build:
      context: .
      dockerfile: ./nginx/Dockerfile
    container_name: freedash-web
    restart: unless-stopped
    ports:
      - "3010:80"
    depends_on:
      pocketbase:
        condition: service_healthy
```

### pocketbase/Dockerfile
```dockerfile
FROM alpine:3.19
ARG PB_VERSION=0.25.0
ARG TARGETARCH
RUN apk add --no-cache wget unzip ca-certificates
RUN wget -q "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_${TARGETARCH}.zip" \
    -O /tmp/pb.zip && unzip /tmp/pb.zip -d /app && rm /tmp/pb.zip && chmod +x /app/pocketbase
WORKDIR /app
EXPOSE 8090
CMD ["/app/pocketbase", "serve", "--http=0.0.0.0:8090"]
```

### nginx/Dockerfile
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

### nginx/nginx.conf
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_min_length 256;
    location /assets/ { expires 1y; add_header Cache-Control "public, immutable"; }
    location /api/ { proxy_pass http://pocketbase:8090; proxy_set_header Host $host; proxy_set_header X-Real-IP $remote_addr; }
    location /_/ { proxy_pass http://pocketbase:8090; proxy_set_header Host $host; proxy_set_header X-Real-IP $remote_addr; proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; proxy_set_header X-Forwarded-Proto $scheme; }
    location / { try_files $uri $uri/ /index.html; }
}
```

## MÉTHODOLOGIE

Procède phase par phase dans cet ordre strict. Après chaque phase, arrête-toi et montre-moi le résultat avant de passer à la suivante.

### Phase 1 : Docker + PocketBase
Crée toute l'arborescence, les Dockerfiles, docker-compose.yml, nginx.conf. Donne-moi les instructions pour lancer PB et créer les collections + seed data.

### Phase 2 : Scaffold Frontend
Init Vite React TS, configure Tailwind + shadcn (thème zinc dark), installe toutes les deps, configure proxy Vite, crée les fichiers de base (types, PB client, utils).

### Phase 3 : Layout + Navigation
AppLayout, Sidebar collapsible, Header, React Router (toutes les routes). Navigation fonctionnelle.

### Phase 4 : Pages Dashboard, Distant, Local
Tous les hooks, tous les composants, les 3 pages complètes avec données PocketBase et animations.

### Phase 5 : Page Admin
CRUD complet services + catégories + settings, formulaires modaux, IconPicker.

### Phase 6 : Polish
Animations finales, météo, responsive, optimisation build, test Docker complet.

## RÈGLES IMPÉRATIVES

1. TOUJOURS TypeScript strict — pas de `any`, interfaces typées pour tout
2. TOUJOURS dark mode exclusif — JAMAIS de fond clair
3. TOUJOURS Framer Motion — chaque élément a une animation d'entrée
4. JAMAIS de données en dur — tout vient de PocketBase via les hooks
5. JAMAIS de CSS brut — uniquement Tailwind utilities + shadcn
6. JAMAIS d'emoji dans le code — Lucide React pour toutes les icônes
7. Composants PETITS — max ~100-120 lignes par fichier
8. Noms de code en anglais, labels UI en français quand approprié
9. Tous les appels PB dans des hooks custom, jamais dans les composants
10. Build prod < 500 Ko gzippé
11. Total RAM Docker < 50 Mo
~~~

---

*Document Freedash — Généré le 23 février 2026*
*Prêt pour développement avec Claude Code*