<script setup>
import { useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'
import UnitToggler from '../components/exercise/UnitToggler.vue'
import RegionToggler from '../components/exercise/RegionToggler.vue'

const router = useRouter()
const configStore = useConfigStore()
const weatherStore = useWeatherStore()

const handleGoHome = () => {
  router.push('/')
}
</script>

<template>
  <div>
    <h3>⚙️ 설정</h3>
    <hr />

    <div class="setting-row">
      <span>날씨 단위</span>
      <UnitToggler />
    </div>

    <div class="setting-row">
      <span>날씨 범위</span>
      <RegionToggler />
    </div>

    <p class="current-info">현재 설정: {{ configStore.unit === 'celsius' ? '섭씨(℃)' : '화씨(℉)' }} · {{ weatherStore.regionLabel }}</p>

    <button @click="handleGoHome" class="home-btn">대시보드 홈으로 이동</button>
  </div>
</template>

<style scoped>
.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 10px;
}

.current-info {
  color: #64748b;
  font-size: 13px;
  margin: 12px 0 0;
}

.home-btn {
  width: 100%;
  margin-top: 15px;
  padding: 10px;
  background-color: #6366f1;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}
</style>
