import { useSearchParams } from 'react-router-dom'
import FilterBar from '../components/FilterBar.jsx'
import ProductCard from '../components/ProductCard.jsx'
import LoadStatus from '../components/LoadStatus.jsx'
import usePageTitle from '../hooks/usePageTitle.js'
import { searchProducts, filterProducts, sortProducts, getCategories } from '../utils/productFilters.js'
import { getQtyInCart } from '../utils/cartHelpers.js'

function ProductsPage({ products, status, errorMessage, onRetry, cart, onAdd }) {
  usePageTitle('Parts')

  // search, category, stock filter and sort are all kept in the url.
  // that way the back button, refresh and shared links all keep the same list.
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const category = searchParams.get('cat') || ''
  const inStockOnly = searchParams.get('stock') === 'in'
  const sort = searchParams.get('sort') || 'featured'

  function updateParam(key, value, replace = false) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value) next.set(key, value)
        else next.delete(key)
        return next
      },
      // typing in the search box replaces the history entry, otherwise
      // every letter would need its own press of the back button
      { replace }
    )
  }

  function clearAll() {
    setSearchParams({})
  }

  if (status !== 'ready') {
    return (
      <div className="container page">
        <h1>Parts</h1>
        <LoadStatus status={status} errorMessage={errorMessage} onRetry={onRetry} />
      </div>
    )
  }

  // shop has nothing listed at all (different from "nothing matches your search")
  if (products.length === 0) {
    return (
      <div className="container page">
        <h1>Parts</h1>
        <div className="status-box">
          <h2>No parts listed right now</h2>
          <p>
            We are updating our stock list. Please check again later, or visit the shop in G-9 Markaz to see what
            is on the shelf.
          </p>
          <button type="button" className="btn btn-secondary" onClick={onRetry}>
            Check again
          </button>
        </div>
      </div>
    )
  }

  const categories = getCategories(products)
  const unknownCategory = category !== '' && !categories.includes(category)

  let results = searchProducts(products, query)
  results = filterProducts(results, { category: unknownCategory ? '' : category, inStockOnly })
  results = sortProducts(results, sort)

  const listSearch = searchParams.toString() ? `?${searchParams.toString()}` : ''

  return (
    <div className="container page">
      <h1>Parts</h1>

      <FilterBar
        query={query}
        category={unknownCategory ? '' : category}
        inStockOnly={inStockOnly}
        sort={sort}
        categories={categories}
        onQueryChange={(value) => updateParam('q', value, true)}
        onCategoryChange={(value) => updateParam('cat', value)}
        onInStockChange={(checked) => updateParam('stock', checked ? 'in' : '')}
        onSortChange={(value) => updateParam('sort', value === 'featured' ? '' : value)}
      />

      {unknownCategory && (
        <p className="notice notice-warning">
          There is no "{category}" category, so all categories are shown.{' '}
          <button type="button" className="link-button" onClick={() => updateParam('cat', '')}>
            Remove it
          </button>
        </p>
      )}

      <p className="result-count" aria-live="polite">
        Showing {results.length} of {products.length} parts
      </p>

      {results.length === 0 ? (
        <div className="status-box">
          <h2>No parts match your search</h2>
          <p>Try a shorter search or remove a filter.</p>
          <button type="button" className="btn btn-secondary" onClick={clearAll}>
            Clear search and filters
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {results.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              listSearch={listSearch}
              qtyInCart={getQtyInCart(cart, product.id)}
              onAdd={onAdd}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductsPage
