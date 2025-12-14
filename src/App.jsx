import { useState } from 'react'
import './styles/dateInput.css'
import './styles/cat.css'
import './App.css'
import CycleToday from './CycleToday'
import CatBuddy from './CatBuddy'

function App() {
  const [phaseKey, setPhaseKey] = useState(null); // menstruation/follicular/...

  return (
    <div className="app-root">
      <CycleToday onPhaseChange={setPhaseKey} />
      <CatBuddy phaseKey={phaseKey} />
    </div>
  );
}

export default App;
