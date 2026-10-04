import Arrow from '../common/Arrow.jsx'
import './ProjectCard.css'

export default function ProjectCard({ project, isExpanded, onToggle }) {
  return (
            <article className={`project-card project-${project.id}`} key={project.id}>
              <div className="project-topline"><span>{project.number}<span className="project-kind">{project.kind}</span></span><span>{project.period}</span></div>
              <div className="project-diagram" aria-hidden="true">{project.id === 'interview' ? <><span>질문 생성</span><i>→</i><span className="diagram-accent">입력 대기</span><i>→</i><span>답변 평가</span><span className="diagram-loop">↳ 상태에 따라 다음 질문으로</span></> : <><span>사용자 요청</span><i>→</i><span className="diagram-accent">정책 검색</span><i>→</i><span>서버 검사</span><span className="diagram-loop">↳ 학습 단계에 따라 허용 / 차단</span></>}</div>
              <h3>{project.title}</h3><p className="project-description">{project.description}</p><div className="project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
              <div className="project-bottom"><button type="button" aria-expanded={isExpanded} aria-controls={`details-${project.id}`} onClick={onToggle}>문제 해결 과정 {isExpanded ? '−' : '+'}</button><a href={project.url} target="_blank" rel="noreferrer">GitHub <Arrow diagonal /></a></div>
              <div className="project-details" id={`details-${project.id}`} hidden={!isExpanded}><span>{project.role}</span><h4>마주한 문제</h4><p>{project.problem}</p><h4>해결한 방법</h4><p>{project.solution}</p></div>
            </article>
  )
}
