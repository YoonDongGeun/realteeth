# RealTeeth 채용 과제

RealTeeth 채용 과제로 날씨 앱 구현한 프로젝트입니다.

## 요구사항

### 필수 환경

- **Node.js ≥20.9.0** (프로젝트는 24.13.0 사용)
- **TypeScript ≥5.1.0**
- **pnpm 10.28.0** (Corepack으로 자동 관리)
- **nvm** (Node.js 버전 관리)

### 지원 브라우저

- Chrome 111+
- Edge 111+
- Firefox 111+
- Safari 16.4+

## 프로젝트 실행 방법

### 1. Node.js 버전 설정

```bash
nvm install 24.13.0
nvm use 24.13.0
node -v  # 버전 확인
```

### 2. Corepack 설정

Corepack을 최신 버전으로 업데이트하고 활성화합니다. ([서명키 이슈](https://pnpm.io/installation#using-corepack))

```bash
npm install --global corepack@latest
corepack enable pnpm
```

### 3. 의존성 설치

```bash
corepack pnpm install
```

### 4. 개발 서버 실행

```bash
corepack pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인할 수 있습니다.

## 사용 가능한 스크립트

```bash
corepack pnpm dev      # 개발 서버 실행
corepack pnpm build    # 프로덕션 빌드
corepack pnpm start    # 프로덕션 서버 실행
corepack pnpm lint     # ESLint 실행
```

## 참고사항

- 이 프로젝트는 `packageManager` 필드를 통해 pnpm 버전을 고정합니다.
- Corepack이 자동으로 올바른 버전의 pnpm을 사용합니다.
- `.nvmrc` 파일에 Node.js 버전이 명시되어 있습니다.
