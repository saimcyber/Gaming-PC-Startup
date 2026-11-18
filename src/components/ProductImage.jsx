import { useState } from 'react'
import productImages from '../assets/productImages.js'

// shows the product picture, or a grey box with text if there is no picture
// (or if the file fails to load for some reason)
function ProductImage({ imageKey, alt, category }) {
  const [broken, setBroken] = useState(false)
  const src = imageKey ? productImages[imageKey] : null

  if (!src || broken) {
    return (
      <div className="product-image image-fallback" role="img" aria-label={`No photo available for ${alt}`}>
        <span>{category}</span>
        <small>Photo coming soon</small>
      </div>
    )
  }

  return <img className="product-image" src={src} alt={alt} onError={() => setBroken(true)} />
}

export default ProductImage
