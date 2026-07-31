import { useState, useRef, useEffect } from 'react'
import {
  User, Briefcase, Shield, Phone, Camera, ChevronDown, Check, Plus,
  Trash2, MapPin, CreditCard, GraduationCap, Users, AlertCircle,
  BookOpen, FileSpreadsheet, UploadCloud, X,
  CalendarClock, RotateCcw, Info, Pencil, ArrowLeft,
} from 'lucide-react'

// ─── Constants ────────────────────────────────────────────────────────────────

const C = {
  navy:    '#1C2035',
  border:  '#E8EAF2',
  muted:   '#8B90A7',
  surface: '#F7F8FC',
  hover:   '#F0F2F8',
  red:     '#E84855',
  label:   '#3D4266',
  green:   '#10B981',
  indigo:  '#6366F1',
  rose:    '#EC4899',
  amber:   '#F59E0B',
}

function genId() { return `EMP-${String(Math.floor(Math.random() * 8000) + 1000)}` }

// Employee types that skip probation and are confirmed from day one
const NO_PROBATION_TYPES = ['Intern', 'Consultant', 'Contract']

// Add whole months to an ISO date string (yyyy-mm-dd) → ISO date string
function addMonths(dateStr: string, months: number) {
  if (!dateStr || !months) return ''
  const d = new Date(dateStr + 'T00:00:00')
  d.setMonth(d.getMonth() + months)
  return d.toISOString().slice(0, 10)
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface FamilyMember { id: string; name: string; relation: string; dob: string; isDependent: boolean }
interface Education    { id: string; level: string; institute: string; degree: string; specialization: string; percent: string; from: string; to: string }

// ─── Shared form atoms ────────────────────────────────────────────────────────

const inputBase: React.CSSProperties = {
  width: '100%', height: 44, borderRadius: 10,
  padding: '0 14px', fontSize: 13.5, fontWeight: 500,
  color: C.navy, outline: 'none',
  fontFamily: "'DM Sans', system-ui, sans-serif",
  boxSizing: 'border-box', transition: 'border-color 0.15s, box-shadow 0.15s',
}

function FieldLabel({ text, required }: { text: string; required?: boolean }) {
  return (
    <p style={{ margin: '0 0 7px', fontSize: 12.5, fontWeight: 600, color: C.label }}>
      {text}{required && <span style={{ color: C.red, marginLeft: 3 }}>*</span>}
    </p>
  )
}

function FInput({
  label, required, placeholder, type = 'text', value, onChange, disabled,
}: {
  label: string; required?: boolean; placeholder?: string
  type?: string; value: string; onChange: (v: string) => void; disabled?: boolean
}) {
  const [focus, setFocus] = useState(false)
  return (
    <div>
      <FieldLabel text={label} required={required} />
      <input
        type={type} value={value} placeholder={placeholder} disabled={disabled}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          ...inputBase,
          border: `1px solid ${focus ? C.indigo : C.border}`,
          background: disabled ? C.hover : value ? C.surface : '#fff',
          color: disabled ? C.muted : C.navy,
          cursor: disabled ? 'default' : 'text',
          boxShadow: focus ? '0 0 0 3px rgba(99,102,241,0.10)' : 'none',
        }}
      />
    </div>
  )
}

function FSelect({
  label, required, options, value, onChange, placeholder = 'Select…',
}: {
  label: string; required?: boolean; options: string[]
  value: string; onChange: (v: string) => void; placeholder?: string
}) {
  const [focus, setFocus] = useState(false)
  return (
    <div>
      <FieldLabel text={label} required={required} />
      <div style={{ position: 'relative' }}>
        <select
          value={value} onChange={e => onChange(e.target.value)}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{
            ...inputBase, padding: '0 36px 0 14px',
            border: `1px solid ${focus ? C.indigo : C.border}`,
            background: value ? C.surface : '#fff', appearance: 'none', cursor: 'pointer',
            color: value === '' ? C.muted : C.navy,
            boxShadow: focus ? '0 0 0 3px rgba(99,102,241,0.10)' : 'none',
          }}
        >
          <option value="">{placeholder}</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={13} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
      </div>
    </div>
  )
}

function FTextarea({
  label, required, placeholder, value, onChange, rows = 3,
}: {
  label: string; required?: boolean; placeholder?: string
  value: string; onChange: (v: string) => void; rows?: number
}) {
  const [focus, setFocus] = useState(false)
  return (
    <div>
      <FieldLabel text={label} required={required} />
      <textarea
        value={value} placeholder={placeholder} rows={rows}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          ...inputBase, height: 'auto', padding: '12px 14px',
          border: `1px solid ${focus ? C.indigo : C.border}`,
          background: value ? C.surface : '#fff', resize: 'vertical', lineHeight: 1.6,
          boxShadow: focus ? '0 0 0 3px rgba(99,102,241,0.10)' : 'none',
        }}
      />
    </div>
  )
}

function FToggle({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', background: C.surface, borderRadius: 10, border: `1px solid ${C.border}` }}>
      <div>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.navy }}>{label}</p>
        {hint && <p style={{ margin: '3px 0 0', fontSize: 11.5, color: C.muted }}>{hint}</p>}
      </div>
      <button onClick={() => onChange(!checked)} style={{ width: 44, height: 24, borderRadius: 12, border: 'none', flexShrink: 0, background: checked ? C.indigo : '#CDD0DC', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}>
        <span style={{ position: 'absolute', top: 3, left: checked ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.18)' }} />
      </button>
    </div>
  )
}

// Section wrapper
function FormSection({ icon, title, subtitle, accent = C.indigo, children }: { icon: React.ReactNode; title: string; subtitle?: string; accent?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '15px 22px', borderBottom: `1px solid ${C.border}`, background: C.surface }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: `${accent}14`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: C.navy }}>{title}</p>
          {subtitle && <p style={{ margin: 0, fontSize: 11.5, color: C.muted }}>{subtitle}</p>}
        </div>
      </div>
      <div style={{ padding: 22 }}>{children}</div>
    </div>
  )
}

// Sub-section heading inside a section
function SubHead({ label, color = C.muted }: { label: string; color?: string }) {
  return <div style={{ fontSize: 11.5, fontWeight: 700, color, textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 14, marginTop: 4 }}>{label}</div>
}

const ROLE_INFO: Record<string, { color: string; bg: string; border: string; desc: string }> = {
  Employee: { color: '#4B4ECC', bg: 'rgba(99,102,241,0.08)',  border: 'rgba(99,102,241,0.18)',  desc: 'Log timesheets, apply for leave, view personal data.' },
  Manager:  { color: '#0A8A58', bg: 'rgba(14,168,106,0.08)', border: 'rgba(14,168,106,0.18)', desc: 'Manage team timesheets, approve leave requests.' },
  Admin:    { color: '#7C3AED', bg: 'rgba(124,58,237,0.08)',  border: 'rgba(124,58,237,0.18)',  desc: 'Full system access — users, policies, and config.' },
}

// ─── Employee data shape (View / Edit profile mode) ──────────────────────────

export interface EmployeeData {
  empId?: string
  firstName?: string; lastName?: string; email?: string; phone?: string; dob?: string
  gender?: string; maritalStatus?: string; nationalId?: string
  altEmail?: string; bloodGroup?: string; phoneRes?: string; phoneOffice?: string
  ecName?: string; ecRelation?: string; ecPhone?: string
  presentAddr?: string; permanentAddr?: string
  salPayMode?: string; salAccNo?: string; salBankName?: string; salBranch?: string; salIFSC?: string
  expPayMode?: string; expAccNo?: string; expBankName?: string; expBranch?: string; expIFSC?: string
  panNo?: string; pfNo?: string; uanNo?: string; esiNo?: string; nprNo?: string; pranNo?: string; taxOption?: string
  familyMembers?: FamilyMember[]; educations?: Education[]
  empType?: string; designation?: string; level?: string; department?: string; manager?: string
  officeLocation?: string; workLocation?: string; joinDate?: string; confirmDate?: string
  shift?: string; attendanceRec?: string; deskNumber?: string; jobDesc?: string; role?: string; project?: string
  probationApplicable?: boolean; probDuration?: string; probStart?: string; probEnd?: string; probRemarks?: string
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AddEmployeePage({
  mode = 'create', initialData, initialEdit = false, onBack,
}: {
  mode?: 'create' | 'profile'
  initialData?: EmployeeData
  initialEdit?: boolean
  onBack?: () => void
} = {}) {
  const d = initialData ?? {}
  const isProfile = mode === 'profile'
  const [editing, setEditing] = useState(isProfile ? initialEdit : true)
  const readOnly = isProfile && !editing

  const [empId] = useState<string>(d.empId ?? genId)
  const [activeTab, setActiveTab] = useState<1 | 2>(1)

  // ── Tab 1: Personal Information ──
  const [firstName,    setFirstName]    = useState(d.firstName ?? '')
  const [lastName,     setLastName]     = useState(d.lastName ?? '')
  const [email,        setEmail]        = useState(d.email ?? '')
  const [phone,        setPhone]        = useState(d.phone ?? '')
  const [dob,          setDob]          = useState(d.dob ?? '')
  const [gender,       setGender]       = useState(d.gender ?? '')
  const [maritalStatus,setMaritalStatus]= useState(d.maritalStatus ?? '')
  const [nationalId,   setNationalId]   = useState(d.nationalId ?? '')

  const [altEmail,     setAltEmail]     = useState(d.altEmail ?? '')
  const [bloodGroup,   setBloodGroup]   = useState(d.bloodGroup ?? '')
  const [phoneRes,     setPhoneRes]     = useState(d.phoneRes ?? '')
  const [phoneOffice,  setPhoneOffice]  = useState(d.phoneOffice ?? '')

  const [ecName,       setEcName]       = useState(d.ecName ?? '')
  const [ecRelation,   setEcRelation]   = useState(d.ecRelation ?? '')
  const [ecPhone,      setEcPhone]      = useState(d.ecPhone ?? '')

  const [presentAddr,  setPresentAddr]  = useState(d.presentAddr ?? '')
  const [permanentAddr,setPermanentAddr]= useState(d.permanentAddr ?? '')
  const [sameAddr,     setSameAddr]     = useState(false)

  const [salPayMode,   setSalPayMode]   = useState(d.salPayMode ?? '')
  const [salAccNo,     setSalAccNo]     = useState(d.salAccNo ?? '')
  const [salBankName,  setSalBankName]  = useState(d.salBankName ?? '')
  const [salBranch,    setSalBranch]    = useState(d.salBranch ?? '')
  const [salIFSC,      setSalIFSC]      = useState(d.salIFSC ?? '')
  const [expPayMode,   setExpPayMode]   = useState(d.expPayMode ?? '')
  const [expAccNo,     setExpAccNo]     = useState(d.expAccNo ?? '')
  const [expBankName,  setExpBankName]  = useState(d.expBankName ?? '')
  const [expBranch,    setExpBranch]    = useState(d.expBranch ?? '')
  const [expIFSC,      setExpIFSC]      = useState(d.expIFSC ?? '')

  const [panNo,        setPanNo]        = useState(d.panNo ?? '')
  const [pfNo,         setPfNo]         = useState(d.pfNo ?? '')
  const [uanNo,        setUanNo]        = useState(d.uanNo ?? '')
  const [esiNo,        setEsiNo]        = useState(d.esiNo ?? '')
  const [nprNo,        setNprNo]        = useState(d.nprNo ?? '')
  const [pranNo,       setPranNo]       = useState(d.pranNo ?? '')
  const [taxOption,    setTaxOption]    = useState(d.taxOption ?? '')

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(d.familyMembers ?? [])
  const [showAddFamily,  setShowAddFamily]  = useState(false)
  const [newFam, setNewFam] = useState({ name: '', relation: '', dob: '', isDependent: false })

  const [educations,   setEducations]   = useState<Education[]>(d.educations ?? [])
  const [showAddEdu,   setShowAddEdu]   = useState(false)
  const [newEdu, setNewEdu] = useState({ level: '', institute: '', degree: '', specialization: '', percent: '', from: '', to: '' })

  // ── Tab 2: Company Information ──
  const [empType,      setEmpType]      = useState(d.empType ?? '')
  const [designation,  setDesignation]  = useState(d.designation ?? '')
  const [level,        setLevel]        = useState(d.level ?? '')
  const [department,   setDepartment]   = useState(d.department ?? '')
  const [manager,      setManager]      = useState(d.manager ?? '')
  const [officeLocation,setOfficeLocation] = useState(d.officeLocation ?? '')
  const [workLocation, setWorkLocation] = useState(d.workLocation ?? '')
  const [joinDate,     setJoinDate]     = useState(d.joinDate ?? '')
  const [confirmDate,  setConfirmDate]  = useState(d.confirmDate ?? '')
  const [shift,        setShift]        = useState(d.shift ?? '')
  const [attendanceRec,setAttendanceRec]= useState(d.attendanceRec ?? '')
  const [deskNumber,   setDeskNumber]   = useState(d.deskNumber ?? '')
  const [jobDesc,      setJobDesc]      = useState(d.jobDesc ?? '')
  const [role,         setRole]         = useState(d.role ?? '')
  const [project,      setProject]      = useState(d.project ?? '')
  const [sendEmail,    setSendEmail]    = useState(true)
  const [autoPass,     setAutoPass]     = useState(true)

  // ── Probation Period (Tab 2) ──
  const [probationApplicable, setProbationApplicable] = useState(d.probationApplicable ?? true)
  const [probDuration, setProbDuration] = useState(d.probDuration ?? '6')   // months as string, or 'custom'
  const [probCustom,   setProbCustom]   = useState('')     // custom months
  const [probStart,    setProbStart]    = useState(d.probStart ?? '')
  const [probEnd,      setProbEnd]      = useState(d.probEnd ?? '')
  const [probRemarks,  setProbRemarks]  = useState(d.probRemarks ?? '')
  // manual-override flags — once true, auto-calc stops touching that field
  const [probStartEdited, setProbStartEdited] = useState(false)
  const [probEndEdited,   setProbEndEdited]   = useState(false)
  const [confirmEdited,   setConfirmEdited]   = useState(false)

  // Modals
  const [btnLoading,      setBtnLoading]      = useState(false)
  const [showConfirm,     setShowConfirm]     = useState(false)
  const [confirmLoading,  setConfirmLoading]  = useState(false)
  const [showSuccess,     setShowSuccess]     = useState(false)

  // Upload flow
  const [tab1View,         setTab1View]         = useState<'form' | 'upload'>('form')
  const [uploadFile,       setUploadFile]       = useState<File | null>(null)
  const [isDragOver,       setIsDragOver]       = useState(false)
  const [isUploading,      setIsUploading]      = useState(false)
  const [uploadProgress,   setUploadProgress]   = useState(0)
  const [uploadStep,       setUploadStep]       = useState('')
  const [importedFromExcel,setImportedFromExcel]= useState(false)
  const [importedCount,    setImportedCount]    = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Probation derived values & validation ──
  const durMonths = probDuration === 'custom' ? (parseInt(probCustom) || 0) : parseInt(probDuration)
  const probCustomInvalid = probDuration === 'custom' && (durMonths < 1 || durMonths > 24)
  const probStartBeforeJoin = probationApplicable && !!probStart && !!joinDate && probStart < joinDate
  const probEndBeforeStart  = probationApplicable && !!probEnd   && !!probStart && probEnd <= probStart
  const confirmBeforeEnd    = probationApplicable && !!confirmDate && !!probEnd && confirmDate < probEnd
  const probationError = probationApplicable &&
    (durMonths < 1 || probCustomInvalid || probStartBeforeJoin || probEndBeforeStart || confirmBeforeEnd)

  // Smart-default probation based on employee type, then let auto-calc re-run
  function handleEmpTypeChange(v: string) {
    setEmpType(v)
    const applies = !NO_PROBATION_TYPES.includes(v)
    setProbationApplicable(applies)
    setProbStartEdited(false); setProbEndEdited(false); setConfirmEdited(false)
  }

  // Clear all overrides and recompute from joining date + duration
  function resetProbationAuto() {
    setProbStartEdited(false); setProbEndEdited(false); setConfirmEdited(false)
  }

  // Start date mirrors Date of Joining (until overridden)
  useEffect(() => {
    if (probationApplicable && !probStartEdited) setProbStart(joinDate)
  }, [joinDate, probationApplicable, probStartEdited])

  // End date = Start + Duration (until overridden)
  useEffect(() => {
    if (probationApplicable && !probEndEdited) setProbEnd(addMonths(probStart, durMonths))
  }, [probStart, durMonths, probationApplicable, probEndEdited])

  // Confirmation date = probation End (or Joining if no probation), until overridden
  useEffect(() => {
    if (!confirmEdited) setConfirmDate(probationApplicable ? probEnd : joinDate)
  }, [probationApplicable, probEnd, joinDate, confirmEdited])

  // Tab completion
  const tab1Done = !!firstName && !!lastName && !!email && !!phone
  const tab2Done = !!designation && !!department && !!empType && !!joinDate && !!role
  const canSubmit = tab1Done && tab2Done && !probationError

  const roleInfo = role ? ROLE_INFO[role] : null

  function fmtDate(d: string) {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  function addFamilyMember() {
    if (!newFam.name || !newFam.relation) return
    setFamilyMembers(prev => [...prev, { ...newFam, id: crypto.randomUUID() }])
    setNewFam({ name: '', relation: '', dob: '', isDependent: false })
    setShowAddFamily(false)
  }

  function addEducation() {
    if (!newEdu.level || !newEdu.institute) return
    setEducations(prev => [...prev, { ...newEdu, id: crypto.randomUUID() }])
    setNewEdu({ level: '', institute: '', degree: '', specialization: '', percent: '', from: '', to: '' })
    setShowAddEdu(false)
  }

  async function handleAddClick() {
    if (!canSubmit) return
    setBtnLoading(true)
    await new Promise(r => setTimeout(r, 1100))
    setBtnLoading(false)
    setShowConfirm(true)
  }

  async function handleConfirm() {
    setConfirmLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setConfirmLoading(false)
    setShowConfirm(false)
    setShowSuccess(true)
  }

  function applyMockExcelData() {
    setFirstName('Sarah');       setLastName('Johnson')
    setEmail('sarah.johnson@concertidc.com'); setPhone('+91 98765 43210')
    setGender('Female');         setDob('1995-06-12')
    setMaritalStatus('Single');  setNationalId('IND-2024-SJ-0089')
    setAltEmail('sarahjohnson@gmail.com'); setBloodGroup('O+')
    setPhoneRes('+91 22 4567 8901')
    setEcName('Michael Johnson'); setEcRelation('Parent'); setEcPhone('+91 98760 12345')
    setPresentAddr('12 Park Avenue, Sector 14, Navi Mumbai — 400706, Maharashtra, India')
    setImportedFromExcel(true); setImportedCount(14)
  }

  async function handleUploadImport() {
    if (!uploadFile) return
    setIsUploading(true)
    const steps = [
      { text: 'Reading file…',    pct: 22 },
      { text: 'Parsing rows…',    pct: 50 },
      { text: 'Mapping fields…',  pct: 80 },
      { text: 'Filling form…',    pct: 100 },
    ]
    for (const s of steps) {
      setUploadStep(s.text)
      setUploadProgress(s.pct)
      await new Promise(r => setTimeout(r, 680))
    }
    await new Promise(r => setTimeout(r, 500))
    applyMockExcelData()
    setIsUploading(false); setUploadProgress(0); setUploadStep('')
    setUploadFile(null);   setTab1View('form')
  }

  function handleSuccessDone() {
    setShowSuccess(false)
    // reset all
    setFirstName(''); setLastName(''); setEmail(''); setPhone(''); setDob(''); setGender('')
    setMaritalStatus(''); setNationalId(''); setAltEmail(''); setBloodGroup('')
    setPresentAddr(''); setPermanentAddr(''); setSameAddr(false)
    setImportedFromExcel(false); setImportedCount(0); setTab1View('form')
    setSalPayMode(''); setSalAccNo(''); setSalBankName(''); setSalBranch(''); setSalIFSC('')
    setExpPayMode(''); setExpAccNo(''); setExpBankName(''); setExpBranch(''); setExpIFSC('')
    setPanNo(''); setPfNo(''); setUanNo(''); setEsiNo(''); setNprNo(''); setPranNo(''); setTaxOption('')
    setFamilyMembers([]); setEducations([])
    setEmpType(''); setDesignation(''); setLevel(''); setDepartment('')
    setManager(''); setOfficeLocation(''); setWorkLocation('')
    setJoinDate(''); setConfirmDate(''); setShift('')
    setAttendanceRec(''); setDeskNumber(''); setJobDesc('')
    setRole(''); setProject('')
    setProbationApplicable(true); setProbDuration('6'); setProbCustom('')
    setProbStart(''); setProbEnd(''); setProbRemarks('')
    setProbStartEdited(false); setProbEndEdited(false); setConfirmEdited(false)
    setActiveTab(1)
  }

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes empSpin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes empFadeIn  { from{opacity:0;transform:scale(0.96)} to{opacity:1;transform:scale(1)} }
        @keyframes empCheckPop{ 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }
        @keyframes empSlideIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        textarea::-webkit-scrollbar{width:4px} textarea::-webkit-scrollbar-track{background:transparent}
        textarea::-webkit-scrollbar-thumb{background:#D0D3E6;border-radius:4px}
        .emp-fields:disabled { opacity: 1; }
        .emp-fields:disabled input, .emp-fields:disabled select, .emp-fields:disabled textarea {
          background: #F7F8FC !important; color: #3D4266 !important; cursor: not-allowed !important;
        }
        .emp-fields:disabled button { cursor: not-allowed !important; }
      `}</style>

      {/* ── Page header ── */}
      {isProfile ? (
        <div style={{ marginBottom: 20 }}>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2" style={{ marginBottom: 16 }}>
            <button onClick={onBack}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 9, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', flexShrink: 0, transition: 'all 0.14s', outline: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F7F8FC'; e.currentTarget.style.borderColor = '#C8CCE0' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}>
              <ArrowLeft size={14} strokeWidth={2} style={{ color: C.muted }} />
            </button>
            <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
            <button onClick={onBack} style={{ fontSize: 13, fontWeight: 500, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', transition: 'color 0.14s' }}
              onMouseEnter={e => { e.currentTarget.style.color = C.navy }}
              onMouseLeave={e => { e.currentTarget.style.color = C.muted }}>
              All Users
            </button>
            <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{[firstName, lastName].filter(Boolean).join(' ') || 'Employee Profile'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ minWidth: 0 }}>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.navy, letterSpacing: '-0.4px' }}>
                {[firstName, lastName].filter(Boolean).join(' ') || 'Employee Profile'}
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: 13.5, color: '#787878', fontWeight: 500 }}>
                {[designation, empId].filter(Boolean).join('  ·  ')}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  style={{ height: 32, padding: '0 14px', borderRadius: 8, border: 'none', background: C.indigo, color: '#fff', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'DM Sans', system-ui, sans-serif" }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#4F52C4' }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.indigo }}
                >
                  <Pencil size={13} /> Edit
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setEditing(false)}
                    style={{ height: 32, padding: '0 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'DM Sans', system-ui, sans-serif" }}
                  >
                    <X size={13} /> Cancel
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    style={{ height: 32, padding: '0 14px', borderRadius: 8, border: 'none', background: C.indigo, color: '#fff', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'DM Sans', system-ui, sans-serif" }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#4F52C4' }}
                    onMouseLeave={e => { e.currentTarget.style.background = C.indigo }}
                  >
                    <Check size={13} strokeWidth={2.5} /> Save Changes
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.navy, letterSpacing: '-0.4px' }}>Add Employee</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13.5, color: '#787878', fontWeight: 500 }}>
            Complete both tabs to create a new employee account
          </p>
        </div>
      )}

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

        {/* ════ LEFT SIDEBAR ════ */}
        <div style={{ width: 232, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Photo upload */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div
              style={{ width: 86, height: 86, borderRadius: '50%', background: 'rgba(99,102,241,0.08)', border: `2px dashed rgba(99,102,241,0.30)`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.15s, border-color 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.14)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.55)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.30)' }}
            >
              <Camera size={26} strokeWidth={1.6} style={{ color: '#6366F1' }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.navy }}>Profile Photo</p>
              <p style={{ margin: '3px 0 0', fontSize: 11.5, color: C.muted }}>JPG or PNG · max 2 MB</p>
            </div>
          </div>

          {/* Tab Progress */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ margin: '0 0 6px', fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Completion Status</p>
            {[
              { num: 1, label: 'Personal Information', done: tab1Done, required: 'Name, Email & Phone', desc: 'Personal & contact details', accent: C.indigo },
              { num: 2, label: 'Company Information', done: tab2Done, required: 'Role, Dept & Joining', desc: 'Employment, probation & role', accent: C.indigo },
            ].map(tab => {
              const done = !isProfile && tab.done   // profile mode: always show plain numbers, no green
              return (
              <div
                key={tab.num}
                onClick={() => setActiveTab(tab.num as 1 | 2)}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', borderRadius: 10, background: activeTab === tab.num ? `${tab.accent}0d` : C.surface, border: `1px solid ${activeTab === tab.num ? `${tab.accent}30` : C.border}`, cursor: 'pointer', transition: 'all 0.15s' }}
              >
                <div style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, marginTop: 1, background: done ? C.green : activeTab === tab.num ? tab.accent : C.hover, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                  {done
                    ? <Check size={11} color="#fff" strokeWidth={2.5} />
                    : <span style={{ fontSize: 10, fontWeight: 700, color: activeTab === tab.num ? '#fff' : C.muted }}>{tab.num}</span>
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: done ? C.green : C.navy }}>{tab.label}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: C.muted }}>{isProfile ? tab.desc : (tab.done ? '✓ Required fields filled' : `Requires: ${tab.required}`)}</p>
                </div>
              </div>
              )
            })}

            {/* Overall readiness (create only) */}
            {!isProfile && (
            <div style={{ marginTop: 2, padding: '8px 12px', borderRadius: 10, background: canSubmit ? 'rgba(16,185,129,0.08)' : C.surface, border: `1px solid ${canSubmit ? 'rgba(16,185,129,0.20)' : C.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: canSubmit ? C.green : '#CDD0DC', flexShrink: 0 }} />
              <span style={{ fontSize: 11.5, fontWeight: 600, color: canSubmit ? C.green : C.muted }}>
                {canSubmit ? 'Ready to submit' : 'Fill both tabs to submit'}
              </span>
            </div>
            )}
          </div>

          {/* Role preview */}
          {roleInfo && (
            <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '14px 18px' }}>
              <p style={{ margin: '0 0 10px', fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Assigned Role</p>
              <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 11px', borderRadius: 7, fontSize: 12.5, fontWeight: 600, color: roleInfo.color, background: roleInfo.bg, border: `1px solid ${roleInfo.border}` }}>{role}</span>
              <p style={{ margin: '10px 0 0', fontSize: 12, color: C.muted, lineHeight: 1.55 }}>{roleInfo.desc}</p>
            </div>
          )}

          <p style={{ margin: 0, fontSize: 12, color: C.muted, lineHeight: 1.6, padding: '0 2px' }}>
            <span style={{ color: C.red }}>*</span> Required fields must be filled before submission.
          </p>
        </div>

        {/* ════ RIGHT CONTENT ════ */}
        <fieldset className="emp-fields" disabled={readOnly} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0, border: 0, margin: 0, padding: 0 }}>


          {/* ══════════════════════════════════════════════
              TAB 1 — Employee Personal Information
          ══════════════════════════════════════════════ */}
          {activeTab === 1 && (<>

            {/* ══ FORM VIEW ══ */}
            {tab1View === 'form' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, animation: 'empSlideIn 0.2s ease' }}>

              {/* ── Import success banner ── */}
              {importedFromExcel && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.22)', borderRadius: 12 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={14} color={C.green} strokeWidth={2.5} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.green }}>Excel import complete</span>
                    <span style={{ fontSize: 13, color: '#059669', marginLeft: 8 }}>· {importedCount} fields pre-filled from spreadsheet</span>
                  </div>
                  <span style={{ fontSize: 12, color: '#059669', fontWeight: 500, flexShrink: 0 }}>Review and edit any field below</span>
                  <button onClick={() => setImportedFromExcel(false)} style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid rgba(16,185,129,0.25)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.green, flexShrink: 0 }}>
                    <X size={12} />
                  </button>
                </div>
              )}

              {/* ── Upload option banner (create only) ── */}
              {!isProfile && <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', background: 'linear-gradient(135deg, rgba(99,102,241,0.05), rgba(99,102,241,0.09))', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 11, background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileSpreadsheet size={20} color={C.indigo} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: C.navy }}>Have employee data in a spreadsheet?</p>
                  <p style={{ margin: '2px 0 0', fontSize: 12.5, color: C.muted }}>Import all fields automatically from Excel or CSV — skip manual entry entirely</p>
                </div>
                <button
                  onClick={() => setTab1View('upload')}
                  style={{ height: 38, padding: '0 18px', borderRadius: 10, border: '1.5px solid rgba(99,102,241,0.30)', background: '#fff', color: C.indigo, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0, fontFamily: "'DM Sans', system-ui, sans-serif", transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.06)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.50)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.30)' }}
                >
                  <UploadCloud size={14} />
                  Upload Employee Data
                </button>
              </div>

              {/* ── OR divider ── */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, height: 1, background: C.border }} />
                <span style={{ fontSize: 11.5, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>Or fill fields manually below</span>
                <div style={{ flex: 1, height: 1, background: C.border }} />
              </div>
              </>}

              {/* 1. Personal Details */}
              <FormSection icon={<User size={15} color={C.indigo} />} title="Personal Details" subtitle="Core identity and contact information" accent={C.indigo}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px 20px' }}>
                  <FInput label="First Name"    required placeholder="e.g. John"           value={firstName}     onChange={setFirstName} />
                  <FInput label="Last Name"     required placeholder="e.g. Doe"            value={lastName}      onChange={setLastName} />
                  <FSelect label="Gender"       options={['Male', 'Female', 'Other', 'Prefer not to say']} value={gender} onChange={setGender} />
                  <FSelect label="Marital Status" options={['Single', 'Married', 'Divorced', 'Widowed']} value={maritalStatus} onChange={setMaritalStatus} />
                  <FInput label="Date of Birth" placeholder="" value={dob} onChange={setDob} type="date" />
                  <FInput label="National ID"   placeholder="e.g. IND-2024-JD-0042"       value={nationalId}    onChange={setNationalId} />
                  <FInput label="Mobile Number" required placeholder="+91 98765 43210"     value={phone}         onChange={setPhone} type="tel" />
                  <FInput label="Email Address" required placeholder="john@gmail.com" value={email}         onChange={setEmail} type="email" />
                </div>
              </FormSection>

              {/* 2. Additional Contact Details */}
              <FormSection icon={<Phone size={15} color="#14B8A6" />} title="Additional Contact Details" subtitle="Secondary contact and personal info" accent="#14B8A6">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' }}>
                  <FInput  label="Alternate Email"   placeholder="personal@gmail.com"      value={altEmail}    onChange={setAltEmail} type="email" />
                  <FSelect label="Blood Group"       options={['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−']} value={bloodGroup} onChange={setBloodGroup} />
                  <FInput  label="Phone (Residence)" placeholder="+91 22 3456 7890"        value={phoneRes}    onChange={setPhoneRes} type="tel" />
                  <FInput  label="Phone (Office)"    placeholder="+91 22 3456 7890"        value={phoneOffice} onChange={setPhoneOffice} type="tel" />
                </div>
              </FormSection>

              {/* 3. Emergency Contact */}
              <FormSection icon={<Phone size={15} color={C.red} />} title="Emergency Contact" subtitle="Recommended for HR records" accent={C.red}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px 20px' }}>
                  <FInput  label="Contact Name"  placeholder="e.g. Jane Doe"        value={ecName}     onChange={setEcName} />
                  <FSelect label="Relationship"  options={['Parent', 'Spouse', 'Sibling', 'Child', 'Friend', 'Other']} value={ecRelation} onChange={setEcRelation} />
                  <FInput  label="Contact Phone" placeholder="+91 98765 01234"      value={ecPhone}    onChange={setEcPhone} type="tel" />
                </div>
              </FormSection>

              {/* 4. Addresses */}
              <FormSection icon={<MapPin size={15} color={C.amber} />} title="Addresses" accent={C.amber}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <FTextarea label="Present Address" placeholder="42 Elm Street, Andheri West, Mumbai — 400053, Maharashtra" value={presentAddr} onChange={v => { setPresentAddr(v); if (sameAddr) setPermanentAddr(v) }} rows={3} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                      <FieldLabel text="Permanent Address" />
                      <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 12, color: C.muted, fontWeight: 500, userSelect: 'none' }}>
                        <input type="checkbox" checked={sameAddr} onChange={e => { setSameAddr(e.target.checked); if (e.target.checked) setPermanentAddr(presentAddr) }} style={{ accentColor: C.indigo, width: 13, height: 13 }} />
                        Same as present
                      </label>
                    </div>
                    <textarea
                      value={permanentAddr} rows={3}
                      onChange={e => setPermanentAddr(e.target.value)}
                      placeholder="17 Oak Avenue, Baner Road, Pune — 411045, Maharashtra"
                      disabled={sameAddr}
                      style={{ ...inputBase, height: 'auto', padding: '12px 14px', border: `1px solid ${C.border}`, background: sameAddr ? C.hover : '#fff', resize: 'vertical', lineHeight: 1.6, cursor: sameAddr ? 'default' : 'text' } as React.CSSProperties}
                    />
                  </div>
                </div>
              </FormSection>

              {/* 5. Bank Accounts */}
              <FormSection icon={<CreditCard size={15} color="#2563EB" />} title="Bank Accounts" subtitle="Salary and expense account details" accent="#2563EB">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {/* Salary */}
                  <div style={{ background: 'rgba(37,99,235,0.04)', border: `1px solid rgba(37,99,235,0.14)`, borderRadius: 12, padding: '16px 16px 14px' }}>
                    <SubHead label="Salary Account" color="#2563EB" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <FSelect label="Payment Mode" options={['Bank Transfer', 'Cheque', 'Cash']} value={salPayMode} onChange={setSalPayMode} />
                      <FInput  label="Account Number" placeholder="1234 5678 9012 3456" value={salAccNo}   onChange={setSalAccNo} />
                      <FInput  label="Bank Name"       placeholder="e.g. ICICI Bank"     value={salBankName} onChange={setSalBankName} />
                      <FInput  label="Branch Name"     placeholder="e.g. Andheri West"   value={salBranch}  onChange={setSalBranch} />
                      <FInput  label="IFSC / Routing"  placeholder="e.g. ICIC0001234"    value={salIFSC}    onChange={setSalIFSC} />
                    </div>
                  </div>
                  {/* Expense */}
                  <div style={{ background: 'rgba(147,51,234,0.04)', border: `1px solid rgba(147,51,234,0.14)`, borderRadius: 12, padding: '16px 16px 14px' }}>
                    <SubHead label="Expense Account" color="#9333EA" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <FSelect label="Payment Mode" options={['Bank Transfer', 'Cheque', 'Cash']} value={expPayMode} onChange={setExpPayMode} />
                      <FInput  label="Account Number" placeholder="9876 5432 1098 7654" value={expAccNo}    onChange={setExpAccNo} />
                      <FInput  label="Bank Name"       placeholder="e.g. AXIS Bank"       value={expBankName} onChange={setExpBankName} />
                      <FInput  label="Branch Name"     placeholder="e.g. Bandra East"    value={expBranch}  onChange={setExpBranch} />
                      <FInput  label="IFSC / Routing"  placeholder="e.g. UTIB0001234"    value={expIFSC}    onChange={setExpIFSC} />
                    </div>
                  </div>
                </div>
              </FormSection>

              {/* 6. Statutory Details */}
              <FormSection icon={<Shield size={15} color={C.red} />} title="Statutory Details" subtitle="PAN, PF, UAN and compliance numbers" accent={C.red}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px 20px' }}>
                  <FInput  label="PAN Number"   placeholder="ABCDE1234F"        value={panNo}     onChange={setPanNo} />
                  <FInput  label="PF Number"    placeholder="MH/BAN/12345/001"  value={pfNo}      onChange={setPfNo} />
                  <FInput  label="UAN Number"   placeholder="100987654321"      value={uanNo}     onChange={setUanNo} />
                  <FInput  label="ESI Number"   placeholder="—"                 value={esiNo}     onChange={setEsiNo} />
                  <FInput  label="NPR Number"   placeholder="—"                 value={nprNo}     onChange={setNprNo} />
                  <FInput  label="PRAN Number"  placeholder="—"                 value={pranNo}    onChange={setPranNo} />
                  <FSelect label="Tax Option"   options={['New Regime', 'Old Regime']} value={taxOption} onChange={setTaxOption} />
                </div>
              </FormSection>

              {/* 7. Family Details */}
              <FormSection icon={<Users size={15} color="#7C3AED" />} title="Family Details" subtitle="Dependents and family members" accent="#7C3AED">
                {/* Table */}
                {familyMembers.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.2fr 0.8fr 40px', gap: 0, background: C.surface, borderRadius: 10, padding: '9px 14px', marginBottom: 4 }}>
                      {['Name', 'Relation', 'Date of Birth', 'Dependent', ''].map(h => (
                        <span key={h} style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
                      ))}
                    </div>
                    {familyMembers.map(m => (
                      <div key={m.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.2fr 0.8fr 40px', gap: 0, padding: '11px 14px', borderBottom: `1px solid ${C.border}`, alignItems: 'center' }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: C.navy }}>{m.name}</span>
                        <span style={{ fontSize: 13, color: C.muted }}>{m.relation}</span>
                        <span style={{ fontSize: 13, color: C.navy }}>{m.dob ? fmtDate(m.dob) : '—'}</span>
                        <div style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${m.isDependent ? '#7C3AED' : C.border}`, background: m.isDependent ? '#7C3AED' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {m.isDependent && <Check size={10} color="#fff" strokeWidth={3} />}
                        </div>
                        <button onClick={() => setFamilyMembers(prev => prev.filter(x => x.id !== m.id))} style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.08)'; e.currentTarget.style.color = C.red }} onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = C.muted }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Inline add form */}
                {showAddFamily && (
                  <div style={{ background: C.surface, borderRadius: 12, padding: 16, marginBottom: 12, border: `1px solid ${C.border}`, animation: 'empSlideIn 0.15s ease' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                      <FInput   label="Name"         placeholder="e.g. Jane Doe"  value={newFam.name}     onChange={v => setNewFam(f => ({ ...f, name: v }))} />
                      <FSelect  label="Relation"     options={['Spouse', 'Parent', 'Sibling', 'Child', 'Other']} value={newFam.relation} onChange={v => setNewFam(f => ({ ...f, relation: v }))} />
                      <FInput   label="Date of Birth" type="date"                 value={newFam.dob}      onChange={v => setNewFam(f => ({ ...f, dob: v }))} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 13, color: C.navy, fontWeight: 500 }}>
                        <input type="checkbox" checked={newFam.isDependent} onChange={e => setNewFam(f => ({ ...f, isDependent: e.target.checked }))} style={{ accentColor: '#7C3AED', width: 15, height: 15 }} />
                        Mark as Dependent
                      </label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => setShowAddFamily(false)} style={{ height: 34, padding: '0 16px', borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                        <button onClick={addFamilyMember} style={{ height: 34, padding: '0 16px', borderRadius: 8, border: 'none', background: '#7C3AED', color: '#fff', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>Add Member</button>
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={() => setShowAddFamily(true)} disabled={showAddFamily} style={{ display: 'flex', alignItems: 'center', gap: 6, height: 34, padding: '0 16px', borderRadius: 9, border: `1.5px dashed ${C.border}`, background: '#fff', color: C.muted, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#7C3AED'; e.currentTarget.style.color = '#7C3AED' }} onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}>
                    <Plus size={13} /> Add Member
                  </button>
                </div>
              </FormSection>

              {/* 8. Education Qualifications */}
              <FormSection icon={<GraduationCap size={15} color="#0EA5E9" />} title="Education Qualifications" subtitle="Academic background and certifications" accent="#0EA5E9">
                {educations.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1.2fr 0.5fr 0.8fr 0.8fr 36px', background: C.surface, borderRadius: 10, padding: '9px 14px', marginBottom: 4, gap: 0 }}>
                      {['Level', 'Institute', 'Degree', 'Specialization', '%', 'From', 'To', ''].map(h => (
                        <span key={h} style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
                      ))}
                    </div>
                    {educations.map(e => (
                      <div key={e.id} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1.2fr 0.5fr 0.8fr 0.8fr 36px', padding: '11px 14px', borderBottom: `1px solid ${C.border}`, alignItems: 'center', gap: 0 }}>
                        <span style={{ fontSize: 11.5, fontWeight: 600, background: '#EFF6FF', color: '#2563EB', borderRadius: 6, padding: '2px 8px', display: 'inline-block' }}>{e.level}</span>
                        <span style={{ fontSize: 13, color: C.navy }}>{e.institute}</span>
                        <span style={{ fontSize: 13, color: C.navy }}>{e.degree}</span>
                        <span style={{ fontSize: 13, color: C.navy }}>{e.specialization}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{e.percent || '—'}</span>
                        <span style={{ fontSize: 12.5, color: C.muted }}>{e.from}</span>
                        <span style={{ fontSize: 12.5, color: C.muted }}>{e.to}</span>
                        <button onClick={() => setEducations(prev => prev.filter(x => x.id !== e.id))} style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted }} onMouseEnter={ev => { ev.currentTarget.style.background = 'rgba(232,72,85,0.08)'; ev.currentTarget.style.color = C.red }} onMouseLeave={ev => { ev.currentTarget.style.background = '#fff'; ev.currentTarget.style.color = C.muted }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {showAddEdu && (
                  <div style={{ background: C.surface, borderRadius: 12, padding: 16, marginBottom: 12, border: `1px solid ${C.border}`, animation: 'empSlideIn 0.15s ease' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1.5fr', gap: 12, marginBottom: 12 }}>
                      <FSelect label="Level"          options={['Secondary', 'Higher Secondary', 'Graduate', 'Post Graduate', 'Doctorate', 'Diploma', 'Other']} value={newEdu.level} onChange={v => setNewEdu(e => ({ ...e, level: v }))} />
                      <FInput  label="Institute Name" placeholder="State University of Technology"  value={newEdu.institute}      onChange={v => setNewEdu(e => ({ ...e, institute: v }))} />
                      <FInput  label="Degree"         placeholder="e.g. B.Tech"                    value={newEdu.degree}         onChange={v => setNewEdu(e => ({ ...e, degree: v }))} />
                      <FInput  label="Specialization" placeholder="e.g. Information Technology"   value={newEdu.specialization} onChange={v => setNewEdu(e => ({ ...e, specialization: v }))} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '0.6fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
                      <FInput label="Percentage / CGPA" placeholder="82.00" value={newEdu.percent} onChange={v => setNewEdu(e => ({ ...e, percent: v }))} />
                      <FInput label="From (Year)"  placeholder="Jul-2013" value={newEdu.from} onChange={v => setNewEdu(e => ({ ...e, from: v }))} />
                      <FInput label="To (Year)"    placeholder="May-2017" value={newEdu.to}   onChange={v => setNewEdu(e => ({ ...e, to: v }))} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                      <button onClick={() => setShowAddEdu(false)} style={{ height: 34, padding: '0 16px', borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                      <button onClick={addEducation} style={{ height: 34, padding: '0 16px', borderRadius: 8, border: 'none', background: '#0EA5E9', color: '#fff', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>Add Education</button>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={() => setShowAddEdu(true)} disabled={showAddEdu} style={{ display: 'flex', alignItems: 'center', gap: 6, height: 34, padding: '0 16px', borderRadius: 9, border: `1.5px dashed ${C.border}`, background: '#fff', color: C.muted, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#0EA5E9'; e.currentTarget.style.color = '#0EA5E9' }} onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}>
                    <Plus size={13} /> Add Education
                  </button>
                </div>
              </FormSection>

              {/* Tab 1 footer (create only) */}
              {!isProfile && (
              <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '14px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  {!tab1Done && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <AlertCircle size={13} style={{ color: C.amber }} />
                      <span style={{ fontSize: 12.5, color: C.amber, fontWeight: 500 }}>Fill Name, Mobile & Email to continue</span>
                    </div>
                  )}
                  {tab1Done && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Check size={13} style={{ color: C.green }} />
                      <span style={{ fontSize: 12.5, color: C.green, fontWeight: 600 }}>Personal information ready</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setActiveTab(2)}
                  style={{ height: 40, padding: '0 22px', borderRadius: 10, border: 'none', background: C.indigo, color: '#fff', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'DM Sans', system-ui, sans-serif" }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#4F52C4' }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.indigo }}
                >
                  Next: Company Info
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
              )}

            </div>
            )}

            {/* ══ UPLOAD VIEW ══ */}
            {tab1View === 'upload' && (
            <div style={{ animation: 'empSlideIn 0.2s ease' }}>

              {/* Back nav row */}
              <div style={{ marginBottom: 14 }}>
                <button
                  onClick={() => { if (!isUploading) { setTab1View('form'); setUploadFile(null) } }}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', padding: 0, fontSize: 13.5, fontWeight: 600, color: C.muted, cursor: isUploading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif", opacity: isUploading ? 0.4 : 1 }}
                  onMouseEnter={e => { if (!isUploading) e.currentTarget.style.color = C.navy }}
                  onMouseLeave={e => { e.currentTarget.style.color = C.muted }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  Back to Manual Entry
                </button>
              </div>

              {/* Main upload card */}
              <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden' }}>

                {/* Card header */}
                <div style={{ padding: '16px 28px', borderBottom: `1px solid ${C.border}`, background: C.surface, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(99,102,241,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <FileSpreadsheet size={17} color={C.indigo} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.navy }}>Import Employee Data from Excel</p>
                      <p style={{ margin: 0, fontSize: 11.5, color: C.muted }}>Tab 1 · Employee Personal Information</p>
                    </div>
                  </div>
                  <span style={{ padding: '4px 12px', borderRadius: 20, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)', fontSize: 12, fontWeight: 600, color: C.indigo }}>Step 1 of 2</span>
                </div>

                {/* Card body */}
                <div style={{ padding: 28 }}>

                  {!isUploading ? (<>

                    {/* Description block */}
                    <div style={{ textAlign: 'center', marginBottom: 28 }}>
                      <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg, rgba(99,102,241,0.10), rgba(99,102,241,0.18))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <FileSpreadsheet size={28} color={C.indigo} />
                      </div>
                      <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 800, color: C.navy, letterSpacing: '-0.3px' }}>Upload Employee Excel Sheet</h3>
                      <p style={{ margin: 0, fontSize: 13.5, color: C.muted, lineHeight: 1.65, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
                        Upload the employee Excel sheet to automatically fill all personal information fields and reduce manual entry. All matching columns are mapped instantly.
                      </p>
                    </div>

                    {/* Drop zone */}
                    <div
                      onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={e => { e.preventDefault(); setIsDragOver(false); const f = e.dataTransfer.files[0]; if (f) setUploadFile(f) }}
                      onClick={() => { if (!uploadFile) fileInputRef.current?.click() }}
                      style={{
                        border: `2px dashed ${isDragOver ? C.indigo : uploadFile ? C.green : C.border}`,
                        background: isDragOver ? 'rgba(99,102,241,0.04)' : uploadFile ? 'rgba(16,185,129,0.04)' : C.surface,
                        borderRadius: 14, padding: '36px 24px', textAlign: 'center',
                        cursor: uploadFile ? 'default' : 'pointer',
                        transition: 'all 0.18s',
                        marginBottom: 20,
                      }}
                    >
                      {uploadFile ? (
                        // File selected state
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Check size={24} color={C.green} strokeWidth={2.5} />
                          </div>
                          <div>
                            <p style={{ margin: '0 0 3px', fontSize: 14, fontWeight: 700, color: C.navy }}>{uploadFile.name}</p>
                            <p style={{ margin: 0, fontSize: 12.5, color: C.muted }}>{(uploadFile.size / 1024).toFixed(1)} KB · Ready to import</p>
                          </div>
                          <button
                            onClick={e => { e.stopPropagation(); setUploadFile(null) }}
                            style={{ display: 'flex', alignItems: 'center', gap: 5, height: 30, padding: '0 14px', borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif" }}
                          >
                            <X size={12} /> Remove file
                          </button>
                        </div>
                      ) : (
                        // Empty drag-drop state
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 52, height: 52, borderRadius: 14, background: isDragOver ? 'rgba(99,102,241,0.12)' : '#fff', border: `1px solid ${isDragOver ? C.indigo : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                            <UploadCloud size={24} color={isDragOver ? C.indigo : C.muted} />
                          </div>
                          <div>
                            <p style={{ margin: '0 0 3px', fontSize: 14, fontWeight: 700, color: isDragOver ? C.indigo : C.navy }}>
                              {isDragOver ? 'Drop file to upload' : 'Drag & drop your file here'}
                            </p>
                            <p style={{ margin: 0, fontSize: 12.5, color: C.muted }}>or</p>
                          </div>
                          <button
                            onClick={e => { e.stopPropagation(); fileInputRef.current?.click() }}
                            style={{ height: 34, padding: '0 18px', borderRadius: 9, border: `1.5px solid ${C.indigo}`, background: 'rgba(99,102,241,0.06)', color: C.indigo, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif" }}
                          >
                            Browse File
                          </button>
                          <p style={{ margin: 0, fontSize: 12, color: C.muted }}>Supported: <strong>.xlsx</strong> · <strong>.xls</strong> · <strong>.csv</strong> &nbsp;·&nbsp; Max 5 MB</p>
                        </div>
                      )}
                    </div>
                    <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) setUploadFile(f); e.currentTarget.value = '' }} />

                    {/* Footer actions */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button
                          onClick={() => { setTab1View('form'); setUploadFile(null) }}
                          style={{ height: 40, padding: '0 20px', borderRadius: 10, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif" }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleUploadImport}
                          disabled={!uploadFile}
                          style={{ height: 40, padding: '0 24px', borderRadius: 10, border: 'none', background: !uploadFile ? '#E4E6EF' : `linear-gradient(135deg, ${C.indigo}, #818CF8)`, color: !uploadFile ? '#9CA3AF' : '#fff', fontSize: 13.5, fontWeight: 700, cursor: !uploadFile ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'DM Sans', system-ui, sans-serif", transition: 'all 0.15s', boxShadow: uploadFile ? '0 4px 14px rgba(99,102,241,0.30)' : 'none' }}
                          onMouseEnter={e => { if (uploadFile) e.currentTarget.style.transform = 'translateY(-1px)' }}
                          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
                        >
                          <UploadCloud size={15} />
                          Upload &amp; Import
                        </button>
                      </div>
                    </div>

                  </>) : (

                    // ── Progress state ──
                    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                      {/* Spinner */}
                      <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(99,102,241,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.indigo} strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'empSpin 0.8s linear infinite' }}>
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                        </svg>
                      </div>

                      <p style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 700, color: C.navy }}>{uploadStep}</p>
                      <p style={{ margin: '0 0 20px', fontSize: 13, color: C.muted }}>Please wait while we process your file…</p>

                      {/* Progress bar */}
                      <div style={{ width: '100%', maxWidth: 360, height: 8, background: C.surface, borderRadius: 4, margin: '0 auto 10px', overflow: 'hidden', border: `1px solid ${C.border}` }}>
                        <div style={{ height: '100%', background: `linear-gradient(90deg, ${C.indigo}, #818CF8)`, borderRadius: 4, width: `${uploadProgress}%`, transition: 'width 0.45s ease' }} />
                      </div>
                      <p style={{ margin: '0 0 28px', fontSize: 12.5, fontWeight: 600, color: C.indigo }}>{uploadProgress}% complete</p>

                      {/* Step indicators */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
                        {['Read', 'Parse', 'Map', 'Fill'].map((label, i) => {
                          const stepPct = [22, 50, 80, 100][i]
                          const done    = uploadProgress >= stepPct
                          const active  = uploadProgress >= (i === 0 ? 1 : [22,50,80,100][i-1]) && !done
                          return (
                            <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                                <div style={{ width: 28, height: 28, borderRadius: '50%', background: done ? C.green : active ? C.indigo : C.surface, border: `2px solid ${done ? C.green : active ? C.indigo : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                                  {done
                                    ? <Check size={13} color="#fff" strokeWidth={2.5} />
                                    : <span style={{ fontSize: 10, fontWeight: 700, color: active ? '#fff' : C.muted }}>{i + 1}</span>
                                  }
                                </div>
                                <span style={{ fontSize: 10.5, fontWeight: 600, color: done ? C.green : active ? C.indigo : C.muted }}>{label}</span>
                              </div>
                              {i < 3 && <div style={{ width: 48, height: 2, background: done ? C.green : C.border, margin: '0 4px 18px', transition: 'background 0.3s' }} />}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>
            )}

          </>)}

          {/* ══════════════════════════════════════════════
              TAB 2 — Company Information
          ══════════════════════════════════════════════ */}
          {activeTab === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, animation: 'empSlideIn 0.2s ease' }}>

              {/* 1a. Employment Details */}
              <FormSection icon={<Briefcase size={15} color={C.indigo} />} title="Employment Details" subtitle="Job role, department, reporting structure and tenure" accent={C.indigo}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px 20px' }}>
                  <FSelect label="Employee Type"     required options={['Regular', 'Contract', 'Intern', 'Part-time', 'Consultant']} value={empType}      onChange={handleEmpTypeChange} />
                  <FInput  label="Email Address"     required placeholder="john@gmail.com" value={email} onChange={setEmail} type="email" />
                  <FInput  label="Designation"       required placeholder="e.g. UI/UX Designer"    value={designation}  onChange={setDesignation} />
                  <FSelect label="Department"        required options={['Engineering', 'Design', 'QA & Testing', 'DevOps', 'Product', 'IT Operations', 'HR', 'Finance']} value={department} onChange={setDepartment} />
                  <FSelect label="Level"                      options={['Junior', 'Mid-level', 'Senior Executive', 'Lead', 'Manager', 'Director', 'VP']} value={level} onChange={setLevel} />
                  <FSelect label="Reporting Manager"          options={['David Brown', 'Priya Sharma', 'Rohan Mehta', 'Nina Volkov']} value={manager}     onChange={setManager} />
                  <FInput  label="Date of Joining"   required placeholder=""  value={joinDate}     onChange={setJoinDate}    type="date" />
                </div>
                <div style={{ marginTop: 16 }}>
                  <FTextarea label="Job Description" placeholder="Briefly describe the role responsibilities…" value={jobDesc} onChange={setJobDesc} rows={2} />
                </div>
              </FormSection>

              {/* 1a-2. Probation Period */}
              <FormSection icon={<CalendarClock size={15} color={C.amber} />} title="Probation Period" subtitle="Set the probation window that determines the confirmation date" accent={C.amber}>

                {/* Applicable toggle */}
                <FToggle
                  label="Probation Applicable"
                  hint={probationApplicable
                    ? 'Employee serves a probation period before being confirmed'
                    : 'Employee is confirmed from the date of joining — no probation'}
                  checked={probationApplicable}
                  onChange={v => { setProbationApplicable(v); setConfirmEdited(false); if (v) { setProbStartEdited(false); setProbEndEdited(false) } }}
                />

                {probationApplicable ? (
                  <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 18 }}>

                    {/* Status strip */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 15px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.20)', borderRadius: 10 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.amber, flexShrink: 0 }} />
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: '#B45309' }}>Initial Status · On Probation</span>
                      <span style={{ fontSize: 12, color: C.muted, marginLeft: 'auto' }}>
                        Auto-confirms on <strong style={{ color: C.navy, fontWeight: 700 }}>{confirmDate ? fmtDate(confirmDate) : '—'}</strong>
                      </span>
                    </div>

                    {/* Duration — segmented pills */}
                    <div>
                      <FieldLabel text="Probation Duration" required />
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                        {[{ v: '3', l: '3 months' }, { v: '6', l: '6 months' }, { v: '9', l: '9 months' }, { v: '12', l: '12 months' }, { v: 'custom', l: 'Custom' }].map(opt => {
                          const active = probDuration === opt.v
                          return (
                            <button
                              key={opt.v}
                              onClick={() => { setProbDuration(opt.v); setProbEndEdited(false) }}
                              style={{ height: 32, padding: '0 13px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans', system-ui, sans-serif", border: `1.5px solid ${active ? C.indigo : C.border}`, background: active ? 'rgba(99,102,241,0.10)' : '#fff', color: active ? C.indigo : C.muted, transition: 'all 0.15s' }}
                              onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = C.indigo; e.currentTarget.style.color = C.indigo } }}
                              onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted } }}
                            >
                              {opt.l}
                            </button>
                          )
                        })}
                        {probDuration === 'custom' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 2 }}>
                            <input
                              type="number" min={1} max={24} value={probCustom} placeholder="0"
                              onChange={e => { setProbCustom(e.target.value); setProbEndEdited(false) }}
                              style={{ ...inputBase, width: 80, height: 32, textAlign: 'center', fontSize: 12.5, border: `1.5px solid ${probCustomInvalid ? C.red : C.indigo}`, background: '#fff' }}
                            />
                            <span style={{ fontSize: 13, fontWeight: 600, color: C.muted }}>months</span>
                          </div>
                        )}
                      </div>
                      {probCustomInvalid && (
                        <p style={{ margin: '8px 0 0', fontSize: 11.5, color: C.red, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5 }}>
                          <AlertCircle size={12} /> Enter a duration between 1 and 24 months.
                        </p>
                      )}
                    </div>

                    {/* Dates */}
                    <div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px 20px' }}>
                        <FInput label="Probation Start Date" value={probStart}   type="date" onChange={v => { setProbStart(v); setProbStartEdited(true) }} />
                        <FInput label="Probation End Date"   value={probEnd}     type="date" onChange={v => { setProbEnd(v);   setProbEndEdited(true) }} />
                        <FInput label="Confirmation Date"    value={confirmDate} type="date" onChange={v => { setConfirmDate(v); setConfirmEdited(true) }} />
                      </div>

                      {/* helper + reset */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 9, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 11.5, color: C.muted, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Info size={12} /> Start mirrors the joining date; end &amp; confirmation auto-calculate from duration — edit any field to override.
                        </span>
                        {(probStartEdited || probEndEdited || confirmEdited) && (
                          <button onClick={resetProbationAuto} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#B45309', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                            <RotateCcw size={12} /> Reset to auto
                          </button>
                        )}
                      </div>

                      {/* validation messages */}
                      {(probStartBeforeJoin || probEndBeforeStart || confirmBeforeEnd) && (
                        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
                          {[
                            probStartBeforeJoin && 'Probation start cannot be before the date of joining.',
                            probEndBeforeStart  && 'Probation end must be after the start date.',
                            confirmBeforeEnd    && 'Confirmation date cannot be before probation ends.',
                          ].filter(Boolean).map((msg, i) => (
                            <p key={i} style={{ margin: 0, fontSize: 11.5, color: C.red, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5 }}>
                              <AlertCircle size={12} /> {msg}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Timeline preview */}
                    {joinDate && probEnd && !probEndBeforeStart && durMonths > 0 && (
                      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
                        <p style={{ margin: '0 0 16px', fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Probation Timeline</p>
                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                          {/* start node */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flexShrink: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                              <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.indigo }} />
                              <span style={{ fontSize: 12.5, fontWeight: 700, color: C.navy }}>Joins</span>
                            </div>
                            <span style={{ fontSize: 12, color: C.muted, paddingLeft: 17 }}>{fmtDate(probStart || joinDate)}</span>
                          </div>
                          {/* connector */}
                          <div style={{ flex: 1, margin: '5px 14px 0', position: 'relative' }}>
                            <div style={{ height: 3, borderRadius: 2, background: 'linear-gradient(90deg, #6366F1, #F59E0B, #10B981)' }} />
                            <span style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontSize: 11, fontWeight: 700, color: '#B45309', background: '#fff', border: '1px solid rgba(245,158,11,0.30)', borderRadius: 999, padding: '2px 12px' }}>
                              On Probation · {durMonths} {durMonths === 1 ? 'month' : 'months'}
                            </span>
                          </div>
                          {/* end node */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-end', flexShrink: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                              <span style={{ fontSize: 12.5, fontWeight: 700, color: C.green }}>Confirmed</span>
                              <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.green }} />
                            </div>
                            <span style={{ fontSize: 12, color: C.muted, paddingRight: 17 }}>{fmtDate(confirmDate || probEnd)}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Remarks */}
                    <FTextarea label="Remarks (optional)" placeholder="Any notes about probation terms, review checkpoints, etc." value={probRemarks} onChange={setProbRemarks} rows={2} />
                  </div>
                ) : (
                  /* Not applicable */
                  <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.20)', borderRadius: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Check size={17} color={C.green} strokeWidth={2.5} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: C.navy }}>Confirmed from Day One</p>
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: C.muted }}>No probation applies. Confirmation date is set to the date of joining{joinDate ? ` — ${fmtDate(joinDate)}` : ''}.</p>
                    </div>
                    <span style={{ flexShrink: 0, padding: '4px 12px', borderRadius: 7, fontSize: 12, fontWeight: 700, color: '#0A8A58', background: 'rgba(16,168,106,0.10)', border: '1px solid rgba(16,168,106,0.20)' }}>Confirmed</span>
                  </div>
                )}
              </FormSection>

              {/* 1b. Workplace & Schedule */}
              <FormSection icon={<MapPin size={15} color="#0EA5E9" />} title="Workplace & Schedule" subtitle="Location, shift timing and attendance setup" accent="#0EA5E9">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px 20px' }}>
                  <FInput  label="Office Location"      placeholder="e.g. Mumbai"          value={officeLocation} onChange={setOfficeLocation} />
                  <FSelect label="Work Location"         options={['On-site', 'Remote', 'Hybrid']}              value={workLocation}  onChange={setWorkLocation} />
                  <FSelect label="Shift"                 options={['General', 'Morning', 'Evening', 'Night', 'Flexible']} value={shift}    onChange={setShift} />
                  <FSelect label="Attendance Recording"  options={['Mobile + Web', 'Biometric', 'Web Only', 'Manual']}   value={attendanceRec} onChange={setAttendanceRec} />
                  <FInput  label="Desk Number"           placeholder="e.g. D-204"           value={deskNumber}    onChange={setDeskNumber} />
                </div>
              </FormSection>

              {/* 2. Role & Access */}
              <FormSection icon={<Shield size={15} color="#7C3AED" />} title="Role & Access Control" subtitle="System permissions and project assignment" accent="#7C3AED">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px', marginBottom: 18 }}>
                  <FSelect label="System Role" required options={['Employee', 'Manager', 'Admin']} value={role}    onChange={setRole} />
                  <FSelect label="Assign to Project" options={['Concert IDC Platform', 'HR Analytics Dashboard', 'Payroll Automation Suite', 'Mobile Workforce App', '— None —']} value={project} onChange={setProject} />
                </div>
                {!isProfile && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <FToggle label="Send Welcome Email"       hint="Send login credentials to the employee's email address" checked={sendEmail} onChange={setSendEmail} />
                  <FToggle label="Auto-generate Password"   hint="A secure temporary password will be created and emailed" checked={autoPass}  onChange={setAutoPass} />
                </div>
                )}
              </FormSection>

              {/* Documents note (create only) */}
              {!isProfile && (
              <div style={{ background: 'rgba(99,102,241,0.04)', border: `1px dashed rgba(99,102,241,0.25)`, borderRadius: 14, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <BookOpen size={18} style={{ color: C.indigo, flexShrink: 0 }} />
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.navy }}>Documents can be uploaded after account creation</p>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: C.muted }}>Offer letter, ID proof, address proof and other documents can be attached in the employee profile once the account is active.</p>
                </div>
              </div>
              )}

              {/* Tab 2 footer (create only) */}
              {!isProfile && (
              <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '14px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  onClick={() => setActiveTab(1)}
                  style={{ height: 40, padding: '0 20px', borderRadius: 10, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'DM Sans', system-ui, sans-serif" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.muted }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  Back to Personal Info
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {!canSubmit && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <AlertCircle size={13} style={{ color: C.amber }} />
                      <span style={{ fontSize: 12.5, color: C.amber, fontWeight: 500 }}>
                        {!tab1Done ? 'Tab 1 incomplete' : !tab2Done ? 'Fill Designation, Dept, Type, Joining & Role' : 'Resolve probation period dates'}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={handleAddClick}
                    disabled={!canSubmit || btnLoading}
                    style={{ height: 40, padding: '0 24px', borderRadius: 10, border: 'none', background: (!canSubmit || btnLoading) ? '#9CA3AF' : `linear-gradient(135deg, #1C2035, #3D4266)`, color: '#fff', fontSize: 13.5, fontWeight: 700, cursor: (!canSubmit || btnLoading) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'DM Sans', system-ui, sans-serif", transition: 'all 0.15s' }}
                  >
                    {btnLoading ? (
                      <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'empSpin 0.75s linear infinite' }}>
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                        </svg>
                        Processing…
                      </>
                    ) : (
                      <>
                        <Check size={14} strokeWidth={2.5} />
                        Add Employee
                      </>
                    )}
                  </button>
                </div>
              </div>
              )}

            </div>
          )}

        </fieldset>{/* end right content */}
      </div>

      {/* ════ Confirmation Modal ════ */}
      {showConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.55)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }} onClick={e => { if (e.target === e.currentTarget) setShowConfirm(false) }}>
          <div style={{ background: '#fff', borderRadius: 22, width: 540, boxShadow: '0 28px 72px rgba(10,12,28,0.20)', overflow: 'hidden', animation: 'empFadeIn 0.2s ease' }}>
            <div style={{ padding: '22px 28px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.surface }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: 'rgba(28,32,53,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={20} color={C.navy} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.navy }}>Confirm New Employee</p>
                  <p style={{ margin: '2px 0 0', fontSize: 12.5, color: C.muted }}>Review the details before creating the account</p>
                </div>
              </div>
              <span style={{ padding: '5px 14px', borderRadius: 999, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)', fontSize: 12.5, fontWeight: 700, color: C.indigo }}>{empId}</span>
            </div>

            <div style={{ padding: '22px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Name row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: C.surface, borderRadius: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', flexShrink: 0, background: 'rgba(28,32,53,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 700, color: C.navy }}>
                  {(firstName?.[0] ?? '') + (lastName?.[0] ?? '') || '?'}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.navy }}>{[firstName, lastName].filter(Boolean).join(' ') || '—'}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 12.5, color: C.muted }}>{email || '—'}</p>
                </div>
                {role && <span style={{ marginLeft: 'auto', padding: '4px 12px', borderRadius: 7, flexShrink: 0, fontSize: 12.5, fontWeight: 700, color: ROLE_INFO[role]?.color, background: ROLE_INFO[role]?.bg, border: `1px solid ${ROLE_INFO[role]?.border}` }}>{role}</span>}
              </div>
              {/* Key fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                {[
                  { label: 'Designation',    value: designation  || '—' },
                  { label: 'Department',     value: department   || '—' },
                  { label: 'Date of Joining',value: fmtDate(joinDate) },
                  { label: 'Employee Type',  value: empType      || '—' },
                  { label: 'Work Location',  value: workLocation || '—' },
                  { label: 'Probation',      value: probationApplicable ? `${durMonths} mo · confirms ${fmtDate(confirmDate)}` : 'Not applicable' },
                ].map(r => (
                  <div key={r.label} style={{ padding: '11px 14px', background: C.surface, borderRadius: 10 }}>
                    <p style={{ margin: '0 0 3px', fontSize: 10.5, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{r.label}</p>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.navy }}>{r.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: '0 28px 24px', display: 'flex', gap: 10 }}>
              <button onClick={() => setShowConfirm(false)} style={{ flex: 1, height: 44, borderRadius: 11, fontSize: 13.5, fontWeight: 600, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, cursor: 'pointer' }}>Go Back</button>
              <button onClick={handleConfirm} disabled={confirmLoading} style={{ flex: 2, height: 44, borderRadius: 11, fontSize: 13.5, fontWeight: 700, border: 'none', background: confirmLoading ? '#4B4F6E' : C.navy, color: '#fff', cursor: confirmLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s' }}>
                {confirmLoading ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'empSpin 0.75s linear infinite' }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                    Adding Employee…
                  </>
                ) : 'Yes, Add Employee'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════ Success Modal ════ */}
      {showSuccess && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.55)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
          <div style={{ background: '#fff', borderRadius: 22, width: 400, padding: '40px 36px 32px', textAlign: 'center', boxShadow: '0 28px 72px rgba(10,12,28,0.20)', animation: 'empFadeIn 0.2s ease' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(14,168,106,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', animation: 'empCheckPop 0.4s cubic-bezier(.34,1.56,.64,1)' }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#0EA86A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <p style={{ margin: '0 0 8px', fontSize: 21, fontWeight: 800, color: C.navy, letterSpacing: '-0.3px' }}>Employee Added!</p>
            <p style={{ margin: '0 0 6px', fontSize: 13.5, color: C.muted, lineHeight: 1.6 }}>The new employee account has been successfully created.</p>
            <p style={{ margin: '0 0 24px', fontSize: 13, color: '#5A6080', lineHeight: 1.65 }}>
              <strong style={{ color: C.navy }}>{[firstName, lastName].filter(Boolean).join(' ') || 'Employee'}</strong>
              {designation ? ` · ${designation}` : ''}
              {department ? ` · ${department}` : ''}
              {joinDate ? ` · Joining ${fmtDate(joinDate)}` : ''}
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 18px', borderRadius: 999, background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.15)', marginBottom: 28 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.indigo, display: 'inline-block' }} />
              <span style={{ fontSize: 12.5, fontWeight: 700, color: C.indigo }}>{empId}</span>
              {sendEmail && <span style={{ fontSize: 12, color: C.muted }}>· Welcome email sent</span>}
            </div>
            <button onClick={handleSuccessDone} style={{ width: '100%', height: 46, borderRadius: 12, fontSize: 14, fontWeight: 700, border: 'none', background: C.navy, color: '#fff', cursor: 'pointer', transition: 'opacity 0.15s', fontFamily: "'DM Sans', system-ui, sans-serif" }} onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }} onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
