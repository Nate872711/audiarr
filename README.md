# Audiarr

Audiarr — an audiobook manager inspired by Readarr. This repo is a starter scaffold with frontend (React + Vite + Tailwind) and backend (.NET 8 API) and Docker setup.

Features:
- Connects to Prowlarr for indexers
- Search AudiobookBay (configurable) for magnets
- Queue downloads to Deluge or NZBGet (configurable; optional)
- Modern React UI with settings page to configure integrations

Quick start:

```bash
git clone <repo>
cd audiarr
docker compose up --build
```

Open:
- Web UI → http://localhost:3080
- API → http://localhost:5080
- Prowlarr → http://localhost:9789
- Adminer → http://localhost:8088

Note: Deluge/NZBGet are optional. If running on host, set their URLs in the UI settings. If you want them in Docker, uncomment their services in docker-compose.yml.
