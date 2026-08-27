<script setup>
import { ref, computed, onMounted } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'
import cocoballImg from '@/assets/cocoball.png'

// 과제 7과 완전히 동일한 store/로직을 재사용하고, 화면만 더 꽉 찬 레이아웃 + 트렌디한 색감으로 새로 구성
const configStore = useConfigStore()
const weatherStore = useWeatherStore()

const searchQuery = ref('')
const dialogVisible = ref(false)
const selectedCity = ref(null)

onMounted(() => {
  weatherStore.fetchCities()
  weatherStore.fetchCountryFlags()
})

const filteredCities = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherStore.filteredCities
  return weatherStore.filteredCities.filter((item) => item.name.includes(query))
})

function displayTemp(city) {
  if (configStore.unit === 'celsius') return city.temp
  return Math.round((city.temp * 9) / 5 + 32)
}

function isHot(city) {
  const threshold = configStore.unit === 'celsius' ? 25 : Math.round((25 * 9) / 5 + 32)
  return displayTemp(city) >= threshold
}

function aqiTagType(aqi) {
  if (aqi <= 1) return 'success'
  if (aqi <= 3) return 'warning'
  return 'danger'
}

// 국외 카드만 국기를 은은한 배경으로 (WeatherCard.vue와 동일한 기법)
function cardStyle(city) {
  if (!city.countryFlag) return {}
  return {
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${city.countryFlag})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }
}

function openDetail(city) {
  selectedCity.value = city
  dialogVisible.value = true
}
</script>

<template>
  <div class="final-dashboard">
    <el-container>
      <el-header class="final-header" height="auto">
        <div class="brand">
          <img :src="cocoballImg" alt="코코볼" class="mascot" />
          <div>
            <h1>최종 결과: 코코볼이 알려주는 실시간 날씨 정보</h1>
            <p class="subtitle">실시간 날씨 · 대기질 · 국외 국기까지 한 화면에</p>
          </div>
        </div>

        <div class="controls">
          <el-input v-model="searchQuery" placeholder="도시 이름 검색" clearable class="search-input">
            <template #prefix>🔍</template>
          </el-input>
          <el-switch :model-value="configStore.unit === 'fahrenheit'" active-text="°F" inactive-text="°C" @change="configStore.toggleUnit" />
          <el-switch :model-value="weatherStore.viewRegion === 'international'" active-text="국외" inactive-text="국내" @change="weatherStore.toggleRegion" />
        </div>
      </el-header>

      <el-main>
        <el-alert v-if="weatherStore.fetchError" :title="weatherStore.fetchError" type="error" show-icon :closable="false" class="mb" />

        <el-row v-if="weatherStore.isLoading" :gutter="20">
          <el-col v-for="n in 4" :key="n" :xs="24" :sm="12" :md="8" :lg="6">
            <el-skeleton :rows="4" animated class="skeleton-card" />
          </el-col>
        </el-row>

        <el-empty v-else-if="filteredCities.length === 0" description="검색 결과가 없습니다" />

        <el-row v-else :gutter="20">
          <el-col v-for="city in filteredCities" :key="city.id" :xs="24" :sm="12" :md="8" :lg="6" class="city-col">
            <el-card shadow="hover" class="city-card" :style="cardStyle(city)" @click="openDetail(city)">
              <div class="city-name-row">
                <strong class="city-name">{{ city.name }}</strong>
                <span class="city-status">{{ city.status }}</span>
              </div>

              <el-statistic :value="displayTemp(city)" :suffix="configStore.unitSymbol" />

              <div class="city-tags">
                <el-tag :type="isHot(city) ? 'danger' : 'primary'" size="small">{{ isHot(city) ? '🥵 더움' : '🥶 선선함' }}</el-tag>
                <el-tag v-if="weatherStore.aqiInfo(city.aqi)" :type="aqiTagType(city.aqi)" size="small">
                  {{ weatherStore.aqiInfo(city.aqi).emoji }} {{ weatherStore.aqiInfo(city.aqi).label }}
                </el-tag>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>

    <el-dialog v-model="dialogVisible" :title="selectedCity?.name" width="360px">
      <template v-if="selectedCity">
        <p>날씨 상태: {{ selectedCity.status }}</p>
        <el-statistic :value="displayTemp(selectedCity)" :suffix="configStore.unitSymbol" />
        <div class="city-tags">
          <el-tag :type="isHot(selectedCity) ? 'danger' : 'primary'" size="small">{{ isHot(selectedCity) ? '🥵 더움' : '🥶 선선함' }}</el-tag>
          <el-tag v-if="weatherStore.aqiInfo(selectedCity.aqi)" :type="aqiTagType(selectedCity.aqi)" size="small">
            {{ weatherStore.aqiInfo(selectedCity.aqi).emoji }} {{ weatherStore.aqiInfo(selectedCity.aqi).label }}
          </el-tag>
        </div>
      </template>
      <template #footer>
        <el-button type="primary" @click="dialogVisible = false">닫기</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.final-dashboard {
  /* 이 섹션 안의 Element Plus 컴포넌트(switch/button/tag 등)가 전부 연두색 톤을 쓰도록 테마 변수 재정의 */
  --el-color-primary: #65a30d;
  --el-color-primary-light-3: #84cc16;
  --el-color-primary-light-5: #a3e635;
  --el-color-primary-light-7: #bef264;
  --el-color-primary-light-8: #d9f99d;
  --el-color-primary-light-9: #f7fee7;
  --el-color-primary-dark-2: #4d7c0f;

  background: linear-gradient(180deg, #f7fee7 0%, #ffffff 65%);
  border-radius: 20px;
  padding: 28px 32px;
  border: 1px solid #d9f99d;
}

.final-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 0 0 20px !important;
  margin-bottom: 20px;
  border-bottom: 1px solid #d9f99d;
}

.brand {
  display: flex;
  align-items: center;
  gap: 16px;
}

.mascot {
  width: 64px;
  height: 64px;
  object-fit: contain;
  border-radius: 50%;
  background: #f7fee7;
  padding: 6px;
  box-shadow: 0 4px 14px rgba(101, 163, 13, 0.25);
}

.brand h1 {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 800;
  color: #365314;
}

.subtitle {
  margin: 2px 0 0;
  color: #65a30d;
  font-size: 13px;
}

.controls {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.search-input {
  width: 220px;
}

.mb {
  margin-bottom: 16px;
}

.city-col {
  margin-bottom: 20px;
}

.city-card {
  cursor: pointer;
  border-radius: 14px;
  border: 1px solid #ecfccb;
}

.city-name-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 6px;
}

.city-name {
  font-size: 16px;
  color: #1e293b;
}

.city-status {
  font-size: 12px;
  color: #65a30d;
}

.city-tags {
  display: flex;
  gap: 6px;
  margin-top: 10px;
}

.skeleton-card {
  border: 1px solid #ecfccb;
  border-radius: 14px;
  padding: 16px;
}
</style>
