import { useState } from 'react'
import { Search, ChevronDown, Edit, Laptop, Monitor, Smartphone, Package, X, Eye, Plus } from 'lucide-react'

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', surface: '#F7F8FC' }

interface EmployeeAsset {
  id: string
  avatar: number
  employeeName: string
  role: string
  email: string
  systemId: string
  assetDescription: string
  category: string
  assignedDate: string
}

interface PendingEmployee {
  id: string
  avatar: number
  employeeName: string
  role: string
  email: string
}

const EMPLOYEE_ASSETS: EmployeeAsset[] = [
  {
    id: 'ea-001',
    avatar: 47,
    employeeName: 'Arjun Menon',
    role: 'Senior Developer',
    email: 'arjun.menon@concert.com',
    systemId: 'SYS-2024-0042',
    assetDescription: 'MacBook Pro 14" M2',
    category: 'Laptop',
    assignedDate: '2026-01-15',
  },
  {
    id: 'ea-001-2',
    avatar: 47,
    employeeName: 'Arjun Menon',
    role: 'Senior Developer',
    email: 'arjun.menon@concert.com',
    systemId: 'SYS-2024-0215',
    assetDescription: 'Dell 27" 4K Monitor',
    category: 'Monitor',
    assignedDate: '2026-01-20',
  },
  {
    id: 'ea-001-3',
    avatar: 47,
    employeeName: 'Arjun Menon',
    role: 'Senior Developer',
    email: 'arjun.menon@concert.com',
    systemId: 'SYS-2024-0089',
    assetDescription: 'Apple Magic Keyboard & Mouse',
    category: 'Accessories',
    assignedDate: '2026-02-01',
  },
  {
    id: 'ea-002',
    avatar: 10,
    employeeName: 'Priya Sharma',
    role: 'Product Manager',
    email: 'priya.sharma@concert.com',
    systemId: 'SYS-2024-0089',
    assetDescription: 'Dell 27" 4K Monitor',
    category: 'Monitor',
    assignedDate: '2026-01-15',
  },
  {
    id: 'ea-003',
    avatar: 25,
    employeeName: 'Amit Kumar',
    role: 'UI/UX Designer',
    email: 'amit.kumar@concert.com',
    systemId: 'SYS-2024-0103',
    assetDescription: 'iPad Pro 12.9"',
    category: 'Tablet',
    assignedDate: '2026-02-20',
  },
  {
    id: 'ea-004',
    avatar: 36,
    employeeName: 'Neha Patel',
    role: 'QA Engineer',
    email: 'neha.patel@concert.com',
    systemId: 'SYS-2024-0156',
    assetDescription: 'iPhone 15 Pro',
    category: 'Phone',
    assignedDate: '2026-03-10',
  },
  {
    id: 'ea-005',
    avatar: 52,
    employeeName: 'Rajesh Iyer',
    role: 'Backend Engineer',
    email: 'rajesh.iyer@concert.com',
    systemId: 'SYS-2024-0201',
    assetDescription: 'Dell XPS 15',
    category: 'Laptop',
    assignedDate: '2026-03-15',
  },
  {
    id: 'ea-006',
    avatar: 33,
    employeeName: 'Divya Nair',
    role: 'Data Analyst',
    email: 'divya.nair@concert.com',
    systemId: 'SYS-2024-0242',
    assetDescription: 'Wireless Mouse & Keyboard',
    category: 'Accessories',
    assignedDate: '2026-04-01',
  },
  {
    id: 'ea-007',
    avatar: 44,
    employeeName: 'Emma Wilson',
    role: 'Frontend Developer',
    email: 'emma.wilson@concert.com',
    systemId: 'SYS-2024-0278',
    assetDescription: 'MacBook Air M1',
    category: 'Laptop',
    assignedDate: '2026-02-10',
  },
  {
    id: 'ea-008',
    avatar: 20,
    employeeName: 'Tom Davis',
    role: 'DevOps Engineer',
    email: 'tom.davis@concert.com',
    systemId: 'SYS-2024-0312',
    assetDescription: 'LG 24" Monitor',
    category: 'Monitor',
    assignedDate: '2026-03-05',
  },
  {
    id: 'ea-009',
    avatar: 38,
    employeeName: 'David Brown',
    role: 'Tech Lead',
    email: 'david.brown@concert.com',
    systemId: 'SYS-2024-0345',
    assetDescription: 'MacBook Pro 16" M3',
    category: 'Laptop',
    assignedDate: '2026-01-20',
  },
  {
    id: 'ea-010',
    avatar: 60,
    employeeName: 'James Wilson',
    role: 'QA Lead',
    email: 'james.wilson@concert.com',
    systemId: 'SYS-2024-0378',
    assetDescription: 'Dell U2424H Monitor',
    category: 'Monitor',
    assignedDate: '2026-02-25',
  },
  {
    id: 'ea-011',
    avatar: 41,
    employeeName: 'Fatima Al-Zahra',
    role: 'Product Designer',
    email: 'fatima.zahra@concert.com',
    systemId: 'SYS-2024-0401',
    assetDescription: 'iPad Air 5',
    category: 'Tablet',
    assignedDate: '2026-03-12',
  },
  {
    id: 'ea-012',
    avatar: 56,
    employeeName: 'Karthik Nair',
    role: 'Backend Developer',
    email: 'karthik.nair@concert.com',
    systemId: 'SYS-2024-0434',
    assetDescription: 'Dell XPS 13',
    category: 'Laptop',
    assignedDate: '2026-04-05',
  },
  {
    id: 'ea-013',
    avatar: 29,
    employeeName: 'Rohan Mehta',
    role: 'Engineering Manager',
    email: 'rohan.mehta@concert.com',
    systemId: 'SYS-2024-0467',
    assetDescription: 'MacBook Pro 14" M2 Max',
    category: 'Laptop',
    assignedDate: '2026-01-10',
  },
  {
    id: 'ea-014',
    avatar: 63,
    employeeName: 'Chris Thompson',
    role: 'Software Engineer',
    email: 'chris.thompson@concert.com',
    systemId: 'SYS-2024-0500',
    assetDescription: 'Logitech MX Keyboard',
    category: 'Accessories',
    assignedDate: '2026-03-20',
  },
  {
    id: 'ea-015',
    avatar: 18,
    employeeName: 'Sarah Johnson',
    role: 'HR Manager',
    email: 'sarah.johnson@concert.com',
    systemId: 'SYS-2024-0533',
    assetDescription: 'iPhone 15 Pro Max',
    category: 'Phone',
    assignedDate: '2026-04-02',
  },
]

const PENDING_EMPLOYEES: PendingEmployee[] = [
  { id: 'pe-001', avatar: 15, employeeName: 'Vikram Singh', role: 'Junior Developer', email: 'vikram.singh@concert.com' },
  { id: 'pe-002', avatar: 22, employeeName: 'Anjali Verma', role: 'UI Developer', email: 'anjali.verma@concert.com' },
  { id: 'pe-003', avatar: 31, employeeName: 'Manish Patel', role: 'QA Intern', email: 'manish.patel@concert.com' },
  { id: 'pe-004', avatar: 48, employeeName: 'Riya Gupta', role: 'Business Analyst', email: 'riya.gupta@concert.com' },
  { id: 'pe-005', avatar: 64, employeeName: 'Arjun Verma', role: 'Support Engineer', email: 'arjun.verma@concert.com' },
]

const ROLES = ['All Roles', 'Senior Developer', 'Product Manager', 'UI/UX Designer', 'QA Engineer', 'Backend Engineer', 'Data Analyst', 'Frontend Developer', 'DevOps Engineer', 'Tech Lead', 'QA Lead', 'Product Designer', 'Engineering Manager', 'Software Engineer', 'HR Manager']
const CATEGORIES = ['All Categories', 'Laptop', 'Monitor', 'Phone', 'Tablet', 'Accessories']

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const getCategoryIcon = (category: string) => {
  if (category === 'Laptop') return <Laptop size={14} style={{ color: '#6366F1' }} />
  if (category === 'Monitor') return <Monitor size={14} style={{ color: '#3B82F6' }} />
  if (category === 'Phone') return <Smartphone size={14} style={{ color: '#10B981' }} />
  return <Package size={14} style={{ color: '#8B90A7' }} />
}

function Dropdown({ value, options, onChange, minW = 140 }: { value: string; options: string[]; onChange: (v: string) => void; minW?: number }) {
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          height: 36, padding: '0 28px 0 11px',
          border: `1px solid ${C.border}`, borderRadius: 8,
          fontSize: 12.5, fontWeight: 500,
          color: value.startsWith('All') ? C.muted : C.navy,
          background: '#fff', outline: 'none', cursor: 'pointer',
          appearance: 'none', fontFamily: "'DM Sans', system-ui, sans-serif", minWidth: minW,
        }}
        onFocus={e => { e.target.style.borderColor = '#7C3AED' }}
        onBlur={e => { e.target.style.borderColor = C.border }}
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={11} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
    </div>
  )
}

export default function AdminAssetManagementPage() {
  const [assetStatus, setAssetStatus] = useState<'assigned' | 'pending'>('assigned')
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All Roles')
  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const [searchFocus, setSearchFocus] = useState(false)
  const [expandedEmployees, setExpandedEmployees] = useState<Set<string>>(new Set())
  const [editDetails, setEditDetails] = useState<EmployeeAsset | null>(null)
  const [addEntryModal, setAddEntryModal] = useState<PendingEmployee | null>(null)
  const [formData, setFormData] = useState({ systemId: '', assetDescription: '', category: 'Laptop', assignedDate: '' })
  const [addedAssets, setAddedAssets] = useState<{ systemId: string; assetDescription: string; category: string; assignedDate: string }[]>([])
  const [editingAssetIdx, setEditingAssetIdx] = useState<number | null>(null)
  const [isSavingAssets, setIsSavingAssets] = useState(false)

  // Group assets by employee (by email to group same employee)
  const groupedAssets = EMPLOYEE_ASSETS.reduce((acc, asset) => {
    const empKey = asset.email
    if (!acc[empKey]) {
      acc[empKey] = {
        id: asset.id.split('-')[0] + '-' + asset.email.split('@')[0],
        employeeName: asset.employeeName,
        role: asset.role,
        email: asset.email,
        avatar: asset.avatar,
        assets: [],
      }
    }
    acc[empKey].assets.push(asset)
    return acc
  }, {} as Record<string, { id: string; employeeName: string; role: string; email: string; avatar: number; assets: EmployeeAsset[] }>)

  const groupedList = Object.values(groupedAssets)

  const filtered = groupedList.filter(emp => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      emp.employeeName.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q) ||
      emp.assets.some(a => a.systemId.toLowerCase().includes(q) || a.assetDescription.toLowerCase().includes(q))
    const matchRole = roleFilter === 'All Roles' || emp.role === roleFilter
    const matchCategory = categoryFilter === 'All Categories' || emp.assets.some(a => a.category === categoryFilter)
    return matchSearch && matchRole && matchCategory
  })

  const anyFilter = !!(search || roleFilter !== 'All Roles' || categoryFilter !== 'All Categories')

  const toggleExpandEmployee = (empId: string) => {
    setExpandedEmployees(prev => {
      const next = new Set(prev)
      if (next.has(empId)) {
        next.delete(empId)
      } else {
        next.add(empId)
      }
      return next
    })
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        .ast-row:hover { background: #F7F8FC !important; }
        .ast-row { transition: background 0.12s; }
      `}</style>

      {/* Page header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold" style={{ color: C.navy }}>Asset Management</h1>
          <p className="text-sm mt-0.5" style={{ color: '#787878', fontWeight: 500 }}>Manage and track all employee asset allocations</p>
        </div>
      </div>


      {/* ── PENDING ASSETS VIEW ────────────────────────────────────────── */}
      {assetStatus === 'pending' && (
        <>
          {/* Search Bar with Switch */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '14px 18px', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 220 }}>
                <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onFocus={() => setSearchFocus(true)}
                  onBlur={() => setSearchFocus(false)}
                  placeholder="Search by name, email, or role…"
                  style={{
                    width: '100%', height: 38, paddingLeft: 34, paddingRight: 12,
                    border: `1px solid ${searchFocus ? '#7C3AED' : C.border}`, borderRadius: 9,
                    fontSize: 13, color: C.navy, background: '#fff', outline: 'none',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                  }}
                />
              </div>

              {/* Asset Status Switch */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: C.hover, borderRadius: 8, padding: '4px', border: `1px solid ${C.border}` }}>
                <button
                  onClick={() => setAssetStatus('assigned')}
                  style={{
                    padding: '6px 14px', fontSize: 12, fontWeight: 600,
                    color: (assetStatus as string) === 'assigned' ? '#fff' : C.navy,
                    background: (assetStatus as string) === 'assigned' ? C.navy : 'transparent',
                    border: 'none', borderRadius: 6, cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  Assigned
                </button>
                <button
                  onClick={() => setAssetStatus('pending')}
                  style={{
                    padding: '6px 14px', fontSize: 12, fontWeight: 600,
                    color: (assetStatus as string) === 'pending' ? '#fff' : C.navy,
                    background: (assetStatus as string) === 'pending' ? C.navy : 'transparent',
                    border: 'none', borderRadius: 6, cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  Pending ({PENDING_EMPLOYEES.length})
                </button>
              </div>

              {search && (
                <button
                  onClick={() => setSearch('')}
                  style={{ height: 38, padding: '0 14px', borderRadius: 9, fontSize: 13, fontWeight: 500, border: `1px solid ${C.border}`, background: C.hover, color: C.muted, cursor: 'pointer' }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Pending Employees Table */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
            {/* Table Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '40px 1.4fr 1.2fr 1.6fr 0.8fr',
                gap: 14,
                padding: '14px 18px',
                background: C.surface,
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              {['', 'Name', 'Role', 'Email', 'Action'].map((col) => (
                <span
                  key={col}
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: C.muted,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  {col}
                </span>
              ))}
            </div>

            {/* Table Rows */}
            {PENDING_EMPLOYEES.filter(emp => !search || emp.employeeName.toLowerCase().includes(search.toLowerCase()) || emp.email.toLowerCase().includes(search.toLowerCase()) || emp.role.toLowerCase().includes(search.toLowerCase())).length === 0 ? (
              <div style={{ padding: '48px 20px', textAlign: 'center' }}>
                <p style={{ fontSize: 14, color: C.muted }}>No pending employees found.</p>
              </div>
            ) : (
              PENDING_EMPLOYEES.filter(emp => !search || emp.employeeName.toLowerCase().includes(search.toLowerCase()) || emp.email.toLowerCase().includes(search.toLowerCase()) || emp.role.toLowerCase().includes(search.toLowerCase())).map((emp, idx, filtered) => (
                <div
                  key={emp.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 1.4fr 1.2fr 1.6fr 0.8fr',
                    gap: 14,
                    padding: '12px 18px',
                    borderBottom: idx < filtered.length - 1 ? `1px solid ${C.border}` : 'none',
                    alignItems: 'center',
                    minHeight: 60,
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = C.hover }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#fff' }}
                >
                  {/* Avatar */}
                  <img
                    src={`https://i.pravatar.cc/32?img=${emp.avatar}`}
                    alt={emp.employeeName}
                    style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', display: 'block' }}
                  />

                  {/* Name */}
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>
                    {emp.employeeName}
                  </span>

                  {/* Role */}
                  <span style={{ fontSize: 12.5, fontWeight: 500, color: C.navy }}>
                    {emp.role}
                  </span>

                  {/* Email */}
                  <span style={{ fontSize: 12, color: C.muted, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                    {emp.email}
                  </span>

                  {/* Add Entry Button */}
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <button
                      onClick={() => { setAddEntryModal(emp); setFormData({ systemId: '', assetDescription: '', category: 'Laptop', assignedDate: '' }); }}
                      style={{
                        padding: '4px 10px', fontSize: 11, fontWeight: 600,
                        color: '#6366F1', background: 'rgba(99,102,241,0.10)',
                        border: '1px solid rgba(99,102,241,0.20)', borderRadius: 5,
                        cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(99,102,241,0.15)'
                        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.30)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(99,102,241,0.10)'
                        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.20)'
                      }}
                    >
                      Add Entry
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Footer */}
            {PENDING_EMPLOYEES.filter(emp => !search || emp.employeeName.toLowerCase().includes(search.toLowerCase()) || emp.email.toLowerCase().includes(search.toLowerCase()) || emp.role.toLowerCase().includes(search.toLowerCase())).length > 0 && (
              <div style={{ padding: '10px 18px', borderTop: `1px solid ${C.border}`, background: C.surface }}>
                <span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>
                  Showing <strong style={{ color: C.navy }}>{PENDING_EMPLOYEES.filter(emp => !search || emp.employeeName.toLowerCase().includes(search.toLowerCase()) || emp.email.toLowerCase().includes(search.toLowerCase()) || emp.role.toLowerCase().includes(search.toLowerCase())).length}</strong> of <strong style={{ color: C.navy }}>{PENDING_EMPLOYEES.length}</strong> pending employees
                </span>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── ASSIGNED ASSETS VIEW ───────────────────────────────────────── */}
      {assetStatus === 'assigned' && (
        <>
          {/* ── Search & Filter Card ──────────────────────────────────────── */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '14px 18px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Search Bar */}
          <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 220 }}>
            <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              placeholder="Search by name, email, ID, or asset…"
              style={{
                width: '100%', height: 38, paddingLeft: 34, paddingRight: 12,
                border: `1px solid ${searchFocus ? '#7C3AED' : C.border}`, borderRadius: 9,
                fontSize: 13, color: C.navy, background: '#fff', outline: 'none',
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}
            />
          </div>

          {/* Role Filter */}
          <Dropdown value={roleFilter} options={ROLES} onChange={setRoleFilter} minW={145} />

          {/* Category Filter */}
          <Dropdown value={categoryFilter} options={CATEGORIES} onChange={setCategoryFilter} minW={160} />

          {/* Asset Status Switch */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: C.hover, borderRadius: 8, padding: '4px', border: `1px solid ${C.border}` }}>
            <button
              onClick={() => setAssetStatus('assigned')}
              style={{
                padding: '6px 14px', fontSize: 12, fontWeight: 600,
                color: (assetStatus as string) === 'assigned' ? '#fff' : C.navy,
                background: (assetStatus as string) === 'assigned' ? C.navy : 'transparent',
                border: 'none', borderRadius: 6, cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              Assigned ({groupedList.length})
            </button>
            <button
              onClick={() => setAssetStatus('pending')}
              style={{
                padding: '6px 14px', fontSize: 12, fontWeight: 600,
                color: (assetStatus as string) === 'pending' ? '#fff' : C.navy,
                background: (assetStatus as string) === 'pending' ? C.navy : 'transparent',
                border: 'none', borderRadius: 6, cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              Pending ({PENDING_EMPLOYEES.length})
            </button>
          </div>

          {/* Clear Button */}
          {anyFilter && (
            <button
              onClick={() => { setSearch(''); setRoleFilter('All Roles'); setCategoryFilter('All Categories') }}
              style={{ height: 38, padding: '0 14px', borderRadius: 9, fontSize: 13, fontWeight: 500, border: `1px solid ${C.border}`, background: C.hover, color: C.muted, cursor: 'pointer' }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-lg"
          style={{
            background: '#fff',
            border: `1px solid ${C.border}`,
            padding: '60px 40px',
            textAlign: 'center',
          }}
        >
          <div style={{ width: 48, height: 48, borderRadius: 12, background: C.hover, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Package size={20} style={{ color: C.muted }} />
          </div>
          <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 4 }}>No assets found</p>
          <p style={{ fontSize: 12.5, color: C.muted }}>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
          {/* Table Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '40px 1.4fr 1.2fr 1.6fr 0.5fr',
              gap: 14,
              padding: '14px 18px',
              background: C.surface,
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            {['', 'Employee Name', 'Role', 'Email', 'Actions'].map((col) => (
              <span
                key={col}
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: C.muted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                {col}
              </span>
            ))}
          </div>

          {/* Table Rows */}
          {filtered.map((emp) => {
            const isExpanded = expandedEmployees.has(emp.id)
            return (
              <div key={emp.id}>
                {/* Main Row */}
                <div
                  className="ast-row"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 1.4fr 1.2fr 1.6fr 0.5fr',
                    gap: 14,
                    padding: '12px 18px',
                    borderBottom: `1px solid ${C.border}`,
                    alignItems: 'center',
                    minHeight: 60,
                  }}
                >
                  {/* Avatar */}
                  <div>
                    <img
                      src={`https://i.pravatar.cc/32?img=${emp.avatar}`}
                      alt={emp.employeeName}
                      style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>

                  {/* Employee Name */}
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>
                    {emp.employeeName}
                  </span>

                  {/* Role */}
                  <span style={{ fontSize: 12.5, fontWeight: 500, color: C.navy }}>
                    {emp.role}
                  </span>

                  {/* Email */}
                  <span style={{ fontSize: 12, color: C.muted, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                    {emp.email}
                  </span>

                  {/* Actions - Eye & Plus Icons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <button
                      onClick={() => toggleExpandEmployee(emp.id)}
                      title="View assets"
                      style={{
                        width: 32, height: 32, borderRadius: 8,
                        border: `1px solid ${C.border}`, background: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(99,102,241,0.08)'
                        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.30)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fff'
                        e.currentTarget.style.borderColor = C.border
                      }}
                    >
                      <Eye size={14} strokeWidth={1.8} style={{ color: isExpanded ? '#6366F1' : C.muted }} />
                    </button>
                    <button
                      title="Add asset"
                      style={{
                        width: 32, height: 32, borderRadius: 8,
                        border: `1px solid ${C.border}`, background: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(14,168,106,0.08)'
                        e.currentTarget.style.borderColor = 'rgba(14,168,106,0.30)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fff'
                        e.currentTarget.style.borderColor = C.border
                      }}
                    >
                      <Plus size={14} strokeWidth={2} style={{ color: C.muted }} />
                    </button>
                  </div>
                </div>

                {/* Expanded Asset Details */}
                {isExpanded && (
                  <div style={{ padding: '16px 18px', background: C.surface, borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
                      {emp.assets.map((asset) => (
                        <div
                          key={asset.id}
                          style={{
                            background: '#fff',
                            border: `1px solid ${C.border}`,
                            borderRadius: 10,
                            padding: '14px',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(28,32,53,0.08)'
                            e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = 'none'
                            e.currentTarget.style.borderColor = C.border
                          }}
                        >
                          {/* Header with Category and Edit Button */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              {getCategoryIcon(asset.category)}
                              <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {asset.category}
                              </span>
                            </div>
                            <button
                              onClick={() => setEditDetails(asset)}
                              title="Edit asset"
                              style={{
                                width: 28, height: 28, borderRadius: 6,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '1px solid transparent',
                                background: 'transparent',
                                color: C.muted,
                                cursor: 'pointer', transition: 'all 0.15s',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)'
                                e.currentTarget.style.background = 'rgba(99,102,241,0.07)'
                                e.currentTarget.style.color = '#4B4ECC'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'transparent'
                                e.currentTarget.style.background = 'transparent'
                                e.currentTarget.style.color = C.muted
                              }}
                            >
                              <Edit size={14} />
                            </button>
                          </div>

                          {/* Asset Description */}
                          <div style={{ marginBottom: 10 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 2 }}>
                              {asset.assetDescription}
                            </div>
                          </div>

                          {/* System ID */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, paddingBottom: 8, borderBottom: `1px solid ${C.border}` }}>
                            <span style={{ fontSize: 10.5, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              System ID
                            </span>
                            <span style={{ fontSize: 12, fontWeight: 600, color: C.navy, fontFamily: 'monospace' }}>
                              {asset.systemId}
                            </span>
                          </div>

                          {/* Assigned Date */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 10.5, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Assigned Date
                            </span>
                            <span style={{ fontSize: 12, fontWeight: 500, color: C.navy }}>
                              {fmtDate(asset.assignedDate)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {/* Table Footer */}
          <div style={{ padding: '10px 18px', borderTop: `1px solid ${C.border}`, background: C.surface }}>
            <span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>
              Showing <strong style={{ color: C.navy }}>{filtered.length}</strong> of <strong style={{ color: C.navy }}>{EMPLOYEE_ASSETS.length}</strong> assets
            </span>
          </div>
        </div>
      )}
        </>
      )}

      {/* ── Add Entry Modal (for Pending Employees) ────────────────────── */}
      {addEntryModal && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(10,12,28,0.52)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={e => { if (e.target === e.currentTarget) { setAddEntryModal(null); setAddedAssets([]); setEditingAssetIdx(null) } }}
        >
          <div
            style={{
              background: '#fff', borderRadius: 18, width: 900, maxHeight: '90vh',
              boxShadow: '0 28px 72px rgba(10,12,28,0.20)',
              overflow: 'hidden', display: 'flex', flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${C.border}` }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: C.navy, margin: 0 }}>Add Asset Entry</h2>
                <p style={{ fontSize: 12, color: C.muted, margin: 0, marginTop: 4 }}>Add one or more assets for {addEntryModal.employeeName}</p>
              </div>
              <button
                onClick={() => { setAddEntryModal(null); setAddedAssets([]); setEditingAssetIdx(null) }}
                style={{
                  width: 32, height: 32,
                  background: C.hover, border: 'none', borderRadius: 8,
                  fontSize: 20, color: C.muted, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#E8EAF2' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = C.hover }}
              >
                ×
              </button>
            </div>

            {/* Employee Info Card */}
            <div style={{ padding: '16px 28px', background: C.surface, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <img
                src={`https://i.pravatar.cc/44?img=${addEntryModal.avatar}`}
                alt={addEntryModal.employeeName}
                style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: C.navy, margin: 0, marginBottom: 2 }}>{addEntryModal.employeeName}</p>
                <p style={{ fontSize: 12, color: C.muted, margin: 0, marginBottom: 2 }}>{addEntryModal.role}</p>
                <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>{addEntryModal.email}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', margin: 0, marginBottom: 2 }}>Assets Added</p>
                <p style={{ fontSize: 20, fontWeight: 800, color: '#6366F1', margin: 0 }}>{addedAssets.length}</p>
              </div>
            </div>

            {/* Content - Two Column Layout */}
            <div style={{ flex: 1, overflow: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
              {/* Left Column - Form */}
              <div style={{ padding: '24px 28px', borderRight: `1px solid ${C.border}`, overflowY: 'auto' }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: C.navy, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Asset Details</h3>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>System ID</label>
                  <input
                    type="text"
                    value={formData.systemId}
                    onChange={(e) => setFormData({ ...formData, systemId: e.target.value })}
                    placeholder="e.g., SYS-2024-0042"
                    style={{
                      width: '100%', padding: '10px 12px',
                      fontSize: 13, fontWeight: 500, color: C.navy,
                      border: `1px solid ${C.border}`, borderRadius: 8,
                      background: '#fff', fontFamily: "'DM Sans', system-ui, sans-serif",
                      outline: 'none', boxSizing: 'border-box',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#7C3AED' }}
                    onBlur={(e) => { e.target.style.borderColor = C.border }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Asset Description</label>
                  <input
                    type="text"
                    value={formData.assetDescription}
                    onChange={(e) => setFormData({ ...formData, assetDescription: e.target.value })}
                    placeholder='e.g., MacBook Pro 14" M2'
                    style={{
                      width: '100%', padding: '10px 12px',
                      fontSize: 13, fontWeight: 500, color: C.navy,
                      border: `1px solid ${C.border}`, borderRadius: 8,
                      background: '#fff', fontFamily: "'DM Sans', system-ui, sans-serif",
                      outline: 'none', boxSizing: 'border-box',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#7C3AED' }}
                    onBlur={(e) => { e.target.style.borderColor = C.border }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{
                      width: '100%', padding: '10px 12px',
                      fontSize: 13, fontWeight: 500, color: C.navy,
                      border: `1px solid ${C.border}`, borderRadius: 8,
                      background: '#fff', fontFamily: "'DM Sans', system-ui, sans-serif",
                      outline: 'none', boxSizing: 'border-box', cursor: 'pointer',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#7C3AED' }}
                    onBlur={(e) => { e.target.style.borderColor = C.border }}
                  >
                    <option>Laptop</option>
                    <option>Monitor</option>
                    <option>Phone</option>
                    <option>Tablet</option>
                    <option>Accessories</option>
                  </select>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Assigned Date</label>
                  <input
                    type="date"
                    value={formData.assignedDate}
                    onChange={(e) => setFormData({ ...formData, assignedDate: e.target.value })}
                    style={{
                      width: '100%', padding: '10px 12px',
                      fontSize: 13, fontWeight: 500, color: C.navy,
                      border: `1px solid ${C.border}`, borderRadius: 8,
                      background: '#fff', fontFamily: "'DM Sans', system-ui, sans-serif",
                      outline: 'none', boxSizing: 'border-box', cursor: 'pointer',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#7C3AED' }}
                    onBlur={(e) => { e.target.style.borderColor = C.border }}
                  />
                </div>

                <button
                  onClick={() => {
                    if (formData.systemId && formData.assetDescription && formData.assignedDate) {
                      if (editingAssetIdx !== null) {
                        const updated = [...addedAssets]
                        updated[editingAssetIdx] = { ...formData }
                        setAddedAssets(updated)
                        setEditingAssetIdx(null)
                      } else {
                        setAddedAssets([...addedAssets, { ...formData }])
                      }
                      setFormData({ systemId: '', assetDescription: '', category: 'Laptop', assignedDate: '' })
                    }
                  }}
                  style={{
                    width: '100%', padding: '10px', fontSize: 13, fontWeight: 700,
                    color: '#fff', background: '#6366F1', border: 'none', borderRadius: 8,
                    cursor: 'pointer', transition: 'background 0.15s', textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#4F46E5' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#6366F1' }}
                >
                  {editingAssetIdx !== null ? 'Update Asset' : '+ Add Asset'}
                </button>
              </div>

              {/* Right Column - Added Assets */}
              <div style={{ padding: '24px 28px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: C.navy, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assets List</h3>

                {addedAssets.length === 0 ? (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted }}>
                    <p style={{ textAlign: 'center', fontSize: 13 }}>No assets added yet.<br />Add one using the form →</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {addedAssets.map((asset, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10,
                          padding: 12, transition: 'all 0.15s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(28,32,53,0.08)'; e.currentTarget.style.borderColor = '#7C3AED' }}
                        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = C.border }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: C.navy, margin: '0 0 4px' }}>{asset.assetDescription}</p>
                            <p style={{ fontSize: 10, color: C.muted, margin: 0, textTransform: 'uppercase', fontWeight: 600 }}>{asset.category}</p>
                          </div>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button
                              onClick={() => { setFormData(asset); setEditingAssetIdx(idx) }}
                              title="Edit"
                              style={{
                                width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', transition: 'all 0.15s',
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.10)'; e.currentTarget.style.borderColor = '#7C3AED' }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}
                            >
                              <Edit size={13} style={{ color: '#6366F1' }} />
                            </button>
                            <button
                              onClick={() => { setAddedAssets(addedAssets.filter((_, i) => i !== idx)); if (editingAssetIdx === idx) setEditingAssetIdx(null) }}
                              title="Delete"
                              style={{
                                width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', transition: 'all 0.15s',
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(232,72,85,0.10)'; e.currentTarget.style.borderColor = '#E84855' }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}
                            >
                              <X size={13} style={{ color: '#E84855' }} />
                            </button>
                          </div>
                        </div>
                        <div style={{ fontSize: 10, color: C.muted, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
                          <p style={{ margin: '6px 0' }}><strong>ID:</strong> {asset.systemId}</p>
                          <p style={{ margin: '0' }}><strong>Date:</strong> {asset.assignedDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '14px 28px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setAddEntryModal(null); setAddedAssets([]); setEditingAssetIdx(null) }}
                style={{
                  padding: '9px 20px', fontSize: 12, fontWeight: 700,
                  color: C.navy, background: C.hover, border: 'none', borderRadius: 8,
                  cursor: 'pointer', transition: 'background 0.15s', textTransform: 'uppercase',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#E8EAF2' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = C.hover }}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (addedAssets.length > 0 && !isSavingAssets) {
                    setIsSavingAssets(true)
                    await new Promise(r => setTimeout(r, 1500))
                    setIsSavingAssets(false)
                    setAssetStatus('assigned')
                    setAddEntryModal(null)
                    setAddedAssets([])
                    setEditingAssetIdx(null)
                    setFormData({ systemId: '', assetDescription: '', category: 'Laptop', assignedDate: '' })
                  }
                }}
                disabled={addedAssets.length === 0 || isSavingAssets}
                style={{
                  padding: '9px 24px', fontSize: 12, fontWeight: 700,
                  color: '#fff', background: (addedAssets.length === 0 || isSavingAssets) ? '#C0C0C0' : '#6366F1',
                  border: 'none', borderRadius: 8, cursor: (addedAssets.length === 0 || isSavingAssets) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8,
                }}
                onMouseEnter={(e) => { if (addedAssets.length > 0 && !isSavingAssets) e.currentTarget.style.background = '#4F46E5' }}
                onMouseLeave={(e) => { if (addedAssets.length > 0 && !isSavingAssets) e.currentTarget.style.background = '#6366F1' }}
              >
                {isSavingAssets ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                      style={{ animation: 'spin 0.75s linear infinite' }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>Save & Assign All ({addedAssets.length})</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ── Edit Asset Modal ────────────────────────────────────────────── */}
      {editDetails && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(10,12,28,0.52)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={e => { if (e.target === e.currentTarget) setEditDetails(null) }}
        >
          <div
            style={{
              background: '#fff', borderRadius: 18, width: 540,
              boxShadow: '0 28px 72px rgba(10,12,28,0.20)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${C.border}` }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: C.navy, margin: 0 }}>Edit Asset</h2>
                <p style={{ fontSize: 12, color: C.muted, margin: 0, marginTop: 2 }}>Update asset information for {editDetails.employeeName}</p>
              </div>
              <button
                onClick={() => setEditDetails(null)}
                style={{
                  width: 28, height: 28,
                  background: C.hover, border: 'none', borderRadius: 6,
                  fontSize: 18, color: C.muted, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#E8EAF2' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = C.hover }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              {/* Employee Info - Compact */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${C.border}` }}>
                <img
                  src={`https://i.pravatar.cc/40?img=${editDetails.avatar}`}
                  alt={editDetails.employeeName}
                  style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: C.navy, margin: 0, marginBottom: 2 }}>{editDetails.employeeName}</p>
                  <p style={{ fontSize: 12, color: C.muted, margin: 0, marginBottom: 4 }}>{editDetails.role}</p>
                  <p style={{ fontSize: 12, color: C.muted, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{editDetails.email}</p>
                </div>
              </div>

              {/* Editable Fields */}
              {[
                { label: 'Asset Description', value: editDetails.assetDescription },
                { label: 'Category', value: editDetails.category },
                { label: 'Assigned Date', value: fmtDate(editDetails.assignedDate) },
              ].map((item, idx) => (
                <div key={idx} style={{ marginBottom: idx < 2 ? 18 : 0 }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>
                    {item.label}
                  </label>
                  <input
                    type="text"
                    value={item.value}
                    placeholder={item.label}
                    style={{
                      width: '100%', padding: '9px 12px',
                      fontSize: 13, fontWeight: 500, color: C.navy,
                      border: `1px solid ${C.border}`, borderRadius: 7,
                      background: '#fff',
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#7C3AED' }}
                    onBlur={(e) => { e.target.style.borderColor = C.border }}
                  />
                </div>
              ))}
            </div>

            <div style={{ padding: '14px 24px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 10 }}>
              <button
                onClick={() => setEditDetails(null)}
                style={{
                  flex: 1, padding: '8px 12px', fontSize: 12, fontWeight: 600,
                  color: C.navy, background: C.hover, border: 'none', borderRadius: 7,
                  cursor: 'pointer', transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#E8EAF2' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = C.hover }}
              >
                Cancel
              </button>
              <button
                style={{
                  flex: 1, padding: '8px 12px', fontSize: 12, fontWeight: 600,
                  color: '#fff', background: C.navy, border: 'none', borderRadius: 7,
                  cursor: 'pointer', transition: 'opacity 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9' }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
