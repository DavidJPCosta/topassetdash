#!/bin/bash
# Dashboard Commands Reference

# Navigate to project directory
cd "C:\Users\dr.unfos\Documents\Code Projects\Dashboard"

# Install dependencies (run once after cloning/creating)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting (if eslint configured)
npm run lint

# Clean build cache
rm -rf .next

# Kill Node process on port 3000 (if needed)
# On Windows: taskkill /IM node.exe /F
# On macOS/Linux: lsof -ti:3000 | xargs kill -9

# Test specific endpoints with curl
curl http://localhost:3000/api/dashboard/sales
curl http://localhost:3000/api/dashboard/analytics
curl http://localhost:3000/api/dashboard/revenue
curl http://localhost:3000/api/dashboard/performance
curl http://localhost:3000/api/navigation/links
