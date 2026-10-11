# TruckWorks 대표 프로젝트 페이지

작성일: 2026-10-11 (Asia/Seoul).

## 요청과 상태

사용자가 C:\Users\sp287\WebstormProjects\portfolio의 기존 프로젝트 양식에 얽매이지 않고 TruckWorks를 대표 프로젝트로 강하게 소개하도록 요청했다. 홈과 프로젝트 목록 최상단의 전용 소개, 독립 사례 페이지, 실제 자산을 활용한 소개 이미지와 상호작용 설명을 작성했다.

코드·콘텐츠·이미지 제작 완료, 사용자 내용·화면·동작 확인 대기. 테스트·빌드·린트·서버/브라우저 실행·화면 검증을 하지 않았다. 배포/커밋/푸시/외부 게시·OpenAI 호출도 하지 않았다. Blender 렌더는 새 소개 이미지의 제작이며 앱 검증·실행 화면 촬영이 아니다.

## 진입과 파일

- 홈: 기존 프로필 앞에 TruckWorksFeature. 프로필·이력서·기존 프로젝트 보존.
- 프로젝트: 기존 두 프로젝트 앞에 대표 섹션. 기존 상세 페이지 보존.
- 상세: `#projects/truckworks`. App.jsx·useHashPage.js에 경로 추가, 상단 프로젝트 메뉴 선택 유지.
- data/truckworks.js: 소개, 동작 설명4단계, 구조3관점, 핵심 설계4가지.
- components/truckworks/TruckWorksFeature: 홈/목록 대표 소개.
- components/truckworks/TruckWorksStory: 생산/고장/분석/복구 설명. 서버를 실행하지 않는 교육용 인터랙션임을 상시 표시.
- components/truckworks/TruckWorksArchitecture: 생산/AI/기록 관점의 데이터 흐름.
- pages/TruckWorksProjectPage: 전용 상세 페이지. 내부 이동은 해시 라우터와 충돌하지 않게 scrollIntoView와 제목 초점을 사용.
- public/truckworks/factory-overview.png·forming-detail.png: 자체 Blender 자산의 소개 렌더. 실제 앱 스크린샷 아님. 부품 배치는 정적 연출이며 실행 결과가 아님.
- scripts/render_truckworks.py: 원본 프로젝트의 GLB를 불러와 이미지 제작. Blender의 빈 장면에 World가 없어 첫 제작 프로세스가 중단됐고 명시적으로 World를 생성하도록 수정 후 두 PNG 저장 성공. 기능/화면 검증을 수행한 것은 아님.

새 npm 의존성, 실제 공장 API 연결, 키/쿠키/환경변수 전달은 없다. 기존 사이트의 밝은 개인 프로필은 보존하고 새 프로젝트 영역 안에서만 다크 공장/밝은 설계 문서를 교차한다.

## 콘텐츠 근거와 표현 범위

소스 프로젝트: C:\project\truckworks.

| 소개 내용 | 읽은 근거 |
|---|---|
| 개인 프로젝트·첫 공개 목표·서버 상태 책임 | PROJECT_PLAN.md, docs/PORTFOLIO.md |
| 고장 잔여시간 보존 | backend/src/truckworks/simulation/station_runtime.py |
| 고정 관측/읽기 도구5개 | backend/src/truckworks/agents/tools.py |
| LangGraph 흐름·응답/인용·도구 제한 | backend/src/truckworks/agents/workflow.py |
| 이동 예약·방문자 분리·이력·실패 사용량의 소개 | docs/PORTFOLIO.md와 개발 기록 |
| 공장 자산15종·공간 탐색과 UI | docs/FACTORY_WORLD_ASSETS.md·docs/UI_REDESIGN.md·PROGRESS.md |

공정5개·소재20개·입력용량3·자산15종은 구현/모델 구성이지 성능 실적이 아니다. 가짜 FPS/정확도/비용절감률, 실행하지 않은 AI 답변, 가짜 공개 URL이나 GitHub 링크를 넣지 않았다. 실제 공장 연동·정밀 절삭·비전검사AI·완성차 조립은 구현 범위에서 제외했다. 인용 대조가 원인 정확성을 보장하지 않고, 답변 관측은 과거일 수 있음을 핵심 결정에서 설명한다.

개인 역할은 기획/설계/구현/3D 자산, AI 코딩 도구 활용을 함께 표기했다. 개발 중/공개 준비 전과 구현 코드/사용자 검증을 구분했다.

## 사용자 확인 방법

1. 포트폴리오 폴더에서 기존 방식대로 실행한다. 필요하면 `npm run dev`를 직접 사용한다. 홈 첫 영역과 프로젝트 목록 첫 영역에 TruckWorks가 보여야 한다.
2. 대표 링크로 `#projects/truckworks`에 진입하고 새로고침/뒤로가기/프로젝트 목록 복귀를 확인한다. 기존 education/interview/about/home도 유지되어야 한다.
3. 공장 전체·가공기 근접 이미지의 밝기/구도/텍스트 가림을 살핀다. 두 이미지는 '자산 렌더'로 표시되어야 하고 라이브 화면으로 소개하면 안 된다.
4. 생산/고장/분석/복구 버튼을 눌러 설명과 강조 설비가 바뀌는지 본다. 이 페이지는 실제 서버를 제어하거나 AI를 호출하지 않는다.
5. 아키텍처3관점, 결정사항 펼치기, 목차 스크롤과 키보드 초점, 320/390/768/1440px 전후의 줄바꿈/가로넘침을 확인한다. 모션 감소 설정도 직접 살핀다.
6. 현재 구현 범위·개인 역할·상태 문구를 사용자 관점에서 검토한다. 실제 데모/영상/소스 공개를 준비하면 확정된 URL만 추가한다.
7. 빌드/린트가 필요하면 같은 폴더에서 `npm run build`, `npm run lint`를 사용자가 직접 실행한다. 이 문서는 성공 결과를 기록한 것이 아니다.

다음은 사용자 화면/내용 피드백과 실제 실행 시연 자료 반영이다. 공개 배포와 소스 공개는 이번 작업에서 수행하지 않았다.

## 2026-10-11 전체 UI 후속 개편

홈/목록 대표 소개를 밝은 편집형 배치로 바꾸고 상세의 회색 계열 바탕과 작은 설명 글씨를 조정했다. 내용 근거/렌더 표기/기존 인터랙션은 유지한다. 전체 디자인 조사·서체 선택·사용자 직접 확인 항목은 [UI_REFINEMENT.md](UI_REFINEMENT.md)를 참고한다. 코드 작성 완료, 사용자 검토 대기이며 빌드/실행/브라우저 검증은 수행하지 않았다.
