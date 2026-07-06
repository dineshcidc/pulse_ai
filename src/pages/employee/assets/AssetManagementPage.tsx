import { useState } from 'react'
import { Package, Laptop, Monitor, Smartphone, Eye, RotateCcw } from 'lucide-react'
import EmployeeReturnRequestDetailsPage, { type EmployeeReturnRequest } from './EmployeeReturnRequestDetailsPage'

const C = {
  navy: '#1C2035',
  muted: '#8B90A7',
  border: '#E4E6EF',
  bg: '#F0F2F8',
  surface: '#F7F8FC',
}

interface Asset {
  id: string
  code: string
  category: string
  description: string
  dateFrom: string
  count?: number
  images?: {
    front: string
    back: string
    side: string
  }
}

interface AssetRequest {
  id: string
  requestId: string
  assetName: string
  assetCode: string
  category: string
  status: 'Allocated' | 'Pending'
  employeeName: string
  employeeCode: string
  requestedDate: string
}

const STATUS_STYLE: Record<string, { bg: string; color: string; dot: string }> = {
  'Pending': { bg: 'rgba(245,158,11,0.10)', color: '#B45309', dot: '#F59E0B' },
  'Allocated': { bg: 'rgba(14,168,106,0.12)', color: '#0A7040', dot: '#0EA86A' },
}


const COL_GRID = '1.1fr 0.85fr 0.95fr 1fr 1.8fr 1.3fr 1.1fr 0.95fr 0.8fr'

const INITIAL_ASSET_REQUESTS: AssetRequest[] = [
  {
    id: 'ar-001',
    requestId: 'AR-2026-0451',
    assetName: 'Dell 27" 4K Monitor',
    assetCode: 'MN-2024-0089',
    category: 'IT Hardware',
    status: 'Allocated',
    employeeName: 'John Doe',
    employeeCode: 'CC001',
    requestedDate: '2026-05-10',
  },
  {
    id: 'ar-003',
    requestId: 'AR-2026-0453',
    assetName: 'Wireless Mouse & Keyboard',
    assetCode: 'AC-2024-0156',
    category: 'Monitor',
    status: 'Allocated',
    employeeName: 'John Doe',
    employeeCode: 'CC001',
    requestedDate: '2026-06-01',
  },
]

const RETURN_STATUS_STYLE: Record<string, { bg: string; color: string; dot: string }> = {
  'Pending': { bg: 'rgba(245,158,11,0.10)', color: '#B45309', dot: '#F59E0B' },
  'Accepted': { bg: 'rgba(14,168,106,0.12)', color: '#0A7040', dot: '#0EA86A' },
}

const RETURN_COL_GRID = '1.1fr 0.9fr 1fr 1fr 1.4fr 1.9fr 0.9fr 0.6fr'

const INITIAL_RETURN_REQUESTS: EmployeeReturnRequest[] = [
  {
    id: 'rr-001',
    requestId: 'RR-2026-0101',
    employeeName: 'John Doe',
    employeeCode: 'CC001',
    category: 'Laptop',
    assetName: 'MacBook Pro 14" M2',
    assetCode: 'LT-2024-0042',
    returnReason: 'Switching to a company-provided desktop setup. No longer need the laptop for daily work.',
    requestedDate: '2026-06-28',
    status: 'Accepted',
    decisionNote: 'Approved for Return. Kindly ensure the system and charger are packed safely and sent to the Office Admin',
    decisionDate: '2026-06-30',
    decisionBy: 'System Admin',
  },
  {
    id: 'rr-002',
    requestId: 'RR-2026-0104',
    employeeName: 'John Doe',
    employeeCode: 'CC001',
    category: 'Monitor',
    assetName: 'Dell 27" 4K Ultra HD',
    assetCode: 'MN-2024-0089',
    returnReason: 'Monitor has a flickering display issue and needs to be returned for replacement.',
    requestedDate: '2026-07-02',
    status: 'Pending',
  },
]

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const ASSETS: Asset[] = [
  {
    id: 'ast-001',
    code: 'LT-2024-0042',
    category: 'Laptop',
    description: 'MacBook Pro 14" M2',
    dateFrom: '15/01/2024',
    count: 1,
    images: {
      front: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=400&fit=crop',
      back: 'https://images.unsplash.com/photo-1588872657840-ded492b8e3f7?w=500&h=400&fit=crop',
      side: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=400&fit=crop',
    },
  },
  {
    id: 'ast-002',
    code: 'MN-2024-0089',
    category: 'Monitor',
    description: 'Dell 27" 4K Ultra HD',
    dateFrom: '15/01/2024',
    count: 1,
    images: {
      front: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=400&fit=crop',
      back: 'https://images.unsplash.com/photo-1611532736581-5a474a6a7dd9?w=500&h=400&fit=crop',
      side: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=400&fit=crop',
    },
  },
]

export default function AssetManagementPage() {
  const [activeTab, setActiveTab] = useState<'current' | 'request' | 'return'>('current')
  const [returnRequests] = useState<EmployeeReturnRequest[]>(INITIAL_RETURN_REQUESTS)
  const [viewReturnRequest, setViewReturnRequest] = useState<EmployeeReturnRequest | null>(null)
  const [viewPopup, setViewPopup] = useState<Asset | null>(null)
  const [returnPopup, setReturnPopup] = useState<Asset | null>(null)
  const [returnReason, setReturnReason] = useState('')
  const [assetRequests, setAssetRequests] = useState<AssetRequest[]>(INITIAL_ASSET_REQUESTS)
  const [currentAssets, setCurrentAssets] = useState<Asset[]>(ASSETS)
  const [rejectPopup, setRejectPopup] = useState<AssetRequest | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  function handleAcceptRequest(requestId: string) {
    const request = assetRequests.find(ar => ar.id === requestId)
    if (!request) return

    const newAsset: Asset = {
      id: `ast-${Date.now()}`,
      code: request.assetCode,
      category: request.category === 'Monitor' ? 'Monitor' : 'Laptop',
      description: request.assetName,
      dateFrom: fmtDate(new Date().toISOString().split('T')[0]),
    }

    setCurrentAssets([...currentAssets, newAsset])
    setAssetRequests(assetRequests.filter(ar => ar.id !== requestId))
    setActiveTab('current')
  }

  function handleRejectConfirm() {
    if (rejectPopup) {
      setAssetRequests(assetRequests.filter(ar => ar.id !== rejectPopup.id))
      setRejectPopup(null)
      setRejectReason('')
    }
  }

  if (viewReturnRequest) {
    return (
      <EmployeeReturnRequestDetailsPage
        request={viewReturnRequest}
        onBack={() => setViewReturnRequest(null)}
      />
    )
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes iconFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        .ast-row:hover { background: #FAFBFE !important; }
      `}</style>

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-bold mb-1" style={{ fontSize: 22, color: C.navy, letterSpacing: '-0.3px' }}>
            Asset Management
          </h1>
          <p style={{ fontSize: 13.5, color: '#787878', fontWeight: 500 }}>
            Request and track your company assets
          </p>
        </div>
        <div
          className="flex items-center justify-center rounded-2xl flex-shrink-0"
          style={{
            width: 84,
            height: 84,
            backgroundColor: 'rgba(99,102,241,0.07)',
            backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.22) 1px, transparent 1px)',
            backgroundSize: '8px 8px',
            border: '1px solid rgba(99,102,241,0.14)',
          }}
        >
          <div style={{ animation: 'iconFloat 4s ease-in-out infinite' }}>
            <Package size={34} strokeWidth={1.5} style={{ color: '#5B5FDE' }} />
          </div>
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 28, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: 6, width: 'fit-content' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setActiveTab('current')}
            style={{
              padding: '6px 12px',
              fontSize: 13,
              fontWeight: 600,
              color: activeTab === 'current' ? '#fff' : C.muted,
              background: activeTab === 'current' ? '#1c2035' : 'transparent',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'current') {
                e.currentTarget.style.color = C.navy
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'current') {
                e.currentTarget.style.color = C.muted
              }
            }}
          >
            My Current Assets
          </button>
          <button
            onClick={() => setActiveTab('request')}
            style={{
              padding: '6px 12px',
              fontSize: 13,
              fontWeight: 600,
              color: activeTab === 'request' ? '#fff' : C.muted,
              background: activeTab === 'request' ? '#1c2035' : 'transparent',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'request') {
                e.currentTarget.style.color = C.navy
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'request') {
                e.currentTarget.style.color = C.muted
              }
            }}
          >
            Asset Requests
          </button>
          <button
            onClick={() => setActiveTab('return')}
            style={{
              padding: '6px 12px',
              fontSize: 13,
              fontWeight: 600,
              color: activeTab === 'return' ? '#fff' : C.muted,
              background: activeTab === 'return' ? '#1c2035' : 'transparent',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'return') {
                e.currentTarget.style.color = C.navy
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'return') {
                e.currentTarget.style.color = C.muted
              }
            }}
          >
            Return Request
          </button>
        </div>
      </div>

      {/* ── TAB: My Current Assets ──────────────────────────────────────── */}
      {activeTab === 'current' && (
        <div>
          {currentAssets.length === 0 ? (
            <div
              className="rounded-xl flex flex-col items-center justify-center"
              style={{
                background: '#fff',
                border: `1px solid ${C.border}`,
                padding: '60px 40px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: C.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}
              >
                <Package size={24} style={{ color: C.muted }} />
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 4 }}>
                No assets assigned yet
              </p>
              <p style={{ fontSize: 12.5, color: C.muted }}>
                Click "Request Asset" to request one
              </p>
            </div>
          ) : (
            <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
              {/* Table Header */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1.2fr 1.8fr 1.2fr 0.6fr',
                  gap: 20,
                  padding: '14px 20px',
                  background: '#f7f8fc',
                  borderBottom: `1px solid ${C.border}`,
                }}
              >
                {['Asset Code', 'Category', 'Asset Description', 'Date From', 'Action'].map((col) => (
                  <span
                    key={col}
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: C.muted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {col}
                  </span>
                ))}
              </div>

              {/* Table Rows */}
              {currentAssets.map((asset, idx) => (
                <div
                  key={asset.id}
                  className="ast-row"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1.2fr 1.8fr 1.2fr 0.6fr',
                    gap: 20,
                    padding: '16px 20px',
                    borderBottom: idx < currentAssets.length - 1 ? `1px solid ${C.border}` : 'none',
                    alignItems: 'center',
                    transition: 'background 0.15s',
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.navy, fontFamily: 'monospace' }}>
                    {asset.code}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: C.navy,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    {asset.category === 'Laptop' && (
                      <Laptop size={14} style={{ color: '#6366F1' }} />
                    )}
                    {asset.category === 'Monitor' && (
                      <Monitor size={14} style={{ color: '#3B82F6' }} />
                    )}
                    {asset.category === 'Phone' && (
                      <Smartphone size={14} style={{ color: '#10B981' }} />
                    )}
                    {asset.category}
                  </span>
                  <span style={{ fontSize: 13, color: C.navy, fontWeight: 500 }}>
                    {asset.description}
                  </span>
                  <span style={{ fontSize: 13, color: C.muted, fontWeight: 500 }}>
                    {asset.dateFrom}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      onClick={() => setViewPopup(asset)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 32,
                        height: 32,
                        color: C.muted,
                        background: '#fff',
                        border: `1px solid ${C.border}`,
                        borderRadius: 8,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#6366F1'
                        e.currentTarget.style.background = 'rgba(99,102,241,0.08)'
                        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.30)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = C.muted
                        e.currentTarget.style.background = '#fff'
                        e.currentTarget.style.borderColor = C.border
                      }}
                    >
                      <Eye size={14} strokeWidth={1.8} />
                    </button>
                    <button
                      onClick={() => setReturnPopup(asset)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 32,
                        height: 32,
                        color: C.muted,
                        background: '#fff',
                        border: `1px solid ${C.border}`,
                        borderRadius: 8,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#F59E0B'
                        e.currentTarget.style.background = 'rgba(245,158,11,0.08)'
                        e.currentTarget.style.borderColor = 'rgba(245,158,11,0.30)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = C.muted
                        e.currentTarget.style.background = '#fff'
                        e.currentTarget.style.borderColor = C.border
                      }}
                    >
                      <RotateCcw size={14} strokeWidth={1.8} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: Asset Requests ──────────────────────────────────────────── */}
      {activeTab === 'request' && (
        <>
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
          <div className="grid" style={{ gridTemplateColumns: COL_GRID, padding: '14px 20px', background: '#f7f8fc', borderBottom: `1px solid ${C.border}` }}>
            {['Request ID', 'Date', 'Category', 'Asset Code', 'Description', 'Employee', 'Pending With', 'Status', 'Action'].map(h => (
              <span key={h} style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
            ))}
          </div>

          {assetRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center" style={{ padding: '60px 20px' }}>
              <div className="flex items-center justify-center rounded-2xl mb-4" style={{ width: 54, height: 54, background: '#F0F2F8' }}>
                <Package size={22} strokeWidth={1.5} style={{ color: '#B0B4C8' }} />
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 5 }}>No asset requests found</p>
              <p style={{ fontSize: 13, color: C.muted }}>You haven't requested any assets yet</p>
            </div>
          ) : (
            assetRequests.map((ar, idx) => {
              const ss     = STATUS_STYLE[ar.status]
              const isLast = idx === assetRequests.length - 1
              const pendingWithBg = 'rgba(245,158,11,0.10)'
              const pendingWithColor = '#B45309'
              const pendingWithLabel = ar.status === 'Pending' ? 'System Admin' : 'Employee'

              let catIcon = null
              if (ar.category === 'IT Hardware') {
                catIcon = <Laptop size={14} style={{ color: '#6366F1' }} />
              } else if (ar.category === 'Monitor') {
                catIcon = <Monitor size={14} style={{ color: '#3B82F6' }} />
              }

              return (
                <div key={ar.id} className="ast-row grid items-center"
                  style={{ gridTemplateColumns: COL_GRID, padding: '16px 20px', borderBottom: isLast ? 'none' : `1px solid ${C.border}`, background: '#fff', transition: 'background 0.12s' }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: C.navy, fontVariantNumeric: 'tabular-nums' }}>{ar.requestId}</span>
                  <span style={{ fontSize: 12, color: '#5A6080', fontWeight: 500 }}>{fmtDate(ar.requestedDate)}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, color: C.navy }}>
                    {catIcon}
                    {ar.category}
                  </span>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: C.navy, fontFamily: 'monospace' }}>{ar.assetCode}</span>
                  <span style={{ fontSize: 12, color: '#5A6080', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ar.assetName}</span>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: C.navy }}>
                    {ar.employeeName}
                    <div style={{ fontSize: 11, color: C.muted, fontWeight: 500 }}>{ar.employeeCode}</div>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 9px', borderRadius: 8, background: pendingWithBg, color: pendingWithColor, fontSize: 11.5, fontWeight: 600, width: 'fit-content', whiteSpace: 'nowrap' }}>{pendingWithLabel}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full"
                    style={{ padding: '4px 10px', background: ss.bg, color: ss.color, fontSize: 11.5, fontWeight: 600, width: 'fit-content', whiteSpace: 'nowrap', border: `1px solid ${ss.dot}40` }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: ss.dot, display: 'inline-block', flexShrink: 0 }} />
                    {ar.status}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button
                      onClick={() => ar.status === 'Pending' ? null : handleAcceptRequest(ar.id)}
                      disabled={ar.status === 'Pending'}
                      title={ar.status === 'Pending' ? 'Awaiting System Admin approval' : 'Accept request'}
                      style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: ar.status === 'Pending' ? 'rgba(14,168,106,0.06)' : 'rgba(14,168,106,0.10)', color: ar.status === 'Pending' ? '#B0B4C8' : '#0A7040', cursor: ar.status === 'Pending' ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.14s', fontSize: 11, fontWeight: 600, opacity: ar.status === 'Pending' ? 0.5 : 1 }}
                      onMouseEnter={e => { if (ar.status !== 'Pending') e.currentTarget.style.background = 'rgba(14,168,106,0.18)' }}
                      onMouseLeave={e => { if (ar.status !== 'Pending') e.currentTarget.style.background = 'rgba(14,168,106,0.10)' }}
                    >
                      ✓
                    </button>
                  </div>
                </div>
              )
            })
          )}

          {assetRequests.length > 0 && (
            <div style={{ padding: '11px 20px', borderTop: `1px solid ${C.border}`, background: '#FAFBFE' }}>
              <span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>
                Showing <strong style={{ color: C.navy }}>{assetRequests.length}</strong> asset request{assetRequests.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Info note */}
        <div style={{ marginTop: 14, padding: '13px 16px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.20)', borderRadius: 10, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#6366F1' }}>ℹ</span>
          </div>
          <p style={{ fontSize: 12.5, color: '#4F46E5', fontWeight: 500, margin: 0, lineHeight: 1.55 }}>
            <strong style={{ fontWeight: 700 }}>Note:</strong> Once you approve this asset request, the request will be marked as <strong style={{ fontWeight: 700 }}>Closed</strong>, and the asset details will automatically be added to the employee's current asset list. Please review and approve the request.
          </p>
        </div>
        </>
      )}

      {/* ── TAB: Return Request ─────────────────────────────────────────── */}
      {activeTab === 'return' && (
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
          <div className="grid" style={{ gridTemplateColumns: RETURN_COL_GRID, padding: '14px 20px', background: '#f7f8fc', borderBottom: `1px solid ${C.border}` }}>
            {['Request ID', 'Date', 'Category', 'Asset Code', 'Asset Name', 'Return Reason', 'Status', 'Action'].map(h => (
              <span key={h} style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
            ))}
          </div>

          {returnRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center" style={{ padding: '60px 20px' }}>
              <div className="flex items-center justify-center rounded-2xl mb-4" style={{ width: 54, height: 54, background: '#F0F2F8' }}>
                <RotateCcw size={22} strokeWidth={1.5} style={{ color: '#B0B4C8' }} />
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 5 }}>No return requests found</p>
              <p style={{ fontSize: 13, color: C.muted }}>You haven't submitted any asset return requests yet</p>
            </div>
          ) : (
            returnRequests.map((rr, idx) => {
              const ss = RETURN_STATUS_STYLE[rr.status]
              const isLast = idx === returnRequests.length - 1

              let catIcon = null
              if (rr.category === 'Laptop') catIcon = <Laptop size={14} style={{ color: '#6366F1' }} />
              else if (rr.category === 'Monitor') catIcon = <Monitor size={14} style={{ color: '#3B82F6' }} />
              else if (rr.category === 'Phone') catIcon = <Smartphone size={14} style={{ color: '#10B981' }} />

              return (
                <div key={rr.id} className="ast-row grid items-center"
                  style={{ gridTemplateColumns: RETURN_COL_GRID, padding: '16px 20px', borderBottom: isLast ? 'none' : `1px solid ${C.border}`, background: '#fff', transition: 'background 0.12s' }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: C.navy, fontVariantNumeric: 'tabular-nums' }}>{rr.requestId}</span>
                  <span style={{ fontSize: 12, color: '#5A6080', fontWeight: 500 }}>{fmtDate(rr.requestedDate)}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, color: C.navy }}>
                    {catIcon}
                    {rr.category}
                  </span>
                  <span style={{ fontSize: 12.5, fontWeight: 500, color: C.muted, fontFamily: 'monospace' }}>{rr.assetCode}</span>
                  <span style={{ fontSize: 12.5, color: C.navy, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rr.assetName}</span>
                  <span style={{ fontSize: 12, color: '#5A6080', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={rr.returnReason}>{rr.returnReason.length > 32 ? rr.returnReason.slice(0, 32).trimEnd() + '...' : rr.returnReason}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full"
                    style={{ padding: '4px 10px', background: ss.bg, color: ss.color, fontSize: 11.5, fontWeight: 600, width: 'fit-content', whiteSpace: 'nowrap', border: `1px solid ${ss.dot}40` }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: ss.dot, display: 'inline-block', flexShrink: 0 }} />
                    {rr.status}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button
                      onClick={() => setViewReturnRequest(rr)}
                      title="View details"
                      style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#6366F1'; e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.30)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = C.muted; e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}
                    >
                      <Eye size={14} strokeWidth={1.8} />
                    </button>
                  </div>
                </div>
              )
            })
          )}

          {returnRequests.length > 0 && (
            <div style={{ padding: '11px 20px', borderTop: `1px solid ${C.border}`, background: '#FAFBFE' }}>
              <span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>
                Showing <strong style={{ color: C.navy }}>{returnRequests.length}</strong> return request{returnRequests.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── View Details Popup ──────────────────────────────────────────── */}
      {viewPopup && (
        <div style={{
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
        }} onClick={() => setViewPopup(null)}>
          <div style={{
            background: '#fff',
            borderRadius: 16,
            maxWidth: 500,
            width: '90%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '24px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `1px solid ${C.border}` }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: C.navy, margin: '0 0 4px 0' }}>Asset Details</h2>
                <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>Complete information about your asset</p>
              </div>
              <button
                onClick={() => setViewPopup(null)}
                style={{
                  width: 32,
                  height: 32,
                  background: C.bg,
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
                onMouseLeave={(e) => { e.currentTarget.style.background = C.bg }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: 24 }}>
              {[
                { label: 'Asset Code', value: viewPopup.code },
                { label: 'Category', value: viewPopup.category },
                { label: 'Description', value: viewPopup.description },
                { label: 'Date From', value: viewPopup.dateFrom },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: idx === 0 ? '0 0 16px 0' : '16px 0',
                    borderBottom: idx < 3 ? `1px solid ${C.border}` : 'none',
                  }}
                >
                  <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, margin: 0 }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Return Asset Popup ──────────────────────────────────────────── */}
      {returnPopup && (
        <div style={{
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
        }} onClick={() => { setReturnPopup(null); setReturnReason(''); }}>
          <div style={{
            background: '#fff',
            borderRadius: 16,
            maxWidth: 500,
            width: '90%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '24px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `1px solid ${C.border}` }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: C.navy, margin: '0 0 4px 0' }}>Return Asset</h2>
                <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>Request to return your asset</p>
              </div>
              <button
                onClick={() => { setReturnPopup(null); setReturnReason(''); }}
                style={{
                  width: 32,
                  height: 32,
                  background: C.bg,
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
                onMouseLeave={(e) => { e.currentTarget.style.background = C.bg }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ background: C.bg, padding: 14, borderRadius: 8, marginBottom: 20 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                  Asset
                </p>
                <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, margin: 0 }}>
                  {returnPopup.description}
                </p>
              </div>

              <label style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>
                Reason for Return
              </label>
              <textarea
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                placeholder="Enter reason for returning this asset..."
                style={{
                  width: '100%',
                  padding: 12,
                  fontSize: 13,
                  color: C.navy,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  minHeight: 100,
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ padding: '4px 24px 24px', display: 'flex', gap: 12 }}>
              <button
                onClick={() => { setReturnPopup(null); setReturnReason(''); }}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.navy,
                  background: C.bg,
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#E4E6EF' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = C.bg }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Return request submitted for: ${returnPopup.description}\nReason: ${returnReason}`);
                  setReturnPopup(null);
                  setReturnReason('');
                }}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#fff',
                  background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9' }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
              >
                Submit Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reject Asset Request Popup ──────────────────────────────────────── */}
      {rejectPopup && (
        <div style={{
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
        }} onClick={() => { setRejectPopup(null); setRejectReason(''); }}>
          <div style={{
            background: '#fff',
            borderRadius: 16,
            maxWidth: 500,
            width: '90%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '24px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `1px solid ${C.border}` }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: C.navy, margin: '0 0 4px 0' }}>Reject Asset Request</h2>
                <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>Please provide reason for rejection</p>
              </div>
              <button
                onClick={() => { setRejectPopup(null); setRejectReason(''); }}
                style={{
                  width: 32,
                  height: 32,
                  background: C.bg,
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
                onMouseLeave={(e) => { e.currentTarget.style.background = C.bg }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ background: C.bg, padding: 14, borderRadius: 8, marginBottom: 20 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                  Asset Request
                </p>
                <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, margin: 0 }}>
                  {rejectPopup.assetName}
                </p>
                <p style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>
                  Request ID: <strong>{rejectPopup.requestId}</strong>
                </p>
              </div>

              <label style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>
                Reason for Rejection
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter reason for rejecting this asset request..."
                style={{
                  width: '100%',
                  padding: 12,
                  fontSize: 13,
                  color: C.navy,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  minHeight: 100,
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ padding: '4px 24px 24px', display: 'flex', gap: 12 }}>
              <button
                onClick={() => { setRejectPopup(null); setRejectReason(''); }}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.navy,
                  background: C.bg,
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#E4E6EF' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = C.bg }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Asset request rejected: ${rejectPopup.assetName}\nReason: ${rejectReason}`);
                  handleRejectConfirm();
                }}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#fff',
                  background: 'linear-gradient(135deg, #E84855 0%, #C0202E 100%)',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9' }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
              >
                Reject Request
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
