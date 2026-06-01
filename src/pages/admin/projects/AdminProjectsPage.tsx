import { useState, useEffect } from 'react'
import { Search, Clock, TrendingUp, Users, CheckCircle2, Calendar, ArrowRight, Building2 } from 'lucide-react'
import ProjectDetailPage from '../../manager/projects/ProjectDetailPage'

type Status = 'active' | 'on-hold' | 'completed'

interface Project {
  id: string
  name: string
  client: string
  department: string
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

const PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Pulse.AI Platform v2',
    client: 'Internal R&D',
    department: 'Engineering',
    status: 'active',
    startDate: 'May 2026',
    endDate: 'Aug 2026',
    members: 8,
    avatars: [47, 33, 44, 38, 25, 20, 10, 60],
    hoursLogged: 240,
    pendingApprovals: 3,
    progress: 65,
    description: 'Next-generation workforce management SaaS platform built for enterprise teams. The platform integrates AI-driven scheduling, real-time attendance analytics, and automated payroll workflows. Designed to scale across multi-location organisations with role-based access and compliance reporting.',
    color: '#6366F1',
  },
  {
    id: 'p2',
    name: 'HDFC Digital Portal',
    client: 'HDFC Bank',
    department: 'Product',
    status: 'active',
    startDate: 'Mar 2026',
    endDate: 'Jul 2026',
    members: 5,
    avatars: [15, 22, 30, 35, 42],
    hoursLogged: 128,
    pendingApprovals: 1,
    progress: 42,
    description: 'A customer-facing digital banking portal redesigned to modernise the end-to-end user experience for HDFC Bank retail clients. The project covers integrated payment workflows, account management dashboards, and secure two-factor authentication. Built with accessibility and mobile-first responsiveness as core design principles.',
    color: '#0EA86A',
  },
  {
    id: 'p3',
    name: 'TechCorp ERP Migration',
    client: 'TechCorp Ltd',
    department: 'Delivery',
    status: 'on-hold',
    startDate: 'Jan 2026',
    endDate: 'Dec 2026',
    members: 4,
    avatars: [5, 12, 18, 28],
    hoursLogged: 86,
    pendingApprovals: 0,
    progress: 25,
    description: "End-to-end migration of TechCorp's legacy on-premise ERP system to a cloud-native architecture on Microsoft Azure. The project includes data integrity validation, parallel-run testing, and a phased department-by-department rollout strategy. Full cutover is planned following six months of stabilisation and user acceptance testing.",
    color: '#F5A623',
  },
  {
    id: 'p4',
    name: 'Retail CRM System',
    client: 'RetailMax Inc',
    department: 'Engineering',
    status: 'active',
    startDate: 'Apr 2026',
    endDate: 'Sep 2026',
    members: 6,
    avatars: [8, 19, 27, 36, 48, 55],
    hoursLogged: 174,
    pendingApprovals: 2,
    progress: 48,
    description: 'A unified CRM platform tailored for retail chains managing multi-store customer relationships and loyalty programs. The system includes customer segmentation, campaign management, and real-time purchase analytics. Integrates with POS systems across 120+ store locations for seamless data synchronisation.',
    color: '#EC4899',
  },
  {
    id: 'p5',
    name: 'FinTrack App',
    client: 'FinServe Group',
    department: 'Mobile',
    status: 'completed',
    startDate: 'Oct 2025',
    endDate: 'Mar 2026',
    members: 5,
    avatars: [3, 11, 21, 31, 41],
    hoursLogged: 320,
    pendingApprovals: 0,
    progress: 100,
    description: 'A personal finance tracking mobile application for FinServe Group customers, enabling budget management, investment portfolio tracking, and automated expense categorisation. Delivered ahead of schedule with full iOS and Android parity. Post-launch onboarded over 40,000 users within the first month.',
    color: '#14B8A6',
  },
  {
    id: 'p6',
    name: 'CloudSync Pro',
    client: 'CloudBase Technologies',
    department: 'Infrastructure',
    status: 'active',
    startDate: 'Feb 2026',
    endDate: 'Oct 2026',
    members: 7,
    avatars: [6, 16, 26, 37, 46, 52, 58],
    hoursLogged: 198,
    pendingApprovals: 4,
    progress: 38,
    description: 'Enterprise-grade multi-cloud synchronisation middleware enabling seamless data orchestration across AWS, Azure, and GCP environments. Features include automated conflict resolution, real-time sync dashboards, and compliance-ready audit trails. Designed to handle petabyte-scale workloads for Fortune 500 clients.',
    color: '#3B82F6',
  },
  {
    id: 'p7',
    name: 'MediLink HMS',
    client: 'MediCare Solutions',
    department: 'Healthcare IT',
    status: 'on-hold',
    startDate: 'Mar 2026',
    endDate: 'Nov 2026',
    members: 9,
    avatars: [2, 9, 17, 29, 39, 49, 57, 63, 70],
    hoursLogged: 112,
    pendingApprovals: 0,
    progress: 20,
    description: 'A comprehensive Hospital Management System covering patient registration, outpatient and inpatient workflows, pharmacy management, and insurance claim processing. Currently on hold pending regulatory clearance from the national health authority. Development is 20% complete with core patient modules delivered.',
    color: '#8B5CF6',
  },
  {
    id: 'p8',
    name: 'InfraMesh Dashboard',
    client: 'InfraTech Corp',
    department: 'Infrastructure',
    status: 'active',
    startDate: 'May 2026',
    endDate: 'Jul 2026',
    members: 3,
    avatars: [13, 23, 43],
    hoursLogged: 62,
    pendingApprovals: 1,
    progress: 55,
    description: 'A real-time infrastructure monitoring dashboard providing unified visibility across servers, containers, and network topology for InfraTech Corp. Features include anomaly detection alerts, custom SLA threshold configuration, and automated incident ticket generation. Built on a WebSocket-driven event stream architecture.',
    color: '#F59E0B',
  },
  {
    id: 'p9',
    name: 'EduPortal LMS',
    client: 'BrightLearn Academy',
    department: 'Product',
    status: 'completed',
    startDate: 'Jul 2025',
    endDate: 'Jan 2026',
    members: 6,
    avatars: [4, 14, 24, 34, 44, 54],
    hoursLogged: 410,
    pendingApprovals: 0,
    progress: 100,
    description: 'A full-featured Learning Management System for BrightLearn Academy supporting live classes, recorded content, assignment submissions, and AI-powered student progress analytics. Successfully migrated 85,000 students from legacy systems with zero downtime. Rated 4.8/5 by educators during post-launch review.',
    color: '#0EA86A',
  },
]

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string; border: string }> = {
  'active':    { label: 'Active',    color: '#0A8A58', bg: 'rgba(14,168,106,0.10)',  border: 'rgba(14,168,106,0.20)'  },
  'on-hold':   { label: 'On Hold',   color: '#92400E', bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.20)'  },
  'completed': { label: 'Completed', color: '#3B82F6', bg: 'rgba(59,130,246,0.10)',  border: 'rgba(59,130,246,0.20)'  },
}

const FILTER_TABS: { id: 'all' | Status; label: string }[] = [
  { id: 'all',       label: 'All Projects' },
  { id: 'active',    label: 'Active'       },
  { id: 'on-hold',   label: 'On Hold'      },
  { id: 'completed', label: 'Completed'    },
]

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8' }

/* ── Count-up hook ── */
function useCountUp(target: number, duration = 900, delay = 0) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = Date.now()
      const tick = () => {
        const progress = Math.min((Date.now() - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setValue(Math.round(target * eased))
        if (progress < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, delay)
    return () => clearTimeout(timeout)
  }, [target, duration, delay])
  return value
}

/* ── Stat card ── */
interface StatCardProps {
  label: string
  subtext: string
  value: number
  icon: React.ElementType
  color: string
  bg: string
  border: string
  delay: number
}

function StatCard({ label, subtext, value, icon: Icon, color, bg, border, delay }: StatCardProps) {
  const displayed = useCountUp(value, 900, delay)
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        border: `1px solid ${hovered ? '#C8CCE0' : C.border}`,
        borderRadius: 14,
        padding: '18px 20px',
        cursor: 'default',
        animation: 'statSlideUp 0.42s cubic-bezier(0.22,1,0.36,1) both',
        animationDelay: `${delay}ms`,
        transform: hovered ? 'translateY(-5px)' : 'translateY(0px)',
        boxShadow: hovered ? '0 8px 24px rgba(28,32,53,0.09)' : '0 0 0 transparent',
        transition: 'transform 0.28s cubic-bezier(0.22,1,0.36,1), box-shadow 0.28s, border-color 0.2s',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span style={{ fontSize: 12.5, fontWeight: 500, color: '#5A6080' }}>{label}</span>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: hovered ? bg.replace('0.09', '0.15').replace('0.10', '0.18') : bg,
          border: `1px solid ${border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          transition: 'background 0.2s',
        }}>
          <Icon size={16} style={{ color }} strokeWidth={1.8} />
        </div>
      </div>
      <div style={{ fontSize: 30, fontWeight: 700, color: C.navy, letterSpacing: '-0.5px', lineHeight: 1 }}>
        {displayed}
      </div>
      <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 500, marginTop: 5, lineHeight: 1.4 }}>
        {subtext}
      </div>
    </div>
  )
}

/* ── Avatar stack ── */
function AvatarStack({ avatars, total }: { avatars: number[]; total: number }) {
  const visible = avatars.slice(0, 4)
  const overflow = total - visible.length
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {visible.map((img, idx) => (
        <img
          key={idx}
          src={`https://i.pravatar.cc/150?img=${img}`}
          alt=""
          style={{
            width: 26, height: 26, borderRadius: '50%', objectFit: 'cover',
            border: '2px solid #fff', marginLeft: idx === 0 ? 0 : -8,
            position: 'relative', zIndex: visible.length - idx, flexShrink: 0,
          }}
        />
      ))}
      {overflow > 0 && (
        <div style={{
          width: 26, height: 26, borderRadius: '50%', border: '2px solid #fff',
          background: '#E8EAF2', display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginLeft: -8, position: 'relative', zIndex: 0,
          fontSize: 9.5, fontWeight: 700, color: C.muted, flexShrink: 0,
        }}>
          +{overflow}
        </div>
      )}
    </div>
  )
}

/* ── Project card ── */
function ProjectCard({
  project,
  st,
  onView,
}: {
  project: Project
  st: { label: string; color: string; bg: string; border: string }
  onView: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        border: `1px solid ${hovered ? '#C8CCE0' : '#E8EAF2'}`,
        borderRadius: 16,
        padding: '24px 24px 20px',
        cursor: 'default',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        boxShadow: hovered ? '0 4px 20px rgba(28,32,53,0.07)' : 'none',
      }}
    >
      {/* Top: bar + name/desc | status badge */}
      <div className="flex items-start gap-3" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 12, flex: 1, minWidth: 0 }}>
          <div style={{ width: 3, borderRadius: 99, background: project.color, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1C2035', lineHeight: 1.35, marginBottom: 4 }}>
              {project.name}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
              <Building2 size={11} strokeWidth={1.8} style={{ color: C.muted, flexShrink: 0 }} />
              <span style={{ fontSize: 11.5, fontWeight: 600, color: C.muted }}>{project.department}</span>
            </div>
            <p style={{ fontSize: 12, color: '#8B90A7', lineHeight: 1.6, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {project.description}
            </p>
          </div>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 7,
          background: st.bg, color: st.color, border: `1px solid ${st.border}`,
          letterSpacing: '0.04em', textTransform: 'uppercase' as const, flexShrink: 0, alignSelf: 'flex-start',
        }}>
          {st.label}
        </span>
      </div>

      <div style={{ height: 1, background: '#F0F2F8', marginBottom: 18 }} />

      {/* Client + timeline */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '13px 16px', background: '#F7F8FC', borderRadius: 11, marginBottom: 20,
      }}>
        <div className="flex items-center gap-2">
          <div style={{ width: 28, height: 28, borderRadius: 8, background: '#ECEEF5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Users size={13} strokeWidth={1.8} style={{ color: '#8B90A7' }} />
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#B0B4C8', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: 1 }}>Client</div>
            <div style={{ fontSize: 12.5, color: '#3D4266', fontWeight: 600 }}>{project.client}</div>
          </div>
        </div>
        <div style={{ width: 1, height: 28, background: '#E4E6EF' }} />
        <div className="flex items-center gap-2">
          <div style={{ width: 28, height: 28, borderRadius: 8, background: '#ECEEF5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Calendar size={13} strokeWidth={1.8} style={{ color: '#8B90A7' }} />
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#B0B4C8', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: 1 }}>Timeline</div>
            <div style={{ fontSize: 12.5, color: '#3D4266', fontWeight: 600 }}>{project.startDate} → {project.endDate}</div>
          </div>
        </div>
      </div>

      {/* Members + Hours */}
      <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
        <div className="flex items-center gap-3">
          <AvatarStack avatars={project.avatars} total={project.members} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1C2035', lineHeight: 1.2 }}>{project.members}</div>
            <div style={{ fontSize: 11, color: '#8B90A7', fontWeight: 500, marginTop: 1 }}>Members</div>
          </div>
        </div>
        <div style={{ width: 1, height: 36, background: '#E8EAF2' }} />
        <div className="flex items-center gap-2.5">
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(14,168,106,0.09)', border: '1px solid rgba(14,168,106,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Clock size={15} strokeWidth={1.8} style={{ color: '#0EA86A' }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1C2035', lineHeight: 1.2 }}>{project.hoursLogged}h</div>
            <div style={{ fontSize: 11, color: '#8B90A7', fontWeight: 500, marginTop: 1 }}>Logged</div>
          </div>
        </div>
      </div>

      <div style={{ height: 1, background: '#F0F2F8', marginBottom: 18 }} />

      {/* Progress bar */}
      <div style={{ marginBottom: 20 }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#8B90A7' }}>Progress</span>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: project.color }}>{project.progress}%</span>
        </div>
        <div style={{ height: 7, borderRadius: 99, background: '#F0F2F8', overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${project.progress}%`, borderRadius: 99,
            background: `linear-gradient(90deg, ${project.color}, ${project.color}bb)`,
            transition: 'width 0.6s ease',
          }} />
        </div>
      </div>

      {/* Footer */}
      <button
        onClick={onView}
        className="w-full flex items-center justify-center gap-2 rounded-xl cursor-pointer font-semibold transition-all duration-150"
        style={{
          height: 40, fontSize: 13, border: 'none',
          background: hovered ? `${project.color}14` : '#F7F8FC',
          color: hovered ? project.color : '#5A6080',
          outline: `1px solid ${hovered ? `${project.color}25` : '#ECEEF5'}`,
          fontFamily: 'inherit',
        }}
      >
        View Details
        <ArrowRight size={13} />
      </button>
    </div>
  )
}

/* ── Main page ── */
export default function AdminProjectsPage() {
  const [filter, setFilter] = useState<'all' | Status>('all')
  const [search, setSearch] = useState('')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  if (selectedProject) {
    return (
      <ProjectDetailPage
        project={selectedProject}
        onBack={() => setSelectedProject(null)}
      />
    )
  }

  const filtered = PROJECTS.filter(p => {
    const matchesFilter = filter === 'all' || p.status === filter
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase()) ||
      p.department.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const activeCount    = PROJECTS.filter(p => p.status === 'active').length
  const completedCount = PROJECTS.filter(p => p.status === 'completed').length
  const totalMembers   = PROJECTS.reduce((a, p) => a + p.members, 0)
  const departments    = [...new Set(PROJECTS.map(p => p.department))].length

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes statSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>

      {/* Page header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-xl font-bold" style={{ color: C.navy }}>All Projects</h1>
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(14,168,106,0.10)', color: '#0A8A58', border: '1px solid rgba(14,168,106,0.20)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#0EA86A' }} />
              {activeCount} Active
            </span>
          </div>
          <p className="text-sm" style={{ color: C.muted }}>
            Organisation-wide view of all projects — track progress, teams, and delivery across every department
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Projects"  subtext="across the organisation"   value={PROJECTS.length} icon={TrendingUp}    color="#6366F1" bg="rgba(99,102,241,0.09)"   border="rgba(99,102,241,0.15)"  delay={0}   />
        <StatCard label="Active Projects" subtext="currently in progress"     value={activeCount}     icon={Clock}         color="#0EA86A" bg="rgba(14,168,106,0.09)"  border="rgba(14,168,106,0.15)"  delay={80}  />
        <StatCard label="Total Members"   subtext="assigned across projects"  value={totalMembers}    icon={Users}         color="#F5A623" bg="rgba(245,166,35,0.09)"  border="rgba(245,166,35,0.15)"  delay={160} />
        <StatCard label="Completed"       subtext="successfully delivered"    value={completedCount}  icon={CheckCircle2}  color="#3B82F6" bg="rgba(59,130,246,0.09)"  border="rgba(59,130,246,0.15)"  delay={240} />
      </div>

      {/* Filters row */}
      <div
        className="flex items-center gap-3 mb-5"
        style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '12px 14px' }}
      >
        <div className="relative" style={{ flex: '0 0 460px' }}>
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.muted }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects, clients or departments..."
            style={{
              width: '100%', height: 36, paddingLeft: 32, paddingRight: 12,
              border: `1px solid ${C.border}`, borderRadius: 9,
              fontSize: 13, color: C.navy, background: C.hover, outline: 'none',
              fontFamily: 'inherit',
            }}
            onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.background = '#fff' }}
            onBlur={e => { e.target.style.borderColor = C.border; e.target.style.background = C.hover }}
          />
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          {FILTER_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              style={{
                height: 34, padding: '0 14px', borderRadius: 8, border: 'none',
                fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                background: filter === tab.id ? C.navy : C.hover,
                color: filter === tab.id ? '#fff' : C.muted,
                transition: 'all 0.15s', fontFamily: 'inherit',
              }}
              onMouseEnter={e => { if (filter !== tab.id) { e.currentTarget.style.background = '#E4E6EF'; e.currentTarget.style.color = C.navy } }}
              onMouseLeave={e => { if (filter !== tab.id) { e.currentTarget.style.background = C.hover; e.currentTarget.style.color = C.muted } }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Project grid */}
      {filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center"
          style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, minHeight: 240 }}
        >
          <Search size={32} strokeWidth={1.2} style={{ color: '#D0D3E4', marginBottom: 12 }} />
          <p style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>No projects found</p>
          <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filtered.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              st={STATUS_CONFIG[project.status]}
              onView={() => setSelectedProject(project)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
