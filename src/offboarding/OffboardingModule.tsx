import { useState } from 'react'
import { DoorOpen } from 'lucide-react'
import Header from '../components/layout/Header'
import OffboardingSidebar from './OffboardingSidebar'
import OffboardingRequestPage from './employee/OffboardingRequestPage'
import MyOffboardingPage from './employee/MyOffboardingPage'
import CTOApprovalsModule from './cto/CTOApprovalsModule'
import ManagerClearanceModule from './manager/ManagerClearanceModule'
import ITClearanceModule from './systemadmin/ITClearanceModule'
import FinanceClearanceModule from './finance/FinanceClearanceModule'
import HRDashboardModule from './hr/HRDashboardModule'
import InitiateOffboardingPage from './hr/InitiateOffboardingPage'

/*
 * Standalone Employee Offboarding module.
 *
 * Opened in its own browser tab (via ?module=offboarding). It reuses the main
 * app's Header and mirrors its Sidebar so the look is identical to the Employee
 * portal, but it lives on its own so the ENTIRE offboarding journey (every role)
 * can be designed and demoed in one place.
 *
 * For now: logo + EMPLOYEE section in the sidebar, and a welcome placeholder in
 * the content area. Role-wise menus and screens come next.
 */

// Return to the login page in this tab (drops the ?module=offboarding param).
function goToLogin() {
  window.location.href = window.location.pathname
}

function WelcomePlaceholder() {
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div className="mb-5">
        <h1 className="text-xl font-bold" style={{ color: '#1C2035' }}>Employee Offboarding</h1>
        <p className="text-sm mt-0.5" style={{ color: '#8B90A7' }}>
          The complete offboarding journey — organised role by role
        </p>
      </div>

      <div
        className="rounded-2xl flex items-center justify-center"
        style={{ background: '#fff', border: '1px solid #E4E6EF', minHeight: 380 }}
      >
        <div className="text-center" style={{ padding: '0 24px' }}>
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(99,102,241,0.10)' }}
          >
            <DoorOpen size={26} strokeWidth={1.8} style={{ color: '#6366F1' }} />
          </div>
          <p className="text-base font-bold" style={{ color: '#1C2035' }}>Offboarding Module</p>
          <p className="text-sm mt-1.5" style={{ color: '#8B90A7', maxWidth: 420, margin: '6px auto 0' }}>
            Use the sidebar to walk the flow. We'll start with the <strong style={{ color: '#5C6080' }}>Employee</strong> screens,
            then add CTO, Manager, System Admin, Finance, and HR.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function OffboardingModule() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeItem, setActiveItem]   = useState('emp-request')

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: '#F0F2F8', fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <OffboardingSidebar
        isOpen={sidebarOpen}
        activeItem={activeItem}
        onNavigate={setActiveItem}
        onLogout={goToLogin}
      />

      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Header
          isSidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(p => !p)}
          onNavigate={setActiveItem}
          onLogout={goToLogin}
          userRole="Employee"
        />

        <main className="flex-1 overflow-auto py-6 px-8 scrollbar-hide">
          {activeItem === 'emp-request' ? <OffboardingRequestPage />
            : activeItem === 'emp-tracker' ? <MyOffboardingPage />
            : activeItem === 'cto-approvals' ? <CTOApprovalsModule />
            : activeItem === 'mgr-clearance' ? <ManagerClearanceModule />
            : activeItem === 'it-clearance' ? <ITClearanceModule />
            : activeItem === 'fin-clearance' ? <FinanceClearanceModule />
            : activeItem === 'hr-initiate' ? <InitiateOffboardingPage onGoToCases={() => setActiveItem('hr-cases')} />
            : activeItem === 'hr-cases' ? <HRDashboardModule />
            : <WelcomePlaceholder />}
        </main>
      </div>
    </div>
  )
}
