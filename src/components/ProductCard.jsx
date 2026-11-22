import { Link } from 'react-router-dom'
import ProductImage from './ProductImage.jsx'
import StockBadge from './StockBadge.jsx'
import { formatPrice } from '../utils/format.js'
import { checkQuantity } from '../rules/quantityRule.js'

// listSearch = the ?q=...&cat=... part of the list url, passed along so the
// details page can link back to the same filtered list
function ProductCard({ product, listSearch, qtyInCart, onAdd }) {
  const { id, name, brand, category, price, stock, image, summary, socket } = product

  // can one more be added without breaking the quantity rule?
  const canAddOne = checkQuantity(qtyInCart + 1, stock).ok

  const soldOut = stock === 0

  let cardClass = 'product-card'
  if (soldOut) cardClass += ' sold-out'
  else if (qtyInCart > 0) cardClass += ' in-cart'

  return (
    <article className={cardClass}>
      <ProductImage imageKey={image} alt={name} category={category} />
      <div className="card-body">
        <p className="card-meta">
          {category} · {brand}
          {socket && <> · {socket}</>}
        </p>
        <h3 className="card-title">
          <Link to={`/products/${id}`} state={{ fromList: listSearch }}>
            {name}
          </Link>
        </h3>
        {summary && <p className="card-summary">{summary}</p>}
        <div className="card-bottom">
          <span className="price">{formatPrice(price)}</span>
          <StockBadge stock={stock} />
        </div>

        {/* Problem 2 from the reference sites: "Out of stock" looked exactly like
            the Add to cart button. Here a sold-out part has no button at all,
            just a plain line of text, so it can't be mistaken for one. */}
        {soldOut ? (
          <p className="sold-out-note">Can't be ordered right now</p>
        ) : (
          <div className="card-actions">
            {qtyInCart > 0 && <span className="in-cart-text">In your cart: {qtyInCart}</span>}
            {canAddOne ? (
              <button
                type="button"
                className="btn btn-primary btn-small"
                onClick={() => onAdd(id, 1)}
                aria-label={`Add to cart: ${name}`}
              >
                Add to cart
              </button>
            ) : (
              <span className="limit-note">Max per order reached</span>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

export default ProductCard
