import { useState, useRef, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react'
import {
  Calendar, Clock, ChevronDown, Search, X, Check,
  Edit3, Trash2, Send, BookmarkCheck,
  Tag, AlertCircle, Layers, Briefcase,
} from 'lucide-react'

// ─── Constants ───────────────────────────────────────────────────────────────

const C = {
  navy:    '#1C2035',
  gold:    '#F2D000',
  border:  '#E8EAF2',
  muted:   '#8B90A7',
  surface: '#F0F2F8',
  coral:   '#E84855',
  amber:   '#F5A623',
}

const PROJECTS = [
  { id: 'p1', code: 'CID-001', name: 'Concert IDC Platform',        client: 'Internal',  color: '#6366F1' },
  { id: 'p2', code: 'CID-002', name: 'HR Analytics Dashboard',      client: 'Accenture', color: '#0EA5E9' },
  { id: 'p3', code: 'CID-003', name: 'Payroll Automation Suite',    client: 'Deloitte',  color: '#10B981' },
  { id: 'p4', code: 'CID-004', name: 'Employee Self-Service Portal', client: 'KPMG',      color: '#F59E0B' },
  { id: 'p5', code: 'CID-005', name: 'Mobile Workforce App',        client: 'TCS',       color: '#EC4899' },
  { id: 'p6', code: 'CID-006', name: 'Leave Management System',     client: 'Infosys',   color: '#8B5CF6' },
  { id: 'p7', code: 'CID-007', name: 'Compliance Reporting Tool',   client: 'EY',        color: '#14B8A6' },
  { id: 'p8', code: 'CID-008', name: 'Onboarding Experience',       client: 'Wipro',     color: '#F97316' },
]

const TASK_TYPES = [
  { id: 't1',  label: 'Development',        description: 'Feature builds, bug fixes, coding'   },
  { id: 't2',  label: 'Code Review',        description: 'PR reviews, peer code feedback'       },
  { id: 't3',  label: 'Design',             description: 'UI/UX, wireframes, prototypes'        },
  { id: 't4',  label: 'Testing / QA',       description: 'Manual & automated testing'           },
  { id: 't5',  label: 'Documentation',      description: 'Specs, wikis, changelogs'             },
  { id: 't6',  label: 'Meeting',            description: 'Standups, planning, reviews'          },
  { id: 't7',  label: 'Research',           description: 'POC, analysis, investigation'         },
  { id: 't8',  label: 'Deployment / DevOps',description: 'CI/CD, infra, releases'               },
  { id: 't9',  label: 'Support',            description: 'L1/L2 client support'                 },
  { id: 't10', label: 'Training',           description: 'Learning, onboarding sessions'        },
]

function getPendingDates() {
  const today = new Date()
  const dates: string[] = []
  const cur = new Date(today)
  cur.setDate(cur.getDate() - 1)
  while (dates.length < 4) {
    const d = cur.getDay()
    if (d !== 0 && d !== 6) dates.push(cur.toISOString().slice(0, 10))
    cur.setDate(cur.getDate() - 1)
  }
  return dates
}

function fmtDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
  })
}

function todayISO() { return new Date().toISOString().slice(0, 10) }

function fmtDuration(raw: string): string {
  const v = parseFloat(raw.replace(/h$/i, '').trim())
  if (isNaN(v) || v <= 0) return raw
  const hours = Math.floor(v)
  const mins  = Math.round((v - hours) * 60)
  if (hours > 0 && mins > 0) return `${hours}h ${mins}mins`
  if (hours > 0) return `${hours}h`
  return `${mins}mins`
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Entry {
  id: string
  project:  typeof PROJECTS[0]
  taskType: typeof TASK_TYPES[0]
  duration: string
  comment:  string
}

interface FormState {
  project:  typeof PROJECTS[0]  | null
  taskType: typeof TASK_TYPES[0] | null
  duration: string
  comment:  string
}

// ─── Selection Modal ──────────────────────────────────────────────────────────

function SelectionModal<T extends { id: string }>({
  open, title, items, renderItem, onClose, searchPlaceholder,
}: {
  open: boolean
  title: string
  items: T[]
  renderItem: (item: T) => React.ReactNode
  onClose: () => void
  searchPlaceholder: string
}) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) { setQuery(''); setTimeout(() => inputRef.current?.focus(), 60) }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return q ? items.filter(i => JSON.stringify(i).toLowerCase().includes(q)) : items
  }, [query, items])

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(10,12,28,0.48)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: '#fff', borderRadius: 20, width: 460, maxHeight: '72vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(10,12,28,0.24), 0 2px 8px rgba(10,12,28,0.08)',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 20px 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>{title}</div>
            <button
              onClick={onClose}
              style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: C.surface, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted }}
            >
              <X size={15} />
            </button>
          </div>
          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: C.surface, borderRadius: 10, padding: '0 14px', marginBottom: 14 }}>
            <Search size={14} style={{ color: C.muted, flexShrink: 0 }} />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              style={{ flex: 1, height: 40, background: 'none', border: 'none', outline: 'none', fontSize: 13.5, color: C.navy, fontFamily: "'DM Sans', system-ui, sans-serif" }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted }}>
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 12px' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: C.muted, fontSize: 13 }}>No results found</div>
          ) : (
            filtered.map(item => renderItem(item))
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Field Trigger ────────────────────────────────────────────────────────────

function FieldTrigger({ label, placeholder, value, icon: Icon, accent, onClick, error }: {
  label: string; placeholder: string; value?: string; icon: React.ElementType
  accent: string; onClick: () => void; error?: boolean
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6, letterSpacing: '0.03em', textTransform: 'uppercase' }}>
        {label}
      </label>
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%', height: 50, borderRadius: 12,
          border: `1px solid ${error ? '#E84855' : hovered ? accent : C.border}`,
          background: value ? `${accent}08` : '#fff',
          display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px',
          cursor: 'pointer', transition: 'all 0.15s',
          fontFamily: "'DM Sans', system-ui, sans-serif",
          boxShadow: hovered ? `0 0 0 3px ${accent}18` : 'none',
        }}
      >
        <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: value ? `${accent}15` : C.surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={15} style={{ color: value ? accent : C.muted }} />
        </div>
        <span style={{ flex: 1, textAlign: 'left', fontSize: 14, fontWeight: value ? 600 : 400, color: value ? C.navy : C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {value || placeholder}
        </span>
        <ChevronDown size={15} style={{ color: C.muted, flexShrink: 0 }} />
      </button>
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
          <AlertCircle size={12} style={{ color: '#E84855' }} />
          <span style={{ fontSize: 11.5, color: '#E84855' }}>Required</span>
        </div>
      )}
    </div>
  )
}

// ─── Duration Input ───────────────────────────────────────────────────────────

function DurationInput({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: boolean }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6, letterSpacing: '0.03em', textTransform: 'uppercase' }}>
        Duration
      </label>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: 12, top: 0, bottom: 0, display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, flexShrink: 0, background: value ? 'rgba(99,102,241,0.12)' : C.surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={13} style={{ color: value ? '#6366F1' : C.muted }} />
          </div>
        </div>
        <input
          type="text" value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="e.g. 2h"
          style={{
            width: '100%', height: 50, paddingLeft: 48, paddingRight: 12, borderRadius: 12,
            border: `1px solid ${error ? '#E84855' : focused ? '#6366F1' : C.border}`,
            background: value ? 'rgba(99,102,241,0.04)' : '#fff',
            fontSize: 14, fontWeight: value ? 600 : 400, color: value ? C.navy : C.muted,
            outline: 'none', boxSizing: 'border-box',
            fontFamily: "'DM Sans', system-ui, sans-serif",
            transition: 'border-color 0.15s, background 0.15s',
            boxShadow: focused ? '0 0 0 3px rgba(99,102,241,0.12)' : 'none',
          }}
        />
      </div>
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
          <AlertCircle size={12} style={{ color: '#E84855' }} />
          <span style={{ fontSize: 11.5, color: '#E84855' }}>e.g. 2h</span>
        </div>
      )}
    </div>
  )
}

// ─── Comment Field ────────────────────────────────────────────────────────────

function CommentField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6, letterSpacing: '0.03em', textTransform: 'uppercase' }}>
        Comment
      </label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Describe work done…"
        rows={3}
        style={{
          width: '100%', minHeight: 80, borderRadius: 12,
          border: `1px solid ${focused ? '#6366F1' : C.border}`,
          padding: '12px 14px', fontSize: 13.5, color: C.navy,
          background: '#fff', outline: 'none', boxSizing: 'border-box',
          fontFamily: "'DM Sans', system-ui, sans-serif",
          lineHeight: 1.55, transition: 'border-color 0.15s, box-shadow 0.15s',
          boxShadow: focused ? '0 0 0 3px rgba(99,102,241,0.10)' : 'none',
          resize: 'vertical',
        }}
      />
    </div>
  )
}

// ─── Saved Entry Row (compact) ────────────────────────────────────────────────

function SavedEntryRow({ entry, index, onEdit, onDelete }: {
  entry: Entry; index: number; onEdit: () => void; onDelete: () => void
}) {
  return (
    <div
      className="ts-saved-row"
      style={{
        position: 'relative',
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '11px 14px 11px 18px',
        background: '#fff',
        borderRadius: 10,
        overflow: 'hidden',
      }}
    >
      {/* Left color accent bar */}
      <div style={{ position: 'absolute', left: 0, top: 6, bottom: 6, width: 2, borderRadius: 2, background: entry.project.color }} />

      {/* Index */}
      <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, width: 18, flexShrink: 0, textAlign: 'right' }}>
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'nowrap', overflow: 'hidden' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>
            {entry.project.name}
          </span>
          <div style={{ width: 1, height: 13, background: '#DDE0EE', flexShrink: 0 }} />
          <span style={{ fontSize: 12.5, fontWeight: 500, color: '#5A6080', whiteSpace: 'nowrap', flexShrink: 0 }}>
            {entry.taskType.label}
          </span>
          <div style={{ width: 1, height: 13, background: '#DDE0EE', flexShrink: 0 }} />
          <span style={{ flexShrink: 0, fontSize: 11.5, fontWeight: 700, color: '#6366F1', background: 'rgba(99,102,241,0.09)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 5, padding: '1px 7px', lineHeight: 1.6 }}>
            {fmtDuration(entry.duration)}
          </span>
        </div>
        {entry.comment && (
          <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '90%' }}>
            {entry.comment}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
        <button
          onClick={onEdit}
          title="Edit"
          style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, transition: 'all 0.12s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.09)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; e.currentTarget.style.color = '#6366F1' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
        >
          <Edit3 size={12} />
        </button>
        <button
          onClick={onDelete}
          title="Delete"
          style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, transition: 'all 0.12s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.08)'; e.currentTarget.style.borderColor = 'rgba(232,72,85,0.28)'; e.currentTarget.style.color = '#E84855' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  )
}

// ─── Entry Form ───────────────────────────────────────────────────────────────

interface EntryFormHandle { triggerSave: () => void }

const EntryForm = forwardRef<EntryFormHandle, {
  initial?: Partial<FormState>
  onSave: (entry: Omit<Entry, 'id'>) => void
  onCancel?: () => void
  isCancelable?: boolean
  compact?: boolean
  hideActions?: boolean
}>(function EntryForm({ initial, onSave, compact, hideActions }, ref) {
  const [form, setForm] = useState<FormState>({
    project:  initial?.project  ?? null,
    taskType: initial?.taskType ?? null,
    duration: initial?.duration ?? '',
    comment:  initial?.comment  ?? '',
  })
  const [errors,       setErrors]       = useState<Record<string, boolean>>({})
  const [projectOpen,  setProjectOpen]  = useState(false)
  const [taskTypeOpen, setTaskTypeOpen] = useState(false)

  function validate() {
    const e: Record<string, boolean> = {}
    if (!form.project)  e.project  = true
    if (!form.taskType) e.taskType = true
    const dur = parseFloat(form.duration.replace(/h$/i, '').trim())
    if (!form.duration.trim() || isNaN(dur) || dur <= 0) e.duration = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSave() {
    if (!validate()) return
    onSave({ project: form.project!, taskType: form.taskType!, duration: form.duration, comment: form.comment })
    setForm({ project: null, taskType: null, duration: '', comment: '' })
    setErrors({})
  }

  useImperativeHandle(ref, () => ({ triggerSave: handleSave }))

  return (
    <>
      {/* ── Project modal ── */}
      <SelectionModal
        open={projectOpen}
        title="Select Project"
        items={PROJECTS}
        searchPlaceholder="Search by project name or client…"
        onClose={() => setProjectOpen(false)}
        renderItem={item => {
          const sel = form.project?.id === item.id
          return (
            <button
              key={item.id}
              onClick={() => { setForm(f => ({ ...f, project: item })); setProjectOpen(false); setErrors(e => ({ ...e, project: false })) }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 0,
                padding: '11px 14px', borderRadius: 10, border: 'none',
                background: sel ? `${item.color}10` : 'transparent',
                cursor: 'pointer', textAlign: 'left', transition: 'background 0.12s',
                marginBottom: 2, outline: sel ? `1px solid ${item.color}30` : 'none',
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}
              onMouseEnter={e => { if (!sel) e.currentTarget.style.background = C.surface }}
              onMouseLeave={e => { if (!sel) e.currentTarget.style.background = 'transparent' }}
            >
              {/* Dot */}
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: C.surface, flexShrink: 0, marginRight: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.muted }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy, marginBottom: 2 }}>{item.name}</div>
                <div style={{ fontSize: 11.5, color: C.muted }}>{item.code} · {item.client}</div>
              </div>
              {sel && <Check size={15} style={{ color: item.color, flexShrink: 0, marginLeft: 8 }} />}
            </button>
          )
        }}
      />

      {/* ── Task Type modal ── */}
      <SelectionModal
        open={taskTypeOpen}
        title="Select Task Type"
        items={TASK_TYPES}
        searchPlaceholder="Search task types…"
        onClose={() => setTaskTypeOpen(false)}
        renderItem={item => {
          const sel = form.taskType?.id === item.id
          return (
            <button
              key={item.id}
              onClick={() => { setForm(f => ({ ...f, taskType: item })); setTaskTypeOpen(false); setErrors(e => ({ ...e, taskType: false })) }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 0,
                padding: '11px 14px', borderRadius: 10, border: 'none',
                background: sel ? 'rgba(28,32,53,0.06)' : 'transparent',
                cursor: 'pointer', textAlign: 'left', transition: 'background 0.12s',
                marginBottom: 2, outline: sel ? '1px solid rgba(28,32,53,0.14)' : 'none',
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}
              onMouseEnter={e => { if (!sel) e.currentTarget.style.background = C.surface }}
              onMouseLeave={e => { if (!sel) e.currentTarget.style.background = sel ? 'rgba(28,32,53,0.06)' : 'transparent' }}
            >
              {/* Dot */}
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: C.surface, flexShrink: 0, marginRight: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.muted }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy, marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 11.5, color: C.muted }}>{item.description}</div>
              </div>
              {sel && <Check size={15} style={{ color: C.navy, flexShrink: 0, marginLeft: 8 }} />}
            </button>
          )
        }}
      />

      {/* ── Form fields ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? 14 : 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.2fr 110px 1.8fr', gap: 12, alignItems: 'start' }}>
          <FieldTrigger
            label="Project"
            placeholder="Select project…"
            value={form.project ? `${form.project.code} — ${form.project.name}` : undefined}
            icon={Briefcase}
            accent={form.project?.color ?? '#6366F1'}
            onClick={() => setProjectOpen(true)}
            error={errors.project}
          />
          <FieldTrigger
            label="Task Type"
            placeholder="Select type…"
            value={form.taskType?.label}
            icon={Tag}
            accent="#6366F1"
            onClick={() => setTaskTypeOpen(true)}
            error={errors.taskType}
          />
          <DurationInput
            value={form.duration}
            onChange={d => { setForm(f => ({ ...f, duration: d })); setErrors(e => ({ ...e, duration: false })) }}
            error={errors.duration}
          />
          <CommentField
            value={form.comment}
            onChange={v => setForm(f => ({ ...f, comment: v }))}
          />
        </div>

        {!hideActions && (
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', alignItems: 'center' }}>
            <button
              onClick={handleSave}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: 'none', border: 'none', padding: 0,
                fontSize: 13.5, fontWeight: 700, color: '#10B981',
                cursor: 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#059669' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#10B981' }}
            >
              <Check size={14} strokeWidth={2.5} />
              Save Entry
            </button>
          </div>
        )}
      </div>
    </>
  )
})

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AddTimesheetPage() {
  const PENDING_DATES = useMemo(() => getPendingDates(), [])
  const today = todayISO()

  const [selectedDate,   setSelectedDate]   = useState(today)
  const [pendingOpen,    setPendingOpen]     = useState(false)
  const [entries,        setEntries]         = useState<Entry[]>([])
  const [editingId,      setEditingId]       = useState<string | null>(null)
  const [submitted,      setSubmitted]       = useState(false)
  const [submitLoading,  setSubmitLoading]   = useState(false)
  const [draftSaved,     setDraftSaved]      = useState(false)
  const pendingRef = useRef<HTMLDivElement>(null)
  const editFormRef = useRef<EntryFormHandle>(null)

  useEffect(() => {
    if (!pendingOpen) return
    const handler = (e: MouseEvent) => {
      if (pendingRef.current && !pendingRef.current.contains(e.target as Node)) setPendingOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [pendingOpen])

  function addEntry(data: Omit<Entry, 'id'>) {
    setEntries(prev => [...prev, { ...data, id: crypto.randomUUID() }])
  }

  function deleteEntry(id: string) {
    setEntries(prev => prev.filter(e => e.id !== id))
    if (editingId === id) setEditingId(null)
  }

  function updateEntry(id: string, data: Omit<Entry, 'id'>) {
    setEntries(prev => prev.map(e => e.id === id ? { ...data, id } : e))
    setEditingId(null)
  }

  const totalHours = useMemo(() => {
    return entries.reduce((sum, e) => {
      const v = parseFloat(e.duration.replace(/h$/i, '').trim())
      return sum + (isNaN(v) ? 0 : v)
    }, 0)
  }, [entries])

  async function handleSubmit() {
    if (entries.length === 0) return
    setSubmitLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setSubmitLoading(false)
    setSubmitted(true)
  }

  function handleDraft() {
    setDraftSaved(true)
    setTimeout(() => setDraftSaved(false), 2500)
  }

  const isToday = selectedDate === today

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes tsFadeUp   { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes tsScaleIn  { from { transform: scale(0.86); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        @keyframes logoutSpin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        .ts-entry-row { animation: tsFadeUp 0.22s ease forwards; }
        textarea::-webkit-scrollbar { width: 4px }
        textarea::-webkit-scrollbar-track { background: transparent }
        textarea::-webkit-scrollbar-thumb { background: #D0D3E6; border-radius: 4px }
      `}</style>

      {/* ════ Success Modal ════ */}
      {submitted && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.45)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
          <div style={{ background: '#fff', borderRadius: 22, width: 400, padding: '40px 36px 32px', boxShadow: '0 32px 80px rgba(10,12,28,0.22)', display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'tsScaleIn 0.32s cubic-bezier(0.34,1.56,0.64,1)' }}>
            <div style={{ width: 68, height: 68, borderRadius: 20, background: 'linear-gradient(135deg, #10B981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <Check size={32} strokeWidth={2.5} style={{ color: '#fff' }} />
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.navy, marginBottom: 8, textAlign: 'center' }}>Timesheet Submitted!</div>
            <div style={{ fontSize: 13.5, color: C.muted, textAlign: 'center', lineHeight: 1.65, marginBottom: 20 }}>Your timesheet has been successfully submitted.</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: C.surface, borderRadius: 12, padding: '10px 16px', marginBottom: 28, width: '100%', border: `1px solid ${C.border}`, boxSizing: 'border-box' }}>
              <Calendar size={14} style={{ color: '#10B981', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>Submitted for</div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{fmtDate(selectedDate)}</div>
              </div>
              <div style={{ flex: 1 }} />
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>Total</div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{fmtDuration(String(totalHours))} · {entries.length} {entries.length === 1 ? 'entry' : 'entries'}</div>
              </div>
            </div>
            <button
              onClick={() => { setSubmitted(false); setEntries([]); setSelectedDate(today) }}
              style={{ width: '100%', height: 46, borderRadius: 12, border: 'none', background: C.navy, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif", transition: 'background 0.12s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#252B45' }}
              onMouseLeave={e => { e.currentTarget.style.background = C.navy }}
            >
              Add Another Timesheet
            </button>
          </div>
        </div>
      )}

      {/* ════ Page Header ════ */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: C.navy, letterSpacing: '-0.4px', margin: '0 0 4px' }}>Add Timesheet</h1>
          <p style={{ fontSize: 13.5, color: '#787878', fontWeight: 500, margin: 0 }}>Log your work hours and submit your daily timesheet</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'stretch', gap: 10 }}>
          {/* Date pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '10px 18px' }}>
            <Calendar size={15} style={{ color: '#6366F1' }} />
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1 }}>
                {isToday ? 'Today' : 'Selected Date'}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginTop: 2 }}>{fmtDate(selectedDate)}</div>
            </div>
          </div>

          {/* Pending dates */}
          {PENDING_DATES.length > 0 && (
            <div style={{ position: 'relative' }} ref={pendingRef}>
              <button
                onClick={() => setPendingOpen(p => !p)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(232,72,85,0.07)', border: '1px solid rgba(232,72,85,0.2)', borderRadius: 14, padding: '0 16px', height: '100%', cursor: 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif", transition: 'background 0.12s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.11)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.07)' }}
              >
                <div style={{ position: 'relative' }}>
                  <AlertCircle size={14} style={{ color: C.coral }} />
                  <div style={{ position: 'absolute', top: -3, right: -4, width: 8, height: 8, borderRadius: '50%', background: C.coral, border: '1px solid #fff' }} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.coral }}>{PENDING_DATES.length} Pending</span>
                <span style={{ fontSize: 12, color: 'rgba(232,72,85,0.7)' }}>dates</span>
                <ChevronDown size={13} style={{ color: C.coral, transition: 'transform 0.15s', transform: pendingOpen ? 'rotate(180deg)' : 'none' }} />
              </button>

              {pendingOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#fff', borderRadius: 14, border: `1px solid ${C.border}`, boxShadow: '0 12px 40px rgba(28,32,53,0.14)', width: 240, zIndex: 100, overflow: 'hidden', animation: 'tsFadeUp 0.18s ease' }}>
                  <div style={{ padding: '10px 14px 6px', fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pending Timesheets</div>
                  {PENDING_DATES.map(d => (
                    <button
                      key={d}
                      onClick={() => { setSelectedDate(d); setPendingOpen(false) }}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', border: 'none', background: selectedDate === d ? `${C.coral}10` : 'transparent', cursor: 'pointer', textAlign: 'left', fontFamily: "'DM Sans', system-ui, sans-serif", transition: 'background 0.1s', borderLeft: selectedDate === d ? `3px solid ${C.coral}` : '3px solid transparent' }}
                      onMouseEnter={e => { if (selectedDate !== d) e.currentTarget.style.background = C.surface }}
                      onMouseLeave={e => { if (selectedDate !== d) e.currentTarget.style.background = 'transparent' }}
                    >
                      <Calendar size={13} style={{ color: C.coral, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: selectedDate === d ? 700 : 500, color: C.navy }}>{fmtDate(d)}</span>
                    </button>
                  ))}
                  <div style={{ padding: '8px 14px', borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={() => { setSelectedDate(today); setPendingOpen(false) }} style={{ fontSize: 11.5, fontWeight: 600, color: '#6366F1', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                      ← Back to Today
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ════ Main Form Card ════ */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden', marginBottom: 20, boxShadow: '0 2px 12px rgba(28,32,53,0.05)' }}>

        {/* Card header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: `1px solid ${C.border}`, background: 'linear-gradient(135deg, #FAFBFF 0%, #F6F7FF 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(99,102,241,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={15} style={{ color: '#6366F1' }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Timesheet Entry</div>
              <div style={{ fontSize: 11.5, color: C.muted }}>
                {entries.length === 0
                  ? 'Fill in the details below and click "Save Entry"'
                  : `${entries.length} saved · fill in more below`}
              </div>
            </div>
          </div>
          {entries.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.09)', padding: '5px 12px', borderRadius: 20, border: '1px solid rgba(16,185,129,0.2)' }}>
              <Clock size={11} style={{ color: '#10B981' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#10B981' }}>
                {fmtDuration(String(totalHours))} logged
              </span>
            </div>
          )}
        </div>

        {/* ── Saved Entries (above the form) ── */}
        {entries.length > 0 && (
          <div style={{ background: '#F7F8FC', borderBottom: `1px solid ${C.border}` }}>
            {/* Section label */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 24px 6px', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Saved Entries</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: '#10B981', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {entries.length}
                </span>
              </div>
              <span style={{ fontSize: 11.5, color: C.muted, fontWeight: 500 }}>
                Total: <strong style={{ color: totalHours >= 8 ? '#10B981' : totalHours >= 4 ? C.amber : C.navy }}>{fmtDuration(String(totalHours))}</strong>
                {totalHours > 8 && <span style={{ color: C.amber, marginLeft: 4 }}>· Overtime</span>}
              </span>
            </div>

            {/* Entry rows */}
            <div style={{ padding: '0 16px 10px' }}>
              {entries.map((entry, i) =>
                editingId === entry.id ? (
                  /* Inline edit form */
                  <div
                    key={entry.id}
                    className="ts-entry-row"
                    style={{ background: '#fff', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 12, padding: '16px 18px', marginBottom: i < entries.length - 1 ? 6 : 0 }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <Edit3 size={12} style={{ color: '#6366F1' }} />
                        <span style={{ fontSize: 11.5, fontWeight: 700, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Editing Entry {i + 1}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 5 }}>
                        <button
                          onClick={() => setEditingId(null)}
                          title="Cancel"
                          style={{ width: 26, height: 26, borderRadius: '50%', border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.08)'; e.currentTarget.style.borderColor = 'rgba(232,72,85,0.3)'; e.currentTarget.style.color = C.coral }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
                        >
                          <X size={11} strokeWidth={2.2} />
                        </button>
                        <button
                          onClick={() => editFormRef.current?.triggerSave()}
                          title="Save Changes"
                          style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid rgba(16,185,129,0.35)', background: 'rgba(16,185,129,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.18)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.08)' }}
                        >
                          <Check size={11} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                    <EntryForm
                      ref={editFormRef}
                      initial={entry}
                      onSave={data => updateEntry(entry.id, data)}
                      compact
                      hideActions
                    />
                  </div>
                ) : (
                  <div
                    key={entry.id}
                    className="ts-entry-row"
                    style={{ marginBottom: i < entries.length - 1 ? 10 : 0 }}
                  >
                    <SavedEntryRow
                      entry={entry}
                      index={i}
                      onEdit={() => setEditingId(entry.id)}
                      onDelete={() => deleteEntry(entry.id)}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* ── Add new entry form ── */}
        <div style={{ padding: '20px 24px' }}>
          <EntryForm onSave={addEntry} />
        </div>
      </div>

      {/* ════ Bottom Actions ════ */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '18px 24px' }}>
        <div>
          {entries.length === 0 ? (
            <div style={{ fontSize: 13, color: C.muted }}>Add at least one entry to submit your timesheet</div>
          ) : (
            <div style={{ fontSize: 13, color: C.muted }}>
              <strong style={{ color: C.navy }}>{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</strong> ready to submit &nbsp;·&nbsp;
              <strong style={{ color: C.navy }}>{fmtDuration(String(totalHours))}</strong> total
            </div>
          )}
          <div style={{ fontSize: 11.5, color: '#B8BCCC', marginTop: 3 }}>For: {fmtDate(selectedDate)}</div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          {/* Draft */}
          <button
            onClick={handleDraft}
            disabled={entries.length === 0}
            style={{
              height: 44, paddingLeft: 22, paddingRight: 22, borderRadius: 12,
              border: `1px solid ${entries.length === 0 ? C.border : '#6366F1'}`,
              background: entries.length === 0 ? '#fff' : 'rgba(99,102,241,0.06)',
              color: entries.length === 0 ? '#C5C8D8' : '#6366F1',
              fontSize: 14, fontWeight: 700,
              cursor: entries.length === 0 ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: "'DM Sans', system-ui, sans-serif", transition: 'all 0.12s',
            }}
            onMouseEnter={e => { if (entries.length > 0) e.currentTarget.style.background = 'rgba(99,102,241,0.12)' }}
            onMouseLeave={e => { if (entries.length > 0) e.currentTarget.style.background = 'rgba(99,102,241,0.06)' }}
          >
            {draftSaved ? <Check size={16} /> : <BookmarkCheck size={16} />}
            {draftSaved ? 'Draft Saved!' : 'Save as Draft'}
          </button>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={entries.length === 0 || submitLoading}
            style={{
              height: 44, paddingLeft: 28, paddingRight: 28, borderRadius: 12, border: 'none',
              background: entries.length === 0 ? '#E4E6EF' : submitLoading ? 'linear-gradient(135deg, #2D3558, #1C2035)' : `linear-gradient(135deg, ${C.coral}, ${C.amber})`,
              color: entries.length === 0 ? '#C5C8D8' : '#fff',
              fontSize: 14, fontWeight: 700,
              cursor: entries.length === 0 || submitLoading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: "'DM Sans', system-ui, sans-serif", transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (entries.length > 0 && !submitLoading) e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
          >
            {submitLoading ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'logoutSpin 0.8s linear infinite' }}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                Submitting…
              </>
            ) : (
              <><Send size={15} /> Submit Timesheet</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
