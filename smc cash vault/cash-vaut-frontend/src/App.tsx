import { useState } from 'react'
import TradingPlan from './TradingPlan'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <TradingPlan />
  )
}

export default App
