# Installation & Setup Guide

Complete step-by-step guide for setting up HamroSewa locally.

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Installation Steps](#installation-steps)
3. [Database Setup](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [Running the Application](#running-the-application)
6. [Troubleshooting](#troubleshooting)

## System Requirements

### Required
- Node.js version 18.0.0 or higher
- npm version 9.0.0 or higher
- PostgreSQL version 14 or higher
- Git

### Optional but Recommended
- Docker & Docker Compose
- Redis (for caching/sessions)
- Postman (for API testing)

### Verify Your System
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check PostgreSQL version
psql --version

# Check Git version
git --version
```

## Installation Steps

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/hamrosewa.git
cd HamroSewa.com
```

### Step 2: Set Up Environment Variables

#### Backend Environment
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and update with your configuration:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/hamrosewa

# JWT
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRY=7d
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRY=30d

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Payment Gateways
KHALTI_PUBLIC_KEY=your-khalti-public-key
KHALTI_SECRET_KEY=your-khalti-secret-key

ESEWA_MERCHANT_CODE=your-esewa-merchant-code
ESEWA_SUCCESS_URL=http://localhost:3000/payment/success
ESEWA_FAILURE_URL=http://localhost:3000/payment/failure

# Redis
REDIS_URL=redis://localhost:6379

# Admin
ADMIN_EMAIL=admin@hamrosewa.com
```

#### Frontend Environment
```bash
cd ../frontend
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_FACEBOOK_APP_ID=your-facebook-app-id
```

### Step 3: Install Dependencies

#### Backend Dependencies
```bash
cd backend
npm install
```

#### Frontend Dependencies
```bash
cd ../frontend
npm install
```

### Step 4: Set Up PostgreSQL Database

**Option A: Using PostgreSQL directly**

Create database:
```bash
psql -U postgres

postgres=# CREATE DATABASE hamrosewa;
postgres=# CREATE USER hamrosewa WITH PASSWORD 'Diko123';
postgres=# ALTER ROLE hamrosewa SET client_encoding TO 'utf8';
postgres=# ALTER ROLE hamrosewa SET default_transaction_isolation TO 'read committed';
postgres=# ALTER ROLE hamrosewa SET default_transaction_deferrable TO on;
postgres=# ALTER ROLE hamrosewa SET default_transaction_deferrable TO off;
postgres=# GRANT ALL PRIVILEGES ON DATABASE hamrosewa TO hamrosewa;
postgres=# \q
```

**Option B: Using Docker**
```bash
docker run --name hamrosewa-db \
  -e POSTGRES_USER=hamrosewa \
  -e POSTGRES_PASSWORD=hamrosewa123 \
  -e POSTGRES_DB=hamrosewa \
  -p 5432:5432 \
  -d postgres:16-alpine
```

### Step 5: Run Prisma Migrations

```bash
cd backend

# Create/update database schema
npm run db:migrate

# Generate Prisma Client
npm run db:generate

# (Optional) Seed database with sample data
npm run db:seed
```

## Database Setup

### Understanding Prisma

Prisma is our ORM (Object-Relational Mapping) that helps us interact with PostgreSQL.

**Key Prisma Commands:**
```bash
# Run pending migrations
npm run db:migrate

# Create a new migration
npx prisma migrate dev --name add_new_feature

# Validate schema
npx prisma validate

# Open Prisma Studio (GUI)
npm run db:studio

# Generate Prisma Client
npm run db:generate
```

### Database Schema

The database includes models for:
- Users (with roles)
- Listings/Products
- Categories
- Chat & Messages
- Payments
- Notifications
- Reviews & Favorites
- Reports

See `backend/prisma/schema.prisma` for complete schema.

## Environment Configuration

### Getting Third-Party Credentials

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web)
5. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback`
   - `http://localhost:3000`
6. Copy Client ID and Secret

#### Facebook Login
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create app
3. Add Facebook Login product
4. Set App Domains:
   - `localhost:3000`
   - `localhost:5000`
5. Add OAuth Redirect URI:
   - `http://localhost:5000/api/auth/facebook/callback`
6. Copy App ID and Secret

#### Cloudinary (Image Upload)
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret

#### Khalti Payment
1. Register at [Khalti](https://khalti.com/)
2. Create merchant account
3. Copy Public and Secret keys

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Output will show:
```
✓ Backend running on http://localhost:5000
✓ Database connected
✓ Socket.IO ready
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Output will show:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/api/docs

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

### Using Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Stop services
docker-compose down

# Rebuild images
docker-compose up -d --build
```

## Troubleshooting

### Issue: PostgreSQL Connection Failed

**Solution:**
```bash
# Check if PostgreSQL is running
psql -U postgres -c "SELECT version();"

# For Windows
# Start PostgreSQL service:
net start postgresql-x64-14

# For Mac
brew services start postgresql

# For Linux
sudo service postgresql start
```

### Issue: Port Already in Use

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>

# Alternative ports
PORT=5001 npm run dev
```

### Issue: Module Not Found Errors

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Regenerate Prisma Client
npm run db:generate
```

### Issue: Prisma Migrate Error

**Solution:**
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or create new migration
npx prisma migrate dev --name fix_issue
```

### Issue: Environment Variables Not Loading

**Solution:**
- Verify `.env` file exists (not `.env.example`)
- Check variable names are exactly as referenced in code
- Restart development server after editing `.env`
- Make sure no spaces around `=` sign

### Issue: Socket.IO Connection Failed

**Solution:**
```bash
# Check backend is running
curl http://localhost:5000

# Check CORS configuration
# Should allow http://localhost:3000

# Frontend env variable
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### Issue: Cloudinary Upload Not Working

**Solution:**
```bash
# Verify credentials
echo $CLOUDINARY_API_KEY

# Check CORS in Cloudinary dashboard
# Allow requests from: http://localhost:3000
```

## Next Steps

1. **Read the main README.md** for project overview
2. **Check VS Code Setup Guide** for IDE configuration
3. **Review API Documentation** in backend folder
4. **Start with Phase 2** - Authentication Module

---

Need help? Open an issue on GitHub!
