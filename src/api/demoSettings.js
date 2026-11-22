// Demo settings for testing the edge cases (loading failure and changed stock).
// They are saved in localStorage under "hostelrig-demo" and read by the fake
// loader, the same way a real shop's server data could change between visits.
// They can be changed from "Demo controls" at the bottom of every page.

import { readJSON, writeJSON } from '../utils/storage.js'

export const DEMO_KEY = 'hostelrig-demo'

export const DEFAULT_DEMO = {
  failNextLoad: false, // next load of the parts list fails once
  emptyCatalogue: false, // the shop has no parts listed at all
  stockDrop: false, // some parts sell out / are removed (see STOCK_DROP)
}

// what "stock drop" changes. try it with these parts in your cart.
export const STOCK_DROP = {
  newStock: {
    'gpu-rtx4060-ventus': 0, // sold out
    'cpu-ryzen5-7600': 1, // only 1 left
  },
  removed: ['mb-asrock-a620m'], // not sold any more
}

export function readDemoSettings() {
  const saved = readJSON(DEMO_KEY, {})
  return { ...DEFAULT_DEMO, ...(saved && typeof saved === 'object' ? saved : {}) }
}

export function saveDemoSettings(settings) {
  writeJSON(DEMO_KEY, settings)
}
