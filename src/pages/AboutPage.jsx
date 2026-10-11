import { useRef, useState } from 'react'
import Arrow from '../components/common/Arrow.jsx'
import { studyLogUrl } from '../data/profile.js'
import profilePhoto from '../assets/profile.png'
import './AboutPage.css'

const branches = [
  { id: 'responsibility', label: '군 복무 경험', category: '일하는 태도', color: '#315d49', x: 200, y: 135, keywords: ['책임감', '원인 파악', '마무리'], title: '정보통신 부사관으로 7년간 근무했습니다.', text: '2017년부터 2024년까지 육군 정보통신 부사관으로 근무했습니다. 개발할 때도 맡은 기능에 문제가 생기면 원인을 파악하고, 수정이 다른 기능에 어떤 영향을 주는지 살펴보려 합니다.', evidence: '2017.12 - 2024.12 · 육군 정보통신 부사관' },
  { id: 'collaboration', label: '팀 프로젝트', category: '협업', color: '#426957', x: 200, y: 360, keywords: ['의견 공유', '다른 가능성', '팀의 결정'], title: '구현 방법을 정할 때 팀원과 의견을 나눕니다.', text: '학습관리 플랫폼과 모의면접 서비스를 각각 4인 팀으로 개발했습니다. 중요한 구현 방법을 정할 때는 제가 생각한 방법과 장단점을 설명하고, 팀원의 의견을 듣고 결정하려 합니다.', evidence: '4인 팀 프로젝트 · 학습관리 플랫폼 / 모의면접 서비스' },
  { id: 'learning', label: '개발 공부', category: '학습', color: '#806540', x: 200, y: 585, keywords: ['컴퓨터과학', '두 차례 교육', '프로젝트'], title: '웹 개발을 공부한 뒤 AI 서비스 개발을 배웠습니다.', text: '한국방송통신대학교 컴퓨터과학과를 졸업했습니다. 2025년에는 Full Stack 개발 교육을, 2026년에는 GenAI 서비스 개발 교육을 받으며 팀 프로젝트를 진행했습니다. 공부한 내용은 Notion에 정리하고 있습니다.', evidence: '한국방송통신대학교 컴퓨터과학과 졸업 · Full Stack / GenAI 교육', link: studyLogUrl, linkLabel: '학습 기록 보기', external: true },
  { id: 'web', label: '웹 백엔드', category: '웹 개발', color: '#4b6577', x: 1000, y: 135, keywords: ['Java', 'Spring', '인증·인가'], title: 'Java와 Spring으로 웹 서비스를 구현합니다.', text: 'Java와 Spring을 사용해 웹 서비스를 개발했습니다. 학습관리 플랫폼에서는 인증·인가와 챗봇 입력 가드레일을 맡았습니다. 챗봇을 호출하기 전에 요청을 검사하고, 정책에 따라 허용하거나 차단하도록 구현했습니다.', evidence: '중학교 AI 문제 생성 및 학습관리 플랫폼 · 인증·인가 / 가드레일', link: '#projects/education', linkLabel: '프로젝트 살펴보기' },
  { id: 'ai', label: 'AI 기능 개발', category: 'AI 서비스', color: '#315d49', x: 1000, y: 360, keywords: ['Python', 'RAG', 'LangGraph'], title: '챗봇 요청 검사와 모의면접 진행을 구현했습니다.', text: '학습 챗봇에서는 AI가 인용한 정책이 실제 검색 결과에 있는지 서버에서 검사했습니다. 모의면접에서는 답변 평가와 질문 횟수에 따라 다음 질문을 선택하고, 사용자 답변을 기다렸다가 면접을 이어가도록 구현했습니다.', evidence: 'RAG 기반 가드레일 · LangGraph 인터뷰어 에이전트', link: '#projects/interview', linkLabel: '모의면접 프로젝트 보기' },
  { id: 'direction', label: '앞으로의 공부', category: '성장 방향', color: '#426957', x: 1000, y: 585, keywords: ['기술의 장단점', '업무 도메인', '서비스 기획'], title: '사용한 기술의 동작 방식을 더 공부하고 싶습니다.', text: '사용한 기술의 동작 방식과 장단점을 더 공부하고, 구현 방법을 선택한 이유를 설명할 수 있고 싶습니다. 개발하는 서비스가 어떤 업무에 쓰이는지도 함께 알아가려 합니다.', evidence: '학습 관심사 · 시스템 구조와 업무 도메인' },
]

export default function AboutPage() {
  const [selectedId, setSelectedId] = useState(null)
  const viewport = useRef(null)
  const selected = branches.find(branch => branch.id === selectedId)
  const focused = Boolean(selected)
  const root = focused ? { x: 276, y: 420 } : { x: 600, y: 360 }
  const positioned = branches.map((branch, index) => ({ ...branch, mapX: focused ? 100 + index * 200 : branch.x, mapY: focused ? 95 : branch.y }))

  function selectBranch(id) {
    setSelectedId(id)
    window.requestAnimationFrame(() => {
      const element = viewport.current
      if (window.matchMedia('(max-width: 760px)').matches) {
        document.getElementById('about-branch-detail')?.scrollIntoView({ block: 'nearest', behavior: 'instant' })
      } else if (element && element.scrollWidth > element.clientWidth) {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        element.scrollTo({ left: Math.max(0, element.scrollWidth * .68 - element.clientWidth / 2), behavior: reduceMotion ? 'instant' : 'smooth' })
      }
    })
  }
  function resetMap() {
    setSelectedId(null)
    viewport.current?.scrollTo({ left: 0, behavior: 'instant' })
  }

  return <section className="about-screen" aria-label="이동규 소개">
    <header className="about-intro"><span className="eyebrow">ABOUT / LEE DONG GUE</span><h1>안녕하세요.<br />개발자 이동규입니다.</h1><p>정보통신 부사관으로 근무한 뒤 웹과 AI 개발을 공부했습니다.<br />아래 항목을 누르면 경력과 개발 경험을 볼 수 있습니다.</p></header>
    <div className={`about-map-shell ${focused ? 'is-focused' : ''}`}>
      <div className="about-map-top"><span><i />ABOUT ME</span><div><span>{focused ? '다른 항목을 누르면 내용이 바뀝니다' : '항목을 눌러 자세히 보기'}</span>{focused && <button type="button" onClick={resetMap}>전체 보기 ↗</button>}</div></div>
      <div className="about-map-scroll" ref={viewport} tabIndex={0} role="region" aria-label="소개 항목 선택 영역. 항목을 선택하면 상세 내용을 읽을 수 있습니다.">
        <div className="about-map">
          <svg className="about-map-lines" viewBox="0 0 1200 720" aria-hidden="true">
            <g className="about-orbits" transform={`translate(${root.x}, ${root.y})`}><circle className="about-orbit" r="168" /><circle className="about-orbit is-inner" r="137" /></g>
            {positioned.map(branch => {
              const left = branch.mapX < root.x
              const startX = focused ? root.x : root.x + (left ? -110 : 110)
              const startY = focused ? root.y - 110 : root.y
              const endX = focused ? branch.mapX : branch.mapX + (left ? 125 : -125)
              const endY = focused ? 145 : branch.mapY
              const bendX = left ? 420 : 780
              const path = focused
                ? `M ${startX} ${startY} C ${startX} 220, ${endX} 230, ${endX} ${endY}`
                : `M ${startX} ${startY} C ${bendX} ${startY}, ${bendX} ${endY}, ${endX} ${endY}`
              return <g key={branch.id} className={`about-map-connection ${selectedId === branch.id ? 'is-selected' : ''}`} style={{ '--branch-color': branch.color }}><path d={path} /><circle cx={endX} cy={endY} r="4" /></g>
            })}
            {selected && <path className="about-detail-connection" style={{ '--branch-color': selected.color }} d={`M ${positioned.find(branch => branch.id === selected.id).mapX} 145 V 180 Q 820 180 820 215`} />}
          </svg>
          <div className="about-map-root" style={{ left: `${root.x / 12}%`, top: `${root.y / 7.2}%` }}><img src={profilePhoto} alt="이동규 프로필 사진" /><span className="about-photo-ring" /></div>
          {focused && <div className="about-photo-caption"><strong>이동규</strong><span>Java · Spring · Python · AI</span></div>}
          {positioned.map((branch, index) => <button key={branch.id} type="button" className={`about-map-branch ${selectedId === branch.id ? 'is-selected' : ''}`} style={{ left: `${branch.mapX / 12}%`, top: `${branch.mapY / 7.2}%`, '--branch-color': branch.color }} aria-expanded={selectedId === branch.id} aria-controls="about-branch-detail" onClick={() => selectBranch(branch.id)}><span className="about-branch-meta"><span>{branch.category}</span><span>0{index + 1}</span></span><strong>{branch.label}</strong><span className="about-branch-keywords">{branch.keywords.map(keyword => <span key={keyword}>{keyword}</span>)}</span><span className="about-branch-open"><Arrow /></span></button>)}
          {selected && <article className="about-branch-detail" id="about-branch-detail" key={selected.id} style={{ '--branch-color': selected.color }} aria-live="polite" aria-atomic="true">
            <div className="about-detail-heading"><span>{selected.category}</span><button type="button" onClick={resetMap} aria-label="상세 소개 닫기">×</button></div>
            <h2>{selected.title}</h2><div className="about-detail-keywords">{selected.keywords.map(keyword => <span key={keyword}>{keyword}</span>)}</div>
            <p>{selected.text}</p><div className="about-detail-evidence">{selected.evidence}</div>
            {selected.link && <a href={selected.link} target={selected.external ? '_blank' : undefined} rel={selected.external ? 'noreferrer' : undefined}>{selected.linkLabel}<Arrow diagonal={selected.external} /></a>}
          </article>}
        </div>
      </div>
      <div className="about-map-bottom"><span>태도 · 협업 · 학습 · 웹 개발 · AI · 성장 방향</span><span>{focused ? `${branches.findIndex(branch => branch.id === selectedId) + 1} / 6` : '소개 항목 6개'}</span></div>
    </div>
  </section>
}


