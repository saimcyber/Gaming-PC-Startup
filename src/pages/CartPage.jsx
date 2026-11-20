import { Link } from 'react-router-dom'
import CartLine from '../components/CartLine.jsx'
import LoadStatus from '../components/LoadStatus.jsx'
import usePageTitle from '../hooks/usePageTitle.js'
import { getCartLines, getCartSummary, getCartProblems } from '../utils/cartHelpers.js'
import { formatPrice } from '../utils/format.js'
import { FREE_DELIVERY_FROM } from '../rules/deliveryRule.js'

function CartPage({ products, status, errorMessage, onRetry, cart, onUpdateQty, onRemove }) {
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

  return (
    <div className="container page">
      <h1>Your cart</h1>

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
          </dl>
          <p className="panel-hint">
            Delivery fee is added at checkout (pickup is free, delivery is free from{' '}
            {formatPrice(FREE_DELIVERY_FROM)}).
          </p>

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
