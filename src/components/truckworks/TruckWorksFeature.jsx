import Arrow from '../common/Arrow.jsx'
import { truckworks } from '../../data/truckworks.js'
import TruckWorksSiteLink from './TruckWorksSiteLink.jsx'
import './TruckWorksFeature.css'

export default function TruckWorksFeature({ home = false }) {
  return <section className={`tw-feature ${home ? 'tw-feature-home' : ''}`} aria-labelledby={home ? 'tw-home-title' : 'tw-feature-title'}>
    <div className="tw-feature-copy">
      <span className="tw-feature-kicker"><i /> PROJECT / 01 <span>개인 프로젝트</span></span>
      <h2 id={home ? 'tw-home-title' : 'tw-feature-title'}>TruckWorks<span>3D 공장 시뮬레이션과<br />AI 상태 분석</span></h2>
      <p>차체 생산라인을 3D로 구현한 개인 프로젝트입니다. 설비의 고장·복구를 시뮬레이션하고, AI가 공장 상태와 이벤트를 조회해 원인을 설명하도록 만들고 있습니다.</p>
      <div className="tw-feature-actions">
        <TruckWorksSiteLink />
        <a className="tw-feature-link" href={truckworks.route}>프로젝트 자세히 보기 <Arrow /></a>
      </div>
      <div className="tw-feature-meta"><span>개인 프로젝트</span><span>React × Python × Blender</span><span>개발 중</span></div>
    </div>
    <a className="tw-feature-visual" href={truckworks.route} aria-label="TruckWorks 프로젝트 보기">

      <img src={truckworks.overview} width="2200" height="1400" alt="TruckWorks 자체 Blender 자산으로 구성한 공장 디오라마 소개 이미지" fetchPriority={home ? 'high' : 'auto'} />
      <span className="tw-feature-visual-label"><span>01 — CHASSIS PRODUCTION LINE</span><span>자체 자산 렌더 · 실행 화면 아님</span></span>
      <span className="tw-feature-open" aria-hidden="true"><Arrow diagonal /></span>
    </a>
  </section>
}

