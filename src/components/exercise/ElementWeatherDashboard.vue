<script setup>
import { ref, computed, onMounted } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'

// 기존 과제 1~5와 완전히 같은 store를 그대로 재사용합니다 (데이터/로직은 그대로, 화면만 Element Plus로 새로 구성)
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

// WeatherCard.vue와 동일한 변환 규칙(항상 섭씨 원본 → 현재 단위로 환산)
function displayTemp(city) {
  if (configStore.unit === 'celsius') return city.temp
  return Math.round((city.temp * 9) / 5 + 32)
}

function isHot(city) {
  const threshold = configStore.unit === 'celsius' ? 25 : Math.round((25 * 9) / 5 + 32)
  return displayTemp(city) >= threshold
}

// AQI 숫자(1~5)를 Element Plus el-tag의 색상 타입으로 매핑
function aqiTagType(aqi) {
  if (aqi <= 1) return 'success'
  if (aqi <= 3) return 'warning'
  return 'danger'
}

// 국외 카드만 국기를 은은한 배경으로 (WeatherCard.vue와 동일한 기법)
function cardStyle(city) {
  if (!city.countryFlag) return {}
  return {
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), url(${city.countryFlag})`,
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
  <div class="el-dashboard">
    <div class="toolbar">
      <el-input
        v-model="searchQuery"
        placeholder="검색할 도시 이름 입력"
        clearable
        style="max-width: 260px"
      >
        <template #prefix>🔍</template>
      </el-input>

      <div class="toolbar-switches">
        <el-switch
          :model-value="configStore.unit === 'fahrenheit'"
          active-text="°F"
          inactive-text="°C"
          @change="configStore.toggleUnit"
        />
        <el-switch
          :model-value="weatherStore.viewRegion === 'international'"
          active-text="국외"
          inactive-text="국내"
          @change="weatherStore.toggleRegion"
        />
      </div>
    </div>

    <el-alert
      v-if="weatherStore.fetchError"
      :title="weatherStore.fetchError"
      type="error"
      show-icon
      :closable="false"
      style="margin-bottom: 16px"
    />

    <el-row v-if="weatherStore.isLoading" :gutter="16">
      <el-col v-for="n in 4" :key="n" :span="8">
        <el-skeleton :rows="3" animated style="margin-bottom: 16px" />
      </el-col>
    </el-row>

    <el-row v-else :gutter="16">
      <el-col v-for="city in filteredCities" :key="city.id" :span="8" class="city-col">
        <el-card
          shadow="hover"
          class="city-card"
          :style="cardStyle(city)"
          @click="openDetail(city)"
        >
          <template #header>
            <div class="city-card-header">
              <strong>{{ city.name }}</strong>
              <span class="city-status">{{ city.status }}</span>
            </div>
          </template>

          <p class="city-temp">{{ displayTemp(city) }}{{ configStore.unitSymbol }}</p>

          <div class="city-tags">
            <el-tag :type="isHot(city) ? 'danger' : 'primary'" size="small">{{
              isHot(city) ? '🥵 더움' : '🥶 선선함'
            }}</el-tag>
            <el-tag v-if="weatherStore.aqiInfo(city.aqi)" :type="aqiTagType(city.aqi)" size="small"
              >{{ weatherStore.aqiInfo(city.aqi).emoji }}
              {{ weatherStore.aqiInfo(city.aqi).label }}</el-tag
            >
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="dialogVisible" :title="selectedCity?.name" width="360px">
      <template v-if="selectedCity">
        <p>날씨 상태: {{ selectedCity.status }}</p>
        <p>현재 기온: {{ displayTemp(selectedCity) }}{{ configStore.unitSymbol }}</p>
        <el-tag :type="isHot(selectedCity) ? 'danger' : 'primary'" size="small">{{
          isHot(selectedCity) ? '🥵 더움' : '🥶 선선함'
        }}</el-tag>
        <el-tag
          v-if="weatherStore.aqiInfo(selectedCity.aqi)"
          :type="aqiTagType(selectedCity.aqi)"
          size="small"
          style="margin-left: 8px"
        >
          {{ weatherStore.aqiInfo(selectedCity.aqi).emoji }}
          {{ weatherStore.aqiInfo(selectedCity.aqi).label }}
        </el-tag>
      </template>
      <template #footer>
        <el-button type="primary" @click="dialogVisible = false">닫기</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.el-dashboard {
  max-width: 900px;
  margin: 0 auto;
}
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}
.toolbar-switches {
  display: flex;
  gap: 16px;
  align-items: center;
}
.city-col {
  margin-bottom: 16px;
}
.city-card {
  cursor: pointer;
}
.city-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.city-status {
  color: #64748b;
  font-size: 13px;
}
.city-temp {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin: 4px 0 12px;
}
.city-tags {
  display: flex;
  gap: 6px;
}
</style>
