import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import HomePage from './pages/HomePage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import ProductDetailsPage from './pages/ProductDetailsPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import { loadProducts } from './api/loadProducts.js'

function App() {
  // the product list is loaded once here and passed down, so every page
  // works with the same data
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [errorMessage, setErrorMessage] = useState('')
  const [loadCount, setLoadCount] = useState(0) // changing this runs the effect again (retry)

  useEffect(() => {
    let ignore = false // stops an old request from setting state after a newer one

    async function fetchProducts() {
      setStatus('loading')
      try {
        const data = await loadProducts()
        if (!ignore) {
          setProducts(data)
          setStatus('ready')
        }
      } catch (err) {
        if (!ignore) {
          setErrorMessage(err.message)
          setStatus('error')
        }
      }
    }

    fetchProducts()

    return () => {
      ignore = true
    }
  }, [loadCount])

  function retryLoading() {
    setLoadCount((count) => count + 1)
  }

  const dataProps = { products, status, errorMessage, onRetry: retryLoading }

  return (
    <>
      <ScrollToTop />
      <Header />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage {...dataProps} />} />
          <Route path="/products/:id" element={<ProductDetailsPage {...dataProps} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
