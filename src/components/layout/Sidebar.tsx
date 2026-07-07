import { useState } from 'react'
import {
  LayoutDashboard,
  Clock,
  CalendarDays,
  Users,
  Wallet,
  BarChart3,
  ChevronDown,
  LogOut,
  Briefcase,
  UserCog,
  Building2,
  Settings,
  FolderKanban,
  // IndianRupee, // hidden with Payroll section
  Package,
  Receipt,
  Ticket,
} from 'lucide-react'


type NavChild = { id: string; label: string }
type NavItem  = {
  id: string
  label: string
  Icon: React.ElementType
  children?: NavChild[]
  neutralDots?: boolean  // dot + line stay neutral regardless of active child
}

type NavSection = { label: string | null; items: NavItem[] }

const MY_PROJECTS_ITEM: NavItem = {
  id: 'my-projects', label: 'My Projects', Icon: Briefcase,
  neutralDots: true,
  children: [
    { id: 'project-list',           label: 'Project List'           },
    { id: 'team-timesheets',        label: 'Team Timesheets'        },
    { id: 'team-leave',             label: 'Team Leave Requests'    },
    { id: 'team-attendance',        label: 'Team Attendance Request'},
    { id: 'project-announcements',  label: 'Project Announcements'  },
  ],
}

function buildNav(role: 'employee' | 'manager'): NavSection[] {
  return [
    {
      label: null,
      items: [
        { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
        {
          id: 'timesheets', label: 'Timesheets', Icon: Clock,
          children: [
            { id: 'timesheet-add',     label: 'Add Timesheet'     },
            { id: 'timesheet-history', label: 'Timesheet History' },
          ],
        },
        ...(role === 'manager' ? [MY_PROJECTS_ITEM] : []),
      ],
    },
    {
      label: 'MANAGE',
      items: [
        {
          id: 'leave', label: 'Leave', Icon: CalendarDays,
          children: [
            { id: 'leave-create',  label: 'Create Leave Request'  },
            { id: 'leave-status',  label: 'Leave Approval Status' },
            // { id: 'leave-history', label: 'Leave History' }, // hidden
          ],
        },
        {
          id: 'hrms', label: 'HRMS', Icon: Users,
          children: [
            { id: 'my-profile',    label: 'My Profile'    },
            { id: 'org-structure', label: 'Org Structure' },
          ],
        },
        {
          id: 'support-tickets', label: 'Support Tickets', Icon: Ticket,
          children: role === 'manager'
            ? [
                { id: 'tickets', label: 'Tickets' },
                { id: 'expense', label: 'Expense' },
              ]
            : [
                { id: 'tickets', label: 'Tickets' },
                { id: 'assets',  label: 'Assets'  },
                { id: 'expense', label: 'Expense' },
              ],
        },
        ...(role === 'manager'
          ? [{
              id: 'assets-management', label: 'Assets Management', Icon: Package,
              children: [
                { id: 'my-assets',            label: 'My Assets'            },
                { id: 'team-asset-requests',  label: 'Team Asset Requests'  },
              ],
            }]
          : []
        ),
        { id: 'payroll', label: 'Payroll', Icon: Wallet    },
        { id: 'reports', label: 'Reports', Icon: BarChart3 },
      ],
    },
  ]
}

function buildAdminNav(): NavSection[] {
  return [
    {
      label: null,
      items: [
        { id: 'admin-dashboard', label: 'Dashboard', Icon: LayoutDashboard },
        {
          id: 'user-management', label: 'User Management', Icon: UserCog,
          children: [
            { id: 'all-users',    label: 'All Users'              },
            { id: 'add-employee', label: 'Add Employee'           },
            { id: 'role-access',  label: 'Role & Access Control'  },
          ],
        },
      ],
    },
    {
      label: 'OPERATIONS',
      items: [
        {
          id: 'admin-leave', label: 'Leave Management', Icon: CalendarDays,
          children: [
            { id: 'all-leave-requests', label: 'All Leave Requests'     },
            { id: 'leave-balance',      label: 'Leave Balance Overview' },
            { id: 'leave-policy',       label: 'Leave Policy Setup'     },
          ],
        },
        {
          id: 'admin-timesheet', label: 'Timesheet Management', Icon: Clock,
          children: [
            { id: 'pending-timesheets',  label: 'Pending Timesheets'  },
            { id: 'pending-approvals',   label: 'Pending Approvals'   },
            { id: 'timesheet-policies',  label: 'Timesheet Policies'  },
          ],
        },
      ],
    },
    {
      label: 'ORGANIZATION',
      items: [
        {
          id: 'dept-projects', label: 'Projects & Departments', Icon: FolderKanban,
          children: [
            { id: 'project-setup',         label: 'Projects'              },
            { id: 'department-management', label: 'Department'  },
            { id: 'designation',           label: 'Designation' },
            { id: 'activity-tag',          label: 'Activity Tag' },
          ],
        },
        { id: 'admin-org', label: 'Org Structure', Icon: Building2 },
      ],
    },
    {
      label: 'MANAGEMENT',
      items: [
        {
          id: 'ticket-management', label: 'Ticket Management', Icon: Receipt,
          children: [
            { id: 'admin-tickets', label: 'Tickets' },
            { id: 'expense-management', label: 'Expense' },
          ],
        },
        {
          id: 'assets-management', label: 'Assets Management', Icon: Package,
          children: [
            { id: 'assets-list', label: 'Assets List' },
            { id: 'admin-assets', label: 'Assets Allocation' },
            { id: 'assets-request', label: 'Assets Request' },
          ],
        },
      ],
    },
    {
      label: 'SYSTEM',
      items: [
        {
          id: 'system-settings', label: 'System Settings', Icon: Settings,
          children: [
            { id: 'org-profile',          label: 'Organization Profile'      },
            { id: 'working-hours',        label: 'Working Hours & Holidays'  },
            { id: 'announcements',        label: 'Announcements'             },
            { id: 'policy-setup',         label: 'Policy Setup'              },
            // { id: 'rewards-recognition',  label: 'Rewards and Recognition'   }, // hidden for now
          ],
        },
      ],
    },
    {
      label: 'INSIGHTS',
      items: [
        {
          id: 'admin-reports', label: 'Reports & Analytics', Icon: BarChart3,
          children: [
            { id: 'attendance-report', label: 'Attendance Report' },
            { id: 'leave-report',      label: 'Leave Report'      },
            { id: 'all-timesheets',    label: 'Timesheet Report'  },
            { id: 'audit-trail',       label: 'Audit Trail'       },
          ],
        },
      ],
    },
    // { // PAYROLL section hidden for now
    //   label: 'PAYROLL',
    //   items: [
    //     { id: 'admin-payroll', label: 'Payroll', Icon: IndianRupee },
    //   ],
    // },
  ]
}

interface SidebarProps {
  isOpen: boolean
  activeItem: string
  onNavigate: (id: string) => void
  onLogout?: () => void
  role?: 'employee' | 'manager' | 'admin'
}

const C = {
  navy:   '#1C2035',
  gold:   '#F2D000',
  border: 'rgba(255,255,255,0.07)',
}

export default function Sidebar({ isOpen, activeItem, onNavigate, onLogout, role = 'employee' }: SidebarProps) {
  const initExpanded: string[] = []
  const [expanded, setExpanded]               = useState<string[]>(initExpanded)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [logoutLoading, setLogoutLoading]     = useState(false)

  const NAV = role === 'admin' ? buildAdminNav() : buildNav(role)

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
        {NAV.map((section, si) => (
          <div key={si}>
            {/* Section label */}
            {section.label && (
              <div style={{ margin: '20px 0 6px', paddingLeft: isOpen ? 12 : 0 }}>
                {isOpen ? (
                  <span
                    className="text-xs font-semibold tracking-widest uppercase"
                    style={{ color: 'rgba(255,255,255,0.22)' }}
                  >
                    {section.label}
                  </span>
                ) : (
                  <div
                    className="mx-auto rounded-full"
                    style={{ width: 20, height: 1, background: 'rgba(255,255,255,0.12)' }}
                  />
                )}
              </div>
            )}

            {/* Items */}
            {section.items.map(item => {
              const { Icon } = item
              const isActive     = activeItem === item.id
              const parentActive = hasActiveChild(item)
              const isExpanded   = expanded.includes(item.id)
              const hasChildren  = !!item.children?.length

              return (
                <div key={item.id} className="mb-1" style={item.id === 'hrms' ? { marginTop: 14 } : {}}>
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

                    <Icon size={17} style={{ flexShrink: 0 }} />

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
                              {/* Dot — neutral always for neutralDots items, gold-on-active for others */}
                              <span
                                className="rounded-full flex-shrink-0"
                                style={{
                                  width: 5, height: 5,
                                  background: (!item.neutralDots && childActive)
                                    ? C.gold
                                    : 'rgba(255,255,255,0.2)',
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
        ))}
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
            background: '#fff',
            borderRadius: 22,
            padding: '36px 32px 28px',
            width: 360,
            boxShadow: '0 24px 64px rgba(10,12,28,0.22)',
            textAlign: 'center',
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
                    style={{ animation: 'logoutSpin 0.8s linear infinite', flexShrink: 0 }}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  Logging out...
                </>
              ) : 'Yes, Logout'}
            </button>
          </div>
        </div>

        <style>{`@keyframes logoutSpin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
      </div>
    )}
    </>
  )
}
