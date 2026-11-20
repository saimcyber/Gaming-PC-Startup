import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/global.css'
import './styles/layout.css'
import './styles/products.css'
import './styles/cart.css'

// basename is /Gaming-PC-Startup/ (from vite.config.js) so links work on GitHub Pages
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* the future flags just turn on the v7 behaviour now and remove the console warnings */}
    <BrowserRouter
      basename={import.meta.env.BASE_URL}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
