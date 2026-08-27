<script setup>
import { ref } from 'vue'

// 화면을 먼저 만들기 위해 실제 API 대신 가상 날씨 데이터를 사용합니다.
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '인천', temp: 27, status: '맑음' },
  { id: 'city_09', name: '제주', temp: 31, status: '맑음' },
])

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

function showDetail(cityName, status) {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <section class="search-box">
      <h2>도시 검색</h2>
      <input
        type="text"
        :value="searchQuery"
        placeholder="검색할 도시 이름 입력"
        @input="searchQuery = $event.target.value"
      />
      <p>
        검색 중인 도시: <strong>{{ searchQuery }}</strong>
      </p>
    </section>

    <section class="list-box">
      <h2>지역별 날씨 현황</h2>

      <article
        v-for="item in weatherList"
        :key="item.id"
        class="weather-card"
        @click="selectedCityInfo = `${item.name}선택되었습니다.`"
      >
        <h3>{{ item.name }} ({{ item.status }})</h3>
        <p>현재 기온: {{ item.temp }}℃</p>

        <span v-if="item.temp >= 25">🥵 더움 (25℃ 이상)</span>
        <span v-else>🥶 선선함</span>

        <button @click.stop="showDetail(item.name, item.status)">상세보기</button>
      </article>
    </section>

    <p class="status-bar">{{ selectedCityInfo }}</p>
  </div>
</template>
