import { Link, NavLink } from 'react-router-dom'

function Header() {
  return (
    <header className="site-header">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div className="container header-inner">
        <Link to="/" className="logo">
          Hostel<span>Rig</span>
        </Link>

        <nav aria-label="Main">
          <ul className="nav-links">
            <li>
              <NavLink to="/" end>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/products">Parts</NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
