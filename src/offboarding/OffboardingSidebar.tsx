import { useState } from 'react'
import {
  ChevronDown, LogOut,
  FileText, LayoutDashboard,
  ClipboardCheck, Users, MonitorCheck, Wallet, FolderKanban, UserPlus,
} from 'lucide-react'

/*
 * Offboarding module sidebar.
 * Mirrors the main app Sidebar's visual design (navy, gold active, logo header,
 * expandable children) but is data-driven with ROLE-WISE sections so the whole
 * offboarding journey can live in one place.
 *
 * For now it shows only the logo + the EMPLOYEE section. The remaining role
 * sections and their menus are added later.
 */

export type NavChild = { id: string; label: string }
export type NavItem  = { id: string; label: string; Icon?: React.ElementType; children?: NavChild[] }
export type NavSection = { label: string | null; items: NavItem[] }

// Role-wise sections, in end-to-end workflow order:
// Employee → CTO → Manager → System Admin → Finance → HR.
// Menu NAMES only for now; screens are designed one by one afterwards.
export const OFFBOARDING_NAV: NavSection[] = [
  {
    label: 'EMPLOYEE',
    items: [
      { id: 'emp-request', label: 'Offboarding Request', Icon: FileText       },
      // My Offboarding is the hub: Overview + Exit Interview + Exit Documents live
      // inside it as vertical tabs (no separate sidebar menus).
      { id: 'emp-tracker', label: 'My Offboarding',      Icon: LayoutDashboard },
    ],
  },
  {
    label: 'CTO (DELIVERY HEAD)',
    items: [
      { id: 'cto-approvals', label: 'Offboarding Approvals', Icon: ClipboardCheck },
    ],
  },
  {
    label: 'MANAGER',
    items: [
      { id: 'mgr-clearance', label: 'Team Offboarding', Icon: Users },
    ],
  },
  {
    label: 'SYSTEM ADMIN',
    items: [
      { id: 'it-clearance', label: 'IT Clearance', Icon: MonitorCheck },
    ],
  },
  {
    label: 'FINANCE MANAGER',
    items: [
      { id: 'fin-clearance', label: 'Finance Clearance', Icon: Wallet },
    ],
  },
  {
    label: 'HR',
    items: [
      // Single HR entry: the case table that opens the Case Cockpit (H1 + H2/H3).
      { id: 'hr-cases', label: 'Offboarding Cases', Icon: FolderKanban },
      // HR-initiated entry point: raise individual / bulk offboarding cases.
      { id: 'hr-initiate', label: 'Initiate Offboarding', Icon: UserPlus },
    ],
  },
]

const C = {
  navy:   '#1C2035',
  gold:   '#F2D000',
  border: 'rgba(255,255,255,0.07)',
}

interface Props {
  isOpen: boolean
  activeItem: string
  onNavigate: (id: string) => void
  onLogout?: () => void
}

export default function OffboardingSidebar({ isOpen, activeItem, onNavigate, onLogout }: Props) {
  const [expanded, setExpanded]               = useState<string[]>([])
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [logoutLoading, setLogoutLoading]     = useState(false)

  const NAV = OFFBOARDING_NAV

  // Role sections are collapsible accordions — all open by default.
  const [expandedSections, setExpandedSections] = useState<string[]>(
    () => NAV.map(s => s.label).filter(Boolean) as string[]
  )
  function toggleSection(label: string) {
    setExpandedSections(p => p.includes(label) ? p.filter(x => x !== label) : [...p, label])
  }

  async function handleConfirmLogout() {
    setLogoutLoading(true)
    await new Promise(r => setTimeout(r, 1600))
    setLogoutLoading(false)
    setShowLogoutModal(false)
    onLogout?.()
  }

  function toggle(id: string) {
    setExpanded(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  }

  function hasActiveChild(item: NavItem) {
    return item.children?.some(c => c.id === activeItem) ?? false
  }

  return (
    <>
    <aside
      className="relative flex flex-col h-screen flex-shrink-0 select-none"
      style={{
        width: isOpen ? 258 : 66,
        background: C.navy,
        borderRight: `1px solid ${C.border}`,
        transition: 'width 0.24s cubic-bezier(0.4,0,0.2,1)',
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      {/* ── Logo ── */}
      <div
        className="flex items-center flex-shrink-0"
        style={{
          height: 68,
          padding: '0 16px',
          borderBottom: `1px solid ${C.border}`,
          justifyContent: isOpen ? 'flex-start' : 'center',
        }}
      >
        {isOpen ? (
          <img src="/logo.png" alt="Pulse.AI" className="h-7 pointer-events-none" />
        ) : (
          <img src="/logo-small.png" alt="Concert IDC" className="pointer-events-none" style={{ width: 36, height: 36, objectFit: 'contain' }} />
        )}
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden" style={{ padding: '14px 8px' }}>
        {NAV.map((section, si) => {
          const secOpen = !isOpen || (section.label ? expandedSections.includes(section.label) : true)
          return (
          <div key={si}>
            {/* Section header — accordion toggle: role name on the left, chevron on the opposite end */}
            {section.label && (isOpen ? (
              <button
                onClick={() => toggleSection(section.label!)}
                className="w-full flex items-center justify-between rounded-lg cursor-pointer border-none"
                style={{ margin: '18px 0 6px', padding: '5px 12px', background: 'transparent' }}
                onMouseEnter={e => { const s = e.currentTarget.querySelector('span') as HTMLElement; const c = e.currentTarget.querySelector('svg') as unknown as HTMLElement; if (s) s.style.color = 'rgba(255,255,255,0.55)'; if (c) c.style.color = 'rgba(255,255,255,0.55)' }}
                onMouseLeave={e => { const s = e.currentTarget.querySelector('span') as HTMLElement; const c = e.currentTarget.querySelector('svg') as unknown as HTMLElement; if (s) s.style.color = 'rgba(255,255,255,0.32)'; if (c) c.style.color = 'rgba(255,255,255,0.32)' }}
              >
                <span
                  className="text-xs font-semibold tracking-widest uppercase"
                  style={{ color: 'rgba(255,255,255,0.32)' }}
                >
                  {section.label}
                </span>
                <ChevronDown
                  size={13}
                  style={{ flexShrink: 0, color: 'rgba(255,255,255,0.32)', transition: 'transform 0.2s', transform: secOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>
            ) : (
              <div
                className="mx-auto rounded-full"
                style={{ width: 20, height: 1, background: 'rgba(255,255,255,0.12)', margin: '20px auto 6px' }}
              />
            ))}

            {/* Items — collapse/expand with the section accordion */}
            <div
              style={{
                overflow: 'hidden',
                maxHeight: secOpen ? section.items.length * 50 + 8 : 0,
                transition: 'max-height 0.24s cubic-bezier(0.4,0,0.2,1)',
              }}
            >
            {section.items.map(item => {
              const Icon         = item.Icon
              const isActive     = activeItem === item.id
              const parentActive = hasActiveChild(item)
              const isExpanded   = expanded.includes(item.id)
              const hasChildren  = !!item.children?.length

              return (
                <div key={item.id} className="mb-1">
                  {/* Parent button */}
                  <button
                    onClick={() => {
                      if (hasChildren) { if (isOpen) toggle(item.id) }
                      else onNavigate(item.id)
                    }}
                    title={!isOpen ? item.label : undefined}
                    className="relative w-full flex items-center rounded-xl cursor-pointer border-none transition-colors duration-150"
                    style={{
                      height: 42,
                      gap: 10,
                      paddingLeft: isOpen ? 12 : 0,
                      paddingRight: isOpen ? 10 : 0,
                      justifyContent: isOpen ? 'flex-start' : 'center',
                      background: isActive
                        ? 'rgba(242,208,0,0.13)'
                        : parentActive
                        ? 'rgba(255,255,255,0.05)'
                        : 'transparent',
                      color: isActive || parentActive
                        ? C.gold
                        : 'rgba(255,255,255,0.80)',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                        e.currentTarget.style.color = '#fff'
                      }
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = isActive
                        ? 'rgba(242,208,0,0.13)'
                        : parentActive ? 'rgba(255,255,255,0.05)' : 'transparent'
                      e.currentTarget.style.color = isActive || parentActive
                        ? C.gold : 'rgba(255,255,255,0.80)'
                    }}
                  >
                    {/* Active left bar */}
                    {isActive && (
                      <span
                        className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full"
                        style={{ width: 3, height: 20, background: C.gold }}
                      />
                    )}

                    {Icon && <Icon size={17} style={{ flexShrink: 0 }} />}

                    {isOpen && (
                      <>
                        <span className="flex-1 text-sm font-semibold text-left whitespace-nowrap">
                          {item.label}
                        </span>
                        {hasChildren && (
                          <ChevronDown
                            size={14}
                            style={{
                              flexShrink: 0,
                              opacity: 0.4,
                              transition: 'transform 0.2s',
                              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            }}
                          />
                        )}
                      </>
                    )}
                  </button>

                  {/* Children */}
                  {hasChildren && isOpen && (
                    <div
                      style={{
                        overflow: 'hidden',
                        maxHeight: isExpanded ? item.children!.length * 40 + 12 : 0,
                        transition: 'max-height 0.22s cubic-bezier(0.4,0,0.2,1)',
                      }}
                    >
                      <div
                        className="ml-5 mt-1.5 mb-1 pl-3"
                        style={{ borderLeft: '1px solid rgba(255,255,255,0.09)' }}
                      >
                        {item.children!.map(child => {
                          const childActive = activeItem === child.id
                          return (
                            <button
                              key={child.id}
                              onClick={() => onNavigate(child.id)}
                              className="w-full flex items-center gap-2.5 rounded-lg cursor-pointer border-none transition-colors duration-150 text-left mb-0.5"
                              style={{
                                height: 38,
                                paddingLeft: 10,
                                paddingRight: 8,
                                background: childActive ? 'rgba(242,208,0,0.10)' : 'transparent',
                                color: childActive ? C.gold : 'rgba(255,255,255,0.75)',
                              }}
                              onMouseEnter={e => {
                                if (!childActive) {
                                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                                  e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                                }
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.background = childActive ? 'rgba(242,208,0,0.10)' : 'transparent'
                                e.currentTarget.style.color = childActive ? C.gold : 'rgba(255,255,255,0.75)'
                              }}
                            >
                              <span
                                className="rounded-full flex-shrink-0"
                                style={{
                                  width: 5, height: 5,
                                  background: childActive ? C.gold : 'rgba(255,255,255,0.2)',
                                }}
                              />
                              <span className="text-sm font-medium whitespace-nowrap">
                                {child.label}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
            </div>
          </div>
          )
        })}
      </nav>

      {/* ── Logout ── */}
      <div
        className="flex-shrink-0 p-2"
        style={{ borderTop: `1px solid ${C.border}` }}
      >
        <button
          onClick={() => setShowLogoutModal(true)}
          title={!isOpen ? 'Logout' : undefined}
          className="w-full flex items-center rounded-xl cursor-pointer border-none transition-colors duration-150"
          style={{
            height: 42,
            gap: 10,
            paddingLeft: isOpen ? 12 : 0,
            paddingRight: isOpen ? 10 : 0,
            justifyContent: isOpen ? 'flex-start' : 'center',
            background: 'transparent',
            color: 'rgba(255,255,255,0.75)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(232,72,85,0.12)'
            e.currentTarget.style.color = '#E84855'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'rgba(255,255,255,0.75)'
          }}
        >
          <LogOut size={17} style={{ flexShrink: 0 }} />
          {isOpen && (
            <span className="text-sm font-semibold whitespace-nowrap">Logout</span>
          )}
        </button>
      </div>
    </aside>

    {/* ── Logout confirmation modal ── */}
    {showLogoutModal && (
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(10,12,28,0.55)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}
        onClick={e => { if (e.target === e.currentTarget) setShowLogoutModal(false) }}
      >
        <div
          style={{
            background: '#fff', borderRadius: 22, padding: '36px 32px 28px',
            width: 360, boxShadow: '0 24px 64px rgba(10,12,28,0.22)', textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 60, height: 60, borderRadius: 18,
              background: 'rgba(232,72,85,0.10)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <LogOut size={26} strokeWidth={1.8} style={{ color: '#E84855' }} />
          </div>

          <div style={{ fontSize: 18, fontWeight: 700, color: '#1C2035', marginBottom: 8 }}>
            Confirm Logout
          </div>

          <p style={{ fontSize: 13.5, color: '#8B90A7', lineHeight: 1.65, marginBottom: 28 }}>
            Are you sure you want to logout?<br />
            You'll need to sign in again to access your workspace.
          </p>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setShowLogoutModal(false)}
              style={{
                flex: 1, height: 44, borderRadius: 12,
                border: '1px solid #E8EAF2', background: '#fff',
                color: '#8B90A7', fontSize: 14, fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = '#1C2035' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8EAF2'; e.currentTarget.style.color = '#8B90A7' }}
            >
              Cancel
            </button>

            <button
              onClick={handleConfirmLogout}
              disabled={logoutLoading}
              style={{
                flex: 1, height: 44, borderRadius: 12, border: 'none',
                background: logoutLoading ? '#F87171' : '#E84855',
                color: '#fff', fontSize: 14, fontWeight: 600,
                cursor: logoutLoading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (!logoutLoading) e.currentTarget.style.background = '#D43F4B' }}
              onMouseLeave={e => { if (!logoutLoading) e.currentTarget.style.background = '#E84855' }}
            >
              {logoutLoading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                    style={{ animation: 'obLogoutSpin 0.8s linear infinite', flexShrink: 0 }}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  Logging out...
                </>
              ) : 'Yes, Logout'}
            </button>
          </div>
        </div>

        <style>{`@keyframes obLogoutSpin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
      </div>
    )}
    </>
  )
}
