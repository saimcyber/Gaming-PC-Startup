import { checkQuantity } from '../rules/quantityRule.js'
import { findSocketConflicts } from '../rules/compatibilityRule.js'

// the cart only stores { id, qty }. this joins each line with the current
// product data so prices and stock always come from the latest list.
export function getCartLines(cart, products) {
  return cart.map((line) => {
    const product = products.find((p) => p.id === line.id) || null
    const check = product ? checkQuantity(line.qty, product.stock) : null
    return { ...line, product, check }
  })
}

export function getCartSummary(lines) {
  return lines.reduce(
    (totals, line) => {
      if (!line.product) return totals
      return {
        itemCount: totals.itemCount + line.qty,
        subtotal: totals.subtotal + line.qty * line.product.price,
      }
    },
    { itemCount: 0, subtotal: 0 }
  )
}

// everything that stops the customer from checking out, as plain messages
export function getCartProblems(lines) {
  const problems = []

  lines.forEach((line) => {
    if (!line.product) {
      problems.push('A part in your cart is no longer listed. Remove it to continue.')
    } else if (!line.check.ok) {
      problems.push(`${line.product.name}: ${line.check.message}`)
    }
  })

  const products = lines.filter((line) => line.product).map((line) => line.product)
  const sockets = findSocketConflicts(products)
  sockets.conflicts.forEach((conflict) => problems.push(conflict.message))

  return problems
}

export function getQtyInCart(cart, id) {
  const line = cart.find((item) => item.id === id)
  return line ? line.qty : 0
}
