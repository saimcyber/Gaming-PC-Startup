import { Link } from 'react-router-dom'

// shown on every page (except cart / checkout) when the saved cart has parts
// that changed since last time - removed, sold out or less stock
function CartChangedBanner({ count }) {
  return (
    <div className="container">
      <p className="notice notice-warning cart-changed" role="status">
        <strong>Your saved cart needs a look.</strong> {count} {count === 1 ? 'part has' : 'parts have'} changed
        since you added {count === 1 ? 'it' : 'them'} (sold out, less stock or no longer listed).{' '}
        <Link to="/cart">Review your cart</Link>
      </p>
    </div>
  )
}

export default CartChangedBanner
