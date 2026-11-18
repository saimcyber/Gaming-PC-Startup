import { Link } from 'react-router-dom'
import ProductImage from './ProductImage.jsx'
import StockBadge from './StockBadge.jsx'
import { formatPrice } from '../utils/format.js'

// listSearch = the ?q=...&cat=... part of the list url, passed along so the
// details page can link back to the same filtered list
function ProductCard({ product, listSearch }) {
  const { id, name, brand, category, price, stock, image, summary, socket } = product

  return (
    <article className="product-card">
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
      </div>
    </article>
  )
}

export default ProductCard
