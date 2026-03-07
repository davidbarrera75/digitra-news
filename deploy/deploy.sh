#!/bin/bash
set -e

cd /var/www/digitra-news

echo "=== Digitra News Deploy ==="
echo "Building Docker image..."
docker compose -f deploy/docker-compose.prod.yml build --no-cache

echo "Stopping old container..."
docker compose -f deploy/docker-compose.prod.yml down 2>/dev/null || true

echo "Starting new container..."
docker compose -f deploy/docker-compose.prod.yml up -d

echo "Waiting for healthcheck..."
for i in $(seq 1 30); do
  if curl -sf http://127.0.0.1:3004/ > /dev/null 2>&1; then
    echo "Container healthy!"
    break
  fi
  echo "  waiting... ($i/30)"
  sleep 2
done

echo "Cleaning old images..."
docker image prune -f 2>/dev/null || true

echo "=== Deploy complete ==="
docker ps | grep digitra-news
