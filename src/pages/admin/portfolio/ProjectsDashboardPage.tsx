import { useEffect, useRef, useState } from 'react'
import {
  FolderKanban, Activity, Gauge, AlertTriangle,
  ShieldAlert, CalendarClock, TrendingUp, BarChart3, Users, ArrowRight,
  Eye, Sparkles, Flag,
} from 'lucide-react'
import {
  PORTFOLIO_PROJECTS, UPCOMING_MILESTONES, ACTIVE_TREND,
  getPortfolioKpis,
  type PortfolioProject, type RiskLevel,
} from './portfolioData'

const C = {
  navy: '#1C2035', ink: '#2A2F45', muted: '#8B90A7', faint: '#AEB2C4',
  border: '#E8EAF2', line: '#EEF0F6', panel: '#FFFFFF', wash: '#F6F7FB',
  indigo: '#6366F1', green: '#16A34A', amber: '#D97706', red: '#E11D48',
  blue: '#2563EB', orange: '#EA580C',
}

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const fmtDate = (iso: string) => { const [, m, d] = iso.split('-').map(Number); return `${String(d).padStart(2, '0')} ${MONTH_SHORT[m - 1]}` }

const RISK_RANK: Record<RiskLevel, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 }

/** Table "Risks" status derived from the project's risk level. */
function riskStatus(r: RiskLevel): { label: string; fg: string; bg: string } {
  if (r === 'Critical') return { label: 'Critical', fg: C.red,   bg: 'rgba(225,29,72,0.10)' }
  if (r === 'Low')      return { label: 'On Track', fg: C.green, bg: 'rgba(22,163,74,0.10)' }
  return { label: 'At Risk', fg: C.amber, bg: 'rgba(217,119,6,0.10)' } // Medium & High
}

/** Utilization status buckets (BA-defined thresholds). */
function utilStatus(v: number): { label: string; fg: string; bg: string } {
  if (v > 120) return { label: 'Highly Over Utilized', fg: C.red,    bg: 'rgba(225,29,72,0.10)' }
  if (v > 100) return { label: 'Over Utilized',         fg: C.orange, bg: 'rgba(234,88,12,0.10)' }
  if (v >= 80) return { label: 'Optimal',               fg: C.green,  bg: 'rgba(22,163,74,0.10)' }
  return { label: 'Under Utilized', fg: C.amber, bg: 'rgba(217,119,6,0.10)' }
}

/** Softer, lighter bar tones (the saturated set was too harsh). */
const billColor = (v: number) => v >= 85 ? '#5FC08D' : v >= 75 ? '#8AA0F2' : v >= 55 ? '#EBC17A' : '#EC9AA0'

function Badge({ text, fg, bg, dot }: { text: string; fg: string; bg: string; dot?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full" style={{ background: bg, color: fg, padding: '4px 10px', fontSize: 11.5, fontWeight: 700, whiteSpace: 'nowrap' }}>
      {dot && <span className="rounded-full" style={{ width: 6, height: 6, background: fg }} />}{text}
    </span>
  )
}

/* ── compact KPI card (with hover) ── */
function Kpi({ Icon, label, value, fg, valueColor }: { Icon: React.ElementType; label: string; value: string; fg: string; valueColor?: string }) {
  return (
    <div
      className="rounded-2xl flex items-center gap-3"
      style={{ background: C.panel, border: `1px solid ${C.border}`, padding: '14px 16px', transition: 'all 0.15s' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#D5D9EA'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(28,32,53,0.05)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
    >
      <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: 42, height: 42, background: `${fg}14` }}>
        <Icon size={20} strokeWidth={2} style={{ color: fg }} />
      </div>
      <div className="min-w-0">
        <div style={{ fontSize: 24, fontWeight: 800, color: valueColor ?? C.navy, letterSpacing: '-0.5px', lineHeight: 1.05 }}>{value}</div>
        <div className="truncate" style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginTop: 3 }}>{label}</div>
      </div>
    </div>
  )
}

/* ── panel shell ── */
function Panel({ title, Icon, right, children, style }: { title: string; Icon?: React.ElementType; right?: React.ReactNode; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}`, ...style }}>
      <div className="flex items-center justify-between gap-3" style={{ padding: '16px 20px', borderBottom: `1px solid ${C.line}` }}>
        <div className="flex items-center gap-2">
          {Icon && <Icon size={17} style={{ color: C.indigo }} />}
          <span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>{title}</span>
        </div>
        {right}
      </div>
      {children}
    </div>
  )
}

/* ── Active projects — month-on-month line chart with hover ── */
function TrendChart() {
  const ref = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(100)
  const [hover, setHover] = useState<number | null>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const ro = new ResizeObserver(entries => { for (const e of entries) setW(e.contentRect.width) })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const H = 210, padL = 14, padR = 14, padT = 22, padB = 8
  const data = ACTIVE_TREND
  const vals = data.map(d => d.active)
  // Baseline at 0 so a consistently-high series renders near the top of the chart.
  const yMin = 0, yMax = Math.max(...vals) + 1
  const xOf = (i: number) => padL + (i * (w - padL - padR)) / (data.length - 1)
  const yOf = (v: number) => padT + (1 - (v - yMin) / (yMax - yMin)) * (H - padT - padB)
  const base = H - padB
  const bandW = (w - padL - padR) / (data.length - 1)

  const pts = data.map((d, i) => `${xOf(i)},${yOf(d.active)}`)
  const linePath = `M ${pts.join(' L ')}`
  const areaPath = `M ${xOf(0)},${base} L ${pts.join(' L ')} L ${xOf(data.length - 1)},${base} Z`

  return (
    <div style={{ padding: '16px 12px 12px' }}>
      <div ref={ref} style={{ width: '100%', position: 'relative' }}>
        <svg width={w} height={H} style={{ display: 'block' }}>
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(22,163,74,0.22)" />
              <stop offset="100%" stopColor="rgba(22,163,74,0)" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#trendFill)" />
          <path d={linePath} fill="none" stroke={C.green} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          {hover !== null && <line x1={xOf(hover)} y1={padT - 6} x2={xOf(hover)} y2={base} stroke={C.green} strokeWidth={1} strokeDasharray="3 3" opacity={0.5} />}
          {data.map((d, i) => (
            <circle key={d.label} cx={xOf(i)} cy={yOf(d.active)} r={hover === i ? 5 : 3.5} fill="#fff" stroke={C.green} strokeWidth={2.5} style={{ transition: 'r 0.1s' }} />
          ))}
          {data.map((d, i) => (
            <rect key={`hit-${d.label}`} x={xOf(i) - bandW / 2} y={0} width={bandW} height={H} fill="transparent" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} />
          ))}
        </svg>
        {hover !== null && (
          <div style={{ position: 'absolute', left: xOf(hover), top: yOf(data[hover].active), transform: 'translate(-50%, -128%)', background: C.navy, color: '#fff', borderRadius: 8, padding: '5px 9px', fontSize: 11.5, fontWeight: 600, whiteSpace: 'nowrap', pointerEvents: 'none', boxShadow: '0 6px 16px rgba(28,32,53,0.20)' }}>
            {data[hover].label} · {data[hover].active} active
          </div>
        )}
      </div>
      <div style={{ display: 'flex', padding: `6px ${padL}px 0` }}>
        {data.map((d, i) => (
          <div key={d.label} style={{ flex: 1, textAlign: 'center', fontSize: 11, fontWeight: hover === i ? 700 : 600, color: hover === i ? C.green : C.faint }}>{d.label}</div>
        ))}
      </div>
    </div>
  )
}

/* ── Billing utilization — vertical bars, horizontal scroll ── */
const BAR_W = 54, BAR_GAP = 18
function BillingBars() {
  const rows = PORTFOLIO_PROJECTS
  const CH = 176
  const innerW = rows.length * BAR_W + (rows.length - 1) * BAR_GAP
  return (
    <div style={{ padding: '20px 12px 16px', overflowX: 'auto' }}>
      <div style={{ minWidth: innerW }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: BAR_GAP, height: CH }}>
          {rows.map(p => {
            const h = Math.max(10, (p.billable / 100) * CH)
            return (
              <div key={p.id} style={{ width: BAR_W, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: C.navy, marginBottom: 6 }}>{p.billable}%</span>
                <div style={{ width: 40, height: h, background: billColor(p.billable), borderRadius: '7px 7px 0 0' }} />
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: BAR_GAP, marginTop: 8, borderTop: `1px solid ${C.line}`, paddingTop: 8 }}>
          {rows.map(p => <div key={p.id} className="truncate" style={{ width: BAR_W, flexShrink: 0, textAlign: 'center', fontSize: 11, fontWeight: 600, color: C.muted }}>{p.name.split(' ')[0]}</div>)}
        </div>
      </div>
    </div>
  )
}

/* ── main page ── */
export default function ProjectsDashboardPage({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const kpi = getPortfolioKpis()
  const riskStatusCounts = PORTFOLIO_PROJECTS.reduce(
    (acc, p) => { acc[riskStatus(p.risk).label]++; return acc },
    { 'On Track': 0, 'At Risk': 0, 'Critical': 0 } as Record<string, number>,
  )
  const table = PORTFOLIO_PROJECTS
  const [visibleCount, setVisibleCount] = useState(5)
  const rows = table.slice(0, visibleCount)
  const allShown = visibleCount >= table.length

  const risks: PortfolioProject[] = [...PORTFOLIO_PROJECTS].sort((a, b) => RISK_RANK[a.risk] - RISK_RANK[b.risk]).slice(0, 4)
  const feed = [...UPCOMING_MILESTONES].sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === 'Critical Update' ? -1 : 1
    return a.target.localeCompare(b.target)
  }).slice(0, 4)

  const TCOLS = '2fr 0.6fr 0.85fr 1.7fr 1fr 0.6fr'
  const THEAD: { h: string; align?: 'right' | 'center' }[] = [
    { h: 'Project' }, { h: 'Team' }, { h: 'Utilization' }, { h: 'Utilization Status' }, { h: 'Risks' }, { h: 'Action', align: 'center' },
  ]
  const riskTiles = [
    { label: 'On Track', n: riskStatusCounts['On Track'], fg: C.green },
    { label: 'At Risk',  n: riskStatusCounts['At Risk'],  fg: C.amber },
    { label: 'Critical', n: riskStatusCounts['Critical'], fg: C.red },
  ]

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Heading — full-width light card with splash icon */}
      <div className="rounded-2xl flex items-start gap-3" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.10), rgba(99,102,241,0.02))', border: '1px solid rgba(99,102,241,0.20)', padding: '16px 18px', marginBottom: 20 }}>
        <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: 40, height: 40, background: '#fff', border: `1px solid ${C.border}` }}>
          <Sparkles size={19} style={{ color: C.indigo }} />
        </div>
        <div className="min-w-0">
          <h1 style={{ fontSize: 17, fontWeight: 800, color: C.navy }}>Projects Dashboard</h1>
          <p style={{ fontSize: 13, color: C.muted, marginTop: 3, lineHeight: 1.55 }}>A quick executive overview of all projects across the portfolio — health, risks, utilization and milestones at a glance.</p>
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 16 }}>
        <Kpi Icon={FolderKanban}  label="Total Projects"    value={String(kpi.total)}         fg={C.indigo} />
        <Kpi Icon={Activity}      label="Active"            value={String(kpi.active)}        fg={C.green} />
        <Kpi Icon={Gauge}         label="Avg Billing Util." value={`${kpi.avgBillable}%`}     fg={C.blue} />
        <Kpi Icon={AlertTriangle} label="At Risk / Delayed" value={String(kpi.atRiskDelayed)} fg={C.red} valueColor={C.red} />
      </div>

      {/* Full-width Projects table */}
      <div style={{ marginTop: 20 }}>
        <Panel title="Projects" right={
          <button onClick={() => onNavigate?.('projects')} className="inline-flex items-center gap-1 cursor-pointer" style={{ background: 'transparent', border: 'none', fontSize: 12.5, fontWeight: 700, color: C.indigo, fontFamily: 'inherit' }}>
            View all <ArrowRight size={13} />
          </button>
        }>
          {/* header */}
          <div style={{ display: 'grid', gridTemplateColumns: TCOLS, gap: 16, padding: '11px 22px', borderBottom: `1px solid ${C.line}`, background: C.wash }}>
            {THEAD.map(c => (
              <div key={c.h} style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, letterSpacing: 0.4, textTransform: 'uppercase', textAlign: c.align ?? 'left' }}>{c.h}</div>
            ))}
          </div>
          {/* rows */}
          {rows.map((p, i) => {
            const us = utilStatus(p.utilization), rst = riskStatus(p.risk)
            return (
              <div key={p.id} style={{ display: 'grid', gridTemplateColumns: TCOLS, gap: 16, alignItems: 'center', padding: '13px 22px', borderBottom: i < rows.length - 1 ? `1px solid ${C.line}` : 'none', transition: 'background 0.14s' }}
                onMouseEnter={e => { e.currentTarget.style.background = C.wash }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="rounded-lg flex items-center justify-center flex-shrink-0" style={{ width: 32, height: 32, background: C.wash }}>
                    <FolderKanban size={15} style={{ color: C.muted }} />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate" style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{p.name}</div>
                    <div className="truncate" style={{ fontSize: 11, color: C.faint }}>{p.client}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5" style={{ color: C.ink }}>
                  <Users size={13} style={{ color: C.faint }} /><span style={{ fontSize: 13, fontWeight: 700 }}>{p.teamCount}</span>
                </div>
                <div>
                  <span className="inline-flex items-center rounded-md" style={{ background: us.bg, color: us.fg, padding: '3px 10px', fontSize: 12, fontWeight: 800 }}>{p.utilization}%</span>
                </div>
                {/* utilization status */}
                <div><Badge text={us.label} fg={us.fg} bg={us.bg} dot /></div>
                {/* risk status */}
                <div><Badge text={rst.label} fg={rst.fg} bg={rst.bg} dot /></div>
                {/* action — view */}
                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={() => onNavigate?.('projects')}
                    title={`View ${p.name}`}
                    aria-label={`View ${p.name}`}
                    className="inline-flex items-center justify-center rounded-lg cursor-pointer"
                    style={{ width: 32, height: 32, background: C.wash, border: `1px solid ${C.border}`, color: C.muted, transition: 'all 0.14s' }}
                    onMouseEnter={e => { e.currentTarget.style.color = C.indigo; e.currentTarget.style.borderColor = '#C7CBE6' }}
                    onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.border }}
                  >
                    <Eye size={15} />
                  </button>
                </div>
              </div>
            )
          })}
          {/* footer — count (left) + load more / show less link (right) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '13px 22px', borderTop: `1px solid ${C.line}` }}>
            <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 500 }}>
              Showing <b style={{ color: C.navy, fontWeight: 700 }}>{rows.length}</b> of <b style={{ color: C.navy, fontWeight: 700 }}>{table.length}</b> projects
            </span>
            <button
              onClick={() => setVisibleCount(allShown ? 5 : Math.min(table.length, visibleCount + 5))}
              className="inline-flex items-center gap-1 cursor-pointer"
              style={{ background: 'transparent', border: 'none', color: C.indigo, fontSize: 12.5, fontWeight: 700, fontFamily: 'inherit', padding: 0 }}
            >
              {allShown ? 'Show less' : 'Load more'} <ArrowRight size={13} />
            </button>
          </div>
        </Panel>
      </div>

      {/* Project Risks (7) + Risk Overview & Milestones (5) — equal height */}
      <div style={{ display: 'flex', gap: 20, marginTop: 20, alignItems: 'stretch' }}>
        {/* Project Risks */}
        <div style={{ flex: '7 1 0', minWidth: 0, display: 'flex' }}>
          <Panel title="Project Risks" Icon={ShieldAlert} right={<span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Top {risks.length}</span>} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1 }}>
              {risks.map((p, i) => (
                <div key={p.id} className="flex gap-4" style={{ padding: '15px 20px', borderBottom: i < risks.length - 1 ? `1px solid ${C.line}` : 'none', transition: 'background 0.14s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.wash }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                  <div style={{ width: 170, flexShrink: 0 }}>
                    <div className="truncate" style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{p.name}</div>
                    <div className="truncate" style={{ fontSize: 11.5, color: C.faint, marginTop: 2 }}>{p.pm}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="rounded-xl" style={{ background: C.wash, border: `1px solid ${C.border}`, padding: '11px 13px', fontSize: 12.5, color: C.ink, lineHeight: 1.55 }}>{p.riskNote}</div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Right column */}
        <div style={{ flex: '5 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Panel title="Risk Overview" Icon={AlertTriangle}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, padding: 16 }}>
              {riskTiles.map(t => (
                <div key={t.label} className="rounded-xl" style={{ background: `${t.fg}0F`, border: `1px solid ${t.fg}26`, padding: '14px 16px' }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: t.fg, lineHeight: 1 }}>{t.n}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginTop: 5 }}>{t.label}</div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Milestones & Critical Updates" Icon={CalendarClock} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1 }}>
              {feed.map((m, i) => {
                const critical = m.kind === 'Critical Update'
                const fg = critical ? C.red : C.indigo
                const bg = critical ? 'rgba(225,29,72,0.10)' : 'rgba(99,102,241,0.10)'
                const Ic = critical ? AlertTriangle : Flag
                return (
                  <div key={m.id} className="flex items-center gap-3" style={{ padding: '13px 20px', borderBottom: i < feed.length - 1 ? `1px solid ${C.line}` : 'none', transition: 'background 0.14s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.wash }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                    <div className="rounded-lg flex items-center justify-center flex-shrink-0" style={{ width: 30, height: 30, background: bg }}>
                      <Ic size={14} style={{ color: fg }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate" style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{m.name}</div>
                      <div className="truncate" style={{ fontSize: 11.5, color: C.faint }}>{m.project}</div>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.muted, flexShrink: 0 }}>{fmtDate(m.target)}</span>
                  </div>
                )
              })}
            </div>
          </Panel>
        </div>
      </div>

      {/* Charts: MoM trend (7) + Billing utilization (5) — equal height */}
      <div style={{ display: 'flex', gap: 20, marginTop: 20, alignItems: 'stretch' }}>
        <div style={{ flex: '7 1 0', minWidth: 0, display: 'flex' }}>
          <Panel title="Active Projects — Month on Month" Icon={TrendingUp} right={<span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Last 8 months</span>} style={{ flex: 1, minWidth: 0 }}>
            <TrendChart />
          </Panel>
        </div>
        <div style={{ flex: '5 1 0', minWidth: 0, display: 'flex' }}>
          <Panel title="Billing Utilization by Project" Icon={BarChart3} right={<span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Billable %</span>} style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
            <BillingBars />
          </Panel>
        </div>
      </div>
    </div>
  )
}
