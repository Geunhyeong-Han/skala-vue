## Frontend:Vue.js 학습 기록

Vue 3 학습 과정을 하루 단위로 기록, 총 4일차

### 1일차 (2026-08-24)

#### 1일차 배운 것: JS 기초 및 Vue 문법

**반응성(Reactivity)**

* `let` vs `ref()`: 일반 변수는 값이 바뀌어도 화면이 안 바뀌지만, `ref()`로 감싸면 화면과 자동으로 동기화됨

**바인딩 & 조건부 렌더링**

* `v-bind`(`:attr`): 속성을 동적으로 바인딩. 객체/배열 문법으로 class·style을 한 번에 조립 가능, 변수명=속성명이면 `:src` 같은 단축 문법도 됨

* `v-if / v-else-if / v-else`: 조건에 따라 DOM을 아예 붙였다 뗐다 함 → 자주 안 바뀌는 요소에 유리

* `v-show`: `display: none`만 토글, DOM은 유지 → 자주 바뀌는 요소에 유리

* `v-for`: 배열·객체·배열 속 객체를 순회하는 방법, `:key`가 꼭 필요한 이유

**출력 디렉티브**

* `{{ }}` / `v-text`: 값을 이스케이프해서 텍스트 그대로 출력

* `v-html`: 실제 HTML로 렌더링 → 사용자 입력을 그대로 넣으면 XSS 위험

**렌더링 최적화 디렉티브**

* `v-once`: 최초 1회만 렌더링하고 이후 반응성 무시

* `v-memo`: 지정한 값이 바뀔 때만 재렌더링

* `v-pre`: 컴파일 없이 문자열 그대로 출력

* `v-cloak`: Vue 로딩 전 처리 안 된 콧수염 구문이 잠깐 보이는 것 방지

#### 1일차 고찰

* 디렉티브를 하나씩 별도 컴포넌트로 쪼개서 실습하니 비교가 확실히 직관적이었다 (`v-html` vs `v-text`, `v-if` vs `v-show`)

* ⚠️ `v-html`을 실습하며 XSS를 몸으로 겪어보니, 실제 프로젝트에서 사용자 입력을 `v-html`에 넣으면 큰일나겠다, 개발자 도구에서 들키면 난리 ㅎㅎ

### 2일차 (2026-08-25)

#### 2일차 배운 것: 단일 컴포넌트

**이벤트 핸들링 (`v-on` / `@`)**

* 인라인 연산 vs 메서드 핸들러: `@click="count++"`처럼 바로 쓰거나, 함수로 분리해서 `@click="showAlert"`로 호출

* `.prevent`: 기본 동작 막기 (예: `<a>`를 눌러도 페이지 이동 안 함)

* `.stop`: 이벤트 버블링 차단 (자식에서 발생한 클릭이 부모까지 전파되는 걸 막음)

* `$event`: 이벤트 객체를 넘겨받아 클릭 좌표, 클릭된 태그 등 상세 정보 확인

**폼 핸들링 (`v-model`)**

* 내부 동작 원리: 사실 `:value` + `@input`의 축약형이라는 걸 직접 풀어서 구현해보고 확인

* 요소별 매핑: textarea(장문), checkbox(단일은 Boolean / 다중은 배열), radio(단일 선택), select(드롭다운)

* `.lazy`: 입력 중이 아니라 값이 확정된 시점(change)에 반영

* `.number`: 입력된 문자열을 숫자 타입으로 자동 변환

* `.trim`: 입력값 양 끝 공백 자동 제거

* 체이닝: `.trim.number`처럼 수식어를 조합해서 한 번에 적용 가능

**Composition API (반응형 상태 관리)**

* `ref` vs `reactive`: 원시값은 `ref`, 객체는 `reactive`로 감싸는 차이

* `computed`: 다른 상태로부터 자동으로 계산되는 파생 값 (캐싱됨)

* `watch`: 지정한 값(단일/다중 소스, deep 옵션, 배열)의 변화를 감지해서 반응

* `watchEffect`: 콜백 안에서 참조한 반응형 값을 자동으로 추적해서 즉시 실행

**미니 프로젝트: 날씨 대시보드 🌤️**

* 서울·부산·강릉·제주·경주 5개 도시 데이터에 온도 구간(더움/보통/선선)별 관광 특성을 직접 설계해서 날씨와 여행 정보를 엮어봄

* ⭐ **나만의 반응형 상태** `selectedCityId`: 클릭한 도시의 문구를 바로 저장하지 않고, "어떤 도시가 선택됐는지" id만 저장하도록 설계

* ⭐ **나만의 computed 체이닝** `selectedCity → selectedTourism → statusBarText`: id로 도시 찾기 → 온도 구간에 맞는 관광 특성 계산 → 상태바에 보여줄 문구 조립까지, computed직접 구현

* ⭐ **나만의 watch**: `selectedCityId`가 바뀔 때마다 콘솔에 "어떤 도시를 선택했는지" 로그를 남기도록 구현

#### 2일차 고찰

* 🐛 Vite 기본 템플릿에 남아있던 `main.css`의 `@media (min-width: 1024px) { #app { display: grid } }` 때문에 레이아웃이 쪼개졌음 ㅠㅠ. 컴포넌트 스타일이 안 먹히면 컴포넌트보다 부모 쪽 boilerplate CSS부터 의심

* `<style scoped>`는 자식 컴포넌트의 최상위 엘리먼트까지만 부모의 scope id(`data-v-xxx`)가 같이 붙고, 그 안쪽 자식 요소에는 안 붙는다는 걸 devtools로 직접 확인

### 3일차 (2026-08-26)

#### 3일차 배운 것: 컴포넌트 설계 & 라우터

**컴포넌트 라이프사이클**

* 생성(`setup` 본문) → 부착(`onMounted`) → 갱신(`onUpdated`) → 소멸(`onUnmounted`) 4단계 훅을 직접 로그로 찍어 순서 확인

* `onMounted`에서 켠 `setInterval` 타이머를 `onUnmounted`에서 안 꺼주면, 컴포넌트가 사라져도 백그라운드에서 계속 도는 메모리 누수로 이어진다는 걸 직접 재현

**Props & Emits**

* `defineProps`로 부모→자식 단방향 데이터 주입(타입·필수 여부 검증), `defineEmits`로 자식→부모 커스텀 이벤트 발신

* 자식은 props를 직접 바꿀 수 없고, 항상 emit으로 "이렇게 바꿔달라"고 부모에 요청하는 단방향 흐름을 직접 만들어보며 체감

**Slot (컴포넌트 합성)**

* Default Slot: 부모가 넘긴 마크업을 자식의 `<slot></slot>` 자리에 그대로 꽂아 넣기

* Named Slot: `<slot name="...">` + `<template #이름>`으로 여러 구멍에 각각 다른 내용을 지정해서 꽂기 (예: 카드의 제목 영역과 본문 영역 분리)

* Scoped Slot: 자식이 `<slot :text="..." :count="...">`로 내부 데이터를 부모에게 역으로 넘기고, 부모는 `v-slot="slotBag"`으로 받아 마크업만 자유롭게 구성 (부모가 마크업을 안 넘기면 자식이 지정한 fallback 콘텐츠가 대신 노출됨)

**Vue Router**

* `createRouter` + `createWebHistory`로 SPA 라우팅 설정, `RouterLink` / `RouterView`로 새로고침 없는 화면 전환

* 동적 세그먼트 라우팅: `/weather/:cityId`로 도시 ID를 라우트 파라미터로 받아 상세 페이지 렌더링

* 컴포넌트 지연 로딩: `component: () => import('...')`로 라우트별 코드 스플리팅

* 와일드카드 라우트 `/:pathMatch(.*)*`는 라우트 배열 맨 마지막에 둬야 나머지 라우트를 다 가리지 않고 404 처리가 제대로 동작

** 날씨 대시보드 컴포넌트 분리 + 라우터 적용**

* 2일차에 한 파일로 몰아 짰던 `WeatherDashboard`를 `BaseDashboardCard`(레이아웃 전용 slot 컴포넌트) / `SearchBar` / `WeatherCard` / `WeatherParent`(상태 소유 컨테이너)로 역할별 분리

* 나만의 컴포넌트를 위해 `BaseDashboardCard`에 `title` named slot을 추가해서, 카드 제목이 필요한 곳과 필요 없는 곳(검색 카드)을 같은 컴포넌트 하나로 구분 처리

* 검색어를 URL 쿼리 스트링(`?search=`)에 동기화해서 주소에 검색 상태가 남도록 구현

* 날씨 카드의 "상세보기" 클릭 시 `router.push('/weather/:id')`로 이동하는 상세 페이지(`WeatherDetailView`)를 별도 라우트로 분리

#### 3일차 고찰

* Props/Emits/Slot을 각각 최소 예제로 따로 만들어보니 "부모→자식은 props, 자식→부모는 emit, 자식이 부모에게 마크업 자유도까지 주고 싶으면 scoped slot"이라는 구분이 훨씬 명확해졌다

* named slot을 실전 컴포넌트(`BaseDashboardCard`)에 적용해보니, 슬롯이 채워졌는지(`$slots.title`)를 체크 안 하면 내용이 없어도 헤더 껍데기 엘리먼트가 그대로 남는다는 걸 알게 됨

### 4일차

#### 4일차 배운 것

* (작성 예정)

#### 4일차 고찰

* (작성 예정)

