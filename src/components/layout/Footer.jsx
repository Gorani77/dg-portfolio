import Arrow from '../common/Arrow.jsx'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-invitation">
        <p>궁금한 점이 있다면<br />메일로 연락해 주세요.</p>
        <a href="mailto:sp2877@naver.com">sp2877@naver.com <Arrow diagonal /></a>
      </div>
      <div className="footer-colophon">
        <span>© {new Date().getFullYear()} 이동규</span>
        <span>이동규 · AI 서비스 개발</span>
        <a href="#resume">처음으로 <Arrow /></a>
      </div>
    </footer>
  )
}
