// SIMULATED order. Nothing is sent anywhere and nothing is charged.
// it waits a moment (like a real request) and returns an order number.

const FAKE_DELAY_MS = 900

export function placeOrder(order) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orderNumber = 'HR-' + Date.now().toString().slice(-6)
      resolve({ ...order, orderNumber, placedAt: new Date().toISOString() })
    }, FAKE_DELAY_MS)
  })
}
