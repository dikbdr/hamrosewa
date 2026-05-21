# Phase 10: Notifications Module

This document describes the Phase 10 Notifications Module for HamroSewa.

## Goals

- Add in-app notification support for key events
- Add email notifications for important workflows
- Support notification preferences and read tracking
- Add real-time notification delivery using Socket.IO
- Document notification flows for users and admins

## Checklist

- [x] Create backend notification service and controller
- [x] Add notification database model and read/unread tracking
- [x] Add notification endpoints for the current user
- [ ] Integrate email notification templates for key events
- [x] Build frontend notification center page
- [ ] Add notification toast or banner UI
- [ ] Add user preferences for email and in-app notifications
- [x] Update documentation for notifications

## Notification Types

- New chat message received
- Listing inquiry or purchase request
- Payment success or failure
- Listing approval, rejection, or expiration
- Administrative announcements

## Notes

- Real-time notifications should use Socket.IO to push events.
- Email notifications should be sent for critical events only.
- Keep notification payloads small and easy to render.
