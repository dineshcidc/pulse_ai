import { ArrowLeft, Check, Clock, RotateCcw } from 'lucide-react'

export interface EmployeeReturnRequest {
  id: string
  requestId: string
  employeeName: string
  employeeCode: string
  category: string
  assetName: string
  assetCode: string
  returnReason: string
  requestedDate: string
  status: 'Pending' | 'Accepted'
  decisionNote?: string
  decisionDate?: string
  decisionBy?: string
}

interface Props {
  request: EmployeeReturnRequest
  onBack?: () => void
}

const C = {
  navy: '#1C2035',
  muted: '#8B90A7',
  border: '#E4E6EF',
  bg: '#F0F2F8',
}

const STATUS_STYLES: Record<EmployeeReturnRequest['status'], { bg: string; color: string; dot: string }> = {
  Pending: { bg: 'rgba(245,158,11,0.10)', color: '#B45309', dot: '#F59E0B' },
  Accepted: { bg: 'rgba(14,168,106,0.12)', color: '#0A7040', dot: '#0EA86A' },
}

function fmtDate(d?: string) {
  if (!d) return '—'
  const parsed = new Date(d)
  if (isNaN(parsed.getTime())) return d
  return parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function EmployeeReturnRequestDetailsPage({ request, onBack }: Props) {
  const st = STATUS_STYLES[request.status]
  const isPending = request.status === 'Pending'

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* ── Breadcrumb ────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={() => onBack?.()}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.border}`,
            background: '#fff', cursor: 'pointer', flexShrink: 0, transition: 'all 0.14s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#F7F8FC'; e.currentTarget.style.borderColor = '#C8CCE0' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}
        >
          <ArrowLeft size={14} strokeWidth={2} style={{ color: C.muted }} />
        </button>
        <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
        <button
          onClick={() => onBack?.()}
          style={{ fontSize: 13, fontWeight: 500, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', transition: 'color 0.14s' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.navy)}
          onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
        >
          Return Requests
        </button>
        <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Return Details</span>
      </div>

      {/* ── Overview Card ──────────────────────────────────────────────── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(99,102,241,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <RotateCcw size={20} strokeWidth={1.9} style={{ color: '#6366F1' }} />
          </div>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: C.navy, margin: 0 }}>Asset Return Request</h1>
            <p style={{ fontSize: 12.5, color: C.muted, margin: '2px 0 0', fontWeight: 500 }}>Track the status of your return request</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, paddingBottom: 24 }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Request ID</span>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{request.requestId}</div>
          </div>
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Status</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 6, background: st.bg, color: st.color, fontSize: 12, fontWeight: 600 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: st.dot }} />
              {request.status}
            </span>
          </div>
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Request Date</span>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{fmtDate(request.requestedDate)}</div>
          </div>
        </div>

        <div style={{ paddingTop: 20, borderTop: `1px solid ${C.border}`, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Asset Category</span>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{request.category}</div>
          </div>
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Asset Code</span>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.navy, fontFamily: 'monospace' }}>{request.assetCode}</div>
          </div>
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Asset Description</span>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{request.assetName}</div>
          </div>
        </div>

        <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Return Reason</span>
          <p style={{ fontSize: 13.5, color: C.navy, fontWeight: 500, margin: 0, lineHeight: 1.6, background: '#F9FAFB', padding: 14, borderRadius: 10, border: `1px solid ${C.border}` }}>
            {request.returnReason}
          </p>
        </div>
      </div>

      {/* ── Status Result ──────────────────────────────────────────────── */}
      {isPending ? (
        <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.28)', borderRadius: 16, padding: 24, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(245,158,11,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Clock size={20} strokeWidth={2} style={{ color: '#B45309' }} />
          </div>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#B45309', margin: 0 }}>Awaiting System Admin Approval</h2>
            <p style={{ fontSize: 12.5, color: '#B45309', opacity: 0.85, margin: '2px 0 0', fontWeight: 500 }}>Your return request has been submitted and is pending review by the System Admin.</p>
          </div>
        </div>
      ) : (
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: st.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Check size={20} strokeWidth={2.4} style={{ color: st.color }} />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: C.navy, margin: 0 }}>Return Accepted</h2>
              <p style={{ fontSize: 12.5, color: C.muted, margin: '2px 0 0', fontWeight: 500 }}>
                Accepted by {request.decisionBy || 'System Admin'} on {fmtDate(request.decisionDate)}
              </p>
            </div>
          </div>
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Admin Note</span>
            <p style={{ fontSize: 13.5, color: C.navy, fontWeight: 500, margin: 0, lineHeight: 1.6, background: st.bg, padding: 14, borderRadius: 10 }}>
              {request.decisionNote || '—'}
            </p>
          </div>
        </div>
      )}

      {/* ── History Timeline ───────────────────────────────────────────── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: 28 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 24 }}>Request History</h2>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 19, top: 14, width: 2, height: '100%', background: 'linear-gradient(to bottom, rgba(99,102,241,0.30), rgba(99,102,241,0.04))', borderRadius: 2 }} />

          {/* Step 1: Return Requested */}
          <div style={{ display: 'flex', gap: 20, marginBottom: 30, position: 'relative' }}>
            <div style={{ width: 40, flexShrink: 0, display: 'flex', justifyContent: 'center', paddingTop: 3 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', border: '2.5px solid #6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, position: 'relative' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366F1' }} />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Return Requested</h3>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 6, background: 'rgba(168,85,247,0.12)', color: '#6B21A8', fontSize: 11, fontWeight: 600 }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#A855F7' }} />
                  You
                </span>
              </div>
              <div style={{ background: '#F9FAFB', padding: 20, borderRadius: 12, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Requested By</span>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 4 }}>{request.employeeName}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{request.employeeCode}</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Request Date</span>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{fmtDate(request.requestedDate)}</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Asset</span>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{request.assetName}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2, fontFamily: 'monospace' }}>{request.assetCode}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Admin Review */}
          <div style={{ display: 'flex', gap: 20, position: 'relative' }}>
            <div style={{ width: 40, flexShrink: 0, display: 'flex', justifyContent: 'center', paddingTop: 3 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', border: `2.5px solid ${st.dot}`, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, position: 'relative' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: st.dot }} />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Admin Review</h3>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 6, background: st.bg, color: st.color, fontSize: 11, fontWeight: 600 }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: st.dot }} />
                  {request.status}
                </span>
              </div>
              {isPending ? (
                <div style={{ background: 'rgba(245,158,11,0.08)', padding: 24, borderRadius: 12, border: '2px solid rgba(245,158,11,0.24)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 72 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#B45309', marginBottom: 4 }}>⏳ Awaiting Admin Decision</div>
                    <div style={{ fontSize: 12, color: '#B45309', opacity: 0.8 }}>The System Admin has not yet reviewed this request</div>
                  </div>
                </div>
              ) : (
                <div style={{ background: '#F9FAFB', padding: 20, borderRadius: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Reviewed By</span>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{request.decisionBy || 'System Admin'}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{fmtDate(request.decisionDate)}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Admin Note</span>
                    <div style={{ fontSize: 13, fontWeight: 500, color: C.navy, lineHeight: 1.5 }}>{request.decisionNote || '—'}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
