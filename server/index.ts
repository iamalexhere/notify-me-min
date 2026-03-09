import {
    registerClient,
    unregisterClient,
    getClient,
    getConnectedClientIds,
} from "./registry";

function getClientIP(req: Request): string {
    const forwarded = req.headers.get("x-forwarded-for");
    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }
    const realIp = req.headers.get("x-real-ip");
    if (realIp) {
        return realIp;
    }
    return "unknown";
}

const PORT = Number(process.env.PORT) || 3001;

Bun.serve({
    port: PORT,
    fetch(req, server) {
        const url = new URL(req.url);

        // REST: Get list of connected clients
        if (url.pathname === "/clients" && req.method === "GET") {
            return Response.json({ clients: getConnectedClientIds() }, {
                headers: {
                    "Access-Control-Allow-Origin": "*", // allow frontend access during dev
                }
            });
        }

        // WebSocket upgrade endpoint
        if (url.pathname === "/ws") {
            const nameParam = url.searchParams.get("name");
            const clientIp = getClientIP(req);
            const socketId = nameParam || clientIp;

            const upgraded = server.upgrade(req, {
                data: { name: socketId },
            });
            if (upgraded) return undefined;
        }

        // Default response
        return new Response("Notify-me WebSocket backend", { status: 200 });
    },

    websocket: {
        open(ws) {
            const id = ws.data.name;
            console.log(`[Connect] ${id}`);
            registerClient(id, ws);
        },

        message(ws, message) {
            const id = ws.data.name;
            try {
                const payload = JSON.parse(message as string);

                if (payload.type === "notify") {
                    const { to, text } = payload;
                    const targetWs = getClient(to);
                    if (targetWs) {
                        targetWs.send(
                            JSON.stringify({
                                type: "notify",
                                from: id,
                                text,
                            })
                        );
                    } else {
                        console.log(`Failed to notify ${to}: client not found`);
                    }
                } else if (payload.type === "ack") {
                    const { to } = payload;
                    const targetWs = getClient(to);
                    if (targetWs) {
                        targetWs.send(
                            JSON.stringify({
                                type: "ack",
                                from: id,
                                at: new Date().toISOString(),
                            })
                        );
                    }
                }
            } catch (err) {
                console.error("Failed to parse message", err);
            }
        },

        close(ws) {
            const id = ws.data.name;
            console.log(`[Disconnect] ${id}`);
            unregisterClient(id);
        },
    },
});

console.log(`Server listening on http://localhost:${PORT} (or http://0.0.0.0:${PORT} for LAN)`);