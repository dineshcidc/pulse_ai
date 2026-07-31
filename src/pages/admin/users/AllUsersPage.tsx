import { useState } from 'react'
import { Search, ChevronDown, Eye, Trash2, UserPlus, Download, AlertTriangle } from 'lucide-react'
import AddEmployeePage, { type EmployeeData } from './AddEmployeePage'

type Role    = 'Employee' | 'Manager' | 'Admin'
type Status  = 'Active' | 'Inactive' | 'On Leave'
type EmpType = 'Regular' | 'Probation' | 'Consultant' | 'Intern' | 'Contract'

interface UserRow {
  id: number
  name: string
  avatar: number
  empId: string
  email: string
  role: Role
  empType: EmpType
  probationRange?: string
  designation: string
  project: string
  department: string
  manager: string
  workLocation: string
  joiningDate: string
  status: Status
}

const USERS: UserRow[] = [
  { id:  1, name: 'Sarah Johnson',   avatar: 47, empId: 'EMP-0047', email: 'sarah.j@concertIDC.com',  role: 'Employee', empType: 'Regular',    designation: 'Senior Frontend Engineer', project: 'Pulse.AI v2',  department: 'Engineering',   manager: 'Rohan Mehta',  workLocation: 'Hybrid',  joiningDate: 'Jan 12, 2023', status: 'Active'   },
  { id:  2, name: 'Mike Chen',       avatar: 33, empId: 'EMP-0033', email: 'mike.c@concertIDC.com',    role: 'Employee', empType: 'Regular',    designation: 'QA Engineer',              project: 'HDFC Portal',  department: 'QA & Testing',  manager: 'Priya Sharma', workLocation: 'On-site', joiningDate: 'Mar 05, 2023', status: 'Active'   },
  { id:  3, name: 'Emma Wilson',     avatar: 44, empId: 'EMP-0044', email: 'emma.w@concertIDC.com',    role: 'Employee', empType: 'Consultant', designation: 'UX Consultant',            project: 'Pulse.AI v2',  department: 'Design',        manager: 'David Brown',  workLocation: 'Remote',  joiningDate: 'Feb 20, 2023', status: 'On Leave' },
  { id:  4, name: 'David Brown',     avatar: 38, empId: 'EMP-0038', email: 'david.b@concertIDC.com',   role: 'Manager',  empType: 'Regular',    designation: 'Engineering Manager',      project: 'TechCorp ERP', department: 'Engineering',   manager: 'Vikram Rao',   workLocation: 'On-site', joiningDate: 'Nov 08, 2021', status: 'Active'   },
  { id:  5, name: 'Lisa Garcia',     avatar: 25, empId: 'EMP-0025', email: 'lisa.g@concertIDC.com',    role: 'Employee', empType: 'Contract',   designation: 'DevOps Engineer',          project: 'Pulse.AI v2',  department: 'DevOps',        manager: 'Rohan Mehta',  workLocation: 'Remote',  joiningDate: 'Jul 14, 2022', status: 'Active'   },
  { id:  6, name: 'Tom Davis',       avatar: 20, empId: 'EMP-0020', email: 'tom.d@concertIDC.com',     role: 'Employee', empType: 'Regular',    designation: 'Backend Engineer',         project: 'HDFC Portal',  department: 'Engineering',   manager: 'David Brown',  workLocation: 'Hybrid',  joiningDate: 'Sep 01, 2022', status: 'Active'   },
  { id:  7, name: 'Priya Sharma',    avatar: 10, empId: 'EMP-0010', email: 'priya.s@concertIDC.com',   role: 'Manager',  empType: 'Regular',    designation: 'Product Manager',          project: 'TechCorp ERP', department: 'Product',       manager: 'Vikram Rao',   workLocation: 'On-site', joiningDate: 'Apr 17, 2021', status: 'Active'   },
  { id:  8, name: 'James Wilson',    avatar: 60, empId: 'EMP-0060', email: 'james.w@concertIDC.com',   role: 'Employee', empType: 'Contract',   designation: 'Software Engineer',        project: 'Pulse.AI v2',  department: 'Engineering',   manager: 'David Brown',  workLocation: 'Remote',  joiningDate: 'Jun 30, 2022', status: 'Inactive' },
  { id:  9, name: 'Anjali Singh',    avatar: 36, empId: 'EMP-0036', email: 'anjali.s@concertIDC.com',  role: 'Employee', empType: 'Intern',     designation: 'Product Intern',           project: 'HDFC Portal',  department: 'Product',       manager: 'Priya Sharma', workLocation: 'On-site', joiningDate: 'Aug 22, 2023', status: 'Active'   },
  { id: 10, name: 'Karthik Nair',    avatar: 56, empId: 'EMP-0056', email: 'karthik.n@concertIDC.com', role: 'Employee', empType: 'Regular',    designation: 'Full-stack Engineer',      project: 'TechCorp ERP', department: 'Engineering',   manager: 'Rohan Mehta',  workLocation: 'Hybrid',  joiningDate: 'Oct 03, 2022', status: 'Active'   },
  { id: 11, name: 'Rohan Mehta',     avatar: 29, empId: 'EMP-0029', email: 'rohan.m@concertIDC.com',   role: 'Manager',  empType: 'Regular',    designation: 'Engineering Manager',      project: 'Pulse.AI v2',  department: 'Engineering',   manager: 'Vikram Rao',   workLocation: 'On-site', joiningDate: 'Dec 15, 2020', status: 'Active'   },
  { id: 12, name: 'Fatima Al-Zahra', avatar: 41, empId: 'EMP-0041', email: 'fatima.z@concertIDC.com',  role: 'Employee', empType: 'Probation',  probationRange: 'Feb → Aug', designation: 'UI Designer',      project: 'HDFC Portal',  department: 'Design',        manager: 'David Brown',  workLocation: 'Hybrid',  joiningDate: 'Feb 09, 2024', status: 'Active' },
  { id: 13, name: 'Arjun Patel',     avatar: 52, empId: 'EMP-0052', email: 'arjun.p@concertIDC.com',   role: 'Employee', empType: 'Consultant', designation: 'QA Consultant',            project: 'TechCorp ERP', department: 'QA & Testing',  manager: 'Priya Sharma', workLocation: 'Remote',  joiningDate: 'May 23, 2023', status: 'On Leave' },
  { id: 14, name: 'Nina Volkov',     avatar: 18, empId: 'EMP-0018', email: 'nina.v@concertIDC.com',    role: 'Admin',    empType: 'Regular',    designation: 'IT Administrator',         project: '—',            department: 'IT Operations', manager: '—',            workLocation: 'On-site', joiningDate: 'Jan 04, 2020', status: 'Active'   },
  { id: 15, name: 'Chris Thompson',  avatar: 63, empId: 'EMP-0063', email: 'chris.t@concertIDC.com',   role: 'Employee', empType: 'Probation',  probationRange: 'Mar → Sep', designation: 'Junior Engineer',  project: 'Pulse.AI v2',  department: 'Engineering',   manager: 'David Brown',  workLocation: 'On-site', joiningDate: 'Mar 18, 2024', status: 'Active' },
]

const ROLE_CFG: Record<Role, { color: string; bg: string; border: string }> = {
  Employee: { color: '#4B4ECC', bg: 'rgba(99,102,241,0.08)',   border: 'rgba(99,102,241,0.18)'  },
  Manager:  { color: '#0A8A58', bg: 'rgba(14,168,106,0.08)',  border: 'rgba(14,168,106,0.18)'  },
  Admin:    { color: '#7C3AED', bg: 'rgba(124,58,237,0.08)',   border: 'rgba(124,58,237,0.18)'  },
}

const EMPTYPE_CFG: Record<EmpType, { color: string; bg: string; border: string }> = {
  Regular:    { color: '#0A8A58', bg: 'rgba(14,168,106,0.08)', border: 'rgba(14,168,106,0.18)' },
  Probation:  { color: '#D97706', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.24)' },
  Consultant: { color: '#7C3AED', bg: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.18)' },
  Intern:     { color: '#0891B2', bg: 'rgba(6,182,212,0.09)',  border: 'rgba(6,182,212,0.22)'  },
  Contract:   { color: '#5A6080', bg: 'rgba(90,96,128,0.09)',  border: 'rgba(90,96,128,0.22)'  },
}

const DEPARTMENTS = ['All Departments', 'Engineering', 'Design', 'QA & Testing', 'DevOps', 'Product', 'IT Operations']
const ROLES       = ['All Roles',       'Employee', 'Manager', 'Admin']
const EMP_TYPES   = ['All Types',        'Regular', 'Probation', 'Consultant', 'Intern', 'Contract']

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', surface: '#F7F8FC' }

// Full profile data — currently only Sarah Johnson (EMP-0047) has a View/Edit page.
// Reuses the Add Employee form (same UI) pre-filled with this data.
const PROFILES: Record<string, EmployeeData> = {
  'EMP-0047': {
    empId: 'EMP-0047',
    firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.j@concertIDC.com', phone: '+91 98765 43210',
    dob: '1995-06-12', gender: 'Female', maritalStatus: 'Single', nationalId: 'IND-2023-SJ-0047',
    altEmail: 'sarahjohnson@gmail.com', bloodGroup: 'O+', phoneRes: '+91 22 4567 8901',
    ecName: 'Michael Johnson', ecRelation: 'Parent', ecPhone: '+91 98760 12345',
    presentAddr: '12 Park Avenue, Sector 14, Navi Mumbai — 400706, Maharashtra, India',
    panNo: 'ABCDE1234F', uanNo: '100987654321',
    empType: 'Regular', designation: 'Senior Frontend Engineer', level: 'Senior Executive',
    department: 'Engineering', manager: 'Rohan Mehta', officeLocation: 'Mumbai', workLocation: 'Hybrid',
    joinDate: '2023-01-12', confirmDate: '2023-07-12', shift: 'General', attendanceRec: 'Mobile + Web',
    jobDesc: 'Leads frontend development for the Pulse.AI platform — UI architecture, component systems and code reviews.',
    role: 'Employee', project: 'Concert IDC Platform',
    probationApplicable: true, probDuration: '6', probStart: '2023-01-12', probEnd: '2023-07-12',
  },
}

/* employee(avatar+name+desig) | emp-id | type | manager | department | role | location | email | joined | actions */
const COLS = '240px 104px 122px 150px 130px 104px 110px 208px 116px 110px'

const TH_LABELS = ['Employee', 'Emp ID', 'Type', 'Manager', 'Department', 'Role', 'Location', 'Email', 'Joined', 'Actions']

function Dropdown({ value, options, onChange, minWidth = 140 }: { value: string; options: string[]; onChange: (v: string) => void; minWidth?: number }) {
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
          minWidth,
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

function Badge({ text, cfg }: { text: string; cfg: { color: string; bg: string; border: string } }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 9px', borderRadius: 6,
      fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
    }}>{text}</span>
  )
}

function ActionBtn({ icon, title, onClick, danger }: { icon: React.ReactNode; title: string; onClick?: () => void; danger?: boolean }) {
  const [hov, setHov] = useState(false)
  const hoverColor = danger ? C.navy : C.navy
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 30, height: 30, borderRadius: 7,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: `1px solid ${hov && danger ? 'rgba(232,72,85,0.30)' : C.border}`,
        background: hov ? (danger ? 'rgba(232,72,85,0.07)' : C.hover) : '#fff',
        color: hov ? (danger ? '#E84855' : hoverColor) : C.muted,
        cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
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
  const [typeFilter, setTypeFilter] = useState('All Types')
  const [deptFilter, setDeptFilter] = useState('All Departments')
  const [searchFocus, setSearchFocus] = useState(false)

  // View / Edit profile overlay + delete confirmation
  const [profile, setProfile]         = useState<{ empId: string; mode: 'view' | 'edit' } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null)
  const [deletedIds,  setDeletedIds]  = useState<number[]>([])

  function openProfile(u: UserRow, mode: 'view' | 'edit') {
    if (!PROFILES[u.empId]) return          // only users with a profile record open
    setProfile({ empId: u.empId, mode })
  }
  function confirmDelete() {
    if (!deleteTarget) return
    setDeletedIds(ids => [...ids, deleteTarget.id])
    if (profile && profile.empId === deleteTarget.empId) setProfile(null)
    setDeleteTarget(null)
  }

  // ── Profile overlay (View / Edit) — reuses the Add Employee form UI ──
  if (profile && PROFILES[profile.empId]) {
    return (
      <AddEmployeePage
        mode="profile"
        initialData={PROFILES[profile.empId]}
        initialEdit={profile.mode === 'edit'}
        onBack={() => setProfile(null)}
      />
    )
  }

  const activeUsers = USERS.filter(u => !deletedIds.includes(u.id))

  const filtered = activeUsers.filter(u => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      u.name.toLowerCase().includes(q) ||
      u.empId.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.project.toLowerCase().includes(q) ||
      u.designation.toLowerCase().includes(q)
    const matchRole = roleFilter === 'All Roles'       || u.role       === roleFilter
    const matchType = typeFilter === 'All Types'       || u.empType    === typeFilter
    const matchDept = deptFilter === 'All Departments' || u.department === deptFilter
    return matchSearch && matchRole && matchType && matchDept
  })

  const counts = {
    total:    activeUsers.length,
    active:   activeUsers.filter(u => u.status === 'Active').length,
    onLeave:  activeUsers.filter(u => u.status === 'On Leave').length,
    inactive: activeUsers.filter(u => u.status === 'Inactive').length,
  }

  const anyFilter = !!(search || roleFilter !== 'All Roles' || typeFilter !== 'All Types' || deptFilter !== 'All Departments')

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        .user-row:hover { background: #F7F8FC !important; }
        .user-row { transition: background 0.12s; }
        .users-scroll::-webkit-scrollbar { height: 9px; }
        .users-scroll::-webkit-scrollbar-track { background: #F7F8FC; }
        .users-scroll::-webkit-scrollbar-thumb { background: #D0D3E6; border-radius: 6px; }
        .users-scroll::-webkit-scrollbar-thumb:hover { background: #B9BDD4; }
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
          <Dropdown value={typeFilter} options={EMP_TYPES}   onChange={setTypeFilter} minWidth={150} />
          <Dropdown value={roleFilter} options={ROLES}       onChange={setRoleFilter} />
          <Dropdown value={deptFilter} options={DEPARTMENTS} onChange={setDeptFilter} />
          {anyFilter && (
            <button
              onClick={() => { setSearch(''); setRoleFilter('All Roles'); setTypeFilter('All Types'); setDeptFilter('All Departments') }}
              style={{ height: 38, padding: '0 14px', borderRadius: 9, fontSize: 13, fontWeight: 500, border: `1px solid ${C.border}`, background: C.hover, color: C.muted, cursor: 'pointer' }}
            >Clear</button>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>

        {/* Horizontal scroll region */}
        <div className="users-scroll" style={{ overflowX: 'auto' }}>
          <div style={{ width: 'max-content', minWidth: '100%' }}>

            {/* Header */}
            <div style={{
              display: 'grid', gridTemplateColumns: COLS, columnGap: 16,
              alignItems: 'center',
              padding: '0 20px', height: 44,
              background: C.surface, borderBottom: `1px solid ${C.border}`,
            }}>
              {TH_LABELS.map((h, i) => (
                <span key={i} style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{h}</span>
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
                    padding: '0 20px', minHeight: 62,
                    borderBottom: idx < filtered.length - 1 ? `1px solid ${C.border}` : 'none',
                    background: '#fff',
                  }}
                >
                  {/* Employee — avatar + name + designation */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <img
                      src={`https://i.pravatar.cc/32?img=${u.avatar}`}
                      alt={u.name}
                      style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', display: 'block', flexShrink: 0 }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: C.navy, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</p>
                      <p style={{ fontSize: 11, color: C.muted, margin: '1px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.designation}</p>
                    </div>
                  </div>

                  {/* Emp ID */}
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#6366F1', fontVariantNumeric: 'tabular-nums' }}>{u.empId}</span>

                  {/* Employee Type (+ probation range) */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3 }}>
                    <Badge text={u.empType} cfg={EMPTYPE_CFG[u.empType]} />
                    {u.empType === 'Probation' && u.probationRange && (
                      <span style={{ fontSize: 10.5, fontWeight: 600, color: '#D97706', whiteSpace: 'nowrap', paddingLeft: 2 }}>{u.probationRange}</span>
                    )}
                  </div>

                  {/* Reporting Manager */}
                  <span style={{ fontSize: 12.5, color: '#3D4266', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>{u.manager}</span>

                  {/* Department */}
                  <span style={{ fontSize: 12.5, color: '#3D4266', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>{u.department}</span>

                  {/* Role */}
                  <div><Badge text={u.role} cfg={ROLE_CFG[u.role]} /></div>

                  {/* Work Location */}
                  <span style={{ fontSize: 12.5, color: '#3D4266', whiteSpace: 'nowrap' }}>{u.workLocation}</span>

                  {/* Email */}
                  <span style={{ fontSize: 12.5, color: C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>{u.email}</span>

                  {/* Joined */}
                  <span style={{ fontSize: 12, color: C.muted, whiteSpace: 'nowrap' }}>{u.joiningDate}</span>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ActionBtn icon={<Eye size={13} />}    title="View Profile" onClick={() => openProfile(u, 'view')} />
                    <ActionBtn icon={<Trash2 size={13} />} title="Delete User" danger onClick={() => setDeleteTarget(u)} />
                  </div>
                </div>
              ))
            )}

          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px', borderTop: `1px solid ${C.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: C.surface,
        }}>
          <span style={{ fontSize: 12.5, color: C.muted }}>
            Showing <strong style={{ color: C.navy }}>{filtered.length}</strong> of <strong style={{ color: C.navy }}>{activeUsers.length}</strong> users
          </span>
          <span style={{ fontSize: 11.5, color: C.muted }}>Scroll horizontally to see all columns →</span>
        </div>
      </div>

      {/* Delete confirmation */}
      {deleteTarget && <DeleteModal user={deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} />}
    </div>
  )
}

function DeleteModal({ user, onCancel, onConfirm }: { user: UserRow; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.55)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <div style={{ background: '#fff', borderRadius: 20, width: 420, padding: '30px 30px 24px', boxShadow: '0 28px 72px rgba(10,12,28,0.22)', textAlign: 'center' }}>
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(232,72,85,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
          <AlertTriangle size={26} color="#E84855" />
        </div>
        <p style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 800, color: C.navy, letterSpacing: '-0.2px' }}>Remove this user?</p>
        <p style={{ margin: '0 0 6px', fontSize: 13.5, color: '#5A6080', lineHeight: 1.6 }}>
          You're about to remove <strong style={{ color: C.navy }}>{user.name}</strong> ({user.empId}) from the organization.
        </p>
        <p style={{ margin: '0 0 24px', fontSize: 12.5, color: C.muted }}>This action cannot be undone.</p>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onCancel}
            style={{ flex: 1, height: 44, borderRadius: 11, fontSize: 13.5, fontWeight: 600, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, cursor: 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif" }}
          >
            Not Now
          </button>
          <button
            onClick={onConfirm}
            style={{ flex: 1, height: 44, borderRadius: 11, fontSize: 13.5, fontWeight: 700, border: 'none', background: '#E84855', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontFamily: "'DM Sans', system-ui, sans-serif" }}
            onMouseEnter={e => { e.currentTarget.style.background = '#D63B48' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#E84855' }}
          >
            <Trash2 size={14} /> Remove User
          </button>
        </div>
      </div>
    </div>
  )
}
