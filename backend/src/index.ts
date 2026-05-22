/**
 * HamroSewa Backend - Main Entry Point
 * 
 * This is the main server file that:
 * 1. Initializes Express application
 * 2. Sets up middleware (authentication, validation, etc.)
 * 3. Configures routes
 * 4. Sets up real-time communication (Socket.IO)
 * 5. Starts the server
 * 
 * For junior developers:
 * - Think of this as the "main hub" where everything connects
 * - All routes, middleware, and services pass through here
 */

import 'express-async-errors'; // Handle async errors automatically
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import passport from 'passport';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import categoryRoutes from './routes/categoryRoutes';
import listingRoutes from './routes/listingRoutes';
import chatRoutes from './routes/chatRoutes';
import paymentRoutes from './routes/paymentRoutes';
import notificationRoutes from './routes/notificationRoutes';
import adminRoutes from './routes/adminRoutes';
import { initializePassport } from './config/passport';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app: Express = express();
const port = process.env.PORT || 5000;
const nodeEnv = process.env.NODE_ENV || 'development';

initializePassport();
app.use(passport.initialize());

// Create HTTP server for Socket.IO
const httpServer = createServer(app);

// Initialize Socket.IO for real-time communication
const frontendOrigin = process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: frontendOrigin,
    methods: ['GET', 'POST'],
  },
});

app.set('io', io);

// ==================== MIDDLEWARE SETUP ====================

/**
 * Security Middleware
 * - helmet: Adds security headers
 * - cors: Allows cross-origin requests from frontend
 */
app.use(helmet());

app.use(
  cors({
    origin: frontendOrigin,
    credentials: true,
  })
);

/**
 * Body Parser Middleware
 * - Parses JSON request bodies
 * - Limits to 10mb to prevent large payloads
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

/**
 * Rate Limiting Middleware
 * - Prevents brute force attacks
 * - Limits 100 requests per 15 minutes per IP
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// ==================== ROUTES ====================

/**
 * Health Check Endpoint
 * Simple endpoint to verify server is running
 * Used by: Monitoring systems, Docker health checks
 */
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'HamroSewa API is running',
    environment: nodeEnv,
    health: '/health',
    apiDocumentation: '/api',
  });
});

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: nodeEnv,
  });
});

/**
 * API Routes (will be added in Phase 2)
 * These routes handle:
 * - Authentication: /api/auth
 * - Users: /api/users
 * - Listings: /api/listings
 * - Chats: /api/chats
 * - Payments: /api/payments
 */
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// ==================== SOCKET.IO SETUP ====================

/**
 * Socket.IO Event Handlers
 * Real-time features like chat, notifications use Socket.IO
 */
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join-user', (userId: string) => {
    socket.join(userId);
  });

  socket.on('join-chat', (chatId: string) => {
    socket.join(chatId);
  });

  socket.on('leave-chat', (chatId: string) => {
    socket.leave(chatId);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// ==================== ERROR HANDLING ====================

/**
 * 404 Not Found Handler
 * Called when no route matches the request
 */
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: _req.path,
  });
});

/**
 * Global Error Handler
 * Catches all errors from routes and middleware
 * 
 * For junior developers:
 * - This catches ANY error thrown in the application
 * - Prevents server crash
 * - Returns formatted error response to client
 */
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error({
    error: message,
    statusCode,
    timestamp: new Date().toISOString(),
  });

  res.status(statusCode).json({
    success: false,
    message,
    ...(nodeEnv === 'development' && { stack: err.stack }),
  });
});

// ==================== START SERVER ====================

/**
 * Start HTTP server with Socket.IO
 * Listen on configured port
 */
httpServer.listen(port, () => {
  console.log(`
    ╔════════════════════════════════════════╗
    ║     🚀 HamroSewa Backend Server       ║
    ╠════════════════════════════════════════╣
    ║ Server: http://localhost:${port}          ║
    ║ Environment: ${nodeEnv}                   ║
    ║ Socket.IO: Enabled                   ║
    ╚════════════════════════════════════════╝
  `);
});

/**
 * Handle unhandled promise rejections
 * Prevents server from crashing silently
 */
process.on('unhandledRejection', (reason: Error) => {
  console.error('❌ Unhandled Rejection:', reason);
  process.exit(1);
});

/**
 * Handle uncaught exceptions
 * Prevents server from crashing silently
 */
process.on('uncaughtException', (error: Error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export { app, io };
