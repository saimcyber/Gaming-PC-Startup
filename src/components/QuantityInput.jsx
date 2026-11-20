// - [ 2 ] + control. value is kept as a string by the parent so the user
// can clear the box and type a new number without it jumping back.
function QuantityInput({ id, value, max, onChange, describedBy, invalid }) {
  const number = parseInt(value, 10)

  function step(change) {
    const current = Number.isNaN(number) ? 0 : number
    onChange(String(Math.max(1, current + change)))
  }

  return (
    <div className="qty-input">
      <button
        type="button"
        onClick={() => step(-1)}
        disabled={!Number.isNaN(number) && number <= 1}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min="1"
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={describedBy}
        aria-invalid={invalid ? 'true' : 'false'}
      />
      <button
        type="button"
        onClick={() => step(1)}
        disabled={!Number.isNaN(number) && number >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  )
}

export default QuantityInput
