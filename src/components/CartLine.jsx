import { Link } from 'react-router-dom'
import ProductImage from './ProductImage.jsx'
import { formatPrice } from '../utils/format.js'

// one row in the cart. line = { id, qty, product, check } from getCartLines
function CartLine({ line, onUpdateQty, onRemove }) {
  const { id, qty, product, check } = line

  // part was removed from the shop list (can happen with an old saved cart)
  if (!product) {
    return (
      <li className="cart-line cart-line-problem cart-line-missing">
        <div className="cart-line-info">
          <p className="cart-line-name">Part no longer listed</p>
          <p className="field-error">This part ({id}) isn't sold any more, so it can't be ordered.</p>
        </div>
        <button type="button" className="btn btn-secondary btn-small" onClick={() => onRemove(id)}>
          Remove
        </button>
      </li>
    )
  }

  const { name, price, image, category, stock } = product
  const atMax = qty >= check.max
  const soldOut = stock <= 0
  const tooMany = !soldOut && qty > check.max

  return (
    <li className={check.ok ? 'cart-line' : 'cart-line cart-line-problem'}>
      <div className="cart-line-image">
        <ProductImage imageKey={image} alt={name} category={category} />
      </div>

      <div className="cart-line-info">
        <Link to={`/products/${id}`} className="cart-line-name">
          {name}
        </Link>
        <p className="muted">{formatPrice(price)} each</p>
        {!check.ok && <p className="field-error">{check.message}</p>}
        {/* quick fixes when the saved quantity no longer fits the stock */}
        {tooMany && (
          <button type="button" className="btn btn-secondary btn-small line-fix" onClick={() => onUpdateQty(id, check.max)}>
            Lower to {check.max}
          </button>
        )}
        {soldOut && (
          <button type="button" className="btn btn-secondary btn-small line-fix" onClick={() => onRemove(id)}>
            Remove sold-out part
          </button>
        )}
      </div>

      <div className="cart-line-qty">
        <span className="sr-only" id={`qty-label-${id}`}>
          Quantity of {name}
        </span>
        <div className="qty-input" role="group" aria-labelledby={`qty-label-${id}`}>
          <button
            type="button"
            onClick={() => onUpdateQty(id, qty - 1)}
            disabled={qty <= 1}
            aria-label={`One less ${name}`}
          >
            −
          </button>
          <output aria-live="polite">{qty}</output>
          <button
            type="button"
            onClick={() => onUpdateQty(id, qty + 1)}
            disabled={atMax}
            aria-label={`One more ${name}`}
          >
            +
          </button>
        </div>
        <button type="button" className="link-button" onClick={() => onRemove(id)}>
          Remove
        </button>
      </div>

      <p className="cart-line-total">{formatPrice(price * qty)}</p>
    </li>
  )
}

export default CartLine
