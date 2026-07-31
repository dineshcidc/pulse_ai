import { useState } from 'react'
import {
  Search, Eye, CheckCircle, X, Clock, CalendarCheck2, PauseCircle,
  AlertTriangle, ShieldCheck, MessageSquare, DoorOpen, UserCheck, Building2, Briefcase,
} from 'lucide-react'
import type { ElementType } from 'react'

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', surface: '#F7F8FC', indigo: '#6366F1' }

type ClearStatus = 'pending' | 'cleared' | 'hold'

interface ClearRow {
  id: number
  employee: string
  avatar: number
  code: string
  designation: string
  department: string
  project: string
  reason: string
  lwdISO: string
  status: ClearStatus
  remarks?: string
  actionedOnISO?: string
}

/* ── Manager Clearance queue — team members in their notice period ── */
const CLEAR_ROWS: ClearRow[] = [
  {
    id: 1, employee: 'John Doe', avatar: 12, code: 'CC001',
    designation: 'Senior Software Engineer', department: 'Engineering', project: 'Pulse.AI v2',
    reason: 'Better Career Opportunity', lwdISO: '2026-10-15', status: 'pending',
  },
  {
    id: 3, employee: 'Rajesh Kumar', avatar: 33, code: 'CC003',
    designation: 'QA Engineer', department: 'Quality Assurance', project: 'HDFC Portal',
    reason: 'Relocation', lwdISO: '2026-08-24', status: 'hold',
    remarks: 'Test-automation suite handover to the QA team is still pending. Holding clearance until it’s completed.',
    actionedOnISO: '2026-07-28',
  },
  {
    id: 4, employee: 'Arjun Menon', avatar: 68, code: 'CC005',
    designation: 'Backend Developer', department: 'Engineering', project: 'TechCorp ERP',
    reason: 'Personal Reasons', lwdISO: '2026-08-19', status: 'cleared',
    remarks: 'All payment-service work wrapped up and handed over. Cleared from my side — thanks Arjun!',
    actionedOnISO: '2026-08-12',
  },
]

const STATUS_CFG: Record<ClearStatus, { label: string; color: string; bg: string; border: string }> = {
  pending: { label: 'Pending',  color: '#D97706', bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.22)'  },
  cleared: { label: 'Cleared',  color: '#0A8A58', bg: 'rgba(14,168,106,0.10)',  border: 'rgba(14,168,106,0.20)'  },
  hold:    { label: 'On Hold',  color: '#6B7192', bg: 'rgba(107,113,146,0.10)', border: 'rgba(107,113,146,0.22)' },
}

/* The team-side sign-off items the manager confirms before clearing. */
const CONFIRM_ITEMS = [
  'All pending work / deliverables are completed or reassigned',
  'Handover to the team is complete (over email)',
  'No team-side dues, access, or items to reclaim from my side',
]

function fmtDate(iso?: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
function toInputValue(d: Date) { return d.toISOString().split('T')[0] }
function daysBetween(a: Date, b: Date) { return Math.round((b.getTime() - a.getTime()) / 86400000) }

const COLS = '1.9fr 1.1fr 0.9fr 1fr 1.15fr'

export default function ManagerClearancePage() {
  const [rows, setRows]           = useState<ClearRow[]>(CLEAR_ROWS)
  const [search, setSearch]       = useState('')
  const [statusFilter, setStatus] = useState<ClearStatus | 'all'>('all')
  const [viewRow, setViewRow]     = useState<ClearRow | null>(null)
  const [action, setAction]       = useState<{ id: number; kind: 'clear' | 'hold'; checks: boolean[]; remarks: string } | null>(null)
  const [showErr, setShowErr]     = useState(false)

  function openAction(id: number, kind: 'clear' | 'hold') {
    setViewRow(null)
    setShowErr(false)
    setAction({ id, kind, checks: [false, false, false], remarks: '' })
  }

  function confirmAction() {
    if (!action) return
    if (action.kind === 'clear' && !action.checks.every(Boolean)) { setShowErr(true); return }
    if (action.kind === 'hold' && !action.remarks.trim()) { setShowErr(true); return }
    setRows(prev => prev.map(r => {
      if (r.id !== action.id) return r
      return action.kind === 'clear'
        ? { ...r, status: 'cleared', remarks: action.remarks.trim() || 'Cleared from the manager’s side.', actionedOnISO: toInputValue(new Date()) }
        : { ...r, status: 'hold', remarks: action.remarks.trim(), actionedOnISO: toInputValue(new Date()) }
    }))
    setAction(null)
  }

  const filtered = rows.filter(r => {
    const q = search.trim().toLowerCase()
    const matchSearch = !q || r.employee.toLowerCase().includes(q) || r.code.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    return matchSearch && matchStatus
  })

  const pendingCount = rows.filter(r => r.status === 'pending').length
  const hasFilter = !!search || statusFilter !== 'all'
  const today = new Date()

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-xl font-bold" style={{ color: C.navy }}>Manager Clearance</h1>
            {pendingCount > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(245,158,11,0.12)', color: '#D97706', border: '1px solid rgba(245,158,11,0.22)' }}>
                <Clock size={11} />
                {pendingCount} awaiting clearance
              </span>
            )}
          </div>
          <p className="text-sm" style={{ color: C.muted }}>
            Give your final team-side sign-off for members in their notice period — or put it on hold if something’s still open.
          </p>
        </div>
      </div>

      {/* Info banner */}
      <div style={{ display: 'flex', gap: 13, background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.20)', borderRadius: 12, padding: '13px 16px', marginBottom: 16 }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(99,102,241,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ShieldCheck size={17} strokeWidth={1.9} style={{ color: C.indigo }} />
        </div>
        <p style={{ fontSize: 12.5, color: '#5A6080', fontWeight: 500, margin: 0, lineHeight: 1.55 }}>
          <strong style={{ color: C.navy }}>Manager Clearance is your team-side gate.</strong> Give it once the member has wrapped up their work — usually close to their last working day. Once cleared, HR can complete the remaining clearances and final settlement.
        </p>
      </div>

      {/* Filter bar */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '14px 16px', marginBottom: 16 }}>
        <div className="flex items-center gap-3 flex-wrap">
          <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
            <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search employee or ID..."
              style={{ width: '100%', height: 38, paddingLeft: 34, paddingRight: 12, border: `1px solid ${C.border}`, borderRadius: 9, fontSize: 13, color: C.navy, background: '#fff', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => { e.target.style.borderColor = C.indigo }}
              onBlur={e => { e.target.style.borderColor = C.border }}
            />
          </div>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <select
              value={statusFilter}
              onChange={e => setStatus(e.target.value as ClearStatus | 'all')}
              style={{ height: 38, padding: '0 30px 0 12px', border: `1px solid ${C.border}`, borderRadius: 9, fontSize: 13, fontWeight: 500, color: statusFilter === 'all' ? C.muted : C.navy, background: '#fff', outline: 'none', cursor: 'pointer', appearance: 'none', fontFamily: 'inherit', minWidth: 140 }}
              onFocus={e => { e.target.style.borderColor = C.indigo }}
              onBlur={e => { e.target.style.borderColor = C.border }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="cleared">Cleared</option>
              <option value="hold">On Hold</option>
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

      {/* Table */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
        <div className="grid" style={{ gridTemplateColumns: COLS, padding: '12px 20px', background: C.surface, borderBottom: `1px solid ${C.border}` }}>
          {['Employee', 'Last Working Day', 'Days Left', 'Status', 'Action'].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: '#B0B4C8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center" style={{ minHeight: 200, gap: 10 }}>
            <div style={{ width: 46, height: 46, borderRadius: 13, background: C.hover, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DoorOpen size={20} strokeWidth={1.7} style={{ color: C.muted }} />
            </div>
            <p style={{ fontSize: 14, color: C.muted, fontWeight: 500 }}>No team members match the selected filter</p>
          </div>
        ) : (
          filtered.map((row, idx) => {
            const st = STATUS_CFG[row.status]
            const isPending = row.status === 'pending'
            const daysLeft = Math.max(0, daysBetween(today, new Date(row.lwdISO)))
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

                {/* LWD */}
                <span style={{ fontSize: 12.5, color: C.navy, fontWeight: 600 }}>{fmtDate(row.lwdISO)}</span>

                {/* Days left */}
                <span style={{ fontSize: 12.5, color: daysLeft <= 7 ? '#B45309' : '#5A6080', fontWeight: 600 }}>{daysLeft}d</span>

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
                        onClick={() => openAction(row.id, 'clear')}
                        title="Give Clearance"
                        style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: 'rgba(14,168,106,0.10)', color: '#0A8A58', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(14,168,106,0.22)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(14,168,106,0.10)' }}
                      >
                        <CheckCircle size={15} strokeWidth={1.8} />
                      </button>
                      <button
                        onClick={() => openAction(row.id, 'hold')}
                        title="Put On Hold"
                        style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: 'rgba(107,113,146,0.12)', color: '#6B7192', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(107,113,146,0.22)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(107,113,146,0.12)' }}
                      >
                        <PauseCircle size={15} strokeWidth={1.8} />
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
            Showing <strong style={{ color: C.navy }}>{filtered.length}</strong> of {rows.length} team members
          </span>
        </div>
      </div>

      {/* Detail modal */}
      {viewRow && (
        <DetailModal
          row={rows.find(r => r.id === viewRow.id) ?? viewRow}
          onClose={() => setViewRow(null)}
          onClear={() => openAction(viewRow.id, 'clear')}
          onHold={() => openAction(viewRow.id, 'hold')}
        />
      )}

      {/* Action modal */}
      {action && (() => {
        const row = rows.find(r => r.id === action.id)!
        return (
          <ActionModal
            row={row}
            kind={action.kind}
            checks={action.checks}
            remarks={action.remarks}
            showErr={showErr}
            onToggle={i => setAction(a => a ? { ...a, checks: a.checks.map((c, j) => j === i ? !c : c) } : a)}
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
function DetailModal({ row, onClose, onClear, onHold }: {
  row: ClearRow; onClose: () => void; onClear: () => void; onHold: () => void
}) {
  const st = STATUS_CFG[row.status]
  const isPending = row.status === 'pending'
  const daysLeft = Math.max(0, daysBetween(new Date(), new Date(row.lwdISO)))

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.50)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif", padding: 20 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ background: '#fff', borderRadius: 22, width: '100%', maxWidth: 520, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 32px 80px rgba(10,12,28,0.22)' }}>
        <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.navy }}>Manager Clearance</div>
            <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>Team-side sign-off</div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: C.hover, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted }}
            onMouseEnter={e => { e.currentTarget.style.background = '#E4E6EF'; e.currentTarget.style.color = C.navy }}
            onMouseLeave={e => { e.currentTarget.style.background = C.hover; e.currentTarget.style.color = C.muted }}>
            <X size={14} strokeWidth={2} />
          </button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, padding: '0 24px' }}>
          {/* Employee block */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 0 16px', borderBottom: `1px solid ${C.border}` }}>
            <img src={`https://i.pravatar.cc/150?img=${row.avatar}`} alt={row.employee} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '3px solid #F0F2F8', boxShadow: '0 2px 8px rgba(28,32,53,0.10)' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: C.navy, marginBottom: 3 }}>{row.employee}</div>
              <div style={{ fontSize: 12.5, color: C.muted }}>{row.code} · {row.designation}</div>
              <div style={{ marginTop: 9 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, padding: '3px 10px', borderRadius: 6, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>{st.label}</span>
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', borderBottom: `1px solid ${C.border}` }}>
            {[
              { icon: Building2,      label: 'Department',       value: row.department },
              { icon: Briefcase,      label: 'Project',          value: row.project },
              { icon: CalendarCheck2, label: 'Last Working Day', value: fmtDate(row.lwdISO) },
              { icon: Clock,          label: 'Days Left',        value: `${daysLeft} days` },
            ].map((item, i) => (
              <div key={item.label} style={{ padding: '13px 0', borderRight: i % 2 === 0 ? `1px solid ${C.border}` : 'none', borderBottom: i < 2 ? `1px solid ${C.border}` : 'none', paddingLeft: i % 2 === 0 ? 0 : 20, paddingRight: i % 2 === 0 ? 20 : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <item.icon size={12} style={{ color: C.muted }} strokeWidth={1.8} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</span>
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Remarks (cleared / hold) */}
          {!isPending && row.remarks && (
            <div style={{ padding: '16px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <MessageSquare size={13} style={{ color: row.status === 'hold' ? '#6B7192' : '#0A8A58' }} strokeWidth={1.8} />
                <span style={{ fontSize: 11.5, fontWeight: 700, color: row.status === 'hold' ? '#6B7192' : '#0A8A58', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {row.status === 'hold' ? 'Hold Reason' : 'Your Clearance Note'}
                </span>
              </div>
              <p style={{ fontSize: 13.5, lineHeight: 1.75, margin: 0, borderRadius: 10, padding: '12px 14px', fontStyle: 'italic',
                color: row.status === 'hold' ? '#3D4266' : '#064E3B',
                background: row.status === 'hold' ? C.surface : 'rgba(14,168,106,0.06)',
                border: `1px solid ${row.status === 'hold' ? C.border : 'rgba(14,168,106,0.18)'}` }}>
                “{row.remarks}”
              </p>
              {row.actionedOnISO && (
                <p style={{ fontSize: 11.5, color: C.muted, fontWeight: 500, margin: '8px 0 0' }}>
                  {row.status === 'hold' ? 'On hold since' : 'Cleared on'} {fmtDate(row.actionedOnISO)}
                </p>
              )}
            </div>
          )}
          <div style={{ height: 8 }} />
        </div>

        <div style={{ padding: '14px 24px 20px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 10, flexShrink: 0 }}>
          {isPending ? (
            <>
              <button onClick={onHold} style={{ flex: 1, height: 44, borderRadius: 12, border: 'none', background: 'rgba(107,113,146,0.12)', color: '#6B7192', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(107,113,146,0.22)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(107,113,146,0.12)' }}><PauseCircle size={15} strokeWidth={1.8} /> Put On Hold</button>
              <button onClick={onClear} style={{ flex: 1.5, height: 44, borderRadius: 12, border: 'none', background: '#0EA86A', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
                onMouseEnter={e => { e.currentTarget.style.background = '#0A8A58' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#0EA86A' }}><CheckCircle size={15} strokeWidth={1.8} /> Give Clearance</button>
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

/* ══════════════════════ Clear / Hold modal ══════════════════════ */
function ActionModal({ row, kind, checks, remarks, showErr, onToggle, onRemarks, onCancel, onConfirm }: {
  row: ClearRow; kind: 'clear' | 'hold'; checks: boolean[]; remarks: string; showErr: boolean
  onToggle: (i: number) => void; onRemarks: (v: string) => void; onCancel: () => void; onConfirm: () => void
}) {
  const isClear = kind === 'clear'
  const accent = isClear ? '#0EA86A' : '#6B7192'
  const accentDark = isClear ? '#0A8A58' : '#565C7A'
  const accentBg = isClear ? 'rgba(14,168,106,0.12)' : 'rgba(107,113,146,0.14)'
  const ModalIcon: ElementType = isClear ? CheckCircle : PauseCircle
  const checksOk = checks.every(Boolean)

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(10,12,28,0.50)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif", padding: 20 }}
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '28px 26px 22px', width: 470, maxWidth: '100%', boxShadow: '0 24px 64px rgba(10,12,28,0.22)' }}>
        {/* Header */}
        <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
          <div className="flex items-center gap-3">
            <div style={{ width: 44, height: 44, borderRadius: 13, flexShrink: 0, background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ModalIcon size={21} strokeWidth={1.8} style={{ color: accentDark }} />
            </div>
            <div>
              <div style={{ fontSize: 16.5, fontWeight: 700, color: C.navy }}>{isClear ? 'Give Manager Clearance' : 'Put Clearance On Hold'}</div>
              <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>{row.employee} · {row.code}</div>
            </div>
          </div>
          <button onClick={onCancel} style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: C.hover, color: C.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#E4E6EF'; e.currentTarget.style.color = C.navy }}
            onMouseLeave={e => { e.currentTarget.style.background = C.hover; e.currentTarget.style.color = C.muted }}>
            <X size={14} strokeWidth={2} />
          </button>
        </div>

        {isClear ? (
          <>
            <p style={{ fontSize: 12.5, color: C.muted, fontWeight: 500, margin: '0 0 12px', lineHeight: 1.55 }}>
              Confirm the following before clearing this member from your side:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {CONFIRM_ITEMS.map((item, i) => {
                const on = checks[i]
                return (
                  <label key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '11px 13px', borderRadius: 10, cursor: 'pointer', background: on ? 'rgba(14,168,106,0.06)' : C.surface, border: `1px solid ${on ? 'rgba(14,168,106,0.28)' : (showErr ? '#E84855' : C.border)}`, transition: 'all 0.13s' }}>
                    <input type="checkbox" checked={on} onChange={() => onToggle(i)} style={{ width: 16, height: 16, marginTop: 1, accentColor: '#0EA86A', cursor: 'pointer', flexShrink: 0 }} />
                    <span style={{ fontSize: 12.8, color: C.navy, fontWeight: 500, lineHeight: 1.5 }}>{item}</span>
                  </label>
                )
              })}
            </div>
            {showErr && !checksOk && <p style={{ fontSize: 11.5, color: '#E84855', fontWeight: 600, margin: '8px 0 0' }}>Please confirm all items before giving clearance.</p>}

            <label style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', margin: '18px 0 7px' }}>
              Remarks <span style={{ textTransform: 'none', fontWeight: 500 }}>(optional)</span>
            </label>
            <textarea
              value={remarks}
              onChange={e => onRemarks(e.target.value)}
              placeholder="Add a note for HR / the employee…"
              rows={3}
              style={{ width: '100%', padding: '10px 12px', border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 13, color: C.navy, background: C.hover, outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              onFocus={e => { e.target.style.borderColor = C.indigo; e.target.style.background = '#fff' }}
              onBlur={e => { e.target.style.borderColor = C.border; e.target.style.background = C.hover }}
            />
          </>
        ) : (
          <>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 7 }}>
              Reason for hold <span style={{ color: '#E84855' }}>*</span>
            </label>
            <textarea
              value={remarks}
              onChange={e => onRemarks(e.target.value)}
              placeholder="What is still pending from the team’s side before this member can be cleared?"
              rows={4}
              style={{ width: '100%', padding: '10px 12px', border: `1px solid ${showErr && !remarks.trim() ? '#E84855' : C.border}`, borderRadius: 10, fontSize: 13, color: C.navy, background: C.hover, outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              onFocus={e => { e.target.style.borderColor = C.indigo; e.target.style.background = '#fff' }}
              onBlur={e => { e.target.style.borderColor = showErr && !remarks.trim() ? '#E84855' : C.border; e.target.style.background = C.hover }}
            />
            {showErr && !remarks.trim() && <p style={{ fontSize: 11.5, color: '#E84855', fontWeight: 600, margin: '6px 0 0' }}>Please provide a reason for the hold.</p>}
          </>
        )}

        <div className="flex gap-2.5" style={{ marginTop: 22 }}>
          <button onClick={onCancel} style={{ flex: 1, height: 44, borderRadius: 12, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex: 1.4, height: 44, borderRadius: 12, border: 'none', background: accent, color: '#fff', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
            onMouseEnter={e => { e.currentTarget.style.background = accentDark }}
            onMouseLeave={e => { e.currentTarget.style.background = accent }}>
            <ModalIcon size={15} strokeWidth={1.9} /> {isClear ? 'Confirm Clearance' : 'Confirm Hold'}
          </button>
        </div>
      </div>
    </div>
  )
}
