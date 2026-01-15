# Features Layer

사용자 상호작용과 비즈니스 시나리오를 구현합니다.

## 역할
- 사용자의 특정 행동이나 시나리오 처리
- entities를 활용하여 비즈니스 로직 구현
- UI와 비즈니스 로직을 결합한 기능 단위

## 의존성 규칙
- ✅ entities, shared에 의존 가능
- ❌ 다른 features에 의존 불가
- ❌ widgets, app 레이어에 의존 불가

## 예시
- `search-city/` - 도시 검색 및 선택 기능
- `toggle-temperature/` - 섭씨/화씨 온도 단위 변경 기능
