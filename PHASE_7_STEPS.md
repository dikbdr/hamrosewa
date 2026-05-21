# Phase 7: Chat System

This document describes the Phase 7 Chat System for HamroSewa.

## Goals

- Add chat API for buyer-seller communication
- Support chat creation, message sending, and read status
- Add frontend chat list and chat room pages
- Integrate Socket.IO for real-time chat updates
- Update documentation to include chat workflows

## Checklist

- [x] Create backend chat service, controller, and routes
- [x] Register `/api/chats` route in backend
- [x] Wire Socket.IO into the backend
- [x] Add frontend chat service methods
- [x] Add chat list page at `/chat`
- [x] Add chat room page at `/chat/[id]`
- [x] Add navigation from dashboard to chats
- [x] Validate frontend chat routing and build
- [x] Update README and documentation index

## Chat Endpoints

- `GET /api/chats` — list chats for authenticated user
- `GET /api/chats/:id` — get chat details and messages
- `POST /api/chats` — create or retrieve a chat for a listing
- `POST /api/chats/:id/message` — send a message in a chat
- `POST /api/chats/:id/read` — mark chat as read

## Notes

- Chats are scoped to the buyer and the seller for a listing.
- Real-time updates use Socket.IO room join/leave events.
- Chat messages are sent through the backend API and broadcast to the room.
- The frontend chat list is available at `/chat`.
- The chat room is available at `/chat/[id]`.
