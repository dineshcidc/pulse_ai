import { useState } from 'react'
import {
  LayoutTemplate, Plus, Search, ChevronDown, Layers, FolderKanban, Clock3,
  Eye, Pencil, MoreVertical, Copy, Trash2, FileText, AlertTriangle, X, CheckCircle2,
} from 'lucide-react'
import {
  REPORTING_TEMPLATES, getTemplateKpis, formatDate,
  type ReportTemplate, type TemplateStatus, type Frequency,
} from './reportingTemplatesData'
import TemplatePreviewPage, { templateToPreview, type PreviewData } from './TemplatePreviewPage'

const C = {
  navy:   '#1C2035',
  ink:    '#2A2F45',
  muted:  '#8B90A7',
  faint:  '#AEB2C4',
  border: '#E8EAF2',
  line:   '#EEF0F6',
  panel:  '#FFFFFF',
  wash:   '#F6F7FB',
  indigo: '#6366F1',
  green:  '#16A34A',
  amber:  '#D97706',
  red:    '#E11D48',
  slate:  '#64748B',
}

const STATUS_STYLE: Record<TemplateStatus, { fg: string; bg: string }> = {
  Active: { fg: C.green, bg: 'rgba(22,163,74,0.10)' },
  Draft:  { fg: C.amber, bg: 'rgba(217,119,6,0.10)' },
}

/* ── small building blocks (shared visual language) ── */

function StatusPill({ status }: { status: TemplateStatus }) {
  const s = STATUS_STYLE[status]
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full"
      style={{ background: s.bg, color: s.fg, padding: '4px 10px', fontSize: 11.5, fontWeight: 700 }}
    >
      <span className="rounded-full" style={{ width: 6, height: 6, background: s.fg }} />
      {status}
    </span>
  )
}

function FreqBadge({ freq }: { freq: string }) {
  return (
    <span
      className="inline-flex items-center rounded-md"
      style={{ background: C.wash, color: C.muted, padding: '3px 9px', fontSize: 11.5, fontWeight: 600, border: `1px solid ${C.border}` }}
    >
      {freq}
    </span>
  )
}

function Kpi({ Icon, label, value, fg, bg }: { Icon: React.ElementType; label: string; value: number | string; fg: string; bg: string }) {
  return (
    <div className="rounded-2xl flex items-center gap-3" style={{ background: C.panel, border: `1px solid ${C.border}`, padding: '14px 16px' }}>
      <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: 38, height: 38, background: bg }}>
        <Icon size={19} strokeWidth={2} style={{ color: fg }} />
      </div>
      <div className="min-w-0">
        <div style={{ fontSize: 24, fontWeight: 800, color: C.navy, lineHeight: 1.05 }}>{value}</div>
        <div className="truncate" style={{ fontSize: 12.5, fontWeight: 600, color: C.muted }}>{label}</div>
      </div>
    </div>
  )
}

/* Small light meta stat used inside the card footer strip. */
function MetaStat({ Icon, text }: { Icon: React.ElementType; text: string }) {
  return (
    <div className="flex items-center gap-1.5 min-w-0">
      <Icon size={13.5} style={{ color: C.faint, flexShrink: 0 }} />
      <span className="truncate" style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>{text}</span>
    </div>
  )
}

/* ── main page ── */

export default function ReportingTemplatesPage({ onOpenBuilder }: { onOpenBuilder: (mode: 'create' | 'edit', template?: ReportTemplate) => void }) {
  const [templates, setTemplates] = useState<ReportTemplate[]>(REPORTING_TEMPLATES)
  const [search, setSearch]       = useState('')
  const [freqFilter, setFreqFilter]     = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [menuOpen, setMenuOpen]   = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ReportTemplate | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [preview, setPreview] = useState<PreviewData | null>(null)
  const kpi = getTemplateKpis(templates)
  const freqOptions: Frequency[] = ['Weekly', 'Biweekly', 'Monthly']

  const visible = templates.filter(t => {
    const q = search.trim().toLowerCase()
    const matchesSearch = !q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    const matchesFreq   = freqFilter === 'all' || t.frequency === freqFilter
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter
    return matchesSearch && matchesFreq && matchesStatus
  })

  function flash(msg: string) {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2400)
  }

  function handleDuplicate(t: ReportTemplate) {
    setMenuOpen(null)
    const copy: ReportTemplate = {
      ...t,
      id: `${t.id}-copy-${Date.now()}`,
      name: `${t.name} (Copy)`,
      status: 'Draft',
      projectsUsing: 0,
      updatedAt: new Date().toISOString().slice(0, 10),
    }
    setTemplates(prev => {
      const idx = prev.findIndex(x => x.id === t.id)
      const next = [...prev]
      next.splice(idx + 1, 0, copy)
      return next
    })
    flash(`Duplicated “${t.name}” as a draft.`)
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return
    setTemplates(prev => prev.filter(t => t.id !== deleteTarget.id))
    flash(`Deleted “${deleteTarget.name}”.`)
    setDeleteTarget(null)
  }

  const selectStyle: React.CSSProperties = {
    background: 'transparent', color: C.ink, border: `1px solid ${C.border}`,
    borderRadius: 10, padding: '0 34px 0 12px', height: 38, fontSize: 13, fontWeight: 600,
    fontFamily: 'inherit', outline: 'none', appearance: 'none', cursor: 'pointer',
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Heading */}
      <div className="mb-5 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold" style={{ color: C.navy }}>Reporting Templates</h1>
          <p className="text-sm mt-0.5" style={{ color: C.muted }}>
            Build and manage the standardized report structures your Project Managers fill in.
          </p>
        </div>
        <button
          onClick={() => onOpenBuilder('create')}
          className="inline-flex items-center gap-1.5 rounded-lg cursor-pointer"
          style={{ height: 36, background: C.navy, color: '#fff', padding: '0 13px', fontSize: 12.5, fontWeight: 600, border: 'none', transition: 'background 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#2A2F45' }}
          onMouseLeave={e => { e.currentTarget.style.background = C.navy }}
        >
          <Plus size={15} /> Create Template
        </button>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 14 }}>
        <Kpi Icon={LayoutTemplate} label="Total Templates" value={kpi.total}    fg={C.indigo} bg="rgba(99,102,241,0.10)" />
        <Kpi Icon={CheckCircle2}   label="Active"          value={kpi.active}   fg={C.green}  bg="rgba(22,163,74,0.10)" />
        <Kpi Icon={FileText}       label="Drafts"          value={kpi.draft}    fg={C.amber}  bg="rgba(217,119,6,0.10)" />
        <Kpi Icon={FolderKanban}   label="Projects Covered" value={kpi.projects} fg={C.slate} bg="rgba(100,116,139,0.10)" />
      </div>

      {/* Toolbar — search + filters inside a white card (controls transparent) */}
      <div className="rounded-2xl flex items-center gap-3 flex-wrap" style={{ background: C.panel, border: `1px solid ${C.border}`, padding: 14, marginTop: 20, marginBottom: 16 }}>
        {/* Search — fills the row */}
        <div className="relative" style={{ flex: 1, minWidth: 240 }}>
          <Search size={16} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: C.muted }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search templates by name or description…"
            style={{
              width: '100%', height: 38, background: 'transparent', border: `1px solid ${C.border}`,
              borderRadius: 10, padding: '0 12px 0 38px', fontSize: 13.5, fontWeight: 500,
              color: C.ink, outline: 'none', fontFamily: 'inherit',
            }}
          />
        </div>
        {/* Filters — after the search on the same row */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative">
            <select value={freqFilter} onChange={e => setFreqFilter(e.target.value)} style={selectStyle}>
              <option value="all">All Frequencies</option>
              {freqOptions.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <ChevronDown size={15} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
          </div>
          <div className="relative">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selectStyle}>
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
            </select>
            <ChevronDown size={15} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
          </div>
        </div>
      </div>

      {/* Card grid */}
      {visible.length === 0 ? (
        <div
          className="rounded-2xl flex flex-col items-center justify-center text-center"
          style={{ background: C.panel, border: `1px dashed ${C.border}`, padding: '56px 20px' }}
        >
          <div className="rounded-2xl flex items-center justify-center" style={{ width: 52, height: 52, background: C.wash, marginBottom: 14 }}>
            <LayoutTemplate size={24} style={{ color: C.faint }} />
          </div>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: C.navy }}>No templates found</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Try adjusting your search or filters.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {visible.map(t => (
            <div
              key={t.id}
              className="rounded-2xl flex flex-col"
              style={{ background: C.panel, border: `1px solid ${C.border}`, transition: 'box-shadow 0.18s, border-color 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 10px 26px rgba(28,32,53,0.08)'; e.currentTarget.style.borderColor = '#D9DCEC' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = C.border }}
            >
              {/* Card body */}
              <div style={{ padding: '18px 18px 16px', flex: 1 }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: 42, height: 42, background: `${t.accent}14` }}>
                    <LayoutTemplate size={21} style={{ color: t.accent }} />
                  </div>
                  <StatusPill status={t.status} />
                </div>

                <div className="flex items-center gap-2 flex-wrap" style={{ marginTop: 14 }}>
                  <span style={{ fontSize: 15.5, fontWeight: 700, color: C.navy }}>{t.name}</span>
                  <FreqBadge freq={t.frequency} />
                </div>

                <p
                  style={{
                    fontSize: 12.75, color: C.muted, lineHeight: 1.55, marginTop: 7,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 40,
                  }}
                >
                  {t.description}
                </p>

                {/* Meta strip */}
                <div className="flex items-center gap-4 flex-wrap" style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.line}` }}>
                  <MetaStat Icon={Layers}       text={`${t.sections.length} sections`} />
                  <MetaStat Icon={FolderKanban} text={`${t.projectsUsing} ${t.projectsUsing === 1 ? 'project' : 'projects'}`} />
                  <MetaStat Icon={Clock3}       text={formatDate(t.updatedAt)} />
                </div>
              </div>

              {/* Card footer — actions */}
              <div className="flex items-center gap-2" style={{ padding: '12px 16px', borderTop: `1px solid ${C.line}`, background: C.wash, borderRadius: '0 0 16px 16px' }}>
                <button
                  onClick={() => setPreview(templateToPreview(t))}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg cursor-pointer"
                  style={{ flex: 1, height: 36, background: C.panel, color: C.muted, border: `1px solid ${C.border}`, fontSize: 12.5, fontWeight: 600, transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#D5D9EA'; e.currentTarget.style.color = C.navy }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
                >
                  <Eye size={14} /> Preview
                </button>
                <button
                  onClick={() => onOpenBuilder('edit', t)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg cursor-pointer"
                  style={{ flex: 1, height: 36, background: C.panel, color: C.muted, border: `1px solid ${C.border}`, fontSize: 12.5, fontWeight: 600, transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.10)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.30)'; e.currentTarget.style.color = C.indigo }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.panel; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
                >
                  <Pencil size={14} /> Edit
                </button>

                {/* Kebab */}
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(menuOpen === t.id ? null : t.id)}
                    className="inline-flex items-center justify-center rounded-lg cursor-pointer"
                    style={{ width: 36, height: 36, background: C.panel, color: C.muted, border: `1px solid ${C.border}` }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#D5D9EA'; e.currentTarget.style.color = C.navy }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
                  >
                    <MoreVertical size={16} />
                  </button>
                  {menuOpen === t.id && (
                    <div
                      className="rounded-xl"
                      style={{
                        position: 'absolute', right: 0, bottom: 44, zIndex: 30, minWidth: 176,
                        background: C.panel, border: `1px solid ${C.border}`, boxShadow: '0 12px 32px rgba(28,32,53,0.16)', padding: 6,
                      }}
                    >
                      <button
                        onClick={() => handleDuplicate(t)}
                        className="w-full flex items-center gap-2.5 rounded-lg cursor-pointer"
                        style={{ padding: '9px 10px', background: 'transparent', border: 'none', fontSize: 13, fontWeight: 600, color: C.ink }}
                        onMouseEnter={e => { e.currentTarget.style.background = C.wash }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                      >
                        <Copy size={15} style={{ color: C.muted }} /> Duplicate
                      </button>
                      <button
                        onClick={() => { setMenuOpen(null); setDeleteTarget(t) }}
                        className="w-full flex items-center gap-2.5 rounded-lg cursor-pointer"
                        style={{ padding: '9px 10px', background: 'transparent', border: 'none', fontSize: 13, fontWeight: 600, color: C.muted, transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(225,29,72,0.08)'; e.currentTarget.style.color = C.red }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.muted }}
                      >
                        <Trash2 size={15} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Click-away layer for the kebab menu */}
      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 20 }} onClick={() => setMenuOpen(null)} />
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.55)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif",
          }}
          onClick={e => { if (e.target === e.currentTarget) setDeleteTarget(null) }}
        >
          <div style={{ background: '#fff', borderRadius: 22, padding: '32px 30px 26px', width: 384, boxShadow: '0 24px 64px rgba(10,12,28,0.22)', textAlign: 'center' }}>
            <div className="rounded-2xl flex items-center justify-center" style={{ width: 60, height: 60, background: 'rgba(225,29,72,0.10)', margin: '0 auto 18px' }}>
              <AlertTriangle size={26} strokeWidth={1.9} style={{ color: C.red }} />
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Delete template?</div>
            <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.6, marginBottom: 8 }}>
              You're about to delete <strong style={{ color: C.ink }}>“{deleteTarget.name}”</strong>.
            </p>
            {deleteTarget.projectsUsing > 0 && (
              <div
                className="rounded-lg flex items-center gap-2 text-left"
                style={{ background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.22)', padding: '9px 12px', marginBottom: 18 }}
              >
                <AlertTriangle size={15} style={{ color: C.amber, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: C.ink, fontWeight: 600 }}>
                  {deleteTarget.projectsUsing} {deleteTarget.projectsUsing === 1 ? 'project is' : 'projects are'} currently using this template.
                </span>
              </div>
            )}
            {deleteTarget.projectsUsing === 0 && <div style={{ height: 10 }} />}

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setDeleteTarget(null)}
                style={{ flex: 1, height: 44, borderRadius: 12, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="inline-flex items-center justify-center gap-2"
                style={{ flex: 1, height: 44, borderRadius: 12, border: 'none', background: C.red, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#C70F3E' }}
                onMouseLeave={e => { e.currentTarget.style.background = C.red }}
              >
                <Trash2 size={15} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className="flex items-center gap-2.5"
          style={{
            position: 'fixed', right: 26, bottom: 26, zIndex: 9999,
            background: C.navy, color: '#fff', borderRadius: 12, padding: '12px 16px',
            fontSize: 13, fontWeight: 600, boxShadow: '0 14px 40px rgba(10,12,28,0.30)',
            fontFamily: "'DM Sans', system-ui, sans-serif", maxWidth: 380,
          }}
        >
          <CheckCircle2 size={17} style={{ color: '#8CE0B0', flexShrink: 0 }} />
          <span>{toast}</span>
          <button onClick={() => setToast(null)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', marginLeft: 4 }}>
            <X size={15} />
          </button>
        </div>
      )}

      {/* Template Preview overlay */}
      {preview && <TemplatePreviewPage data={preview} onBack={() => setPreview(null)} />}
    </div>
  )
}
