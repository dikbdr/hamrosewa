#!/bin/bash
# HamroSewa - Getting Started Quick Guide

cat << "EOF"

╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║           🚀 HamroSewa Marketplace - Getting Started         ║
║                                                               ║
║          A Complete OLX-Style Marketplace for Nepal         ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

================== QUICK START GUIDE ====================

📋 STEP 1: Prerequisites
─────────────────────────
✓ Node.js >= 18.0.0  (Download: https://nodejs.org/)
✓ PostgreSQL >= 14    (Download: https://www.postgresql.org/)
✓ Git                 (Download: https://git-scm.com/)
✓ VS Code             (Download: https://code.visualstudio.com/)
✓ 2 GB+ free disk space

Verify installations:
  node --version
  npm --version
  psql --version
  git --version


🔧 STEP 2: Initial Setup (First Time Only)
────────────────────────────────────────────

2.1 Create .env file
    Copy: cp .env.example .env
    Edit: Open .env with text editor
    Update these CRITICAL fields:
    - DATABASE_URL=postgresql://user:password@localhost:5432/hamrosewa
    - JWT_SECRET=your-random-secret-key-min-32-chars
    - CLOUDINARY_CLOUD_NAME (get from cloudinary.com)
    - CLOUDINARY_API_KEY
    - CLOUDINARY_API_SECRET
    - EMAIL_USER (Gmail for testing)
    - EMAIL_PASSWORD (Gmail app password)

2.2 Install Dependencies
    Backend:
      cd backend
      npm install
      cd ..
    
    Frontend:
      cd frontend
      npm install
      cd ..

2.3 Create PostgreSQL Database
    psql -U postgres
    
    postgres=# CREATE DATABASE hamrosewa;
    postgres=# CREATE USER hamrosewa WITH PASSWORD 'hamrosewa123';
    postgres=# GRANT ALL PRIVILEGES ON DATABASE hamrosewa TO hamrosewa;
    postgres=# \q

    Note: Update DATABASE_URL in .env to match these credentials

2.4 Run Database Migrations
    cd backend
    npm run db:migrate
    cd ..

    This creates all tables in your database.


⚡ STEP 3: Start Development Servers
─────────────────────────────────────

Option A: Using separate terminals (RECOMMENDED)

    Terminal 1 - Backend:
    $ cd backend
    $ npm run dev
    
    Expected output:
    ✓ Backend running on http://localhost:5000
    ✓ Database connected
    ✓ Socket.IO ready
    
    Terminal 2 - Frontend:
    $ cd frontend
    $ npm run dev
    
    Expected output:
    ▲ Next.js ready
    - Local: http://localhost:3000

Option B: Using Docker (All-in-one)
    
    $ docker-compose up
    
    Then visit:
    - Frontend: http://localhost:3000
    - Backend: http://localhost:5000


🌐 STEP 4: Access the Application
──────────────────────────────────

Open your browser and visit:
  http://localhost:3000

You should see:
  ✓ HamroSewa homepage
  ✓ Categories showcase
  ✓ How it works section
  ✓ Call-to-action buttons


📚 STEP 5: Understand the Project
─────────────────────────────────

Key Files to Review:
  README.md              - Project overview
  INSTALL.md             - Detailed setup
  VSCODE_SETUP.md        - IDE configuration
  PHASE_1_COMPLETE.md    - Phase 1 summary

Project Structure:
  backend/               - Express.js API
  frontend/              - Next.js application
  shared/                - Shared TypeScript types
  docker/                - Docker configurations


🔍 COMMON ISSUES & SOLUTIONS
────────────────────────────

Issue: "Port 5000 already in use"
Solution:
  $ lsof -i :5000          # Find process
  $ kill -9 <PID>          # Kill it
  Or use: PORT=5001 npm run dev

Issue: "Cannot connect to database"
Solution:
  1. Check PostgreSQL is running
  2. Verify DATABASE_URL in .env
  3. Check database exists:
     psql -U hamrosewa -d hamrosewa -c "\dt"
  4. Run migrations: npm run db:migrate

Issue: "Modules not found"
Solution:
  $ rm -rf node_modules package-lock.json
  $ npm install
  $ npm run db:generate

Issue: "Port 3000 blocked"
Solution:
  cd frontend
  PORT=3001 npm run dev


📖 NEXT STEPS
─────────────

Phase 1 is complete! You now have:
  ✅ Project structure
  ✅ Database schema
  ✅ API foundation
  ✅ Frontend boilerplate

Phase 2 starts with:
  → Authentication system
  → User registration
  → Login/logout
  → OAuth integration


🛠 USEFUL COMMANDS
──────────────────

Backend:
  npm run dev              # Start development server
  npm run build            # Compile TypeScript
  npm run lint             # Check code quality
  npm run test             # Run tests
  npm run db:studio        # Open Prisma Studio (GUI)
  npm run db:migrate dev   # Create new migration

Frontend:
  npm run dev              # Start development server
  npm run build            # Build for production
  npm run lint             # Check code quality
  npm run type-check       # TypeScript validation
  npm run test             # Run tests


🎨 VS CODE SETUP (RECOMMENDED)
──────────────────────────────

Recommended Extensions:
  1. TypeScript Vue Plugin
  2. ESLint
  3. Prettier
  4. Tailwind CSS IntelliSense
  5. Prisma
  6. REST Client

Install all at once:
  $ code --install-extension esbenp.prettier-vscode
  $ code --install-extension dbaeumer.vscode-eslint
  $ code --install-extension bradlc.vscode-tailwindcss
  $ code --install-extension Prisma.prisma

See VSCODE_SETUP.md for complete guide


💡 CODE ORGANIZATION TIPS
──────────────────────────

For Beginners:
  - Start with frontend/src/app/page.tsx (home page)
  - Study components in frontend/src/components/
  - Learn routes in backend/src/routes/
  - Read backend/src/services/ for business logic

Best Practices:
  - Always use TypeScript types
  - Keep functions small and focused
  - Add comments for complex logic
  - Use .env for sensitive data
  - Run prettier before committing


🚀 DEPLOYING LATER
──────────────────

When you're ready to go live:

Frontend (Vercel):
  $ git push origin main
  - Import on Vercel
  - Set environment variables
  - Auto-deploys on push

Backend (Railway/Render):
  - Connect GitHub repository
  - Set environment variables
  - PostgreSQL add-on
  - Auto-deploys on push

See PHASE_14_DEPLOYMENT.md when ready


📞 TROUBLESHOOTING RESOURCES
────────────────────────────

Documentation:
  - README.md             Full project guide
  - INSTALL.md            Detailed installation
  - VSCODE_SETUP.md       IDE configuration
  - PHASE_1_COMPLETE.md   What was created

Common Issues:
  - Database connection problems
  - Port conflicts
  - Missing dependencies
  - TypeScript errors

Most issues resolved by:
  1. Checking environment variables
  2. Restarting development servers
  3. Clearing node_modules and reinstalling
  4. Checking PostgreSQL is running


✅ CHECKLIST: You're Ready When...
──────────────────────────────────

✓ All prerequisites installed and verified
✓ Project cloned to your machine
✓ .env file created and updated
✓ Dependencies installed (npm install)
✓ Database created and migrations run
✓ Backend server running on :5000
✓ Frontend server running on :3000
✓ Browser shows homepage at localhost:3000
✓ VS Code configured with extensions
✓ You understand the file structure


🎯 QUICK REFERENCE
──────────────────

Project Ports:
  3000    Frontend (Next.js)
  5000    Backend API (Express.js)
  5432    PostgreSQL Database
  6379    Redis Cache (optional)

Key Folders:
  frontend/src/app/        Next.js pages
  frontend/src/components/ React components
  backend/src/routes/      API routes
  backend/src/services/    Business logic
  backend/prisma/          Database schema

Key Files:
  .env                   Environment variables
  backend/src/index.ts   Backend entry point
  frontend/src/app/page.tsx    Frontend home
  backend/prisma/schema.prisma  Database schema


════════════════════════════════════════════════════════════════

🎉 CONGRATULATIONS! You're all set up!

Start with:
  1. Backend: cd backend && npm run dev
  2. Frontend: cd frontend && npm run dev
  3. Visit: http://localhost:3000

Questions? Check INSTALL.md for detailed troubleshooting.

Happy coding! 🚀

════════════════════════════════════════════════════════════════

EOF
