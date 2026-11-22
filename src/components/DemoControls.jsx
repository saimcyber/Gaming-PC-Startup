import { useState } from 'react'
import { readDemoSettings, saveDemoSettings, DEFAULT_DEMO } from '../api/demoSettings.js'

// Clearly labelled testing panel (assignment asks for a way to show loading
// failure and changed availability). Not part of the real shop.
function DemoControls({ onChange }) {
  const [settings, setSettings] = useState(readDemoSettings)
  const [savedText, setSavedText] = useState('')

  function handleCheck(e) {
    const { name, checked } = e.target
    setSettings((prev) => ({ ...prev, [name]: checked }))
    setSavedText('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    saveDemoSettings(settings)
    // "fail next load" is used up by this reload, so untick it here too
    setSettings((prev) => ({ ...prev, failNextLoad: false }))
    setSavedText(
      settings.failNextLoad ? 'Saved. The next load will fail once, then Try again works.' : 'Saved. Reloading the parts list...'
    )
    onChange() // loads the parts list again with the new settings
  }

  function handleReset() {
    setSettings(DEFAULT_DEMO)
    saveDemoSettings(DEFAULT_DEMO)
    setSavedText('Back to normal. Reloading the parts list...')
    onChange()
  }

  // "fail next load" switches itself off after one failure, so read the
  // saved values again every time the panel is opened
  function handleToggle(e) {
    if (e.currentTarget.open) setSettings(readDemoSettings())
  }

  return (
    <details className="demo-controls" onToggle={handleToggle}>
      <summary>Demo controls (testing only)</summary>
      <form onSubmit={handleSubmit}>
        <p>These change the fake parts list so the error and edge cases can be checked. Saved in this browser.</p>
        <label>
          <input type="checkbox" name="failNextLoad" checked={settings.failNextLoad} onChange={handleCheck} />
          Fail the next load once (shows the error and Try again)
        </label>
        <label>
          <input type="checkbox" name="emptyCatalogue" checked={settings.emptyCatalogue} onChange={handleCheck} />
          Empty catalogue (shop has no parts listed)
        </label>
        <label>
          <input type="checkbox" name="stockDrop" checked={settings.stockDrop} onChange={handleCheck} />
          Stock drop (RTX 4060 sold out, Ryzen 5 7600 only 1 left, ASRock A620M removed)
        </label>
        <div className="demo-buttons">
          <button type="submit" className="btn btn-small btn-demo">
            Save and reload parts
          </button>
          <button type="button" className="btn btn-small btn-demo-plain" onClick={handleReset}>
            Reset to normal
          </button>
        </div>
        {savedText && (
          <p className="demo-saved" role="status">
            {savedText}
          </p>
        )}
      </form>
    </details>
  )
}

export default DemoControls
