# Phase 3: User Profile Module

This document outlines the Phase 3 User Profile Module for HamroSewa.

## Goals

- Create a full user profile experience
- Allow users to view and edit their profile
- Add profile image upload support
- Add secure password change flow
- Build a simple dashboard with personal activity metrics
- Protect profile routes with JWT authentication

## Phase 3 Checklist

- [x] Create backend user profile routes under `/api/users`
- [x] Add `GET /api/users/me` to return current user profile
- [x] Add `PATCH /api/users/me` to update personal profile fields
- [x] Add `PATCH /api/users/me/password` to change password securely
- [x] Add `POST /api/users/me/avatar` to upload profile photo
- [x] Add `GET /api/users/dashboard` for user dashboard metrics
- [x] Create Cloudinary config for secure image uploads
- [x] Implement frontend `/profile` page with edit form and image upload
- [x] Implement frontend `/dashboard` page with user metrics
- [x] Add profile service methods for authenticated API requests
- [x] Update documentation to include Phase 3 details

## Environment Variables

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `JWT_SECRET`
- `REFRESH_TOKEN_SECRET`
- `DATABASE_URL`
- `BACKEND_URL`
- `FRONTEND_URL`

## Notes

- Ensure `CLOUDINARY_*` env vars are set before uploading images.
- Use the same JWT token stored on the frontend for protected requests.
- The dashboard endpoint provides a fast summary of listings, favorites, chats, and messages.
- Profile changes are saved immediately and reflected in the UI.
