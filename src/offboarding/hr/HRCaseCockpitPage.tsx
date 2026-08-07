import { useState } from 'react'
import {
  ArrowLeft, CheckCircle2, PauseCircle, Clock3, Lock, Info,
  Mail, Phone, Briefcase, UserCircle2, CalendarDays, CalendarClock,
  ShieldCheck, Users, MonitorCheck, Wallet, FileCheck2, FileText,
  Star, MessageSquareText, Hourglass, Award, ScrollText, Receipt,
  Upload, Landmark, Send,
} from 'lucide-react'
import {
  isClearanceDone, clearedCount, overallStage, STAGE_META, fmtDate, TODAY,
  type HRCase, type DeptKey, type DeptStatus,
} from './hrData'

/*
 * HR › Case Cockpit — Screens H2 + H3.
 *
 * The single-case control room, opened from the HR Dashboard (H1) row → Open, and
 * later from the Offboarding Cases menu. Five tabs walk the whole journey:
 *   CTO · Manager · System Admin · Finance  — read-only mirrors of what each
 *      department submitted (status, who/when, checklists, IT assets, F&F net,
 *      remarks, holds).
 *   HR  — H3 closure: locked until all 4 clearances are done, then review the
 *      exit interview + issue letters + final formalities → Close Case → Offboarded.
 *
 * Reads entirely from hr/hrData.ts. Same house style as the other detail pages.
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
  red:    '#E84855',
  slate:  '#5A5F82',
}

type TabKey = 'cto' | 'manager' | 'it' | 'finance' | 'hr'

const DEPT_TABS: { key: Exclude<TabKey, 'hr'>; dept: DeptKey; label: string; Icon: React.ElementType }[] = [
  { key: 'cto',     dept: 'cto',     label: 'CTO',          Icon: ShieldCheck  },
  { key: 'manager', dept: 'manager', label: 'Manager',      Icon: Users        },
  { key: 'it',      dept: 'it',      label: 'System Admin', Icon: MonitorCheck },
  { key: 'finance', dept: 'finance', label: 'Finance',      Icon: Wallet       },
]

const DOT: Record<DeptStatus, { color: string; bg: string; label: string }> = {
  approved: { color: C.green, bg: 'rgba(14,168,106,0.14)', label: 'Approved'    },
  cleared:  { color: C.green, bg: 'rgba(14,168,106,0.14)', label: 'Cleared'     },
  pending:  { color: C.amber, bg: 'rgba(217,119,6,0.14)',  label: 'Pending'     },
  'on-hold':{ color: C.red,   bg: 'rgba(232,72,85,0.14)',  label: 'On Hold'     },
  rejected: { color: C.red,   bg: 'rgba(232,72,85,0.14)',  label: 'Rejected'    },
  awaiting: { color: C.slate, bg: 'rgba(91,95,130,0.12)',  label: 'Awaiting CTO'},
}

/* Exit documents HR prepares OUTSIDE the app and uploads, then shares (H3).
 * `sample` is only a placeholder filename for already-closed / seeded cases. */
type DocId = 'experience' | 'relieving' | 'pf' | 'fnf'
const DOCS: { id: DocId; label: string; desc: string; sample: string; Icon: React.ElementType }[] = [
  { id: 'experience', label: 'Experience Letter', desc: 'Certifies tenure, role and conduct.',              sample: 'Experience_Letter.pdf', Icon: Award      },
  { id: 'relieving',  label: 'Relieving Letter',  desc: 'Confirms formal release on the last working day.', sample: 'Relieving_Letter.pdf',  Icon: ScrollText },
  { id: 'pf',         label: 'PF Documents',      desc: 'PF withdrawal / transfer forms.',                  sample: 'PF_Documents.pdf',      Icon: Landmark   },
  { id: 'fnf',        label: 'F&F Settlement',    desc: 'Full & final settlement statement.',               sample: 'FnF_Settlement.pdf',    Icon: Receipt    },
]

/* A generic exit-interview response used when demoing the open→submit loop for a
 * case that has no real submission recorded in hrData. */
const DEMO_INTERVIEW = {
  rating: 4, recommend: 'Yes',
  enjoyed: 'The supportive team and the ownership I was given on the platform work.',
  improve: 'Clearer growth paths and more structured feedback cycles.',
  suggest: 'Keep investing in mentoring and cross-team collaboration.',
}

type InterviewState = 'not-published' | 'awaiting' | 'submitted' | 'reviewed'

/* Default exit-interview questionnaire HR publishes to the employee. */
const EXIT_TEMPLATE: { q: string; tag: string }[] = [
  { q: 'Overall, how would you rate your experience with us?', tag: 'Rating · 1–5' },
  { q: 'Would you recommend us as a place to work?',           tag: 'Yes / No'     },
  { q: 'What did you enjoy most about working here?',          tag: 'Short answer' },
  { q: 'What could we have done better?',                      tag: 'Short answer' },
  { q: 'Any suggestions for us going forward?',                tag: 'Short answer' },
]

function tenure(doj: string) {
  const s = new Date(doj)
  let months = (TODAY.getFullYear() - s.getFullYear()) * 12 + (TODAY.getMonth() - s.getMonth())
  if (TODAY.getDate() < s.getDate()) months--
  const y = Math.floor(months / 12), m = months % 12
  return `${y}y ${m}m`
}
function inr(n: number) { return '₹' + n.toLocaleString('en-IN') }

export default function HRCaseCockpitPage({
  c, onBack, backLabel = 'Offboarding Dashboard',
}: {
  c: HRCase
  onBack: () => void
  backLabel?: string
}) {
  const [tab, setTab] = useState<TabKey>('cto')

  const done = clearedCount(c)
  const allCleared = done === 4
  const stage = overallStage(c)
  const sm = STAGE_META[stage]
  const dateShown = c.lwd ?? c.intendedLwd

  // H3 close-case modal state (live, prototype-only). The HR actions
  // (open interview / issue documents) that gate closing live inside HRTab.
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitting, setSubmitting]   = useState(false)
  const [closedLive, setClosedLive]   = useState(false)

  const isClosed = c.hrClosed || closedLive

  // status shown on each HR tab dot
  const hrDot = isClosed
    ? { color: C.green, bg: 'rgba(14,168,106,0.14)', label: 'Closed' }
    : allCleared
      ? { color: C.indigoDeep, bg: 'rgba(99,102,241,0.14)', label: 'Ready' }
      : { color: C.slate, bg: 'rgba(91,95,130,0.12)', label: 'Waiting' }

  async function confirmClose() {
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1200))
    setSubmitting(false)
    setShowConfirm(false)
    setClosedLive(true)
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@keyframes obSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes obPop{0%{transform:scale(.9);opacity:0}100%{transform:scale(1);opacity:1}}`}</style>

      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2.5 mb-4">
        <button onClick={onBack} className="flex items-center justify-center flex-shrink-0"
          style={{ width: 32, height: 32, borderRadius: 9, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer' }}
          onMouseEnter={e => { e.currentTarget.style.background = C.hover }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}>
          <ArrowLeft size={15} style={{ color: C.muted }} />
        </button>
        <button onClick={onBack} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 13, fontWeight: 500, color: C.muted }}>{backLabel}</button>
        <span style={{ color: '#C8CCE0' }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{c.name}</span>
      </div>

      {/* just-closed success flash */}
      {closedLive && (
        <div className="flex items-center gap-3 mb-4" style={{ animation: 'obPop 0.25s ease', background: 'rgba(14,168,106,0.09)', border: '1px solid rgba(14,168,106,0.28)', borderRadius: 12, padding: '13px 16px' }}>
          <CheckCircle2 size={19} style={{ color: C.green, flexShrink: 0 }} />
          <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0A8A58' }}>
            Case closed — {c.name} has been offboarded. All records are now read-only.
          </span>
        </div>
      )}

      {/* ── Employee identity header ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '20px 24px', marginBottom: 16 }}>
        <div className="flex items-start gap-4">
          <img src={c.avatar} alt={c.name} style={{ width: 62, height: 62, borderRadius: '50%', objectFit: 'cover', border: '3px solid #fff', boxShadow: '0 2px 8px rgba(28,32,53,0.14)', flexShrink: 0 }} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span style={{ fontSize: 19, fontWeight: 800, color: C.navy, letterSpacing: '-0.3px' }}>{c.name}</span>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: C.muted, background: C.hover, padding: '2px 9px', borderRadius: 7 }}>{c.code}</span>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: C.muted, background: C.hover, padding: '2px 9px', borderRadius: 7 }}>{c.id}</span>
            </div>
            <div style={{ fontSize: 13.5, color: '#5C6080', fontWeight: 600, marginTop: 4 }}>{c.designation} · {c.department}</div>
            <div className="flex items-center gap-x-5 gap-y-1.5 flex-wrap" style={{ marginTop: 12 }}>
              <Meta Icon={UserCircle2} label="Reporting Manager" value={c.manager} />
              <Meta Icon={CalendarDays} label="Date of Joining" value={fmtDate(c.doj)} />
              <Meta Icon={Briefcase} label="Tenure" value={tenure(c.doj)} />
              <Meta Icon={Mail} label="Email" value={c.email} />
              <Meta Icon={Phone} label="Phone" value={c.phone} />
            </div>
          </div>
          <div className="flex-shrink-0">
            <span className="rounded-full" style={{ padding: '5px 12px', background: sm.bg, color: sm.color, fontSize: 11.5, fontWeight: 700, whiteSpace: 'nowrap' }}>{sm.label}</span>
          </div>
        </div>
      </div>

      {/* ── Tab bar (clearance progress ring at the right end) ── */}
      <div className="flex items-center gap-1.5 flex-wrap mb-5" style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: 6 }}>
        {DEPT_TABS.map(t => {
          const cl = c.clearances[t.dept]
          const d = DOT[cl.status]
          return <TabButton key={t.key} active={tab === t.key} onClick={() => setTab(t.key)} Icon={t.Icon} label={t.label} dotColor={d.color} done={isClearanceDone(cl)} />
        })}
        <TabButton active={tab === 'hr'} onClick={() => setTab('hr')} Icon={FileCheck2} label="HR Closure" dotColor={hrDot.color} done={isClosed} />
        <div className="ml-auto flex items-center" style={{ paddingRight: 6, paddingLeft: 8 }}>
          <CircleProgress done={done} total={4} />
        </div>
      </div>

      {/* ── Tab content ── */}
      {tab !== 'hr'
        ? <DeptTab tab={tab} c={c} />
        : <HRTab
            c={c} allCleared={allCleared} done={done} isClosed={isClosed}
            onRequestClose={() => setShowConfirm(true)}
            dateShown={dateShown}
          />}

      {/* ── Close-case confirm modal ── */}
      {showConfirm && (
        <Modal onClose={() => !submitting && setShowConfirm(false)} width={440}>
          <div style={{ padding: '26px 28px 20px', borderBottom: '1px solid #F0F2F8' }}>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 40, height: 40, background: 'rgba(14,168,106,0.12)', color: C.green }}>
                <CheckCircle2 size={20} strokeWidth={1.9} />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.navy }}>Close & Offboard?</div>
                <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>This finalises the offboarding</div>
              </div>
            </div>
          </div>
          <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <SummaryRow label="Employee" value={`${c.name} (${c.code})`} />
            <SummaryRow label="Last Working Day" value={fmtDate(dateShown)} />
            <div className="flex items-start gap-2.5" style={{ padding: '11px 14px', background: 'rgba(14,168,106,0.06)', border: '1px solid rgba(14,168,106,0.2)', borderRadius: 10 }}>
              <Info size={15} style={{ color: C.green, flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 12, color: '#0A7A50', lineHeight: 1.55 }}>The case will be marked <strong>Completed / Offboarded</strong> and locked as read-only across all departments.</span>
            </div>
          </div>
          <div className="flex items-center gap-3" style={{ padding: '0 28px 24px' }}>
            <button onClick={() => setShowConfirm(false)} disabled={submitting} style={ghostBtn}>Go Back</button>
            <button onClick={confirmClose} disabled={submitting}
              style={{ flex: 1, height: 44, borderRadius: 11, fontSize: 13.5, fontWeight: 700, border: 'none', color: '#fff', cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: submitting ? 0.85 : 1, background: 'linear-gradient(135deg, #12b877 0%, #0A8A58 100%)' }}>
              {submitting ? <><Spinner /> Closing…</> : 'Yes, Close Case'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

/* ════════════════ TAB BUTTON ════════════════ */
function TabButton({ active, onClick, Icon, label, dotColor, done }: {
  active: boolean; onClick: () => void; Icon: React.ElementType; label: string; dotColor: string; done: boolean
}) {
  // Selected tab: light indigo tint, icon + text + status marker all in one
  // indigo accent (no blue-vs-green clash), no shadow. Inactive: muted text with
  // its status-coloured dot so each department's status still shows at a glance.
  const marker = done
    ? <CheckCircle2 size={13} strokeWidth={2.6} style={{ color: active ? C.indigoDeep : dotColor }} />
    : <span style={{ width: 7, height: 7, borderRadius: '50%', background: active ? C.indigoDeep : dotColor }} />
  return (
    <button onClick={onClick} className="flex items-center gap-2"
      style={{ height: 40, padding: '0 15px', borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s',
        border: `1px solid ${active ? 'rgba(99,102,241,0.22)' : 'transparent'}`,
        background: active ? 'rgba(99,102,241,0.10)' : 'transparent' }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = C.hover }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}>
      <Icon size={15} strokeWidth={2} style={{ color: active ? C.indigoDeep : C.muted }} />
      <span style={{ fontSize: 13, fontWeight: 700, color: active ? C.indigoDeep : '#5C6080' }}>{label}</span>
      {marker}
    </button>
  )
}

/* ════════════════ CLEARANCE PROGRESS RING ════════════════ */
function CircleProgress({ done, total }: { done: number; total: number }) {
  const size = 38, stroke = 4, r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const pct = total ? done / total : 0
  const complete = done === total
  const color = complete ? C.green : C.indigoDeep
  return (
    <div className="flex-shrink-0" title={`${done} of ${total} clearances complete`} style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EEF0F6" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} style={{ transition: 'stroke-dashoffset 0.4s ease' }} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center" style={{ fontSize: 10.5, fontWeight: 800, color }}>{done}/{total}</span>
    </div>
  )
}

/* ════════════════ DEPARTMENT TAB (read-only) ════════════════ */
function DeptTab({ tab, c }: { tab: Exclude<TabKey, 'hr'>; c: HRCase }) {
  const meta = DEPT_TABS.find(t => t.key === tab)!
  const cl = c.clearances[meta.dept]
  const d = DOT[cl.status]
  const isDone = isClearanceDone(cl)
  const dateShown = c.lwd ?? c.intendedLwd

  const roleLabels: Record<DeptKey, string> = {
    cto: 'Delivery Head (CTO)', manager: 'Reporting Manager', it: 'System Admin (IT)', finance: 'Finance Manager',
  }

  return (
    <div className="grid gap-5" style={{ gridTemplateColumns: '8fr 4fr', alignItems: 'start' }}>
      {/* LEFT — details */}
      <div className="flex flex-col gap-5">
        {/* status strip */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
          <div className="flex items-center gap-3" style={{ padding: '16px 22px', background: d.bg }}>
            <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 42, height: 42, background: '#fff' }}>
              <meta.Icon size={20} strokeWidth={1.9} style={{ color: d.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div style={{ fontSize: 15, fontWeight: 800, color: C.navy }}>{meta.label} Clearance</div>
              <div style={{ fontSize: 12.5, color: '#5C6080', fontWeight: 600, marginTop: 1 }}>{roleLabels[meta.dept]}</div>
            </div>
            <span className="rounded-full flex-shrink-0" style={{ padding: '5px 13px', background: '#fff', color: d.color, fontSize: 12, fontWeight: 800 }}>{d.label}</span>
          </div>
          <div style={{ padding: '16px 22px' }}>
            <div className="grid grid-cols-3 gap-3">
              <MiniInfo Icon={UserCircle2} label="Actioned By" value={cl.by ?? '—'} />
              <MiniInfo Icon={CalendarClock} label="Decided On" value={cl.on ? fmtDate(cl.on) : '—'} />
              {meta.dept === 'cto'
                ? <MiniInfo Icon={Clock3} label="Notice Period" value={cl.noticeDays ? `${cl.noticeDays} days` : '—'} accent={isDone ? C.green : undefined} />
                : meta.dept === 'finance' && cl.net != null
                  ? <MiniInfo Icon={Wallet} label="Net F&F Payable" value={inr(cl.net)} accent={C.green} />
                  : <MiniInfo Icon={CalendarDays} label="Last Working Day" value={fmtDate(dateShown)} />}
            </div>
            {cl.summary && (
              <div className="flex items-center gap-2" style={{ marginTop: 14, fontSize: 13, color: '#3D4266', fontWeight: 600 }}>
                <Info size={14} style={{ color: C.muted, flexShrink: 0 }} /> {cl.summary}
              </div>
            )}
          </div>
        </div>

        {/* on-hold reason */}
        {cl.status === 'on-hold' && cl.holdReason && (
          <Card title="Hold Reason" Icon={PauseCircle} accent={C.red}>
            <div style={{ padding: '16px 22px' }}>
              <div style={{ padding: '13px 15px', background: 'rgba(232,72,85,0.05)', borderRadius: 12, borderLeft: `3px solid ${C.red}`, fontSize: 13.5, color: '#3D4266', lineHeight: 1.65 }}>
                “{cl.holdReason}”
              </div>
              <p style={{ fontSize: 11.5, color: C.muted, marginTop: 10, lineHeight: 1.5 }}>
                The department can resume and clear once the blocker is resolved. No send-back is required.
              </p>
            </div>
          </Card>
        )}

        {/* CTO special: no checklist — approval note */}
        {meta.dept === 'cto' && isDone && (
          <Card title="Approval" Icon={ShieldCheck}>
            <div style={{ padding: '16px 22px' }}>
              <div className="flex items-start gap-3" style={{ padding: '14px 16px', background: 'rgba(14,168,106,0.05)', border: '1px solid rgba(14,168,106,0.22)', borderRadius: 12 }}>
                <CheckCircle2 size={18} style={{ color: C.green, flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>Request approved by the Delivery Head</div>
                  <div style={{ fontSize: 12.5, color: '#5C6080', marginTop: 2, lineHeight: 1.55 }}>
                    Notice period set to <strong>{cl.noticeDays} days</strong>. Manager, IT and Finance clearances were opened in parallel on approval.
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* checklist (Manager / IT / Finance) */}
        {cl.checklist && cl.checklist.length > 0 && (
          <Card title={meta.dept === 'it' ? 'Assets & Access' : meta.dept === 'finance' ? 'Settlement Checklist' : 'Handover Checklist'} Icon={FileCheck2}>
            <div style={{ padding: '16px 22px' }}>
              <div className="flex flex-col gap-2">
                {cl.checklist.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5" style={{ padding: '10px 12px', background: item.done ? 'rgba(14,168,106,0.05)' : '#F7F8FC', border: `1px solid ${item.done ? 'rgba(14,168,106,0.22)' : C.border}`, borderRadius: 10 }}>
                    <CheckCircle2 size={16} strokeWidth={2.2} style={{ color: item.done ? C.green : '#C8CCE0', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: item.done ? '#0A8A58' : C.muted }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* remarks */}
        {cl.remarks && (
          <Card title="Remarks" Icon={MessageSquareText}>
            <div style={{ padding: '16px 22px' }}>
              <div style={{ padding: '13px 15px', background: '#F7F8FC', borderRadius: 12, fontSize: 13, color: '#3D4266', lineHeight: 1.65 }}>{cl.remarks}</div>
            </div>
          </Card>
        )}

        {/* not-yet-actioned states */}
        {(cl.status === 'pending' || cl.status === 'awaiting') && (
          <Card title="Status" Icon={cl.status === 'awaiting' ? Lock : Hourglass}>
            <div style={{ padding: '16px 22px' }}>
              <div className="flex items-start gap-3" style={{ padding: '14px 16px', background: d.bg, borderRadius: 12 }}>
                {cl.status === 'awaiting' ? <Lock size={18} style={{ color: d.color, flexShrink: 0, marginTop: 1 }} /> : <Hourglass size={18} style={{ color: d.color, flexShrink: 0, marginTop: 1 }} />}
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>
                    {cl.status === 'awaiting' ? 'Locked until CTO approves' : `Awaiting ${meta.label} clearance`}
                  </div>
                  <div style={{ fontSize: 12.5, color: '#5C6080', marginTop: 2, lineHeight: 1.55 }}>
                    {cl.status === 'awaiting'
                      ? 'This clearance opens automatically once the Delivery Head approves the request.'
                      : 'The department has been notified and has not submitted its clearance yet.'}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* RIGHT — at a glance */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', position: 'sticky', top: 8 }}>
        <div className="flex items-center gap-2.5" style={{ padding: '15px 20px', borderBottom: `1px solid ${C.border}` }}>
          <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 32, height: 32, background: 'rgba(99,102,241,0.10)', color: C.indigoDeep }}>
            <Info size={15} strokeWidth={2} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>At a Glance</span>
        </div>
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <GlanceRow label="Department" value={meta.label} />
          <GlanceRow label="Status" value={d.label} valueColor={d.color} />
          <GlanceRow label="Actioned By" value={cl.by ?? 'Not yet'} />
          <GlanceRow label="Decided On" value={cl.on ? fmtDate(cl.on) : '—'} />
          {meta.dept === 'finance' && cl.net != null && <GlanceRow label="Net F&F" value={inr(cl.net)} valueColor={C.green} />}
          {meta.dept === 'cto' && cl.noticeDays != null && <GlanceRow label="Notice" value={`${cl.noticeDays} days`} />}
        </div>
      </div>
    </div>
  )
}

/* ════════════════ HR TAB (H3 — actions + closure) ════════════════ */
function HRTab({
  c, allCleared, done, isClosed, onRequestClose, dateShown,
}: {
  c: HRCase; allCleared: boolean; done: number; isClosed: boolean
  onRequestClose: () => void; dateShown: string
}) {
  // HR actions unlock only once ALL 4 clearances are complete (near the last
  // working day). HR then opens the exit interview → reviews it, and uploads
  // the prepared documents → shares them. Closing is gated on all of these.
  const [interview, setInterview] = useState<InterviewState>(c.hrClosed ? 'reviewed' : 'not-published')
  const [uploads, setUploads] = useState<Record<DocId, string | null>>(
    c.hrClosed
      ? (Object.fromEntries(DOCS.map(d => [d.id, d.sample])) as Record<DocId, string | null>)
      : { experience: null, relieving: null, pf: null, fnf: null }
  )
  const [sharedLive, setSharedLive] = useState(false)

  // once the case is closed, everything is done + read-only
  const ivState: InterviewState = isClosed ? 'reviewed' : interview
  const files: Record<DocId, string | null> = isClosed
    ? (Object.fromEntries(DOCS.map(d => [d.id, uploads[d.id] ?? d.sample])) as Record<DocId, string | null>)
    : uploads
  const answers = c.exitInterview.submitted ? c.exitInterview : DEMO_INTERVIEW

  const interviewReviewed = ivState === 'reviewed'
  const uploadedCount = DOCS.filter(d => files[d.id]).length
  const allUploaded = uploadedCount === DOCS.length
  const docsShared = isClosed || sharedLive
  const canClose = allCleared && interviewReviewed && docsShared && !isClosed

  const pendingDepts = (['cto', 'manager', 'it', 'finance'] as DeptKey[]).filter(k => !isClearanceDone(c.clearances[k]))
  const DEPT_SHORT: Record<DeptKey, string> = { cto: 'CTO', manager: 'Manager', it: 'System Admin', finance: 'Finance' }
  const sharedOn = fmtDate(TODAY.toISOString().split('T')[0])

  return (
    <div className="grid gap-5" style={{ gridTemplateColumns: '8fr 4fr', alignItems: 'start' }}>
      {/* LEFT — HR actions unlock at 4/4 clearances */}
      <div className="flex flex-col gap-5">
        {!allCleared ? (
          <Card title="HR Actions" Icon={FileCheck2}>
            <div style={{ padding: '18px 22px' }}>
              <div className="flex items-start gap-3" style={{ padding: '14px 16px', background: 'rgba(91,95,130,0.08)', border: '1px solid rgba(91,95,130,0.2)', borderRadius: 12 }}>
                <Lock size={18} style={{ color: C.slate, flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>HR actions open once all clearances are complete</div>
                  <div style={{ fontSize: 12.5, color: '#5C6080', marginTop: 2, lineHeight: 1.55 }}>
                    {done}/4 clearances done — waiting on {pendingDepts.map(k => DEPT_SHORT[k]).join(', ')}. Once all four are complete, you can open the exit interview and upload the exit documents here.
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <>
            {/* Exit Interview — HR publishes template → employee submits → HR reviews */}
            <Card title="Exit Interview" Icon={MessageSquareText}>
              <div style={{ padding: '16px 22px 18px' }}>
                {/* status badge, right-aligned — only for Awaiting / Reviewed */}
                {(ivState === 'awaiting' || ivState === 'reviewed') && (
                  <div className="flex justify-end mb-3">
                    <IvStatusPill state={ivState} />
                  </div>
                )}

                {ivState === 'not-published' && (
                  <div className="flex items-center justify-between gap-3" style={{ padding: '15px 16px', background: '#F7F8FC', border: `1px solid ${C.border}`, borderRadius: 12 }}>
                    <div className="min-w-0">
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Exit Interview Template</div>
                      <div style={{ fontSize: 12, color: C.muted, marginTop: 2, lineHeight: 1.5 }}>
                        Standard {EXIT_TEMPLATE.length}-question exit survey sent to the employee's My Offboarding screen.
                      </div>
                    </div>
                    <AsyncButton busyLabel="Publishing…" onDone={() => setInterview('awaiting')}
                      className="flex items-center justify-center gap-1.5 flex-shrink-0"
                      style={{ height: 34, padding: '0 13px', borderRadius: 9, fontSize: 12, fontWeight: 700, border: `1px dashed ${C.indigo}`, background: 'rgba(99,102,241,0.07)', color: C.indigoDeep }}>
                      <Send size={14} /> Publish
                    </AsyncButton>
                  </div>
                )}

                {ivState === 'awaiting' && (
                  <>
                    <div className="flex items-start gap-3" style={{ padding: '13px 15px', background: 'rgba(217,119,6,0.07)', border: '1px solid rgba(217,119,6,0.22)', borderRadius: 12 }}>
                      <Hourglass size={17} style={{ color: C.amber, flexShrink: 0, marginTop: 1 }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Published — waiting for the employee's response</div>
                        <div style={{ fontSize: 12, color: '#5C6080', marginTop: 2, lineHeight: 1.5 }}>Their answers will appear here once submitted.</div>
                      </div>
                    </div>
                    <button onClick={() => setInterview('submitted')}
                      className="flex items-center justify-center gap-2 w-full"
                      style={{ marginTop: 12, height: 38, borderRadius: 10, fontSize: 12, fontWeight: 600, border: `1px dashed ${C.border}`, background: '#fff', color: C.muted, cursor: 'pointer' }}>
                      ▷ Simulate employee submission (prototype)
                    </button>
                  </>
                )}

                {(ivState === 'submitted' || ivState === 'reviewed') && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: C.muted }}>Overall Experience</span>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map(n => (
                            <Star key={n} size={16} strokeWidth={2}
                              style={{ color: n <= (answers.rating ?? 0) ? C.amber : '#D8DBEA', fill: n <= (answers.rating ?? 0) ? C.amber : 'transparent' }} />
                          ))}
                        </div>
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: C.navy }}>{answers.rating}/5</span>
                      </div>
                      {answers.recommend && (
                        <span className="rounded-full" style={{ padding: '4px 11px', background: 'rgba(14,168,106,0.10)', color: '#0A8A58', fontSize: 11.5, fontWeight: 700 }}>Would recommend: {answers.recommend}</span>
                      )}
                    </div>
                    <div className="flex flex-col gap-3">
                      <QA label="What did you enjoy most?" value={answers.enjoyed} />
                      <QA label="What could we improve?" value={answers.improve} />
                      <QA label="Any suggestions for us?" value={answers.suggest} />
                    </div>
                    {ivState === 'submitted' && (
                      <AsyncButton busyLabel="Saving…" onDone={() => setInterview('reviewed')}
                        className="flex items-center gap-1.5"
                        style={{ marginTop: 14, padding: 0, border: 'none', background: 'none', color: C.green, fontSize: 13, fontWeight: 700 }}>
                        <CheckCircle2 size={15} /> Mark as Reviewed
                      </AsyncButton>
                    )}
                  </>
                )}
              </div>
            </Card>

            {/* Documents — HR uploads prepared files, then shares with employee */}
            <Card title="Exit Documents" Icon={FileText}>
              <div style={{ padding: '14px 22px 18px' }}>
                <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.55, marginBottom: 2 }}>
                  Upload the prepared documents (signed PDFs from payroll / other systems), then share them with the employee.
                </p>
                {DOCS.map((doc, i) => (
                  <DocRow key={doc.id} doc={doc} first={i === 0} filename={files[doc.id]} readOnly={docsShared}
                    onUpload={name => setUploads(p => ({ ...p, [doc.id]: name }))} />
                ))}

                <div style={{ marginTop: 16 }}>
                  {docsShared ? (
                    <div className="flex items-center gap-2.5" style={{ padding: '12px 14px', background: 'rgba(14,168,106,0.06)', border: '1px solid rgba(14,168,106,0.22)', borderRadius: 11 }}>
                      <CheckCircle2 size={17} style={{ color: C.green, flexShrink: 0 }} />
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: '#0A8A58' }}>Documents shared with the employee on {sharedOn}</span>
                    </div>
                  ) : (
                    <>
                      <AsyncButton busyLabel="Sharing…" onDone={() => setSharedLive(true)} disabled={!allUploaded}
                        className="flex items-center justify-center gap-2 w-full"
                        style={{ height: 46, borderRadius: 11, fontSize: 14, fontWeight: 700, border: 'none', color: '#fff', background: allUploaded ? 'linear-gradient(135deg, #6366F1 0%, #5B5FDE 100%)' : '#BFC3E0' }}>
                        <Send size={16} /> Share with Employee
                      </AsyncButton>
                      <p style={{ fontSize: 11, color: C.muted, textAlign: 'center', marginTop: 8 }}>
                        {allUploaded ? 'All documents uploaded — ready to share.' : `Upload all documents to share (${uploadedCount}/${DOCS.length} uploaded).`}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* RIGHT — closure readiness / close */}
      <div>
        {isClosed ? (
          <ClosedPanel c={c} />
        ) : (
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', position: 'sticky', top: 8 }}>
            <div className="flex items-center gap-2.5" style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
              <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 32, height: 32, background: 'rgba(99,102,241,0.10)', color: C.indigoDeep }}>
                <FileCheck2 size={16} strokeWidth={2} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Closure Readiness</span>
            </div>
            <div style={{ padding: 20 }}>
              <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.55, marginBottom: 14 }}>
                Reflects the actual clearances and HR actions — each item ticks itself as it's completed.
              </p>
              <div className="flex flex-col gap-2 mb-4">
                <ReadyRow done={allCleared} label={`Department clearances · ${done}/4`}
                  hint={allCleared ? 'All four departments cleared' : `Waiting on ${pendingDepts.map(k => DEPT_SHORT[k]).join(', ')}`} />
                <ReadyRow done={interviewReviewed} label="Exit interview reviewed"
                  hint={interviewReviewed ? 'Feedback reviewed' : !allCleared ? 'Unlocks after clearances' : ivState === 'not-published' ? 'Publish the interview first' : ivState === 'awaiting' ? 'Awaiting employee submission' : 'Review the submitted responses'} />
                <ReadyRow done={docsShared} label="Exit documents shared"
                  hint={docsShared ? `Shared ${sharedOn}` : !allCleared ? 'Unlocks after clearances' : allUploaded ? 'Uploaded — ready to share' : `Upload documents (${uploadedCount}/${DOCS.length})`} />
              </div>

              <button onClick={onRequestClose} disabled={!canClose}
                className="flex items-center justify-center gap-2 w-full"
                style={{ height: 46, borderRadius: 11, fontSize: 14, fontWeight: 700, border: 'none', color: '#fff', cursor: canClose ? 'pointer' : 'not-allowed', background: canClose ? 'linear-gradient(135deg, #12b877 0%, #0A8A58 100%)' : '#A9D9C4', boxShadow: canClose ? '0 2px 8px rgba(14,168,106,0.3)' : 'none' }}>
                <CheckCircle2 size={17} /> Close Case &amp; Offboard
              </button>
              {!canClose && <p style={{ fontSize: 11, color: C.muted, textAlign: 'center', marginTop: 10 }}>Finish every item above to close the case.</p>}
              <p style={{ fontSize: 11, color: C.muted, textAlign: 'center', marginTop: 12, lineHeight: 1.5 }}>
                Closing sets the last working day to <strong>{fmtDate(dateShown)}</strong> and locks the case.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── HR-action helpers ── */
function AsyncButton({ children, busyLabel, onDone, disabled, className, style }: {
  children: React.ReactNode; busyLabel: string; onDone: () => void; disabled?: boolean; className?: string; style?: React.CSSProperties
}) {
  const [busy, setBusy] = useState(false)
  async function run() {
    if (busy || disabled) return
    setBusy(true)
    await new Promise(r => setTimeout(r, 1000))
    setBusy(false)
    onDone()
  }
  return (
    <button onClick={run} disabled={busy || disabled} className={className}
      style={{ ...style, cursor: busy || disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.55 : busy ? 0.9 : 1 }}>
      {busy ? <><Spinner /> {busyLabel}</> : children}
    </button>
  )
}

function DocRow({ doc, first, filename, readOnly, onUpload }: {
  doc: { id: DocId; label: string; desc: string; sample: string; Icon: React.ElementType }
  first?: boolean; filename: string | null; readOnly?: boolean; onUpload: (name: string) => void
}) {
  const { Icon } = doc
  const uploaded = !!filename
  return (
    <div className="flex items-center gap-3" style={{ padding: '13px 0', borderTop: first ? 'none' : `1px solid ${C.border}` }}>
      <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 40, height: 40, background: uploaded ? 'rgba(14,168,106,0.10)' : C.hover, color: uploaded ? C.green : '#8B90A7' }}>
        <Icon size={19} strokeWidth={1.8} />
      </div>
      <div className="flex-1 min-w-0">
        <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{doc.label}</div>
        {uploaded ? (
          <div className="flex items-center gap-1.5" style={{ marginTop: 2, minWidth: 0 }}>
            <FileText size={12} style={{ color: C.green, flexShrink: 0 }} />
            <span style={{ fontSize: 11.5, color: '#0A8A58', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{filename}</span>
          </div>
        ) : (
          <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.45, marginTop: 1 }}>{doc.desc}</div>
        )}
      </div>
      {uploaded ? (
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="flex items-center gap-1.5 rounded-full" style={{ padding: '6px 12px', background: 'rgba(14,168,106,0.10)', color: '#0A8A58', fontSize: 12, fontWeight: 700 }}>
            <CheckCircle2 size={14} /> Uploaded
          </span>
          {!readOnly && (
            <label style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, cursor: 'pointer' }}>
              Replace
              <input type="file" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) onUpload(f.name) }} />
            </label>
          )}
        </div>
      ) : (
        <label className="flex items-center justify-center gap-1.5 flex-shrink-0"
          style={{ height: 36, padding: '0 14px', borderRadius: 9, fontSize: 12.5, fontWeight: 700, border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.06)', color: C.indigoDeep, cursor: 'pointer' }}>
          <Upload size={14} /> Upload
          <input type="file" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) onUpload(f.name) }} />
        </label>
      )}
    </div>
  )
}

function IvStatusPill({ state }: { state: InterviewState }) {
  const meta: Record<InterviewState, { label: string; color: string; bg: string }> = {
    'not-published': { label: 'Not Published',      color: C.slate,     bg: 'rgba(91,95,130,0.14)' },
    'awaiting':      { label: 'Awaiting Response',  color: '#B26905',   bg: 'rgba(217,119,6,0.14)' },
    'submitted':     { label: 'Response Received',  color: C.indigoDeep,bg: 'rgba(99,102,241,0.14)' },
    'reviewed':      { label: 'Reviewed',           color: '#0A8A58',   bg: 'rgba(14,168,106,0.14)' },
  }
  const m = meta[state]
  return <span className="rounded-full" style={{ padding: '4px 11px', background: m.bg, color: m.color, fontSize: 11, fontWeight: 700 }}>{m.label}</span>
}

function ReadyRow({ done, label, hint }: { done: boolean; label: string; hint: string }) {
  return (
    <div className="flex items-start gap-3" style={{ padding: '11px 13px', borderRadius: 11, border: `1px solid ${done ? 'rgba(14,168,106,0.28)' : C.border}`, background: done ? 'rgba(14,168,106,0.05)' : '#F7F8FC' }}>
      <span className="flex items-center justify-center flex-shrink-0" style={{ width: 20, height: 20, borderRadius: '50%', marginTop: 1, border: `1.5px solid ${done ? C.green : '#C8CCE0'}`, background: done ? C.green : '#fff' }}>
        {done && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
      </span>
      <div className="flex-1 min-w-0">
        <div style={{ fontSize: 13, fontWeight: 700, color: done ? '#0A8A58' : C.navy }}>{label}</div>
        <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.45, marginTop: 1 }}>{hint}</div>
      </div>
    </div>
  )
}

function ClosedPanel({ c }: { c: HRCase }) {
  const closedOn = c.closedOn ?? TODAY.toISOString().split('T')[0]
  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', position: 'sticky', top: 8 }}>
      <div className="flex flex-col items-center text-center" style={{ padding: '26px 22px 20px', background: 'rgba(14,168,106,0.10)' }}>
        <div className="flex items-center justify-center rounded-2xl mb-3" style={{ width: 56, height: 56, background: '#fff' }}>
          <CheckCircle2 size={28} strokeWidth={1.9} style={{ color: C.green }} />
        </div>
        <div style={{ fontSize: 16.5, fontWeight: 800, color: C.navy }}>Case Closed</div>
        <div style={{ fontSize: 12.5, color: '#5C6080', marginTop: 3 }}>Offboarded on {fmtDate(closedOn)} · HR</div>
      </div>
      <div style={{ padding: 20 }}>
        <div className="flex flex-col gap-2">
          {['Exit interview reviewed', ...DOCS.map(d => `${d.label} shared`)].map(label => (
            <div key={label} className="flex items-center gap-2.5" style={{ padding: '10px 12px', background: 'rgba(14,168,106,0.05)', border: '1px solid rgba(14,168,106,0.22)', borderRadius: 10 }}>
              <CheckCircle2 size={16} strokeWidth={2.2} style={{ color: C.green, flexShrink: 0 }} />
              <span style={{ fontSize: 12.5, fontWeight: 600, color: '#0A8A58' }}>{label}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11.5, color: C.muted, textAlign: 'center', marginTop: 14, lineHeight: 1.5 }}>
          All records are read-only. The full &amp; final settlement has been released.
        </p>
      </div>
    </div>
  )
}

/* ════════════════ small shared bits ════════════════ */
function QA({ label, value }: { label: string; value?: string }) {
  return (
    <div style={{ padding: '13px 15px', background: '#F7F8FC', borderRadius: 12, border: `1px solid ${C.border}` }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: C.indigoDeep, marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 13, color: '#3D4266', lineHeight: 1.65 }}>{value || '—'}</div>
    </div>
  )
}

function GlanceRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span style={{ fontSize: 12, fontWeight: 600, color: C.muted }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: valueColor ?? C.navy, textAlign: 'right' }}>{value}</span>
    </div>
  )
}

function Meta({ Icon, label, value }: { Icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={15} style={{ color: C.muted, flexShrink: 0 }} />
      <div>
        <span style={{ fontSize: 11, color: C.muted }}>{label}: </span>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: C.navy }}>{value}</span>
      </div>
    </div>
  )
}

function Card({ title, Icon, accent, children }: { title: string; Icon: React.ElementType; accent?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
      <div className="flex items-center gap-2.5" style={{ padding: '15px 22px', borderBottom: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 32, height: 32, background: accent ? 'rgba(232,72,85,0.10)' : 'rgba(99,102,241,0.10)', color: accent ?? C.indigoDeep }}>
          <Icon size={15} strokeWidth={2} />
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{title}</span>
      </div>
      {children}
    </div>
  )
}

function MiniInfo({ Icon, label, value, accent }: { Icon: React.ElementType; label: string; value: string; accent?: string }) {
  return (
    <div style={{ padding: '12px 14px', background: '#F7F8FC', borderRadius: 12, border: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon size={13} strokeWidth={2.2} style={{ color: accent ?? C.indigoDeep }} />
        <span style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 800, color: accent ?? C.navy }}>{value}</div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between" style={{ padding: '11px 14px', background: '#F7F8FC', borderRadius: 10 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy, textAlign: 'right' }}>{value}</span>
    </div>
  )
}

function Modal({ children, onClose, width }: { children: React.ReactNode; onClose: () => void; width: number }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: '#fff', borderRadius: 22, width, boxShadow: '0 24px 64px rgba(10,12,28,0.18)', overflow: 'hidden' }}>{children}</div>
    </div>
  )
}

function Spinner() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'obSpin 0.8s linear infinite', flexShrink: 0 }}>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  )
}

const ghostBtn: React.CSSProperties = { flex: 1, height: 44, borderRadius: 11, fontSize: 13.5, fontWeight: 600, border: '1px solid #E8EAF2', background: '#fff', color: C.muted, cursor: 'pointer' }
