# Phase 8: Payment Gateway Module

This document describes the Phase 8 Payment Gateway Module for HamroSewa.

## Goals

- Add secure payment processing for listings and featured ads
- Support Khalti and eSewa payment flows
- Record transactions in the database
- Add payment verification and payment history endpoints
- Add frontend checkout and payment status pages
- Update documentation to explain payment workflow

## Checklist

- [x] Add backend payment service and payment controller
- [x] Implement payment session creation for Khalti and eSewa
- [x] Add payment verification webhook endpoints
- [x] Record transactions and payment status in the database
- [x] Build frontend checkout page for listing promotion and featured ads
- [x] Add frontend transaction history page for users
- [x] Add payment confirmation and failure handling
- [x] Update README and documentation for payment integration

## Payment Workflows

- `POST /api/payments/create` — create a payment session for a listing or feature purchase
- `POST /api/payments/verify` — verify payment after gateway callback
- `GET /api/payments/history` — get user transaction history
- `POST /api/payments/webhook` — receive gateway webhook events

## Notes

- Payment integration should be secure and idempotent.
- Track payment state: `PENDING`, `COMPLETED`, `FAILED`, `REFUNDED`.
- Ensure listing promotion only activates after successful payment.
- Provide clear UI feedback for payment status.
