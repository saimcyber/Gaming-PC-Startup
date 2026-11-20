// RULE 1 - availability / capacity
// A customer can order 1 to MAX_PER_ORDER of one part, and never more than
// we have in stock. So the real limit is whichever is smaller.
// (we keep it low so one person can't buy all the GPUs and resell them)

export const MAX_PER_ORDER = 3

export function getMaxAllowed(stock) {
  return Math.min(MAX_PER_ORDER, stock)
}

// returns { ok, max, message } so the UI and the tests can both check it
export function checkQuantity(quantity, stock) {
  const max = getMaxAllowed(stock)

  if (stock <= 0) {
    return { ok: false, max: 0, message: 'This part is out of stock.' }
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    return { ok: false, max, message: 'Quantity must be a whole number, at least 1.' }
  }
  if (quantity > max) {
    const reason =
      max < MAX_PER_ORDER ? `only ${stock} left in stock` : `the limit is ${MAX_PER_ORDER} per order`
    return { ok: false, max, message: `You can order at most ${max} of this part (${reason}).` }
  }
  return { ok: true, max, message: '' }
}
