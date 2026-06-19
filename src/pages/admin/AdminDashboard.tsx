import { useState } from 'react'
import Sidebar from '../../components/layout/Sidebar'
import Header from '../../components/layout/Header'
import AdminDashboardPage from './dashboard/AdminDashboardPage'
import AdminProfilePage from './AdminProfilePage'
import AllUsersPage from './users/AllUsersPage'
import AddEmployeePage from './users/AddEmployeePage'
import RoleAccessPage from './users/RoleAccessPage'
import AllLeaveRequestsPage from './leave/AllLeaveRequestsPage'
import LeaveBalancePage from './leave/LeaveBalancePage'
import AllTimesheetsPage from './timesheet/AllTimesheetsPage'
import PendingTimesheetsPage from './timesheet/PendingTimesheetsPage'
import AdminProjectsPage from './projects/AdminProjectsPage'
import DepartmentManagementPage from './projects/DepartmentManagementPage'
import AdminOrgStructurePage from './AdminOrgStructurePage'
import AttendanceReportPage from './reports/AttendanceReportPage'
import LeaveReportPage from './reports/LeaveReportPage'
import AuditTrailPage from './reports/AuditTrailPage'
import OrgProfileWrapperPage from './settings/OrgProfileWrapperPage'
import WorkingHoursPage from './settings/WorkingHoursPage'
import AdminAnnouncementsPage from './settings/AdminAnnouncementsPage'
import RewardsAndRecognitionPage from './settings/RewardsAndRecognitionPage'
import PendingApprovalsPage from './timesheet/PendingApprovalsPage'
import TimesheetPoliciesPage from './timesheet/TimesheetPoliciesPage'
import AdminTicketsPage from './tickets/AdminTicketsPage'
import LeavePolicyPage from './leave/LeavePolicyPage'
import DesignationPage from './users/DesignationPage'
import PayrollBAPage from './payroll/PayrollBAPage'
import AdminAssetManagementPage from './assets/AdminAssetManagementPage'

const PAGE_LABELS: Record<string, string> = {
  'my-profile':           'My Profile',
  'admin-dashboard':      'Dashboard',
  'all-users':            'All Users',
  'add-employee':         'Add Employee',
  'role-access':          'Role & Access Control',
  'leave-policy':         'Leave Policy Setup',
  'all-leave-requests':   'All Leave Requests',
  'leave-calendar':       'Leave Calendar',
  'leave-balance':        'Leave Balance Overview',
  'all-timesheets':       'Timesheet Report',
  'pending-timesheets':   'Pending Timesheets',
  'pending-approvals':    'Pending Approvals',
  'timesheet-policies':   'Timesheet Policies',
  'department-management':'Department',
  'project-setup':        'Projects',
  'team-allocation':      'Team Allocation',
  'admin-org':            'Org Structure',
  'attendance-report':    'Attendance Report',
  'leave-report':         'Leave Report',
  'audit-trail':          'Audit Trail',
  'org-profile':          'Organization Profile',
  'working-hours':        'Working Hours & Holidays',
  'email-notifications':  'Email Notifications',
  'announcements':        'Announcements',
  'rewards-recognition':  'Rewards and Recognition',
  'admin-tickets':        'Support Tickets',
  'designation':          'Designation Management',
  'admin-payroll':        'Payroll',
  'admin-assets':         'Asset Management',
}

function ComingSoon({ id }: { id: string }) {
  const label = PAGE_LABELS[id] ?? id
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div className="mb-5">
        <h1 className="text-xl font-bold" style={{ color: '#1C2035' }}>{label}</h1>
        <p className="text-sm mt-0.5" style={{ color: '#8B90A7' }}>
          Manage {label.toLowerCase()} here
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
  if (activeItem === 'my-profile')       return <AdminProfilePage />
  if (activeItem === 'admin-dashboard') return <AdminDashboardPage onNavigate={onNavigate} />
  if (activeItem === 'all-users')       return <AllUsersPage onNavigate={onNavigate} />
  if (activeItem === 'add-employee')    return <AddEmployeePage />
  if (activeItem === 'role-access')          return <RoleAccessPage />
  if (activeItem === 'all-leave-requests')   return <AllLeaveRequestsPage />
  if (activeItem === 'leave-balance')        return <LeaveBalancePage />
  if (activeItem === 'all-timesheets')       return <AllTimesheetsPage />
  if (activeItem === 'pending-timesheets')   return <PendingTimesheetsPage />
  if (activeItem === 'pending-approvals')    return <PendingApprovalsPage />
  if (activeItem === 'timesheet-policies')   return <TimesheetPoliciesPage />
  if (activeItem === 'project-setup')          return <AdminProjectsPage />
  if (activeItem === 'department-management')  return <DepartmentManagementPage />
  if (activeItem === 'admin-org')              return <AdminOrgStructurePage />
  if (activeItem === 'attendance-report')      return <AttendanceReportPage />
  if (activeItem === 'leave-report')            return <LeaveReportPage />
  if (activeItem === 'audit-trail')             return <AuditTrailPage />
  if (activeItem === 'org-profile')            return <OrgProfileWrapperPage />
  if (activeItem === 'working-hours')          return <WorkingHoursPage />
  if (activeItem === 'announcements')          return <AdminAnnouncementsPage />
  if (activeItem === 'rewards-recognition')    return <RewardsAndRecognitionPage />
  if (activeItem === 'admin-tickets')          return <AdminTicketsPage />
  if (activeItem === 'leave-policy')           return <LeavePolicyPage />
  if (activeItem === 'designation')            return <DesignationPage />
  if (activeItem === 'admin-payroll')          return <PayrollBAPage />
  if (activeItem === 'admin-assets')           return <AdminAssetManagementPage />
  return <ComingSoon id={activeItem} />
}

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeItem, setActiveItem]   = useState('admin-dashboard')

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
        role="admin"
      />

      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Header
          isSidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(p => !p)}
          onNavigate={setActiveItem}
          onLogout={onLogout}
          userRole="Admin"
        />

        <main className="flex-1 overflow-auto py-6 px-8 scrollbar-hide">
          <PageContent activeItem={activeItem} onNavigate={setActiveItem} />
        </main>
      </div>
    </div>
  )
}
