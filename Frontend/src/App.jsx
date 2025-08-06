import { useState } from 'react'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState('student')

  const handleLogin = (role) => {
    setUserRole(role)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />
  }

  return <Home userRole={userRole} onLogout={handleLogout} />
}
