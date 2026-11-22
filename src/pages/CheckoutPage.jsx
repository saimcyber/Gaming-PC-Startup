import { cloneElement, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LoadStatus from '../components/LoadStatus.jsx'
import usePageTitle from '../hooks/usePageTitle.js'
import deliveryAreas, { PICKUP_POINT } from '../data/deliveryAreas.js'
import { getCartLines, getCartSummary, getCartProblems } from '../utils/cartHelpers.js'
import { validateCheckout, getPickupDays } from '../utils/validateCheckout.js'
import { getDeliveryCharge, amountToFreeDelivery } from '../rules/deliveryRule.js'
import { placeOrder } from '../api/placeOrder.js'
import { formatPrice, itemsText } from '../utils/format.js'

const EMPTY_FORM = {
  fullName: '',
  phone: '',
  method: 'delivery',
  areaId: '',
  address: '',
  pickupDay: '',
  note: '',
}

// order of fields on screen, used to focus the first wrong one
const FIELD_ORDER = ['fullName', 'phone', 'method', 'areaId', 'address', 'pickupDay']

function CheckoutPage({ products, status, errorMessage, onRetry, cart, onOrderPlaced }) {
  usePageTitle('Checkout')
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY_FORM)
  const [touched, setTouched] = useState({}) // fields the user has left at least once
  const [triedSubmit, setTriedSubmit] = useState(false)
  const [placing, setPlacing] = useState(false)
  const [pickupDays] = useState(() => getPickupDays())

  if (status !== 'ready') {
    return (
      <div className="container page">
        <h1>Checkout</h1>
        <LoadStatus status={status} errorMessage={errorMessage} onRetry={onRetry} />
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="container page">
        <h1>Checkout</h1>
        <div className="status-box">
          <h2>Nothing to check out</h2>
          <p>Your cart is empty. Add some parts first.</p>
          <Link to="/products" className="btn btn-primary">
            Browse parts
          </Link>
        </div>
      </div>
    )
  }

  const lines = getCartLines(cart, products)
  const { itemCount, subtotal } = getCartSummary(lines)
  const cartProblems = getCartProblems(lines)

  const area = deliveryAreas.find((a) => a.id === form.areaId)
  const delivery = getDeliveryCharge({ subtotal, method: form.method, area })
  const total = subtotal + (delivery.ok ? delivery.fee : 0)

  const errors = validateCheckout(form, area)
  const errorCount = Object.keys(errors).length

  // only show a field's error after the user has left it, or tried to submit
  function errorFor(field) {
    return touched[field] || triedSubmit ? errors[field] : undefined
  }

  function handleChange(e) {
    const { name, value } = e.target
    // copy the old form and change one field, never edit form directly
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleBlur(e) {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setTriedSubmit(true)

    if (errorCount > 0) {
      // move focus to the first field that needs fixing
      const firstBad = FIELD_ORDER.find((field) => errors[field])
      document.getElementById(firstBad)?.focus()
      return
    }
    if (cartProblems.length > 0 || !delivery.ok) return

    setPlacing(true)
    // name, phone and address are NOT kept in the saved order (no personal data stored)
    const order = await placeOrder({
      items: lines.map(({ id, qty, product }) => ({ id, qty, name: product.name, price: product.price })),
      itemCount,
      subtotal,
      deliveryFee: delivery.fee,
      total,
      method: form.method,
      areaName: form.method === 'delivery' ? area.name : null,
      pickupDay: form.method === 'pickup' ? pickupDays.find((d) => d.value === form.pickupDay)?.label : null,
    })
    onOrderPlaced(order)
    navigate('/order/confirmed', { replace: true })
  }

  return (
    <div className="container page">
      <h1>Checkout</h1>
      <p className="notice notice-info">
        Simulated order: no payment is taken and nothing is sent. (In the real shop you would pay cash on delivery
        or at pickup.)
      </p>

      {cartProblems.length > 0 && (
        <div className="problem-box" role="alert">
          <p>
            <strong>Your cart has problems that stop the order:</strong>
          </p>
          <ul>
            {cartProblems.map((problem) => (
              <li key={problem}>{problem}</li>
            ))}
          </ul>
          <Link to="/cart">Go back to the cart to fix them</Link>
        </div>
      )}

      <div className="cart-layout">
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          {triedSubmit && errorCount > 0 && (
            <p className="form-error-summary" role="alert">
              Please fix {errorCount} {errorCount === 1 ? 'field' : 'fields'} below. Everything else you typed is
              kept.
            </p>
          )}

          <fieldset>
            <legend>Your details</legend>

            <FormField id="fullName" label="Full name" error={errorFor('fullName')}>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                value={form.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </FormField>

            <FormField
              id="phone"
              label="Mobile number"
              hint="We call to confirm before sending. Format: 0312-3456789"
              error={errorFor('phone')}
            >
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="03XX-XXXXXXX"
                value={form.phone}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </FormField>
          </fieldset>

          <fieldset>
            <legend>Delivery or pickup</legend>
            <div className="radio-row" id="method">
              <label className="radio-option">
                <input
                  type="radio"
                  name="method"
                  value="delivery"
                  checked={form.method === 'delivery'}
                  onChange={handleChange}
                />
                Deliver to me
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="method"
                  value="pickup"
                  checked={form.method === 'pickup'}
                  onChange={handleChange}
                />
                Pick up from the shop (free)
              </label>
            </div>

            {form.method === 'delivery' ? (
              <>
                <FormField id="areaId" label="Delivery area" error={errorFor('areaId')}>
                  <select id="areaId" name="areaId" value={form.areaId} onChange={handleChange} onBlur={handleBlur}>
                    <option value="">-- choose your area --</option>
                    {deliveryAreas.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.served ? `${a.name} (${formatPrice(a.fee)})` : a.name}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField
                  id="address"
                  label="Address"
                  hint="House / hostel name, street, sector"
                  error={errorFor('address')}
                >
                  <textarea
                    id="address"
                    name="address"
                    rows="3"
                    autoComplete="street-address"
                    value={form.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </FormField>
              </>
            ) : (
              <>
                <p className="panel-hint">Pickup point: {PICKUP_POINT}</p>
                <FormField id="pickupDay" label="Pickup day" error={errorFor('pickupDay')}>
                  <select
                    id="pickupDay"
                    name="pickupDay"
                    value={form.pickupDay}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">-- choose a day --</option>
                    {pickupDays.map((day) => (
                      <option key={day.value} value={day.value}>
                        {day.label}
                      </option>
                    ))}
                  </select>
                </FormField>
              </>
            )}

            <FormField id="note" label="Note for the shop (optional)">
              <input id="note" name="note" type="text" value={form.note} onChange={handleChange} />
            </FormField>
          </fieldset>

          {/* onMouseDown: without this, clicking here first blurs the field you were
              typing in, its error message appears and pushes this button down
              before the mouse is released, so the click was lost. Keyboard and
              the submit itself are not affected. */}
          <button
            type="submit"
            className="btn btn-primary btn-large btn-block"
            disabled={placing || cartProblems.length > 0}
            onMouseDown={(e) => e.preventDefault()}
          >
            {placing ? 'Placing order...' : `Place order (${formatPrice(total)})`}
          </button>
        </form>

        <aside className="summary-box" aria-labelledby="order-summary-heading">
          <h2 id="order-summary-heading">Order summary</h2>
          <ul className="summary-items">
            {lines
              .filter((line) => line.product)
              .map(({ id, qty, product }) => (
                <li key={id}>
                  <span>
                    {qty} × {product.name}
                  </span>
                  <span>{formatPrice(qty * product.price)}</span>
                </li>
              ))}
          </ul>
          <dl className="summary-list">
            <div>
              <dt>Subtotal ({itemsText(itemCount)})</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div>
              <dt>{form.method === 'pickup' ? 'Pickup' : 'Delivery'}</dt>
              <dd>{delivery.ok ? (delivery.fee === 0 ? 'Free' : formatPrice(delivery.fee)) : '-'}</dd>
            </div>
            <div className="summary-total">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>
          {/* red only when the chosen area can't be served, not before they pick one */}
          <p className={area && !area.served ? 'field-error' : 'panel-hint'}>{delivery.message}</p>
          {form.method === 'delivery' && delivery.fee > 0 && (
            <p className="panel-hint">
              Add {formatPrice(amountToFreeDelivery(subtotal))} more to your cart for free delivery.
            </p>
          )}
        </aside>
      </div>
    </div>
  )
}

// label + input + hint + error message, so every field looks the same
function FormField({ id, label, hint, error, children }) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={error ? 'form-field has-error' : 'form-field'}>
      <label htmlFor={id}>{label}</label>
      {hint && (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      )}
      {/* add aria attributes to the input that was passed in */}
      {cloneWithAria(children, describedBy, Boolean(error))}
      {error && (
        <p id={errorId} className="field-error">
          {error}
        </p>
      )}
    </div>
  )
}

function cloneWithAria(element, describedBy, invalid) {
  return cloneElement(element, { 'aria-describedby': describedBy, 'aria-invalid': invalid })
}

export default CheckoutPage
