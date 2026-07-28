import { useState } from 'react'
import {
  FolderKanban, CheckCircle2, Search, ChevronDown, Plus, X,
  LayoutTemplate, Settings2, LayoutGrid,
} from 'lucide-react'
import {
  ASSIGNMENT_PROJECTS, PM_AVATARS, statusOf,
  type AssignmentProject, type AssignStatus, type Assignment,
} from './projectAssignmentData'
import AssignmentEditorPage from './AssignmentEditorPage'

const C = {
  navy: '#1C2035', ink: '#2A2F45', muted: '#8B90A7', faint: '#AEB2C4',
  border: '#E8EAF2', line: '#EEF0F6', panel: '#FFFFFF', wash: '#F6F7FB',
  indigo: '#6366F1', green: '#16A34A', amber: '#D97706', red: '#E11D48', slate: '#64748B',
}

function initials(n: string) { return n.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() }
function Avatar({ name, size = 30 }: { name: string; size?: number }) {
  const img = PM_AVATARS[name]
  if (img) return <img src={`https://i.pravatar.cc/150?img=${img}`} alt={name} className="rounded-full flex-shrink-0 object-cover" style={{ width: size, height: size, border: `1px solid ${C.border}` }} />
  return <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: size, height: size, background: 'rgba(99,102,241,0.10)', color: C.indigo, fontSize: size * 0.36, fontWeight: 700 }}>{initials(name)}</div>
}
function StatusPill({ status }: { status: AssignStatus }) {
  const on = status === 'Assigned'
  const fg = on ? C.green : C.amber, bg = on ? 'rgba(22,163,74,0.10)' : 'rgba(217,119,6,0.10)'
  return <span className="inline-flex items-center gap-1.5 rounded-full" style={{ background: bg, color: fg, padding: '4px 10px', fontSize: 12, fontWeight: 600 }}><span className="rounded-full" style={{ width: 6, height: 6, background: fg }} />{status}</span>
}

export default function ProjectAssignmentPage() {
  const [projects, setProjects] = useState<AssignmentProject[]>(ASSIGNMENT_PROJECTS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [pmFilter, setPmFilter] = useState('all')
  const [toast, setToast] = useState<string | null>(null)
  const [editor, setEditor] = useState<{ project: AssignmentProject; mode: 'assign' | 'manage' } | null>(null)

  function flash(msg: string) { setToast(msg); window.setTimeout(() => setToast(null), 2600) }
  const pmNames = [...new Set(projects.map(p => p.pm))]

  const visible = projects.filter(p => {
    const q = search.trim().toLowerCase()
    const mSearch = !q || p.name.toLowerCase().includes(q) || p.client.toLowerCase().includes(q) || p.pm.toLowerCase().includes(q)
    const mStatus = statusFilter === 'all' || statusOf(p) === statusFilter
    const mPm = pmFilter === 'all' || p.pm === pmFilter
    return mSearch && mStatus && mPm
  })

  function handlePublish(projectId: string, assignments: Assignment[]) {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, assignments } : p))
    const name = projects.find(p => p.id === projectId)?.name ?? 'Project'
    flash(assignments.length > 0 ? `Reporting published for ${name}.` : `Reporting cleared for ${name}.`)
    setEditor(null)
  }

  const selStyle: React.CSSProperties = { background: 'transparent', color: C.ink, border: `1px solid ${C.border}`, borderRadius: 10, padding: '0 34px 0 12px', height: 38, fontSize: 13, fontWeight: 600, fontFamily: 'inherit', outline: 'none', appearance: 'none', cursor: 'pointer' }
  const COLS = '2fr 1.3fr 1.7fr 1fr 124px'

  // ── Dedicated Assign / Manage page ──
  if (editor) {
    return <AssignmentEditorPage project={editor.project} mode={editor.mode} onBack={() => setEditor(null)} onPublish={handlePublish} />
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Heading + Bulk button */}
      <div className="mb-5 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold" style={{ color: C.navy }}>Project Assignment</h1>
          <p className="text-sm mt-0.5" style={{ color: C.muted }}>Assign reporting templates and schedules to each project across the organization.</p>
        </div>
        <button
          onClick={() => flash('Bulk Assignment — coming in a later phase.')}
          className="inline-flex items-center gap-2 rounded-lg cursor-pointer"
          style={{ height: 40, background: C.panel, color: C.navy, border: `1px solid ${C.border}`, padding: '0 15px', fontSize: 13, fontWeight: 600 }}
          onMouseEnter={e => { e.currentTarget.style.background = C.wash; e.currentTarget.style.borderColor = '#D5D9EA' }}
          onMouseLeave={e => { e.currentTarget.style.background = C.panel; e.currentTarget.style.borderColor = C.border }}
        >
          <LayoutGrid size={16} style={{ color: C.indigo }} /> Bulk Assignment
        </button>
      </div>

      {/* Toolbar */}
      <div className="rounded-2xl flex items-center gap-3 flex-wrap" style={{ background: C.panel, border: `1px solid ${C.border}`, padding: 14, marginBottom: 16 }}>
        <div className="relative" style={{ flex: 1, minWidth: 240 }}>
          <Search size={16} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: C.muted }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects, clients or managers…" style={{ width: '100%', height: 38, background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 10, padding: '0 12px 0 38px', fontSize: 13.5, fontWeight: 500, color: C.ink, outline: 'none', fontFamily: 'inherit' }} />
        </div>
        <div className="relative"><select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selStyle}><option value="all">All Status</option><option value="Assigned">Assigned</option><option value="Not Assigned">Not Assigned</option></select><ChevronDown size={15} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} /></div>
        <div className="relative"><select value={pmFilter} onChange={e => setPmFilter(e.target.value)} style={selStyle}><option value="all">All Managers</option>{pmNames.map(n => <option key={n} value={n}>{n}</option>)}</select><ChevronDown size={15} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} /></div>
      </div>

      {/* Table */}
      <div className="rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: COLS, gap: 12, alignItems: 'center', padding: '11px 18px', borderBottom: `1px solid ${C.line}`, background: C.wash, borderRadius: '16px 16px 0 0' }}>
          {[{ h: 'Project', pl: 44 }, { h: 'Project Manager', pl: 0 }, { h: 'Reporting Templates', pl: 0 }, { h: 'Status', pl: 0 }, { h: 'Action', pl: 0, right: true }].map(c => (
            <div key={c.h} style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: 0.4, textTransform: 'uppercase', textAlign: c.right ? 'right' : 'left', paddingLeft: c.pl, whiteSpace: 'nowrap' }}>{c.h}</div>
          ))}
        </div>
        {visible.length === 0 ? (
          <div style={{ padding: '44px 18px', textAlign: 'center', color: C.muted, fontSize: 13 }}>No projects match your filters.</div>
        ) : visible.map((p, i) => {
          const st = statusOf(p)
          return (
            <div key={p.id} style={{ display: 'grid', gridTemplateColumns: COLS, gap: 12, alignItems: 'center', padding: '14px 18px', borderBottom: i < visible.length - 1 ? `1px solid ${C.line}` : 'none', transition: 'background 0.15s' }} onMouseEnter={e => { e.currentTarget.style.background = C.wash }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
              <div className="flex items-center gap-2.5 min-w-0"><div className="rounded-lg flex items-center justify-center flex-shrink-0" style={{ width: 34, height: 34, background: C.wash }}><FolderKanban size={16} style={{ color: C.muted }} /></div><div className="min-w-0"><div className="truncate" style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{p.name}</div><div className="truncate" style={{ fontSize: 11.5, color: C.faint }}>{p.client}</div></div></div>
              <div className="flex items-center gap-2 min-w-0"><Avatar name={p.pm} size={28} /><span className="truncate" style={{ fontSize: 12.5, color: C.ink, fontWeight: 600 }}>{p.pm}</span></div>
              <div className="min-w-0">{p.assignments.length === 0 ? <span style={{ fontSize: 12.5, color: C.faint, fontWeight: 500 }}>Not Assigned</span> : <span className="inline-flex items-center gap-1.5 rounded-md" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.20)', color: C.indigo, padding: '4px 10px', fontSize: 12.5, fontWeight: 700 }}><LayoutTemplate size={13} /> {p.assignments.length} template{p.assignments.length > 1 ? 's' : ''}</span>}</div>
              <div><StatusPill status={st} /></div>
              <div style={{ textAlign: 'right' }}>
                {st === 'Not Assigned' ? (
                  <button onClick={() => setEditor({ project: p, mode: 'assign' })} className="inline-flex items-center gap-1 rounded-lg cursor-pointer" style={{ background: 'rgba(99,102,241,0.10)', color: C.indigo, border: '1px solid rgba(99,102,241,0.22)', padding: '7px 12px', fontSize: 12.5, fontWeight: 700 }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.16)' }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.10)' }}><Plus size={13} /> Assign</button>
                ) : (
                  <button onClick={() => setEditor({ project: p, mode: 'manage' })} className="inline-flex items-center gap-1 rounded-lg cursor-pointer" style={{ background: C.wash, color: C.navy, border: `1px solid ${C.border}`, padding: '7px 12px', fontSize: 12.5, fontWeight: 600 }} onMouseEnter={e => { e.currentTarget.style.background = '#EEF0F6'; e.currentTarget.style.borderColor = '#D5D9EA' }} onMouseLeave={e => { e.currentTarget.style.background = C.wash; e.currentTarget.style.borderColor = C.border }}><Settings2 size={13} /> Manage</button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Toast */}
      {toast && (
        <div className="flex items-center gap-2.5" style={{ position: 'fixed', right: 26, bottom: 26, zIndex: 9999, background: C.navy, color: '#fff', borderRadius: 12, padding: '12px 16px', fontSize: 13, fontWeight: 600, boxShadow: '0 14px 40px rgba(10,12,28,0.30)', maxWidth: 380 }}>
          <CheckCircle2 size={17} style={{ color: '#8CE0B0', flexShrink: 0 }} /><span>{toast}</span>
          <button onClick={() => setToast(null)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', marginLeft: 4 }}><X size={15} /></button>
        </div>
      )}
    </div>
  )
}
