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

  let buttonText = 'Add to cart'
  if (stock === 0) buttonText = 'Out of stock'
  else if (!canAddOne) buttonText = 'Limit reached'

  return (
    <article className={qtyInCart > 0 ? 'product-card in-cart' : 'product-card'}>
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
        <div className="card-actions">
          {qtyInCart > 0 && <span className="in-cart-text">In your cart: {qtyInCart}</span>}
          <button
            type="button"
            className="btn btn-primary btn-small"
            onClick={() => onAdd(id, 1)}
            disabled={!canAddOne}
            aria-label={`${buttonText}: ${name}`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
