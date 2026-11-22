import { PICKUP_POINT } from '../data/deliveryAreas.js'
import DemoControls from './DemoControls.jsx'

function Footer({ onDemoChange }) {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <p className="footer-title">HostelRig</p>
          <p>{PICKUP_POINT}</p>
          <p>Open Mon - Sat, 11 am to 8 pm</p>
        </div>
        <p className="footer-note">
          Student project for CS4032 Web Programming. HostelRig is a made-up shop - orders on this site are
          simulated and nothing is charged.
        </p>
      </div>
      <div className="container">
        <DemoControls onChange={onDemoChange} />
      </div>
    </footer>
  )
}

export default Footer
