import { useState } from 'react'
import {
  ArrowLeft, Users, Clock, Calendar,
  Edit2, Trash2, Plus, CheckCircle, XCircle, Mail,
  DollarSign, Briefcase, X, Check, ChevronDown,
} from 'lucide-react'

type Status = 'active' | 'on-hold' | 'completed' | 'draft' | 'yet-to-start'

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
  plannedStart?: string
  plannedEnd?: string
  actualStart?: string
  actualEnd?: string
  sowSigned?: string
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
  'draft':     { label: 'Draft',     color: '#6B7280', bg: 'rgba(107,114,128,0.10)', border: 'rgba(107,114,128,0.20)'  },
  'yet-to-start': { label: 'Yet to start', color: '#6366F1', bg: 'rgba(99,102,241,0.10)', border: 'rgba(99,102,241,0.20)' },
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
              { label: 'Members',  value: String(project.members),  icon: Users,      color: '#6366F1', bg: 'rgba(99,102,241,0.08)' },
              { label: 'Hours',    value: `${project.hoursLogged}h`, icon: Clock,      color: '#0EA86A', bg: 'rgba(14,168,106,0.08)' },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div
                key={label}
                style={{
                  background: bg, borderRadius: 12, padding: '12px 16px',
                  minWidth: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
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
    <div>
      <div className="grid grid-cols-2 gap-5 mb-5">
        {/* Left card */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '16px 24px 20px' }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', padding: '16px 0 16px' }}>
            Basic Information
          </div>
          <InfoRow label="Project Name"  value={project.name}    icon={Briefcase}  />
          <div style={{ height: 8 }} />
          <InfoRow label="Client Name"   value={project.client}  icon={Users}      />
          <div style={{ height: 8 }} />
          <InfoRow label="Status"
            value={
              <span style={{ fontSize: 11.5, fontWeight: 700, padding: '4px 10px', borderRadius: 6, background: st.bg, color: st.color, border: `1px solid ${st.border}`, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {st.label}
              </span>
            }
            icon={CheckCircle}
          />
          <div style={{ height: 8 }} />
          <InfoRow label="Team Size"     value={`${project.members} members`} icon={Users} />
          <div style={{ height: 8 }} />
          <InfoRow label="Hours Logged"  value={`${project.hoursLogged} hours`} icon={Clock} />
          <div style={{ paddingBottom: 8 }} />
        </div>

        {/* Right card */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '16px 24px' }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16 }}>
            Timeline
          </div>

          {/* Visual Timeline Bar */}
          <div style={{ background: '#F7F8FC', borderRadius: 12, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, marginBottom: 4 }}>Start Date</div>
              <div style={{ fontSize: 13.5, fontWeight: 500, color: '#3D4266' }}>{project.startDate}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <div style={{ width: 32, height: 2, background: 'linear-gradient(90deg, #6366F1, #4F46E5)', borderRadius: 1 }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#6366F1', border: '3px solid #fff', boxShadow: '0 0 0 2px #6366F1' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0, textAlign: 'right' as const }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, marginBottom: 4 }}>End Date</div>
              <div style={{ fontSize: 13.5, fontWeight: 500, color: '#3D4266' }}>{project.endDate}</div>
            </div>
          </div>

          {/* Detailed Timeline Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ padding: '12px 0' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>Planned Start</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#3D4266' }}>{project.plannedStart || project.startDate}</div>
            </div>
            <div style={{ padding: '12px 0' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>Planned End</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#3D4266' }}>{project.plannedEnd || project.endDate}</div>
            </div>
            <div style={{ padding: '12px 0' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>Actual Start</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: project.actualStart ? '#3D4266' : C.muted }}>{project.actualStart || '—'}</div>
            </div>
            <div style={{ padding: '12px 0' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>Actual End</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: project.actualEnd ? '#3D4266' : C.muted }}>{project.actualEnd || '—'}</div>
            </div>
          </div>

          {/* SoW Signed */}
          <div style={{ marginTop: 16, padding: '12px 14px', background: 'rgba(14,168,106,0.08)', border: '1px solid rgba(14,168,106,0.15)', borderRadius: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#0A8A58', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>SoW Signed</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: project.sowSigned ? '#0A8A58' : '#8B90A7' }}>{project.sowSigned || 'Not signed'}</div>
          </div>
        </div>
      </div>

      {/* Project Description — Full Width */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '16px 24px' }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
          Project Description
        </div>
        <p style={{ fontSize: 13, color: '#3D4266', lineHeight: 1.75, margin: 0 }}>{project.description}</p>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════
   Tab 2 — Project Allocation
══════════════════════════════════════════════════════ */
const ALLOC_ROLES = ['Tech Lead', 'Frontend Dev', 'Backend Dev', 'Full Stack Dev', 'QA Engineer', 'UI/UX Designer', 'DevOps Engineer', 'Data Engineer', 'Product Analyst', 'Scrum Master', 'Business Analyst']

function AllocationTab() {
  const [employees, setEmployees]         = useState<AllocatedEmployee[]>(ALLOCATIONS)
  const [deleteTarget, setDeleteTarget]   = useState<AllocatedEmployee | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [editTarget,   setEditTarget]     = useState<AllocatedEmployee | null>(null)
  const [editForm,     setEditForm]       = useState({ role: '', allocation: 100, email: '' })
  const [editSaving,   setEditSaving]     = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const [addForm, setAddForm]             = useState({ name: '', role: '', allocation: 100, email: '', startDate: '', endDate: '' })
  const [addLoading, setAddLoading]       = useState(false)
  const [employeeSearch, setEmployeeSearch] = useState('')
  const [showEmployeeList, setShowEmployeeList] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<AllocatedEmployee | null>(null)

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleteLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setEmployees(prev => prev.filter(e => e.id !== deleteTarget.id))
    setDeleteLoading(false)
    setDeleteTarget(null)
  }

  function openEdit(emp: AllocatedEmployee) {
    setEditTarget(emp)
    setEditForm({ role: emp.role, allocation: emp.allocation, email: emp.email })
  }

  async function confirmEdit() {
    if (!editTarget) return
    setEditSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setEmployees(prev => prev.map(e =>
      e.id === editTarget.id
        ? { ...e, role: editForm.role, allocation: editForm.allocation, email: editForm.email }
        : e
    ))
    setEditSaving(false)
    setEditTarget(null)
  }

  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
      {/* Table header */}
      <div
        style={{ padding: '18px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
      >
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Allocated Team Members</div>
          <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>{employees.length} members assigned to this project</div>
        </div>
        <button
          onClick={() => setShowAddMember(true)}
          style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', borderRadius: 10, flexShrink: 0,
          border: '1.5px dashed #6366F1', background: 'rgba(99, 102, 241, 0.06)',
          color: '#6366F1', fontSize: 12.5, fontWeight: 600,
          cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit'
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99, 102, 241, 0.12)'; e.currentTarget.style.borderColor = '#4F46E5' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99, 102, 241, 0.06)'; e.currentTarget.style.borderColor = '#6366F1' }}
        >
          <Plus size={14} strokeWidth={2.5} />
          Add Member
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F7F8FC' }}>
              {['Employee', 'Employee Code', 'Role', 'Allocation', 'Actions'].map(col => (
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
                onEdit={() => openEdit(emp)}
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

      {/* ── Edit modal ── */}
      {editTarget && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.50)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }}
          onClick={e => { if (e.target === e.currentTarget && !editSaving) setEditTarget(null) }}
        >
          <div style={{ background: '#fff', borderRadius: 22, width: 480, boxShadow: '0 28px 72px rgba(10,12,28,0.22)', overflow: 'hidden' }}>

            {/* Modal header */}
            <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid #F0F2F8' }}>
              <div className="flex items-center gap-3">
                <div style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Edit2 size={17} strokeWidth={1.8} style={{ color: '#5B5FDE' }} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: C.navy, letterSpacing: '-0.2px' }}>Edit Team Member</div>
                  <div style={{ fontSize: 12.5, color: C.muted, marginTop: 1 }}>Update role, allocation and contact details</div>
                </div>
                <button onClick={() => setEditTarget(null)} style={{ marginLeft: 'auto', width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, flexShrink: 0 }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#F7F8FC' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}>
                  <X size={13} strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Employee identity strip */}
            <div style={{ margin: '18px 28px 0', padding: '12px 16px', background: '#F7F8FC', border: '1px solid #E8EAF2', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src={`https://i.pravatar.cc/150?img=${editTarget.avatar}`} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{editTarget.name}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>{editTarget.code} · {editTarget.email}</div>
              </div>
            </div>

            {/* Form fields */}
            <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Role */}
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: '#8B90A7', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 7 }}>Role</label>
                <div style={{ position: 'relative' }}>
                  <select value={editForm.role} onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}
                    style={{ width: '100%', height: 44, borderRadius: 10, padding: '0 36px 0 14px', fontSize: 13.5, fontWeight: 500, color: C.navy, outline: 'none', border: `1px solid ${C.border}`, background: '#fff', appearance: 'none', cursor: 'pointer', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                    onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)' }}
                    onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }}>
                    {ALLOC_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
                </div>
              </div>

              {/* Allocation */}
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: '#8B90A7', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 7 }}>Allocation</label>
                <div className="flex items-center gap-4">
                  <div style={{ flex: 1, position: 'relative' }}>
                    <input type="number" min={10} max={100} step={5}
                      value={editForm.allocation}
                      onChange={e => setEditForm(f => ({ ...f, allocation: Math.min(100, Math.max(10, Number(e.target.value))) }))}
                      style={{ width: '100%', height: 44, borderRadius: 10, padding: '0 38px 0 14px', fontSize: 13.5, fontWeight: 600, color: C.navy, outline: 'none', border: `1px solid ${C.border}`, background: '#fff', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                      onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)' }}
                      onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
                    <span style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 13, fontWeight: 700, color: C.muted, pointerEvents: 'none' }}>%</span>
                  </div>
                  {/* Visual bar */}
                  <div style={{ flex: 2 }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>10%</span>
                      <div style={{ flex: 1, height: 6, borderRadius: 99, background: '#F0F2F8', overflow: 'hidden', position: 'relative' }}>
                        <div style={{ height: '100%', width: `${editForm.allocation}%`, borderRadius: 99, background: editForm.allocation === 100 ? '#0EA86A' : editForm.allocation >= 70 ? '#6366F1' : '#F5A623', transition: 'width 0.2s, background 0.2s' }} />
                      </div>
                      <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>100%</span>
                    </div>
                    <div style={{ textAlign: 'center', fontSize: 12.5, fontWeight: 700, color: editForm.allocation === 100 ? '#0A8A58' : editForm.allocation >= 70 ? '#5B5FDE' : '#B45309' }}>
                      {editForm.allocation === 100 ? 'Full-time' : editForm.allocation >= 70 ? 'Mostly allocated' : 'Part-time'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: '#8B90A7', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 7 }}>Email</label>
                <input type="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="employee@company.com"
                  style={{ width: '100%', height: 44, borderRadius: 10, padding: '0 14px', fontSize: 13.5, fontWeight: 500, color: C.navy, outline: 'none', border: `1px solid ${C.border}`, background: '#fff', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                  onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)' }}
                  onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '0 28px 26px', display: 'flex', gap: 10 }}>
              <button onClick={() => setEditTarget(null)} disabled={editSaving}
                style={{ flex: 1, height: 44, borderRadius: 12, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 14, fontWeight: 600, cursor: editSaving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
                onMouseEnter={e => { if (!editSaving) { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy } }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}>
                Cancel
              </button>
              <button onClick={confirmEdit} disabled={editSaving}
                style={{ flex: 1, height: 44, borderRadius: 12, border: 'none', background: editSaving ? '#818CF8' : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: editSaving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'opacity 0.15s' }}
                onMouseEnter={e => { if (!editSaving) e.currentTarget.style.opacity = '0.88' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
                {editSaving ? (
                  <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite', flexShrink: 0 }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>Saving…</>
                ) : (
                  <><Check size={15} strokeWidth={2.5} />Save Changes</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Team Member Modal */}
      {showAddMember && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(10,12,28,0.5)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}
          onClick={e => { if (e.target === e.currentTarget) setShowAddMember(false) }}
        >
          <div style={{
            background: '#fff', borderRadius: 20, width: 540,
            boxShadow: '0 28px 72px rgba(10,12,28,0.20)',
            overflow: 'hidden', animation: 'fadeIn 0.18s ease',
          }}>
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.border}`, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.navy, letterSpacing: '-0.2px' }}>Add Team Member</div>
                <div style={{ fontSize: 12.5, color: C.muted, marginTop: 4 }}>Select an employee and set allocation percentage</div>
              </div>
              <button onClick={() => setShowAddMember(false)} style={{ width: 32, height: 32, borderRadius: 7, border: 'none', background: '#F0F2F8', color: C.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', flexShrink: 0 }}
                onMouseEnter={e => { e.currentTarget.style.background = '#E5E9F5'; e.currentTarget.style.color = C.navy }}
                onMouseLeave={e => { e.currentTarget.style.background = '#F0F2F8'; e.currentTarget.style.color = C.muted }}>
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <div style={{ padding: '28px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Select Employee */}
              <div style={{ position: 'relative' }}>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: '#8B90A7', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>Select Employee *</label>
                <input
                  type="text"
                  value={employeeSearch}
                  onChange={e => { setEmployeeSearch(e.target.value); setShowEmployeeList(true) }}
                  placeholder="Search by name or email…"
                  style={{ width: '100%', height: 44, padding: '0 14px', border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 13.5, fontWeight: 500, color: C.navy, outline: 'none', background: '#fff', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                  onFocus={e => { setShowEmployeeList(true); e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)' }}
                  onBlur={e => { setTimeout(() => setShowEmployeeList(false), 200); e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }}
                />

                {/* Employee suggestions dropdown */}
                {showEmployeeList && employeeSearch && !selectedEmployee && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, zIndex: 100, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 24px rgba(28,32,53,0.10)', maxHeight: 220, overflowY: 'auto' }}>
                    {ALLOCATIONS.filter(emp =>
                      emp.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
                      emp.email.toLowerCase().includes(employeeSearch.toLowerCase())
                    ).map((emp, idx, arr) => (
                      <button
                        key={emp.id}
                        onMouseDown={() => { setSelectedEmployee(emp); setEmployeeSearch(''); setShowEmployeeList(false) }}
                        style={{ width: '100%', padding: '12px 14px', border: 'none', borderBottom: idx < arr.length - 1 ? `1px solid ${C.border}` : 'none', background: '#fff', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.1s', display: 'flex', alignItems: 'center', gap: 10 }}
                        onMouseEnter={e => { e.currentTarget.style.background = C.bg }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
                      >
                        <img src={`https://i.pravatar.cc/32?img=${emp.avatar}`} alt={emp.name} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{emp.name}</div>
                          <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{emp.email}</div>
                        </div>
                      </button>
                    ))}
                    {ALLOCATIONS.filter(emp =>
                      emp.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
                      emp.email.toLowerCase().includes(employeeSearch.toLowerCase())
                    ).length === 0 && (
                      <div style={{ padding: '14px', textAlign: 'center', fontSize: 13, color: C.muted }}>No employees found</div>
                    )}
                  </div>
                )}
              </div>

              {/* Selected Employee Details */}
              {selectedEmployee && (
                <div style={{ padding: '14px 16px', background: 'rgba(99, 102, 241, 0.06)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img src={`https://i.pravatar.cc/40?img=${selectedEmployee.avatar}`} alt={selectedEmployee.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy }}>{selectedEmployee.name}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{selectedEmployee.code} · {selectedEmployee.role}</div>
                  </div>
                  <button
                    onClick={() => { setSelectedEmployee(null); setEmployeeSearch('') }}
                    style={{ width: 28, height: 28, borderRadius: 7, border: 'none', background: 'rgba(99, 102, 241, 0.12)', color: '#6366F1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99, 102, 241, 0.18)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99, 102, 241, 0.12)' }}
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Allocation */}
              {selectedEmployee && (
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: '#8B90A7', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>Allocation</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <input type="number" min={10} max={100} step={5}
                        value={addForm.allocation}
                        onChange={e => setAddForm(prev => ({ ...prev, allocation: Math.min(100, Math.max(10, Number(e.target.value))) }))}
                        style={{ width: '100%', height: 44, borderRadius: 10, padding: '0 38px 0 14px', fontSize: 13.5, fontWeight: 600, color: C.navy, outline: 'none', border: `1px solid ${C.border}`, background: '#fff', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                        onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)' }}
                        onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
                      <span style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 13, fontWeight: 700, color: C.muted, pointerEvents: 'none' }}>%</span>
                    </div>
                    {/* Visual bar */}
                    <div style={{ flex: 1.2 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 11, color: C.muted, fontWeight: 600, minWidth: 24 }}>10%</span>
                        <div style={{ flex: 1, height: 6, borderRadius: 99, background: '#F0F2F8', overflow: 'hidden', position: 'relative' }}>
                          <div style={{ height: '100%', width: `${addForm.allocation}%`, borderRadius: 99, background: addForm.allocation === 100 ? '#0EA86A' : addForm.allocation >= 70 ? '#6366F1' : '#F5A623', transition: 'width 0.2s, background 0.2s' }} />
                        </div>
                        <span style={{ fontSize: 11, color: C.muted, fontWeight: 600, minWidth: 32 }}>100%</span>
                      </div>
                      <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: addForm.allocation === 100 ? '#0A8A58' : addForm.allocation >= 70 ? '#5B5FDE' : '#B45309' }}>
                        {addForm.allocation === 100 ? 'Full-time' : addForm.allocation >= 70 ? 'Mostly allocated' : 'Part-time'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Info Note and Days Input */}
              {selectedEmployee && addForm.allocation < 70 && (
                <div style={{ padding: '12px 14px', background: '#FEF8F0', border: `1px solid #FED7AA`, borderRadius: 12 }}>
                  <div style={{ fontSize: 12.5, color: '#92400E', lineHeight: 1.5, marginBottom: 12 }}>
                    <strong>ℹ️ Info:</strong> If you are assigning this employee on a part-time basis, please enter the number of allocated days. The employee will only have access to log timesheets for this project during the assigned allocation period.
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#92400E', marginBottom: 6 }}>Allocated Days</label>
                    <input
                      type="number"
                      min="1"
                      max="365"
                      value={addForm.startDate || ''}
                      onChange={e => setAddForm(prev => ({ ...prev, startDate: e.target.value }))}
                      placeholder="Enter number of days…"
                      style={{ width: '100%', height: 40, padding: '0 14px', border: `1px solid #FED7AA`, borderRadius: 10, fontSize: 13.5, fontWeight: 500, color: C.navy, outline: 'none', background: '#fff', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                      onFocus={e => { e.target.style.borderColor = '#F59E0B'; e.target.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.10)' }}
                      onBlur={e => { e.target.style.borderColor = '#FED7AA'; e.target.style.boxShadow = 'none' }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '0 28px 26px', display: 'flex', gap: 10 }}>
              <button onClick={() => { setShowAddMember(false); setSelectedEmployee(null); setEmployeeSearch(''); setAddForm({ name: '', role: '', allocation: 100, email: '', startDate: '', endDate: '' }) }} disabled={addLoading}
                style={{ flex: 1, height: 44, borderRadius: 12, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 14, fontWeight: 600, cursor: addLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', opacity: addLoading ? 0.5 : 1 }}
                onMouseEnter={e => { if (!addLoading) { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy } }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}>
                Cancel
              </button>
              <button onClick={() => { if (!selectedEmployee) return; setAddLoading(true); setTimeout(() => { setEmployees(prev => [...prev, { ...selectedEmployee, allocation: addForm.allocation }]) ; setAddLoading(false); setShowAddMember(false); setSelectedEmployee(null); setEmployeeSearch(''); setAddForm({ name: '', role: '', allocation: 100, email: '', startDate: '', endDate: '' }) }, 800) }} disabled={!selectedEmployee || addLoading}
                style={{ flex: 1, height: 44, borderRadius: 12, border: 'none', background: !selectedEmployee || addLoading ? '#C8CCE0' : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: !selectedEmployee || addLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.15s' }}
                onMouseEnter={e => { if (selectedEmployee && !addLoading) e.currentTarget.style.opacity = '0.88' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
                {addLoading ? (
                  <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite', flexShrink: 0 }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>Adding…</>
                ) : (
                  <>Add Member</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function TableRow({
  emp, idx, total, onDelete, onEdit,
}: {
  emp: AllocatedEmployee
  idx: number
  total: number
  onDelete: () => void
  onEdit: () => void
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
        <div className="flex items-center gap-1.5">
          <ActionBtn icon={Edit2} color="#6366F1" bg="rgba(99,102,241,0.09)" title="Edit" onClick={onEdit} />
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
      {/* ── Breadcrumb ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <button
          onClick={onBack}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 9, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0 }}
          onMouseEnter={e => { e.currentTarget.style.background = '#F7F8FC'; e.currentTarget.style.borderColor = '#C8CCE0' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}
        >
          <ArrowLeft size={14} strokeWidth={2} style={{ color: C.muted }} />
        </button>
        <span style={{ color: '#C8CCDC', fontSize: 14 }}>/</span>
        <button
          onClick={onBack}
          style={{ fontSize: 13.5, color: C.muted, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', transition: 'color 0.14s' }}
          onMouseEnter={e => { e.currentTarget.style.color = C.navy }}
          onMouseLeave={e => { e.currentTarget.style.color = C.muted }}
        >
          Projects
        </button>
        <span style={{ color: '#C8CCDC', fontSize: 14 }}>/</span>
        <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{project.name}</span>
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
