import { Link } from 'react-router-dom'
import CartLine from '../components/CartLine.jsx'
import LoadStatus from '../components/LoadStatus.jsx'
import usePageTitle from '../hooks/usePageTitle.js'
import { getCartLines, getCartSummary, getCartProblems, planCartFixes } from '../utils/cartHelpers.js'
import { formatPrice } from '../utils/format.js'
import { FREE_DELIVERY_FROM, amountToFreeDelivery } from '../rules/deliveryRule.js'
import deliveryAreas from '../data/deliveryAreas.js'

function CartPage({ products, status, errorMessage, onRetry, cart, onUpdateQty, onRemove, onFixAll }) {
  usePageTitle('Your cart')

  if (status !== 'ready') {
    return (
      <div className="container page">
        <h1>Your cart</h1>
        <LoadStatus status={status} errorMessage={errorMessage} onRetry={onRetry} />
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="container page">
        <h1>Your cart</h1>
        <div className="status-box">
          <h2>Your cart is empty</h2>
          <p>Browse the parts list and add what you need for your build.</p>
          <Link to="/products" className="btn btn-primary">
            Browse parts
          </Link>
        </div>
      </div>
    )
  }

  const lines = getCartLines(cart, products)
  const { itemCount, subtotal } = getCartSummary(lines)
  const problems = getCartProblems(lines)
  const fixes = planCartFixes(lines)
  const stillNeeded = amountToFreeDelivery(subtotal)

  // cheapest and dearest delivery fee, so the summary can show the range
  const fees = deliveryAreas.filter((area) => area.served).map((area) => area.fee)
  const lowestFee = Math.min(...fees)
  const highestFee = Math.max(...fees)

  return (
    <div className="container page">
      <h1>Your cart</h1>

      {fixes.length > 0 && (
        <section className="cart-fixes" aria-labelledby="fixes-heading">
          <h2 id="fixes-heading">Some parts changed since you added them</h2>
          <p>Our stock list was updated. To keep your order valid we suggest:</p>
          <ul>
            {fixes.map((fix) => (
              <li key={fix.id}>{fix.message}</li>
            ))}
          </ul>
          <button type="button" className="btn btn-primary" onClick={onFixAll}>
            Fix all {fixes.length} for me
          </button>{' '}
          <span className="muted">or fix them one by one below.</span>
        </section>
      )}

      <div className="cart-layout">
        <section aria-label="Items in your cart">
          <ul className="cart-lines">
            {lines.map((line) => (
              <CartLine key={line.id} line={line} onUpdateQty={onUpdateQty} onRemove={onRemove} />
            ))}
          </ul>
          <p>
            <Link to="/products">&larr; Keep shopping</Link>
          </p>
        </section>

        <aside className="summary-box" aria-labelledby="summary-heading">
          <h2 id="summary-heading">Summary</h2>
          <dl className="summary-list">
            <div>
              <dt>Items</dt>
              <dd>{itemCount}</dd>
            </div>
            <div>
              <dt>Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div>
              <dt>Delivery</dt>
              <dd>
                {stillNeeded === 0 ? 'Free' : `${formatPrice(lowestFee)} - ${formatPrice(highestFee)}`}
              </dd>
            </div>
          </dl>

          {stillNeeded === 0 ? (
            <p className="notice notice-success">
              Your order is {formatPrice(FREE_DELIVERY_FROM)} or more, so delivery is free.
            </p>
          ) : (
            <p className="notice notice-info">
              Add <strong>{formatPrice(stillNeeded)}</strong> more for free delivery. Until then the fee depends on
              your area (you pick it at checkout). Pickup from the shop is always free.
            </p>
          )}

          {problems.length > 0 ? (
            <div className="problem-box" role="alert">
              <p>
                <strong>Fix these before checkout:</strong>
              </p>
              <ul>
                {problems.map((problem) => (
                  <li key={problem}>{problem}</li>
                ))}
              </ul>
              <button type="button" className="btn btn-primary btn-block" disabled>
                Checkout
              </button>
            </div>
          ) : (
            <Link to="/checkout" className="btn btn-primary btn-block">
              Checkout
            </Link>
          )}
        </aside>
      </div>
    </div>
  )
}

export default CartPage
