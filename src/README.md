# FSD 아키텍처 구조

이 프로젝트는 Feature-Sliced Design(FSD) 아키텍처를 Next.js App Router와 함께 사용합니다.

## 디렉토리 구조

```

src/
├── app/          # Next.js App Router (pages + app 레이어)
├── widgets/      # 독립적인 UI 블록
├── features/     # 사용자 시나리오
├── entities/     # 비즈니스 엔티티
└── shared/       # 공통 코드
    ├── ui/       # 공통 UI 컴포넌트
    ├── lib/      # 유틸리티 함수
    ├── api/      # API 클라이언트
    └── types/    # 공통 타입
```

## 레이어 간 의존성 규칙

```
app → widgets → features → entities → shared
```

- 각 레이어는 자신보다 하위 레이어에만 의존할 수 있습니다
- 같은 레이어 내에서는 서로 의존할 수 없습니다 (격리 원칙)
- 하위 레이어는 상위 레이어를 import할 수 없습니다

## 각 레이어 설명

### `app/` - Pages + App Layer

- Next.js App Router의 라우팅 디렉토리
- 페이지 구성과 레이아웃 정의
- widgets를 조합하여 페이지 구성

### `widgets/` - Widgets Layer

- 완성된 독립적인 UI 블록
- features와 entities를 조합
- 페이지에서 바로 사용 가능

### `features/` - Features Layer

- 사용자 시나리오 구현
- 비즈니스 로직 처리
- entities를 활용

### `entities/` - Entities Layer

- 비즈니스 엔티티 정의
- 데이터 모델과 비즈니스 규칙
- 도메인 중심 설계

### `shared/` - Shared Layer

- 프로젝트 공통 코드
- 재사용 가능한 유틸리티
- 비즈니스 로직에 독립적

## 참고 자료

- [Feature-Sliced Design 공식 문서](https://feature-sliced.design/)
