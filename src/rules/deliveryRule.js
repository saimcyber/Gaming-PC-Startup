// RULE 3 - pricing / fulfilment
// Pickup from the shop is always free.
// Delivery costs the area's fee, but is free when the subtotal is
// FREE_DELIVERY_FROM or more. Areas with served: false can't get delivery.

export const FREE_DELIVERY_FROM = 60000

// area = one object from data/deliveryAreas.js (or undefined if nothing picked yet)
export function getDeliveryCharge({ subtotal, method, area }) {
  if (method === 'pickup') {
    return { ok: true, fee: 0, message: 'Pickup from the shop is free.' }
  }

  if (!area) {
    return { ok: false, fee: 0, message: 'Choose your delivery area to see the fee.' }
  }

  if (!area.served) {
    return {
      ok: false,
      fee: 0,
      message: "We don't deliver to that area yet. Please choose pickup from the shop instead.",
    }
  }

  if (subtotal >= FREE_DELIVERY_FROM) {
    return {
      ok: true,
      fee: 0,
      message: `Free delivery (order is Rs ${FREE_DELIVERY_FROM.toLocaleString('en-PK')} or more).`,
    }
  }

  return { ok: true, fee: area.fee, message: `Delivery to ${area.name}.` }
}

// how much more the customer needs to add for free delivery (0 if already free)
export function amountToFreeDelivery(subtotal) {
  return Math.max(0, FREE_DELIVERY_FROM - subtotal)
}
