#!/bin/bash
# HamroSewa Development Server Runner
# This script starts both backend and frontend in the same terminal

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_header() {
  echo -e "${GREEN}"
  echo "╔════════════════════════════════════════╗"
  echo "║     🚀 Starting HamroSewa Servers      ║"
  echo "╚════════════════════════════════════════╝"
  echo -e "${NC}"
}

cleanup() {
  echo -e "\n${YELLOW}Stopping servers...${NC}"
  kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
  exit 0
}

trap cleanup SIGINT SIGTERM

print_header

# Start backend
echo -e "${YELLOW}→ Starting backend server...${NC}"
cd backend
npm run dev &
BACKEND_PID=$!
sleep 3

# Start frontend
echo -e "${YELLOW}→ Starting frontend server...${NC}"
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo -e "${GREEN}"
echo "✓ Servers started!"
echo ""
echo "Frontend:  http://localhost:3000"
echo "Backend:   http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop servers"
echo -e "${NC}"

wait
