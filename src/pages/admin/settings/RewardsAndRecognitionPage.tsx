import { useState } from 'react'
import { Trophy, Plus, Search, Send, Clock, FileText } from 'lucide-react'

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', surface: '#F7F8FC' }

export default function RewardsAndRecognitionPage() {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('sent')

  // Sample stats
  const sentCount = 12
  const scheduledCount = 3
  const draftCount = 5

  const TABS = [
    { id: 'sent', label: 'Sent' },
    { id: 'scheduled', label: 'Scheduled' },
    { id: 'draft', label: 'Drafts' },
  ]

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-xl font-bold" style={{ color: C.navy }}>Rewards and Recognition</h1>
            {scheduledCount > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(99,102,241,0.10)', color: '#6366F1', border: '1px solid rgba(99,102,241,0.20)' }}>
                <Trophy size={11} /> {scheduledCount} scheduled
              </span>
            )}
          </div>
          <p className="text-sm" style={{ color: '#787878', fontWeight: 500 }}>Create and manage recognition programs for your organization</p>
        </div>
        <button
          style={{ height: 40, padding: '0 18px', borderRadius: 11, border: 'none', background: C.navy, color: '#fff', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 7, transition: 'background 0.15s', flexShrink: 0 }}
          onMouseEnter={e => { e.currentTarget.style.background = '#2A3050' }}
          onMouseLeave={e => { e.currentTarget.style.background = C.navy }}>
          <Plus size={16} strokeWidth={2.5} /> New Recognition
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Total Sent',   value: sentCount,        color: '#0A8A58', bg: 'rgba(14,168,106,0.08)',   hoverBg: 'rgba(14,168,106,0.14)',  icon: Send       },
          { label: 'Scheduled',    value: scheduledCount,   color: '#6366F1', bg: 'rgba(99,102,241,0.08)',  hoverBg: 'rgba(99,102,241,0.14)',  icon: Clock      },
          { label: 'Drafts',       value: draftCount,       color: '#8B90A7', bg: 'rgba(139,144,167,0.10)', hoverBg: 'rgba(139,144,167,0.18)', icon: FileText   },
        ].map(({ label, value, color, bg, hoverBg, icon: Icon }) => (
          <div key={label}
            style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'default', transition: 'box-shadow 0.15s, border-color 0.15s' }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.boxShadow = '0 4px 18px rgba(28,32,53,0.09)'; el.style.borderColor = '#D4D6E8'; const ico = el.querySelector('.stat-ico') as HTMLElement; if (ico) ico.style.background = hoverBg }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.boxShadow = 'none'; el.style.borderColor = C.border; const ico = el.querySelector('.stat-ico') as HTMLElement; if (ico) ico.style.background = bg }}
          >
            <div className="stat-ico" style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s' }}>
              <Icon size={19} strokeWidth={1.8} style={{ color }} />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: C.navy, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 11.5, color: C.muted, marginTop: 4 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '12px 16px', marginBottom: 16 }}>
        <div className="flex items-center gap-3">
          <div style={{ position: 'relative', flexShrink: 0, width: 340 }}>
            <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search rewards..."
              style={{ width: '100%', height: 38, paddingLeft: 34, paddingRight: 12, border: `1px solid ${C.border}`, borderRadius: 9, fontSize: 13, color: C.navy, background: C.surface, fontFamily: "'DM Sans', system-ui, sans-serif", outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s, background 0.15s' }}
              onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.background = '#fff' }}
              onBlur={e => { e.target.style.borderColor = C.border; e.target.style.background = C.surface }}
            />
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ height: 34, padding: '0 14px', borderRadius: 8, border: 'none', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', background: tab === t.id ? C.navy : C.hover, color: tab === t.id ? '#fff' : C.muted, transition: 'all 0.15s', fontFamily: 'inherit' }}
                onMouseEnter={e => { if (tab !== t.id) { e.currentTarget.style.background = '#E4E6EF'; e.currentTarget.style.color = C.navy } }}
                onMouseLeave={e => { if (tab !== t.id) { e.currentTarget.style.background = C.hover; e.currentTarget.style.color = C.muted } }}
              >{t.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Empty state */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ width: 60, height: 60, borderRadius: 16, background: 'rgba(99,102,241,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <Trophy size={32} style={{ color: '#6366F1' }} />
        </div>
        <p style={{ fontSize: 16, fontWeight: 700, color: C.navy, margin: '0 0 8px' }}>No rewards yet</p>
        <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Create your first recognition to get started</p>
      </div>
    </div>
  )
}
