# Architecture -- Freedash

## Diagramme global

```
+--------------------------------------------------------------+
|                   Docker Compose (port 3010)                  |
|                                                               |
|  +---------------------+       +---------------------------+  |
|  |    Nginx Alpine      |       |       PocketBase          |  |
|  |    (~5 Mo RAM)       |       |     (Go + SQLite)         |  |
|  |                      |       |      (~15 Mo RAM)         |  |
|  |  :3010               |       |                           |  |
|  |                      |       |  :8090                    |  |
|  |  /          > static |       |  /_/    > Admin PB natif  |  |
|  |  /assets/*  > static |       |  /api/* > REST API        |  |
|  |  /api/*     > proxy -+------>|                           |  |
|  |  /_/*       > proxy -+------>|                           |  |
|  |  /*         > index  |       |  SQLite: freedash.db      |  |
|  |  (SPA fallback)      |       |                           |  |
|  +---------------------+       +---------------------------+  |
|                                                               |
|                    Total : ~20-25 Mo RAM                      |
+--------------------------------------------------------------+
```

## Flux de donnees

```
Navigateur (React SPA)
  |
  +-- React Router (client-side)
  |   +-- /              > Page Dashboard
  |   +-- /distant       > Page Distant
  |   +-- /local         > Page Local
  |   +-- /admin         > Page Admin (CRUD)
  |   +-- /stats         > Page Stats (futur)
  |   +-- /domotique     > Page Domotique (futur)
  |   +-- /bookmarks     > Page Bookmarks (futur)
  |   +-- /logs          > Page Logs/Health (futur)
  |
  +-- API Calls (PocketBase SDK)
  |   +-- GET  /api/collections/categories/records
  |   +-- GET  /api/collections/services/records?expand=category
  |   +-- GET  /api/collections/settings/records
  |   +-- POST /api/collections/services/records    (admin)
  |   +-- PATCH /api/collections/services/records/:id (admin)
  |   +-- DELETE /api/collections/services/records/:id (admin)
  |
  +-- Status Ping (client-side)
  |   +-- fetch(service.url, {mode:'no-cors'}) > up/down indicator
  |
  +-- Widgets (client-side)
      +-- Horloge > new Date() local
      +-- Meteo   > Open-Meteo API (gratuit, sans cle)
```

## Contraintes

| Contrainte          | Valeur                                      |
|---------------------|---------------------------------------------|
| RAM max totale      | < 50 Mo (objectif ~25 Mo)                   |
| Port de deploiement | 3010 (parallele a Homepage 3000)            |
| Serveur cible       | LXC 103 -- 192.168.1.205                    |
| URL distante future | https://dash.datagtb.com                    |
| Auth                | Cloudflare Access (pas de login dans l'app) |
| Emplacement serveur | /opt/freedash/                              |
| Build frontend      | < 500 Ko gzippe                             |
