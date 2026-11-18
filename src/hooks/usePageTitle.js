import { useEffect } from 'react'

// sets the browser tab title for each page
export default function usePageTitle(title) {
  useEffect(() => {
    const oldTitle = document.title
    document.title = title ? `${title} | HostelRig` : 'HostelRig | PC parts for students'
    // put the old title back when the page goes away
    return () => {
      document.title = oldTitle
    }
  }, [title])
}
