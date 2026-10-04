import Arrow from '../common/Arrow.jsx'
import './Footer.css'

export default function Footer() {
  return (
    <footer>
      <span>© {new Date().getFullYear()} 이동규</span>
      <span>AI를 활용하되, 결과에 책임지는 개발자</span>
      <a href="mailto:sp2877@naver.com">연락하기 <Arrow diagonal /></a>
    </footer>
  )
}
