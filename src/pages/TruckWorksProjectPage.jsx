import Arrow from '../components/common/Arrow.jsx'
import TruckWorksStory from '../components/truckworks/TruckWorksStory.jsx'
import TruckWorksArchitecture from '../components/truckworks/TruckWorksArchitecture.jsx'
import { truckworks, decisions } from '../data/truckworks.js'
import './TruckWorksProjectPage.css'

function jumpTo(id) {
  const heading = document.getElementById(id)
  heading?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
  heading?.focus({ preventScroll: true })
}

export default function TruckWorksProjectPage() {
  return <article className="tw-case">
    <header className="tw-case-hero">
      <div className="tw-case-topline"><a href="#projects"><Arrow /> 프로젝트 목록</a><span>PROJECT 01 / SYSTEMS × AI</span><span>2026.10 — 진행 중</span></div>
      <div className="tw-hero-type"><div><span className="tw-overline">이동규 · 개인 프로젝트</span><h1>TruckWorks<span>.</span></h1></div><p>3D 공장 시뮬레이션과<br /><em>AI 상태 분석</em></p></div>
      <figure className="tw-hero-figure"><img src={truckworks.overview} alt="자체 제작한 다섯 공정 설비, 보관 선반과 전시 트럭을 배치한 TruckWorks 공장 디오라마" width="2200" height="1400" fetchPriority="high" /><figcaption><span>FACTORY 01 / CHASSIS LINE</span><span>실제 프로젝트의 Blender 자산으로 제작한 소개 이미지 · 실행 화면 아님</span></figcaption><span className="tw-hero-coordinate" aria-hidden="true">01 / 05<br />PRODUCTION<br />SYSTEM</span></figure>
      <div className="tw-hero-bottom"><p>차체 생산 과정을 3D로 구현한 시뮬레이터입니다.<br />AI가 공장 상태와 이벤트 기록을 조회해 설비가 멈춘 원인을 설명합니다.</p><button onClick={() => jumpTo('tw-experience')}>작동 방식 살펴보기 <Arrow /></button></div>
    </header>

    <div className="tw-chapters" role="group" aria-label="프로젝트 섹션 이동">
      {[['tw-intent', '01', '만든 이유'], ['tw-experience', '02', '동작 흐름'], ['tw-system', '03', '시스템 구조'], ['tw-craft', '04', '3D 화면'], ['tw-scope', '05', '개발 현황']].map(([id, n, label]) => <button key={id} onClick={() => jumpTo(id)}><span>{n}</span>{label}</button>)}
    </div>

    <section className="tw-section tw-intent" aria-labelledby="tw-intent">
      <div className="tw-section-heading"><span className="tw-overline">01 / INTENT</span><h2 id="tw-intent" tabIndex={-1}>공장 상태를 조회하는<br />AI를 만들고 싶었습니다.</h2></div>
      <div className="tw-intent-copy"><p className="tw-lead">생산라인을 직접 구현하고,<br />그 데이터를 AI가 조회하도록 연결한 프로젝트입니다.</p><p>공장에는 가공 중인 부품, 대기 중인 부품, 이동 중인 부품이 있습니다. 각 상태와 상태가 바뀐 기록을 서버에서 관리하고, AI가 이를 조회해 설비가 멈춘 이유를 설명하도록 했습니다.</p><p>3D 화면과 AI가 각각 다른 상태를 보고 설명하지 않도록, 생산 엔진의 데이터를 두 기능에서 함께 사용하게 했습니다.</p><dl className="tw-project-facts"><div><dt>역할</dt><dd>기획 · 설계 · 구현 · 3D 자산 제작</dd></div><div><dt>구성</dt><dd>개인 프로젝트 / AI 코딩 도구 활용</dd></div><div><dt>상태</dt><dd>로컬 개발 중 · 공개 데모 준비 전</dd></div></dl></div>
    </section>

    <section className="tw-section tw-dark" aria-labelledby="tw-experience">
      <div className="tw-section-heading"><span className="tw-overline">02 / EXPERIENCE</span><h2 id="tw-experience" tabIndex={-1}>생산부터 고장·분석·복구까지<br /><span>단계별 동작</span></h2><p>단계를 누르면 설비 상태가 어떻게 바뀌고 서버와 AI가 무엇을 처리하는지 볼 수 있습니다.</p></div>
      <TruckWorksStory />
    </section>

    <section className="tw-section tw-system" aria-labelledby="tw-system">
      <div className="tw-section-heading"><span className="tw-overline">03 / ENGINEERING</span><h2 id="tw-system" tabIndex={-1}>생산 엔진과 AI,<br />데이터 저장 구조</h2><p>생산 상태 관리, AI의 데이터 조회,<br />방문자별 실행과 이력 저장을 나눠 구현했습니다.</p></div>
      <TruckWorksArchitecture />
      <div className="tw-stack"><span>BUILDING BLOCKS</span>{['React / TypeScript', 'Three.js / R3F', 'FastAPI / SimPy', 'LangGraph / OpenAI', 'PostgreSQL', 'Blender / glTF'].map(item => <span key={item}>{item}</span>)}</div>
      <div className="tw-decisions"><div className="tw-decision-intro"><span className="tw-overline">개발 중 다룬 문제</span><h3>문제와<br />해결 방법</h3><p>대기 공간 계산과 AI 데이터 조회에서<br />고려한 점을 정리했습니다.</p></div><div className="tw-decision-list">{decisions.map((item, index) => <details key={item.number} open={index === 0 ? true : undefined}><summary><span>{item.number}</span><h4>{item.title}</h4><span className="tw-expand" aria-hidden="true">+</span></summary><div className="tw-decision-body"><p><b>문제</b>{item.problem}</p><p><b>해결 방법</b>{item.choice}</p><p className="tw-boundary"><b>제약 사항</b>{item.boundary}</p><code>{item.source}</code></div></details>)}</div></div>
    </section>

    <section className="tw-craft" aria-labelledby="tw-craft">
      <div className="tw-craft-visual"><img src={truckworks.detail} width="1600" height="1200" loading="lazy" alt="Blender로 제작한 형상 가공기의 외장 패널, 스핀들, 가이드와 지그를 보여주는 소개 렌더" /><span>FORMING CELL / ST–02<br />자체 Blender 자산 렌더</span></div>
      <div className="tw-craft-copy"><span className="tw-overline">04 / SPATIAL INTERFACE</span><h2 id="tw-craft" tabIndex={-1}>설비를 선택하고<br />상태를 확인하는 3D 화면</h2><p>공장 화면에서 구역, 설비, 차체를 선택하면 카메라가 해당 위치로 이동하고 상세 정보가 열립니다.</p><ol><li><span>01</span><div><h3>대상 선택과 카메라 이동</h3><p>구역·설비·부품을 선택하고 카메라가 대상에 접근합니다. 상세 정보는 상황에 맞춰 열립니다.</p></div></li><li><span>02</span><div><h3>가공 진행률에 따른 설비 동작</h3><p>Blender 모델의 움직이는 부분을 서버의 가공 진행률에 연결했습니다. 고장 시 자세를 유지하고, 시뮬레이션의 품질값에 따라 부품을 분리하는 방향을 표시합니다.</p></div></li><li><span>03</span><div><h3>AI 답변에서 관련 설비 선택</h3><p>AI 답변에 나온 설비를 화면에서 강조하고 해당 위치로 이동할 수 있게 했습니다. 조회한 데이터와 시각도 함께 표시합니다.</p></div></li></ol></div>
    </section>

    <section className="tw-section tw-scope" aria-labelledby="tw-scope">
      <div className="tw-section-heading"><span className="tw-overline">05 / CURRENT CHAPTER</span><h2 id="tw-scope" tabIndex={-1}>현재 개발 현황과<br />남은 작업</h2><p>현재 로컬에서 개발 중입니다. 아래는 코드 작성이 끝난 기능과 실행 확인·공개 전에 남은 작업입니다.</p></div>
      <div className="tw-scope-grid"><div><span className="tw-scope-status">코드 작성 완료</span><ul><li>5개 공정 · 차체 1개 / 20개 생산</li><li>대기열 · 이동 예약 · 고장과 잔여시간 복구</li><li>읽기 전용 AI · 관측 고정 · 근거와 관련 설비</li><li>생산·분석 이력 · 방문자별 실행 분리</li><li>Blender 자산 15종 · 공간 탐색 UI</li></ul></div><div><span className="tw-scope-status" data-pending="true">남은 작업</span><ul><li>전체 기능·반응형·시각 확인</li><li>실제 실행을 담은 데모 영상</li><li>공개 호스팅과 소스 공개 범위 결정</li><li>조건을 명시한 응답·성능 측정</li></ul><p>현재 공개 데모 URL과 측정된 성능 수치는 없습니다. 실제 공장 연동·비전 검사 AI·완성 트럭 조립은 구현 범위에 포함하지 않습니다.</p></div></div>
      <div className="tw-next"><p>추후 확장 계획<br /><strong>조립 공정과 생산 조건 비교</strong></p><span>차체 생산 이후의 조립 공정을 추가하고,<br />생산 조건을 바꿨을 때 결과를 비교하는 기능을 검토하고 있습니다.</span></div>
    </section>
    <section className="tw-case-end" aria-label="다음 탐색"><div><span className="tw-overline">CONTACT</span><h2>프로젝트에 관한 질문은<br />메일로 보내주세요.</h2><a href="mailto:sp2877@naver.com">sp2877@naver.com <Arrow diagonal /></a></div><a className="tw-back-link" href="#projects">다른 프로젝트 보기 <Arrow /></a></section>
  </article>
}

