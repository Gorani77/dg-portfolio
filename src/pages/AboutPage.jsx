import { useRef, useState } from 'react'
import Arrow from '../components/common/Arrow.jsx'
import { studyLogUrl } from '../data/profile.js'
import profilePhoto from '../assets/profile.png'
import './AboutPage.css'

const branches = [
  { id: 'responsibility', label: '맡은 일의 끝까지', category: '일하는 태도', color: '#8970ad', x: 200, y: 135, keywords: ['책임감', '원인 파악', '마무리'], title: '문제의 원인을 찾고, 맡은 역할을 마무리합니다.', text: '육군 정보통신 부사관으로 근무하며 쌓은 책임감을 개발 프로젝트에서도 이어가고 있습니다. 동작을 구현하는 데서 끝내지 않고, 문제가 생긴 이유와 변경이 미치는 영향을 이해하려 합니다.', evidence: '2017.12 - 2024.12 · 육군 정보통신 부사관' },
  { id: 'collaboration', label: '함께 판단하기', category: '협업', color: '#608d80', x: 200, y: 360, keywords: ['의견 공유', '다른 가능성', '팀의 결정'], title: '중요한 결정은 팀원과 함께 살핍니다.', text: '프로젝트에서 중요한 선택을 할 때는 팀원의 의견을 먼저 확인합니다. 제가 생각한 방법의 장단점을 설명하고, 다른 가능성도 함께 살펴 팀이 이해할 수 있는 방향으로 판단하려 합니다.', evidence: '4인 팀 프로젝트 · 학습관리 플랫폼 / 모의면접 서비스' },
  { id: 'learning', label: '배움을 서비스로', category: '학습', color: '#ad8960', x: 200, y: 585, keywords: ['컴퓨터과학', '두 차례 교육', '프로젝트'], title: '배운 기술을 실제 서비스에 연결합니다.', text: '컴퓨터과학과 학습과 두 차례의 개발 교육을 통해 웹 개발부터 AI 서비스 개발까지 경험했습니다. 기술을 배우는 것과 함께 사용자에게 필요한 기능으로 구현하는 과정을 중요하게 생각합니다.', evidence: '한국방송통신대학교 컴퓨터과학과 졸업 · Full Stack / GenAI 교육', link: studyLogUrl, linkLabel: '학습 기록 보기', external: true },
  { id: 'web', label: '서비스의 기반 만들기', category: '웹 개발', color: '#668bad', x: 1000, y: 135, keywords: ['Java', 'Spring', '인증·인가'], title: 'Java와 Spring으로 웹 서비스를 구현합니다.', text: '웹 개발 프로젝트를 통해 서비스 기능과 백엔드 구조를 경험했습니다. 학습관리 플랫폼에서는 인증·인가와 학습 챗봇 요청에 적용하는 가드레일을 담당했습니다.', evidence: '중학교 AI 문제 생성 및 학습관리 플랫폼 · 인증·인가 / 가드레일', link: '#projects/education', linkLabel: '프로젝트 살펴보기' },
  { id: 'ai', label: 'AI의 흐름 설계하기', category: 'AI 서비스', color: '#8970ad', x: 1000, y: 360, keywords: ['Python', 'RAG', 'LangGraph'], title: 'AI의 결과를 서비스 규칙과 연결합니다.', text: '학습 챗봇에서는 검색된 정책과 AI 판정의 근거를 서버에서 검사했습니다. 모의면접에서는 평가 신호와 세션 상태에 따라 다음 질문을 선택하고, 사용자 입력을 기다리는 흐름을 구현했습니다.', evidence: 'RAG 기반 가드레일 · LangGraph 인터뷰어 에이전트', link: '#projects/interview', linkLabel: '모의면접 프로젝트 보기' },
  { id: 'direction', label: '구조를 이해하는 개발자', category: '성장 방향', color: '#608d80', x: 1000, y: 585, keywords: ['기술의 장단점', '업무 도메인', '서비스 기획'], title: '구현 방법을 이해하고, 선택의 이유를 설명하고 싶습니다.', text: '구조의 장단점을 이해하고 시스템에 맞는 방법을 선택하려 합니다. 기술과 업무 도메인을 함께 학습해, 서비스 기획에도 의견을 더할 수 있는 개발자로 성장하고 싶습니다.', evidence: '앞으로의 방향 · 안정적인 서비스 구현과 도메인 이해' },
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
      if (element && element.scrollWidth > element.clientWidth) {
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
    <div className={`about-map-shell ${focused ? 'is-focused' : ''}`}>
      <div className="about-map-top"><span><i />ABOUT ME</span><div><span>{focused ? '다른 가지를 눌러 내용을 바꿀 수 있습니다' : '가지를 눌러 펼쳐보세요'}</span>{focused && <button type="button" onClick={resetMap}>전체 지도 ↗</button>}</div></div>
      <div className="about-map-scroll" ref={viewport} tabIndex={0} role="region" aria-label="소개 마인드맵. 작은 화면에서는 지도 안에서 좌우로 스크롤할 수 있습니다.">
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
            <div className="about-detail-heading"><span>{selected.category}</span><button type="button" onClick={resetMap} aria-label="펼친 가지 닫기">×</button></div>
            <h2>{selected.title}</h2><div className="about-detail-keywords">{selected.keywords.map(keyword => <span key={keyword}>{keyword}</span>)}</div>
            <p>{selected.text}</p><div className="about-detail-evidence">{selected.evidence}</div>
            {selected.link && <a href={selected.link} target={selected.external ? '_blank' : undefined} rel={selected.external ? 'noreferrer' : undefined}>{selected.linkLabel}<Arrow diagonal={selected.external} /></a>}
          </article>}
        </div>
      </div>
      <div className="about-map-bottom"><span>태도 · 협업 · 학습 · 웹 개발 · AI · 성장 방향</span><span>{focused ? `${branches.findIndex(branch => branch.id === selectedId) + 1} / 6` : '6개의 가지'}</span></div>
    </div>
  </section>
}
