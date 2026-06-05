import { useState, useEffect, Fragment } from 'react'
import {
  Search, Code2, Layers, Palette, ShieldCheck, Server,
  Package, Smartphone, HeartPulse, UserCog, Landmark,
  Users, Briefcase, AlertCircle, ArrowLeft, Eye, Edit2, X,
  TrendingUp, Clock, CheckCircle2, Plus, Database, Globe, BarChart3,
} from 'lucide-react'

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', surface: '#F7F8FC' }

/* ── Types ── */
type EmpStatus = 'Active' | 'On Leave' | 'Inactive'

interface DeptEmployee {
  name: string; avatar: number; empId: string; role: string
  status: EmpStatus; joined: string
}

interface Department {
  id: string; name: string; description: string; color: string
  Icon: React.ElementType
  head: { name: string; title: string; avatar: number }
  employeeCount: number; targetHeadcount: number
  activeProjects: number; openPositions: number
  employees: DeptEmployee[]
  projects: { name: string; status: 'active' | 'on-hold' | 'completed'; progress: number; color: string }[]
}

/* ── Static data ── */
const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'engineering', name: 'Engineering',
    description: 'Core platform development, backend systems and API infrastructure',
    color: '#6366F1', Icon: Code2,
    head: { name: 'Rohan Mehta', title: 'VP Engineering', avatar: 29 },
    employeeCount: 18, targetHeadcount: 22, activeProjects: 3, openPositions: 4,
    employees: [
      { name: 'Sarah Johnson',  avatar: 47, empId: 'EMP-0047', role: 'Senior Engineer',      status: 'Active',   joined: 'Jan 2023' },
      { name: 'Tom Davis',      avatar: 20, empId: 'EMP-0020', role: 'Backend Engineer',      status: 'Active',   joined: 'Sep 2022' },
      { name: 'Karthik Nair',   avatar: 56, empId: 'EMP-0056', role: 'Full Stack Developer',  status: 'Active',   joined: 'Oct 2022' },
      { name: 'James Wilson',   avatar: 60, empId: 'EMP-0060', role: 'Frontend Engineer',     status: 'Inactive', joined: 'Jun 2022' },
      { name: 'Chris Thompson', avatar: 63, empId: 'EMP-0063', role: 'Platform Engineer',     status: 'Active',   joined: 'Mar 2024' },
      { name: 'David Brown',    avatar: 38, empId: 'EMP-0038', role: 'Lead Engineer',         status: 'Active',   joined: 'Nov 2021' },
    ],
    projects: [
      { name: 'Pulse.AI Platform v2', status: 'active',   progress: 65, color: '#6366F1' },
      { name: 'HDFC Digital Portal',  status: 'active',   progress: 42, color: '#0EA86A' },
      { name: 'CloudSync Pro',        status: 'active',   progress: 38, color: '#3B82F6' },
    ],
  },
  {
    id: 'product', name: 'Product Management',
    description: 'Product strategy, roadmap planning and stakeholder alignment',
    color: '#0EA86A', Icon: Layers,
    head: { name: 'Priya Sharma', title: 'Head of Product', avatar: 10 },
    employeeCount: 9, targetHeadcount: 10, activeProjects: 2, openPositions: 1,
    employees: [
      { name: 'Priya Sharma', avatar: 10, empId: 'EMP-0010', role: 'Head of Product',    status: 'Active',   joined: 'Apr 2021' },
      { name: 'Anjali Singh', avatar: 36, empId: 'EMP-0036', role: 'Product Analyst',    status: 'Active',   joined: 'Aug 2023' },
      { name: 'Meera Pillai', avatar: 54, empId: 'EMP-0054', role: 'Senior PM',          status: 'Active',   joined: 'Feb 2022' },
      { name: 'Aryan Gupta',  avatar: 8,  empId: 'EMP-0008', role: 'Product Strategist', status: 'On Leave', joined: 'Jul 2023' },
    ],
    projects: [
      { name: 'Pulse.AI Platform v2', status: 'active',    progress: 65,  color: '#6366F1' },
      { name: 'EduPortal LMS',        status: 'completed', progress: 100, color: '#0EA86A' },
    ],
  },
  {
    id: 'design', name: 'Design & UX',
    description: 'User experience design, visual identity and front-end prototyping',
    color: '#EC4899', Icon: Palette,
    head: { name: 'Fatima Al-Zahra', title: 'Design Lead', avatar: 41 },
    employeeCount: 7, targetHeadcount: 8, activeProjects: 2, openPositions: 1,
    employees: [
      { name: 'Fatima Al-Zahra', avatar: 41, empId: 'EMP-0041', role: 'Design Lead',     status: 'Active',   joined: 'Feb 2024' },
      { name: 'Emma Wilson',     avatar: 44, empId: 'EMP-0044', role: 'UI/UX Designer',  status: 'On Leave', joined: 'Feb 2023' },
      { name: 'Riya Kapoor',     avatar: 16, empId: 'EMP-0016', role: 'Visual Designer', status: 'Active',   joined: 'May 2023' },
      { name: 'Lucas Ferreira',  avatar: 23, empId: 'EMP-0023', role: 'Motion Designer', status: 'Active',   joined: 'Jan 2024' },
    ],
    projects: [
      { name: 'Retail CRM System',   status: 'active', progress: 48, color: '#EC4899' },
      { name: 'InfraMesh Dashboard', status: 'active', progress: 55, color: '#F59E0B' },
    ],
  },
  {
    id: 'qa', name: 'QA & Testing',
    description: 'Quality assurance, automated testing and release validation',
    color: '#06B6D4', Icon: ShieldCheck,
    head: { name: 'Mike Chen', title: 'QA Manager', avatar: 33 },
    employeeCount: 6, targetHeadcount: 8, activeProjects: 3, openPositions: 2,
    employees: [
      { name: 'Mike Chen',    avatar: 33, empId: 'EMP-0033', role: 'QA Manager',          status: 'Active',   joined: 'Mar 2023' },
      { name: 'Arjun Patel',  avatar: 52, empId: 'EMP-0052', role: 'QA Engineer',         status: 'On Leave', joined: 'May 2023' },
      { name: 'Shweta Rao',   avatar: 19, empId: 'EMP-0019', role: 'Automation Engineer', status: 'Active',   joined: 'Nov 2022' },
      { name: 'Kevin Mathew', avatar: 43, empId: 'EMP-0043', role: 'Test Analyst',        status: 'Active',   joined: 'Aug 2023' },
    ],
    projects: [
      { name: 'Pulse.AI Platform v2',  status: 'active',  progress: 65, color: '#6366F1' },
      { name: 'HDFC Digital Portal',   status: 'active',  progress: 42, color: '#0EA86A' },
      { name: 'TechCorp ERP Migration',status: 'on-hold', progress: 25, color: '#F5A623' },
    ],
  },
  {
    id: 'devops', name: 'Infrastructure & DevOps',
    description: 'Cloud infrastructure, CI/CD pipelines and site reliability engineering',
    color: '#3B82F6', Icon: Server,
    head: { name: 'Lisa Garcia', title: 'DevOps Lead', avatar: 25 },
    employeeCount: 8, targetHeadcount: 10, activeProjects: 2, openPositions: 2,
    employees: [
      { name: 'Lisa Garcia',  avatar: 25, empId: 'EMP-0025', role: 'DevOps Lead',      status: 'Active', joined: 'Jul 2022' },
      { name: 'Nikhil Verma', avatar: 37, empId: 'EMP-0037', role: 'SRE Engineer',     status: 'Active', joined: 'Sep 2022' },
      { name: 'Tanvi Desai',  avatar: 46, empId: 'EMP-0046', role: 'Cloud Architect',  status: 'Active', joined: 'Jan 2023' },
      { name: 'Ryan Pinto',   avatar: 13, empId: 'EMP-0013', role: 'Network Engineer', status: 'Active', joined: 'Apr 2024' },
    ],
    projects: [
      { name: 'CloudSync Pro',       status: 'active', progress: 38, color: '#3B82F6' },
      { name: 'InfraMesh Dashboard', status: 'active', progress: 55, color: '#F59E0B' },
    ],
  },
  {
    id: 'delivery', name: 'Delivery & Operations',
    description: 'Project delivery, client onboarding and operational excellence',
    color: '#F5A623', Icon: Package,
    head: { name: 'David Brown', title: 'Delivery Manager', avatar: 38 },
    employeeCount: 10, targetHeadcount: 12, activeProjects: 3, openPositions: 2,
    employees: [
      { name: 'David Brown', avatar: 38, empId: 'EMP-0038', role: 'Delivery Manager',    status: 'Active',   joined: 'Nov 2021' },
      { name: 'Pooja Menon', avatar: 31, empId: 'EMP-0031', role: 'Project Coordinator', status: 'Active',   joined: 'Mar 2023' },
      { name: 'Sam Clarke',  avatar: 49, empId: 'EMP-0049', role: 'Operations Analyst',  status: 'Active',   joined: 'Jun 2023' },
      { name: 'Ishaan Roy',  avatar: 6,  empId: 'EMP-0006', role: 'Scrum Master',        status: 'On Leave', joined: 'Oct 2022' },
    ],
    projects: [
      { name: 'TechCorp ERP Migration', status: 'on-hold',   progress: 25,  color: '#F5A623' },
      { name: 'MediLink HMS',           status: 'on-hold',   progress: 20,  color: '#8B5CF6' },
      { name: 'FinTrack App',           status: 'completed', progress: 100, color: '#14B8A6' },
    ],
  },
  {
    id: 'mobile', name: 'Mobile Development',
    description: 'iOS and Android application development and mobile strategy',
    color: '#8B5CF6', Icon: Smartphone,
    head: { name: 'Sneha Iyer', title: 'Mobile Lead', avatar: 48 },
    employeeCount: 7, targetHeadcount: 9, activeProjects: 1, openPositions: 2,
    employees: [
      { name: 'Sneha Iyer',    avatar: 48, empId: 'EMP-0048', role: 'Mobile Lead',       status: 'Active', joined: 'Feb 2022' },
      { name: 'Rahul Khanna',  avatar: 3,  empId: 'EMP-0003', role: 'iOS Developer',     status: 'Active', joined: 'May 2023' },
      { name: 'Prithvi Sinha', avatar: 14, empId: 'EMP-0014', role: 'Android Developer', status: 'Active', joined: 'Jan 2023' },
      { name: 'Zara Ahmed',    avatar: 58, empId: 'EMP-0058', role: 'React Native Dev',  status: 'Active', joined: 'Aug 2023' },
    ],
    projects: [
      { name: 'FinTrack App', status: 'completed', progress: 100, color: '#14B8A6' },
    ],
  },
  {
    id: 'hr', name: 'HR & Administration',
    description: 'People operations, talent acquisition, compliance and employee experience',
    color: '#F59E0B', Icon: UserCog,
    head: { name: 'Kavitha Reddy', title: 'HR Manager', avatar: 21 },
    employeeCount: 6, targetHeadcount: 6, activeProjects: 0, openPositions: 0,
    employees: [
      { name: 'Kavitha Reddy', avatar: 21, empId: 'EMP-0021', role: 'HR Manager',          status: 'Active', joined: 'Mar 2020' },
      { name: 'Bhavana Iyer',  avatar: 32, empId: 'EMP-0032', role: 'Talent Acquisition',  status: 'Active', joined: 'Jul 2022' },
      { name: 'Elsa Jacob',    avatar: 50, empId: 'EMP-0050', role: 'HR Business Partner', status: 'Active', joined: 'Jan 2023' },
      { name: 'Rajan Pillai',  avatar: 17, empId: 'EMP-0017', role: 'Compliance Officer',  status: 'Active', joined: 'Nov 2021' },
    ],
    projects: [],
  },
  {
    id: 'finance', name: 'Finance & Accounts',
    description: 'Financial planning, accounts management, payroll and audit compliance',
    color: '#EF4444', Icon: Landmark,
    head: { name: 'Nina Volkov', title: 'Finance Head', avatar: 18 },
    employeeCount: 7, targetHeadcount: 7, activeProjects: 0, openPositions: 0,
    employees: [
      { name: 'Nina Volkov',   avatar: 18, empId: 'EMP-0018', role: 'Finance Head',       status: 'Active', joined: 'Jan 2020' },
      { name: 'Dinesh Kumar',  avatar: 26, empId: 'EMP-0026', role: 'Senior Accountant',  status: 'Active', joined: 'Apr 2021' },
      { name: 'Aishwarya Rao', avatar: 42, empId: 'EMP-0042', role: 'Payroll Specialist', status: 'Active', joined: 'Sep 2022' },
      { name: 'George Philip', avatar: 57, empId: 'EMP-0057', role: 'Audit Analyst',      status: 'Active', joined: 'Feb 2023' },
    ],
    projects: [],
  },
]

/* ── Icon options for Add modal ── */
const ICON_OPTIONS: { key: string; Icon: React.ElementType; label: string }[] = [
  { key: 'code2',      Icon: Code2,       label: 'Code'        },
  { key: 'layers',     Icon: Layers,      label: 'Layers'      },
  { key: 'palette',    Icon: Palette,     label: 'Design'      },
  { key: 'shield',     Icon: ShieldCheck, label: 'QA'          },
  { key: 'server',     Icon: Server,      label: 'Server'      },
  { key: 'package',    Icon: Package,     label: 'Delivery'    },
  { key: 'smartphone', Icon: Smartphone,  label: 'Mobile'      },
  { key: 'heart',      Icon: HeartPulse,  label: 'Health'      },
  { key: 'usercog',    Icon: UserCog,     label: 'HR'          },
  { key: 'landmark',   Icon: Landmark,    label: 'Finance'     },
  { key: 'users',      Icon: Users,       label: 'People'      },
  { key: 'database',   Icon: Database,    label: 'Data'        },
  { key: 'globe',      Icon: Globe,       label: 'Global'      },
  { key: 'barchart',   Icon: BarChart3,   label: 'Analytics'   },
  { key: 'briefcase',  Icon: Briefcase,   label: 'Business'    },
]


const STATUS_CFG: Record<EmpStatus, { color: string; bg: string; border: string }> = {
  'Active':   { color: '#0A8A58', bg: 'rgba(14,168,106,0.09)',  border: 'rgba(14,168,106,0.18)' },
  'On Leave': { color: '#92400E', bg: 'rgba(245,158,11,0.09)',  border: 'rgba(245,158,11,0.18)' },
  'Inactive': { color: '#6B7280', bg: 'rgba(107,114,128,0.09)', border: 'rgba(107,114,128,0.18)' },
}


/* ── Org members for head search ── */
const ORG_MEMBERS = [
  { name: 'Rohan Mehta',     title: 'VP Engineering',     avatar: 29 },
  { name: 'Priya Sharma',    title: 'Head of Product',    avatar: 10 },
  { name: 'Fatima Al-Zahra', title: 'Design Lead',        avatar: 41 },
  { name: 'Mike Chen',       title: 'QA Manager',         avatar: 33 },
  { name: 'Lisa Garcia',     title: 'DevOps Lead',        avatar: 25 },
  { name: 'David Brown',     title: 'Delivery Manager',   avatar: 38 },
  { name: 'Sneha Iyer',      title: 'Mobile Lead',        avatar: 48 },
  { name: 'Kavitha Reddy',   title: 'HR Manager',         avatar: 21 },
  { name: 'Nina Volkov',     title: 'Finance Head',       avatar: 18 },
  { name: 'Arjun Sharma',    title: 'Technical Lead',     avatar: 47 },
  { name: 'Sarah Johnson',   title: 'Senior Engineer',    avatar: 44 },
  { name: 'Anjali Singh',    title: 'Product Analyst',    avatar: 36 },
  { name: 'Karthik Nair',    title: 'Full Stack Developer', avatar: 56 },
  { name: 'Vikram Bose',     title: 'Data Engineer',      avatar: 10 },
  { name: 'Priya Mehta',     title: 'HR Business Partner',avatar: 21 },
  { name: 'Arjun Menon',     title: 'IT Support Lead',    avatar: 15 },
  { name: 'Sunita Rao',      title: 'Finance Manager',    avatar: 20 },
]

/* ── Count-up hook ── */
function useCountUp(target: number, duration = 900, delay = 0) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => {
      const start = Date.now()
      const tick = () => {
        const p = Math.min((Date.now() - start) / duration, 1)
        setValue(Math.round(target * (1 - Math.pow(1 - p, 3))))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, delay)
    return () => clearTimeout(t)
  }, [target, duration, delay])
  return value
}

/* ── Stat card ── */
function StatCard({ label, subtext, value, icon: Icon, color, bg, border, delay }: {
  label: string; subtext: string; value: number
  icon: React.ElementType; color: string; bg: string; border: string; delay: number
}) {
  const displayed = useCountUp(value, 900, delay)
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff', border: `1px solid ${hovered ? '#C8CCE0' : C.border}`,
        borderRadius: 14, padding: '18px 20px', cursor: 'default',
        animation: 'deptSlide 0.42s cubic-bezier(0.22,1,0.36,1) both',
        animationDelay: `${delay}ms`,
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: hovered ? '0 8px 24px rgba(28,32,53,0.09)' : 'none',
        transition: 'transform 0.28s cubic-bezier(0.22,1,0.36,1), box-shadow 0.28s, border-color 0.2s',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span style={{ fontSize: 12.5, fontWeight: 500, color: '#5A6080' }}>{label}</span>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: bg, border: `1px solid ${border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={16} style={{ color }} strokeWidth={1.8} />
        </div>
      </div>
      <div style={{ fontSize: 30, fontWeight: 700, color: C.navy, letterSpacing: '-0.5px', lineHeight: 1 }}>{displayed}</div>
      <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 500, marginTop: 5 }}>{subtext}</div>
    </div>
  )
}

/* ── Add Department Page ── */
interface AddForm {
  name: string; description: string; color: string; iconKey: string
  headName: string; headTitle: string; headAvatar: number; targetHeadcount: string
}

const EMPTY_FORM: AddForm = {
  name: '', description: '', color: '#6366F1', iconKey: 'code2',
  headName: '', headTitle: '', headAvatar: 47, targetHeadcount: '',
}

function AddDepartmentPage({ onBack, onSave }: {
  onBack: () => void
  onSave: (d: Department) => void
}) {
  const [form, setForm]         = useState<AddForm>(EMPTY_FORM)
  const [errors, setErrors]     = useState<Partial<Record<keyof AddForm, string>>>({})
  const [headSearch, setHeadSearch] = useState('')
  const [headOpen,   setHeadOpen]   = useState(false)

  const headSuggestions = ORG_MEMBERS.filter(m =>
    m.name.toLowerCase().includes(headSearch.toLowerCase()) ||
    m.title.toLowerCase().includes(headSearch.toLowerCase())
  )

  function validate() {
    const e: Partial<Record<keyof AddForm, string>> = {}
    if (!form.name.trim())         e.name         = 'Department name is required'
    if (!form.description.trim())  e.description  = 'Description is required'
    if (!form.headName.trim())     e.headName     = 'Please select a department head'
    if (!form.targetHeadcount || isNaN(Number(form.targetHeadcount)) || Number(form.targetHeadcount) < 1)
      e.targetHeadcount = 'Enter a valid headcount'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSave() {
    if (!validate()) return
    const iconOpt = ICON_OPTIONS.find(o => o.key === form.iconKey) ?? ICON_OPTIONS[0]
    const newDept: Department = {
      id: `dept-${Date.now()}`,
      name: form.name.trim(),
      description: form.description.trim(),
      color: form.color,
      Icon: iconOpt.Icon,
      head: { name: form.headName.trim(), title: form.headTitle.trim(), avatar: form.headAvatar },
      employeeCount: 0,
      targetHeadcount: Number(form.targetHeadcount),
      activeProjects: 0,
      openPositions: Number(form.targetHeadcount),
      employees: [],
      projects: [],
    }
    onSave(newDept)
  }

  const selectedIcon = ICON_OPTIONS.find(o => o.key === form.iconKey) ?? ICON_OPTIONS[0]

  const iStyle = (hasError: boolean, val?: string): React.CSSProperties => ({
    width: '100%', height: 40, padding: '0 13px',
    border: `1px solid ${hasError ? '#E84855' : C.border}`,
    borderRadius: 10, fontSize: 13.5, color: C.navy,
    background: val ? '#F0F4FF' : '#fff', outline: 'none', fontFamily: 'inherit',
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.15s, background 0.15s',
  })

  const fi = (color: string, hasError: boolean) => ({
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.target.style.borderColor = hasError ? '#E84855' : color
      e.target.style.background = '#fff'
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.target.style.borderColor = hasError ? '#E84855' : C.border
      e.target.style.background = e.target.value ? '#F0F4FF' : '#fff'
    },
  })

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Breadcrumb header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 26 }}>
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 32, height: 32, borderRadius: 9,
            border: `1px solid ${C.border}`, background: '#fff',
            cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#F7F8FC'; e.currentTarget.style.borderColor = '#C8CCE0' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}
        >
          <ArrowLeft size={14} strokeWidth={2} style={{ color: C.muted }} />
        </button>
        <span style={{ color: '#C8CCDC', fontSize: 14 }}>/</span>
        <span style={{ fontSize: 13.5, color: C.muted, fontWeight: 500 }}>Department</span>
        <span style={{ color: '#C8CCDC', fontSize: 14 }}>/</span>
        <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>Add Department</span>
      </div>

      {/* Page title */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: C.navy, margin: '0 0 6px', letterSpacing: '-0.3px' }}>
          Create New Department
        </h1>
        <p style={{ fontSize: 13.5, color: C.muted, margin: 0 }}>
          Set up a new department with its head, icon, colour and target headcount.
        </p>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 22, alignItems: 'start' }}>

        {/* ── Left: Form sections ── */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 18 }}>

          {/* Section: Department Identity */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, padding: '24px 26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22, paddingBottom: 16, borderBottom: `1px solid ${C.surface}` }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: `${form.color}14`, border: `1px solid ${form.color}28`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <selectedIcon.Icon size={16} style={{ color: form.color }} strokeWidth={1.8} />
              </div>
              <div>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Department Identity</span>
                <p style={{ fontSize: 12, color: C.muted, margin: '2px 0 0' }}>Name, description and visual identity</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 18 }}>
              {/* Name */}
              <Field label="Department Name" required error={errors.name}>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Data Science"
                  style={iStyle(!!errors.name, form.name)}
                  {...fi(form.color, !!errors.name)}
                />
              </Field>

              {/* Description */}
              <Field label="Description" required error={errors.description}>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description of what this department does..."
                  rows={3}
                  style={{
                    ...iStyle(!!errors.description, form.description),
                    height: 'auto', resize: 'none' as const, paddingTop: 11, lineHeight: 1.6,
                  }}
                  {...fi(form.color, !!errors.description)}
                />
              </Field>

{/* Icon */}
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: C.navy, display: 'block', marginBottom: 10 }}>
                  Department Icon
                </label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
                  {ICON_OPTIONS.map(opt => {
                    const selected = form.iconKey === opt.key
                    return (
                      <button
                        key={opt.key}
                        onClick={() => setForm(f => ({ ...f, iconKey: opt.key }))}
                        title={opt.label}
                        style={{
                          width: 40, height: 40, borderRadius: 11, cursor: 'pointer',
                          border: selected ? `2px solid ${form.color}` : `1.5px solid ${C.border}`,
                          background: selected ? `${form.color}12` : C.surface,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.15s',
                          transform: selected ? 'scale(1.08)' : 'scale(1)',
                        }}
                      >
                        <opt.Icon size={17} style={{ color: selected ? form.color : C.muted }} strokeWidth={1.8} />
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Section: Department Head */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, padding: '24px 26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22, paddingBottom: 16, borderBottom: `1px solid ${C.surface}` }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <UserCog size={16} style={{ color: '#6366F1' }} strokeWidth={1.8} />
              </div>
              <div>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Department Head</span>
                <p style={{ fontSize: 12, color: C.muted, margin: '2px 0 0' }}>Manager responsible for this department</p>
              </div>
            </div>

            {errors.headName && (
              <p style={{ margin: '0 0 10px', fontSize: 12.5, color: '#E84855', fontWeight: 500 }}>{errors.headName}</p>
            )}

            {/* Selected member chip */}
            {form.headName ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, border: `1px solid ${form.color}30`, background: `${form.color}06` }}>
                <img src={`https://i.pravatar.cc/150?img=${form.headAvatar}`} alt=""
                  style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `2px solid ${form.color}30` }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{form.headName}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{form.headTitle}</div>
                </div>
                <button onClick={() => setForm(f => ({ ...f, headName: '', headTitle: '', headAvatar: 47 }))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: C.muted, lineHeight: 0 }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#E84855' }}
                  onMouseLeave={e => { e.currentTarget.style.color = C.muted }}>
                  <X size={14} strokeWidth={2} />
                </button>
              </div>
            ) : (
              /* Search input with dropdown */
              <div style={{ position: 'relative' }}>
                {headOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setHeadOpen(false)} />}
                <div style={{ position: 'relative', zIndex: 50 }}>
                  <input
                    value={headSearch}
                    onChange={e => { setHeadSearch(e.target.value); setHeadOpen(true) }}
                    onMouseDown={() => setHeadOpen(true)}
                    placeholder="Search member by name or role…"
                    style={{ ...iStyle(!!errors.headName, headSearch), paddingLeft: 38 }}
                    {...fi(form.color, !!errors.headName)}
                  />
                  <UserCog size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
                </div>
                {headOpen && headSuggestions.length > 0 && (
                  <div style={{ position: 'absolute', top: 'calc(100% + 5px)', left: 0, right: 0, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 13, boxShadow: '0 8px 28px rgba(28,32,53,0.12)', zIndex: 200, overflow: 'hidden', maxHeight: 240, overflowY: 'auto' }}>
                    {headSuggestions.map(m => (
                      <button key={m.name}
                        onMouseDown={() => {
                          setForm(f => ({ ...f, headName: m.name, headTitle: m.title, headAvatar: m.avatar }))
                          setHeadSearch(''); setHeadOpen(false)
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.12s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = C.surface }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                        <img src={`https://i.pravatar.cc/150?img=${m.avatar}`} alt=""
                          style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `1.5px solid ${C.border}` }} />
                        <div>
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy }}>{m.name}</div>
                          <div style={{ fontSize: 11.5, color: C.muted, marginTop: 1 }}>{m.title}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {headOpen && headSearch && headSuggestions.length === 0 && (
                  <div style={{ position: 'absolute', top: 'calc(100% + 5px)', left: 0, right: 0, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 13, padding: '14px', textAlign: 'center', zIndex: 200 }}>
                    <span style={{ fontSize: 13, color: C.muted }}>No members found for "{headSearch}"</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section: Settings */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, padding: '24px 26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22, paddingBottom: 16, borderBottom: `1px solid ${C.surface}` }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: 'rgba(14,168,106,0.1)', border: '1px solid rgba(14,168,106,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Users size={16} style={{ color: '#0EA86A' }} strokeWidth={1.8} />
              </div>
              <div>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Headcount Settings</span>
                <p style={{ fontSize: 12, color: C.muted, margin: '2px 0 0' }}>Define the target team size</p>
              </div>
            </div>

            <Field label="Target Headcount" required error={errors.targetHeadcount}>
              <input
                type="number"
                min={1}
                value={form.targetHeadcount}
                onChange={e => setForm(f => ({ ...f, targetHeadcount: e.target.value }))}
                placeholder="e.g. 12"
                style={{ ...iStyle(!!errors.targetHeadcount, form.targetHeadcount), maxWidth: 180 }}
                {...fi(form.color, !!errors.targetHeadcount)}
              />
            </Field>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingBottom: 8 }}>
            <button
              onClick={onBack}
              style={{
                height: 42, padding: '0 22px', borderRadius: 11,
                border: `1.5px solid ${C.border}`, background: '#fff',
                fontSize: 14, fontWeight: 600, color: C.muted,
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={{
                height: 42, padding: '0 28px', borderRadius: 11, border: 'none',
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', fontSize: 14, fontWeight: 700, color: '#fff',
                cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.15s',
                display: 'flex', alignItems: 'center', gap: 7,
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
            >
              <Plus size={15} strokeWidth={2.2} /> Create Department
            </button>
          </div>
        </div>

        {/* ── Right: Live preview ── */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16, position: 'sticky' as const, top: 16 }}>

          {/* Preview card */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, padding: '20px 22px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase' as const, letterSpacing: '0.08em', margin: '0 0 16px' }}>
              Live Preview
            </p>

            {/* Department card preview */}
            <div style={{
              border: `1.5px solid ${form.color}30`,
              borderRadius: 14, overflow: 'hidden',
              background: `linear-gradient(145deg, ${form.color}06 0%, #fff 100%)`,
            }}>
              {/* Top accent bar */}
              <div style={{ height: 4, background: `linear-gradient(90deg, ${form.color}, ${form.color}80)` }} />
              <div style={{ padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                    background: `${form.color}15`, border: `1.5px solid ${form.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <selectedIcon.Icon size={22} style={{ color: form.color }} strokeWidth={1.7} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: form.name ? C.navy : C.muted, letterSpacing: '-0.2px', marginBottom: 4 }}>
                      {form.name || 'Department Name'}
                    </div>
                    <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
                      {form.description || 'Department description will appear here…'}
                    </div>
                  </div>
                </div>

                <div style={{ height: 1, background: C.border, marginBottom: 14 }} />

                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <UserCog size={13} style={{ color: C.muted }} strokeWidth={1.8} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: C.muted, fontWeight: 500, marginBottom: 1 }}>Department Head</div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: form.headName ? C.navy : C.muted }}>
                        {form.headName || 'Head Name'} <span style={{ fontWeight: 500, color: C.muted }}>· {form.headTitle || 'Title'}</span>
                      </div>
                    </div>
                  </div>
                  {form.targetHeadcount && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Users size={13} style={{ color: C.muted }} strokeWidth={1.8} />
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: C.muted, fontWeight: 500, marginBottom: 1 }}>Target Headcount</div>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: C.navy }}>{form.targetHeadcount} members</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, padding: '18px 22px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase' as const, letterSpacing: '0.08em', margin: '0 0 14px' }}>
              Summary
            </p>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 0 }}>
              {[
                { label: 'Name',       val: form.name         || '—' },
                { label: 'Head',       val: form.headName     || '—' },
                { label: 'Title',      val: form.headTitle    || '—' },
                { label: 'Headcount',  val: form.targetHeadcount ? `${form.targetHeadcount} members` : '—' },
              ].map((row, i, arr) => (
                <div key={row.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none',
                }}>
                  <span style={{ fontSize: 12.5, color: C.muted }}>{row.label}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: C.navy, maxWidth: 160, textAlign: 'right' as const, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{row.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode
}) {
  return (
    <div>
      <label style={{ fontSize: 12.5, fontWeight: 600, color: C.navy, display: 'block', marginBottom: 6 }}>
        {label}{required && <span style={{ color: '#E84855', marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {error && <p style={{ fontSize: 11.5, color: '#E84855', margin: '5px 0 0', fontWeight: 500 }}>{error}</p>}
    </div>
  )
}


/* ── Detail view ── */
function DeptDetailView({ dept, onBack }: { dept: Department; onBack: () => void }) {
  const { Icon } = dept
  const activeEmps  = dept.employees.filter(e => e.status === 'Active').length
  const onLeaveEmps = dept.employees.filter(e => e.status === 'On Leave').length

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
        <button
          onClick={onBack}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 9, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0 }}
          onMouseEnter={e => { e.currentTarget.style.background = '#F7F8FC'; e.currentTarget.style.borderColor = '#C8CCE0' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}
        >
          <ArrowLeft size={14} strokeWidth={2} style={{ color: C.muted }} />
        </button>
        <span style={{ fontSize: 13, color: '#B0B4C8' }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: C.muted }}>Department</span>
        <span style={{ fontSize: 13, color: '#B0B4C8' }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{dept.name}</span>
      </div>

      {/* Header card */}
      <div style={{
        background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16,
        padding: '24px 28px', marginBottom: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, flexShrink: 0,
            background: `${dept.color}14`, border: `1px solid ${dept.color}28`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={26} style={{ color: dept.color }} strokeWidth={1.6} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: C.navy, margin: 0 }}>{dept.name}</h2>
              {dept.openPositions > 0 && (
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
                  background: 'rgba(232,72,85,0.08)', color: '#D63B47', border: '1px solid rgba(232,72,85,0.18)',
                }}>
                  {dept.openPositions} open positions
                </span>
              )}
            </div>
            <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>{dept.description}</p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 16px', background: C.surface, borderRadius: 12, flexShrink: 0,
            border: `1px solid ${C.border}`,
          }}>
            <img src={`https://i.pravatar.cc/150?img=${dept.head.avatar}`} alt=""
              style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${dept.color}30` }}
            />
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: C.muted, textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: 2 }}>Dept Head</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{dept.head.name}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{dept.head.title}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 0, marginTop: 22, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
          {[
            { label: 'Total Employees',  value: dept.employeeCount,   color: '#6366F1', icon: Users         },
            { label: 'Active',           value: activeEmps,            color: '#0EA86A', icon: CheckCircle2  },
            { label: 'On Leave',         value: onLeaveEmps,           color: '#F5A623', icon: Clock         },
            { label: 'Headcount Target', value: dept.targetHeadcount,  color: C.muted,   icon: TrendingUp    },
            { label: 'Open Positions',   value: dept.openPositions,    color: dept.openPositions > 0 ? '#E84855' : C.muted, icon: AlertCircle },
          ].map(({ label, value, color, icon: SI }, idx) => (
            <div key={label} style={{
              flex: 1, paddingLeft: idx > 0 ? 20 : 0, marginLeft: idx > 0 ? 20 : 0,
              borderLeft: idx > 0 ? `1px solid ${C.border}` : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                <SI size={12} strokeWidth={1.8} style={{ color }} />
                <span style={{ fontSize: 10.5, fontWeight: 600, color: C.muted, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>{label}</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.navy, letterSpacing: '-0.5px' }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Employees table */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '18px 22px 14px', borderBottom: `1px solid ${C.border}` }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: C.navy, margin: 0 }}>Team Members</h3>
          <p style={{ fontSize: 12, color: C.muted, margin: '3px 0 0' }}>Showing {dept.employees.length} of {dept.employeeCount} employees</p>
        </div>

        {dept.employees.length === 0 ? (
          <div style={{ padding: '36px', textAlign: 'center' as const }}>
            <Users size={28} strokeWidth={1.2} style={{ color: '#D0D3E4', margin: '0 auto 10px' }} />
            <p style={{ fontSize: 13, fontWeight: 600, color: C.navy, margin: '0 0 4px' }}>No employees yet</p>
            <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>Add employees to get started</p>
          </div>
        ) : (
          /* Single grid — header cells + all row cells are direct children,
             guaranteeing all columns stay perfectly aligned */
          <div style={{ display: 'grid', gridTemplateColumns: '36% 18% 30% 16%' }}>

            {/* Column headers */}
            {['Employee', 'Emp ID', 'Role', 'Status'].map((h, i) => (
              <div key={h} style={{
                padding: i === 0 ? '10px 12px 10px 22px' : '10px 14px',
                background: C.surface, borderBottom: `1px solid ${C.border}`,
                fontSize: 11, fontWeight: 700, color: C.muted,
                textTransform: 'uppercase' as const, letterSpacing: '0.05em',
              }}>
                {h}
              </div>
            ))}

            {/* Row cells — Fragment puts 4 cells per employee directly into the grid */}
            {dept.employees.map((emp, idx) => {
              const sc  = STATUS_CFG[emp.status]
              const bdr = idx < dept.employees.length - 1 ? `1px solid ${C.border}` : 'none'
              return (
                <Fragment key={emp.empId}>
                  <div style={{ padding: '12px 12px 12px 22px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: bdr }}>
                    <img src={`https://i.pravatar.cc/150?img=${emp.avatar}`} alt=""
                      style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{emp.name}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>Joined {emp.joined}</div>
                    </div>
                  </div>
                  <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', borderBottom: bdr }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.muted, fontFamily: 'monospace' }}>{emp.empId}</span>
                  </div>
                  <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', borderBottom: bdr }}>
                    <span style={{ fontSize: 12, color: '#3D4266', fontWeight: 500 }}>{emp.role}</span>
                  </div>
                  <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', borderBottom: bdr }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', fontSize: 11, fontWeight: 700,
                      padding: '3px 9px', borderRadius: 99,
                      background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                    }}>
                      {emp.status}
                    </span>
                  </div>
                </Fragment>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Table row ── */
const COLS = '44px 1fr 200px 130px 130px 96px'

function DeptRow({ dept, onView, onEdit }: { dept: Department; onView: () => void; onEdit: () => void }) {
  const [hovered, setHovered] = useState(false)
  const { Icon } = dept

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid', gridTemplateColumns: COLS, columnGap: 16, alignItems: 'center',
        padding: '14px 20px', cursor: 'default',
        background: hovered ? C.surface : 'transparent',
        transition: 'background 0.12s',
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      {/* Icon */}
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: `${dept.color}14`, border: `1px solid ${dept.color}28`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={17} style={{ color: dept.color }} strokeWidth={1.8} />
      </div>

      {/* Name + description */}
      <div style={{ minWidth: 0 }}>
        <div style={{ marginBottom: 2 }}>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{dept.name}</span>
        </div>
        <p style={{ fontSize: 12, color: C.muted, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {dept.description}
        </p>
      </div>

      {/* Head */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <img
          src={`https://i.pravatar.cc/150?img=${dept.head.avatar}`} alt=""
          style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `1.5px solid ${dept.color}30` }}
        />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: C.navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{dept.head.name}</div>
          <div style={{ fontSize: 11, color: C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{dept.head.title}</div>
        </div>
      </div>

      {/* Employees */}
      <div style={{ textAlign: 'center' as const }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, whiteSpace: 'nowrap' as const }}>{dept.employeeCount}</div>
        <div style={{ fontSize: 11, color: C.muted, whiteSpace: 'nowrap' as const }}>of {dept.targetHeadcount}</div>
      </div>

      {/* Open positions */}
      <div style={{ textAlign: 'center' as const }}>
        {dept.openPositions > 0 ? (
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 28, height: 28, borderRadius: '50%',
            fontSize: 12, fontWeight: 700,
            background: 'rgba(232,72,85,0.08)', color: '#D63B47', border: '1px solid rgba(232,72,85,0.16)',
          }}>
            {dept.openPositions}
          </span>
        ) : (
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 28, height: 28, borderRadius: '50%',
            fontSize: 11, fontWeight: 700,
            background: 'rgba(14,168,106,0.08)', color: '#0A8A58', border: '1px solid rgba(14,168,106,0.16)',
          }}>
            —
          </span>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
        <button onClick={onEdit}
          style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0 }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.30)' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}>
          <Edit2 size={13} style={{ color: '#6366F1' }} strokeWidth={1.8} />
        </button>
        <button onClick={onView}
          style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${hovered ? dept.color + '40' : C.border}`, background: hovered ? `${dept.color}0E` : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0 }}>
          <Eye size={13} style={{ color: hovered ? dept.color : C.muted }} strokeWidth={1.8} />
        </button>
      </div>
    </div>
  )
}

/* ── Main page ── */
export default function DepartmentManagementPage() {
  const [depts, setDepts]           = useState<Department[]>(INITIAL_DEPARTMENTS)
  const [search,     setSearch]     = useState('')
  const [selectedDept, setSelectedDept] = useState<Department | null>(null)
  const [showAdd, setShowAdd]       = useState(false)
  const [editDept,        setEditDept]        = useState<Department | null>(null)
  const [editName,        setEditName]        = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editHead,        setEditHead]        = useState<{ name: string; title: string; avatar: number } | null>(null)
  const [editHeadSearch,  setEditHeadSearch]  = useState('')
  const [editHeadOpen,    setEditHeadOpen]    = useState(false)
  const [editSaving,      setEditSaving]      = useState(false)

  if (selectedDept) {
    return <DeptDetailView dept={selectedDept} onBack={() => setSelectedDept(null)} />
  }

  if (showAdd) {
    return (
      <AddDepartmentPage
        onBack={() => setShowAdd(false)}
        onSave={newDept => {
          setDepts(prev => [...prev, newDept])
          setShowAdd(false)
        }}
      />
    )
  }

  const filtered = depts.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.description.toLowerCase().includes(search.toLowerCase()) ||
    d.head.name.toLowerCase().includes(search.toLowerCase())
  )

  const totalEmployees = depts.reduce((a, d) => a + d.employeeCount, 0)
  const totalOpen      = depts.reduce((a, d) => a + d.openPositions, 0)
  const fullyStaffed   = depts.filter(d => d.employeeCount >= d.targetHeadcount).length

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@keyframes deptSlide { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`}</style>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: C.navy, margin: '0 0 4px' }}>Department</h1>
          <p style={{ fontSize: 13.5, color: C.muted, margin: 0 }}>
            Manage organisational departments, team structure, headcount and project allocation
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            height: 34, padding: '0 14px', borderRadius: 9, border: 'none',
            background: C.navy, fontSize: 12.5, fontWeight: 600, color: '#fff',
            cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#2A3050' }}
          onMouseLeave={e => { e.currentTarget.style.background = C.navy }}
        >
          <Plus size={13} strokeWidth={2.2} /> Add Department
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Departments"    subtext="active in the org"        value={depts.length}    icon={Layers}      color="#6366F1" bg="rgba(99,102,241,0.09)"  border="rgba(99,102,241,0.15)"  delay={0}   />
        <StatCard label="Total Employees"      subtext="across all departments"   value={totalEmployees}  icon={Users}       color="#0EA86A" bg="rgba(14,168,106,0.09)" border="rgba(14,168,106,0.15)" delay={80}  />
        <StatCard label="Fully Staffed"         subtext="met headcount target"    value={fullyStaffed}    icon={CheckCircle2} color="#F5A623" bg="rgba(245,166,35,0.09)" border="rgba(245,166,35,0.15)" delay={160} />
        <StatCard label="Open Positions"       subtext="pending to be filled"     value={totalOpen}       icon={AlertCircle} color="#E84855" bg="rgba(232,72,85,0.09)"  border="rgba(232,72,85,0.15)"  delay={240} />
      </div>

      {/* Table card */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
        {/* Table toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 20px', borderBottom: `1px solid ${C.border}`,
        }}>
          <div style={{ position: 'relative', flex: '0 0 340px' }}>
            <Search size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search departments or heads..."
              style={{
                width: '100%', height: 34, paddingLeft: 30, paddingRight: 12,
                border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13,
                color: C.navy, background: C.hover, outline: 'none', fontFamily: 'inherit',
              }}
              onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.background = '#fff' }}
              onBlur={e => { e.target.style.borderColor = C.border; e.target.style.background = C.hover }}
            />
          </div>
          <span style={{ marginLeft: 'auto', fontSize: 12.5, fontWeight: 600, color: C.muted }}>
            {filtered.length} department{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Column headers */}
        <div style={{
          display: 'grid', gridTemplateColumns: COLS, columnGap: 16, alignItems: 'center',
          padding: '10px 20px', background: C.surface, borderBottom: `1px solid ${C.border}`,
        }}>
          <div />
          {['Department', 'Department Head', 'Employees', 'Open Roles', 'Action'].map((h, i) => (
            <div key={h + i} style={{
              fontSize: 11, fontWeight: 700, color: C.muted,
              textTransform: 'uppercase' as const, letterSpacing: '0.06em',
              textAlign: i >= 2 ? 'center' as const : 'left' as const,
            }}>
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' as const }}>
            <Search size={30} strokeWidth={1.2} style={{ color: '#D0D3E4', margin: '0 auto 12px' }} />
            <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, margin: '0 0 4px' }}>No departments found</p>
            <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Try adjusting your search</p>
          </div>
        ) : filtered.map((dept, idx) => (
          <div key={dept.id} style={{ borderBottom: idx === filtered.length - 1 ? 'none' : undefined }}>
            <DeptRow dept={dept} onView={() => setSelectedDept(dept)} onEdit={() => { setEditDept(dept); setEditName(dept.name); setEditDescription(dept.description); setEditHead(dept.head); setEditHeadSearch('') }} />
          </div>
        ))}
      </div>

      {/* ── Edit Department Modal ── */}
      {editDept && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.50)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }}
          onClick={e => { if (e.target === e.currentTarget && !editSaving) { setEditDept(null); setEditHeadOpen(false) } }}>
          <div style={{ background: '#fff', borderRadius: 22, width: 520, boxShadow: '0 28px 72px rgba(10,12,28,0.22)', overflow: 'hidden' }}>

            {/* Modal header */}
            <div style={{ padding: '22px 28px 18px', borderBottom: '1px solid #F0F2F8', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: `${editDept.color}14`, border: `1px solid ${editDept.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <editDept.Icon size={18} style={{ color: editDept.color }} strokeWidth={1.8} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.navy, letterSpacing: '-0.2px' }}>Edit Department</div>
                <div style={{ fontSize: 12.5, color: C.muted, marginTop: 1 }}>Update name, description and department head</div>
              </div>
              <button onClick={() => { setEditDept(null); setEditHeadOpen(false) }}
                style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted }}
                onMouseEnter={e => { e.currentTarget.style.background = '#F7F8FC' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}>
                <X size={13} strokeWidth={2} />
              </button>
            </div>

            {/* Modal body */}
            <div style={{ padding: '22px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Department Name */}
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase' as const, letterSpacing: '0.06em', display: 'block', marginBottom: 7 }}>
                  Department Name <span style={{ color: '#E84855' }}>*</span>
                </label>
                <input value={editName} onChange={e => setEditName(e.target.value)}
                  placeholder="e.g. Engineering"
                  style={{ width: '100%', height: 44, borderRadius: 10, padding: '0 14px', fontSize: 13.5, fontWeight: 500, color: C.navy, outline: 'none', border: `1px solid ${C.border}`, background: editName ? C.surface : '#fff', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.15s, box-shadow 0.15s' }}
                  onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)' }}
                  onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase' as const, letterSpacing: '0.06em', display: 'block', marginBottom: 7 }}>
                  Description
                </label>
                <textarea value={editDescription} onChange={e => setEditDescription(e.target.value)}
                  placeholder="Brief description of what this department does..."
                  rows={3}
                  style={{ width: '100%', borderRadius: 10, padding: '11px 14px', fontSize: 13.5, fontWeight: 400, color: C.navy, outline: 'none', border: `1px solid ${C.border}`, background: editDescription ? C.surface : '#fff', resize: 'none', lineHeight: 1.6, fontFamily: "'DM Sans', system-ui, sans-serif", boxSizing: 'border-box', transition: 'border-color 0.15s, box-shadow 0.15s' }}
                  onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)' }}
                  onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
              </div>

              {/* Department Head */}
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase' as const, letterSpacing: '0.06em', display: 'block', marginBottom: 7 }}>
                  Department Head
                </label>
                {editHead ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 10, border: `1px solid ${editDept.color}30`, background: `${editDept.color}06` }}>
                    <img src={`https://i.pravatar.cc/150?img=${editHead.avatar}`} alt=""
                      style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `2px solid ${editDept.color}30` }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{editHead.name}</div>
                      <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>{editHead.title}</div>
                    </div>
                    <button onClick={() => { setEditHead(null); setEditHeadSearch('') }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: C.muted, lineHeight: 0, flexShrink: 0 }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#E84855' }}
                      onMouseLeave={e => { e.currentTarget.style.color = C.muted }}>
                      <X size={14} strokeWidth={2} />
                    </button>
                  </div>
                ) : (
                  <div style={{ position: 'relative' }}>
                    {editHeadOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setEditHeadOpen(false)} />}
                    <div style={{ position: 'relative', zIndex: 50 }}>
                      <input
                        value={editHeadSearch}
                        onChange={e => { setEditHeadSearch(e.target.value); setEditHeadOpen(true) }}
                        onMouseDown={() => setEditHeadOpen(true)}
                        placeholder="Search member by name or role…"
                        style={{ width: '100%', height: 44, borderRadius: 10, padding: '0 14px 0 38px', fontSize: 13.5, fontWeight: 500, color: C.navy, outline: 'none', border: `1px solid ${C.border}`, background: '#fff', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.15s, box-shadow 0.15s' }}
                        onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)' }}
                        onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }}
                      />
                      <UserCog size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
                    </div>
                    {editHeadOpen && (() => {
                      const suggestions = ORG_MEMBERS.filter(m =>
                        m.name.toLowerCase().includes(editHeadSearch.toLowerCase()) ||
                        m.title.toLowerCase().includes(editHeadSearch.toLowerCase())
                      )
                      return suggestions.length > 0 ? (
                        <div style={{ position: 'absolute', top: 'calc(100% + 5px)', left: 0, right: 0, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 13, boxShadow: '0 8px 28px rgba(28,32,53,0.12)', zIndex: 200, overflow: 'hidden', maxHeight: 220, overflowY: 'auto' }}>
                          {suggestions.map(m => (
                            <button key={m.name}
                              onMouseDown={() => { setEditHead(m); setEditHeadSearch(''); setEditHeadOpen(false) }}
                              style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.12s' }}
                              onMouseEnter={e => { e.currentTarget.style.background = C.surface }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                              <img src={`https://i.pravatar.cc/150?img=${m.avatar}`} alt=""
                                style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `1.5px solid ${C.border}` }} />
                              <div>
                                <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy }}>{m.name}</div>
                                <div style={{ fontSize: 11.5, color: C.muted, marginTop: 1 }}>{m.title}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : editHeadSearch ? (
                        <div style={{ position: 'absolute', top: 'calc(100% + 5px)', left: 0, right: 0, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 13, padding: '14px', textAlign: 'center', zIndex: 200 }}>
                          <span style={{ fontSize: 13, color: C.muted }}>No members found for "{editHeadSearch}"</span>
                        </div>
                      ) : null
                    })()}
                  </div>
                )}
              </div>

            </div>

            {/* Modal footer */}
            <div style={{ padding: '0 28px 26px', display: 'flex', gap: 10 }}>
              <button onClick={() => { setEditDept(null); setEditHeadOpen(false) }} disabled={editSaving}
                style={{ flex: 1, height: 44, borderRadius: 12, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 14, fontWeight: 600, cursor: editSaving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
                onMouseEnter={e => { if (!editSaving) { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy } }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}>
                Cancel
              </button>
              <button disabled={editSaving || !editName.trim()}
                onClick={async () => {
                  if (!editName.trim()) return
                  setEditSaving(true)
                  await new Promise(r => setTimeout(r, 700))
                  setDepts(prev => prev.map(d => d.id === editDept.id
                    ? { ...d, name: editName.trim(), description: editDescription.trim(), head: editHead ?? d.head }
                    : d
                  ))
                  setEditSaving(false); setEditDept(null); setEditHeadOpen(false)
                }}
                style={{ flex: 1, height: 44, borderRadius: 12, border: 'none', background: (!editName.trim() || editSaving) ? '#818CF8' : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: (!editName.trim() || editSaving) ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'opacity 0.15s' }}
                onMouseEnter={e => { if (editName.trim() && !editSaving) e.currentTarget.style.opacity = '0.88' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
                {editSaving
                  ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>Saving…</>
                  : <><CheckCircle2 size={15} strokeWidth={2.5} />Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
