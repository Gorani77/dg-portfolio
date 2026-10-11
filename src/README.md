# 소스 구조

- `App.jsx`: 공통 레이아웃과 현재 페이지 렌더링
- `App.css`: 공통 레이아웃, 제목, 버튼 등 여러 화면에서 사용하는 스타일
- `index.css`: Pretendard, 기본 요소 및 전역 스타일
- `pages/`: 네브 메뉴에 대응하는 화면과 해당 화면의 스타일
  - `HomePage.jsx`: 프로필
  - `ProjectsPage.jsx`: 프로젝트 목록 및 가드레일 예시
  - `AboutPage.jsx`: 소개
- `components/layout/`: Navbar, Footer
- `components/common/`: 공통 Arrow 아이콘
- `components/projects/`: ProjectCard, GuardrailPreview와 각 컴포넌트의 스타일
- `data/`: 메뉴 정의, 프로젝트 정보, 프로필 관련 링크
- `hooks/useHashPage.js`: URL 해시를 통한 메뉴 전환, 뒤로 가기 및 스크롤 처리
- `assets/`: 프로필 사진 등의 정적 이미지

화면 내용을 수정할 때는 해당 페이지를, 메뉴 구성을 수정할 때는 `data/navigation.js`를 수정합니다.
프로젝트 카드의 내용은 `data/projects.js`에서 관리합니다.
각 페이지와 컴포넌트는 자신의 CSS를 직접 가져옵니다.

수동 확인: `npm run dev` 실행 후 홈·프로젝트·소개 메뉴, 브라우저 뒤로 가기,
프로필 사진, 프로젝트 상세 펼치기, 가드레일 단계 전환과 모바일 레이아웃을 확인합니다.
필요하면 `npm run build`, `npm run lint`를 직접 실행합니다.

## 2026-10-11 — 대표 TruckWorks 사례

- pages/TruckWorksProjectPage.jsx·CSS: 대표 프로젝트의 독립 상세 페이지.
- components/truckworks/: 홈/목록 대표 소개, 동작 흐름 선택, 아키텍처 관점 선택.
- data/truckworks.js: 설명용 데이터와 실제 구현에서 정리한 설계 결정.
- public/truckworks/: 실제 자산 기반 소개 PNG2종. scripts/render_truckworks.py로 제작.
- App·useHashPage: #projects/truckworks 경로. HomePage·ProjectsPage·profileProjects에 진입 연결.

기존 프로젝트 양식이나 상세 페이지는 보존한다. 사용자 확인은 docs/TRUCKWORKS_CASE_STUDY.md 참고. 테스트/빌드/린트/실행 확인은 수행하지 않았다.
