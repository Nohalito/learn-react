// DOM
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Pages
import Home from './pages/Home';

function App() {
  return(
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path='/home' element={<Home />} />

        {/* Redirect */}
        <Route path='/' element={<Navigate to='/home' replace />} />
      </Routes>
    
    </BrowserRouter>
  )
}


export default App
