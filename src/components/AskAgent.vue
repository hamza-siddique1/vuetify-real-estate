<template>
  <button class="ask-agent-btn" @click="$emit('click')">
    Ask Agent
  </button>
</template>

<script setup>
defineEmits(['click'])
</script>

<style scoped>
.ask-agent-btn {
  font-size: 12px;
  font-weight: 500;
  color: #16a34a;
  background: none;
  border: 1px solid #16a34a;
  border-radius: 5px;
  padding: 2px 8px;
  cursor: pointer;
  transition: background .15s;
}
.ask-agent-btn:hover {
  background: #f0fdf4;
}
</style>
