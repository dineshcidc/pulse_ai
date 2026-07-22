import { useState } from 'react'
import {
  FileText, FileCheck, BadgeCheck, ReceiptText, FileSpreadsheet,
  Download, Lock, CalendarClock, FolderCheck, CheckCircle2, ShieldCheck,
} from 'lucide-react'
import type { ElementType } from 'react'

const C = {
  navy: '#1C2035',
  muted: '#8B90A7',
  border: '#E4E6EF',
  bg: '#F0F2F8',
  surface: '#F7F8FC',
  indigo: '#6366F1',
}

/* ── Shared offboarding case (same as My Offboarding — notice period in progress) ── */
const CASE = {
  lwd: '2026-10-15',
}

type DocStatus = 'Available' | 'Pending'

interface DocRow {
  id: string
  name: string
  desc: string
  Icon: ElementType
  status: DocStatus
  meta: string
  optional?: boolean
}

/*
 * Exit documents are a Phase-C step — issued on/around the last working day once
 * clearances complete. Mid-notice, only Payslips are already available (they exist
 * throughout employment). The F&F statement issues after F&F is settled — a
 * different clock from the relieving / experience letters.
 */
const DOCS: DocRow[] = [
  { id: 'relieving',  name: 'Relieving Letter',                Icon: FileCheck,       status: 'Pending',   desc: 'Confirms your last working day and that you exited in good standing.', meta: `Issued on/around ${fmtDate(CASE.lwd)}` },
  { id: 'experience', name: 'Experience Letter',               Icon: BadgeCheck,      status: 'Pending',   desc: 'Certifies your role, tenure, and experience at the company.',          meta: `Issued on/around ${fmtDate(CASE.lwd)}` },
  { id: 'ff',         name: 'Full & Final Settlement Statement', Icon: ReceiptText,   status: 'Pending',   desc: 'Detailed breakdown of your final dues, deductions, and settlement.',   meta: 'Issued after your F&F is settled' },
  { id: 'payslips',   name: 'Payslips',                        Icon: FileText,        status: 'Available', desc: 'Your monthly payslips, including your final month.',                   meta: 'PDF · Jan 2024 – present' },
  { id: 'form16',     name: 'Form 16 (Tax)',                   Icon: FileSpreadsheet, status: 'Pending',   desc: 'Annual tax statement (TDS) for your income-tax filing.',               meta: 'Issued as per the annual tax cycle', optional: true },
]

const STATUS_STYLE: Record<DocStatus, { bg: string; color: string; Icon: ElementType }> = {
  'Available': { bg: 'rgba(14,168,106,0.12)', color: '#0A7040', Icon: CheckCircle2 },
  'Pending':   { bg: '#EEF0F6',               color: '#8B90A7', Icon: Lock },
}

const COL = '3fr 1.1fr 1.2fr'

function fmtDate(d: string) {
  const parsed = new Date(d)
  if (isNaN(parsed.getTime())) return '—'
  return parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
}

function Spinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"
      style={{ animation: 'edSpin 0.7s linear infinite', flexShrink: 0 }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

export default function ExitDocumentsPage() {
  const [downloading, setDownloading] = useState<string | null>(null)
  const today = new Date()
  const daysLeft = Math.max(0, daysBetween(today, new Date(CASE.lwd)))
  const total = DOCS.length
  const available = DOCS.filter(d => d.status === 'Available').length

  function handleDownload(id: string) {
    setDownloading(id)
    setTimeout(() => setDownloading(null), 1100)
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@keyframes edSpin { to { transform: rotate(360deg) } } .ed-row:hover { background:#FAFBFE !important; }`}</style>

      {/* Section header */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: C.navy, margin: 0 }}>Exit Documents</h2>
        <p style={{ fontSize: 13, color: C.muted, fontWeight: 500, margin: '3px 0 0' }}>
          Download your relieving letter, experience letter, and settlement documents once they're issued.
        </p>
      </div>

      {/* Information section */}
      <div style={{ display: 'flex', gap: 13, background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.20)', borderRadius: 12, padding: '14px 16px', marginBottom: 18 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(99,102,241,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <FolderCheck size={18} strokeWidth={1.9} style={{ color: C.indigo }} />
        </div>
        <div>
          <h4 style={{ fontSize: 13.5, fontWeight: 700, color: C.navy, margin: 0 }}>Your documents are issued on/around your last working day</h4>
          <p style={{ fontSize: 12.5, color: '#5A6080', fontWeight: 500, margin: '3px 0 0', lineHeight: 1.6 }}>
            HR issues your <strong>Relieving</strong> and <strong>Experience</strong> letters once all clearances are complete — on or around <strong>{fmtDate(CASE.lwd)}</strong>.
            The <strong>F&amp;F statement</strong> follows after your final settlement is paid. You'll be able to download everything here,
            and you'll keep this access even after your account is deactivated.
          </p>
        </div>
      </div>

      {/* ── Top: Expected by + Available now ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
        {/* Expected by */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(99,102,241,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarClock size={17} strokeWidth={1.9} style={{ color: C.indigo }} />
            </div>
            <h3 style={{ fontSize: 13.5, fontWeight: 700, color: C.navy, margin: 0 }}>Expected By</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontSize: 26, fontWeight: 800, color: C.navy, letterSpacing: '-0.5px' }}>{fmtDate(CASE.lwd)}</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10, padding: '5px 11px', borderRadius: 999, background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.28)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F59E0B' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#B45309' }}>{daysLeft} days remaining</span>
          </div>
        </div>

        {/* Available now */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(14,168,106,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FolderCheck size={17} strokeWidth={1.9} style={{ color: '#0A7040' }} />
            </div>
            <h3 style={{ fontSize: 13.5, fontWeight: 700, color: C.navy, margin: 0 }}>Available Now</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontSize: 30, fontWeight: 800, color: C.navy, letterSpacing: '-1px' }}>{available}</span>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: C.muted }}>of {total} documents ready to download</span>
          </div>
          <p style={{ fontSize: 12, color: C.muted, fontWeight: 500, margin: '14px 0 0', lineHeight: 1.55 }}>
            The remaining <strong style={{ color: C.navy }}>{total - available}</strong> will unlock as they're issued during your exit.
          </p>
        </div>
      </div>

      {/* ── Documents list ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, background: C.surface }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: C.navy, margin: 0 }}>Your Exit Documents ({total})</h3>
          <p style={{ fontSize: 12, color: C.muted, fontWeight: 500, margin: '2px 0 0' }}>Documents unlock for download as HR issues them.</p>
        </div>

        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: COL, gap: 16, padding: '12px 20px', borderBottom: `1px solid ${C.border}` }}>
          {['Document', 'Status', ''].map((h, i) => (
            <span key={i} style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: i === 2 ? 'right' : 'left' }}>{h}</span>
          ))}
        </div>

        {DOCS.map((d, idx) => {
          const st = STATUS_STYLE[d.status]
          const StatusIcon = st.Icon
          const { Icon } = d
          const isAvail = d.status === 'Available'
          const isDownloading = downloading === d.id
          return (
            <div key={d.id} className="ed-row" style={{ display: 'grid', gridTemplateColumns: COL, gap: 16, padding: '15px 20px', alignItems: 'center', borderBottom: idx < DOCS.length - 1 ? `1px solid ${C.border}` : 'none', transition: 'background 0.12s' }}>
              {/* Document */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, minWidth: 0 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <Icon size={18} strokeWidth={1.8} style={{ color: C.muted }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: C.navy }}>{d.name}</span>
                    {d.optional && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: C.muted, background: C.bg, borderRadius: 5, padding: '2px 6px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Optional</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, fontWeight: 500, marginTop: 2, lineHeight: 1.5 }}>{d.desc}</div>
                  <div style={{ fontSize: 11.5, color: isAvail ? '#0A7040' : C.muted, fontWeight: 600, marginTop: 4 }}>{d.meta}</div>
                </div>
              </div>

              {/* Status */}
              <div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 999, background: st.bg, color: st.color, fontSize: 11.5, fontWeight: 600, whiteSpace: 'nowrap' }}>
                  <StatusIcon size={13} strokeWidth={2.2} style={{ color: st.color }} />
                  {d.status === 'Available' ? 'Available' : 'Not issued yet'}
                </span>
              </div>

              {/* Action */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {isAvail ? (
                  <button
                    onClick={() => handleDownload(d.id)}
                    disabled={isDownloading}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 15px', borderRadius: 9, border: 'none', background: C.indigo, color: '#fff', fontSize: 12.5, fontWeight: 600, cursor: isDownloading ? 'default' : 'pointer', fontFamily: 'inherit', transition: 'background 0.15s', whiteSpace: 'nowrap', opacity: isDownloading ? 0.9 : 1 }}
                    onMouseEnter={e => { if (!isDownloading) e.currentTarget.style.background = '#4F46E5' }}
                    onMouseLeave={e => { if (!isDownloading) e.currentTarget.style.background = C.indigo }}
                  >
                    {isDownloading ? (<><Spinner /> Downloading…</>) : (<><Download size={14} strokeWidth={2} /> Download</>)}
                  </button>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 15px', borderRadius: 9, border: `1px solid ${C.border}`, background: C.surface, color: C.muted, fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap' }}>
                    <Lock size={13} strokeWidth={2} /> Locked
                  </span>
                )}
              </div>
            </div>
          )
        })}

        {/* Footer note */}
        <div style={{ padding: '12px 20px', borderTop: `1px solid ${C.border}`, background: '#FAFBFE', display: 'flex', gap: 9, alignItems: 'flex-start' }}>
          <ShieldCheck size={13} strokeWidth={2} style={{ color: C.muted, marginTop: 2, flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: C.muted, fontWeight: 500, lineHeight: 1.55 }}>
            <strong style={{ color: C.navy }}>You keep access to this page after you leave.</strong> Even once your account is deactivated, you can return here to download your exit documents anytime.
          </span>
        </div>
      </div>
    </div>
  )
}
