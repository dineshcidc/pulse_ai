import { useState } from 'react'
import {
  Mail, Clock, DollarSign, Users, Shield,
  CalendarDays, CheckCircle2, Bell, BellOff,
  Save, ChevronDown,
} from 'lucide-react'

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', bg: '#F0F2F8', surface: '#F7F8FC' }

/* ── Types ── */
type Recipient = 'employee' | 'manager' | 'hr' | 'finance' | 'admin'

interface NotifItem {
  id: string; name: string; description: string
  recipients: Recipient[]; enabled: boolean
}
interface Category {
  id: string; title: string; icon: React.ElementType
  color: string; bg: string; items: NotifItem[]
}

/* ── Recipient chip config ── */
const RCP: Record<Recipient, { label: string; color: string; bg: string }> = {
  employee: { label: 'Employee', color: '#2563EB', bg: 'rgba(37,99,235,0.08)'  },
  manager:  { label: 'Manager',  color: '#7C3AED', bg: 'rgba(124,58,237,0.08)' },
  hr:       { label: 'HR Admin', color: '#0EA86A', bg: 'rgba(14,168,106,0.08)' },
  finance:  { label: 'Finance',  color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
  admin:    { label: 'Admin',    color: '#E84855', bg: 'rgba(232,72,85,0.08)'  },
}

/* ── Notification data ── */
const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'leave', title: 'Leave Management', icon: CalendarDays,
    color: '#2563EB', bg: 'rgba(37,99,235,0.09)',
    items: [
      { id:'leave-1', name:'Leave Request Submitted',   description:'Notify reporting manager when an employee submits a leave request.',             recipients:['employee','manager'],  enabled:true  },
      { id:'leave-2', name:'Leave Approved',             description:'Notify the employee when their leave request has been approved.',                recipients:['employee'],            enabled:true  },
      { id:'leave-3', name:'Leave Rejected',             description:'Notify the employee with a reason when their leave request is declined.',        recipients:['employee'],            enabled:true  },
      { id:'leave-4', name:'Leave Cancellation',         description:'Notify manager and HR when an employee cancels an approved leave.',               recipients:['manager','hr'],        enabled:false },
      { id:'leave-5', name:'Leave Balance Reminder',     description:'Send a monthly reminder to employees about their remaining leave balance.',       recipients:['employee'],            enabled:true  },
    ],
  },
  {
    id: 'timesheet', title: 'Timesheet & Attendance', icon: Clock,
    color: '#7C3AED', bg: 'rgba(124,58,237,0.09)',
    items: [
      { id:'ts-1', name:'Timesheet Submitted',          description:'Notify manager when a team member submits their weekly timesheet for review.',    recipients:['manager'],             enabled:true  },
      { id:'ts-2', name:'Timesheet Approved',           description:'Notify the employee once their timesheet is reviewed and approved.',               recipients:['employee'],            enabled:true  },
      { id:'ts-3', name:'Timesheet Rejected',           description:'Notify the employee when their timesheet is sent back for correction.',           recipients:['employee'],            enabled:true  },
      { id:'ts-4', name:'Submission Deadline Reminder', description:'Send a reminder 24 hours before the weekly timesheet submission deadline.',       recipients:['employee'],            enabled:true  },
      { id:'ts-5', name:'Late Attendance Alert',        description:'Alert manager and HR when an employee checks in more than 30 minutes late.',      recipients:['manager','hr'],        enabled:false },
      { id:'ts-6', name:'Absent Without Notification',  description:'Alert HR and manager if an employee is absent without any prior leave application.',recipients:['manager','hr'],       enabled:true  },
    ],
  },
  {
    id: 'payroll', title: 'Payroll & Compensation', icon: DollarSign,
    color: '#0EA86A', bg: 'rgba(14,168,106,0.09)',
    items: [
      { id:'pay-1', name:'Payslip Generated',           description:'Notify the employee when their monthly payslip is ready to view and download.',   recipients:['employee'],            enabled:true  },
      { id:'pay-2', name:'Payroll Processed',           description:'Notify finance and HR admin once the monthly payroll run is completed.',           recipients:['hr','finance'],        enabled:true  },
      { id:'pay-3', name:'Salary Revision',             description:'Notify the employee when their salary is revised or updated by HR.',               recipients:['employee','hr'],       enabled:true  },
      { id:'pay-4', name:'Reimbursement Approved',      description:'Notify the employee once their expense reimbursement claim is approved.',           recipients:['employee'],            enabled:false },
    ],
  },
  {
    id: 'hr', title: 'HR & People', icon: Users,
    color: '#F59E0B', bg: 'rgba(245,158,11,0.09)',
    items: [
      { id:'hr-1', name:'New Employee Welcome',          description:'Send a personalised welcome email to a new employee on their first day.',          recipients:['employee'],            enabled:true  },
      { id:'hr-2', name:'Work Anniversary',              description:'Celebrate employee milestones — 1, 3, and 5-year anniversaries.',                  recipients:['employee','manager'],  enabled:true  },
      { id:'hr-3', name:'Birthday Wish',                 description:'Send a birthday greeting to employees on their special day.',                      recipients:['employee'],            enabled:false },
      { id:'hr-4', name:'Probation Period Completion',   description:'Notify HR and the employee when the probation period is ending in 7 days.',        recipients:['employee','hr'],       enabled:true  },
      { id:'hr-5', name:'Document Expiry Alert',         description:'Alert HR when an employee\'s ID, visa, or certification is expiring within 30 days.',recipients:['hr','admin'],         enabled:true  },
    ],
  },
  {
    id: 'system', title: 'System & Security', icon: Shield,
    color: '#E84855', bg: 'rgba(232,72,85,0.09)',
    items: [
      { id:'sys-1', name:'Login from New Device',        description:'Alert the user when their account is accessed from an unrecognised device.',       recipients:['employee'],            enabled:true  },
      { id:'sys-2', name:'Password Changed',             description:'Confirm to the user when their account password is successfully changed.',          recipients:['employee'],            enabled:true  },
      { id:'sys-3', name:'Account Locked',               description:'Notify the user and admin when an account is locked due to too many failed attempts.',recipients:['employee','admin'],   enabled:true  },
      { id:'sys-4', name:'Weekly System Report',         description:'Send a summary of system activity, logins, and errors to the admin every Monday.',  recipients:['admin'],               enabled:false },
    ],
  },
]

/* ── Toggle component ── */
function Toggle({ on, onChange, disabled }: { on: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button onClick={disabled ? undefined : onChange} style={{
      width: 40, height: 22, borderRadius: 99, border: 'none', flexShrink: 0,
      background: on ? (disabled ? '#9CA3AF' : C.navy) : '#D8DBE8',
      cursor: disabled ? 'default' : 'pointer', position: 'relative', transition: 'background 0.2s',
      opacity: disabled ? 0.5 : 1,
    }}>
      <div style={{
        position: 'absolute', top: 2, width: 18, height: 18, borderRadius: '50%', background: '#fff',
        left: on ? 20 : 2, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
      }} />
    </button>
  )
}

/* ── Recipient chip ── */
function RcpChip({ type }: { type: Recipient }) {
  const cfg = RCP[type]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', height: 20, padding: '0 8px',
      borderRadius: 99, fontSize: 10.5, fontWeight: 700,
      color: cfg.color, background: cfg.bg,
    }}>
      {cfg.label}
    </span>
  )
}

/* ── Section card ── */
function CategoryCard({ cat, globalOff, onToggleItem, onToggleAll }: {
  cat: Category; globalOff: boolean
  onToggleItem: (itemId: string) => void
  onToggleAll: (catId: string, val: boolean) => void
}) {
  const [open, setOpen] = useState(true)
  const { icon: Icon } = cat
  const activeCount = cat.items.filter(i => i.enabled).length
  const allOn  = activeCount === cat.items.length
  const allOff = activeCount === 0

  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>

      {/* Category header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '15px 22px', background: open ? C.surface : '#fff',
        borderBottom: open ? `1px solid ${C.border}` : 'none',
        cursor: 'pointer', transition: 'background 0.15s',
      }} onClick={() => setOpen(v => !v)}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={16} style={{ color: cat.color }} strokeWidth={1.8} />
          </div>
          <div>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{cat.title}</span>
            <span style={{ fontSize: 12, color: C.muted, marginLeft: 10 }}>
              {activeCount} of {cat.items.length} active
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} onClick={e => e.stopPropagation()}>
          {/* Enable / Disable all */}
          <button onClick={() => onToggleAll(cat.id, !allOn)} style={{
            fontSize: 12, fontWeight: 600, padding: '4px 11px', borderRadius: 99,
            border: `1px solid ${allOn ? '#DC2626' : '#0EA86A'}30`,
            background: allOn ? 'rgba(220,38,38,0.06)' : 'rgba(14,168,106,0.06)',
            color: allOn ? '#DC2626' : '#0EA86A',
            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
          }}>
            {allOn ? 'Disable All' : 'Enable All'}
          </button>
          <ChevronDown size={15} style={{ color: C.muted, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.22s', flexShrink: 0 }} />
        </div>
      </div>

      {/* Notification rows */}
      {open && cat.items.map((item, idx) => (
        <div key={item.id} style={{
          display: 'flex', alignItems: 'center', gap: 16, padding: '16px 22px',
          borderBottom: idx < cat.items.length - 1 ? '1px solid #F0F1F7' : 'none',
          opacity: globalOff ? 0.45 : 1, transition: 'opacity 0.2s',
        }}>
          {/* Dot indicator */}
          <div style={{
            width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
            background: item.enabled && !globalOff ? cat.color : '#D8DBE8',
            transition: 'background 0.2s',
          }} />

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy, marginBottom: 3 }}>{item.name}</div>
            <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 7, lineHeight: 1.5 }}>{item.description}</div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' as const }}>
              {item.recipients.map(r => <RcpChip key={r} type={r} />)}
            </div>
          </div>

          {/* Toggle */}
          <Toggle on={item.enabled} onChange={() => onToggleItem(item.id)} disabled={globalOff} />
        </div>
      ))}
    </div>
  )
}

/* ── Main page ── */
export default function EmailNotificationsPage() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES)
  const [globalOn, setGlobalOn]     = useState(true)
  const [saved, setSaved]           = useState(false)
  const [frequency, setFrequency]   = useState<'immediate' | 'daily' | 'weekly'>('immediate')

  function toggleItem(itemId: string) {
    setCategories(prev => prev.map(cat => ({
      ...cat,
      items: cat.items.map(i => i.id === itemId ? { ...i, enabled: !i.enabled } : i),
    })))
    setSaved(false)
  }

  function toggleAll(catId: string, val: boolean) {
    setCategories(prev => prev.map(cat =>
      cat.id === catId ? { ...cat, items: cat.items.map(i => ({ ...i, enabled: val })) } : cat
    ))
    setSaved(false)
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const totalActive = categories.reduce((s, c) => s + c.items.filter(i => i.enabled).length, 0)
  const totalAll    = categories.reduce((s, c) => s + c.items.length, 0)

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: C.navy, margin: '0 0 4px' }}>Email Notifications</h1>
          <p style={{ fontSize: 13.5, color: C.muted, margin: 0 }}>Control which email alerts are sent to employees, managers, and admins</p>
        </div>
        <button onClick={handleSave} style={{
          display: 'flex', alignItems: 'center', gap: 7,
          height: 38, padding: '0 18px', borderRadius: 10, border: 'none',
          background: saved ? '#0EA86A' : C.navy,
          fontSize: 13, fontWeight: 600, color: '#fff',
          cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s',
          flexShrink: 0,
        }}>
          {saved
            ? <><CheckCircle2 size={14} strokeWidth={2.5} /> Saved!</>
            : <><Save size={14} strokeWidth={2} /> Save Changes</>
          }
        </button>
      </div>

      {/* ── Global settings card ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, marginBottom: 18 }}>

        {/* Master toggle row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: globalOn ? 'rgba(14,168,106,0.10)' : 'rgba(107,114,128,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
              {globalOn
                ? <Bell size={18} style={{ color: '#0EA86A' }} strokeWidth={1.8} />
                : <BellOff size={18} style={{ color: C.muted }} strokeWidth={1.8} />
              }
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>
                All Email Notifications
                <span style={{
                  marginLeft: 10, fontSize: 11.5, fontWeight: 600, padding: '2px 9px', borderRadius: 99,
                  background: globalOn ? 'rgba(14,168,106,0.10)' : 'rgba(107,114,128,0.09)',
                  color: globalOn ? '#0EA86A' : C.muted,
                }}>
                  {globalOn ? `${totalActive} / ${totalAll} active` : 'All paused'}
                </span>
              </div>
              <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>
                {globalOn ? 'Email notifications are currently enabled across all categories.' : 'All email notifications are paused. No emails will be sent until re-enabled.'}
              </div>
            </div>
          </div>
          <Toggle on={globalOn} onChange={() => setGlobalOn(v => !v)} />
        </div>

        {/* Settings row: sender + frequency */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>

          {/* Sender info */}
          <div style={{ padding: '16px 22px', borderRight: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Sender Address</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Mail size={13} style={{ color: C.muted }} strokeWidth={1.8} />
              <span style={{ fontSize: 13.5, fontWeight: 600, color: C.navy }}>noreply@concertidc.com</span>
            </div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>Displayed as "Concert IDC" in inbox</div>
          </div>

          {/* Frequency */}
          <div style={{ padding: '16px 22px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Email Frequency</div>
            <div style={{ display: 'flex', gap: 7 }}>
              {([
                { id: 'immediate', label: 'Immediate' },
                { id: 'daily',     label: 'Daily Digest' },
                { id: 'weekly',    label: 'Weekly' },
              ] as { id: typeof frequency; label: string }[]).map(opt => (
                <button key={opt.id} onClick={() => setFrequency(opt.id)} style={{
                  height: 28, padding: '0 12px', borderRadius: 99,
                  border: `1px solid ${frequency === opt.id ? C.navy : C.border}`,
                  background: frequency === opt.id ? C.navy : '#fff',
                  fontSize: 12, fontWeight: 600,
                  color: frequency === opt.id ? '#fff' : C.muted,
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Category sections ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {categories.map(cat => (
          <CategoryCard
            key={cat.id}
            cat={cat}
            globalOff={!globalOn}
            onToggleItem={toggleItem}
            onToggleAll={toggleAll}
          />
        ))}
      </div>

      {/* Bottom save bar */}
      <div style={{ marginTop: 24, padding: '16px 22px', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, color: C.muted }}>
          <strong style={{ color: C.navy }}>{totalActive}</strong> of {totalAll} notifications enabled
        </span>
        <button onClick={handleSave} style={{
          display: 'flex', alignItems: 'center', gap: 7,
          height: 38, padding: '0 22px', borderRadius: 10, border: 'none',
          background: saved ? '#0EA86A' : C.navy,
          fontSize: 13, fontWeight: 600, color: '#fff',
          cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s',
        }}>
          {saved
            ? <><CheckCircle2 size={14} strokeWidth={2.5} /> Saved!</>
            : <><Save size={14} strokeWidth={2} /> Save Changes</>
          }
        </button>
      </div>

    </div>
  )
}
