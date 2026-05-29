import { useState } from 'react'
import Sidebar from '../../components/layout/Sidebar'
import Header from '../../components/layout/Header'

// Reuse all employee pages for shared modules
import DashboardPage from '../employee/dashboard/DashboardPage'
import AddTimesheetPage from '../employee/timesheet/AddTimesheetPage'
import TimesheetHistoryPage from '../employee/timesheet/TimesheetHistoryPage'
import LeaveCreatePage from '../employee/leave/LeaveCreatePage'
import LeaveStatusPage from '../employee/leave/LeaveStatusPage'
import LeaveHistoryPage from '../employee/leave/LeaveHistoryPage'
import MyProfilePage from '../employee/hrms/MyProfilePage'
import OrgStructurePage from '../employee/hrms/OrgStructurePage'
import TicketsPage from '../employee/hrms/TicketsPage'
import PayrollPage from '../employee/payroll/PayrollPage'
import ReportsPage from '../employee/reports/ReportsPage'

// Manager-only pages
import ProjectListPage from './projects/ProjectListPage'
import TeamDashboardPage from './projects/TeamDashboardPage'
import TeamTimesheetsPage from './projects/TeamTimesheetsPage'
import TeamLeaveRequestsPage from './projects/TeamLeaveRequestsPage'
import ProjectAnnouncementsPage from './projects/ProjectAnnouncementsPage'

const PAGE_LABELS: Record<string, string> = {
  'timesheet-add':     'Add Timesheet',
  'timesheet-history': 'Timesheet History',
  'leave-create':      'Create Leave Request',
  'leave-status':      'Leave Approval Status',
  'leave-history':     'Leave History',
  'my-profile':        'My Profile',
  'org-structure':     'Org Structure',
  'tickets':           'Tickets',
  'reports':           'Reports',
  'project-list':           'Project List',
  'team-dashboard':         'Team Dashboard',
  'team-timesheets':        'Team Timesheets',
  'team-leave':             'Team Leave Requests',
  'project-announcements':  'Project Announcements',
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
  // Shared employee pages
  if (activeItem === 'dashboard')        return <DashboardPage managerMode onNavigateTeam={onNavigate} />
  if (activeItem === 'timesheet-add')    return <AddTimesheetPage />
  if (activeItem === 'timesheet-history') return <TimesheetHistoryPage onNavigate={onNavigate} />
  if (activeItem === 'leave-create')     return <LeaveCreatePage />
  if (activeItem === 'leave-status')     return <LeaveStatusPage />
  if (activeItem === 'leave-history')    return <LeaveHistoryPage />
  if (activeItem === 'my-profile')       return <MyProfilePage />
  if (activeItem === 'org-structure')    return <OrgStructurePage />
  if (activeItem === 'tickets')          return <TicketsPage />
  if (activeItem === 'payroll')          return <PayrollPage />
  if (activeItem === 'reports')          return <ReportsPage />

  // Manager-only pages
  if (activeItem === 'project-list')          return <ProjectListPage />
  if (activeItem === 'team-dashboard')        return <TeamDashboardPage onNavigate={onNavigate} />
  if (activeItem === 'team-timesheets')       return <TeamTimesheetsPage />
  if (activeItem === 'team-leave')            return <TeamLeaveRequestsPage />
  if (activeItem === 'project-announcements') return <ProjectAnnouncementsPage />

  return <ComingSoon id={activeItem} />
}

export default function ManagerDashboard({ onLogout }: { onLogout: () => void }) {
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
        role="manager"
      />

      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Header
          isSidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(p => !p)}
          onNavigate={setActiveItem}
          onLogout={onLogout}
          userRole="Project Manager"
        />

        <main className="flex-1 overflow-auto py-6 px-8 scrollbar-hide">
          <PageContent activeItem={activeItem} onNavigate={setActiveItem} />
        </main>
      </div>
    </div>
  )
}
