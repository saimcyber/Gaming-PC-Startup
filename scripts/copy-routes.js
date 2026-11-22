// GitHub Pages has no rewrite rules, so a refresh on /products/cpu-ryzen5-7600
// would give GitHub's own 404 page.
// 1. index.html is copied to 404.html, so any unknown URL still opens the app
//    and react-router shows our own "not found" page.
// 2. Every real route also gets its own copy (e.g. products/cpu-ryzen5-7600.html)
//    so those pages load with a normal 200 status instead of 404.
//    (GitHub Pages serves "cart.html" when someone opens "/cart".)
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import products from '../src/data/products.js'

if (!existsSync('dist/index.html')) {
  console.log('dist/index.html not found, run vite build first')
  process.exit(1)
}

const pages = ['404', 'products', 'cart', 'checkout', 'order/confirmed', ...products.map((p) => `products/${p.id}`)]

pages.forEach((page) => {
  const target = `dist/${page}.html`
  mkdirSync(dirname(target), { recursive: true })
  copyFileSync('dist/index.html', target)
})

console.log(`copied dist/index.html to ${pages.length} route files (including 404.html)`)
