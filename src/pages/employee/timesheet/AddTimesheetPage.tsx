import { useState, useRef, useEffect, useMemo } from 'react'
import {
  Calendar, Clock, ChevronDown, Search, X, Check,
  Edit3, Trash2, Plus, Send, BookmarkCheck,
  Briefcase, Tag, AlertCircle, Layers,
} from 'lucide-react'

// ─── Constants ──────────────────────────────────────────────────────────────

const C = {
  navy:   '#1C2035',
  gold:   '#F2D000',
  border: '#E8EAF2',
  muted:  '#8B90A7',
  surface:'#F0F2F8',
  coral:  '#E84855',
  amber:  '#F5A623',
}

const PROJECTS = [
  { id: 'p1',  code: 'CID-001', name: 'Concert IDC Platform',       client: 'Internal',       color: '#6366F1' },
  { id: 'p2',  code: 'CID-002', name: 'HR Analytics Dashboard',     client: 'Accenture',      color: '#0EA5E9' },
  { id: 'p3',  code: 'CID-003', name: 'Payroll Automation Suite',   client: 'Deloitte',       color: '#10B981' },
  { id: 'p4',  code: 'CID-004', name: 'Employee Self-Service Portal',client: 'KPMG',           color: '#F59E0B' },
  { id: 'p5',  code: 'CID-005', name: 'Mobile Workforce App',       client: 'TCS',            color: '#EC4899' },
  { id: 'p6',  code: 'CID-006', name: 'Leave Management System',    client: 'Infosys',        color: '#8B5CF6' },
  { id: 'p7',  code: 'CID-007', name: 'Compliance Reporting Tool',  client: 'EY',             color: '#14B8A6' },
  { id: 'p8',  code: 'CID-008', name: 'Onboarding Experience',      client: 'Wipro',          color: '#F97316' },
]

const TASK_TYPES = [
  { id: 't1', label: 'Development',       icon: '⚙️', description: 'Feature builds, bug fixes, coding' },
  { id: 't2', label: 'Code Review',       icon: '🔍', description: 'PR reviews, peer code feedback'    },
  { id: 't3', label: 'Design',            icon: '🎨', description: 'UI/UX, wireframes, prototypes'     },
  { id: 't4', label: 'Testing / QA',      icon: '🧪', description: 'Manual & automated testing'        },
  { id: 't5', label: 'Documentation',     icon: '📄', description: 'Specs, wikis, changelogs'          },
  { id: 't6', label: 'Meeting',           icon: '🤝', description: 'Standups, planning, reviews'       },
  { id: 't7', label: 'Research',          icon: '🔬', description: 'POC, analysis, investigation'      },
  { id: 't8', label: 'Deployment / DevOps',icon: '🚀', description: 'CI/CD, infra, releases'           },
  { id: 't9', label: 'Support',           icon: '💬', description: 'L1/L2 client support'              },
  { id: 't10',label: 'Training',          icon: '📚', description: 'Learning, onboarding sessions'     },
]

const DURATION_OPTS = [
  '0.5h', '1h', '1.5h', '2h', '2.5h', '3h', '3.5h',
  '4h', '4.5h', '5h', '5.5h', '6h', '6.5h', '7h', '7.5h', '8h',
]

// Pending dates (last 5 business days without a submitted timesheet, excluding today)
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

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

// ─── Types ────────────────────────────────────────────────────────────────

interface Entry {
  id: string
  project: typeof PROJECTS[0]
  taskType: typeof TASK_TYPES[0]
  duration: string
  comment: string
}

interface FormState {
  project:  typeof PROJECTS[0]  | null
  taskType: typeof TASK_TYPES[0] | null
  duration: string
  comment:  string
}

// ─── Selection Modal ───────────────────────────────────────────────────────

function SelectionModal<T extends { id: string }>({
  open, title, items, renderItem, onClose, searchPlaceholder,
}: {
  open: boolean
  title: string
  items: T[]
  renderItem: (item: T, isSelected: boolean) => React.ReactNode
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
    return q
      ? items.filter(i => JSON.stringify(i).toLowerCase().includes(q))
      : items
  }, [query, items])

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(10,12,28,0.48)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 20,
          width: 480,
          maxHeight: '72vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 32px 80px rgba(10,12,28,0.24), 0 2px 8px rgba(10,12,28,0.08)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 20px 0',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>{title}</div>
            <button
              onClick={onClose}
              style={{
                width: 30, height: 30, borderRadius: 8, border: 'none',
                background: C.surface, cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: C.muted,
              }}
            >
              <X size={15} />
            </button>
          </div>

          {/* Search */}
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: C.surface, borderRadius: 12,
              padding: '0 14px', marginBottom: 14,
              border: `1px solid transparent`,
            }}
          >
            <Search size={15} style={{ color: C.muted, flexShrink: 0 }} />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              style={{
                flex: 1, height: 42, background: 'none', border: 'none',
                outline: 'none', fontSize: 13.5, color: C.navy,
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}
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
            <div style={{ textAlign: 'center', padding: '32px 0', color: C.muted, fontSize: 13 }}>
              No results found
            </div>
          ) : (
            filtered.map(item => renderItem(item, false))
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Custom Field Trigger ────────────────────────────────────────────────────

function FieldTrigger({
  label, placeholder, value, icon: Icon, accent, onClick, error,
}: {
  label: string
  placeholder: string
  value?: string
  icon: React.ElementType
  accent: string
  onClick: () => void
  error?: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div>
      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: C.muted, marginBottom: 6, letterSpacing: '0.03em', textTransform: 'uppercase' }}>
        {label}
      </label>
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%', height: 50,
          borderRadius: 12,
          border: `1px solid ${error ? '#E84855' : hovered ? accent : C.border}`,
          background: value ? `${accent}08` : '#fff',
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '0 16px',
          cursor: 'pointer',
          transition: 'all 0.15s',
          fontFamily: "'DM Sans', system-ui, sans-serif",
          boxShadow: hovered ? `0 0 0 3px ${accent}18` : 'none',
        }}
      >
        <div
          style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: value ? `${accent}15` : C.surface,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Icon size={15} style={{ color: value ? accent : C.muted }} />
        </div>
        <span
          style={{
            flex: 1, textAlign: 'left', fontSize: 14, fontWeight: value ? 600 : 400,
            color: value ? C.navy : C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}
        >
          {value || placeholder}
        </span>
        <ChevronDown size={15} style={{ color: C.muted, flexShrink: 0 }} />
      </button>
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
          <AlertCircle size={12} style={{ color: '#E84855' }} />
          <span style={{ fontSize: 11.5, color: '#E84855' }}>This field is required</span>
        </div>
      )}
    </div>
  )
}

// ─── Duration Picker ─────────────────────────────────────────────────────────

function DurationPicker({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: boolean }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: C.muted, marginBottom: 6, letterSpacing: '0.03em', textTransform: 'uppercase' }}>
        Duration
      </label>
      <div
        style={{
          display: 'flex', flexWrap: 'wrap', gap: 8,
          padding: '14px 16px',
          background: '#fff',
          border: `1px solid ${error ? '#E84855' : C.border}`,
          borderRadius: 12,
        }}
      >
        {DURATION_OPTS.map(d => {
          const sel = value === d
          return (
            <button
              key={d}
              onClick={() => onChange(sel ? '' : d)}
              style={{
                height: 34, paddingLeft: 14, paddingRight: 14,
                borderRadius: 8, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.12s',
                border: sel ? 'none' : `1px solid ${C.border}`,
                background: sel ? C.navy : '#fff',
                color: sel ? '#fff' : C.muted,
                boxShadow: sel ? '0 2px 8px rgba(28,32,53,0.18)' : 'none',
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}
            >
              {d}
            </button>
          )
        })}
      </div>
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
          <AlertCircle size={12} style={{ color: '#E84855' }} />
          <span style={{ fontSize: 11.5, color: '#E84855' }}>Please select a duration</span>
        </div>
      )}
    </div>
  )
}

// ─── Entry Card ───────────────────────────────────────────────────────────────

const COMMENT_LINE_H = 20   // px — one line at 13px/1.55 line-height
const COMMENT_MIN_H  = COMMENT_LINE_H

function EntryCard({
  entry, index, onEdit, onDelete,
}: {
  entry: Entry
  index: number
  onEdit: () => void
  onDelete: () => void
}) {
  const [commentH, setCommentH]   = useState(COMMENT_MIN_H)
  const dragRef                   = useRef<{ startY: number; startH: number } | null>(null)

  function onHandleMouseDown(e: React.MouseEvent) {
    e.preventDefault()
    dragRef.current = { startY: e.clientY, startH: commentH }

    function onMove(ev: MouseEvent) {
      if (!dragRef.current) return
      const delta = ev.clientY - dragRef.current.startY
      setCommentH(Math.max(COMMENT_MIN_H, dragRef.current.startH + delta))
    }
    function onUp() {
      dragRef.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const isDragged = commentH > COMMENT_MIN_H

  return (
    <div
      style={{
        background: '#fff',
        border: `1px solid ${C.border}`,
        borderRadius: 14,
        padding: '14px 20px 0',
        display: 'flex', flexDirection: 'column', gap: 10,
        transition: 'box-shadow 0.15s',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(28,32,53,0.09)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none' }}
    >
      {/* Left accent stripe */}
      <div
        style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
          background: entry.project.color,
          borderRadius: '14px 0 0 14px',
        }}
      />

      {/* ── Row 1: chips + actions ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

        {/* Index badge */}
        <div
          style={{
            width: 32, height: 32, borderRadius: 10, flexShrink: 0,
            background: C.surface, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 12, fontWeight: 700, color: C.muted,
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* Project badge */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 8, flex: '0 0 auto',
            background: `${entry.project.color}12`,
            padding: '6px 12px', borderRadius: 20,
            border: `1px solid ${entry.project.color}25`,
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: entry.project.color, flexShrink: 0 }} />
          <span style={{ fontSize: 12.5, fontWeight: 700, color: entry.project.color, whiteSpace: 'nowrap' }}>
            {entry.project.name}
          </span>
        </div>

        {/* Task type */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: '0 0 auto' }}>
          <span style={{ fontSize: 14 }}>{entry.taskType.icon}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.navy, whiteSpace: 'nowrap' }}>
            {entry.taskType.label}
          </span>
        </div>

        {/* Duration chip */}
        <div
          style={{
            height: 26, paddingLeft: 10, paddingRight: 10,
            borderRadius: 6, background: 'rgba(28,32,53,0.07)',
            display: 'flex', alignItems: 'center',
            fontSize: 12.5, fontWeight: 700, color: C.navy,
            flexShrink: 0,
          }}
        >
          <Clock size={11} style={{ marginRight: 4, color: C.muted }} />
          {entry.duration}
        </div>

        <div style={{ flex: 1 }} />

        {/* Actions */}
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <button
            onClick={onEdit}
            style={{
              width: 34, height: 34, borderRadius: 9, border: `1px solid ${C.border}`,
              background: '#fff', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: C.muted,
              transition: 'all 0.12s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(99,102,241,0.08)'
              e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'
              e.currentTarget.style.color = '#6366F1'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#fff'
              e.currentTarget.style.borderColor = C.border
              e.currentTarget.style.color = C.muted
            }}
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={onDelete}
            style={{
              width: 34, height: 34, borderRadius: 9, border: `1px solid ${C.border}`,
              background: '#fff', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: C.muted,
              transition: 'all 0.12s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(232,72,85,0.08)'
              e.currentTarget.style.borderColor = 'rgba(232,72,85,0.3)'
              e.currentTarget.style.color = '#E84855'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#fff'
              e.currentTarget.style.borderColor = C.border
              e.currentTarget.style.color = C.muted
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* ── Row 2: comment (resizable) ── */}
      <div style={{ paddingLeft: 44, paddingRight: 4 }}>
        <div
          style={{
            height: commentH,
            overflow: 'hidden',
            fontSize: 13, color: C.muted,
            lineHeight: '20px',
            wordBreak: 'break-word',
            whiteSpace: isDragged ? 'pre-wrap' : 'nowrap',
            textOverflow: isDragged ? 'clip' : 'ellipsis',
          }}
        >
          {entry.comment || <em style={{ color: '#C5C8D8' }}>No comment</em>}
        </div>
      </div>

      {/* ── Drag handle ── */}
      <div
        onMouseDown={onHandleMouseDown}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          height: 16, cursor: 'ns-resize',
          userSelect: 'none',
          marginTop: 2,
        }}
        title="Drag to expand comment"
      >
        <div
          style={{
            width: 36, height: 4, borderRadius: 4,
            background: isDragged ? entry.project.color : 'rgba(28,32,53,0.10)',
            transition: 'background 0.15s, width 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = entry.project.color; (e.currentTarget as HTMLDivElement).style.width = '52px' }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = isDragged ? entry.project.color : 'rgba(28,32,53,0.10)'; (e.currentTarget as HTMLDivElement).style.width = '36px' }}
        />
      </div>
    </div>
  )
}

// ─── Entry Form ────────────────────────────────────────────────────────────────

function EntryForm({
  initial, onSave, onCancel, isCancelable,
}: {
  initial?: Partial<FormState>
  onSave: (entry: Omit<Entry, 'id'>) => void
  onCancel?: () => void
  isCancelable?: boolean
}) {
  const [form, setForm] = useState<FormState>({
    project:  initial?.project  ?? null,
    taskType: initial?.taskType ?? null,
    duration: initial?.duration ?? '',
    comment:  initial?.comment  ?? '',
  })
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [projectOpen,  setProjectOpen]  = useState(false)
  const [taskTypeOpen, setTaskTypeOpen] = useState(false)

  function validate() {
    const e: Record<string, boolean> = {}
    if (!form.project)  e.project  = true
    if (!form.taskType) e.taskType = true
    if (!form.duration) e.duration = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSave() {
    if (!validate()) return
    onSave({
      project:  form.project!,
      taskType: form.taskType!,
      duration: form.duration,
      comment:  form.comment,
    })
    setForm({ project: null, taskType: null, duration: '', comment: '' })
    setErrors({})
  }

  return (
    <>
      {/* Project modal */}
      <SelectionModal
        open={projectOpen}
        title="Select Project"
        items={PROJECTS}
        searchPlaceholder="Search by project name or client…"
        onClose={() => setProjectOpen(false)}
        renderItem={(item, _) => {
          const sel = form.project?.id === item.id
          return (
            <button
              key={item.id}
              onClick={() => { setForm(f => ({ ...f, project: item })); setProjectOpen(false); setErrors(e => ({ ...e, project: false })) }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 14px', borderRadius: 12, border: 'none',
                background: sel ? `${item.color}10` : 'transparent',
                cursor: 'pointer', textAlign: 'left',
                transition: 'background 0.12s',
                marginBottom: 2,
                outline: sel ? `1px solid ${item.color}30` : 'none',
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}
              onMouseEnter={e => { if (!sel) e.currentTarget.style.background = C.surface }}
              onMouseLeave={e => { if (!sel) e.currentTarget.style.background = 'transparent' }}
            >
              <div
                style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  background: `${item.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Briefcase size={15} style={{ color: item.color }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy, marginBottom: 2 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{item.code} · {item.client}</div>
              </div>
              {sel && <Check size={16} style={{ color: item.color, flexShrink: 0 }} />}
            </button>
          )
        }}
      />

      {/* Task type modal */}
      <SelectionModal
        open={taskTypeOpen}
        title="Select Task Type"
        items={TASK_TYPES}
        searchPlaceholder="Search task types…"
        onClose={() => setTaskTypeOpen(false)}
        renderItem={(item, _) => {
          const sel = form.taskType?.id === item.id
          return (
            <button
              key={item.id}
              onClick={() => { setForm(f => ({ ...f, taskType: item })); setTaskTypeOpen(false); setErrors(e => ({ ...e, taskType: false })) }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 14px', borderRadius: 12, border: 'none',
                background: sel ? 'rgba(28,32,53,0.06)' : 'transparent',
                cursor: 'pointer', textAlign: 'left',
                transition: 'background 0.12s',
                marginBottom: 2,
                outline: sel ? `1px solid rgba(28,32,53,0.15)` : 'none',
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}
              onMouseEnter={e => { if (!sel) e.currentTarget.style.background = C.surface }}
              onMouseLeave={e => { if (!sel) e.currentTarget.style.background = sel ? 'rgba(28,32,53,0.06)' : 'transparent' }}
            >
              <div
                style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  background: C.surface, fontSize: 18,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy, marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{item.description}</div>
              </div>
              {sel && <Check size={16} style={{ color: C.navy, flexShrink: 0 }} />}
            </button>
          )
        }}
      />

      {/* Form body */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <FieldTrigger
            label="Project"
            placeholder="Select a project…"
            value={form.project ? `${form.project.code} — ${form.project.name}` : undefined}
            icon={Briefcase}
            accent={form.project?.color ?? '#6366F1'}
            onClick={() => setProjectOpen(true)}
            error={errors.project}
          />
          <FieldTrigger
            label="Task Type"
            placeholder="Select task type…"
            value={form.taskType ? `${form.taskType.icon}  ${form.taskType.label}` : undefined}
            icon={Tag}
            accent="#6366F1"
            onClick={() => setTaskTypeOpen(true)}
            error={errors.taskType}
          />
        </div>

        <DurationPicker value={form.duration} onChange={d => { setForm(f => ({ ...f, duration: d })); setErrors(e => ({ ...e, duration: false })) }} error={errors.duration} />

        <div>
          <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: C.muted, marginBottom: 6, letterSpacing: '0.03em', textTransform: 'uppercase' }}>
            Comment
          </label>
          <textarea
            value={form.comment}
            onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
            placeholder="Briefly describe the work done (optional)…"
            rows={3}
            style={{
              width: '100%', borderRadius: 12, border: `1px solid ${C.border}`,
              padding: '12px 16px', fontSize: 13.5, color: C.navy, resize: 'vertical',
              outline: 'none', fontFamily: "'DM Sans', system-ui, sans-serif",
              lineHeight: 1.6, boxSizing: 'border-box', background: '#fff',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = '#6366F1' }}
            onBlur={e => { e.currentTarget.style.borderColor = C.border }}
          />
        </div>

        {/* Form actions */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end', alignItems: 'center' }}>
          {isCancelable ? (
            <>
              <button
                onClick={onCancel}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: 'none', border: 'none', padding: 0,
                  fontSize: 13.5, fontWeight: 600, color: C.muted,
                  cursor: 'pointer', transition: 'color 0.12s',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = C.coral }}
                onMouseLeave={e => { e.currentTarget.style.color = C.muted }}
              >
                <X size={14} strokeWidth={2.2} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: 'none', border: 'none', padding: 0,
                  fontSize: 13.5, fontWeight: 700, color: '#10B981',
                  cursor: 'pointer', transition: 'color 0.12s',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#059669' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#10B981' }}
              >
                <Check size={14} strokeWidth={2.5} />
                Save
              </button>
            </>
          ) : (
            <button
              onClick={handleSave}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: 'none', border: 'none', padding: 0,
                fontSize: 13.5, fontWeight: 700, color: '#6366F1',
                cursor: 'pointer', transition: 'color 0.12s',
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#6366F1' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#6366F1' }}
            >
              <Plus size={14} strokeWidth={2.2} />
              Add Entry
            </button>
          )}
        </div>
      </div>
    </>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AddTimesheetPage() {
  const PENDING_DATES = useMemo(() => getPendingDates(), [])
  const today = todayISO()

  const [selectedDate, setSelectedDate]       = useState(today)
  const [pendingOpen,  setPendingOpen]         = useState(false)
  const [entries,      setEntries]             = useState<Entry[]>([])
  const [editingId,    setEditingId]           = useState<string | null>(null)
  const [submitted,    setSubmitted]           = useState(false)
  const [submitLoading, setSubmitLoading]      = useState(false)
  const [draftSaved,   setDraftSaved]          = useState(false)
  const pendingRef = useRef<HTMLDivElement>(null)

  // Close pending dropdown on outside click
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
    return entries.reduce((sum, e) => sum + parseFloat(e.duration.replace('h', '')), 0)
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
        @keyframes tsFadeUp { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes tsPing { 0%,100% { transform: scale(1); opacity: 1 } 60% { transform: scale(1.5); opacity: 0 } }
        @keyframes tsScaleIn { from { transform: scale(0.86); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        .ts-entry-fade { animation: tsFadeUp 0.25s ease forwards; }
        textarea::-webkit-scrollbar { width: 4px } textarea::-webkit-scrollbar-track { background: transparent }
        textarea::-webkit-scrollbar-thumb { background: #E4E6EF; border-radius: 4px }
      `}</style>

      {/* ════ Success Modal ════ */}
      {submitted && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(10,12,28,0.45)',
            backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'DM Sans', system-ui, sans-serif",
          }}
        >
          <div
            style={{
              background: '#fff', borderRadius: 22, width: 400,
              padding: '40px 36px 32px',
              boxShadow: '0 32px 80px rgba(10,12,28,0.22)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
              animation: 'tsScaleIn 0.32s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: 68, height: 68, borderRadius: 20,
                background: 'linear-gradient(135deg, #10B981, #059669)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
              }}
            >
              <Check size={32} strokeWidth={2.5} style={{ color: '#fff' }} />
            </div>

            {/* Title */}
            <div style={{ fontSize: 20, fontWeight: 800, color: C.navy, marginBottom: 8, textAlign: 'center' }}>
              Timesheet Submitted!
            </div>

            {/* Subtext */}
            <div style={{ fontSize: 13.5, color: C.muted, textAlign: 'center', lineHeight: 1.65, marginBottom: 20 }}>
              Your timesheet has been successfully submitted.
            </div>

            {/* Date + summary pill */}
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: C.surface, borderRadius: 12,
                padding: '10px 16px', marginBottom: 28, width: '100%',
                border: `1px solid ${C.border}`, boxSizing: 'border-box',
              }}
            >
              <Calendar size={14} style={{ color: '#10B981', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>Submitted for</div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{fmtDate(selectedDate)}</div>
              </div>
              <div style={{ flex: 1 }} />
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>Total</div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{totalHours}h · {entries.length} {entries.length === 1 ? 'entry' : 'entries'}</div>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => { setSubmitted(false); setEntries([]); setSelectedDate(today) }}
              style={{
                width: '100%', height: 46, borderRadius: 12, border: 'none',
                background: C.navy, color: '#fff',
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
                fontFamily: "'DM Sans', system-ui, sans-serif",
                transition: 'background 0.12s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#252B45' }}
              onMouseLeave={e => { e.currentTarget.style.background = C.navy }}
            >
              Add Another Timesheet
            </button>
          </div>
        </div>
      )}

      {/* ════ Page Header ════ */}
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 24, gap: 16,
        }}
      >
        {/* Left */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: C.navy, letterSpacing: '-0.4px', margin: 0 }}>
              Add Timesheet
            </h1>
          </div>
          <p style={{ fontSize: 13.5, color: C.muted, margin: 0 }}>
            Log your work hours and submit your daily timesheet
          </p>
        </div>

        {/* Right — date + pending */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', gap: 10 }}>
          {/* Current date pill */}
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: '#fff', border: `1px solid ${C.border}`,
              borderRadius: 14, padding: '10px 18px',
            }}
          >
            <Calendar size={15} style={{ color: '#6366F1' }} />
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1 }}>
                {isToday ? 'Today' : 'Selected Date'}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginTop: 2 }}>
                {fmtDate(selectedDate)}
              </div>
            </div>
          </div>

          {/* Pending dates */}
          {PENDING_DATES.length > 0 && (
            <div style={{ position: 'relative' }} ref={pendingRef}>
              <button
                onClick={() => setPendingOpen(p => !p)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'rgba(232,72,85,0.07)',
                  border: '1px solid rgba(232,72,85,0.2)',
                  borderRadius: 14, padding: '0 16px',
                  height: '100%', width: '100%',
                  cursor: 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif",
                  transition: 'all 0.12s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.11)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.07)' }}
              >
                <div style={{ position: 'relative' }}>
                  <AlertCircle size={14} style={{ color: C.coral }} />
                  <div style={{
                    position: 'absolute', top: -3, right: -4,
                    width: 8, height: 8, borderRadius: '50%',
                    background: C.coral, border: '1px solid #fff',
                  }} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.coral }}>
                  {PENDING_DATES.length} Pending
                </span>
                <span style={{ fontSize: 12, color: 'rgba(232,72,85,0.7)' }}>dates</span>
                <ChevronDown
                  size={13}
                  style={{ color: C.coral, transition: 'transform 0.15s', transform: pendingOpen ? 'rotate(180deg)' : 'none' }}
                />
              </button>

              {pendingOpen && (
                <div
                  style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                    background: '#fff', borderRadius: 14,
                    border: `1px solid ${C.border}`,
                    boxShadow: '0 12px 40px rgba(28,32,53,0.14)',
                    width: 240, zIndex: 100, overflow: 'hidden',
                    animation: 'tsFadeUp 0.18s ease',
                  }}
                >
                  <div style={{ padding: '10px 14px 6px', fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Pending Timesheets
                  </div>
                  {PENDING_DATES.map(d => (
                    <button
                      key={d}
                      onClick={() => { setSelectedDate(d); setPendingOpen(false) }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 14px', border: 'none',
                        background: selectedDate === d ? `${C.coral}10` : 'transparent',
                        cursor: 'pointer', textAlign: 'left',
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                        transition: 'background 0.1s',
                        borderLeft: selectedDate === d ? `3px solid ${C.coral}` : '3px solid transparent',
                      }}
                      onMouseEnter={e => { if (selectedDate !== d) e.currentTarget.style.background = C.surface }}
                      onMouseLeave={e => { if (selectedDate !== d) e.currentTarget.style.background = 'transparent' }}
                    >
                      <Calendar size={13} style={{ color: C.coral, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: selectedDate === d ? 700 : 500, color: C.navy }}>
                        {fmtDate(d)}
                      </span>
                    </button>
                  ))}
                  <div style={{ padding: '8px 14px', borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => { setSelectedDate(today); setPendingOpen(false) }}
                      style={{
                        fontSize: 11.5, fontWeight: 600, color: '#6366F1',
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                      }}
                    >
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
      <div
        style={{
          background: '#fff', border: `1px solid ${C.border}`,
          borderRadius: 18, overflow: 'hidden', marginBottom: 20,
          boxShadow: '0 2px 12px rgba(28,32,53,0.05)',
        }}
      >
        {/* Card header */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 24px', borderBottom: `1px solid ${C.border}`,
            background: 'linear-gradient(135deg, #FAFBFF 0%, #F6F7FF 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32, height: 32, borderRadius: 9,
                background: 'rgba(99,102,241,0.10)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Layers size={15} style={{ color: '#6366F1' }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>New Entry</div>
              <div style={{ fontSize: 11.5, color: C.muted }}>Fill in the details and click "Add Entry"</div>
            </div>
          </div>
          {entries.length > 0 && (
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'rgba(16,185,129,0.09)', padding: '5px 12px',
                borderRadius: 20, border: '1px solid rgba(16,185,129,0.2)',
              }}
            >
              <Check size={12} style={{ color: '#10B981' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#10B981' }}>
                {entries.length} {entries.length === 1 ? 'entry' : 'entries'} added
              </span>
            </div>
          )}
        </div>

        {/* Form fields */}
        <div style={{ padding: '24px' }}>
          <EntryForm onSave={addEntry} />
        </div>
      </div>

      {/* ════ Entries List ════ */}
      {entries.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>
                Timesheet Entries
              </span>
              <span
                style={{
                  fontSize: 11.5, fontWeight: 700, color: '#fff',
                  background: C.navy, borderRadius: 20,
                  padding: '2px 8px',
                }}
              >
                {entries.length}
              </span>
            </div>
            <div
              style={{
                fontSize: 13, fontWeight: 600, color: C.muted,
                display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              <Clock size={13} />
              Total: <strong style={{ color: totalHours >= 8 ? '#10B981' : totalHours >= 4 ? C.amber : C.navy }}>{totalHours}h</strong>
              {totalHours > 8 && (
                <span style={{ fontSize: 11, color: C.amber, fontWeight: 600 }}>· Overtime</span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {entries.map((entry, i) =>
              editingId === entry.id ? (
                <div
                  key={entry.id}
                  className="ts-entry-fade"
                  style={{
                    background: '#fff', border: `1px solid #6366F1`,
                    borderRadius: 14, padding: '20px 24px',
                    boxShadow: '0 0 0 4px rgba(99,102,241,0.08)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                    <Edit3 size={14} style={{ color: '#6366F1' }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#6366F1' }}>Editing Entry {i + 1}</span>
                  </div>
                  <EntryForm
                    initial={entry}
                    onSave={data => updateEntry(entry.id, data)}
                    onCancel={() => setEditingId(null)}
                    isCancelable
                  />
                </div>
              ) : (
                <div key={entry.id} className="ts-entry-fade">
                  <EntryCard
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

      {/* ════ Bottom Actions ════ */}
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#fff', border: `1px solid ${C.border}`,
          borderRadius: 16, padding: '18px 24px',
        }}
      >
        {/* Left info */}
        <div>
          {entries.length === 0 ? (
            <div style={{ fontSize: 13, color: C.muted }}>
              Add at least one entry to submit your timesheet
            </div>
          ) : (
            <div style={{ fontSize: 13, color: C.muted }}>
              <strong style={{ color: C.navy }}>{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</strong> ready to submit &nbsp;·&nbsp;
              <strong style={{ color: C.navy }}>{totalHours}h</strong> total
            </div>
          )}
          <div style={{ fontSize: 11.5, color: '#B8BCCC', marginTop: 3 }}>
            For: {fmtDate(selectedDate)}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          {/* Draft */}
          <button
            onClick={handleDraft}
            disabled={entries.length === 0}
            style={{
              height: 44, paddingLeft: 22, paddingRight: 22,
              borderRadius: 12, border: `1px solid ${entries.length === 0 ? C.border : '#6366F1'}`,
              background: entries.length === 0 ? '#fff' : 'rgba(99,102,241,0.06)',
              color: entries.length === 0 ? '#C5C8D8' : '#6366F1',
              fontSize: 14, fontWeight: 700,
              cursor: entries.length === 0 ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: "'DM Sans', system-ui, sans-serif",
              transition: 'all 0.12s',
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
              height: 44, paddingLeft: 28, paddingRight: 28,
              borderRadius: 12, border: 'none',
              background: entries.length === 0
                ? '#E4E6EF'
                : submitLoading
                ? 'linear-gradient(135deg, #2D3558, #1C2035)'
                : `linear-gradient(135deg, ${C.coral}, ${C.amber})`,
              color: entries.length === 0 ? '#C5C8D8' : '#fff',
              fontSize: 14, fontWeight: 700,
              cursor: entries.length === 0 || submitLoading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: "'DM Sans', system-ui, sans-serif",
              transition: 'all 0.15s',
              boxShadow: 'none',
            }}
            onMouseEnter={e => { if (entries.length > 0 && !submitLoading) e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
          >
            {submitLoading ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  style={{ animation: 'logoutSpin 0.8s linear infinite' }}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                Submitting…
              </>
            ) : (
              <>
                <Send size={15} />
                Submit Timesheet
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`@keyframes logoutSpin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
