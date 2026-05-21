import { useState } from 'react'
import LoginPage from './pages/auth/LoginPage'
import EmployeeDashboard from './pages/employee/EmployeeDashboard'

type Page = 'login' | 'employee-dashboard'

function App() {
  const [page, setPage] = useState<Page>('login')

  if (page === 'employee-dashboard') {
    return <EmployeeDashboard onLogout={() => setPage('login')} />
  }

  return <LoginPage onLoginSuccess={() => setPage('employee-dashboard')} />
}

export default App
