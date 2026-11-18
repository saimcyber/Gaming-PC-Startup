// shown instead of a page while the parts list is loading or if loading failed
function LoadStatus({ status, errorMessage, onRetry }) {
  if (status === 'loading') {
    return (
      <div className="status-box" role="status">
        <div className="spinner" aria-hidden="true"></div>
        <p>Loading parts...</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="status-box status-error" role="alert">
        <h2>Couldn't load the parts list</h2>
        <p>{errorMessage}</p>
        <p>Your cart is saved, so you won't lose anything by trying again.</p>
        <button type="button" className="btn btn-primary" onClick={onRetry}>
          Try again
        </button>
      </div>
    )
  }

  return null
}

export default LoadStatus
