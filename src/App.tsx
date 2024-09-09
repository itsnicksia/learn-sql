import './App.css'
import {SQLConsole} from './SQLConsole.tsx'

function App() {
  return (
    <>
      <div style={{width: "100%", height: "800px"}}>
        <h1>Act 1: Learning SQL</h1>
        <h2>Run a query that just returns a single row with a single column that has the value "1".</h2>
        <SQLConsole/>
      </div>
    </>
  )
}

export default App
