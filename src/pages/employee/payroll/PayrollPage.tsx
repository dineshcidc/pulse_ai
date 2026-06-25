import { useState } from 'react'
import {
  Wallet, FileText, BarChart2, Shield, TrendingUp,
  Download, ChevronDown, CheckCircle2, FileSearch, Info,
} from 'lucide-react'

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', surface: '#F0F2F8' }

const EMPLOYEE = {
  name:       'John Doe',
  role:       'Senior Software Engineer',
  department: 'Engineering',
  code:       'EMP-2024-0042',
  initials:   'JD',
  avatar:     'https://randomuser.me/api/portraits/men/32.jpg',
}

type TabId = 'salary-slip' | 'compensation' | 'tax' | 'increments'

const TABS: {
  id:           TabId
  label:        string
  Icon:         React.ElementType
  color:        string
  iconBg:       string
  activeBg:     string
  activeBorder: string
}[] = [
  { id: 'salary-slip',  label: 'Salary Slip',         Icon: FileText,   color: '#0D9488', iconBg: 'rgba(13,148,136,0.12)',  activeBg: 'rgba(13,148,136,0.07)',  activeBorder: 'rgba(13,148,136,0.35)'  },
  { id: 'compensation', label: 'Compensation Summary', Icon: BarChart2,  color: '#3B82F6', iconBg: 'rgba(59,130,246,0.12)',  activeBg: 'rgba(59,130,246,0.07)',  activeBorder: 'rgba(59,130,246,0.35)'  },
  { id: 'tax',          label: 'Tax Planning',         Icon: Shield,     color: '#7C3AED', iconBg: 'rgba(124,58,237,0.12)', activeBg: 'rgba(124,58,237,0.07)', activeBorder: 'rgba(124,58,237,0.35)' },
  { id: 'increments',   label: 'Increments',           Icon: TrendingUp, color: '#0EA86A', iconBg: 'rgba(14,168,106,0.12)',  activeBg: 'rgba(14,168,106,0.07)',  activeBorder: 'rgba(14,168,106,0.35)'  },
]

const SLIPS = [
  {
    id: 'apr-2025', month: 'April 2025', shortMonth: 'APR', year: '2025',
    creditedDate: 'April 30, 2025', period: 'April 1 – April 30, 2025',
    gross: 95000, net: 82500,
    earnings: [
      { label: 'Basic Salary',         amount: 47500 },
      { label: 'House Rent Allowance', amount: 19000 },
      { label: 'Special Allowance',    amount: 18500 },
      { label: 'Transport Allowance',  amount: 10000 },
    ],
    deductions: [
      { label: 'Provident Fund',   amount: 5700 },
      { label: 'Professional Tax', amount: 200  },
      { label: 'TDS',              amount: 5600 },
      { label: 'Health Insurance', amount: 1000 },
    ],
  },
  {
    id: 'mar-2025', month: 'March 2025', shortMonth: 'MAR', year: '2025',
    creditedDate: 'March 31, 2025', period: 'March 1 – March 31, 2025',
    gross: 95000, net: 82500,
    earnings: [
      { label: 'Basic Salary',         amount: 47500 },
      { label: 'House Rent Allowance', amount: 19000 },
      { label: 'Special Allowance',    amount: 18500 },
      { label: 'Transport Allowance',  amount: 10000 },
    ],
    deductions: [
      { label: 'Provident Fund',   amount: 5700 },
      { label: 'Professional Tax', amount: 200  },
      { label: 'TDS',              amount: 5600 },
      { label: 'Health Insurance', amount: 1000 },
    ],
  },
  {
    id: 'feb-2025', month: 'February 2025', shortMonth: 'FEB', year: '2025',
    creditedDate: 'February 28, 2025', period: 'February 1 – February 28, 2025',
    gross: 95000, net: 82800,
    earnings: [
      { label: 'Basic Salary',         amount: 47500 },
      { label: 'House Rent Allowance', amount: 19000 },
      { label: 'Special Allowance',    amount: 18500 },
      { label: 'Transport Allowance',  amount: 10000 },
    ],
    deductions: [
      { label: 'Provident Fund',   amount: 5700 },
      { label: 'Professional Tax', amount: 200  },
      { label: 'TDS',              amount: 5300 },
      { label: 'Health Insurance', amount: 1000 },
    ],
  },
  {
    id: 'jan-2025', month: 'January 2025', shortMonth: 'JAN', year: '2025',
    creditedDate: 'January 31, 2025', period: 'January 1 – January 31, 2025',
    gross: 92000, net: 80200,
    earnings: [
      { label: 'Basic Salary',         amount: 46000 },
      { label: 'House Rent Allowance', amount: 18400 },
      { label: 'Special Allowance',    amount: 17600 },
      { label: 'Transport Allowance',  amount: 10000 },
    ],
    deductions: [
      { label: 'Provident Fund',   amount: 5520 },
      { label: 'Professional Tax', amount: 200  },
      { label: 'TDS',              amount: 5080 },
      { label: 'Health Insurance', amount: 1000 },
    ],
  },
] as const

type Slip = typeof SLIPS[number]

function fmt(n: number) {
  return '₹' + n.toLocaleString('en-IN')
}

// ── Slip detail ────────────────────────────────────────────────────────────
function SlipDetail({ slip }: { slip: Slip }) {
  const totalEarn = slip.earnings.reduce((s, e) => s + e.amount, 0)
  const totalDed  = slip.deductions.reduce((s, d) => s + d.amount, 0)

  return (
    <div>
      {/* Slip card */}
      <div
        style={{
          background: '#fff',
          border: `1px solid ${C.border}`,
          borderRadius: 18, overflow: 'hidden',
        }}
      >
        {/* Light header */}
        <div
          style={{
            background: 'rgba(13,148,136,0.06)',
            borderBottom: `1px solid rgba(13,148,136,0.14)`,
            padding: '22px 28px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: '#0D9488', letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 6 }}>
              Salary Slip
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.navy, letterSpacing: '-0.3px' }}>
              {slip.month}
            </div>
            <div style={{ fontSize: 12.5, color: C.muted, marginTop: 5 }}>
              Pay Period: {slip.period}
            </div>
          </div>
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: 'rgba(14,168,106,0.10)',
              border: '1px solid rgba(14,168,106,0.22)',
              borderRadius: 20, padding: '7px 16px',
            }}
          >
            <CheckCircle2 size={13} strokeWidth={2.5} style={{ color: '#0EA86A' }} />
            <span style={{ fontSize: 12.5, fontWeight: 700, color: '#0EA86A' }}>
              Credited {slip.creditedDate}
            </span>
          </div>
        </div>

        {/* Employee info row */}
        <div
          style={{
            padding: '18px 28px',
            background: '#FAFBFF',
            borderBottom: `1px solid ${C.border}`,
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16,
          }}
        >
          {[
            { label: 'Employee Name', value: EMPLOYEE.name       },
            { label: 'Employee ID',   value: EMPLOYEE.code       },
            { label: 'Designation',   value: EMPLOYEE.role       },
            { label: 'Department',    value: EMPLOYEE.department },
          ].map(item => (
            <div key={item.label}>
              <div style={{ fontSize: 10, fontWeight: 600, color: C.muted, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 5 }}>
                {item.label}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Earnings / Deductions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ padding: '22px 28px', borderRight: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: '#0EA86A', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 18 }}>
              Earnings
            </div>
            {slip.earnings.map((e, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 13 }}>
                <span style={{ fontSize: 13, color: C.muted }}>{e.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{fmt(e.amount)}</span>
              </div>
            ))}
            <div style={{ height: 1, background: C.border, margin: '14px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Total Earnings</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#0EA86A' }}>{fmt(totalEarn)}</span>
            </div>
          </div>

          <div style={{ padding: '22px 28px' }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: '#E84855', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 18 }}>
              Deductions
            </div>
            {slip.deductions.map((d, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 13 }}>
                <span style={{ fontSize: 13, color: C.muted }}>{d.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{fmt(d.amount)}</span>
              </div>
            ))}
            <div style={{ height: 1, background: C.border, margin: '14px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Total Deductions</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#E84855' }}>-{fmt(totalDed)}</span>
            </div>
          </div>
        </div>

        {/* Net Pay */}
        <div
          style={{
            padding: '20px 28px',
            background: '#FAFBFF',
            borderBottom: `1px solid ${C.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
              Net Pay
            </div>
            <div style={{ fontSize: 12.5, color: C.muted }}>
              {fmt(slip.gross)} gross &minus; {fmt(totalDed)} deductions
            </div>
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, color: '#0D9488', letterSpacing: '-1px' }}>
            {fmt(slip.net)}
          </div>
        </div>

        {/* Download — inside card at bottom */}
        <div style={{ padding: '16px 28px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              height: 40, paddingLeft: 18, paddingRight: 20,
              background: '#0D9488', border: 'none', borderRadius: 10,
              fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#0b7a70' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#0D9488' }}
          >
            <Download size={14} strokeWidth={2.2} />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Salary Slip panel ──────────────────────────────────────────────────────
function SalarySlipPanel() {
  const [monthId,    setMonthId]    = useState('')
  const [loadedSlip, setLoadedSlip] = useState<Slip | null>(null)
  const [loading,    setLoading]    = useState(false)

  async function handleGetSlip() {
    if (!monthId || loading) return
    setLoading(true)
    setLoadedSlip(null)
    await new Promise(r => setTimeout(r, 1400))
    setLoadedSlip(SLIPS.find(s => s.id === monthId) ?? null)
    setLoading(false)
  }

  function handleMonthChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setMonthId(e.target.value)
    setLoadedSlip(null)
  }

  const canFetch = !!monthId && !loading

  return (
    <div>
      {/* ── Panel header: title + selector + button ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Salary Slip</div>
          <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>
            {loadedSlip
              ? loadedSlip.period
              : 'Select a month and click Get Slip'}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Month select */}
          <div style={{ position: 'relative' }}>
            <select
              value={monthId}
              onChange={handleMonthChange}
              style={{
                appearance: 'none',
                height: 40, paddingLeft: 14, paddingRight: 38,
                background: '#fff',
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                fontSize: 13, fontWeight: 600,
                color: monthId ? C.navy : C.muted,
                cursor: 'pointer', outline: 'none',
                fontFamily: "'DM Sans', system-ui, sans-serif",
                minWidth: 170,
              }}
            >
              <option value="" disabled>Select Month</option>
              {SLIPS.map(s => (
                <option key={s.id} value={s.id}>{s.month}</option>
              ))}
            </select>
            <ChevronDown
              size={13} strokeWidth={2.2}
              style={{
                position: 'absolute', right: 11, top: '50%',
                transform: 'translateY(-50%)',
                color: C.muted, pointerEvents: 'none',
              }}
            />
          </div>

          {/* Get Slip button */}
          <button
            onClick={handleGetSlip}
            disabled={!canFetch}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              height: 40, paddingLeft: 18, paddingRight: 20,
              background: canFetch ? '#0D9488' : '#C5EBE8',
              border: 'none', borderRadius: 10,
              fontSize: 13, fontWeight: 700, color: '#fff',
              cursor: canFetch ? 'pointer' : 'not-allowed',
              transition: 'background 0.18s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { if (canFetch) e.currentTarget.style.background = '#0b7a70' }}
            onMouseLeave={e => { if (canFetch) e.currentTarget.style.background = '#0D9488' }}
          >
            {loading ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                  style={{ animation: 'slipSpin 0.75s linear infinite', flexShrink: 0 }}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                Fetching...
              </>
            ) : 'Get Slip'}
          </button>
        </div>
      </div>

      <style>{`@keyframes slipSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>

      {/* ── Loading state ── */}
      {loading && (
        <div
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: 'calc(100vh - 520px)', gap: 16,
          }}
        >
          <div
            style={{
              width: 52, height: 52, borderRadius: 16,
              background: 'rgba(13,148,136,0.10)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2.2" strokeLinecap="round"
              style={{ animation: 'slipSpin 0.75s linear infinite' }}>
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 4 }}>Fetching salary slip…</div>
            <div style={{ fontSize: 12.5, color: C.muted }}>Please wait a moment</div>
          </div>
        </div>
      )}

      {/* ── Empty / prompt state ── */}
      {!loading && !loadedSlip && (
        <div
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: 'calc(100vh - 520px)', gap: 14,
          }}
        >
          <div
            style={{
              width: 60, height: 60, borderRadius: 18,
              background: '#F0F2F8',
              backgroundImage: 'radial-gradient(circle, rgba(13,148,136,0.15) 1px, transparent 1px)',
              backgroundSize: '7px 7px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <FileSearch size={26} strokeWidth={1.6} style={{ color: '#0D9488' }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 5 }}>
              No Slip Selected
            </div>
            <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.6 }}>
              Select a month from the dropdown above<br />and click <strong style={{ color: C.navy }}>Get Slip</strong> to view your salary details.
            </div>
          </div>
        </div>
      )}

      {/* ── Slip detail ── */}
      {!loading && loadedSlip && <SlipDetail slip={loadedSlip} />}
    </div>
  )
}

// ── Section card wrapper ───────────────────────────────────────────────────
function SectionCard({
  label, color, children, style,
}: {
  label: string; color: string; children: React.ReactNode; style?: React.CSSProperties
}) {
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', ...style }}>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '13px 18px', background: '#fff',
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <span style={{ width: 4, height: 18, borderRadius: 3, background: color, flexShrink: 0, display: 'inline-block' }} />
        <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{label}</span>
      </div>
      {children}
    </div>
  )
}

// ── Compensation Summary panel ─────────────────────────────────────────────
function CompensationPanel() {
  const inr = (n: number) => n === 0 ? '—' : '₹' + n.toLocaleString('en-IN')
  const bold = (n: number): React.CSSProperties => ({
    fontSize: 13, fontWeight: n > 0 ? 600 : 400, color: n > 0 ? C.navy : C.muted,
  })

  const SAL_ROWS = [
    { head: 'Basic + DA',                   type: 'Salary', monthly: 21667, annual: 260000, structure: 260000 },
    { head: 'House Rent Allowance',          type: 'Salary', monthly: 8667,  annual: 104000, structure: 104000 },
    { head: 'Joining / Certification Bonus', type: 'Salary', monthly: 0,     annual: 0,      structure: 0      },
    { head: 'Performance Bonus',             type: 'Salary', monthly: 0,     annual: 0,      structure: 0      },
    { head: 'Retention Bonus',               type: 'Salary', monthly: 0,     annual: 0,      structure: 0      },
    { head: 'Special Pay',                   type: 'Salary', monthly: 10700, annual: 128400, structure: 128400 },
  ]
  const CTC_ROWS = [
    { label: 'Medical Insurance',          annual: 6000  },
    { label: 'PF & EPS – Employer Cont.', annual: 21600 },
  ]
  const DED_ROWS = [
    { label: 'Labour Welfare Fund',        type: 'CTC', annual: 20    },
    { label: 'PF (Employee Contribution)', type: 'CTC', annual: 21600 },
  ]

  const grossMonthly = SAL_ROWS.reduce((s, r) => s + r.monthly, 0)
  const grossAnnual  = SAL_ROWS.reduce((s, r) => s + r.annual,  0)
  const totalCTC     = grossAnnual + CTC_ROWS.reduce((s, r) => s + r.annual, 0)

  const SAL_COLS = '2.4fr 0.85fr 1.25fr 1.25fr 1.25fr'

  const TH: React.CSSProperties = { fontSize: 11, fontWeight: 700, letterSpacing: '0.04em' }
  const rowBg = (i: number) => ({ background: i % 2 === 0 ? '#fff' : '#FAFBFF' })

  return (
    <div>
      {/* ── Panel header ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Compensation Summary</div>
          <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>
            Full CTC breakdown &amp; salary structure
          </div>
        </div>
      </div>

      {/* ── Info banner ── */}
      <div
        style={{
          display: 'flex', alignItems: 'flex-start', gap: 10,
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.28)',
          borderRadius: 12, padding: '12px 16px', marginBottom: 22,
        }}
      >
        <Info size={14} strokeWidth={2} style={{ color: '#D97706', marginTop: 1, flexShrink: 0 }} />
        <span style={{ fontSize: 12.5, color: '#92400E', lineHeight: 1.6 }}>
          Amount received through payroll is updated upto <strong>Apr-2026</strong>. Annual payout is projected based on the salary structure.
        </span>
      </div>

      {/* ── Salary Components ── */}
      <SectionCard label="Salary Components" color="#3B82F6">
        {/* Table header */}
        <div
          style={{
            display: 'grid', gridTemplateColumns: SAL_COLS,
            padding: '12px 18px',
            background: '#f7f8fc',
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          {['Head', 'Type', 'Amt. Received', 'Annual Payout', 'Salary Structure'].map((h, i) => (
            <div key={h} style={{ ...TH, color: '#3B82F6', textAlign: i >= 2 ? 'right' : 'left' }}>{h}</div>
          ))}
        </div>

        {/* Data rows */}
        {SAL_ROWS.map((r, i) => (
          <div
            key={r.head}
            style={{
              display: 'grid', gridTemplateColumns: SAL_COLS,
              padding: '16px 18px',
              borderBottom: `1px solid ${C.border}`,
              alignItems: 'center',
              ...rowBg(i),
            }}
          >
            <span style={{ fontSize: 13, color: C.navy }}>{r.head}</span>
            <span>
              <span style={{
                fontSize: 11, fontWeight: 700, color: '#3B82F6',
                background: 'rgba(59,130,246,0.09)', border: '1px solid rgba(59,130,246,0.20)',
                borderRadius: 6, padding: '2px 9px',
              }}>{r.type}</span>
            </span>
            <span style={{ ...bold(r.monthly), textAlign: 'right' }}>{inr(r.monthly)}</span>
            <span style={{ ...bold(r.annual),  textAlign: 'right' }}>{inr(r.annual)}</span>
            <span style={{ ...bold(r.structure), textAlign: 'right' }}>{inr(r.structure)}</span>
          </div>
        ))}

        {/* Gross Salary summary */}
        <div
          style={{
            display: 'grid', gridTemplateColumns: SAL_COLS,
            padding: '14px 18px',
            background: 'rgba(13,148,136,0.07)',
            borderTop: '1px solid rgba(13,148,136,0.18)',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: C.navy, gridColumn: '1 / 3' }}>
            Gross Salary
          </span>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#0D9488', textAlign: 'right' }}>
            ₹{grossMonthly.toLocaleString('en-IN')}
          </span>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#0D9488', textAlign: 'right' }}>
            ₹{grossAnnual.toLocaleString('en-IN')}
          </span>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#0D9488', textAlign: 'right' }}>
            ₹{grossAnnual.toLocaleString('en-IN')}
          </span>
        </div>
      </SectionCard>

      {/* ── CTC Components ── */}
      <SectionCard label="CTC Components" color="#7C3AED" style={{ marginTop: 18 }}>
        {/* Table header */}
        <div
          style={{
            display: 'grid', gridTemplateColumns: '1fr 160px',
            padding: '12px 18px',
            background: '#f7f8fc',
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <div style={{ ...TH, color: '#7C3AED' }}>Component</div>
          <div style={{ ...TH, color: '#7C3AED', textAlign: 'right' }}>Annual Value</div>
        </div>

        {CTC_ROWS.map((r, i) => (
          <div
            key={r.label}
            style={{
              display: 'grid', gridTemplateColumns: '1fr 160px',
              padding: '16px 18px', borderBottom: `1px solid ${C.border}`,
              ...rowBg(i),
            }}
          >
            <span style={{ fontSize: 13, color: C.navy }}>{r.label}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.navy, textAlign: 'right' }}>
              ₹{r.annual.toLocaleString('en-IN')}
            </span>
          </div>
        ))}

        {/* Total CTC */}
        <div
          style={{
            display: 'grid', gridTemplateColumns: '1fr 160px',
            padding: '14px 18px',
            background: 'rgba(124,58,237,0.07)',
            borderTop: '1px solid rgba(124,58,237,0.18)',
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Total Cost To Company</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#7C3AED', textAlign: 'right' }}>
            ₹{totalCTC.toLocaleString('en-IN')}
          </span>
        </div>
      </SectionCard>

      {/* ── Deductions ── */}
      <SectionCard label="Deductions" color="#E84855" style={{ marginTop: 18 }}>
        {/* Table header */}
        <div
          style={{
            display: 'grid', gridTemplateColumns: '1fr 100px 160px',
            padding: '12px 18px',
            background: '#f7f8fc',
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <div style={{ ...TH, color: '#E84855' }}>Component</div>
          <div style={{ ...TH, color: '#E84855', textAlign: 'center' }}>Type</div>
          <div style={{ ...TH, color: '#E84855', textAlign: 'right' }}>Annual Value</div>
        </div>

        {DED_ROWS.map((r, i) => (
          <div
            key={r.label}
            style={{
              display: 'grid', gridTemplateColumns: '1fr 100px 160px',
              padding: '16px 18px',
              borderBottom: i < DED_ROWS.length - 1 ? `1px solid ${C.border}` : 'none',
              alignItems: 'center',
              ...rowBg(i),
            }}
          >
            <span style={{ fontSize: 13, color: C.navy }}>{r.label}</span>
            <span style={{ textAlign: 'center' }}>
              <span style={{
                fontSize: 11, fontWeight: 700, color: '#E84855',
                background: 'rgba(232,72,85,0.09)', border: '1px solid rgba(232,72,85,0.22)',
                borderRadius: 6, padding: '2px 9px',
              }}>{r.type}</span>
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.navy, textAlign: 'right' }}>
              ₹{r.annual.toLocaleString('en-IN')}
            </span>
          </div>
        ))}
      </SectionCard>

      {/* ── Download Salary Certificate ── */}
      <div style={{ marginTop: 22 }}>
        <button
          style={{
            display: 'flex', alignItems: 'center', gap: 9,
            height: 42, paddingLeft: 20, paddingRight: 22,
            background: C.navy, border: 'none', borderRadius: 11,
            fontSize: 13.5, fontWeight: 600, color: '#fff', cursor: 'pointer',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#2a304a' }}
          onMouseLeave={e => { e.currentTarget.style.background = C.navy }}
        >
          <Download size={15} strokeWidth={2.2} />
          Download Salary Certificate
        </button>
      </div>
    </div>
  )
}

// ── Tax Planning panel ────────────────────────────────────────────────────
function TaxPlanningPanel() {
  const [regime, setRegime] = useState<'new' | 'old'>('new')

  type RData = { gross: number; netTaxable: number; totalTax: number; paid: number; saved: number; potential: number; toBePaid: number }

  const DATA: Record<'new' | 'old', RData> = {
    new: { gross: 920000, netTaxable: 845000, totalTax: 35880, paid: 18000, saved: 9000, potential: 5000, toBePaid: 3880 },
    old: { gross: 920000, netTaxable: 690000, totalTax: 52520, paid: 18000, saved: 15000, potential: 12000, toBePaid: 7520 },
  }

  const d     = DATA[regime]
  const pct   = (n: number) => d.totalTax > 0 ? (n / d.totalTax) * 100 : 0
  const isOptimized = d.potential === 0 && d.toBePaid === 0

  const BAR = [
    { key: 'paid',      value: d.paid,      color: '#1C2035', label: 'Tax Paid'             },
    { key: 'saved',     value: d.saved,      color: '#0EA86A', label: 'Tax Saved'            },
    { key: 'potential', value: d.potential,  color: '#D97706', label: 'Tax Saving Potential' },
    { key: 'toBePaid',  value: d.toBePaid,   color: '#E84855', label: 'Tax To Be Paid'       },
  ]

  return (
    <div>
      {/* ── Panel header ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Tax Planning</div>
          <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>
            FY 2025–26 · Evaluate &amp; optimise your tax liability
          </div>
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#7C3AED', background: 'rgba(124,58,237,0.09)', border: '1px solid rgba(124,58,237,0.22)', borderRadius: 8, padding: '5px 13px' }}>
          FY 2025–26
        </span>
      </div>

      {/* ── Info banner ── */}
      <div
        style={{
          background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.28)',
          borderRadius: 12, padding: '14px 18px', marginBottom: 20,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 700, color: '#92400E', marginBottom: 6 }}>
          Through the tax planner you can:
        </div>
        <div style={{ fontSize: 12.5, color: '#92400E', lineHeight: 1.7 }}>
          a) Evaluate which is a better regime for you — <strong>Old Regime</strong> or <strong>New Regime</strong><br />
          b) See where you can save tax by optimising your tax savings
        </div>
      </div>

      {/* ── Status line ── */}
      <div style={{ marginBottom: 18 }}>
        <div style={{
          fontSize: 13.5, fontWeight: 700, marginBottom: 14,
          color: isOptimized ? '#0EA86A' : C.navy,
        }}>
          {isOptimized
            ? '✓ You are tax optimized, nothing more to be done.'
            : '⚡ Tax saving opportunities are available for you.'}
        </div>

        {/* Regime row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>
            Tax Regime :{' '}
            <span style={{ color: '#7C3AED' }}>{regime === 'new' ? 'New Regime' : 'Old Regime'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: C.muted }}>Check impact of change of tax regime</span>
            <div style={{ position: 'relative' }}>
              <select
                value={regime}
                onChange={e => setRegime(e.target.value as 'new' | 'old')}
                style={{
                  appearance: 'none',
                  height: 38, paddingLeft: 14, paddingRight: 36,
                  background: '#fff', border: `1px solid ${C.border}`, borderRadius: 10,
                  fontSize: 13, fontWeight: 600, color: C.navy,
                  cursor: 'pointer', outline: 'none',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                }}
              >
                <option value="new">New Regime</option>
                <option value="old">Old Regime</option>
              </select>
              <ChevronDown size={13} strokeWidth={2.2} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Tax summary card ── */}
      <div
        style={{
          background: '#fff', border: `1px solid ${C.border}`,
          borderRadius: 14, padding: '22px 22px 18px', marginBottom: 16,
        }}
      >
        {/* Top: Gross + Net Taxable */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 10 }}>
          <div>
            <span style={{ fontSize: 13, color: C.muted }}>Gross Income : </span>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>INR {d.gross.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span style={{ fontSize: 13, color: C.muted }}>Net Taxable Income : </span>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>INR {d.netTaxable.toLocaleString('en-IN')}</span>
          </div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <span style={{ fontSize: 13, color: C.muted }}>Total Tax Liability : </span>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: d.totalTax === 0 ? '#0EA86A' : '#E84855' }}>
            INR {d.totalTax.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Segmented bar */}
        <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', height: 8, marginBottom: 22, background: C.surface }}>
          {BAR.map(seg => seg.value > 0 && (
            <div
              key={seg.key}
              style={{ width: `${pct(seg.value)}%`, background: seg.color, transition: 'width 0.4s ease' }}
            />
          ))}
        </div>

        {/* Legend: 2×2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {BAR.map(seg => (
            <div key={seg.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: seg.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12.5, color: C.muted, flex: 1 }}>{seg.label} : </span>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: C.navy }}>INR {seg.value.toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer status ── */}
      <div
        style={{
          background: d.potential > 0 ? 'rgba(217,119,6,0.07)' : '#F0F2F8',
          border: `1px solid ${d.potential > 0 ? 'rgba(217,119,6,0.22)' : C.border}`,
          borderRadius: 10, padding: '13px 18px', textAlign: 'center',
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: d.potential > 0 ? '#D97706' : C.muted }}>
          {d.potential > 0
            ? `INR ${d.potential.toLocaleString('en-IN')} in tax savings available — optimise now!`
            : 'No tax savings available.'}
        </span>
      </div>
    </div>
  )
}

// ── Increments panel ──────────────────────────────────────────────────────
function IncrementPanel() {
  const inr = (n: number) => '₹' + n.toLocaleString('en-IN')

  const HISTORY = [
    { status: 'Revision',        ctc: 520000, from: '01 Jan 2026', to: null,          processed: 'Jan 2026', growth: 30.0  },
    { status: 'Revision',        ctc: 400000, from: '01 Jan 2025', to: '31 Dec 2025', processed: 'Jan 2025', growth: 23.5  },
    { status: 'Revision',        ctc: 324000, from: '01 Feb 2024', to: '31 Dec 2024', processed: 'Feb 2024', growth: 80.0  },
    { status: 'Salary Creation', ctc: 180000, from: '01 Feb 2023', to: '31 Jan 2024', processed: 'Feb 2023', growth: null  },
  ]

  const TIMELINE = [
    { ctc: 180000, period: 'Feb 2023', growth: null,  isCurrent: false },
    { ctc: 324000, period: 'Feb 2024', growth: 80.0,  isCurrent: false },
    { ctc: 400000, period: 'Jan 2025', growth: 23.5,  isCurrent: false },
    { ctc: 520000, period: 'Jan 2026', growth: 30.0,  isCurrent: true  },
  ]

  const COLS = '1.6fr 1.5fr 1fr 1fr 0.9fr 1fr'

  return (
    <div>
      {/* ── Panel header ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Increments</div>
          <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>
            Salary revision history &amp; CTC growth overview
          </div>
        </div>
        <span style={{
          fontSize: 12, fontWeight: 700, color: '#0EA86A',
          background: 'rgba(14,168,106,0.09)', border: '1px solid rgba(14,168,106,0.22)',
          borderRadius: 8, padding: '5px 13px',
        }}>
          4 Records
        </span>
      </div>

      {/* ── Info banner ── */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.28)',
        borderRadius: 12, padding: '12px 16px', marginBottom: 20,
      }}>
        <Info size={14} strokeWidth={2} style={{ color: '#D97706', marginTop: 1, flexShrink: 0 }} />
        <span style={{ fontSize: 12.5, color: '#92400E', lineHeight: 1.6 }}>
          History of salary changes can be seen from this tab. CTC values represent the total annual cost to company.
        </span>
      </div>

      {/* ── Growth timeline ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px 24px', marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 20 }}>
          CTC Growth Timeline
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          {TIMELINE.map((t, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Growth badge */}
              <div style={{ height: 24, display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                {t.growth !== null ? (
                  <span style={{
                    fontSize: 10.5, fontWeight: 700, color: '#0EA86A',
                    background: 'rgba(14,168,106,0.10)', border: '1px solid rgba(14,168,106,0.22)',
                    borderRadius: 20, padding: '2px 9px',
                  }}>+{t.growth}%</span>
                ) : (
                  <span style={{ fontSize: 10.5, fontWeight: 600, color: '#3B82F6', background: 'rgba(59,130,246,0.09)', border: '1px solid rgba(59,130,246,0.20)', borderRadius: 20, padding: '2px 9px' }}>
                    Start
                  </span>
                )}
              </div>

              {/* Connector + dot */}
              <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: 10 }}>
                <div style={{ flex: 1, height: 2, background: i === 0 ? 'transparent' : (t.isCurrent ? '#0EA86A' : C.border) }} />
                <div style={{
                  width: t.isCurrent ? 14 : 10, height: t.isCurrent ? 14 : 10,
                  borderRadius: '50%', flexShrink: 0,
                  background: t.isCurrent ? '#0EA86A' : '#3B82F6',
                  boxShadow: t.isCurrent ? '0 0 0 5px rgba(14,168,106,0.18)' : 'none',
                }} />
                <div style={{ flex: 1, height: 2, background: i === TIMELINE.length - 1 ? 'transparent' : C.border }} />
              </div>

              {/* Amount */}
              <div style={{ fontSize: 13.5, fontWeight: 800, color: t.isCurrent ? '#0EA86A' : C.navy, marginBottom: 3, textAlign: 'center', letterSpacing: '-0.3px' }}>
                {inr(t.ctc)}
              </div>
              <div style={{ fontSize: 11, color: C.muted, textAlign: 'center' }}>{t.period}</div>
              {t.isCurrent && (
                <div style={{ marginTop: 5, fontSize: 10, fontWeight: 700, color: '#0EA86A', background: 'rgba(14,168,106,0.10)', border: '1px solid rgba(14,168,106,0.22)', borderRadius: 10, padding: '2px 8px' }}>
                  Active
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Salary history table ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
        {/* Section label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 18px', borderBottom: `1px solid ${C.border}` }}>
          <span style={{ width: 4, height: 18, borderRadius: 3, background: '#0EA86A', display: 'inline-block' }} />
          <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>Salary Revision History</span>
          <span style={{ marginLeft: 'auto', fontSize: 12, color: C.muted }}>4 records</span>
        </div>

        {/* Table header */}
        <div style={{
          display: 'grid', gridTemplateColumns: COLS,
          padding: '11px 18px',
          background: '#f7f8fc',
          borderBottom: `1px solid ${C.border}`,
        }}>
          {['Status', 'Cost To Company', 'From Date', 'To Date', 'Growth', 'Processed On'].map((h, i) => (
            <div key={h} style={{
              fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: '0.04em',
              textAlign: i === 1 ? 'right' : i === 4 ? 'center' : 'left',
            }}>{h}</div>
          ))}
        </div>

        {/* Data rows */}
        {HISTORY.map((r, i) => {
          const isCurrent = r.to === null
          const isRevision = r.status === 'Revision'
          return (
            <div
              key={r.processed}
              style={{
                display: 'grid', gridTemplateColumns: COLS,
                padding: '16px 18px',
                background: isCurrent ? 'rgba(14,168,106,0.04)' : i % 2 === 0 ? '#fff' : '#FAFBFF',
                borderBottom: i < HISTORY.length - 1 ? `1px solid ${C.border}` : 'none',
                borderLeft: `3px solid ${isCurrent ? '#0EA86A' : 'transparent'}`,
                alignItems: 'center',
              }}
            >
              {/* Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: 11.5, fontWeight: 700,
                  color: isRevision ? '#0EA86A' : '#3B82F6',
                  background: isRevision ? 'rgba(14,168,106,0.09)' : 'rgba(59,130,246,0.09)',
                  border: `1px solid ${isRevision ? 'rgba(14,168,106,0.22)' : 'rgba(59,130,246,0.22)'}`,
                  borderRadius: 8, padding: '3px 10px',
                }}>{r.status}</span>
                {isCurrent && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#0D9488', background: 'rgba(13,148,136,0.10)', border: '1px solid rgba(13,148,136,0.22)', borderRadius: 6, padding: '2px 7px' }}>
                    Active
                  </span>
                )}
              </div>

              {/* CTC */}
              <div style={{ fontSize: 14, fontWeight: 800, color: C.navy, textAlign: 'right' }}>
                {inr(r.ctc)}
              </div>

              {/* From */}
              <div style={{ fontSize: 13, color: C.navy, fontWeight: 500 }}>{r.from}</div>

              {/* To */}
              <div style={{ fontSize: 13, color: r.to ? C.navy : C.muted, fontWeight: 500 }}>
                {r.to ?? '—'}
              </div>

              {/* Growth */}
              <div style={{ textAlign: 'center' }}>
                {r.growth !== null ? (
                  <span style={{
                    fontSize: 12, fontWeight: 700, color: '#0EA86A',
                    background: 'rgba(14,168,106,0.09)', border: '1px solid rgba(14,168,106,0.20)',
                    borderRadius: 20, padding: '3px 10px',
                  }}>↑ {r.growth}%</span>
                ) : (
                  <span style={{ fontSize: 12, color: C.muted }}>—</span>
                )}
              </div>

              {/* Processed */}
              <div style={{ fontSize: 13, color: C.muted, fontWeight: 500 }}>{r.processed}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function PayrollPage() {
  const [imgError,  setImgError]  = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>('salary-slip')

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes iconFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
      `}</style>

      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-bold mb-1" style={{ fontSize: 22, color: C.navy, letterSpacing: '-0.3px' }}>
            Payroll
          </h1>
          <p style={{ fontSize: 13.5, color: '#787878', fontWeight: 500 }}>
            View your salary breakdown, payslips &amp; disbursement history
          </p>
        </div>

        <div
          className="flex items-center justify-center rounded-2xl flex-shrink-0"
          style={{
            width: 84, height: 84,
            backgroundColor: 'rgba(13,148,136,0.07)',
            backgroundImage: 'radial-gradient(circle, rgba(13,148,136,0.22) 1px, transparent 1px)',
            backgroundSize: '8px 8px',
            border: '1px solid rgba(13,148,136,0.14)',
          }}
        >
          <div style={{ animation: 'iconFloat 4s ease-in-out infinite' }}>
            <Wallet size={34} strokeWidth={1.5} style={{ color: '#0D9488' }} />
          </div>
        </div>
      </div>

      {/* ── Employee identity card ───────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between mb-5"
        style={{
          background: '#fff',
          border: `1px solid ${C.border}`,
          borderRadius: 18,
          padding: '22px 26px',
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="rounded-2xl flex-shrink-0 overflow-hidden flex items-center justify-center"
            style={{ width: 58, height: 58, background: 'linear-gradient(135deg, #5B5FDE 0%, #7C3AED 100%)' }}
          >
            {!imgError ? (
              <img
                src={EMPLOYEE.avatar}
                alt={EMPLOYEE.name}
                onError={() => setImgError(true)}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <span style={{ fontSize: 19, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>
                {EMPLOYEE.initials}
              </span>
            )}
          </div>
          <div>
            <div style={{ fontSize: 15.5, fontWeight: 700, color: C.navy, letterSpacing: '-0.2px' }}>
              {EMPLOYEE.name}
            </div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 3 }}>{EMPLOYEE.role}</div>
          </div>
        </div>

        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: '#F5F6FF',
            border: '1px solid rgba(91,95,222,0.18)',
            borderRadius: 12, padding: '12px 18px',
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Employee ID
          </span>
          <span style={{ width: 1, height: 14, background: '#D8DAF0', display: 'inline-block' }} />
          <span style={{ fontSize: 13.5, fontWeight: 700, color: '#5B5FDE', letterSpacing: '0.02em' }}>
            {EMPLOYEE.code}
          </span>
        </div>
      </div>

      {/* ── 2 / 10 split ────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 10fr', gap: 20, alignItems: 'start' }}>

        {/* ── Left: tab menu ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {TABS.map(tab => {
            const { Icon } = tab
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  position: 'relative',
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '13px 14px',
                  background: isActive ? tab.activeBg : '#fff',
                  border: `1px solid ${isActive ? tab.activeBorder : C.border}`,
                  borderRadius: 14,
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.18s',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background  = tab.activeBg
                    e.currentTarget.style.borderColor = tab.activeBorder
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background  = '#fff'
                    e.currentTarget.style.borderColor = C.border
                  }
                }}
              >
                {isActive && (
                  <span
                    style={{
                      position: 'absolute', left: 0, top: '50%',
                      transform: 'translateY(-50%)',
                      width: 3, height: 20, background: tab.color,
                      borderRadius: '0 4px 4px 0',
                    }}
                  />
                )}
                <div
                  style={{
                    width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                    background: tab.iconBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Icon size={16} strokeWidth={1.8} style={{ color: tab.color }} />
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 600, lineHeight: 1.35, color: isActive ? tab.color : C.navy }}>
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* ── Right: content card ── */}
        <div
          style={{
            background: '#fff',
            border: `1px solid ${C.border}`,
            borderRadius: 18,
            padding: '24px 26px',
          }}
        >
          {activeTab === 'salary-slip'  && <SalarySlipPanel />}
          {activeTab === 'compensation' && <CompensationPanel />}
          {activeTab === 'tax'          && <TaxPlanningPanel />}
          {activeTab === 'increments'   && <IncrementPanel />}
        </div>
      </div>
    </div>
  )
}
