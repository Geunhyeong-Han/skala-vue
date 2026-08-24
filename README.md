# skala-vue

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## 학습 기록

Vue 3 학습 과정을 하루 단위로 기록. 총 4일차 예정.

### 1일차 (2026-08-24)

#### 1일차 배운 것

- 반응성(Reactivity): 일반 변수(`let`)는 값이 바뀌어도 화면이 갱신되지 않지만, `ref()`로 감싼 변수는 화면과 자동으로 동기화된다.
- `v-bind`: `:attr` 축약형으로 속성을 동적으로 바인딩. 객체/배열 문법으로 클래스와 인라인 스타일을 여러 개 동시에 조립할 수 있고, 변수명과 속성명이 같으면 `:src` 같은 단축 문법도 가능하다.
- 조건부 렌더링: `v-if/v-else-if/v-else`는 DOM 자체를 붙였다 뗐다 하고, `v-show`는 `display: none`만 토글한다. 자주 바뀌는 요소는 `v-show`가, 자주 안 바뀌는 요소는 `v-if`가 유리하다.
- `v-for`: 배열, 객체, 배열 속 객체를 순회하는 방법과 `:key`의 필요성.
- 출력 관련 디렉티브 비교: `{{ }}` 보간법과 `v-text`는 값을 이스케이프해서 텍스트 그대로 출력하지만, `v-html`은 실제 HTML로 렌더링된다. `v-html`에 사용자 입력을 그대로 넣으면 XSS(스크립트 삽입) 위험이 있다는 걸 직접 확인함.
- 렌더링 최적화 디렉티브: `v-once`(최초 1회만 렌더링), `v-memo`(지정한 값이 바뀔 때만 재렌더링), `v-pre`(컴파일 없이 문자열 그대로 출력), `v-cloak`(Vue 로딩 전 미처리 콧수염 구문이 잠깐 보이는 것 방지).

#### 1일차 고찰

- 디렉티브를 하나씩 별도 컴포넌트로 쪼개서 실습하니, 각 디렉티브가 "무엇을 대체/보완하는지" 비교가 쉬웠다(`v-html` vs `v-text`, `v-if` vs `v-show`).
- `v-html`을 실습하면서 XSS를 몸으로 겪어보니, 나중에 실제 프로젝트에서는 사용자 입력을 `v-html`에 절대 그대로 넣으면 안 된다는 걸 체감했다.
- 다음엔 이벤트 핸들링(`v-on`)과 폼 바인딩(`v-model`) 심화, computed/watch 쪽을 더 파볼 예정.

### 2일차

#### 2일차 배운 것

- (작성 예정)

#### 2일차 고찰

- (작성 예정)

### 3일차

#### 3일차 배운 것

- (작성 예정)

#### 3일차 고찰

- (작성 예정)

### 4일차

#### 4일차 배운 것

- (작성 예정)

#### 4일차 고찰

- (작성 예정)
