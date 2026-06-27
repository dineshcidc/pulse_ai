import { useState } from 'react'
import { Search, X } from 'lucide-react'

const C = { navy: '#1C2035', gold: '#F2D000', border: '#E4E6EF', muted: '#8B90A7', bg: '#F0F2F8' }
const LINE = '#D8DBE8'

const AC: Record<string, { bg: string; fg: string; accent: string; tagBg: string; tagColor: string }> = {
  Executive:        { bg: 'linear-gradient(135deg,#F2D000,#F59E0B)', fg: '#1C2035', accent: '#F59E0B', tagBg: '#FFF8E1', tagColor: '#92400E' },
  Operations:       { bg: 'linear-gradient(135deg,#22C55E,#16A34A)', fg: '#fff',    accent: '#22C55E', tagBg: '#F0FDF4', tagColor: '#15803D' },
  Technology:       { bg: 'linear-gradient(135deg,#3B82F6,#2563EB)', fg: '#fff',    accent: '#3B82F6', tagBg: '#EFF6FF', tagColor: '#1D4ED8' },
  'Product Design': { bg: 'linear-gradient(135deg,#A855F7,#7C3AED)', fg: '#fff',    accent: '#A855F7', tagBg: '#FDF4FF', tagColor: '#7E22CE' },
  Engineering:      { bg: 'linear-gradient(135deg,#6366F1,#4338CA)', fg: '#fff',    accent: '#6366F1', tagBg: '#EEF2FF', tagColor: '#4338CA' },
  Business:         { bg: 'linear-gradient(135deg,#F97316,#EA580C)', fg: '#fff',    accent: '#F97316', tagBg: '#FFF7ED', tagColor: '#C2410C' },
  PM:               { bg: 'linear-gradient(135deg,#14B8A6,#0D9488)', fg: '#fff',    accent: '#14B8A6', tagBg: '#F0FDFA', tagColor: '#0F766E' },
  Product:          { bg: 'linear-gradient(135deg,#EC4899,#DB2777)', fg: '#fff',    accent: '#EC4899', tagBg: '#FDF2F8', tagColor: '#9D174D' },
  Management:       { bg: 'linear-gradient(135deg,#94A3B8,#64748B)', fg: '#fff',    accent: '#94A3B8', tagBg: '#F1F5F9', tagColor: '#475569' },
}

function initials(name: string) {
  return name.split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

interface OrgNode {
  id: string; name: string; code: string; title: string; dept: string
  isExec?: boolean; isSelf?: boolean; children?: OrgNode[]
}

const ORG: OrgNode = {
  id: 'ceo', name: 'Sarah Mitchell', code: 'EMP-0001', title: 'Chief Executive Officer', dept: 'Executive', isExec: true,
  children: [{
    id: 'coo', name: 'Robert Chen', code: 'EMP-0008', title: 'Chief Operating Officer', dept: 'Operations', isExec: true,
    children: [{
      id: 'cto', name: 'David Wilson', code: 'EMP-0018', title: 'Chief Technology Officer', dept: 'Technology', isExec: true,
      children: [
        { id: 'e1', name: 'John Doe',     code: 'EMP-0042', title: 'UI/UX Designer',       dept: 'Product Design', isSelf: true },
        { id: 'e2', name: 'Alex Turner',  code: 'EMP-0045', title: 'Software Engineer',     dept: 'Engineering' },
        { id: 'e3', name: 'Maria Garcia', code: 'EMP-0052', title: 'Business Analyst',      dept: 'Business' },
        { id: 'e4', name: 'James Wilson', code: 'EMP-0061', title: 'Project Manager',       dept: 'PM' },
        { id: 'e5', name: 'Priya Sharma', code: 'EMP-0067', title: 'Sr. Software Engineer', dept: 'Engineering' },
      ]
    }]
  }]
}

function NodeCard({ node }: { node: OrgNode }) {
  const a = AC[node.dept] ?? AC.Engineering
  const exec = node.isExec

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: exec ? 14 : 12,
      background: '#fff',
      border: node.isSelf ? `1px solid ${C.gold}` : `1px solid ${C.border}`,
      borderRadius: exec ? 14 : 11,
      padding: exec ? '13px 22px 13px 18px' : '10px 16px 10px 15px',
      boxShadow: node.isSelf
        ? '0 0 0 3px rgba(242,208,0,0.15), 0 2px 8px rgba(28,32,53,0.07)'
        : '0 1px 6px rgba(28,32,53,0.06)',
      position: 'relative',
      minWidth: exec ? 266 : 234,
    }}>
      {/* Left accent */}
      <div style={{ position: 'absolute', left: 0, top: exec ? 10 : 7, bottom: exec ? 10 : 7, width: 3, borderRadius: '0 3px 3px 0', background: a.accent }} />

      {/* Avatar */}
      <div style={{
        width: exec ? 44 : 36, height: exec ? 44 : 36, borderRadius: '50%',
        background: '#EEF0F8', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: exec ? 14 : 12, fontWeight: 800, color: '#5B6178', flexShrink: 0,
      }}>
        {initials(node.name)}
      </div>

      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: exec ? 14.5 : 13, fontWeight: exec ? 700 : 600, color: C.navy, whiteSpace: 'nowrap' }}>
          {node.name}
        </div>
        <div style={{ fontSize: 12, color: C.muted, marginTop: 3, whiteSpace: 'nowrap' }}>{node.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: exec ? 7 : 5 }}>
          <span style={{ fontSize: 10.5, fontWeight: 600, background: a.tagBg, color: a.tagColor, borderRadius: 5, padding: '2px 7px' }}>
            {node.code}
          </span>
          <span style={{ fontSize: 10.5, color: C.muted }}>{node.dept}</span>
        </div>
      </div>

      {node.isSelf && (
        <div style={{ position: 'absolute', top: -8, right: 10, background: C.gold, borderRadius: 6, padding: '2px 8px', fontSize: 9.5, fontWeight: 800, color: C.navy, letterSpacing: '0.04em' }}>
          YOU
        </div>
      )}
    </div>
  )
}

function OrgTree({ node, search, depth = 0 }: { node: OrgNode; search: string; depth?: number }) {
  const [collapsed, setCollapsed] = useState(false)
  const hasChildren = !!(node.children?.length)

  const matches = (n: OrgNode) =>
    n.name.toLowerCase().includes(search) ||
    n.title.toLowerCase().includes(search) ||
    n.dept.toLowerCase().includes(search)

  const filtered = search
    ? (node.children ?? []).filter(c => matches(c) || (c.children ?? []).some(matches))
    : (node.children ?? [])

  // marginTop for horizontal connector arm = paddingTop of child + half card height
  // exec card height ~70px → half ≈ 35; member card ~58px → half ≈ 29
  const armTop = (child: OrgNode) => (child.isExec ? 35 : 29)

  return (
    <div>
      {/* Node row */}
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

      {/* Children */}
      {hasChildren && !collapsed && filtered.length > 0 && (
        <div style={{ marginLeft: 37, paddingLeft: 26, borderLeft: `1px solid ${LINE}` }}>
          {filtered.map((child, i) => (
            <div
              key={child.id}
              style={{ display: 'flex', alignItems: 'flex-start', paddingTop: i === 0 ? 16 : (child.isExec ? 12 : 18) }}
            >
              {/* Horizontal connector arm */}
              <div style={{ width: 26, height: 1, background: LINE, flexShrink: 0, marginTop: armTop(child) }} />
              <div>
                <OrgTree node={child} search={search} depth={depth + 1} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function OrgStructurePage() {
  const [search, setSearch] = useState('')
  const sq = search.toLowerCase().trim()

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Page header */}
      <div className="mb-5" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="font-bold" style={{ fontSize: 22, color: C.navy }}>Org Structure</h1>
          <p className="text-sm mt-0.5" style={{ color: '#787878', fontWeight: 500 }}>Explore your company's organizational hierarchy</p>
        </div>

        {/* Stat chips */}
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { label: 'Total Employees', val: '8' },
            { label: 'Departments',    val: '5' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: '8px 18px', textAlign: 'center', minWidth: 96 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: C.navy }}>{s.val}</div>
              <div style={{ fontSize: 10.5, color: C.muted, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main card */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, padding: '24px 28px' }}>

        {/* Search bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, title or department..."
              style={{
                width: 380, height: 38, paddingLeft: 38, paddingRight: 12,
                border: `1px solid ${C.border}`, borderRadius: 9, outline: 'none',
                fontSize: 13, color: C.navy, background: C.bg,
                fontFamily: "'DM Sans', sans-serif",
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.background = '#fff' }}
              onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.bg }}
            />
          </div>
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ height: 38, padding: '0 14px', border: `1px solid ${C.border}`, borderRadius: 9, background: '#fff', fontSize: 12.5, color: C.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              onMouseEnter={e => { e.currentTarget.style.color = C.navy }}
              onMouseLeave={e => { e.currentTarget.style.color = C.muted }}
            >
              <X size={12} /> Clear
            </button>
          )}

          {/* Legend */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 14, alignItems: 'center' }}>
            {[
              { label: 'Executive',  color: '#F59E0B' },
              { label: 'You',        color: C.gold, outline: true },
              { label: 'Team',       color: '#6366F1' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{
                  width: 10, height: 10, borderRadius: 3,
                  background: l.outline ? 'transparent' : l.color,
                  border: l.outline ? `2px solid ${l.color}` : 'none',
                }} />
                <span style={{ fontSize: 11.5, color: C.muted }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Org tree */}
        <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
          <OrgTree node={ORG} search={sq} />
        </div>
      </div>
    </div>
  )
}
