import { useState } from 'react'
import {
  Plus, Search, Pencil, Copy, Trash2, ListChecks, Clock,
  CheckCircle2, FileText, Eye, ChevronDown,
} from 'lucide-react'
import {
  C, AWARD_THEME, STATUS_META, fieldSummary,
  type NominationTemplate, type Audience,
} from './nominationTemplatesData'
import AudienceChips from './AudienceChips'

interface Props {
  templates: NominationTemplate[]
  onCreate: () => void
  onView: (t: NominationTemplate) => void
  onEdit: (t: NominationTemplate) => void
  onDuplicate: (t: NominationTemplate) => void
  onDelete: (id: string) => void
}

type AudienceFilter = 'All' | Audience

export default function NominationTemplatesPage({ templates, onCreate, onView, onEdit, onDuplicate, onDelete }: Props) {
  const [search, setSearch]     = useState('')
  const [audFilter, setAud]     = useState<AudienceFilter>('All')
  const [deleteT, setDeleteT]   = useState<NominationTemplate | null>(null)

  const filtered = templates.filter(t => {
    const q = search.trim().toLowerCase()
    const matchesSearch = !q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    const matchesAud = audFilter === 'All' || t.audiences.includes(audFilter as Audience)
    return matchesSearch && matchesAud
  })

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes ntFade  { from { opacity:0 } to { opacity:1 } }
        @keyframes ntModal { from { opacity:0; transform:translateY(10px) scale(0.98) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes ntCard  { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
      `}</style>

      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4" style={{ marginBottom: 20 }}>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: C.navy }}>Nomination Templates</h1>
          <p className="text-sm mt-1" style={{ color: '#787878', fontWeight: 500 }}>
            Build the forms used to collect monthly Rewards &amp; Recognition nominations
          </p>
        </div>
        <button
          onClick={onCreate}
          className="flex items-center gap-2 cursor-pointer transition-all duration-150 flex-shrink-0"
          style={{ height: 40, padding: '0 18px', borderRadius: 11, border: 'none', background: C.navy, color: '#fff', fontSize: 13.5, fontWeight: 700, gap: 7 }}
          onMouseEnter={e => { e.currentTarget.style.background = '#2A3050' }}
          onMouseLeave={e => { e.currentTarget.style.background = C.navy }}
        >
          <Plus size={16} strokeWidth={2.5} /> Create Template
        </button>
      </div>

      {/* ── Toolbar: search (full width) + audience select filter ── */}
      <div
        className="flex items-center gap-3 flex-wrap"
        style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '12px 16px', marginBottom: 18 }}
      >
        {/* Search — first, full width */}
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#B0B4C8', pointerEvents: 'none' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search templates…"
            style={{
              width: '100%', boxSizing: 'border-box', height: 40, paddingLeft: 36, paddingRight: 12,
              border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 13.5, color: C.navy,
              background: C.surface, outline: 'none', fontFamily: 'inherit', transition: 'all 0.15s',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = C.indigo; e.currentTarget.style.background = '#fff' }}
            onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface }}
          />
        </div>

        {/* Audience select filter */}
        <div style={{ position: 'relative', width: 190, flexShrink: 0 }}>
          <select
            value={audFilter}
            onChange={e => setAud(e.target.value as AudienceFilter)}
            style={{
              width: '100%', boxSizing: 'border-box', height: 40, paddingLeft: 12, paddingRight: 34,
              border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 13.5, fontWeight: 500, color: C.navy,
              background: C.surface, outline: 'none', fontFamily: 'inherit', cursor: 'pointer',
              appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', transition: 'all 0.15s',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = C.indigo; e.currentTarget.style.background = '#fff' }}
            onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface }}
          >
            <option value="All">All Audiences</option>
            <option value="Managers">Managers</option>
            <option value="Employees">Employees</option>
          </select>
          <ChevronDown size={15} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', color: '#B0B4C8', pointerEvents: 'none' }} />
        </div>
      </div>

      {/* ── Card gallery ── */}
      {filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center"
          style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '64px 20px', gap: 10 }}
        >
          <div className="flex items-center justify-center" style={{ width: 52, height: 52, borderRadius: 14, background: C.hover }}>
            <FileText size={24} strokeWidth={1.6} style={{ color: C.muted }} />
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>No templates found</span>
          <span style={{ fontSize: 13, color: C.muted }}>Try a different search or filter, or create a new template.</span>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(348px, 1fr))',
            gap: 18,
            alignItems: 'stretch',
          }}
        >
          {filtered.map((t, idx) => {
            const theme = AWARD_THEME[t.award]
            const stat  = STATUS_META[t.status]
            const TIcon = theme.Icon
            return (
              <div
                key={t.id}
                style={{
                  background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16,
                  overflow: 'hidden', display: 'flex', flexDirection: 'column',
                  transition: 'transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease',
                  animation: `ntCard 0.3s ease ${idx * 0.04}s both`,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(10,12,28,0.10)'
                  e.currentTarget.style.borderColor = '#D8DCEC'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.borderColor = C.border
                }}
              >

                <div style={{ padding: '18px 20px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  {/* Top row: icon + status */}
                  <div className="flex items-start justify-between" style={{ marginBottom: 14 }}>
                    <div
                      className="flex items-center justify-center flex-shrink-0"
                      style={{ width: 46, height: 46, borderRadius: 13, background: theme.bg, border: `1px solid ${theme.border}` }}
                    >
                      <TIcon size={22} strokeWidth={1.9} style={{ color: theme.color }} />
                    </div>
                    <span
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20,
                        fontSize: 10.5, fontWeight: 700, color: stat.color, background: stat.bg, border: `1px solid ${stat.border}`,
                        textTransform: 'uppercase', letterSpacing: '0.05em',
                      }}
                    >
                      {t.status}
                    </span>
                  </div>

                  {/* Name */}
                  <div style={{ fontSize: 16, fontWeight: 800, color: C.navy, lineHeight: 1.25, marginBottom: 8 }}>
                    {t.name}
                  </div>

                  {/* Audience chips — one per audience the template targets */}
                  <div style={{ marginBottom: 10 }}>
                    <AudienceChips audiences={t.audiences} prefix="For " />
                  </div>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: 12.8, color: '#5A6080', lineHeight: 1.6, margin: 0,
                      display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}
                  >
                    {t.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4" style={{ marginTop: 'auto', paddingTop: 16 }}>
                    <span className="inline-flex items-center gap-1.5" style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>
                      <ListChecks size={14} strokeWidth={2} style={{ color: C.muted }} /> {fieldSummary(t)}
                    </span>
                    <span className="inline-flex items-center gap-1.5" style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>
                      <Clock size={13} strokeWidth={2} /> {t.updated}
                    </span>
                  </div>
                </div>

                {/* Footer actions */}
                <div
                  className="flex items-center gap-2"
                  style={{ padding: '12px 20px', borderTop: `1px solid ${C.border}`, background: '#FCFCFE' }}
                >
                  <button
                    onClick={() => onEdit(t)}
                    className="flex items-center justify-center gap-2 cursor-pointer transition-all duration-150"
                    style={{ flex: 1, height: 36, borderRadius: 9, border: `1px solid ${C.border}`, background: '#fff', color: C.navy, fontSize: 12.5, fontWeight: 700, fontFamily: 'inherit' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.borderColor = C.indigo; e.currentTarget.style.color = C.indigo }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.navy }}
                  >
                    <Pencil size={14} strokeWidth={2} /> Edit
                  </button>
                  <button
                    title="View"
                    onClick={() => onView(t)}
                    className="flex items-center justify-center rounded-lg border cursor-pointer transition-all duration-150"
                    style={{ width: 36, height: 36, borderRadius: 9, border: `1px solid ${C.border}`, background: '#fff', color: C.muted }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.hover; e.currentTarget.style.color = C.navy }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = C.muted }}
                  >
                    <Eye size={15} strokeWidth={2} />
                  </button>
                  <button
                    title="Duplicate"
                    onClick={() => onDuplicate(t)}
                    className="flex items-center justify-center rounded-lg border cursor-pointer transition-all duration-150"
                    style={{ width: 36, height: 36, borderRadius: 9, border: `1px solid ${C.border}`, background: '#fff', color: C.muted }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.hover; e.currentTarget.style.color = C.navy }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = C.muted }}
                  >
                    <Copy size={14} strokeWidth={2} />
                  </button>
                  <button
                    title="Delete"
                    onClick={() => setDeleteT(t)}
                    className="flex items-center justify-center rounded-lg border cursor-pointer transition-all duration-150"
                    style={{ width: 36, height: 36, borderRadius: 9, border: `1px solid ${C.border}`, background: '#fff', color: C.muted }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.10)'; e.currentTarget.style.borderColor = 'rgba(232,72,85,0.3)'; e.currentTarget.style.color = C.red }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
                  >
                    <Trash2 size={14} strokeWidth={1.9} />
                  </button>
                </div>
              </div>
            )
          })}

          {/* Create-new card */}
          <button
            onClick={onCreate}
            className="flex flex-col items-center justify-center cursor-pointer"
            style={{
              minHeight: 260, borderRadius: 16, border: `2px dashed #D8DCEC`, background: C.surface,
              color: C.muted, fontFamily: 'inherit', gap: 12, transition: 'all 0.16s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.indigo; e.currentTarget.style.background = 'rgba(99,102,241,0.06)'; e.currentTarget.style.color = C.indigo }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#D8DCEC'; e.currentTarget.style.background = C.surface; e.currentTarget.style.color = C.muted }}
          >
            <div className="flex items-center justify-center" style={{ width: 48, height: 48, borderRadius: 14, background: '#E9ECF5' }}>
              <Plus size={22} strokeWidth={2.2} />
            </div>
            <span style={{ fontSize: 13.5, fontWeight: 700 }}>Create Template</span>
            <span style={{ fontSize: 11.5, fontWeight: 500 }}>Start a new nomination form</span>
          </button>
        </div>
      )}

      {/* ── Delete confirmation modal ── */}
      {deleteT && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ background: 'rgba(10,12,28,0.50)', backdropFilter: 'blur(4px)', zIndex: 9999, padding: 20, animation: 'ntFade 0.16s ease' }}
          onClick={e => { if (e.target === e.currentTarget) setDeleteT(null) }}
        >
          <div style={{ background: '#fff', borderRadius: 20, padding: '30px 26px 22px', width: 400, boxShadow: '0 24px 64px rgba(10,12,28,0.20)', textAlign: 'center', animation: 'ntModal 0.2s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center justify-center" style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(232,72,85,0.10)', margin: '0 auto 18px' }}>
              <Trash2 size={24} strokeWidth={1.8} style={{ color: C.red }} />
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.navy, marginBottom: 8 }}>Delete Template</div>
            <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.65, marginBottom: 24 }}>
              This will remove the <strong style={{ color: C.navy }}>{deleteT.name}</strong> template.<br />This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteT(null)}
                className="cursor-pointer"
                style={{ flex: 1, height: 44, borderRadius: 12, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 14, fontWeight: 600, fontFamily: 'inherit' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
              >
                Cancel
              </button>
              <button
                onClick={() => { onDelete(deleteT.id); setDeleteT(null) }}
                className="inline-flex items-center justify-center gap-2 cursor-pointer"
                style={{ flex: 1, height: 44, borderRadius: 12, border: 'none', background: C.red, color: '#fff', fontSize: 14, fontWeight: 700, fontFamily: 'inherit' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#D43F4B' }}
                onMouseLeave={e => { e.currentTarget.style.background = C.red }}
              >
                <CheckCircle2 size={16} strokeWidth={2.2} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
