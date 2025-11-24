import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Button from './components/Button'
import Select from './components/Select'

function App() {
  const [count, setCount] = useState(0)
  const [selectedColor, setSelectedColor] = useState('')

  const colorOptions = {
    'Red': 'red',
    'Blue': 'blue',
    'Green': 'green',
    'Yellow': 'yellow',
    'Purple': 'purple',
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <Button
          title={`count is ${count}`}
          onClick={() => setCount((count) => count + 1)}
        />
        <div style={{ marginTop: '20px' }}>
          <Select
            options={colorOptions}
            onChange={setSelectedColor}
            value={selectedColor}
            placeholder="Select a color"
          />
          {selectedColor && <p>Selected color: {selectedColor}</p>}
        </div>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
