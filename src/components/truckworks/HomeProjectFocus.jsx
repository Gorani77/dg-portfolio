import { useState } from 'react'
import Arrow from '../common/Arrow.jsx'
import { homePerspectives } from '../../data/homePerspectives.js'
import './HomeProjectFocus.css'

export default function HomeProjectFocus() {
  const [selectedId, setSelectedId] = useState(homePerspectives[0].id)
  const selected = homePerspectives.find(item => item.id === selectedId)

  return (
    <section className="home-focus" aria-labelledby="home-focus-title">
      <div className="home-focus-heading">
        <span className="eyebrow">주요 구현 내용</span>
        <h2 id="home-focus-title">TruckWorks에서<br />구현한 기능</h2>
        <p>3D 생산라인, AI 상태 분석,<br />설비 모델링을 소개합니다.</p>
      </div>
      <div className="home-focus-controls" role="group" aria-label="주요 기능 선택">
        {homePerspectives.map(item => (
          <button type="button" key={item.id} aria-pressed={selectedId === item.id} aria-controls="home-focus-content" onClick={() => setSelectedId(item.id)}>
            <span>{item.number}</span>{item.label}<Arrow />
          </button>
        ))}
      </div>
      <div className="home-focus-content" id="home-focus-content" aria-live="polite" aria-atomic="true">
        <figure className="home-focus-image">
          <img src={selected.image} alt={selected.alt} width={selected.id === 'space' ? 2200 : 1600} height={selected.id === 'space' ? 1400 : 1200} loading="lazy" />
          <figcaption>{selected.caption}</figcaption>
        </figure>
        <div className="home-focus-copy">
          <span className="home-focus-number">{selected.number} / 03</span>
          <h3>{selected.title}</h3>
          <p>{selected.description}</p>
          <ol className="home-focus-path" aria-label="설계 흐름">
            {selected.path.map((step, index) => <li key={step}><span>{step}</span>{index < selected.path.length - 1 && <Arrow />}</li>)}
          </ol>
          <p className="home-focus-principle">{selected.principle}</p>
        </div>
      </div>
      <p className="home-focus-note">아래 이미지와 설명은 구현 내용을 소개하기 위한 자료입니다. 이 페이지에서 공장이나 AI를 실행하지는 않습니다.</p>
    </section>
  )
}
