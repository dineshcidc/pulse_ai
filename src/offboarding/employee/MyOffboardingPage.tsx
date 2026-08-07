import { useState } from 'react'
import {
  LayoutDashboard, CalendarClock, Clock3, CheckCircle2, Lock,
  MessageSquareText, FileCheck2, Download, ShieldCheck, Users,
  MonitorCheck, Wallet, Star, Info, DoorOpen,
} from 'lucide-react'

/*
 * Employee › My Offboarding (E3 + E4 + E5) — the hub.
 *
 * 3 / 9 layout: a left vertical-tab rail + a wide content panel.
 * Tabs: Overview (tracker) · Exit Interview · Exit Documents.
 * Exit Interview / Documents are status-gated (locked until HR opens / issues).
 *
 * A "Demo · Prototype" switcher walks the phases so BA can see locked→unlocked:
 *   clearances → interview → completed
 */

const C = {
  navy:   '#1C2035',
  border: '#E8EAF2',
  muted:  '#8B90A7',
  hover:  '#F0F2F8',
  indigo: '#6366F1',
  indigoDeep: '#5B5FDE',
  green:  '#0EA86A',
  amber:  '#D97706',
}

type Phase = 'clearances' | 'interview' | 'completed'
type Tab   = 'overview' | 'interview' | 'documents'

const NOTICE_DAYS = 60
const LWD = '2026-10-02'          // Last Working Day (fixed for the demo)

function daysUntil(dateStr: string) {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const d = new Date(dateStr); d.setHours(0, 0, 0, 0)
  return Math.max(0, Math.round((d.getTime() - today.getTime()) / 86400000))
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ── Department clearance rows, driven by the phase ──
type DeptState = 'approved' | 'completed' | 'in-progress' | 'pending' | 'waiting'
const STATE_META: Record<DeptState, { label: string; color: string; bg: string }> = {
  approved:     { label: 'Approved',    color: '#0A8A58', bg: 'rgba(14,168,106,0.12)' },
  completed:    { label: 'Completed',   color: '#0A8A58', bg: 'rgba(14,168,106,0.12)' },
  'in-progress':{ label: 'In Progress', color: '#B26905', bg: 'rgba(217,119,6,0.12)'  },
  pending:      { label: 'Pending',     color: '#8B90A7', bg: '#EEF0F6'               },
  waiting:      { label: 'Waiting',     color: '#8B90A7', bg: '#EEF0F6'               },
}

function departments(phase: Phase): { role: string; who: string; task: string; Icon: React.ElementType; state: DeptState }[] {
  const map: Record<Phase, DeptState[]> = {
    // CTO, PM, IT, Finance, HR
    clearances: ['approved', 'in-progress', 'pending',    'pending',    'waiting'],
    interview:  ['approved', 'completed',   'completed',  'in-progress','in-progress'],
    completed:  ['approved', 'completed',   'completed',  'completed',  'completed'],
  }
  const s = map[phase]
  return [
    { role: 'Delivery Head (CTO)', who: 'Approval',         task: 'Approved & set notice period', Icon: ShieldCheck,  state: s[0] },
    { role: 'Project Manager',     who: 'Priya Sharma',     task: 'Project handover & KT',        Icon: Users,        state: s[1] },
    { role: 'System Admin (IT)',   who: 'IT Clearance',     task: 'Assets & access',              Icon: MonitorCheck, state: s[2] },
    { role: 'Finance',             who: 'Settlement',       task: 'Dues & final payment',         Icon: Wallet,       state: s[3] },
    { role: 'HR',                  who: 'Exit formalities', task: 'Interview, letters & closure', Icon: FileCheck2,   state: s[4] },
  ]
}

export default function MyOffboardingPage() {
  const [phase, setPhase] = useState<Phase>('clearances')
  const [tab, setTab]     = useState<Tab>('overview')

  const interviewLocked = phase === 'clearances'
  const docsLocked      = phase !== 'completed'
  const daysLeft        = daysUntil(LWD)

  const statusMeta =
    phase === 'completed'
      ? { label: 'Offboarded', color: C.green, bg: 'rgba(14,168,106,0.12)' }
      : { label: 'Notice Period', color: C.amber, bg: 'rgba(217,119,6,0.12)' }

  const TABS: { id: Tab; label: string; sub: string; Icon: React.ElementType; locked: boolean }[] = [
    { id: 'overview',  label: 'Overview',       sub: 'Notice & clearances',   Icon: LayoutDashboard,  locked: false },
    { id: 'interview', label: 'Exit Interview', sub: interviewLocked ? 'Opens when HR requests' : 'Share your feedback', Icon: MessageSquareText, locked: interviewLocked },
    { id: 'documents', label: 'Exit Documents', sub: docsLocked ? 'Issued by HR at closure' : 'Ready to download',       Icon: FileCheck2,        locked: docsLocked },
  ]

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@keyframes obFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}@keyframes obSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>

      {/* ── Page header ── */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="font-bold mb-1" style={{ fontSize: 22, color: C.navy, letterSpacing: '-0.3px' }}>My Offboarding</h1>
          <p style={{ fontSize: 13.5, color: '#787878', fontWeight: 500 }}>Track your exit, complete your interview, and collect your documents</p>
        </div>
        <div className="flex items-center justify-center rounded-2xl flex-shrink-0" style={{ width: 60, height: 60, backgroundColor: 'rgba(99,102,241,0.07)', backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.22) 1px, transparent 1px)', backgroundSize: '8px 8px', border: '1px solid rgba(99,102,241,0.14)' }}>
          <div style={{ animation: 'obFloat 4s ease-in-out infinite' }}>
            <DoorOpen size={26} strokeWidth={1.5} style={{ color: C.indigoDeep }} />
          </div>
        </div>
      </div>

      {/* ── Demo · Prototype switcher (fit width) ── */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, width: 'fit-content', marginBottom: 20, background: 'repeating-linear-gradient(45deg, rgba(99,102,241,0.035), rgba(99,102,241,0.035) 10px, rgba(99,102,241,0.06) 10px, rgba(99,102,241,0.06) 20px)', border: '1px dashed rgba(99,102,241,0.40)', borderRadius: 12, padding: '7px 12px' }}>
        <div style={{ display: 'flex', gap: 4, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 9, padding: 3 }}>
          {([['clearances', 'Clearances'], ['interview', 'Exit Interview'], ['completed', 'Completed']] as [Phase, string][]).map(([p, label]) => {
            const on = phase === p
            return (
              <button key={p} onClick={() => { setPhase(p); setTab('overview') }} style={{ padding: '8px 16px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: on ? 700 : 600, whiteSpace: 'nowrap', background: on ? C.indigo : 'transparent', color: on ? '#fff' : C.muted, boxShadow: on ? '0 1px 4px rgba(99,102,241,0.35)' : 'none', transition: 'all 0.12s' }}>
                {label}
              </button>
            )
          })}
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0, fontSize: 10.5, fontWeight: 800, color: C.indigo, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.indigo }} /> Demo · Prototype
        </span>
      </div>

      {/* ── 3 / 9 layout ── */}
      <div className="grid gap-5" style={{ gridTemplateColumns: '3fr 9fr', alignItems: 'start' }}>

        {/* LEFT — vertical tab rail */}
        <div className="flex flex-col gap-3">
          {/* Tabs */}
          {TABS.map(t => {
            const on = tab === t.id
            const Icon = t.Icon
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="relative w-full flex items-center gap-3 text-left"
                style={{
                  background: on ? 'rgba(99,102,241,0.07)' : '#fff',
                  border: `1px solid ${on ? 'rgba(99,102,241,0.35)' : C.border}`,
                  borderRadius: 14, padding: '14px 16px', cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!on) e.currentTarget.style.background = '#FAFBFE' }}
                onMouseLeave={e => { if (!on) e.currentTarget.style.background = '#fff' }}
              >
                {on && <span className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full" style={{ width: 3, height: 26, background: C.indigo }} />}
                <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 36, height: 36, background: on ? 'rgba(99,102,241,0.13)' : C.hover, color: on ? C.indigoDeep : C.muted }}>
                  <Icon size={17} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: on ? C.navy : '#3D4266' }}>{t.label}</span>
                    {t.locked && <Lock size={12} style={{ color: '#B0B4C8' }} />}
                  </div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{t.sub}</div>
                </div>
              </button>
            )
          })}
        </div>

        {/* RIGHT — content */}
        <div>
          {tab === 'overview'  && <OverviewTab phase={phase} statusMeta={statusMeta} daysLeft={daysLeft} />}
          {tab === 'interview' && <InterviewTab locked={interviewLocked} submitted={phase === 'completed'} />}
          {tab === 'documents' && <DocumentsTab locked={docsLocked} />}
        </div>
      </div>
    </div>
  )
}

/* ════════════════════ OVERVIEW (tracker) ════════════════════ */
function OverviewTab({ phase, statusMeta, daysLeft }: { phase: Phase; statusMeta: { label: string; color: string; bg: string }; daysLeft: number }) {
  const depts = departments(phase)
  const cleared = depts.slice(1, 4).filter(d => d.state === 'completed').length // PM/IT/Finance done

  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
      <div className="flex flex-col" style={{ gap: 28 }}>
        {/* Status banner */}
        <div className="flex items-center gap-4" style={{ background: statusMeta.bg, borderRadius: 14, padding: '18px 20px' }}>
          <div className="flex items-center justify-center rounded-2xl flex-shrink-0" style={{ width: 52, height: 52, background: '#fff' }}>
            {phase === 'completed'
              ? <CheckCircle2 size={26} strokeWidth={1.8} style={{ color: statusMeta.color }} />
              : <CalendarClock size={26} strokeWidth={1.8} style={{ color: statusMeta.color }} />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2.5">
              <span style={{ fontSize: 17, fontWeight: 800, color: C.navy, letterSpacing: '-0.2px' }}>
                {phase === 'completed' ? 'Offboarding Completed' : 'Offboarding in Progress'}
              </span>
              <span className="rounded-full" style={{ padding: '4px 11px', background: '#fff', color: statusMeta.color, fontSize: 11, fontWeight: 700 }}>{statusMeta.label}</span>
            </div>
            <div style={{ fontSize: 13, color: '#5C6080', marginTop: 3 }}>
              {phase === 'completed'
                ? 'All formalities are complete. Your documents are available under Exit Documents.'
                : 'Your notice period is running. Departments are completing their clearances.'}
            </div>
          </div>
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard Icon={CalendarClock} label="Notice Period" value={`${NOTICE_DAYS} days`} accent={C.indigo} />
          <StatCard Icon={Clock3}        label="Last Working Day" value={fmtDate(LWD)} accent={C.indigo} />
          <StatCard Icon={Clock3}        label="Days Remaining" value={phase === 'completed' ? '0 days' : `${daysLeft} days`} accent={C.amber} />
          <StatCard Icon={CheckCircle2}  label="Clearances" value={`${phase === 'completed' ? 3 : cleared} of 3`} accent={C.green} />
        </div>

        {/* Department status */}
        <div>
          <div className="flex items-center gap-2.5" style={{ marginBottom: 12 }}>
            <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 32, height: 32, background: 'rgba(99,102,241,0.10)', color: C.indigoDeep }}>
              <Users size={15} strokeWidth={2} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Clearance Status</span>
            <span className="ml-auto" style={{ fontSize: 12, color: C.muted }}>Live view across departments</span>
          </div>
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
            {depts.map((d, i) => {
              const m = STATE_META[d.state]
              const Icon = d.Icon
              return (
                <div key={i} className="flex items-center gap-4" style={{ padding: '14px 16px', borderTop: i === 0 ? 'none' : `1px solid ${C.border}` }}>
                  <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 40, height: 40, background: C.hover, color: '#5C6080' }}>
                    <Icon size={18} strokeWidth={1.9} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{d.role}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>{d.who} · {d.task}</div>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full flex-shrink-0" style={{ padding: '5px 12px', background: m.bg, color: m.color, fontSize: 11.5, fontWeight: 700 }}>
                    {(d.state === 'approved' || d.state === 'completed') && <CheckCircle2 size={12} />}
                    {m.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════ EXIT INTERVIEW ════════════════════ */
function InterviewTab({ locked, submitted: alreadySubmitted }: { locked: boolean; submitted: boolean }) {
  const [rating, setRating] = useState(0)
  const [hover, setHover]   = useState(0)
  const [recommend, setRecommend] = useState('')
  const [enjoyed, setEnjoyed] = useState('')
  const [improve, setImprove] = useState('')
  const [suggest, setSuggest] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (locked) {
    return <LockedPanel Icon={MessageSquareText} title="Exit Interview isn't open yet" text="HR will open your exit interview near your last working day. You'll be able to share your feedback here once it's available." />
  }

  if (alreadySubmitted || submitted) {
    // Show the employee's submitted responses (dummy fallbacks for the completed-phase demo).
    const shown = {
      rating:    rating || 4,
      enjoyed:   enjoyed.trim()   || 'The people and the collaborative engineering culture. I learned a lot from the mentorship on the platform team and genuinely enjoyed working on challenging problems.',
      improve:   improve.trim()   || 'Clearer cross-team roadmap visibility and a more structured onboarding for new joiners would help.',
      recommend: recommend        || 'Yes',
      suggest:   suggest.trim()   || 'Keep investing in engineering growth and regular knowledge-sharing sessions.',
    }
    return (
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
        {/* small green success banner */}
        <div style={{ padding: '20px 24px 0' }}>
          <div className="flex items-center gap-2.5" style={{ background: 'rgba(14,168,106,0.09)', border: '1px solid rgba(14,168,106,0.25)', borderRadius: 10, padding: '11px 14px' }}>
            <CheckCircle2 size={17} strokeWidth={2} style={{ color: C.green, flexShrink: 0 }} />
            <span style={{ fontSize: 12.5, fontWeight: 700, color: '#0A8A58' }}>Exit Interview Submitted</span>
            <span className="ml-auto" style={{ fontSize: 11.5, color: '#5C8A72' }}>Reviewed by HR as part of your closure</span>
          </div>
        </div>

        {/* filled responses (read-only) */}
        <div style={{ padding: '20px 24px 24px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>Your Responses</div>

          <div className="flex flex-col gap-5">
            {/* Overall experience */}
            <div>
              <label style={fieldLabel}>Overall experience</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <Star key={n} size={20} strokeWidth={1.6} style={{ color: shown.rating >= n ? '#F5B400' : '#D8DCE8', fill: shown.rating >= n ? '#F5B400' : 'transparent' }} />
                ))}
                <span style={{ fontSize: 12.5, fontWeight: 600, color: C.muted, marginLeft: 6 }}>{['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][shown.rating - 1]}</span>
              </div>
            </div>

            <ReadOnlyAnswer label="What did you enjoy most?" value={shown.enjoyed} />
            <ReadOnlyAnswer label="What could we improve?" value={shown.improve} />

            {/* Recommend */}
            <div>
              <label style={fieldLabel}>Would you recommend us as a place to work?</label>
              <span className="inline-flex items-center gap-1.5 rounded-full" style={{ padding: '6px 14px', background: 'rgba(99,102,241,0.08)', border: `1px solid rgba(99,102,241,0.28)`, color: C.indigoDeep, fontSize: 13, fontWeight: 700 }}>{shown.recommend}</span>
            </div>

            <ReadOnlyAnswer label="Any suggestions for us?" value={shown.suggest} />
          </div>
        </div>
      </div>
    )
  }

  const canSubmit = rating > 0 && recommend && enjoyed.trim()

  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
      <div className="flex items-center gap-2.5" style={{ padding: '16px 24px', borderBottom: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 32, height: 32, background: 'rgba(99,102,241,0.10)', color: C.indigoDeep }}>
          <MessageSquareText size={15} strokeWidth={2} />
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Exit Interview</span>
        <span className="ml-auto" style={{ fontSize: 12, color: C.muted }}>Your feedback stays confidential with HR</span>
      </div>

      <div style={{ padding: '24px' }}>
        {/* Overall experience */}
        <div className="mb-6">
          <label style={fieldLabel}>Overall experience <span style={{ color: '#E84855' }}>*</span></label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} onClick={() => setRating(n)} onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, lineHeight: 0 }}>
                <Star size={28} strokeWidth={1.6} style={{ color: (hover || rating) >= n ? '#F5B400' : '#D8DCE8', fill: (hover || rating) >= n ? '#F5B400' : 'transparent', transition: 'all 0.12s' }} />
              </button>
            ))}
            {rating > 0 && <span style={{ fontSize: 12.5, fontWeight: 600, color: C.muted, marginLeft: 8 }}>{['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating - 1]}</span>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 mb-6">
          <div>
            <label style={fieldLabel}>What did you enjoy most? <span style={{ color: '#E84855' }}>*</span></label>
            <textarea value={enjoyed} onChange={e => setEnjoyed(e.target.value)} rows={4} placeholder="The people, projects, culture…" style={textareaStyle(enjoyed)} />
          </div>
          <div>
            <label style={fieldLabel}>What could we improve?</label>
            <textarea value={improve} onChange={e => setImprove(e.target.value)} rows={4} placeholder="Anything that would have made your experience better…" style={textareaStyle(improve)} />
          </div>
        </div>

        {/* Recommend */}
        <div className="mb-6">
          <label style={fieldLabel}>Would you recommend us as a place to work? <span style={{ color: '#E84855' }}>*</span></label>
          <div className="flex items-center gap-2.5">
            {['Yes', 'Maybe', 'No'].map(opt => {
              const on = recommend === opt
              return (
                <button key={opt} onClick={() => setRecommend(opt)} style={{ padding: '9px 22px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: `1px solid ${on ? C.indigo : C.border}`, background: on ? 'rgba(99,102,241,0.08)' : '#fff', color: on ? C.indigoDeep : C.muted, transition: 'all 0.15s' }}>
                  {opt}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mb-7">
          <label style={fieldLabel}>Any suggestions for us?</label>
          <textarea value={suggest} onChange={e => setSuggest(e.target.value)} rows={3} placeholder="Optional parting thoughts…" style={textareaStyle(suggest)} />
        </div>

        <div className="flex items-center gap-2.5" style={{ padding: '11px 14px', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 10, marginBottom: 20 }}>
          <Info size={15} style={{ color: C.indigoDeep, flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: '#4A4F86', lineHeight: 1.55 }}>Your responses are shared only with HR and used to improve the workplace.</span>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setSubmitted(true)}
            disabled={!canSubmit}
            style={{ height: 44, padding: '0 32px', borderRadius: 10, fontSize: 13.5, fontWeight: 700, border: 'none', background: canSubmit ? 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' : '#D8DCF0', color: '#fff', cursor: canSubmit ? 'pointer' : 'not-allowed', transition: 'opacity 0.15s' }}
            onMouseEnter={e => { if (canSubmit) e.currentTarget.style.opacity = '0.88' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >
            Submit Exit Interview
          </button>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════ EXIT DOCUMENTS ════════════════════ */
function DocumentsTab({ locked }: { locked: boolean }) {
  if (locked) {
    return <LockedPanel Icon={FileCheck2} title="Documents aren't ready yet" text="Once HR completes your closure, your relieving letter, experience letter, and final settlement will appear here to download." />
  }

  const docs = [
    { name: 'Relieving Letter',       meta: 'PDF · 240 KB · Issued 02 Oct 2026', color: C.indigo },
    { name: 'Experience Letter',      meta: 'PDF · 210 KB · Issued 02 Oct 2026', color: C.green  },
    { name: 'Full & Final Settlement', meta: 'PDF · 320 KB · Issued 02 Oct 2026', color: C.amber  },
  ]
  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
      <div className="flex items-center gap-2.5" style={{ padding: '16px 24px', borderBottom: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 32, height: 32, background: 'rgba(14,168,106,0.12)', color: C.green }}>
          <FileCheck2 size={15} strokeWidth={2} />
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Exit Documents</span>
        <span className="ml-auto rounded-full" style={{ padding: '4px 11px', background: 'rgba(14,168,106,0.12)', color: '#0A8A58', fontSize: 11, fontWeight: 700 }}>Ready</span>
      </div>
      <div style={{ padding: '10px 16px 16px' }}>
        {docs.map((d, i) => (
          <div key={i} className="flex items-center gap-4" style={{ padding: '14px 12px', borderTop: i === 0 ? 'none' : `1px solid ${C.border}` }}>
            <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 42, height: 42, background: `${d.color}14`, color: d.color }}>
              <FileCheck2 size={19} strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{d.name}</div>
              <div style={{ fontSize: 11.5, color: C.muted, marginTop: 1 }}>{d.meta}</div>
            </div>
            <button className="flex items-center gap-2" style={{ height: 38, padding: '0 16px', borderRadius: 10, fontSize: 12.5, fontWeight: 600, border: `1px solid ${C.border}`, background: '#fff', color: C.indigoDeep, cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.06)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}
            >
              <Download size={14} /> Download
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ════════════════════ small shared bits ════════════════════ */
function StatCard({ Icon, label, value, accent }: { Icon: React.ElementType; label: string; value: string; accent: string }) {
  return (
    <div style={{ background: '#FAFBFE', border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 16px' }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 26, height: 26, background: `${accent}16`, color: accent }}><Icon size={13} strokeWidth={2.2} /></div>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      </div>
      <div style={{ fontSize: 17, fontWeight: 800, color: C.navy, letterSpacing: '-0.3px' }}>{value}</div>
    </div>
  )
}

function ReadOnlyAnswer({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label style={fieldLabel}>{label}</label>
      <div style={{ background: '#F7F8FC', border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 14px', fontSize: 13.5, color: C.navy, lineHeight: 1.65 }}>{value}</div>
    </div>
  )
}

function LockedPanel({ Icon, title, text }: { Icon: React.ElementType; title: string; text: string }) {
  return (
    <div style={{ background: '#fff', border: `1px dashed ${C.border}`, borderRadius: 16, padding: '52px 32px', textAlign: 'center' }}>
      <div className="flex items-center justify-center mx-auto mb-4 rounded-2xl" style={{ width: 60, height: 60, background: C.hover, position: 'relative' }}>
        <Icon size={26} strokeWidth={1.7} style={{ color: '#B0B4C8' }} />
        <div className="flex items-center justify-center rounded-full" style={{ position: 'absolute', bottom: -4, right: -4, width: 26, height: 26, background: '#fff', border: `1px solid ${C.border}` }}>
          <Lock size={13} style={{ color: C.muted }} />
        </div>
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 8 }}>{title}</div>
      <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, maxWidth: 440, margin: '0 auto' }}>{text}</p>
    </div>
  )
}

const fieldLabel: React.CSSProperties = { fontSize: 11.5, fontWeight: 700, color: C.muted, display: 'block', marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }
function textareaStyle(val: string): React.CSSProperties {
  return { width: '100%', borderRadius: 10, border: `1px solid ${C.border}`, background: val ? '#F5F6FF' : '#fff', padding: '12px 14px', fontSize: 13.5, fontWeight: 400, color: C.navy, resize: 'vertical', outline: 'none', fontFamily: "'DM Sans', system-ui, sans-serif", lineHeight: 1.6, boxSizing: 'border-box' }
}
