import { useState } from 'react'
import './GuardrailPreview.css'

export default function GuardrailPreview() {
  const [stage, setStage] = useState('solve')
  const allowed = stage === 'explain'
  return (
    <div className="lab-card">
      <div className="lab-heading"><span className="lab-symbol">✳</span><span>작동 원리 들여다보기</span><span className="lab-label">INTERACTIVE</span></div>
      <div className="lab-body">
        <div className="lab-title"><span className="eyebrow">CONTEXT-AWARE GUARDRAIL</span><h2>같은 질문, 다른 판단.</h2><p>학습 단계를 바꿔 처리 흐름을 살펴보세요.</p></div>
        <div className="stage-control" role="group" aria-label="학습 단계 선택">
          <button type="button" aria-pressed={!allowed} onClick={() => setStage('solve')}>01 문제 풀이 중</button>
          <button type="button" aria-pressed={allowed} onClick={() => setStage('explain')}>02 해설 확인 중</button>
        </div>
        <div className="request"><span className="request-icon">↳</span><div><span>사용자 요청</span><p>“정답과 전체 풀이를 알려줘”</p></div></div>
        <div className="flow-line" aria-hidden="true" />
        <div className="policy-node"><div className="node-icon">⌘</div><div><strong>현재 단계의 정책 검색</strong><span>공통 정책 + {allowed ? '해설' : '풀이'} 정책 · pgvector</span></div><span className="node-check">✓</span></div>
        <div className="flow-line" aria-hidden="true" />
        <div className="policy-node"><div className="node-icon">◇</div><div><strong>판정 근거를 서버에서 검사</strong><span>정책 ID와 허용·차단 속성 확인</span></div><span className="node-check">✓</span></div>
        <div className="flow-line" aria-hidden="true" />
        <div className={`decision ${allowed ? 'allowed' : ''}`} aria-live="polite"><span className="decision-icon">{allowed ? '✓' : '↪'}</span><div><strong>{allowed ? '허용 · 학습 챗봇 호출' : '차단 · 학습 안내 반환'}</strong><p>{allowed ? '해설 단계에서는 정답과 풀이 설명을 허용합니다.' : '풀이 단계에서는 정답 대신 학습 안내를 제공합니다.'}</p></div></div>
      </div>
      <div className="lab-footer"><span className="status-dot" />프로젝트 설계에 기반한 흐름 예시<span>실제 AI 호출 없음</span></div>
    </div>
  )
}
