import type { ServerWebSocket } from "bun";

export type ClientData = {
  name: string;
};

// Map of socket id (derived from IP or overridden by query param) to the WebSocket instance
const clients = new Map<string, ServerWebSocket<ClientData>>();

export function registerClient(id: string, ws: ServerWebSocket<ClientData>) {
  clients.set(id, ws);
  broadcastClientList();
}

export function unregisterClient(id: string) {
  clients.delete(id);
  broadcastClientList();
}

export function getClient(id: string): ServerWebSocket<ClientData> | undefined {
  return clients.get(id);
}

export function getConnectedClientIds(): string[] {
  return Array.from(clients.keys());
}

export function broadcastClientList() {
  const list = getConnectedClientIds();
  const payload = JSON.stringify({
    type: "clients_update",
    clients: list,
  });

  for (const [id, ws] of clients.entries()) {
    ws.send(payload);
  }
}
