import { useState } from 'react'
import {
  Plus, Search, ChevronDown, ChevronRight, CalendarDays,
  Inbox, Clock, Send,
} from 'lucide-react'
import { C, AWARD_THEME } from './nominationTemplatesData'
import AudienceChips from './AudienceChips'
import {
  MONTHS, MONTHS_SHORT, CAMPAIGN_STATUS_META,
  campaignLabel, totalResponded, totalInvited, pct, formatDate, formatDateShort, daysLeft,
  type Campaign, type CampaignStatus, type CampaignRound,
} from './responseFormsData'

interface Props {
  campaigns: Campaign[]
  onSend: () => void
  onOpen: (c: Campaign) => void
}

type StatusFilter = 'All' | CampaignStatus

export default function ResponseFormsPage({ campaigns, onSend, onOpen }: Props) {
  const [search, setSearch]   = useState('')
  const [year, setYear]       = useState<'All' | number>('All')
  const [status, setStatus]   = useState<StatusFilter>('All')

  const now = new Date()
  const current = campaigns.find(c => c.month === now.getMonth() && c.year === now.getFullYear()) ?? null

  const years = Array.from(new Set(campaigns.map(c => c.year))).sort((a, b) => b - a)

  const history = campaigns
    .filter(c => c.id !== current?.id)
    .filter(c => {
      const q = search.trim().toLowerCase()
      const matchQ = !q || campaignLabel(c).toLowerCase().includes(q) || c.rounds.some(r => r.name.toLowerCase().includes(q))
      const matchY = year === 'All' || c.year === year
      const matchS = status === 'All' || c.status === status
      return matchQ && matchY && matchS
    })
    .sort((a, b) => (b.year - a.year) || (b.month - a.month))

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes rfCard { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        @keyframes rfBar  { from { width:0 } }
      `}</style>

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4" style={{ marginBottom: 20 }}>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: C.navy }}>Response Forms</h1>
          <p className="text-sm mt-1" style={{ color: '#787878', fontWeight: 500 }}>
            Send monthly nomination forms and review the submissions that come back
          </p>
        </div>
        <button
          onClick={onSend}
          className="flex items-center gap-2 cursor-pointer transition-all duration-150 flex-shrink-0"
          style={{ height: 40, padding: '0 18px', borderRadius: 11, border: 'none', background: C.indigo, color: '#fff', fontSize: 13.5, fontWeight: 700, fontFamily: 'inherit' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#5B5FDE' }}
          onMouseLeave={e => { e.currentTarget.style.background = C.indigo }}
        >
          <Plus size={16} strokeWidth={2.5} /> Send Nomination Form
        </button>
      </div>

      {/* ── Current campaign spotlight ── */}
      {current
        ? <CurrentCampaignCard campaign={current} onOpen={() => onOpen(current)} />
        : <NoCampaignCard month={now.getMonth()} year={now.getFullYear()} onSend={onSend} />
      }

      {/* ── Other campaigns — title, filters and rows in ONE card ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', marginTop: 22 }}>

        {/* Card toolbar: title + search + filters */}
        <div
          className="flex items-center gap-3 flex-wrap"
          style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}` }}
        >
          <div className="flex items-center gap-2 flex-shrink-0">
            <span style={{ fontSize: 14, fontWeight: 800, color: C.navy }}>Other Campaigns</span>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, background: C.hover, borderRadius: 20, padding: '2px 9px' }}>
              {history.length}
            </span>
          </div>

          <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 420, marginLeft: 'auto' }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#B0B4C8', pointerEvents: 'none' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search campaigns…"
              style={{
                width: '100%', boxSizing: 'border-box', height: 38, paddingLeft: 36, paddingRight: 12,
                border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 13, color: C.navy,
                background: C.surface, outline: 'none', fontFamily: 'inherit', transition: 'all 0.15s',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = C.indigo; e.currentTarget.style.background = '#fff' }}
              onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface }}
            />
          </div>

          <SelectBox width={132} value={String(year)} onChange={v => setYear(v === 'All' ? 'All' : Number(v))}>
            <option value="All">All Years</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </SelectBox>

          <SelectBox width={148} value={status} onChange={v => setStatus(v as StatusFilter)}>
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Closed">Closed</option>
          </SelectBox>
        </div>

        {/* Rows */}
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center" style={{ padding: '56px 20px', gap: 10 }}>
            <div className="flex items-center justify-center" style={{ width: 52, height: 52, borderRadius: 14, background: C.hover }}>
              <Inbox size={24} strokeWidth={1.6} style={{ color: C.muted }} />
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>No campaigns found</span>
            <span style={{ fontSize: 13, color: C.muted }}>Try a different search, year or status.</span>
          </div>
        ) : (
          history.map((c, i) => (
            <CampaignRow key={c.id} campaign={c} first={i === 0} index={i} onOpen={() => onOpen(c)} />
          ))
        )}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   Current campaign — hero card
══════════════════════════════════════════ */
function CurrentCampaignCard({ campaign, onOpen }: { campaign: Campaign; onOpen: () => void }) {
  const stat  = CAMPAIGN_STATUS_META[campaign.status]
  const left  = daysLeft(campaign.deadline)
  const done  = totalResponded(campaign)
  const all   = totalInvited(campaign)
  const urgent = left >= 0 && left <= 7

  return (
    <div
      style={{
        background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden',
        animation: 'rfCard 0.3s ease both',
      }}
    >
      {/* Head */}
      <div className="flex items-center justify-between gap-4 flex-wrap" style={{ padding: '20px 22px 18px' }}>
        <div className="flex items-center gap-4 min-w-0">
          <MonthTile month={campaign.month} year={campaign.year} accent={C.indigo} />
          <div className="min-w-0">
            <div className="flex items-center gap-2.5" style={{ flexWrap: 'wrap' }}>
              <span style={{ fontSize: 19, fontWeight: 800, color: C.navy, lineHeight: 1.2 }}>{campaignLabel(campaign)}</span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 20,
                fontSize: 10.5, fontWeight: 700, color: stat.color, background: stat.bg, border: `1px solid ${stat.border}`,
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>{campaign.status}</span>
            </div>
            <div className="flex items-center gap-1.5" style={{ marginTop: 12 }}>
              <Clock size={13} strokeWidth={2} style={{ color: urgent ? C.amber : C.muted, flexShrink: 0 }} />
              <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 500 }}>
                Closes {formatDate(campaign.deadline)}
                {left >= 0 && (
                  <> · <strong style={{ color: urgent ? C.amber : C.navy, fontWeight: 700 }}>
                    {left === 0 ? 'closes today' : `${left} day${left === 1 ? '' : 's'} left`}
                  </strong></>
                )}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onOpen}
          className="inline-flex items-center gap-2 cursor-pointer flex-shrink-0"
          style={{ height: 40, padding: '0 18px', borderRadius: 11, border: `1px solid ${C.indigo}`, background: 'rgba(99,102,241,0.08)', color: C.indigo, fontSize: 13.5, fontWeight: 700, fontFamily: 'inherit', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.16)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)' }}
        >
          Open Campaign <ChevronRight size={15} strokeWidth={2.4} />
        </button>
      </div>

      {/* Round progress */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: '10px 22px 16px' }}>
        {campaign.rounds.map(r => <RoundProgressRow key={r.id} round={r} />)}
      </div>

      {/* Footer summary */}
      <div
        className="flex items-center gap-5 flex-wrap"
        style={{ borderTop: `1px solid ${C.border}`, background: '#FCFCFE', padding: '12px 22px' }}
      >
        <span className="inline-flex items-center gap-1.5" style={{ fontSize: 12.5, fontWeight: 700, color: C.navy }}>
          <Inbox size={14} strokeWidth={2} style={{ color: C.green }} /> {done} responses collected
        </span>
        <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 500 }}>{all - done} still pending</span>
        <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 500, marginLeft: 'auto' }}>
          Sent {formatDate(campaign.sentOn)}
        </span>
      </div>
    </div>
  )
}

function RoundProgressRow({ round }: { round: CampaignRound }) {
  const th  = AWARD_THEME[round.award]
  const RIcon = th.Icon
  const p = pct(round.responded, round.invited)

  return (
    <div className="flex items-center gap-3 flex-wrap" style={{ padding: '17px 0', borderBottom: `1px solid ${C.hover}` }}>
      {/* Award identity */}
      <div className="flex items-center gap-2.5" style={{ minWidth: 210, flex: '1 1 210px' }}>
        <div className="flex items-center justify-center flex-shrink-0" style={{ width: 34, height: 34, borderRadius: 10, background: th.bg, border: `1px solid ${th.border}` }}>
          <RIcon size={17} strokeWidth={1.9} style={{ color: th.color }} />
        </div>
        <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{th.label}</span>
      </div>

      {/* Audience */}
      <AudienceChips audiences={round.audiences} />

      {/* Bar */}
      <div style={{ flex: '1 1 160px', minWidth: 120, height: 7, borderRadius: 5, background: C.hover, overflow: 'hidden' }}>
        <div style={{ width: `${p}%`, height: '100%', borderRadius: 5, background: th.color, opacity: 0.85, animation: 'rfBar 0.6s ease' }} />
      </div>

      {/* Numbers */}
      <span style={{ fontSize: 12.5, fontWeight: 700, color: C.navy, width: 108, textAlign: 'right', flexShrink: 0 }}>
        {round.responded}/{round.invited} responded
      </span>
      <span style={{ fontSize: 12.5, fontWeight: 700, color: th.color, width: 40, textAlign: 'right', flexShrink: 0 }}>{p}%</span>
    </div>
  )
}

/* ══════════════════════════════════════════
   No campaign this month — CTA state
══════════════════════════════════════════ */
function NoCampaignCard({ month, year, onSend }: { month: number; year: number; onSend: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ border: `2px dashed #D8DCEC`, borderRadius: 16, background: C.surface, padding: '44px 24px', gap: 10, textAlign: 'center' }}
    >
      <div className="flex items-center justify-center" style={{ width: 52, height: 52, borderRadius: 14, background: '#E9ECF5' }}>
        <CalendarDays size={24} strokeWidth={1.7} style={{ color: C.muted }} />
      </div>
      <span style={{ fontSize: 15.5, fontWeight: 800, color: C.navy }}>
        No nomination form sent for {MONTHS[month]} {year}
      </span>
      <span style={{ fontSize: 13, color: C.muted, maxWidth: 440, lineHeight: 1.6 }}>
        Start this month's campaign by sending the nomination forms to managers and employees.
      </span>
      <button
        onClick={onSend}
        className="inline-flex items-center gap-2 cursor-pointer"
        style={{ marginTop: 6, height: 40, padding: '0 18px', borderRadius: 11, border: 'none', background: C.indigo, color: '#fff', fontSize: 13.5, fontWeight: 700, fontFamily: 'inherit', transition: 'all 0.15s' }}
        onMouseEnter={e => { e.currentTarget.style.background = '#5B5FDE' }}
        onMouseLeave={e => { e.currentTarget.style.background = C.indigo }}
      >
        <Send size={15} strokeWidth={2.2} /> Send Nomination Form
      </button>
    </div>
  )
}

/* ══════════════════════════════════════════
   History row
══════════════════════════════════════════ */
function CampaignRow({ campaign, first, index, onOpen }: { campaign: Campaign; first: boolean; index: number; onOpen: () => void }) {
  const stat = CAMPAIGN_STATUS_META[campaign.status]
  const done = totalResponded(campaign)
  const all  = totalInvited(campaign)

  return (
    <div
      onClick={onOpen}
      className="flex items-center gap-4 cursor-pointer flex-wrap"
      style={{
        padding: '20px 20px', borderTop: first ? 'none' : `1px solid ${C.border}`,
        transition: 'background 0.14s', animation: `rfCard 0.3s ease ${index * 0.03}s both`,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#FAFBFE' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
    >
      <MonthTile month={campaign.month} year={campaign.year} accent={C.muted} small />

      {/* Month + meta */}
      <div style={{ minWidth: 170, flex: '0 1 200px' }}>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 14.5, fontWeight: 800, color: C.navy }}>{campaignLabel(campaign)}</span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 20,
            fontSize: 10, fontWeight: 700, color: stat.color, background: stat.bg, border: `1px solid ${stat.border}`,
            textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>{campaign.status}</span>
        </div>
        <div style={{ fontSize: 11.5, color: C.muted, marginTop: 8, fontWeight: 500, whiteSpace: 'nowrap' }}>
          Sent {formatDateShort(campaign.sentOn)} · {campaign.status === 'Active' ? 'Closes' : 'Closed'} {formatDateShort(campaign.deadline)}
        </div>
      </div>

      {/* Award chips */}
      <div className="flex items-center gap-1.5 flex-wrap" style={{ flex: '1 1 260px', minWidth: 200 }}>
        {campaign.rounds.map(r => {
          const th = AWARD_THEME[r.award]
          const RIcon = th.Icon
          return (
            <span
              key={r.id}
              className="inline-flex items-center gap-1.5"
              style={{ padding: '4px 9px', borderRadius: 8, fontSize: 11, fontWeight: 700, color: th.color, background: th.bg, border: `1px solid ${th.border}` }}
            >
              <RIcon size={12} strokeWidth={2} /> {th.label}
            </span>
          )
        })}
      </div>

      {/* Responses */}
      <div style={{ width: 130, flexShrink: 0, textAlign: 'right' }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: C.navy }}>{done} responses</div>
        <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2, fontWeight: 500 }}>of {all} invited · {pct(done, all)}%</div>
      </div>

      {/* Open */}
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{ width: 32, height: 32, borderRadius: 9, border: `1px solid ${C.border}`, background: '#fff', color: C.muted }}
      >
        <ChevronRight size={16} strokeWidth={2.2} />
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   Bits
══════════════════════════════════════════ */
function MonthTile({ month, year, accent, small }: { month: number; year: number; accent: string; small?: boolean }) {
  const size = small ? 44 : 54
  return (
    <div
      className="flex flex-col items-center justify-center flex-shrink-0"
      style={{
        width: size, height: size, borderRadius: small ? 11 : 14,
        background: small ? C.surface : 'rgba(99,102,241,0.08)',
        border: `1px solid ${small ? C.border : 'rgba(99,102,241,0.22)'}`,
      }}
    >
      <span style={{ fontSize: small ? 11.5 : 14, fontWeight: 800, color: accent, letterSpacing: '0.04em', lineHeight: 1 }}>
        {MONTHS_SHORT[month]}
      </span>
      <span style={{ fontSize: small ? 9.5 : 10.5, fontWeight: 600, color: C.muted, marginTop: 3, lineHeight: 1 }}>{year}</span>
    </div>
  )
}

function SelectBox({ width, value, onChange, children }: { width: number; value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative', width, flexShrink: 0 }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', boxSizing: 'border-box', height: 40, paddingLeft: 12, paddingRight: 34,
          border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 13.5, fontWeight: 500, color: C.navy,
          background: C.surface, outline: 'none', fontFamily: 'inherit', cursor: 'pointer',
          appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', transition: 'all 0.15s',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = C.indigo; e.currentTarget.style.background = '#fff' }}
        onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface }}
      >
        {children}
      </select>
      <ChevronDown size={15} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', color: '#B0B4C8', pointerEvents: 'none' }} />
    </div>
  )
}
