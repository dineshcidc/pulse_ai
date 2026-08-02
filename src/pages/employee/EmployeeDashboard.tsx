import { useState } from 'react'
import Sidebar from '../../components/layout/Sidebar'
import Header from '../../components/layout/Header'
import DashboardPage from './dashboard/DashboardPage'
import AddTimesheetPage from './timesheet/AddTimesheetPage'
import TimesheetHistoryPage from './timesheet/TimesheetHistoryPage'
import LeaveCreatePage from './leave/LeaveCreatePage'
import LeaveStatusPage from './leave/LeaveStatusPage'
import LeaveHistoryPage from './leave/LeaveHistoryPage'
import MyProfilePage from './hrms/MyProfilePage'
import OrgStructurePage from './hrms/OrgStructurePage'
import TicketsPage from './hrms/TicketsPage'
import AssetManagementPage from './assets/AssetManagementPage'
import PayrollPage from './payroll/PayrollPage'
import ExpensePage from './expense/ExpensePage'
import ReportsPage from './reports/ReportsPage'
import MyAppraisalPage from './appraisal/MyAppraisalPage'
import OffboardingPage from './offboarding/OffboardingPage'
import MyProbationPage from './probation/MyProbationPage'
// Admin "Management" pages — reused for the System Admin role
import AdminTicketsPage from '../admin/tickets/AdminTicketsPage'
import AdminAssetManagementPage from '../admin/assets/AdminAssetManagementPage'
import AdminAssetsListPage from '../admin/assets/AdminAssetsListPage'
import AdminAddAssetPage from '../admin/assets/AdminAddAssetPage'
import AdminUploadBulkAssetsPage from '../admin/assets/AdminUploadBulkAssetsPage'
import AdminAssetsRequestPage from '../admin/assets/AdminAssetsRequestPage'

const PAGE_LABELS: Record<string, string> = {
  'timesheet-add':     'Add Timesheet',
  'timesheet-history': 'Timesheet History',
  'leave-create':  'Create Leave Request',
  'leave-status':  'Leave Approval Status',
  'leave-history': 'Leave History',
  'my-profile':    'My Profile',
  'org-structure': 'Org Structure',
  tickets:         'Tickets',
  expense:         'Expense',
  reports:         'Reports',
  'performance-appraisal': 'Performance Appraisal',
  'appraisal-self-assessment': 'KPI Self-Assessment',
  offboarding: 'Employee Offboarding',
  probation:   'My Probation',
  'admin-tickets':      'Support Tickets',
  'expense-management': 'Expense',
  'assets-list':        'Assets List',
  'admin-assets':       'Asset Allocation',
  'assets-request':     'Assets Request',
}

function ComingSoon({ id }: { id: string }) {
  const label = PAGE_LABELS[id] ?? id
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div className="mb-5">
        <h1 className="text-xl font-bold" style={{ color: '#1C2035' }}>{label}</h1>
        <p className="text-sm mt-0.5" style={{ color: '#8B90A7' }}>
          Manage your {label.toLowerCase()} here
        </p>
      </div>
      <div
        className="rounded-2xl flex items-center justify-center"
        style={{ background: '#fff', border: '1px solid #E4E6EF', minHeight: 320 }}
      >
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
            style={{ background: '#F0F2F8' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8B90A7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <p className="text-sm font-semibold" style={{ color: '#1C2035' }}>{label}</p>
          <p className="text-xs mt-1" style={{ color: '#8B90A7' }}>Coming soon</p>
        </div>
      </div>
    </div>
  )
}

function PageContent({ activeItem, onNavigate }: { activeItem: string; onNavigate: (id: string) => void }) {
  if (activeItem === 'dashboard')       return <DashboardPage onNavigate={onNavigate} />
  if (activeItem === 'performance-appraisal') return <MyAppraisalPage onNavigate={onNavigate} />
  if (activeItem === 'timesheet-add')     return <AddTimesheetPage />
  if (activeItem === 'timesheet-history') return <TimesheetHistoryPage onNavigate={onNavigate} />
  if (activeItem === 'leave-create') return <LeaveCreatePage onNavigate={onNavigate} />
  if (activeItem === 'leave-status') return <LeaveStatusPage />
  if (activeItem === 'leave-history') return <LeaveHistoryPage />
  if (activeItem === 'my-profile')    return <MyProfilePage />
  if (activeItem === 'org-structure') return <OrgStructurePage />
  if (activeItem === 'tickets')       return <TicketsPage />
  if (activeItem === 'assets')        return <AssetManagementPage />
  if (activeItem === 'expense')       return <ExpensePage />
  if (activeItem === 'reports')       return <ReportsPage />
  if (activeItem === 'payroll')       return <PayrollPage />
  if (activeItem === 'offboarding')   return <OffboardingPage />
  if (activeItem === 'probation')     return <MyProbationPage />
  // Admin "Management" pages (System Admin role)
  if (activeItem === 'admin-tickets')      return <AdminTicketsPage allowedTypes={['System Admin']} />
  if (activeItem === 'admin-assets')       return <AdminAssetManagementPage onNavigate={onNavigate} />
  if (activeItem === 'assets-list')        return <AdminAssetsListPage onNavigate={onNavigate} />
  if (activeItem === 'add-asset')          return <AdminAddAssetPage onBack={() => onNavigate('assets-list')} onSave={() => onNavigate('assets-list')} />
  if (activeItem === 'upload-bulk-assets') return <AdminUploadBulkAssetsPage onBack={() => onNavigate('assets-list')} />
  if (activeItem === 'assets-request')     return <AdminAssetsRequestPage />
  return <ComingSoon id={activeItem} />
}

export default function EmployeeDashboard({ onLogout, role = 'employee' }: { onLogout: () => void; role?: 'employee' | 'sysadmin' }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeItem, setActiveItem]   = useState('dashboard')

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: '#F0F2F8', fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <Sidebar
        isOpen={sidebarOpen}
        activeItem={activeItem}
        onNavigate={setActiveItem}
        onLogout={onLogout}
        role={role}
      />

      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Header
          isSidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(p => !p)}
          onNavigate={setActiveItem}
          onLogout={onLogout}
          userRole={role === 'sysadmin' ? 'System Admin' : 'Employee'}
        />

        <main className="flex-1 overflow-auto py-6 px-8 scrollbar-hide">
          <PageContent activeItem={activeItem} onNavigate={setActiveItem} />
        </main>
      </div>
    </div>
  )
}
