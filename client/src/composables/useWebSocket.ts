import { ref } from 'vue';

export interface NotificationMsg {
    id: string;
    from: string;
    text: string;
    receivedAt: string;
}

export interface SentLogMsg {
    id: string;
    to: string;
    text: string;
    sentAt: string;
    ackAt?: string;
}

export function useWebSocket() {
    const ws = ref<WebSocket | null>(null);
    const clientId = ref<string>('');
    const clients = ref<string[]>([]);
    const notifications = ref<NotificationMsg[]>([]);
    const sentLog = ref<SentLogMsg[]>([]);

    // We play sound when a new notification is received
    const playSound = () => {
        try {
            const audio = new window.Audio('/sounds/notification.mp3');
            audio.play().catch(e => console.error("Sound play failed", e));
        } catch (e) {
            console.error("Audio not supported or failed", e);
        }
    };

    const connect = (nameParam?: string) => {
        // Connect to WebSocket proxy
        const wsUrl = new URL('/ws', window.location.href);
        wsUrl.protocol = wsUrl.protocol.replace('http', 'ws');
        if (nameParam) {
            wsUrl.searchParams.set('name', nameParam);
        }

        const socket = new WebSocket(wsUrl.toString());

        socket.onopen = () => {
            console.log('Connected to WebSocket');
            // Set local client ID for display purposes
            clientId.value = nameParam || 'My IP Address (unknown locally)';
            // Fetch initial clients
            fetchClients();
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === 'clients_update') {
                    clients.value = data.clients.filter((c: string) => c !== clientId.value);
                } else if (data.type === 'notify') {
                    // Received a notification
                    playSound();
                    const newNotif = {
                        id: Date.now().toString(),
                        from: data.from,
                        text: data.text,
                        receivedAt: new Date().toLocaleTimeString(),
                    };
                    notifications.value.unshift(newNotif);

                    // Auto ACK
                    socket.send(JSON.stringify({ type: 'ack', to: data.from }));
                } else if (data.type === 'ack') {
                    // Received ACK for a sent notification
                    const logEntry = sentLog.value.find(s => s.to === data.from && !s.ackAt);
                    if (logEntry) {
                        logEntry.ackAt = data.at || new Date().toLocaleTimeString();
                    }
                }
            } catch (err) {
                console.error('Failed processing message', err);
            }
        };

        socket.onclose = () => {
            console.log('WebSocket closed');
            setTimeout(() => connect(nameParam), 3000); // Reconnect
        };

        ws.value = socket;
    };

    const fetchClients = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || `/api/clients`;
            const res = await fetch(apiUrl);
            const data = await res.json();
            clients.value = data.clients.filter((c: string) => c !== clientId.value);
        } catch (err) {
            console.error('Failed fetching clients', err);
        }
    };

    const sendNotify = (to: string, text: string) => {
        if (!ws.value || ws.value.readyState !== WebSocket.OPEN) return;

        ws.value.send(JSON.stringify({ type: 'notify', to, text }));

        // Add to sent log
        sentLog.value.unshift({
            id: Date.now().toString(),
            to,
            text,
            sentAt: new Date().toLocaleTimeString(),
        });
    };

    return {
        connect,
        clientId,
        clients,
        notifications,
        sentLog,
        sendNotify
    };
}
