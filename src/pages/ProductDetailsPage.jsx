import { Link, useLocation, useParams } from 'react-router-dom'
import ProductImage from '../components/ProductImage.jsx'
import StockBadge from '../components/StockBadge.jsx'
import LoadStatus from '../components/LoadStatus.jsx'
import usePageTitle from '../hooks/usePageTitle.js'
import { formatPrice, warrantyText } from '../utils/format.js'

function ProductDetailsPage({ products, status, errorMessage, onRetry }) {
  const { id } = useParams()
  const location = useLocation()

  const product = products.find((p) => p.id === id)
  usePageTitle(product ? product.name : 'Part not found')

  // if the user came from the list, go back to the same filtered list
  const backLink = '/products' + (location.state?.fromList || '')

  if (status !== 'ready') {
    return (
      <div className="container page">
        <LoadStatus status={status} errorMessage={errorMessage} onRetry={onRetry} />
      </div>
    )
  }

  if (!product) {
    // turn an id like "gpu-rtx-3060" into a search for "gpu rtx 3060"
    const guess = id.replace(/[-_]+/g, ' ')
    return (
      <div className="container page">
        <div className="status-box">
          <h1>Part not found</h1>
          <p>
            We don't have a part with the ID <strong>"{id}"</strong>. It may have been removed, or the link has a
            typo.
          </p>
          <div className="button-row">
            <Link to={`/products?q=${encodeURIComponent(guess)}`} className="btn btn-primary">
              Search for "{guess}"
            </Link>
            <Link to="/products" className="btn btn-secondary">
              Browse all parts
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const { name, brand, category, price, stock, image, summary, specs, socket, warrantyMonths } = product

  return (
    <div className="container page">
      <p className="breadcrumb">
        <Link to={backLink}>&larr; Back to parts</Link>
      </p>

      <article className="details">
        <div className="details-image">
          <ProductImage imageKey={image} alt={name} category={category} />
        </div>

        <div className="details-info">
          <p className="card-meta">
            {category} · {brand}
          </p>
          <h1 className="details-title">{name}</h1>
          <p className="details-price">{formatPrice(price)}</p>
          <StockBadge stock={stock} />

          <p className="details-summary">{summary || 'No description added for this part yet.'}</p>

          <dl className="details-facts">
            <div>
              <dt>Warranty</dt>
              <dd>{warrantyText(warrantyMonths)}</dd>
            </div>
            {socket && (
              <div>
                <dt>Socket</dt>
                <dd>{socket}</dd>
              </div>
            )}
            <div>
              <dt>Available</dt>
              <dd>{stock === 0 ? 'None at the shop right now' : `${stock} at the shop`}</dd>
            </div>
          </dl>
        </div>
      </article>

      <section className="details-specs" aria-labelledby="specs-heading">
        <h2 id="specs-heading">Specifications</h2>
        {specs.length > 0 ? (
          <ul>
            {specs.map((spec) => (
              <li key={spec}>{spec}</li>
            ))}
          </ul>
        ) : (
          <p className="muted">
            Spec sheet not added yet. Message us or ask at the shop and we will check the box for you.
          </p>
        )}
      </section>
    </div>
  )
}

export default ProductDetailsPage
