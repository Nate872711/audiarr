# === Audiarr Frontend Dockerfile (CI-safe) ===

FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# ✅ Provide a default API URL to prevent build errors
ARG VITE_API_URL=http://localhost:5080
ENV VITE_API_URL=${VITE_API_URL}

# ✅ Run the build safely
RUN echo "Building with VITE_API_URL=${VITE_API_URL}" && npm run build

# === Serve via NGINX ===
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
