# Phase 6: Search & Filter Module

This document describes the Phase 6 Search & Filter Module for HamroSewa.

## Goals

- Add search and filter support for listings
- Enable category, location, price, condition, and status filters
- Create a dedicated search page in the frontend
- Keep the public listing API flexible for query params
- Document search and filter workflow for users

## Checklist

- [x] Extend backend listing endpoint to support search/filter query parameters
- [x] Add dedicated frontend search page
- [x] Support price range filtering
- [x] Support category, city, district, condition, and status filters
- [x] Integrate frontend search page with the listing service
- [x] Add navigation to the search page from listing browse page
- [x] Update documentation for Phase 6
- [x] Validate frontend build and route registration

## Search & Filter Parameters

- `category` — filter by category slug
- `search` — keyword search against title and description
- `minPrice` — minimum listing price
- `maxPrice` — maximum listing price
- `city` — city name filter
- `district` — district name filter
- `status` — listing status filter (`ACTIVE`, `INACTIVE`, `SOLD`, `EXPIRED`, `DELETED`, `FLAGGED`)
- `condition` — listing condition filter (`NEW`, `LIKE_NEW`, `GOOD`, `USED`, `NOT_WORKING`)
- `featured` — featured-only listings when set to `true`

## Notes

- Search is case-insensitive for title, description, city, and district.
- The endpoint continues to return `ACTIVE` listings by default unless a different status is requested.
- The search page is available at `/search` in the frontend.
