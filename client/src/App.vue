<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useWebSocket } from './composables/useWebSocket';
import ClientSelector from './components/ClientSelector.vue';
import NotifyComposer from './components/NotifyComposer.vue';
import NotificationLog from './components/NotificationLog.vue';

const {
  connect,
  clientId,
  clients,
  notifications,
  sentLog,
  sendNotify
} = useWebSocket();

const selectedClient = ref('');

onMounted(() => {
  // Check for ?name= override
  const params = new URLSearchParams(window.location.search);
  const paramName = params.get('name') || undefined;
  connect(paramName);
});

const handleSend = (text: string) => {
  if (selectedClient.value) {
    sendNotify(selectedClient.value, text);
  }
};
</script>

<template>
  <div class="app-container">
    <header class="topbar">
      <div class="logo">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
        Notify-Me Min
      </div>
      <div class="identity">
        You are connected as: <strong>{{ clientId || 'Connecting...' }}</strong>
      </div>
    </header>

    <main class="main-content">
      <aside class="sidebar">
        <div class="glass-panel">
          <h2>Send Notification</h2>
          <ClientSelector 
            v-model="selectedClient" 
            :clients="clients" 
          />
          <NotifyComposer 
            :disabled="!selectedClient" 
            @send="handleSend" 
          />
        </div>
      </aside>

      <section class="content-area">
        <NotificationLog 
          :notifications="notifications" 
          :sentLog="sentLog" 
        />
      </section>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.topbar {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  background: var(--surface-1);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary);
  letter-spacing: -0.02em;
}

.identity {
  font-size: 0.95rem;
  color: var(--text-muted);
  background: var(--surface-2);
  padding: 0.4rem 1rem;
  border-radius: 20px;
  border: 1px solid var(--border);
}

.identity strong {
  color: var(--text);
  margin-left: 0.25rem;
}

.main-content {
  flex: 1;
  display: flex;
  padding: 2rem;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.sidebar {
  flex: 0 0 350px;
}

.content-area {
  flex: 1;
  min-width: 0;
}

.glass-panel {
  background: var(--surface-1);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid var(--border);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 2rem;
}

.glass-panel h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

@media (max-width: 900px) {
  .main-content {
    flex-direction: column;
  }
  .sidebar {
    flex: auto;
  }
  .glass-panel {
    position: static;
  }
}
</style>
