# HamroSewa - OLX Style Marketplace for Nepal 🇳🇵

A complete, production-ready, full-stack marketplace platform built with modern web technologies. This project is designed for **junior developers** with clear explanations and scalable architecture.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Development Guide](#development-guide)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)

## ✨ Features

### 🔐 Authentication
- Email/Password registration and login
- Google & Facebook OAuth
- Email verification
- Password reset
- JWT-based authentication
- Role-based access control (User, Seller, Admin)

### 📦 Product Management
- Create, edit, delete listings
- Multiple image uploads (Cloudinary)
- Category management
- Product search & filtering
- Featured & boosted ads
- Listing expiration management

### 💬 Real-time Chat
- Socket.IO based messaging
- Typing indicators
- Online/offline status
- Message seen status
- Image sharing

### 💳 Payments
- Khalti payment gateway
- eSewa payment gateway
- Payment verification
- Transaction history
- Featured listing payments

### 🔔 Notifications
- In-app notifications
- Email notifications
- Real-time updates
- Notification preferences

### 👥 Admin Dashboard
- User management
- Listing moderation
- Analytics & reports
- Revenue dashboard
- Category management

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **State Management**: Zustand / Context API
- **Form Handling**: React Hook Form
- **Real-time**: Socket.IO Client
- **HTTP Client**: Axios
- **Authentication**: NextAuth.js

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Real-time**: Socket.IO
- **File Upload**: Cloudinary
- **Email**: Nodemailer
- **OAuth**: Passport.js

### DevOps
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL 16
- **Cache**: Redis
- **Testing**: Jest & React Testing Library

## 📁 Project Structure

```
HamroSewa.com/
├── frontend/               # Next.js frontend application
│   ├── src/
│   │   ├── app/           # Next.js app directory
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components (legacy support)
│   │   ├── lib/           # Utility libraries
│   │   ├── hooks/         # Custom React hooks
│   │   ├── context/       # React Context providers
│   │   ├── services/      # API service clients
│   │   ├── types/         # TypeScript interfaces
│   │   ├── utils/         # Helper functions
│   │   └── styles/        # Global styles
│   ├── public/            # Static assets
│   ├── next.config.js     # Next.js configuration
│   ├── tailwind.config.js # Tailwind CSS config
│   └── package.json       # Frontend dependencies
│
├── backend/               # Express.js backend API
│   ├── src/
│   │   ├── routes/        # API route definitions
│   │   ├── controllers/   # Route handlers
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Custom middleware
│   │   ├── models/        # Database models
│   │   ├── types/         # TypeScript interfaces
│   │   ├── utils/         # Helper functions
│   │   ├── config/        # Configuration files
│   │   └── index.ts       # Application entry point
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   └── migrations/    # Database migrations
│   ├── jest.config.js     # Jest configuration
│   └── package.json       # Backend dependencies
│
├── docker/                # Docker configurations
│   ├── Dockerfile.backend # Backend container
│   ├── Dockerfile.frontend # Frontend container
│   └── docker-compose.yml # Container orchestration
│
├── shared/                # Shared code/types
│   └── types.ts          # Common TypeScript interfaces
│
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 14
- Redis (optional, for caching)
- Docker & Docker Compose (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/hamrosewa.git
   cd HamroSewa.com
   ```

2. **Set up environment variables**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Update .env with your configuration
   nano .env
   ```

3. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

4. **Set up database**
   ```bash
   cd backend
   
   # Run migrations
   npx prisma migrate dev
   
   # Seed database (optional)
   npm run db:seed
   ```

5. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Docs: http://localhost:5000/api/docs

### Using Docker

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📚 Development Guide

### Frontend Development

**Key Commands:**
```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Testing
npm run test
npm run test:watch
```

**Creating Components:**
```tsx
// src/components/ProductCard.tsx
import React from 'react';

interface ProductCardProps {
  title: string;
  price: number;
  image: string;
}

// Functional component with TypeScript
const ProductCard: React.FC<ProductCardProps> = ({ title, price, image }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <h3 className="mt-2 font-semibold">{title}</h3>
      <p className="text-primary font-bold mt-2">Rs. {price}</p>
    </div>
  );
};

export default ProductCard;
```

### Backend Development

**Key Commands:**
```bash
cd backend

# Development server
npm run dev

# Build
npm run build

# Type checking
npm run type-check

# Database operations
npm run db:migrate
npm run db:generate
npm run db:seed

# Testing
npm run test
npm run test:watch
```

**Creating an API Route:**
```typescript
// src/routes/products.ts
import { Router } from 'express';
import { getProducts, createProduct } from '../controllers/productController';
import { authenticate } from '../middleware/auth';

const router = Router();

// GET all products
router.get('/', getProducts);

// POST create product (requires authentication)
router.post('/', authenticate, createProduct);

export default router;
```

**Creating a Service:**
```typescript
// src/services/productService.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get all products with filtering
 * @param category - Filter by category (optional)
 * @param limit - Number of results (default: 10)
 */
export const getAllProducts = async (category?: string, limit: number = 10) => {
  return await prisma.listing.findMany({
    where: category ? { category: { slug: category } } : {},
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: { images: true },
  });
};
```

## 🌐 API Documentation

### Authentication Endpoints

**Register User**
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}

Response: 201 Created
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "user-id",
    "email": "user@example.com",
    "token": "jwt-token"
  }
}
```

**Login**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "jwt-token",
    "refreshToken": "refresh-token"
  }
}
```

### Listing Endpoints

**Create Listing**
```
POST /api/listings
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "iPhone 14 Pro",
  "description": "Almost new, single owner",
  "categoryId": "category-id",
  "price": 100000,
  "negotiable": true,
  "condition": "LIKE_NEW",
  "city": "Kathmandu",
  "district": "Kathmandu"
  "images": [file1, file2, ...]
}

Response: 201 Created
{
  "success": true,
  "data": { listing object }
}
```

### Chat Endpoints

**Send Message**
```
POST /api/chats/:chatId/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Is this still available?"
}

Response: 201 Created
{
  "success": true,
  "data": { message object }
}
```

## 🚀 Deployment

### Vercel (Frontend)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

```bash
git push origin main
```

### Railway / Render (Backend)

1. Create account
2. Connect GitHub repository
3. Set environment variables
4. Deploy

**Railway Deployment:**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Docker Deployment

```bash
# Build images
docker build -f docker/Dockerfile.backend -t hamrosewa-api:latest ./backend
docker build -f docker/Dockerfile.frontend -t hamrosewa-web:latest ./frontend

# Push to registry
docker push your-registry/hamrosewa-api:latest
docker push your-registry/hamrosewa-web:latest
```

## 🧪 Testing

### Frontend Tests

```bash
cd frontend

# Run tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### Backend Tests

```bash
cd backend

# Run tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

## 📖 Phase Breakdown

This project is built in 14 phases:

1. **Phase 1**: Project Setup ✅
2. **Phase 2**: Authentication Module
3. **Phase 3**: User Profile Module
4. **Phase 4**: Category Module
5. **Phase 5**: Product/Listing Module
6. **Phase 6**: Search & Filter Module
7. **Phase 7**: Chat System
8. **Phase 8**: Payment Gateway Module
9. **Phase 9**: Admin Panel
10. **Phase 10**: Notifications Module
11. **Phase 11**: Security
12. **Phase 12**: SEO & Performance
13. **Phase 13**: Testing
14. **Phase 14**: Deployment

## � Phase 2: Authentication Module

Phase 2 includes the full authentication flow and access control:

- Implement backend user registration and login endpoints
- Add password hashing and secure storage via bcrypt
- Issue JWT access and refresh tokens
- Create email verification flow and verification endpoint
- Build login and registration pages in Next.js
- Add account verification page and token handling
- Create authenticated route middleware for protected APIs
- Add role-based authorization middleware (User, Seller, Admin)
- Add OAuth support for Google and Facebook login
- Add refresh token endpoint and token renewal flow
- Create frontend auth service and integration with backend
- Add client-side pages for login, register, verify email, and OAuth callback

## �🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 💬 Support

For questions and support, please open an issue on GitHub or contact the development team.

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] AI-powered recommendations
- [ ] Video listings
- [ ] Subscription plans
- [ ] Seller verification system
- [ ] Escrow payment system

---

**Happy Coding! 🚀**

Built with ❤️ for Nepal's marketplace community
