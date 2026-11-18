import productData from '../data/products.js'

// Fake "API" so the app has to deal with loading and errors like a real shop.
// There is no server, it just waits a bit and then gives back the local data.
const FAKE_DELAY_MS = 700

export function loadProducts(options = {}) {
  const { fail = false } = options

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (fail) {
        reject(new Error('Could not load the parts list (simulated network error).'))
        return
      }
      // copy each product so nothing in the app can change the original data
      const copy = productData.map((product) => ({ ...product, specs: [...product.specs] }))
      resolve(copy)
    }, FAKE_DELAY_MS)
  })
}
