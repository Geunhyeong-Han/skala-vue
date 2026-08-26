<template>
  <div class="base-dashboard-card">
    <!-- title 슬롯을 채운 부모만 헤더 영역이 그려지도록 $slots로 존재 여부 체크 -->
    <div v-if="$slots.title" class="card-title">
      <slot name="title"></slot>
    </div>

    <slot></slot>
  </div>
</template>

<style scoped>
.base-dashboard-card {
  background: #7bb098;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  border: 1px solid #e9ecef;
}

.card-title {
  font-weight: bold;
  margin-bottom: 10px;
}
</style>
