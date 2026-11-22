import ProductCard from './ProductCard.jsx'
import { getResults, findClosestMatches, findUnknownWords, splitWords } from '../utils/productFilters.js'
import { getQtyInCart } from '../utils/cartHelpers.js'
import { partsText } from '../utils/format.js'

// Shown when the search + filters give 0 parts.
// Problem 1 from the reference sites: an empty page with no way forward.
// Here every active filter gets its own "remove" button that also says how
// many parts you would see without it, plus a few closest matches.
function NoResults({ products, query, category, inStockOnly, onRemove, onSearch, onClearAll, listSearch, cart, onAdd }) {
  const current = { query, category, inStockOnly }

  // how many parts would show if one filter was taken away
  function countWithout(key) {
    const changed = { ...current, [key]: key === 'inStockOnly' ? false : '' }
    return getResults(products, changed).length
  }

  const options = []
  if (query) {
    options.push({ key: 'query', label: `Remove search "${query}"`, count: countWithout('query') })
  }
  if (category) {
    options.push({ key: 'category', label: `Remove category "${category}"`, count: countWithout('category') })
  }
  if (inStockOnly) {
    options.push({ key: 'inStockOnly', label: 'Remove "In stock only"', count: countWithout('inStockOnly') })
  }

  // if some words are not in any part, suggest the search without them
  const unknownWords = findUnknownWords(products, query)
  const knownWords = splitWords(query).filter((word) => !unknownWords.includes(word))
  const shorterQuery = knownWords.join(' ')
  const shorterCount = shorterQuery ? getResults(products, { ...current, query: shorterQuery }).length : 0

  const closest = findClosestMatches(products, query)
  const showShorter = shorterQuery !== '' && shorterCount > 0

  return (
    <div className="no-results">
      <h2>No parts match all of this</h2>

      {unknownWords.length > 0 && (
        <p>
          We couldn't find {unknownWords.map((word) => `"${word}"`).join(', ')} in any part we sell.
        </p>
      )}

      {showShorter && (
        <p>
          <button type="button" className="btn btn-primary" onClick={() => onSearch(shorterQuery)}>
            Search for "{shorterQuery}" instead ({partsText(shorterCount)})
          </button>
        </p>
      )}

      <p className="no-results-label">{showShorter ? 'Or remove one of these:' : 'Try removing one of these:'}</p>
      <ul className="filter-chips">
        {options.map((option) => (
          <li key={option.key}>
            <button type="button" className="chip" onClick={() => onRemove(option.key)}>
              {option.label} <span className="chip-count">({partsText(option.count)})</span>
            </button>
          </li>
        ))}
        <li>
          <button type="button" className="chip chip-plain" onClick={onClearAll}>
            Clear everything ({partsText(products.length)})
          </button>
        </li>
      </ul>

      {closest.length > 0 && (
        <section className="closest" aria-labelledby="closest-heading">
          <h3 id="closest-heading">Closest matches</h3>
          <p className="muted">These match some of the words you typed (filters not applied).</p>
          <div className="product-grid">
            {closest.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                listSearch={listSearch}
                qtyInCart={getQtyInCart(cart, product.id)}
                onAdd={onAdd}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default NoResults
