import { useEffect, useRef, useState } from 'react'
import Arrow from '../components/common/Arrow.jsx'
import GuardrailExperience from '../components/projects/GuardrailExperience.jsx'
import studentScreen from '../assets/education-solve.png'
import reviewScreen from '../assets/education-review.png'
import teacherScreen from '../assets/education-X7.png'
import { educationImplementation } from '../data/educationImplementation.js'
import './EducationProjectPage.css'

const repository = 'https://github.com/orgs/cen-edu/repositories'
const sections = [
  ['overview', '프로젝트 개요'],
  ['service', '서비스 화면'], ['experience', '가드레일 체험'],
  ['comparison', '문제 해결'], ['architecture', '구현 구조'], ['cases', '처리 사례'], ['reflection', '회고'],
]
const screens = {
  teacher: { label: '교사: 문제 생성 결과', image: teacherScreen, description: '생성된 수학 문제와 선택지, 개념 설명을 확인하는 화면입니다. 프로젝트 전체의 서비스 화면으로, 문제 생성 기능은 제 담당 범위에 포함되지 않습니다.' },
  student: { label: '학생: 풀이와 챗봇', image: studentScreen, description: '문제를 풀면서 학습 도우미에 질문하는 화면입니다. 저는 챗봇 요청에 적용할 정책을 검색하고 허용·차단을 처리하는 가드레일을 담당했습니다.' },
  review: { label: '학생: 해설과 챗봇', image: reviewScreen, description: '정답과 풀이 해설을 확인하고, 이해되지 않는 부분을 학습 도우미에 질문하는 화면입니다. 해설 단계에서는 정답과 전체 풀이 설명을 허용하는 정책을 적용했습니다.' },
}
function SearchComparison() {
  const [version, setVersion] = useState('after')
  const after = version === 'after'
  return (
    <div className="education-comparison">
      <div className="education-options" role="group" aria-label="정책 검색 수정 전후 비교">
        <button type="button" aria-pressed={!after} onClick={() => setVersion('before')}>수정 전</button>
        <button type="button" aria-pressed={after} onClick={() => setVersion('after')}>수정 후</button>
      </div>
      <p className="education-comparison-request">풀이 단계에서 “정답과 전체 풀이를 알려줘”라고 요청한 상황</p>
      <div className="education-policy-list" aria-live="polite">
        <div><span>공통 정책</span><strong>검색 후보에 포함</strong></div>
        <div><span>풀이 정책: 정답 제공 차단</span><strong>검색 후보에 포함</strong></div>
        <div className={after ? 'is-excluded' : 'is-conflicting'}><span>해설 정책: 전체 풀이 허용</span><strong>{after ? '검색 후보에서 제외' : '검색 후보에 함께 포함'}</strong></div>
      </div>
      <p className="education-comparison-outcome">{after ? '서버가 지정한 단계로 후보 범위를 제한한 후 유사도 검색을 수행합니다.' : '단계 조건 없이 의미적 유사도만으로 검색해, 적용 조건이 다른 정책이 함께 검색될 수 있었습니다.'}</p>
      <p className="education-example-note">검색 범위를 설명하는 예시이며, 실제 검색 순위·점수·판정 결과를 재현한 로그는 아닙니다.</p>
    </div>
  )
}

const architecture = [
  { id: 'context', title: '공통 입력 검사', text: 'AgentDispatcher가 입력 가드레일을 순서대로 실행합니다. 하나라도 차단되면 AI_REQUEST_BLOCKED 예외를 반환하고, 학습 챗봇 에이전트는 호출하지 않습니다.' },
  { id: 'retrieval', title: '정책 검색', text: '정책 파일의 현재 버전과 임베딩 모델, COMMON·현재 단계 범위로 후보를 제한합니다. 각 범위에서 코사인 유사도로 상위 정책을 검색해 결과를 통합합니다. 범위별 top-k 기본값은 3입니다.' },
  { id: 'assessment', title: 'AI 정책 판정', text: 'decision(ALLOW·BLOCK·UNCERTAIN)과 policyIds를 구조화된 응답으로 받습니다. 최근 대화 최대 6개를 사용하고, 각 메시지를 최대 1,000 코드 포인트로 제한합니다.' },
  { id: 'server', title: '서버 검사와 분기', text: '정책 ID와 허용·차단 속성을 검사합니다. 허용이면 기존 챗봇을 호출하고, 차단·검사 실패·불확실 판정이면 안내를 반환합니다.' },
]

const processingCases = [
  { name: '풀이 중 정답 요청', input: 'SOLVE_CHAT / SOLVE-04 검색 / BLOCK 및 SOLVE-04 인용', result: '호출 중단', reason: 'POLICY_SOLVE-04' },
  { name: '해설에서 정답 요청', input: 'REVIEW_CHAT / REVIEW-01 검색 / ALLOW 및 REVIEW-01 인용', result: '학습 챗봇 호출', reason: '차단 사유 없음' },
  { name: '풀이 중 개념 질문', input: 'SOLVE_CHAT / SOLVE-01 검색 / ALLOW 및 SOLVE-01 인용', result: '학습 챗봇 호출', reason: '차단 사유 없음' },
  { name: '타인 성적 요청', input: 'COMMON-01 검색 / BLOCK 및 COMMON-01 인용', result: '호출 중단', reason: 'POLICY_COMMON-01' },
  { name: '검색에 없는 정책 인용', input: 'ALLOW 또는 BLOCK / 인용 ID가 검색 결과에 없음', result: '호출 중단', reason: 'POLICY_DECISION_UNAVAILABLE' },
  { name: '판정과 정책 속성 불일치', input: 'ALLOW 판정에 BLOCK 정책을 인용하거나 그 반대', result: '호출 중단', reason: 'POLICY_DECISION_UNAVAILABLE' },
  { name: '불확실 판정', input: 'AI 응답의 decision이 UNCERTAIN', result: '호출 중단', reason: 'POLICY_DECISION_UNAVAILABLE' },
  { name: '필수 검색 범위의 결과 없음', input: 'COMMON 또는 현재 단계의 검색 결과가 비어 있음', result: '호출 중단', reason: 'POLICY_DECISION_UNAVAILABLE' },
]

export default function EducationProjectPage() {
  const [activeSection, setActiveSection] = useState('overview')
  const [screen, setScreen] = useState('student')
  const [node, setNode] = useState('retrieval')
  const dialog = useRef(null)
  const currentScreen = screens[screen]
  const currentNode = architecture.find(item => item.id === node)
  const currentImplementation = educationImplementation[node]

  useEffect(() => {
    let frame = null

    const updateSection = () => {
      frame = null
      let current = 'overview'
      for (const [id] of sections) {
        const section = document.getElementById(`education-${id}`)
        if (section && section.getBoundingClientRect().top <= 120) current = id
      }
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
        current = 'reflection'
      }
      setActiveSection(current)
    }

    const scheduleUpdate = () => {
      if (frame === null) frame = window.requestAnimationFrame(updateSection)
    }

    scheduleUpdate()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      if (frame !== null) window.cancelAnimationFrame(frame)
    }
  }, [])

  function moveTo(id) {
    setActiveSection(id)
    document.getElementById(`education-${id}`)?.scrollIntoView({ behavior: 'instant', block: 'start' })
    document.getElementById(id === 'overview' ? 'education-title' : `education-heading-${id}`)?.focus({ preventScroll: true })
  }

  return (
    <article className="education-detail" aria-labelledby="education-title">
      <a className="education-back" href="#projects">← 프로젝트 목록</a>
      <header className="education-header" id="education-overview">
        <p className="education-period">2026.07 - 2026.08 / 4인 팀 프로젝트</p>
        <h1 id="education-title" tabIndex={-1}>중학교 AI 문제 생성 및<br className="education-title-break" /> 학습관리 플랫폼</h1>
        <p className="education-intro">교사는 AI로 수학 문제를 만들고, 학생은 문제를 풀며 학습 챗봇의 도움을 받는 서비스입니다.</p>
        <dl className="education-facts">
          <div><dt>담당</dt><dd>RAG 기반 학습 챗봇 가드레일 설계·구현, 인증·인가</dd></div>
          <div><dt>기술</dt><dd>Spring Boot, Spring Security, Spring AI, PostgreSQL, pgvector</dd></div>
        </dl>
        <a className="education-repository" href={repository} target="_blank" rel="noreferrer">프로젝트 GitHub <Arrow diagonal /></a>
      </header>

      <nav className="education-toc" aria-label="프로젝트 상세 목차">
        <p className="education-toc-title">목차</p>
        <div className="education-toc-links">
          {sections.map(([id, title]) => (
            <button type="button" key={id} aria-current={activeSection === id ? 'location' : undefined} onClick={() => moveTo(id)}>{title}</button>
          ))}
        </div>
      </nav>

      <div className="education-body">
      <section className="education-section" id="education-service" aria-labelledby="education-heading-service">
        <h2 id="education-heading-service" tabIndex={-1}>서비스 화면</h2>
        <p className="education-section-intro">교사 문제 생성, 학생 풀이, 해설 화면을 선택해 볼 수 있습니다.</p>
        <div className="education-options" role="group" aria-label="서비스 화면 선택">
          {Object.entries(screens).map(([id, item]) => <button type="button" key={id} aria-pressed={screen === id} onClick={() => setScreen(id)}>{item.label}</button>)}
        </div>
        <figure className="education-screen">
          <button className="education-screen-zoom" type="button" onClick={() => dialog.current.showModal()} aria-label={`${currentScreen.label} 이미지 확대`}>
            <img src={currentScreen.image} alt={currentScreen.label} /><span>화면 확대</span>
          </button>
          <figcaption>{currentScreen.description}</figcaption>
        </figure>
        <dialog ref={dialog} className="education-image-dialog" aria-labelledby="education-dialog-title" onClick={event => { if (event.target === event.currentTarget) dialog.current.close() }}>
          <div className="education-dialog-heading"><h2 id="education-dialog-title">{currentScreen.label}</h2><button type="button" onClick={() => dialog.current.close()} autoFocus>닫기</button></div>
          <img src={currentScreen.image} alt={currentScreen.label} />
        </dialog>
      </section>

      <section className="education-section" id="education-experience" aria-labelledby="education-heading-experience">
        <h2 id="education-heading-experience" tabIndex={-1}>풀이 중에는 정답 요청을 차단하고, 해설에서는 허용합니다</h2>
        <p className="education-section-intro">문제를 푸는 중에는 정답과 전체 풀이를 알려주지 않도록 했습니다. 해설 화면에서는 이를 허용합니다. 아래에서 같은 요청을 두고 학습 단계를 바꾸면 처리 차이를 볼 수 있습니다.</p>
        <GuardrailExperience />
      </section>

      <section className="education-section" id="education-comparison" aria-labelledby="education-heading-comparison">
        <h2 id="education-heading-comparison" tabIndex={-1}>다른 학습 단계의 정책이 함께 검색되는 문제</h2>
        <p className="education-section-intro">풀이 단계의 요청에 해설 단계에서만 적용되는 허용 정책이 함께 검색돼, 판정 근거에 충돌이 생겼습니다.</p>
        <SearchComparison />
        <dl className="education-explanation">
          <div><dt>원인</dt><dd>정책 검색 조건에 학습 단계를 포함하지 않아, 의미가 비슷한 다른 단계의 정책도 검색됐습니다.</dd></div>
          <div><dt>변경</dt><dd>서버가 지정한 학습 단계를 검색 조건에 반영했습니다. 공통 정책과 현재 단계 정책을 각각 검색한 뒤 결과를 통합했습니다.</dd></div>
          <div><dt>선택 이유</dt><dd>문장의 의미가 비슷해도 정책의 적용 조건은 다릅니다. AI에 판단을 맡기기 전에 검색 후보부터 적용 가능한 정책으로 제한해야 했습니다.</dd></div>
        </dl>
      </section>

      <section className="education-section" id="education-architecture" aria-labelledby="education-heading-architecture">
        <h2 id="education-heading-architecture" tabIndex={-1}>제가 구현한 가드레일의 구조</h2>
        <p className="education-section-intro">챗봇 호출 전에 입력 검사, 정책 검색, AI 판정, 서버 검사를 거칩니다. 각 단계를 누르면 제가 구현한 처리 내용과 관련 코드를 볼 수 있습니다.</p>
        <div className="education-architecture" role="group" aria-label="가드레일 구성 요소">
          {architecture.map((item, index) => <button type="button" key={item.id} aria-pressed={node === item.id} aria-controls="education-node-detail" onClick={() => setNode(item.id)}><span>{index + 1}</span>{item.title}</button>)}
        </div>
        <div id="education-node-detail" className="education-node-detail"><h3>{currentNode.title}</h3><p>{currentNode.text}</p></div>
        <details className="education-source" key={node}>
          <summary>관련 구현 코드 펼치기</summary>
          <p className="education-source-caption">학습관리 플랫폼 백엔드의 해당 구현 코드입니다.</p>
          <p className="education-source-path">{currentImplementation.file}:{currentImplementation.line}</p>
          <pre><code>{currentImplementation.code}</code></pre>
          {currentImplementation.sql && <>
            <p className="education-source-path">{currentImplementation.sqlFile}:{currentImplementation.sqlLine}</p>
            <pre><code>{currentImplementation.sql}</code></pre>
          </>}
        </details>
        <div className="education-integration"><span>검사를 통과한 허용 요청</span><Arrow /><strong>기존 학습 챗봇 호출</strong><span>차단·검사 실패·불확실 판정</span><Arrow /><strong>호출 중단 및 안내 반환</strong></div>
      </section>

      <section className="education-section" id="education-cases" aria-labelledby="education-heading-cases">
        <h2 id="education-heading-cases" tabIndex={-1}>요청과 AI 응답에 따른 처리 예시</h2>
        <p className="education-section-intro">아래 입력과 AI 응답을 가정했을 때 서버가 어떻게 처리하는지 정리했습니다. 실제 AI를 실행해 얻은 결과나 성능 측정 자료는 아닙니다.</p>
        <div className="education-case-table" tabIndex={0} role="region" aria-label="처리 사례 표, 좁은 화면에서는 가로로 스크롤할 수 있습니다">
          <table>
            <caption>정책 검색·AI 응답 조건에 따른 코드상 처리</caption>
            <thead><tr><th scope="col">사례</th><th scope="col">가정한 입력 조건</th><th scope="col">코드상 처리</th><th scope="col">가드레일 사유 코드</th></tr></thead>
            <tbody>{processingCases.map(item => <tr key={item.name}><th scope="row">{item.name}</th><td>{item.input}</td><td>{item.result}</td><td><code>{item.reason}</code></td></tr>)}</tbody>
          </table>
        </div>
        <p className="education-case-footnote">PolicyRagInputGuard·PolicyRetriever·chat-policies.txt의 분기와 정책을 기준으로 작성했습니다. 다른 입력 가드레일도 통과한다는 가정입니다. 차단된 요청은 AgentDispatcher에서 AI_REQUEST_BLOCKED로 처리되어 학습 챗봇 에이전트를 호출하지 않습니다.</p>
      </section>

      <section className="education-section" id="education-reflection" aria-labelledby="education-heading-reflection">
        <h2 id="education-heading-reflection" tabIndex={-1}>개발 회고</h2>
        <div className="education-reflection">
          <div><h3>검색 조건에 학습 단계를 추가한 이유</h3><p>정답 요청과 문장이 비슷하다는 이유로 검색하면, 풀이 단계에서도 해설용 허용 정책이 나왔습니다. 이 문제를 해결하면서 정책이 어느 단계에 적용되는지 검색 조건에 넣어야 한다는 점을 배웠습니다.</p></div>
          <div><h3>AI가 반환한 정책 ID를 검사한 이유</h3><p>AI가 허용이라고 답해도 인용한 정책이 검색 결과에 없거나 차단 정책이라면 그대로 처리할 수 없었습니다. 정책 ID와 허용·차단 속성을 서버에서 대조하고, 일치하지 않거나 판정이 불확실하면 챗봇을 호출하지 않도록 했습니다.</p></div>
        </div>
      </section>
      <footer className="education-bottom"><a href="#projects">← 프로젝트 목록으로 돌아가기</a><a href={repository} target="_blank" rel="noreferrer">GitHub <Arrow diagonal /></a></footer>
      </div>
    </article>
  )
}
