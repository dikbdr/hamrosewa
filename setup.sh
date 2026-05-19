#!/bin/bash
# HamroSewa Development Setup & Run Scripts
# For Windows users, use Git Bash or WSL, or use .bat versions

set -e

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ASCII Art
print_header() {
  echo -e "${GREEN}"
  echo "╔════════════════════════════════════════╗"
  echo "║     🚀 HamroSewa Marketplace Setup    ║"
  echo "╚════════════════════════════════════════╝"
  echo -e "${NC}"
}

# Function to print section
print_section() {
  echo -e "\n${YELLOW}→ $1${NC}"
}

# Function to print success
print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

# Function to print error
print_error() {
  echo -e "${RED}✗ $1${NC}"
}

# Main execution
main() {
  print_header

  # Check prerequisites
  print_section "Checking prerequisites..."

  if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    exit 1
  fi
  print_success "Node.js $(node --version) found"

  if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
  fi
  print_success "npm $(npm --version) found"

  # Install backend dependencies
  print_section "Installing backend dependencies..."
  cd backend
  npm install
  print_success "Backend dependencies installed"
  cd ..

  # Install frontend dependencies
  print_section "Installing frontend dependencies..."
  cd frontend
  npm install
  print_success "Frontend dependencies installed"
  cd ..

  # Check PostgreSQL
  print_section "Database setup..."
  if command -v psql &> /dev/null; then
    print_success "PostgreSQL found"
  else
    print_error "PostgreSQL not found. Please install it from https://www.postgresql.org/"
    exit 1
  fi

  # Run Prisma migrations
  print_section "Running database migrations..."
  cd backend
  npx prisma migrate dev
  print_success "Database migrations completed"
  cd ..

  print_header
  echo -e "${GREEN}"
  echo "Setup completed successfully!"
  echo ""
  echo "Next steps:"
  echo "1. Update .env files with your configuration"
  echo "2. Terminal 1: cd backend && npm run dev"
  echo "3. Terminal 2: cd frontend && npm run dev"
  echo ""
  echo "Frontend: http://localhost:3000"
  echo "Backend:  http://localhost:5000"
  echo -e "${NC}"
}

# Run main function
main "$@"
