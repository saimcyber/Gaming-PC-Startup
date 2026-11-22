import { checkQuantity, getMaxAllowed } from '../rules/quantityRule.js'
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

// A saved cart can go out of date (part removed, sold out, or less stock than
// before). This lists what has to change so the cart follows the rules again.
// Socket conflicts are NOT fixed here - the user has to choose which part to keep.
export function planCartFixes(lines) {
  const fixes = []

  lines.forEach((line) => {
    if (!line.product) {
      fixes.push({ id: line.id, action: 'remove', message: `Remove "${line.id}" (no longer listed)` })
      return
    }

    const { name, stock } = line.product
    const max = getMaxAllowed(stock)

    if (stock <= 0) {
      fixes.push({ id: line.id, action: 'remove', message: `Remove ${name} (sold out)` })
    } else if (line.qty > max) {
      fixes.push({
        id: line.id,
        action: 'lower',
        to: max,
        message: `Lower ${name} from ${line.qty} to ${max}`,
      })
    }
  })

  return fixes
}

// returns a NEW cart with the fixes applied (the old array is not changed)
export function applyCartFixes(cart, fixes) {
  return cart
    .filter((line) => !fixes.some((fix) => fix.id === line.id && fix.action === 'remove'))
    .map((line) => {
      const lower = fixes.find((fix) => fix.id === line.id && fix.action === 'lower')
      return lower ? { ...line, qty: lower.to } : line
    })
}
