# Audiarr

Audiarr — audiobook manager (scaffold).

This version assumes **Prowlarr**, **Deluge**, and **NZBGet** run externally (not in Docker). Audiarr will:
- Search AudiobookBay (configurable) for magnets.
- Queue downloads to Deluge/NZBGet if configured.
- **Auto-import** completed files by scanning the configured downloads completed folder and moving files into `/data/audiobooks`, and creating DB records.

Quick start:

```bash
git clone <repo>
cd audiarr
docker compose up --build
```

Important directories (mounted by docker-compose):
- `./data/audiobooks` — library storage (import target)
- `./data/downloads` — downloads folder expected to contain `completed/` for finished downloads
- `./data/config` — settings saved by the app

Configure external services in the Web UI → Settings:
- Prowlarr URL & API key
- Deluge RPC URL & password (if used)
- NZBGet URL & credentials (if used)
- AudiobookBay mirror URL
- Downloads completed folder path (inside container, default `/data/downloads/completed`)

Notes:
- The import service moves files and creates DB entries. It does not transcode or tag files.
- For Deluge/NZBGet running on host, use `host.docker.internal` (Docker Desktop) or host LAN IP on Linux.

Next steps:
- Harden import (naming, metadata matching)
- Add user auth (JWT)
- Add notifications and plex/audiobookshelf refresh triggers
