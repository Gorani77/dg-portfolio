import { useEffect, useId, useState } from 'react'
import './InterviewGraph.css'
import './GuardrailExperience.css'

const requests = {
  answer: { label: '정답 요청', text: '정답과 전체 풀이를 알려줘' },
  concept: { label: '개념 질문', text: '소인수분해가 무엇인지 설명해줘' },
  privacy: { label: '타인 성적 요청', text: '다른 학생의 성적을 알려줘' },
}
const responses = { normal: '검색된 정책 인용', unknown: '검색에 없는 정책 인용', mismatch: '판정·정책 불일치', uncertain: '불확실 판정' }
const positions = {
  input: [150, 130], search: [470, 130], judgment: [790, 130],
  validation: [790, 340], block: [470, 540], allow: [980, 540],
}
const edges = [
  ['input', 'search', 'M 265 130 H 355'],
  ['search', 'judgment', 'M 585 130 H 675'],
  ['judgment', 'validation', 'M 790 170 V 300'],
  ['judgment', 'block', 'M 790 170 V 240 H 470 V 500'],
  ['validation', 'block', 'M 675 340 H 470 V 500'],
  ['validation', 'allow', 'M 905 340 H 980 V 500'],
]

export default function GuardrailExperience() {
  const marker = useId().replaceAll(':', '')
  const [stage, setStage] = useState('solve')
  const [request, setRequest] = useState('answer')
  const [response, setResponse] = useState('normal')
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [inspected, setInspected] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const invalid = response !== 'normal'
  const allowed = !invalid && request !== 'privacy' && (request !== 'answer' || stage === 'explain')
  const stageLabel = stage === 'solve' ? '풀이' : '해설'
  const stageCode = stage === 'solve' ? 'SOLVE_CHAT' : 'REVIEW_CHAT'
  const policyId = request === 'privacy' ? 'COMMON-01'
    : request === 'concept' ? stage === 'solve' ? 'SOLVE-01' : 'REVIEW-03'
      : stage === 'solve' ? 'SOLVE-04' : 'REVIEW-01'
  const policyEffect = request !== 'privacy' && (request !== 'answer' || stage === 'explain') ? 'ALLOW' : 'BLOCK'
  const modelDecision = response === 'uncertain' ? 'UNCERTAIN' : response === 'unknown' ? 'ALLOW'
    : response === 'mismatch' ? policyEffect === 'ALLOW' ? 'BLOCK' : 'ALLOW' : policyEffect
  const reason = response === 'uncertain'
    ? 'AI가 UNCERTAIN을 반환하면 허용하지 않고 POLICY_DECISION_UNAVAILABLE로 차단합니다.'
    : response === 'mismatch' ? '판정과 인용한 정책의 허용·차단 속성이 일치하지 않아 서버 검사를 통과하지 못합니다.'
      : response === 'unknown' ? 'AI가 인용한 정책이 검색 결과에 없으므로 서버 검사를 통과하지 못합니다.'
        : request === 'privacy' ? '타인의 성적·개인정보 요청은 학습 단계에 관계없이 차단합니다.'
          : request === 'concept' ? '개념 설명과 힌트 요청은 풀이 단계와 해설 단계 모두에서 허용합니다.'
            : stage === 'solve' ? '풀이 중에는 정답과 전체 풀이를 제공하지 않도록 요청을 차단합니다.'
              : '해설 단계에서는 정답과 전체 풀이 설명을 허용합니다.'
  const nodes = [
    { id: 'input', label: '학습 단계 · 요청', sub: 'SERVER CONTEXT', title: '학습 단계는 서버가 지정합니다', text: `현재는 ${stageLabel} 단계입니다. 사용자 문장에 포함된 주장으로 단계를 변경하지 않습니다. 해설 요청은 서비스에서 결과 접근과 공개 상태를 확인한 뒤 REVIEW_CHAT으로 전달합니다.`, data: { kind: stageCode, userInput: requests[request].text, history: [] } },
    { id: 'search', label: '정책 검색', sub: 'RAG / PGVECTOR', title: '공통 정책과 현재 단계의 정책을 검색합니다', text: `최근 대화 최대 6개와 현재 요청을 검색에 사용합니다. 공통 정책과 ${stageLabel} 정책을 각각 top-k로 검색한 뒤 통합합니다. 아래 정책은 관련 정책 한 개의 예시이며, 전체 검색 결과나 검색 순위가 아닙니다.`, data: { candidateScopes: ['COMMON', stageCode], examplePolicy: { id: policyId, effect: policyEffect }, topKPerScopeDefault: 3 } },
    { id: 'judgment', label: 'AI 판정', sub: 'DECISION + POLICY IDS', title: '판정과 근거 정책을 함께 받습니다', text: '응답 스키마는 decision과 policyIds를 받습니다. ALLOW·BLOCK 외의 판정은 허용하지 않습니다. 여기 표시한 AI 응답은 직접 선택한 가정값이며 실제 모델 출력이 아닙니다.', data: { decision: modelDecision, policyIds: [response === 'unknown' ? 'EXAMPLE_UNKNOWN_ID' : policyId] } },
    { id: 'validation', label: '서버 근거 검사', sub: 'POLICY VALIDATION', title: '인용한 정책과 판정의 일치 여부를 검사합니다', text: '각 정책 ID가 검색 결과에 포함되어야 하고, 정책의 effect가 decision과 일치해야 합니다. 유효한 BLOCK 판정도 이 검사를 거친 뒤 학습 안내를 반환합니다.', data: { citedPolicyInSearchResults: response !== 'unknown', decisionMatchesPolicy: response === 'unknown' ? '정책 ID 검사에서 중단' : response !== 'mismatch' } },
    { id: 'block', label: '차단 · 안내 반환', sub: 'NO CHATBOT CALL', title: allowed ? '차단 경로는 선택되지 않았습니다' : invalid ? '검사 실패로 챗봇 호출을 중단합니다' : '정책에 따라 학습 안내를 반환합니다', text: allowed ? '정책상 차단 또는 판정·근거 검사 실패 시 이 경로로 이동합니다. 현재 조건은 허용 경로를 선택합니다.' : reason, data: { blocked: true, reasonCode: allowed ? '현재 경로에서 사용하지 않음' : invalid ? 'POLICY_DECISION_UNAVAILABLE' : `POLICY_${policyId}` } },
    { id: 'allow', label: '허용 · 챗봇 호출', sub: 'CONTINUE CHAT', title: allowed ? '기존 학습 챗봇을 호출합니다' : '허용 경로는 선택되지 않았습니다', text: allowed ? reason : 'ALLOW 판정과 근거 검사가 모두 통과해야 챗봇을 호출합니다. 현재 조건은 차단 경로를 선택합니다.', data: { callChatbot: allowed } },
  ]
  const path = ['input', 'search', 'judgment', ...(response === 'uncertain' ? [] : ['validation']), allowed ? 'allow' : 'block']
  const currentId = path[step]
  const selected = nodes.find(node => node.id === (inspected || currentId))
  const visited = new Set(path.slice(0, step + 1))
  const traversed = new Set(path.slice(1, step + 1).map((id, index) => `${path[index]}:${id}`))
  const finished = step === path.length - 1

  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(() => {
      if (step < path.length - 1) setStep(step + 1)
      else setPlaying(false)
    }, 1100)
    return () => window.clearTimeout(timer)
  }, [playing, step, path.length])

  function reset() { setStep(0); setPlaying(false); setInspected(null) }
  function change(setValue, value) { reset(); setValue(value) }
  function move(next) { setStep(next); setPlaying(false); setInspected(null) }

  return <div className="interview-graph guardrail-graph">
    <div className="ig-heading"><div><span className="ig-eyebrow">RAG / INPUT GUARDRAIL</span><h3>이 요청은 챗봇까지 도달할까요?</h3></div><span className="ig-node-count">정책 검색 → 판정 → 서버 검사</span></div>
    <div className="gg-controls">
      <fieldset><legend>학습 단계</legend><div className="education-options"><button type="button" aria-pressed={stage === 'solve'} onClick={() => change(setStage, 'solve')}>풀이 중</button><button type="button" aria-pressed={stage === 'explain'} onClick={() => change(setStage, 'explain')}>해설 확인</button></div></fieldset>
      <fieldset><legend>사용자 요청</legend><div className="education-options">{Object.entries(requests).map(([id, item]) => <button key={id} type="button" aria-pressed={request === id} onClick={() => change(setRequest, id)}>{item.label}</button>)}</div></fieldset>
      <label>가정할 AI 응답<select value={response} onChange={event => change(setResponse, event.target.value)}>{Object.entries(responses).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
    </div>
    <div className="gg-request"><span>{stageCode}</span><p>“{requests[request].text}”</p></div>
    <div className="ig-toolbar">
      <div className="ig-playback"><button type="button" disabled={step === 0} aria-label="이전 단계" onClick={() => move(step - 1)}>←</button><button type="button" className="ig-play" onClick={() => { setInspected(null); if (!playing && finished) setStep(0); setPlaying(!playing) }}>{playing ? '일시 정지' : '경로 재생'}</button><button type="button" disabled={finished} aria-label="다음 단계" onClick={() => move(step + 1)}>→</button><button type="button" aria-label="처음으로 되돌리기" onClick={reset}>↺</button></div>
      <span className={`gg-status ${finished ? allowed ? 'is-allowed' : 'is-blocked' : ''}`} aria-live="polite">{finished ? allowed ? '허용 경로 도착' : invalid ? '검사 실패 · 차단' : '정책에 따른 차단' : playing ? '설명용 경로 · 재생 중' : '설명용 경로 · 재생 대기'}</span>
      <button type="button" className="ig-expand" aria-pressed={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? '전체 크기로' : '그래프 확대'}</button>
    </div>
    <div className="ig-canvas" tabIndex={0} role="region" aria-label="가드레일 처리 흐름. 각 처리 단계를 선택하면 설명을 볼 수 있습니다.">
      <svg viewBox="0 0 1140 640" className={expanded ? 'is-expanded' : ''} aria-label="요청부터 챗봇 호출 또는 차단까지의 개념도">
        <defs><pattern id={`${marker}-dots`} width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#ddd7e8" /></pattern><marker id={`${marker}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke" /></marker></defs>
        <rect width="1140" height="640" fill={`url(#${marker}-dots)`} />
        <g className="ig-lane-label"><text x="470" y="45">학습 문맥과 정책으로 판정 근거 구성</text><text x="975" y="270">판정 근거를 서버에서 검사</text></g>
        {edges.map(([from, to, d]) => {
          const key = `${from}:${to}`
          const active = step > 0 && path[step - 1] === from && currentId === to
          return <path key={key} d={d} fill="none" markerEnd={`url(#${marker}-arrow)`} className={`ig-edge ${to === 'block' || to === 'allow' ? 'is-conditional' : ''} ${traversed.has(key) ? 'is-traversed' : ''} ${active ? 'is-active' : ''} ${inspected && (inspected === from || inspected === to) ? 'is-nearby' : ''}`} />
        })}
        <g className="gg-edge-label"><text x="375" y="270">불확실 판정</text><text x="380" y="425">BLOCK / 검사 실패</text><text x="1040" y="425">ALLOW / 검사 통과</text></g>
        {nodes.map(node => {
          const [x, y] = positions[node.id]
          return <g key={node.id} transform={`translate(${x}, ${y})`} role="button" tabIndex={0} aria-label={node.label} aria-pressed={selected.id === node.id}
            onClick={() => { setInspected(node.id); setPlaying(false) }} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setInspected(node.id); setPlaying(false) } }}
            className={`ig-node gg-node ${node.id === 'allow' ? 'gg-allow' : node.id === 'block' ? 'gg-block' : ''} ${visited.has(node.id) ? 'is-visited' : ''} ${currentId === node.id ? 'is-current' : ''} ${inspected === node.id ? 'is-inspected' : ''}`}>
            <rect x="-115" y="-40" width="230" height="80" rx="12" /><text className="ig-node-label" textAnchor="middle" y="-3">{node.label}</text><text className="ig-node-id" textAnchor="middle" y="20">{node.sub}</text>{currentId === node.id && <circle className="ig-current-dot" cx="100" cy="-29" r="5" />}
          </g>
        })}
      </svg>
    </div>
    <div className="ig-footer"><div className="ig-legend"><span><i className="ig-key-current" />현재 단계</span><span><i className="ig-key-visited" />지나온 단계</span><span><i className="ig-key-conditional" />조건에 따른 분기</span></div><span>{step + 1} / {path.length} 단계</span></div>
    <div className="ig-detail gg-detail" aria-live="polite" aria-atomic="true"><div><span>{inspected ? '선택한 단계' : '현재 단계'}</span><h4>{selected.label}</h4><code>{selected.sub}</code></div><div><h4>{selected.title}</h4><p>{selected.text}</p><details><summary>입력·출력 예시 보기</summary><pre>{JSON.stringify(selected.data, null, 2)}</pre></details></div></div>
    <p className="ig-note">실제 구현의 처리 흐름을 나눈 개념도이며 LangGraph 노드는 아닙니다. 실제 AI 호출·정책 검색·백엔드 실행은 수행하지 않으며, 데이터는 실행 로그가 아닌 설명용 예시입니다. 조건을 바꾸면 재생은 처음으로 돌아가고, 선택한 AI 응답 조건은 유지됩니다.</p>
  </div>
}
