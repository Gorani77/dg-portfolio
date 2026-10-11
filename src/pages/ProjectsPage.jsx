import ProjectListItem from '../components/projects/ProjectListItem.jsx'
import TruckWorksFeature from '../components/truckworks/TruckWorksFeature.jsx'
import { projectList } from '../data/projectList.js'
import './ProjectsPage.css'

export default function ProjectsPage() {
  return <>
    <TruckWorksFeature />
    <section className="projects-section" id="projects" aria-label="다른 프로젝트 목록">
      <div className="tw-other-projects-heading"><span>팀 프로젝트</span><h1>다른 프로젝트</h1><p>학습관리 플랫폼과 AI 모의면접 서비스입니다.<br />각 프로젝트에서 맡은 기능과 개발 중 해결한 문제를 정리했습니다.</p></div>
      <ul className="project-list">
        {projectList.map(project => <li key={project.id}><ProjectListItem project={project} /></li>)}
      </ul>
    </section>
  </>
}
