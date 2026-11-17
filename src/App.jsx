import products from './data/products.js'
import deliveryAreas from './data/deliveryAreas.js'

// temporary page just to check the data is correct before
// building the real routes and components
function App() {
  return (
    <main className="container">
      <h1>HostelRig</h1>
      <p>PC parts for university students in Islamabad and Rawalpindi.</p>

      <h2>Products ({products.length})</h2>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} - Rs {p.price.toLocaleString('en-PK')} ({p.stock} in stock)
          </li>
        ))}
      </ul>

      <h2>Delivery areas</h2>
      <ul>
        {deliveryAreas.map((area) => (
          <li key={area.id}>
            {area.name} {area.served ? `- Rs ${area.fee}` : '- not served'}
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
