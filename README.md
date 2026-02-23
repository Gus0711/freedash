# Freedash

Dashboard homelab multi-pages sur-mesure. Remplace les solutions YAML (Homepage, etc.) par un vrai Command Center.

## Stack technique

| Couche     | Technologie                                  |
|------------|----------------------------------------------|
| Frontend   | React 18 + Vite + TypeScript (strict)        |
| Styling    | Tailwind CSS 3 + shadcn/ui (dark mode zinc)  |
| Animations | Framer Motion                                |
| Icônes     | Dashboard Icons CDN + Lucide React           |
| Backend    | PocketBase 0.25+ (Go + SQLite)               |
| Routing    | React Router v6                              |
| Déploiement| Docker Compose (Nginx Alpine + PocketBase)   |

## Architecture

```
freedash/
├── docker-compose.yml
├── frontend/              # React SPA (Vite + TypeScript)
│   ├── src/
│   │   ├── components/    # Composants réutilisables
│   │   ├── hooks/         # Hooks custom (PocketBase, météo, etc.)
│   │   ├── layouts/       # AppLayout, Header, Sidebar
│   │   ├── lib/           # Client PocketBase, utils
│   │   ├── pages/         # Pages de l'application
│   │   └── types/         # Interfaces TypeScript
│   └── ...
├── nginx/                 # Config Nginx + Dockerfile multi-stage
│   ├── Dockerfile
│   └── nginx.conf
├── pocketbase/            # PocketBase backend
│   ├── Dockerfile
│   └── pb_data/           # Données runtime (gitignored)
└── docs/                  # Documentation du projet
```

## Pages

| Route        | Description                       | Statut   |
|--------------|-----------------------------------|----------|
| `/`          | Dashboard (accueil + favoris)     | MVP      |
| `/distant`   | Services distants (URLs externes) | MVP      |
| `/local`     | Services locaux (URLs internes)   | MVP      |
| `/admin`     | Administration CRUD               | MVP      |
| `/stats`     | Stats/Infra                       | Futur    |
| `/domotique` | Domotique                         | Futur    |
| `/bookmarks` | Bookmarks                         | Futur    |
| `/logs`      | Logs/Health                       | Futur    |

## Démarrage rapide

### Prérequis

- Docker + Docker Compose
- Node.js 20+ (développement local uniquement)

### Production (Docker)

```bash
# Cloner et lancer
git clone <repo-url> /opt/freedash
cd /opt/freedash
docker compose up -d --build

# Accès
# App      → http://192.168.1.205:3010
# PB Admin → http://192.168.1.205:3010/_/
```

Au premier lancement, accéder à `/_/` pour créer le compte admin PocketBase, puis suivre le guide de seed dans `docs/seed-data.md`.

### Développement local

```bash
# Backend PocketBase
cd pocketbase
docker compose up pocketbase -d

# Frontend (dans un autre terminal)
cd frontend
npm install
npm run dev
# → http://localhost:5173 (proxy API vers PocketBase)
```

## Collections PocketBase

| Collection   | Description                         |
|--------------|-------------------------------------|
| `categories` | Catégories de services              |
| `services`   | Services (URLs, icônes, statuts)    |
| `settings`   | Paramètres globaux (1 seule ligne)  |

Voir `docs/pocketbase-schema.md` pour le schéma complet.

## Ressources

- **Dashboard Icons** : <https://github.com/walkxcode/dashboard-icons> (slugs des icônes)
- **Open-Meteo API** : <https://open-meteo.com> (météo gratuite, sans clé)
- **shadcn/ui** : <https://ui.shadcn.com> (composants UI)
- **PocketBase** : <https://pocketbase.io/docs> (documentation backend)

## Cible mémoire

- PocketBase : ~15 Mo RAM
- Nginx Alpine : ~5 Mo RAM
- **Total production : < 50 Mo RAM**
