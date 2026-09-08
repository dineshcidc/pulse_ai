import { useMemo, useState } from 'react'
import { Search, Eye, ChevronDown, Trophy, CircleCheck, Clock, MinusCircle } from 'lucide-react'
import { C, AWARD_THEME } from '../admin/spotlight/nominationTemplatesData'
import { formatDate } from '../admin/spotlight/responseFormsData'
import {
  myNominationRecords, recordStatus,
  type NominationRecord, type NominatorRole, type RecordStatus,
} from './nominationInboxData'

/* ══════════════════════════════════════════
   Spotlight — Reward Nominations (list)
   Every award round this nominator was asked
   for, newest month first: what they sent,
   what is still open, what they missed.
══════════════════════════════════════════ */

const INDIGO = '#6366F1'

const STATUS: Record<RecordStatus, { label: string; color: string; bg: string; Icon: typeof Clock }> = {
  submitted: { label: 'Submitted',     color: C.green, bg: 'rgba(14,168,106,0.12)', Icon: CircleCheck },
  open:      { label: 'Awaiting you',  color: '#B45309', bg: 'rgba(217,119,6,0.13)', Icon: Clock },
  missed:    { label: 'Not submitted', color: C.muted, bg: 'rgba(139,144,167,0.13)', Icon: MinusCircle },
}

/* Column widths — one source of truth so the head and the rows cannot drift. */
const COL = {
  month:  { flex: '0 0 150px' } as React.CSSProperties,
  award:  { flex: '1 1 210px', minWidth: 0 } as React.CSSProperties,
  who:    { flex: '1 1 210px', minWidth: 0 } as React.CSSProperties,
  when:   { flex: '0 0 150px' } as React.CSSProperties,
  status: { flex: '0 0 150px' } as React.CSSProperties,
  action: { flex: '0 0 34px' } as React.CSSProperties,
}

interface Props {
  role: NominatorRole
  onOpen: (key: string) => void
  /** Jump to the nomination form — used by rows that are still open. */
  onNominate: () => void
}

export default function MyNominationsListPage({ role, onOpen, onNominate }: Props) {
  const records = useMemo(() => myNominationRecords(role), [role])

  const [query, setQuery]   = useState('')
  const [award, setAward]   = useState('all')
  const [status, setStatus] = useState('all')

  const awardOptions = useMemo(() => {
    const seen = new Map<string, string>()
    records.forEach(r => seen.set(r.award, AWARD_THEME[r.award].label))
    return [...seen.entries()]
  }, [records])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return records.filter(r => {
      if (award !== 'all'  && r.award !== award) return false
      if (status !== 'all' && recordStatus(r) !== status) return false
      if (!q) return true
      return (
        r.monthLabel.toLowerCase().includes(q) ||
        AWARD_THEME[r.award].label.toLowerCase().includes(q) ||
        (r.submission?.nominee.name ?? '').toLowerCase().includes(q) ||
        (r.submission?.reason ?? '').toLowerCase().includes(q)
      )
    })
  }, [records, query, award, status])

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 20 }}>
        <h1 className="text-2xl font-bold" style={{ color: C.navy }}>Reward Nominations</h1>
        <p style={{ fontSize: 13, color: C.muted, marginTop: 6 }}>
          Every Rewards &amp; Recognition nomination you have been asked for — this month and every month before
        </p>
      </div>

      {/* ── Table card — filters live inside it ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>

        <div
          className="flex items-center gap-3 flex-wrap"
          style={{ padding: 14, borderBottom: `1px solid ${C.border}` }}
        >
          <div style={{ position: 'relative', flex: '1 1 260px', minWidth: 0 }}>
            <Search size={14} strokeWidth={2} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: C.muted }} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search month, award, nominee or reason..."
              className="nf-input"
              style={{
                width: '100%', height: 40, paddingLeft: 36, paddingRight: 12,
                border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 13,
                color: C.navy, background: '#fff', outline: 'none', fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <Select value={award} onChange={setAward} options={[['all', 'All Awards'], ...awardOptions]} />
          <Select
            value={status}
            onChange={setStatus}
            options={[['all', 'All Statuses'], ['submitted', 'Submitted'], ['open', 'Awaiting you'], ['missed', 'Not submitted']]}
          />
        </div>

        {filtered.length === 0 ? (
          <Empty hasRecords={records.length > 0} />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: 900 }}>
              {/* Table head */}
              <div
                className="flex items-center gap-4"
                style={{ padding: '12px 20px', background: '#FAFBFE', borderBottom: `1px solid ${C.border}` }}
              >
                <HeadCell style={COL.month}>Month</HeadCell>
                <HeadCell style={COL.award}>Award</HeadCell>
                <HeadCell style={COL.who}>Who you nominated</HeadCell>
                <HeadCell style={COL.when}>Submitted</HeadCell>
                <HeadCell style={COL.status}>Status</HeadCell>
                <div style={COL.action} />
              </div>

              {filtered.map(r => (
                <Row key={r.key} record={r} onOpen={() => onOpen(r.key)} onNominate={onNominate} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── One row ───────────────────────────────────────────── */
function Row({ record, onOpen, onNominate }: { record: NominationRecord; onOpen: () => void; onNominate: () => void }) {
  const theme  = AWARD_THEME[record.award]
  const st     = recordStatus(record)
  const meta   = STATUS[st]
  const StIcon = meta.Icon
  const sub    = record.submission

  return (
    <div
      className="flex items-center gap-4"
      style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, transition: 'background 0.15s' }}
      onMouseEnter={e => { e.currentTarget.style.background = '#FAFBFE' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
    >
      {/* Month */}
      <div style={COL.month}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{record.monthLabel}</div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
          {record.isOpen ? 'Open now' : `Closed ${formatDate(record.campaign.deadline)}`}
        </div>
      </div>

      {/* Award */}
      <div className="flex items-center gap-2.5" style={COL.award}>
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{ width: 30, height: 30, borderRadius: 9, background: theme.bg, border: `1px solid ${theme.border}` }}
        >
          <theme.Icon size={15} strokeWidth={1.9} style={{ color: theme.color }} />
        </div>
        <span
          style={{
            fontSize: 13, fontWeight: 600, color: C.navy,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}
        >
          {theme.label}
        </span>
      </div>

      {/* Nominee — name + role, no employee code on the nominator side */}
      <div style={COL.who}>
        {sub ? (
          <>
            <div
              style={{
                fontSize: 13, fontWeight: 600, color: C.navy,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}
            >
              {sub.nominee.name}
            </div>
            <div
              style={{
                fontSize: 11, color: C.muted, marginTop: 2,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}
            >
              {sub.nominee.role}
            </div>
          </>
        ) : (
          <span style={{ fontSize: 12.5, color: '#C1C4D0' }}>—</span>
        )}
      </div>

      {/* Submitted */}
      <div style={COL.when}>
        {sub ? (
          <>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: C.navy }}>{formatDate(sub.submittedOn)}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{sub.submittedAt}</div>
          </>
        ) : (
          <span style={{ fontSize: 12.5, color: '#C1C4D0' }}>—</span>
        )}
      </div>

      {/* Status */}
      <div style={COL.status}>
        <span
          className="inline-flex items-center gap-1.5"
          style={{
            padding: '4px 9px', borderRadius: 7, background: meta.bg,
            fontSize: 11, fontWeight: 700, color: meta.color,
          }}
        >
          <StIcon size={12} strokeWidth={2.4} />
          {meta.label}
        </span>
      </div>

      {/* Action */}
      <div style={COL.action}>
        {sub ? (
          <button
            onClick={onOpen}
            title="View nomination"
            className="flex items-center justify-center cursor-pointer"
            style={{
              width: 34, height: 34, borderRadius: 9, background: '#fff',
              border: `1px solid ${C.border}`, color: C.muted, transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = INDIGO; e.currentTarget.style.color = INDIGO }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
          >
            <Eye size={15} strokeWidth={2} />
          </button>
        ) : st === 'open' ? (
          <button
            onClick={onNominate}
            title="Submit this nomination"
            className="flex items-center justify-center cursor-pointer"
            style={{
              width: 34, height: 34, borderRadius: 9, background: 'rgba(99,102,241,0.12)',
              border: 'none', color: INDIGO, transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.20)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.12)' }}
          >
            <Trophy size={15} strokeWidth={2} />
          </button>
        ) : (
          <div style={{ width: 34 }} />
        )}
      </div>
    </div>
  )
}

/* ── Bits ──────────────────────────────────────────────── */
function HeadCell({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        fontSize: 10.5, fontWeight: 700, color: C.muted,
        textTransform: 'uppercase', letterSpacing: '0.06em', ...style,
      }}
    >
      {children}
    </div>
  )
}

function Select({
  value, onChange, options,
}: {
  value: string
  onChange: (v: string) => void
  options: [string, string][]
}) {
  return (
    <div style={{ position: 'relative', flex: '0 0 176px' }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', height: 40, padding: '0 34px 0 13px', appearance: 'none',
          border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 13, fontWeight: 500,
          color: C.navy, background: '#fff', cursor: 'pointer', outline: 'none',
          fontFamily: 'inherit', boxSizing: 'border-box',
        }}
      >
        {options.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
      </select>
      <ChevronDown
        size={15}
        strokeWidth={2}
        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }}
      />
    </div>
  )
}

function Empty({ hasRecords }: { hasRecords: boolean }) {
  return (
    <div className="flex items-center justify-center" style={{ minHeight: 260, padding: 24 }}>
      <div className="text-center" style={{ maxWidth: 340 }}>
        <div
          className="flex items-center justify-center mx-auto"
          style={{ width: 46, height: 46, borderRadius: 13, background: 'rgba(124,58,237,0.10)', border: '1px solid rgba(124,58,237,0.22)', marginBottom: 13 }}
        >
          <Trophy size={21} strokeWidth={1.7} style={{ color: '#7C3AED' }} />
        </div>
        <p style={{ fontSize: 14, fontWeight: 700, color: C.navy, margin: 0 }}>
          {hasRecords ? 'Nothing matches those filters' : 'No nominations yet'}
        </p>
        <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.6, margin: '8px 0 0' }}>
          {hasRecords
            ? 'Try a different award or status, or clear the search.'
            : 'As soon as HR opens a Rewards & Recognition round for you, it will appear here.'}
        </p>
      </div>
    </div>
  )
}
