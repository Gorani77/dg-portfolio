import Arrow from '../common/Arrow.jsx'
import { navigationItems } from '../../data/navigation.js'
import './Navbar.css'

export default function Navbar({ activePage }) {
  return (
    <header className="site-header">
      <a className="brand" href="#resume" aria-label="이동규 홈">
        <span className="brand-mark">dg<span>.</span></span>
        <span>
          이동규
          <span className="brand-caption">AI DEVELOPER</span>
        </span>
      </a>
      <nav aria-label="주요 메뉴">
        {navigationItems.map(item => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={activePage === item.id ? 'nav-active' : ''}
            aria-current={activePage === item.id ? 'page' : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <a className="header-contact" href="mailto:sp2877@naver.com">
        연락하기 <Arrow diagonal />
      </a>
    </header>
  )
}
