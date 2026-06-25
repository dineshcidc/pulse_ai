import { useState } from 'react'
import { Package, Laptop, Monitor, Smartphone, Eye, RotateCcw } from 'lucide-react'

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

const C = {
  navy: '#1C2035',
  muted: '#8B90A7',
  border: '#E4E6EF',
  bg: '#F0F2F8',
  surface: '#F7F8FC',
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

type AssetsTab = 'current' | 'requests'

interface ManagerAssetRequest {
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

interface ManagerMyAssetPageProps {
  assets?: Array<{
    id: string
    code: string
    category: string
    description: string
    dateFrom: string
  }>
  myRequests?: ManagerAssetRequest[]
  onAcceptRequest?: (requestId: string) => void
}

export default function ManagerMyAssetsPage({ assets, myRequests, onAcceptRequest }: ManagerMyAssetPageProps) {
  const [activeTab, setActiveTab] = useState<AssetsTab>('current')

  const defaultAssets: Asset[] = assets ? assets.map((a: any) => ({
    id: a.id,
    code: a.code,
    category: a.category,
    description: a.description,
    dateFrom: a.dateFrom,
  })) : ASSETS

  const [currentAssets] = useState<Asset[]>(defaultAssets)
  const [viewPopup, setViewPopup] = useState<Asset | null>(null)
  const [returnPopup, setReturnPopup] = useState<Asset | null>(null)
  const [returnReason, setReturnReason] = useState('')
  const [acceptedRequestIds, setAcceptedRequestIds] = useState<Set<string>>(new Set(['ar-011']))
  const [requestStatusFilter, setRequestStatusFilter] = useState<'All' | 'Pending' | 'Allocated'>('All')

  const handleAcceptWithTracking = (requestId: string) => {
    setAcceptedRequestIds(prev => new Set([...prev, requestId]))
    onAcceptRequest?.(requestId)
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
            My Assets
          </h1>
          <p style={{ fontSize: 13.5, color: '#787878', fontWeight: 500 }}>
            Manage and track your company assets
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
      <div style={{ marginBottom: 24, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: 6, width: 'fit-content' }}>
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
            onMouseEnter={e => {
              if (activeTab !== 'current') {
                e.currentTarget.style.background = '#F7F8FC'
              }
            }}
            onMouseLeave={e => {
              if (activeTab !== 'current') {
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            My Current Assets
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            style={{
              padding: '6px 12px',
              fontSize: 13,
              fontWeight: 600,
              color: activeTab === 'requests' ? '#fff' : C.muted,
              background: activeTab === 'requests' ? '#1c2035' : 'transparent',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              if (activeTab !== 'requests') {
                e.currentTarget.style.background = '#F7F8FC'
              }
            }}
            onMouseLeave={e => {
              if (activeTab !== 'requests') {
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            My Requests
          </button>
        </div>
      </div>

      {/* ── Assets Table ─────────────────────────────────────────────────── */}
      {activeTab === 'current' ? (
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
                title="Return asset"
              >
                <RotateCcw size={14} strokeWidth={1.8} />
              </button>
            </div>
          </div>
        ))}
      </div>
      ) : (
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
          {/* Filter Section */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>My Requests</span>
              <span style={{ padding: '2px 9px', borderRadius: 99, background: '#F0F2F8', fontSize: 11.5, fontWeight: 700, color: C.muted }}>{myRequests?.length ?? 0}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {(['All', 'Pending', 'Allocated'] as const).map((s) => {
                const isAllBtn = s === 'All'
                const isActive = requestStatusFilter === s
                const cnt = isAllBtn ? (myRequests?.length ?? 0) : (myRequests?.filter(r => r.status === s).length ?? 0)

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
                  <button key={s} onClick={() => setRequestStatusFilter(s)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 9px', borderRadius: 99, border: 'none', cursor: 'pointer', background: isActive ? activeBg : '#F0F2F8', color: isActive ? activeColor : C.muted, fontSize: 11, fontWeight: isActive ? 700 : 600, outline: 'none', transition: 'all 0.13s' }}>
                    {!isAllBtn && <span style={{ width: 5, height: 5, borderRadius: '50%', background: isActive ? dotColor : '#B0B4C8', display: 'inline-block', flexShrink: 0 }} />}
                    {s}
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '0px 4px', borderRadius: 99, marginLeft: 1, background: isActive ? (dotColor + '28') : 'rgba(0,0,0,0.06)', color: isActive ? activeColor : '#9CA3AF' }}>{cnt}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Table Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.1fr 0.85fr 0.95fr 1fr 1.8fr 1.3fr 1.1fr 0.95fr 0.8fr',
              gap: 20,
              padding: '14px 20px',
              background: '#f7f8fc',
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            {['Request ID', 'Date', 'Category', 'Asset Code', 'Description', 'Employee', 'Pending With', 'Status', 'Action'].map((col) => (
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
          {(!myRequests || myRequests.length === 0) ? (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
              <Package size={40} style={{ color: '#B0B4C8', margin: '0 auto 16px' }} />
              <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 4 }}>No pending requests</p>
              <p style={{ fontSize: 13, color: C.muted }}>All your asset requests have been processed</p>
            </div>
          ) : (
            myRequests
              .filter((req) => {
                if (requestStatusFilter === 'All') return true
                return req.status === requestStatusFilter
              })
              .map((req, idx, filtered) => {
              const isLast = idx === (filtered?.length ?? 0) - 1
              let pendingWithBg = 'rgba(245,158,11,0.10)'
              let pendingWithColor = '#B45309'
              let pendingWithLabel = 'Pending'

              if (acceptedRequestIds.has(req.id)) {
                // Accepted state
                pendingWithBg = 'rgba(14,168,106,0.12)'
                pendingWithColor = '#0A7040'
                pendingWithLabel = 'Accepted'
              } else if (req.pendingWith === 'System Admin') {
                pendingWithBg = 'rgba(232,72,85,0.10)'
                pendingWithColor = '#C0202E'
                pendingWithLabel = 'System Admin'
              } else if (req.pendingWith === 'Manager') {
                pendingWithBg = 'rgba(124,58,237,0.10)'
                pendingWithColor = '#7C3AED'
                pendingWithLabel = 'You'
              }

              const statusBg = req.status === 'Allocated' ? 'rgba(14,168,106,0.12)' : 'rgba(245,158,11,0.10)'
              const statusColor = req.status === 'Allocated' ? '#0A7040' : '#B45309'
              const statusDot = req.status === 'Allocated' ? '#0EA86A' : '#F59E0B'

              return (
                <div key={req.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.1fr 0.85fr 0.95fr 1fr 1.8fr 1.3fr 1.1fr 0.95fr 0.8fr',
                    gap: 20,
                    padding: '16px 20px',
                    borderBottom: isLast ? 'none' : `1px solid ${C.border}`,
                    alignItems: 'center',
                    background: '#fff',
                    cursor: 'pointer',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#F7F8FC' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#fff' }}
                >
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: C.navy, fontVariantNumeric: 'tabular-nums' }}>{req.requestId}</span>
                  <span style={{ fontSize: 12, color: '#5A6080', fontWeight: 500 }}>{req.requestedDate}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, color: req.status === 'Pending' && req.pendingWith === 'System Admin' ? C.muted : C.navy }}>
                    {req.status === 'Pending' && req.pendingWith === 'System Admin' ? '—' : (
                      <>
                        {req.category === 'IT Hardware' && <Laptop size={14} style={{ color: '#6366F1' }} />}
                        {req.category}
                      </>
                    )}
                  </span>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: req.status === 'Pending' && req.pendingWith === 'System Admin' ? C.muted : C.navy, fontFamily: 'monospace' }}>{req.status === 'Pending' && req.pendingWith === 'System Admin' ? '—' : req.assetCode}</span>
                  <span style={{ fontSize: 12, color: req.status === 'Pending' && req.pendingWith === 'System Admin' ? C.muted : C.navy, fontWeight: 500 }}>{req.status === 'Pending' && req.pendingWith === 'System Admin' ? '—' : req.assetName}</span>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: C.navy }}>
                    {req.employeeName}
                    <div style={{ fontSize: 11, color: C.muted, fontWeight: 500 }}>{req.employeeCode}</div>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 9px', borderRadius: 8, background: pendingWithBg, color: pendingWithColor, fontSize: 11.5, fontWeight: 600, width: 'fit-content', whiteSpace: 'nowrap' }}>{pendingWithLabel}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full"
                    style={{ padding: '4px 10px', background: statusBg, color: statusColor, fontSize: 11.5, fontWeight: 600, width: 'fit-content', whiteSpace: 'nowrap', border: `1px solid ${statusDot}40` }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: statusDot, display: 'inline-block', flexShrink: 0 }} />
                    {req.status}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {acceptedRequestIds.has(req.id) ? (
                      // Accepted: Show eye icon only
                      <button
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
                    ) : req.status === 'Pending' && req.pendingWith === 'System Admin' ? (
                      // System Admin Pending: Show eye icon only
                      <button
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
                    ) : (
                      // Manager Pending: Show eye icon, checkmark, and reject
                      <>
                        <button
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
                        <button
                          onClick={(e) => { e.stopPropagation(); handleAcceptWithTracking(req.id) }}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 6,
                            border: 'none',
                            background: 'rgba(14,168,106,0.10)',
                            color: '#0A7040',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.14s',
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(14,168,106,0.18)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(14,168,106,0.10)' }}
                          title="Accept request"
                        >
                          ✓
                        </button>
                        <button
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 6,
                            border: 'none',
                            background: 'rgba(232,72,85,0.10)',
                            color: '#C0202E',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.14s',
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.18)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.10)' }}
                          title="Reject request"
                        >
                          ✕
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

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
    </div>
  )
}
