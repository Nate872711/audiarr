# Audiarr

Audiarr — audiobook manager (scaffold).

Audiarr will:
- Search AudiobookBay (configurable) for magnets.
- Queue downloads to Deluge/NZBGet if configured.
- **Auto-import** completed files by scanning the configured downloads completed folder and moving files into `/data/audiobooks`, and creating DB records.

Quick start:

```bash
git clone <repo>
cd audiarr
docker compose up --build
```

Docker Compose
```bash
services:
  audiarr-api:
    build: ./backend
    container_name: audiarr-api
    ports:
      - "5080:5080"
    environment:
      - ASPNETCORE_URLS=http://+:5080
    volumes:
      - ./data:/app/data
    depends_on:
      - db

  audiarr-ui:
    build: ./frontend
    container_name: audiarr-ui
    ports:
      - "3080:80"
    depends_on:
      - audiarr-api

  db:
    image: postgres:16
    container_name: audiarr-db
    environment:
      POSTGRES_USER: audiarr
      POSTGRES_PASSWORD: audiarr
      POSTGRES_DB: audiarr
    volumes:
      - ./data/db:/var/lib/postgresql/data
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
