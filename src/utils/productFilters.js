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
  // 'featured' keeps the order from products.js, but sold-out parts go to
  // the end so the first thing you see is something you can actually buy
  else copy.sort((a, b) => (a.stock === 0) - (b.stock === 0))
  return copy
}

export function getCategories(products) {
  return [...new Set(products.map((p) => p.category))]
}

// runs search + filters together (same steps as the parts page)
export function getResults(products, { query, category, inStockOnly }) {
  return filterProducts(searchProducts(products, query), { category, inStockOnly })
}

// used when nothing matches. instead of "every word must match", give each
// part a point for every word it does match and return the best few.
export function findClosestMatches(products, query, limit = 4) {
  const words = splitWords(query)
  if (words.length === 0) return []

  return products
    .map((product) => {
      const text = searchableText(product)
      const score = words.filter((word) => text.includes(word)).length
      return { product, score }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.product)
}

// words from the search that are not found in ANY part.
// e.g. "rtx 4060 founders" -> ["founders"], so we can suggest "rtx 4060"
export function findUnknownWords(products, query) {
  const allText = products.map(searchableText).join(' ')
  return splitWords(query).filter((word) => !allText.includes(word))
}
