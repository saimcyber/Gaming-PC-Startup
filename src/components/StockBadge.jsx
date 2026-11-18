// stock is always written in words, not only shown with a colour
function StockBadge({ stock }) {
  if (stock === 0) {
    return <span className="badge badge-out">Out of stock</span>
  }
  if (stock <= 2) {
    return <span className="badge badge-low">Only {stock} left</span>
  }
  return <span className="badge badge-in">In stock ({stock})</span>
}

export default StockBadge
