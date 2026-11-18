import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// when you open a new page (not just change a filter) start at the top
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default ScrollToTop
