import { useState } from 'react'
import {
  Search, Eye, CheckCircle, XCircle, X, CalendarX, CalendarCheck2,
  Clock, MessageSquare, User, Briefcase, Building2, FileText,
  AlertTriangle, DoorOpen, CalendarDays,
} from 'lucide-react'
import type { ElementType } from 'react'

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', surface: '#F7F8FC', indigo: '#6366F1' }

type ResignStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn'

interface ResignRow {
  id: number
  requestId: string
  employee: string
  avatar: number
  code: string
  designation: string
  department: string
  project: string
  reason: string
  detail: string
  comments?: string
  submittedISO: string
  noticePeriodDays: number
  requestedLwdISO: string
  confirmedLwdISO?: string
  status: ResignStatus
  managerRemarks?: string
  actionedOnISO?: string
}

/* ── Mock queue — Priya Sharma's team (matches the employee-side mock world) ── */
const RESIGN_ROWS: ResignRow[] = [
  {
    id: 1, requestId: 'RES-2026-482', employee: 'John Doe', avatar: 12, code: 'CC001',
    designation: 'Senior Software Engineer', department: 'Engineering', project: 'Pulse.AI v2',
    reason: 'Better Career Opportunity',
    detail: 'I have accepted an offer with a product company that lets me move into a technical architect track. It was a difficult decision — I have genuinely enjoyed my time on the Pulse.AI team. I will ensure a complete handover of the payments service before I leave.',
    comments: 'Happy to help interview and onboard my replacement during the notice period.',
    submittedISO: '2026-07-14', noticePeriodDays: 90, requestedLwdISO: '2026-10-12', status: 'pending',
  },
  {
    id: 3, requestId: 'RES-2026-489', employee: 'Rajesh Kumar', avatar: 33, code: 'CC003',
    designation: 'QA Engineer', department: 'Quality Assurance', project: 'HDFC Portal',
    reason: 'Relocation',
    detail: 'My family is relocating to another city for personal reasons and I am unable to continue in this role. I am requesting an earlier release than my full notice period if it can be accommodated.',
    comments: 'Requesting early release — happy to discuss a buyout of the remaining notice if needed.',
    submittedISO: '2026-07-25', noticePeriodDays: 30, requestedLwdISO: '2026-08-10', status: 'pending',
  },
  {
    id: 4, requestId: 'RES-2026-471', employee: 'Arjun Menon', avatar: 68, code: 'CC005',
    designation: 'Backend Developer', department: 'Engineering', project: 'TechCorp ERP',
    reason: 'Personal Reasons',
    detail: 'Stepping away for personal reasons. Thank you for the support over the last two years.',
    submittedISO: '2026-06-20', noticePeriodDays: 60, requestedLwdISO: '2026-08-19',
    confirmedLwdISO: '2026-08-19', status: 'accepted',
    managerRemarks: 'Accepted — thanks for the early heads-up, Arjun. Let’s map out the handover this week.',
    actionedOnISO: '2026-06-22',
  },
  {
    id: 5, requestId: 'RES-2026-478', employee: 'Meera Nair', avatar: 44, code: 'CC006',
    designation: 'UI/UX Designer', department: 'Design', project: 'Pulse.AI v2',
    reason: 'Compensation & Benefits',
    detail: 'Considering leaving over compensation concerns.',
    submittedISO: '2026-07-05', noticePeriodDays: 30, requestedLwdISO: '2026-08-04', status: 'rejected',
    managerRemarks: 'Discussed offline — a revised compensation package was agreed and Meera is staying. Resignation not processed.',
    actionedOnISO: '2026-07-08',
  },
  {
    id: 6, requestId: 'RES-2026-484', employee: 'Vikram Singh', avatar: 15, code: 'CC007',
    designation: 'DevOps Engineer', department: 'Infrastructure', project: 'HDFC Portal',
    reason: 'Better Career Opportunity',
    detail: 'Exploring another opportunity.',
    submittedISO: '2026-07-18', noticePeriodDays: 60, requestedLwdISO: '2026-09-16', status: 'withdrawn',
  },
]

const STATUS_CFG: Record<ResignStatus, { label: string; color: string; bg: string; border: string }> = {
  pending:   { label: 'Pending',   color: '#D97706', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.22)' },
  accepted:  { label: 'Accepted',  color: '#0A8A58', bg: 'rgba(14,168,106,0.10)', border: 'rgba(14,168,106,0.20)' },
  rejected:  { label: 'Rejected',  color: '#E84855', bg: 'rgba(232,72,85,0.09)',  border: 'rgba(232,72,85,0.18)'  },
  withdrawn: { label: 'Withdrawn', color: '#6B7192', bg: 'rgba(107,113,146,0.10)', border: 'rgba(107,113,146,0.20)' },
}

/* ── Date helpers ── */
function fmtDate(iso?: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
function addDays(iso: string, days: number) {
  const d = new Date(iso); d.setDate(d.getDate() + days); return d
}
function toInputValue(d: Date) { return d.toISOString().split('T')[0] }
function daysBetween(a: Date, b: Date) { return Math.round((b.getTime() - a.getTime()) / 86400000) }

/* Shortfall (days short of full notice) for a given chosen LWD */
function shortfallFor(row: ResignRow, chosenISO: string) {
  const requiredEnd = addDays(row.submittedISO, row.noticePeriodDays)
  const chosen = new Date(chosenISO)
  if (isNaN(chosen.getTime())) return 0
  return Math.max(0, daysBetween(chosen, requiredEnd))
}

const COLS = '1.7fr 1.3fr 1fr 0.85fr 1.05fr 0.95fr 1.15fr'

export default function ResignationRequestsPage() {
  const [rows, setRows]           = useState<ResignRow[]>(RESIGN_ROWS)
  const [search, setSearch]       = useState('')
  const [statusFilter, setStatus] = useState<ResignStatus | 'all'>('all')
  const [viewRow, setViewRow]     = useState<ResignRow | null>(null)
  const [action, setAction]       = useState<{ id: number; kind: 'accept' | 'reject'; lwd: string; remarks: string } | null>(null)
  const [showErr, setShowErr]     = useState(false)

  function openAction(id: number, kind: 'accept' | 'reject') {
    const row = rows.find(r => r.id === id)
    if (!row) return
    setViewRow(null)
    setShowErr(false)
    setAction({ id, kind, lwd: row.requestedLwdISO, remarks: '' })
  }

  function confirmAction() {
    if (!action) return
    const isReject = action.kind === 'reject'
    if (isReject && !action.remarks.trim()) { setShowErr(true); return }
    setRows(prev => prev.map(r => {
      if (r.id !== action.id) return r
      return isReject
        ? { ...r, status: 'rejected', managerRemarks: action.remarks.trim(), actionedOnISO: toInputValue(new Date()) }
        : { ...r, status: 'accepted', confirmedLwdISO: action.lwd, managerRemarks: action.remarks.trim() || undefined, actionedOnISO: toInputValue(new Date()) }
    }))
    setAction(null)
  }

  const filtered = rows.filter(r => {
    const q = search.trim().toLowerCase()
    const matchSearch = !q || r.employee.toLowerCase().includes(q) || r.code.toLowerCase().includes(q) || r.reason.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    return matchSearch && matchStatus
  })

  const pendingCount = rows.filter(r => r.status === 'pending').length
  const hasFilter = !!search || statusFilter !== 'all'

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-xl font-bold" style={{ color: C.navy }}>Resignation Requests</h1>
            {pendingCount > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(245,158,11,0.12)', color: '#D97706', border: '1px solid rgba(245,158,11,0.22)' }}>
                <Clock size={11} />
                {pendingCount} awaiting your review
              </span>
            )}
          </div>
          <p className="text-sm" style={{ color: C.muted }}>
            Review resignation requests from your team — accept and confirm the last working day, or reject.
          </p>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '14px 16px', marginBottom: 16 }}>
        <div className="flex items-center gap-3 flex-wrap">
          <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
            <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search employee, ID, or reason..."
              style={{ width: '100%', height: 38, paddingLeft: 34, paddingRight: 12, border: `1px solid ${C.border}`, borderRadius: 9, fontSize: 13, color: C.navy, background: '#fff', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => { e.target.style.borderColor = C.indigo }}
              onBlur={e => { e.target.style.borderColor = C.border }}
            />
          </div>

          <div style={{ position: 'relative', flexShrink: 0 }}>
            <select
              value={statusFilter}
              onChange={e => setStatus(e.target.value as ResignStatus | 'all')}
              style={{ height: 38, padding: '0 30px 0 12px', border: `1px solid ${C.border}`, borderRadius: 9, fontSize: 13, fontWeight: 500, color: statusFilter === 'all' ? C.muted : C.navy, background: '#fff', outline: 'none', cursor: 'pointer', appearance: 'none', fontFamily: 'inherit', minWidth: 140 }}
              onFocus={e => { e.target.style.borderColor = C.indigo }}
              onBlur={e => { e.target.style.borderColor = C.border }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
            <svg style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none', width: 12, height: 12 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
          </div>

          {hasFilter && (
            <button
              onClick={() => { setSearch(''); setStatus('all') }}
              style={{ height: 38, padding: '0 12px', borderRadius: 9, border: `1px solid ${C.border}`, background: '#fff', fontSize: 12.5, color: C.muted, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
            >Clear</button>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
        <div className="grid" style={{ gridTemplateColumns: COLS, padding: '12px 20px', background: C.surface, borderBottom: `1px solid ${C.border}` }}>
          {['Employee', 'Reason', 'Submitted', 'Notice', 'Requested LWD', 'Status', 'Action'].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: '#B0B4C8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center" style={{ minHeight: 200, gap: 10 }}>
            <div style={{ width: 46, height: 46, borderRadius: 13, background: C.hover, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DoorOpen size={20} strokeWidth={1.7} style={{ color: C.muted }} />
            </div>
            <p style={{ fontSize: 14, color: C.muted, fontWeight: 500 }}>No resignation requests match the selected filter</p>
          </div>
        ) : (
          filtered.map((row, idx) => {
            const st = STATUS_CFG[row.status]
            const isPending = row.status === 'pending'
            const lwdToShow = row.confirmedLwdISO ?? row.requestedLwdISO
            const isEarly = shortfallFor(row, row.requestedLwdISO) > 0
            return (
              <div
                key={row.id}
                className="grid items-center"
                style={{ gridTemplateColumns: COLS, padding: '15px 20px', borderBottom: idx < filtered.length - 1 ? `1px solid #F0F2F8` : 'none', background: '#fff', transition: 'background 0.12s' }}
                onMouseEnter={e => { e.currentTarget.style.background = C.surface }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
              >
                {/* Employee */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={`https://i.pravatar.cc/150?img=${row.avatar}`} alt={row.employee} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `2px solid ${C.border}` }} />
                  <div className="min-w-0">
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.employee}</div>
                    <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.code} · {row.designation}</div>
                  </div>
                </div>

                {/* Reason */}
                <span style={{ fontSize: 12.5, color: '#5A6080', fontWeight: 500, paddingRight: 10 }}>{row.reason}</span>

                {/* Submitted */}
                <span style={{ fontSize: 12.5, color: '#5A6080', fontWeight: 500 }}>{fmtDate(row.submittedISO)}</span>

                {/* Notice */}
                <span style={{ fontSize: 12.5, color: '#5A6080', fontWeight: 600 }}>{row.noticePeriodDays}d</span>

                {/* Requested LWD */}
                <div style={{ minWidth: 0 }}>
                  <span style={{ fontSize: 12.5, color: C.navy, fontWeight: 600 }}>{fmtDate(lwdToShow)}</span>
                  {isEarly && (
                    <span title="Requested before full notice period" style={{ display: 'inline-flex', alignItems: 'center', gap: 3, marginLeft: 6, fontSize: 10, fontWeight: 700, color: '#B45309', background: 'rgba(245,158,11,0.12)', borderRadius: 5, padding: '1px 5px' }}>
                      <AlertTriangle size={9} strokeWidth={2.2} /> Early
                    </span>
                  )}
                </div>

                {/* Status */}
                <span style={{ fontSize: 11.5, fontWeight: 700, padding: '4px 9px', borderRadius: 7, background: st.bg, color: st.color, border: `1px solid ${st.border}`, whiteSpace: 'nowrap', width: 'fit-content' }}>{st.label}</span>

                {/* Action */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setViewRow(row)}
                    title="View Details"
                    style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: 'rgba(99,102,241,0.09)', color: '#4B4ECC', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.14s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.18)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.09)' }}
                  >
                    <Eye size={14} strokeWidth={1.8} />
                  </button>
                  {isPending && (
                    <>
                      <button
                        onClick={() => openAction(row.id, 'accept')}
                        title="Accept & Confirm LWD"
                        style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: 'rgba(14,168,106,0.10)', color: '#0A8A58', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(14,168,106,0.22)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(14,168,106,0.10)' }}
                      >
                        <CheckCircle size={15} strokeWidth={1.8} />
                      </button>
                      <button
                        onClick={() => openAction(row.id, 'reject')}
                        title="Reject"
                        style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: 'rgba(232,72,85,0.09)', color: '#E84855', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.18)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.09)' }}
                      >
                        <XCircle size={15} strokeWidth={1.8} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })
        )}

        <div style={{ padding: '13px 20px', borderTop: `1px solid ${C.border}`, background: C.surface }}>
          <span style={{ fontSize: 12, color: C.muted }}>
            Showing <strong style={{ color: C.navy }}>{filtered.length}</strong> of {rows.length} requests
          </span>
        </div>
      </div>

      {/* ── Detail modal ── */}
      {viewRow && (
        <DetailModal
          row={rows.find(r => r.id === viewRow.id) ?? viewRow}
          onClose={() => setViewRow(null)}
          onAccept={() => openAction(viewRow.id, 'accept')}
          onReject={() => openAction(viewRow.id, 'reject')}
        />
      )}

      {/* ── Accept / Reject modal ── */}
      {action && (() => {
        const row = rows.find(r => r.id === action.id)!
        return (
          <ActionModal
            row={row}
            kind={action.kind}
            lwd={action.lwd}
            remarks={action.remarks}
            showErr={showErr}
            onLwd={v => setAction(a => a ? { ...a, lwd: v } : a)}
            onRemarks={v => setAction(a => a ? { ...a, remarks: v } : a)}
            onCancel={() => setAction(null)}
            onConfirm={confirmAction}
          />
        )
      })()}
    </div>
  )
}

/* ══════════════════════ Detail modal ══════════════════════ */
function DetailModal({ row, onClose, onAccept, onReject }: {
  row: ResignRow; onClose: () => void; onAccept: () => void; onReject: () => void
}) {
  const st = STATUS_CFG[row.status]
  const isPending = row.status === 'pending'
  const isEarly = shortfallFor(row, row.requestedLwdISO) > 0
  const shortfall = shortfallFor(row, row.requestedLwdISO)

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.50)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif", padding: 20 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ background: '#fff', borderRadius: 22, width: '100%', maxWidth: 540, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 32px 80px rgba(10,12,28,0.22)' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.navy }}>Resignation Request</div>
            <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>Request ID {row.requestId}</div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: C.hover, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted }}
            onMouseEnter={e => { e.currentTarget.style.background = '#E4E6EF'; e.currentTarget.style.color = C.navy }}
            onMouseLeave={e => { e.currentTarget.style.background = C.hover; e.currentTarget.style.color = C.muted }}>
            <X size={14} strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '0 24px' }}>
          {/* Employee block */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 0 16px', borderBottom: `1px solid ${C.border}` }}>
            <img src={`https://i.pravatar.cc/150?img=${row.avatar}`} alt={row.employee} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '3px solid #F0F2F8', boxShadow: '0 2px 8px rgba(28,32,53,0.10)' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: C.navy, marginBottom: 3 }}>{row.employee}</div>
              <div style={{ fontSize: 12.5, color: C.muted }}>{row.code} · {row.designation}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 9 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, padding: '3px 10px', borderRadius: 6, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>{st.label}</span>
                {isEarly && (
                  <span style={{ fontSize: 11.5, fontWeight: 700, padding: '3px 10px', borderRadius: 6, background: 'rgba(245,158,11,0.12)', color: '#B45309', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <AlertTriangle size={11} strokeWidth={2} /> Early release · {shortfall}d short
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', borderBottom: `1px solid ${C.border}` }}>
            {[
              { icon: Building2,      label: 'Department',    value: row.department },
              { icon: Briefcase,      label: 'Project',       value: row.project },
              { icon: FileText,       label: 'Reason',        value: row.reason },
              { icon: CalendarDays,   label: 'Submitted On',  value: fmtDate(row.submittedISO) },
              { icon: Clock,          label: 'Notice Period', value: `${row.noticePeriodDays} days` },
              { icon: CalendarX,      label: 'Requested LWD', value: fmtDate(row.requestedLwdISO) },
            ].map((item, i) => (
              <div key={item.label} style={{ padding: '13px 0', borderRight: i % 2 === 0 ? `1px solid ${C.border}` : 'none', borderBottom: i < 4 ? `1px solid ${C.border}` : 'none', paddingLeft: i % 2 === 0 ? 0 : 20, paddingRight: i % 2 === 0 ? 20 : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <item.icon size={12} style={{ color: C.muted }} strokeWidth={1.8} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</span>
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Confirmed LWD (accepted) */}
          {row.status === 'accepted' && row.confirmedLwdISO && (
            <div style={{ margin: '16px 0 0', padding: '12px 14px', borderRadius: 10, background: 'rgba(14,168,106,0.06)', border: '1px solid rgba(14,168,106,0.20)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <CalendarCheck2 size={16} strokeWidth={1.9} style={{ color: '#0A8A58', flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: '#064E3B', fontWeight: 600 }}>
                Confirmed Last Working Day: <strong>{fmtDate(row.confirmedLwdISO)}</strong>
              </span>
            </div>
          )}

          {/* Reason detail */}
          <div style={{ padding: '16px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <MessageSquare size={13} style={{ color: C.muted }} strokeWidth={1.8} />
              <span style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Employee’s Note</span>
            </div>
            <p style={{ fontSize: 13.5, color: '#3D4266', lineHeight: 1.75, margin: 0, background: C.surface, borderRadius: 10, padding: '12px 14px', border: `1px solid ${C.border}` }}>{row.detail}</p>
            {row.comments && (
              <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.7, margin: '10px 0 0', fontStyle: 'italic' }}>“{row.comments}”</p>
            )}
          </div>

          {/* Manager remarks */}
          {!isPending && row.managerRemarks && (
            <div style={{ padding: '0 0 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <User size={13} style={{ color: row.status === 'rejected' ? '#E84855' : '#0A8A58' }} strokeWidth={1.8} />
                <span style={{ fontSize: 11.5, fontWeight: 700, color: row.status === 'rejected' ? '#E84855' : '#0A8A58', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Your Remarks</span>
              </div>
              <p style={{ fontSize: 13.5, lineHeight: 1.75, margin: 0, borderRadius: 10, padding: '12px 14px', fontStyle: 'italic',
                color: row.status === 'rejected' ? '#7A1515' : '#064E3B',
                background: row.status === 'rejected' ? 'rgba(232,72,85,0.05)' : 'rgba(14,168,106,0.06)',
                border: `1px solid ${row.status === 'rejected' ? 'rgba(232,72,85,0.15)' : 'rgba(14,168,106,0.18)'}` }}>
                “{row.managerRemarks}”
              </p>
            </div>
          )}
          <div style={{ height: 8 }} />
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 24px 20px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 10, flexShrink: 0 }}>
          {isPending ? (
            <>
              <button onClick={onClose} style={{ flex: 1, height: 44, borderRadius: 12, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}>Close</button>
              <button onClick={onReject} style={{ flex: 1, height: 44, borderRadius: 12, border: 'none', background: 'rgba(232,72,85,0.09)', color: '#E84855', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.18)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.09)' }}><XCircle size={15} strokeWidth={1.8} /> Reject</button>
              <button onClick={onAccept} style={{ flex: 1.5, height: 44, borderRadius: 12, border: 'none', background: '#0EA86A', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
                onMouseEnter={e => { e.currentTarget.style.background = '#0A8A58' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#0EA86A' }}><CheckCircle size={15} strokeWidth={1.8} /> Accept &amp; Confirm LWD</button>
            </>
          ) : (
            <button onClick={onClose} style={{ flex: 1, height: 44, borderRadius: 12, border: `1px solid ${C.border}`, background: '#fff', color: C.navy, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              onMouseEnter={e => { e.currentTarget.style.background = C.surface }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}>Close</button>
          )}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════ Accept / Reject modal ══════════════════════ */
function ActionModal({ row, kind, lwd, remarks, showErr, onLwd, onRemarks, onCancel, onConfirm }: {
  row: ResignRow; kind: 'accept' | 'reject'; lwd: string; remarks: string; showErr: boolean
  onLwd: (v: string) => void; onRemarks: (v: string) => void; onCancel: () => void; onConfirm: () => void
}) {
  const isAccept = kind === 'accept'
  const accent = isAccept ? '#0EA86A' : '#E84855'
  const accentDark = isAccept ? '#0A8A58' : '#D43F4B'
  const accentBg = isAccept ? 'rgba(14,168,106,0.12)' : 'rgba(232,72,85,0.10)'
  const ModalIcon: ElementType = isAccept ? CheckCircle : XCircle
  const shortfall = isAccept ? shortfallFor(row, lwd) : 0
  const changed = isAccept && lwd !== row.requestedLwdISO

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(10,12,28,0.50)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif", padding: 20 }}
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '28px 26px 22px', width: 460, maxWidth: '100%', boxShadow: '0 24px 64px rgba(10,12,28,0.22)' }}>
        {/* Header */}
        <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
          <div className="flex items-center gap-3">
            <div style={{ width: 44, height: 44, borderRadius: 13, flexShrink: 0, background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ModalIcon size={21} strokeWidth={1.8} style={{ color: accentDark }} />
            </div>
            <div>
              <div style={{ fontSize: 16.5, fontWeight: 700, color: C.navy }}>{isAccept ? 'Accept Resignation' : 'Reject Resignation'}</div>
              <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>{row.employee} · {row.code}</div>
            </div>
          </div>
          <button onClick={onCancel} style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: C.hover, color: C.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#E4E6EF'; e.currentTarget.style.color = C.navy }}
            onMouseLeave={e => { e.currentTarget.style.background = C.hover; e.currentTarget.style.color = C.muted }}>
            <X size={14} strokeWidth={2} />
          </button>
        </div>

        {isAccept ? (
          <>
            {/* LWD confirm / negotiate */}
            <label style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 7 }}>
              Confirm Last Working Day
            </label>
            <input
              type="date"
              value={lwd}
              min={row.submittedISO}
              onChange={e => onLwd(e.target.value)}
              style={{ width: '100%', height: 42, padding: '0 12px', border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 13.5, color: C.navy, background: '#fff', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', cursor: 'pointer' }}
              onFocus={e => { e.target.style.borderColor = C.indigo }}
              onBlur={e => { e.target.style.borderColor = C.border }}
            />
            <div style={{ display: 'flex', gap: 14, marginTop: 8, fontSize: 12, color: C.muted, fontWeight: 500 }}>
              <span>Employee requested <strong style={{ color: C.navy }}>{fmtDate(row.requestedLwdISO)}</strong></span>
              {changed && <span style={{ color: C.indigo, fontWeight: 600 }}>· date adjusted</span>}
            </div>

            {shortfall > 0 && (
              <div style={{ marginTop: 12, padding: '11px 13px', borderRadius: 10, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.28)', display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                <AlertTriangle size={15} strokeWidth={2} style={{ color: '#B45309', flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 12, color: '#B45309', fontWeight: 500, margin: 0, lineHeight: 1.55 }}>
                  This date is <strong>{shortfall} day{shortfall !== 1 ? 's' : ''}</strong> short of the full {row.noticePeriodDays}-day notice. The shortfall may be recovered or waived in the Full &amp; Final settlement.
                </p>
              </div>
            )}

            <label style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', margin: '18px 0 7px' }}>
              Remarks <span style={{ textTransform: 'none', fontWeight: 500 }}>(optional)</span>
            </label>
            <textarea
              value={remarks}
              onChange={e => onRemarks(e.target.value)}
              placeholder="Add a note for the employee and HR…"
              rows={3}
              style={{ width: '100%', padding: '10px 12px', border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 13, color: C.navy, background: C.hover, outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              onFocus={e => { e.target.style.borderColor = C.indigo; e.target.style.background = '#fff' }}
              onBlur={e => { e.target.style.borderColor = C.border; e.target.style.background = C.hover }}
            />
            <p style={{ fontSize: 11.5, color: C.muted, margin: '10px 0 0', lineHeight: 1.55 }}>
              On accept, the notice period starts and the case moves to HR to open the clearance checklist.
            </p>
          </>
        ) : (
          <>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 7 }}>
              Reason for rejection <span style={{ color: '#E84855' }}>*</span>
            </label>
            <textarea
              value={remarks}
              onChange={e => onRemarks(e.target.value)}
              placeholder="Explain why this resignation is being rejected or sent back…"
              rows={4}
              style={{ width: '100%', padding: '10px 12px', border: `1px solid ${showErr && !remarks.trim() ? '#E84855' : C.border}`, borderRadius: 10, fontSize: 13, color: C.navy, background: C.hover, outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              onFocus={e => { e.target.style.borderColor = C.indigo; e.target.style.background = '#fff' }}
              onBlur={e => { e.target.style.borderColor = showErr && !remarks.trim() ? '#E84855' : C.border; e.target.style.background = C.hover }}
            />
            {showErr && !remarks.trim() && <p style={{ fontSize: 11.5, color: '#E84855', fontWeight: 600, margin: '6px 0 0' }}>Please provide a reason for the rejection.</p>}
          </>
        )}

        {/* Footer */}
        <div className="flex gap-2.5" style={{ marginTop: 22 }}>
          <button onClick={onCancel} style={{ flex: 1, height: 44, borderRadius: 12, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex: 1.4, height: 44, borderRadius: 12, border: 'none', background: accent, color: '#fff', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
            onMouseEnter={e => { e.currentTarget.style.background = accentDark }}
            onMouseLeave={e => { e.currentTarget.style.background = accent }}>
            <ModalIcon size={15} strokeWidth={1.9} /> {isAccept ? 'Confirm & Accept' : 'Confirm Reject'}
          </button>
        </div>
      </div>
    </div>
  )
}
