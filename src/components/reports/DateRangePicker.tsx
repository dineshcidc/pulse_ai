import { CalendarDays } from 'lucide-react'

/**
 * Shared "Date range (optional)" control for the report pages.
 * Two native date inputs (From / To). Sits at the bottom of a MonthPicker box
 * in Monthly mode. A range is active only when both From and To are set.
 */

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', surface: '#F7F8FC' }

export default function DateRangePicker({ from, to, setFrom, setTo }: {
  from: string; to: string; setFrom: (v: string) => void; setTo: (v: string) => void
}) {
  const active = from !== '' && to !== ''
  const inputStyle: React.CSSProperties = {
    width: '100%', minWidth: 0, height: 34, padding: '0 6px', border: `1px solid ${C.border}`, borderRadius: 8,
    fontSize: 11, fontWeight: 600, color: C.navy, background: '#fff', outline: 'none',
    fontFamily: 'inherit', cursor: 'pointer', boxSizing: 'border-box',
  }
  return (
    <div style={{ borderTop: `1px solid ${C.border}`, padding: '12px 12px 14px', background: C.surface }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: C.muted, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <CalendarDays size={12} strokeWidth={1.8} style={{ color: active ? '#4338CA' : C.muted }} />
          Date range <span style={{ fontWeight: 500 }}>(optional)</span>
        </label>
        {active && (
          <button onClick={() => { setFrom(''); setTo('') }} style={{ fontSize: 11, fontWeight: 600, color: '#4338CA', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            Clear
          </button>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 7, marginTop: 4 }}>
        <div style={{ minWidth: 0 }}>
          <span style={{ display: 'block', fontSize: 9.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>From Date</span>
          <input type="date" value={from} max={to || undefined} onChange={e => setFrom(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ minWidth: 0 }}>
          <span style={{ display: 'block', fontSize: 9.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>To Date</span>
          <input type="date" value={to} min={from || undefined} onChange={e => setTo(e.target.value)} style={inputStyle} />
        </div>
      </div>
    </div>
  )
}
