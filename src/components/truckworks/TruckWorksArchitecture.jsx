import { useState } from 'react'
import Arrow from '../common/Arrow.jsx'
import { architectureLayers } from '../../data/truckworks.js'

export default function TruckWorksArchitecture() {
  const [selected, setSelected] = useState(0)
  const layer = architectureLayers[selected]
  return <div className="tw-architecture">
    <div className="tw-layer-controls" role="group" aria-label="아키텍처 관점 선택">
      {architectureLayers.map((item, index) => <button key={item.id} aria-pressed={selected === index} onClick={() => setSelected(index)}><span>0{index + 1}</span>{item.label}<Arrow /></button>)}
    </div>
    <div className="tw-layer-content" aria-live="polite">
      <div className="tw-data-path" aria-label={`${layer.label} 데이터 흐름`}>{layer.path.map((node, index) => <div key={node}><span>0{index + 1}</span><strong>{node}</strong>{index < 3 && <Arrow />}</div>)}</div>
      <h3>{layer.title}</h3><p>{layer.body}</p><code>{layer.source}</code>
    </div>
  </div>
}
