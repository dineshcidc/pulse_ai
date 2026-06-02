import { useState, useRef } from 'react'
import {
  ArrowLeft, Users, Clock, TrendingUp, Calendar,
  Edit2, Trash2, Plus, CheckCircle, XCircle, Mail,
  DollarSign, Briefcase, Code2, Tag, Search, X, Camera,
} from 'lucide-react'

type Status = 'active' | 'on-hold' | 'completed'

interface Project {
  id: string
  name: string
  client: string
  status: Status
  startDate: string
  endDate: string
  members: number
  avatars: number[]
  hoursLogged: number
  pendingApprovals: number
  progress: number
  description: string
  color: string
}

interface AllocatedEmployee {
  id: string
  name: string
  code: string
  role: string
  avatar: number
  email: string
  startDate: string
  endDate: string
  allocation: number
}

interface RateEntry {
  id: string
  name: string
  avatar: number
  billable: boolean
  hourlyRate: number
  monthlyRate: number
  allocationType: 'Full-time' | 'Part-time' | 'Contract'
  currency: string
}

interface ActivityItem {
  id: string
  user: string
  avatar: number
  action: string
  target: string
  time: string
  type: 'add' | 'update' | 'approve' | 'reject' | 'comment'
}

/* ── Mock data per project ── */
const ALLOCATIONS: AllocatedEmployee[] = [
  { id: 'e1', name: 'Arjun Sharma',   code: 'EMP-041', role: 'Tech Lead',         avatar: 47, email: 'arjun.s@concert.io',   startDate: 'May 2026', endDate: 'Aug 2026', allocation: 100 },
  { id: 'e2', name: 'Priya Nair',     code: 'EMP-058', role: 'Frontend Dev',      avatar: 33, email: 'priya.n@concert.io',   startDate: 'May 2026', endDate: 'Aug 2026', allocation: 80  },
  { id: 'e3', name: 'Rahul Mehra',    code: 'EMP-022', role: 'Backend Dev',       avatar: 44, email: 'rahul.m@concert.io',   startDate: 'Jun 2026', endDate: 'Aug 2026', allocation: 100 },
  { id: 'e4', name: 'Kavitha Iyer',   code: 'EMP-067', role: 'QA Engineer',       avatar: 38, email: 'kavitha.i@concert.io', startDate: 'May 2026', endDate: 'Jul 2026', allocation: 60  },
  { id: 'e5', name: 'Siddharth Roy',  code: 'EMP-031', role: 'UI/UX Designer',    avatar: 25, email: 'sid.r@concert.io',     startDate: 'May 2026', endDate: 'Jun 2026', allocation: 50  },
  { id: 'e6', name: 'Meera Pillai',   code: 'EMP-089', role: 'DevOps Engineer',   avatar: 20, email: 'meera.p@concert.io',   startDate: 'Jun 2026', endDate: 'Aug 2026', allocation: 40  },
  { id: 'e7', name: 'Vikram Bose',    code: 'EMP-014', role: 'Data Engineer',     avatar: 10, email: 'vikram.b@concert.io',  startDate: 'May 2026', endDate: 'Aug 2026', allocation: 100 },
  { id: 'e8', name: 'Anjali Singh',   code: 'EMP-073', role: 'Product Analyst',   avatar: 60, email: 'anjali.s@concert.io',  startDate: 'May 2026', endDate: 'Jul 2026', allocation: 60  },
]

const RATE_CARDS: RateEntry[] = [
  { id: 'r1', name: 'Arjun Sharma',  avatar: 47, billable: true,  hourlyRate: 85,  monthlyRate: 14800, allocationType: 'Full-time', currency: 'USD' },
  { id: 'r2', name: 'Priya Nair',    avatar: 33, billable: true,  hourlyRate: 70,  monthlyRate: 11900, allocationType: 'Part-time', currency: 'USD' },
  { id: 'r3', name: 'Rahul Mehra',   avatar: 44, billable: true,  hourlyRate: 75,  monthlyRate: 13000, allocationType: 'Full-time', currency: 'USD' },
  { id: 'r4', name: 'Kavitha Iyer',  avatar: 38, billable: false, hourlyRate: 0,   monthlyRate: 0,     allocationType: 'Part-time', currency: 'USD' },
  { id: 'r5', name: 'Siddharth Roy', avatar: 25, billable: true,  hourlyRate: 65,  monthlyRate: 5600,  allocationType: 'Part-time', currency: 'USD' },
  { id: 'r6', name: 'Meera Pillai',  avatar: 20, billable: false, hourlyRate: 0,   monthlyRate: 0,     allocationType: 'Part-time', currency: 'USD' },
  { id: 'r7', name: 'Vikram Bose',   avatar: 10, billable: true,  hourlyRate: 80,  monthlyRate: 13800, allocationType: 'Full-time', currency: 'USD' },
  { id: 'r8', name: 'Anjali Singh',  avatar: 60, billable: false, hourlyRate: 0,   monthlyRate: 0,     allocationType: 'Part-time', currency: 'USD' },
]

const ACTIVITY: ActivityItem[] = [
  { id: 'a1',  user: 'Arjun Sharma',  avatar: 47, action: 'approved timesheet for',       target: 'Week 20 — 40h',                   time: '2h ago',    type: 'approve' },
  { id: 'a2',  user: 'Priya Nair',    avatar: 33, action: 'submitted timesheet for',       target: 'Week 20 — 32h',                   time: '4h ago',    type: 'add'     },
  { id: 'a3',  user: 'Rahul Mehra',   avatar: 44, action: 'submitted timesheet for',       target: 'Week 20 — 40h',                   time: '6h ago',    type: 'add'     },
  { id: 'a4',  user: 'You',           avatar: 1,  action: 'approved leave request for',    target: 'Priya Nair — 2 days',             time: 'Yesterday', type: 'approve' },
  { id: 'a5',  user: 'Vikram Bose',   avatar: 10, action: 'submitted timesheet for',       target: 'Week 20 — 40h',                   time: 'Yesterday', type: 'add'     },
  { id: 'a6',  user: 'You',           avatar: 1,  action: 'updated project status to',     target: 'Active',                          time: '2d ago',    type: 'update'  },
  { id: 'a7',  user: 'Kavitha Iyer',  avatar: 38, action: 'submitted timesheet for',       target: 'Week 19 — 24h',                   time: '2d ago',    type: 'add'     },
  { id: 'a8',  user: 'You',           avatar: 1,  action: 'rejected leave request for',    target: 'Kavitha Iyer — 5 days',           time: '3d ago',    type: 'reject'  },
  { id: 'a9',  user: 'Siddharth Roy', avatar: 25, action: 'added comment on',              target: 'Sprint 3 review task',            time: '4d ago',    type: 'comment' },
  { id: 'a10', user: 'Meera Pillai',  avatar: 20, action: 'submitted timesheet for',       target: 'Week 19 — 16h',                   time: '4d ago',    type: 'add'     },
  { id: 'a11', user: 'You',           avatar: 1,  action: 'updated project timeline to',   target: 'Aug 2026',                        time: '5d ago',    type: 'update'  },
  { id: 'a12', user: 'Anjali Singh',  avatar: 60, action: 'added comment on',              target: 'Requirements sign-off document',  time: '6d ago',    type: 'comment' },
  { id: 'a13', user: 'You',           avatar: 1,  action: 'added new member',              target: 'Anjali Singh to project',         time: '1w ago',    type: 'add'     },
  { id: 'a14', user: 'Arjun Sharma',  avatar: 47, action: 'approved timesheet for',        target: 'Week 18 — 40h',                   time: '1w ago',    type: 'approve' },
]

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string; border: string }> = {
  'active':    { label: 'Active',    color: '#0A8A58', bg: 'rgba(14,168,106,0.10)',  border: 'rgba(14,168,106,0.20)'  },
  'on-hold':   { label: 'On Hold',   color: '#92400E', bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.20)'  },
  'completed': { label: 'Completed', color: '#3B82F6', bg: 'rgba(59,130,246,0.10)',  border: 'rgba(59,130,246,0.20)'  },
}

const TECH_STACK: Record<string, string[]> = {
  p1: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS', 'Node.js', 'PostgreSQL', 'Redis'],
  p2: ['Next.js', 'Java Spring Boot', 'Oracle DB', 'AWS'],
  p3: ['SAP ERP', 'Azure', 'Python', 'PowerBI'],
}

const PROJECT_CODES: Record<string, string> = {
  p1: 'PRJ-2026-001',
  p2: 'PRJ-2026-002',
  p3: 'PRJ-2026-003',
}

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', bg: '#F7F8FC' }

const TABS = [
  { id: 'details',    label: 'Project Details'    },
  { id: 'allocation', label: 'Project Allocation' },
  { id: 'ratecard',   label: 'Rate Card'          },
  { id: 'activity',   label: 'Activity'           },
]

/* ── Activity type config ── */
const ACTIVITY_CONFIG = {
  approve:  { color: '#0EA86A', bg: 'rgba(14,168,106,0.10)',  Icon: CheckCircle },
  reject:   { color: '#E84855', bg: 'rgba(232,72,85,0.10)',   Icon: XCircle     },
  add:      { color: '#6366F1', bg: 'rgba(99,102,241,0.10)',  Icon: Plus        },
  update:   { color: '#F5A623', bg: 'rgba(245,166,35,0.10)',  Icon: Edit2       },
  comment:  { color: '#8B90A7', bg: 'rgba(139,144,167,0.10)', Icon: Mail        },
}

/* ════════════════════════════════════════════════════
   Overview Card
══════════════════════════════════════════════════════ */
function OverviewCard({ project, st }: { project: Project; st: typeof STATUS_CONFIG[Status] }) {
  return (
    <div
      style={{
        background: '#fff',
        border: `1px solid ${C.border}`,
        borderRadius: 18,
        overflow: 'hidden',
        marginBottom: 24,
      }}
    >
      {/* Accent top bar */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${project.color}, ${project.color}80)` }} />

      <div style={{ padding: '24px 28px' }}>
        {/* Top row: title block + stats */}
        <div className="flex items-center gap-6">

          {/* Left: icon + name + description */}
          <div className="flex items-center gap-4" style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                background: `${project.color}18`,
                border: `1.5px solid ${project.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Briefcase size={22} style={{ color: project.color }} strokeWidth={1.6} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="flex items-center gap-3 mb-1.5">
                <h2 style={{ fontSize: 18, fontWeight: 800, color: C.navy, margin: 0 }}>{project.name}</h2>
                <span
                  style={{
                    fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 6,
                    background: st.bg, color: st.color, border: `1px solid ${st.border}`,
                    letterSpacing: '0.04em', textTransform: 'uppercase' as const, flexShrink: 0,
                  }}
                >
                  {st.label}
                </span>
              </div>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {project.description}
              </p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <Users size={12} style={{ color: C.muted }} />
                  <span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>Client: <strong style={{ color: '#3D4266' }}>{project.client}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} style={{ color: C.muted }} />
                  <span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>{project.startDate} → {project.endDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Tag size={12} style={{ color: C.muted }} />
                  <span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>{PROJECT_CODES[project.id] ?? 'PRJ-2026-000'}</span>
                </div>
              </div>

              {/* Team avatar stack */}
              <div className="flex items-center gap-2.5" style={{ marginTop: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {project.avatars.slice(0, 6).map((img, idx) => (
                    <img
                      key={idx}
                      src={`https://i.pravatar.cc/150?img=${img}`}
                      alt=""
                      style={{
                        width: 26, height: 26,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #fff',
                        marginLeft: idx === 0 ? 0 : -7,
                        position: 'relative',
                        zIndex: project.avatars.length - idx,
                        flexShrink: 0,
                      }}
                    />
                  ))}
                  {project.members > 6 && (
                    <div
                      style={{
                        width: 26, height: 26, borderRadius: '50%',
                        border: '2px solid #fff',
                        background: `${project.color}20`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginLeft: -7,
                        position: 'relative', zIndex: 0, flexShrink: 0,
                        fontSize: 9, fontWeight: 700, color: project.color,
                      }}
                    >
                      +{project.members - 6}
                    </div>
                  )}
                </div>
                <span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>
                  <strong style={{ color: '#3D4266' }}>{project.members}</strong> team members
                </span>
              </div>
            </div>
          </div>

          {/* Right: 3 stat boxes */}
          <div className="flex items-center gap-3" style={{ flexShrink: 0 }}>
            {[
              { label: 'Members',  value: String(project.members),  icon: Users,      color: '#6366F1', bg: 'rgba(99,102,241,0.08)'  },
              { label: 'Hours',    value: `${project.hoursLogged}h`, icon: Clock,      color: '#0EA86A', bg: 'rgba(14,168,106,0.08)'  },
              { label: 'Progress', value: `${project.progress}%`,   icon: TrendingUp, color: project.color, bg: `${project.color}14` },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div
                key={label}
                style={{
                  background: bg, borderRadius: 12, padding: '12px 16px',
                  minWidth: 80, textAlign: 'center' as const,
                }}
              >
                <Icon size={16} style={{ color, marginBottom: 6 }} strokeWidth={1.8} />
                <div style={{ fontSize: 18, fontWeight: 800, color: C.navy, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 11, color: C.muted, fontWeight: 500, marginTop: 3 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════
   Tab 1 — Project Details
══════════════════════════════════════════════════════ */
function DetailsTab({ project }: { project: Project }) {
  const st = STATUS_CONFIG[project.status]
  const techStack = TECH_STACK[project.id] ?? []
  const code = PROJECT_CODES[project.id] ?? 'PRJ-2026-000'

  const InfoRow = ({ label, value, icon: Icon }: { label: string; value: React.ReactNode; icon?: React.ElementType }) => (
    <div
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 16,
        padding: '14px 0',
        borderBottom: `1px solid #F3F4F8`,
      }}
    >
      <div style={{ width: 160, flexShrink: 0 }}>
        <div className="flex items-center gap-2">
          {Icon && <Icon size={13} style={{ color: C.muted }} strokeWidth={1.8} />}
          <span style={{ fontSize: 12.5, fontWeight: 600, color: C.muted }}>{label}</span>
        </div>
      </div>
      <div style={{ flex: 1, fontSize: 13.5, fontWeight: 500, color: '#2D3158', lineHeight: 1.5 }}>
        {value}
      </div>
    </div>
  )

  return (
    <div className="grid grid-cols-2 gap-5">
      {/* Left card */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '6px 24px 8px' }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', padding: '16px 0 4px' }}>
          Basic Information
        </div>
        <InfoRow label="Project Name"  value={project.name}    icon={Briefcase}  />
        <InfoRow label="Client Name"   value={project.client}  icon={Users}      />
        <InfoRow label="Project Code"  value={<span style={{ fontFamily: 'monospace', background: '#F0F2F8', padding: '2px 8px', borderRadius: 5, fontSize: 12.5 }}>{code}</span>} icon={Code2} />
        <InfoRow label="Status"
          value={
            <span style={{ fontSize: 11.5, fontWeight: 700, padding: '4px 10px', borderRadius: 6, background: st.bg, color: st.color, border: `1px solid ${st.border}`, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {st.label}
            </span>
          }
          icon={CheckCircle}
        />
        <InfoRow label="Team Size"     value={`${project.members} members`} icon={Users} />
        <InfoRow label="Hours Logged"  value={`${project.hoursLogged} hours`} icon={Clock} />
        <div style={{ paddingBottom: 8 }} />
      </div>

      {/* Right card */}
      <div>
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '6px 24px 8px', marginBottom: 16 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', padding: '16px 0 4px' }}>
            Timeline
          </div>
          <InfoRow label="Start Date"  value={project.startDate} icon={Calendar} />
          <InfoRow label="End Date"    value={project.endDate}   icon={Calendar} />
          <InfoRow label="Progress"
            value={
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div style={{ flex: 1, height: 6, borderRadius: 99, background: '#F0F2F8', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${project.progress}%`, borderRadius: 99, background: project.color }} />
                  </div>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: project.color, flexShrink: 0 }}>{project.progress}%</span>
                </div>
              </div>
            }
            icon={TrendingUp}
          />
          <div style={{ paddingBottom: 8 }} />
        </div>

        {/* Tech stack card */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '16px 24px 20px' }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>
            Technology Stack
          </div>
          <div className="flex flex-wrap gap-2">
            {techStack.map(tech => (
              <span
                key={tech}
                style={{
                  fontSize: 12.5, fontWeight: 600, padding: '5px 12px', borderRadius: 8,
                  background: '#F0F2F8', color: '#3D4266',
                  border: '1px solid #E4E6EF',
                }}
              >
                {tech}
              </span>
            ))}
            {techStack.length === 0 && <span style={{ fontSize: 13, color: C.muted }}>Not specified</span>}
          </div>
        </div>
      </div>

      {/* Description — full width */}
      <div style={{ gridColumn: '1 / -1', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '16px 24px' }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
          Project Description
        </div>
        <p style={{ fontSize: 13, color: '#3D4266', lineHeight: 1.6, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project.description}</p>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════
   Tab 2 — Project Allocation
══════════════════════════════════════════════════════ */
function AllocationTab() {
  const [employees, setEmployees]         = useState<AllocatedEmployee[]>(ALLOCATIONS)
  const [deleteTarget, setDeleteTarget]   = useState<AllocatedEmployee | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleteLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setEmployees(prev => prev.filter(e => e.id !== deleteTarget.id))
    setDeleteLoading(false)
    setDeleteTarget(null)
  }

  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
      {/* Table header */}
      <div
        className="flex items-center justify-between"
        style={{ padding: '18px 24px', borderBottom: `1px solid ${C.border}` }}
      >
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Allocated Team Members</div>
          <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>{employees.length} members assigned to this project</div>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F7F8FC' }}>
              {['Employee', 'Employee Code', 'Role', 'Allocation', 'Start Date', 'End Date', 'Actions'].map(col => (
                <th
                  key={col}
                  style={{
                    padding: '11px 20px', textAlign: 'left' as const,
                    fontSize: 11.5, fontWeight: 700, color: C.muted,
                    textTransform: 'uppercase' as const, letterSpacing: '0.05em',
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, idx) => (
              <TableRow
                key={emp.id}
                emp={emp}
                idx={idx}
                total={employees.length}
                onDelete={() => setDeleteTarget(emp)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(10,12,28,0.50)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'DM Sans', system-ui, sans-serif",
          }}
          onClick={e => { if (e.target === e.currentTarget && !deleteLoading) setDeleteTarget(null) }}
        >
          <div
            style={{
              background: '#fff', borderRadius: 22,
              padding: '36px 32px 28px',
              width: 380,
              boxShadow: '0 28px 72px rgba(10,12,28,0.22)',
              textAlign: 'center',
            }}
          >
            {/* Red icon */}
            <div
              style={{
                width: 62, height: 62, borderRadius: 18,
                background: 'rgba(232,72,85,0.10)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 18px',
              }}
            >
              <Trash2 size={26} strokeWidth={1.7} style={{ color: '#E84855' }} />
            </div>

            <div style={{ fontSize: 17, fontWeight: 800, color: C.navy, marginBottom: 8 }}>
              Remove Team Member
            </div>

            {/* Employee preview */}
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: '#F7F8FC', border: '1px solid #E8EAF2',
                borderRadius: 12, padding: '10px 14px',
                margin: '14px 0 18px', textAlign: 'left',
              }}
            >
              <img
                src={`https://i.pravatar.cc/150?img=${deleteTarget.avatar}`}
                alt=""
                style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff', flexShrink: 0 }}
              />
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{deleteTarget.name}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>{deleteTarget.role} · {deleteTarget.code}</div>
              </div>
            </div>

            <p style={{ fontSize: 13, color: '#8B90A7', lineHeight: 1.65, margin: '0 0 24px' }}>
              This will remove <strong style={{ color: C.navy }}>{deleteTarget.name}</strong> from the project allocation. This action cannot be undone.
            </p>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleteLoading}
                style={{
                  flex: 1, height: 44, borderRadius: 12,
                  border: '1px solid #E8EAF2', background: '#fff',
                  color: C.muted, fontSize: 14, fontWeight: 600,
                  cursor: deleteLoading ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!deleteLoading) { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy } }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8EAF2'; e.currentTarget.style.color = C.muted }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                style={{
                  flex: 1, height: 44, borderRadius: 12, border: 'none',
                  background: deleteLoading ? '#F87171' : '#E84855',
                  color: '#fff', fontSize: 14, fontWeight: 700,
                  cursor: deleteLoading ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit', transition: 'background 0.15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
                onMouseEnter={e => { if (!deleteLoading) e.currentTarget.style.background = '#D43F4B' }}
                onMouseLeave={e => { if (!deleteLoading) e.currentTarget.style.background = '#E84855' }}
              >
                {deleteLoading ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                      style={{ animation: 'spin 0.8s linear infinite', flexShrink: 0 }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                    Removing...
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    Yes, Remove
                  </>
                )}
              </button>
            </div>
          </div>
          <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
        </div>
      )}
    </div>
  )
}

function TableRow({
  emp, idx, total, onDelete,
}: {
  emp: AllocatedEmployee
  idx: number
  total: number
  onDelete: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? '#FAFBFE' : '#fff', transition: 'background 0.12s' }}
    >
      <td style={{ padding: '14px 20px', borderBottom: idx < total - 1 ? `1px solid #F3F4F8` : 'none' }}>
        <div className="flex items-center gap-3">
          <img
            src={`https://i.pravatar.cc/150?img=${emp.avatar}`}
            alt=""
            style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid #F0F2F8' }}
          />
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy }}>{emp.name}</div>
            <div style={{ fontSize: 11.5, color: C.muted, marginTop: 1 }}>{emp.email}</div>
          </div>
        </div>
      </td>
      <td style={{ padding: '14px 20px', borderBottom: idx < total - 1 ? `1px solid #F3F4F8` : 'none' }}>
        <span style={{ fontFamily: 'monospace', fontSize: 12.5, background: '#F0F2F8', padding: '2px 8px', borderRadius: 5, color: '#3D4266' }}>
          {emp.code}
        </span>
      </td>
      <td style={{ padding: '14px 20px', borderBottom: idx < total - 1 ? `1px solid #F3F4F8` : 'none' }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: '#3D4266' }}>{emp.role}</span>
      </td>
      <td style={{ padding: '14px 20px', borderBottom: idx < total - 1 ? `1px solid #F3F4F8` : 'none' }}>
        <div className="flex items-center gap-2">
          <div style={{ width: 60, height: 5, borderRadius: 99, background: '#F0F2F8', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${emp.allocation}%`, borderRadius: 99, background: emp.allocation === 100 ? '#0EA86A' : '#F5A623' }} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: emp.allocation === 100 ? '#0A8A58' : '#92400E' }}>{emp.allocation}%</span>
        </div>
      </td>
      <td style={{ padding: '14px 20px', borderBottom: idx < total - 1 ? `1px solid #F3F4F8` : 'none' }}>
        <span style={{ fontSize: 13, color: '#3D4266', fontWeight: 500 }}>{emp.startDate}</span>
      </td>
      <td style={{ padding: '14px 20px', borderBottom: idx < total - 1 ? `1px solid #F3F4F8` : 'none' }}>
        <span style={{ fontSize: 13, color: '#3D4266', fontWeight: 500 }}>{emp.endDate}</span>
      </td>
      <td style={{ padding: '14px 20px', borderBottom: idx < total - 1 ? `1px solid #F3F4F8` : 'none' }}>
        <div className="flex items-center gap-1.5">
          <ActionBtn icon={Edit2} color="#6366F1" bg="rgba(99,102,241,0.09)" title="Edit" />
          <ActionBtn icon={Trash2} color="#E84855" bg="rgba(232,72,85,0.09)" title="Delete" onClick={onDelete} />
        </div>
      </td>
    </tr>
  )
}

function ActionBtn({
  icon: Icon, color, bg, title, onClick,
}: {
  icon: React.ElementType; color: string; bg: string; title: string; onClick?: () => void
}) {
  const [h, setH] = useState(false)
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        width: 30, height: 30, borderRadius: 8, border: 'none', cursor: 'pointer',
        background: h ? bg : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.14s',
      }}
    >
      <Icon size={13} style={{ color: h ? color : C.muted }} strokeWidth={1.8} />
    </button>
  )
}

/* ════════════════════════════════════════════════════
   Tab 3 — Rate Card
══════════════════════════════════════════════════════ */
function RateCardTab() {
  const billable    = RATE_CARDS.filter(r => r.billable)
  const nonBillable = RATE_CARDS.filter(r => !r.billable)
  const totalMonthly = billable.reduce((a, r) => a + r.monthlyRate, 0)

  return (
    <div>
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Billable Resources',     value: String(billable.length),    color: '#0EA86A', bg: 'rgba(14,168,106,0.08)',  border: 'rgba(14,168,106,0.15)'  },
          { label: 'Non-Billable Resources', value: String(nonBillable.length), color: '#F5A623', bg: 'rgba(245,166,35,0.08)',  border: 'rgba(245,166,35,0.15)'  },
          { label: 'Total Monthly Billing',  value: `$${totalMonthly.toLocaleString()}`, color: '#6366F1', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.15)' },
        ].map(({ label, value, color, bg, border }) => (
          <div
            key={label}
            style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '16px 20px' }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 8 }}>{label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.navy }}>{value}</div>
            <div style={{ height: 3, borderRadius: 99, background: bg, border: `1px solid ${border}`, marginTop: 10 }}>
              <div style={{ height: '100%', width: '60%', borderRadius: 99, background: color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Resource Billing Details</div>
          <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>Hourly and monthly rates for all allocated team members</div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F7F8FC' }}>
              {['Employee', 'Billing Status', 'Hourly Rate', 'Monthly Rate', 'Allocation Type'].map(col => (
                <th
                  key={col}
                  style={{
                    padding: '11px 20px', textAlign: 'left' as const,
                    fontSize: 11.5, fontWeight: 700, color: C.muted,
                    textTransform: 'uppercase' as const, letterSpacing: '0.05em',
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RATE_CARDS.map((entry, idx) => {
              const [hovered, setHovered] = useState(false)
              return (
                <tr
                  key={entry.id}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  style={{ background: hovered ? '#FAFBFE' : '#fff', transition: 'background 0.12s' }}
                >
                  <td style={{ padding: '14px 20px', borderBottom: idx < RATE_CARDS.length - 1 ? `1px solid #F3F4F8` : 'none' }}>
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://i.pravatar.cc/150?img=${entry.avatar}`}
                        alt=""
                        style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid #F0F2F8' }}
                      />
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: C.navy }}>{entry.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', borderBottom: idx < RATE_CARDS.length - 1 ? `1px solid #F3F4F8` : 'none' }}>
                    <span
                      style={{
                        fontSize: 11.5, fontWeight: 700, padding: '4px 10px', borderRadius: 6,
                        background: entry.billable ? 'rgba(14,168,106,0.10)' : 'rgba(139,144,167,0.10)',
                        color: entry.billable ? '#0A8A58' : '#5A6080',
                        border: `1px solid ${entry.billable ? 'rgba(14,168,106,0.20)' : 'rgba(139,144,167,0.20)'}`,
                        letterSpacing: '0.04em', textTransform: 'uppercase' as const,
                      }}
                    >
                      {entry.billable ? 'Billable' : 'Non-Billable'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', borderBottom: idx < RATE_CARDS.length - 1 ? `1px solid #F3F4F8` : 'none' }}>
                    <div className="flex items-center gap-1.5">
                      <DollarSign size={12} style={{ color: C.muted }} />
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: entry.billable ? '#3D4266' : C.muted }}>
                        {entry.billable ? `${entry.hourlyRate}/hr` : '—'}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', borderBottom: idx < RATE_CARDS.length - 1 ? `1px solid #F3F4F8` : 'none' }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: entry.billable ? '#1C2035' : C.muted }}>
                      {entry.billable ? `$${entry.monthlyRate.toLocaleString()}` : '—'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', borderBottom: idx < RATE_CARDS.length - 1 ? `1px solid #F3F4F8` : 'none' }}>
                    <span
                      style={{
                        fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 6,
                        background: entry.allocationType === 'Full-time' ? 'rgba(99,102,241,0.09)' : entry.allocationType === 'Contract' ? 'rgba(245,166,35,0.09)' : '#F0F2F8',
                        color: entry.allocationType === 'Full-time' ? '#4B4ECC' : entry.allocationType === 'Contract' ? '#92400E' : '#5A6080',
                      }}
                    >
                      {entry.allocationType}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════
   Tab 4 — Activity
══════════════════════════════════════════════════════ */
const ACTIVITY_GROUPS = [
  { label: 'Today',         ids: ['a1', 'a2', 'a3']               },
  { label: 'Yesterday',     ids: ['a4', 'a5']                      },
  { label: 'This Week',     ids: ['a6', 'a7', 'a8', 'a9', 'a10']  },
  { label: 'Last Week',     ids: ['a11', 'a12', 'a13', 'a14']     },
]

function ActivityTab() {
  const [filterMonth, setFilterMonth] = useState('')

  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '24px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Recent Activity</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>Filter by</span>
          <div style={{ position: 'relative' }}>
            <input
              type="month"
              value={filterMonth}
              onChange={e => setFilterMonth(e.target.value)}
              style={{
                height: 34, padding: '0 10px',
                border: '1px solid #E4E6EF', borderRadius: 9,
                fontSize: 12.5, color: filterMonth ? C.navy : C.muted,
                background: filterMonth ? '#fff' : '#F8F9FC',
                fontFamily: "'DM Sans', system-ui, sans-serif",
                outline: 'none', cursor: 'pointer',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.background = '#fff' }}
              onBlur={e => { e.target.style.borderColor = '#E4E6EF'; e.target.style.background = filterMonth ? '#fff' : '#F8F9FC' }}
            />
          </div>
          {filterMonth && (
            <button
              onClick={() => setFilterMonth('')}
              style={{ height: 34, padding: '0 10px', borderRadius: 9, border: '1px solid #E4E6EF', background: '#F8F9FC', color: C.muted, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.14s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E4E6EF'; e.currentTarget.style.color = C.muted }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {ACTIVITY_GROUPS.map(group => {
          const items = ACTIVITY.filter(a => group.ids.includes(a.id))
          return (
            <div key={group.label}>
              {/* Group label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase' as const, letterSpacing: '0.07em', whiteSpace: 'nowrap' as const }}>
                  {group.label}
                </span>
                <div style={{ flex: 1, height: 1, background: '#ECEEF5' }} />
              </div>

              {/* Items */}
              <div style={{ position: 'relative', paddingLeft: 28 }}>
                <div
                  style={{
                    position: 'absolute', left: 11, top: 14,
                    width: 1.5, height: `calc(100% - 14px)`,
                    background: '#ECEEF5',
                  }}
                />
                {items.map((item, idx) => {
          const cfg = ACTIVITY_CONFIG[item.type]
          const Icon = cfg.Icon
          return (
            <div
              key={item.id}
              className="flex items-start gap-4"
              style={{ marginBottom: idx < items.length - 1 ? 26 : 0 }}
            >
              {/* Icon dot */}
              <div
                style={{
                  position: 'absolute', left: 0,
                  width: 22, height: 22, borderRadius: '50%',
                  background: cfg.bg, border: `1.5px solid ${cfg.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginTop: 5,
                  zIndex: 1,
                }}
              >
                <Icon size={10} style={{ color: cfg.color }} strokeWidth={2.2} />
              </div>

              {/* Content */}
              <div className="flex items-start gap-3" style={{ flex: 1 }}>
                <img
                  src={`https://i.pravatar.cc/150?img=${item.avatar}`}
                  alt=""
                  style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '2px solid #F0F2F8', flexShrink: 0, marginTop: 2 }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 13.5, color: '#3D4266', lineHeight: 1.5 }}>
                    <strong style={{ color: C.navy, fontWeight: 700 }}>{item.user}</strong>
                    {' '}{item.action}{' '}
                    <span style={{ color: cfg.color, fontWeight: 600 }}>{item.target}</span>
                  </p>
                  <span style={{ fontSize: 11.5, color: C.muted, fontWeight: 500, marginTop: 3, display: 'block' }}>{item.time}</span>
                </div>
              </div>
            </div>
          )
        })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════
   Main export
══════════════════════════════════════════════════════ */
export default function ProjectDetailPage({
  project,
  onBack,
}: {
  project: Project
  onBack: () => void
}) {
  const [activeTab, setActiveTab] = useState('details')
  const st = STATUS_CONFIG[project.status]

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* ── Page header ── */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl border cursor-pointer font-semibold"
          style={{
            height: 38, padding: '0 14px', fontSize: 13,
            background: '#fff', border: `1px solid ${C.border}`, color: C.muted,
            fontFamily: 'inherit', flexShrink: 0,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#C8CCE0'
            e.currentTarget.style.color = C.navy
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = C.border
            e.currentTarget.style.color = C.muted
          }}
        >
          <ArrowLeft size={14} />
          Back to Projects
        </button>
      </div>

      {/* ── Overview card ── */}
      <OverviewCard project={project} st={st} />

      {/* ── Tabs ── */}
      <div
        className="flex items-center gap-1 mb-5"
        style={{
          background: '#fff', border: `1px solid ${C.border}`,
          borderRadius: 12, padding: '5px 6px',
          display: 'inline-flex',
        }}
      >
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              height: 34, padding: '0 18px', borderRadius: 8, border: 'none',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              background: activeTab === tab.id ? C.navy : 'transparent',
              color: activeTab === tab.id ? '#fff' : C.muted,
              transition: 'all 0.15s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => { if (activeTab !== tab.id) { e.currentTarget.style.background = '#F0F2F8'; e.currentTarget.style.color = C.navy } }}
            onMouseLeave={e => { if (activeTab !== tab.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.muted } }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      {activeTab === 'details'    && <DetailsTab    project={project} />}
      {activeTab === 'allocation' && <AllocationTab />}
      {activeTab === 'ratecard'   && <RateCardTab   />}
      {activeTab === 'activity'   && <ActivityTab   />}
    </div>
  )
}
