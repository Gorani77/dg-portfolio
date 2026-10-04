import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import HomePage from './pages/HomePage.jsx'
import ProjectsPage from './pages/ProjectsPage.jsx'
import EducationProjectPage from './pages/EducationProjectPage.jsx'
import InterviewProjectPage from './pages/InterviewProjectPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import useHashPage from './hooks/useHashPage.js'
import './App.css'

export default function App() {
  const page = useHashPage()

  return (
    <>
      <a className="skip-link" href="#content">본문으로 이동</a>
      <Navbar activePage={['education', 'interview'].includes(page) ? 'projects' : page} />
      <main id="content" tabIndex={-1}>
        {page === 'home' && <HomePage />}
        {page === 'projects' && <ProjectsPage />}
        {page === 'education' && <EducationProjectPage />}
        {page === 'interview' && <InterviewProjectPage />}
        {page === 'about' && <AboutPage />}
      </main>
      <Footer />
    </>
  )
}
