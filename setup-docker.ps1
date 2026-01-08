# setup-docker.ps1
Write-Host "Setting up Docker files for Windows..." -ForegroundColor Green

# Create .dockerignore
@"
node_modules
npm-debug.log
dist
.vite
*.exe
*.dll
*.so
*.dylib
*.test
*.out
vendor/
*.db
*.db-shm
*.db-wal
.vscode
.idea
.DS_Store
.git
.env
.env.local
logs
*.log
"@ | Out-File -FilePath ".dockerignore" -Encoding UTF8

# Create docker-compose.yml
@"
version: '3.8'

services:
  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    container_name: yoga-backend
    ports:
      - "8080:8080"
    environment:
      - PORT=8080
      - DB_NAME=/app/data/yoga.db
      - JWT_SECRET=your_super_secret_key_change_in_production
    volumes:
      - ./server:/app
      - yoga-db:/app/data
    restart: unless-stopped
    networks:
      - yoga-network

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    container_name: yoga-frontend
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://localhost:8080
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - yoga-network
    stdin_open: true
    tty: true

volumes:
  yoga-db:
    driver: local

networks:
  yoga-network:
    driver: bridge
"@ | Out-File -FilePath "docker-compose.yml" -Encoding UTF8

# Create Dockerfile.frontend
@"
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
"@ | Out-File -FilePath "Dockerfile.frontend" -Encoding UTF8

# Create Dockerfile.frontend.prod
@"
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
"@ | Out-File -FilePath "Dockerfile.frontend.prod" -Encoding UTF8

# Create nginx.conf
$nginxContent = @'
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location /api/ {
        proxy_pass http://backend:8080/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
'@
$nginxContent | Out-File -FilePath "nginx.conf" -Encoding UTF8

# Create docker-compose.prod.yml
$prodComposeContent = @'
version: '3.8'

services:
  backend:
    build:
      context: ./server
      dockerfile: Dockerfile.prod
    container_name: yoga-backend-prod
    ports:
      - "8080:8080"
    environment:
      - PORT=8080
      - DB_NAME=/app/data/yoga.db
      - JWT_SECRET=${JWT_SECRET}
      - GIN_MODE=release
    volumes:
      - yoga-db-prod:/app/data
    restart: always
    networks:
      - yoga-network
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend.prod
    container_name: yoga-frontend-prod
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    restart: always
    networks:
      - yoga-network

volumes:
  yoga-db-prod:
    driver: local

networks:
  yoga-network:
    driver: bridge
'@
$prodComposeContent | Out-File -FilePath "docker-compose.prod.yml" -Encoding UTF8

# Create server directory if it doesn't exist
if (!(Test-Path -Path "server")) {
    New-Item -ItemType Directory -Force -Path "server" | Out-Null
}

# Create server/Dockerfile
@"
FROM golang:1.23-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=1 GOOS=linux go build -a -installsuffix cgo -o main .

FROM alpine:latest

RUN apk --no-cache add ca-certificates sqlite-libs

WORKDIR /root/

COPY --from=builder /app/main .

RUN mkdir -p /app/data

EXPOSE 8080

CMD ["./main"]
"@ | Out-File -FilePath "server/Dockerfile" -Encoding UTF8

# Create server/Dockerfile.prod
@"
FROM golang:1.23-alpine AS builder

WORKDIR /app

RUN apk add --no-cache gcc musl-dev sqlite-dev

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=1 GOOS=linux go build -ldflags="-w -s" -a -installsuffix cgo -o main .

FROM alpine:latest

RUN apk --no-cache add ca-certificates sqlite-libs wget

WORKDIR /root/

COPY --from=builder /app/main .

RUN mkdir -p /app/data

RUN addgroup -g 1000 yoga && adduser -D -u 1000 -G yoga yoga && chown -R yoga:yoga /root /app

USER yoga

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget --quiet --tries=1 --spider http://localhost:8080/health || exit 1

CMD ["./main"]
"@ | Out-File -FilePath "server/Dockerfile.prod" -Encoding UTF8

# Create .env.example
@"
# Backend
JWT_SECRET=your_super_secret_key_change_in_production
PORT=8080

# Frontend
VITE_API_URL=http://localhost:8080
"@ | Out-File -FilePath ".env.example" -Encoding UTF8

Write-Host ""
Write-Host "All Docker files created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Update vite.config.js with:" -ForegroundColor Cyan
Write-Host "   server: { host: '0.0.0.0', port: 5173, watch: { usePolling: true } }" -ForegroundColor White
Write-Host ""
Write-Host "2. Run: docker-compose up" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Open: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""