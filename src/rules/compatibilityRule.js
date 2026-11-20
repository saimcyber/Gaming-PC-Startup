// RULE 2 - eligibility / compatibility
// If the cart has a CPU and a motherboard, their sockets must be the same
// (AM5 CPU needs an AM5 board, LGA1700 CPU needs an LGA1700 board).
// A cart with only a CPU or only a board is fine - maybe they already own the other part.

// products = array of product objects that are in the cart
export function findSocketConflicts(products) {
  const cpus = products.filter((p) => p.category === 'CPU')
  const boards = products.filter((p) => p.category === 'Motherboard')

  const conflicts = []
  cpus.forEach((cpu) => {
    boards.forEach((board) => {
      if (cpu.socket !== board.socket) {
        conflicts.push({
          cpuId: cpu.id,
          boardId: board.id,
          message: `${cpu.name} (${cpu.socket}) will not fit the ${board.name} (${board.socket}).`,
        })
      }
    })
  })

  return { ok: conflicts.length === 0, conflicts }
}

// used on the details page: would adding this product clash with the cart?
export function wouldConflict(product, cartProducts) {
  if (product.category !== 'CPU' && product.category !== 'Motherboard') return null
  const others = cartProducts.filter((p) => p.id !== product.id)
  const result = findSocketConflicts([...others, product])
  return result.ok ? null : result.conflicts[0].message
}
