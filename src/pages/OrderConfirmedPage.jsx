import { Link } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle.js'
import { formatPrice, itemsText } from '../utils/format.js'
import { PICKUP_POINT } from '../data/deliveryAreas.js'

function OrderConfirmedPage({ lastOrder }) {
  usePageTitle('Order placed')

  if (!lastOrder) {
    return (
      <div className="container page">
        <div className="status-box">
          <h1>No recent order</h1>
          <p>We couldn't find an order placed from this browser.</p>
          <Link to="/products" className="btn btn-primary">
            Browse parts
          </Link>
        </div>
      </div>
    )
  }

  const { orderNumber, items, itemCount, subtotal, deliveryFee, total, method, areaName, pickupDay } = lastOrder

  return (
    <div className="container page">
      <section className="confirm-box" aria-labelledby="confirm-heading">
        <p className="confirm-tag">Order placed (simulated)</p>
        <h1 id="confirm-heading">Thanks! Your order number is {orderNumber}</h1>
        <p>
          {method === 'pickup'
            ? `Collect it on ${pickupDay} from ${PICKUP_POINT}. Pay at the counter.`
            : `We will call you to confirm, then deliver to ${areaName}. Pay cash on delivery.`}
        </p>
        <p className="muted">
          This is a student project, so no real order was made, no money was taken and none of your details were
          sent anywhere.
        </p>
      </section>

      <section className="summary-box confirm-summary" aria-labelledby="items-heading">
        <h2 id="items-heading">What you ordered</h2>
        <ul className="summary-items">
          {items.map((item) => (
            <li key={item.id}>
              <span>
                {item.qty} × {item.name}
              </span>
              <span>{formatPrice(item.qty * item.price)}</span>
            </li>
          ))}
        </ul>
        <dl className="summary-list">
          <div>
            <dt>Subtotal ({itemsText(itemCount)})</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          <div>
            <dt>{method === 'pickup' ? 'Pickup' : 'Delivery'}</dt>
            <dd>{deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}</dd>
          </div>
          <div className="summary-total">
            <dt>Total to pay</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
        </dl>
      </section>

      <p className="center">
        <Link to="/products" className="btn btn-secondary">
          Continue shopping
        </Link>
      </p>
    </div>
  )
}

export default OrderConfirmedPage
