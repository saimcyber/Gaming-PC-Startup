import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import CartChangedBanner from './components/CartChangedBanner.jsx'
import HomePage from './pages/HomePage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import ProductDetailsPage from './pages/ProductDetailsPage.jsx'
import CartPage from './pages/CartPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import OrderConfirmedPage from './pages/OrderConfirmedPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import { loadProducts } from './api/loadProducts.js'
import { readDemoSettings, saveDemoSettings } from './api/demoSettings.js'
import { getCartLines, getCartSummary, planCartFixes, applyCartFixes } from './utils/cartHelpers.js'
import { CART_KEY, LAST_ORDER_KEY, readJSON, readSavedCart, writeJSON } from './utils/storage.js'

function App() {
  const location = useLocation()

  // the product list is loaded once here and passed down, so every page
  // works with the same data
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [errorMessage, setErrorMessage] = useState('')
  const [loadCount, setLoadCount] = useState(0) // changing this runs the effect again (retry)

  // cart is a list of { id, qty }. starts from whatever was saved last time.
  const [cart, setCart] = useState(readSavedCart)
  const [lastOrder, setLastOrder] = useState(() => readJSON(LAST_ORDER_KEY, null))

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
          // "fail next load" is a one-time demo setting, so switch it off now.
          // (done here and not inside the loader because in development
          // StrictMode runs this effect twice and the first run is ignored)
          const demo = readDemoSettings()
          if (demo.failNextLoad) saveDemoSettings({ ...demo, failNextLoad: false })
        }
      }
    }

    fetchProducts()

    return () => {
      ignore = true
    }
  }, [loadCount])

  // save the cart every time it changes so a refresh doesn't lose it
  useEffect(() => {
    writeJSON(CART_KEY, cart)
  }, [cart])

  function retryLoading() {
    setLoadCount((count) => count + 1)
  }

  // ----- cart actions (passed down as callback props) -----
  // all of them use the previous cart and return a new array

  function addToCart(id, qty) {
    setCart((prev) => {
      const existing = prev.find((line) => line.id === id)
      if (existing) {
        return prev.map((line) => (line.id === id ? { ...line, qty: line.qty + qty } : line))
      }
      return [...prev, { id, qty }]
    })
  }

  function updateQuantity(id, qty) {
    if (qty < 1) return
    setCart((prev) => prev.map((line) => (line.id === id ? { ...line, qty } : line)))
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((line) => line.id !== id))
  }

  // "fix all" for a saved cart that no longer matches the stock list
  function fixCart() {
    setCart((prev) => applyCartFixes(prev, planCartFixes(getCartLines(prev, products))))
  }

  function handleOrderPlaced(order) {
    setLastOrder(order)
    writeJSON(LAST_ORDER_KEY, order)
    setCart([])
  }

  // once the parts list is loaded, parts that no longer exist are not counted,
  // so the header number matches the cart summary
  const cartCount =
    status === 'ready'
      ? getCartSummary(getCartLines(cart, products)).itemCount
      : cart.reduce((sum, line) => sum + line.qty, 0)
  const dataProps = { products, status, errorMessage, onRetry: retryLoading }

  // only check the saved cart once the latest parts list has loaded
  const cartFixes = status === 'ready' ? planCartFixes(getCartLines(cart, products)) : []
  const onCartPages = location.pathname === '/cart' || location.pathname === '/checkout'

  return (
    <>
      <ScrollToTop />
      <Header cartCount={cartCount} />
      <main id="main-content">
        {cartFixes.length > 0 && !onCartPages && <CartChangedBanner count={cartFixes.length} />}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage {...dataProps} cart={cart} onAdd={addToCart} />} />
          <Route
            path="/products/:id"
            element={<ProductDetailsPage {...dataProps} cart={cart} onAdd={addToCart} />}
          />
          <Route
            path="/cart"
            element={
              <CartPage
                {...dataProps}
                cart={cart}
                onUpdateQty={updateQuantity}
                onRemove={removeFromCart}
                onFixAll={fixCart}
              />
            }
          />
          <Route
            path="/checkout"
            element={<CheckoutPage {...dataProps} cart={cart} onOrderPlaced={handleOrderPlaced} />}
          />
          <Route path="/order/confirmed" element={<OrderConfirmedPage lastOrder={lastOrder} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer onDemoChange={retryLoading} />
    </>
  )
}

export default App
