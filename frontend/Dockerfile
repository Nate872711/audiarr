# === Audiarr Frontend Dockerfile ===

FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the frontend source
COPY . .

# ✅ Set a default API URL to avoid undefined build-time env vars
ARG VITE_API_URL=http://localhost:5080
ENV VITE_API_URL=${VITE_API_URL}

# ✅ Run build with explicit environment
RUN echo "VITE_API_URL=$VITE_API_URL" && npm run build

# === Runtime container ===
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
