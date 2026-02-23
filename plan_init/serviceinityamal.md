---
# 🚀 Homepage Services - Version 28 janvier 2026

# ═══════════════════════════════════════════════════════════
# 🌐 ONGLET DISTANT
# ═══════════════════════════════════════════════════════════

- Infrastructure:
    - Proxmox:
        icon: proxmox.png
        href: https://prox.datagtb.com
        description: Hyperviseur principal
        siteMonitor: https://192.168.1.200:8006
        widget:
          type: proxmox
          url: https://192.168.1.200:8006
          username: root@pam!all
          password: e0fcbe43-45b0-4c08-9a5d-e9f8a6cd4fb1
    - Portainer:
        icon: portainer.png
        href: https://portainer.datagtb.com
        description: Orchestration Docker
        siteMonitor: https://192.168.1.205:9443
    - Netdata:
        icon: netdata.png
        href: https://app.netdata.cloud
        description: Monitoring centralisé
        siteMonitor: http://192.168.1.200:19999
    - File Browser:
        icon: filebrowser.png
        href: https://fb.datagtb.com
        description: Explorateur de fichiers
        siteMonitor: http://192.168.1.205:8889
    - Code Server:
        icon: vscode.png
        href: https://vscode.datagtb.com
        description: IDE Web
        siteMonitor: http://192.168.1.205:8443
    - Plan IP:
        icon: mdi-ip-network
        href: https://ip.datagtb.com
        description: Cartographie réseau
        siteMonitor: http://192.168.1.200:8888

- Domotique:
    - Home Assistant:
        icon: home-assistant.png
        href: https://ha.datagtb.com
        description: Maison intelligente
        siteMonitor: http://192.168.1.202:8123
        widget:
          type: homeassistant
          url: http://192.168.1.202:8123
          key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIyNTZjYzE2ZTlhNTE0NzUyYmFlNGUyZTE0ZjY0YjBjMCIsImlhdCI6MTc2Nzg4NTI1NiwiZXhwIjoyMDgzMjQ1MjU2fQ.L4LwHDD9c95rICPcx1N63FJrcgB9s-SEjw9p1bi6XN0
          custom:
            - state: sensor.moyenne_tetes_th
              label: Température Moyenne
            - state: sensor.moyenne_humidite
              label: Humidité Moyenne
            - state: device_tracker.23078pnd5g
              label: Gus
    - Milesight Gateway:
        icon: mdi-router-wireless
        href: https://milesight.datagtb.com
        description: Gateway LoRa Maison
        siteMonitor: http://192.168.1.206
    - AdGuard Home:
        icon: adguard-home.png
        href: https://adguard.datagtb.com
        description: DNS sécurisé
        siteMonitor: http://192.168.1.201

- Média:
    - Jellyfin:
        icon: jellyfin.png
        href: https://gustflix.datagtb.com
        description: Streaming personnel
        siteMonitor: http://192.168.1.205:8096
    - Immich:
        icon: immich.png
        href: https://photos.datagtb.com
        description: Galerie photos
        siteMonitor: http://192.168.1.205:2283

- Productivité:
    - Paperless-ngx:
        icon: paperless-ngx.png
        href: https://docs.datagtb.com
        description: Archives numériques
        siteMonitor: http://192.168.1.205:8000
    - ConvertX:
        icon: mdi-file-swap-outline
        href: https://convert.datagtb.com
        description: Convertisseur
        siteMonitor: http://192.168.1.205:3100
    - Memos:
        icon: memos.png
        href: https://notes.datagtb.com
        description: 📝 Notes couple
        siteMonitor: http://192.168.1.205:5230
    - Vaultwarden:
        icon: vaultwarden.png
        href: https://vault.datagtb.com
        description: 🔐 Coffre-fort MDP
        siteMonitor: http://192.168.1.205:8222
    - ActivityWatch:
        icon: mdi-chart-timeline-variant
        href: http://localhost:5600/#/home
        description: Suivi d'activité PC

- Veille:
    - FreshRSS:
        icon: freshrss.png
        href: https://freshrss.datagtb.com
        description: Flux d'actualités
        siteMonitor: http://192.168.1.205:8084
    - RSS-Bridge:
        icon: mdi-rss
        href: https://rss-bridge.datagtb.com
        description: Générateur RSS
        siteMonitor: http://192.168.1.205:8083
    - n8n:
        icon: n8n.png
        href: https://n8n.datagtb.com
        description: Automatisation
        siteMonitor: http://192.168.1.205:5678
    - GTB Downloader:
        icon: mdi-cloud-download
        href: https://dl.datagtb.com
        description: Téléchargements
        siteMonitor: http://192.168.1.205:8001

# ═══════════════════════════════════════════════════════════
# 🏠 ONGLET LOCAL
# ═══════════════════════════════════════════════════════════

- Infra Local:
    - Proxmox:
        icon: proxmox.png
        href: https://192.168.1.200:8006
        description: 192.168.1.200:8006
        siteMonitor: https://192.168.1.200:8006
    - Portainer:
        icon: portainer.png
        href: https://192.168.1.205:9443
        description: 192.168.1.205:9443
        siteMonitor: https://192.168.1.205:9443
    - Netdata:
        icon: netdata.png
        href: http://192.168.1.200:19999
        description: 192.168.1.200:19999
        siteMonitor: http://192.168.1.200:19999
    - File Browser:
        icon: filebrowser.png
        href: http://192.168.1.205:8889
        description: 192.168.1.205:8889
        siteMonitor: http://192.168.1.205:8889
    - Code Server:
        icon: vscode.png
        href: http://192.168.1.205:8443
        description: 192.168.1.205:8443
        siteMonitor: http://192.168.1.205:8443
    - Plan IP:
        icon: mdi-ip-network
        href: http://192.168.1.200:8888
        description: 192.168.1.200:8888
        siteMonitor: http://192.168.1.200:8888

- Domotique Local:
    - Home Assistant:
        icon: home-assistant.png
        href: http://192.168.1.202:8123
        description: 192.168.1.202:8123
        siteMonitor: http://192.168.1.202:8123
    - Zigbee2MQTT:
        icon: zigbee2mqtt.png
        href: http://192.168.1.207:8080
        description: 192.168.1.207:8080
        siteMonitor: http://192.168.1.207:8080
    - Milesight Gateway:
        icon: mdi-router-wireless
        href: https://192.168.1.206
        description: 192.168.1.206
        siteMonitor: http://192.168.1.206
    - AdGuard Home:
        icon: adguard-home.png
        href: http://192.168.1.201
        description: 192.168.1.201
        siteMonitor: http://192.168.1.201

- Média Local:
    - Jellyfin:
        icon: jellyfin.png
        href: http://192.168.1.205:8096
        description: 192.168.1.205:8096
        siteMonitor: http://192.168.1.205:8096
    - Immich:
        icon: immich.png
        href: http://192.168.1.205:2283
        description: 192.168.1.205:2283
        siteMonitor: http://192.168.1.205:2283
    - Romm:
        icon: mdi-gamepad-variant
        href: http://192.168.1.205:8082
        description: 192.168.1.205:8082
        siteMonitor: http://192.168.1.205:8082

- Productivité Local:
    - Paperless-ngx:
        icon: paperless-ngx.png
        href: http://192.168.1.205:8000
        description: 192.168.1.205:8000
        siteMonitor: http://192.168.1.205:8000
    - ConvertX:
        icon: mdi-file-swap-outline
        href: http://192.168.1.205:3100
        description: 192.168.1.205:3100
        siteMonitor: http://192.168.1.205:3100
    - Memos:
        icon: memos.png
        href: http://192.168.1.205:5230
        description: 192.168.1.205:5230
        siteMonitor: http://192.168.1.205:5230
    - Vaultwarden:
        icon: vaultwarden.png
        href: https://vault.datagtb.com
        description: 🔐 Coffre-fort MDP
        siteMonitor: http://192.168.1.205:8222
    - ActivityWatch:
        icon: mdi-chart-timeline-variant
        href: http://localhost:5600/#/home
        description: Suivi d'activité PC

- Veille Local:
    - FreshRSS:
        icon: freshrss.png
        href: http://192.168.1.205:8084
        description: 192.168.1.205:8084
        siteMonitor: http://192.168.1.205:8084
    - n8n:
        icon: n8n.png
        href: http://192.168.1.205:5678
        description: 192.168.1.205:5678
        siteMonitor: http://192.168.1.205:5678
    - GTB Downloader:
        icon: mdi-cloud-download
        href: http://192.168.1.205:8001
        description: 192.168.1.205:8001
        siteMonitor: http://192.168.1.205:8001