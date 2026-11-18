import { SORT_OPTIONS } from '../utils/productFilters.js'

// only shows the controls. the values live in the url (ProductsPage owns them)
// and every change is sent back up with the on... callbacks
function FilterBar({
  query,
  category,
  inStockOnly,
  sort,
  categories,
  onQueryChange,
  onCategoryChange,
  onInStockChange,
  onSortChange,
}) {
  return (
    <form className="filter-bar" role="search" onSubmit={(e) => e.preventDefault()}>
      <div className="field field-search">
        <label htmlFor="search">Search parts</label>
        <input
          id="search"
          type="search"
          placeholder="e.g. ryzen, rtx 4060, ddr5"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="category">Category</label>
        <select id="category" value={category} onChange={(e) => onCategoryChange(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="sort">Sort by</label>
        <select id="sort" value={sort} onChange={(e) => onSortChange(e.target.value)}>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="field field-check">
        <input
          id="in-stock"
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockChange(e.target.checked)}
        />
        <label htmlFor="in-stock">In stock only</label>
      </div>
    </form>
  )
}

export default FilterBar
