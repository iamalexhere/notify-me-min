<script setup lang="ts">
import type { NotificationMsg, SentLogMsg } from '../composables/useWebSocket';

defineProps<{
  notifications: NotificationMsg[];
  sentLog: SentLogMsg[];
}>();
</script>

<template>
  <div class="logs-container">
    <div class="log-column">
      <h3>📥 Received Notifications</h3>
      <div v-if="notifications.length === 0" class="empty-state">
        No notifications yet.
      </div>
      <transition-group name="list" tag="div" class="log-list">
        <div v-for="n in notifications" :key="n.id" class="log-item received">
          <div class="log-header">
            <span class="peer">{{ n.from }}</span>
            <span class="time">{{ n.receivedAt }}</span>
          </div>
          <div class="log-body">{{ n.text }}</div>
          <div class="log-footer">
            <span class="ack-badge">✅ Auto-ACK Sent</span>
          </div>
        </div>
      </transition-group>
    </div>

    <div class="log-column">
      <h3>📤 Sent Log</h3>
      <div v-if="sentLog.length === 0" class="empty-state">
        No messages sent.
      </div>
      <transition-group name="list" tag="div" class="log-list">
        <div v-for="s in sentLog" :key="s.id" class="log-item sent">
          <div class="log-header">
            <span class="peer">To: {{ s.to }}</span>
            <span class="time">{{ s.sentAt }}</span>
          </div>
          <div class="log-body">{{ s.text }}</div>
          <div class="log-footer">
            <span v-if="s.ackAt" class="ack-status success">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              Verified Received at {{ s.ackAt }}
            </span>
            <span v-else class="ack-status pending">
              <span class="spinner"></span> Waiting for ACK...
            </span>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<style scoped>
.logs-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  height: 100%;
}

@media (max-width: 768px) {
  .logs-container {
    grid-template-columns: 1fr;
  }
}

.log-column {
  display: flex;
  flex-direction: column;
  background: var(--surface-1);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid var(--border);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.empty-state {
  color: var(--text-muted);
  text-align: center;
  padding: 3rem 1rem;
  font-style: italic;
  background: var(--surface-2);
  border-radius: 12px;
  border: 1px dashed var(--border);
}

.log-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.log-item {
  background: var(--surface-2);
  border-radius: 12px;
  padding: 1rem;
  border-left: 4px solid transparent;
  transition: all 0.3s ease;
}

.log-item.received {
  border-left-color: var(--secondary);
}

.log-item.sent {
  border-left-color: var(--primary);
}

.log-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
}

.peer {
  font-weight: 600;
  color: var(--text);
}

.time {
  color: var(--text-muted);
}

.log-body {
  font-size: 1rem;
  line-height: 1.5;
  color: var(--text);
  margin-bottom: 1rem;
  word-break: break-word;
  white-space: pre-wrap;
}

.log-footer {
  display: flex;
  justify-content: flex-end;
  font-size: 0.8rem;
}

.ack-badge {
  background: rgba(16, 185, 129, 0.15);
  color: var(--success);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-weight: 600;
}

.ack-status.success {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--success);
  font-weight: 500;
}

.ack-status.pending {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--warning);
  font-weight: 500;
}

.spinner {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(245, 158, 11, 0.3);
  border-top-color: var(--warning);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Vue Animations */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
