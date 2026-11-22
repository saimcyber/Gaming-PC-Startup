import productData from '../data/products.js'
import { readDemoSettings, STOCK_DROP } from './demoSettings.js'

// Fake "API" so the app has to deal with loading and errors like a real shop.
// There is no server, it just waits a bit and then gives back the local data.
// The demo settings (see demoSettings.js) can make it fail, return nothing,
// or return changed stock.
const FAKE_DELAY_MS = 700

export function loadProducts() {
  const demo = readDemoSettings()

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (demo.failNextLoad) {
        reject(new Error('Could not load the parts list (simulated network error).'))
        return
      }

      if (demo.emptyCatalogue) {
        resolve([])
        return
      }

      // copy each product so nothing in the app can change the original data
      let copy = productData.map((product) => ({ ...product, specs: [...product.specs] }))

      if (demo.stockDrop) {
        copy = copy
          .filter((product) => !STOCK_DROP.removed.includes(product.id))
          .map((product) =>
            product.id in STOCK_DROP.newStock ? { ...product, stock: STOCK_DROP.newStock[product.id] } : product
          )
      }

      resolve(copy)
    }, FAKE_DELAY_MS)
  })
}
