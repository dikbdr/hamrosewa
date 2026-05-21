# Phase 2: Authentication Module

This document outlines the Phase 2 Authentication Module for HamroSewa.

## Goals

- Build a secure authentication system for the marketplace
- Support email/password login and OAuth
- Protect API routes with JWT and role-based access
- Add email verification and refresh token flow
- Provide frontend pages for login, registration, and verification

## Phase 2 Checklist

- [ ] Implement backend registration endpoint (`/api/auth/register`)
- [ ] Implement backend login endpoint (`/api/auth/login`)
- [ ] Add password hashing with `bcrypt`
- [ ] Add JWT access token creation and validation
- [ ] Add refresh token generation and refresh endpoint (`/api/auth/refresh`)
- [ ] Add email verification token generation and verification endpoint (`/api/auth/verify-email`)
- [ ] Create authentication middleware for protected API routes
- [ ] Create role-based authorization middleware for `USER`, `SELLER`, and `ADMIN`
- [ ] Add Google OAuth login support
- [ ] Add Facebook OAuth login support
- [ ] Create frontend `/register` page with validation
- [ ] Create frontend `/login` page with email/password and OAuth links
- [ ] Create frontend email verification page
- [ ] Create frontend OAuth callback page and token handling
- [ ] Update documentation with auth flow and required env vars

## Environment Variables

- `JWT_SECRET`
- `REFRESH_TOKEN_SECRET`
- `JWT_EXPIRY`
- `REFRESH_TOKEN_EXPIRY`
- `EMAIL_SERVICE`
- `EMAIL_USER`
- `EMAIL_PASSWORD`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL`
- `FACEBOOK_APP_ID`
- `FACEBOOK_APP_SECRET`
- `FACEBOOK_CALLBACK_URL`
- `BACKEND_URL`
- `FRONTEND_URL`

## Notes

- Use secure credentials and app passwords for email.
- Verify email addresses before granting full access.
- Keep refresh tokens secure and rotate when needed.
