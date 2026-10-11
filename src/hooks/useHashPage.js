import { useEffect, useRef, useState } from 'react'
import { navigationItems } from '../data/navigation.js'

function getPage() {
  const hash = window.location.hash.slice(1)
  if (hash === 'projects/truckworks') return 'truckworks'
  if (hash === 'projects/education') return 'education'
  if (hash === 'projects/interview') return 'interview'
  return navigationItems.some(page => page.id === hash) ? hash : 'resume'
}

export default function useHashPage() {
  const [page, setPage] = useState(getPage)
  const previousPage = useRef(page)
  const scrollPositions = useRef({})

  useEffect(() => {
    const changePage = () => {
      if (window.location.hash === '#content') return
      const nextPage = getPage()
      scrollPositions.current[previousPage.current] = window.scrollY
      previousPage.current = nextPage
      setPage(nextPage)
    }

    window.addEventListener('hashchange', changePage)
    return () => window.removeEventListener('hashchange', changePage)
  }, [])

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({
        top: page === 'projects' ? scrollPositions.current.projects || 0 : 0,
        behavior: 'instant',
      })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [page])

  return page
}

