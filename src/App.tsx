import { useState } from 'react'
import LoginPage from './pages/auth/LoginPage'
import EmployeeDashboard from './pages/employee/EmployeeDashboard'
import ManagerDashboard from './pages/manager/ManagerDashboard'

type Page = 'login' | 'employee-dashboard' | 'manager-dashboard'

function App() {
  const [page, setPage] = useState<Page>('login')

  if (page === 'employee-dashboard') {
    return <EmployeeDashboard onLogout={() => setPage('login')} />
  }

  if (page === 'manager-dashboard') {
    return <ManagerDashboard onLogout={() => setPage('login')} />
  }

  return (
    <LoginPage
      onLoginSuccess={(role) => {
        if (role === 'manager') setPage('manager-dashboard')
        else setPage('employee-dashboard')
      }}
    />
  )
}

export default App
