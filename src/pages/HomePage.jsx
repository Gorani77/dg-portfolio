import Arrow from '../components/common/Arrow.jsx'
import { profileProjects } from '../data/projects.js'
import { studyLogUrl } from '../data/profile.js'
import profilePhoto from '../assets/profile.png'
import resumeUrl from '../assets/resume.pdf?url'
import './HomePage.css'

export default function HomePage() {
  return (
    <section className="profile-screen" aria-labelledby="profile-title">
      <div className="profile-identity">
        <span className="eyebrow">PROFILE / LEE DONG GUE</span>
        <div className="profile-heading">
          <img className="profile-photo" src={profilePhoto} alt="이동규 프로필 사진" width="376" height="515" />
          <div>
            <h1 id="profile-title">이동규<span className="title-dot">.</span></h1>
          </div>
        </div>
        <p className="profile-motto">AI를 활용하되,<br />결과에 <span>책임지는 개발자</span></p>
        <p className="profile-summary">Java와 Spring 기반 웹 개발부터 Python, RAG, AI Agent를 활용한 AI 서비스 개발까지 경험했습니다.</p>
        <dl className="identity-details">
          <div><dt>Birth</dt><dd>1996. 11. 26</dd></div>
          <div><dt>Contact</dt><dd><a href="mailto:sp2877@naver.com">sp2877@naver.com <Arrow diagonal /></a><a href="tel:01030831285">010-3083-1285</a></dd></div>
          <div><dt>Study Log</dt><dd><a href={studyLogUrl} target="_blank" rel="noreferrer">Notion 학습 기록 <Arrow diagonal /></a></dd></div>
        </dl>
        <div className="profile-actions">
          <a className="primary-button" href="#projects">프로젝트 살펴보기 <Arrow /></a>
          <a className="resume-download" href={resumeUrl} download="이동규_이력서.pdf">이력서 다운로드 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M5 17v4h14v-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
        </div>
      </div>
      <div className="profile-information">
        <div className="profile-info-grid">
          <section className="profile-block"><h2>Education<span>학력</span></h2><p>한국방송통신대학교</p><span className="detail-text">컴퓨터과학과 졸업</span></section>
          <section className="profile-block"><h2>Career<span>경력</span></h2><span className="period">2017.12 — 2024.12</span><p>육군 정보통신 부사관</p></section>
          <section className="profile-block training-block"><h2>Training<span>교육</span></h2><div className="training-row"><span className="period">2026.03 — 2026.09</span><p>GenAI 기반 인공지능 서비스 개발과정</p></div><div className="training-row"><span className="period">2025.03 — 2025.09</span><p>MSA 기반 Full Stack 개발 전문가 양성과정</p></div></section>
          <section className="profile-block"><h2>Skills<span>기술</span></h2><div className="skill-list">{['Java', 'Spring', 'Python', 'RAG', 'LangGraph', 'AI Agent'].map(skill => <span key={skill}>{skill}</span>)}</div></section>
          <section className="profile-block"><h2>Certifications<span>자격</span></h2><p>정보처리기사</p><p className="second-line">SQLD</p></section>
        </div>
        <section className="profile-projects"><div className="profile-projects-heading"><h2>Project<span>프로젝트 경험</span></h2><a href="#projects">자세히 보기 <Arrow /></a></div><div>{profileProjects.map(project => <a className="profile-project-row" href={project.detailUrl || project.url} target={project.detailUrl ? undefined : '_blank'} rel={project.detailUrl ? undefined : 'noreferrer'} key={project.url}><span>{project.year}</span><strong>{project.title}</strong><span className="profile-project-action">{!project.detailUrl && <span>GitHub로 이동</span>}<Arrow diagonal={!project.detailUrl} /></span></a>)}</div></section>
      </div>
    </section>
  )
}
