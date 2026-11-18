// search / filter / sort helpers for the parts list.
// they all return a NEW array and never change the one passed in.

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'name', label: 'Name (A-Z)' },
]

// text that the search box looks through for one product
function searchableText(product) {
  const { name, brand, category, summary, socket, specs } = product
  return [name, brand, category, summary, socket, ...specs].filter(Boolean).join(' ').toLowerCase()
}

export function splitWords(query) {
  return query.toLowerCase().trim().split(/\s+/).filter((word) => word.length > 0)
}

// every word typed has to appear somewhere, so "ryzen am5" only shows AM5 ryzens
export function searchProducts(products, query) {
  const words = splitWords(query)
  if (words.length === 0) return products

  return products.filter((product) => {
    const text = searchableText(product)
    return words.every((word) => text.includes(word))
  })
}

export function filterProducts(products, { category, inStockOnly }) {
  return products.filter((product) => {
    if (category && product.category !== category) return false
    if (inStockOnly && product.stock === 0) return false
    return true
  })
}

export function sortProducts(products, sort) {
  const copy = [...products]
  if (sort === 'price-asc') copy.sort((a, b) => a.price - b.price)
  else if (sort === 'price-desc') copy.sort((a, b) => b.price - a.price)
  else if (sort === 'name') copy.sort((a, b) => a.name.localeCompare(b.name))
  // 'featured' keeps the order from products.js
  return copy
}

export function getCategories(products) {
  return [...new Set(products.map((p) => p.category))]
}
