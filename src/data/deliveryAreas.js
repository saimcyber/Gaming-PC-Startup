// Where we deliver. Fee is in PKR.
// 'outside' is kept in the list so the user can pick it and get a clear
// "we don't deliver there yet" message instead of just not finding their area.

const deliveryAreas = [
  { id: 'isb-campus', name: 'Islamabad - H-8 to H-12 and G sectors', fee: 200, served: true },
  { id: 'isb-other', name: 'Islamabad - F, E, I and D sectors', fee: 350, served: true },
  { id: 'rwp', name: 'Rawalpindi - Saddar, Satellite Town, Bahria Town', fee: 450, served: true },
  { id: 'outside', name: 'Somewhere else (outside Islamabad / Rawalpindi)', fee: 0, served: false },
]

export const PICKUP_POINT = 'Shop 14, Lower Ground, Byte Arcade, G-9 Markaz, Islamabad'

export default deliveryAreas
