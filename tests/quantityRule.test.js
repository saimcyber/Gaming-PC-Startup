// Test for RULE 1 (availability): 1 to 3 of a part per order, and never more
// than the stock. This is the same checkQuantity() the app uses in
// AddToCartPanel, ProductCard and the cart.
// Run with:  npm test   (or  node --test)

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { checkQuantity, getMaxAllowed, MAX_PER_ORDER } from '../src/rules/quantityRule.js'

test('the limit is 3 per order', () => {
  assert.equal(MAX_PER_ORDER, 3)
})

test('valid: 2 of a part with plenty of stock is allowed', () => {
  const result = checkQuantity(2, 10)
  assert.equal(result.ok, true)
  assert.equal(result.max, 3)
  assert.equal(result.message, '')
})

test('boundary: exactly 3 (the limit) is still allowed', () => {
  const result = checkQuantity(3, 10)
  assert.equal(result.ok, true)
  assert.equal(result.max, 3)
})

test('breaks the rule: 4 is more than the per-order limit', () => {
  const result = checkQuantity(4, 10)
  assert.equal(result.ok, false)
  assert.equal(result.max, 3)
  assert.equal(result.message, 'You can order at most 3 of this part (the limit is 3 per order).')
})

test('stock is lower than the limit: 2 left, so 2 is ok but 3 is not', () => {
  assert.equal(checkQuantity(2, 2).ok, true)

  const result = checkQuantity(3, 2)
  assert.equal(result.ok, false)
  assert.equal(result.max, 2)
  assert.match(result.message, /only 2 left in stock/)
})

test('out of stock: nothing can be ordered', () => {
  const result = checkQuantity(1, 0)
  assert.equal(result.ok, false)
  assert.equal(result.max, 0)
  assert.equal(result.message, 'This part is out of stock.')
})

test('0, negative and decimal quantities are rejected', () => {
  for (const bad of [0, -1, 1.5, NaN]) {
    const result = checkQuantity(bad, 10)
    assert.equal(result.ok, false, `quantity ${bad} should fail`)
    assert.equal(result.message, 'Quantity must be a whole number, at least 1.')
  }
})

test('getMaxAllowed uses whichever is smaller: the limit or the stock', () => {
  assert.equal(getMaxAllowed(10), 3)
  assert.equal(getMaxAllowed(3), 3)
  assert.equal(getMaxAllowed(1), 1)
  assert.equal(getMaxAllowed(0), 0)
})
