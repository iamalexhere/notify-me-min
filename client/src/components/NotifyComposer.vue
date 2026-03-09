<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  disabled: boolean;
}>();

const emit = defineEmits<{
  (e: 'send', text: string): void;
}>();

const text = ref('');

const send = () => {
  if (!text.value.trim() || props.disabled) return;
  emit('send', text.value);
  text.value = '';
};
</script>

<template>
  <div class="notify-composer">
    <textarea 
      v-model="text" 
      placeholder="Type your notification message..." 
      :disabled="disabled"
      @keydown.ctrl.enter="send"
      @keydown.meta.enter="send"
    ></textarea>
    <button 
      @click="send" 
      :disabled="disabled || !text.trim()"
      class="send-btn"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
      </svg>
      Send Notify
    </button>
  </div>
</template>

<style scoped>
.notify-composer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

textarea {
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  border-radius: 12px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  color: var(--text);
  font-size: 1rem;
  resize: vertical;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
}

textarea:focus {
  border-color: var(--primary);
}

textarea:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.1s, background 0.2s, opacity 0.2s;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.send-btn:hover:not(:disabled) {
  background: var(--primary-hover);
  transform: translateY(-1px);
}

.send-btn:active:not(:disabled) {
  transform: translateY(1px);
}

.send-btn:disabled {
  background: var(--surface-3);
  color: var(--text-muted);
  box-shadow: none;
  cursor: not-allowed;
}
</style>
