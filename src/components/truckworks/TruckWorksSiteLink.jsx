import Arrow from '../common/Arrow.jsx'
import { truckworks } from '../../data/truckworks.js'
import './TruckWorksSiteLink.css'

export default function TruckWorksSiteLink({ dark = false }) {
  return (
    <a
      className={`tw-site-link${dark ? ' tw-site-link-dark' : ''}`}
      href={truckworks.siteUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="TruckWorks 사이트로 이동 (새 탭)"
    >
      <span>사이트로 이동</span>
      <Arrow diagonal />
    </a>
  )
}
