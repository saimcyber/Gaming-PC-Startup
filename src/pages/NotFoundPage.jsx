import { Link, useLocation } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle.js'

function NotFoundPage() {
  usePageTitle('Page not found')
  const location = useLocation()

  return (
    <div className="container page">
      <div className="status-box">
        <h1>Page not found</h1>
        <p>
          There is no page at <code>{location.pathname}</code>. The link might be old or mistyped.
        </p>
        <div className="button-row">
          <Link to="/products" className="btn btn-primary">
            Browse parts
          </Link>
          <Link to="/" className="btn btn-secondary">
            Go to home page
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
