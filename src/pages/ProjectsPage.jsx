import ProjectListItem from '../components/projects/ProjectListItem.jsx'
import { projectList } from '../data/projectList.js'
import './ProjectsPage.css'

export default function ProjectsPage() {
  return (
    <>
        <section className="projects-section" id="projects" aria-label="프로젝트 목록">
          <ul className="project-list">
            {projectList.map(project => <li key={project.id}><ProjectListItem project={project} /></li>)}
          </ul>
        </section>


    </>
  )
}
