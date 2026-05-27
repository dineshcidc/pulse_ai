import { useState } from 'react'
import { Search, Users, ShieldCheck, Crown, Check, X, ChevronDown, ArrowLeftRight } from 'lucide-react'

type Role = 'Employee' | 'Manager' | 'Admin'

interface UserRow {
  id: number; name: string; avatar: number; empId: string
  email: string; department: string; role: Role; lastChanged: string
}

const INIT_USERS: UserRow[] = [
  { id:  1, name: 'Sarah Johnson',   avatar: 47, empId: 'EMP-0047', email: 'sarah.j@concertIDC.com',  department: 'Engineering',   role: 'Employee', lastChanged: 'Jan 12, 2023' },
  { id:  2, name: 'Mike Chen',       avatar: 33, empId: 'EMP-0033', email: 'mike.c@concertIDC.com',    department: 'QA & Testing',  role: 'Employee', lastChanged: 'Mar 05, 2023' },
  { id:  3, name: 'Emma Wilson',     avatar: 44, empId: 'EMP-0044', email: 'emma.w@concertIDC.com',    department: 'Design',        role: 'Employee', lastChanged: 'Feb 20, 2023' },
  { id:  4, name: 'David Brown',     avatar: 38, empId: 'EMP-0038', email: 'david.b@concertIDC.com',   department: 'Engineering',   role: 'Manager',  lastChanged: 'Nov 08, 2021' },
  { id:  5, name: 'Lisa Garcia',     avatar: 25, empId: 'EMP-0025', email: 'lisa.g@concertIDC.com',    department: 'DevOps',        role: 'Employee', lastChanged: 'Jul 14, 2022' },
  { id:  6, name: 'Tom Davis',       avatar: 20, empId: 'EMP-0020', email: 'tom.d@concertIDC.com',     department: 'Engineering',   role: 'Employee', lastChanged: 'Sep 01, 2022' },
  { id:  7, name: 'Priya Sharma',    avatar: 10, empId: 'EMP-0010', email: 'priya.s@concertIDC.com',   department: 'Product',       role: 'Manager',  lastChanged: 'Apr 17, 2021' },
  { id:  8, name: 'James Wilson',    avatar: 60, empId: 'EMP-0060', email: 'james.w@concertIDC.com',   department: 'Engineering',   role: 'Employee', lastChanged: 'Jun 30, 2022' },
  { id:  9, name: 'Anjali Singh',    avatar: 36, empId: 'EMP-0036', email: 'anjali.s@concertIDC.com',  department: 'Product',       role: 'Employee', lastChanged: 'Aug 22, 2023' },
  { id: 10, name: 'Karthik Nair',    avatar: 56, empId: 'EMP-0056', email: 'karthik.n@concertIDC.com', department: 'Engineering',   role: 'Employee', lastChanged: 'Oct 03, 2022' },
  { id: 11, name: 'Rohan Mehta',     avatar: 29, empId: 'EMP-0029', email: 'rohan.m@concertIDC.com',   department: 'Engineering',   role: 'Manager',  lastChanged: 'Dec 15, 2020' },
  { id: 12, name: 'Fatima Al-Zahra', avatar: 41, empId: 'EMP-0041', email: 'fatima.z@concertIDC.com',  department: 'Design',        role: 'Employee', lastChanged: 'Feb 09, 2024' },
  { id: 13, name: 'Arjun Patel',     avatar: 52, empId: 'EMP-0052', email: 'arjun.p@concertIDC.com',   department: 'QA & Testing',  role: 'Employee', lastChanged: 'May 23, 2023' },
  { id: 14, name: 'Nina Volkov',     avatar: 18, empId: 'EMP-0018', email: 'nina.v@concertIDC.com',    department: 'IT Operations', role: 'Admin',    lastChanged: 'Jan 04, 2020' },
  { id: 15, name: 'Chris Thompson',  avatar: 63, empId: 'EMP-0063', email: 'chris.t@concertIDC.com',   department: 'Engineering',   role: 'Employee', lastChanged: 'Mar 18, 2024' },
]

const ROLE_CFG: Record<Role, { color: string; bg: string; border: string; accent: string; barColor: string }> = {
  Employee: { color: '#4B4ECC', bg: 'rgba(99,102,241,0.07)',   border: 'rgba(99,102,241,0.16)',  accent: '#6366F1', barColor: '#6366F1' },
  Manager:  { color: '#0A8A58', bg: 'rgba(14,168,106,0.07)',  border: 'rgba(14,168,106,0.16)', accent: '#16A34A', barColor: '#16A34A' },
  Admin:    { color: '#7C3AED', bg: 'rgba(124,58,237,0.07)',   border: 'rgba(124,58,237,0.16)',  accent: '#7C3AED', barColor: '#7C3AED' },
}

const ROLE_META: Record<Role, {
  Icon: React.FC<{ size?: number; color?: string }>
  tagline: string
  perms: string[]
  restricted: string[]
}> = {
  Employee: {
    Icon: Users,
    tagline: 'Standard access for day-to-day work',
    perms: ['View personal dashboard & profile', 'Submit and track timesheets', 'Apply for leave requests', 'View personal reports', 'Raise HR support tickets'],
    restricted: ['Approve team requests', 'Manage users or policies', 'Access system settings'],
  },
  Manager: {
    Icon: ShieldCheck,
    tagline: 'Team-level oversight and approvals',
    perms: ['All Employee permissions', 'Review & approve timesheets', 'Approve or reject leave', 'View team analytics & reports', 'Manage project assignments'],
    restricted: ['Create or delete users', 'Access system configuration'],
  },
  Admin: {
    Icon: Crown,
    tagline: 'Full system control and configuration',
    perms: ['All Manager permissions', 'Create, edit & deactivate users', 'Configure leave & timesheet policies', 'Manage departments & projects', 'Full reports & audit log access', 'System settings & configuration'],
    restricted: [],
  },
}

const DEPARTMENTS = ['All Departments', 'Engineering', 'Design', 'QA & Testing', 'DevOps', 'Product', 'IT Operations']
const ROLES_FILTER = ['All Roles', 'Employee', 'Manager', 'Admin']

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', surface: '#F7F8FC' }

function Dropdown({ value, options, onChange, minW = 140 }: { value: string; options: string[]; onChange: (v: string) => void; minW?: number }) {
  return (
    <div style={{ position: 'relative' }}>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{
          height: 36, padding: `0 28px 0 11px`,
          border: `1px solid ${C.border}`, borderRadius: 8,
          fontSize: 12.5, fontWeight: 500, color: value.startsWith('All') ? C.muted : C.navy,
          background: '#fff', outline: 'none', cursor: 'pointer',
          appearance: 'none', fontFamily: "'DM Sans',system-ui,sans-serif", minWidth: minW,
        }}
        onFocus={e => { e.target.style.borderColor = '#7C3AED' }}
        onBlur={e  => { e.target.style.borderColor = C.border  }}
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={11} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
    </div>
  )
}

function RoleBadge({ role }: { role: Role }) {
  const c = ROLE_CFG[role]
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 9px', borderRadius: 6, fontSize: 12, fontWeight: 600, color: c.color, background: c.bg, border: `1px solid ${c.border}` }}>
      {role}
    </span>
  )
}

/* ─────── Main ─────── */
export default function RoleAccessPage() {
  const [users,  setUsers]  = useState<UserRow[]>(INIT_USERS)
  const [search, setSearch] = useState('')
  const [rFilter, setRFilter] = useState('All Roles')
  const [dFilter, setDFilter] = useState('All Departments')
  const [sFocus,  setSFocus]  = useState(false)

  const [modalUser,   setModalUser]   = useState<UserRow | null>(null)
  const [selectedNew, setSelectedNew] = useState<Role | null>(null)
  const [saving,      setSaving]      = useState(false)
  const [toast,       setToast]       = useState<string | null>(null)

  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    const ms = !q || u.name.toLowerCase().includes(q) || u.empId.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    const mr = rFilter === 'All Roles'       || u.role       === rFilter
    const md = dFilter === 'All Departments' || u.department === dFilter
    return ms && mr && md
  })

  const counts: Record<Role, number> = {
    Employee: users.filter(u => u.role === 'Employee').length,
    Manager:  users.filter(u => u.role === 'Manager').length,
    Admin:    users.filter(u => u.role === 'Admin').length,
  }

  function openModal(u: UserRow) { setModalUser(u); setSelectedNew(null) }
  function closeModal() { setModalUser(null); setSelectedNew(null) }

  async function confirmChange() {
    if (!modalUser || !selectedNew) return
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    setUsers(prev => prev.map(u => u.id === modalUser.id ? { ...u, role: selectedNew, lastChanged: 'May 25, 2026' } : u))
    const msg = `${modalUser.name.split(' ')[0]} · ${modalUser.role} → ${selectedNew}`
    setSaving(false); closeModal()
    setToast(msg); setTimeout(() => setToast(null), 3200)
  }

  const anyFilter = !!(search || rFilter !== 'All Roles' || dFilter !== 'All Departments')

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif" }}>
      <style>{`
        .uc:hover { box-shadow: 0 3px 14px rgba(28,32,53,0.08) !important; border-color: #D1D4E4 !important; }
        .uc { transition: box-shadow 0.15s, border-color 0.15s; }
        .uc:hover .chbtn { opacity:1 !important; }
        .role-opt { transition: border-color 0.14s, background 0.14s; }
        @keyframes raSpin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes raModal { from{opacity:0;transform:scale(0.97)} to{opacity:1;transform:scale(1)} }
        @keyframes raToast { 0%{opacity:0;transform:translateY(10px)} 12%{opacity:1;transform:translateY(0)} 85%{opacity:1} 100%{opacity:0} }
      `}</style>

      {/* ── Page header — full width ── */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.navy }}>Role & Access Control</h1>
        <p style={{ margin: '6px 0 0', fontSize: 13.5, color: C.muted, lineHeight: 1.7, width: '100%' }}>
          Manage what every person in your organisation can see and do. Each user is assigned a system role — <strong style={{ color: C.navy, fontWeight: 600 }}>Employee</strong>, <strong style={{ color: C.navy, fontWeight: 600 }}>Manager</strong>, or <strong style={{ color: C.navy, fontWeight: 600 }}>Admin</strong> — that controls their level of access across Pulse.AI. Use the panel on the left to understand what each role permits, and click <em>Change Role</em> on any user to reassign access instantly.
        </p>
      </div>

      {/* ── 3 / 9 split ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, alignItems: 'start' }}>

        {/* ══ LEFT: Role permission cards ══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {(['Employee', 'Manager', 'Admin'] as Role[]).map(role => {
            const cfg  = ROLE_CFG[role]
            const meta = ROLE_META[role]
            const Icon = meta.Icon
            return (
              <div key={role} style={{
                background: '#fff',
                border: `1px solid ${C.border}`,
                borderRadius: 16,
                overflow: 'hidden',
              }}>
                {/* Colored top bar */}
                <div style={{ height: 3, background: cfg.barColor }} />

                {/* Role header */}
                <div style={{ padding: '14px 16px 12px', borderBottom: `1px solid ${C.border}`, background: cfg.bg }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                        background: '#fff', border: `1px solid ${cfg.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon size={15} color={cfg.color} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: cfg.color }}>{role}</p>
                        <p style={{ margin: 0, fontSize: 11, color: cfg.color, opacity: 0.7 }}>{meta.tagline}</p>
                      </div>
                    </div>
                    <span style={{
                      minWidth: 28, height: 28, borderRadius: 7, padding: '0 7px',
                      background: '#fff', border: `1px solid ${cfg.border}`,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 800, color: cfg.color,
                    }}>{counts[role]}</span>
                  </div>
                </div>

                {/* Permissions */}
                <div style={{ padding: '12px 16px 14px' }}>
                  <p style={{ margin: '0 0 8px', fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Can do</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {meta.perms.map(p => (
                      <div key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                        <div style={{
                          width: 15, height: 15, borderRadius: '50%', flexShrink: 0, marginTop: 1.5,
                          background: 'rgba(14,168,106,0.12)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Check size={8} color="#16A34A" strokeWidth={3} />
                        </div>
                        <span style={{ fontSize: 12, color: '#3D4266', lineHeight: 1.45 }}>{p}</span>
                      </div>
                    ))}
                    {meta.restricted.map(p => (
                      <div key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                        <div style={{
                          width: 15, height: 15, borderRadius: '50%', flexShrink: 0, marginTop: 1.5,
                          background: 'rgba(139,144,167,0.10)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <X size={7} color={C.muted} strokeWidth={2.5} />
                        </div>
                        <span style={{ fontSize: 12, color: C.muted, lineHeight: 1.45 }}>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ══ RIGHT: Search + user cards ══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Search + filters */}
          <div style={{
            background: '#fff', border: `1px solid ${C.border}`,
            borderRadius: 14, padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
          }}>
            <div style={{ position: 'relative', flex: '1 1 200px' }}>
              <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                onFocus={() => setSFocus(true)} onBlur={() => setSFocus(false)}
                placeholder="Search by name, ID or email…"
                style={{
                  width: '100%', height: 36, paddingLeft: 30, paddingRight: 10,
                  border: `1px solid ${sFocus ? '#7C3AED' : C.border}`, borderRadius: 8,
                  fontSize: 13, color: C.navy, background: '#fff', outline: 'none',
                  fontFamily: "'DM Sans',system-ui,sans-serif", boxSizing: 'border-box',
                }}
              />
            </div>
            <Dropdown value={rFilter} options={ROLES_FILTER}  onChange={setRFilter} minW={130} />
            <Dropdown value={dFilter} options={DEPARTMENTS}   onChange={setDFilter} minW={155} />
            {anyFilter && (
              <button onClick={() => { setSearch(''); setRFilter('All Roles'); setDFilter('All Departments') }}
                style={{ height: 36, padding: '0 12px', borderRadius: 8, fontSize: 12.5, fontWeight: 500, border: `1px solid ${C.border}`, background: C.hover, color: C.muted, cursor: 'pointer' }}>
                Clear
              </button>
            )}
            <span style={{ marginLeft: 'auto', fontSize: 12.5, color: C.muted, whiteSpace: 'nowrap' }}>
              <strong style={{ color: C.navy }}>{filtered.length}</strong> of {users.length} users
            </span>
          </div>

          {/* User cards */}
          {filtered.length === 0 ? (
            <div style={{ background: '#fff', border: `1px dashed ${C.border}`, borderRadius: 14, padding: '40px 20px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 13.5, color: C.muted }}>No users match your filters.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filtered.map(u => {
                const cfg = ROLE_CFG[u.role]
                return (
                  <div key={u.id} className="uc" style={{
                    background: '#fff', border: `1px solid ${C.border}`,
                    borderRadius: 14, padding: '14px 18px',
                    display: 'flex', alignItems: 'center', gap: 16,
                  }}>
                    {/* Left accent line */}
                    <div style={{ width: 3, height: 40, borderRadius: 2, background: cfg.barColor, flexShrink: 0 }} />

                    {/* Avatar */}
                    <img src={`https://i.pravatar.cc/38?img=${u.avatar}`} alt={u.name}
                      style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />

                    {/* Name + email */}
                    <div style={{ minWidth: 0, flex: '0 0 190px' }}>
                      <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: C.navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.email}</p>
                    </div>

                    {/* Divider */}
                    <div style={{ width: 1, height: 32, background: C.border, flexShrink: 0 }} />

                    {/* Department */}
                    <div style={{ flex: '0 0 130px' }}>
                      <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Department</p>
                      <p style={{ margin: '3px 0 0', fontSize: 13, fontWeight: 500, color: C.navy }}>{u.department}</p>
                    </div>

                    {/* Emp ID */}
                    <div style={{ flex: '0 0 110px' }}>
                      <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Emp ID</p>
                      <p style={{ margin: '3px 0 0', fontSize: 13, fontWeight: 600, color: '#6366F1' }}>{u.empId}</p>
                    </div>

                    {/* Role */}
                    <div style={{ flex: '0 0 100px' }}>
                      <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Role</p>
                      <div style={{ marginTop: 4 }}><RoleBadge role={u.role} /></div>
                    </div>

                    {/* Since */}
                    <div style={{ flex: '0 0 110px' }}>
                      <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Since</p>
                      <p style={{ margin: '3px 0 0', fontSize: 12.5, color: C.navy }}>{u.lastChanged}</p>
                    </div>

                    {/* Change btn */}
                    <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
                      <button
                        className="chbtn"
                        onClick={() => openModal(u)}
                        style={{
                          height: 34, padding: '0 14px', borderRadius: 9,
                          fontSize: 12.5, fontWeight: 600,
                          border: `1px solid ${C.border}`, background: C.surface,
                          color: C.navy, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: 6,
                          opacity: 0, transition: 'opacity 0.15s, border-color 0.15s, color 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = cfg.accent; e.currentTarget.style.color = cfg.color }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = C.border;   e.currentTarget.style.color = C.navy  }}
                      >
                        <ArrowLeftRight size={12} /> Change Role
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Change Role Modal ── */}
      {modalUser && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(10,12,28,0.52)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'DM Sans',system-ui,sans-serif",
        }}
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div style={{
            background: '#fff', borderRadius: 20, width: 480,
            boxShadow: '0 28px 72px rgba(10,12,28,0.22)',
            overflow: 'hidden', animation: 'raModal 0.18s ease',
          }}>
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 14, background: C.surface }}>
              <img src={`https://i.pravatar.cc/42?img=${modalUser.avatar}`} alt={modalUser.name}
                style={{ width: 42, height: 42, borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.navy }}>{modalUser.name}</p>
                <p style={{ margin: '3px 0 0', fontSize: 12, color: C.muted }}>{modalUser.department} · {modalUser.empId}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <RoleBadge role={modalUser.role} />
                <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, display: 'flex', padding: 4 }}>
                  <X size={16} />
                </button>
              </div>
            </div>

            <div style={{ padding: '20px 24px' }}>
              <p style={{ margin: '0 0 12px', fontSize: 13, color: C.muted }}>
                Current: <strong style={{ color: ROLE_CFG[modalUser.role].color }}>{modalUser.role}</strong> — select a new role below
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(['Employee', 'Manager', 'Admin'] as Role[]).map(r => {
                  const cfg  = ROLE_CFG[r]
                  const Icon = ROLE_META[r].Icon
                  const isCurrent = r === modalUser.role
                  const isSel     = r === selectedNew
                  return (
                    <button key={r} className="role-opt"
                      onClick={() => !isCurrent && setSelectedNew(r)}
                      style={{
                        width: '100%', textAlign: 'left', padding: '12px 14px', borderRadius: 12,
                        cursor: isCurrent ? 'default' : 'pointer', opacity: isCurrent ? 0.45 : 1,
                        border: `1.5px solid ${isSel ? cfg.accent : isCurrent ? cfg.border : C.border}`,
                        background: isSel ? cfg.bg : isCurrent ? C.surface : '#fff',
                        display: 'flex', alignItems: 'center', gap: 12,
                      }}>
                      <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: isSel ? '#fff' : cfg.bg, border: `1px solid ${cfg.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={15} color={cfg.color} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: isSel ? cfg.color : C.navy }}>
                          {r}{isCurrent && <span style={{ fontSize: 11, fontWeight: 400, color: C.muted, marginLeft: 6 }}>(current)</span>}
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: 12, color: C.muted }}>{ROLE_META[r].tagline}</p>
                      </div>
                      {isSel && (
                        <div style={{ width: 22, height: 22, borderRadius: '50%', background: cfg.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Check size={12} color="#fff" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
              {selectedNew && (
                <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.22)' }}>
                  <p style={{ margin: 0, fontSize: 12.5, color: '#92400E', lineHeight: 1.55 }}>
                    This changes <strong>{modalUser.name.split(' ')[0]}</strong>'s access from <strong>{modalUser.role}</strong> to <strong>{selectedNew}</strong>. Takes effect immediately.
                  </p>
                </div>
              )}
            </div>

            <div style={{ padding: '0 24px 22px', display: 'flex', gap: 10 }}>
              <button onClick={closeModal} style={{ flex: 1, height: 42, borderRadius: 10, fontSize: 13.5, fontWeight: 600, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, cursor: 'pointer' }}>Cancel</button>
              <button onClick={confirmChange} disabled={!selectedNew || saving}
                style={{
                  flex: 2, height: 42, borderRadius: 10, fontSize: 13.5, fontWeight: 700, border: 'none',
                  background: !selectedNew ? C.hover : saving ? '#4B4F6E' : C.navy,
                  color: !selectedNew ? C.muted : '#fff',
                  cursor: !selectedNew || saving ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s',
                }}>
                {saving ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                      style={{ animation: 'raSpin 0.75s linear infinite' }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                    Applying…
                  </>
                ) : 'Confirm Change'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 30, left: '50%', transform: 'translateX(-50%)',
          zIndex: 10000, animation: 'raToast 3.2s ease forwards',
          background: C.navy, color: '#fff', borderRadius: 12,
          padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 8px 32px rgba(10,12,28,0.25)', fontFamily: "'DM Sans',system-ui,sans-serif", whiteSpace: 'nowrap',
        }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(74,222,128,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Check size={12} color="#4ADE80" strokeWidth={3} />
          </div>
          <span style={{ fontSize: 13.5, fontWeight: 500 }}>{toast}</span>
        </div>
      )}
    </div>
  )
}
