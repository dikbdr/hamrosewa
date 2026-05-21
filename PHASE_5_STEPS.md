# Phase 5: Product / Listing Module

This document describes the Phase 5 Product/Listing Module for HamroSewa.

## Goals

- Add public listing browsing pages
- Create listing API endpoints for listing data
- Build admin controls for listing creation and status management
- Support category-filtered listing views
- Document the product-listing workflow for future phases

## Checklist

- [x] Add backend listing service and controller
- [x] Add public listing list endpoint
- [x] Add public listing detail endpoint
- [x] Add authenticated listing create/update/delete endpoints
- [x] Register `/api/listings` route in backend
- [x] Create frontend listing browse page
- [x] Create frontend admin listing management page
- [x] Add listing service methods in frontend
- [x] Update documentation with Phase 5 details

## Listing Endpoints

- `GET /api/listings` — list active listings
- `GET /api/listings/:id` — get a specific listing
- `POST /api/listings` — create a listing (`SELLER` or `ADMIN` only)
- `PATCH /api/listings/:id` — update listing (`SELLER` owner or `ADMIN` only)
- `DELETE /api/listings/:id` — deactivate listing (`SELLER` owner or `ADMIN` only)

## Notes

- Listings are soft-deactivated by setting status to `INACTIVE`.
- Slugs are derived automatically from listing titles.
- Public product browsing is limited to `ACTIVE` listings.
- Admin and seller users can manage listings.
- Images can be supplied as comma-separated URLs for quick listing creation.
