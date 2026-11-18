import { Link } from 'react-router-dom'
import deliveryAreas, { PICKUP_POINT } from '../data/deliveryAreas.js'
import usePageTitle from '../hooks/usePageTitle.js'
import { formatPrice } from '../utils/format.js'

const QUICK_CATEGORIES = ['CPU', 'Motherboard', 'Graphics card', 'RAM', 'Storage', 'Peripherals']

function HomePage() {
  usePageTitle('')

  const servedAreas = deliveryAreas.filter((area) => area.served)

  return (
    <div className="container page">
      <section className="hero">
        <h1>Budget PC parts for students in Islamabad &amp; Rawalpindi</h1>
        <p>
          Building your first gaming PC in the hostel, or just need more RAM before finals? Check prices and stock
          here, then get it delivered or pick it up from our shop in G-9 Markaz.
        </p>
        <Link to="/products" className="btn btn-primary btn-large">
          Browse parts
        </Link>
      </section>

      <section aria-labelledby="cat-heading">
        <h2 id="cat-heading">Shop by category</h2>
        <ul className="category-links">
          {QUICK_CATEGORIES.map((cat) => (
            <li key={cat}>
              <Link to={`/products?cat=${encodeURIComponent(cat)}`}>{cat}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="home-columns">
        <div>
          <h2>How it works</h2>
          <ol className="steps">
            <li>Search the parts list and check the stock before you decide.</li>
            <li>Add parts to your cart. We warn you if a CPU and motherboard don't fit together.</li>
            <li>Choose delivery or free pickup and place the order. You pay when you get it.</li>
          </ol>
        </div>

        <div>
          <h2>Delivery areas</h2>
          <table className="simple-table">
            <caption className="sr-only">Delivery fee by area</caption>
            <thead>
              <tr>
                <th scope="col">Area</th>
                <th scope="col">Fee</th>
              </tr>
            </thead>
            <tbody>
              {servedAreas.map((area) => (
                <tr key={area.id}>
                  <td>{area.name}</td>
                  <td>{formatPrice(area.fee)}</td>
                </tr>
              ))}
              <tr>
                <td>Pickup from the shop</td>
                <td>Free</td>
              </tr>
            </tbody>
          </table>
          <p className="muted">Pickup point: {PICKUP_POINT}</p>
        </div>
      </section>
    </div>
  )
}

export default HomePage
