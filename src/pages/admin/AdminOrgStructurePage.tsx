import { useState } from 'react'
import { Search, X, Plus, GitBranch, LayoutGrid, Users2, Trash2, Eye, ChevronDown, ArrowLeft } from 'lucide-react'

const C   = { navy: '#1C2035', gold: '#F2D000', border: '#E4E6EF', muted: '#8B90A7', bg: '#F0F2F8' }
const LINE = '#D8DBE8'

const AC: Record<string, { accent: string; tagBg: string; tagColor: string; headerBg: string }> = {
  Executive: { accent: '#F59E0B', tagBg: '#FFF8E1', tagColor: '#92400E', headerBg: 'linear-gradient(135deg,#F2D000,#F59E0B)' },
  Engineering:{ accent: '#6366F1', tagBg: '#EEF2FF', tagColor: '#4338CA', headerBg: 'linear-gradient(135deg,#6366F1,#4338CA)' },
  Product:    { accent: '#0EA86A', tagBg: '#F0FDF4', tagColor: '#15803D', headerBg: 'linear-gradient(135deg,#0EA86A,#047857)' },
  Design:     { accent: '#EC4899', tagBg: '#FDF2F8', tagColor: '#9D174D', headerBg: 'linear-gradient(135deg,#EC4899,#DB2777)' },
  QA:         { accent: '#06B6D4', tagBg: '#ECFEFF', tagColor: '#0E7490', headerBg: 'linear-gradient(135deg,#06B6D4,#0891B2)' },
  DevOps:     { accent: '#3B82F6', tagBg: '#EFF6FF', tagColor: '#1D4ED8', headerBg: 'linear-gradient(135deg,#3B82F6,#2563EB)' },
  Delivery:   { accent: '#F5A623', tagBg: '#FFFBEB', tagColor: '#92400E', headerBg: 'linear-gradient(135deg,#F5A623,#D97706)' },
  Mobile:     { accent: '#8B5CF6', tagBg: '#F5F3FF', tagColor: '#6D28D9', headerBg: 'linear-gradient(135deg,#8B5CF6,#7C3AED)' },
  HR:         { accent: '#F59E0B', tagBg: '#FFFBEB', tagColor: '#92400E', headerBg: 'linear-gradient(135deg,#F59E0B,#D97706)' },
  Finance:    { accent: '#EF4444', tagBg: '#FEF2F2', tagColor: '#B91C1C', headerBg: 'linear-gradient(135deg,#EF4444,#DC2626)' },
}
const DEFAULT_AC = { accent: '#8B90A7', tagBg: '#F1F5F9', tagColor: '#475569', headerBg: 'linear-gradient(135deg,#94A3B8,#64748B)' }

type ViewMode = 'tree' | 'dept' | 'manager'

interface OrgNode {
  id: string; name: string; code: string; title: string; dept: string
  isExec?: boolean; isManager?: boolean; children?: OrgNode[]
}

/* ── Org data ── */
const INITIAL_ORG: OrgNode = {
  id: 'ceo', name: 'Sarah Mitchell', code: 'EMP-0001', title: 'Chief Executive Officer', dept: 'Executive', isExec: true,
  children: [
    {
      id: 'eng', name: 'Rohan Mehta', code: 'EMP-0011', title: 'VP Engineering', dept: 'Engineering', isExec: true, isManager: true,
      children: [
        { id: 'eng1', name: 'Sarah Johnson',  code: 'EMP-0047', title: 'Senior Engineer',      dept: 'Engineering' },
        { id: 'eng2', name: 'Tom Davis',      code: 'EMP-0020', title: 'Backend Engineer',      dept: 'Engineering' },
        { id: 'eng3', name: 'Karthik Nair',   code: 'EMP-0056', title: 'Full Stack Developer',  dept: 'Engineering' },
        { id: 'eng4', name: 'James Wilson',   code: 'EMP-0060', title: 'Frontend Engineer',     dept: 'Engineering' },
        { id: 'eng5', name: 'Chris Thompson', code: 'EMP-0063', title: 'Platform Engineer',     dept: 'Engineering' },
        { id: 'eng6', name: 'David Brown',    code: 'EMP-0038', title: 'Lead Engineer',         dept: 'Engineering' },
      ],
    },
    {
      id: 'prd', name: 'Priya Sharma', code: 'EMP-0010', title: 'Head of Product', dept: 'Product', isExec: true, isManager: true,
      children: [
        { id: 'prd1', name: 'Anjali Singh', code: 'EMP-0036', title: 'Product Analyst',    dept: 'Product' },
        { id: 'prd2', name: 'Meera Pillai', code: 'EMP-0054', title: 'Senior PM',          dept: 'Product' },
        { id: 'prd3', name: 'Aryan Gupta',  code: 'EMP-0008', title: 'Product Strategist', dept: 'Product' },
      ],
    },
    {
      id: 'des', name: 'Fatima Al-Zahra', code: 'EMP-0041', title: 'Design Lead', dept: 'Design', isExec: true, isManager: true,
      children: [
        { id: 'des1', name: 'Emma Wilson',    code: 'EMP-0044', title: 'UI/UX Designer',  dept: 'Design' },
        { id: 'des2', name: 'Riya Kapoor',    code: 'EMP-0016', title: 'Visual Designer', dept: 'Design' },
        { id: 'des3', name: 'Lucas Ferreira', code: 'EMP-0023', title: 'Motion Designer', dept: 'Design' },
      ],
    },
    {
      id: 'qa', name: 'Mike Chen', code: 'EMP-0033', title: 'QA Manager', dept: 'QA', isExec: true, isManager: true,
      children: [
        { id: 'qa1', name: 'Arjun Patel',  code: 'EMP-0052', title: 'QA Engineer',         dept: 'QA' },
        { id: 'qa2', name: 'Shweta Rao',   code: 'EMP-0019', title: 'Automation Engineer', dept: 'QA' },
        { id: 'qa3', name: 'Kevin Mathew', code: 'EMP-0043', title: 'Test Analyst',        dept: 'QA' },
      ],
    },
    {
      id: 'dev', name: 'Lisa Garcia', code: 'EMP-0025', title: 'DevOps Lead', dept: 'DevOps', isExec: true, isManager: true,
      children: [
        { id: 'dev1', name: 'Nikhil Verma', code: 'EMP-0037', title: 'SRE Engineer',     dept: 'DevOps' },
        { id: 'dev2', name: 'Tanvi Desai',  code: 'EMP-0046', title: 'Cloud Architect',  dept: 'DevOps' },
        { id: 'dev3', name: 'Ryan Pinto',   code: 'EMP-0013', title: 'Network Engineer', dept: 'DevOps' },
      ],
    },
    {
      id: 'del', name: 'Arjun Kumar', code: 'EMP-0085', title: 'Delivery Manager', dept: 'Delivery', isExec: true, isManager: true,
      children: [
        { id: 'del1', name: 'Pooja Menon', code: 'EMP-0031', title: 'Project Coordinator', dept: 'Delivery' },
        { id: 'del2', name: 'Sam Clarke',  code: 'EMP-0049', title: 'Operations Analyst',  dept: 'Delivery' },
        { id: 'del3', name: 'Ishaan Roy',  code: 'EMP-0006', title: 'Scrum Master',        dept: 'Delivery' },
      ],
    },
    {
      id: 'mob', name: 'Sneha Iyer', code: 'EMP-0048', title: 'Mobile Lead', dept: 'Mobile', isExec: true, isManager: true,
      children: [
        { id: 'mob1', name: 'Rahul Khanna',  code: 'EMP-0003', title: 'iOS Developer',     dept: 'Mobile' },
        { id: 'mob2', name: 'Prithvi Sinha', code: 'EMP-0014', title: 'Android Developer', dept: 'Mobile' },
        { id: 'mob3', name: 'Zara Ahmed',    code: 'EMP-0058', title: 'React Native Dev',  dept: 'Mobile' },
      ],
    },
    {
      id: 'hr', name: 'Kavitha Reddy', code: 'EMP-0021', title: 'HR Manager', dept: 'HR', isExec: true, isManager: true,
      children: [
        { id: 'hr1', name: 'Bhavana Iyer', code: 'EMP-0032', title: 'Talent Acquisition',  dept: 'HR' },
        { id: 'hr2', name: 'Elsa Jacob',   code: 'EMP-0050', title: 'HR Business Partner', dept: 'HR' },
        { id: 'hr3', name: 'Rajan Pillai', code: 'EMP-0017', title: 'Compliance Officer',  dept: 'HR' },
      ],
    },
    {
      id: 'fin', name: 'Nina Volkov', code: 'EMP-0018', title: 'Finance Head', dept: 'Finance', isExec: true, isManager: true,
      children: [
        { id: 'fin1', name: 'Dinesh Kumar',  code: 'EMP-0026', title: 'Senior Accountant',  dept: 'Finance' },
        { id: 'fin2', name: 'Aishwarya Rao', code: 'EMP-0042', title: 'Payroll Specialist', dept: 'Finance' },
        { id: 'fin3', name: 'George Philip', code: 'EMP-0057', title: 'Audit Analyst',      dept: 'Finance' },
      ],
    },
  ],
}

/* ── Helpers ── */
function initials(name: string) {
  return name.split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('').toUpperCase()
}
function nodeMatches(n: OrgNode, q: string) {
  return n.name.toLowerCase().includes(q) || n.title.toLowerCase().includes(q) || n.dept.toLowerCase().includes(q) || n.code.toLowerCase().includes(q)
}
function countAll(node: OrgNode): number {
  return 1 + (node.children ?? []).reduce((s, c) => s + countAll(c), 0)
}

/* ── Node card (same visual language as employee/manager org) ── */
function NodeCard({ node, compact }: { node: OrgNode; compact?: boolean }) {
  const a   = AC[node.dept] ?? DEFAULT_AC
  const big = node.isExec && !compact

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: big ? 14 : 12,
      background: '#fff', border: `1px solid ${C.border}`,
      borderRadius: big ? 14 : 11,
      padding: big ? '13px 20px 13px 18px' : '9px 16px 9px 14px',
      boxShadow: '0 1px 6px rgba(28,32,53,0.06)',
      position: 'relative',
      minWidth: big ? 256 : 220,
    }}>
      <div style={{ position: 'absolute', left: 0, top: big ? 10 : 7, bottom: big ? 10 : 7, width: 1, borderRadius: '0 2px 2px 0', background: a.accent }} />

      <div style={{
        width: big ? 42 : 34, height: big ? 42 : 34, borderRadius: '50%',
        background: '#EEF0F8', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: big ? 14 : 11, fontWeight: 800, color: '#5B6178', flexShrink: 0,
      }}>
        {initials(node.name)}
      </div>

      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: big ? 14 : 12.5, fontWeight: big ? 700 : 600, color: C.navy, whiteSpace: 'nowrap' }}>
          {node.name}
        </div>
        <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2, whiteSpace: 'nowrap' }}>{node.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: big ? 7 : 5 }}>
          <span style={{ fontSize: 10, fontWeight: 600, background: a.tagBg, color: a.tagColor, borderRadius: 5, padding: '2px 6px' }}>{node.code}</span>
          <span style={{ fontSize: 10.5, color: C.muted }}>{node.dept}</span>
          {node.isManager && (
            <span style={{ fontSize: 9.5, fontWeight: 700, background: 'rgba(28,32,53,0.06)', color: C.muted, borderRadius: 4, padding: '2px 6px', letterSpacing: '0.04em' }}>
              MGR
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Full org tree (recursive, same pattern as employee org) ── */
function OrgTree({ node, search, depth = 0 }: { node: OrgNode; search: string; depth?: number }) {
  const [collapsed, setCollapsed] = useState(false)
  const hasChildren = !!(node.children?.length)
  const filtered = search
    ? (node.children ?? []).filter(c => nodeMatches(c, search) || (c.children ?? []).some(gc => nodeMatches(gc, search)))
    : (node.children ?? [])
  const armTop = (child: OrgNode) => (child.isExec ? 34 : 27)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <NodeCard node={node} />
        {hasChildren && (
          <button
            onClick={() => setCollapsed(v => !v)}
            style={{
              width: 26, height: 26, borderRadius: 8, border: `1px solid ${C.border}`,
              background: '#fff', cursor: 'pointer', color: C.muted,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 500, lineHeight: 1, flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#A5B4FC'; e.currentTarget.style.color = '#6366F1' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
          >
            {collapsed ? '+' : '−'}
          </button>
        )}
      </div>

      {hasChildren && !collapsed && filtered.length > 0 && (
        <div style={{ marginLeft: 37, paddingLeft: 26, borderLeft: `1px solid ${LINE}` }}>
          {filtered.map((child, i) => (
            <div key={child.id} style={{ display: 'flex', alignItems: 'flex-start', paddingTop: i === 0 ? 16 : (child.isExec ? 12 : 18) }}>
              <div style={{ width: 26, height: 1, background: LINE, flexShrink: 0, marginTop: armTop(child) }} />
              <OrgTree node={child} search={search} depth={depth + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── By Department view — accordion (same card UI as By Manager) ── */
function DeptAccordionItem({ mgr, search }: { mgr: OrgNode; search: string }) {
  const [open, setOpen] = useState(false)
  const a    = AC[mgr.dept] ?? DEFAULT_AC
  const team = search ? (mgr.children ?? []).filter(c => nodeMatches(c, search)) : (mgr.children ?? [])
  const deptLetters = mgr.dept.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', background: '#fff' }}>
      {/* Header row */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px', background: open ? '#F8F9FC' : '#fff',
        borderBottom: open ? `1px solid ${C.border}` : 'none',
        transition: 'background 0.15s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Department letter avatar */}
          <div style={{
            width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
            background: '#EEF0F8', border: `1px solid #D8DBE8`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: deptLetters.length > 1 ? 11 : 15, fontWeight: 400, color: '#5B6178',
          }}>
            {deptLetters}
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{mgr.dept}</div>
            <div style={{ fontSize: 11.5, color: C.muted, marginTop: 1 }}>{mgr.name}</div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, color: a.tagColor, background: a.tagBg, borderRadius: 6, padding: '2px 8px', marginLeft: 4 }}>{mgr.title}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: C.muted, background: '#ECEEF5', borderRadius: 99, padding: '3px 11px' }}>
            {team.length + 1} members
          </span>
          <button
            onClick={() => setOpen(v => !v)}
            style={{
              width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border}`,
              background: open ? C.navy : '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (!open) { e.currentTarget.style.borderColor = a.accent; e.currentTarget.style.background = a.tagBg } }}
            onMouseLeave={e => { if (!open) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = '#fff' } }}
          >
            {open
              ? <ChevronDown size={14} style={{ color: '#fff', transform: 'rotate(180deg)', transition: 'transform 0.2s' }} />
              : <Eye size={14} style={{ color: C.muted }} />
            }
          </button>
        </div>
      </div>

      {/* Expanded tree */}
      {open && (
        <div style={{ padding: '22px 28px 24px', overflowX: 'auto' }}>
          <OrgTree node={mgr} search={search} />
        </div>
      )}
    </div>
  )
}

function DeptView({ org, search, deptFilter }: { org: OrgNode; search: string; deptFilter: string }) {
  let managers = org.children ?? []
  if (deptFilter) managers = managers.filter(m => m.dept === deptFilter)
  if (search) managers = managers.filter(m => nodeMatches(m, search) || (m.children ?? []).some(c => nodeMatches(c, search)))

  if (managers.length === 0) return <EmptySearch />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {managers.map(mgr => <DeptAccordionItem key={mgr.id} mgr={mgr} search={search} />)}
    </div>
  )
}

/* ── By Manager view — accordion ── */
function ManagerAccordionItem({ mgr, search }: { mgr: OrgNode; search: string }) {
  const [open, setOpen] = useState(false)
  const a    = AC[mgr.dept] ?? DEFAULT_AC
  const team = search ? (mgr.children ?? []).filter(c => nodeMatches(c, search)) : (mgr.children ?? [])
  const rawNum    = parseInt(mgr.code.replace('EMP-', ''), 10)
  const avatarNum = ((rawNum - 1) % 70) + 1

  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', background: '#fff' }}>
      {/* Header row */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px', background: open ? '#F8F9FC' : '#fff',
        borderBottom: open ? `1px solid ${C.border}` : 'none',
        transition: 'background 0.15s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Real profile photo */}
          <img
            src={`https://i.pravatar.cc/150?img=${avatarNum}`}
            alt={mgr.name}
            style={{
              width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0,
              border: `2px solid ${a.accent}30`,
            }}
          />
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{mgr.name}</div>
            <div style={{ fontSize: 11.5, color: C.muted, marginTop: 1 }}>{mgr.title}</div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, color: a.tagColor, background: a.tagBg, borderRadius: 6, padding: '2px 8px', marginLeft: 4 }}>{mgr.dept}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: C.muted, background: '#ECEEF5', borderRadius: 99, padding: '3px 11px' }}>
            {team.length + 1} members
          </span>
          <button
            onClick={() => setOpen(v => !v)}
            style={{
              width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border}`,
              background: open ? C.navy : '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (!open) { e.currentTarget.style.borderColor = a.accent; e.currentTarget.style.background = a.tagBg } }}
            onMouseLeave={e => { if (!open) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = '#fff' } }}
          >
            {open
              ? <ChevronDown size={14} style={{ color: '#fff', transform: 'rotate(180deg)', transition: 'transform 0.2s' }} />
              : <Eye size={14} style={{ color: C.muted }} />
            }
          </button>
        </div>
      </div>

      {/* Expanded tree */}
      {open && (
        <div style={{ padding: '22px 28px 24px', overflowX: 'auto' }}>
          <OrgTree node={mgr} search={search} />
        </div>
      )}
    </div>
  )
}

function ManagerView({ org, search, deptFilter }: { org: OrgNode; search: string; deptFilter: string }) {
  let managers = org.children ?? []
  if (deptFilter) managers = managers.filter(m => m.dept === deptFilter)
  if (search) managers = managers.filter(m => nodeMatches(m, search) || (m.children ?? []).some(c => nodeMatches(c, search)))

  if (managers.length === 0) return <EmptySearch />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {managers.map(mgr => <ManagerAccordionItem key={mgr.id} mgr={mgr} search={search} />)}
    </div>
  )
}

function EmptySearch() {
  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Search size={28} strokeWidth={1.2} style={{ color: '#D0D3E4', marginBottom: 10 }} />
      <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, margin: '0 0 4px' }}>No results found</p>
      <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Try a different search or filter</p>
    </div>
  )
}

/* ── Add Organisation Page ── */
interface NewMember { name: string; title: string }
interface AddForm {
  dept: string; managerName: string; managerTitle: string; managerCode: string; members: NewMember[]
}
const EMPTY_FORM: AddForm = { dept: '', managerName: '', managerTitle: '', managerCode: '', members: [{ name: '', title: '' }] }

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 12.5, fontWeight: 600, color: C.navy, display: 'block', marginBottom: 6 }}>
        {label} {required && <span style={{ color: '#E84855' }}>*</span>}
      </label>
      {children}
      {error && <p style={{ fontSize: 11.5, color: '#E84855', margin: '4px 0 0' }}>{error}</p>}
    </div>
  )
}

function AddOrgPage({ onBack, onSave }: { onBack: () => void; onSave: (node: OrgNode) => void }) {
  const [form, setForm]     = useState<AddForm>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})
  const pa = AC[form.dept] ?? DEFAULT_AC

  const iStyle = (err?: string, val?: string): React.CSSProperties => ({
    width: '100%', height: 40, padding: '0 12px',
    border: `1px solid ${err ? '#E84855' : C.border}`, borderRadius: 9,
    fontSize: 13, color: C.navy,
    background: val ? '#F0F4FF' : '#fff',
    outline: 'none', fontFamily: 'inherit',
    boxSizing: 'border-box' as const, transition: 'border-color 0.15s, background 0.15s',
  })

  function fi(err?: string) {
    return {
      onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.borderColor = '#6366F1'
        e.target.style.background = '#fff'
      },
      onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.borderColor = err ? '#E84855' : C.border
        e.target.style.background = e.target.value ? '#F0F4FF' : '#fff'
      },
    }
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.dept.trim())         e.dept         = 'Department is required'
    if (!form.managerName.trim())  e.managerName  = 'Manager name is required'
    if (!form.managerTitle.trim()) e.managerTitle = 'Manager title is required'
    if (!form.managerCode.trim())  e.managerCode  = 'Employee code is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSave() {
    if (!validate()) return
    const id = `custom-${Date.now()}`
    const validMembers = form.members.filter(m => m.name.trim() && m.title.trim())
    const node: OrgNode = {
      id, name: form.managerName.trim(), code: form.managerCode.trim(),
      title: form.managerTitle.trim(), dept: form.dept,
      isExec: true, isManager: true,
      children: validMembers.map((m, i) => ({
        id: `${id}-m${i}`, name: m.name.trim(), title: m.title.trim(),
        code: `EMP-${String(900 + i).padStart(4, '0')}`, dept: form.dept,
      })),
    }
    onSave(node)
  }

  function setMember(idx: number, field: keyof NewMember, val: string) {
    setForm(f => { const ms = [...f.members]; ms[idx] = { ...ms[idx], [field]: val }; return { ...f, members: ms } })
  }
  function addMember()          { setForm(f => ({ ...f, members: [...f.members, { name: '', title: '' }] })) }
  function removeMember(idx: number) { setForm(f => ({ ...f, members: f.members.filter((_, i) => i !== idx) })) }

  const validTeam = form.members.filter(m => m.name.trim())

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Breadcrumb header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 26 }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            height: 36, padding: '0 14px', borderRadius: 10,
            border: `1.5px solid ${C.border}`, background: '#fff',
            fontSize: 13, fontWeight: 600, color: C.muted,
            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#A5B4FC'; e.currentTarget.style.color = C.navy }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
        >
          <ArrowLeft size={14} /> Back
        </button>
        <span style={{ color: '#C8CCDC', fontSize: 14 }}>/</span>
        <span style={{ fontSize: 13.5, color: C.muted, fontWeight: 500 }}>Org Structure</span>
        <span style={{ color: '#C8CCDC', fontSize: 14 }}>/</span>
        <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>Add Organisation Unit</span>
      </div>

      {/* Page title */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: C.navy, margin: '0 0 6px', letterSpacing: '-0.3px' }}>
          Add Organisation Unit
        </h1>
        <p style={{ fontSize: 13.5, color: C.muted, margin: 0 }}>
          Create a new department with a manager and their team
        </p>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, alignItems: 'start' }}>

        {/* ── Left: Form ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Section: Department */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '22px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#F0F2F8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LayoutGrid size={13} style={{ color: C.muted }} />
              </div>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>Department</span>
            </div>
            <Field label="Department" required error={errors.dept}>
              <input
                value={form.dept}
                onChange={e => setForm(f => ({ ...f, dept: e.target.value }))}
                placeholder="e.g. Engineering"
                style={iStyle(errors.dept, form.dept)}
                {...fi(errors.dept)}
              />
            </Field>
          </div>

          {/* Section: Manager Details */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '22px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#F0F2F8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users2 size={13} style={{ color: C.muted }} />
              </div>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>Manager Details</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="Full Name" required error={errors.managerName}>
                <input value={form.managerName} onChange={e => setForm(f => ({ ...f, managerName: e.target.value }))}
                  placeholder="e.g. Alex Johnson" style={iStyle(errors.managerName, form.managerName)} {...fi(errors.managerName)} />
              </Field>
              <Field label="Job Title" required error={errors.managerTitle}>
                <input value={form.managerTitle} onChange={e => setForm(f => ({ ...f, managerTitle: e.target.value }))}
                  placeholder="e.g. Head of Operations" style={iStyle(errors.managerTitle, form.managerTitle)} {...fi(errors.managerTitle)} />
              </Field>
            </div>
            <div style={{ marginTop: 14 }}>
              <Field label="Employee Code" required error={errors.managerCode}>
                <input value={form.managerCode} onChange={e => setForm(f => ({ ...f, managerCode: e.target.value }))}
                  placeholder="e.g. EMP-0090" style={{ ...iStyle(errors.managerCode, form.managerCode), maxWidth: 220 }} {...fi(errors.managerCode)} />
              </Field>
            </div>
          </div>

          {/* Section: Team Members */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '22px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: '#F0F2F8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <GitBranch size={13} style={{ color: C.muted }} />
                </div>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>Team Members</span>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: C.muted, background: '#ECEEF5', borderRadius: 99, padding: '2px 9px' }}>{form.members.length}</span>
              </div>
              <button onClick={addMember}
                style={{ display: 'flex', alignItems: 'center', gap: 5, height: 32, padding: '0 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', fontSize: 12.5, fontWeight: 600, color: C.muted, cursor: 'pointer', fontFamily: 'inherit' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.color = '#6366F1' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}>
                <Plus size={12} /> Add Member
              </button>
            </div>

            {/* Column labels */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 36px', gap: 10, marginBottom: 8 }}>
              {['Full Name', 'Job Title', ''].map((h, i) => (
                <span key={i} style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {form.members.map((m, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 36px', gap: 10, alignItems: 'center' }}>
                  <input value={m.name} onChange={e => setMember(idx, 'name', e.target.value)} placeholder="Full name"
                    style={iStyle(undefined, m.name)} {...fi()} />
                  <input value={m.title} onChange={e => setMember(idx, 'title', e.target.value)} placeholder="Job title"
                    style={iStyle(undefined, m.title)} {...fi()} />
                  <button onClick={() => removeMember(idx)} disabled={form.members.length === 1}
                    style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', cursor: form.members.length === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: form.members.length === 1 ? 0.35 : 1 }}>
                    <Trash2 size={13} style={{ color: '#E84855' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingBottom: 8 }}>
            <button onClick={onBack}
              style={{ height: 40, padding: '0 20px', borderRadius: 10, border: `1px solid ${C.border}`, background: '#fff', fontSize: 13.5, fontWeight: 600, color: C.muted, cursor: 'pointer', fontFamily: 'inherit' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}>
              Cancel
            </button>
            <button onClick={handleSave}
              style={{ height: 40, padding: '0 24px', borderRadius: 10, border: 'none', background: C.navy, fontSize: 13.5, fontWeight: 600, color: '#fff', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#2A3050' }}
              onMouseLeave={e => { e.currentTarget.style.background = C.navy }}>
              Create Organisation Unit
            </button>
          </div>
        </div>

        {/* ── Right: Live preview ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 0 }}>

          {/* Preview card */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '20px 22px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 14px' }}>Live Preview</p>

            {/* Manager node */}
            <div style={{ padding: '14px 16px', borderRadius: 12, border: `1px solid ${C.border}`, background: '#FAFBFF', display: 'flex', alignItems: 'center', gap: 12, position: 'relative', marginBottom: 12 }}>
              <div style={{ position: 'absolute', left: 0, top: 10, bottom: 10, width: 1, borderRadius: '0 2px 2px 0', background: pa.accent }} />
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#EEF0F8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#5B6178', flexShrink: 0 }}>
                {form.managerName ? initials(form.managerName) : '?'}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: form.managerName ? C.navy : C.muted }}>
                  {form.managerName || 'Manager Name'}
                </div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                  {form.managerTitle || 'Title'}
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 10, fontWeight: 600, background: pa.tagBg, color: pa.tagColor, borderRadius: 5, padding: '2px 7px' }}>
                    {form.managerCode || 'EMP-XXXX'}
                  </span>
                  <span style={{ fontSize: 10.5, color: C.muted }}>{form.dept || 'Department'}</span>
                  <span style={{ fontSize: 9.5, fontWeight: 700, background: 'rgba(28,32,53,0.06)', color: C.muted, borderRadius: 4, padding: '2px 6px' }}>MGR</span>
                </div>
              </div>
            </div>

            {/* Team members preview */}
            {validTeam.length > 0 && (
              <div style={{ marginLeft: 16, paddingLeft: 16, borderLeft: `1px solid ${LINE}` }}>
                {validTeam.map((m, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 10 }}>
                    <div style={{ width: 20, height: 1, background: LINE, flexShrink: 0 }} />
                    <div style={{ padding: '8px 12px', borderRadius: 9, border: `1px solid ${C.border}`, background: '#fff', display: 'flex', alignItems: 'center', gap: 8, flex: 1, position: 'relative' }}>
                      <div style={{ position: 'absolute', left: 0, top: 6, bottom: 6, width: 1, borderRadius: '0 2px 2px 0', background: pa.accent }} />
                      <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#EEF0F8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: '#5B6178', flexShrink: 0 }}>
                        {initials(m.name)}
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{m.name}</div>
                        <div style={{ fontSize: 11, color: C.muted }}>{m.title || 'Title'}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary stats */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '18px 22px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 14px' }}>Summary</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Department',   val: form.dept         || '—' },
                { label: 'Manager',      val: form.managerName  || '—' },
                { label: 'Team Members', val: validTeam.length > 0 ? `${validTeam.length} added` : '—' },
                { label: 'Total Headcount', val: validTeam.length > 0 ? `${validTeam.length + 1}` : '1 (manager only)' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 12.5, color: C.muted }}>{r.label}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: C.navy }}>{r.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Main page ── */
export default function AdminOrgStructurePage() {
  const [org, setOrg]             = useState<OrgNode>(INITIAL_ORG)
  const [view, setView]           = useState<ViewMode>('tree')
  const [search, setSearch]       = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [showAddPage, setShowAddPage] = useState(false)

  const sq = search.toLowerCase().trim()
  const managers   = org.children ?? []
  const totalEmp   = countAll(org)
  const deptCount  = managers.length
  const mgrCount   = managers.filter(m => m.isManager).length
  const deptNames  = [...new Set(managers.map(m => m.dept))].sort()

  function handleAddOrg(node: OrgNode) {
    setOrg(prev => ({ ...prev, children: [...(prev.children ?? []), node] }))
    setShowAddPage(false)
  }

  if (showAddPage) {
    return <AddOrgPage onBack={() => setShowAddPage(false)} onSave={handleAddOrg} />
  }

  const views: { id: ViewMode; label: string; Icon: React.ElementType }[] = [
    { id: 'tree',    label: 'Full Tree',    Icon: GitBranch  },
    { id: 'dept',    label: 'By Department',Icon: LayoutGrid },
    { id: 'manager', label: 'By Manager',   Icon: Users2     },
  ]

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: C.navy, margin: '0 0 6px' }}>Org Structure</h1>
          <p style={{ fontSize: 13.5, color: C.muted, margin: '0 0 12px' }}>Complete organisation hierarchy — view by tree, department, or manager</p>
          {/* Stat badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {[
              { label: 'Total Employees', val: totalEmp },
              { label: 'Departments',     val: deptCount },
              { label: 'Managers',        val: mgrCount },
            ].map(s => (
              <div key={s.label} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                height: 28, padding: '0 10px',
                background: '#ECEEF5', border: `1px solid ${C.border}`,
                borderRadius: 99,
              }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>{s.val}</span>
                <span style={{ fontSize: 11.5, color: C.muted, fontWeight: 500 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Add button */}
        <button
          onClick={() => setShowAddPage(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, height: 38, padding: '0 16px', borderRadius: 10, border: 'none', background: C.navy, fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s', flexShrink: 0 }}
          onMouseEnter={e => { e.currentTarget.style.background = '#2A3050' }}
          onMouseLeave={e => { e.currentTarget.style.background = C.navy }}
        >
          <Plus size={14} strokeWidth={2.2} /> Add Organisation
        </button>
      </div>

      {/* Main card */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, padding: '22px 26px' }}>

        {/* Controls row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search name, title, dept or code..."
              style={{ width: 320, height: 36, paddingLeft: 32, paddingRight: 12, border: `1px solid ${C.border}`, borderRadius: 9, outline: 'none', fontSize: 13, color: C.navy, background: C.bg, fontFamily: 'inherit' }}
              onFocus={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.background = '#fff' }}
              onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.bg }}
            />
          </div>

          {/* Dept filter */}
          <select
            value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
            style={{ height: 36, padding: '0 28px 0 12px', border: `1px solid ${C.border}`, borderRadius: 9, fontSize: 13, color: deptFilter ? C.navy : C.muted, background: C.bg, outline: 'none', cursor: 'pointer', fontFamily: 'inherit', appearance: 'none' }}
          >
            <option value="">All Departments</option>
            {deptNames.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          {/* Clear button */}
          {(search || deptFilter) && (
            <button onClick={() => { setSearch(''); setDeptFilter('') }}
              style={{ height: 36, padding: '0 12px', border: `1px solid ${C.border}`, borderRadius: 9, background: '#fff', fontSize: 12.5, color: C.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'inherit' }}
              onMouseEnter={e => { e.currentTarget.style.color = C.navy }}
              onMouseLeave={e => { e.currentTarget.style.color = C.muted }}>
              <X size={11} /> Clear
            </button>
          )}

          {/* View toggle */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 4, background: C.bg, borderRadius: 10, padding: 4 }}>
            {views.map(({ id, label, Icon }) => (
              <button
                key={id} onClick={() => setView(id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  height: 30, padding: '0 12px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  fontSize: 12.5, fontWeight: 600, transition: 'all 0.15s',
                  background: view === id ? '#fff' : 'transparent',
                  color: view === id ? C.navy : C.muted,
                  boxShadow: view === id ? '0 1px 4px rgba(28,32,53,0.08)' : 'none',
                }}
              >
                <Icon size={13} strokeWidth={1.8} /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Legend (full tree mode only) */}
        {view === 'tree' && (
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 22 }}>
            {[
              { label: 'Executive / Head', color: '#F59E0B' },
              { label: 'Manager',          color: '#6366F1' },
              { label: 'Team Member',      color: '#94A3B8' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
                <span style={{ fontSize: 11.5, color: C.muted }}>{l.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Scrollable content */}
        <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
          {view === 'tree' && (
            <OrgTree node={deptFilter ? { ...org, children: managers.filter(m => m.dept === deptFilter) } : org} search={sq} />
          )}
          {view === 'dept' && <DeptView org={org} search={sq} deptFilter={deptFilter} />}
          {view === 'manager' && <ManagerView org={org} search={sq} deptFilter={deptFilter} />}
        </div>
      </div>

    </div>
  )
}
