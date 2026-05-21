# Phase 4: Category Module

This document describes the Phase 4 Category Module for HamroSewa.

## Goals

- Add category management for the marketplace
- Create public category listing endpoints
- Build admin-only category CRUD operations
- Add frontend pages for browsing categories, viewing category details, and managing categories
- Document the category workflow and environment requirements

## Checklist

- [x] Add backend category service and controller
- [x] Add public category list endpoint
- [x] Add admin-only category CRUD endpoints
- [x] Register `/api/categories` route in backend
- [x] Create frontend category browsing page
- [x] Create frontend category detail page
- [x] Create frontend admin category management page
- [x] Add category service methods in frontend
- [x] Update documentation with Phase 4 details

## Category Endpoints

- `GET /api/categories` — list active categories
- `GET /api/categories/:id` — get category details
- `POST /api/categories` — create category (`ADMIN` only)
- `PATCH /api/categories/:id` — update category (`ADMIN` only)
- `DELETE /api/categories/:id` — deactivate category (`ADMIN` only)

## Notes

- Categories are not permanently deleted; they are marked inactive.
- Category details can be loaded by ID or slug via `/categories/:id`
- Slugs are derived automatically from category names.
- Public category browsing is available at `/categories`.
- Category cards now link to category details at `/categories/:slug`.
- Admin category management is available at `/admin/categories`.
- Admin endpoints require a valid JWT access token.
- Frontend admin tools must use the same auth token stored in localStorage.
