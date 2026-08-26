<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

//    1. 나만의 데이터 만들기
//    온도 구간(hot/mild/cool)마다 어울리는 관광 특성을 label(카드용 짧은 문구)과
//    detail(상세보기용 긴 설명)로 나누어 정의합니다.
const weatherList = ref([
  {
    id: 'city_01',
    name: '서울',
    temp: 29,
    status: '맑음',
    tourism: {
      hot: { label: '🌊 한강 물놀이 시즌', detail: '한강공원 반포 무지개분수와 물놀이장에서 더위를 식히고, 야간 한강 피크닉을 즐기기 추천.' },
      mild: { label: '🚶 고궁 도보여행', detail: '경복궁·북촌한옥마을 도보 여행과 남산타워 야경 감상하기 좋은 날씨예요.' },
      cool: { label: '🏛️ 실내 전시 관람', detail: '광장시장 먹거리 투어와 국립중앙박물관 등 실내 전시 관람을 추천해요.' },
    },
  },
  {
    id: 'city_02',
    name: '부산',
    temp: 26,
    status: '구름',
    tourism: {
      hot: { label: '🏖️ 해수욕장 피서', detail: '해운대·광안리 해수욕장에서 물놀이를 즐기고, 화려한 광안대교 야경으로 여름밤을 즐겨보세요.' },
      mild: { label: '🎨 문화마을 산책', detail: '감천문화마을과 태종대를 산책하기 좋은 선선한 날씨예요.' },
      cool: { label: '🐠 아쿠아리움 나들이', detail: '부산아쿠아리움, 온천천 스파 등 실내 관광지를 추천해요.' },
    },
  },
  {
    id: 'city_03',
    name: '강릉',
    temp: 21,
    status: '흐림',
    tourism: {
      hot: { label: '🏄 서핑 & 해변', detail: '안목 해변 서핑과 경포해변 물놀이를 즐기고, 시원한 카페거리에서 커피 한 잔 즐겨보세요.' },
      mild: { label: '☕ 카페거리 산책', detail: '안목 카페거리 산책과 하슬라아트월드 미술 감상하기 좋은 날씨예요.' },
      cool: { label: '🌅 일출 명소 투어', detail: '정동진 일출 명소와 오죽헌 등 관광지를 둘러보기 좋아요.' },
    },
  },
  {
    id: 'city_04',
    name: '제주',
    temp: 31,
    status: '맑음',
    tourism: {
      hot: { label: '🌊 해변 일몰 감상', detail: '곽지·협재 해수욕장에서 물놀이를 즐기고 환상적인 일몰을 감상해보세요.' },
      mild: { label: '🥾 오름 트레킹', detail: '한라산 둘레길과 오름 트레킹하기 좋은 날씨예요.' },
      cool: { label: '☕ 실내 박물관 투어', detail: '표선해변 인근 실내 박물관과 카페 투어를 추천해요.' },
    },
  },
  {
    id: 'city_05',
    name: '경주',
    temp: 17,
    status: '비',
    tourism: {
      hot: { label: '🏯 유적지 관람 후 호수 산책', detail: '불국사·석굴암을 관람한 뒤, 보문호 주변에서 시원하게 쉬어가기 좋아요.' },
      mild: { label: '🚶 신라 유적 도보여행', detail: '양동마을과 첨성대 등 신라 유적을 도보로 여행하기 좋은 날씨예요.' },
      cool: { label: '🏛️ 실내 박물관 관람', detail: '국립경주박물관 등 실내 전시 관람을 추천해요.' },
    },
  },
])

// 2. [1일차 데이터] 검색어 제어용 데이터
const searchQuery = ref('')

// 3. 나만의 반응형 상태 변수
//    클릭한 카드의 도시 id만 저장합니다. (문구를 직접 저장하지 않고 "무엇이 선택됐는지"만 기억)
const selectedCityId = ref(null)

// 온도를 hot/mild/cool 세 구간으로 나누는 순수 함수
function getTourismTier(temp) {
  if (temp >= 28) return 'hot'
  if (temp >= 20) return 'mild'
  return 'cool'
}

// 4. [2일차 추가] computed를 활용한 실시간 검색 필터링 연산기 (★핵심)
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()

  if (!query) {
    return weatherList.value
  }

  return weatherList.value.filter((item) => item.name.includes(query))
})

// 5. 나만의 computed - 선택된 도시 정보를 찾아주는 연산기
const selectedCity = computed(() => weatherList.value.find((item) => item.id === selectedCityId.value) ?? null)

// 6. 나만의 computed - 선택된 도시의 "현재 기온 구간"에 맞는 관광 특성을 계산합니다.
const selectedTourism = computed(() => {
  if (!selectedCity.value) return null
  const tier = getTourismTier(selectedCity.value.temp)
  return selectedCity.value.tourism[tier]
})

// 7. 나만의 computed - 상태바에 최종적으로 표시할 문구를 생성합니다.
const statusBarText = computed(() => {
  if (!selectedCity.value || !selectedTourism.value) {
    return '카드를 클릭하면 관광 특성을 알려드려요.'
  }
  return `[${selectedCity.value.name}] ${selectedTourism.value.detail}`
})

// 8. 나만의 watch - selectedCityId(내가 만든 상태 변수)의 변화를 감시합니다.
watch(selectedCityId, (newId) => {
  if (!newId) return
  console.log(`👁️‍🗨️ [watch 감지] 선택 도시 변경 -> "${selectedCity.value?.name}" (${selectedTourism.value?.label})`)
})

// 9. [2일차 추가] watchEffect를 활용한 자동 의존성 API 로그 시뮬레이션
watchEffect(() => {
  console.log(`🤖 [watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 API 데이터를 필터링합니다.`)
})

// 카드마다 현재 기온 구간에 맞는 관광 특성(label)을 보여주기 위한 헬퍼
function tourismLabel(item) {
  return item.tourism[getTourismTier(item.temp)].label
}

// 알림 대행 함수
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <section class="search-box">
      <h3>🔍 도시 검색</h3>
      <input type="text" :value="searchQuery" @input="(e) => (searchQuery = e.target.value)" placeholder="검색할 도시 이름 입력" />
      <p>
        검색 중인 도시: <strong>{{ searchQuery }}</strong>
      </p>
    </section>

    <section class="list-box">
      <h3>🏙️ 지역별 날씨 현황</h3>

      <div v-for="item in filteredWeatherList" :key="item.id" class="weather-card" @click="selectedCityId = item.id">
        <h4>{{ item.name }} ({{ item.status }})</h4>
        <p>현재 기온: {{ item.temp }}°C</p>

        <span v-if="item.temp >= 25" class="badge hot">🥵 더움 (25도 이상)</span>
        <span v-else class="badge cool">🥶 선선함 (25도 미만)</span>

        <p class="tourism-info">관광 특성: <strong>{{ tourismLabel(item) }}</strong></p>

        <button class="btn-detail" @click.stop="showDetail(item.name, item.status)">상세보기</button>
      </div>

      <p v-if="filteredWeatherList.length === 0" style="text-align: center; color: #e74c3c; padding: 10px 0">😭 검색 결과와 일치하는 도시가 없습니다.</p>
    </section>

    <div class="status-bar">
      {{ statusBarText }}
    </div>
  </div>
</template>
