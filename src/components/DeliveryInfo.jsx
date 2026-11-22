import deliveryAreas, { PICKUP_POINT } from '../data/deliveryAreas.js'
import { FREE_DELIVERY_FROM, amountToFreeDelivery } from '../rules/deliveryRule.js'
import { formatPrice } from '../utils/format.js'

// Problem 3 from the reference sites: the delivery fee only showed up in the
// cart. This box puts the real fees on the product page, before adding.
// Everything comes from deliveryAreas.js and deliveryRule.js, so if a fee or
// the free delivery amount changes, this box changes with it.
function DeliveryInfo({ price, cartSubtotal, canOrder }) {
  const servedAreas = deliveryAreas.filter((area) => area.served)
  const newSubtotal = cartSubtotal + price
  const stillNeeded = amountToFreeDelivery(newSubtotal)

  return (
    <section className="delivery-box" aria-labelledby="delivery-heading">
      <h2 id="delivery-heading">Delivery and pickup</h2>
      <table className="simple-table delivery-table">
        <caption className="sr-only">Delivery fee by area</caption>
        <thead>
          <tr>
            <th scope="col">Area</th>
            <th scope="col">Fee</th>
          </tr>
        </thead>
        <tbody>
          {servedAreas.map((area) => (
            <tr key={area.id}>
              <td>{area.name}</td>
              <td>{formatPrice(area.fee)}</td>
            </tr>
          ))}
          <tr>
            <td>Pickup from the shop</td>
            <td>Free</td>
          </tr>
        </tbody>
      </table>
      <p className="panel-hint">
        Delivery is free on orders of {formatPrice(FREE_DELIVERY_FROM)} or more. We don't deliver outside Islamabad /
        Rawalpindi yet. Pickup: {PICKUP_POINT}.
      </p>

      {canOrder && (
        <p className={stillNeeded === 0 ? 'notice notice-success' : 'notice notice-info'}>
          {cartSubtotal > 0 ? 'With your cart, adding one of these' : 'Adding one of these'} makes your order{' '}
          {formatPrice(newSubtotal)}.{' '}
          {stillNeeded === 0
            ? 'That gets free delivery.'
            : `Add ${formatPrice(stillNeeded)} more for free delivery.`}
        </p>
      )}
    </section>
  )
}

export default DeliveryInfo
