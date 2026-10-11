import { useState } from 'react'
import Arrow from '../common/Arrow.jsx'
import { storySteps } from '../../data/truckworks.js'
import './TruckWorksStory.css'

const stations = ['소재 투입', '형상 가공', '구멍 가공', '품질 검사', '분리·적재']

export default function TruckWorksStory() {
  const [stepIndex, setStepIndex] = useState(0)
  const step = storySteps[stepIndex]
  return <div className="tw-story">
    <div className="tw-story-controls" role="group" aria-label="프로젝트 동작 설명 단계">
      {storySteps.map((item, index) => <button key={item.id} aria-pressed={stepIndex === index} onClick={() => setStepIndex(index)}>
        <span>0{index + 1}</span>{item.label}<Arrow />
      </button>)}
    </div>
    <div className="tw-story-stage" data-step={step.id}>
      <div className="tw-story-stage-heading"><span>CHASSIS LINE / SYSTEM WALKTHROUGH</span><span>동작 설명 · 실제 서버 실행 아님</span></div>
      <div className="tw-story-line" aria-label={`${step.label} 단계의 설명용 생산라인`}>
        {stations.map((station, index) => <div key={station} className="tw-story-station" data-active={step.focus.includes(index)} data-fault={step.id === 'fault' && index === 1}>
          <span className="tw-story-station-code">ST–0{index + 1}</span>
          <svg viewBox="0 0 120 120" fill="none" aria-hidden="true"><path d="m20 35 48-19 33 17-49 20-32-18Z" fill="currentColor" fillOpacity=".16" /><path d="m20 35 32 18v51L20 84V35Zm32 18 49-20v50l-49 21V53Z" fill="currentColor" fillOpacity=".06" /><path d="m20 35 48-19 33 17v50l-49 21-32-20V35Zm0 0 32 18 49-20M52 53v51m10-43 27-11v25L62 86V61ZM25 74l18 11M29 78v-7m9 12v-7" stroke="currentColor" strokeWidth="1.3" /><path d="M63 68 86 59M63 76 86 67" stroke="currentColor" strokeOpacity=".35" /></svg>
          <strong>{station}</strong><span className="tw-story-node"><i />{step.id === 'fault' && index === 1 ? '고장 지점' : step.id === 'analyze' && index === 1 ? '관측 대상' : `공정 0${index + 1}`}</span>
        </div>)}
      </div>
      <div className="tw-story-contract"><span>설계 원칙</span><code>{step.code}</code></div>
    </div>
    <div className="tw-story-caption" aria-live="polite" aria-atomic="true">
      <div><span className="tw-overline">0{stepIndex + 1} / {step.label}</span><h3>{step.title}</h3><p>{step.description}</p></div>
      <div><p>{step.detail}</p><span className="tw-story-note">{step.note}</span></div>
    </div>
  </div>
}
