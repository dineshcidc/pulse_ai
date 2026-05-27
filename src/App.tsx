import { useState } from 'react'
import LoginPage from './pages/auth/LoginPage'
import EmployeeDashboard from './pages/employee/EmployeeDashboard'
import ManagerDashboard from './pages/manager/ManagerDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'

type Page = 'login' | 'employee-dashboard' | 'manager-dashboard' | 'admin-dashboard'

function App() {
  const [page, setPage] = useState<Page>('login')

  if (page === 'employee-dashboard') {
    return <EmployeeDashboard onLogout={() => setPage('login')} />
  }

  if (page === 'manager-dashboard') {
    return <ManagerDashboard onLogout={() => setPage('login')} />
  }

  if (page === 'admin-dashboard') {
    return <AdminDashboard onLogout={() => setPage('login')} />
  }

  return (
    <LoginPage
      onLoginSuccess={(role) => {
        if (role === 'manager') setPage('manager-dashboard')
        else if (role === 'admin') setPage('admin-dashboard')
        else setPage('employee-dashboard')
      }}
    />
  )
}

export default App
