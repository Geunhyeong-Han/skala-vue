import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useWeatherStore = defineStore('weather', () => {
  // 1. state: 국내/국외 도시 데이터와, 현재 어느 범위를 보고 있는지
  const cities = ref([
    { id: 'city_01', name: '서울', temp: 28, status: '맑음', region: 'domestic' },
    { id: 'city_03', name: '부산', temp: 26, status: '구름', region: 'domestic' },
    { id: 'city_04', name: '인천', temp: 27, status: '맑음', region: 'domestic' },
    { id: 'city_09', name: '제주', temp: 31, status: '맑음', region: 'domestic' },
    { id: 'city_10', name: '도쿄', temp: 30, status: '맑음', region: 'international' },
    { id: 'city_11', name: '뉴욕', temp: 22, status: '흐림', region: 'international' },
    { id: 'city_12', name: '런던', temp: 18, status: '비', region: 'international' },
    { id: 'city_13', name: '파리', temp: 20, status: '맑음', region: 'international' },
  ])

  const viewRegion = ref('domestic')

  // 2. getters: 현재 범위에 맞는 도시 목록과, 화면에 뿌릴 라벨
  const filteredCities = computed(() => cities.value.filter((city) => city.region === viewRegion.value))

  const regionLabel = computed(() => (viewRegion.value === 'domestic' ? '국내' : '국외'))

  // 3. actions: 버튼 클릭 시 국내/국외를 토글(스위칭)하는 함수
  function toggleRegion() {
    viewRegion.value = viewRegion.value === 'domestic' ? 'international' : 'domestic'
  }

  return {
    cities,
    viewRegion,
    filteredCities,
    regionLabel,
    toggleRegion,
  }
})
