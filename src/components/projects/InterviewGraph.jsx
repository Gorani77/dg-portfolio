import { useEffect, useId, useState } from 'react'
import './InterviewGraph.css'

// Coordinates organize the actual graph.py nodes into three readable lanes.
const nodes = [
  ['START', '시작', 80, 120, 'terminal', '그래프 실행을 시작합니다.'],
  ['greet', '면접 시작 안내', 280, 120, 'core', '면접 시작 시 안내 발화를 준비합니다.'],
  ['compose_utterance', '발화 구성', 520, 120, 'core', '질문·안내를 발화로 구성합니다. 종료 상태이면 END로, 그 외에는 입력 대기로 이동합니다.'],
  ['wait_event', '입력 대기', 520, 230, 'core', 'interrupt로 실행을 중단합니다. 입력이 도착하면 이 노드부터 재개해 이벤트를 반환합니다.'],
  ['validate_event', '입력 이벤트 검사', 520, 340, 'core', '이벤트 형식, 세션과 질문 식별자를 검사합니다. 이벤트 종류와 검사 결과에 따라 경로가 달라집니다.'],
  ['record_candidate_answer', '지원자 답변 기록', 520, 450, 'core', '지원자 답변을 대화 기록에 추가합니다.'],
  ['evaluate_answer', '답변 평가 요청', 520, 560, 'core', 'Assessment에 평가를 요청합니다. 평가 신호와 질문 상한·반박 사용 여부에 따라 다음 노드를 선택합니다.'],
  ['complete_set', '질문 세트 완료', 520, 780, 'core', '현재 질문 세트를 마칩니다. 기본 질문 수와 종료 상태에 따라 다음 질문 또는 리포트로 이동합니다.'],
  ['END', '종료', 520, 900, 'terminal', '최종 발화 구성 이후 그래프 실행을 종료합니다.'],
  ['ask_main', '다음 기본 질문', 940, 120, 'question', 'Strategy를 통해 기본 질문을 생성하고 질문 세트의 상태를 초기화합니다.'],
  ['ask_follow_up', '후속 질문', 940, 230, 'question', 'bonus_available 신호에 따라 더 깊이 확인하는 질문을 생성합니다.'],
  ['ask_challenge', '반박 질문', 940, 340, 'question', 'misconception 신호에 따라 개념 오해를 확인합니다. 같은 세트의 반박 반복은 제한합니다.'],
  ['ask_confirm_positive', '긍정 확인 질문', 940, 450, 'question', 'confirm_positive 신호에 따른 확인 질문을 생성합니다.'],
  ['ask_confirm_negative', '부정 확인 질문', 940, 560, 'question', 'confirm_negative 신호에 따른 확인 질문을 생성합니다.'],
  ['ask_trap', '함정 질문', 940, 670, 'question', 'trap_available 신호에 따른 질문을 생성합니다.'],
  ['handle_off_topic', '주제 이탈 처리', 940, 780, 'question', '주제 이탈을 처리하고 발화 구성으로 돌아갑니다. 파생 질문 상한 검사보다 먼저 선택되는 경로입니다.'],
  ['handle_replay', '질문 다시 전달', 100, 340, 'exception', '질문 반복 요청 또는 입력 검사 오류가 있으면 질문을 다시 전달합니다.'],
  ['handle_silence', '침묵 처리', 100, 450, 'exception', '침묵 정책에 따라 대기, 힌트, 질문 재전달 또는 타임아웃을 선택합니다.'],
  ['handle_timeout', '타임아웃 처리', 100, 560, 'exception', 'pause 정책은 안내 발화로, end 정책은 최종 리포트로 이동합니다.'],
  ['final_report', '최종 리포트 요청', 100, 780, 'exception', 'Assessment에 최종 면접 리포트 생성을 요청합니다.'],
  ['finalize', '세션 종료 처리', 100, 890, 'exception', '종료 상태를 설정한 뒤 마지막 발화를 구성합니다.'],
].map(([id, label, x, y, kind, description]) => ({ id, label, x, y, kind, description }))
const byId = Object.fromEntries(nodes.map(node => [node.id, node]))
const edges = [
  ['START', 'greet'], ['greet', 'compose_utterance'],
  ['compose_utterance', 'wait_event', true], ['compose_utterance', 'END', true],
  ['wait_event', 'validate_event'],
  ...['record_candidate_answer', 'handle_replay', 'handle_silence', 'handle_timeout', 'final_report'].map(id => ['validate_event', id, true]),
  ['record_candidate_answer', 'evaluate_answer'],
  ...['complete_set', 'handle_off_topic', 'ask_follow_up', 'ask_challenge', 'ask_confirm_positive', 'ask_confirm_negative', 'ask_trap'].map(id => ['evaluate_answer', id, true]),
  ['complete_set', 'ask_main', true], ['complete_set', 'final_report', true],
  ...['ask_main', 'ask_follow_up', 'ask_challenge', 'ask_confirm_positive', 'ask_confirm_negative', 'ask_trap', 'handle_replay', 'handle_off_topic'].map(id => [id, 'compose_utterance']),
  ['handle_silence', 'wait_event', true], ['handle_silence', 'compose_utterance', true], ['handle_silence', 'handle_timeout', true],
  ['handle_timeout', 'compose_utterance', true], ['handle_timeout', 'final_report', true],
  ['final_report', 'finalize'], ['finalize', 'compose_utterance'],
]
const fromInput = (...path) => ['wait_event', 'validate_event', ...path]
const answer = (...path) => fromInput('record_candidate_answer', 'evaluate_answer', ...path)
const speak = ['compose_utterance', 'wait_event']
const finish = ['final_report', 'finalize', 'compose_utterance', 'END']
const scenarios = [
  { id: 'start', label: '면접 시작', note: '시작 안내 발화를 구성하고 지원자 입력을 기다립니다.', path: ['START', 'greet', ...speak] },
  { id: 'follow', label: '후속 질문', note: 'bonus_available · 파생 질문 상한 미도달: 후속 질문을 생성한 뒤 다시 입력을 기다립니다.', path: answer('ask_follow_up', ...speak) },
  { id: 'challenge', label: '반박 질문', note: 'misconception · 반박 미사용 · 파생 질문 상한 미도달을 가정합니다.', path: answer('ask_challenge', ...speak) },
  { id: 'positive', label: '긍정 확인', note: 'confirm_positive · 파생 질문 상한 미도달을 가정합니다.', path: answer('ask_confirm_positive', ...speak) },
  { id: 'negative', label: '부정 확인', note: 'confirm_negative · 파생 질문 상한 미도달을 가정합니다.', path: answer('ask_confirm_negative', ...speak) },
  { id: 'trap', label: '함정 질문', note: 'trap_available · 파생 질문 상한 미도달을 가정합니다.', path: answer('ask_trap', ...speak) },
  { id: 'main', label: '다음 기본 질문', note: 'sufficient · 기본 질문 수가 상한 미만: 현재 세트를 마치고 다음 기본 질문을 생성합니다.', path: answer('complete_set', 'ask_main', ...speak) },
  { id: 'off-topic', label: '주제 이탈', note: 'off_topic: 주제 이탈 처리 후 발화 구성으로 돌아갑니다.', path: answer('handle_off_topic', ...speak) },
  { id: 'replay', label: '질문 반복 요청', note: 'replay_requested 이벤트: 현재 질문을 다시 전달합니다.', path: fromInput('handle_replay', ...speak) },
  { id: 'silence-wait', label: '짧은 침묵', note: 'silence_action = wait: 새 발화 없이 입력 대기로 바로 돌아갑니다.', path: fromInput('handle_silence', 'wait_event') },
  { id: 'silence-hint', label: '침묵 후 힌트', note: 'silence_action = hint: 힌트 발화를 구성한 뒤 다시 입력을 기다립니다.', path: fromInput('handle_silence', ...speak) },
  { id: 'timeout-pause', label: '타임아웃 · 대기', note: 'no_response_timeout · timeout_action = pause: 종료 대신 안내 발화를 구성합니다.', path: fromInput('handle_timeout', ...speak) },
  { id: 'silence-end', label: '침묵 누적 · 종료', note: 'silence_action = timeout · timeout_action = end: 리포트와 최종 발화를 거쳐 종료합니다.', path: fromInput('handle_silence', 'handle_timeout', ...finish) },
  { id: 'complete', label: '질문 상한 · 종료', note: 'sufficient · 기본 질문 10개 진행을 가정합니다. 마지막 답변 평가와 세트 완료 후 종료합니다.', path: answer('complete_set', ...finish) },
  { id: 'end', label: '종료 요청', note: 'end_requested 이벤트: 최종 리포트를 요청하고 세션을 종료합니다.', path: fromInput(...finish) },
]

function edgePath(from, to) {
  const a = byId[from]
  const b = byId[to]
  const half = node => node.kind === 'terminal' ? 42 : 94
  if (from === 'compose_utterance' && to === 'END') return `M ${a.x + half(a)} ${a.y} H 690 V ${b.y} H ${b.x + half(b)}`
  if (to === 'compose_utterance' && a.x === 940) return `M ${a.x + half(a)} ${a.y} H 1100 V 65 H ${b.x} V ${b.y - 32}`
  if (to === 'compose_utterance' && a.x === 100) return `M ${a.x - half(a)} ${a.y} H -16 V 175 H 390 V ${b.y} H ${b.x - half(b)}`
  if (a.x === b.x) return `M ${a.x} ${a.y + 32} V ${b.y - 32}`
  const direction = b.x > a.x ? 1 : -1
  const startX = a.x + direction * half(a)
  const endX = b.x - direction * half(b)
  const middle = a.x === 520 && b.x === 940 ? 770 : a.x === 100 ? 300 : (startX + endX) / 2
  return `M ${startX} ${a.y} H ${middle} V ${b.y} H ${endX}`
}

export default function InterviewGraph() {
  const marker = useId().replaceAll(':', '')
  const [scenarioId, setScenarioId] = useState('follow')
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [inspected, setInspected] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const scenario = scenarios.find(item => item.id === scenarioId)
  const currentId = scenario.path[step]
  const selected = byId[inspected || currentId]
  const visited = new Set(scenario.path.slice(0, step + 1))
  const traversed = new Set(scenario.path.slice(1, step + 1).map((id, index) => `${scenario.path[index]}:${id}`))

  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(() => {
      if (step < scenario.path.length - 1) setStep(step + 1)
      else setPlaying(false)
    }, 950)
    return () => window.clearTimeout(timer)
  }, [playing, step, scenario])

  function changeScenario(id) {
    setScenarioId(id)
    setStep(0)
    setPlaying(false)
    setInspected(null)
  }
  function moveStep(next) { setStep(next); setPlaying(false); setInspected(null) }

  return <div className="interview-graph">
    <div className="ig-heading"><div><span className="ig-eyebrow">INTERVIEWER / STATE GRAPH</span><h3>한 번의 답변이 지나가는 경로</h3></div><span className="ig-node-count">19개 노드 + START / END</span></div>
    <div className="ig-toolbar">
      <label>상황 선택<select value={scenarioId} onChange={event => changeScenario(event.target.value)}>{scenarios.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
      <div className="ig-playback">
        <button type="button" disabled={step === 0} onClick={() => moveStep(step - 1)} aria-label="이전 단계">←</button>
        <button type="button" className="ig-play" onClick={() => { setInspected(null); if (!playing && step === scenario.path.length - 1) setStep(0); setPlaying(!playing) }}>{playing ? '일시 정지' : '경로 재생'}</button>
        <button type="button" disabled={step === scenario.path.length - 1} onClick={() => moveStep(step + 1)} aria-label="다음 단계">→</button>
        <button type="button" onClick={() => moveStep(0)} aria-label="처음 단계로 되돌리기">↺</button>
      </div>
      <button type="button" className="ig-expand" aria-pressed={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? '전체 크기로' : '그래프 확대'}</button>
    </div>
    <p className="ig-scenario">{scenario.note}</p>
    <div className="ig-canvas" tabIndex={0} role="region" aria-label="전체 면접 그래프. 좌우로 스크롤할 수 있으며 각 노드를 선택하면 설명이 표시됩니다.">
      <svg className={expanded ? 'is-expanded' : ''} viewBox="-40 0 1170 980" aria-label="실제 LangGraph 노드와 연결 경로">
        <defs>
          <pattern id={`${marker}-grid`} width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#ddd7e8" /></pattern>
          <marker id={`${marker}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke" /></marker>
        </defs>
        <rect x="-40" width="1170" height="980" fill={`url(#${marker}-grid)`} />
        <g className="ig-lane-label"><text x="100" y="30">이벤트 처리 · 종료</text><text x="520" y="30">면접 진행</text><text x="940" y="30">질문 생성 · 주제 복귀</text></g>
        <g fill="none">{edges.map(([from, to, conditional]) => {
          const key = `${from}:${to}`
          const active = step > 0 && from === scenario.path[step - 1] && to === currentId
          const nearby = inspected && (from === inspected || to === inspected)
          return <path key={key} d={edgePath(from, to)} className={`ig-edge ${conditional ? 'is-conditional' : ''} ${traversed.has(key) ? 'is-traversed' : ''} ${active ? 'is-active' : ''} ${nearby ? 'is-nearby' : ''}`} markerEnd={`url(#${marker}-arrow)`} />
        })}</g>
        {nodes.map(node => <g key={node.id} role="button" tabIndex={0} aria-label={`${node.label}: ${node.id}`} aria-pressed={selected.id === node.id}
          onClick={() => { setInspected(node.id); setPlaying(false) }} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setInspected(node.id); setPlaying(false) } }}
          transform={`translate(${node.x}, ${node.y})`} className={`ig-node is-${node.kind} ${visited.has(node.id) ? 'is-visited' : ''} ${currentId === node.id ? 'is-current' : ''} ${inspected === node.id ? 'is-inspected' : ''}`}>
          <rect x={node.kind === 'terminal' ? -42 : -94} y="-32" width={node.kind === 'terminal' ? 84 : 188} height="64" rx={node.kind === 'terminal' ? 32 : 12} />
          <text className="ig-node-label" textAnchor="middle" y={node.kind === 'terminal' ? 5 : -3}>{node.label}</text>
          {node.kind !== 'terminal' && <text className="ig-node-id" textAnchor="middle" y="17">{node.id}</text>}
          {currentId === node.id && <circle className="ig-current-dot" cx={node.kind === 'terminal' ? 30 : 80} cy="-22" r="5" />}
        </g>)}
      </svg>
    </div>
    <div className="ig-footer"><div className="ig-legend"><span><i className="ig-key-current" />현재 단계</span><span><i className="ig-key-visited" />지나온 노드</span><span><i className="ig-key-conditional" />조건부 연결</span></div><span>{step + 1} / {scenario.path.length} 단계</span></div>
    <div className="ig-detail" aria-live="polite" aria-atomic="true"><div><span>{inspected ? '선택한 노드' : playing ? '경로 재생 중' : '현재 단계'}</span><h4>{selected.label}</h4><code>{selected.id}</code></div><p>{selected.description}</p></div>
    <p className="ig-note">graph.py의 전체 노드·연결을 표현한 설명용 시뮬레이션입니다. 상황별 가정 경로를 재생하며 실제 백엔드·AI는 실행하지 않습니다. 노드를 누르면 역할과 연결을 살펴볼 수 있습니다.</p>
  </div>
}
