import { useState } from 'react'
import {
  Search, Users, ShieldCheck, Crown, Check, X,
  ChevronDown, ArrowLeftRight, GripVertical, Pencil, Trash2, Plus,
} from 'lucide-react'

type Role = 'Employee' | 'Manager' | 'Admin'
type Tab  = 'permissions' | 'users' | 'roles'

interface RoleRow {
  id: string
  name: string
  permissions: number
  created: string
  color: string
  bg: string
  Icon: React.FC<{ size?: number; color?: string }>
}
type PermSection = 'can' | 'restricted'

interface PermItem { id: string; label: string }
type RolePermsMap = Record<Role, { can: PermItem[]; restricted: PermItem[] }>

interface UserRow {
  id: number; name: string; avatar: number; empId: string
  email: string; department: string; role: Role; lastChanged: string
}

const INIT_USERS: UserRow[] = [
  { id:  1, name: 'Sarah Johnson',   avatar: 47, empId: 'EMP-0047', email: 'sarah.j@concertIDC.com',   department: 'Engineering',   role: 'Employee', lastChanged: 'Jan 12, 2023' },
  { id:  2, name: 'Mike Chen',       avatar: 33, empId: 'EMP-0033', email: 'mike.c@concertIDC.com',     department: 'QA & Testing',  role: 'Employee', lastChanged: 'Mar 05, 2023' },
  { id:  3, name: 'Emma Wilson',     avatar: 44, empId: 'EMP-0044', email: 'emma.w@concertIDC.com',     department: 'Design',        role: 'Employee', lastChanged: 'Feb 20, 2023' },
  { id:  4, name: 'David Brown',     avatar: 38, empId: 'EMP-0038', email: 'david.b@concertIDC.com',    department: 'Engineering',   role: 'Manager',  lastChanged: 'Nov 08, 2021' },
  { id:  5, name: 'Lisa Garcia',     avatar: 25, empId: 'EMP-0025', email: 'lisa.g@concertIDC.com',     department: 'DevOps',        role: 'Employee', lastChanged: 'Jul 14, 2022' },
  { id:  6, name: 'Tom Davis',       avatar: 20, empId: 'EMP-0020', email: 'tom.d@concertIDC.com',      department: 'Engineering',   role: 'Employee', lastChanged: 'Sep 01, 2022' },
  { id:  7, name: 'Priya Sharma',    avatar: 10, empId: 'EMP-0010', email: 'priya.s@concertIDC.com',    department: 'Product',       role: 'Manager',  lastChanged: 'Apr 17, 2021' },
  { id:  8, name: 'James Wilson',    avatar: 60, empId: 'EMP-0060', email: 'james.w@concertIDC.com',    department: 'Engineering',   role: 'Employee', lastChanged: 'Jun 30, 2022' },
  { id:  9, name: 'Anjali Singh',    avatar: 36, empId: 'EMP-0036', email: 'anjali.s@concertIDC.com',   department: 'Product',       role: 'Employee', lastChanged: 'Aug 22, 2023' },
  { id: 10, name: 'Karthik Nair',    avatar: 56, empId: 'EMP-0056', email: 'karthik.n@concertIDC.com',  department: 'Engineering',   role: 'Employee', lastChanged: 'Oct 03, 2022' },
  { id: 11, name: 'Rohan Mehta',     avatar: 29, empId: 'EMP-0029', email: 'rohan.m@concertIDC.com',    department: 'Engineering',   role: 'Manager',  lastChanged: 'Dec 15, 2020' },
  { id: 12, name: 'Fatima Al-Zahra', avatar: 41, empId: 'EMP-0041', email: 'fatima.z@concertIDC.com',   department: 'Design',        role: 'Employee', lastChanged: 'Feb 09, 2024' },
  { id: 13, name: 'Arjun Patel',     avatar: 52, empId: 'EMP-0052', email: 'arjun.p@concertIDC.com',    department: 'QA & Testing',  role: 'Employee', lastChanged: 'May 23, 2023' },
  { id: 14, name: 'Nina Volkov',     avatar: 18, empId: 'EMP-0018', email: 'nina.v@concertIDC.com',     department: 'IT Operations', role: 'Admin',    lastChanged: 'Jan 04, 2020' },
  { id: 15, name: 'Chris Thompson',  avatar: 63, empId: 'EMP-0063', email: 'chris.t@concertIDC.com',    department: 'Engineering',   role: 'Employee', lastChanged: 'Mar 18, 2024' },
]

const INIT_ROLES: RoleRow[] = [
  { id: 'r1', name: 'Employee',        permissions: 9,  created: 'Jan 12, 2023', color: '#4338CA', bg: '#EEF2FF', Icon: Users },
  { id: 'r2', name: 'Project Manager', permissions: 15, created: 'Mar 05, 2023', color: '#047857', bg: '#ECFDF5', Icon: ShieldCheck },
  { id: 'r3', name: 'Admin',           permissions: 24, created: 'Nov 08, 2021', color: '#6D28D9', bg: '#F5F3FF', Icon: Crown },
]

const ROLE_CFG: Record<Role, {
  color: string; bg: string; border: string; accent: string
  light: string; chip: string; chipText: string
}> = {
  Employee: {
    color: '#4338CA', bg: 'rgba(99,102,241,0.06)', border: 'rgba(99,102,241,0.18)',
    accent: '#6366F1', light: '#EEF2FF', chip: '#EEF2FF', chipText: '#4338CA',
  },
  Manager: {
    color: '#047857', bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.18)',
    accent: '#10B981', light: '#ECFDF5', chip: '#ECFDF5', chipText: '#047857',
  },
  Admin: {
    color: '#6D28D9', bg: 'rgba(139,92,246,0.06)', border: 'rgba(139,92,246,0.18)',
    accent: '#8B5CF6', light: '#F5F3FF', chip: '#F5F3FF', chipText: '#6D28D9',
  },
}

const ROLE_META: Record<Role, {
  Icon: React.FC<{ size?: number; color?: string }>
  tagline: string
}> = {
  Employee: { Icon: Users,       tagline: 'Standard access for day-to-day work' },
  Manager:  { Icon: ShieldCheck, tagline: 'Team-level oversight and approvals'  },
  Admin:    { Icon: Crown,       tagline: 'Full system control and configuration' },
}

function initRolePerms(): RolePermsMap {
  let n = 0
  const mk = (label: string): PermItem => ({ id: `p${n++}`, label })
  return {
    Employee: {
      can: [
        'View personal dashboard & profile',
        'Submit and track timesheets',
        'Apply for leave requests',
        'View personal payroll & reports',
        'Raise HR support tickets',
      ].map(mk),
      restricted: [
        'Approve team requests',
        'Manage users or policies',
        'Access system settings',
        'View organisation-wide data',
      ].map(mk),
    },
    Manager: {
      can: [
        'All Employee permissions',
        'Review & approve timesheets',
        'Approve or reject leave requests',
        'View team analytics & reports',
        'Manage project assignments',
        'Post project announcements',
      ].map(mk),
      restricted: [
        'Create or delete users',
        'Access system configuration',
        'Manage organisation-wide policies',
      ].map(mk),
    },
    Admin: {
      can: [
        'All Manager permissions',
        'Create, edit & deactivate users',
        'Assign and change user roles',
        'Configure leave & timesheet policies',
        'Manage departments & projects',
        'Full reports & audit log access',
        'System settings & configuration',
      ].map(mk),
      restricted: [],
    },
  }
}

const DEPARTMENTS  = ['All Departments', 'Engineering', 'Design', 'QA & Testing', 'DevOps', 'Product', 'IT Operations']
const ROLES_FILTER = ['All Roles', 'Employee', 'Manager', 'Admin']
const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', surface: '#F7F8FC', hover: '#F0F2F8' }

function Dropdown({ value, options, onChange, minW = 140 }: { value: string; options: string[]; onChange: (v: string) => void; minW?: number }) {
  return (
    <div style={{ position: 'relative' }}>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{
          height: 36, padding: '0 28px 0 11px',
          border: `1px solid ${C.border}`, borderRadius: 8,
          fontSize: 12.5, fontWeight: 500,
          color: value.startsWith('All') ? C.muted : C.navy,
          background: '#fff', outline: 'none', cursor: 'pointer',
          appearance: 'none', fontFamily: "'DM Sans',system-ui,sans-serif", minWidth: minW,
        }}
        onFocus={e => { e.target.style.borderColor = '#8B5CF6' }}
        onBlur={e  => { e.target.style.borderColor = C.border  }}
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={11} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
    </div>
  )
}

function RoleBadge({ role }: { role: Role }) {
  const c    = ROLE_CFG[role]
  const Icon = ROLE_META[role].Icon
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px', borderRadius: 6,
      fontSize: 12, fontWeight: 600,
      color: c.chipText, background: c.chip, border: `1px solid ${c.border}`,
    }}>
      <Icon size={11} color={c.color} />
      {role}
    </span>
  )
}

/* ══════════════════════════════════════════
   MAIN
══════════════════════════════════════════ */
export default function RoleAccessPage() {
  /* ── existing state ── */
  const [users,       setUsers]       = useState<UserRow[]>(INIT_USERS)
  const [tab,         setTab]         = useState<Tab>('users')
  const [search,      setSearch]      = useState('')
  const [rFilter,     setRFilter]     = useState('All Roles')
  const [dFilter,     setDFilter]     = useState('All Departments')
  const [sFocus,      setSFocus]      = useState(false)
  const [modalUser,   setModalUser]   = useState<UserRow | null>(null)
  const [selectedNew, setSelectedNew] = useState<Role | null>(null)
  const [saving,      setSaving]      = useState(false)
  const [toast,       setToast]       = useState<string | null>(null)

  /* ── roles tab state ── */
  const [roleRows,   setRoleRows]   = useState<RoleRow[]>(INIT_ROLES)
  const [roleSearch, setRoleSearch] = useState('')
  const filteredRoles = roleRows.filter(r => !roleSearch || r.name.toLowerCase().includes(roleSearch.toLowerCase()))

  function deleteRole(id: string) {
    const r = roleRows.find(x => x.id === id)
    setRoleRows(prev => prev.filter(x => x.id !== id))
    if (r) { setToast(`Role "${r.name}" deleted`); setTimeout(() => setToast(null), 3000) }
  }

  /* ── permissions state ── */
  const [rolePerms, setRolePerms] = useState<RolePermsMap>(initRolePerms)
  const [dragItem,  setDragItem]  = useState<{ role: Role; section: PermSection; id: string } | null>(null)
  const [dragOver,  setDragOver]  = useState<{ role: Role; section: PermSection } | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editVal,   setEditVal]   = useState('')
  const [addTarget, setAddTarget] = useState<{ role: Role; section: PermSection } | null>(null)
  const [addVal,    setAddVal]    = useState('')

  /* ── derived ── */
  const counts: Record<Role, number> = {
    Employee: users.filter(u => u.role === 'Employee').length,
    Manager:  users.filter(u => u.role === 'Manager').length,
    Admin:    users.filter(u => u.role === 'Admin').length,
  }

  const filtered = users.filter(u => {
    const q  = search.toLowerCase()
    const ms = !q || u.name.toLowerCase().includes(q) || u.empId.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    const mr = rFilter === 'All Roles'       || u.role       === rFilter
    const md = dFilter === 'All Departments' || u.department === dFilter
    return ms && mr && md
  })

  function openModal(u: UserRow) { setModalUser(u); setSelectedNew(null) }
  function closeModal()          { setModalUser(null); setSelectedNew(null) }

  async function confirmChange() {
    if (!modalUser || !selectedNew) return
    setSaving(true)
    await new Promise(r => setTimeout(r, 900))
    setUsers(prev => prev.map(u => u.id === modalUser.id ? { ...u, role: selectedNew, lastChanged: 'Jun 02, 2026' } : u))
    const msg = `${modalUser.name.split(' ')[0]}'s role changed: ${modalUser.role} → ${selectedNew}`
    setSaving(false); closeModal()
    setToast(msg); setTimeout(() => setToast(null), 3500)
  }

  const anyFilter = !!(search || rFilter !== 'All Roles' || dFilter !== 'All Departments')

  /* ── perm mutations ── */
  function movePerm(toRole: Role, toSection: PermSection) {
    if (!dragItem) return
    const { role: fr, section: fs, id } = dragItem
    if (fr === toRole && fs === toSection) { setDragItem(null); setDragOver(null); return }
    const item = rolePerms[fr][fs].find(p => p.id === id)
    if (!item) return
    setRolePerms(prev => {
      const next: RolePermsMap = {
        Employee: { can: [...prev.Employee.can], restricted: [...prev.Employee.restricted] },
        Manager:  { can: [...prev.Manager.can],  restricted: [...prev.Manager.restricted]  },
        Admin:    { can: [...prev.Admin.can],    restricted: [...prev.Admin.restricted]    },
      }
      next[fr][fs]          = next[fr][fs].filter(p => p.id !== id)
      next[toRole][toSection] = [...next[toRole][toSection], { id: item.id, label: item.label }]
      return next
    })
    setDragItem(null); setDragOver(null)
    setToast(`"${item.label}" moved to ${toRole} → ${toSection === 'can' ? 'Can do' : 'Restricted'}`)
    setTimeout(() => setToast(null), 3000)
  }

  function deletePerm(role: Role, section: PermSection, id: string) {
    setRolePerms(prev => ({
      ...prev,
      [role]: { ...prev[role], [section]: prev[role][section].filter(p => p.id !== id) },
    }))
  }

  function saveEdit(role: Role, section: PermSection, id: string) {
    const v = editVal.trim()
    if (!v) { setEditingId(null); return }
    setRolePerms(prev => ({
      ...prev,
      [role]: { ...prev[role], [section]: prev[role][section].map(p => p.id === id ? { ...p, label: v } : p) },
    }))
    setEditingId(null)
  }

  function commitAdd(role: Role, section: PermSection) {
    const v = addVal.trim()
    if (!v) { setAddTarget(null); setAddVal(''); return }
    setRolePerms(prev => ({
      ...prev,
      [role]: { ...prev[role], [section]: [...prev[role][section], { id: `p${Date.now()}`, label: v }] },
    }))
    setAddVal(''); setAddTarget(null)
  }

  /* ── section renderer ── */
  function renderSection(role: Role, section: PermSection) {
    const cfg       = ROLE_CFG[role]
    const items     = rolePerms[role][section]
    const isCan     = section === 'can'
    const isTarget  = dragOver?.role === role && dragOver?.section === section
    const isDragging = !!dragItem
    const isAdding  = addTarget?.role === role && addTarget?.section === section

    const pillBg   = isCan ? 'rgba(16,185,129,0.07)' : 'rgba(139,144,167,0.07)'
    const pillBord = isCan ? 'rgba(16,185,129,0.2)'  : C.border
    const pillText = isCan ? '#065F46'                : C.navy

    return (
      <div
        onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDragOver({ role, section }) }}
        onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(null) }}
        onDrop={e => { e.preventDefault(); movePerm(role, section) }}
        style={{
          borderRadius: 10, padding: '8px',
          transition: 'background 0.15s, outline 0.15s',
          outline: isTarget
            ? `2px dashed ${cfg.accent}`
            : isDragging
              ? `1px dashed ${C.border}`
              : 'none',
          outlineOffset: -1,
          background: isTarget ? cfg.light : isDragging ? 'rgba(0,0,0,0.015)' : 'transparent',
          minHeight: isDragging ? 52 : 'auto',
        }}
      >
        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {isCan ? 'Can do' : 'Restricted'}
          </p>
          <button
            onClick={() => { setAddTarget({ role, section }); setAddVal(''); setEditingId(null) }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              padding: '2px 7px', borderRadius: 5, cursor: 'pointer',
              fontSize: 10.5, fontWeight: 600, color: cfg.color,
              background: cfg.light, border: `1px solid ${cfg.border}`,
            }}
          >
            <Plus size={9} /> Add
          </button>
        </div>

        {/* Pills list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {items.map(item => {
            const isGhost  = dragItem?.id === item.id
            const isEditing = editingId === item.id
            return (
              <div
                key={item.id}
                draggable={!isEditing}
                onDragStart={e => {
                  e.dataTransfer.setData('text/plain', item.id)
                  e.stopPropagation()
                  setDragItem({ role, section, id: item.id })
                }}
                onDragEnd={() => { setDragItem(null); setDragOver(null) }}
                className="perm-pill"
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '5px 7px', borderRadius: 7,
                  fontSize: 11.5, fontWeight: 500, color: pillText,
                  background: isGhost ? 'transparent' : pillBg,
                  border: `1px solid ${isGhost ? 'transparent' : pillBord}`,
                  opacity: isGhost ? 0.3 : 1,
                  cursor: isEditing ? 'default' : 'grab',
                  transition: 'opacity 0.15s',
                  userSelect: 'none',
                }}
              >
                {/* Grip */}
                <GripVertical size={11} style={{ flexShrink: 0, color: C.muted, opacity: 0.4 }} />

                {/* Section icon */}
                {isCan
                  ? <Check size={9}  color="#059669" strokeWidth={3}   style={{ flexShrink: 0 }} />
                  : <X     size={8}  color={C.muted}  strokeWidth={2.5} style={{ flexShrink: 0 }} />
                }

                {/* Label / edit input */}
                {isEditing ? (
                  <input
                    autoFocus
                    value={editVal}
                    onChange={e => setEditVal(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter')  saveEdit(role, section, item.id)
                      if (e.key === 'Escape') setEditingId(null)
                    }}
                    style={{
                      flex: 1, border: `1.5px solid ${cfg.accent}`, borderRadius: 5,
                      padding: '2px 6px', fontSize: 11.5, color: C.navy,
                      background: '#fff', outline: 'none',
                      fontFamily: "'DM Sans',system-ui,sans-serif",
                    }}
                  />
                ) : (
                  <span style={{ flex: 1, lineHeight: 1.4 }}>{item.label}</span>
                )}

                {/* Action buttons */}
                {isEditing ? (
                  <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
                    <button
                      title="Save"
                      onClick={() => saveEdit(role, section, item.id)}
                      style={{ background: cfg.light, border: `1px solid ${cfg.border}`, borderRadius: 4, width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: cfg.color }}
                    >
                      <Check size={9} strokeWidth={3} />
                    </button>
                    <button
                      title="Cancel"
                      onClick={() => setEditingId(null)}
                      style={{ background: C.hover, border: `1px solid ${C.border}`, borderRadius: 4, width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.muted }}
                    >
                      <X size={9} strokeWidth={2.5} />
                    </button>
                  </div>
                ) : (
                  <div className="pill-actions">
                    <button
                      title="Edit"
                      onClick={() => { setEditingId(item.id); setEditVal(item.label); setAddTarget(null) }}
                      onDragStart={e => e.stopPropagation()}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 3px', borderRadius: 4, display: 'flex', alignItems: 'center', color: C.muted }}
                    >
                      <Pencil size={9} />
                    </button>
                    <button
                      title="Delete"
                      onClick={() => deletePerm(role, section, item.id)}
                      onDragStart={e => e.stopPropagation()}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 3px', borderRadius: 4, display: 'flex', alignItems: 'center', color: '#EF4444' }}
                    >
                      <Trash2 size={9} />
                    </button>
                  </div>
                )}
              </div>
            )
          })}

          {/* Inline add row */}
          {isAdding && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 7px', borderRadius: 7,
              background: '#fff', border: `1.5px dashed ${cfg.accent}`,
            }}>
              {isCan
                ? <Check size={9}  color="#059669" strokeWidth={3}   style={{ flexShrink: 0 }} />
                : <X     size={8}  color={C.muted}  strokeWidth={2.5} style={{ flexShrink: 0 }} />
              }
              <input
                autoFocus
                value={addVal}
                onChange={e => setAddVal(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter')  commitAdd(role, section)
                  if (e.key === 'Escape') { setAddTarget(null); setAddVal('') }
                }}
                placeholder="New permission type…"
                style={{
                  flex: 1, border: 'none', outline: 'none',
                  fontSize: 11.5, color: C.navy, background: 'transparent',
                  padding: 0, fontFamily: "'DM Sans',system-ui,sans-serif",
                }}
              />
              <div style={{ display: 'flex', gap: 3 }}>
                <button
                  onClick={() => commitAdd(role, section)}
                  style={{ background: cfg.light, border: `1px solid ${cfg.border}`, borderRadius: 4, width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: cfg.color }}
                >
                  <Check size={9} strokeWidth={3} />
                </button>
                <button
                  onClick={() => { setAddTarget(null); setAddVal('') }}
                  style={{ background: C.hover, border: `1px solid ${C.border}`, borderRadius: 4, width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.muted }}
                >
                  <X size={9} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          )}

          {/* Empty state / drop hint */}
          {items.length === 0 && !isAdding && (
            <div style={{
              padding: '10px 8px', borderRadius: 7, textAlign: 'center',
              fontSize: 11, color: C.muted,
              border: `1px dashed ${isTarget ? cfg.accent : C.border}`,
              background: isTarget ? cfg.light : 'transparent',
              transition: 'background 0.15s',
            }}>
              {isDragging ? '↓ Drop here' : 'No items — click Add above'}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif" }}>
      <style>{`
        @keyframes raSpin  { to { transform: rotate(360deg) } }
        @keyframes raModal { from { opacity:0; transform:scale(0.96) } to { opacity:1; transform:scale(1) } }
        @keyframes raToast { 0%{opacity:0;transform:translateY(8px)} 10%{opacity:1;transform:translateY(0)} 85%{opacity:1} 100%{opacity:0} }
        .tr-row:hover { background: #F7F8FC !important; }
        .tab-btn { transition: color 0.15s, border-color 0.15s; }
        .perm-pill .pill-actions { display: none; align-items: center; gap: 2px; flex-shrink: 0; }
        .perm-pill:hover .pill-actions { display: flex !important; }
        .perm-pill:hover { filter: brightness(0.97); }
      `}</style>

      {/* ── Page header ── */}
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.navy }}>Role & Access Control</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: C.muted }}>
            Define what each role can access and reassign user permissions across the organisation.
          </p>
        </div>
        {/* ── Role badges ── */}
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          {(['Employee', 'Manager', 'Admin'] as Role[]).map(role => {
            const cfg = ROLE_CFG[role]
            return (
              <span key={role} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '4px 12px', borderRadius: 8,
                fontSize: 12.5, fontWeight: 600,
                background: cfg.light, color: cfg.color, border: `1px solid ${cfg.border}`,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
                onClick={() => { setTab('users'); setRFilter(role) }}
                onMouseEnter={e => { e.currentTarget.style.background = cfg.bg }}
                onMouseLeave={e => { e.currentTarget.style.background = cfg.light }}
              >
                {role} <strong>{counts[role]}</strong>
              </span>
            )
          })}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 24, borderBottom: `2px solid ${C.border}` }}>
        {([
          { id: 'users',       label: 'User Assignments'     },
          { id: 'roles',       label: 'Roles'                },
          { id: 'permissions', label: 'Permissions Overview' },
        ] as { id: Tab; label: string }[]).map(t => (
          <button key={t.id} className="tab-btn"
            onClick={() => setTab(t.id)}
            style={{
              padding: '9px 20px', fontSize: 13.5, fontWeight: 600, border: 'none',
              background: 'none', cursor: 'pointer', marginBottom: -2,
              borderBottom: `2px solid ${tab === t.id ? '#6D28D9' : 'transparent'}`,
              color: tab === t.id ? '#6D28D9' : C.muted,
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ══ TAB: Roles ══ */}
      {tab === 'roles' && (
        <div>
          {/* Search + Add Role bar */}
          <div style={{
            background: '#fff', border: `1px solid ${C.border}`,
            borderRadius: 14, padding: '12px 16px', marginBottom: 14,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
              <input value={roleSearch} onChange={e => setRoleSearch(e.target.value)}
                placeholder="Search roles…"
                style={{
                  width: '100%', height: 38, paddingLeft: 30, paddingRight: 10,
                  border: `1px solid ${C.border}`, borderRadius: 8,
                  fontSize: 13, color: C.navy, background: '#fff', outline: 'none',
                  fontFamily: "'DM Sans',system-ui,sans-serif", boxSizing: 'border-box',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#8B5CF6' }}
                onBlur={e => { e.currentTarget.style.borderColor = C.border }}
              />
            </div>
            <button
              onClick={() => { setToast('Add Role — coming soon'); setTimeout(() => setToast(null), 2500) }}
              style={{
                height: 38, padding: '0 16px', borderRadius: 8, border: 'none',
                background: C.navy, color: '#fff', fontSize: 13, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex',
                alignItems: 'center', gap: 7, flexShrink: 0, transition: 'background 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#2A3050' }}
              onMouseLeave={e => { e.currentTarget.style.background = C.navy }}
            >
              <Plus size={15} strokeWidth={2.5} /> Add Role
            </button>
          </div>

          {/* Table */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden', boxShadow: '0 1px 6px rgba(28,32,53,0.04)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: C.surface }}>
                  {['Role Name', 'Permissions', 'Created Date', 'Action'].map((h, i) => (
                    <th key={h} style={{
                      padding: '11px 18px', textAlign: i === 3 ? 'center' : 'left',
                      fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em',
                      borderBottom: `1px solid ${C.border}`,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRoles.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '48px 20px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: C.surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ShieldCheck size={20} color={C.muted} />
                        </div>
                        <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: C.navy }}>No roles found</p>
                        <p style={{ margin: 0, fontSize: 12.5, color: C.muted }}>Try adjusting your search</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRoles.map((r, i) => (
                    <tr key={r.id} className="tr-row"
                      style={{ borderTop: i === 0 ? 'none' : `1px solid ${C.border}`, background: '#fff', transition: 'background 0.12s' }}>

                      {/* Role Name */}
                      <td style={{ padding: '13px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: 9, background: r.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <r.Icon size={16} color={r.color} />
                          </div>
                          <span style={{ fontSize: 13.5, fontWeight: 600, color: C.navy }}>{r.name}</span>
                        </div>
                      </td>

                      {/* Permissions */}
                      <td style={{ padding: '13px 18px' }}>
                        <span style={{
                          fontSize: 12, fontWeight: 700, color: r.color,
                          background: r.bg, borderRadius: 6, padding: '3px 10px',
                        }}>{r.permissions} permissions</span>
                      </td>

                      {/* Created Date */}
                      <td style={{ padding: '13px 18px' }}>
                        <span style={{ fontSize: 12.5, color: C.muted }}>{r.created}</span>
                      </td>

                      {/* Action */}
                      <td style={{ padding: '13px 18px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <button
                            title="Edit role"
                            onClick={() => { setToast(`Edit "${r.name}" — coming soon`); setTimeout(() => setToast(null), 2500) }}
                            style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.12s' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#8B5CF6'; e.currentTarget.style.color = '#6D28D9' }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            title="Delete role"
                            onClick={() => deleteRole(r.id)}
                            style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.12s' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; e.currentTarget.style.color = '#EF4444' }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Footer */}
            <div style={{
              padding: '12px 20px', borderTop: `1px solid ${C.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: C.surface,
            }}>
              <span style={{ fontSize: 12.5, color: C.muted }}>
                Showing <strong style={{ color: C.navy }}>{filteredRoles.length}</strong> of <strong style={{ color: C.navy }}>{roleRows.length}</strong> roles
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ══ TAB 1: Permissions Overview ══ */}
      {tab === 'permissions' && (
        <div>
          {/* Instruction banner */}
          <div style={{
            marginBottom: 16, padding: '10px 16px', borderRadius: 10,
            background: C.surface, border: `1px solid ${C.border}`,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <GripVertical size={14} color={C.muted} style={{ flexShrink: 0, opacity: 0.7 }} />
            <p style={{ margin: 0, fontSize: 12.5, color: C.muted, lineHeight: 1.5 }}>
              <strong>Drag</strong> any permission between role cards to reassign it. <strong>Hover</strong> a permission to edit or delete. Use <strong>+ Add</strong> to create new types.
            </p>
          </div>

          {/* Role cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {(['Employee', 'Manager', 'Admin'] as Role[]).map(role => {
              const cfg     = ROLE_CFG[role]
              const meta    = ROLE_META[role]
              const Icon    = meta.Icon
              const isCardTarget = dragOver?.role === role

              return (
                <div key={role} style={{
                  background: '#fff',
                  border: `2px solid ${isCardTarget ? cfg.accent : C.border}`,
                  borderRadius: 16, overflow: 'hidden',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                  boxShadow: isCardTarget ? `0 0 0 4px ${cfg.light}` : 'none',
                }}>
                  {/* Card header */}
                  <div style={{ padding: '13px 16px', background: role === 'Employee' ? '#E8ECFF' : cfg.bg, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                      background: '#fff', border: `1px solid ${cfg.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={16} color={cfg.color} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: cfg.color }}>{role}</p>
                      <p style={{ margin: '1px 0 0', fontSize: 10.5, color: cfg.color, opacity: 0.65, lineHeight: 1.3 }}>{meta.tagline}</p>
                    </div>
                    <span style={{
                      fontSize: 12, fontWeight: 800, color: cfg.color,
                      background: '#fff', border: `1px solid ${cfg.border}`,
                      borderRadius: 7, padding: '2px 9px',
                    }}>{counts[role]} users</span>
                  </div>

                  {/* Card body */}
                  <div style={{ padding: '14px 12px 18px', display: 'flex', flexDirection: 'column', gap: 20 }}>

                    {/* Can do */}
                    {renderSection(role, 'can')}

                    {/* Divider */}
                    <div style={{ borderTop: `1px solid ${C.border}` }} />

                    {/* Restricted */}
                    {(rolePerms[role].restricted.length > 0
                      || (addTarget?.role === role && addTarget.section === 'restricted')
                      || (dragOver?.role  === role && dragOver.section  === 'restricted')
                    ) ? (
                      renderSection(role, 'restricted')
                    ) : (
                      /* Collapsed restricted zone — still accepts drops */
                      <div
                        onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDragOver({ role, section: 'restricted' }) }}
                        onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(null) }}
                        onDrop={e => { e.preventDefault(); movePerm(role, 'restricted') }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                          <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Restricted</p>
                          <button
                            onClick={() => { setAddTarget({ role, section: 'restricted' }); setAddVal(''); setEditingId(null) }}
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: 3,
                              padding: '2px 7px', borderRadius: 5, cursor: 'pointer',
                              fontSize: 10.5, fontWeight: 600, color: cfg.color,
                              background: cfg.light, border: `1px solid ${cfg.border}`,
                            }}
                          >
                            <Plus size={9} /> Add
                          </button>
                        </div>
                        {role === 'Admin' ? (
                          <div style={{ padding: '8px 10px', borderRadius: 8, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.14)' }}>
                            <p style={{ margin: 0, fontSize: 11, color: '#047857', fontWeight: 600 }}>Full system access — no restrictions</p>
                          </div>
                        ) : (
                          <div style={{
                            padding: '9px', borderRadius: 7, textAlign: 'center',
                            fontSize: 11, color: C.muted,
                            border: `1px dashed ${C.border}`,
                          }}>
                            No restricted items — drop here or click Add
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ══ TAB 2: User Assignments ══ */}
      {tab === 'users' && (
        <div>
          {/* Search + filter bar */}
          <div style={{
            background: '#fff', border: `1px solid ${C.border}`,
            borderRadius: 14, padding: '12px 16px', marginBottom: 14,
            display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
          }}>
            <div style={{ position: 'relative', flex: '1 1 200px' }}>
              <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                onFocus={() => setSFocus(true)} onBlur={() => setSFocus(false)}
                placeholder="Search by name, ID or email…"
                style={{
                  width: '100%', height: 36, paddingLeft: 30, paddingRight: 10,
                  border: `1px solid ${sFocus ? '#8B5CF6' : C.border}`, borderRadius: 8,
                  fontSize: 13, color: C.navy, background: '#fff', outline: 'none',
                  fontFamily: "'DM Sans',system-ui,sans-serif", boxSizing: 'border-box',
                }}
              />
            </div>
            <Dropdown value={rFilter} options={ROLES_FILTER} onChange={setRFilter} minW={130} />
            <Dropdown value={dFilter} options={DEPARTMENTS}  onChange={setDFilter} minW={158} />
            {anyFilter && (
              <button onClick={() => { setSearch(''); setRFilter('All Roles'); setDFilter('All Departments') }}
                style={{ height: 36, padding: '0 12px', borderRadius: 8, fontSize: 12.5, fontWeight: 500, border: `1px solid ${C.border}`, background: C.hover, color: C.muted, cursor: 'pointer' }}>
                Clear
              </button>
            )}
          </div>

          {/* Table */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden', boxShadow: '0 1px 6px rgba(28,32,53,0.04)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: C.surface }}>
                  {['Employee', 'Department', 'Emp ID', 'Role', 'Since', 'Action'].map((h, i) => (
                    <th key={h} style={{
                      padding: '11px 18px', textAlign: i === 5 ? 'center' : 'left',
                      fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em',
                      borderBottom: `1px solid ${C.border}`,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '48px 20px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: C.surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Users size={20} color={C.muted} />
                        </div>
                        <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: C.navy }}>No users found</p>
                        <p style={{ margin: 0, fontSize: 12.5, color: C.muted }}>Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((u, i) => {
                    const cfg = ROLE_CFG[u.role]
                    return (
                      <tr key={u.id} className="tr-row"
                        style={{ borderTop: i === 0 ? 'none' : `1px solid ${C.border}`, background: '#fff', transition: 'background 0.12s' }}>

                        <td style={{ padding: '13px 18px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ position: 'relative', flexShrink: 0 }}>
                              <img src={`https://i.pravatar.cc/36?img=${u.avatar}`} alt={u.name}
                                style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
                              <div style={{
                                position: 'absolute', bottom: 0, right: 0,
                                width: 10, height: 10, borderRadius: '50%',
                                background: cfg.accent, border: '2px solid #fff',
                              }} />
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: C.navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</p>
                              <p style={{ margin: '2px 0 0', fontSize: 11.5, color: C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.email}</p>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: '13px 18px' }}>
                          <span style={{ fontSize: 13, color: C.navy, fontWeight: 500 }}>{u.department}</span>
                        </td>

                        <td style={{ padding: '13px 18px' }}>
                          <span style={{
                            fontSize: 12.5, fontWeight: 700, color: '#4338CA',
                            background: '#EEF2FF', borderRadius: 6, padding: '3px 8px',
                            fontFamily: 'monospace',
                          }}>{u.empId}</span>
                        </td>

                        <td style={{ padding: '13px 18px' }}>
                          <RoleBadge role={u.role} />
                        </td>

                        <td style={{ padding: '13px 18px' }}>
                          <span style={{ fontSize: 12.5, color: C.muted }}>{u.lastChanged}</span>
                        </td>

                        <td style={{ padding: '13px 18px', textAlign: 'center' }}>
                          <button
                            onClick={() => openModal(u)}
                            style={{
                              height: 32, padding: '0 13px', borderRadius: 8,
                              fontSize: 12.5, fontWeight: 600,
                              border: `1px solid ${C.border}`,
                              background: '#fff', color: C.navy, cursor: 'pointer',
                              display: 'inline-flex', alignItems: 'center', gap: 6,
                              transition: 'border-color 0.12s, color 0.12s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = cfg.accent; e.currentTarget.style.color = cfg.color }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.navy }}
                          >
                            <ArrowLeftRight size={12} /> Change Role
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>

            {/* Pagination Footer */}
            <div style={{
              padding: '12px 20px', borderTop: `1px solid ${C.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: C.surface,
            }}>
              <span style={{ fontSize: 12.5, color: C.muted }}>
                Showing <strong style={{ color: C.navy }}>{filtered.length}</strong> of <strong style={{ color: C.navy }}>{users.length}</strong> users
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Change Role Modal ── */}
      {modalUser && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(10,12,28,0.5)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'DM Sans',system-ui,sans-serif",
        }}
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div style={{
            background: '#fff', borderRadius: 22, width: 490,
            boxShadow: '0 32px 80px rgba(10,12,28,0.2)',
            overflow: 'hidden', animation: 'raModal 0.18s ease',
          }}>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.border}`, background: C.surface, display: 'flex', alignItems: 'center', gap: 14 }}>
              <img src={`https://i.pravatar.cc/44?img=${modalUser.avatar}`} alt={modalUser.name}
                style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: C.navy }}>{modalUser.name}</p>
                <p style={{ margin: '3px 0 0', fontSize: 12, color: C.muted }}>{modalUser.department} · {modalUser.empId}</p>
              </div>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, display: 'flex', padding: 4, borderRadius: 6 }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '20px 24px' }}>
              <p style={{ margin: '0 0 14px', fontSize: 13, color: C.muted }}>
                Currently <RoleBadge role={modalUser.role} /> — select a new role to assign:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(['Employee', 'Manager', 'Admin'] as Role[]).map(r => {
                  const cfg  = ROLE_CFG[r]
                  const Icon = ROLE_META[r].Icon
                  const isCurrent = r === modalUser.role
                  const isSel     = r === selectedNew
                  return (
                    <button key={r}
                      onClick={() => !isCurrent && setSelectedNew(r)}
                      style={{
                        width: '100%', textAlign: 'left', padding: '12px 16px', borderRadius: 12,
                        cursor: isCurrent ? 'default' : 'pointer', opacity: isCurrent ? 0.5 : 1,
                        border: `1.5px solid ${isSel ? cfg.accent : C.border}`,
                        background: isSel ? cfg.bg : '#fff',
                        display: 'flex', alignItems: 'center', gap: 12,
                        transition: 'border-color 0.14s, background 0.14s',
                      }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                        background: isSel ? '#fff' : cfg.bg, border: `1px solid ${cfg.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon size={16} color={cfg.color} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: isSel ? cfg.color : C.navy }}>
                          {r}
                          {isCurrent && <span style={{ fontSize: 11, fontWeight: 400, color: C.muted, marginLeft: 6 }}>(current)</span>}
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
                <div style={{ marginTop: 14, padding: '11px 14px', borderRadius: 10, background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <p style={{ margin: 0, fontSize: 12.5, color: '#92400E', lineHeight: 1.55 }}>
                    This will change <strong>{modalUser.name.split(' ')[0]}'s</strong> access from <strong>{modalUser.role}</strong> to <strong>{selectedNew}</strong>. The change takes effect immediately.
                  </p>
                </div>
              )}
            </div>

            <div style={{ padding: '0 24px 22px', display: 'flex', gap: 10 }}>
              <button onClick={closeModal} style={{ flex: 1, height: 42, borderRadius: 10, fontSize: 13.5, fontWeight: 600, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={confirmChange} disabled={!selectedNew || saving}
                style={{
                  flex: 2, height: 42, borderRadius: 10, fontSize: 13.5, fontWeight: 700, border: 'none',
                  background: !selectedNew ? C.hover : saving ? '#818CF8' : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                  color: !selectedNew ? C.muted : '#fff',
                  cursor: !selectedNew || saving ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'opacity 0.15s',
                }}>
                {saving ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                      style={{ animation: 'raSpin 0.75s linear infinite' }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
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
          zIndex: 10000, animation: 'raToast 3.5s ease forwards',
          background: C.navy, color: '#fff', borderRadius: 12,
          padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 8px 32px rgba(10,12,28,0.22)', fontFamily: "'DM Sans',system-ui,sans-serif", whiteSpace: 'nowrap',
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
