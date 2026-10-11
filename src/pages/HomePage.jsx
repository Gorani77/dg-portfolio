import Arrow from '../components/common/Arrow.jsx'
import HomeProjectFocus from '../components/truckworks/HomeProjectFocus.jsx'
import { truckworks } from '../data/truckworks.js'
import './HomePage.css'

export default function HomePage() {
  return (
    <div className="flagship-home">
      <section className="flagship-hero" aria-labelledby="flagship-title">
        <div className="flagship-topline"><span>TruckWorks</span><span>개인 프로젝트 · 2026.10 — 개발 중</span></div>
        <div className="flagship-title-row">
          <h1 id="flagship-title">TruckWorks<span>.</span></h1>
          <p>3D FACTORY<br />& AI AGENT</p>
        </div>
        <figure className="flagship-scene">
          <img src={truckworks.overview} alt="직접 제작한 Blender 설비와 차체 생산라인으로 구성한 TruckWorks 공장" width="2200" height="1400" fetchPriority="high" />
          <figcaption>자체 Blender 자산으로 구성한 소개 렌더 · 실제 실행 화면 아님</figcaption>
        </figure>
        <div className="flagship-hero-bottom">
          <h2>3D 공장 시뮬레이션과<br /><span>AI 분석을 만들고 있습니다.</span></h2>
          <div className="flagship-hero-intro">
            <p>차체를 생산하는 다섯 공정을 3D로 구현했습니다.<br />설비를 멈추고 복구할 수 있고,<br />AI에게 현재 공장 상태를 물어볼 수 있습니다.</p>
            <a href={truckworks.route}>프로젝트 자세히 보기 <Arrow diagonal /></a>
          </div>
        </div>
      </section>
      <div className="flagship-byline">
        <span>기획·개발·Blender 모델링을 맡은 개인 프로젝트</span>
        <span>React · Python · Blender</span>
        <span>설계 / 개발 / 3D — 이동규</span>
      </div>
      <HomeProjectFocus />
      <section className="flagship-invitation" aria-labelledby="flagship-invitation-title">
        <div><span className="eyebrow">개발 내용</span><h2 id="flagship-invitation-title">생산 엔진과 AI는<br />이렇게 구현했습니다.</h2></div>
        <div><p>서버에서 생산 상태를 관리하고 3D 화면에 반영하는 방법,<br />AI가 공장 데이터를 조회하는 구조를 정리했습니다.</p><a className="primary-button" href={truckworks.route}>TruckWorks 자세히 보기 <Arrow /></a></div>
      </section>
      <nav className="flagship-next" aria-label="포트폴리오 더 살펴보기"><a href="#projects"><span>팀 프로젝트와 담당 기능</span><strong>프로젝트 전체 <Arrow /></strong></a><a href="#resume"><span>학력·경력·교육 이력</span><strong>이동규의 이력 <Arrow /></strong></a></nav>
    </div>
  )
}
