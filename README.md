<div align="center">
  <img src="frontend/src/assets/logo.png" alt="Audiarr Logo" width="160"/>

  # 🎧 Audiarr
  **Automated Audiobook Manager inspired by Readarr**

  _Download, organize, and track your audiobooks automatically._
</div>

---

## ✨ Features

- 🔍 Integrates with **Prowlarr**, **NZBGet**, and **Deluge** (external instances)
- 📚 Searches **AudiobookBay** for magnets
- 🧠 Automatically imports completed downloads
- 🗂 Organizes your audiobooks into structured folders
- 🎨 Modern orange-gradient UI

---

## 🖥️ Web UI Preview

![Audiarr Web UI Preview](docs/preview.png)

---

## 🚀 Quick Start (Docker Compose)

```bash
git clone https://github.com/Nate872711/audiarr.git
cd audiarr
docker compose up --build
```

Open:
- Web UI → http://localhost:3080
- API → http://localhost:5080

### Example production docker-compose snippet (use images from Docker Hub)

```yaml
version: "3.9"
services:
  audiarr-db:
    image: postgres:16
    environment:
      POSTGRES_USER: audiarr
      POSTGRES_PASSWORD: audiarrpass
      POSTGRES_DB: audiarr
    volumes:
      - audiarr_db_data:/var/lib/postgresql/data

  audiarr-api:
    image: nate872711/audiarr:latest
    depends_on:
      - audiarr-db
    ports:
      - "5080:80"
    environment:
      - DATABASE_URL=postgresql://audiarr:audiarrpass@audiarr-db:5432/audiarr
    volumes:
      - audiarr_data:/data
      - audiarr_config:/app/config

  audiarr-web:
    image: nate872711/audiarr:latest
    depends_on:
      - audiarr-api
    ports:
      - "3080:80"

volumes:
  audiarr_db_data:
  audiarr_data:
  audiarr_config:
```

---

## ⚙️ Configuration

From the **WebUI → Settings**, set URLs for external services (Prowlarr, Deluge, NZBGet).
Default import path: `/data/downloads/completed`

---

## 🐋 CI/CD

GitHub Actions workflow included: `.github/workflows/docker-build.yml` (pushes to Docker Hub `Nate872711/audiarr`)

---

## License

MIT © 2025
