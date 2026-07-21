import { useState } from 'react'
import {
  Pencil, Trash2, Send, Undo2, X, Share2, FolderKanban, ClipboardList,
  FileText, KeyRound, Users, UploadCloud, Paperclip,
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

type Category = 'Project' | 'Ongoing Task' | 'Documentation' | 'Access & Credentials' | 'Client & Contacts' | 'Other'

interface HandoverItem {
  id: string
  title: string
  category: Category
  assignedTo: string
  notes: string
  files: string[]
}

const TEAM = ['Arjun Menon', 'Sarah Johnson', 'Rajesh Kumar', 'Meera Nair', 'David Lee']
const CATEGORIES: Category[] = ['Project', 'Ongoing Task', 'Documentation', 'Access & Credentials', 'Client & Contacts', 'Other']

const CATEGORY_META: Record<Category, { Icon: ElementType; color: string }> = {
  'Project':              { Icon: FolderKanban,  color: '#6366F1' },
  'Ongoing Task':         { Icon: ClipboardList,  color: '#3B82F6' },
  'Documentation':        { Icon: FileText,       color: '#0EA86A' },
  'Access & Credentials': { Icon: KeyRound,       color: '#F59E0B' },
  'Client & Contacts':    { Icon: Users,          color: '#A855F7' },
  'Other':                { Icon: Share2,         color: '#8B90A7' },
}

const INITIAL_ITEMS: HandoverItem[] = [
  { id: 'h1', title: 'Payments Service ownership', category: 'Project', assignedTo: 'Arjun Menon', notes: 'Full ownership of the payments microservice — deployments, on-call, and roadmap items.', files: ['payments-runbook.pdf', 'architecture.png'] },
  { id: 'h2', title: 'API Documentation & Runbooks', category: 'Documentation', assignedTo: 'Meera Nair', notes: 'Updated all API docs and incident runbooks in the team wiki.', files: ['api-docs.pdf'] },
  { id: 'h3', title: 'Client X — Weekly Reports', category: 'Ongoing Task', assignedTo: 'Sarah Johnson', notes: 'Recurring Monday report. Walked Sarah through the process; one more shadow session pending.', files: [] },
]

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 7 }}>
      {children}{required && <span style={{ color: '#E84855', marginLeft: 3 }}>*</span>}
    </label>
  )
}

const inputBase: React.CSSProperties = {
  width: '100%', padding: '10px 12px', fontSize: 13, color: C.navy,
  border: `1px solid ${C.border}`, borderRadius: 9, fontFamily: 'inherit',
  background: '#fff', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s',
}
function focusOn(e: React.FocusEvent<HTMLElement>) { e.currentTarget.style.borderColor = C.indigo }
function focusOff(e: React.FocusEvent<HTMLElement>) { e.currentTarget.style.borderColor = C.border }

function Spinner() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"
      style={{ animation: 'hoSpin 0.7s linear infinite', flexShrink: 0 }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

const COL = '2.6fr 1.4fr 1fr 0.7fr'

export default function HandoverPage() {
  const [status, setStatus] = useState<'draft' | 'submitted'>('draft')
  const [items, setItems] = useState<HandoverItem[]>(INITIAL_ITEMS)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<HandoverItem | null>(null)
  const [confirmSubmit, setConfirmSubmit] = useState(false)
  const [confirmRecall, setConfirmRecall] = useState(false)
  const [deleteItem, setDeleteItem] = useState<HandoverItem | null>(null)

  const submitted = status === 'submitted'

  function openAdd() { setEditing(null); setModalOpen(true) }
  function openEdit(it: HandoverItem) { setEditing(it); setModalOpen(true) }

  function saveItem(data: Omit<HandoverItem, 'id'>) {
    if (editing) setItems(items.map(i => i.id === editing.id ? { ...editing, ...data } : i))
    else setItems([...items, { ...data, id: `h${Date.now()}` }])
    setModalOpen(false)
    setEditing(null)
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@keyframes hoSpin { to { transform: rotate(360deg) } } .ho-row:hover { background:#FAFBFE !important; }`}</style>

      {/* Section header */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: C.navy, margin: 0 }}>Handover / Knowledge Transfer</h2>
        <p style={{ fontSize: 13, color: C.muted, fontWeight: 500, margin: '3px 0 0' }}>
          Hand over your work to your team, then submit for your manager to review and sign off.
        </p>
      </div>

      {/* Information section */}
      <div style={{ display: 'flex', gap: 13, background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.20)', borderRadius: 12, padding: '14px 16px', marginBottom: 18 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(99,102,241,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <UploadCloud size={18} strokeWidth={1.9} style={{ color: C.indigo }} />
        </div>
        <div>
          <h4 style={{ fontSize: 13.5, fontWeight: 700, color: C.navy, margin: 0 }}>Upload your handover materials before you leave</h4>
          <p style={{ fontSize: 12.5, color: '#5A6080', fontWeight: 500, margin: '3px 0 0', lineHeight: 1.6 }}>
            Add all important project-related materials — <strong>documents, reports, credentials, knowledge-transfer notes,</strong> and any other relevant files — and assign each to the colleague taking it over. This ensures nothing is lost after your exit.
          </p>
        </div>
      </div>

      {/* Items card */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '12px 20px', borderBottom: `1px solid ${C.border}`, background: C.surface, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: C.navy, margin: 0 }}>Your Handover Items ({items.length})</h3>
          {!submitted && (
            <button
              onClick={openAdd}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8, cursor: 'pointer', background: 'rgba(99,102,241,0.06)', border: '1px dashed rgba(99,102,241,0.5)', color: '#4F46E5', fontSize: 12.5, fontWeight: 600, fontFamily: 'inherit', transition: 'all 0.15s', whiteSpace: 'nowrap' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.12)'; e.currentTarget.style.borderColor = C.indigo }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.06)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)' }}
            >
              <UploadCloud size={14} strokeWidth={2} /> Add Handover Item
            </button>
          )}
        </div>

        {items.length > 0 ? (
          <>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: COL, gap: 16, padding: '12px 20px', borderBottom: `1px solid ${C.border}` }}>
            {['Item', 'Handed Over To', 'Files', ''].map((h, i) => (
              <span key={i} style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
            ))}
          </div>

          {items.map((it, idx) => {
            const cat = CATEGORY_META[it.category]
            const CatIcon = cat.Icon
            return (
              <div key={it.id} className="ho-row" style={{ display: 'grid', gridTemplateColumns: COL, gap: 16, padding: '15px 20px', alignItems: 'center', borderBottom: idx < items.length - 1 ? `1px solid ${C.border}` : 'none', transition: 'background 0.12s' }}>
                {/* Item */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11, minWidth: 0 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: `${cat.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <CatIcon size={16} strokeWidth={1.9} style={{ color: cat.color }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.title}</div>
                    <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 500, marginTop: 2 }}>{it.category}</div>
                  </div>
                </div>
                {/* Handed over to */}
                <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.assignedTo}</div>
                {/* Files */}
                <div>
                  {it.files.length > 0 ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 600, color: C.navy }}>
                      <Paperclip size={13} style={{ color: C.muted }} />
                      {it.files.length} file{it.files.length !== 1 ? 's' : ''}
                    </span>
                  ) : (
                    <span style={{ fontSize: 12.5, color: C.muted }}>—</span>
                  )}
                </div>
                {/* Actions */}
                <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                  {!submitted ? (
                    <>
                      <IconBtn title="Edit" onClick={() => openEdit(it)} Icon={Pencil} hover="#6366F1" />
                      <IconBtn title="Delete" onClick={() => setDeleteItem(it)} Icon={Trash2} hover="#E84855" />
                    </>
                  ) : (
                    <span style={{ fontSize: 11.5, color: C.muted }}>—</span>
                  )}
                </div>
              </div>
            )
          })}
          </>
        ) : (
          <div style={{ padding: '52px 20px', textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <UploadCloud size={22} strokeWidth={1.6} style={{ color: C.muted }} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, margin: 0 }}>No handover items yet</p>
            <p style={{ fontSize: 12.5, color: C.muted, margin: '4px 0 0' }}>Click "Add Handover Item" to upload your materials.</p>
          </div>
        )}
      </div>

      {/* Footer actions */}
      {!submitted ? (
        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <p style={{ fontSize: 12.5, color: C.muted, fontWeight: 500, margin: 0, maxWidth: 460, lineHeight: 1.55 }}>
            Once submitted, your manager reviews your handover and signs off <strong style={{ color: C.navy }}>Manager Clearance</strong>.
          </p>
          <button
            onClick={() => setConfirmSubmit(true)}
            disabled={items.length === 0}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 10, border: 'none', background: items.length === 0 ? '#C7C9D9' : C.indigo, color: '#fff', fontSize: 13, fontWeight: 600, cursor: items.length === 0 ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'background 0.15s', flexShrink: 0 }}
            onMouseEnter={e => { if (items.length) e.currentTarget.style.background = '#4F46E5' }}
            onMouseLeave={e => { if (items.length) e.currentTarget.style.background = C.indigo }}
          >
            <Send size={15} strokeWidth={2} /> Submit for Manager Review
          </button>
        </div>
      ) : (
        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '16px 20px' }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>Submitted for manager review</div>
            <div style={{ fontSize: 12.5, color: C.muted, fontWeight: 500, marginTop: 2 }}>Need to change something? You can recall it while your manager hasn't signed off yet.</div>
          </div>
          <button
            onClick={() => setConfirmRecall(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, padding: '10px 16px', borderRadius: 9, border: '1px solid rgba(232,72,85,0.35)', background: '#fff', color: '#E84855', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
          >
            <Undo2 size={15} strokeWidth={2} /> Recall Handover
          </button>
        </div>
      )}

      {/* Add / Edit modal */}
      {modalOpen && (
        <ItemModal editing={editing} onCancel={() => { setModalOpen(false); setEditing(null) }} onSave={saveItem} />
      )}

      {/* Delete confirm */}
      {deleteItem && (
        <ConfirmModal tone="danger" Icon={Trash2} title="Delete this handover item?"
          body={`"${deleteItem.title}" will be removed from your handover list.`} confirmLabel="Delete"
          onCancel={() => setDeleteItem(null)}
          onConfirm={() => { setItems(items.filter(i => i.id !== deleteItem.id)); setDeleteItem(null) }} />
      )}

      {/* Submit confirm */}
      {confirmSubmit && (
        <ConfirmModal tone="primary" Icon={Send} title="Submit handover for review?"
          body="Your handover will be sent to your manager to review and sign off. You can recall it while it is still pending."
          confirmLabel="Yes, Submit" onCancel={() => setConfirmSubmit(false)}
          onConfirm={() => { setConfirmSubmit(false); setStatus('submitted') }} />
      )}

      {/* Recall confirm */}
      {confirmRecall && (
        <ConfirmModal tone="danger" Icon={Undo2} title="Recall handover?"
          body="Your handover will return to draft so you can edit it. You'll need to submit again for manager review."
          confirmLabel="Yes, Recall" onCancel={() => setConfirmRecall(false)}
          onConfirm={() => { setConfirmRecall(false); setStatus('draft') }} />
      )}
    </div>
  )
}

function IconBtn({ title, onClick, Icon, hover }: { title: string; onClick: () => void; Icon: ElementType; hover: string }) {
  return (
    <button title={title} onClick={onClick}
      style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
      onMouseEnter={e => { e.currentTarget.style.color = hover; e.currentTarget.style.borderColor = `${hover}55`; e.currentTarget.style.background = `${hover}0F` }}
      onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = '#fff' }}>
      <Icon size={14} strokeWidth={1.9} />
    </button>
  )
}

/* ── Add / Edit item modal ── */
function ItemModal({ editing, onCancel, onSave }: { editing: HandoverItem | null; onCancel: () => void; onSave: (d: Omit<HandoverItem, 'id'>) => void }) {
  const [title, setTitle] = useState(editing?.title ?? '')
  const [category, setCategory] = useState<Category>(editing?.category ?? 'Project')
  const [assignedTo, setAssignedTo] = useState(editing?.assignedTo ?? '')
  const [notes, setNotes] = useState(editing?.notes ?? '')
  const [files, setFiles] = useState<string[]>(editing?.files ?? [])
  const [showErr, setShowErr] = useState(false)

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []).map(f => f.name)
    if (picked.length) setFiles(prev => [...prev, ...picked])
    e.target.value = ''
  }

  function save() {
    if (!title.trim() || !assignedTo || !notes.trim()) { setShowErr(true); return }
    onSave({ title: title.trim(), category, assignedTo, notes: notes.trim(), files })
  }

  const selectWrap = (val: string, set: (v: string) => void, opts: string[], placeholder: string, err?: boolean) => (
    <div style={{ position: 'relative' }}>
      <select value={val} onChange={e => set(e.target.value)} onFocus={focusOn} onBlur={focusOff}
        style={{ ...inputBase, appearance: 'none', cursor: 'pointer', color: val ? C.navy : C.muted, borderColor: err ? '#E84855' : C.border }}>
        <option value="" disabled>{placeholder}</option>
        {opts.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: C.muted, fontSize: 11 }}>▼</span>
    </div>
  )

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onCancel() }}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif", padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 18, width: 540, maxWidth: '100%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 24px 64px rgba(10,12,28,0.22)' }}>
        {/* header */}
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#fff', borderRadius: '18px 18px 0 0' }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: C.navy, margin: 0 }}>{editing ? 'Edit Handover Item' : 'Add Handover Item'}</h3>
            <p style={{ fontSize: 12.5, color: C.muted, fontWeight: 500, margin: '2px 0 0' }}>Describe what you're transferring, to whom, and attach the files.</p>
          </div>
          <button onClick={onCancel} style={{ width: 32, height: 32, borderRadius: 8, background: C.bg, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <X size={16} style={{ color: C.muted }} />
          </button>
        </div>

        {/* body */}
        <div style={{ padding: 24 }}>
          <div style={{ marginBottom: 16 }}>
            <FieldLabel required>Item Title</FieldLabel>
            <input value={title} onChange={e => setTitle(e.target.value)} onFocus={focusOn} onBlur={focusOff}
              placeholder="e.g. Payments Service ownership"
              style={{ ...inputBase, borderColor: showErr && !title.trim() ? '#E84855' : C.border }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <FieldLabel required>Category</FieldLabel>
              {selectWrap(category, v => setCategory(v as Category), CATEGORIES, 'Select category')}
            </div>
            <div>
              <FieldLabel required>Handed Over To</FieldLabel>
              {selectWrap(assignedTo, setAssignedTo, TEAM, 'Select colleague', showErr && !assignedTo)}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <FieldLabel required>Knowledge Transfer Notes</FieldLabel>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} onFocus={focusOn} onBlur={focusOff}
              placeholder="What needs to be known to take this over — context, steps, gotchas…"
              style={{ ...inputBase, minHeight: 90, resize: 'vertical', borderColor: showErr && !notes.trim() ? '#E84855' : C.border }} />
          </div>

          {/* File upload */}
          <div>
            <FieldLabel>Attach Files <span style={{ textTransform: 'none', fontWeight: 500 }}>(documents, reports, credentials…)</span></FieldLabel>
            <label
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '20px', borderRadius: 11, border: '1.5px dashed rgba(99,102,241,0.45)', background: 'rgba(99,102,241,0.05)', cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.10)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.05)' }}
            >
              <input type="file" multiple onChange={onPick} style={{ display: 'none' }} />
              <UploadCloud size={22} strokeWidth={1.8} style={{ color: C.indigo }} />
              <span style={{ fontSize: 12.8, fontWeight: 600, color: '#4F46E5' }}>Click to upload files</span>
              <span style={{ fontSize: 11.5, color: C.muted }}>PDF, DOC, XLS, images — multiple allowed</span>
            </label>

            {files.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                {files.map((f, i) => (
                  <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 10px', borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, fontSize: 12, fontWeight: 500, color: C.navy }}>
                    <Paperclip size={12} style={{ color: C.muted }} />
                    {f}
                    <button onClick={() => setFiles(files.filter((_, j) => j !== i))}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', padding: 0, marginLeft: 2 }}>
                      <X size={13} style={{ color: C.muted }} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* footer */}
        <div style={{ padding: '16px 24px', borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'flex-end', gap: 12, position: 'sticky', bottom: 0, background: '#fff', borderRadius: '0 0 18px 18px' }}>
          <button onClick={onCancel}
            style={{ padding: '10px 18px', borderRadius: 10, border: `1px solid ${C.border}`, background: '#fff', color: C.navy, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            Cancel
          </button>
          <button onClick={save}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 10, border: 'none', background: C.indigo, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#4F46E5' }}
            onMouseLeave={e => { e.currentTarget.style.background = C.indigo }}>
            {editing ? 'Save Changes' : 'Add Item'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Centered confirm modal (with loading) ── */
function ConfirmModal({ tone, Icon, title, body, confirmLabel, onCancel, onConfirm }: {
  tone: 'primary' | 'danger'; Icon: ElementType; title: string; body: string; confirmLabel: string; onCancel: () => void; onConfirm: () => void
}) {
  const [loading, setLoading] = useState(false)
  const accent = tone === 'danger' ? '#E84855' : C.indigo
  const accentBg = tone === 'danger' ? 'rgba(232,72,85,0.10)' : 'rgba(99,102,241,0.10)'
  function handleConfirm() { setLoading(true); setTimeout(onConfirm, 1200) }
  return (
    <div onClick={e => { if (e.target === e.currentTarget && !loading) onCancel() }}
      style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(10,12,28,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@keyframes hoSpin { to { transform: rotate(360deg) } }`}</style>
      <div style={{ background: '#fff', borderRadius: 20, padding: '34px 30px 26px', width: 400, boxShadow: '0 24px 64px rgba(10,12,28,0.22)', textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
          <Icon size={26} strokeWidth={1.9} style={{ color: accent }} />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: C.navy, margin: '0 0 8px' }}>{title}</h3>
        <p style={{ fontSize: 13, color: C.muted, fontWeight: 500, lineHeight: 1.65, margin: '0 auto 24px', maxWidth: 320 }}>{body}</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} disabled={loading}
            style={{ flex: 1, height: 44, borderRadius: 11, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 13.5, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: loading ? 0.6 : 1 }}>
            Cancel
          </button>
          <button onClick={handleConfirm} disabled={loading}
            style={{ flex: 1, height: 44, borderRadius: 11, border: 'none', background: accent, color: '#fff', fontSize: 13.5, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.9 : 1 }}>
            {loading ? (<><Spinner /> Please wait…</>) : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
