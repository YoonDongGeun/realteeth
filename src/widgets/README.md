# Widgets Layer

독립적으로 동작할 수 있는 완성된 UI 블록들을 포함합니다.

## 역할
- 여러 features와 entities를 조합하여 완성된 UI 블록 구성
- 페이지에서 바로 사용할 수 있는 독립적인 컴포넌트
- 비즈니스 로직과 UI를 통합한 완전한 기능 단위

## 의존성 규칙
- ✅ features, entities, shared에 의존 가능
- ❌ 다른 widgets에 의존 불가
- ❌ app 레이어에 의존 불가

## 예시
- `weather-card/` - 날씨 정보를 표시하는 완성된 카드 위젯
- `search-bar/` - 도시 검색 기능을 포함한 검색 바 위젯
