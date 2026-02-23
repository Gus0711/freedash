# Schéma PocketBase — Freedash

## Collection : `categories`

Type : base

| Champ       | Type   | Contraintes        | Description                |
|-------------|--------|--------------------|----------------------------|
| `name`      | text   | required, unique   | Nom de la catégorie        |
| `slug`      | text   | required, unique   | Slug URL-friendly          |
| `icon`      | text   |                    | Nom icône Lucide           |
| `color`     | text   |                    | Couleur hex (#3b82f6, etc.)|
| `sort_order`| number | required           | Ordre d'affichage          |

**API Rules :**
- List/View : public (vide)
- Create/Update/Delete : `@request.auth.id != ""`

---

## Collection : `services`

Type : base

| Champ            | Type      | Contraintes       | Description                          |
|------------------|-----------|-------------------|--------------------------------------|
| `name`           | text      | required          | Nom du service                       |
| `description`    | text      |                   | Description courte                   |
| `url_external`   | url       |                   | URL d'accès distant                  |
| `url_local`      | url       |                   | URL d'accès local                    |
| `icon_slug`      | text      |                   | Slug Dashboard Icons CDN             |
| `icon_fallback`  | text      |                   | Nom icône Lucide de fallback         |
| `category`       | relation  | → categories, req | Catégorie parente                    |
| `sort_order`     | number    | required          | Ordre dans la catégorie              |
| `is_favorite`    | bool      | default: false    | Affiché sur le Dashboard             |
| `is_active`      | bool      | default: true     | Service actif/visible                |
| `open_in_new_tab`| bool      | default: true     | Ouvrir dans un nouvel onglet         |
| `notes`          | text      |                   | Notes admin (non affichées en front) |

**API Rules :**
- List/View : public (vide)
- Create/Update/Delete : `@request.auth.id != ""`

---

## Collection : `settings`

Type : base (une seule ligne)

| Champ               | Type   | Default     | Description             |
|---------------------|--------|-------------|-------------------------|
| `site_title`        | text   | "Freedash"  | Titre du site           |
| `weather_latitude`  | number | 48.8566     | Latitude météo          |
| `weather_longitude` | number | 2.3522      | Longitude météo         |
| `weather_city`      | text   | "Paris"     | Ville affichée          |
| `theme`             | text   | "dark"      | Thème (dark uniquement) |
| `sidebar_default_open`| bool | false       | Sidebar ouverte par défaut |

**API Rules :**
- List/View : public (vide)
- Create/Update/Delete : `@request.auth.id != ""`
