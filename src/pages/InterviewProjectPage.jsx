import { useEffect, useRef, useState } from 'react'
import Arrow from '../components/common/Arrow.jsx'
import InterviewGraph from '../components/projects/InterviewGraph.jsx'
import interviewScreen from '../assets/interview-session.png'
import reportScreen from '../assets/interview-report.png'
import { interviewImplementation } from '../data/interviewImplementation.js'
import './EducationProjectPage.css'
import './InterviewProjectPage.css'

const repository = 'https://github.com/orgs/cen-interview/repositories'
const sections = [
  ['overview', '프로젝트 개요'], ['service', '서비스 화면'], ['architecture', '구현 구조'],
  ['experience', '질문 분기 체험'], ['comparison', '입력 재개 문제'], ['cases', '처리 사례'], ['reflection', '회고'],
]
const screens = [
  { label: '모의면접 진행', image: interviewScreen, description: 'AI 면접관과 음성으로 면접을 진행하는 서비스 화면입니다. 저는 인터뷰어 에이전트와 답변 평가에 따른 다음 질문 선택, 입력 대기·재개 흐름을 담당했습니다.' },
  { label: '평가 리포트', image: reportScreen, description: '면접 후 제공하는 리포트 중 코드 분석 결과 화면입니다. 프로젝트 전체의 서비스 화면이며, 화면 UI와 코드 분석·평가 기능 자체는 제 담당 범위에 포함되지 않습니다.' },
]
const qualities = [
  ['sufficient', '충분한 답변', 'complete_set', '답변이 충분하므로 현재 질문 세트를 마칩니다.'],
  ['bonus_available', '더 깊이 물어볼 답변', 'ask_follow_up', '답변을 더 깊이 확인할 후속 질문을 선택합니다.'],
  ['misconception', '개념 오해', 'ask_challenge', '오해한 부분을 확인하는 반박 질문을 선택합니다.'],
  ['confirm_positive', '긍정 확인 필요', 'ask_confirm_positive', '긍정 방향의 확인 질문을 선택합니다.'],
  ['confirm_negative', '부정 확인 필요', 'ask_confirm_negative', '부정 방향의 확인 질문을 선택합니다.'],
  ['trap_available', '함정 질문 가능', 'ask_trap', '평가 신호에 맞는 함정 질문을 선택합니다.'],
  ['off_topic', '주제 이탈', 'handle_off_topic', '파생 질문 제한보다 먼저 주제 이탈 처리로 보냅니다.'],
  ['unknown', '판단 어려움', 'complete_set', '판단이 어려운 경우 현재 질문 세트를 마칩니다.'],
]

function Section({ id, title, intro, children }) {
  return <section className="education-section" id={`interview-${id}`} aria-labelledby={`interview-heading-${id}`}>
    <h2 id={`interview-heading-${id}`} tabIndex={-1}>{title}</h2>
    <p className="education-section-intro">{intro}</p>{children}
  </section>
}

function Source({ name, title }) {
  const source = interviewImplementation[name]
  return <details className="education-source">
    <summary>{title}</summary>
    <p className="education-source-path">{source.file}:{source.line}</p>
    <pre><code>{source.code}</code></pre>
  </details>
}

function QuestionRouting() {
  const [quality, setQuality] = useState('bonus_available')
  const [derived, setDerived] = useState(0)
  const [challenged, setChallenged] = useState(false)
  const [asked, setAsked] = useState(1)
  const signal = qualities.find(item => item[0] === quality)
  let node = signal[2]
  let reason = signal[3]
  if (quality !== 'off_topic' && derived >= 2) {
    node = 'complete_set'
    reason = '파생 질문이 기본 상한인 2회에 도달했습니다. 평가 신호에 따른 추가 질문 대신 현재 세트를 마칩니다.'
  } else if (quality === 'misconception' && challenged) {
    node = 'complete_set'
    reason = '같은 질문 세트에서 이미 반박 질문을 사용했습니다. 반박을 반복하지 않고 세트를 마칩니다.'
  }
  const next = asked >= 10 ? 'final_report' : 'ask_main'
  const steps = ['답변 기록', 'Assessment 평가', node, ...(node === 'complete_set' ? [next] : ['질문 발화', '입력 대기'])]

  return <div className="education-lab">
    <p className="education-example-note">코드에 근거한 설명용 시뮬레이션입니다. 평가 신호를 직접 선택하며 실제 AI 평가·질문 생성·백엔드 실행은 하지 않습니다.</p>
    <fieldset className="interview-quality"><legend>Assessment가 반환했다고 가정할 평가 신호</legend>
      <div className="education-options">{qualities.map(([id, label]) => <button type="button" key={id} aria-pressed={quality === id} onClick={() => setQuality(id)}>{label}</button>)}</div>
    </fieldset>
    <div className="interview-state-controls">
      <label>현재 세트의 파생 질문 <strong>{derived}회 / 기본 상한 2회</strong>
        <input type="range" min="0" max="2" step="1" value={derived} onChange={event => setDerived(Number(event.target.value))} />
      </label>
      <label>진행한 기본 질문 <strong>{asked}개 / 기본 상한 10개</strong>
        <input type="range" min="1" max="10" step="1" value={asked} onChange={event => setAsked(Number(event.target.value))} />
      </label>
      <label className="interview-checkbox"><input type="checkbox" checked={challenged} onChange={event => setChallenged(event.target.checked)} /> 현재 세트에서 반박 질문을 이미 사용함</label>
    </div>
    <ol className="interview-route" aria-label="선택한 조건의 처리 흐름">{steps.map((step, index) => <li key={`${index}-${step}`} className={index === 2 ? 'is-selected' : ''}><span>{String(index + 1).padStart(2, '0')}</span>{step}</li>)}</ol>
    <div className="education-result is-allowed" aria-live="polite" aria-atomic="true">
      <strong>다음 처리: {node}</strong><p>{reason}</p>
      {node === 'complete_set' && <p>{asked >= 10 ? '기본 질문 10개를 진행했으므로 최종 리포트 단계로 이동합니다.' : '세트를 마친 뒤 다음 기본 질문으로 이동합니다.'}</p>}
    </div>
    <p className="education-case-footnote">상한은 SessionState의 기본값을 사용했습니다. 설정을 바꾸면 실제 면접의 질문 수가 달라질 수 있습니다.</p>
  </div>
}

function ResumeComparison() {
  const [version, setVersion] = useState('after')
  const [resumed, setResumed] = useState(false)
  const after = version === 'after'
  const steps = after ? ['질문 생성', '질문 기록', '발화 구성', '입력 대기 · interrupt'] : ['질문 생성 → 질문 기록 → 입력 대기 · interrupt']
  function chooseVersion(next) { setVersion(next); setResumed(false) }
  return <div className="education-comparison">
    <div className="education-options" role="group" aria-label="입력 대기 노드 분리 전후">
      <button type="button" aria-pressed={!after} onClick={() => chooseVersion('before')}>분리 전</button>
      <button type="button" aria-pressed={after} onClick={() => chooseVersion('after')}>분리 후</button>
    </div>
    <p className="education-comparison-request">질문을 전달한 뒤 사용자의 답변을 기다리다가 입력이 들어온 상황</p>
    <ol className={`interview-resume ${after ? '' : 'is-before'}`}>{steps.map((step, index) => <li key={step} className={resumed && (!after || index === steps.length - 1) ? 'is-replayed' : ''}>
      <span>{step}</span><small>{resumed ? !after || index === steps.length - 1 ? '재개 시 다시 실행되는 범위' : '이전 단계 유지' : '입력 도착 전'}</small>
    </li>)}</ol>
    <button className="interview-action" type="button" onClick={() => setResumed(current => !current)}>{resumed ? '입력 대기 상태로 되돌리기' : '답변이 도착하면 재개 범위 보기'}</button>
    <div className="education-step" aria-live="polite">
      <h3>{after ? '대기만 다시 실행하도록 노드를 분리했습니다' : '대기 노드 안의 질문 생성·기록도 다시 실행됐습니다'}</h3>
      <p>{after ? 'LangGraph는 interrupt가 있는 노드를 처음부터 다시 실행합니다. 질문 생성·기록과 발화 구성은 앞선 노드에서 마치고, wait_event는 입력을 기다린 뒤 이벤트를 상태에 반환하는 역할만 맡도록 구성했습니다.' : '질문 생성과 대기를 같은 노드에 두면, 답변을 받아 그래프를 재개할 때 그 노드의 앞부분도 다시 실행됩니다. 질문이 새로 생성되거나 기록이 중복되는 문제가 발생했습니다.'}</p>
    </div>
    <p className="education-example-note">포트폴리오의 문제 해결 설명과 현재 코드에 근거한 개념도입니다. 실행 로그나 변경 전 코드의 재현 화면은 아닙니다.</p>
  </div>
}

const cases = [
  ['후속 질문 가능', 'bonus_available · 파생 질문 0회', 'ask_follow_up', '답변을 더 깊이 확인하는 질문 선택'],
  ['파생 질문 상한', 'bonus_available · 파생 질문 2회', 'complete_set', '평가 신호보다 상한 조건을 먼저 적용'],
  ['반박 반복 방지', 'misconception · 반박 질문 사용 완료', 'complete_set', '같은 세트에서 반박 질문 반복 방지'],
  ['주제 이탈', 'off_topic · 파생 질문 2회', 'handle_off_topic', '주제 이탈 분기가 상한 검사보다 우선'],
  ['기본 질문 종료', '세트 종료 · asked_count = 10', 'final_report', '기본 질문 수가 기본 상한에 도달'],
  ['답변 재청취', 'replay_requested 이벤트', 'handle_replay', '질문을 다시 전달하는 경로 선택'],
  ['무응답 종료', 'no_response_timeout · action = end', 'final_report', '타임아웃 정책에 따라 면접 종료'],
  ['무응답 일시 대기', 'no_response_timeout · action = pause', 'compose_utterance', '종료 대신 안내 발화 경로 선택'],
]

export default function InterviewProjectPage() {
  const [activeSection, setActiveSection] = useState('overview')
  const [screen, setScreen] = useState(0)
  const dialog = useRef(null)
  const selectedScreen = screens[screen]

  useEffect(() => {
    let frame = null
    const update = () => {
      frame = null
      let current = 'overview'
      for (const [id] of sections) {
        const section = document.getElementById(`interview-${id}`)
        if (section && section.getBoundingClientRect().top <= 120) current = id
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = 'reflection'
      setActiveSection(current)
    }
    const schedule = () => { if (frame === null) frame = window.requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame !== null) window.cancelAnimationFrame(frame)
    }
  }, [])

  function jumpTo(id) {
    document.getElementById(`interview-${id}`)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
    document.getElementById(id === 'overview' ? 'interview-title' : `interview-heading-${id}`)?.focus({ preventScroll: true })
  }

  return <article className="education-detail interview-detail">
    <a className="education-back" href="#projects">← 프로젝트 목록</a>
    <header className="education-header" id="interview-overview">
      <p className="education-period">2026.06 - 07 · 4인 팀 프로젝트</p>
      <h1 id="interview-title" tabIndex={-1}>수강생을 위한<br className="education-title-break" /> AI 모의면접 서비스</h1>
      <p className="education-intro">답변에 따라 다음 질문을 선택하고, 사용자의 입력을 기다리며 면접을 이어가는 AI 인터뷰어를 구현했습니다.</p>
      <dl className="education-facts">
        <div><dt>서비스</dt><dd>AI 모의면접 진행 및 면접 평가 리포트 제공</dd></div>
        <div><dt>역할</dt><dd>AI 인터뷰어 에이전트와 LangGraph 면접 흐름 설계·구현</dd></div>
        <div><dt>기술</dt><dd>Python · LangGraph · LangChain · FastAPI · Pydantic · OpenAI API</dd></div>
      </dl>
      <a className="education-repository" href={repository} target="_blank" rel="noreferrer">GitHub 저장소 <Arrow /></a>
    </header>
    <nav className="education-toc" aria-label="모의면접 프로젝트 목차">
      <span className="education-toc-title">목차</span><div className="education-toc-links">
        {sections.map(([id, label]) => <button key={id} type="button" aria-current={activeSection === id ? 'location' : undefined} onClick={() => jumpTo(id)}>{label}</button>)}
      </div>
    </nav>
    <div className="education-body">
      <Section id="service" title="면접 진행부터 평가 리포트까지" intro="질문에 답하고, 답변에 맞는 후속 질문을 받은 뒤 평가 결과를 확인하는 서비스입니다.">
        <div className="education-options" role="group" aria-label="서비스 화면 선택">{screens.map((item, index) => <button type="button" key={item.label} aria-pressed={screen === index} onClick={() => setScreen(index)}>{item.label}</button>)}</div>
        <figure className="education-screen">
          <button type="button" className="education-screen-zoom" aria-label={`${selectedScreen.label} 화면 확대`} onClick={() => dialog.current?.showModal()}><img src={selectedScreen.image} alt={selectedScreen.label} /><span>화면 확대</span></button>
          <figcaption>{selectedScreen.description}</figcaption>
        </figure>
      </Section>
      <Section id="architecture" title="평가와 질문 생성 사이의 흐름을 맡았습니다" intro="Strategy는 질문 생성, Assessment는 답변 평가와 리포트를 맡습니다. 제가 구현한 Interviewer는 두 기능을 연결하고, 세션 상태에 따라 면접의 다음 행동을 결정합니다.">
        <InterviewGraph />
        <div className="interview-responsibilities">
          <div><span>연동 기능</span><h3>Strategy</h3><p>기본·후속 질문 생성</p></div>
          <div className="is-owned"><span>담당 범위</span><h3>Interviewer</h3><p>그래프 흐름 · 질문 분기<br />입력 대기·재개 · 종료 제어</p></div>
          <div><span>연동 기능</span><h3>Assessment</h3><p>답변 평가 · 최종 리포트</p></div>
        </div>
        <div className="education-node-detail"><h3>세션 상태를 다음 행동의 근거로 사용했습니다</h3><p>SessionState에 현재 질문, 대화 기록, 평가 신호, 기본·파생 질문 수와 반박 질문 사용 여부를 유지합니다. 답변 이벤트를 검사하고 기록한 뒤 평가를 요청하고, 반환된 신호와 상태를 조합해 다음 노드로 이동합니다.</p></div>
        <Source name="routing" title="평가 신호와 세션 상태에 따른 분기 코드" />
        <Source name="wait" title="입력 대기 노드 코드" />
        <Source name="completion" title="다음 기본 질문과 최종 리포트의 분기 코드" />
        <p className="education-example-note">현재 그래프는 InMemorySaver를 사용합니다. 체크포인트는 프로세스 메모리에 저장되므로 서버 재시작 이후의 세션 복구까지 보장하는 구성은 아닙니다.</p>
      </Section>
      <Section id="experience" title="같은 평가 신호라도 다음 질문은 달라집니다" intro="평가 결과만으로 질문을 선택하면 꼬리 질문이나 반박 질문이 반복될 수 있습니다. 현재 질문 세트의 진행 상태를 함께 보고 다음 경로를 결정했습니다.">
        <QuestionRouting />
      </Section>
      <Section id="comparison" title="답변을 받았는데 질문이 다시 생성됐습니다" intro="사용자 입력으로 그래프를 재개할 때, 질문 생성과 기록 로직까지 중복 실행되는 문제가 있었습니다. 입력 대기를 별도 노드로 분리해 재실행 범위를 줄였습니다.">
        <ResumeComparison />
        <dl className="education-explanation">
          <div><dt>원인</dt><dd>interrupt 이후의 재개는 해당 노드의 처음부터 실행됩니다. 질문 생성·기록처럼 다시 실행하면 안 되는 작업이 대기와 같은 노드에 들어 있었습니다.</dd></div>
          <div><dt>변경</dt><dd>질문 생성, 발화 구성, 입력 대기를 분리했습니다. wait_event에는 interrupt와 입력 이벤트 반환만 남겼습니다.</dd></div>
          <div><dt>배운 점</dt><dd>대화형 흐름에서는 기능별 책임뿐 아니라, 중단 후 다시 실행될 범위까지 고려해 노드를 나눠야 했습니다.</dd></div>
        </dl>
      </Section>
      <Section id="cases" title="질문 분기 외의 상황도 경로로 처리했습니다" intro="주제 이탈, 질문 반복 요청, 무응답과 종료 조건을 별도 경로로 다룹니다. 아래는 현재 백엔드 코드에서 읽을 수 있는 예상 동작입니다.">
        <div className="education-case-table" tabIndex={0} role="region" aria-label="코드 기반 처리 사례 표">
          <table><caption>코드에 근거한 처리 사례 · 예시이며 미실행</caption><thead><tr><th scope="col">상황</th><th scope="col">가정한 입력·상태</th><th scope="col">이동 노드</th><th scope="col">처리 의도</th></tr></thead>
            <tbody>{cases.map(([label, input, node, reason]) => <tr key={label}><th scope="row">{label}</th><td>{input}</td><td><code>{node}</code></td><td>{reason}</td></tr>)}</tbody>
          </table>
        </div>
        <p className="education-case-footnote">근거: workflow/routing.py의 route_quality, after_complete_set, route_event, after_handle_timeout. 실행 결과·성공률·성능 측정값을 의미하지 않습니다.</p>
      </Section>
      <Section id="reflection" title="대화가 이어지는 조건을 코드로 만들었습니다" intro="답변에 맞는 질문을 만드는 것과, 면접이 일관된 순서로 진행되도록 관리하는 것은 서로 다른 문제였습니다.">
        <div className="education-reflection">
          <div><h3>평가 신호와 진행 규칙을 함께 보기</h3><p>후속 질문이 가능하다는 신호가 와도 질문 상한과 반박 사용 여부를 먼저 고려해야 했습니다. 평가 결과를 그대로 다음 행동으로 쓰지 않고, 세션의 진행 조건과 함께 처리했습니다.</p></div>
          <div><h3>입력을 기다리는 지점을 분리하기</h3><p>중단·재개가 있는 그래프에서는 한 노드의 실행이 한 번으로 끝나지 않을 수 있습니다. 질문 생성과 기록을 입력 대기에서 분리하면서, 다시 실행해도 되는 작업의 범위를 명확히 했습니다.</p></div>
          <div><h3>다음으로 보완할 부분</h3><p>현재 메모리 기반 체크포인트를 영속 저장 방식으로 바꿔 재시작 이후 복구를 다루고 싶습니다. 중복 답변 이벤트와 재접속 상황에서도 질문 기록이 일관되게 유지되는지 확인하는 작업도 필요합니다. 이는 현재 구현된 성과가 아닌 후속 개선 방향입니다.</p></div>
        </div>
      </Section>
      <footer className="education-bottom"><a href="#projects">← 프로젝트 목록</a><a href={repository} target="_blank" rel="noreferrer">GitHub 저장소 <Arrow /></a></footer>
    </div>
    <dialog className="education-image-dialog" ref={dialog} aria-labelledby="interview-dialog-title" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close() }}>
      <div className="education-dialog-heading"><h2 id="interview-dialog-title">{selectedScreen.label}</h2><button type="button" onClick={() => dialog.current?.close()}>닫기</button></div><img src={selectedScreen.image} alt={selectedScreen.label} />
    </dialog>
  </article>
}
