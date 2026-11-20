import { useState } from 'react'
import { Link } from 'react-router-dom'
import QuantityInput from './QuantityInput.jsx'
import { checkQuantity, getMaxAllowed, MAX_PER_ORDER } from '../rules/quantityRule.js'
import { wouldConflict } from '../rules/compatibilityRule.js'

// quantity + add to cart on the details page.
// qtyInCart is how many the user already has, so the limit counts both.
function AddToCartPanel({ product, qtyInCart, cartProducts, onAdd }) {
  const [qty, setQty] = useState('1')
  const [added, setAdded] = useState(0) // how many were just added (for the message)
  const [triedSubmit, setTriedSubmit] = useState(false)

  const { id, stock, socket } = product
  const maxAllowed = getMaxAllowed(stock)
  const canStillAdd = maxAllowed - qtyInCart

  const wanted = Number(qty)
  // first make sure the typed amount itself is a proper number (1, 2, ...),
  // then check it together with what is already in the cart
  const typedIsValid = Number.isInteger(wanted) && wanted >= 1
  const check = typedIsValid ? checkQuantity(qtyInCart + wanted, stock) : checkQuantity(wanted, stock)
  const showError = !check.ok && (qty !== '' || triedSubmit)
  const socketWarning = wouldConflict(product, cartProducts)

  function handleSubmit(e) {
    e.preventDefault()
    setTriedSubmit(true)
    if (!check.ok) return
    onAdd(id, wanted)
    setAdded(wanted)
    setQty('1')
    setTriedSubmit(false)
  }

  function handleQtyChange(value) {
    setQty(value)
    setAdded(0) // hide the old "added" message once they change something
  }

  if (stock === 0) {
    return (
      <div className="cart-panel">
        <p className="panel-unavailable">
          <strong>Out of stock.</strong> You can't order this part right now.
        </p>
      </div>
    )
  }

  return (
    <form className="cart-panel" onSubmit={handleSubmit}>
      <div className="panel-row">
        <div>
          <label htmlFor="qty">Quantity</label>
          <QuantityInput
            id="qty"
            value={qty}
            max={Math.max(1, canStillAdd)}
            onChange={handleQtyChange}
            describedBy="qty-limit qty-error"
            invalid={showError}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={canStillAdd <= 0}>
          Add to cart
        </button>
      </div>

      <p id="qty-limit" className="panel-hint">
        Max {MAX_PER_ORDER} per order · {stock} in stock
        {qtyInCart > 0 && <> · you already have {qtyInCart} in your cart</>}
      </p>

      {canStillAdd <= 0 && (
        <p className="field-error">You already have the most you can order of this part.</p>
      )}

      {showError && canStillAdd > 0 && (
        <p id="qty-error" className="field-error" role="alert">
          {qtyInCart > 0 && typedIsValid
            ? `${check.message} You can add ${canStillAdd} more.`
            : check.message}
        </p>
      )}

      {socketWarning && (
        <p className="notice notice-warning">
          Heads up: {socketWarning} You can still add it, but checkout stays blocked until you remove one of them.
        </p>
      )}

      {socket && !socketWarning && (
        <p className="panel-hint">
          Socket {socket} - needs a {product.category === 'CPU' ? 'motherboard' : 'CPU'} with the same socket.
        </p>
      )}

      {added > 0 && (
        <p className="notice notice-success" role="status">
          Added {added} to your cart. <Link to="/cart">Go to cart</Link>
        </p>
      )}
    </form>
  )
}

export default AddToCartPanel
