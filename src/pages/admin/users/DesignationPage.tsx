import { useState } from 'react'
import { Plus, Search, Edit2, Trash2, X, Check, Briefcase } from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────────
interface Designation {
  id: string
  name: string
  employeeCount: number
  createdDate: string
}

// ── Static data ────────────────────────────────────────────────────────────────
const INITIAL: Designation[] = [
  { id: 'd1',  name: 'Project Manager',         employeeCount: 4,  createdDate: 'Jan 10, 2026' },
  { id: 'd2',  name: 'Senior Software Engineer', employeeCount: 8,  createdDate: 'Jan 10, 2026' },
  { id: 'd3',  name: 'Software Engineer',        employeeCount: 14, createdDate: 'Jan 10, 2026' },
  { id: 'd4',  name: 'UI/UX Designer',           employeeCount: 5,  createdDate: 'Jan 12, 2026' },
  { id: 'd5',  name: 'HR Manager',               employeeCount: 2,  createdDate: 'Jan 12, 2026' },
  { id: 'd6',  name: 'QA Engineer',              employeeCount: 6,  createdDate: 'Jan 14, 2026' },
  { id: 'd7',  name: 'DevOps Engineer',          employeeCount: 3,  createdDate: 'Jan 14, 2026' },
  { id: 'd8',  name: 'Product Analyst',          employeeCount: 4,  createdDate: 'Jan 16, 2026' },
  { id: 'd9',  name: 'Finance Manager',          employeeCount: 2,  createdDate: 'Jan 18, 2026' },
  { id: 'd10', name: 'Operations Executive',     employeeCount: 5,  createdDate: 'Feb 2, 2026'  },
  { id: 'd11', name: 'Business Analyst',         employeeCount: 3,  createdDate: 'Feb 5, 2026'  },
  { id: 'd12', name: 'Scrum Master',             employeeCount: 2,  createdDate: 'Feb 10, 2026' },
  { id: 'd13', name: 'Data Engineer',            employeeCount: 3,  createdDate: 'Feb 12, 2026' },
  { id: 'd14', name: 'Technical Lead',           employeeCount: 4,  createdDate: 'Mar 1, 2026'  },
  { id: 'd15', name: 'Marketing Manager',        employeeCount: 2,  createdDate: 'Mar 5, 2026'  },
]

// Pastel badge colours cycling across designations
const BADGE_PALETTES = [
  { color: '#5B5FDE', bg: 'rgba(99,102,241,0.10)'  },
  { color: '#0A8A58', bg: 'rgba(14,168,106,0.10)'  },
  { color: '#7C3AED', bg: 'rgba(124,58,237,0.10)'  },
  { color: '#D97706', bg: 'rgba(245,158,11,0.10)'  },
  { color: '#1D4ED8', bg: 'rgba(59,130,246,0.10)'  },
  { color: '#BE185D', bg: 'rgba(236,72,153,0.10)'  },
  { color: '#0D9488', bg: 'rgba(13,148,136,0.10)'  },
  { color: '#C2410C', bg: 'rgba(249,115,22,0.10)'  },
]
function badgePalette(idx: number) { return BADGE_PALETTES[idx % BADGE_PALETTES.length] }

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', surface: '#F7F8FC' }

const inputStyle: React.CSSProperties = {
  width: '100%', height: 44, borderRadius: 10, padding: '0 14px',
  fontSize: 13.5, fontWeight: 500, color: C.navy, outline: 'none',
  border: `1px solid ${C.border}`, background: '#fff',
  fontFamily: "'DM Sans', system-ui, sans-serif",
  boxSizing: 'border-box', transition: 'border-color 0.15s, box-shadow 0.15s',
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function DesignationPage() {
  const [designations, setDesignations] = useState<Designation[]>(INITIAL)
  const [search,       setSearch]       = useState('')

  // Add modal
  const [showAdd,   setShowAdd]   = useState(false)
  const [addName,   setAddName]   = useState('')
  const [addErr,    setAddErr]    = useState('')
  const [addSaving, setAddSaving] = useState(false)

  // Edit modal
  const [editTarget,  setEditTarget]  = useState<Designation | null>(null)
  const [editName,    setEditName]    = useState('')
  const [editErr,     setEditErr]     = useState('')
  const [editSaving,  setEditSaving]  = useState(false)

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<Designation | null>(null)
  const [deleteSaving, setDeleteSaving] = useState(false)

  // ── Derived ──
  const filtered = designations.filter(d => {
    const q = search.toLowerCase()
    return !q || d.name.toLowerCase().includes(q)
  })

  // ── Add ──
  function openAdd() { setAddName(''); setAddErr(''); setShowAdd(true) }

  async function handleAdd() {
    if (!addName.trim()) { setAddErr('Designation name is required.'); return }
    setAddErr(''); setAddSaving(true)
    await new Promise(r => setTimeout(r, 700))
    const now = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    setDesignations(prev => [...prev, { id: `d${Date.now()}`, name: addName.trim(), employeeCount: 0, createdDate: now }])
    setAddSaving(false); setShowAdd(false)
  }

  // ── Edit ──
  function openEdit(d: Designation) { setEditTarget(d); setEditName(d.name); setEditErr('') }

  async function handleEdit() {
    if (!editTarget) return
    if (!editName.trim()) { setEditErr('Designation name is required.'); return }
    setEditErr(''); setEditSaving(true)
    await new Promise(r => setTimeout(r, 700))
    setDesignations(prev => prev.map(d => d.id === editTarget.id ? { ...d, name: editName.trim() } : d))
    setEditSaving(false); setEditTarget(null)
  }

  // ── Delete ──
  async function handleDelete() {
    if (!deleteTarget) return
    setDeleteSaving(true)
    await new Promise(r => setTimeout(r, 700))
    setDesignations(prev => prev.filter(d => d.id !== deleteTarget.id))
    setDeleteSaving(false); setDeleteTarget(null)
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes dsgFade { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes dsgSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .dsg-row:hover { background: #FAFBFE !important; }
      `}</style>

      {/* ── Page header ── */}
      <div className="flex items-start justify-between" style={{ marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: C.navy, letterSpacing: '-0.3px', margin: 0 }}>Designation</h1>
          <p style={{ fontSize: 13.5, color: '#787878', fontWeight: 500, margin: '4px 0 0' }}>
            Manage all employee designations used across the organisation
          </p>
        </div>
        <button onClick={openAdd}
          style={{ display: 'flex', alignItems: 'center', gap: 6, height: 34, padding: '0 14px', borderRadius: 9, border: 'none', background: C.navy, fontSize: 12.5, fontWeight: 600, color: '#fff', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0, transition: 'background 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#2A3050' }}
          onMouseLeave={e => { e.currentTarget.style.background = C.navy }}>
          <Plus size={13} strokeWidth={2.2} /> Add Designation
        </button>
      </div>

      {/* ── Filter bar ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '13px 16px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search designation…"
              style={{ width: '100%', height: 38, paddingLeft: 32, paddingRight: 10, border: `1px solid ${C.border}`, borderRadius: 9, fontSize: 13, color: C.navy, background: '#fff', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
              onFocus={e => { e.target.style.borderColor = '#6366F1' }}
              onBlur={e => { e.target.style.borderColor = C.border }} />
          </div>
          <div style={{ fontSize: 12.5, color: C.muted, fontWeight: 500, flexShrink: 0 }}>
            <strong style={{ color: C.navy }}>{filtered.length}</strong> designation{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '11px 20px', background: '#F7F8FC', borderBottom: `1px solid ${C.border}` }}>
          {['Designation Name', 'Designation Badge / Tag', 'Created Date', 'Actions'].map(h => (
            <span key={h} style={{ fontSize: 10.5, fontWeight: 700, color: '#B0B4C8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: C.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <Briefcase size={22} strokeWidth={1.4} style={{ color: '#C8CCE0' }} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, margin: '0 0 5px' }}>No designations found</p>
            <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Try a different search term</p>
          </div>
        ) : filtered.map((d, idx) => {
          const palette = badgePalette(INITIAL.findIndex(i => i.id === d.id) >= 0 ? INITIAL.findIndex(i => i.id === d.id) : idx)
          const isLast  = idx === filtered.length - 1
          return (
            <div key={d.id} className="dsg-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '14px 20px', borderBottom: isLast ? 'none' : `1px solid #F0F2F8`, background: '#fff', transition: 'background 0.12s', alignItems: 'center' }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: C.navy }}>{d.name}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', padding: '5px 12px', borderRadius: 8, background: palette.bg, color: palette.color, fontSize: 12.5, fontWeight: 700, width: 'fit-content' }}>
                {d.name}
              </span>
              <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 500 }}>{d.createdDate}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <ActionBtn icon={Edit2}  color="#6366F1" bg="rgba(99,102,241,0.09)" title="Edit"   onClick={() => openEdit(d)} />
                <ActionBtn icon={Trash2} color="#E84855" bg="rgba(232,72,85,0.09)"  title="Delete" onClick={() => setDeleteTarget(d)} />
              </div>
            </div>
          )
        })}

        {filtered.length > 0 && (
          <div style={{ padding: '11px 20px', borderTop: `1px solid ${C.border}`, background: '#FAFBFE' }}>
            <span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>
              Showing <strong style={{ color: C.navy }}>{filtered.length}</strong> of <strong style={{ color: C.navy }}>{designations.length}</strong> designations
            </span>
          </div>
        )}
      </div>

      {/* ══ ADD MODAL ══ */}
      {showAdd && (
        <Modal title="Add Designation" sub="Enter the new designation name" onClose={() => setShowAdd(false)}>
          <div style={{ padding: '20px 28px' }}>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: '#8B90A7', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 7 }}>
              Designation Name <span style={{ color: '#E84855' }}>*</span>
            </label>
            <input value={addName} onChange={e => setAddName(e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)' }}
              onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }}
              onKeyDown={e => { if (e.key === 'Enter') handleAdd() }}
            />
            {addErr && <p style={{ margin: '8px 0 0', fontSize: 12.5, color: '#E84855', fontWeight: 500 }}>{addErr}</p>}
          </div>
          <ModalFooter onCancel={() => setShowAdd(false)} onConfirm={handleAdd} saving={addSaving} label="Add Designation" />
        </Modal>
      )}

      {/* ══ EDIT MODAL ══ */}
      {editTarget && (
        <Modal title="Edit Designation" sub={`Editing: ${editTarget.name}`} onClose={() => setEditTarget(null)}>
          <div style={{ padding: '20px 28px' }}>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: '#8B90A7', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 7 }}>
              Designation Name <span style={{ color: '#E84855' }}>*</span>
            </label>
            <input value={editName} onChange={e => setEditName(e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)' }}
              onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }}
              onKeyDown={e => { if (e.key === 'Enter') handleEdit() }}
            />
            {editErr && <p style={{ margin: '8px 0 0', fontSize: 12.5, color: '#E84855', fontWeight: 500 }}>{editErr}</p>}
          </div>
          <ModalFooter onCancel={() => setEditTarget(null)} onConfirm={handleEdit} saving={editSaving} label="Save Changes" />
        </Modal>
      )}

      {/* ══ DELETE MODAL ══ */}
      {deleteTarget && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.50)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }}
          onClick={e => { if (e.target === e.currentTarget && !deleteSaving) setDeleteTarget(null) }}>
          <div style={{ background: '#fff', borderRadius: 22, width: 400, padding: '36px 32px 28px', boxShadow: '0 28px 72px rgba(10,12,28,0.22)', textAlign: 'center', animation: 'dsgFade 0.22s ease-out' }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, background: 'rgba(232,72,85,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
              <Trash2 size={24} strokeWidth={1.7} style={{ color: '#E84855' }} />
            </div>
            <div style={{ fontSize: 17, fontWeight: 800, color: C.navy, marginBottom: 8 }}>Delete Designation</div>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 11, padding: '12px 16px', margin: '14px 0 18px' }}>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{deleteTarget.name}</span>
              <span style={{ fontSize: 12, color: C.muted, display: 'block', marginTop: 2 }}>{deleteTarget.employeeCount} employee{deleteTarget.employeeCount !== 1 ? 's' : ''} assigned</span>
            </div>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, margin: '0 0 24px' }}>
              This will permanently remove <strong style={{ color: C.navy }}>{deleteTarget.name}</strong> from the system. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteTarget(null)} disabled={deleteSaving}
                style={{ flex: 1, height: 44, borderRadius: 12, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 14, fontWeight: 600, cursor: deleteSaving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
                onMouseEnter={e => { if (!deleteSaving) { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy } }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}>
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleteSaving}
                style={{ flex: 1, height: 44, borderRadius: 12, border: 'none', background: deleteSaving ? '#F87171' : '#E84855', color: '#fff', fontSize: 14, fontWeight: 700, cursor: deleteSaving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.15s' }}
                onMouseEnter={e => { if (!deleteSaving) e.currentTarget.style.background = '#D43F4B' }}
                onMouseLeave={e => { if (!deleteSaving) e.currentTarget.style.background = '#E84855' }}>
                {deleteSaving ? <><Spinner />Deleting…</> : <><Trash2 size={14} />Yes, Delete</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Shared sub-components ──────────────────────────────────────────────────────
function Spinner() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
      style={{ animation: 'dsgSpin 0.8s linear infinite', flexShrink: 0 }}>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  )
}

function Modal({ title, sub, onClose, children }: { title: string; sub: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.50)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: '#fff', borderRadius: 22, width: 460, boxShadow: '0 28px 72px rgba(10,12,28,0.22)', overflow: 'hidden', animation: 'dsgFade 0.22s ease-out' }}>
        <div style={{ padding: '22px 28px 18px', borderBottom: '1px solid #F0F2F8', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Briefcase size={17} strokeWidth={1.8} style={{ color: '#5B5FDE' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#1C2035', letterSpacing: '-0.2px' }}>{title}</div>
            <div style={{ fontSize: 12.5, color: '#8B90A7', marginTop: 1 }}>{sub}</div>
          </div>
          <button onClick={onClose}
            style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #E8EAF2', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B90A7', flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F7F8FC' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}>
            <X size={13} strokeWidth={2} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function ModalFooter({ onCancel, onConfirm, saving, label }: { onCancel: () => void; onConfirm: () => void; saving: boolean; label: string }) {
  return (
    <div style={{ padding: '0 28px 26px', display: 'flex', gap: 10 }}>
      <button onClick={onCancel} disabled={saving}
        style={{ flex: 1, height: 44, borderRadius: 12, border: '1px solid #E8EAF2', background: '#fff', color: '#8B90A7', fontSize: 14, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
        onMouseEnter={e => { if (!saving) { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = '#1C2035' } }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8EAF2'; e.currentTarget.style.color = '#8B90A7' }}>
        Cancel
      </button>
      <button onClick={onConfirm} disabled={saving}
        style={{ flex: 1, height: 44, borderRadius: 12, border: 'none', background: saving ? '#818CF8' : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'opacity 0.15s' }}
        onMouseEnter={e => { if (!saving) e.currentTarget.style.opacity = '0.88' }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
        {saving ? <><Spinner />{label === 'Save Changes' ? 'Saving…' : 'Adding…'}</> : <><Check size={15} strokeWidth={2.5} />{label}</>}
      </button>
    </div>
  )
}

function ActionBtn({ icon: Icon, color, bg, title, onClick }: { icon: React.ElementType; color: string; bg: string; title: string; onClick: () => void }) {
  const [h, setH] = useState(false)
  return (
    <button onClick={onClick} title={title}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${h ? color + '30' : C.border}`, cursor: 'pointer', background: h ? bg : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.14s' }}>
      <Icon size={13} style={{ color: h ? color : '#8B90A7' }} strokeWidth={1.8} />
    </button>
  )
}
