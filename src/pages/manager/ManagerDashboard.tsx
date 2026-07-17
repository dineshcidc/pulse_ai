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
import ExpensePage from '../employee/expense/ExpensePage'
import MyAppraisalPage from '../employee/appraisal/MyAppraisalPage'
import TeamAppraisalsPage from './appraisal/TeamAppraisalsPage'

// Manager-only pages
import ProjectListPage from './projects/ProjectListPage'
import TeamDashboardPage from './projects/TeamDashboardPage'
import TeamTimesheetsPage from './projects/TeamTimesheetsPage'
import TeamLeaveRequestsPage from './projects/TeamLeaveRequestsPage'
import TeamAttendanceRequestsPage from './projects/TeamAttendanceRequestsPage'
import ProjectAnnouncementsPage from './projects/ProjectAnnouncementsPage'
import ManagerMyAssetsPage from './assets/ManagerMyAssetsPage'
import ManagerAssetRequestsPage from './assets/ManagerAssetRequestsPage'
import ManagerCreateAssetRequestPage from './assets/ManagerCreateAssetRequestPage'
import ManagerAssetRequestDetailsPage from './assets/ManagerAssetRequestDetailsPage'
import ManagerAssetRequestDetailsPage_Case1_ArjunMenon from './assets/ManagerAssetRequestDetailsPage_Case1_ArjunMenon'
import ManagerAssetRequestDetailsPage_Case2_RajeshKumar from './assets/ManagerAssetRequestDetailsPage_Case2_RajeshKumar'
import ManagerAssetRequestDetailsPage_Case3_SarahJohnson from './assets/ManagerAssetRequestDetailsPage_Case3_SarahJohnson'

interface ManagerAsset {
  id: string
  code: string
  category: string
  description: string
  dateFrom: string
}

interface ManagerAssetRequest {
  id: string
  requestId: string
  assetName: string
  assetCode: string
  category: string
  status: 'Pending' | 'Allocated'
  employeeName: string
  employeeCode: string
  requestedDate: string
  pendingWith?: 'System Admin' | 'Accepted' | 'Employee' | 'Manager'
}

const PAGE_LABELS: Record<string, string> = {
  'timesheet-add':     'Add Timesheet',
  'timesheet-history': 'Timesheet History',
  'leave-create':      'Create Leave Request',
  'leave-status':      'Leave Approval Status',
  'leave-history':     'Leave History',
  'my-profile':        'My Profile',
  'org-structure':     'Org Structure',
  'tickets':           'Tickets',
  'expense':           'Expense',
  'reports':           'Reports',
  'project-list':           'Project List',
  'team-dashboard':         'Team Dashboard',
  'team-timesheets':        'Team Timesheets',
  'team-leave':             'Team Leave Requests',
  'team-attendance':        'Team Attendance Request',
  'project-announcements':  'Project Announcements',
  'my-assets':              'My Assets',
  'team-asset-requests':    'Team Asset Requests',
  'create-asset-request':   'Create Asset Request',
  'asset-request-details':  'Request Details',
  'my-performance':          'My Performance',
  'team-appraisals':         'Team Appraisals',
  'team-appraisal-history':  'Appraisal History',
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

function PageContent({
  activeItem,
  onNavigate,
  myAssets,
  myRequests,
  teamRequests,
  onAddAsset,
  onAcceptRequest,
  onRequestCreated
}: {
  activeItem: string
  onNavigate: (id: string) => void
  myAssets: ManagerAsset[]
  myRequests: ManagerAssetRequest[]
  teamRequests: ManagerAssetRequest[]
  onAddAsset: (asset: ManagerAsset) => void
  onAcceptRequest: (requestId: string) => void
  onRequestCreated: (request: ManagerAssetRequest, selectedEmployee: string) => void
}) {
  // Shared employee pages
  if (activeItem === 'dashboard')        return <DashboardPage managerMode onNavigate={onNavigate} onNavigateTeam={onNavigate} />
  if (activeItem === 'timesheet-add')    return <AddTimesheetPage />
  if (activeItem === 'timesheet-history') return <TimesheetHistoryPage onNavigate={onNavigate} />
  if (activeItem === 'leave-create')     return <LeaveCreatePage />
  if (activeItem === 'leave-status')     return <LeaveStatusPage />
  if (activeItem === 'leave-history')    return <LeaveHistoryPage />
  if (activeItem === 'my-profile')       return <MyProfilePage />
  if (activeItem === 'org-structure')    return <OrgStructurePage />
  if (activeItem === 'tickets')          return <TicketsPage />
  if (activeItem === 'my-assets')            return <ManagerMyAssetsPage assets={myAssets} myRequests={myRequests} onAcceptRequest={onAcceptRequest} onNavigate={onNavigate} />
  if (activeItem === 'team-asset-requests')  return <ManagerAssetRequestsPage onAddAsset={onAddAsset} teamOnly teamRequests={teamRequests} onNavigate={onNavigate} />
  if (activeItem === 'create-asset-request') return <ManagerCreateAssetRequestPage onRequestCreated={onRequestCreated} onNavigate={onNavigate} />
  if (activeItem === 'asset-request-details') return <ManagerAssetRequestDetailsPage onNavigate={onNavigate} />
  if (activeItem === 'asset-request-details-case1') return <ManagerAssetRequestDetailsPage_Case1_ArjunMenon onNavigate={onNavigate} />
  if (activeItem === 'asset-request-details-case2') return <ManagerAssetRequestDetailsPage_Case2_RajeshKumar onNavigate={onNavigate} />
  if (activeItem === 'asset-request-details-case3') return <ManagerAssetRequestDetailsPage_Case3_SarahJohnson onNavigate={onNavigate} />
  if (activeItem === 'my-performance')   return <MyAppraisalPage onNavigate={onNavigate} assessorName="James Shower" />
  if (activeItem === 'team-appraisals')  return <TeamAppraisalsPage onNavigate={onNavigate} />
  if (activeItem === 'expense')          return <ExpensePage />
  if (activeItem === 'payroll')          return <PayrollPage />
  if (activeItem === 'reports')          return <ReportsPage />

  // Manager-only pages
  if (activeItem === 'project-list')          return <ProjectListPage />
  if (activeItem === 'team-dashboard')        return <TeamDashboardPage onNavigate={onNavigate} />
  if (activeItem === 'team-timesheets')       return <TeamTimesheetsPage />
  if (activeItem === 'team-leave')            return <TeamLeaveRequestsPage />
  if (activeItem === 'team-attendance')       return <TeamAttendanceRequestsPage />
  if (activeItem === 'project-announcements') return <ProjectAnnouncementsPage />

  return <ComingSoon id={activeItem} />
}

export default function ManagerDashboard({ onLogout }: { onLogout: () => void }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeItem, setActiveItem]   = useState('dashboard')
  const [myAssets, setMyAssets] = useState<ManagerAsset[]>([
    {
      id: 'ast-001',
      code: 'LT-2024-0042',
      category: 'Laptop',
      description: 'MacBook Pro 14" M2',
      dateFrom: '15/01/2024',
    },
    {
      id: 'ast-002',
      code: 'MN-2024-0089',
      category: 'Monitor',
      description: 'Dell 27" 4K Ultra HD',
      dateFrom: '15/01/2024',
    },
    {
      id: 'ast-003',
      code: 'AR-2026-0461',
      category: 'Mouse',
      description: 'HP LaserJet Printer',
      dateFrom: '20/03/2024',
    },
  ])

  const [myRequests, setMyRequests] = useState<ManagerAssetRequest[]>([
    {
      id: 'ar-010',
      requestId: 'AR-2026-0460',
      assetName: 'iPhone 15 Pro',
      assetCode: 'PH-2024-0215',
      category: 'Laptop',
      status: 'Allocated',
      employeeName: 'John Doe',
      employeeCode: 'CC001',
      requestedDate: '2026-06-15',
      pendingWith: 'Manager',
    },
    {
      id: 'ar-011',
      requestId: 'AR-2026-0461',
      assetName: 'HP LaserJet Printer',
      assetCode: 'PR-2024-0087',
      category: 'Mouse',
      status: 'Allocated',
      employeeName: 'John Doe',
      employeeCode: 'CC001',
      requestedDate: '2026-06-16',
      pendingWith: 'Accepted',
    },
    {
      id: 'ar-012',
      requestId: 'AR-2026-0462',
      assetName: 'Wireless Headphones',
      assetCode: 'AC-2024-0312',
      category: 'Laptop',
      status: 'Pending',
      employeeName: 'John Doe',
      employeeCode: 'CC001',
      requestedDate: '2026-06-17',
      pendingWith: 'System Admin',
    },
  ])

  const [teamRequests, setTeamRequests] = useState<ManagerAssetRequest[]>([
    {
      id: 'ar-002',
      requestId: 'AR-2026-0452',
      assetName: 'MacBook Pro 14" M3',
      assetCode: 'LT-2024-0156',
      category: 'IT Hardware',
      status: 'Pending',
      employeeName: 'Sarah Johnson',
      employeeCode: 'CC002',
      requestedDate: '2026-06-01',
      pendingWith: 'System Admin',
    },
    {
      id: 'ar-003',
      requestId: 'AR-2026-0453',
      assetName: 'Wireless Mouse & Keyboard',
      assetCode: 'AC-2024-0156',
      category: 'Monitor',
      status: 'Allocated',
      employeeName: 'Rajesh Kumar',
      employeeCode: 'CC003',
      requestedDate: '2026-06-02',
      pendingWith: 'Employee',
    },
    {
      id: 'ar-004',
      requestId: 'AR-2026-0454',
      assetName: 'Samsung 32" Monitor',
      assetCode: 'MN-2024-0145',
      category: 'IT Hardware',
      status: 'Pending',
      employeeName: 'Priya Sharma',
      employeeCode: 'CC004',
      requestedDate: '2026-06-03',
      pendingWith: 'System Admin',
    },
    {
      id: 'ar-005',
      requestId: 'AR-2026-0455',
      assetName: 'USB-C Docking Station',
      assetCode: 'AC-2024-0189',
      category: 'Monitor',
      status: 'Allocated',
      employeeName: 'Arjun Menon',
      employeeCode: 'CC005',
      requestedDate: '2026-06-04',
      pendingWith: 'Accepted',
    },
    {
      id: 'ar-006',
      requestId: 'AR-2026-0456',
      assetName: 'External SSD 1TB',
      assetCode: 'ST-2024-0203',
      category: 'IT Hardware',
      status: 'Pending',
      employeeName: 'Neha Patel',
      employeeCode: 'CC006',
      requestedDate: '2026-06-05',
      pendingWith: 'System Admin',
    },
    {
      id: 'ar-007',
      requestId: 'AR-2026-0457',
      assetName: 'Mechanical Keyboard',
      assetCode: 'AC-2024-0267',
      category: 'Monitor',
      status: 'Allocated',
      employeeName: 'Vikram Singh',
      employeeCode: 'CC007',
      requestedDate: '2026-06-06',
      pendingWith: 'Employee',
    },
    {
      id: 'ar-008',
      requestId: 'AR-2026-0458',
      assetName: 'Laptop Stand',
      assetCode: 'AC-2024-0298',
      category: 'Monitor',
      status: 'Pending',
      employeeName: 'Anjali Gupta',
      employeeCode: 'CC008',
      requestedDate: '2026-06-07',
      pendingWith: 'System Admin',
    },
  ])

  const handleAddAsset = (asset: ManagerAsset) => {
    setMyAssets(prev => [...prev, asset])
  }

  const handleAcceptRequest = (requestId: string) => {
    const request = myRequests.find(req => req.id === requestId)
    if (request) {
      // Add to My Assets
      handleAddAsset({
        id: request.id,
        code: request.assetCode,
        category: request.category,
        description: request.assetName,
        dateFrom: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      })
      // Keep request in My Requests (do not remove)
      // The acceptedRequestIds state will hide checkmark/close buttons and show eye icon only
    }
  }

  const handleCreateRequest = (newRequest: ManagerAssetRequest, selectedEmployee: string) => {
    if (selectedEmployee === 'myself') {
      // Add to My Requests
      setMyRequests(prev => [...prev, newRequest])
    } else {
      // Add to Team Requests
      setTeamRequests(prev => [...prev, newRequest])
    }
  }

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
          <PageContent activeItem={activeItem} onNavigate={setActiveItem} myAssets={myAssets} myRequests={myRequests} teamRequests={teamRequests} onAddAsset={handleAddAsset} onAcceptRequest={handleAcceptRequest} onRequestCreated={handleCreateRequest} />
        </main>
      </div>
    </div>
  )
}
