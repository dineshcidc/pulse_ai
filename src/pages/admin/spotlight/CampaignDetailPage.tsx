import { useMemo, useState } from 'react'
import {
  ArrowLeft, Download, Search, Clock, Inbox, TrendingUp, Hourglass,
  Eye, CalendarDays, ChevronDown, ChevronUp, UserX,
} from 'lucide-react'
import { C, AWARD_THEME, audienceLabel } from './nominationTemplatesData'
import AudienceChips from './AudienceChips'
import {
  CAMPAIGN_STATUS_META, campaignLabel, totalResponded, totalInvited, pct,
  formatDate, daysLeft, responsesForRound, pendingPeople,
  type Campaign, type CampaignRound, type NominationResponse, type Person,
} from './responseFormsData'

/** Shared column geometry — header and rows use these so they always line up. */
const DATA_COL: React.CSSProperties = { flex: 1, minWidth: 150, minInlineSize: 0 }
const ICON_COL: React.CSSProperties = { width: 34, flexShrink: 0 }

interface Props {
  campaign: Campaign
  onBack: () => void
  onExport: () => void
}

export default function CampaignDetailPage({ campaign, onBack, onExport }: Props) {
  const [activeRound, setActiveRound] = useState(campaign.rounds[0]?.id ?? '')
  const [search, setSearch]           = useState('')
  const [showPending, setShowPending] = useState(false)
  const [expandedId, setExpandedId]   = useState<string | null>(null)

  const round = campaign.rounds.find(r => r.id === activeRound) ?? campaign.rounds[0]
  const stat  = CAMPAIGN_STATUS_META[campaign.status]
  const done  = totalResponded(campaign)
  const all   = totalInvited(campaign)
  const left  = daysLeft(campaign.deadline)

  const responses = useMemo(
    () => (round ? responsesForRound(campaign, round) : []),
    [campaign, round],
  )
  const pending = useMemo(() => (round ? pendingPeople(round) : []), [round])

  const filtered = responses.filter(r => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return r.nominator.name.toLowerCase().includes(q)
      || r.nominee.name.toLowerCase().includes(q)
      || r.nominee.code.toLowerCase().includes(q)
      || r.reason.toLowerCase().includes(q)
  })

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes cdFade { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }
      `}</style>

      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-3" style={{ marginBottom: 18 }}>
        <button
          onClick={onBack}
          style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${C.border}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = C.hover; e.currentTarget.style.borderColor = '#C8CCE0' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}
        >
          <ArrowLeft size={17} strokeWidth={2} style={{ color: C.navy }} />
        </button>
        <div style={{ fontSize: 12.5, color: C.muted, fontWeight: 600 }}>
          <button
            onClick={onBack}
            style={{ border: 'none', background: 'transparent', color: C.muted, fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', padding: 0 }}
            onMouseEnter={e => { e.currentTarget.style.color = C.indigo }}
            onMouseLeave={e => { e.currentTarget.style.color = C.muted }}
          >
            Response Forms
          </button>
          <span style={{ margin: '0 7px', color: '#C8CCE0' }}>/</span>
          <span style={{ color: C.navy }}>{campaignLabel(campaign)}</span>
        </div>
      </div>

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap" style={{ marginBottom: 20 }}>
        <div>
          <div className="flex items-center gap-2.5" style={{ flexWrap: 'wrap' }}>
            <h1 className="text-2xl font-bold" style={{ color: C.navy }}>{campaignLabel(campaign)}</h1>
            <span style={{
              display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 20,
              fontSize: 10.5, fontWeight: 700, color: stat.color, background: stat.bg, border: `1px solid ${stat.border}`,
              textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>{campaign.status}</span>
          </div>
          <p className="text-sm" style={{ color: '#787878', fontWeight: 500, marginTop: 6 }}>
            {campaign.rounds.length} award round{campaign.rounds.length === 1 ? '' : 's'} · sent {formatDate(campaign.sentOn)}
            {' · '}{campaign.status === 'Active' ? 'closes' : 'closed'} {formatDate(campaign.deadline)}
          </p>
        </div>

        <button
          onClick={onExport}
          className="inline-flex items-center gap-2 cursor-pointer flex-shrink-0"
          style={{ height: 40, padding: '0 18px', borderRadius: 11, border: 'none', background: C.indigo, color: '#fff', fontSize: 13.5, fontWeight: 700, fontFamily: 'inherit', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#5B5FDE' }}
          onMouseLeave={e => { e.currentTarget.style.background = C.indigo }}
        >
          <Download size={16} strokeWidth={2.2} /> Export
        </button>
      </div>

      {/* ── Stat tiles ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14, marginBottom: 18 }}>
        <StatTile Icon={Inbox}     tint={C.indigo} label="Responses collected" value={String(done)} sub={`of ${all} invited`} />
        <StatTile Icon={TrendingUp} tint={C.green} label="Response rate"       value={`${pct(done, all)}%`} sub="across all rounds" />
        <StatTile Icon={Hourglass} tint={C.amber}  label="Still pending"       value={String(all - done)} sub="yet to submit" />
        <StatTile
          Icon={CalendarDays}
          tint={C.teal}
          label={campaign.status === 'Active' ? 'Closes on' : 'Closed on'}
          value={formatDate(campaign.deadline)}
          sub={campaign.status === 'Active' ? (left >= 0 ? `${left} day${left === 1 ? '' : 's'} left` : 'past deadline') : 'campaign closed'}
        />
      </div>

      {/* ── Rounds + responses ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>

        {/* Award tabs */}
        <div className="flex items-center" style={{ borderBottom: `1px solid ${C.border}`, padding: '0 8px', overflowX: 'auto' }}>
          {campaign.rounds.map(r => {
            const th = AWARD_THEME[r.award]
            const TIcon = th.Icon
            const on = r.id === round?.id
            return (
              <button
                key={r.id}
                onClick={() => { setActiveRound(r.id); setSearch(''); setShowPending(false); setExpandedId(null) }}
                className="inline-flex items-center gap-2 cursor-pointer flex-shrink-0"
                style={{
                  padding: '15px 16px', border: 'none', background: 'transparent', fontFamily: 'inherit',
                  fontSize: 13.5, fontWeight: 700, color: on ? th.color : C.muted,
                  borderBottom: on ? `2px solid ${th.color}` : '2px solid transparent',
                  marginBottom: -1, transition: 'color 0.15s',
                }}
                onMouseEnter={e => { if (!on) e.currentTarget.style.color = C.navy }}
                onMouseLeave={e => { if (!on) e.currentTarget.style.color = C.muted }}
              >
                <TIcon size={16} strokeWidth={2} />
                {th.label}
                <span style={{
                  fontSize: 11, fontWeight: 700, borderRadius: 20, padding: '2px 8px',
                  color: on ? th.color : C.muted, background: on ? th.bg : C.hover,
                }}>{r.responded}</span>
              </button>
            )
          })}
        </div>

        {round && (
          <>
            {/* Round summary + search */}
            <RoundSummary round={round} search={search} onSearch={setSearch} shown={filtered.length} />

            {/* Responses table */}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center" style={{ padding: '56px 20px', gap: 10 }}>
                <div className="flex items-center justify-center" style={{ width: 52, height: 52, borderRadius: 14, background: C.hover }}>
                  <Inbox size={24} strokeWidth={1.6} style={{ color: C.muted }} />
                </div>
                <span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>
                  {responses.length === 0 ? 'No responses yet' : 'No matching responses'}
                </span>
                <span style={{ fontSize: 13, color: C.muted }}>
                  {responses.length === 0 ? 'Submissions will appear here as they come in.' : 'Try a different search term.'}
                </span>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <div style={{ minWidth: 720 }}>
                  {/* Table head */}
                  <div
                    className="flex items-center gap-4"
                    style={{ padding: '12px 20px', background: '#FAFBFE', borderBottom: `1px solid ${C.border}` }}
                  >
                    <HeadCell>Nominated by</HeadCell>
                    <HeadCell>Nominee</HeadCell>
                    <HeadCell>Submitted</HeadCell>
                    <div style={ICON_COL} />
                  </div>

                  {filtered.map((r, i) => (
                    <ResponseRow
                      key={r.id}
                      response={r}
                      index={i}
                      expanded={expandedId === r.id}
                      onToggle={() => setExpandedId(expandedId === r.id ? null : r.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Pending nominators */}
            {pending.length > 0 && (
              <div style={{ borderTop: `1px solid ${C.border}`, background: '#FCFCFE' }}>
                <button
                  onClick={() => setShowPending(v => !v)}
                  className="flex items-center gap-2.5 cursor-pointer"
                  style={{ width: '100%', padding: '14px 20px', border: 'none', background: 'transparent', fontFamily: 'inherit', textAlign: 'left' }}
                >
                  <UserX size={16} strokeWidth={2} style={{ color: C.amber, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>
                    {round.invited - round.responded} {audienceLabel(round.audiences).toLowerCase()} haven't responded yet
                  </span>
                  <span style={{ marginLeft: 'auto', color: C.muted, display: 'flex' }}>
                    {showPending ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                </button>

                {showPending && (
                  <div className="flex flex-wrap gap-2" style={{ padding: '0 20px 16px' }}>
                    {pending.map(p => (
                      <span
                        key={p.code}
                        className="inline-flex items-center gap-2"
                        style={{ padding: '6px 12px', borderRadius: 20, background: '#fff', border: `1px solid ${C.border}`, fontSize: 12, fontWeight: 600, color: C.navy }}
                      >
                        {p.name}
                        <span style={{ fontSize: 11, color: C.muted, fontWeight: 500 }}>{p.code}</span>
                      </span>
                    ))}
                    {round.invited - round.responded > pending.length && (
                      <span style={{ padding: '6px 11px', borderRadius: 20, background: C.hover, fontSize: 12, fontWeight: 600, color: C.muted }}>
                        +{round.invited - round.responded - pending.length} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   Round summary strip
══════════════════════════════════════════ */
function RoundSummary({ round, search, onSearch, shown }: {
  round: CampaignRound
  search: string
  onSearch: (v: string) => void
  shown: number
}) {
  const th  = AWARD_THEME[round.award]
  const p = pct(round.responded, round.invited)

  return (
    <div
      className="flex items-center gap-4 flex-wrap"
      style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}
    >
      <div className="flex items-center gap-3" style={{ flex: '1 1 300px', minWidth: 260 }}>
        <div className="flex items-center justify-center flex-shrink-0" style={{ width: 40, height: 40, borderRadius: 11, background: th.bg, border: `1px solid ${th.border}` }}>
          <th.Icon size={20} strokeWidth={1.9} style={{ color: th.color }} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14.5, fontWeight: 800, color: C.navy }}>{round.name}</span>
            <AudienceChips audiences={round.audiences} compact />
          </div>
          <div className="flex items-center gap-2.5" style={{ marginTop: 8 }}>
            <div style={{ width: 130, height: 6, borderRadius: 4, background: C.hover, overflow: 'hidden' }}>
              <div style={{ width: `${p}%`, height: '100%', borderRadius: 4, background: th.color, opacity: 0.85 }} />
            </div>
            <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>
              {round.responded} of {round.invited} responded · <strong style={{ color: th.color }}>{p}%</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap" style={{ marginLeft: 'auto' }}>
        {search.trim() && (
          <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>{shown} match{shown === 1 ? '' : 'es'}</span>
        )}
        <div style={{ position: 'relative', width: 280 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#B0B4C8', pointerEvents: 'none' }} />
          <input
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Search nominator, nominee or reason…"
            style={{
              width: '100%', boxSizing: 'border-box', height: 38, paddingLeft: 36, paddingRight: 12,
              border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 13, color: C.navy,
              background: C.surface, outline: 'none', fontFamily: 'inherit', transition: 'all 0.15s',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = C.indigo; e.currentTarget.style.background = '#fff' }}
            onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface }}
          />
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   Response row
══════════════════════════════════════════ */
function ResponseRow({ response, index, expanded, onToggle }: {
  response: NominationResponse
  index: number
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <div style={{ borderBottom: `1px solid ${C.border}`, animation: `cdFade 0.28s ease ${Math.min(index, 12) * 0.025}s both` }}>
      {/* Summary row */}
      <div
        onClick={onToggle}
        className="flex items-center gap-4 cursor-pointer"
        style={{ padding: '14px 20px', background: expanded ? '#FAFBFE' : 'transparent', transition: 'background 0.14s' }}
        onMouseEnter={e => { if (!expanded) e.currentTarget.style.background = '#FAFBFE' }}
        onMouseLeave={e => { if (!expanded) e.currentTarget.style.background = 'transparent' }}
      >
        <PersonCell person={response.nominator} />
        <PersonCell person={response.nominee} />

        <div style={DATA_COL}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: C.navy }}>{formatDate(response.submittedOn)}</div>
          <div className="flex items-center gap-1" style={{ fontSize: 11, color: C.muted, marginTop: 3, fontWeight: 500 }}>
            <Clock size={11} strokeWidth={2} /> {response.submittedAt}
          </div>
        </div>

        <button
          title={expanded ? 'Hide nomination' : 'View nomination'}
          onClick={e => { e.stopPropagation(); onToggle() }}
          className="flex items-center justify-center cursor-pointer"
          style={{
            ...ICON_COL, height: 34, borderRadius: 9, fontFamily: 'inherit', transition: 'all 0.15s',
            border: `1px solid ${expanded ? C.indigo : C.border}`,
            background: expanded ? C.indigo : '#fff',
            color: expanded ? '#fff' : C.muted,
          }}
          onMouseEnter={e => { if (!expanded) { e.currentTarget.style.borderColor = C.indigo; e.currentTarget.style.color = C.indigo } }}
          onMouseLeave={e => { if (!expanded) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted } }}
        >
          {expanded ? <ChevronUp size={16} strokeWidth={2.2} /> : <Eye size={15} strokeWidth={2} />}
        </button>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ background: '#FAFBFE', borderTop: `1px solid ${C.border}`, padding: '18px 20px 20px', animation: 'cdFade 0.2s ease' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, marginBottom: 14 }}>
            <PersonPanel title="Nominated by" person={response.nominator} />
            <PersonPanel title="Nominee" person={response.nominee} accent />
          </div>

          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              Reason for nomination
            </div>
            <p style={{ fontSize: 13.2, color: '#3D4266', lineHeight: 1.75, margin: 0, whiteSpace: 'pre-wrap' }}>
              {response.reason}
            </p>
          </div>

          <div className="flex items-center gap-1.5" style={{ marginTop: 12, fontSize: 11.5, color: C.muted, fontWeight: 500 }}>
            <Clock size={12} strokeWidth={2} />
            Submitted {formatDate(response.submittedOn)} at {response.submittedAt}
          </div>
        </div>
      )}
    </div>
  )
}

function PersonCell({ person }: { person: Person }) {
  return (
    <div style={DATA_COL}>
      <div style={{ fontSize: 13.2, fontWeight: 700, color: C.navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {person.name}
      </div>
      <div style={{ fontSize: 11.5, color: C.muted, marginTop: 3, fontWeight: 600 }}>
        {person.code}
      </div>
    </div>
  )
}

function PersonPanel({ title, person, accent }: { title: string; person: Person; accent?: boolean }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: '14px 16px',
      border: `1px solid ${accent ? 'rgba(99,102,241,0.30)' : C.border}`,
    }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: accent ? C.indigo : C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
        {title}
      </div>
      <div style={{ fontSize: 14.5, fontWeight: 800, color: C.navy, marginBottom: 10 }}>{person.name}</div>
      <DetailLine label="Employee code" value={person.code} />
      <DetailLine label="Role" value={person.role} />
      <DetailLine label="Department" value={person.department} />
      <DetailLine label="Email" value={person.email} last />
    </div>
  )
}

function DetailLine({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className="flex items-baseline gap-3" style={{ marginBottom: last ? 0 : 6 }}>
      <span style={{ fontSize: 11.5, color: C.muted, fontWeight: 500, width: 104, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 12.5, color: C.navy, fontWeight: 600, wordBreak: 'break-word' }}>{value}</span>
    </div>
  )
}

/* ══════════════════════════════════════════
   Bits
══════════════════════════════════════════ */
function StatTile({ Icon, tint, label, value, sub }: {
  Icon: React.ElementType
  tint: string
  label: string
  value: string
  sub: string
}) {
  return (
    <div className="flex items-center gap-3" style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '16px 18px' }}>
      <div className="flex items-center justify-center flex-shrink-0" style={{ width: 40, height: 40, borderRadius: 11, background: `${tint}14` }}>
        <Icon size={19} strokeWidth={2} style={{ color: tint }} />
      </div>
      <div className="min-w-0">
        <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: C.navy, marginTop: 4, lineHeight: 1.15, whiteSpace: 'nowrap' }}>{value}</div>
        <div style={{ fontSize: 11.5, color: C.muted, marginTop: 3, fontWeight: 500 }}>{sub}</div>
      </div>
    </div>
  )
}

function HeadCell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      ...DATA_COL,
      fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em',
    }}>
      {children}
    </div>
  )
}
