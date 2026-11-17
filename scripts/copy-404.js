// GitHub Pages has no rewrite rules, so a refresh on /products/cpu-ryzen5-7600
// would give GitHub's own 404 page. Copying index.html to 404.html makes
// Pages serve our app instead and react-router then reads the URL.
import { copyFileSync, existsSync } from 'node:fs'

if (existsSync('dist/index.html')) {
  copyFileSync('dist/index.html', 'dist/404.html')
  console.log('copied dist/index.html -> dist/404.html')
} else {
  console.log('dist/index.html not found, run vite build first')
  process.exit(1)
}
