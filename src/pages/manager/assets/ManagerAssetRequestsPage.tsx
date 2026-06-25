import { useState } from 'react'
import { Package, Laptop, Monitor, Eye } from 'lucide-react'

interface AssetRequest {
  id: string
  requestId: string
  assetName: string
  assetCode: string
  category: string
  status: 'Pending' | 'Allocated'
  employeeName: string
  employeeCode: string
  requestedDate: string
  pendingWith?: 'System Admin' | 'Accepted' | 'Employee' | 'Manager'
}

const C = {
  navy: '#1C2035',
  muted: '#8B90A7',
  border: '#E4E6EF',
  bg: '#F0F2F8',
}

const STATUS_STYLE: Record<string, { bg: string; color: string; dot: string }> = {
  'Pending': { bg: 'rgba(245,158,11,0.10)', color: '#B45309', dot: '#F59E0B' },
  'Allocated': { bg: 'rgba(14,168,106,0.12)', color: '#0A7040', dot: '#0EA86A' },
}

const COL_GRID = '1.1fr 0.85fr 0.95fr 1fr 1.8fr 1.3fr 1.1fr 0.95fr 0.8fr'

const MY_ASSET_REQUESTS: AssetRequest[] = [
  {
    id: 'ar-010',
    requestId: 'AR-2026-0460',
    assetName: 'iPhone 15 Pro',
    assetCode: 'PH-2024-0215',
    category: 'IT Hardware',
    status: 'Allocated',
    employeeName: 'John Doe',
    employeeCode: 'CC001',
    requestedDate: '2026-06-15',
    pendingWith: 'Manager',
  },
  {
    id: 'ar-011',
    requestId: 'AR-2026-0461',
    assetName: 'HP LaserJet Printer',
    assetCode: 'PR-2024-0087',
    category: 'IT Hardware',
    status: 'Allocated',
    employeeName: 'John Doe',
    employeeCode: 'CC001',
    requestedDate: '2026-06-16',
    pendingWith: 'Manager',
  },
  {
    id: 'ar-012',
    requestId: 'AR-2026-0462',
    assetName: 'Wireless Headphones',
    assetCode: 'AC-2024-0312',
    category: 'IT Hardware',
    status: 'Pending',
    employeeName: 'John Doe',
    employeeCode: 'CC001',
    requestedDate: '2026-06-17',
    pendingWith: 'System Admin',
  },
]

const TEAM_ASSET_REQUESTS: AssetRequest[] = [
  {
    id: 'ar-002',
    requestId: 'AR-2026-0452',
    assetName: 'MacBook Pro 14" M3',
    assetCode: 'LT-2024-0156',
    category: 'IT Hardware',
    status: 'Pending',
    employeeName: 'Sarah Johnson',
    employeeCode: 'CC002',
    requestedDate: '2026-06-01',
    pendingWith: 'System Admin',
  },
  {
    id: 'ar-003',
    requestId: 'AR-2026-0453',
    assetName: 'Wireless Mouse & Keyboard',
    assetCode: 'AC-2024-0156',
    category: 'Monitor',
    status: 'Allocated',
    employeeName: 'Rajesh Kumar',
    employeeCode: 'CC003',
    requestedDate: '2026-06-02',
    pendingWith: 'Employee',
  },
  {
    id: 'ar-004',
    requestId: 'AR-2026-0454',
    assetName: 'Samsung 32" Monitor',
    assetCode: 'MN-2024-0145',
    category: 'IT Hardware',
    status: 'Pending',
    employeeName: 'Priya Sharma',
    employeeCode: 'CC004',
    requestedDate: '2026-06-03',
    pendingWith: 'System Admin',
  },
  {
    id: 'ar-005',
    requestId: 'AR-2026-0455',
    assetName: 'USB-C Docking Station',
    assetCode: 'AC-2024-0189',
    category: 'Monitor',
    status: 'Allocated',
    employeeName: 'Arjun Menon',
    employeeCode: 'CC005',
    requestedDate: '2026-06-04',
    pendingWith: 'Accepted',
  },
  {
    id: 'ar-006',
    requestId: 'AR-2026-0456',
    assetName: 'External SSD 1TB',
    assetCode: 'ST-2024-0203',
    category: 'IT Hardware',
    status: 'Pending',
    employeeName: 'Neha Patel',
    employeeCode: 'CC006',
    requestedDate: '2026-06-05',
    pendingWith: 'System Admin',
  },
  {
    id: 'ar-007',
    requestId: 'AR-2026-0457',
    assetName: 'Mechanical Keyboard',
    assetCode: 'AC-2024-0267',
    category: 'Monitor',
    status: 'Allocated',
    employeeName: 'Vikram Singh',
    employeeCode: 'CC007',
    requestedDate: '2026-06-06',
    pendingWith: 'Employee',
  },
  {
    id: 'ar-008',
    requestId: 'AR-2026-0458',
    assetName: 'Laptop Stand',
    assetCode: 'AC-2024-0298',
    category: 'Monitor',
    status: 'Pending',
    employeeName: 'Anjali Gupta',
    employeeCode: 'CC008',
    requestedDate: '2026-06-07',
    pendingWith: 'System Admin',
  },
]

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

type RequestTab = 'my-requests' | 'team-requests'
type RequestStatus = 'All' | 'Pending' | 'Allocated'

interface ManagerAssetRequestsPageProps {
  onAddAsset?: (asset: any) => void
  teamOnly?: boolean
  teamRequests?: AssetRequest[]
  onNavigate?: (page: string) => void
}

export default function ManagerAssetRequestsPage({ onAddAsset, teamOnly, teamRequests: propTeamRequests, onNavigate }: ManagerAssetRequestsPageProps) {
  const [activeTab, setActiveTab] = useState<RequestTab>('my-requests')
  const [statusFilter, setStatusFilter] = useState<RequestStatus>('All')
  const [myRequests, setMyRequests] = useState<AssetRequest[]>(MY_ASSET_REQUESTS)
  const [teamRequests] = useState<AssetRequest[]>(propTeamRequests || TEAM_ASSET_REQUESTS)
  const [rejectPopup, setRejectPopup] = useState<AssetRequest | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [detailsPopup, setDetailsPopup] = useState<AssetRequest | null>(null)

  const baseRequests = propTeamRequests || (teamOnly ? teamRequests : (activeTab === 'my-requests' ? myRequests : teamRequests))
  const currentRequests = statusFilter === 'All' ? baseRequests : baseRequests.filter(r => {
    if (statusFilter === 'Pending') return r.status === 'Pending'
    if (statusFilter === 'Allocated') return r.status === 'Allocated'
    return true
  })

  function handleAcceptRequest(requestId: string) {
    // Find the request
    const request = myRequests.find(req => req.id === requestId)
    if (request && onAddAsset) {
      // Add to My Assets
      onAddAsset({
        id: request.id,
        code: request.assetCode,
        category: request.category,
        description: request.assetName,
        dateFrom: fmtDate(new Date().toISOString().split('T')[0]),
      })
    }
    // Remove from My Requests
    setMyRequests(prev => prev.filter(req => req.id !== requestId))
  }

  function handleRejectConfirm() {
    if (rejectPopup) {
      setRejectPopup(null)
      setRejectReason('')
    }
  }

  function getPendingWithStyle(pendingWith?: string) {
    if (pendingWith === 'Accepted') {
      return { bg: 'rgba(14,168,106,0.12)', color: '#0A7040', dot: '#0EA86A' }
    } else if (pendingWith === 'System Admin') {
      return { bg: 'rgba(232,72,85,0.10)', color: '#C0202E', dot: '#E84855' }
    } else if (pendingWith === 'Employee') {
      return { bg: 'rgba(59,130,246,0.10)', color: '#1D4ED8', dot: '#3B82F6' }
    } else if (pendingWith === 'Manager') {
      return { bg: 'rgba(124,58,237,0.10)', color: '#7C3AED', dot: '#A78BFA' }
    }
    return { bg: 'rgba(245,158,11,0.10)', color: '#B45309', dot: '#F59E0B' }
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes iconFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        .ast-row:hover { background: #FAFBFE !important; }
      `}</style>

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-bold mb-1" style={{ fontSize: 22, color: C.navy, letterSpacing: '-0.3px' }}>
            {teamOnly ? 'Team Asset Requests' : 'Asset Requests'}
          </h1>
          <p style={{ fontSize: 13.5, color: '#787878', fontWeight: 500 }}>
            {teamOnly ? 'Review and approve asset requests from team members' : 'Manage and approve asset requests from your team'}
          </p>
        </div>
        {teamOnly ? (
          <button
            onClick={() => onNavigate?.('create-asset-request')}
            style={{
              padding: '10px 20px',
              borderRadius: 10,
              border: 'none',
              background: '#1C2035',
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#0F1520'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(28,32,53,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#1C2035'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <Package size={18} strokeWidth={1.8} />
            Create Asset Request
          </button>
        ) : (
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
        )}
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────── */}
      {!teamOnly && (
      <div style={{ marginBottom: 24, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: 6, width: 'fit-content' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setActiveTab('my-requests')}
            style={{
              padding: '6px 12px',
              fontSize: 13,
              fontWeight: 600,
              color: activeTab === 'my-requests' ? '#fff' : C.muted,
              background: activeTab === 'my-requests' ? '#1c2035' : 'transparent',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              if (activeTab !== 'my-requests') {
                e.currentTarget.style.background = '#F7F8FC'
              }
            }}
            onMouseLeave={e => {
              if (activeTab !== 'my-requests') {
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            My Requests
          </button>
          <button
            onClick={() => setActiveTab('team-requests')}
            style={{
              padding: '6px 12px',
              fontSize: 13,
              fontWeight: 600,
              color: activeTab === 'team-requests' ? '#fff' : C.muted,
              background: activeTab === 'team-requests' ? '#1c2035' : 'transparent',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              if (activeTab !== 'team-requests') {
                e.currentTarget.style.background = '#F7F8FC'
              }
            }}
            onMouseLeave={e => {
              if (activeTab !== 'team-requests') {
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            Team Requests
          </button>
        </div>
      </div>
      )}

      {/* ── Asset Requests Table ────────────────────────────────────────── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
        {/* Status Filter Header - Only for Team Only view */}
        {teamOnly && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 20px', borderBottom: `1px solid ${C.border}`, background: '#FAFBFE' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>Team Asset Requests</span>
            <span style={{ padding: '2px 9px', borderRadius: 99, background: '#F0F2F8', fontSize: 11.5, fontWeight: 700, color: C.muted }}>{baseRequests.length}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {(['All', 'Pending', 'Allocated'] as const).map((s: RequestStatus) => {
              const isAllBtn = s === 'All'
              const isActive = statusFilter === s
              const cnt = isAllBtn ? baseRequests.length : baseRequests.filter(r => r.status === s).length

              let dotColor = '#B0B4C8'
              let activeBg = 'rgba(28,32,53,0.08)'
              let activeColor = C.navy

              if (s === 'Pending') {
                dotColor = '#F59E0B'
                activeBg = 'rgba(245,158,11,0.10)'
                activeColor = '#B45309'
              } else if (s === 'Allocated') {
                dotColor = '#0EA86A'
                activeBg = 'rgba(14,168,106,0.12)'
                activeColor = '#0A7040'
              }

              return (
                <button key={s} onClick={() => setStatusFilter(s)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 9px', borderRadius: 99, border: 'none', cursor: 'pointer', background: isActive ? activeBg : '#F0F2F8', color: isActive ? activeColor : C.muted, fontSize: 11, fontWeight: isActive ? 700 : 600, outline: 'none', transition: 'all 0.13s' }}>
                  {!isAllBtn && <span style={{ width: 5, height: 5, borderRadius: '50%', background: isActive ? dotColor : '#B0B4C8', display: 'inline-block', flexShrink: 0 }} />}
                  {s}
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '0px 4px', borderRadius: 99, marginLeft: 1, background: isActive ? (dotColor + '28') : 'rgba(0,0,0,0.06)', color: isActive ? activeColor : '#9CA3AF' }}>{cnt}</span>
                </button>
              )
            })}
          </div>
        </div>
        )}

        {/* Table Header */}
        <div className="grid" style={{ gridTemplateColumns: COL_GRID, padding: '14px 20px', background: '#f7f8fc', borderBottom: `1px solid ${C.border}` }}>
          {['Request ID', 'Date', 'Category', 'Asset Code', 'Description', 'Employee', 'Pending With', 'Status', 'Action'].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
          ))}
        </div>

        {/* Table Rows */}
        {currentRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center" style={{ padding: '60px 20px' }}>
            <div className="flex items-center justify-center rounded-2xl mb-4" style={{ width: 54, height: 54, background: '#F0F2F8' }}>
              <Package size={22} strokeWidth={1.5} style={{ color: '#B0B4C8' }} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 5 }}>No asset requests found</p>
            <p style={{ fontSize: 13, color: C.muted }}>No asset requests at the moment</p>
          </div>
        ) : (
          currentRequests.map((ar, idx) => {
            const ss = STATUS_STYLE[ar.status]
            const isLast = idx === currentRequests.length - 1

            let pendingWithBg = 'rgba(245,158,11,0.10)'
            let pendingWithColor = '#B45309'
            let pendingWithLabel = 'Pending'

            if (ar.pendingWith === 'Accepted') {
              pendingWithBg = 'rgba(14,168,106,0.12)'
              pendingWithColor = '#0A7040'
              pendingWithLabel = 'Accepted'
            } else if (ar.pendingWith === 'System Admin') {
              pendingWithBg = 'rgba(232,72,85,0.10)'
              pendingWithColor = '#C0202E'
              pendingWithLabel = 'System Admin'
            } else if (ar.pendingWith === 'Employee') {
              pendingWithBg = 'rgba(59,130,246,0.10)'
              pendingWithColor = '#1D4ED8'
              pendingWithLabel = 'Employee'
            } else if (ar.pendingWith === 'Manager') {
              pendingWithBg = 'rgba(124,58,237,0.10)'
              pendingWithColor = '#7C3AED'
              pendingWithLabel = 'Manager'
            }

            let catIcon = null
            if (ar.category === 'IT Hardware') {
              catIcon = <Laptop size={14} style={{ color: '#6366F1' }} />
            } else if (ar.category === 'Monitor') {
              catIcon = <Monitor size={14} style={{ color: '#3B82F6' }} />
            }

            return (
              <div key={ar.id} className="ast-row grid items-center"
                onClick={() => !teamOnly && setDetailsPopup(ar)}
                style={{ gridTemplateColumns: COL_GRID, padding: '16px 20px', borderBottom: isLast ? 'none' : `1px solid ${C.border}`, background: '#fff', transition: 'background 0.12s', cursor: teamOnly ? 'default' : 'pointer' }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: C.navy, fontVariantNumeric: 'tabular-nums' }}>{ar.requestId}</span>
                <span style={{ fontSize: 12, color: '#5A6080', fontWeight: 500 }}>{fmtDate(ar.requestedDate)}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, color: ar.status === 'Pending' ? C.muted : C.navy }}>
                  {ar.status === 'Pending' ? '—' : (
                    <>
                      {catIcon}
                      {ar.category}
                    </>
                  )}
                </span>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: ar.status === 'Pending' ? C.muted : C.navy, fontFamily: 'monospace' }}>
                  {ar.status === 'Pending' ? '—' : ar.assetCode}
                </span>
                <span style={{ fontSize: 12, color: ar.status === 'Pending' ? C.muted : '#5A6080', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {ar.status === 'Pending' ? '—' : ar.assetName}
                </span>
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
                  {!teamOnly ? (
                    // My Requests: Show eye icon when Allocated + Accepted, or checkmark/reject for Manager
                    ar.status === 'Allocated' && ar.pendingWith === 'Accepted' ? (
                      <button
                        onClick={() => setDetailsPopup(ar)}
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
                          e.currentTarget.style.color = '#5B5FDE'
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
                    ) : ar.status === 'Allocated' && ar.pendingWith === 'Manager' ? (
                      // Show checkmark and reject icons when Allocated + Manager
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleAcceptRequest(ar.id) }}
                          title="Accept request"
                          style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: 'rgba(14,168,106,0.10)', color: '#0A7040', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.14s', fontSize: 11, fontWeight: 600 }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(14,168,106,0.18)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(14,168,106,0.10)' }}
                        >
                          ✓
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setRejectPopup(ar) }}
                          title="Reject request"
                          style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: 'rgba(232,72,85,0.10)', color: '#C0202E', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.14s', fontSize: 11, fontWeight: 600 }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.18)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.10)' }}
                        >
                          ✕
                        </button>
                      </>
                    ) : null
                  ) : (
                    // Team Requests: Always show eye icon for all rows
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // Navigate to different detail pages based on employee name
                        if (ar.employeeName === 'Arjun Menon') {
                          onNavigate?.('asset-request-details-case1')
                        } else if (ar.employeeName === 'Rajesh Kumar') {
                          onNavigate?.('asset-request-details-case2')
                        } else if (ar.employeeName === 'Sarah Johnson') {
                          onNavigate?.('asset-request-details-case3')
                        } else if (ar.employeeName === 'Priya Sharma') {
                          onNavigate?.('asset-request-details-case3')
                        } else if (ar.employeeName === 'Neha Patel') {
                          onNavigate?.('asset-request-details-case3')
                        } else if (ar.employeeName === 'Anjali Gupta') {
                          onNavigate?.('asset-request-details-case3')
                        } else if (ar.employeeName === 'Vikram Singh') {
                          onNavigate?.('asset-request-details-case2')
                        }
                        // Other employees: no navigation
                      }}
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
                        e.currentTarget.style.color = '#5B5FDE'
                        e.currentTarget.style.background = 'rgba(99,102,241,0.08)'
                        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.30)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = C.muted
                        e.currentTarget.style.background = '#fff'
                        e.currentTarget.style.borderColor = C.border
                      }}
                      title="View details"
                    >
                      <Eye size={14} strokeWidth={1.8} />
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* ── Details Popup ────────────────────────────────────────────────── */}
      {detailsPopup && (() => {
        const pendingWithStyle = getPendingWithStyle(detailsPopup.pendingWith)
        return (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(10,12,28,0.55)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => setDetailsPopup(null)}
          >
            <div
              style={{
                background: '#fff',
                borderRadius: 20,
                padding: '28px',
                maxWidth: 520,
                width: '90%',
                boxShadow: '0 24px 64px rgba(10,12,28,0.22)',
              }}
              onClick={e => e.stopPropagation()}
            >
              <h2 style={{ fontSize: 18, fontWeight: 800, color: C.navy, marginBottom: 24 }}>Request Details</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Request ID</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{detailsPopup.requestId}</span>
                </div>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Date Requested</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{fmtDate(detailsPopup.requestedDate)}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Employee</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{detailsPopup.employeeName}</span>
                  <span style={{ fontSize: 12, color: C.muted, display: 'block', marginTop: 2 }}>{detailsPopup.employeeCode}</span>
                </div>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Asset Name</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{detailsPopup.assetName}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Category</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{detailsPopup.category}</span>
                </div>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Asset Code</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.navy, fontFamily: 'monospace' }}>{detailsPopup.assetCode}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>Status</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full"
                    style={{ padding: '4px 10px', background: STATUS_STYLE[detailsPopup.status].bg, color: STATUS_STYLE[detailsPopup.status].color, fontSize: 12, fontWeight: 600, width: 'fit-content' }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: STATUS_STYLE[detailsPopup.status].dot, display: 'inline-block' }} />
                    {detailsPopup.status}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>Pending With</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full"
                    style={{ padding: '4px 10px', background: pendingWithStyle.bg, color: pendingWithStyle.color, fontSize: 12, fontWeight: 600, width: 'fit-content' }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: pendingWithStyle.dot, display: 'inline-block' }} />
                    {detailsPopup.pendingWith || 'Pending'}
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <button
                  onClick={() => setDetailsPopup(null)}
                  style={{
                    height: 40,
                    padding: '0 20px',
                    borderRadius: 10,
                    fontSize: 13.5,
                    fontWeight: 600,
                    border: `1px solid ${C.border}`,
                    background: '#fff',
                    color: C.muted,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#C0C4D6'
                    e.currentTarget.style.color = C.navy
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = C.border
                    e.currentTarget.style.color = C.muted
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* ── Reject Confirmation Modal ────────────────────────────────────── */}
      {rejectPopup && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(10,12,28,0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setRejectPopup(null)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 20,
              padding: '28px',
              maxWidth: 480,
              width: '90%',
              boxShadow: '0 24px 64px rgba(10,12,28,0.22)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ fontSize: 18, fontWeight: 800, color: C.navy, marginBottom: 12 }}>Reject Request?</h2>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, marginBottom: 24 }}>
              Are you sure you want to reject the request for <strong>{rejectPopup.assetName}</strong> from <strong>{rejectPopup.employeeName}</strong>?
            </p>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Reason for rejection (optional)"
              style={{
                width: '100%',
                height: 80,
                borderRadius: 10,
                border: `1px solid ${C.border}`,
                padding: '12px 14px',
                fontSize: 13.5,
                fontFamily: 'inherit',
                resize: 'none',
                marginBottom: 20,
              }}
            />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setRejectPopup(null)}
                style={{
                  height: 40,
                  padding: '0 20px',
                  borderRadius: 10,
                  fontSize: 13.5,
                  fontWeight: 600,
                  border: `1px solid ${C.border}`,
                  background: '#fff',
                  color: C.muted,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#C0C4D6'
                  e.currentTarget.style.color = C.navy
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = C.border
                  e.currentTarget.style.color = C.muted
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                style={{
                  height: 40,
                  padding: '0 20px',
                  borderRadius: 10,
                  fontSize: 13.5,
                  fontWeight: 600,
                  border: 'none',
                  background: '#E84855',
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.opacity = '0.88'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.opacity = '1'
                }}
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
