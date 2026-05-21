# Phase 13: Testing

This document describes the Phase 13 Testing strategy for HamroSewa.

## Goals

- Add automated tests across backend and frontend
- Confirm feature behavior with unit and integration tests
- Add test scripts and coverage reporting
- Document test setup and execution

## Checklist

- [ ] Add Jest and React Testing Library test coverage
- [ ] Create backend unit tests for services and controllers
- [ ] Create frontend component tests for key UI flows
- [ ] Add integration tests for public API behavior
- [ ] Add end-to-end or flow tests if possible
- [ ] Add test scripts for CI and local validation
- [ ] Document how to run tests and interpret coverage

## Testing Focus

- Verify authentication and authorization flows.
- Confirm listings, search, chat, and payment behaviors.
- Validate admin dashboard and notification flows.
- Ensure build and lint checks are part of tests.

## Notes

- Start with small, reliable unit tests.
- Use mocks for external services such as payment gateways.
- Prioritize regression coverage for critical user journeys.
