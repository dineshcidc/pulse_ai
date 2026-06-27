import { useState } from 'react'
import { Search, ChevronDown, Eye, Pencil, Trash2, UserPlus, Download } from 'lucide-react'

type Role   = 'Employee' | 'Manager' | 'Admin'
type Status = 'Active' | 'Inactive' | 'On Leave'

interface UserRow {
  id: number
  name: string
  avatar: number
  empId: string
  email: string
  role: Role
  project: string
  department: string
  joiningDate: string
  status: Status
}

const USERS: UserRow[] = [
  { id:  1, name: 'Sarah Johnson',   avatar: 47, empId: 'EMP-0047', email: 'sarah.j@concertIDC.com',  role: 'Employee', project: 'Pulse.AI v2',  department: 'Engineering',   joiningDate: 'Jan 12, 2023', status: 'Active'   },
  { id:  2, name: 'Mike Chen',       avatar: 33, empId: 'EMP-0033', email: 'mike.c@concertIDC.com',    role: 'Employee', project: 'HDFC Portal',  department: 'QA & Testing',  joiningDate: 'Mar 05, 2023', status: 'Active'   },
  { id:  3, name: 'Emma Wilson',     avatar: 44, empId: 'EMP-0044', email: 'emma.w@concertIDC.com',    role: 'Employee', project: 'Pulse.AI v2',  department: 'Design',        joiningDate: 'Feb 20, 2023', status: 'On Leave' },
  { id:  4, name: 'David Brown',     avatar: 38, empId: 'EMP-0038', email: 'david.b@concertIDC.com',   role: 'Manager',  project: 'TechCorp ERP', department: 'Engineering',   joiningDate: 'Nov 08, 2021', status: 'Active'   },
  { id:  5, name: 'Lisa Garcia',     avatar: 25, empId: 'EMP-0025', email: 'lisa.g@concertIDC.com',    role: 'Employee', project: 'Pulse.AI v2',  department: 'DevOps',        joiningDate: 'Jul 14, 2022', status: 'Active'   },
  { id:  6, name: 'Tom Davis',       avatar: 20, empId: 'EMP-0020', email: 'tom.d@concertIDC.com',     role: 'Employee', project: 'HDFC Portal',  department: 'Engineering',   joiningDate: 'Sep 01, 2022', status: 'Active'   },
  { id:  7, name: 'Priya Sharma',    avatar: 10, empId: 'EMP-0010', email: 'priya.s@concertIDC.com',   role: 'Manager',  project: 'TechCorp ERP', department: 'Product',       joiningDate: 'Apr 17, 2021', status: 'Active'   },
  { id:  8, name: 'James Wilson',    avatar: 60, empId: 'EMP-0060', email: 'james.w@concertIDC.com',   role: 'Employee', project: 'Pulse.AI v2',  department: 'Engineering',   joiningDate: 'Jun 30, 2022', status: 'Inactive' },
  { id:  9, name: 'Anjali Singh',    avatar: 36, empId: 'EMP-0036', email: 'anjali.s@concertIDC.com',  role: 'Employee', project: 'HDFC Portal',  department: 'Product',       joiningDate: 'Aug 22, 2023', status: 'Active'   },
  { id: 10, name: 'Karthik Nair',    avatar: 56, empId: 'EMP-0056', email: 'karthik.n@concertIDC.com', role: 'Employee', project: 'TechCorp ERP', department: 'Engineering',   joiningDate: 'Oct 03, 2022', status: 'Active'   },
  { id: 11, name: 'Rohan Mehta',     avatar: 29, empId: 'EMP-0029', email: 'rohan.m@concertIDC.com',   role: 'Manager',  project: 'Pulse.AI v2',  department: 'Engineering',   joiningDate: 'Dec 15, 2020', status: 'Active'   },
  { id: 12, name: 'Fatima Al-Zahra', avatar: 41, empId: 'EMP-0041', email: 'fatima.z@concertIDC.com',  role: 'Employee', project: 'HDFC Portal',  department: 'Design',        joiningDate: 'Feb 09, 2024', status: 'Active'   },
  { id: 13, name: 'Arjun Patel',     avatar: 52, empId: 'EMP-0052', email: 'arjun.p@concertIDC.com',   role: 'Employee', project: 'TechCorp ERP', department: 'QA & Testing',  joiningDate: 'May 23, 2023', status: 'On Leave' },
  { id: 14, name: 'Nina Volkov',     avatar: 18, empId: 'EMP-0018', email: 'nina.v@concertIDC.com',    role: 'Admin',    project: '—',            department: 'IT Operations', joiningDate: 'Jan 04, 2020', status: 'Active'   },
  { id: 15, name: 'Chris Thompson',  avatar: 63, empId: 'EMP-0063', email: 'chris.t@concertIDC.com',   role: 'Employee', project: 'Pulse.AI v2',  department: 'Engineering',   joiningDate: 'Mar 18, 2024', status: 'Active'   },
]

const ROLE_CFG: Record<Role, { color: string; bg: string; border: string }> = {
  Employee: { color: '#4B4ECC', bg: 'rgba(99,102,241,0.08)',   border: 'rgba(99,102,241,0.18)'  },
  Manager:  { color: '#0A8A58', bg: 'rgba(14,168,106,0.08)',  border: 'rgba(14,168,106,0.18)'  },
  Admin:    { color: '#7C3AED', bg: 'rgba(124,58,237,0.08)',   border: 'rgba(124,58,237,0.18)'  },
}

const DEPARTMENTS = ['All Departments', 'Engineering', 'Design', 'QA & Testing', 'DevOps', 'Product', 'IT Operations']
const ROLES       = ['All Roles',       'Employee', 'Manager', 'Admin']

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', surface: '#F7F8FC' }

/* avatar | name | emp-id | email | role | department | joined | actions */
const COLS = '40px 1fr 1fr 1.2fr 1fr 1fr 1fr 100px'

const TH_LABELS = ['', 'Employee', 'Emp ID', 'Email', 'Role', 'Department', 'Joined', 'Actions']

function Dropdown({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          height: 38, padding: '0 30px 0 12px',
          border: `1px solid ${C.border}`, borderRadius: 9,
          fontSize: 13, fontWeight: 500,
          color: value.startsWith('All') ? C.muted : C.navy,
          background: '#fff', outline: 'none', cursor: 'pointer',
          appearance: 'none', fontFamily: "'DM Sans', system-ui, sans-serif",
          minWidth: 140,
        }}
        onFocus={e => { e.target.style.borderColor = '#7C3AED' }}
        onBlur={e  => { e.target.style.borderColor = C.border  }}
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={12} style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
    </div>
  )
}

function RoleBadge({ role }: { role: Role }) {
  const cfg = ROLE_CFG[role]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 9px', borderRadius: 6,
      fontSize: 12, fontWeight: 600,
      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
    }}>{role}</span>
  )
}

function ActionBtn({ icon, title }: { icon: React.ReactNode; title: string }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      title={title}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 30, height: 30, borderRadius: 7,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: `1px solid ${C.border}`,
        background: hov ? C.hover : '#fff',
        color: hov ? C.navy : C.muted,
        cursor: 'pointer', transition: 'all 0.15s',
      }}
    >{icon}</button>
  )
}

const STAT_TILES = [
  { label: 'Total Users', key: 'total',    color: '#4B4ECC', bg: 'rgba(99,102,241,0.07)'   },
  { label: 'Active',      key: 'active',   color: '#0A8A58', bg: 'rgba(14,168,106,0.07)'  },
  { label: 'On Leave',    key: 'onLeave',  color: '#D97706', bg: 'rgba(245,158,11,0.08)'  },
  { label: 'Inactive',    key: 'inactive', color: '#8B90A7', bg: 'rgba(139,144,167,0.08)' },
] as const

export default function AllUsersPage({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [search,     setSearch]     = useState('')
  const [roleFilter, setRoleFilter] = useState('All Roles')
  const [deptFilter, setDeptFilter] = useState('All Departments')
  const [searchFocus, setSearchFocus] = useState(false)

  const filtered = USERS.filter(u => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      u.name.toLowerCase().includes(q) ||
      u.empId.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    const matchRole = roleFilter === 'All Roles'       || u.role       === roleFilter
    const matchDept = deptFilter === 'All Departments' || u.department === deptFilter
    return matchSearch && matchRole && matchDept
  })

  const counts = {
    total:    USERS.length,
    active:   USERS.filter(u => u.status === 'Active').length,
    onLeave:  USERS.filter(u => u.status === 'On Leave').length,
    inactive: USERS.filter(u => u.status === 'Inactive').length,
  }

  const anyFilter = !!(search || roleFilter !== 'All Roles' || deptFilter !== 'All Departments')

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        .user-row:hover { background: #F7F8FC !important; }
        .user-row { transition: background 0.12s; }
      `}</style>

      {/* Page header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold" style={{ color: C.navy }}>All Users</h1>
          <p className="text-sm mt-0.5" style={{ color: '#787878', fontWeight: 500 }}>Manage all employees, managers, and admins in your organization</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{
            height: 38, padding: '0 16px', borderRadius: 9, fontSize: 13, fontWeight: 600,
            border: `1px solid ${C.border}`, background: '#fff', color: C.navy,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
          }}>
            <Download size={14} />Export
          </button>
          <button
            onClick={() => onNavigate('add-employee')}
            style={{
              height: 38, padding: '0 16px', borderRadius: 9, fontSize: 13, fontWeight: 600,
              border: 'none', background: '#1C2035', color: '#fff',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
            }}
          >
            <UserPlus size={14} />Add Employee
          </button>
        </div>
      </div>

      {/* Summary tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {STAT_TILES.map(t => (
          <div
            key={t.key}
            style={{
              background: '#fff', border: `1px solid ${C.border}`,
              borderRadius: 14, padding: '14px 18px',
              display: 'flex', alignItems: 'center', gap: 14,
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 11, background: t.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{ fontSize: 20, fontWeight: 700, color: t.color }}>{counts[t.key]}</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.muted }}>{t.label}</span>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '14px 18px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 220 }}>
            <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              placeholder="Search by name, ID, email or project…"
              style={{
                width: '100%', height: 38, paddingLeft: 34, paddingRight: 12,
                border: `1px solid ${searchFocus ? '#7C3AED' : C.border}`, borderRadius: 9,
                fontSize: 13, color: C.navy, background: '#fff', outline: 'none',
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}
            />
          </div>
          <Dropdown value={roleFilter} options={ROLES}       onChange={setRoleFilter} />
          <Dropdown value={deptFilter} options={DEPARTMENTS} onChange={setDeptFilter} />
          {anyFilter && (
            <button
              onClick={() => { setSearch(''); setRoleFilter('All Roles'); setDeptFilter('All Departments') }}
              style={{ height: 38, padding: '0 14px', borderRadius: 9, fontSize: 13, fontWeight: 500, border: `1px solid ${C.border}`, background: C.hover, color: C.muted, cursor: 'pointer' }}
            >Clear</button>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>

        {/* Sticky header */}
        <div style={{
          display: 'grid', gridTemplateColumns: COLS, columnGap: 16,
          alignItems: 'center',
          padding: '0 20px', height: 44,
          background: C.surface, borderBottom: `1px solid ${C.border}`,
          position: 'sticky', top: 0, zIndex: 2,
        }}>
          {TH_LABELS.map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: C.muted }}>No users match your filters.</p>
          </div>
        ) : (
          filtered.map((u, idx) => (
            <div
              key={u.id}
              className="user-row"
              style={{
                display: 'grid', gridTemplateColumns: COLS, columnGap: 16,
                alignItems: 'center',
                padding: '0 20px', minHeight: 60,
                borderBottom: idx < filtered.length - 1 ? `1px solid ${C.border}` : 'none',
                background: '#fff',
              }}
            >
              {/* Avatar */}
              <div>
                <img
                  src={`https://i.pravatar.cc/32?img=${u.avatar}`}
                  alt={u.name}
                  style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', display: 'block' }}
                />
              </div>

              {/* Name */}
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: C.navy, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</p>
              </div>

              {/* Emp ID */}
              <span style={{ fontSize: 12, fontWeight: 600, color: '#6366F1', fontVariantNumeric: 'tabular-nums' }}>{u.empId}</span>

              {/* Email */}
              <span style={{ fontSize: 12.5, color: C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>{u.email}</span>

              {/* Role */}
              <div><RoleBadge role={u.role} /></div>

              {/* Department */}
              <span style={{ fontSize: 12.5, color: '#3D4266', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>{u.department}</span>

              {/* Joined */}
              <span style={{ fontSize: 12, color: C.muted, whiteSpace: 'nowrap' }}>{u.joiningDate}</span>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ActionBtn icon={<Eye size={13} />}             title="View Profile" />
                <ActionBtn icon={<Pencil size={13} />}          title="Edit User" />
                <ActionBtn icon={<Trash2 size={13} />}          title="Delete User" />
              </div>
            </div>
          ))
        )}

        {/* Footer */}
        <div style={{
          padding: '12px 20px', borderTop: `1px solid ${C.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: C.surface,
        }}>
          <span style={{ fontSize: 12.5, color: C.muted }}>
            Showing <strong style={{ color: C.navy }}>{filtered.length}</strong> of <strong style={{ color: C.navy }}>{USERS.length}</strong> users
          </span>
        </div>
      </div>
    </div>
  )
}
