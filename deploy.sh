#!/bin/bash
# MK BLACK FRIDAY RADAR - Deployment Script

set -e

echo "=== MK BLACK FRIDAY RADAR - Deployment ==="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose not found. Please install Docker Compose first."
    exit 1
fi

echo "✓ Docker and Docker Compose found"
echo ""

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env with your configuration before continuing"
    exit 1
fi

echo "✓ Environment file exists"
echo ""

# Build and start services
echo "🚀 Building and starting services..."
docker-compose up -d --build

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo ""
echo "🏥 Checking service health..."

# Check backend
if curl -s http://localhost:8000/health > /dev/null; then
    echo "✓ Backend API is healthy"
else
    echo "⚠️  Backend API may still be starting..."
fi

# Check PostgreSQL
if docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
    echo "✓ PostgreSQL is ready"
else
    echo "⚠️  PostgreSQL may still be starting..."
fi

# Check Redis
if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    echo "✓ Redis is ready"
else
    echo "⚠️  Redis may still be starting..."
fi

echo ""
echo "=== 🎉 Deployment Complete! ==="
echo ""
echo "Access your services:"
echo "  • Web App:        http://localhost:3000 (when deployed to Vercel)"
echo "  • API Docs:       http://localhost:8000/docs"
echo "  • API Health:     http://localhost:8000/health"
echo "  • Grafana:        http://localhost:3001 (admin/admin)"
echo "  • Prometheus:     http://localhost:9090"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f [service_name]"
echo ""
echo "To stop:"
echo "  docker-compose down"
echo ""
echo "To stop and remove data:"
echo "  docker-compose down -v"
echo ""
