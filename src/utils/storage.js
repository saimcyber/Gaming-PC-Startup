// small wrappers around localStorage. reading can fail (private mode,
// storage turned off, someone edited the value by hand) so we never let
// that crash the app - we just fall back to the default value.

export const CART_KEY = 'hostelrig-cart'
export const LAST_ORDER_KEY = 'hostelrig-last-order'

export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage full or blocked - the app still works, it just won't remember
  }
}

// only keep lines that look like { id: string, qty: number }
export function readSavedCart() {
  const saved = readJSON(CART_KEY, [])
  if (!Array.isArray(saved)) return []
  return saved
    .filter((line) => line && typeof line.id === 'string' && Number.isInteger(line.qty) && line.qty > 0)
    .map(({ id, qty }) => ({ id, qty }))
}
