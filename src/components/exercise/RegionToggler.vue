<script setup>
import { useWeatherStore } from '@/stores/weatherStore'
const weatherStore = useWeatherStore()
</script>

<template>
  <div style="text-align: center; display: inline-flex; align-items: center; gap: 8px">
    <span
      >날씨 범위: <strong>{{ weatherStore.regionLabel }}</strong></span
    >
    <button @click="weatherStore.toggleRegion" class="toggle-btn">국내/국외 전환</button>
  </div>
</template>

<style scoped>
.toggle-btn {
  padding: 6px 10px;
  background-color: #6366f1;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
</style>
