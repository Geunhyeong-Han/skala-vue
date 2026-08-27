<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

const mockDetails = {
  city_01: {
    name: '대한민국 서울특별시',
    temp: 28,
    status: '맑음',
    humidity: '55%',
    wind: '2.5m/s',
  },
  city_03: {
    name: '경기도 수원시 영통구',
    temp: 24,
    status: '비',
    humidity: '85%',
    wind: '4.1m/s',
  },
  city_04: { name: '인천광역시 남동구', temp: 27, status: '맑음', humidity: '60%', wind: '3.2m/s' },
  city_09: {
    name: '제주특별자치도 제주시',
    temp: 31,
    status: '맑음',
    humidity: '50%',
    wind: '2.8m/s',
  },
  city_10: { name: '일본 도쿄도', temp: 30, status: '맑음', humidity: '65%', wind: '3.0m/s' },
  city_11: {
    name: '미국 뉴욕주 뉴욕시',
    temp: 22,
    status: '흐림',
    humidity: '58%',
    wind: '5.2m/s',
  },
  city_12: { name: '영국 런던', temp: 18, status: '비', humidity: '80%', wind: '4.5m/s' },
  city_13: { name: '프랑스 파리', temp: 20, status: '맑음', humidity: '62%', wind: '3.6m/s' },
}

const cityData = ref(null)

onMounted(() => {
  const id = route.params.cityId
  if (mockDetails[id]) {
    cityData.value = mockDetails[id]
  }
})

// cityData.temp도 항상 섭씨 원본값이므로 WeatherCard와 동일하게 store 단위에 맞춰 환산
const displayTemp = computed(() => {
  if (!cityData.value) return null
  if (configStore.unit === 'celsius') return cityData.value.temp
  return Math.round((cityData.value.temp * 9) / 5 + 32)
})
</script>

<template>
  <div class="detail-container">
    <h3>📊 지역별 상세 기상 관측 정보</h3>
    <hr />

    <div v-if="cityData" class="info-card">
      <h4>📍 지정 지역: {{ cityData.name }}</h4>
      <p>
        실시간 기온: <strong>{{ displayTemp }}{{ configStore.unitSymbol }}</strong>
      </p>
      <p>기상 현황: {{ cityData.status }}</p>
      <p>대기 습도: {{ cityData.humidity }}</p>
      <p>현재 풍속: {{ cityData.wind }}</p>
    </div>
    <div v-else>
      <p>해당 지역의 상세 데이터 장부가 존재하지 않습니다.</p>
    </div>

    <button @click="router.push('/')" class="back-btn">← 메인 대시보드로 돌아가기</button>
  </div>
</template>

<style scoped>
.detail-container {
  margin: 0 auto;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.info-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 15px;
  border-radius: 6px;
  margin: 15px 0;
}
.back-btn {
  padding: 8px 12px;
  background: #1e293b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
