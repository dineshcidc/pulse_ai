import { ArrowLeft } from 'lucide-react'

interface ManagerAssetRequestDetailsPageProps {
  onNavigate?: (page: string) => void
}

const C = {
  navy: '#1C2035',
  muted: '#8B90A7',
  border: '#E4E6EF',
  bg: '#F0F2F8',
}

const BADGE_STYLES = {
  Manager: { bg: 'rgba(59,130,246,0.12)', color: '#1E40AF', dot: '#3B82F6' },
  'System Admin': { bg: 'rgba(232,72,85,0.10)', color: '#C0202E', dot: '#E84855' },
  Employee: { bg: 'rgba(168,85,247,0.12)', color: '#6B21A8', dot: '#A855F7' },
  Accepted: { bg: 'rgba(14,168,106,0.12)', color: '#0A7040', dot: '#0EA86A' },
}

export default function ManagerAssetRequestDetailsPage_Case1({ onNavigate }: ManagerAssetRequestDetailsPageProps) {
  const mockRequest = {
    id: 'ar-001',
    requestId: 'AR-2026-0451',
    assetName: 'MacBook Pro 14" M3',
    assetCode: 'LT-2024-0156',
    category: 'IT Hardware',
    status: 'Allocated',
    employeeName: 'Sarah Johnson',
    employeeCode: 'CC002',
    employeeRole: 'Developer',
    requestedDate: '15 Jun 2026',
    pendingWith: 'Accepted',
    raisedByName: 'Arjun Menon',
    raisedByRole: 'Project Manager',
    raisedByCode: 'CC001',
    allocationDate: '18 Jun 2026',
    assignedDate: '20 Jun 2026',
    acceptanceDate: '22 Jun 2026',
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* ── Breadcrumb ────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={() => onNavigate?.('team-asset-requests')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 30,
            height: 30,
            borderRadius: 8,
            border: `1px solid ${C.border}`,
            background: '#fff',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.14s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#F7F8FC'
            e.currentTarget.style.borderColor = '#C8CCE0'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#fff'
            e.currentTarget.style.borderColor = C.border
          }}
        >
          <ArrowLeft size={14} strokeWidth={2} style={{ color: C.muted }} />
        </button>
        <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
        <button
          onClick={() => onNavigate?.('team-asset-requests')}
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: C.muted,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            fontFamily: 'inherit',
            transition: 'color 0.14s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.navy)}
          onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
        >
          Team Asset Requests
        </button>
        <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Request Details</span>
      </div>

      {/* ── Request Overview Card ──────────────────────────────────────── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: 28 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 24, marginBottom: 0, paddingBottom: 28 }}>
          {/* Request ID */}
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Request ID</span>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{mockRequest.requestId}</div>
          </div>

          {/* Status */}
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Status</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 6, background: BADGE_STYLES.Accepted.bg, color: BADGE_STYLES.Accepted.color, fontSize: 12, fontWeight: 600 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: BADGE_STYLES.Accepted.dot }} />
              Accepted
            </span>
          </div>

          {/* Pending With */}
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Pending With</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 6, background: BADGE_STYLES.Accepted.bg, color: BADGE_STYLES.Accepted.color, fontSize: 12, fontWeight: 600 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: BADGE_STYLES.Accepted.dot }} />
              Accepted
            </span>
          </div>

          {/* Request Date */}
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Request Date</span>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{mockRequest.requestedDate}</div>
          </div>
        </div>

        {/* Asset Details */}
        <div style={{ paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Asset Category</span>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{mockRequest.category}</div>
            </div>
            <div>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Asset Code</span>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.navy, fontFamily: 'monospace' }}>{mockRequest.assetCode}</div>
            </div>
            <div>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Asset Description</span>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{mockRequest.assetName}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Request Timeline ───────────────────────────────────────────── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 28 }}>Request Journey</h2>

        {/* Timeline Container */}
        <div style={{ position: 'relative' }}>
          {/* Vertical connector line */}
          <div style={{
            position: 'absolute', left: 19, top: 14,
            width: 2,
            height: '100%',
            background: 'linear-gradient(to bottom, rgba(14,168,106,0.35), rgba(14,168,106,0.04))',
            borderRadius: 2,
          }} />

          {/* Step 1: Request Raised */}
          <div style={{ display: 'flex', gap: 20, marginBottom: 34, position: 'relative' }}>
            {/* Node dot */}
            <div style={{ width: 40, flexShrink: 0, display: 'flex', justifyContent: 'center', paddingTop: 3 }}>
              <div style={{
                width: 16, height: 16, borderRadius: '50%',
                background: '#fff', border: '2.5px solid #0EA86A',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 1, position: 'relative',
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0EA86A' }} />
              </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Request Raised</h3>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 6, background: BADGE_STYLES.Manager.bg, color: BADGE_STYLES.Manager.color, fontSize: 11, fontWeight: 600 }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: BADGE_STYLES.Manager.dot }} />
                  Manager
                </span>
              </div>

              <div style={{ background: '#F9FAFB', padding: 20, borderRadius: 12, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                {/* Raised By */}
                <div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Raised By</span>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 4 }}>{mockRequest.raisedByName}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>
                    {mockRequest.raisedByRole} • {mockRequest.raisedByCode}
                  </div>
                </div>

                {/* Requested For */}
                <div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Requested For</span>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 4 }}>{mockRequest.employeeName}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>
                    {mockRequest.employeeRole} • {mockRequest.employeeCode}
                  </div>
                </div>

                {/* Request Raised Date */}
                <div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Request Raised Date</span>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{mockRequest.requestedDate}</div>
                </div>

                {/* Asset Category */}
                <div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Asset Category</span>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{mockRequest.category}</div>
                </div>

                {/* Remarks */}
                <div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Remarks</span>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>Need MacBook Pro M3 for Sarah Johnson for development</div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Asset Allocation */}
          <div style={{ display: 'flex', gap: 20, marginBottom: 34, position: 'relative' }}>
            {/* Node dot */}
            <div style={{ width: 40, flexShrink: 0, display: 'flex', justifyContent: 'center', paddingTop: 3 }}>
              <div style={{
                width: 16, height: 16, borderRadius: '50%',
                background: '#fff', border: '2.5px solid #0EA86A',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 1, position: 'relative',
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0EA86A' }} />
              </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Asset Allocation</h3>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 6, background: BADGE_STYLES['System Admin'].bg, color: BADGE_STYLES['System Admin'].color, fontSize: 11, fontWeight: 600 }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: BADGE_STYLES['System Admin'].dot }} />
                  System Admin
                </span>
              </div>

              <div style={{ background: '#F9FAFB', padding: 20, borderRadius: 12, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                {/* Allocation Date */}
                <div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Allocation Date</span>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{mockRequest.allocationDate}</div>
                </div>

                {/* Asset Code */}
                <div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Asset Code</span>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, fontFamily: 'monospace' }}>{mockRequest.assetCode}</div>
                </div>

                {/* Asset Category */}
                <div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Asset Category</span>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{mockRequest.category}</div>
                </div>

                {/* Asset Description */}
                <div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Asset Description</span>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{mockRequest.assetName}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Employee Acceptance */}
          <div style={{ display: 'flex', gap: 20, position: 'relative' }}>
            {/* Node dot */}
            <div style={{ width: 40, flexShrink: 0, display: 'flex', justifyContent: 'center', paddingTop: 3 }}>
              <div style={{
                width: 16, height: 16, borderRadius: '50%',
                background: '#fff', border: '2.5px solid #0EA86A',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 1, position: 'relative',
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0EA86A' }} />
              </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Employee Acceptance</h3>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 6, background: BADGE_STYLES.Employee.bg, color: BADGE_STYLES.Employee.color, fontSize: 11, fontWeight: 600 }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: BADGE_STYLES.Employee.dot }} />
                  Employee
                </span>
              </div>

              <div style={{ background: '#F9FAFB', padding: 20, borderRadius: 12, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                {/* Employee Name */}
                <div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Employee Name</span>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{mockRequest.employeeName}</div>
                </div>

                {/* Acceptance Date */}
                <div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Accepted Date</span>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{mockRequest.acceptanceDate}</div>
                </div>

                {/* Acceptance Status */}
                <div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Acceptance Status</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 6, background: BADGE_STYLES.Accepted.bg, color: BADGE_STYLES.Accepted.color, fontSize: 12, fontWeight: 600 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: BADGE_STYLES.Accepted.dot }} />
                    Accepted
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
