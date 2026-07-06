import { useState } from 'react'
import { ArrowLeft, Check, X, RotateCcw } from 'lucide-react'

export interface ReturnRequest {
  id: string
  requestId: string
  employeeName: string
  employeeCode: string
  employeeRole?: string
  raisedByName: string
  raisedByCode: string
  raisedByRole?: string
  raisedByType: 'Employee' | 'Manager'
  category: string
  assetName: string
  assetCode: string
  returnReason: string
  requestedDate: string
  status: 'Pending' | 'Approved' | 'Rejected'
  decisionNote?: string
  decisionDate?: string
  decisionBy?: string
}

interface AdminAssetReturnDetailsPageProps {
  request: ReturnRequest
  onBack?: () => void
  onDecision?: (id: string, decision: 'Approved' | 'Rejected', note: string) => void
}

const C = {
  navy: '#1C2035',
  muted: '#8B90A7',
  border: '#E4E6EF',
  bg: '#F0F2F8',
}

const STATUS_STYLES: Record<ReturnRequest['status'], { bg: string; color: string; dot: string }> = {
  Pending: { bg: 'rgba(245,158,11,0.10)', color: '#B45309', dot: '#F59E0B' },
  Approved: { bg: 'rgba(14,168,106,0.12)', color: '#0A7040', dot: '#0EA86A' },
  Rejected: { bg: 'rgba(232,72,85,0.10)', color: '#C0202E', dot: '#E84855' },
}

const RAISED_BY_STYLES = {
  Manager: { bg: 'rgba(59,130,246,0.12)', color: '#1E40AF', dot: '#3B82F6' },
  Employee: { bg: 'rgba(168,85,247,0.12)', color: '#6B21A8', dot: '#A855F7' },
}

function fmtDate(d?: string) {
  if (!d) return '—'
  const parsed = new Date(d)
  if (isNaN(parsed.getTime())) return d
  return parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function AdminAssetReturnDetailsPage({ request, onBack, onDecision }: AdminAssetReturnDetailsPageProps) {
  const [choice, setChoice] = useState<'Approved' | 'Rejected' | null>(null)
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const st = STATUS_STYLES[request.status]
  const raisedByStyle = RAISED_BY_STYLES[request.raisedByType]
  const isPending = request.status === 'Pending'

  const approveActive = choice === 'Approved'
  const rejectActive = choice === 'Rejected'
  const accent = rejectActive ? '#E84855' : '#0EA86A'

  const handleSubmit = async () => {
    if (!choice || !note.trim() || submitting) return
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSubmitting(false)
    onDecision?.(request.id, choice, note.trim())
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <style>{`@keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} } @keyframes fadeIn { from{opacity:0} to{opacity:1} }`}</style>

      {/* ── Breadcrumb + top-right actions ─────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
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
            Asset Return Requests
          </button>
          <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Return Details</span>
        </div>

        {/* Top-right decision actions (pending only) */}
        {isPending && (
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <button
              onClick={() => setChoice('Approved')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8,
                border: 'none', color: '#fff', background: '#0EA86A', cursor: 'pointer', fontFamily: 'inherit',
                fontSize: 12.5, fontWeight: 700, transition: 'all 0.15s',
                opacity: choice && !approveActive ? 0.45 : 1,
                boxShadow: approveActive ? '0 0 0 3px rgba(14,168,106,0.25)' : 'none',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#0A8A58' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#0EA86A' }}
            >
              <Check size={15} strokeWidth={2.4} /> Approve
            </button>
            <button
              onClick={() => setChoice('Rejected')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8,
                border: 'none', color: '#fff', background: '#E84855', cursor: 'pointer', fontFamily: 'inherit',
                fontSize: 12.5, fontWeight: 700, transition: 'all 0.15s',
                opacity: choice && !rejectActive ? 0.45 : 1,
                boxShadow: rejectActive ? '0 0 0 3px rgba(232,72,85,0.22)' : 'none',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#D43F4B' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#E84855' }}
            >
              <X size={15} strokeWidth={2.4} /> Reject
            </button>
          </div>
        )}
      </div>

      {/* ── Return Overview Card ───────────────────────────────────────── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: 28 }}>
        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(99,102,241,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <RotateCcw size={20} strokeWidth={1.9} style={{ color: '#6366F1' }} />
          </div>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: C.navy, margin: 0 }}>Asset Return Request</h1>
            <p style={{ fontSize: 12.5, color: C.muted, margin: '2px 0 0', fontWeight: 500 }}>Review and take action on this return request</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 24, paddingBottom: 24 }}>
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
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Requested By</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 6, background: raisedByStyle.bg, color: raisedByStyle.color, fontSize: 12, fontWeight: 600 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: raisedByStyle.dot }} />
              {request.raisedByType}
            </span>
          </div>
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Request Date</span>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{fmtDate(request.requestedDate)}</div>
          </div>
        </div>

        {/* Employee + Asset details */}
        <div style={{ paddingTop: 20, borderTop: `1px solid ${C.border}`, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 24 }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Employee</span>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{request.employeeName}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{request.employeeRole ? `${request.employeeRole} • ` : ''}{request.employeeCode}</div>
          </div>
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

        {/* Return reason */}
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Return Reason</span>
          <p style={{ fontSize: 13.5, color: C.navy, fontWeight: 500, margin: 0, lineHeight: 1.6, background: '#F9FAFB', padding: 14, borderRadius: 10, border: `1px solid ${C.border}` }}>
            {request.returnReason}
          </p>
        </div>
      </div>

      {/* ── Decision Result (after admin acts) ─────────────────────────── */}
      {!isPending && (
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: st.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {request.status === 'Approved'
                ? <Check size={20} strokeWidth={2.4} style={{ color: st.color }} />
                : <X size={20} strokeWidth={2.4} style={{ color: st.color }} />}
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: C.navy, margin: 0 }}>
                Return {request.status}
              </h2>
              <p style={{ fontSize: 12.5, color: C.muted, margin: '2px 0 0', fontWeight: 500 }}>
                Decision made by {request.decisionBy || 'System Admin'} on {fmtDate(request.decisionDate)}
              </p>
            </div>
          </div>
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
              {request.status === 'Approved' ? 'Approval Note' : 'Rejection Reason'}
            </span>
            <p style={{ fontSize: 13.5, color: C.navy, fontWeight: 500, margin: 0, lineHeight: 1.6, background: st.bg, padding: 14, borderRadius: 10 }}>
              {request.decisionNote || '—'}
            </p>
          </div>
        </div>
      )}

      {/* ── Request History Timeline ───────────────────────────────────── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: 28 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 24 }}>Request History</h2>
        <div style={{ position: 'relative' }}>
          {/* connector */}
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
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 6, background: raisedByStyle.bg, color: raisedByStyle.color, fontSize: 11, fontWeight: 600 }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: raisedByStyle.dot }} />
                  {request.raisedByType}
                </span>
              </div>
              <div style={{ background: '#F9FAFB', padding: 20, borderRadius: 12, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Raised By</span>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 4 }}>{request.raisedByName}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{request.raisedByRole ? `${request.raisedByRole} • ` : ''}{request.raisedByCode}</div>
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
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', border: `2.5px solid ${isPending ? '#F59E0B' : st.dot}`, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, position: 'relative' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: isPending ? '#F59E0B' : st.dot }} />
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
                    <div style={{ fontSize: 12, color: '#B45309', opacity: 0.8 }}>Approve or reject this return request above</div>
                  </div>
                </div>
              ) : (
                <div style={{ background: '#F9FAFB', padding: 20, borderRadius: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Decision By</span>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{request.decisionBy || 'System Admin'}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{fmtDate(request.decisionDate)}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>{request.status === 'Approved' ? 'Approval Note' : 'Rejection Reason'}</span>
                    <div style={{ fontSize: 13, fontWeight: 500, color: C.navy, lineHeight: 1.5 }}>{request.decisionNote || '—'}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Approve / Reject Popup ─────────────────────────────────────── */}
      {choice && isPending && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.52)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={(e) => { if (e.target === e.currentTarget && !submitting) { setChoice(null); setNote('') } }}
        >
          <div
            style={{ background: '#fff', borderRadius: 16, width: 480, maxWidth: '92%', boxShadow: '0 28px 72px rgba(10,12,28,0.22)', overflow: 'hidden' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: approveActive ? 'rgba(14,168,106,0.12)' : 'rgba(232,72,85,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {approveActive ? <Check size={18} strokeWidth={2.4} style={{ color: '#0A7040' }} /> : <X size={18} strokeWidth={2.4} style={{ color: '#C0202E' }} />}
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: C.navy, margin: 0 }}>{approveActive ? 'Approve Return' : 'Reject Return'}</h2>
                <p style={{ fontSize: 12, color: C.muted, margin: '2px 0 0' }}>{request.requestId} • {request.assetCode}</p>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: 24 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>
                {approveActive ? 'Approval Note' : 'Rejection Reason'}
              </label>
              <textarea
                autoFocus
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={approveActive ? 'Enter an approval note for this return...' : 'Enter the reason for rejecting this return...'}
                rows={4}
                style={{
                  width: '100%', padding: 14, fontSize: 13, color: C.navy,
                  border: `1px solid ${C.border}`, borderRadius: 10, background: '#F9FAFB',
                  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', resize: 'vertical',
                  transition: 'border-color 0.15s, background 0.15s',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.background = '#fff' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = '#F9FAFB' }}
              />
            </div>

            {/* Footer */}
            <div style={{ padding: '14px 24px', borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button
                onClick={() => { setChoice(null); setNote('') }}
                disabled={submitting}
                style={{ padding: '10px 20px', fontSize: 13, fontWeight: 600, color: C.navy, background: '#F0F2F8', border: 'none', borderRadius: 10, cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
                onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.background = '#E4E6EF' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#F0F2F8' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!note.trim() || submitting}
                style={{
                  padding: '10px 24px', fontSize: 13, fontWeight: 700, color: '#fff',
                  background: !note.trim() || submitting ? '#C0C4D6' : accent,
                  border: 'none', borderRadius: 10, cursor: !note.trim() || submitting ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.15s',
                }}
              >
                {submitting ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.75s linear infinite' }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>{approveActive ? 'Submit Approval' : 'Submit Rejection'}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
