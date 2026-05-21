# Phase 9: Admin Panel

This document describes the Phase 9 Admin Panel for HamroSewa.

## Goals

- Build a dedicated admin dashboard for site moderation
- Enable user and listing management
- Add analytics, reports, and revenue insights
- Provide admin-only access controls
- Document admin workflows and permissions

## Checklist

- [x] Add backend admin authorization middleware
- [x] Implement admin user management endpoints
- [x] Implement listing moderation and status update endpoints
- [x] Add category and feature management APIs
- [x] Build frontend admin dashboard pages
- [x] Add analytics widgets for revenue, users, and listings
- [x] Build admin reports for recent activity and payments
- [x] Update documentation for admin features

## Admin Features

- User account listing and role management
- Listing moderation and approval flows
- Category creation and management
- Featured listing review and payment tracking
- Dashboard metrics for total users, active listings, new chats, and revenue

## Notes

- Admin routes must be protected using role-based access.
- Log moderation actions for accountability.
- Keep the admin UI simple and data-driven.
