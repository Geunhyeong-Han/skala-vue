import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

const API_KEY = import.meta.env.VITE_OWM_API_KEY
const REST_COUNTRIES_API_KEY = import.meta.env.VITE_REST_COUNTRIES_API_KEY

// OpenWeatherMap 대기질 지수(1~5)를 라벨/이모지로 변환하는 매핑표
// https://openweathermap.org/api/air-pollution
const AQI_META = {
  1: { label: 'Good', emoji: '🟢' },
  2: { label: 'Fair', emoji: '🟡' },
  3: { label: 'Moderate', emoji: '🟠' },
  4: { label: 'Poor', emoji: '🔴' },
  5: { label: 'Very Poor', emoji: '🟣' },
}

export const useWeatherStore = defineStore('weather', () => {
  // 1. state: 국내/국외 도시 데이터와, 현재 어느 범위를 보고 있는지
  // temp/status/aqi는 API 응답이 오기 전까지 화면에 보여줄 초기값(목업)이고, query는 OpenWeatherMap 조회용 도시명
  // countryCode는 REST Countries 조회용 alpha-2 코드, countryFlag는 배경에 깔 국기 이미지 URL(국외만 채워짐)
  const cities = ref([
    {
      id: 'city_01',
      name: '서울',
      query: 'Seoul,KR',
      temp: 28,
      status: '맑음',
      aqi: null,
      countryCode: 'KR',
      countryFlag: null,
      region: 'domestic',
    },
    {
      id: 'city_03',
      name: '부산',
      query: 'Busan,KR',
      temp: 26,
      status: '구름',
      aqi: null,
      countryCode: 'KR',
      countryFlag: null,
      region: 'domestic',
    },
    {
      id: 'city_04',
      name: '인천',
      query: 'Incheon,KR',
      temp: 27,
      status: '맑음',
      aqi: null,
      countryCode: 'KR',
      countryFlag: null,
      region: 'domestic',
    },
    {
      id: 'city_09',
      name: '제주',
      query: 'Jeju,KR',
      temp: 31,
      status: '맑음',
      aqi: null,
      countryCode: 'KR',
      countryFlag: null,
      region: 'domestic',
    },
    {
      id: 'city_10',
      name: '도쿄',
      query: 'Tokyo,JP',
      temp: 30,
      status: '맑음',
      aqi: null,
      countryCode: 'JP',
      countryFlag: null,
      region: 'international',
    },
    {
      id: 'city_11',
      name: '뉴욕',
      query: 'New York,US',
      temp: 22,
      status: '흐림',
      aqi: null,
      countryCode: 'US',
      countryFlag: null,
      region: 'international',
    },
    {
      id: 'city_12',
      name: '런던',
      query: 'London,GB',
      temp: 18,
      status: '비',
      aqi: null,
      countryCode: 'GB',
      countryFlag: null,
      region: 'international',
    },
    {
      id: 'city_13',
      name: '파리',
      query: 'Paris,FR',
      temp: 20,
      status: '맑음',
      aqi: null,
      countryCode: 'FR',
      countryFlag: null,
      region: 'international',
    },
  ])

  const viewRegion = ref('domestic')
  const isLoading = ref(false)
  const fetchError = ref(null)

  // 2. getters: 현재 범위에 맞는 도시 목록과, 화면에 뿌릴 라벨
  const filteredCities = computed(() =>
    cities.value.filter((city) => city.region === viewRegion.value),
  )

  const regionLabel = computed(() => (viewRegion.value === 'domestic' ? '국내' : '국외'))

  // aqi(1~5) 숫자를 받아 { label, emoji }를 돌려주는 함수형 getter
  const aqiInfo = computed(() => (aqi) => AQI_META[aqi] ?? null)

  // 3. actions: 버튼 클릭 시 국내/국외를 토글(스위칭)하는 함수
  function toggleRegion() {
    viewRegion.value = viewRegion.value === 'domestic' ? 'international' : 'domestic'
  }

  // OpenWeatherMap에서 도시별 실시간 기온/상태 + 대기질 지수를 가져와 cities 배열을 갱신
  async function fetchCities() {
    isLoading.value = true
    fetchError.value = null

    try {
      await Promise.all(
        cities.value.map(async (city) => {
          const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city.query)}&appid=${API_KEY}&units=metric&lang=kr`
          const weatherRes = await axios.get(weatherUrl)
          city.temp = Math.round(weatherRes.data.main.temp)
          city.status = weatherRes.data.weather[0].description

          // 날씨 응답에 담긴 위경도를 그대로 재사용해 대기질 API 호출
          const { lat, lon } = weatherRes.data.coord
          const airUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
          const airRes = await axios.get(airUrl)
          city.aqi = airRes.data.list[0].main.aqi
        }),
      )
    } catch (error) {
      console.error('날씨/대기질 데이터를 가져오는 중 에러가 발생했습니다:', error)
      fetchError.value = '실시간 날씨 데이터를 가져오지 못했습니다. 목업 데이터로 표시 중입니다.'
    } finally {
      isLoading.value = false
    }
  }

  // REST Countries에서 국외 도시의 국기 이미지를 가져와 countryFlag에 저장 (국내는 건너뜀)
  async function fetchCountryFlags() {
    const internationalCities = cities.value.filter((city) => city.region === 'international')

    try {
      await Promise.all(
        internationalCities.map(async (city) => {
          const url = `https://api.restcountries.com/countries/v5/codes.alpha_2/${city.countryCode}`
          const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${REST_COUNTRIES_API_KEY}` },
          })
          city.countryFlag = response.data.data.objects[0].flag.url_svg
        }),
      )
    } catch (error) {
      console.error('국기 이미지를 가져오는 중 에러가 발생했습니다:', error)
    }
  }

  return {
    cities,
    viewRegion,
    isLoading,
    fetchError,
    filteredCities,
    regionLabel,
    aqiInfo,
    toggleRegion,
    fetchCities,
    fetchCountryFlags,
  }
})
