// maps the image key used in products.js to the actual svg file.
// importing them lets Vite add the correct /Gaming-PC-Startup/ base path.
import cpu from './products/cpu.svg'
import motherboard from './products/motherboard.svg'
import gpu from './products/gpu.svg'
import ram from './products/ram.svg'
import ssd from './products/ssd.svg'
import caseImg from './products/case.svg'
import keyboard from './products/keyboard.svg'
import mouse from './products/mouse.svg'

const productImages = {
  cpu,
  motherboard,
  gpu,
  ram,
  ssd,
  case: caseImg,
  keyboard,
  mouse,
}

export default productImages
