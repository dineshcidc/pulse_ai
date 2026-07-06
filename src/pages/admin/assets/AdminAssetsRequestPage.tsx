import { useState } from 'react'
import { Monitor, Smartphone, Plus, Ticket, Eye, RotateCcw } from 'lucide-react'
import AdminAssetAllocatedDetailsPage from './AdminAssetAllocatedDetailsPage'
import AdminAssetReturnDetailsPage, { type ReturnRequest } from './AdminAssetReturnDetailsPage'

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', surface: '#F7F8FC' }

interface AssetRequest {
  id: string
  requestId: string
  employeeName: string
  employeeCode: string
  category?: string
  assetDescription?: string
  assetCode?: string
  status: 'pending'
  requestedDate: string
  raisedByName: string
  raisedByCode: string
  remarks: string
  acceptedDate?: string
}

const INITIAL_REQUESTS: AssetRequest[] = [
  {
    id: 'ar-001',
    requestId: 'AR-2026-0452',
    employeeName: 'Sarah Johnson',
    employeeCode: 'CC002',
    category: 'Laptop',
    assetDescription: 'MacBook Pro 16" - M3 Max',
    assetCode: 'LAP-002',
    status: 'pending',
    requestedDate: '2026-06-01',
    raisedByName: 'John Doe',
    raisedByCode: 'CC001',
    remarks: 'Employee needs a new laptop for development work. Current laptop is 3 years old.',
    acceptedDate: '2026-06-05',
  },
  {
    id: 'ar-002',
    requestId: 'AR-2026-0453',
    employeeName: 'Rajesh Kumar',
    employeeCode: 'CC003',
    category: 'Monitor',
    assetDescription: 'Wireless Mouse & Keyboard',
    assetCode: 'AC-2024-0156',
    status: 'pending',
    requestedDate: '2026-06-02',
    raisedByName: 'Emily Chen',
    raisedByCode: 'CC005',
    remarks: 'Required for ergonomic setup improvement at workstation.',
    acceptedDate: '2026-06-06',
  },
  {
    id: 'ar-003',
    requestId: 'AR-2026-0454',
    employeeName: 'Priya Sharma',
    employeeCode: 'CC004',
    category: 'Phone',
    assetDescription: 'iPhone 15 Pro',
    assetCode: 'PHN-001',
    status: 'pending',
    requestedDate: '2026-06-03',
    raisedByName: 'Michael Brown',
    raisedByCode: 'CC006',
    remarks: 'Mobile device needed for field operations and client meetings.',
    acceptedDate: '2026-06-07',
  },
]

const INITIAL_RETURN_REQUESTS: ReturnRequest[] = [
  {
    id: 'rr-001',
    requestId: 'RR-2026-0101',
    employeeName: 'Arjun Menon',
    employeeCode: 'CC007',
    employeeRole: 'Senior Developer',
    raisedByName: 'Arjun Menon',
    raisedByCode: 'CC007',
    raisedByRole: 'Senior Developer',
    raisedByType: 'Employee',
    category: 'Laptop',
    assetName: 'MacBook Pro 14" M2',
    assetCode: 'LAP-002',
    returnReason: 'Switching to a company-provided desktop setup. No longer need the laptop for daily work.',
    requestedDate: '2026-06-28',
    status: 'Pending',
  },
  {
    id: 'rr-002',
    requestId: 'RR-2026-0102',
    employeeName: 'Priya Sharma',
    employeeCode: 'CC004',
    employeeRole: 'Product Manager',
    raisedByName: 'Rohan Mehta',
    raisedByCode: 'CC001',
    raisedByRole: 'Engineering Manager',
    raisedByType: 'Manager',
    category: 'Monitor',
    assetName: 'Dell 27" 4K Monitor',
    assetCode: 'MON-004',
    returnReason: 'Employee relocated to another branch; asset to be reallocated to the local inventory.',
    requestedDate: '2026-06-30',
    status: 'Pending',
  },
  {
    id: 'rr-003',
    requestId: 'RR-2026-0098',
    employeeName: 'Neha Patel',
    employeeCode: 'CC006',
    employeeRole: 'QA Engineer',
    raisedByName: 'Neha Patel',
    raisedByCode: 'CC006',
    raisedByRole: 'QA Engineer',
    raisedByType: 'Employee',
    category: 'Phone',
    assetName: 'iPhone 15 Pro',
    assetCode: 'PHN-001',
    returnReason: 'Device screen is cracked and needs replacement. Returning the damaged unit.',
    requestedDate: '2026-06-20',
    status: 'Approved',
    decisionNote: 'Approved for Return. Kindly ensure the system and charger are packed safely and sent to the Office Admin',
    decisionDate: '2026-06-22',
    decisionBy: 'System Admin',
  },
  {
    id: 'rr-004',
    requestId: 'RR-2026-0095',
    employeeName: 'David Brown',
    employeeCode: 'CC009',
    employeeRole: 'Tech Lead',
    raisedByName: 'David Brown',
    raisedByCode: 'CC009',
    raisedByRole: 'Tech Lead',
    raisedByType: 'Employee',
    category: 'Laptop',
    assetName: 'MacBook Pro 16" M3',
    assetCode: 'LAP-006',
    returnReason: 'Requesting return as I received an upgraded model.',
    requestedDate: '2026-06-15',
    status: 'Rejected',
    decisionNote: 'Return rejected — the upgraded model has not been allocated yet. Please continue using the current device.',
    decisionDate: '2026-06-17',
    decisionBy: 'System Admin',
  },
]

const RETURN_STATUS_STYLES: Record<ReturnRequest['status'], { bg: string; color: string; dot: string }> = {
  Pending: { bg: 'rgba(245,158,11,0.10)', color: '#B45309', dot: '#F59E0B' },
  Approved: { bg: 'rgba(14,168,106,0.12)', color: '#0A7040', dot: '#0EA86A' },
  Rejected: { bg: 'rgba(232,72,85,0.10)', color: '#C0202E', dot: '#E84855' },
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const getCategoryIcon = (category?: string) => {
  if (category === 'Laptop') return <Monitor size={14} style={{ color: '#6366F1' }} />
  if (category === 'Monitor') return <Monitor size={14} style={{ color: '#3B82F6' }} />
  if (category === 'Phone') return <Smartphone size={14} style={{ color: '#10B981' }} />
  return null
}

export default function AdminAssetsRequestPage() {
  const [requests, setRequests] = useState<AssetRequest[]>(INITIAL_REQUESTS)
  const [selectedRequest, setSelectedRequest] = useState<AssetRequest | null>(null)
  const [viewDetails, setViewDetails] = useState<AssetRequest | null>(null)
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>(INITIAL_RETURN_REQUESTS)
  const [viewReturn, setViewReturn] = useState<ReturnRequest | null>(null)
  const [returnFilter, setReturnFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All')

  const handleReturnDecision = (id: string, decision: 'Approved' | 'Rejected', note: string) => {
    const today = new Date().toISOString().split('T')[0]
    const patch = { status: decision, decisionNote: note, decisionDate: today, decisionBy: 'System Admin' as const }
    setReturnRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
    setViewReturn((prev) => (prev && prev.id === id ? { ...prev, ...patch } : prev))
  }

  const filteredReturns = returnRequests.filter((r) => returnFilter === 'All' || r.status === returnFilter)
  const [selectedTicket, setSelectedTicket] = useState<AssetRequest | null>(null)
  const [activeTab, setActiveTab] = useState<'allocation' | 'return' | 'closed'>('allocation')
  const [addAssetModal, setAddAssetModal] = useState<AssetRequest | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedAssetCode, setSelectedAssetCode] = useState('')
  const [addedAssets, setAddedAssets] = useState<{ assetCode: string; assetDescription: string; category: string }[]>([])
  const [isSavingAssets, setIsSavingAssets] = useState(false)
  const [addAssetsFlow, setAddAssetsFlow] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<{ name: string; code: string } | null>(null)
  const [employeeSearch, setEmployeeSearch] = useState('')
  const [selectedCategoryFlow, setSelectedCategoryFlow] = useState('')
  const [selectedAssetCodeFlow, setSelectedAssetCodeFlow] = useState('')
  const [addedAssetsFlow, setAddedAssetsFlow] = useState<{ assetCode: string; assetDescription: string; category: string }[]>([])
  const [isSavingAssetsFlow, setIsSavingAssetsFlow] = useState(false)

  const EMPLOYEES = [
    { name: 'Sarah Johnson', code: 'CC002' },
    { name: 'Rajesh Kumar', code: 'CC003' },
    { name: 'Priya Sharma', code: 'CC004' },
    { name: 'John Doe', code: 'CC001' },
    { name: 'Emily Chen', code: 'CC005' },
    { name: 'Michael Brown', code: 'CC006' },
  ]

  const filteredEmployees = EMPLOYEES.filter(
    (emp) =>
      emp.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
      emp.code.toLowerCase().includes(employeeSearch.toLowerCase())
  )

  const AVAILABLE_ASSETS: Record<string, Array<{ code: string; description: string }>> = {
    'Laptop': [
      { code: 'LAP-002', description: 'MacBook Pro 16" - M3 Max' },
      { code: 'LAP-004', description: 'ASUS ZenBook 14" - Ryzen 7' },
    ],
    'Monitor': [
      { code: 'MON-002', description: 'LG 32" Curved Gaming Monitor' },
      { code: 'MON-004', description: 'HP E243i 24" IPS' },
    ],
    'Phone': [
      { code: 'PHN-001', description: 'iPhone 15 Pro' },
      { code: 'PHN-002', description: 'Samsung Galaxy S24 Ultra' },
    ],
  }

  if (viewDetails) {
    return (
      <AdminAssetAllocatedDetailsPage
        request={viewDetails}
        onBack={() => setViewDetails(null)}
      />
    )
  }

  if (viewReturn) {
    return (
      <AdminAssetReturnDetailsPage
        request={viewReturn}
        onBack={() => setViewReturn(null)}
        onDecision={handleReturnDecision}
      />
    )
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .req-row:hover { background: #FAFBFE !important; }
        .req-row { transition: background 0.12s; }
      `}</style>

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-bold mb-1" style={{ fontSize: 22, color: C.navy, letterSpacing: '-0.3px' }}>
            Assets Request
          </h1>
          <p style={{ fontSize: 13.5, color: '#787878', fontWeight: 500 }}>
            Manage and approve employee asset requests
          </p>
        </div>
        <button
          onClick={() => { setAddAssetsFlow(true); setSelectedEmployee(null); setEmployeeSearch(''); setSelectedCategoryFlow(''); setSelectedAssetCodeFlow(''); setAddedAssetsFlow([]) }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            fontSize: 13,
            fontWeight: 700,
            color: '#fff',
            background: C.navy,
            border: 'none',
            borderRadius: 10,
            cursor: 'pointer',
            transition: 'all 0.15s',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9' }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
        >
          <Plus size={16} strokeWidth={2.5} />
          Add Assets
        </button>
      </div>

      {/* ── Tabs Section ────────────────────────────────────────────────────── */}
      <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '12px 20px', display: 'flex', gap: 8, background: '#fff', borderBottom: `1px solid ${C.border}` }}>
          {[
            { id: 'allocation', label: 'Assets Allocation Request' },
            { id: 'return', label: 'Assets Allocated' },
            { id: 'closed', label: 'Asset Return Request' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '10px 12px',
                fontSize: 12,
                fontWeight: 600,
                color: activeTab === tab.id ? '#6366F1' : C.muted,
                background: activeTab === tab.id ? 'rgba(99,102,241,0.12)' : 'transparent',
                border: activeTab === tab.id ? `1px solid rgba(99,102,241,0.20)` : 'none',
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.color = C.navy
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.color = C.muted
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab Content: Asset Return Requests ──────────────────────── */}
        {activeTab === 'closed' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            {/* Filter Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', borderBottom: `1px solid ${C.border}`, background: C.surface }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: C.navy }}>
                Return Requests
                <span style={{ marginLeft: 8, padding: '2px 8px', borderRadius: 99, background: '#fff', border: `1px solid ${C.border}`, fontSize: 11, fontWeight: 700, color: C.muted }}>{returnRequests.length}</span>
              </span>
              <div style={{ display: 'flex', gap: 6 }}>
                {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((s) => {
                  const active = returnFilter === s
                  const cnt = s === 'All' ? returnRequests.length : returnRequests.filter((r) => r.status === s).length
                  const style = s === 'All' ? { bg: 'rgba(28,32,53,0.08)', color: C.navy, dot: '#B0B4C8' } : RETURN_STATUS_STYLES[s]
                  return (
                    <button
                      key={s}
                      onClick={() => setReturnFilter(s)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 99,
                        border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, fontWeight: active ? 700 : 600,
                        background: active ? style.bg : '#fff', color: active ? style.color : C.muted,
                        boxShadow: active ? 'none' : `inset 0 0 0 1px ${C.border}`, transition: 'all 0.13s',
                      }}
                    >
                      {s !== 'All' && <span style={{ width: 5, height: 5, borderRadius: '50%', background: active ? style.dot : '#C0C4D6', display: 'inline-block' }} />}
                      {s}
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '0 5px', borderRadius: 99, background: active ? 'rgba(255,255,255,0.55)' : '#F0F2F8', color: active ? style.color : '#9CA3AF' }}>{cnt}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {filteredReturns.length === 0 ? (
              <div style={{ padding: '60px 40px', textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: C.hover, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, marginLeft: 'auto', marginRight: 'auto' }}>
                  <RotateCcw size={24} style={{ color: C.muted }} />
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 4 }}>No return requests found</p>
                <p style={{ fontSize: 12.5, color: C.muted }}>There are no {returnFilter !== 'All' ? returnFilter.toLowerCase() : ''} asset return requests</p>
              </div>
            ) : (
              <>
                {/* Table Header */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,0.9fr) minmax(0,0.9fr) minmax(0,1.1fr) minmax(0,2.6fr) minmax(0,1fr) minmax(0,0.6fr)', gap: 14, padding: '14px 18px', background: C.surface, borderBottom: `1px solid ${C.border}` }}>
                  {['Employee', 'Request Date', 'Category', 'Asset Code', 'Return Reason', 'Status', 'Action'].map((col) => (
                    <span key={col} style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{col}</span>
                  ))}
                </div>

                {/* Table Rows */}
                {filteredReturns.map((req, idx) => {
                  const st = RETURN_STATUS_STYLES[req.status]
                  return (
                    <div
                      key={req.id}
                      className="req-row"
                      style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,0.9fr) minmax(0,0.9fr) minmax(0,1.1fr) minmax(0,2.6fr) minmax(0,1fr) minmax(0,0.6fr)', gap: 14, padding: '14px 18px', borderBottom: idx < filteredReturns.length - 1 ? `1px solid ${C.border}` : 'none', alignItems: 'center' }}
                    >
                      {/* Employee */}
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{req.employeeName}</div>
                        <div style={{ fontSize: 11, color: C.muted, fontWeight: 500, marginTop: 2 }}>{req.employeeCode}</div>
                      </div>

                      {/* Request Date */}
                      <span style={{ fontSize: 12.5, fontWeight: 500, color: C.navy }}>{fmtDate(req.requestedDate)}</span>

                      {/* Category */}
                      <span style={{ fontSize: 12.5, fontWeight: 500, color: C.navy, display: 'flex', alignItems: 'center', gap: 6 }}>
                        {getCategoryIcon(req.category)}
                        {req.category}
                      </span>

                      {/* Asset Code */}
                      <span style={{ fontSize: 12.5, fontWeight: 500, color: C.muted, fontFamily: 'monospace' }}>{req.assetCode}</span>

                      {/* Return Reason */}
                      <span style={{ fontSize: 12, color: '#5A6080', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={req.returnReason}>{req.returnReason.length > 50 ? req.returnReason.slice(0, 50).trimEnd() + '...' : req.returnReason}</span>

                      {/* Status */}
                      <span style={{ padding: '5px 10px', background: st.bg, color: st.color, fontSize: 11, fontWeight: 600, borderRadius: 20, width: 'fit-content', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 5, border: `1px solid ${st.dot}33` }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: st.dot, display: 'inline-block' }} />
                        {req.status}
                      </span>

                      {/* Action */}
                      <button
                        onClick={() => setViewReturn(req)}
                        title="View details"
                        style={{ width: 28, height: 28, borderRadius: 6, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.30)'; e.currentTarget.style.color = '#6366F1' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
                      >
                        <Eye size={14} strokeWidth={1.8} />
                      </button>
                    </div>
                  )
                })}
              </>
            )}
          </div>
        )}

        {/* ── Requests Table ──────────────────────────────────────────────────── */}
        {(activeTab === 'allocation' || activeTab === 'return') && (
        <div style={{ overflow: 'hidden', animation: 'fadeIn 0.3s ease' }}>
        {/* Table Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: activeTab === 'return' ? '1.2fr 1fr 1.3fr 1.4fr 0.95fr 0.9fr 0.95fr 0.75fr' : '1.2fr 1fr 1.3fr 1.4fr 0.95fr 1.1fr 0.75fr',
            gap: 14,
            padding: '14px 18px',
            background: C.surface,
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          {(activeTab === 'return'
            ? ['Request ID', 'Date', 'Raised By', 'Employee', 'Category', 'Pending With', 'Status', 'Action']
            : ['Request ID', 'Date', 'Raised By', 'Employee', 'Category', 'Status', 'Action']
          ).map((col) => (
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
        {requests.map((req, idx) => (
          <div
            key={req.id}
            className="req-row"
            style={{
              display: 'grid',
              gridTemplateColumns: activeTab === 'return' ? '1.2fr 1fr 1.3fr 1.4fr 0.95fr 0.9fr 0.95fr 0.75fr' : '1.2fr 1fr 1.3fr 1.4fr 0.95fr 1.1fr 0.75fr',
              gap: 14,
              padding: '14px 18px',
              borderBottom: idx < requests.length - 1 ? `1px solid ${C.border}` : 'none',
              alignItems: 'center',
            }}
          >
            {/* Request ID */}
            <span style={{ fontSize: 12.5, fontWeight: 700, color: C.navy, fontFamily: 'monospace' }}>
              {req.requestId}
            </span>

            {/* Date */}
            <span style={{ fontSize: 12.5, fontWeight: 500, color: C.navy }}>
              {fmtDate(req.requestedDate)}
            </span>

            {/* Raised By with Ticket Icon */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              {req.raisedByName !== 'System Admin' && (
                <button
                  onClick={() => setSelectedTicket(req)}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 4,
                    border: `1px solid rgba(99,102,241,0.20)`,
                    background: 'rgba(99,102,241,0.08)',
                    color: '#6366F1',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s',
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(99,102,241,0.15)'
                    e.currentTarget.style.borderColor = 'rgba(99,102,241,0.30)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(99,102,241,0.08)'
                    e.currentTarget.style.borderColor = 'rgba(99,102,241,0.20)'
                  }}
                >
                  <Ticket size={12} strokeWidth={2} />
                </button>
              )}
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>
                  {req.raisedByName}
                </div>
                <div style={{ fontSize: 11, color: C.muted, fontWeight: 500, marginTop: 2 }}>
                  {req.raisedByCode}
                </div>
              </div>
            </div>

            {/* Employee */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>
                {req.employeeName}
              </div>
              <div style={{ fontSize: 11, color: C.muted, fontWeight: 500, marginTop: 2 }}>
                {req.employeeCode}
              </div>
            </div>

            {/* Category */}
            <span style={{ fontSize: 12.5, fontWeight: 500, color: C.navy, display: 'flex', alignItems: 'center', gap: 6 }}>
              {getCategoryIcon(req.category)}
              {req.category ? req.category : '—'}
            </span>

            {/* Pending With (only for return tab) */}
            {activeTab === 'return' && (
              <span
                style={{
                  padding: '4px 10px',
                  background: 'rgba(99,102,241,0.10)',
                  color: '#6366F1',
                  fontSize: 11,
                  fontWeight: 600,
                  borderRadius: 6,
                  width: 'fit-content',
                  whiteSpace: 'nowrap',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                Employee
              </span>
            )}

            {/* Status */}
            <span
              style={{
                padding: '5px 10px',
                background: activeTab === 'return' ? 'rgba(14,168,106,0.12)' : 'rgba(245,158,11,0.10)',
                color: activeTab === 'return' ? '#0A7040' : '#B45309',
                fontSize: 11,
                fontWeight: 600,
                borderRadius: 20,
                width: 'fit-content',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                border: activeTab === 'return' ? '1px solid rgba(14,168,106,0.20)' : '1px solid rgba(245,158,11,0.20)',
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: activeTab === 'return' ? '#0EA86A' : '#F59E0B', display: 'inline-block' }} />
              {activeTab === 'return' ? 'Allocated' : 'Pending'}
            </span>

            {/* Action */}
            {activeTab === 'allocation' ? (
              <button
                onClick={() => { setAddAssetModal(req); setSelectedCategory(''); setSelectedAssetCode(''); setAddedAssets([]) }}
                style={{
                  padding: '4px 10px',
                  fontSize: 10.5,
                  fontWeight: 600,
                  color: '#6366F1',
                  background: 'rgba(99,102,241,0.10)',
                  border: '1px solid rgba(99,102,241,0.30)',
                  borderRadius: 5,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                  width: 'fit-content',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(99,102,241,0.15)'
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.40)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(99,102,241,0.10)'
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.30)'
                }}
              >
                Add Entry
              </button>
            ) : (
              <button
                onClick={() => setViewDetails(req)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  border: `1px solid ${C.border}`,
                  background: '#fff',
                  color: C.muted,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(99,102,241,0.08)'
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.30)'
                  e.currentTarget.style.color = '#6366F1'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fff'
                  e.currentTarget.style.borderColor = C.border
                  e.currentTarget.style.color = C.muted
                }}
              >
                <Eye size={14} strokeWidth={1.8} />
              </button>
            )}
          </div>
        ))}
        </div>
        )}
      </div>

      {/* ── Info Box for Assets Allocated Tab ──────────────────────────── */}
      {activeTab === 'return' && (
        <div
          style={{
            marginTop: 16,
            padding: '14px 16px',
            background: 'rgba(99,102,241,0.08)',
            border: `1px solid rgba(99,102,241,0.20)`,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            animation: 'fadeIn 0.3s ease',
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 50,
              background: 'rgba(99,102,241,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: 2,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: '#6366F1' }}>ℹ</span>
          </div>
          <p
            style={{
              fontSize: 12.5,
              color: '#6366F1',
              fontWeight: 500,
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Pending employee confirmation. Once employees accept these allocated requests, they will automatically transfer to your Assets Allocation inventory.
          </p>
        </div>
      )}

      {/* ── Add Asset Modal ─────────────────────────────────────────────── */}
      {addAssetModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(10,12,28,0.52)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setAddAssetModal(null)
              setAddedAssets([])
            }
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 18,
              width: 900,
              maxHeight: '90vh',
              boxShadow: '0 28px 72px rgba(10,12,28,0.20)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: '20px 28px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: C.navy, margin: 0 }}>
                  Add Asset Entry
                </h2>
                <p style={{ fontSize: 12, color: C.muted, margin: 0, marginTop: 4 }}>
                  Allocate assets for {addAssetModal.employeeName}
                </p>
              </div>
              <button
                onClick={() => { setAddAssetModal(null); setAddedAssets([]); setSelectedCategory(''); setSelectedAssetCode('') }}
                style={{
                  width: 32,
                  height: 32,
                  background: C.hover,
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 20,
                  color: C.muted,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
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
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'rgba(99,102,241,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: `1px solid rgba(99,102,241,0.25)`,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: '#6366F1' }}>
                  {addAssetModal.employeeName
                    .split(' ')
                    .map((word) => word[0])
                    .join('')
                    .toUpperCase()}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: C.navy, margin: 0, marginBottom: 2 }}>
                  {addAssetModal.employeeName}
                </p>
                <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>
                  {addAssetModal.employeeCode}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', margin: 0, marginBottom: 2 }}>
                  Assets Added
                </p>
                <p style={{ fontSize: 20, fontWeight: 800, color: '#6366F1', margin: 0 }}>
                  {addedAssets.length}
                </p>
              </div>
            </div>

            {/* Content - Two Column Layout */}
            <div style={{ flex: 1, overflow: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
              {/* Left Column - Form */}
              <div style={{ padding: '24px 28px', borderRight: `1px solid ${C.border}`, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: C.navy, margin: '0 0 24px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Select Asset
                </h3>

                {/* Asset Category */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>
                    Asset Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => { setSelectedCategory(e.target.value); setSelectedAssetCode('') }}
                    style={{
                      width: '100%',
                      padding: '11px 12px',
                      fontSize: 13,
                      fontWeight: 500,
                      color: selectedCategory ? C.navy : '#999',
                      border: `1px solid ${C.border}`,
                      borderRadius: 9,
                      background: '#fff',
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      outline: 'none',
                      boxSizing: 'border-box',
                      cursor: 'pointer',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#7C3AED'; e.target.style.background = '#f9f9f9' }}
                    onBlur={(e) => { e.target.style.borderColor = C.border; e.target.style.background = '#fff' }}
                  >
                    <option value="">Select asset category...</option>
                    <option>Laptop</option>
                    <option>Monitor</option>
                    <option>Phone</option>
                  </select>
                </div>

                {/* Asset Code */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>
                    Asset Code
                  </label>
                  <select
                    value={selectedAssetCode}
                    onChange={(e) => setSelectedAssetCode(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 12px',
                      fontSize: 13,
                      fontWeight: 500,
                      color: selectedAssetCode ? C.navy : '#999',
                      border: `1px solid ${C.border}`,
                      borderRadius: 9,
                      background: '#fff',
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      outline: 'none',
                      boxSizing: 'border-box',
                      cursor: 'pointer',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#7C3AED'; e.target.style.background = '#f9f9f9' }}
                    onBlur={(e) => { e.target.style.borderColor = C.border; e.target.style.background = '#fff' }}
                  >
                    <option value="">Select an asset code...</option>
                    {AVAILABLE_ASSETS[selectedCategory]?.map((asset) => (
                      <option key={asset.code} value={asset.code}>
                        {asset.code}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Add Asset Button */}
                <button
                  onClick={() => {
                    const selected = AVAILABLE_ASSETS[selectedCategory]?.find((a) => a.code === selectedAssetCode)
                    if (selected) {
                      setAddedAssets([
                        ...addedAssets,
                        { assetCode: selected.code, assetDescription: selected.description, category: selectedCategory },
                      ])
                      setSelectedAssetCode('')
                    }
                  }}
                  disabled={!selectedAssetCode || !AVAILABLE_ASSETS[selectedCategory]?.find((a) => a.code === selectedAssetCode)}
                  style={{
                    width: '100%',
                    padding: '11px 16px',
                    fontSize: 13,
                    fontWeight: 700,
                    color:
                      selectedAssetCode && AVAILABLE_ASSETS[selectedCategory]?.find((a) => a.code === selectedAssetCode)
                        ? '#fff'
                        : '#B0B4C8',
                    background:
                      selectedAssetCode && AVAILABLE_ASSETS[selectedCategory]?.find((a) => a.code === selectedAssetCode)
                        ? '#6366F1'
                        : '#E8EAF2',
                    border: 'none',
                    borderRadius: 9,
                    cursor:
                      selectedAssetCode && AVAILABLE_ASSETS[selectedCategory]?.find((a) => a.code === selectedAssetCode)
                        ? 'pointer'
                        : 'not-allowed',
                    transition: 'background 0.15s, color 0.15s',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedAssetCode && AVAILABLE_ASSETS[selectedCategory]?.find((a) => a.code === selectedAssetCode))
                      e.currentTarget.style.background = '#4F46E5'
                  }}
                  onMouseLeave={(e) => {
                    if (selectedAssetCode && AVAILABLE_ASSETS[selectedCategory]?.find((a) => a.code === selectedAssetCode))
                      e.currentTarget.style.background = '#6366F1'
                  }}
                >
                  + Add Asset
                </button>
              </div>

              {/* Right Column - Added Assets */}
              <div style={{ padding: '24px 28px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: C.navy, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Assets List
                </h3>

                {addedAssets.length === 0 ? (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted }}>
                    <p style={{ textAlign: 'center', fontSize: 13 }}>No assets added yet.
                      <br />Add one using the form →</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {addedAssets.map((asset, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: C.surface,
                          border: `1px solid ${C.border}`,
                          borderRadius: 10,
                          padding: 14,
                          transition: 'all 0.15s',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 12,
                          justifyContent: 'space-between',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(28,32,53,0.08)'
                          e.currentTarget.style.borderColor = '#7C3AED'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = 'none'
                          e.currentTarget.style.borderColor = C.border
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: C.navy, margin: '0 0 4px' }}>
                            {asset.assetCode}
                          </p>
                          <p style={{ fontSize: 12, color: C.muted, margin: '0 0 4px', fontWeight: 500 }}>
                            {asset.assetDescription}
                          </p>
                          <p style={{ fontSize: 10, color: '#999', margin: 0, textTransform: 'uppercase', fontWeight: 600 }}>
                            {asset.category}
                          </p>
                        </div>
                        <button
                          onClick={() => { setAddedAssets(addedAssets.filter((_, i) => i !== idx)) }}
                          title="Remove"
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 6,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `1px solid #D0D3E4`,
                            background: '#fff',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                            flexShrink: 0,
                            marginTop: 0,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#F0F2F8'
                            e.currentTarget.style.borderColor = '#B0B4C8'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#fff'
                            e.currentTarget.style.borderColor = '#D0D3E4'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '14px 28px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setAddAssetModal(null); setAddedAssets([]); setSelectedCategory(''); setSelectedAssetCode('') }}
                style={{
                  padding: '9px 20px',
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.navy,
                  background: C.hover,
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                  textTransform: 'uppercase',
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
                    await new Promise((r) => setTimeout(r, 1500))
                    setIsSavingAssets(false)
                    setAddAssetModal(null)
                    setAddedAssets([])
                    setSelectedCategory('')
                    setSelectedAssetCode('')
                  }
                }}
                disabled={addedAssets.length === 0 || isSavingAssets}
                style={{
                  padding: '9px 24px',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#fff',
                  background: addedAssets.length === 0 || isSavingAssets ? '#C0C0C0' : '#6366F1',
                  border: 'none',
                  borderRadius: 8,
                  cursor: addedAssets.length === 0 || isSavingAssets ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
                onMouseEnter={(e) => {
                  if (addedAssets.length > 0 && !isSavingAssets) e.currentTarget.style.background = '#4F46E5'
                }}
                onMouseLeave={(e) => {
                  if (addedAssets.length > 0 && !isSavingAssets) e.currentTarget.style.background = '#6366F1'
                }}
              >
                {isSavingAssets ? (
                  <>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      style={{ animation: 'spin 0.75s linear infinite' }}
                    >
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>Send Request ({addedAssets.length})</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Assets Flow Modal (Unified with Employee Search) ──────────── */}
      {addAssetsFlow && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(10,12,28,0.52)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setAddAssetsFlow(false)
              setAddedAssetsFlow([])
              setSelectedEmployee(null)
              setEmployeeSearch('')
            }
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 18,
              width: 900,
              maxHeight: '90vh',
              boxShadow: '0 28px 72px rgba(10,12,28,0.20)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: '20px 28px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: C.navy, margin: 0 }}>
                  Add Assets for Employee
                </h2>
                <p style={{ fontSize: 12, color: C.muted, margin: 0, marginTop: 4 }}>
                  Search and select an employee to allocate assets
                </p>
              </div>
              <button
                onClick={() => { setAddAssetsFlow(false); setAddedAssetsFlow([]); setSelectedEmployee(null); setEmployeeSearch('') }}
                style={{
                  width: 32,
                  height: 32,
                  background: C.hover,
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 20,
                  color: C.muted,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#E8EAF2' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = C.hover }}
              >
                ×
              </button>
            </div>

            {/* Content - Two Column Layout */}
            <div style={{ flex: 1, overflow: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, position: 'relative' }}>
              {/* Left Column - Form */}
              <div style={{ padding: '24px 28px', borderRight: `1px solid ${C.border}`, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                {/* Select Employee */}
                <div style={{ marginBottom: 24, position: 'relative' }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>
                    Select Employee
                  </label>
                  <input
                    type="text"
                    value={employeeSearch}
                    onChange={(e) => setEmployeeSearch(e.target.value)}
                    placeholder="Search employee name..."
                    style={{
                      width: '100%',
                      padding: '11px 12px',
                      fontSize: 13,
                      fontWeight: 500,
                      color: C.navy,
                      border: `1px solid ${C.border}`,
                      borderRadius: 9,
                      background: '#fff',
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#7C3AED'; e.target.style.background = '#f9f9f9' }}
                    onBlur={(e) => { e.target.style.borderColor = C.border; e.target.style.background = '#fff' }}
                  />

                  {/* Employee Dropdown Suggestions */}
                  {employeeSearch && filteredEmployees.length > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: 4,
                        background: '#fff',
                        border: `1px solid ${C.border}`,
                        borderRadius: 9,
                        boxShadow: '0 4px 12px rgba(28,32,53,0.12)',
                        zIndex: 1000,
                        overflow: 'hidden',
                      }}
                    >
                      {filteredEmployees.map((emp) => (
                        <button
                          key={emp.code}
                          onClick={() => { setSelectedEmployee(emp); setEmployeeSearch('') }}
                          style={{
                            width: '100%',
                            padding: '12px 12px',
                            background: selectedEmployee?.code === emp.code ? 'rgba(99,102,241,0.08)' : 'transparent',
                            border: 'none',
                            borderBottom: `1px solid ${C.border}`,
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                            textAlign: 'left',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)' }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = selectedEmployee?.code === emp.code ? 'rgba(99,102,241,0.08)' : 'transparent' }}
                        >
                          <p style={{ fontSize: 12, fontWeight: 700, color: C.navy, margin: 0 }}>
                            {emp.name}
                          </p>
                          <p style={{ fontSize: 11, color: C.muted, margin: 0, fontWeight: 500 }}>
                            {emp.code}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Selected Employee Badge */}
                  {selectedEmployee && (
                    <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(99,102,241,0.08)', borderRadius: 8, borderLeft: '3px solid #6366F1' }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', margin: '0 0 2px' }}>
                        Selected:
                      </p>
                      <p style={{ fontSize: 12, fontWeight: 700, color: C.navy, margin: 0 }}>
                        {selectedEmployee.name} ({selectedEmployee.code})
                      </p>
                    </div>
                  )}
                </div>

                {/* Asset Category */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>
                    Asset Category
                  </label>
                  <select
                    value={selectedCategoryFlow}
                    onChange={(e) => { setSelectedCategoryFlow(e.target.value); setSelectedAssetCodeFlow('') }}
                    disabled={!selectedEmployee}
                    style={{
                      width: '100%',
                      padding: '11px 12px',
                      fontSize: 13,
                      fontWeight: 500,
                      color: selectedCategoryFlow ? C.navy : '#999',
                      border: `1px solid ${C.border}`,
                      borderRadius: 9,
                      background: '#fff',
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      outline: 'none',
                      boxSizing: 'border-box',
                      cursor: selectedEmployee ? 'pointer' : 'not-allowed',
                      opacity: selectedEmployee ? 1 : 0.6,
                    }}
                    onFocus={(e) => { if (selectedEmployee) { e.target.style.borderColor = '#7C3AED'; e.target.style.background = '#f9f9f9' } }}
                    onBlur={(e) => { e.target.style.borderColor = C.border; e.target.style.background = '#fff' }}
                  >
                    <option value="">Select asset category...</option>
                    <option>Laptop</option>
                    <option>Monitor</option>
                    <option>Phone</option>
                  </select>
                </div>

                {/* Asset Code */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>
                    Asset Code
                  </label>
                  <select
                    value={selectedAssetCodeFlow}
                    onChange={(e) => setSelectedAssetCodeFlow(e.target.value)}
                    disabled={!selectedEmployee || !selectedCategoryFlow}
                    style={{
                      width: '100%',
                      padding: '11px 12px',
                      fontSize: 13,
                      fontWeight: 500,
                      color: selectedAssetCodeFlow ? C.navy : '#999',
                      border: `1px solid ${C.border}`,
                      borderRadius: 9,
                      background: '#fff',
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      outline: 'none',
                      boxSizing: 'border-box',
                      cursor: selectedEmployee && selectedCategoryFlow ? 'pointer' : 'not-allowed',
                      opacity: selectedEmployee && selectedCategoryFlow ? 1 : 0.6,
                    }}
                    onFocus={(e) => { if (selectedEmployee && selectedCategoryFlow) { e.target.style.borderColor = '#7C3AED'; e.target.style.background = '#f9f9f9' } }}
                    onBlur={(e) => { e.target.style.borderColor = C.border; e.target.style.background = '#fff' }}
                  >
                    <option value="">Select an asset code...</option>
                    {AVAILABLE_ASSETS[selectedCategoryFlow]?.map((asset) => (
                      <option key={asset.code} value={asset.code}>
                        {asset.code}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Add Asset Button */}
                <button
                  onClick={() => {
                    const selected = AVAILABLE_ASSETS[selectedCategoryFlow]?.find((a) => a.code === selectedAssetCodeFlow)
                    if (selected) {
                      setAddedAssetsFlow([
                        ...addedAssetsFlow,
                        { assetCode: selected.code, assetDescription: selected.description, category: selectedCategoryFlow },
                      ])
                      setSelectedAssetCodeFlow('')
                    }
                  }}
                  disabled={!selectedAssetCodeFlow || !AVAILABLE_ASSETS[selectedCategoryFlow]?.find((a) => a.code === selectedAssetCodeFlow) || !selectedEmployee}
                  style={{
                    width: '100%',
                    padding: '11px 16px',
                    fontSize: 13,
                    fontWeight: 700,
                    color:
                      selectedAssetCodeFlow && AVAILABLE_ASSETS[selectedCategoryFlow]?.find((a) => a.code === selectedAssetCodeFlow) && selectedEmployee
                        ? '#fff'
                        : '#B0B4C8',
                    background:
                      selectedAssetCodeFlow && AVAILABLE_ASSETS[selectedCategoryFlow]?.find((a) => a.code === selectedAssetCodeFlow) && selectedEmployee
                        ? '#6366F1'
                        : '#E8EAF2',
                    border: 'none',
                    borderRadius: 9,
                    cursor:
                      selectedAssetCodeFlow && AVAILABLE_ASSETS[selectedCategoryFlow]?.find((a) => a.code === selectedAssetCodeFlow) && selectedEmployee
                        ? 'pointer'
                        : 'not-allowed',
                    transition: 'background 0.15s, color 0.15s',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedAssetCodeFlow && AVAILABLE_ASSETS[selectedCategoryFlow]?.find((a) => a.code === selectedAssetCodeFlow) && selectedEmployee)
                      e.currentTarget.style.background = '#4F46E5'
                  }}
                  onMouseLeave={(e) => {
                    if (selectedAssetCodeFlow && AVAILABLE_ASSETS[selectedCategoryFlow]?.find((a) => a.code === selectedAssetCodeFlow) && selectedEmployee)
                      e.currentTarget.style.background = '#6366F1'
                  }}
                >
                  + Add Asset
                </button>
              </div>

              {/* Right Column - Added Assets List */}
              <div style={{ padding: '24px 28px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: C.navy, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Assets List
                </h3>

                {addedAssetsFlow.length === 0 ? (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted }}>
                    <p style={{ textAlign: 'center', fontSize: 13 }}>No assets added yet.
                      <br />Add one using the form ←</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {addedAssetsFlow.map((asset, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: C.surface,
                          border: `1px solid ${C.border}`,
                          borderRadius: 10,
                          padding: 14,
                          transition: 'all 0.15s',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 12,
                          justifyContent: 'space-between',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(28,32,53,0.08)'
                          e.currentTarget.style.borderColor = '#7C3AED'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = 'none'
                          e.currentTarget.style.borderColor = C.border
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: C.navy, margin: '0 0 4px' }}>
                            {asset.assetCode}
                          </p>
                          <p style={{ fontSize: 12, color: C.muted, margin: '0 0 4px', fontWeight: 500 }}>
                            {asset.assetDescription}
                          </p>
                          <p style={{ fontSize: 10, color: '#999', margin: 0, textTransform: 'uppercase', fontWeight: 600 }}>
                            {asset.category}
                          </p>
                        </div>
                        <button
                          onClick={() => { setAddedAssetsFlow(addedAssetsFlow.filter((_, i) => i !== idx)) }}
                          title="Remove"
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 6,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `1px solid #D0D3E4`,
                            background: '#fff',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                            flexShrink: 0,
                            marginTop: 0,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#F0F2F8'
                            e.currentTarget.style.borderColor = '#B0B4C8'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#fff'
                            e.currentTarget.style.borderColor = '#D0D3E4'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '14px 28px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setAddAssetsFlow(false); setAddedAssetsFlow([]); setSelectedEmployee(null); setEmployeeSearch('') }}
                style={{
                  padding: '9px 20px',
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.navy,
                  background: C.hover,
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                  textTransform: 'uppercase',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#E8EAF2' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = C.hover }}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (addedAssetsFlow.length > 0 && selectedEmployee && !isSavingAssetsFlow) {
                    setIsSavingAssetsFlow(true)
                    await new Promise((r) => setTimeout(r, 1500))
                    setIsSavingAssetsFlow(false)

                    // Generate Request ID
                    const newRequestId = `AR-2026-${String(requests.length + 452).padStart(4, '0')}`
                    const today = new Date().toISOString().split('T')[0]

                    // Create new request object for each asset
                    addedAssetsFlow.forEach((asset, idx) => {
                      const newRequest: AssetRequest = {
                        id: `ar-${requests.length + 1 + idx}`,
                        requestId: newRequestId,
                        employeeName: selectedEmployee.name,
                        employeeCode: selectedEmployee.code,
                        category: asset.category,
                        assetDescription: asset.assetDescription,
                        assetCode: asset.assetCode,
                        status: 'pending',
                        requestedDate: today,
                        raisedByName: 'System Admin',
                        raisedByCode: 'SA001',
                        remarks: `Asset allocation request for ${asset.category}`,
                        acceptedDate: today,
                      }
                      setRequests((prevRequests) => [...prevRequests, newRequest])
                    })

                    // Switch to Assets Allocated tab
                    setActiveTab('return')

                    // Close modal and reset state
                    setAddAssetsFlow(false)
                    setAddedAssetsFlow([])
                    setSelectedEmployee(null)
                    setEmployeeSearch('')
                    setSelectedCategoryFlow('')
                    setSelectedAssetCodeFlow('')
                  }
                }}
                disabled={addedAssetsFlow.length === 0 || !selectedEmployee || isSavingAssetsFlow}
                style={{
                  padding: '9px 24px',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#fff',
                  background: addedAssetsFlow.length === 0 || !selectedEmployee || isSavingAssetsFlow ? '#C0C0C0' : '#6366F1',
                  border: 'none',
                  borderRadius: 8,
                  cursor: addedAssetsFlow.length === 0 || !selectedEmployee || isSavingAssetsFlow ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
                onMouseEnter={(e) => {
                  if (addedAssetsFlow.length > 0 && selectedEmployee && !isSavingAssetsFlow) e.currentTarget.style.background = '#4F46E5'
                }}
                onMouseLeave={(e) => {
                  if (addedAssetsFlow.length > 0 && selectedEmployee && !isSavingAssetsFlow) e.currentTarget.style.background = '#6366F1'
                }}
              >
                {isSavingAssetsFlow ? (
                  <>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      style={{ animation: 'spin 0.75s linear infinite' }}
                    >
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>Send Request ({addedAssetsFlow.length})</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Request Details Modal ──────────────────────────────────────── */}
      {selectedRequest && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setSelectedRequest(null)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              maxWidth: 520,
              width: '90%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: '24px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: C.navy, margin: '0 0 4px 0' }}>
                  Asset Request Details
                </h2>
                <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>
                  Review request {selectedRequest.requestId}
                </p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                style={{
                  width: 32,
                  height: 32,
                  background: C.hover,
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 20,
                  color: C.muted,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#E4E6EF' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = C.hover }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: 24 }}>
              {[
                { label: 'Request ID', value: selectedRequest.requestId },
                { label: 'Employee', value: `${selectedRequest.employeeName} (${selectedRequest.employeeCode})` },
                { label: 'Category', value: selectedRequest.category || '—' },
                { label: 'Asset Code', value: selectedRequest.assetCode || '—' },
                { label: 'Description', value: selectedRequest.assetDescription || '—' },
                { label: 'Request Date', value: fmtDate(selectedRequest.requestedDate) },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: idx === 0 ? '0 0 16px 0' : '16px 0',
                    borderBottom: idx < 5 ? `1px solid ${C.border}` : 'none',
                  }}
                >
                  <p style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, margin: 0 }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ padding: '4px 24px 24px', display: 'flex', gap: 12 }}>
              <button
                onClick={() => setSelectedRequest(null)}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.navy,
                  background: C.hover,
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#E4E6EF' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = C.hover }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Ticket Details Modal ───────────────────────────────────────── */}
      {selectedTicket && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001,
          }}
          onClick={() => setSelectedTicket(null)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              maxWidth: 600,
              width: '90%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: '24px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: C.navy, margin: '0 0 4px 0' }}>
                  Ticket Details
                </h2>
                <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>
                  {selectedTicket.requestId}
                </p>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                style={{
                  width: 32,
                  height: 32,
                  background: C.hover,
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 20,
                  color: C.muted,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#E4E6EF' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = C.hover }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: 24 }}>
              {/* Raised By & Raised For - Same Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24, paddingBottom: 20, borderBottom: `1px solid ${C.border}` }}>
                {/* Ticket Raised By */}
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                    Ticket Raised By
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(99,102,241,0.08)', padding: 12, borderRadius: 8, border: `1px solid rgba(99,102,241,0.20)` }}>
                    <Ticket size={16} style={{ color: '#6366F1', flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: C.navy, margin: '0 0 4px 0' }}>
                        {selectedTicket.raisedByName}
                      </p>
                      <p style={{ fontSize: 11, color: C.muted, fontWeight: 500, margin: 0 }}>
                        {selectedTicket.raisedByCode}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Raised For Employee */}
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                    Raised For Employee
                  </p>
                  <div style={{ background: 'rgba(14,168,106,0.08)', padding: 12, borderRadius: 8, border: `1px solid rgba(14,168,106,0.20)` }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: C.navy, margin: '0 0 4px 0' }}>
                      {selectedTicket.employeeName}
                    </p>
                    <p style={{ fontSize: 11, color: C.muted, fontWeight: 500, margin: 0 }}>
                      {selectedTicket.employeeCode}
                    </p>
                  </div>
                </div>
              </div>

              {/* Asset Category Section */}
              <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: `1px solid ${C.border}` }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                  Asset Category
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {getCategoryIcon(selectedTicket.category)}
                  <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, margin: 0 }}>
                    {selectedTicket.category || '—'}
                  </p>
                </div>
              </div>

              {/* Remarks Section */}
              <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: `1px solid ${C.border}` }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                  Remarks
                </p>
                <p style={{ fontSize: 13, color: C.navy, fontWeight: 500, margin: 0, lineHeight: 1.5, background: C.hover, padding: 12, borderRadius: 8 }}>
                  {selectedTicket.remarks}
                </p>
              </div>

              {/* Raised Date Section */}
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                  Raised Date
                </p>
                <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, margin: 0 }}>
                  {fmtDate(selectedTicket.requestedDate)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
