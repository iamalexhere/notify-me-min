# Notify-Me Min

A lightweight, real-time LAN notification web app built with a **Bun WebSocket Server** and a **Vite + Vue 3 Frontend**. It allows users on the same network to send notifications (text + sound alert) to specific connected peers, and automatically receives delivery confirmations (ACK).

## Architecture
- **Backend**: Bun + native WebSockets (no extra dependencies). Uses an in-memory Map to register clients by IP (or a custom `?name=` override for testing).
- **Frontend**: Vite + Vue 3, completely styled with vanilla CSS (dark glassmorphism theme).

## Configuration
- **Ports**: Configure ports using `.env` files in respective directories
  - Server: `server/.env` - `PORT=4001`
  - Client: `client/.env` - `VITE_PORT=5174`, `VITE_API_PORT=4001`

## Features
- Connects automatically and displays total online peers.
- Select a peer, type a message, and send.
- Target peer receives the message, displays it, and plays an alert sound.
- Target peer's browser *automatically* sends an ACK receipt back.
- Sender sees the status change from "Pending" to "✅ Verified Received".
- Built for LAN: the backend automatically uses `requestIP(req).address` as the client identifier.

## Getting Started

### 1. Start the Backend (Bun)
```bash
cd server
bun install
bun run index.ts
```
*The WebSocket and REST API server will run on `http://localhost:4001`.*

### 2. Add Your Notification Sound
By default, the app tries to play a sound on receiving a notification.
Please place your own `notification.mp3` file at:
```text
client/public/sounds/notification.mp3
```

### 3. Start the Frontend (Vite)
```bash
cd client
npm install
npm run dev -- --host
```
*The frontend will be exposed on your local network (e.g., `http://192.168.1.X:5174`).*

### 4. Testing Locally (Multi-Tab)
To test the app locally using multiple tabs, simply open:
- Tab 1: `http://localhost:5174/?name=Alice`
- Tab 2: `http://localhost:5174/?name=Bob`

Because they connect from the same `localhost` IP, the `?name=` URL parameter is required to distinguish them during testing. On a real LAN with multiple devices, just open `http://<your-server-ip>:5174/` and it will use their real IPs.

## Port Configuration
Default ports can be customized by editing the `.env` files:
- **Server**: Edit `server/.env` to change `PORT`
- **Client**: Edit `client/.env` to change `VITE_PORT` and `VITE_API_PORT`
