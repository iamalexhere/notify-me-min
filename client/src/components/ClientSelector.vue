<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  clients: string[];
  modelValue: string;
}>();

const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <div class="client-selector">
    <label for="client-select">Select Recipient:</label>
    <div class="select-wrapper">
      <select 
        id="client-select" 
        :value="modelValue" 
        @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      >
        <option value="" disabled>-- Select a client --</option>
        <option v-for="c in clients" :key="c" :value="c">
          {{ c }}
        </option>
      </select>
      <span class="online-badge" v-if="clients.length > 0">
        {{ clients.length }} online
      </span>
    </div>
  </div>
</template>

<style scoped>
.client-selector {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

label {
  font-weight: 500;
  color: var(--text-muted);
}

.select-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

select {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  color: var(--text);
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

select:focus {
  border-color: var(--primary);
}

.online-badge {
  background: var(--success);
  color: #fff;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}
</style>
