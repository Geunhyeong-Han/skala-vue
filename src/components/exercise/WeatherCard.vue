<script setup>
import { useConfigStore } from '@/stores/configStore'
const configStore = useConfigStore()

import { computed } from 'vue'

// 1. 상위로부터 단방향 주입받을 객체 데이터 규격 검수 (매크로)
const props = defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
})

const displayTemp = computed(() => {
  if (configStore.unit === 'celsius') return props.cityItem.temp
  return Math.round(props.cityItem.temp * 9 / 5 + 32)
})

// cityItem.temp는 항상 섭씨 원본값이므로, 더움 판정 기준(25°C)도 현재 단위에 맞게 환산
const isHot = computed(() => {
  const threshold = configStore.unit === 'celsius' ? 25 : Math.round(25 * 9 / 5 + 32)
  return displayTemp.value >= threshold
})

// 2. 상위로 송신할 두 가지 경로의 커스텀 이벤트 식별자 등록 (매크로)
const emit = defineEmits(['select-card', 'click-detail'])
</script>

<template>
  <div class="weather-card" @click="emit('select-card', `${cityItem.name}이 선택되었습니다.`)">
    <h4>{{ cityItem.name }} ({{ cityItem.status }})</h4>
    <p>현재 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</p>

    <span v-if="isHot" class="badge hot">🥵 더움</span>
    <span v-else class="badge cool">🥶 선선함</span>

    <button class="btn-detail" @click.stop="emit('click-detail', cityItem.name, cityItem.status)">상세보기</button>
  </div>
</template>

<style scoped>
.weather-card {
  background: #faf8f8;
  border: 1px solid #6e8b1e;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
}
.badge {
  display: inline-block;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  color: #fff;
}
.hot {
  background-color: #ff7675;
}
.cool {
  background-color: #74b9ff;
}
.btn-detail {
  position: absolute;
  right: 12px;
  top: 15px;
  padding: 6px 10px;
  cursor: pointer;
}
</style>
