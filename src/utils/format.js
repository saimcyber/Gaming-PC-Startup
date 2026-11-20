export function formatPrice(amount) {
  return 'Rs ' + Number(amount).toLocaleString('en-PK')
}

export function warrantyText(months) {
  if (!months) return 'Not listed - ask at the shop'
  if (months === 1) return '1 month (shop check)'
  if (months % 12 === 0) {
    const years = months / 12
    return years === 1 ? '1 year' : `${years} years`
  }
  return `${months} months`
}

// "1 item" / "3 items"
export function itemsText(count) {
  return count === 1 ? '1 item' : `${count} items`
}
