import { useState } from 'react'
import Arrow from '../common/Arrow.jsx'
import './ProjectListItem.css'

export default function ProjectListItem({ project }) {
  const thumbnailSlides = project.slides
  const [slide, setSlide] = useState(0)
  const thumbnailId = `project-thumbnail-${project.id}`

  function changeSlide(direction) {
    setSlide(current => (current + direction + thumbnailSlides.length) % thumbnailSlides.length)
  }

  return (
    <article className="project-list-item" aria-labelledby={`project-title-${project.id}`}>
      <div className="project-list-thumbnail" role="group" aria-roledescription="슬라이드" aria-label="프로젝트 서비스 화면">
        <div className="project-thumbnail-viewport" id={thumbnailId}>
          <div className="project-thumbnail-track" style={{ transform: `translateX(-${slide * 100}%)` }}>
            {thumbnailSlides.map((item, index) => (
              <div className="project-thumbnail-slide" key={item.label} aria-hidden={slide !== index}>
                <img src={item.image} alt={item.label} />
              </div>
            ))}
          </div>
          <div className="project-thumbnail-controls">
          <button className="project-thumbnail-previous" type="button" aria-label="이전 서비스 화면" aria-controls={thumbnailId} onClick={() => changeSlide(-1)}><Arrow /></button>
          <button type="button" aria-label="다음 서비스 화면" aria-controls={thumbnailId} onClick={() => changeSlide(1)}><Arrow /></button>
          </div>
        </div>
      </div>
      <div className="project-list-content">
        <div className="project-list-meta"><span>{project.period}</span><span>{project.team}</span></div>
        <h3 id={`project-title-${project.id}`}>
          {project.detailUrl
            ? <a className="project-list-main-link" href={project.detailUrl}>{project.title}</a>
            : project.title}
        </h3>
        <p className="project-list-description">{project.description}</p>
        <div className="project-list-contribution">
          <span className="project-list-role-label">담당 역할</span>
          <p>{project.role}</p>
        </div>
        <div className="project-list-footer">
          <ul className="project-list-tech" aria-label="주요 사용 기술">
            {project.tags.map(tech => <li key={tech}>{tech}</li>)}
          </ul>
          <span className="project-list-detail">프로젝트 자세히 보기 <Arrow /></span>
        </div>
      </div>
    </article>
  )
}
