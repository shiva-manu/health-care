import Dashboard from './components/dashboard';
import Custamize from './components/custamize';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import './App.css'

function App() {

  return (
    <div style={{backgroundColor:"lightpink"}}>
    <BrowserRouter>
    <Routes>
      <Route path='/dashboard' element={< Dashboard/>}></Route>
      <Route path="/custamize" element={<Custamize/>}></Route>
    </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
