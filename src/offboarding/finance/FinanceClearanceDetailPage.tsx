import { useState } from 'react'
import {
  ArrowLeft, CheckCircle2, PauseCircle, Clock3, CalendarClock,
  Mail, Phone, Briefcase, UserCircle2, CalendarDays, FileText, Info,
  ShieldCheck, ShieldAlert, Lock, Wallet, Receipt,
} from 'lucide-react'
import type { FinanceClearanceCase, ClearanceStatus } from './FinanceClearancePage'
import { TODAY } from './FinanceClearancePage'
import { SHOW_ON_HOLD_FLOW } from '../offboardingFlags'

/*
 * Finance Manager › Finance Clearance — Screen F2 (Detail + Finance Clearance).
 *
 * Same shape as C2 / M2 / S2 for consistency, but Finance-flavoured:
 *   LEFT  — Request Details + CTO Approval + a Settlement Summary (earnings −
 *           deductions = net F&F payable).
 *   RIGHT — Clear / Hold panel: an early-release Notice-Shortfall recover/waive
 *           control (when applicable), a settlement checklist, remarks → Submit;
 *           or Hold with a reason. Locked before CTO approval; cleared = read-only.
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

function fmtDate(d: string | Date) {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
function daysAgo(d: string) {
  const diff = Math.round((TODAY.getTime() - new Date(d).getTime()) / 86400000)
  if (diff <= 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return `${diff} days ago`
}
function daysUntil(d: string) {
  return Math.round((new Date(d).getTime() - TODAY.getTime()) / 86400000)
}
function tenure(doj: string) {
  const s = new Date(doj)
  let months = (TODAY.getFullYear() - s.getFullYear()) * 12 + (TODAY.getMonth() - s.getMonth())
  if (TODAY.getDate() < s.getDate()) months--
  const y = Math.floor(months / 12), m = months % 12
  return `${y}y ${m}m`
}
function inr(n: number) { return '₹' + n.toLocaleString('en-IN') }

type Line = { label: string; amount: number }

// Mock settlement figures per case (the shortfall line is added dynamically).
const SETTLE: Record<string, { earnings: Line[]; deductions: Line[] }> = {
  'OFB-2442': { earnings: [{ label: 'Final Month Salary', amount: 92000 }, { label: 'Leave Encashment (14 days)', amount: 58000 }, { label: 'Gratuity', amount: 132000 }, { label: 'Statutory Bonus', amount: 18000 }], deductions: [] },
  'OFB-2445': { earnings: [{ label: 'Final Month Salary (prorated)', amount: 61000 }, { label: 'Leave Encashment (6 days)', amount: 21000 }], deductions: [] },
  'OFB-2436': { earnings: [{ label: 'Final Month Salary', amount: 88000 }, { label: 'Leave Encashment (18 days)', amount: 79000 }, { label: 'Gratuity', amount: 168000 }, { label: 'Statutory Bonus', amount: 16000 }], deductions: [] },
  'OFB-2431': { earnings: [{ label: 'Final Month Salary', amount: 105000 }, { label: 'Leave Encashment (9 days)', amount: 47000 }, { label: 'Statutory Bonus', amount: 15000 }], deductions: [{ label: 'Travel Advance Recovery', amount: 24000 }, { label: 'Company Loan Balance', amount: 60000 }] },
}
const DEFAULT_SETTLE = { earnings: [{ label: 'Final Month Salary', amount: 80000 }, { label: 'Leave Encashment', amount: 30000 }], deductions: [] as Line[] }

function buildSettlement(c: FinanceClearanceCase, waive: boolean) {
  const base = SETTLE[c.id] ?? DEFAULT_SETTLE
  const deductions: Line[] = [...base.deductions]
  const shortfall = c.earlyRelease && c.shortfallDays ? c.shortfallDays * 2800 : 0
  if (shortfall && !waive) deductions.push({ label: `Notice Shortfall (${c.shortfallDays} days)`, amount: shortfall })
  const totalEarn = base.earnings.reduce((s, x) => s + x.amount, 0)
  const totalDed = deductions.reduce((s, x) => s + x.amount, 0)
  return { earnings: base.earnings, deductions, net: totalEarn - totalDed, shortfall }
}

const CHECKLIST = [
  { id: 'pay',   label: 'Final pay & leave encashment computed', desc: 'Salary, encashment and applicable dues calculated.' },
  { id: 'reimb', label: 'Reimbursements settled',                desc: 'Pending claims and expense reimbursements cleared.' },
  { id: 'dues',  label: 'Dues & advances recovered',             desc: 'Loans, advances and any shortfall adjusted.' },
  { id: 'fnf',   label: 'F&F statement generated',               desc: 'Full & final statement prepared and shared.' },
]

type LiveOutcome =
  | { type: 'cleared'; checks: Record<string, boolean>; remarks: string; net: number }
  | { type: 'on-hold'; reason: string }

export default function FinanceClearanceDetailPage({ c, onBack }: { c: FinanceClearanceCase; onBack: () => void }) {
  const [mode, setMode]       = useState<'clear' | 'hold'>('clear')
  const [checks, setChecks]   = useState<Record<string, boolean>>(
    c.status === 'cleared' ? { pay: true, reimb: true, dues: true, fnf: true } : {}
  )
  const [waive, setWaive]     = useState(false)
  const [remarks, setRemarks] = useState('')
  const [holdReason, setHold] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitting, setSubmitting]   = useState(false)
  const [live, setLive] = useState<LiveOutcome | null>(null)

  const locked = c.status === 'awaiting-cto'
  const showOutcome = c.status === 'cleared' || !!live

  const settlement = buildSettlement(c, waive)
  const doneCount = CHECKLIST.filter(i => checks[i.id]).length
  const allChecked = doneCount === CHECKLIST.length
  const canSubmit = allChecked
  const canHold   = holdReason.trim().length > 0

  const dateShown = c.lwd ?? c.intendedLwd
  const dleft = daysUntil(dateShown)

  async function confirmDecision() {
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1200))
    setSubmitting(false)
    setShowConfirm(false)
    if (mode === 'clear') setLive({ type: 'cleared', checks: { ...checks }, remarks: remarks.trim(), net: settlement.net })
    else setLive({ type: 'on-hold', reason: holdReason.trim() })
  }

  const headStatus: ClearanceStatus = live ? (live.type === 'cleared' ? 'cleared' : 'on-hold') : c.status

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
        <button onClick={onBack} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 13, fontWeight: 500, color: C.muted }}>Finance Clearance</button>
        <span style={{ color: '#C8CCE0' }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{c.name}</span>
      </div>

      {/* just-decided success flash */}
      {live && (
        <div className="flex items-center gap-3 mb-4" style={{ animation: 'obPop 0.25s ease', background: live.type === 'cleared' ? 'rgba(14,168,106,0.09)' : 'rgba(232,72,85,0.08)', border: `1px solid ${live.type === 'cleared' ? 'rgba(14,168,106,0.28)' : 'rgba(232,72,85,0.25)'}`, borderRadius: 12, padding: '13px 16px' }}>
          {live.type === 'cleared'
            ? <CheckCircle2 size={19} style={{ color: C.green, flexShrink: 0 }} />
            : <PauseCircle size={19} style={{ color: C.red, flexShrink: 0 }} />}
          <span style={{ fontSize: 13.5, fontWeight: 700, color: live.type === 'cleared' ? '#0A8A58' : '#C0334A' }}>
            {live.type === 'cleared' ? `Finance clearance submitted — net F&F payable ${inr(live.net)}.` : 'Finance clearance put on hold — the reason has been recorded.'}
          </span>
        </div>
      )}

      {/* ── Employee identity header ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '20px 24px', marginBottom: 20 }}>
        <div className="flex items-start gap-4">
          <img src={c.avatar} alt={c.name} style={{ width: 62, height: 62, borderRadius: '50%', objectFit: 'cover', border: '3px solid #fff', boxShadow: '0 2px 8px rgba(28,32,53,0.14)', flexShrink: 0 }} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span style={{ fontSize: 19, fontWeight: 800, color: C.navy, letterSpacing: '-0.3px' }}>{c.name}</span>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: C.muted, background: C.hover, padding: '2px 9px', borderRadius: 7 }}>{c.code}</span>
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
            <StatusPill status={headStatus} />
          </div>
        </div>
      </div>

      {/* ── 8 / 4 layout ── */}
      <div className="grid gap-5" style={{ gridTemplateColumns: '8fr 4fr', alignItems: 'start' }}>

        {/* LEFT — request + CTO approval + settlement */}
        <div className="flex flex-col gap-5">
          <Card title="Request Details" Icon={FileText}>
            <div style={{ padding: '18px 22px' }}>
              <div className="grid grid-cols-3 gap-3 mb-5">
                <Field label="Reason for Leaving" value={c.reason} />
                <Field label="Last Working Day" value={fmtDate(dateShown)} sub={locked ? 'Intended' : `${dleft} days left`} />
                <Field label="Submitted" value={daysAgo(c.submittedOn)} sub={fmtDate(c.submittedOn)} />
              </div>
              <div>
                <div style={fieldLabel}>Detailed Reason / Notes</div>
                <div style={{ padding: '14px 16px', background: '#F7F8FC', borderRadius: 12, borderLeft: `3px solid ${C.indigo}`, fontSize: 13.5, color: '#3D4266', lineHeight: 1.7 }}>
                  “{c.notes}”
                </div>
              </div>
            </div>
          </Card>

          <Card title="CTO Approval" Icon={ShieldCheck}>
            <div style={{ padding: '18px 22px' }}>
              {locked ? (
                <div className="flex items-center gap-3" style={{ padding: '14px 16px', background: 'rgba(91,95,130,0.08)', border: '1px solid rgba(91,95,130,0.2)', borderRadius: 12 }}>
                  <ShieldAlert size={20} style={{ color: C.slate, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>Awaiting CTO approval</div>
                    <div style={{ fontSize: 12.5, color: '#5C6080', marginTop: 1 }}>You can begin the final settlement once the Delivery Head approves this request.</div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  <MiniInfo Icon={CheckCircle2} label="Status" value="Approved" accent={C.green} />
                  <MiniInfo Icon={Clock3} label="Notice Period" value={c.noticeDays ? `${c.noticeDays} days` : '—'} />
                  <MiniInfo Icon={CalendarClock} label="Last Working Day" value={fmtDate(dateShown)} />
                </div>
              )}
            </div>
          </Card>

          {/* Settlement summary — only once actionable */}
          {!locked && (
            <Card title="Settlement Summary" Icon={Receipt}>
              <div style={{ padding: '10px 22px 18px' }}>
                <SectionLabel>Earnings</SectionLabel>
                {settlement.earnings.map((l, i) => <SettleRow key={i} label={l.label} amount={l.amount} sign="+" />)}

                {settlement.deductions.length > 0 && (
                  <>
                    <SectionLabel style={{ marginTop: 12 }}>Deductions</SectionLabel>
                    {settlement.deductions.map((l, i) => <SettleRow key={i} label={l.label} amount={l.amount} sign="−" />)}
                  </>
                )}

                {c.earlyRelease && waive && (
                  <div className="flex items-center gap-2 mt-2" style={{ fontSize: 11.5, color: C.green, fontWeight: 600 }}>
                    <CheckCircle2 size={13} /> Notice shortfall waived by Finance
                  </div>
                )}

                {/* Net payable */}
                <div className="flex items-center justify-between" style={{ marginTop: 14, padding: '14px 16px', background: 'rgba(14,168,106,0.06)', border: '1px solid rgba(14,168,106,0.22)', borderRadius: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Net F&amp;F Payable</span>
                  <span style={{ fontSize: 19, fontWeight: 800, color: '#0A8A58', letterSpacing: '-0.3px' }}>{inr(settlement.net)}</span>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* RIGHT — clearance / outcome / locked */}
        <div>
          {showOutcome
            ? <OutcomePanel c={c} live={live} net={settlement.net} />
            : locked
              ? <LockedPanel />
              : <ClearancePanel
                  c={c} doneCount={doneCount} total={CHECKLIST.length}
                  mode={mode} setMode={setMode}
                  checks={checks} setChecks={setChecks}
                  waive={waive} setWaive={setWaive}
                  remarks={remarks} setRemarks={setRemarks}
                  holdReason={holdReason} setHold={setHold}
                  canSubmit={canSubmit} canHold={canHold}
                  onSubmit={() => setShowConfirm(true)}
                />}
        </div>
      </div>

      {/* ── Confirm modal ── */}
      {showConfirm && (
        <Modal onClose={() => !submitting && setShowConfirm(false)} width={440}>
          <div style={{ padding: '26px 28px 20px', borderBottom: '1px solid #F0F2F8' }}>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 40, height: 40, background: mode === 'clear' ? 'rgba(14,168,106,0.12)' : 'rgba(232,72,85,0.12)', color: mode === 'clear' ? C.green : C.red }}>
                {mode === 'clear' ? <CheckCircle2 size={20} strokeWidth={1.9} /> : <PauseCircle size={20} strokeWidth={1.9} />}
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.navy }}>{mode === 'clear' ? 'Submit Finance Clearance?' : 'Put Clearance On Hold?'}</div>
                <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>Please confirm your decision</div>
              </div>
            </div>
          </div>
          <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <SummaryRow label="Employee" value={`${c.name} (${c.code})`} />
            {mode === 'clear' ? (
              <>
                <SummaryRow label="Net F&F Payable" value={inr(settlement.net)} />
                <div className="flex items-start gap-2.5" style={{ padding: '11px 14px', background: 'rgba(14,168,106,0.06)', border: '1px solid rgba(14,168,106,0.2)', borderRadius: 10 }}>
                  <Info size={15} style={{ color: C.green, flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 12, color: '#0A7A50', lineHeight: 1.55 }}>The full &amp; final settlement will be marked complete and visible to HR on the case.</span>
                </div>
              </>
            ) : (
              <div style={{ padding: '11px 14px', background: '#F7F8FC', borderRadius: 10 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 7 }}>Hold Reason</div>
                <div style={{ fontSize: 13, color: C.navy, lineHeight: 1.6 }}>{holdReason.trim()}</div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3" style={{ padding: '0 28px 24px' }}>
            <button onClick={() => setShowConfirm(false)} disabled={submitting} style={ghostBtn}>Go Back</button>
            <button onClick={confirmDecision} disabled={submitting}
              style={{ flex: 1, height: 44, borderRadius: 11, fontSize: 13.5, fontWeight: 700, border: 'none', color: '#fff', cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: submitting ? 0.85 : 1, background: mode === 'clear' ? 'linear-gradient(135deg, #12b877 0%, #0A8A58 100%)' : 'linear-gradient(135deg, #F0576A 0%, #D42F45 100%)' }}>
              {submitting ? <><Spinner /> Submitting…</> : mode === 'clear' ? 'Yes, Submit' : 'Yes, Put On Hold'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

/* ════════════════ CLEARANCE PANEL (actionable) ════════════════ */
function ClearancePanel({
  c, doneCount, total, mode, setMode, checks, setChecks, waive, setWaive, remarks, setRemarks, holdReason, setHold, canSubmit, canHold, onSubmit,
}: {
  c: FinanceClearanceCase; doneCount: number; total: number
  mode: 'clear' | 'hold'; setMode: (m: 'clear' | 'hold') => void
  checks: Record<string, boolean>; setChecks: (v: Record<string, boolean>) => void
  waive: boolean; setWaive: (v: boolean) => void
  remarks: string; setRemarks: (v: string) => void
  holdReason: string; setHold: (v: string) => void
  canSubmit: boolean; canHold: boolean
  onSubmit: () => void
}) {
  const toggle = (id: string) => setChecks({ ...checks, [id]: !checks[id] })
  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', position: 'sticky', top: 8 }}>
      <div className="flex items-center gap-2.5" style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 32, height: 32, background: 'rgba(99,102,241,0.10)', color: C.indigoDeep }}>
          <Wallet size={16} strokeWidth={2} />
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Finance Clearance</span>
        {mode === 'clear' && <span className="ml-auto" style={{ fontSize: 11.5, fontWeight: 700, color: doneCount === total ? C.green : C.muted }}>{doneCount}/{total} done</span>}
      </div>

      <div style={{ padding: 20 }}>
        {c.status === 'on-hold' && (
          <div className="flex items-start gap-2.5 mb-4" style={{ padding: '11px 13px', background: 'rgba(232,72,85,0.06)', border: '1px solid rgba(232,72,85,0.2)', borderRadius: 10 }}>
            <PauseCircle size={15} style={{ color: C.red, flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#C0334A' }}>Currently on hold</div>
              <div style={{ fontSize: 12, color: '#8A4750', lineHeight: 1.5, marginTop: 2 }}>{c.holdReason}</div>
            </div>
          </div>
        )}

        {/* clear / hold toggle — hold hidden for now (BA); Clear only */}
        {SHOW_ON_HOLD_FLOW && (
          <div className="grid grid-cols-2 gap-2 mb-5">
            {(['clear', 'hold'] as const).map(m => {
              const on = mode === m
              const isClear = m === 'clear'
              const col = isClear ? C.green : C.red
              return (
                <button key={m} onClick={() => setMode(m)}
                  className="flex items-center justify-center gap-2"
                  style={{ height: 44, borderRadius: 11, fontSize: 13.5, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                    border: `1.5px solid ${on ? col : C.border}`,
                    background: on ? (isClear ? 'rgba(14,168,106,0.09)' : 'rgba(232,72,85,0.08)') : '#fff',
                    color: on ? (isClear ? '#0A8A58' : '#C0334A') : C.muted }}>
                  {isClear ? <CheckCircle2 size={16} /> : <PauseCircle size={16} />}
                  {isClear ? 'Clear' : 'Hold'}
                </button>
              )
            })}
          </div>
        )}

        {mode === 'clear' ? (
          <>
            {/* early-release shortfall control */}
            {c.earlyRelease && c.shortfallDays && (
              <div className="mb-5" style={{ padding: '13px 14px', background: '#FCFAF3', border: '1px solid rgba(217,119,6,0.28)', borderRadius: 12 }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <ShieldAlert size={14} style={{ color: C.amber }} />
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: '#9A6207' }}>Notice Shortfall · {c.shortfallDays} days</span>
                </div>
                <p style={{ fontSize: 11.5, color: '#8A6516', lineHeight: 1.5, marginBottom: 10 }}>
                  Released before the full notice period. Recover the shortfall from F&amp;F, or waive it.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {([['recover', 'Recover'], ['waive', 'Waive']] as const).map(([v, label]) => {
                    const on = (v === 'waive') === waive
                    return (
                      <button key={v} onClick={() => setWaive(v === 'waive')}
                        style={{ height: 38, borderRadius: 9, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                          border: `1.5px solid ${on ? C.amber : C.border}`, background: on ? 'rgba(217,119,6,0.10)' : '#fff', color: on ? '#9A6207' : C.muted }}>
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <div style={fieldLabel}>Settlement Checklist</div>
            <div className="flex flex-col gap-2 mb-4">
              {CHECKLIST.map(item => {
                const on = !!checks[item.id]
                return (
                  <button key={item.id} onClick={() => toggle(item.id)}
                    className="flex items-start gap-3 text-left w-full"
                    style={{ padding: '11px 13px', borderRadius: 11, cursor: 'pointer', transition: 'all 0.15s',
                      border: `1px solid ${on ? 'rgba(14,168,106,0.35)' : C.border}`, background: on ? 'rgba(14,168,106,0.05)' : '#fff' }}>
                    <span className="flex items-center justify-center flex-shrink-0" style={{ width: 20, height: 20, borderRadius: 6, marginTop: 1, border: `1.5px solid ${on ? C.green : '#C8CCE0'}`, background: on ? C.green : '#fff', transition: 'all 0.15s' }}>
                      {on && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div style={{ fontSize: 13, fontWeight: 700, color: on ? '#0A8A58' : C.navy }}>{item.label}</div>
                      <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.45, marginTop: 1 }}>{item.desc}</div>
                    </div>
                  </button>
                )
              })}
            </div>

            <label style={fieldLabel}>Remarks <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 500, color: '#B0B4C8' }}>(optional)</span></label>
            <textarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={3}
              placeholder="Settlement notes, payout date, adjustments…"
              style={{ width: '100%', borderRadius: 10, border: `1px solid ${remarks ? C.indigo : C.border}`, background: remarks ? '#F5F6FF' : '#fff', padding: '11px 13px', fontSize: 13, color: C.navy, resize: 'vertical', outline: 'none', fontFamily: "'DM Sans', system-ui, sans-serif", lineHeight: 1.6, boxSizing: 'border-box', marginBottom: 16 }} />

            <button onClick={onSubmit} disabled={!canSubmit}
              className="flex items-center justify-center gap-2 w-full"
              style={{ height: 46, borderRadius: 11, fontSize: 14, fontWeight: 700, border: 'none', color: '#fff', cursor: canSubmit ? 'pointer' : 'not-allowed', background: canSubmit ? 'linear-gradient(135deg, #12b877 0%, #0A8A58 100%)' : '#A9D9C4', boxShadow: canSubmit ? '0 2px 8px rgba(14,168,106,0.3)' : 'none' }}>
              <CheckCircle2 size={17} /> Submit Finance Clearance
            </button>
            {!canSubmit && <p style={{ fontSize: 11, color: C.muted, textAlign: 'center', marginTop: 10 }}>Complete all checklist items to submit.</p>}
          </>
        ) : (
          <>
            <label style={fieldLabel}>Reason for Hold <span style={{ color: C.red }}>*</span></label>
            <textarea value={holdReason} onChange={e => setHold(e.target.value)} rows={5}
              placeholder="What's blocking settlement? e.g. dues pending recovery, missing bank details…"
              style={{ width: '100%', borderRadius: 10, border: `1px solid ${holdReason ? C.red : C.border}`, background: holdReason ? 'rgba(232,72,85,0.03)' : '#fff', padding: '12px 14px', fontSize: 13.5, color: C.navy, resize: 'vertical', outline: 'none', fontFamily: "'DM Sans', system-ui, sans-serif", lineHeight: 1.6, boxSizing: 'border-box', marginBottom: 16 }} />
            <button onClick={onSubmit} disabled={!canHold}
              className="flex items-center justify-center gap-2 w-full"
              style={{ height: 46, borderRadius: 11, fontSize: 14, fontWeight: 700, border: 'none', color: '#fff', cursor: canHold ? 'pointer' : 'not-allowed', background: canHold ? 'linear-gradient(135deg, #F0576A 0%, #D42F45 100%)' : '#E7A9B1', boxShadow: canHold ? '0 2px 8px rgba(232,72,85,0.3)' : 'none' }}>
              <PauseCircle size={17} /> Put On Hold
            </button>
          </>
        )}

        <p style={{ fontSize: 11, color: C.muted, textAlign: 'center', marginTop: 14, lineHeight: 1.5 }}>
          Final settlement is paid after HR closes the case.
        </p>
      </div>
    </div>
  )
}

/* ════════════════ LOCKED PANEL (awaiting CTO) ════════════════ */
function LockedPanel() {
  return (
    <div style={{ background: '#fff', border: `1px dashed ${C.border}`, borderRadius: 16, padding: '44px 28px', textAlign: 'center', position: 'sticky', top: 8 }}>
      <div className="flex items-center justify-center mx-auto mb-4 rounded-2xl" style={{ width: 60, height: 60, background: C.hover, position: 'relative' }}>
        <Wallet size={26} strokeWidth={1.7} style={{ color: '#B0B4C8' }} />
        <div className="flex items-center justify-center rounded-full" style={{ position: 'absolute', bottom: -4, right: -4, width: 26, height: 26, background: '#fff', border: `1px solid ${C.border}` }}>
          <Lock size={13} style={{ color: C.muted }} />
        </div>
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Settlement not open yet</div>
      <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, maxWidth: 300, margin: '0 auto' }}>
        The CTO hasn't approved this request. You'll be able to compute and submit the final settlement once it's approved.
      </p>
    </div>
  )
}

/* ════════════════ OUTCOME PANEL (cleared / on-hold) ════════════════ */
function OutcomePanel({ c, live, net }: { c: FinanceClearanceCase; live: LiveOutcome | null; net: number }) {
  const isHold = live?.type === 'on-hold'
  const checks = live?.type === 'cleared' ? live.checks : { pay: true, reimb: true, dues: true, fnf: true }
  const remarks = live?.type === 'cleared' ? live.remarks : ''
  const shownNet = live?.type === 'cleared' ? live.net : net
  const holdReason = live?.type === 'on-hold' ? live.reason : c.holdReason
  const decidedOn = live ? TODAY.toISOString().split('T')[0] : c.clearedOn

  const m = isHold
    ? { color: C.red, bg: 'rgba(232,72,85,0.10)', Icon: PauseCircle, title: 'Finance Clearance On Hold' }
    : { color: C.green, bg: 'rgba(14,168,106,0.10)', Icon: CheckCircle2, title: 'Settlement Complete' }

  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', position: 'sticky', top: 8 }}>
      <div className="flex flex-col items-center text-center" style={{ padding: '26px 22px 20px', background: m.bg }}>
        <div className="flex items-center justify-center rounded-2xl mb-3" style={{ width: 56, height: 56, background: '#fff' }}>
          <m.Icon size={28} strokeWidth={1.9} style={{ color: m.color }} />
        </div>
        <div style={{ fontSize: 16.5, fontWeight: 800, color: C.navy }}>{m.title}</div>
        {decidedOn && <div style={{ fontSize: 12, color: '#5C6080', marginTop: 3 }}>on {fmtDate(decidedOn)} · Finance</div>}
      </div>

      <div style={{ padding: 20 }}>
        {isHold ? (
          <div>
            <div style={fieldLabel}>Hold Reason</div>
            <div style={{ padding: '13px 15px', background: '#F7F8FC', borderRadius: 11, borderLeft: `3px solid ${C.red}`, fontSize: 13, color: '#3D4266', lineHeight: 1.65 }}>
              “{holdReason || '—'}”
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between" style={{ padding: '13px 15px', background: 'rgba(14,168,106,0.06)', border: '1px solid rgba(14,168,106,0.22)', borderRadius: 12, marginBottom: 14 }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: C.navy }}>Net F&amp;F Payable</span>
              <span style={{ fontSize: 17, fontWeight: 800, color: '#0A8A58' }}>{inr(shownNet)}</span>
            </div>
            <div style={fieldLabel}>Settlement Checklist</div>
            <div className="flex flex-col gap-2">
              {CHECKLIST.map(item => {
                const done = !!checks[item.id]
                return (
                  <div key={item.id} className="flex items-center gap-2.5" style={{ padding: '10px 12px', background: done ? 'rgba(14,168,106,0.05)' : '#F7F8FC', border: `1px solid ${done ? 'rgba(14,168,106,0.22)' : C.border}`, borderRadius: 10 }}>
                    <CheckCircle2 size={16} strokeWidth={2.2} style={{ color: done ? C.green : '#C8CCE0', flexShrink: 0 }} />
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: done ? '#0A8A58' : C.muted }}>{item.label}</span>
                  </div>
                )
              })}
            </div>
            {remarks && (
              <div style={{ marginTop: 14 }}>
                <div style={fieldLabel}>Remarks</div>
                <div style={{ padding: '12px 14px', background: '#F7F8FC', borderRadius: 11, fontSize: 12.5, color: '#3D4266', lineHeight: 1.6 }}>{remarks}</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

/* ════════════════ small shared bits ════════════════ */
function SettleRow({ label, amount, sign }: { label: string; amount: number; sign: '+' | '−' }) {
  const neg = sign === '−'
  return (
    <div className="flex items-center justify-between" style={{ padding: '8px 2px' }}>
      <span style={{ fontSize: 13, color: '#3D4266' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: neg ? C.red : C.navy, whiteSpace: 'nowrap' }}>{neg ? '− ' : ''}{inr(amount)}</span>
    </div>
  )
}
function SectionLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '6px 0', ...style }}>{children}</div>
}

function StatusPill({ status }: { status: ClearanceStatus }) {
  const meta: Record<ClearanceStatus, { label: string; color: string; bg: string }> = {
    'awaiting-cto': { label: 'Awaiting CTO Approval', color: C.slate, bg: 'rgba(91,95,130,0.15)' },
    pending:        { label: 'Pending Clearance',     color: '#B26905', bg: 'rgba(217,119,6,0.12)' },
    cleared:        { label: 'Cleared',               color: '#0A8A58', bg: 'rgba(14,168,106,0.12)' },
    'on-hold':      { label: 'On Hold',               color: '#C0334A', bg: 'rgba(232,72,85,0.12)' },
  }
  const s = meta[status]
  return <span className="rounded-full" style={{ padding: '4px 11px', background: s.bg, color: s.color, fontSize: 11, fontWeight: 700 }}>{s.label}</span>
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

function Card({ title, Icon, children }: { title: string; Icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
      <div className="flex items-center gap-2.5" style={{ padding: '15px 22px', borderBottom: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 32, height: 32, background: 'rgba(99,102,241,0.10)', color: C.indigoDeep }}>
          <Icon size={15} strokeWidth={2} />
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{title}</span>
      </div>
      {children}
    </div>
  )
}

function Field({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{ padding: '12px 14px', background: '#F7F8FC', borderRadius: 12, border: `1px solid ${C.border}` }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy, marginTop: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{sub}</div>}
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

const fieldLabel: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: C.muted, display: 'block', marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }
const ghostBtn: React.CSSProperties = { flex: 1, height: 44, borderRadius: 11, fontSize: 13.5, fontWeight: 600, border: '1px solid #E8EAF2', background: '#fff', color: C.muted, cursor: 'pointer' }
